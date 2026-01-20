' Setup Installer for The Daily Bread
' This creates shortcuts in Desktop and Start Menu with proper icon

Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

' Get installation directory (current directory)
sAppPath = oFSO.GetParentFolderName(WScript.ScriptFullName)

' Create Desktop Shortcut
sDesktopPath = oShell.SpecialFolders("Desktop")
Set oDesktopLink = oShell.CreateShortcut(sDesktopPath & "\The Daily Bread.lnk")
oDesktopLink.TargetPath = sAppPath & "\The Daily Bread.vbs"
oDesktopLink.WorkingDirectory = sAppPath
oDesktopLink.IconLocation = sAppPath & "\resources\icon.png"
oDesktopLink.Description = "The Daily Bread - AI Video Generator"
oDesktopLink.Save

' Create Start Menu Shortcut
sStartMenuPath = oShell.SpecialFolders("StartMenu") & "\Programs"
If Not oFSO.FolderExists(sStartMenuPath & "\The Daily Bread") Then
    oFSO.CreateFolder(sStartMenuPath & "\The Daily Bread")
End If

Set oStartLink = oShell.CreateShortcut(sStartMenuPath & "\The Daily Bread\The Daily Bread.lnk")
oStartLink.TargetPath = sAppPath & "\The Daily Bread.vbs"
oStartLink.WorkingDirectory = sAppPath
oStartLink.IconLocation = sAppPath & "\resources\icon.png"
oStartLink.Description = "The Daily Bread - AI Video Generator"
oStartLink.Save

' Create Uninstall shortcut in Start Menu
Set oUninstallLink = oShell.CreateShortcut(sStartMenuPath & "\The Daily Bread\Uninstall.lnk")
oUninstallLink.TargetPath = sAppPath & "\Uninstall.vbs"
oUninstallLink.WorkingDirectory = sAppPath
oUninstallLink.Description = "Uninstall The Daily Bread"
oUninstallLink.Save

MsgBox "Installation Complete!" & vbCrLf & vbCrLf & _
       "Shortcuts created:" & vbCrLf & _
       "- Desktop: The Daily Bread" & vbCrLf & _
       "- Start Menu: All Programs > The Daily Bread" & vbCrLf & vbCrLf & _
       "Anda bisa jalankan aplikasi dari Desktop atau Start Menu!", _
       64, "The Daily Bread - Setup Complete"
