const sharp = require('sharp');

async function resizeIcons() {
  await sharp('public/logo-icon-light.png')
    .resize(192, 192, { fit: 'contain', background: { r: 5, g: 5, b: 5, alpha: 1 } })
    .toFile('public/icon-192.png');
    
  await sharp('public/logo-icon-light.png')
    .resize(512, 512, { fit: 'contain', background: { r: 5, g: 5, b: 5, alpha: 1 } })
    .toFile('public/icon-512.png');
    
  console.log("Icons resized successfully.");
}

resizeIcons().catch(console.error);
