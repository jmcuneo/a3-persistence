const colors = ["Pink", "Red", "Orange", "Blue", "Purple", "Yellow", "Lavender", "Turquoise", "Green", "Pink Velvet", "Lighter Green", "Purpley"]
const color_values = ["pink", "crimson", "orange", "skyblue", "purple", "palegoldenrod", "lavender", "turquoise", "#007F00", "#FFAACC", "#CCFFCC", "#CCAAEE"]
let color_idx = 0;

//very insecure 
let username = window.location.href.split('=')[1];

let tool = 0;


const set_coloridx = (new_idx) => {
    color_idx = new_idx;
    const picker = document.getElementById("color_pick");
    picker.style.backgroundColor = color_values[color_idx];

    const lboard = document.getElementById("color_header");
    lboard.innerHTML = colors[color_idx];
}

const load_colors = function () {
    const colorholder = document.getElementById("color_holder");
    let i = 0;
    for(i = 0; i < colors.length; i++) {
        const color = document.createElement("div");
        color.className = "color";
        color.style.backgroundColor = color_values[i];
        color.id = colors[i];
        const hard_idx = i;
        color.addEventListener("mousedown", (ev) => {
            console.log("Clicked .." + hard_idx);
            set_coloridx(hard_idx);
        })
        colorholder.appendChild(color);
    }
}

const use_tool = function (tIDX, self, other) {
    const mul = tIDX == tool ? 0 : 1;
    self.className = tIDX == tool ? "" : "tool_sel";
    other.className = "";
    tool = tIDX*mul;
    console.log(tool)
}

const handle_boxclick = async function () {
    const id = this.id.split('_')[1];
    const body = JSON.stringify({user: username, id: id, color: colors[color_idx]});
    switch(tool) {
        case 1: fetch("/rmv_box", {method: "POST", body:body});
                this.remove();
                break;
        case 2: fetch("/paint_box", {method: "POST", body:body});
                this.style.backgroundColor = color_values[color_idx];
                break;
    }
}

const addbox = async function () {
    const json = {
        user: username,
        color: colors[color_idx]
    }, body = JSON.stringify(json);
    const response = await fetch( "/add_box", {
        method: "POST",
        body: body,
      });
      load_boxes();
}

const load_boxes = async function () {
    const body = JSON.stringify({user: username})
    const response = await fetch( "/get_boxes", {
        method: "POST",
        body: body
      })
      const r_json = await response.json();
      const box_cont = document.getElementById("box_area");
      box_cont.replaceChildren([]);
      console.log(r_json);
      r_json.forEach((box) => {
        const new_box = document.createElement("div");
        new_box.className = "box";
        console.log(color_values[colors.indexOf(box.color)]);
        new_box.style.backgroundColor = color_values[colors.indexOf(box.color)];
        new_box.id = "box_" + box.id;
        new_box.addEventListener("mousedown", handle_boxclick)
        box_cont.appendChild(new_box);
      });
      const button_box = document.createElement("button");
      button_box.className = "box add_box";
      button_box.innerHTML = "+";
      button_box.addEventListener("mousedown", addbox);
      box_cont.appendChild(button_box);
}

const logout = function () {
    window.location.href = '/'
}

const update_leaderboard = async function () {
    const response = await fetch( "/get_scores", {
        method: "GET"
      })
    const json = await response.json();
    const table = document.getElementById("leaderboard");
    let header = table.children.item(0);
    //console.log(header);
    table.replaceChildren([]);
    table.appendChild(header);
    json.forEach((user) => {
        let tr = document.createElement("tr");
        let userd = document.createElement("td")
        let scored = document.createElement("td")
        userd.innerHTML = user.user;
        scored.innerHTML = user.score;
        tr.appendChild(userd);
        tr.appendChild(scored);
        table.appendChild(tr);
    })
}

load_colors();
load_boxes();
update_leaderboard();
setInterval(update_leaderboard, 5000);