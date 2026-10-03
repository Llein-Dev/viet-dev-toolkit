/**
 * Helper to push packages to individual GitHub repositories
 * Usage:
 *   node scripts/push-to-github.js <github-username> <target-folder>
 *   node scripts/push-to-github.js <github-username> --all
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const username = process.argv[2];
const target = process.argv[3];

if (!username || !target) {
  console.log(`
Usage:
  node scripts/push-to-github.js <github-username> <folder-name>
  node scripts/push-to-github.js <github-username> --all

Example:
  node scripts/push-to-github.js your-github-username 01-vn-cccd-parser
  `);
  process.exit(0);
}

const rootDir = path.resolve(__dirname, '..');
const packages = target === '--all'
  ? fs.readdirSync(rootDir).filter((d) => /^\d{2}-/.test(d))
  : [target];

for (const pkg of packages) {
  const pkgDir = path.join(rootDir, pkg);
  console.log(`\n🚀 [${pkg}] Setting up separate Git repository...`);

  try {
    const pkgGitDir = path.join(pkgDir, '.git');
    if (!fs.existsSync(pkgGitDir)) {
      execSync('git init -b main', { cwd: pkgDir, stdio: 'inherit' });
      execSync('git add .', { cwd: pkgDir, stdio: 'inherit' });
      execSync(`git commit -m "feat: initial release of ${pkg}"`, { cwd: pkgDir, stdio: 'inherit' });
    }

    const repoUrl = `https://github.com/${username}/${pkg}.git`;
    console.log(`👉 Link remote: ${repoUrl}`);

    try {
      execSync(`git remote add origin ${repoUrl}`, { cwd: pkgDir, stdio: 'ignore' });
    } catch {
      execSync(`git remote set-url origin ${repoUrl}`, { cwd: pkgDir, stdio: 'ignore' });
    }

    console.log(`💡 To push to GitHub, ensure you created repo "${pkg}" on GitHub, then run:`);
    console.log(`   cd ${pkg} && git push -u origin main`);
  } catch (err) {
    console.error(`❌ [${pkg}] Error:`, err.message);
  }
}
