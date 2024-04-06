const nextPageGithub = function(event){
    event.preventDefault();
    window.location.href = "/auth/github"
}
window.onload = function () {
    console.log("hello world");
    document.getElementById("logingithub").onclick = nextPageGithub;

}