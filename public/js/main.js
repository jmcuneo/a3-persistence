
async function deleteRow(r) {
    //saving the object containing the index to remove
    let payload = JSON.stringify({_id:r.getAttribute('data-index')})
    console.log(payload)
    const response = await fetch( "/delete_data", {
        headers: {
            'Content-Type': 'application/json'
          },
        method:"DELETE",
        body: payload, //sending the object to server with delete request
    })

    //const text = await response.text()
    alert("Deleted Successfully!!")
    location.reload()

}

//function to populate popup form for updating
async function displayRow(row) {
    //setting the value for input html tag
    document.getElementById("updindex").setAttribute('value', row.getAttribute('data-updindex'))
    document.getElementById("githubid").setAttribute('value', row.getAttribute('data-github'))
    document.getElementById("updproductname").setAttribute('value', row.getAttribute('data-updname'))

    dt = new Date(row.getAttribute('data-dop'))
    const month = dt.getMonth()+1
    const date = dt.getDate()
    const year = dt.getFullYear()
    const formattedDate =`${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
    document.getElementById("updpurchasedate").setAttribute('value', formattedDate)
    console.log(formattedDate)
    document.getElementById("updcost").setAttribute('value', row.getAttribute('data-cost'))
    document.getElementById("updquantity").setAttribute('value', row.getAttribute('data-quantity'))
    document.getElementById("updcategory").value = row.getAttribute('data-category')
    document.getElementById("upddescription").setAttribute('value', row.getAttribute('data-desc'))
}

//function to show the popup
function openPopup(){
    let popup = document.getElementById('popup')
    popup.classList.add('open-popup')
}

//function to close the popup
function closePopup(){
    document.getElementById("reset").click() //reset form
    let popup = document.getElementById('popup')
    popup.classList.remove('open-popup')

}