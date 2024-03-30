// //function to update row
// //called when update button in the respective row clicked
// async function updateRow() {
//     //fetching the updated values from the form
//     let updateLoad = JSON.stringify({
//         updindex: document.getElementById("updindex").value,
//         productname: document.getElementById("updproductname").value,
//         purchasedate: document.getElementById("updpurchasedate").value,
//         cost: document.getElementById("updcost").value,
//         quantity: document.getElementById("updquantity").value,
//         category: document.getElementById("updcategory").value,
//         description: document.getElementById("upddescription").value
//     })
//
//     const response = await fetch("/update_data", {
//         method: "PUT",
//         body: updateLoad, //sending the values to server using PUT request
//     })
//
//     // const text = await response.text()
//     // let displayText = JSON.parse(text)
//     // addItem(displayText) //displaying updated data received from server
// }

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

    const text = await response.text()
    location.reload()
    // let displayText = JSON.parse(text)
    // addItem(displayText) //displaying the updated data received from server

}

//function to populate popup form for updating
async function displayRow(row) {
    //setting the value for input html tag
    document.getElementById("updindex").setAttribute('value', row.getAttribute('data-updindex'))
    document.getElementById("githubid").setAttribute('value', row.getAttribute('data-github'))
    document.getElementById("updproductname").setAttribute('value', row.getAttribute('data-updname'))
    document.getElementById("updpurchasedate").setAttribute('value', row.getAttribute('data-dop'))
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