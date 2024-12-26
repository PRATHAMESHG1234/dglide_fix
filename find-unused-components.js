const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const glob = require('glob');

// Configuration
const PROJECT_ROOT = './src'; // Adjust this to your project's source directory
const IGNORED_DIRS = ['node_modules', 'build', 'dist', '.git'];

// Store component definitions and usages
const componentDefinitions = new Map(); // Map<string, { path: string, used: boolean }>
const componentImports = new Set();

function isReactComponent(node) {
  // Check if it's a component (PascalCase naming convention)
  const name = node.id?.name;
  return name && /^[A-Z]/.test(name);
}

function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy']
    });
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

function findComponents() {
  // Find all JavaScript/TypeScript files
  const files = glob.sync(`${PROJECT_ROOT}/**/*.{js,jsx,ts,tsx}`, {
    ignore: IGNORED_DIRS.map((dir) => `**/${dir}/**`)
  });

  // First pass: collect component definitions
  files.forEach((filePath) => {
    const ast = parseFile(filePath);
    if (!ast) return;

    // traverse(ast, {
    //   // Find component class definitions
    //   ClassDeclaration(path) {
    //     if (isReactComponent(path.node)) {
    //       componentDefinitions.set(path.node.id.name, {
    //         path: filePath,
    //         used: false
    //       });
    //     }
    //   },
    //   // Find functional component definitions
    //   FunctionDeclaration(path) {
    //     if (isReactComponent(path.node)) {
    //       componentDefinitions.set(path.node.id.name, {
    //         path: filePath,
    //         used: false
    //       });
    //     }
    //   },
    //   // Find arrow function components
    //   VariableDeclarator(path) {
    //     if (
    //       path.node.id.type === 'Identifier' &&
    //       isReactComponent(path.node) &&
    //       path.node.init?.type === 'ArrowFunctionExpression'
    //     ) {
    //       componentDefinitions.set(path.node.id.name, {
    //         path: filePath,
    //         used: false
    //       });
    //     }
    //   }
    // });
  });

  // Second pass: find component usage
  //   files.forEach((filePath) => {
  //     const ast = parseFile(filePath);
  //     if (!ast) return;

  //     // traverse(ast, {
  //     //   // Track imported components
  //     //   ImportDeclaration(path) {
  //     //     path.node.specifiers.forEach((specifier) => {
  //     //       if (
  //     //         specifier.type === 'ImportSpecifier' ||
  //     //         specifier.type === 'ImportDefaultSpecifier'
  //     //       ) {
  //     //         componentImports.add(specifier.local.name);
  //     //       }
  //     //     });
  //     //   },
  //     //   // Track JSX usage
  //     //   JSXIdentifier(path) {
  //     //     const name = path.node.name;
  //     //     if (componentDefinitions.has(name)) {
  //     //       componentDefinitions.get(name).used = true;
  //     //     }
  //     //   }
  //     // });
  //   });

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

// Run the analysis
const unusedComponents = findComponents();

// Output results
console.log('\nUnused Components Found:');
console.log('=======================');
if (unusedComponents.length === 0) {
  console.log('No unused components found!');
} else {
  unusedComponents.forEach(({ name, path }) => {
    console.log(`\nComponent: ${name}`);
    console.log(`File: ${path}`);
  });
  console.log(`\nTotal unused components: ${unusedComponents.length}`);
}
