const { app, BrowserWindow } = require('electron');
const path = require('path');

// Set proper app name for Windows taskbar
app.setAppUserModelId('com.thedailybread.app');

let mainWindow;

// Force production mode since this is production-build folder
const isDev = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'The Daily Bread',
        icon: path.join(__dirname, '../resources/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
    });

    // Load from built files
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading from:', indexPath);

    mainWindow.loadFile(indexPath).catch(err => {
        console.error('Failed to load:', err);
    });

    // Set window title explicitly
    mainWindow.setTitle('The Daily Bread');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Log any errors
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Load failed:', errorCode, errorDescription);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
