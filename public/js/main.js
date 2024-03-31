// FRONT-END (CLIENT) JAVASCRIPT HERE
let editOriginalName
let editOriginalRace
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const charname = document.querySelector( "#charname" ),
        charrace = document.querySelector( "#charrace" ),
        charclass = document.querySelector( "#charclass" ),
        action = document.querySelector('input[name="action"]:checked').value;

    const json = {
            "charname": charname.value,
            "charrace": charrace.value,
            "charclass": charclass.value,
            "action": action
        },
        body = JSON.stringify(json)

  const response = await fetch( "/submit", {
    method:"POST",
    headers: {
        "Content-Type": "application/json"
    },
    body 
  })

  const text = await response.text()

  console.log( "text:", text )

  document.getElementById("characterForm").reset()

  await loadTable()
}

const deleteEntry = async function (deleteId){

    console.log("delete entry: ", deleteId)

    const json = {
        "deleteId": deleteId,
    }
    const body = JSON.stringify(json)
    const response = await fetch( "/delete", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    // const text = await response.text()
    await loadTable()
}

const save = async function( event ){
    event.preventDefault();

    console.log("global var values: ", editOriginalName, editOriginalRace)

    await deleteEntry(editOriginalName, editOriginalRace);

    await saveEdit(event)
}


const editEntry = function (editName, editRace, editClass, editMod, editAction){
    console.log("edit data for ", editName)
    document.getElementById("editForm").style.display = 'block';
    document.getElementById("editname").value = editName;
    document.getElementById("editrace").value = editRace;
    document.getElementById("editclass").value = editClass;
    document.getElementById("editmodifier").value = editMod;
    document.getElementById("editaction").value = editAction;
    editOriginalName = editName;
    editOriginalRace = editRace;
}

const saveEdit = async function ( event ){
    event.preventDefault()
    console.log("saving edit, deleting ", editOriginalName, editOriginalRace)


    const charname = document.querySelector( "#editname" ),
        charrace = document.querySelector( "#editrace" ),
        charclass = document.querySelector( "#editclass" ),
        charmod = document.querySelector( "#editmodifier" ),
        action = document.querySelector('#editaction');

    json = { "name": charname.value,
        "race": charrace.value,
        "class": charclass.value,
        "modifier": charmod.value,
        "action": action.value},
        body = JSON.stringify( json )

    const response = await fetch( "/edit", {
        method:"POST",
        body
    })

    cancel(event);
    await loadTable();
}
const cancel = function ( event ){
    event.preventDefault()

    document.getElementById("editForm").style.display = 'none';
    document.getElementById("editname").value = "";
    document.getElementById("editrace").value = "";
    document.getElementById("editclass").value = "";
    document.getElementById("editmodifier").value = "";
    document.getElementById("editaction").value = "";

    editOriginalRace = ""
    editOriginalName = ""

}


const loadTable = async function (){
    console.log("loading table")

    await fetch('/docs')
        .then(response => response.json())
        .then(data => {
            const existingTableBody = document.getElementById("charTableBody");
            const tableRows = existingTableBody.getElementsByTagName('tr');
            const rowCount = tableRows.length;
            //Remove all non-header rows
            for (let x=rowCount-1; x>0; x--) {
                existingTableBody.removeChild(tableRows[x]);
            }
            console.log('Appdata from server:', data);
            for (let i = 0; i < data.length; i++) {
                // creates a table row
                const row = document.createElement("tr");
                for (let j = 0; j < 6; j++) {
                    // Create a <td> element and a text node, make the text
                    // node the contents of the <td>, and put the <td> at
                    // the end of the table row
                    const cell = document.createElement("td");
                    let content = "";
                    switch(j){
                        case 0:
                            content = data[i].name
                            break;
                        case 1:
                            content = data[i].race
                            break;
                        case 2:
                            content = data[i].class
                            break;
                        case 3:
                            content = data[i].modifier
                            break;
                        case 4:
                            content = data[i].action
                            break;
                        case 5:
                            const button2 = document.createElement("button")
                            button2.onclick = () => editEntry(data[i].name, data[i].race, data[i].class, data[i].modifier, data[i].action);
                            button2.id = "editButton"
                            button2.textContent = "Edit"
                            cell.appendChild(button2);

                            const button = document.createElement("button")
                            button.onclick = () => deleteEntry(data[i]._id);
                            button.id = "deleteButton"
                            button.textContent = "Delete"
                            cell.appendChild(button);


                            row.appendChild(cell);
                            break;

                    }
                    if(j !== 5) {
                        const cellText = document.createTextNode(content);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                }

                // add the row to the end of the table body
                existingTableBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching appdata:', error);
        });
}

window.onload = function() {
   const submitbutton = document.querySelector("#submitbutton");
    submitbutton.onclick = submit;
    document.querySelector("#cancelbutton").onclick = cancel;
    document.querySelector("#savebutton").onclick = save;
    loadTable();
}