const {app, 
    BrowserWindow,
    ipcMain
} = require('electron')     
app.disableHardwareAcceleration() 
const path = require('path')
 const {
    FETCH_TEXT_FROM_STORAGE,
    SAVE_TEXT_IN_STORAGE,
    HANDLE_FETCH_TEXT_FROM_STORAGE,
    HANDLE_SAVE_TEXT_IN_STORAGE,

    FETCH_CONFIG_FROM_STORAGE,
    SAVE_CONFIG_IN_STORAGE,
    HANDLE_FETCH_CONFIG_FROM_STORAGE,
    HANDLE_SAVE_CONFIG_IN_STORAGE,

    FETCH_OPTIONS_FROM_STORAGE,
    SAVE_OPTIONS_IN_STORAGE,
    HANDLE_FETCH_OPTIONS_FROM_STORAGE,
    HANDLE_SAVE_OPTIONS_IN_STORAGE,
} = require('../utils/constants.js')
const storage = require('electron-json-storage')
function createWindow () {   
  // Create the browser window.     
win = new BrowserWindow(
        {
            width: 1920, 
            height: 1080,
        webPreferences:{
            nodeIntegration: true
            }
        
    }) 
win.removeMenu()      
// and load the index.html of the app.     

win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
 }      
 ipcMain.on(FETCH_TEXT_FROM_STORAGE, ()=>{
   //GRAB TEXT FROM STORAGE
   storage.get('application', function(error,data){
       if(error) {
        win.send(HANDLE_FETCH_TEXT_FROM_STORAGE,{
            success: false,
            message: 'LIST NOT RETURNED',
            text: ''
        })
       }
 
   let {savedList} = data
   win.send(HANDLE_FETCH_TEXT_FROM_STORAGE,{
       success: true,
       message: 'LIST RETURNED',
       text: savedList
   })
})
}); 
 ipcMain.on(SAVE_TEXT_IN_STORAGE, (event, arg)=>{
    //SAVE TEXT TO STORAGE
    console.log('arg', arg)
    storage.set('application', {savedList: arg}, function(error){
        if (error){
            win.send(HANDLE_SAVE_TEXT_IN_STORAGE,{
                success: false,
                message: 'not saved',
                text: ''
        })
        }
    })
    win.send(HANDLE_SAVE_TEXT_IN_STORAGE,{
        success: true,
        message: 'saved',
        text: arg,
    })
 });
 /* HANDLE CONFIG */
 ipcMain.on(FETCH_CONFIG_FROM_STORAGE, ()=>{
    //GRAB CONFIG FROM STORAGE
    storage.get('config', function(error,data){
        if(error) {
         win.send(HANDLE_FETCH_CONFIG_FROM_STORAGE,{
             success: false,
             message: 'LIST NOT RETURNED',
             text: ''
         })
        }
  
    let {savedList} = data
    win.send(HANDLE_FETCH_CONFIG_FROM_STORAGE,{
        success: true,
        message: 'LIST RETURNED',
        text: savedList
    })
 })
 }); 
  ipcMain.on(SAVE_CONFIG_IN_STORAGE, (event, arg)=>{
     //SAVE CONFIG TO STORAGE
     console.log('arg', arg)
     storage.set('config', {savedList: arg}, function(error){
         if (error){
             win.send(HANDLE_SAVE_CONFIG_IN_STORAGE,{
                 success: false,
                 message: 'not saved',
                 text: ''
         })
         }
     })
     win.send(HANDLE_SAVE_CONFIG_IN_STORAGE,{
         success: true,
         message: 'saved',
         text: arg,
     })
  });

   /* HANDLE OPTIONS */
 ipcMain.on(FETCH_OPTIONS_FROM_STORAGE, ()=>{
    //GRAB OPTIONS FROM STORAGE
    storage.get('options', function(error,data){
        if(error) {
         win.send(HANDLE_FETCH_OPTIONS_FROM_STORAGE,{
             success: false,
             message: 'LIST NOT RETURNED',
             text: ''
         })
        }
  
    let {savedList} = data
    win.send(HANDLE_FETCH_OPTIONS_FROM_STORAGE,{
        success: true,
        message: 'LIST RETURNED',
        text: savedList
    })
 })
 }); 
  ipcMain.on(SAVE_OPTIONS_IN_STORAGE, (event, arg)=>{
     //SAVE OPTIONS TO STORAGE
     console.log('arg', arg)
     storage.set('options', {savedList: arg}, function(error){
         if (error){
             win.send(HANDLE_SAVE_OPTIONS_IN_STORAGE,{
                 success: false,
                 message: 'not saved',
                 text: ''
         })
         }
     })
     win.send(HANDLE_SAVE_OPTIONS_IN_STORAGE,{
         success: true,
         message: 'saved',
         text: arg,
     })
  });
 
app.on('ready', createWindow)