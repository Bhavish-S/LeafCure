import { spawn } from 'child_process';

async function testLiveBrowser() {
  console.log('--- Launching Isolated Headless Chrome ---');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--user-data-dir=C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\test_live_profile',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
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
        params: { expression, returnByValue: true }
      }));
    });
  }

  let navigated = false;
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Page.loadEventFired' && navigated) {
      resolvePageLoad();
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('🔥 UNCAUGHT JS EXCEPTION:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
    } else if (pendingEvals.has(msg.id)) {
      const resolve = pendingEvals.get(msg.id);
      pendingEvals.delete(msg.id);
      resolve(msg.result?.result?.value);
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
  await new Promise(r => setTimeout(r, 200));
  navigated = true;
  ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));

  console.log('Waiting for Page.loadEventFired...');
  await pageLoaded;
  console.log('Page loaded! Waiting 1500ms for React hydration...');
  await new Promise(r => setTimeout(r, 1500));

  // Test 1: Verify Initial Mount & Layout
  const initialCheck = await evaluate(`(() => {
    const root = document.getElementById('root');
    const title = document.title;
    const navText = document.querySelector('header')?.innerText;
    const uploadZone = !!document.getElementById('upload-zone');
    const diagPortal = !!document.getElementById('diagnosis-portal');
    const scanHistory = !!document.getElementById('scan-history');
    const canvas = !!document.querySelector('canvas');
    return {
      rootMounted: !!root && root.children.length > 0,
      title,
      navText: navText?.slice(0, 100),
      uploadZone,
      diagPortal,
      scanHistory,
      canvas
    };
  })()`);
  console.log('\n[TEST 1] Initial Mount & Layout:', initialCheck);

  // Test 2: Click Chemical Interventions Tab
  console.log('\n[TEST 2] Clicking Chemical Interventions tab...');
  const chemClickResult = await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const chemBtn = buttons.find(b => b.textContent.includes('Chemical'));
    if (!chemBtn) return { error: 'Chemical button not found' };
    chemBtn.click();
    return { clicked: true, text: chemBtn.textContent.trim() };
  })()`);
  console.log('Click result:', chemClickResult);

  await new Promise(r => setTimeout(r, 500));

  // Verify Chemical Cards
  const cardsCheck = await evaluate(`(() => {
    const headings = Array.from(document.querySelectorAll('h4')).map(h => h.textContent.trim());
    return {
      cardCount: headings.length,
      headings,
      hasMancozeb: headings.some(h => h.includes('Mancozeb')),
      hasCopper: headings.some(h => h.includes('Copper Oxychloride')),
      hasAzoxystrobin: headings.some(h => h.includes('Azoxystrobin'))
    };
  })()`);
  console.log('Chemical Cards Verification:', cardsCheck);

  // Test 3: Verify Canvas Inspector & Lesion Tags
  console.log('\n[TEST 3] Verifying Canvas Inspector & Lesions...');
  const canvasCheck = await evaluate(`(() => {
    const canvas = document.querySelector('canvas');
    const inspectorText = document.querySelector('#diagnosis-portal')?.innerText;
    const hasActiveLesionsText = inspectorText?.includes('Active Lesions Identified');
    return {
      canvasExists: !!canvas,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
      hasActiveLesionsText
    };
  })()`);
  console.log('Canvas Inspector Status:', canvasCheck);

  console.log('\n--- ALL BROWSER AUTOMATION TESTS COMPLETED ---');

  ws.close();
  chrome.kill();
  process.exit(0);
}

testLiveBrowser().catch(err => {
  console.error(err);
  process.exit(1);
});
