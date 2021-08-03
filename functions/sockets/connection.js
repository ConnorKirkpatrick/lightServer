const net = require("net")
const getJSON = require("../JSON/getJSON")

class connection{
    constructor() {
        this.clientSocket = new net.Socket()
        this.connection = this.connect()
    }
    connect(){
        console.log("Trying to connect")
        this.clientSocket.destroy()
        let data = getJSON()
        this.connection = this.clientSocket.connect({port: 81, host:data.IP}, function() {
            console.log("Connection made")
        })
        return this.connection

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
    }
    getMessage(callback){
        this.connection.on("data", (data)=>{
            if(data.toString() !== ""){
                return callback(data.toString())
            }
        })
    }
}

module.exports = connection