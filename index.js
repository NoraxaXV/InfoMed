const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('www'));

app.listen(3000, () => {
    console.log('server started, dirname=' + __dirname);
});