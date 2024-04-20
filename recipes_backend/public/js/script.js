/**
 * This function is called when the user clicks the submit button.
 * It will take the values from the form fields and send them to the server.
 * It sends a POST request to the server with the form data.
 * @param event The submit event.
 * @returns {Promise<void>}
 */
const submit = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();
    let emptyField = null;
    if (document.querySelector("#SuperSpicy")) {
        emptyField = document.querySelector("#SuperSpicy");
    } else if (document.querySelector("#MediumSpicy")){
        emptyField = document.querySelector("#MediumSpicy");
    } else if (document.querySelector("#Sour")) {
        emptyField = document.querySelector("#Sour");
    } else if (document.querySelector("#Sweet")) {
        emptyField = document.querySelector("#Sweet");
    } else {
        emptyField = document.querySelector("#Salty");
    }
    const recipe_name = document.querySelector("#RecipeName"),
        recipe_ingredients = document.querySelector("#Ingredients"),
        recipe_description = document.querySelector("#recipeDescription"),
        dietary_restriction = document.querySelector("#allergen");

    const json = {
        recipe_name: recipe_name.value,
        recipe_ingredients: recipe_ingredients.value,
        recipe_description: recipe_description.value,
        recipe_taste: emptyField.value,
        dietary_restriction: dietary_restriction.value
    };

    const body = JSON.stringify(json); // Explicitly declare the body variable

    console.log("Request body:", body);

    const response = await fetch("/CreateRecipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body// Pass the body variable here
    });
    if (response.status === 200) {
        const response1 = await fetch("/GetRecipe", {
            method: "GET",
        });
        const text = await response1.text();
        await display(JSON.parse(text));
    }
    console.log("Response: ", response);

    const text = await response.text();

    console.log("Response text:", text);

    try {
        const parsedResponse = JSON.parse(text);
        console.log("Parsed response:", parsedResponse);
        await display(parsedResponse); // Await the display function call
    } catch (error) {
        console.error("Error parsing JSON:", error);
        // Handle parsing error, e.g., display an error message to the user
    }
};


/**
 * This function is called when the user clicks the delete button.
 * It sends a DELETE request to the server with the uid of the item to delete.
 * @param uid Unique ID of the item to delete.
 * @returns {Promise<void>}
 */
async function del(uid) {
    console.log(uid)
    const response = await fetch("/DeleteRecipes", {
        method: "DELETE",
        body: JSON.stringify({id: uid}),
        headers: {
            "Content-type": "application/json"
        }
    });
    const text = await response.json();
    console.log(text);
    await display(text);
}

/**
 * This function is called when the user clicks the update button.
 * @param uid Unique ID of the item to update.
 * @returns {Promise<void>}
 */
async function modify(uid) {
    console.log("hello" + document.getElementById("recipe_name_attribute"));
    document.getElementById("RecipeName").value = uid.getAttribute("recipe_name_attribute");
    document.getElementById("Ingredients").value = uid.getAttribute("recipe_ingredients_attribute");
    document.getElementById("recipeDescription").value = uid.getAttribute("recipe_description_attribute");
    document.getElementById("RecipeID").value = uid.getAttribute("recipe_id_attribute");
    const attribute = uid.getAttribute("recipe_taste_attribute");
    console.log("Attribute: ", uid.getAttribute("recipe_taste_attribute"));
    document.getElementById(attribute).value = uid.getAttribute("recipe_taste_attribute");
    document.getElementById("allergen").value = uid.getAttribute("dietary_restriction_attribute");
    document.getElementById("Confirm").style.display = "block";
    document.getElementById("showRecipeID").style.display = "block";
}

/**
 * This function gets the newData from the form fields and sends it to the display function.
 * @returns {Promise<void>}
 * @constructor
 */
