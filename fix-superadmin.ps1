$proj = "glvfumsgnxbdxtrznbsu"
$svc  = "sb_secret_3I98JMid9r98ehAK5vYJLQ_S8t7Juoz"
$anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdmZ1bXNnbnhiZHh0cnpuYnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODE0NzcsImV4cCI6MjA4NzQ1NzQ3N30.njeaActX-y6MXnBH3s0_r2XG-fdiYx1rfsX4vT2qZfA"

$uri = "https://$proj.supabase.co/rest/v1/sube_profiller?email=eq.brgrercan%40gmail.com"
$h = @{
    "apikey"       = $anon
    "Authorization"= "Bearer $svc"
    "Content-Type" = "application/json"
    "Prefer"       = "return=representation"
}
$b = '{"rol":"super_admin"}'

try {
    $r = Invoke-RestMethod -Uri $uri -Method Patch -Headers $h -Body $b
    Write-Host "BASARILI:" ($r | ConvertTo-Json)
} catch {
    Write-Host "HATA: $_"
}
