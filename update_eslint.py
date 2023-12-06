import os
import json

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

eslint_globals_config = {}
for js_file in get_all_js_files('static'):
    class_name = js_file['class_name']

    eslint_globals_config[class_name] = 'readonly'

# sort alphabetically
eslint_globals_config = dict(sorted(eslint_globals_config.items()))


filename = '.eslintrc.json'
with open(filename, 'r') as f:
    data = json.load(f)
    data['globals'] = eslint_globals_config

with open(filename, 'w') as f:
    json.dump(data, f, indent=4)
