function addGraphPoint(times, levels, newTime, newLevel){
    if(times.count >= 48){
        times.pop()
        levels.pop()
    }
    times.push(newTime)
    levels.push(newLevel)
}
module.exports = addGraphPoint