// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  // const input = document.querySelector( "#yourname" ),
  const input_model = document.querySelector( "#model" ),
        input_year = document.querySelector( "#year" ),
        input_mpg = document.querySelector( "#mpg" ),
        input_shelf_life = document.querySelector( "#shelf_life" ),
        // json = { yourname: input.value },
        json =   { "model": input_model.value,
                    "year": parseInt(input_year.value), 
                    "mpg": parseInt(input_mpg.value), 
                    "shelf_life": parseInt(input_shelf_life.value), 
                    "expire_year": parseInt(input_year.value) + parseInt(input_shelf_life.value) },
        body = JSON.stringify( json )
  console.log(input_year)

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.text()

  console.log( "text:", text )


  update_data(event)


}



const update_data = async function fetchAppData( event ) {
  event.preventDefault()

  try {
      const response = await fetch('/appdata',{
        method:"GET"}); // Use the fetch API to get the data
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse the JSON data
      console.log(data)
      // Display the data
      // let data_table = document.getElementById("show_data")
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
          <div>Car Model</div>
          <div>Year of Production</div>
          <div>MPG</div>
          <div>Shelf Life</div>
          <div>Year of Expiration</div>`;
      data_table.appendChild(data_title)

      // // document.getElementById("show_data").textContent = JSON.stringify(data, null, 2);
      // for (let i = 1; i < data_table.children.length; i++) {
      //   data_table.removeChild(data_table.children[i])
      // }
      for (let ii = 0; ii < data.length; ii++) {
        let new_div = Object.assign(document.createElement("div"), {className: "each_data"})
        data_table.appendChild(new_div)
        for (let key in data[ii]) {
          let element_div = document.createElement("div")
          new_div.appendChild(element_div)
          element_div.textContent = data[ii][key]
        }
      }
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
  }
}



window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
  // button.onclick = update_data;
}