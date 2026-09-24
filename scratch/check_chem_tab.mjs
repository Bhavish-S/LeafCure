import { spawn } from 'child_process';

async function checkChemicalTab() {
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

  function evalCode(expr) {
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

  // Poll until mounted
  for (let i = 0; i < 15; i++) {
    const ok = await evalCode('!!document.querySelector("canvas")');
    if (ok) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  // Click Chemical Interventions button
  const clickRes = await evalCode(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chemBtn = btns.find(b => b.textContent.includes('Chemical Interventions'));
    if (!chemBtn) return { error: 'Chemical button not found' };
    chemBtn.click();
    return { clicked: true, text: chemBtn.textContent.trim() };
  })()`);
  console.log('Click chemical result:', clickRes);

  await new Promise(r => setTimeout(r, 600));

  const chemTitles = await evalCode(`(() => {
    return Array.from(document.querySelectorAll('h4')).map(h => h.textContent.trim());
  })()`);
  console.log('H4 Titles on Chemical Tab:', chemTitles);

  ws.close();
  chrome.kill();
  process.exit(0);
}

checkChemicalTab().catch(console.error);
