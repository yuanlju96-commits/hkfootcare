const fs = require('fs');
const html = fs.readFileSync('C:/Users/yuanl/.openclaw/workspace/hkfootcare/flyer.html', 'utf-8');

// Replace local qrcode.png with API-generated QR code
const updated = html.replace(
  'src="qrcode.png"',
  'src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://yuanlju96-commits.github.io/hkfootcare/"'
);

fs.writeFileSync('C:/Users/yuanl/.openclaw/workspace/hkfootcare/flyer.html', updated, 'utf-8');
console.log('Updated flyer.html');
