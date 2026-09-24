import { spawn } from 'child_process';

async function testLandscape() {
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
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(50, 50, 540, 320);

    // Spot at (320, 210)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(290, 180, 60, 60);

    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = canvas.toDataURL(); });
    const result = detectLesionsFromImage(img);
    return {
      w: img.naturalWidth,
      h: img.naturalHeight,
      aspect: result.intrinsicAspect.toFixed(2),
      lesions: result.lesions.map(l => ({ label: l.label, x: l.x, y: l.y, w: l.w, h: l.h }))
    };
  })()`);

  console.log('Landscape test result:', JSON.stringify(res, null, 2));
  ws.close();
  chrome.kill();
  process.exit(0);
}

testLandscape().catch(console.error);
