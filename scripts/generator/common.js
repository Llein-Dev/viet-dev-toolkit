const fs = require('fs');
const path = require('path');

function createTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: './dist',
        rootDir: './src'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.ts']
    },
    null,
    2
  );
}

function createPackageJson({ name, description, keywords = [] }) {
  return JSON.stringify(
    {
      name,
      version: '1.0.0',
      description,
      main: './dist/index.cjs',
      module: './dist/index.mjs',
      types: './dist/index.d.ts',
      exports: {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.mjs',
          require: './dist/index.cjs'
        }
      },
      files: ['dist'],
      scripts: {
        build: 'tsup src/index.ts --format cjs,esm --dts --clean',
        dev: 'tsup src/index.ts --format cjs,esm --watch --dts',
        test: 'vitest run',
        prepublishOnly: 'npm run build'
      },
      keywords: [
        'utility',
        'zero-dependency',
        'typescript',
        ...keywords
      ],
      author: '',
      license: 'MIT',
      devDependencies: {
        tsup: '^8.3.5',
        typescript: '^5.7.2',
        vitest: '^2.1.8'
      }
    },
    null,
    2
  );
}

function createReadme({ name, description, category, usageCode, apiList }) {
  return `# ${name}

> ${description}

[![npm version](https://img.shields.io/npm/v/${name}.svg?style=flat-square)](https://www.npmjs.com/package/${name})
[![npm downloads](https://img.shields.io/npm/dm/${name}.svg?style=flat-square)](https://www.npmjs.com/package/${name})
[![bundle size](https://img.shields.io/bundlephobia/minzip/${name}?style=flat-square)](https://bundlephobia.com/package/${name})
[![license](https://img.shields.io/npm/l/${name}.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Zero / Lightweight Dependencies**: Fast, minimal footprint.
- **Dual Export**: Built with \`tsup\` supporting both **ESM** (\`.mjs\`) and **CommonJS** (\`.cjs\`).
- **100% TypeScript**: Strongly typed with full auto-completion and declaration files.
- **Production Ready**: Tested for edge cases and high throughput.

---

## 📦 Installation

\`\`\`bash
# Using npm
npm install ${name}

# Using pnpm
pnpm add ${name}

# Using yarn
yarn add ${name}
\`\`\`

---

## 🚀 Quickstart

\`\`\`typescript
${usageCode}
\`\`\`

---

## 📖 API Reference

${apiList}

---

## 🛠️ Development & Testing

\`\`\`bash
# Install dependencies
npm install

# Build ESM, CJS, and types
npm run build

# Run unit tests
npm test
\`\`\`

---

## 📄 License

MIT © [Your Name](https://github.com)
`;
}

module.exports = {
  createTsConfig,
  createPackageJson,
  createReadme
};