async function NewData(){
    // const recipe_name = document.querySelector( "#recipe_name" ),
    //     recipe_ingredients = document.querySelector( "#recipe_ingredients" ),
    //     recipe_description = document.querySelector( "#recipe_description" ),
    //     recipe_taste = document.querySelector( "#recipe_taste" ),
    //     dietary_restriction = document.querySelector("#allergen"),
    //
    //
    // const json = {
    //     recipe_name: recipe_name.value,
    //     recipe_ingredients: recipe_ingredients.value,
    //     recipe_description: recipe_description.value,
    //     recipe_taste: recipe_taste.value,
    //
    // }
    //     body = JSON.stringify( json )
    // const response = await fetch("/submit", {
    //     method: "PUT",
    //     body
    // });
    let emptyField = null;
    if (document.querySelector("#SuperSpicy")) {
        emptyField = document.querySelector("#SuperSpicy");
    } else if (document.querySelector("#MediumSpicy")){
        emptyField = document.querySelector("#MediumSpicy");
    } else if (document.querySelector("#Sour")) {
        emptyField = document.querySelector("#Sour");
    } else if (document.querySelector("#Sweet")) {
        emptyField = document.querySelector("#Sweet");
    } else {
        emptyField = document.querySelector("#Salty");
    }
    const recipe_name = document.querySelector("#RecipeName"),
        recipe_ingredients = document.querySelector("#Ingredients"),
        recipe_description = document.querySelector("#recipeDescription"),
        dietary_restriction = document.querySelector("#allergen"),
        recipe_id = document.querySelector("#RecipeID");
    const json = {
        recipe_name: recipe_name.value,
        recipe_ingredients: recipe_ingredients.value,
        recipe_description: recipe_description.value,
        recipe_taste: emptyField.value,
        dietary_restriction: dietary_restriction.value,
        recipe_id: recipe_id.value
    };

    const body = JSON.stringify(json); // Explicitly declare the body variable

    console.log("Request body:", body);

    const response = await fetch("/UpdateRecipes", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });
    if (response.status === 200) {
        const response1 = await fetch("/GetRecipe", {
            method: "GET",
        });
        const text = await response1.text();
        await display(JSON.parse(text));
    }
    console.log("Response: ", response);

    const text = await response.text();

    console.log("Response text:", text);

    try {
        const parsedResponse = JSON.parse(text);
        console.log("Parsed response:", parsedResponse);
        await display(parsedResponse); // Await the display function call
    } catch (error) {
        console.error("Error parsing JSON:", error);
        // Handle parsing error, e.g., display an error message to the user
    }
    document.getElementById("Confirm").style.display="none";
    // display(JSON.parse(text));
    // console.log("updated here for NewData"+JSON.stringify(text))
}

/**
 * This function displays the data in the table.
 * @param object The object to display in the table.
 * @returns {Promise<void>}
 */
async function display(object) {
    console.log("updated here for display" + JSON.stringify(object));
    let table = document.querySelector("#data_body");
    let elements = ""
    table.innerHTML = " "
    for (let i = 0; i < object.length; i++) {
        elements = `<td>${object[i].recipe_id}</td> <td>${object[i].recipe_name}</td> <td>${object[i].recipe_ingredients}</td>
        <td>${object[i].recipe_description}</td> <td >${object[i].recipe_taste}</td><td>${object[i].dietary_restriction}</td>
         <td><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          value="update" onclick="modify(this)" id="update"
        ${object[i].recipe_id ? `recipe_id_attribute="${object[i].recipe_id}"` : ''}
        ${object[i].recipe_name ? `recipe_name_attribute="${object[i].recipe_name}"` : ''}
        ${object[i].recipe_ingredients ? `recipe_ingredients_attribute="${object[i].recipe_ingredients}"` : ''}
        ${object[i].recipe_description ? `recipe_description_attribute="${object[i].recipe_description}"` : ''}
        ${object[i].recipe_taste ? `recipe_taste_attribute="${object[i].recipe_taste}"` : ''}
        ${object[i].dietary_restriction ? `dietary_restriction_attribute="${object[i].dietary_restriction}"` : ''}
        >Update</button></td>
         <td><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          value="Delete" del_attribute=${i} onclick="del(${object[i].recipe_id})" id="delete">Delete</button></td>`
        let entries = `<tr>${elements}</tr>`
        table.innerHTML += entries;
    }
}

//<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">

/**
 * This function is called when the window loads.
 * It send a GET request to the server to get the data to display.
 * @returns {Promise<void>}
 */
window.onload = async function () {
    const button = document.querySelector("#Submit");
    button.onclick = submit;
    //`/GetRecipe?id=${req.params.id}`
    const response = await fetch("/GetRecipe?id=123", {
        method: "GET",
    });
    const text = await response.text();
    display(JSON.parse(text));
}