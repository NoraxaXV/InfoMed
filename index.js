const express = require("express");
const fs = require("fs");
const Vue = require("vue");

const renderer = require("vue-server-renderer").createRenderer({
	template: require("fs").readFileSync("./public/index.template.html", "utf-8")
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

function getMedicine(name){
	let medicine = null;

	database.forEach(function(x) {
		if (x.name === name) {
			medicine = x;
			return;
		}
	});
	return medicine;
}

function updateDatabase(newDatabase){
	fs.writeFile('./database.json', JSON.stringify(newDatabase, undefined, 2), function(err){
		if (err) throw err;
		console.log("Wrote to database.json");
	});
};

app.use("/", express.static("public"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/explore", function(req, res){
  renderPage(
		res,
		{ database: database, search_key: "Explore All" },
		{ title: "InfoMed: Explore"},
		"./public/explore/search.html"
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
		"./public/explore/search.html"
	);
});

app.get("/medicine/:key", function(req, res) {
	let medicine = getMedicine(req.params.key);

	renderPage(
    res, 
		{medicine: medicine}, 
    {title: "InfoMed: "+req.params.key},
    "./public/medicine/medicine.html"
  );
});

app.post("/medicine/:key/comment", function(req, res){

	console.log(`Comment incoming, by ${req.body.name} for ${req.params.key}: \n${req.body.text}`);
	
	let medicine = getMedicine(req.params.key);
	let index = database.indexOf(medicine);

	medicine.comments.push(req.body.name+" - "+req.body.text);
	database[index] = medicine;

	updateDatabase(database);

	res.redirect("/medicine/"+req.params.key);
});

app.listen(3000, () => {
	console.log("server started, __dirname=" + __dirname);
});
