function graph(socket) {
    let myChart;
    let chartArea = document.getElementById("levelsChart").getContext('2d')
    console.log(chartArea)
    socket.emit("getChartData")
    socket.on("chartData", (data) => {
        if(myChart !== undefined){
            myChart.destroy()
        }
        let times = data[0]
        let levels = data[1]
        console.log("GOT DATA")
        console.log(times)
        console.log(levels)
        myChart = new Chart(chartArea, {
            type: "line",
            data: {
                labels: times,
                datasets: [
                    {
                        label: "Light Level",
                        data: levels,
                        backgroundColor: "#ff0000",
                        borderColor: "#7b2bff"
                    }
                    ]
            },
            options: {
                title: {
                    display: true,
                    position: "top",
                    text: "Half-hourly light levels",
                    fontsize: 18,
                    fontcolor: "#ff00f2"
                }
            }
        })
    })
}