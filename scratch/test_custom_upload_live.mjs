import { spawn } from 'child_process';

async function testCustomUpload() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\temp_chrome',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const targetPage = pages.find(p => p.type === 'page') || pages[0];
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

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

  // Poll for app mount
  for (let i = 0; i < 15; i++) {
    const isMounted = await evaluate('!!document.querySelector("canvas")');
    if (isMounted) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('--- App Mounted. Performing Custom Upload Test ---');

  // Generate 400x560 portrait leaf with brown necrosis and yellow chlorosis (Image 14 simulation)
  const uploadResult = await evaluate(`(async () => {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 560;
    const ctx = c.getContext('2d');
    
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 560);
    
    // Leaf body
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(200, 280, 160, 240, 0, 0, Math.PI * 2);
    ctx.fill();

    // Diseased spots (low green dominance)
    // Spot 1: Brown Necrosis at (140, 190)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(140, 190, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Spot 2: Severe Dark Necrosis at (270, 360)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(270, 360, 34, 0, Math.PI * 2);
    ctx.fill();

    // Spot 3: Chlorotic Yellow Halo at (170, 430)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(170, 430, 26, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = c.toDataURL('image/png');
    const input = document.querySelector('input[type="file"]');
    if (!input) return { error: 'No file input' };

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], 'custom_leaf_photo.png', { type: 'image/png' });

    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    return { uploaded: true, naturalW: 400, naturalH: 560, aspect: (560/400).toFixed(2) };
  })()`);
  console.log('Upload Result:', uploadResult);

  console.log('Waiting 3.5s for dynamic lesion detection & scanning pipeline...');
  await new Promise(r => setTimeout(r, 3500));

  // Inspect the canvas dimensions, bounding boxes, aspect ratio
  const inspectorVerification = await evaluate(`(() => {
    const canvas = document.querySelector('canvas');
    const portal = document.querySelector('#diagnosis-portal');
    const diagnosisName = portal?.querySelector('h2')?.innerText;
    const severityBadge = portal?.innerText.includes('Severity');
    const countBadge = portal?.innerText.includes('Active Lesions Identified');

    return {
      diagnosisName,
      severityBadge,
      countBadge,
      canvasW: canvas?.width,
      canvasH: canvas?.height,
      styleW: canvas?.style.width,
      styleH: canvas?.style.height,
      renderedAspect: canvas ? (canvas.height / canvas.width).toFixed(2) : null,
      portalSnippet: portal?.innerText.slice(0, 300)
    };
  })()`);
  console.log('Inspector Verification:', inspectorVerification);

  ws.close();
  chrome.kill();
  process.exit(0);
}

testCustomUpload().catch(console.error);
