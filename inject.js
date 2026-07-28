const WebSocket = require('ws');
const fs = require('fs');

const targetId = '7B2F10C5A5F6E950E44A0BE4111C5C8D';
const wsUrl = `ws://127.0.0.1:18800/devtools/page/${targetId}`;

const content = JSON.parse(fs.readFileSync('C:/Users/yuanl/.openclaw/workspace/hkfootcare/content.json', 'utf-8'));

const ws = new WebSocket(wsUrl);
let msgId = 1;

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = msgId++;
    ws.send(JSON.stringify({ id, method, params }));
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.removeListener('message', handler);
        resolve(msg);
      }
    };
    ws.on('message', handler);
  });
}

ws.on('open', async () => {
  console.log('Connected to CDP');
  
  const js = `
(function() {
  var cm = document.querySelector('.cm-content');
  if (!cm) return 'no cm';
  cm.focus();
  document.execCommand('selectAll');
  var content = ${JSON.stringify(content)};
  var i = 0;
  function typeNext() {
    if (i >= content.length) {
      console.log('Done');
      return;
    }
    var chunkSize = Math.min(1000, content.length - i);
    var chunk = content.substring(i, i + chunkSize);
    document.execCommand('insertText', false, chunk);
    i += chunkSize;
    setTimeout(typeNext, 5);
  }
  typeNext();
})();
`;
  
  await send('Runtime.evaluate', { expression: js });
  console.log('Injection started, waiting...');
  
  await new Promise(resolve => setTimeout(resolve, 20000));
  
  const result = await send('Runtime.evaluate', {
    expression: 'document.querySelector(".cm-content")?.textContent?.length || 0',
    returnByValue: true
  });
  
  console.log('Content length:', result?.result?.value);
  ws.close();
});

ws.on('error', (err) => console.error('Error:', err.message));
ws.on('close', () => console.log('Disconnected'));
