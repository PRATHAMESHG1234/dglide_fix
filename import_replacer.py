import re
from pathlib import Path
import logging

def setup_logging(result_file):
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s',
        handlers=[
            logging.FileHandler(result_file),
            logging.StreamHandler()
        ]
    )

def load_mappings(mapping_file):
    mappings = []
    with open(mapping_file, 'r') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 2:
                if 'as' in parts:
                    as_index = parts.index('as')
                    old_name = ' '.join(parts[:as_index])
                    new_name = parts[-1]
                    mappings.append((old_name, new_name))
                else:
                    old_name = parts[0]
                    new_name = parts[-1]
                    mappings.append((old_name, new_name))
    return mappings

def replace_imports(file_path, mappings):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        original_content = content
        for old_use, new_use in mappings:
            # Handle "Icon as IconName" pattern in imports
            if ' ' in old_use:
                old_pattern = rf'import\s*{{\s*([^}}]*{re.escape(old_use)}[^}}]*)}}\s*from\s*[\'"]@mui/icons-material[\'"]'
            else:
                # Replace named imports from @mui/icons-material
                old_pattern = rf'import\s*{{\s*([^}}]*{re.escape(old_use)}[^}}]*)}}\s*from\s*[\'"]@mui/icons-material[\'"]'
            content = re.sub(old_pattern, f"import {{ {new_use} }} from 'lucide-react'", content)
            
            # Replace default imports from @mui/icons-material/IconName
            content = re.sub(
                rf'import\s+.*\s+from\s*[\'"]@mui/icons-material/{re.escape(old_use.split()[0])}[\'"]',
                f"import {{ {new_use} }} from 'lucide-react'",
                content
            )

        if content != original_content:
            with open(file_path, 'w') as f:
                f.write(content)
            logging.info(f"Modified imports in: {file_path}")
            return True
        return False
            
    except Exception as e:
        logging.error(f"Error processing {file_path}: {str(e)}")
        return False

def main():
    MAPPING_FILE = "usage-replacements.txt"
    FILES_LIST = "mui-icon-files.txt"
    RESULT_FILE = "import-replacement-results.txt"
    
    setup_logging(RESULT_FILE)
    logging.info("Starting Import Replacement Script...")
    
    try:
        mappings = load_mappings(MAPPING_FILE)
        
        with open(FILES_LIST, 'r') as f:
            files = [line.strip() for line in f if line.strip()]
        
        modified_count = 0
        for file_path in files:
            if not Path(file_path).exists():
                logging.warning(f"File not found: {file_path}")
                continue
                
            if replace_imports(file_path, mappings):
                modified_count += 1
        
        logging.info(f"Completed! Modified imports in {modified_count} files.")
        
    except Exception as e:
        logging.error(f"Script error: {str(e)}")

if __name__ == "__main__":
    main()