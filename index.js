const express = require('express');
const fs = require('fs');
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();


const app = express();

app.use("/", express.static('www'));

app.get("/explore/:key", function(req, res){
    
    var app = new Vue({
        data: require("./database.json"),
        template: fs.readFileSync('./pages/search.html')
    });

    renderer.renderToString(app, function(err, html){
        console.log(html);
        if (err) {
            res.status(500).end('Internal Server Error');
            console.log(err);
            return;
        }
        res.send(html);
    });

    res.send("you sent the follwing key:" + req.params.key);
});

app.listen(3000, () => {
    console.log('server started, dirname=' + __dirname);
});


