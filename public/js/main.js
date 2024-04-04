const sumbit = document.querySelector("#submit"),
  var_name = document.querySelector(".name"),
  code_str = document.querySelector("textarea"),
  refresh = document.querySelector("#refresh"),
  table = document.querySelector("#table"),
  login = document.querySelector("#login"),
  input_form = document.querySelector("#input"),
  error = document.querySelector("#error");

var varibles = [];

const checkVarName = async function (event) {
  let is_modify = varibles.some(eq => eq.name == var_name.value);

  if (is_modify) {
    sumbit.classList.add("modify");
    sumbit.classList.remove("add");
  } else {
    sumbit.classList.add("add");
    sumbit.classList.remove("modify");
  }
}

var_name.oninput = checkVarName;
code_str.oninput = checkVarName;

const defaultName = "myVariableName";
const defaultCode = "let intermediate = 11+12;\nintermediate*3";

const addCode = async function (event) {
  event.preventDefault();
  await sendPost(var_name.value == "" ? defaultName : var_name.value, code_str.value == "" ? defaultCode : code_str.value);
}
sumbit.onclick = addCode;

// send same code again fotr recalculation
const recalcCode = async function (index) {
  await sendPost(varibles[index].name, varibles[index].code)
}

// sets the form to the values for modificaton
const modifyCode = async function (index) {
  var_name.value = varibles[index].name;
  code_str.value = varibles[index].code;
  checkVarName();
}

// send delete via replacing with no code
const deleteCode = async function (index) {
  await sendPost(varibles[index].name, "");
}

// send refresh via sending nothing
const refreshCode = async function (index) {
  await sendPost("", "")
}
refresh.onclick = refreshCode;


// send the post to the server
async function sendPost(name, code) {

  const json = { name, code };

  const response = await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  })

  if (response.status == 200) {
    const text = await response.text();
    const obj = JSON.parse(text);
    if (obj.length == 0) {
      table.innerHTML = '';
      error.innerHTML = "Add a variable name and some code to get started";
      varibles = [];
    }
    else {
      let htmlStr = "";
      varibles = obj;
      for (let j = 0; j < obj.length; j++) {
        htmlStr += `
    <tr>
    <td><span class="recalc" tabindex="0" onclick="recalcCode(${j})"></span></td>
    <td><span class="modify" tabindex="0" onclick="modifyCode(${j})"></span></td>
    <td><span class="delete" tabindex="0" onclick="deleteCode(${j})"></span></td>
    <td>${obj[j].name}</td>
    <td>${obj[j].code?.replace('\n','<br>')}</td>
    <td>${obj[j].result}</td>
    </tr>`
      }
      table.innerHTML = htmlStr;
      error.innerHTML = '';
    }
    login.parentElement.setAttribute("action", "/auth/logout");
    login.setAttribute("value", "Logout");
    input_form.removeAttribute("inert");
    table.parentElement.removeAttribute("hidden");
  } else {
    if (response.status == 401) {
      table.innerHTML = '';
      error.innerHTML = 'Login with the righthand button to add and run code';
    } else {
      console.log("got unknown code:", response.status);
      table.innerHTML = '';
      error.innerHTML = 'Oh no, our server! Its broken!';
    }
    login.parentElement.setAttribute("action", "/auth/login");
    login.setAttribute("value", "Login");
    input_form.setAttribute("inert", "");
    table.parentElement.setAttribute("hidden", "");
  }
  checkVarName();
}

setTimeout(refreshCode, 0)