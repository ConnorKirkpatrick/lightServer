function getTime() {
    let date = new Date();
    let hour = date.getHours()
    let min = date.getMinutes()
    if(min < 10){min = "0"+min;}
    return  hour + ':' + min;
}
module.exports = getTime