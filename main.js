// ====================================================================
// PokéSurvivor - Hlavný proces Electronu pre Windows (.exe)
// ====================================================================
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Zapnutie hardvérovej akcelerácie pre plynulé Canvas 2D renderovanie

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "PokéSurvivor",
    width: 1280,
    height: 768,
    minWidth: 960,
    minHeight: 540,
    fullscreen: false,
    resizable: true,
    backgroundColor: '#0a0d14',
    icon: path.join(__dirname, 'assets', 'favicon.ico'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // DÔLEŽITÉ: Povoľuje načítanie lokálnych zvukov, hudby a obrázkov bez CORS chýb
      devTools: false
    }
  });

  // Skrytie štandardného menu prehliadača (File, Edit, View...)
  mainWindow.setMenuBarVisibility(false);

  // Načítanie súboru index.html zo zložky hry
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Zobrazenie okna až po načítaní, aby nepreblikla biela obrazovka
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Otváranie externých odkazov (GitHub, sociálne siete) v predvolenom prehliadači používateľa
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Herné klávesové skratky:
  // F11 = Prepínanie celej obrazovky
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    }
  });
}

// Spustenie okna po inicializácii Electronu
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Ukončenie aplikácie po zatvorení všetkých okien
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
