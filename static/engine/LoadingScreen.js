export class LoadingScreen{
    static LOADING_SCREEN = document.getElementById("loading_screen")
    static show(text = "Loading..."){
        this.LOADING_SCREEN.style.display = "flex";
        const text_div = document.getElementById("loading_text");
        text_div.innerText = text;
        this.LOADING_SCREEN.appendChild(text_div)
    }
    
    static close(){
        this.LOADING_SCREEN.style.display = "none"
    }
}