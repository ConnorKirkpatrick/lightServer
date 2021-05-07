function toggle(socket){
    socket.emit("toggle");
}
module.exports = toggle