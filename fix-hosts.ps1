$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entries = @(
    "159.41.192.50`tac-kjyp96q-shard-00-00.zutegiu.mongodb.net",
    "159.41.192.69`tac-kjyp96q-shard-00-01.zutegiu.mongodb.net",
    "159.41.192.91`tac-kjyp96q-shard-00-02.zutegiu.mongodb.net"
)
$current = Get-Content $hostsPath
foreach ($entry in $entries) {
    $host = $entry.Split("`t")[1]
    if (-not ($current -match [regex]::Escape($host))) {
        Add-Content -Path $hostsPath -Value $entry
        Write-Host "Added: $entry"
    } else {
        Write-Host "Already exists: $host"
    }
}
Write-Host "Done!"

