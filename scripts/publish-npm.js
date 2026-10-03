/**
 * Helper script to build and publish packages to npm registry
 * Usage:
 *   node scripts/publish-npm.js 01-vn-cccd-parser
 *   node scripts/publish-npm.js --all
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const target = process.argv[2];

if (!target) {
  console.log(`
Usage:
  node scripts/publish-npm.js <folder-name>   # Build and publish single package
  node scripts/publish-npm.js --all           # Build and publish all 50 packages

Example:
  node scripts/publish-npm.js 01-vn-cccd-parser
  `);
  process.exit(0);
}

const rootDir = path.resolve(__dirname, '..');
const packages = target === '--all'
  ? fs.readdirSync(rootDir).filter((d) => /^\d{2}-/.test(d))
  : [target];

const otpArg = process.argv.find((arg) => arg.startsWith('--otp=')) || '';

for (const pkg of packages) {
  if (pkg.startsWith('--otp')) continue;
  const pkgDir = path.join(rootDir, pkg);
  if (!fs.existsSync(pkgDir)) {
    console.error(`❌ Folder not found: ${pkg}`);
    continue;
  }

  console.log(`\n📦 [${pkg}] Building and publishing...`);
  try {
    execSync('npm install && npm run build', { cwd: pkgDir, stdio: 'inherit' });
    const publishCmd = `npm publish --access public ${otpArg}`.trim();
    execSync(publishCmd, { cwd: pkgDir, stdio: 'inherit' });
    console.log(`✅ [${pkg}] Successfully published to npm!`);
  } catch (err) {
    console.error(`❌ [${pkg}] Failed to publish:`, err.message);
  }
}
