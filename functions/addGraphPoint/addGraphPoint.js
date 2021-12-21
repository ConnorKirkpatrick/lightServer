function addGraphPoint(times, levels, newTime, newLevel, io){
    if(times.length >= 48){
        times.shift()
        levels.shift()
    }
    times.push(newTime)
    levels.push(newLevel)
    io.sockets.emit("chartData",([times,levels]))
}
module.exports = addGraphPoint