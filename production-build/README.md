# The Daily Bread - Windows Production Build

![App Icon](../resources/icon.png)

Professional desktop application for AI-powered video generation using Google Gemini Veo.

---

## 📦 What's This?

This is a **production-ready Windows build** of The Daily Bread application. It's a **standalone package** that includes everything needed to run the app on Windows.

**No Node.js installation required!**

---

## 🚀 Quick Start

### For End Users (Distribution)

1. **Extract** this folder anywhere on your Windows PC
2. **Create API Key File**:
   - Create a file named `.env.local` in this folder
   - Add your Gemini API key:
     ```
     API_KEY=your_gemini_api_key_here
     ```
3. **Install** (Creates shortcuts):
   - Double-click `Install.vbs`
   - Shortcuts will be created on Desktop & Start Menu
4. **Run**:
   - Double-click Desktop shortcut, or
   - Search "The Daily Bread" in Start Menu

---

## 📋 Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: ~1GB free space
- **Internet**: Required (loads dependencies from CDN)
- **API Key**: Valid Gemini API key with billing enabled

---

## 🎯 Features

✅ **Auto-Save** - Videos automatically download to your Downloads folder  
✅ **Persistent History** - Generated videos saved in app (localStorage)  
✅ **Desktop Integration** - Shortcuts in Start Menu & Desktop  
✅ **No Installation** - Just extract and run  
✅ **Offline Assets** - All necessary files included

---

## 📁 Folder Contents

```
production-build/
├── Install.vbs           # Installer (creates shortcuts)
├── Uninstall.vbs         # Uninstaller (removes shortcuts)
├── The Daily Bread.vbs   # Main launcher (no terminal)
├── The Daily Bread.bat   # Launcher with terminal (for debugging)
├── Launch.bat            # Alternative launcher
├── .env.local            # API key configuration (YOU CREATE THIS)
├── README.md             # This file
├── dist/                 # Optimized web assets (~50KB)
├── electron-app/         # Electron main process
├── resources/            # App icon
├── node_modules/         # Electron runtime + dependencies (~740MB)
└── package.json          # App metadata
```

---

## ⚙️ Configuration

### Setting Up API Key

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create `.env.local` file in this folder
3. Add: `API_KEY=your_actual_key_here`
4. Save and close

### Example `.env.local`:
```
API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567
```

---

## 🎮 Usage

### Running the App

**Method 1: After Install**
- Desktop shortcut → Double-click "The Daily Bread"
- Start Menu → Search "The Daily Bread" → Click

**Method 2: Manual**
- Double-click `The Daily Bread.vbs` (clean, no terminal)
- Or double-click `The Daily Bread.bat` (shows terminal for debugging)

### First Time Use

1. Launch the app
2. Dashboard will be empty
3. Click "Create New Video"
4. Enter prompt and generate
5. Video auto-downloads to Downloads folder
6. Video saved in app history

### Managing Videos

- **View History**: Dashboard shows all generated videos
- **Download**: Click download buttons (MP4 or GIF)
- **Extend**: 720p videos can be extended
- **Delete**: Trash icon removes from history
- **Open Folder**: Button opens Downloads folder location

---

## 🐛 Troubleshooting

### App Won't Start

**Issue**: Double-clicking does nothing  
**Solution**:
- Try right-click `.vbs` file → Properties → Unblock
- Or use `The Daily Bread.bat` to see error messages

**Issue**: "API Key Invalid" error  
**Solution**:
- Check `.env.local` exists and contains valid key
- Ensure billing enabled on Google Cloud project
- Format: `API_KEY=your_key` (no quotes, no spaces)

### Videos Not Saving

**Issue**: History empty after restart  
**Solution**:
- Check browser console (F12) for localStorage errors
- Try clearing browser cache (Ctrl+Shift+Delete)
- Videos still in Downloads folder even if history lost

### Performance Issues

**Issue**: App slow or laggy  
**Solution**:
- Close other applications (Electron is memory-intensive)
- Check available RAM (need 4GB+)
- Restart app to clear memory

**Issue**: "White screen" on launch  
**Solution**:
- Check internet connection (CDN dependencies)
- Wait 10-15 seconds for initial load
- Check console for errors (`Ctrl+Shift+I`)

---

## 🔒 Security & Privacy

- **API Keys**: Stored locally in `.env.local` (never shared)
- **Videos**: Saved to your local Downloads folder
- **History**: Stored in browser localStorage (local only)
- **Network**: Only connects to:
  - Google Gemini API (video generation)
  - CDN for React/UI libraries

---

## 📦 Distribution

### Sharing This Build

**To share with others**:
1. **Delete** `.env.local` (don't share your API key!)
2. **Zip** the entire `production-build` folder
3. **Share** the ZIP file
4. **Instruct** recipients to:
   - Extract ZIP
   - Create their own `.env.local`
   - Run `Install.vbs`

**Compressed Size**: ~200-300 MB (ZIP)  
**Extracted Size**: ~744 MB

---

## 🆘 Support

For issues:
1. Check logs in terminal (`The Daily Bread.bat`)
2. Review [main README](../README.md)
3. Open issue on [GitHub](https://github.com/yourusername/thedailybread/issues)

---

## 📄 License

Apache 2.0 - See individual file headers for details

---

<div align="center">
  <p>Windows Production Build • Version 1.0</p>
  <p>Part of The Daily Bread project</p>
</div>
