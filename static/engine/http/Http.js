export class Http {
  static get(endpoint) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000" + endpoint, false); // Synchronous request
    xhr.send();

    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    } else {
      throw new Error("Request failed with status: " + xhr.status);
    }
  }

  static post(endpoint, body) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000" + endpoint, false); // Synchronous request
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(body, null, 4));

    if (xhr.status === 200) {
      console.log("Response:", xhr.responseText);
    } else {
      console.error("Request failed with status:", xhr.status);
    }
  }
}
