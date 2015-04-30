var express = require("express");
var multer = require('multer');
var app = express();
var serveStatic = require("serve-static");
var done = false;

app.use(multer({ dest: '/var/art-receiver-images/',
                 rename: function (fieldname, filename, req, res) {
                     var username = req.body.name;
                     if (!username) { username = "anonymous"; }
                     username = username.replace(/ /g, '_');
                     username = username.replace(/[^a-zA-Z_]/g, '');

                     filename = filename.replace(/[^a-zA-Z_]/g, '');

                     var date = new Date();
                     var year = date.getFullYear();
                     var month = date.getMonth() + 1;
                     var day = date.getDate();
                     var min = date.getMinutes();
                     var sec = date.getSeconds();

                     return year+ "-" +month+ "-" +day+ "-" +min+sec+ "-" +username+ "-" +filename;
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
