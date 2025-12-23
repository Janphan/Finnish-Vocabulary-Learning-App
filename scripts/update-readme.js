#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const README_PATH = path.join(ROOT_DIR, 'README.md');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');

function getPackageInfo() {
  try {
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      scripts: Object.keys(pkg.scripts || {}),
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {})
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return null;
  }
}

function getProjectStructure() {
  const structure = {};

  function scanDir(dir, prefix = '') {
    try {
      const items = fs.readdirSync(dir);
      const result = {};

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and common build dirs
          if (['node_modules', '.git', 'build', 'dist', 'coverage'].includes(item)) {
            result[item + '/'] = '...';
          } else {
            result[item + '/'] = scanDir(fullPath, prefix + '  ');
          }
        } else {
          // Only include important files
          if (!item.startsWith('.') && !['package-lock.json'].includes(item)) {
            result[item] = null;
          }
        }
      }

      return result;
    } catch (error) {
      return {};
    }
  }

  structure.src = scanDir(path.join(ROOT_DIR, 'src'));
  structure.public = scanDir(path.join(ROOT_DIR, 'public'));
  structure.scripts = scanDir(path.join(ROOT_DIR, 'scripts'));

  return structure;
}

function updateReadmeSection(content, sectionHeader, newContent) {
  const sectionRegex = new RegExp(`(## ${sectionHeader}\\n)[\\s\\S]*?(?=\\n## |$)`, 'm');
  const replacement = `$1${newContent}`;

  if (sectionRegex.test(content)) {
    return content.replace(sectionRegex, replacement);
  } else {
    // Add section if it doesn't exist
    return content + `\n## ${sectionHeader}\n\n${newContent}`;
  }
}

function generateProjectStructureText(structure) {
  function formatStructure(obj, indent = '') {
    let result = '';
    for (const [key, value] of Object.entries(obj)) {
      result += `${indent}${key}\n`;
      if (value && typeof value === 'object') {
        result += formatStructure(value, indent + '  ');
      }
    }
    return result;
  }

  return `\`\`\`\n${formatStructure(structure)}\`\`\``;
}

function updateReadme() {
  try {
    console.log('🔄 Updating README.md...');

    // Read current README
    let content = fs.readFileSync(README_PATH, 'utf8');

    // Get current project info
    const pkg = getPackageInfo();
    const structure = getProjectStructure();

    if (pkg) {
      // Update project description if it matches package.json
      if (pkg.description) {
        content = content.replace(
          /A modern React-based app for learning Finnish vocabulary[^.]*/,
          pkg.description
        );
      }
    }

    // Update project structure section
    const structureText = generateProjectStructureText(structure);
    content = updateReadmeSection(content, 'Project Structure', structureText);

    // Write back
    fs.writeFileSync(README_PATH, content, 'utf8');

    console.log('✅ README.md updated successfully!');
    console.log('📊 Detected changes:');
    console.log(`   - Package info: ${pkg ? 'Updated' : 'Not found'}`);
    console.log(`   - Project structure: Refreshed`);

  } catch (error) {
    console.error('❌ Error updating README:', error.message);
    process.exit(1);
  }
}

// Run the update
updateReadme();