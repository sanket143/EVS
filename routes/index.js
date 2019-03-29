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
        filePath = files.data[0]["path"];

        var obj = {};
        var results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.render("view", {
                    data: results
                });
        });
    });
})
module.exports = router;