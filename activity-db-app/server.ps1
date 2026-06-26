$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:8000/")
try {
    $http.Start()
    Write-Output "Serving app on http://localhost:8000"
    while ($http.IsListening) {
        $context = $http.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") { 
            $urlPath = "/index.html" 
        }
        
        $sanitizedPath = $urlPath.Replace("/", "\").TrimStart('\')
        $localPath = Join-Path "C:\Users\barne\.gemini\antigravity-ide\scratch\activity-db-app" $sanitizedPath
        
        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            
            if ($localPath.EndsWith(".html")) { $response.ContentType = "text/html" }
            elseif ($localPath.EndsWith(".css")) { $response.ContentType = "text/css" }
            elseif ($localPath.EndsWith(".js")) { $response.ContentType = "text/javascript" }
            elseif ($localPath.EndsWith(".png")) { $response.ContentType = "image/png" }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Error $_
} finally {
    $http.Stop()
}
