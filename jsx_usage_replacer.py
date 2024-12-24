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
                old_name = parts[0]
                new_name = parts[-1]
                # Handle cases with 'as' keyword
                if 'as' in parts:
                    as_index = parts.index('as')
                    old_with_as = ' '.join(parts[:as_index])
                    icon_name = parts[as_index + 1]
                    mappings.append((old_with_as, new_name))
                    mappings.append((icon_name, new_name))
                else:
                    mappings.append((old_name, new_name))
    return mappings

def replace_jsx_usage(file_path, mappings):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        original_content = content
        for old_use, new_use in mappings:
            patterns = [
                # Self-closing tag with props
                (rf'<{re.escape(old_use)}\s+([^>]*?)>', f'<{new_use} \\1>'),
    
    # Self-closing tag without props or with just a space
                (rf'<{re.escape(old_use)}\s*>', f'<{new_use}>'),
    
    # Handle tags that are already self-closing
                 (rf'<{re.escape(old_use)}\s*/>', f'<{new_use} />')
                    ]

            
            for pattern, replacement in patterns:
                content = re.sub(pattern, replacement, content)

        if content != original_content:
            with open(file_path, 'w') as f:
                f.write(content)
            logging.info(f"Modified JSX in: {file_path}")
            return True
        return False
            
    except Exception as e:
        logging.error(f"Error processing {file_path}: {str(e)}")
        return False
def main():
    MAPPING_FILE = "usage-replacements.txt"
    FILES_LIST = "mui-icon-files.txt"
    RESULT_FILE = "jsx-usage-replacement-results.txt"
    
    setup_logging(RESULT_FILE)
    logging.info("Starting JSX Usage Replacement...")
    
    try:
        mappings = load_mappings(MAPPING_FILE)
        with open(FILES_LIST, 'r') as f:
            files = [line.strip() for line in f if line.strip()]
        
        modified_count = 0
        for file_path in files:
            if not Path(file_path).exists():
                logging.warning(f"File not found: {file_path}")
                continue
                
            if replace_jsx_usage(file_path, mappings):
                modified_count += 1
        
        logging.info(f"Completed! Modified {modified_count} files.")
        
    except Exception as e:
        logging.error(f"Script error: {str(e)}")

if __name__ == "__main__":
    main()