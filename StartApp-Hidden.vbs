' Hidden Launcher for The Daily Bread
' This script runs the app without showing terminal windows

Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
sScriptPath = oFSO.GetParentFolderName(WScript.ScriptFullName)

' Change to the app directory
oShell.CurrentDirectory = sScriptPath

' Start the Vite dev server hidden
oShell.Run "cmd /c npm run dev", 0, False

' Wait for server to start
WScript.Sleep 5000

' Start Electron (this will show the app window)
oShell.Run "cmd /c npm run electron-start", 1, False

' Note: To close the app properly, close the Electron window
' The background server will need to be stopped manually from Task Manager if needed
