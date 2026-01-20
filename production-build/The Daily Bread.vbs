' The Daily Bread - Production Launcher (No Console)
On Error Resume Next

Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
sScriptPath = oFSO.GetParentFolderName(WScript.ScriptFullName)

' Build paths
sElectronPath = sScriptPath & "\node_modules\electron\dist\electron.exe"
sAppPath = sScriptPath

' Check if Electron exists
If Not oFSO.FileExists(sElectronPath) Then
    MsgBox "Error: Electron not found at:" & vbCrLf & sElectronPath & vbCrLf & vbCrLf & "Please make sure the app is properly installed.", vbCritical, "The Daily Bread - Error"
    WScript.Quit
End If

' Change to app directory
oShell.CurrentDirectory = sScriptPath

' Run electron (window style 1 = normal window, not hidden)
' Using style 1 temporarily to see if it launches
returnCode = oShell.Run("""" & sElectronPath & """ """ & sAppPath & """", 1, False)

If Err.Number <> 0 Then
    MsgBox "Error launching application:" & vbCrLf & Err.Description, vbCritical, "The Daily Bread - Error"
End If
