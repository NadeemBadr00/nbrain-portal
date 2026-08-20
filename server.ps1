$port = 3000
$projectPath = "C:\Users\pc1.NADEEMBADR\.gemini\antigravity\scratch\nbrain-agency-portal"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "================================================="
Write-Host "  NBrain Portal Server running at http://localhost:$port"
Write-Host "================================================="

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $projectPath $path.TrimStart('/')
    
    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $mime = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.json' { 'application/json; charset=utf-8' }
            '.svg'  { 'image/svg+xml' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.gif'  { 'image/gif' }
            '.ico'  { 'image/x-icon' }
            default { 'application/octet-stream' }
        }
        $ctx.Response.ContentType = $mime
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.StatusCode = 200
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
}
