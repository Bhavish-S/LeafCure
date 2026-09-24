import { spawn } from 'child_process';

async function testFoliageMasking() {
  console.log('=== Testing Foliage Segmentation & Rejection Masks ===');
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

  // Run test in browser context where canvas is native
  const testResults = await evaluate(`(async () => {
    const { detectLesionsFromImage } = await import('/src/utils/lesionDetector.js');

    // Create 500x500 canvas
    const c = document.createElement('canvas');
    c.width = 500;
    c.height = 500;
    const ctx = c.getContext('2d');

    // 1. Background: Wooden desk table surface (Brown R:110, G:70, B:35) across the canvas
    ctx.fillStyle = 'rgb(115, 75, 40)';
    ctx.fillRect(0, 0, 500, 500);

    // 2. Red ripe tomato fruit at bottom (R:220, G:30, B:20), radius 70 at (250, 430)
    ctx.fillStyle = 'rgb(225, 30, 20)';
    ctx.beginPath();
    ctx.arc(250, 430, 65, 0, Math.PI * 2);
    ctx.fill();

    // 3. Green leaf lamina in upper center (from x: 125 to 375, y: 60 to 340)
    // Center at (250, 200), radiusX: 120, radiusY: 130
    ctx.fillStyle = 'rgb(34, 160, 50)';
    ctx.beginPath();
    ctx.ellipse(250, 200, 115, 125, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Real necrotic lesion spots ON the green leaf:
    // Spot 1: Necrotic spot at (210, 160) -> R: 85, G: 70, B: 35
    ctx.fillStyle = 'rgb(85, 70, 35)';
    ctx.beginPath();
    ctx.arc(210, 160, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgb(180, 150, 40)'; // chlorotic halo
    ctx.lineWidth = 6;
    ctx.stroke();

    // Spot 2: Advanced necrosis at (290, 240) -> R: 95, G: 65, B: 30
    ctx.fillStyle = 'rgb(95, 65, 30)';
    ctx.beginPath();
    ctx.arc(290, 240, 20, 0, Math.PI * 2);
    ctx.fill();

    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = c.toDataURL(); });

    const result = detectLesionsFromImage(img);

    // Analyze where the bounding boxes landed
    // Normalized leaf bounds approx: x from 0.25 to 0.75, y from 0.12 to 0.68
    const boxes = result.lesions.map(l => {
      const centerX = l.x + l.w / 2;
      const centerY = l.y + l.h / 2;
      const onTable = (centerX < 0.22 || centerX > 0.78 || centerY < 0.10);
      const onTomato = (centerY > 0.70 && Math.abs(centerX - 0.5) < 0.25);
      const onGreenLeaf = (centerX >= 0.25 && centerX <= 0.75 && centerY >= 0.12 && centerY <= 0.68);
      return {
        label: l.label,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
        centerX: parseFloat(centerX.toFixed(3)),
        centerY: parseFloat(centerY.toFixed(3)),
        onTable,
        onTomato,
        onGreenLeaf
      };
    });

    const anyOnTable = boxes.some(b => b.onTable);
    const anyOnTomato = boxes.some(b => b.onTomato);
    const allOnGreenLeaf = boxes.every(b => b.onGreenLeaf);

    return {
      lesionCount: boxes.length,
      anyOnTable,
      anyOnTomato,
      allOnGreenLeaf,
      boxes
    };
  })()`);

  console.log('\n--- FOLIAGE MASK & REJECTION TEST RESULTS ---');
  console.log(JSON.stringify(testResults, null, 2));

  ws.close();
  chrome.kill();

  if (testResults.anyOnTable) {
    console.error('FAIL: Bounding boxes were placed on the table background!');
    process.exit(1);
  }
  if (testResults.anyOnTomato) {
    console.error('FAIL: Bounding boxes were placed on the tomato fruit!');
    process.exit(1);
  }
  if (!testResults.allOnGreenLeaf) {
    console.error('FAIL: Not all bounding boxes were inside the green leaf!');
    process.exit(1);
  }

  console.log('\nSUCCESS! All boxes are strictly inside the green leaf. Table & fruit 100% rejected.');
  process.exit(0);
}

testFoliageMasking().catch(console.error);
