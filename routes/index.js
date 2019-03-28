var express = require('express');
const csv = require('csv-parser');
var multiparty = require('multiparty');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/plot", function(req, res, next){
    res.render("plot");
})
router.post("/view", function(req, res, next){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        tempPath = files.temp[0]["path"];
        radiPath = files.radi[0]["path"];
        console.log(tempPath, radiPath);

        var obj = {};
        var results = [];
        fs.createReadStream(tempPath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                obj["temp"] = results;
                results = [];

                fs.createReadStream(radiPath)
                    .pipe(csv())
                    .on("data", (data) => results.push(data))
                    .on("end", () => {
                        obj["radi"] = results;
                        res.render("view", {
                            data: obj
                        });
                    })
        });
    });
})
module.exports = router;