const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkgs = [
  { dir: 'realtime-number-mask', name: '@llein/realtime-number-mask', ver: '1.0.2' },
  { dir: 'keyboard-shortcut-listener', name: '@llein/keyboard-shortcut-listener', ver: '1.0.2' },
  { dir: 'vn-phone-carrier', name: '@llein/vn-phone-carrier', ver: '1.0.1' },
  { dir: 'vn-bank-qr-gen', name: '@llein/vn-bank-qr-gen', ver: '1.1.1' },
  { dir: 'vn-cccd-parser', name: '@llein/vn-cccd-parser', ver: '1.1.1' },
  { dir: 'vn-currency-words', name: '@llein/vn-currency-words', ver: '1.0.1' },
  { dir: 'vn-plate-format', name: '@llein/vn-plate-format', ver: '1.0.1' },
  { dir: 'anpr-plate-cleaner', name: '@llein/anpr-plate-cleaner', ver: '1.0.1' },
  { dir: 'vn-tax-id-validator', name: '@llein/vn-tax-id-validator', ver: '1.0.1' }
];

pkgs.forEach(p => {
  const pkgPath = path.join(__dirname, '..', 'packages', p.dir, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkgJson.version = p.ver;
  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');

  const readmePath = path.join(__dirname, '..', 'packages', p.dir, 'README.md');
  let readme = fs.readFileSync(readmePath, 'utf8');

  const standardBadges = [
    `[![npm version](https://img.shields.io/npm/v/${p.name}.svg?style=flat-square)](https://www.npmjs.com/package/${p.name})`,
    `[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/${p.name})`,
    `[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%203KB-success.svg?style=flat-square)](https://www.npmjs.com/package/${p.name})`,
    `[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)`
  ].join('\n');

  // Replace old badges block
  readme = readme.replace(/\[!\[npm version\][\s\S]*?\[!\[license\][^\n]*/, standardBadges);
  fs.writeFileSync(readmePath, readme);
  console.log('✅ Updated badges & version for:', p.name, '->', p.ver);
});
