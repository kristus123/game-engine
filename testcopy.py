import os

def get_all_js_files(directory_path):
    js_files=[]

    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.js'):
                path = os.path.join(root, file)
                js_files.append({
                    "path": path,
                    "class_name": path.split("/")[-1].replace(".js", ""),
                })

    return js_files

folder_path = 'static'
js_files = get_all_js_files(folder_path)

source_folder = "static"
destination_folder = "dist/static"

for root, dirs, files in os.walk(source_folder):
    rel_path = os.path.relpath(root, source_folder)
    dest_folder = os.path.join(destination_folder, rel_path)
    os.makedirs(dest_folder, exist_ok=True)

    for file in files:
        src_file_path = os.path.join(root, file)
        dest_file_path = os.path.join(dest_folder, file)

        with open(src_file_path, 'r', encoding="utf-8", errors='ignore') as f:
            content = f.read()

        imports = ""
        for js_file in js_files:
            class_name = js_file['class_name']
            path = js_file['path']

            i = "import { CLASS } from '/PATH'".replace("CLASS", class_name).replace("PATH", path)

            if f"export class {class_name}" in content:
                print("")
            elif f"new {class_name}" in content:
                imports += i + "; \n"
            elif f"{class_name}." in content:
                imports += i + "; \n"
            elif f"extends {class_name}" in content:
                print("extends")
                imports += i + "; \n"


        content = imports + "\n" +  content
        
        with open(dest_file_path, 'w') as f:
            f.write(content)
