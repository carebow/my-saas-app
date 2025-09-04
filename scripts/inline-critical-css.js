// Critical CSS inlining script for production builds
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const criticalCSS = `
/* Critical CSS - Above the fold styles */
html, body, #root {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Loading spinner */
.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Function to inline critical CSS
function inlineCriticalCSS() {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log('No dist/index.html found. Run build first.');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Insert critical CSS before closing head tag
  const criticalCSSTag = `<style>${criticalCSS}</style>\n  </head>`;
  html = html.replace('</head>', criticalCSSTag);
  
  fs.writeFileSync(indexPath, html);
  console.log('Critical CSS inlined successfully!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  inlineCriticalCSS();
}

export { inlineCriticalCSS };