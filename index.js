const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('www'));
app.use("/explore", express.static("www/explore"));

app.listen(3000, () => {
    console.log('server started, dirname=' + __dirname);
});


