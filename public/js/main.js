// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
    event.preventDefault();
  
  const input = document.querySelector( "form" ),
        json = { name: input.name.value, dob: input.dob.value, class: input.class.value, major: input.major.value };

  const response = await fetch( "/submit", {
    method:"POST",
    body: JSON.stringify( json )
  })

  const appdata = await response.json();
  update(appdata);

  //console.log( "App data:", appdata )
}

update = function(data) {
  var tr, td;
  var tbody = document.createElement('tbody');

  for (var i = 0; i < data.length; i++) {
      tr = tbody.insertRow(tbody.rows.length);

      td = tr.insertCell();
      td.innerHTML = data[i].name;
      td = tr.insertCell();
      td.innerHTML = data[i].age;
      td = tr.insertCell();
      td.innerHTML = data[i].class;
      td = tr.insertCell();
      td.innerHTML = data[i].major;
      td = tr.insertCell();
      td.innerHTML = '<input type="checkbox" name="delete" value="delete">';
  }
  document.querySelector("table").lastChild.replaceWith(tbody);
}

const deleteRows = async function() {
  var rows = [];
  const tdlist = document.querySelectorAll("td:has(input[value='delete']:checked)");
  tdlist.forEach( (td) => rows.push(td.parentNode.rowIndex));

  const response = await fetch( "/delete", {
    method:"POST",
    body: JSON.stringify( rows )
  })

  const appdata = await response.json()
  update(appdata);

  //console.log( "App data:", appdata )
}

window.onload = function() {
  document.querySelector("#btn_submit").onclick = submit;
  document.querySelector("#btn_delete").onclick = deleteRows;
}