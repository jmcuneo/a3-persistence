// FRONT-END (CLIENT) JAVASCRIPT HERE

let tableIndex = 0;

const login = async function( event ) {

  event.preventDefault()

  console.log("test login button pressed")

  const getAccount = await fetch("/docs",
      {
        method:"GET"
      })
      .then(response => response.json())
      .then(console.log)

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



  const populateTable = await fetch("/get_appdata",
      {
        method:"GET"
      })

  let data = await populateTable.json();

  //Insert Retrieved Data
  for(let i = 0; i < data.length; i++)
  {
    if(data[i] !== undefined)
    {
      insetElementToTable(data[i])
    }

  }

}



//CUSTOM CODE: Add this to the table
async function insetElementToTable(element)
{
  tableIndex++;
  const table = document.getElementById("InformationTable")
  let row = table.insertRow(tableIndex)

  for(let i = 0; i <= 5; i++)
  {
    let cell = row.insertCell(i)

    if(i == 0)
    {
      cell.innerHTML = element.username;
    }
    else if(i == 1)
    {
      cell.innerHTML = element.score;
    }
    else if(i == 2)
    {
      cell.innerHTML = element.time;
    }
    else if(i == 3)
    {
      cell.innerHTML = element.scoreOverTime;
      //cell.innerHTML =  Math.round((element.score / element.time) * 10) / 10;
    }
    else if(i == 4)
    {
      cell.innerHTML = element.date;
      //let curDate = new Date()
      //cell.innerHTML = (curDate.getMonth() + 1) + "/" + curDate.getDate() + "/" + curDate.getFullYear()
    }
    else if(i == 5)
    {
      //cell.innerHTML = tableIndex;
      cell.innerHTML = element.ID;
    }

  }



}