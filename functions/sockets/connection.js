const net = require("net")
class connection{
    constructor() {
        const clientSocket = new net.Socket()
        this.connection = clientSocket.connect({port: 80, host:"192.168.0.18"}, function() {
            console.log("Connection made")
        })
    }
    sendMessage(message){
        this.connection.write(message)
    }
    getMesaage(callback){
        this.connection.on("data", (data)=>{
            if(data !== ""){
                return callback(data.toString())
            }
        })
    }

}














/*
function connection(){
    const clientSocket = new net.Socket()
    let connection = clientSocket.connect({port: 80, host:"192.168.0.18"}, function(){
        console.log("Connection made")
        connection.write("This is a test")
    })
}*/

module.exports = connection