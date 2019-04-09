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
        console.log(files);
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

router.get("/source", function(req, res){
    res.render("source");
})

router.post("/play", function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields ,files){
        console.log(files);

        var obj = {};
        var ra_path = files["ra_value"][0]["path"];
        var temp_path = files["temp_value"][0]["path"];

        fs.readFile(ra_path, {encoding: "utf-8"}, function(err, data){
            if(!err){
                data = data.split("\r\n")
                data = data.map(function(item){
                    item = item.split(" ")
                    item = item.filter(function(i){
                        return i.length;
                    })

                    item = item.map(function(i){
                        return parseFloat(i);
                    })

                    return item;
                })

                data = data.filter(function(item){
                    return item.length;
                });

                obj["radi"] = data;

                fs.readFile(temp_path, {encoding: "utf-8"}, function(err, data){
                    if(!err){;
                        data = data.split("\r\n");
                        data = data.map(function(item){
                            item = item.split(" ");
                            item = item.filter(function(i){
                                return i.length;
                            })

                            item = item.map(function(i){
                                return parseFloat(i);
                            })

                            return item;
                        });
                        
                        data = data.filter(function(item){
                            return item.length;
                        });

                        obj["temp"] = data

                        res.render("new", {
                            data: obj
                        })
                    } else {
                        console.log("Error reading file..");
                    }
                })
            } else {
                console.log("Error reading file..");
            }
        })
    })
})

module.exports = router;