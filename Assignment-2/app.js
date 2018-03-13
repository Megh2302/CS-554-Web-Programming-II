var express=require('express');
var app=express();

app.use(express.static("src"));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/src/index.html");
});
app.get("*", (req,res)=>{
    res.status(404).send('404: Page not Found');
});

app.listen(3000, ()=>{
console.log("Server running on localhost:3000");
console.log("Your routes will be running on http://localhost:3000");
});

