const fs = require("fs")
function getJSON(){
    let data = fs.readFileSync("./data/system_environment.JSON")
    data = JSON.parse(data)
    return(data)
}

module.exports = getJSON