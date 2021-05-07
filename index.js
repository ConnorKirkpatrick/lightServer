const app = require("express")();
const http = require("http").createServer(app);

app.use("/static", express.static(path.join(__dirname, "./static/")));

let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});