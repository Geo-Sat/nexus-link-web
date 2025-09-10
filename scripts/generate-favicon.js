import sharp from 'sharp';

// Generate favicon from logo
await sharp('public/logo.png')
  .resize(32, 32)
  .toFile('public/favicon.ico')
  .catch(err => console.error('Error generating favicon:', err));
