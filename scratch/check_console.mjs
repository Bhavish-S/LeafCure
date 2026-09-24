import { spawn } from 'child_process';

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\temp_chrome',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  console.log('Available pages:', pages.map(p => ({ title: p.title, url: p.url })));

  const targetPage = pages.find(p => p.type === 'page') || pages[0];
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

  await new Promise(resolve => ws.onopen = resolve);
  console.log('Connected to target WebSocket');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('🔥 JS EXCEPTION:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
      if (data.params.exceptionDetails.stackTrace) {
        console.error('Stack:', JSON.stringify(data.params.exceptionDetails.stackTrace, null, 2));
      }
    } else if (data.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE [' + data.params.type + ']:', data.params.args.map(a => a.value || a.description).join(' '));
    } else if (data.id === 10) {
      console.log('Root HTML length:', data.result?.result?.value?.length);
      console.log('Root HTML sample:', data.result?.result?.value?.slice(0, 300));
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
  ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));
  ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Network.responseReceived') {
      console.log('NET RESPONSE:', data.params.response.url, data.params.response.status);
    } else if (data.method === 'Network.loadingFailed') {
      console.error('NET FAILED:', data.params.errorText, data.params.canceled);
    } else if (data.method === 'Runtime.exceptionThrown') {
      console.error('🔥 JS EXCEPTION:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE [' + data.params.type + ']:', data.params.args.map(a => a.value || a.description).join(' '));
    } else if (data.id === 10) {
      console.log('EVAL 10 RESULT:', JSON.stringify(data.result?.result?.value, null, 2));
    }
  };

  // Wait 4 seconds for page modules to load and react to mount
  await new Promise(r => setTimeout(r, 4000));

  let donePromise = new Promise(resolve => {
    const prevOnMessage = ws.onmessage;
    ws.onmessage = (event) => {
      prevOnMessage(event);
      const data = JSON.parse(event.data);
      if (data.id === 10) {
        resolve();
      }
    };
  });

  // Inspect #root element
  ws.send(JSON.stringify({
    id: 10,
    method: 'Runtime.evaluate',
    params: {
      expression: 'document.getElementById("root") ? { htmlLen: document.getElementById("root").innerHTML.length, canvas: !!document.querySelector("canvas"), title: document.title, buttons: Array.from(document.querySelectorAll("button")).map(b => b.textContent.trim()) } : "NO_ROOT"',
      returnByValue: true
    }
  }));

  await donePromise;
  await new Promise(r => setTimeout(r, 500));

  ws.close();
  chrome.kill();
}

run().catch(console.error);
