function getTime() {
    let date = new Date();
    return date.getHours() + ':' + date.getMinutes();
}
module.exports = getTime