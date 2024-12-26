input_file = 'C:/Users/ghorp/Documents/GitHub/dglide_fix/all-mui-components.txt'

with open(input_file, 'r') as file:
    lines = file.readlines()

unique_lines = set(dict.fromkeys(lines))

with open(input_file, 'w') as file:
    file.writelines(unique_lines)
