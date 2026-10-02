import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export function createProjectZip() {
  const pythonScript = `
import os, zipfile
zip_path = 'public/snap-grid-project.zip'
exclude_dirs = {'node_modules', '.git', 'dist', '.cache', '__pycache__'}
exclude_files = {'snap-grid-project.zip', 'bun.lock'}
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        for f in files:
            if f in exclude_files or f.endswith('.pyc'):
                continue
            filepath = os.path.join(root, f)
            arcname = os.path.relpath(filepath, '.')
            z.write(filepath, arcname)
`;

  try {
    execSync(`python3 -c "${pythonScript}"`, { stdio: 'inherit' });
    console.log('Project ZIP created successfully at public/snap-grid-project.zip');
  } catch (err) {
    console.error('Failed to create project ZIP:', err);
  }
}

if (process.argv[1] && process.argv[1].endsWith('pack-zip.js')) {
  createProjectZip();
}
