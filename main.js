const {app, BrowserWindow}=require('electron');
const reload = require('electron-reload');
const path = require('path');
const { dirname } = require('path');

function createWindow(){

    const win = new BrowserWindow({
        width:800,
        height:600,
        show: false,
        webPreferences: {
          nodeIntegration:true
        }
    });

    win.loadFile('index.html').then(function(){
      win.removeMenu();
      win.maximize();
      win.show();
      win.webContents.openDevTools();
  });
}

reload(__dirname,{
    elctron: path.join(__dirname,'.node_modules/.bin/electron.cmd')
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

app.allowRendererProcessReuse = false;  