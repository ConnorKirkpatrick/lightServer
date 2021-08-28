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