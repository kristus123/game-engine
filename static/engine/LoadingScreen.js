export class LoadingScreen{
    static show(text = "Loading..."){
        document.getElementById("loading_screen").style.display = "flex";
        const text_div = document.getElementById("loading_text");
        text_div.innerText = text;
        document.getElementById("loading_screen").appendChild(text_div)
    }
    
    static close(){
        document.getElementById("loading_screen").style.display = "none"
    }
}