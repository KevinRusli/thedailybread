# The Daily Bread - macOS Production Build

![App Icon](../resources/icon.png)

Professional desktop application for AI-powered video generation using Google Gemini Veo.

---

## 📦 What's This?

This is a **production-ready macOS build** of The Daily Bread application. It's a **standalone package** that includes everything needed to run the app on Mac.

**No Node.js installation required!**

---

## 🚀 Quick Start

### For End Users (Distribution)

1. **Extract** this folder anywhere on your Mac
2. **Create API Key File**:
   ```bash
   echo "API_KEY=your_gemini_api_key_here" > .env.local
   ```
3. **Make scripts executable**:
   ```bash
   chmod +x TheDailyBread.command Install.command
   ```
4. **First Launch** (bypass Gatekeeper):
   - **Right-click** `TheDailyBread.command`
   - Select **"Open"** (don't double-click!)
   - Click **"Open"** in security dialog
5. **Optional Install**:
   - Run `./Install.command` for easier access

---

## 📋 Requirements

- **OS**: macOS 10.13 (High Sierra) or later
- **Architecture**: Intel or Apple Silicon (Universal)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: ~500MB free space
- **Internet**: Required (loads dependencies from CDN)
- **API Key**: Valid Gemini API key with billing enabled

---

## 🎯 Features

✅ **Auto-Save** - Videos automatically download to Downloads folder  
✅ **Persistent History** - Generated videos saved in app (localStorage)  
✅ **Universal Binary** - Works on Intel & Apple Silicon Macs  
✅ **No Installation** - Just extract and run  
✅ **Offline Assets** - All necessary files included

---

## 📁 Folder Contents

```
production-build-mac/
├── TheDailyBread.command # Main launcher
├── Install.command        # Setup script
├── .env.local             # API key configuration (YOU CREATE THIS)
├── README.md              # This file
├── dist/                  # Optimized web assets (~50KB)
├── electron-app/          # Electron main process
├── resources/             # App icon
├── node_modules/          # Electron runtime + dependencies (~400MB)
└── package.json           # App metadata
```

---

## ⚙️ Configuration

### Setting Up API Key

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create `.env.local` file:
   ```bash
   echo "API_KEY=your_actual_key_here" > .env.local
   ```

---

## 🎮 Usage

### First Time Launch

**Important**: Must bypass macOS Gatekeeper on first run

1. **Right-click** (⌘+click) `TheDailyBread.command`
2. Select **"Open"**
3. Click **"Open"** in the security dialog
4. App will launch

### Subsequent Launches

After first time:
- **Double-click** `TheDailyBread.command`, or
- Run from Applications (if installed), or
- Add to Dock (drag while running)

### Optional Installation

```bash
./Install.command
```

This creates an alias in ~/Applications for easier access.

---

## 🎬 Using the App

### Creating Videos

1. Launch app
2. Click "Create New Video"
3. Enter your prompt
4. Configure settings (resolution, aspect ratio)
5. Click "Generate"
6. Video auto-downloads to ~/Downloads

### Managing Library

- **Dashboard**: View all generated videos
- **Extend**: Create longer videos from existing ones
- **Download**: Export as MP4 or GIF
- **Delete**: Remove from history
- **Open Folder**: Quick access to Downloads

---

## 🐛 Troubleshooting

### "Unidentified Developer" Warning

**Problem**: macOS blocks app from opening  
**Solution**:
1. **Right-click** (don't double-click) the `.command` file
2. Select **"Open"**
3. Click **"Open"** in dialog

Or go to:
```
System Preferences → Security & Privacy → Allow
```

### Permission Denied

**Problem**: `Permission denied` when running  
**Solution**:
```bash
chmod +x TheDailyBread.command Install.command
```

### API Key Issues

**Problem**: "Invalid API Key" error  
**Solution**:
- Verify `.env.local` exists: `ls -la | grep env`
- Check contents: `cat .env.local`
- Ensure format: `API_KEY=key_here` (no spaces, no quotes)
- Restart app after creating/editing `.env.local`

### App Doesn't Start

**Problem**: Nothing happens when launching  
**Solution**:
1. Open Terminal
2. Navigate to folder: `cd /path/to/production-build-mac`
3. Run manually: `./TheDailyBread.command`
4. Check error messages
5. Common fixes:
   - Install Command Line Tools: `xcode-select --install`
   - Check permissions: `ls -l TheDailyBread.command`

### White Screen

**Problem**: App opens but shows white screen  
**Solution**:
- Check internet connection (needs CDN access)
- Wait 10-15 seconds for initial load
- Check Console (⌘+Option+I) for errors
- Verify API key is correct

---

## 🔒 Security & Privacy

### Gatekeeper

macOS Gatekeeper protects against unsigned apps. This app is **unsigned** (no Apple Developer certificate), so you must bypass Gatekeeper on first launch.

**Safe to bypass because**:
- Open source code (inspect on GitHub)
- No network activity except to Gemini API
- All data stored locally

### Data Storage

- **API Keys**: Local only (`.env.local`)
- **Videos**: Saved to ~/Downloads
- **History**: Browser localStorage (local)
- **Network**: Only connects to:
  - `ai.google.dev` (Gemini API)
  - `aistudiocdn.com` (React/UI libraries)
  - `cdn.tailwindcss.com` (CSS framework)

---

## 📦 Distribution

### Sharing This Build

**To share with others**:

1. **Delete sensitive files**:
   ```bash
   rm .env.local
   ```

2. **Create ZIP**:
   ```bash
   cd ..
   zip -r thedailybread-mac.zip production-build-mac/ -x "*/node_modules/*"
   ```

3. **Share** with instructions to:
   - Extract ZIP
   - Create `.env.local`
   - `chmod +x *.command`
   - Right-click → Open (first time)

**Compressed Size**: ~150-200 MB  
**Extracted Size**: ~400 MB

---

## 💡 Tips

### Add to Dock

1. Launch app
2. While running, right-click icon in Dock
3. **Options** → **Keep in Dock**

### Create Alias

```bash
ln -s /full/path/to/TheDailyBread.command ~/Desktop/TheDailyBread
```

### Run from Anywhere

Add to PATH (optional):
```bash
echo 'export PATH="$PATH:/path/to/production-build-mac"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🆘 Support

For issues:
1. Check Terminal output for errors
2. Review [main README](../README.md)
3. Open issue on [GitHub](https://github.com/yourusername/thedailybread/issues)

---

## 📄 License

Apache 2.0 - See individual file headers for details

---

<div align="center">
  <p>macOS Production Build • Version 1.0</p>
  <p>Part of The Daily Bread project</p>
  <p>Supports Intel & Apple Silicon Macs</p>
</div>
