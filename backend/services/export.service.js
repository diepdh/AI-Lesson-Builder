const path = require('path');
const { spawnSync } = require('child_process');

function runExport() {
  const scriptPath = path.resolve(__dirname, '..', '..', 'scripts', 'export-webapp.ps1');

  // Try pwsh/powershell depending on environment
  const candidates = [];
  if (process.platform === 'win32') {
    candidates.push('powershell.exe');
    candidates.push('pwsh');
  } else {
    candidates.push('pwsh');
    candidates.push('powershell');
  }

  let result = null;
  let used = null;
  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', scriptPath], { encoding: 'utf8' });
      // If command not found, res.error.code === 'ENOENT'
      if (res.error) {
        continue;
      }
      result = res;
      used = cmd;
      break;
    } catch (err) {
      continue;
    }
  }

  if (!result) {
    return { ok: false, error: 'No PowerShell runtime found to run export script.' };
  }

  const out = (result.stdout || '') + (result.stderr || '');

  // Try to parse ZIP path from output
  let zip = null;
  const zipMatch = out.match(/ZIP=(.+)\r?\n?/i);
  if (zipMatch) {
    zip = zipMatch[1].trim();
  }

  if (result.status !== 0) {
    return { ok: false, error: 'Export script failed', details: out };
  }

  return { ok: true, out: out.trim(), zip };
}

module.exports = { runExport };
