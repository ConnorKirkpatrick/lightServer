function newTimeOn(){
    let newTimeOn = document.getElementById("newOnTime")
    let strData = newTimeOn.value;
    let data = strData.split(".")
    data[0] = parseInt(data[0])
    data[1] = parseInt(data[1])
    if((data[0] >= 0 && data[0] < 24) && (data[1] >= 0 && data[1] < 60)) {
        socket.emit("newOnTime", data[0] + ":" + data[1])
        newTimeOn.value = ""
    }
    else{
        newTimeOn.value = "Invalid entry"
    }
}

module.exports = newTimeOn