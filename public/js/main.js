
// const data_base = [
//     {"user": "testuser", "password": "test", "ready": true, "age": 20},
//     {"user": "testuser2", "password": "test2", "ready": true, "age": 20},
// ]

// const user_obj = data_base.

const data_base = [
    {"user": "testuser", "password": "test", "ready": true, "age": 20},
    {"user": "testuser2", "password": "test2", "ready": true, "age": 20},
  ]
  

async function fetchAllData( ) {  
    try {
        const response = await fetch('/docs',{
          method:"GET"}); // Use the fetch API to get the data
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json(); // Parse the JSON data

        console.log(data)
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


async function fetchUserData( ) {  
    try {
        const response = await fetch('/user_data',{
          method:"GET"}); // Use the fetch API to get the data
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json(); // Parse the JSON data

        console.log(data)
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
    return data
}



function displayData (data) {
    console.log(`DISPLAY:\n${data}`)
    try{
        document.body.removeChild(document.getElementById("show_data"))
    } catch (e) {
        console.log(e.message)
    }
        
    let data_table = document.body.appendChild(Object.assign(document.createElement("div"), {id: "show_data"}))
    // let data_table = document.getElementById("show_data")
    // console.log(data_table)
    var data_title = document.createElement("div");
    data_title.className = "each_data";
    data_title.innerHTML = `
        <div>User</div>
        <div>Ready</div>
        <div>Age</div>
        <div>EDIT?</div>
        <div>REMOVE?</div>
        `
        
    data_table.appendChild(data_title)

    for (let ii = 0; ii < data.length; ii++) {
        let new_div = Object.assign(document.createElement("div"), {className: "each_data"})
        data_table.appendChild(new_div)
        for (let key in data[ii]) {
            if (key !== "_id" && key !== "password") {
                let element_div = document.createElement("div")
                new_div.appendChild(element_div)
                element_div.textContent = data[ii][key]
            }
        }
        edit_div = document.createElement("div")
        new_div.appendChild(edit_div)

        edit_button = document.createElement("button")
        edit_button.textContent = ":)"
        edit_button.onclick = () => editData(data[ii])
        edit_div.appendChild(edit_button)

        delete_div = document.createElement("div")
        new_div.appendChild(delete_div)
        delete_button = document.createElement("button")
        delete_button.textContent = ":("
        delete_button.onclick = () => removeData(data[ii])
        delete_div.appendChild(delete_button)
    }
    // } catch (error) {
    //     console.error('There has been a problem with your fetch operation:', error);
    // }
}


async function removeData(data) {
    data_id = data["_id"]
    console.log(`Remove ${data_id}`)

    const msg = JSON.stringify({"_id": data_id})

    const response = await fetch("/delete_from_db", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: msg
    });
    displayData(await fetchUserData())

}

function editData(data) {
    console.log(`EDIT ${data}`)

    document.getElementById("ready").checked = data["ready"]
    document.getElementById("age").value = data["age"]
    removeData(data)

}




// async function fetchUserID() {

// }







const addData = async (event) => {
    event.preventDefault()
    console.log("add data")

    // const user_obj = await fetchUserData()

    const input_ready = document.getElementById("ready").checked
    const input_age = parseInt(document.getElementById("age").value)


    const msg = JSON.stringify({"ready": input_ready, "age": input_age})
    console.log(`MSG:\t${msg}`)
    try {
        // const response = await fetch(
        //     "/add_to_db", 
        //     {method:"POST", 
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     msg})

        // console.log(response)
 
        // debugger;
        const response = await fetch("/add_to_db", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: msg
        });

        // if (!response.ok) {
        //     const errorText = await response.text(); // or response.json() if the server sends JSON
        //     console.error("Error in response:", errorText);
        //     throw new Error('Network response was not ok');
        // }
        
        const data = await response.json(); // Assuming the server responds with JSON
        console.log(data); // Process your data

        // const responseData = await response.json(); // Assuming the response is JSON
        // console.log("Add data, response\t", response);


        displayData(await fetchUserData())
    } catch (e) {
        console.log(e.message)

    
    }

}



window.onload = function() {
    const button = document.getElementById("add_to_db_button");
//    button.onclick = submit;
    button.onclick = addData;

}
