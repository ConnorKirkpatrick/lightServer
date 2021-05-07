function socketMessages(socket){
    console.log("Started")
    socket.on("statusChange", (data) =>{
        console.log(data)
        document.getElementById("status").innerText = "Status: "+data
    })

    socket.on("Time",(newTime) => {
        console.log(newTime)
        document.getElementById("time").innerText = "Current time: " + newTime
    })
}

module.exports = socketMessages