// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( "#yourname" ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.json()

  const list = document.querySelector( "#list" )
  
  //clear the list element so it doesnt repeatedly print the whole thing
  list.innerHTML = ""

  for (let i = 0; i < text.length; i++) {

    let div = document.createElement("div")
    div.className = "div-" + i

    let li = document.createElement("li")
    li.id = "li-" + i
    li.className = div.className

    let edit = document.createElement("button")
    edit.innerText = "edit"
    edit.id = "editButton-" + i
    edit.className = div.className
    edit.addEventListener("click", editSubmit)

    let del = document.createElement("button")
    del.innerText = "delete"
    del.id = "delButton-" + i
    del.className = div.className
    del.addEventListener("click", delSubmit)

    //derived priority field based on the integer at index 0 of the input string
    let priorityParagraph = document.createElement("p")
    priorityParagraph.id = "priority-" + i
    priorityParagraph.className = div.className

    const priorityText = getPriorityText(text[i].yourname.charAt(0))
    priorityParagraph.innerText = priorityText
    
    div.appendChild(li)
    div.appendChild(edit)
    div.appendChild(del)
    div.appendChild(priorityParagraph)


    li.innerText = text[i].yourname
    list.appendChild(div)


  }


  
}



window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}

const delSubmit = async function( event ) {
  event.preventDefault()

  const delButtonId = event.target.id
  const delDiv = document.querySelector(".div-" + delButtonId.split("-")[1])
  
  const index = parseInt(delButtonId.split("-")[1])
  await fetch("/delete", {
    method: "DELETE",
    body: JSON.stringify({ index })
  });

  delDiv.remove()
}

const editSubmit = async function( event ) {
  event.preventDefault()

  const editButtonId = event.target.id
  const index = editButtonId.split("-")[1]
  const editLi = document.querySelector("li#li-" + index)
  const oldText = editLi.textContent

  const editInput = document.createElement("input")
  editInput.type = "text"
  editInput.value = oldText
  const submit = document.createElement("button")
  submit.textContent = "Submit"
  submit.id = "submit-" + editButtonId.id

  editLi.textContent = ""
  editLi.appendChild(editInput)
  editLi.appendChild(submit)

  submit.addEventListener("click", async function(event) {
    event.preventDefault()

    const newText = editInput.value

    editLi.textContent = newText

    editInput.remove()
    submit.remove()


    // Update the priority field as well
    const priorityText = getPriorityText(newText.charAt(0));
    const priorityParagraph = document.querySelector("#priority-" + index);
    priorityParagraph.innerText = priorityText;

    
    await fetch("/edit", {
      method: "PUT",
      body: JSON.stringify({ index, newText })
    });
    
  })
}

//helper function to create a unique derived field for each input
function getPriorityText(firstCharacter) {
  switch (firstCharacter) {
    case "0":
    case "1":
    case "2":
    case "3":
      return "Low priority"
    case "4":
    case "5":
    case "6":
      return "Medium priority"
    case "7":
    case "8":
    case "9":
      return "High priority"
    default:
      return "N/A"
  }
}
