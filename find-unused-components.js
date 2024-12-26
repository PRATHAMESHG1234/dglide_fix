const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const glob = require('glob');

// Configuration
const PROJECT_ROOT = './src';
const IGNORED_DIRS = ['node_modules', 'build', 'dist', '.git'];

// Store component definitions and usages
const componentDefinitions = new Map();
const componentImports = new Set();

function isReactComponent(node) {
  const name = node.id?.name;
  return name && /^[A-Z]/.test(name);
}

function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      ast: parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators-legacy']
      }),
      content
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

function commentOutCode(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf-8');

    // Create backup of original file
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, content);

    // Split the content into lines
    const lines = content.split('\n');

    // Process each line
    const commentedLines = lines.map((line) => {
      // Skip empty lines
      if (line.trim() === '') return line;

      // If it's already a comment, leave it as is
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return line;
      }

      // Add comment to the beginning of the line while preserving indentation
      const indentation = line.match(/^\s*/)[0];
      return `${indentation}// ${line.trim()}`;
    });

    // Join the lines back together
    const commentedContent = commentedLines.join('\n');

    // Add a header comment
    const header = `/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: ${new Date().toISOString()}
 */\n\n`;

    // Write the commented content back to the file
    fs.writeFileSync(filePath, header + commentedContent);

    console.log(`✓ Successfully commented out code in: ${filePath}`);
    console.log(`  Backup created at: ${backupPath}`);

    return true;
  } catch (error) {
    console.error(`✗ Error processing file ${filePath}:`, error.message);
    return false;
  }
}

function findComponents() {
  // Find all JavaScript/TypeScript files
  const files = glob.sync(`${PROJECT_ROOT}/**/*.{js,jsx,ts,tsx}`, {
    ignore: IGNORED_DIRS.map((dir) => `**/${dir}/**`)
  });

  // First pass: collect component definitions
  files.forEach((filePath) => {
    const parseResult = parseFile(filePath);
    if (!parseResult) return;

    traverse(parseResult.ast, {
      ClassDeclaration(path) {
        if (isReactComponent(path.node)) {
          componentDefinitions.set(path.node.id.name, {
            path: filePath,
            used: false
          });
        }
      },
      FunctionDeclaration(path) {
        if (isReactComponent(path.node)) {
          componentDefinitions.set(path.node.id.name, {
            path: filePath,
            used: false
          });
        }
      },
      VariableDeclarator(path) {
        if (
          path.node.id.type === 'Identifier' &&
          isReactComponent(path.node) &&
          path.node.init?.type === 'ArrowFunctionExpression'
        ) {
          componentDefinitions.set(path.node.id.name, {
            path: filePath,
            used: false
          });
        }
      }
    });
  });

  // Second pass: find component usage
  files.forEach((filePath) => {
    const parseResult = parseFile(filePath);
    if (!parseResult) return;

    traverse(parseResult.ast, {
      ImportDeclaration(path) {
        path.node.specifiers.forEach((specifier) => {
          if (
            specifier.type === 'ImportSpecifier' ||
            specifier.type === 'ImportDefaultSpecifier'
          ) {
            componentImports.add(specifier.local.name);
          }
        });
      },
      JSXIdentifier(path) {
        const name = path.node.name;
        if (componentDefinitions.has(name)) {
          componentDefinitions.get(name).used = true;
        }
      }
    });
  });

  // Find unused components
  const unusedComponents = [];
  componentDefinitions.forEach((value, name) => {
    if (!value.used && componentImports.has(name)) {
      unusedComponents.push({
        name,
        path: value.path
      });
    }
  });

  return unusedComponents;
}

// Main execution
console.log('Starting analysis of unused components...\n');

const unusedComponents = findComponents();

// Output results and process files
console.log('Unused Components Found:');
console.log('=======================');

if (unusedComponents.length === 0) {
  console.log('No unused components found!');
} else {
  console.log(`Found ${unusedComponents.length} unused components.\n`);

  // Ask for confirmation before commenting out code
  console.log('The following components will be commented out:');
  unusedComponents.forEach(({ name, path }) => {
    console.log(`\nComponent: ${name}`);
    console.log(`File: ${path}`);
  });

  console.log('\nCommenting out unused components...');

  // Comment out each unused component
  unusedComponents.forEach(({ path: componentPath }) => {
    const absolutePath = path.resolve(process.cwd(), componentPath);
    if (fs.existsSync(absolutePath)) {
      commentOutCode(absolutePath);
    } else {
      console.error(`✗ File not found: ${path}`);
    }
  });

  console.log('\nProcess completed!');
  console.log('Note: Backup files have been created with .backup extension');
  console.log('To restore any file, copy the content from the .backup file.');
}
