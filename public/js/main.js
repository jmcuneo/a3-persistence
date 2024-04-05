// FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  const input = document.querySelector( "#yourname" ),

        json = { username: localStorage.getItem("userName"),
          yourname: input.value,
          breakfast: parseInt(localStorage.getItem("Breakfast")),
          coffee: parseInt(localStorage.getItem("Coffee")),

        },
        body = JSON.stringify( json ) //turns to string and put through the network

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  }).then(response => response.json()).then(function(json) {
    console.log(json)
  })


  let orderForm = document.getElementById("order");

  orderForm.remove();
}

const add = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  //Check if the element exists, if so set #ordered to +=1
  let selected = document.getElementById("itemSelect");

  let text = selected.options[selected.selectedIndex].text;
  if(selected.options[selected.selectedIndex].value === "0"){
      
  }
  else{
    localStorage.setItem(text, parseInt(localStorage.getItem(text)) +1);

    if(document.getElementById(text) === null){
      //Adds the item to the order form
      let item = document.createElement("div");
      item.setAttribute("id", text);

      item.innerHTML = text.concat(" ") + localStorage.getItem(text);

      let remove = document.createElement('button');
      //Button to remove order items after adding
      remove.addEventListener('click', function(){
        item.remove();
      });
      remove.innerText = "Remove item";
      item.appendChild(remove);
      
      document.querySelector("#order").appendChild(item);  

    }else{
    let item = document.getElementById(text);

    item.innerHTML =  text.concat(" ") + localStorage.getItem(text);
    let remove = document.createElement('button');
    //Button to remove order items after adding
    remove.addEventListener('click', function(){
      item.remove();
    });
    remove.innerText = "Remove item";
    item.appendChild(remove);
}
  }
  selected.value = 0; 
}

const startNewOrder = function(event){
  //Creates a new order form
  let orderForm = document.getElementById("order");

  if(!(orderForm === null)){
    orderForm.remove();
  }
    let order = document.createElement("form");
    order.setAttribute("id",  "order");


    let itemSelect = document.createElement("select");
    itemSelect.setAttribute('id', 'itemSelect');
    itemSelect.setAttribute("name", "Add item to order");

    let item = document.createElement("option");
    item.innerText = "Add item to order";
    item.value = 0;
    item.disabled = true;
    item.selected = true;
    item.hidden = true;
    itemSelect.appendChild(item);

    let breakfast = document.createElement("option");
    breakfast.innerText = "Breakfast";
    breakfast.value = 1;
    itemSelect.appendChild(breakfast);
    localStorage.setItem("Breakfast", 0);

    let coffee = document.createElement("option");
    coffee.innerText = "Coffee";
    coffee.value = 2;
    itemSelect.appendChild(coffee);
    localStorage.setItem("Coffee", 0);

    let text = document.createElement('input');
    text.setAttribute('id', 'yourname');
    text.setAttribute('placeholder', "Name for the order")

    let submitButton = document.createElement("button");
    submitButton.setAttribute('id', 'submit');
    submitButton.innerText = "submit";
    submitButton.onclick = submit;

    order.appendChild(itemSelect);
    order.appendChild(text);
    order.appendChild(submitButton);
    
    let check = document.getElementById("orders");
    document.body.append(order);
    const button = document.querySelector("#itemSelect");
    button.onclick = add;
} 

const checkOrders = function(event){
  //Change page bttn, should write to recieve url string
  const response = fetch( "results.html", {
    method:"GET",
  }).then(response => window.location.href = response.url).then(response => console.log(response.url))
} 

window.onload = function(){
  //window.location.href = '/login.html';
}
