const net = require("net")
const getJSON = require("../JSON/getJSON")
const events = require("events")

class connection{
    constructor() {
        this.emitter = new events.EventEmitter()
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
        this.connection.write(message)
        console.log("Sent: "+message)
        this.connection.on("data", (data)=>{
            if(data.toString() !== "" && isNaN(parseInt(data))){
                //message is text based
                if (data.includes("RECIEVED OFF")){
                    this.emitter.emit("TURNED OFF")
                }
                else if(data.includes("RECIEVED ON")) {
                    this.emitter.emit("TURNED ON")
                }
            }
        })

    }

    getLevel(){
        this.connection.write("LEVEL\n")
        this.connection.on("data", (data)=>{
            if(data.toString() !== ""){
                data = parseInt(data)
                if (!isNaN(data)) {
                    this.emitter.emit("newLevel", data.toString())
                }
            }
        })
    }

}

module.exports = connection