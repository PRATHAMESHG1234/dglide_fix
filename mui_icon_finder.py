import re
from pathlib import Path

def find_mui_files(src_dir):
    """Find all files importing from @mui/icons-material"""
    mui_files = []
    for file in Path(src_dir).rglob('*'):
        if file.is_file():
            try:
                with open(file, 'r') as f:
                    content = f.read()
                    if re.search(r'@mui/icons-material', content):
                        mui_files.append(str(file))
            except Exception as e:
                print(f"Error reading {file}: {e}")
    
    with open('mui-icon-files.txt', 'w') as f:
        f.write('\n'.join(mui_files))

def extract_mui_icons(src_dir):
    """Extract all unique MUI icon names from imports"""
    icons = set()
    
    for file in Path(src_dir).rglob('*'):
        if not file.is_file():
            continue
            
        try:
            with open(file, 'r') as f:
                content = f.read()
                
                # Match named imports with curly braces
                named_imports = re.finditer(
                    r'import\s*{([^}]+)}\s*from\s*[\'"]@mui/icons-material[\'"]', 
                    content
                )
                for match in named_imports:
                    imports = match.group(1).split(',')
                    icons.update(name.strip() for name in imports)
                
                # Match direct imports like 'import CloseIcon from @mui/icons-material/Close'
                direct_imports = re.finditer(
                    r'import\s+(\w+)\s+from\s*[\'"]@mui/icons-material/([^\'"]+)[\'"]',
                    content
                )
                for match in direct_imports:
                    imported_name = match.group(1)  # CloseIcon
                    base_name = match.group(2)      # Close
                    icons.add(base_name)  # Add the base name
                    if imported_name.endswith('Icon'):
                        icons.add(imported_name)  # Also add the full name with Icon suffix

                # Match relative path imports
                relative_imports = re.finditer(
                    r'import\s+{([^}]+)}\s+from\s*[\'"]\.\.?/.*@mui/icons-material[\'"]',
                    content
                )
                for match in relative_imports:
                    imports = match.group(1).split(',')
                    icons.update(name.strip() for name in imports)
                
        except Exception as e:
            print(f"Error processing {file}: {e}")
    
    # Write sorted unique icons
    with open('all-mui-icons.txt', 'w') as f:
        f.write('\n'.join(sorted(icons)))

def main():
    src_dir = "./src"
    print("Finding MUI files...")
    find_mui_files(src_dir)
    print("Extracting MUI icons...")
    extract_mui_icons(src_dir)
    print("Done! Check mui-icon-files.txt and all-mui-icons.txt for results.")

if __name__ == "__main__":
    main()