function newIP(){
    let IPForm = document.getElementById("newIP")
    let IP = IPForm.value
    let octets = IP.split(".")
    if(octets.length !== 4){IPForm.value = "Invalid address";return}
    for( let octet in octets){
        let data = parseInt(octets[octet])
        if(!(data >= 0 && data <=255)){
            IPForm.value = "Invalid address"
            return
        }
    }
    socket.emit("newIP",IP)
}