# 🚀 Vietnam Dev-Toolkit Factory

> Bộ sưu tập **50 gói NPM Micro / Utility (Zero & Low Dependency)** giải quyết đúng bài toán thực tế, tối ưu trải nghiệm lập trình viên (Developer Experience), sẵn sàng build và publish lên GitHub & NPM.

[![CI / Build & Test](https://github.com/Llein-Dev/viet-dev-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/Llein-Dev/viet-dev-toolkit/actions)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Playground-emerald?style=flat-square&logo=google-chrome)](https://llein-dev.github.io/viet-dev-toolkit/)
[![GitHub license](https://img.shields.io/github/license/Llein-Dev/viet-dev-toolkit?style=flat-square)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Llein-Dev/viet-dev-toolkit?style=flat-square)](https://github.com/Llein-Dev/viet-dev-toolkit)

---

## 🌐 Live Interactive Playground

Trải nghiệm trực quan ngay trên trình duyệt không cần cài đặt:  
👉 **[https://llein-dev.github.io/viet-dev-toolkit/](https://llein-dev.github.io/viet-dev-toolkit/)**

- **Tab 1:** CCCD / VNeID 12 số & Chip QR Code Parser
- **Tab 2:** VietQR NAPAS247 Generator (54+ Ngân hàng Việt Nam)
- **Tab 3:** Đọc số tiền thành chữ hóa đơn (Hỗ trợ giọng Bắc / Nam, BigInt, hàng nghìn tỷ)

---

## 📊 Thống Kê & Cấu Trúc Dự Án

- **Tổng số package:** 50
- **Ngôn ngữ:** 100% TypeScript
- **Target format:** Dual Build ESM (`.mjs`) & CommonJS (`.cjs`)
- **Type Declarations:** Đầy đủ `.d.ts` & Source Maps

---

## 📑 Danh Sách Chi Tiết 50 Packages

### I. Việt Nam Localization & Business Logic

| # | Thư mục / Tên Package | Mô tả ngắn | Trạng thái |
|---|---|---|:---:|
| **01** | [`vn-cccd-parser`](./01-vn-cccd-parser) | Parse 12-digit Vietnam National Citizen Identity (CCCD/VNeID) number into birth year, century, gender, and birth province. | Ready ✅ |
| **02** | [`vn-tax-id-validator`](./02-vn-tax-id-validator) | Validate and format Vietnam Tax Identification Numbers (Mã số thuế - MST 10 and 13 digits) using official Checksum Modulo-11 algorithm. | Ready ✅ |
| **03** | [`vn-plate-format`](./03-vn-plate-format) | Format, standardize and parse Vietnam vehicle license plates according to Circular 24/2023/TT-BCA. | Ready ✅ |
| **04** | [`vn-currency-words`](./04-vn-currency-words) | Convert numerical amounts to standardized Vietnamese words for banking, invoices, and legal contracts. | Ready ✅ |
| **05** | [`vn-phone-carrier`](./05-vn-phone-carrier) | Detect Vietnamese mobile network operators (Viettel, Vina, Mobi, Vietnamobile, Wintel, I-Telecom) and validate national phone numbers. | Ready ✅ |
| **06** | [`vn-bank-qr-gen`](./06-vn-bank-qr-gen) | Ultra-lightweight generator for VietQR (NAPAS 247) EMVCo payment payloads and quick-link QR URLs. | Ready ✅ |
| **07** | [`vn-slugify-plus`](./07-vn-slugify-plus) | Transform Vietnamese text with diacritics into URL-friendly, SEO-optimized slugs. Cleanly handles đ/Đ, emojis, and symbols. | Ready ✅ |
| **08** | [`vn-address-parser`](./08-vn-address-parser) | Heuristic parser to break down unstructured Vietnamese address strings into Province, District, Ward, and Street parts. | Ready ✅ |
| **09** | [`vn-zalo-oa-helper`](./09-vn-zalo-oa-helper) | Lightweight helper for Zalo Official Account (OA) and ZNS (Zalo Notification Service) payload formatting and signature verification. | Ready ✅ |
| **10** | [`vn-workday-calc`](./10-vn-workday-calc) | Calculate working days in Vietnam excluding weekends and official public holidays (Tet, Hung Kings, National Day, etc.). | Ready ✅ |

### II. AI, LLM & Prompt Engineering Helpers

| # | Thư mục / Tên Package | Mô tả ngắn | Trạng thái |
|---|---|---|:---:|
| **11** | [`prompt-template-mini`](./11-prompt-template-mini) | Zero-dependency mini template engine for LLM prompts supporting variable interpolation, default values, and conditional blocks. | Ready ✅ |
| **12** | [`token-estimator-fast`](./12-token-estimator-fast) | Fast, lightweight token count estimator for OpenAI, Anthropic, Gemini, and DeepSeek text without loading heavy 50MB WASM files. | Ready ✅ |
| **13** | [`json-repair-stream`](./13-json-repair-stream) | Repair malformed, cut-off, or truncated JSON responses streaming from LLMs back into valid parseable JSON objects. | Ready ✅ |
| **14** | [`llm-cost-calculator`](./14-llm-cost-calculator) | Calculate USD API expenses based on input and output tokens across OpenAI, Anthropic, Gemini, and DeepSeek models. | Ready ✅ |
| **15** | [`markdown-to-clean-text`](./15-markdown-to-clean-text) | Strip Markdown formatting, badges, HTML tags, and code syntax into pure sanitized text optimized for RAG ingestion and embeddings. | Ready ✅ |
| **16** | [`rag-chunker-lite`](./16-rag-chunker-lite) | Lightweight recursive text chunker for RAG pipelines with configurable chunk sizes, overlap, and smart boundary splitting. | Ready ✅ |
| **17** | [`ai-refusal-detector`](./17-ai-refusal-detector) | Fast regex and semantic pattern matcher to detect if an LLM refused to fulfill a prompt in English or Vietnamese. | Ready ✅ |
| **18** | [`ollama-fetch-wrapper`](./18-ollama-fetch-wrapper) | Featherweight 1KB client to query local Ollama API instances with full streaming support in Node.js and Browser environments. | Ready ✅ |
| **19** | [`system-prompt-builder`](./19-system-prompt-builder) | Fluent builder pattern to cleanly assemble multi-layered system prompts (Role, Constraints, Context, Schema, Few-Shot examples). | Ready ✅ |
| **20** | [`embeddings-cosine-sim`](./20-embeddings-cosine-sim) | High-performance pure JavaScript/TypeScript calculation of Cosine Similarity, Dot Product, and Top-K search for vector embeddings. | Ready ✅ |

### III. System, Node.js & File Management Utilities

| # | Thư mục / Tên Package | Mô tả ngắn | Trạng thái |
|---|---|---|:---:|
| **21** | [`env-assert-strict`](./21-env-assert-strict) | Strict environment variable validation at startup with colored terminal error reporting and type coercion. | Ready ✅ |
| **22** | [`path-clean-crossplatform`](./22-path-clean-crossplatform) | Zero-dep cross-platform path sanitizer converting Windows backslashes and POSIX slashes into consistent format. | Ready ✅ |
| **23** | [`express-async-catch`](./23-express-async-catch) | Clean async/await wrapper for Express 4.x route handlers avoiding repetitive try-catch blocks. | Ready ✅ |
| **24** | [`multer-disk-filename`](./24-multer-disk-filename) | Generate clean, collision-free disk filenames for Multer file uploads with timestamp, random hex, and slugified original names. | Ready ✅ |
| **25** | [`mime-type-checker`](./25-mime-type-checker) | Detect true MIME types and extensions from file magic bytes buffer, preventing extension spoofing attacks. | Ready ✅ |
| **26** | [`file-size-humanize`](./26-file-size-humanize) | Fast byte formatter converting byte numbers into human-readable strings (KB, MB, GB) with binary (1024) and SI (1000) base support. | Ready ✅ |
| **27** | [`process-lock-file`](./27-process-lock-file) | Simple file-based process locking mechanism preventing concurrent executions of cron jobs and CLI daemon scripts. | Ready ✅ |
| **28** | [`easy-cron-builder`](./28-easy-cron-builder) | Human-friendly phrase to 5-field Cron expression builder ("every 5 minutes", "daily at 09:30", "every monday"). | Ready ✅ |
| **29** | [`json-storage-flat`](./29-json-storage-flat) | Crash-resilient JSON flat-file storage engine with atomic writes and in-memory cache for fast local persistence. | Ready ✅ |
| **30** | [`graceful-shutdown-node`](./30-graceful-shutdown-node) | Safe exit lifecycle manager for Node.js servers, closing DB pools and finishing HTTP requests on SIGTERM / SIGINT. | Ready ✅ |

### IV. Frontend & React / Next.js Micro Components

| # | Thư mục / Tên Package | Mô tả ngắn | Trạng thái |
|---|---|---|:---:|
| **31** | [`react-smart-fallback-img`](./31-react-smart-fallback-img) | React image component with built-in skeleton loading and automatic graceful fallback to placeholder SVG or avatar initials on 404/broken URL. | Ready ✅ |
| **32** | [`react-copy-to-clipboard-hook`](./32-react-copy-to-clipboard-hook) | Lightweight React hook for modern async Clipboard API with copied feedback state and auto-reset timeout. | Ready ✅ |
| **33** | [`tailwind-merge-clsx`](./33-tailwind-merge-clsx) | Zero-bloat utility uniting clsx and lightweight Tailwind class conflict resolution into a single cn() function for Shadcn/UI. | Ready ✅ |
| **34** | [`react-use-debounced-value`](./34-react-use-debounced-value) | Minimalistic React hook to debounce any rapidly changing value like search queries, slider values, or window resize metrics. | Ready ✅ |
| **35** | [`qs-stringify-lite`](./35-qs-stringify-lite) | Ultra-compact (~500 bytes) query string serializer and parser supporting nested objects, arrays, and boolean encoding. | Ready ✅ |
| **36** | [`react-intersection-lazy`](./36-react-intersection-lazy) | Defers rendering or triggers callbacks only when an element enters the browser viewport using native IntersectionObserver. | Ready ✅ |
| **37** | [`canvas-avatar-gen`](./37-canvas-avatar-gen) | Generate high-res initials avatar pictures on deterministically colored pastel backgrounds with pure HTML5 Canvas or SVG data URIs. | Ready ✅ |
| **38** | [`jwt-decode-lite`](./38-jwt-decode-lite) | Ultra-fast, zero-dependency client-side JWT token decoder with automatic expiry verification and payload type casting. | Ready ✅ |
| **39** | [`react-localstorage-sync`](./39-react-localstorage-sync) | React hook that syncs state with browser localStorage and automatically mirrors updates in real-time across multiple open browser tabs. | Ready ✅ |
| **40** | [`keyboard-shortcut-listener`](./40-keyboard-shortcut-listener) | Reliable keyboard shortcut listener and React hook for Cmd+K, Ctrl+S, Escape with automatic suppression inside text input fields. | Ready ✅ |

### V. Computer Vision, IoT & Edge Streaming Helpers

| # | Thư mục / Tên Package | Mô tả ngắn | Trạng thái |
|---|---|---|:---:|
| **41** | [`rtsp-url-builder`](./41-rtsp-url-builder) | Construct standardized RTSP video streaming URLs for major IP camera brands (Hikvision, Dahua, KBVision, Imou, Uniview). | Ready ✅ |
| **42** | [`anpr-plate-cleaner`](./42-anpr-plate-cleaner) | Post-processing text cleaner for License Plate OCR (ANPR) resolving character confusions like 0 vs O, 1 vs I, 8 vs B based on position rules. | Ready ✅ |
| **43** | [`serial-com-buffer-parser`](./43-serial-com-buffer-parser) | Packet framer and buffer parser for Serial/COM/RS232/RS485 data streams using STX (0x02) and ETX (0x03) delimiters. | Ready ✅ |
| **44** | [`bounding-box-scaler`](./44-bounding-box-scaler) | Transform and scale bounding boxes between original video/camera resolution and browser canvas/screen display dimensions. | Ready ✅ |
| **45** | [`mjpeg-stream-reader`](./45-mjpeg-stream-reader) | Micro-client to extract individual JPEG image frames from HTTP multipart/x-mixed-replace MJPEG camera streams. | Ready ✅ |
| **46** | [`modbus-crc16-calc`](./46-modbus-crc16-calc) | High-speed pure JavaScript Modbus RTU CRC16 checksum calculation for industrial IoT and PLC communication packets. | Ready ✅ |
| **47** | [`hex-buffer-utils`](./47-hex-buffer-utils) | Utility for fast zero-allocation conversions between Hex strings, Byte arrays, ASCII, and binary strings. | Ready ✅ |
| **48** | [`webcam-resolution-checker`](./48-webcam-resolution-checker) | Probe and report all supported capture resolutions (4K, 1080p, 720p, 480p) of connected webcams via WebRTC. | Ready ✅ |
| **49** | [`cccd-qr-parser`](./49-cccd-qr-parser) | Parse static QR Code strings printed on Vietnamese chip-based citizen identity cards into standardized citizen profile fields. | Ready ✅ |
| **50** | [`ping-host-fast`](./50-ping-host-fast) | High-speed TCP/Socket port connectivity test to probe online status of LAN IPs, cameras, printers, and microservices. | Ready ✅ |

---

## 🛠️ Hướng Dẫn Phát Triển & Publish Lên NPM

### 1. Cài đặt môi trường trong từng package

```bash
cd 01-vn-cccd-parser
npm install
npm run build
```

### 2. Chạy Test

```bash
npm test
```

### 3. Đăng nhập và Publish lên NPM

```bash
npm login
npm publish --access public
```

---

## 📄 License

MIT © [Your Name](https://github.com)
