

const get_data = async function fetchAppData( event ) {
    event.preventDefault()

    const response = await fetch('/data_base',{method:"GET"}); // Use the fetch API to get the data
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Parse the JSON data
    console.log("data\n", data)
    return data
}

const submit = async function (event) {
    event.preventDefault()

    const data = await get_data(event)

    input_user_name = document.querySelector("#user_name").value
    input_password = document.querySelector("#password").value

    console.log(data)
    console.log(data[0]["user"])
    console.log(data["password"])

    

    // if (input_user_name in data && input_password in data) {
    //     console.log("success")
    // } else {
    //     console.log('Fail: ' + input_user_name + input_password)
    // }
}


window.onload = function() {
    // get_data;
    const button = document.querySelector("button");

    button.onclick = submit;
    // button.onclick = update_data;
}