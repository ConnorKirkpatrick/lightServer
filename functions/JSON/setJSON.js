const fs = require("fs")
function setJSON(data){
    fs.writeFileSync("./data/system_environment.JSON",data)
}

module.exports = setJSON