var express = require("express");
var multer = require('multer');
var app = express();
var serveStatic = require("serve-static");
var done = false;

app.use(multer({ dest: '/var/art-receiver-images/',
                 rename: function (fieldname, filename) {
                     return filename+Date.now();
                 },
                 onFileUploadStart: function (file) {
                     console.log(file.originalname + ' is starting ...')
                 },
                 onFileUploadComplete: function (file) {
                     console.log(file.fieldname + ' uploaded to  ' + file.path)
                     done=true;
                 }
               }));


app.get('/',function(req,res){
    res.sendfile("index.html");
});

app.post('/api/photo',function(req,res){
    if(done==true){
        console.log(req.files);
        res.end("<div class=\"alert alert-success\" role=\"alert\"><p>Kiitos! Kuvan lähetys onnistui!</p> \
<p>Tiedoton nimi: " + req.files['file']['originalname'] + "</p> \
<p>Tiedoston koko: " + Math.round(req.files['file']['size']/1024) + "Kt</p> \
                </p></div>");

    }
});

app.use(express.static('public'));
app.use("/bootstrap", serveStatic(__dirname + "/node_modules/bootstrap"));
app.use("/jquery", serveStatic(__dirname + "/node_modules/jquery"));


app.listen(3000,function(){
    console.log("Working on port 3000");
});
