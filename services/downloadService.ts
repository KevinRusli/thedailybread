
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import JSZip from 'jszip';

export const downloadSourceCode = async () => {
  const zip = new JSZip();

  // Standard Vite Config
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

  // Standard TS Config
  const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "unusedLocals": true,
    "unusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

  const readme = `# The Daily Bread Video App

## Setup Instructions

1.  **Install Dependencies**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Configure API Key**
    Open \`.env.local\` and replace \`YOUR_API_KEY_HERE\` with your Google Cloud Project API key that has the Veo API enabled.

3.  **Run Locally**
    \`\`\`bash
    npm run dev
    \`\`\`

## Requirements
- Node.js 18+
- A Google Cloud Project with billing enabled (for Veo model access)
`;

  // Add synthesized files
  zip.file('vite.config.ts', viteConfig);
  zip.file('tsconfig.json', tsConfig);
  zip.file('README.md', readme);

  // List of files to attempt to fetch from the environment
  const sourceFiles = [
    'index.html',
    'package.json',
    'metadata.json',
    'index.css',
    'index.tsx',
    'App.tsx',
    'types.ts',
    '.env.local',
    'services/geminiService.ts',
    'services/downloadService.ts',
    'components/ApiKeyDialog.tsx',
    'components/Dashboard.tsx',
    'components/icons.tsx',
    'components/LoadingIndicator.tsx',
    'components/PromptForm.tsx',
    'components/VideoResult.tsx'
  ];

  let fetchedCount = 0;

  await Promise.all(sourceFiles.map(async (fileName) => {
    try {
      // In a dev/preview environment, these files are often served from root
      const response = await fetch(`/${fileName}`);
      if (response.ok) {
        const text = await response.text();
        // If file is in subfolder, zip handles it automatically if we pass the path
        zip.file(fileName, text);
        fetchedCount++;
      } else {
        console.warn(`Could not fetch ${fileName}`);
      }
    } catch (e) {
      console.warn(`Error fetching ${fileName}`, e);
    }
  }));

  if (fetchedCount === 0) {
    alert("Unable to fetch source files. This feature is intended for development environments.");
    return;
  }

  // Generate and download
  const blob = await zip.generateAsync({type: 'blob'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'daily-bread-app-source.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
