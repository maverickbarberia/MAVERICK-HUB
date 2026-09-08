const sharp = require('sharp');

async function resizeIcons() {
  // Para 192x192: Logo al ~65% (124px) y centrado en fondo negro
  await sharp('public/logo-icon-light.png')
    .resize(124, 124, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 34,
      bottom: 34,
      left: 34,
      right: 34,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    })
    .toFile('public/icon-192.png');
    
  // Para 512x512: Logo al ~65% (332px) y centrado en fondo negro
  await sharp('public/logo-icon-light.png')
    .resize(332, 332, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 90,
      bottom: 90,
      left: 90,
      right: 90,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    })
    .toFile('public/icon-512.png');
    
  console.log("Icons padded and resized successfully.");
}

resizeIcons().catch(console.error);
