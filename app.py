from flask import Flask, render_template
from livereload import Server

app = Flask(__name__)
app.debug = True

import os

def list_js_files_in_directory(directory):
    js_files = []
    for filename in os.listdir(directory):
        if filename.endswith(".js"):
            js_files.append(os.path.join(directory, filename))
    return js_files

folder_path = "static"
js_files = list_js_files_in_directory(folder_path)

@app.route("/")
def hello_world():
    return render_template("index.html", js_files=js_files)

server = Server(app.wsgi_app)
server.watch('static/*')
server.serve(port=5000)
