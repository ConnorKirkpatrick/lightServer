function newTimeOff(){
    let newTimeOff = document.getElementById("newOffTime")
    let strData = newTimeOff.value;
    let data = strData.split(".")
    data[0] = parseInt(data[0])
    data[1] = parseInt(data[1])
    if((data[0] >= 0 && data[0] < 24) && (data[1] >= 0 && data[1] < 60)) {
        if(data[0]<10){data[0] = "0"+data[0]}
        if(data[1]<10){data[1] = "0"+data[1]}
        socket.emit("newOffTime", data[0] + ":" + data[1])
        newTimeOff.value = ""
    }
    else{
        newTimeOff.value = "Invalid entry"
    }
}