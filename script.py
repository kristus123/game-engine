import os
from flesk import init_dist, new_dist_file

init_dist()

def get_all_js_files(directory_path):
    js_files=[]

    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))

    return js_files

folder_path = 'static'
js_files = get_all_js_files(folder_path)

new_dist_file("index.html", js_files=js_files)
