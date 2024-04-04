const nextPage = function(event){
    event.preventDefault();
    window.location.href = "/index.html"
}
const nextPageGithub = function(event){
    event.preventDefault();
    window.location.href = "/auth/github"
}

window.onload = function () {
    console.log("hello world");
    document.getElementById("login").onclick = nextPage;
    document.getElementById("logingithub").onclick = nextPageGithub;

}