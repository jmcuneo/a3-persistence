const PORT=4000;
let sessionID=null;
let socket=null;
async function login(){
    var url="http://"+ window.location.hostname + ":"+PORT +'/login';
    let user=document.getElementById("username").value;
    let password=document.getElementById("password").value;
    var obj={
        Username:user,
        Password:password
    }
    var loginString=JSON.stringify(obj);
    const response = await fetch(url, {
        method:"POST",
        body:loginString,
    });
    if (response.redirected){
        const redirectUrl = response.url;
        window.location.href = redirectUrl;
    }
    else{
        let data=await response.text();
        alert(data);
    }

}

async function register(){
 var url="http://"+ window.location.hostname + ":"+PORT +'/register';
 let user=document.getElementById("username").value;
     let password=document.getElementById("password").value;
     var obj={
         Username:user,
         Password:password
     }
     var loginString=JSON.stringify(obj);

     const response = await fetch(url, {
         method:"POST",
         body:loginString
     })
     let data=await response.text();
     alert(data);
}

/*
    let listButton=document.getElementById("listMazes");
    listButton.innerHTML='';
    var obj={
        Username:"USER",
        Password:"Password"
    }
    var jsonBody=JSON.stringify(jsonBody);

*/