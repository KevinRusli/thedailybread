' Uninstaller for The Daily Bread
Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

' Remove Desktop Shortcut
sDesktopPath = oShell.SpecialFolders("Desktop") & "\The Daily Bread.lnk"
If oFSO.FileExists(sDesktopPath) Then
    oFSO.DeleteFile(sDesktopPath)
End If

' Remove Start Menu Folder
sStartMenuPath = oShell.SpecialFolders("StartMenu") & "\Programs\The Daily Bread"
If oFSO.FolderExists(sStartMenuPath) Then
    oFSO.DeleteFolder(sStartMenuPath)
End If

MsgBox "Uninstall Complete!" & vbCrLf & vbCrLf & _
       "All shortcuts have been removed." & vbCrLf & _
       "You can safely delete the application folder if you want.", _
       64, "The Daily Bread - Uninstalled"
