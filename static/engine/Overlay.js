function fetchHTML() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/static/gui/test.html", false);
  xhr.send();

  if (xhr.status === 200) {
    const html = xhr.responseText;
    return html;
  } else {
    console.error("Error fetching HTML:", xhr.statusText);
  }
}

const html = fetchHTML();
// let isClicked = false;

const appendLabelSelect = (parent) => {
  let element = document.createElement("option");
  element.innerHTML = "select-pack";
  element.disabled = true;
  element.selected = true;
  parent.appendChild(element);
};

const createSelect = () => {
  const footerDiv = document.querySelector(".footer .item");
  const select = document.createElement("select");
  footerDiv.appendChild(select);
  appendLabelSelect(select);
  select.className = "selector";
  return select;
};

export class Overlay {
  static create() {
    document.getElementById("overlay").innerHTML = html;
    let data = Http.get("/canvas-image");

    Overlay.handleSelectElement(data);
  }

  static selectedImage = "";

  static handleSelectElement(data) {
    const select = createSelect();
    for (const key in data) {
      if (key == "path") {
        continue;
      }
      let element = document.createElement("option");
      element.innerHTML = key;
      select.appendChild(element);
    }
    select.addEventListener("change", function () {
      var selectedValue = this.value;
      Overlay.removeElement(this);
      if (selectedValue == "root") {
        Overlay.handleImageOption(data.root, data.path);
      } else {
        data[selectedValue].path = data.path + "/" + selectedValue;
        Overlay.handleSelectElement(data[selectedValue]);
      }
    });
  }

  static handleImageOption(data, path) {
    const select = createSelect();
    data.forEach((e) => {
      let element = document.createElement("option");
      element.innerHTML = e;
      select.appendChild(element);
    });
    select.addEventListener("change", function () {
      var selectedValue = this.value;
      Overlay.selectedImage = path + "/" + selectedValue;
    });
  }

  static removeElement(element) {
    var selectElements = document.querySelectorAll(`.${element.className}`);
    var selectArray = Array.from(selectElements);
    for (
      var i = selectArray.indexOf(element) + 1;
      i < selectArray.length;
      i++
    ) {
      var elementToRemove = selectElements[i];
      elementToRemove.remove();
    }
  }
}
