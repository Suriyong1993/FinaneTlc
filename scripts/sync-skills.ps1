# sync-skills.ps1 — distribute all source-of-truth skills to every AI tool / IDE.
#
# Source of truth:  .agents\skills\*\
# Edit ONLY copies under .agents\skills\, then run:  .\scripts\sync-skills.ps1
#
# It mirrors all skill folders into each tool's skills/ directory.
# AGENTS.md and GitHub workflows are NOT touched here — edit those by hand.

$ErrorActionPreference = "Stop"

# repo root = parent of this script's dir
$ROOT = Split-Path -Parent $PSScriptRoot
Write-Host "Script root: $PSScriptRoot"
Write-Host "Project root: $ROOT"
Set-Location $ROOT

$SRC_ROOT = ".agents\skills"

if (-not (Test-Path -Path $SRC_ROOT -PathType Container)) {
    Write-Error "ERROR: source skills directory not found at $SRC_ROOT"
    exit 1
}

Write-Host "Source root: $SRC_ROOT"
Write-Host "Skills in source root:"
Get-ChildItem -Path $SRC_ROOT -Directory | ForEach-Object {
    Write-Host "  - $($_.Name)"
}

# Tools that consume a skills/ folder
$TARGETS = @(".claude", ".cursor", ".gemini", ".trae", ".windsurf", ".clinerules")

Write-Host ""
foreach ($t in $TARGETS) {
    Write-Host "Syncing to $t\skills:"
    $skillsDir = Join-Path $t "skills"
    if (-not (Test-Path -Path $skillsDir)) {
        New-Item -ItemType Directory -Path $skillsDir -Force | Out-Null
        Write-Host "  Created directory: $skillsDir"
    }
    # Remove existing skills to clean up old ones
    $existingSkills = Get-ChildItem -Path $skillsDir -Directory
    if ($existingSkills) {
        Write-Host "  Removing existing skills..."
        $existingSkills | Remove-Item -Recurse -Force
    }
    # Copy all skills
    $sourceSkills = Get-ChildItem -Path $SRC_ROOT -Directory
    if ($sourceSkills) {
        foreach ($skill in $sourceSkills) {
            $skillName = $skill.Name
            $dst = Join-Path $skillsDir $skillName
            Write-Host "  Copying $skillName to $dst..."
            Copy-Item -Path $skill.FullName -Destination $dst -Recurse
            Write-Host "    synced -> $dst"
        }
    } else {
        Write-Host "  No skills found in source root!"
    }
}

Write-Host ""
Write-Host "Native rule files (.cursor\rules, .clinerules) are maintained by hand."
Write-Host "Done."

