export async function submit(event, endpoint, querySelector, method="POST") {
  
  let body = "";
  if(event) event.preventDefault();
  if(querySelector){
    const input = new FormData(document.querySelector(querySelector));
    console.log(input);
    let values = Object.fromEntries(input.entries());
    for(const [key, value] of Object.entries(values)){
      if(value === "" && key !== "file"){
        throw new Error("null fields");
      }
    }
    /* if(endpoint==="/auth/user-data/add-cat"){
      let reader = new FileReader();
      reader.onload = (event =>{
        const fileData =  event.target.result
        values["media"] = fileData.toJSON()
        console.log(values)
      });
      reader.readAsDataURL(file.files[0]);
    } */
    /* values = parseData.toFloat(values); */
    console.log(values);
    body = JSON.stringify(values);
    console.log(body);

  }
  const response = await fetch(endpoint, {
    method: method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${document.cookie.substring(6)}`,
    },
    body,
  });

  const text = await response.json();
  console.log("response status:", response.status);
  if (response.status === 200) {
    console.log(endpoint)
    switch(endpoint){
      case "/register/new-user":
        console.log("setting cookie");
        document.cookie = `token=${text}`;
        redirect(null, "/user-data");
        break;
      case "/login/auth":
        console.log("setting cookie");
        document.cookie = `token=${text}`;
        redirect(null, "/user-data");
        break;
      case "/auth/user-data/add-cat":
        console.log("do something with the response bozo");
        break;
      case "/auth/user-data/delete-cat":
        console.log("DELETED CABT");
        break;
      case "/auth/user-data/fetch-cats":
        console.log("good lorde");
        return text;
        break;
      default:
        console.log("redirecting to login")
        redirect(null, "/login");
        break;
    } 
    
  } else if(response.status === 401){
    redirect(null, "/login");
  }
  console.log("token:", text);
  return;
};

function logFile (event) {
	let str = event.target.result;
	let img = document.createElement('img');
  let app = document.querySelector('#image')
	img.src = str;
	app.append(img);
	console.log(str);
}

export function errorHandler(error){
  console.error("error: ", error.toString())
  if(error.toString().match("null fields")){
    console.log("errah");
    document.querySelector('#errorMessage');
    errorMessage.textContent = '';
    errorMessage.textContent = '*** Please fill out all fields!!!';
    return;
  }else{
    redirect(null, "/login")
  }
}
export async function redirect( event, endpoint) {
  if(event) event.preventDefault();
  const response = await fetch(endpoint, {
    method:"GET"
  })
  console.log(response);
  window.location.href = response.url;
}

/* window.onload = function() {
  getData(null)
  const submitButton = document.querySelector("#submit");
  submitButton.onclick = () => submit(event, "/submit").finally(getData);
  const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete").finally(getData);
} */