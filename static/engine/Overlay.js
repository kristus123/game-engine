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

export class Overlay {
  static create() {
    document.getElementById("overlay").innerHTML = html;
  }
  // static clickHandler = (event) => {
  //   if (event.target.classList.contains("item")) {
  //     isClicked = true;
  //   } else {
  //     isClicked = false;
  //   }
  // };
  // static isAnyItemClicked() {
  //   return isClicked
  // }
}
