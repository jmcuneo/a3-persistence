const
  ivm = require('isolated-vm'),
  isVarName = require('is-var-name'),
  database = require('./database');


// make sure varible name is good
// returns noname# if not
async function ensureVarName(user_id, name) {
  const bad = Array.from("=; \n\r");
  if (!bad.some(c => name.includes(c)) && isVarName(name)) {
    return name
  }
  var index = 1;
  while (true) {
    name = 'noname' + index
    let query = await does_equation_exists(user_id, name);
    if (query) {
      index++;
    } else {
      return name
    }
  }
}

var setupCode = "with(new Proxy($0,{get:(t,p)=>eval(t[p])})){return Number(eval($1)).toString()}";

function does_equation_exists(user_id, name) {
  return database.DB.countDocuments(
    {
      user_id,
      ['equations.' + name]: { $exists: true }
    }, { limit: 1 })
}

function remove_equation(user_id, name) {
  return database.DB.updateOne(
    { user_id },
    { $unset: { ['equations.' + name]: "" } });
}

function replace_equation(user_id, name, new_equation) {
  return database.DB.updateOne(
    { user_id },
    { $set: { ['equations.' + name]: new_equation } });
}

function get_equations(user_id) {
  return database.DB.findOne(
    { user_id }, { projection: { equations: 1 } });
}

// evalute and store varible
async function evaluate(user_id, name, code) {
  try {
    let equations = (await get_equations(user_id)).equations ?? {};
    // delete varible
    if (code == "") {
      if (name != "") {
        await remove_equation(user_id, name)
        delete equations[name]
      }
      // add new or replace varible
    } else {
      var iso = new ivm.Isolate();
      let new_name = await ensureVarName(user_id, name)

      let vars = Object.entries(equations).reduce((a, ent) => (a[ent[0]] = ent[1].result, a), {});
      delete vars[new_name]
      // run code in isolation *hopefully*
      let result = await iso.createContextSync().evalClosure(setupCode, [vars, code],
        { timeout: 5000, arguments: { copy: true }, result: { copy: true } })
        // get result or error
        .then(result => result,
          err => `Error("${err.message}")`)
      // replace equation
      let obj = { code, result }
      await replace_equation(user_id, new_name, obj)
      equations[new_name] = obj;
    }
    return equations;
  } catch (err) {
    console.log(err);
    return {}
  }
}

module.exports = { evaluate }