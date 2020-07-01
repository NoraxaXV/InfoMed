const express = require("express");
const fs = require("fs");
const Vue = require("vue");

const renderer = require("vue-server-renderer").createRenderer({
	template: require("fs").readFileSync("./www/index.template.html", "utf-8")
});

const app = express();

let database = require("./database.json");

function renderPage(res, data, context, template) {
  let app = new Vue({
		data: data,
		template: fs.readFileSync(template, "utf-8")
	});

	renderer.renderToString(app, context, function(err, html) {
		if (err) {
			res.status(500).end("Internal Server Error");
			console.log(`ERROR RENDERING VUE JS: \n  ${err}`);
			return;
		}

		res.send(html);
	});
}

app.use("/", express.static("www"));

app.get("/explore", function(req, res){
  renderPage(
		res,
		{ database: database, search_key: "Explore All" },
		{ title: "InfoMed: Explore"},
		"./www/explore/search.html"
	);
});

app.get("/explore/:key", function(req, res) {
  let key = req.params.key;
  let filteredData = [];
  
  database.forEach(function(med){
    let name = med.name;
    if(name.toLowerCase().indexOf(key.toLowerCase()) !== -1){
      filteredData.push(med);
    }
  });

  renderPage(
		res,
		{ database: filteredData, search_key: req.params.key },
		{ title: "InfoMed: Get the Info On " + req.params.key },
		"./www/explore/search.html"
	);
});

app.get("/medicine/:key", function(req, res) {
	let medicine = null;

	database.forEach(function(x) {
		if (x.name === req.params.key) {
			medicine = x;
			return;
		}
	});
	console.log(medicine);

	renderPage(
    res, 
    {medicine: medicine}, 
    {title: "InfoMed: "+req.params.key},
    "./www/medicine/medicine.html"
  );
});

app.listen(3000, () => {
	console.log("server started, __dirname=" + __dirname);
});
