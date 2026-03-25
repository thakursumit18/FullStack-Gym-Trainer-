const express = require('express');
const app = express();
const path = require('path');


//parses
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(Path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("index.ejs");
});

app.listen(3000, function(){
    console.log("its running");
})