import os
import shutil
from jinja2 import Environment, FileSystemLoader

from markdown import markdown
from textwrap import dedent


def to_markdown(s):
    return markdown(dedent(s))


def init_dist():
    try:
        shutil.rmtree("dist")
    except:
        pass
    os.makedirs("dist")
    shutil.copytree("static", "dist/static")


e = Environment(loader=FileSystemLoader(searchpath="./templates"))

def render_template(html_file, **kwargs):
    template = e.get_template(html_file)

    template.globals.update({"to_markdown": to_markdown})

    return template.render(kwargs)



def new_dist_file(html_file, **kwargs):
    with open(f"dist/{html_file}", "w") as index:
        index.write(render_template(html_file, **kwargs))
