const net = require("net")
class connection{
    constructor() {
        const clientSocket = new net.Socket()
        this.connection = clientSocket.connect({port: 80, host:"192.168.0.18"}, function() {
            console.log("Connection made")
        })
    }
    sendMessage(message){
        message = message+"\n"
        console.log("Sent: "+message)
        this.connection.write(message)
    }

    getLevel(callback){
        this.connection.write("LEVEL\n")
        this.connection.removeAllListeners()
        this.connection.on("data", (data)=>{
            if(data.toString() !== ""){
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