param(
  [switch]$BuilderMode
)

$ErrorActionPreference = "Stop"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ExportsDir = Join-Path $Root "exports"
$OutDir = Join-Path $ExportsDir "ai-lesson-webapp-$Timestamp"
$BackendOut = Join-Path $OutDir "backend"
$PublicOut = Join-Path $BackendOut "public"

New-Item -ItemType Directory -Force -Path $ExportsDir | Out-Null
New-Item -ItemType Directory -Force -Path $BackendOut | Out-Null

$backendItems = @(
  "package.json",
  "package-lock.json",
  "server.js",
  ".env.example",
  "routes",
  "services",
  "utils"
)

foreach ($item in $backendItems) {
  $source = Join-Path (Join-Path $Root "backend") $item
  if (Test-Path $source) {
    Copy-Item -LiteralPath $source -Destination $BackendOut -Recurse -Force
  }
}

$envExample = Join-Path $BackendOut ".env.example"
$envOut = Join-Path $BackendOut ".env"
$sourceEnv = Join-Path (Join-Path $Root "backend") ".env"
if (Test-Path $sourceEnv) {
  Copy-Item -LiteralPath $sourceEnv -Destination $envOut -Force
} elseif (Test-Path $envExample) {
  Copy-Item -LiteralPath $envExample -Destination $envOut -Force
}

New-Item -ItemType Directory -Force -Path $PublicOut | Out-Null
if ($BuilderMode) {
  $frontendDist = Join-Path (Join-Path $Root "frontend") "dist"
  if (-not (Test-Path (Join-Path $frontendDist "index.html"))) {
    throw "frontend/dist/index.html not found. Run npm.cmd run build in frontend first."
  }
  Copy-Item -LiteralPath $frontendDist -Destination $PublicOut -Recurse -Force
} else {
  Copy-Item -LiteralPath (Join-Path $PSScriptRoot "standalone-player.html") -Destination (Join-Path $PublicOut "index.html") -Force
}

$dataOut = Join-Path $BackendOut "data"
$mediaOut = Join-Path $dataOut "media"
New-Item -ItemType Directory -Force -Path $dataOut | Out-Null
New-Item -ItemType Directory -Force -Path $mediaOut | Out-Null

function Repair-MojibakeText {
  param([string]$Text)

  if ([string]::IsNullOrEmpty($Text) -or $Text.StartsWith("/api/media")) {
    return $Text
  }

  $current = $Text

  for ($attempt = 0; $attempt -lt 4; $attempt++) {
    $hasMarker = $current.Contains([string][char]0x00C3) -or
      $current.Contains([string][char]0x00C2) -or
      $current.Contains([string][char]0x00C4) -or
      $current.Contains([string][char]0x00C6) -or
      $current.Contains([string][char]0x00BA) -or
      $current.Contains([string][char]0x00BB)

    if (-not $hasMarker) {
      foreach ($ch in $current.ToCharArray()) {
        $code = [int][char]$ch
        if ($code -ge 0x0080 -and $code -le 0x009F) {
          $hasMarker = $true
          break
        }
      }
    }

    if (-not $hasMarker) {
      return $current
    }

    try {
      $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($current)
      $decoded = [System.Text.Encoding]::UTF8.GetString($bytes)
      if (-not $decoded -or $decoded -eq $current) {
        return $current
      }
      $current = $decoded
    } catch {
      return $current
    }
  }

  return $current
}

function Repair-LessonObject {
  param([object]$Value)

  if ($null -eq $Value) {
    return $null
  }

  if ($Value -is [string]) {
    return Repair-MojibakeText $Value
  }

  if ($Value -is [System.Array]) {
    for ($i = 0; $i -lt $Value.Count; $i++) {
      $Value[$i] = Repair-LessonObject $Value[$i]
    }
    return $Value
  }

  if ($Value -is [psobject]) {
    foreach ($prop in $Value.PSObject.Properties) {
      $prop.Value = Repair-LessonObject $prop.Value
    }
    return $Value
  }

  return $Value
}

$lessonPath = Join-Path (Join-Path $Root "backend") "data/lesson.json"
if (Test-Path $lessonPath) {
  $lesson = Get-Content -LiteralPath $lessonPath -Raw | ConvertFrom-Json
  $lesson = Repair-LessonObject $lesson

  function Copy-LessonMedia {
    param(
      [object]$Slide,
      [string]$Field,
      [string]$Subdir
    )

    if (-not $Slide.PSObject.Properties.Name.Contains($Field)) {
      return
    }

    $value = [string]$Slide.$Field
    if (-not $value.Contains("/api/media?path=")) {
      return
    }

    $pathMarker = "path="
    $pathIndex = $value.IndexOf($pathMarker)
    if ($pathIndex -lt 0) {
      return
    }

    $encodedPath = $value.Substring($pathIndex + $pathMarker.Length)
    $sourcePath = [System.Uri]::UnescapeDataString($encodedPath)

    if (-not (Test-Path -LiteralPath $sourcePath)) {
      Write-Warning "Media file not found and will be skipped: $sourcePath"
      return
    }

    $targetDir = Join-Path $mediaOut $Subdir
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

    $sourceName = [System.IO.Path]::GetFileName($sourcePath)
    $safeName = "$($Slide.id)-$sourceName"
    $targetPath = Join-Path $targetDir $safeName
    Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force

    $portableRel = "$Subdir/$safeName"
    $Slide.$Field = "/api/media?file=$([System.Uri]::EscapeDataString($portableRel))"
  }

  foreach ($slide in $lesson.slides) {
    Copy-LessonMedia -Slide $slide -Field "image" -Subdir "slides"
    Copy-LessonMedia -Slide $slide -Field "audio" -Subdir "audio"
    Copy-LessonMedia -Slide $slide -Field "video" -Subdir "video"
  }

  $portableLessonPath = Join-Path $dataOut "lesson.json"
  $json = $lesson | ConvertTo-Json -Depth 100
  [System.IO.File]::WriteAllText($portableLessonPath, $json, (New-Object System.Text.UTF8Encoding($false)))
}

$readme = @'
# AI Lesson Webapp - Portable Export

## Run on another machine

1. Install Node.js 18 or newer.
2. Open a terminal in this `backend` folder.
3. Run:

```powershell
npm install
npm start
```

4. Open:

```text
http://localhost:3000
```

This package includes a standalone lesson player, backend, `data/lesson.json`, and copied slide/audio/video media under `backend/data/media`.

## AI chatbot and voice

The standalone player includes chatbot and browser voice input. This export includes the current `backend/.env` so AI can work immediately when the target machine can reach the configured LLM server. Edit `backend/.env` on the target machine if the LLM URL or API key changes.
'@

Set-Content -LiteralPath (Join-Path $OutDir "README_PORTABLE.md") -Value $readme -Encoding UTF8

$zipPath = "$OutDir.zip"
if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -LiteralPath $OutDir -DestinationPath $zipPath -Force

Write-Output "EXPORT_DIR=$OutDir"
Write-Output "ZIP=$zipPath"
