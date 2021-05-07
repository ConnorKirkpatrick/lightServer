function socketMessages(socket){
    console.log("Started")
    socket.on("statusChange", (data) =>{
        console.log(data)
        document.getElementById("status").innerText = "Status: "+data
    })
}

module.exports = socketMessages