function socketMessages(socket){
    console.log("Started")
    socket.on("statusChange", (data) =>{
        console.log(data)
        document.getElementById("status").innerText = "Status: "+data
    })

    socket.on("Time",(newTime) => {
        document.getElementById("time").innerText = "Current time: " + newTime
    })

    socket.on("setTrigger",(trigger) => {
        document.getElementById("trigger").innerText = "Trigger @: " + trigger
    })

    socket.on("setOnTime",(newOnTime) => {
        document.getElementById("onTime").innerText = "On Time: " + newOnTime
    })

    socket.on("setOffTime",(newOffTime) => {
        document.getElementById("offTime").innerText = "Off Time: " + newOffTime
    })
}

module.exports = socketMessages