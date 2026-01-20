' Create Desktop Shortcut for The Daily Bread
Set oWS = WScript.CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

sScriptPath = oFSO.GetParentFolderName(WScript.ScriptFullName)
sLinkFile = oWS.SpecialFolders("Desktop") & "\The Daily Bread.lnk"

Set oLink = oWS.CreateShortcut(sLinkFile)
    oLink.TargetPath = sScriptPath & "\StartApp-Hidden.vbs"
    oLink.WorkingDirectory = sScriptPath
    oLink.IconLocation = sScriptPath & "\resources\icon.png"
    oLink.Description = "The Daily Bread Video Generator"
    oLink.WindowStyle = 1
oLink.Save

MsgBox "Shortcut 'The Daily Bread' berhasil dibuat di Desktop!" & vbCrLf & vbCrLf & "Sekarang kalo Anda click shortcut tersebut, terminal tidak akan kelihatan lagi.", 64, "Berhasil!"
