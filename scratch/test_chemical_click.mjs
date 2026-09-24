import { spawn } from 'child_process';

async function testTabs() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\temp_chrome',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const targetPage = pages.find(p => p.url.includes('5173')) || pages[0];
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

  await new Promise(resolve => ws.onopen = resolve);
  console.log('Connected to Chrome WebSocket');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION ON CLICK:', JSON.stringify(data.params.exceptionDetails, null, 2));
    }
    if (data.id === 20) {
      console.log('Chemical tab test result:', JSON.stringify(data.result?.result?.value, null, 2));
    }
    if (data.id === 21) {
      console.log('Chemical cards verify result:', JSON.stringify(data.result?.result?.value, null, 2));
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

  // Wait 3 seconds after connect
  await new Promise(r => setTimeout(r, 3000));

  // Click on the Chemical Interventions button
  ws.send(JSON.stringify({
    id: 20,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        // Find the Chemical tab button
        const buttons = Array.from(document.querySelectorAll('button'));
        const chemBtn = buttons.find(b => b.textContent.includes('Chemical') || b.textContent.includes('रासायनिक'));
        if (!chemBtn) return { error: 'Chemical button not found', allButtons: buttons.map(b => b.textContent.trim()) };
        chemBtn.click();
        
        // Wait briefly for react state update
        return {
          clicked: true,
          buttonText: chemBtn.textContent.trim(),
          allButtons: buttons.map(b => b.textContent.trim())
        };
      })()`,
      returnByValue: true
    }
  }));

  // Wait 1 second then check cards
  await new Promise(r => setTimeout(r, 1000));

  ws.send(JSON.stringify({
    id: 21,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const cardTitles = Array.from(document.querySelectorAll('h4')).map(h => h.textContent.trim());
        return {
          cardTitles,
          hasMancozeb: cardTitles.some(t => t.includes('Mancozeb')),
          hasCopper: cardTitles.some(t => t.includes('Copper')),
          hasAzoxystrobin: cardTitles.some(t => t.includes('Azoxystrobin'))
        };
      })()`,
      returnByValue: true
    }
  }));

  await new Promise(r => setTimeout(r, 2000));

  ws.close();
  chrome.kill();
}

testTabs().catch(console.error);
