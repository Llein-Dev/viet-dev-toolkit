const { execSync } = require('child_process');
const path = require('path');

const otpArg = process.argv.slice(2).find(arg => arg.startsWith('--otp=')) || 
               (process.argv[2] && !process.argv[2].startsWith('--') ? `--otp=${process.argv[2]}` : null);

if (!otpArg) {
  console.error('\x1b[31m❌ Vui lòng cung cấp mã OTP 2FA từ app Authenticator:\x1b[0m');
  console.error('👉 Ví dụ: node scripts/publish.js --otp=123456 hoặc npm run publish:all -- --otp=123456\n');
  process.exit(1);
}

const otp = otpArg.replace('--otp=', '').trim();

const PACKAGES = [
  'packages/realtime-number-mask',
  'packages/keyboard-shortcut-listener',
  'packages/vn-phone-carrier',
  'packages/vn-bank-qr-gen',
  'packages/vn-cccd-parser',
  'packages/vn-currency-words',
  'packages/vn-plate-format',
  'packages/anpr-plate-cleaner',
  'packages/vn-tax-id-validator'
];

console.log(`\x1b[36m🚀 Bắt đầu publish ${PACKAGES.length} packages lên npmjs với OTP: ${otp}...\x1b[0m\n`);

const results = [];

for (const pkgPath of PACKAGES) {
  const pkgJson = require(path.resolve(pkgPath, 'package.json'));
  const name = pkgJson.name;
  const version = pkgJson.version;
  console.log(`📦 Đang publish \x1b[33m${name}@${version}\x1b[0m...`);

  try {
    const cmd = `npm publish --access public --otp=${otp}`;
    execSync(cmd, {
      cwd: path.resolve(__dirname, '..', pkgPath),
      stdio: 'inherit'
    });
    console.log(`\x1b[32m✔ Thành công: ${name}@${version}\x1b[0m\n`);
    results.push({ name, version, status: 'SUCCESS' });
  } catch (error) {
    console.error(`\x1b[31m✖ Thất bại: ${name}@${version}\x1b[0m\n`);
    results.push({ name, version, status: 'FAILED', error: error.message });
  }
}

console.log('='.repeat(50));
console.log('BẢNG TỔNG KẾT PUBLISH:');
console.table(results);
