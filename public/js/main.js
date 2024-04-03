// FRONT-END (CLIENT) JAVASCRIPT HERE

let tableIndex = 0;

const login = async function( event ) {

  event.preventDefault()

  console.log("test login button pressed")

  const input = document.querySelector( "#userlogin"),
      json = { username: input[0].value, password: input[1].value },
      body = JSON.stringify( json )

  console.log(json)


  const getAccount = await fetch("/post_login",
      {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      })

  const loginAttempt = await getAccount.json()

  console.log(loginAttempt)

  addUserData(loginAttempt)

}

const submit = async function( event ) {

  event.preventDefault()
  
  const input = document.querySelector( "#userinput"),
       json = { username: input[0].value, score: input[1].value, time: input[2].value },
       body = JSON.stringify( json )

  //let newData = { "username": input[0].value, "score": input[1].value, "time": input[2].value }

  const response = await fetch("/post_to_appdata", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json)

  })
      .then(response => response.json())
      .then(console.log)



  //Reload page to show changes to the dataset
   location.reload()

}



//ONLOAD Function:
window.onload = async function() {

  const loginButton = document.getElementById("loginButton")
  loginButton.onclick = login;

  const button = document.getElementById("dataButton");
  button.onclick = submit;


}




//Add all the User Data
async function addUserData(userData)
{
  clearTable()
  tableIndex = 0;
  const table = document.getElementById("InformationTable")

  for(let i = 0; i < userData.length; i++)
  {
    tableIndex++
    let row = table.insertRow(tableIndex)

    for(let j = 0; j <= 3; j++)
    {
      let cell = row.insertCell(j)

      if(j == 0)
      {
        cell.innerHTML = userData[i].score;
      }
      else if(j == 1)
      {
        cell.innerHTML = userData[i].time;
      }
      else if(j == 2)
      {
        cell.innerHTML = userData[i].scoreOverTime;
      }
      else if(j == 3)
      {
        cell.innerHTML = userData[i].date;
      }
    }

  }




}

function clearTable()
{
  const table = document.getElementById("InformationTable")

  console.log(table.rows.length)
  console.log(table.rows)

  if(table.rows.length !== 1)
  {
    for(let i = table.rows.length - 1; i > 0; i--)
    {
      table.rows[i].remove();
    }
  }

}