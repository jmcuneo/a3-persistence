var sumbit = document.querySelector("#submit"),
  var_name = document.querySelector(".name"),
  code_str = document.querySelector("textarea"),
  refresh = document.querySelector("#refresh"),
  table = document.querySelector("#table");

var varibles = [];

const checkVarName = async function (event) {
  let is_modify = varibles.some(eq=>eq.name==var_name.value);

  if (is_modify){
    sumbit.classList.remove("add");
  }else{
    sumbit.classList.add("add");
  }
}

var_name.oninput = checkVarName;
code_str.oninput = checkVarName;

const addCode = async function (event) {
  event.preventDefault();
  await sendPost(var_name.value, code_str.value);
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
  // will always modify
  sumbit.classList.remove("add");
}

// send delete via replacing with no code
const deleteCode = async function (index) {
  await sendPost(varibles[index].name, "");
}

// send refresh via sending nothing
const refreshCode = async function (index) {
  await sendPost("","")
}
refresh.onclick = refreshCode;

// send the post to the server
async function sendPost(name, code) {

  const json = { name, code };

  const response = await fetch("/", {
    method: "POST",
    body: JSON.stringify(json)
  });
  const text = await response.text();
  const obj = JSON.parse(text);
  let htmlStr = "";
  varibles = obj;
  for (let j = 0; j < obj.length; j++) {
    htmlStr += `
    <tr>
    <td><recalc onclick="recalcCode(${j})"></recalc></td>
    <td><modify onclick="modifyCode(${j})"></modify></td>
    <td><delete onclick="deleteCode(${j})"></delete></td>
    <td>${obj[j].name}</td>
    <td>${obj[j].code}</td>
    <td>${obj[j].str}</td>
    </tr>
  `
  }
  table.innerHTML = htmlStr;
  checkVarName();
  //console.log("text:", text);
}

// send the modify to the server with an index
async function sendModify(name, code) {

  const json = { name, code };

  const response = await fetch("/modify", {
    method: "POST",
    body: JSON.stringify(json)
  });

  const text = await response.text();

  console.log("text:", text);
}

refreshCode();