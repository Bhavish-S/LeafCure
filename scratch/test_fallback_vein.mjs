import { spawn } from 'child_process';

async function testFallbackVein() {
  console.log('=== Testing Central Leaf Vein Dynamic Fallback ===');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\temp_chrome',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page') || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => ws.onopen = resolve);

  function evaluate(expr) {
    const id = Math.floor(Math.random() * 100000);
    return new Promise(resolve => {
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  const res = await evaluate(`(async () => {
    const { detectLesionsFromImage } = await import('/src/utils/lesionDetector.js');

    // Create 600x600 canvas with gray desk background and completely healthy green leaf in center
    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 600;
    const ctx = c.getContext('2d');

    // Background gray desk
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, 600, 600);

    // Completely clean green leaf lamina: x from 150 to 450 (span 300), y from 100 to 500 (span 400)
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(300, 300, 150, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = c.toDataURL(); });

    const result = detectLesionsFromImage(img);

    // Leaf bounds: minX: 150/600 = 0.25, maxX: 450/600 = 0.75 (leafW = 0.50)
    // minY: 100/600 = 0.167, maxY: 500/600 = 0.833 (leafH = 0.667)
    // Central vein/blade 35% - 65%:
    // veinX: 0.25 + 0.50 * [0.35, 0.65] = [0.425, 0.575]
    // veinY: 0.167 + 0.667 * [0.35, 0.65] = [0.400, 0.600]

    const boxEvaluations = result.lesions.map(l => {
      const cx = l.x + l.w / 2;
      const cy = l.y + l.h / 2;
      const insideCentralZone = (cx >= 0.35 && cx <= 0.65 && cy >= 0.30 && cy <= 0.70);
      const insideGreenLeaf = (cx >= 0.25 && cx <= 0.75 && cy >= 0.167 && cy <= 0.833);
      return {
        label: l.label,
        centerX: parseFloat(cx.toFixed(3)),
        centerY: parseFloat(cy.toFixed(3)),
        insideCentralZone,
        insideGreenLeaf
      };
    });

    return {
      count: result.lesions.length,
      allInsideGreenLeaf: boxEvaluations.every(b => b.insideGreenLeaf),
      allInsideCentralBladeZone: boxEvaluations.every(b => b.insideCentralZone),
      boxes: boxEvaluations
    };
  })()`);

  console.log('\n--- CLEAN LEAF CENTRAL BLADE FALLBACK RESULT ---');
  console.log(JSON.stringify(res, null, 2));

  ws.close();
  chrome.kill();

  if (!res.allInsideGreenLeaf || !res.allInsideCentralBladeZone) {
    console.error('FAIL: Fallback boxes not within central leaf blade!');
    process.exit(1);
  }

  console.log('\nSUCCESS! Fallback boxes strictly placed along central leaf blade within green region.');
  process.exit(0);
}

testFallbackVein().catch(console.error);
