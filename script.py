import os
from flesk import init_dist, new_dist_file

init_dist()

js_files=[]
for root, _, files in os.walk('static'):
    for file in files:
        if file.endswith('.js'):
            js_files.append(os.path.join(root, file))

new_dist_file("index.html", js_files=js_files)
