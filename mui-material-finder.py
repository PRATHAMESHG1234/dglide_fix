from pathlib import Path
import re

def find_mui_material_files(src_dir):
    """Find all files importing from @mui/material"""
    mui_files = set()
    for file in Path(src_dir).rglob('*'):
        if file.is_file():
            try:
                with open(file, 'r') as f:
                    content = f.read()
                    if re.search(r'@mui/material', content):
                        mui_files.add(str(file))
            except Exception as e:
                print(f"Error reading {file}: {e}")
    
    with open('mui-material-files.txt', 'w') as f:
        f.write('\n'.join(sorted(mui_files)))

def extract_mui_components(src_dir):
    """Extract all unique MUI material component names from imports"""
    components = set()
    
    for file in Path(src_dir).rglob('*'):
        if not file.is_file():
            continue
        
        try:
            with open(file, 'r') as f:
                content = f.read()
                
                # Match named imports with curly braces
                named_imports = re.finditer(
                    r'import\s*{([^}]+)}\s*from\s*[\'"]@mui/material[\'"]',
                    content
                )
                for match in named_imports:
                    # Split by comma and clean each component name
                    imports = match.group(1).split(',')
                    for imp in imports:
                        # Clean up the import name
                        clean_imp = imp.strip()
                        # Remove 'as' aliases
                        if ' as ' in clean_imp:
                            clean_imp = clean_imp.split(' as ')[0].strip()
                        if clean_imp and not clean_imp.isspace():
                            components.add(clean_imp)
                
                # Match direct imports like 'import Button from @mui/material/Button'
                direct_imports = re.finditer(
                    r'import\s+(\w+)\s+from\s*[\'"]@mui/material/([^\'"]+)[\'"]',
                    content
                )
                for match in direct_imports:
                    base_name = match.group(2).strip()
                    if base_name and not base_name.isspace():
                        components.add(base_name)
                
                # Match relative path imports
                relative_imports = re.finditer(
                    r'import\s+{([^}]+)}\s+from\s*[\'"]\.\.?/.*@mui/material[\'"]',
                    content
                )
                for match in relative_imports:
                    imports = match.group(1).split(',')
                    for imp in imports:
                        clean_imp = imp.strip()
                        if ' as ' in clean_imp:
                            clean_imp = clean_imp.split(' as ')[0].strip()
                        if clean_imp and not clean_imp.isspace():
                            components.add(clean_imp)
                
        except Exception as e:
            print(f"Error processing {file}: {e}")
    
    # Remove any utility functions or special cases
    components = {comp for comp in components if comp and not comp.isspace() and 
                 not comp.startswith('use') and  # Remove hooks
                 not comp in {'alpha', 'colors', 'div', 'tooltipClasses'}}  # Remove utilities
    
    # Write sorted unique components
    with open('all-mui-components.txt', 'w') as f:
        f.write('\n'.join(sorted(components)))

def main():
    src_dir = "./src"
    print("Finding MUI Material files...")
    find_mui_material_files(src_dir)
    print("Extracting MUI Material components...")
    extract_mui_components(src_dir)
    print("Done! Check mui-material-files.txt and all-mui-components.txt for results.")

if __name__ == "__main__":
    main()