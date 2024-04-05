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

        console.log(body);

        const response = await fetch( "/api/add", {
          method:"POST",
          headers: { 'Content-Type': 'application/json' }, 
          body 
        })

  const text = await response.text()

  input.value = "";
  if (response.status === 200 ) {
    row = JSON.parse(text);
    addRow(row, document.getElementById('results'));
    }
  }
const logoutFunc = async function( event ) {
  event.preventDefault()
  const response = await fetch( "/logout", {
    method:"GET",
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.status === 200 ) {
    window.location.href = '/login.html';
  }
}



window.onload = function() {
   const submitButton = document.getElementById("submit");
   submitButton.onclick = submit;

  const logout = document.getElementById('logout');
  logout.onclick = logoutFunc;
}
const addRow = function(row, results) {
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
  a.onclick = function() {
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
  td2.appendChild(a);
  tr.appendChild(td2);
  
  let td3 = document.createElement('td');
  let a2 = document.createElement('a');
  a2.href = '#';
  a2.textContent = 'edit';
  a2.onclick = function() {
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
      if (data.success === true) {
        td.textContent = newName;
      } else {
        alert('Failed to edit data');
      }
    });
  };
  td3.appendChild(a2);
  tr.appendChild(td3);

  results.appendChild(tr);
}
document.addEventListener('DOMContentLoaded', (event) => {
  let results = document.getElementById('results');

   //get data from /api/getdata
   fetch('/api/getdata')
   .then(response => response.json())
   .then(data => {
     data.forEach(row => {
      addRow(row, results);
     });
   });
});

// add username to the page
fetch('/api/login/getusername')
.then(response => response.json())
.then(data => {
  document.getElementById('username').textContent = data.username;
});
