function newLevelClicked(){
    let newLvl = document.getElementById("newLevel")
    let level = parseInt(newLvl.value)
    console.log(level)
    if(level<=1024 && level >= 0) {
        socket.emit("newTrigger", level)
        newLvl.value = ""
    }
    else{
        newLvl.value = "Invalid entry, range is 0-1024"
    }
}

module.exports = newLevelClicked

/*
    let strData = newLvl.value;
    let data = strData.split(".")
    data[0] = parseInt(data[0])
    data[1] = parseInt(data[1])
    if((data[0] >= 0 && data[0] < 24) && (data[1] >= 0 && data[1] < 60)) {
        socket.emit("newTrigger", strData)
        newLvl.value = ""
    }
    else{
        newLvl.value = "Invalid entry"
    }
    */