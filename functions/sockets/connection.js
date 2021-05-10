const net = require("net")
const getJSON = require("../JSON/getJSON")

class connection{
    constructor() {
        this.clientSocket = new net.Socket()
        this.connect()

        this.connection.on("close", function(e){
            console.log("Connection closed: " + e)
            connection.connect()
        })
    }
    connect(){
        console.log("Trying to connect")
        let data = getJSON()
        this.connection = this.clientSocket.connect({port: 81, host:data.IP}, function() {
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
        this.connection.on("data", (data)=>{
            if(data.toString() !== ""){
                return callback(data.toString())
            }
        })
        console.log("SEND REQUEST")
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