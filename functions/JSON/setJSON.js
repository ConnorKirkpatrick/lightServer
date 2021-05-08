const fs = require("fs")
function setJSON(data){
    fs.writeFile("./data/system_environment.JSON",data,(err) => {
        if(err){console.log(err)}
    })
}

module.exports = setJSON