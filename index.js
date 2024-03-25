//following https://www.youtube.com/watch?v=wxbQP1LMZsw and the course containing it
const fs = require('fs')
function save(data){
    fs.writeFileSync("./data.json",JSON.stringify(data,null,"  "))
}
const express = require('express');
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}))

/*
app.get('/api', (request, response) => {
    response.json({ test:123 })
})
*/

app.post("/api", (request, response) => {
    console.log("recieved request")
    console.log(request.body)
    const data = request.body;
    save(data)
    console.log("data saved")
});

app.post("/api-temp", (request,response) => {
    console.log("recieved request (temp)")
    console.log(request.body)
    const data = request.body
    fs.writeFileSync("./public/storage.json",JSON.stringify(data,null,"  "))
    console.log("data (temp) saved")
})