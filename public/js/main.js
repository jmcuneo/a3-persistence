// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( "#yourname" ),
        json = { name: input.value },
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.text()

  input.value = "";
  if (response.status === 200 ) {
    row = JSON.parse(text);
    addRow(row);
    }
  }



window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}
const addRow = function(row) {
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  td.textContent = row.name;
  tr.appendChild(td);

  let countTd = document.createElement('td');
  countTd.textContent = row.count;
  tr.appendChild(countTd);

  let date = document.createElement('td');
  date.textContent = new Date(row.addedDate).toLocaleString();
  tr.appendChild(date);
  let td2 = document.createElement('td');
 let a = document.createElement('a');
  a.href = '#';
  a.textContent = 'delete';
  td2.appendChild(a);
  td2.onclick = function() {
    fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({row})
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        tr.remove();
      }
    });
  };
  tr.appendChild(td2);
  
  let td3 = document.createElement('td');
  let a2 = document.createElement('a');
  a2.href = '#';
  a2.textContent = 'edit';
  td3.appendChild(a2);
  td3.onclick = function() {
    let newName = prompt('Enter a new name', row.name);
    if (!newName) {
      return;
    }
    row.newName = newName;
  
    fetch('/api/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({row})
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        td.textContent = newName;
      }
    });
  };
  tr.appendChild(td3);

  results.appendChild(tr);
}

 //get data from /api/getdata
 fetch('/api/getdata')
 .then(response => response.json())
 .then(data => {
   let results = document.getElementById('results');
   data.forEach(row => {
    addRow(row);
   });
 });