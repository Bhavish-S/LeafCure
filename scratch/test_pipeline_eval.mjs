import { spawn } from 'child_process';

async function testPipeline() {
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

  // Poll for mount
  for (let i = 0; i < 15; i++) {
    const mounted = await evaluate('!!document.querySelector("canvas")');
    if (mounted) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Testing dynamic lesion detection on custom 400x600 portrait leaf...');

  // Test dynamic detection directly using the imported module in the app
  const testResult = await evaluate(`(async () => {
    // Dynamically import lesionDetector from the Vite module graph
    const { detectLesionsFromImage } = await import('/src/utils/lesionDetector.js');
    
    // Create 400x600 synthetic image with 3 known necrotic/chlorotic spots:
    // Spot 1: brown necrosis at (140, 180) -> x: 0.35, y: 0.30
    // Spot 2: dark rot necrosis at (260, 360) -> x: 0.65, y: 0.60
    // Spot 3: yellow chlorosis at (170, 480) -> x: 0.425, y: 0.80
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Leaf lamina (green)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(200, 300, 170, 260, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spot 1
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(140, 180, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Spot 2
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(260, 360, 32, 0, Math.PI * 2);
    ctx.fill();

    // Spot 3
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(170, 480, 24, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = canvas.toDataURL('image/png');

    // Load into Image object
    const img = new Image();
    await new Promise((res) => {
      img.onload = res;
      img.src = dataUrl;
    });

    // Run dynamic lesion detection
    const detection = detectLesionsFromImage(img);

    return {
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
      intrinsicAspect: detection.intrinsicAspect,
      affectedAreaPct: detection.affectedAreaPct,
      lesionCount: detection.lesions.length,
      lesions: detection.lesions.map(l => ({
        label: l.label,
        type: l.type,
        color: l.color,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
        score: l.score
      }))
    };
  })()`);

  console.log('\n--- DYNAMIC LESION DETECTION TEST RESULT ---');
  console.log(JSON.stringify(testResult, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

testPipeline().catch(console.error);
