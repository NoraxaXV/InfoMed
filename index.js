const express = require("express");
const fs = require("fs");
const Vue = require("vue");

const renderer = require("vue-server-renderer").createRenderer({
	template: require("fs").readFileSync("./pages/index.template.html", "utf-8")
});

const app = express();

app.use("/", express.static("www"));

app.get("/explore/:key", function(req, res) {
	let database = require("./database.json");
    
    var app = new Vue({
        data: {database: database},
        template: fs.readFileSync("./pages/search.html", "utf8")
	});

	renderer.renderToString(
		app,
		{ title: "InfoMed: Get the Info On " + req.params.key },
		function(err, html) {

			if (err) {
				res.status(500).end("Internal Server Error");
				console.log(`ERROR RENDERING VUE JS: \n  ${err}`);
				return;
			}

			res.send(html);
		}
	);
});

app.listen(3000, () => {
	console.log("server started, dirname=" + __dirname);
});
