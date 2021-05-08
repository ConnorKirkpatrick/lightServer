const net = require("net")
function connection(){
    const clientSocket = new net.Socket()
    let connection = clientSocket.connect({port: 80, host:"192.168.0.18"}, function(){
        console.log("Connection made")
    })
}

module.exports = connection