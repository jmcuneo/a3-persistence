const isNumeric = function(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

const add = async function(event) {
    event.preventDefault();

    const nameInput = document.querySelector(".add.name"),
          prepInput = document.querySelector(".add.prep"),
          cookInput = document.querySelector(".add.cook"),
          json = {name: nameInput.value,
                  prep: prepInput.value,
                  cook: cookInput.value},
          body = JSON.stringify(json);

    if (json.name === "" || !isNumeric(json.prep) || !isNumeric(json.cook))
        return;

    const response = await fetch("/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    });

    const text = await response.text();
    nameInput.value = "";
    prepInput.value = "";
    cookInput.value = "";
    document.querySelector("table").innerHTML = text;
};

const remove = async function(event) {
    event.preventDefault();

    const input = document.querySelector("input.remove");
          json = {name: input.value},
          body = JSON.stringify(json);

    const response = await fetch("/remove", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    });

    const text = await response.text();
    input.value = "";
    document.querySelector("table").innerHTML = text;
};

const modify = async function(event) {
    event.preventDefault();

    const nameInput = document.querySelector(".modify.name"),
          prepInput = document.querySelector(".modify.prep"),
          cookInput = document.querySelector(".modify.cook"),
          json = {name: nameInput.value,
                  prep: prepInput.value,
                  cook: cookInput.value},
          body = JSON.stringify(json);

    if (json.name === "" || !isNumeric(json.prep) || !isNumeric(json.cook))
        return;

    const response = await fetch("/modify", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    });

    const text = await response.text();
    nameInput.value = "";
    prepInput.value = "";
    cookInput.value = "";
    document.querySelector("table").innerHTML = text;
};

window.onload = async function() {
    const response = await fetch("/appdata", {
        method: "GET",
        request: "appdata"
    });
    const text = await response.text();
    document.querySelector("table").innerHTML = text;

    document.querySelector("#add").onclick = add;
    document.querySelector("#remove").onclick = remove;
    document.querySelector("#modify").onclick = modify;
};