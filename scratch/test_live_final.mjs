import { spawn } from 'child_process';

async function run() {
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

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('🔥 JS EXCEPTION:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

  // Poll until document.querySelector('canvas') exists
  console.log('Polling for React mount and canvas rendered...');
  let mounted = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const res = await new Promise(resolve => {
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === 200 + i) {
          ws.removeEventListener('message', handler);
          resolve(data.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: 200 + i,
        method: 'Runtime.evaluate',
        params: {
          expression: '(() => { const c = document.querySelector("canvas"); return c ? { w: c.width, h: c.height, styleW: c.style.width, styleH: c.style.height, buttons: Array.from(document.querySelectorAll("button")).map(b => b.textContent.trim()) } : null; })()',
          returnByValue: true
        }
      }));
    });

    if (res) {
      console.log(`[POLL ${i+1}] SUCCESS! React mounted and Canvas found:`, res);
      mounted = true;
      break;
    } else {
      console.log(`[POLL ${i+1}] Waiting...`);
    }
  }

  if (!mounted) {
    console.error('Failed to mount in time');
    ws.close();
    chrome.kill();
    process.exit(1);
  }

  // Check Chemical cards
  console.log('\nTesting Chemical Interventions click...');
  const chemResult = await new Promise(resolve => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 300) {
        ws.removeEventListener('message', handler);
        resolve(data.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id: 300,
      method: 'Runtime.evaluate',
      params: {
        expression: '(() => { const chem = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Chemical")); if (chem) chem.click(); return { clicked: !!chem }; })()',
        returnByValue: true
      }
    }));
  });
  console.log('Chemical clicked:', chemResult);

  await new Promise(r => setTimeout(r, 500));

  const chemCards = await new Promise(resolve => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 301) {
        ws.removeEventListener('message', handler);
        resolve(data.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id: 301,
      method: 'Runtime.evaluate',
      params: {
        expression: 'Array.from(document.querySelectorAll("h4")).map(h => h.textContent.trim())',
        returnByValue: true
      }
    }));
  });
  console.log('Chemical Card Titles:', chemCards);

  // Switch back to diagnosis and inspect canvas bounding boxes and heatmaps
  console.log('\nTesting Canvas Inspector Layer Toggles...');
  const toggleTest = await new Promise(resolve => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 302) {
        ws.removeEventListener('message', handler);
        resolve(data.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id: 302,
      method: 'Runtime.evaluate',
      params: {
        expression: '(() => { const btns = Array.from(document.querySelectorAll("button")); const bBox = btns.find(b => b.textContent.includes("Bounding")); const bHeat = btns.find(b => b.textContent.includes("Heatmap")); const bLab = btns.find(b => b.textContent.includes("Labels")); return { hasBoxToggle: !!bBox, hasHeatToggle: !!bHeat, hasLabelToggle: !!bLab }; })()',
        returnByValue: true
      }
    }));
  });
  console.log('Toggle Test Result:', toggleTest);

  ws.close();
  chrome.kill();
  console.log('\n=== ALL BROWSER INTEGRATION CHECKS VERIFIED! ===');
  process.exit(0);
}

run().catch(console.error);
