param([string]$docId, [string]$outFile)
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "https://docs.google.com/document/d/$docId/export?format=txt"
$result = & $chrome "--headless=new" "--disable-gpu" "--user-data-dir=C:\Users\jamme\AppData\Local\Google\Chrome\User Data" "--profile-directory=Default" "--dump-dom=$url" 2>&1
[System.IO.File]::WriteAllText($outFile, ($result -join "`n"))
Write-Host "Written $($result.Count) lines to $outFile"
