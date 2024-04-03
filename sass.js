const
    fs = require('fs'),
    sass = require('sass'),
    bourbon = require("bourbon");

const result = sass.compile('./sass/main.scss', { loadPaths: bourbon.includePaths, style: "compressed" });
fs.writeFileSync("./public/css/main.css", result.css);