const WebSocket = require('C:/Users/yuanl/.openclaw/workspace/node_modules/ws');
const fs = require('fs');

const targetId = '1F91780E5CBAE58E0E945BA061009B3C';
const wsUrl = 'ws://127.0.0.1:18800/devtools/page/' + targetId;
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
  console.log('Connected');
  const js = '(function(){var cm=document.querySelector(".cm-content");if(!cm)return;cm.focus();document.execCommand("selectAll");var c=' + JSON.stringify(content) + ';var i=0;function n(){if(i>=c.length)return;var s=Math.min(1000,c.length-i);document.execCommand("insertText",false,c.substring(i,i+s));i+=s;setTimeout(n,5);}n();})();';
  await send('Runtime.evaluate', { expression: js });
  console.log('Injecting...');
  setTimeout(async () => {
    await send('Runtime.evaluate', { expression: 'document.querySelector(".cm-content")?.textContent?.length' });
    console.log('Done, waiting for commit...');
    ws.close();
  }, 20000);
});

ws.on('error', e => console.error(e.message));
ws.on('close', () => console.log('Done'));
