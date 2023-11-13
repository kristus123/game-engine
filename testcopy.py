import os
from sys import exit

def get_all_js_files(directory_path, js_files=[]):
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))
    return js_files

folder_path = 'static'
js_files = get_all_js_files(folder_path)

print('List of .js files:')
for js_file in js_files:
    print(js_file)


exit(0)














import os

source_folder = "static"
destination_folder = "new_static"

for root, dirs, files in os.walk(source_folder):
    rel_path = os.path.relpath(root, source_folder)
    dest_folder = os.path.join(destination_folder, rel_path)
    os.makedirs(dest_folder, exist_ok=True)

    for file in files:
        src_file_path = os.path.join(root, file)
        dest_file_path = os.path.join(dest_folder, file)

        # Read the content of the source file
        with open(src_file_path, 'rb') as f:
            content = f.read()

        # Replace all occurrences of '#foo#' with '!bar!'
        content = content.replace(b'#foo#', b'!bar!')

        # Write the modified content to the destination file
        with open(dest_file_path, 'wb') as f:
            f.write(content)

