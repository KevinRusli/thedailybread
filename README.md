# The Daily Bread - AI Video Generator

<div align="center">
  <img src="resources/icon.png" alt="The Daily Bread Icon" width="200"/>
  
  <h3>AI-Powered Video Generation for Gospel Sharing</h3>
  <p>Desktop application built with Electron, React, and Google Gemini Veo AI</p>
</div>

---

## 🌟 Features

- **🎬 AI Video Generation** - Create videos using Google's Gemini Veo 3.1 model
- **💾 Persistent Storage** - Videos auto-save to Downloads folder with localStorage history
- **🎨 Multiple Generation Modes**
  - Text-to-Video
  - Image-to-Video (subject reference & style reference)
  - Video editing (extend, reference frames)
- **📊 Dashboard** - Manage your generated video library
- **🖼️ GIF Export** - Convert videos to animated GIFs
- **📥 Auto-Download** - Generated videos automatically save locally
- **🎯 Production Builds** - Ready-to-distribute packages for Windows & Mac

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thedailybread.git
   cd thedailybread
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Gemini API key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Dev server: `http://localhost:3000`
   - Or run as Electron app: See [Electron Development](#electron-development)

---

## 🖥️ Production Builds

Pre-built production packages are available in:

- **Windows**: [`production-build/`](./production-build/) - See [Windows README](./production-build/README.md)
- **Mac**: [`production-build-mac/`](./production-build-mac/) - See [Mac README](./production-build-mac/README.md)

### Distribution

Both builds are **standalone** and include:
- Electron runtime
- Optimized production assets
- All dependencies
- Installation scripts

**No Node.js required** for end users!

---

## 🛠️ Technology Stack

- **Framework**: [Electron](https://www.electronjs.org/) - Desktop application framework
- **Frontend**: [React](https://react.dev/) 19 - UI library
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tooling
- **AI Engine**: [Google Gemini Veo](https://deepmind.google/technologies/veo/) - Video generation
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- **Icons**: [Lucide React](https://lucide.dev/) - Icon library
- **Language**: TypeScript - Type-safe development

---

## 📁 Project Structure

```
thedailybread/
├── components/          # React components
│   ├── ApiKeyDialog.tsx
│   ├── Dashboard.tsx
│   ├── PromptForm.tsx
│   └── VideoResult.tsx
├── services/           # API services
│   └── geminiService.ts
├── electron/           # Electron main process
│   └── main.cjs
├── resources/          # App icon and assets
│   └── icon.png
├── production-build/   # Windows production build
├── production-build-mac/ # Mac production build
├── App.tsx            # Main application component
├── storage.ts         # localStorage & file utilities
├── types.ts           # TypeScript type definitions
└── index.html         # HTML entry point
```

---

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Build production assets
npm run preview    # Preview production build
```

### Electron Development

The app can run as a desktop application:

1. **Development Mode** (with hot reload):
   ```bash
   cd production-build
   # Windows: Double-click The Daily Bread.bat
   # Mac: ./TheDailyBread.command
   ```

2. **Build for Distribution**:
   - Production builds are pre-configured in `production-build/` folders
   - See individual README files for distribution instructions

---

## 🎨 Configuration

### Environment Variables

Create `.env.local` in the root directory:

```env
API_KEY=your_gemini_api_key_here
```

### Video Generation Settings

Configurable in `PromptForm.tsx`:
- **Resolutions**: 720p, 1080p, 4K
- **Aspect Ratios**: 16:9, 9:16, 1:1
- **Duration**: 5-8 seconds
- **Generation Modes**: Text, Image Reference, Style Reference, Video Extension

---

## 📦 Building for Production

### Windows

1. Build web assets:
   ```bash
   npm run build
   ```

2. Update production build:
   ```bash
   xcopy /E /I /Y dist production-build\dist
   ```

3. Distribute `production-build/` folder (as ZIP)

### Mac

1. Build web assets:
   ```bash
   npm run build
   ```

2. Update production build:
   ```bash
   cp -r dist production-build-mac/dist
   ```

3. Distribute `production-build-mac/` folder (as ZIP)

---

## 🐛 Troubleshooting

### Development Issues

**Port 3000 already in use:**
```bash
# Change port in vite.config.ts
server: {
  port: 3001, // or any available port
}
```

**API Key errors:**
- Verify API key in `.env.local`
- Ensure billing is enabled on your Google Cloud project
- Check API key has Gemini API access

### Production Build Issues

**Windows:**
- See [production-build/README.md](./production-build/README.md)

**Mac:**
- See [production-build-mac/README.md](./production-build-mac/README.md)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Apache 2.0 License - see individual file headers for details.

---

## 🙏 Acknowledgments

- **Google DeepMind** - Gemini Veo AI technology
- **Electron** - Cross-platform desktop framework
- **React Team** - UI framework
- **Vite Team** - Lightning-fast build tool

---

## 📞 Support

For issues, questions, or feature requests, please [open an issue](https://github.com/yourusername/thedailybread/issues).

---

<div align="center">
  <p>Built with ❤️ for sharing the Gospel through AI-powered video generation</p>
  <p>
    <a href="#top">Back to top ↑</a>
  </p>
</div>
