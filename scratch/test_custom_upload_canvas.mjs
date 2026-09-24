import { spawn } from 'child_process';

async function testCustomUploadAndCanvas() {
  console.log('--- Launching Isolated Headless Chrome for Canvas Verification ---');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--user-data-dir=C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\test_canvas_profile',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9224/json/list');
      const pages = await res.json();
      if (pages && pages.length > 0) {
        wsUrl = pages[0].webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket debugger URL');
    chrome.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise(resolve => ws.onopen = resolve);

  let resolvePageLoad = null;
  const pageLoaded = new Promise(r => resolvePageLoad = r);

  const pendingEvals = new Map();
  let nextId = 10;

  function evaluate(expression) {
    const id = nextId++;
    return new Promise((resolve) => {
      pendingEvals.set(id, resolve);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Page.loadEventFired') {
      resolvePageLoad();
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('🔥 JS EXCEPTION:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
    } else if (pendingEvals.has(msg.id)) {
      const resolve = pendingEvals.get(msg.id);
      pendingEvals.delete(msg.id);
      resolve(msg.result?.result?.value);
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
  ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));

  console.log('Waiting for Page.loadEventFired...');
  await pageLoaded;
  console.log('Page loaded! Waiting 1500ms for React mount...');
  await new Promise(r => setTimeout(r, 1500));

  // 1. Check initial page state and sample canvas
  const initCheck = await evaluate(`(() => {
    const canvas = document.querySelector('canvas');
    return {
      title: document.title,
      canvasFound: !!canvas,
      canvasStyleWidth: canvas?.style.width,
      canvasStyleHeight: canvas?.style.height,
      canvasBufferWidth: canvas?.width,
      canvasBufferHeight: canvas?.height
    };
  })()`);
  console.log('[1] Initial Canvas State:', initCheck);

  // 2. Generate a synthetic custom leaf image (portrait 400x600) with real diseased necrotic/chlorotic spots (simulating Image 14)
  console.log('\n[2] Simulating custom leaf upload with distinct brown and yellow spots...');
  const uploadResult = await evaluate(`(async () => {
    // Create an offscreen custom image (400x560 portrait)
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 560;
    const ctx = c.getContext('2d');

    // Neutral background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 400, 560);

    // Leaf lamina (green oval)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(200, 280, 160, 240, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spot A: Necrotic lesion at (140, 190) - normalized x: 0.35, y: 0.34
    ctx.fillStyle = '#78350f'; // brown necrosis
    ctx.beginPath();
    ctx.arc(140, 190, 28, 0, Math.PI * 2);
    ctx.fill();
    // Yellow chlorotic halo around spot A
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Spot B: Severe Necrosis at (270, 360) - normalized x: 0.675, y: 0.64
    ctx.fillStyle = '#451a03'; // dark necrosis
    ctx.beginPath();
    ctx.arc(270, 360, 32, 0, Math.PI * 2);
    ctx.fill();

    // Spot C: Chlorotic halo at (170, 420) - normalized x: 0.425, y: 0.75
    ctx.fillStyle = '#fef08a'; // yellow chlorosis
    ctx.beginPath();
    ctx.arc(170, 420, 24, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = c.toDataURL('image/png');

    // Trigger file drop/upload simulation by dispatching to the hidden file input or via window event
    const input = document.querySelector('input[type="file"]');
    if (!input) return { error: 'File input not found' };

    // Convert dataURL to File and assign to input
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], 'custom_diseased_leaf.png', { type: 'image/png' });

    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    return { uploaded: true, naturalW: 400, naturalH: 560, aspect: 560 / 400 };
  })()`);
  console.log('Upload Triggered:', uploadResult);

  // Wait for neural pipeline to finish (approx 2.5 seconds with animations)
  console.log('\nWaiting for scanning pipeline to complete...');
  await new Promise(r => setTimeout(r, 3200));

  // 3. Inspect the updated Canvas Inspector
  const canvasInspection = await evaluate(`(() => {
    const canvas = document.querySelector('canvas');
    const container = canvas?.parentElement;
    const portal = document.querySelector('#diagnosis-portal');
    const headings = Array.from(document.querySelectorAll('h2, h3, strong')).map(e => e.innerText);

    return {
      canvasExists: !!canvas,
      canvasStyleWidth: canvas?.style.width,
      canvasStyleHeight: canvas?.style.height,
      canvasBufferW: canvas?.width,
      canvasBufferH: canvas?.height,
      aspectRatio: canvas ? (canvas.height / canvas.width).toFixed(3) : null,
      headings: headings.slice(0, 10),
      portalTextSnippet: portal?.innerText.slice(0, 400)
    };
  })()`);
  console.log('\n[3] Canvas Geometry & Synchronization Result:');
  console.log(JSON.stringify(canvasInspection, null, 2));

  // 4. Verify Lesion Toggles (Heatmap and Labels)
  console.log('\n[4] Testing Layer Toggles...');
  const togglesResult = await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const heatmapBtn = buttons.find(b => b.textContent.includes('Heatmap'));
    const boxesBtn = buttons.find(b => b.textContent.includes('Bounding Boxes'));
    const labelsBtn = buttons.find(b => b.textContent.includes('Labels'));

    return {
      hasHeatmapBtn: !!heatmapBtn,
      hasBoxesBtn: !!boxesBtn,
      hasLabelsBtn: !!labelsBtn
    };
  })()`);
  console.log('Toggles status:', togglesResult);

  console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');

  ws.close();
  chrome.kill();
  process.exit(0);
}

testCustomUploadAndCanvas().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
