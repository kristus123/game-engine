from flask import Flask, render_template
from livereload import Server

app = Flask(__name__)
app.debug = True

import os

def get_all_js_files(directory_path):
    js_files=[]

    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))

    return js_files

folder_path = 'static'
js_files = get_all_js_files(folder_path)

@app.route("/")
def hello_world():
    return render_template("index.html", js_files=js_files)

server = Server(app.wsgi_app)
server.watch('static/*')
server.serve(port=5000)
