function setNewIP(socket){
    socket.on("setIP", (newIP) => {
        document.getElementById("IP").innerText = "IP: " + newIP
    })
}

module.exports = setNewIP