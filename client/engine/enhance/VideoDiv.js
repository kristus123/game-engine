export class VideoDiv extends HTMLElement {
  constructor() {
    super();

    const video = document.createElement("video");

    const src = this.getAttribute("src");
    if (src) video.src = src;

    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const content = document.createElement("div");
    content.classList.add("content");
    content.classList.add("center");

    while (this.firstChild) {
      content.appendChild(this.firstChild);
    }

    this.appendChild(video);
    this.appendChild(overlay);
    this.appendChild(content);
  }
}
