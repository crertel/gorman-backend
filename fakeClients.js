var http = require("http");
var argv = process.argv.slice(2);

var aolat = 30.0;
var aolong = 90.0;

var createOpts = function(group) {
    return  {
        method: "POST",
        headers: { "Content-type" : "application/json"},
        host: argv[0],
        path: "/api/1.0.0/groups/" + group +"/units",
        port: argv[1]
    };
};

var updateOpts = function(group,unit) {
    var path =  "/api/1.0.0/groups/" + group +"/units/"+unit;
    console.log(path);
    return  {
        method: "PUT",
        headers: { "Content-type" : "application/json"},
        host: argv[0],
        path: path,
        port: argv[1]
    };
};

function updateClient( unit, token,  group ) {
    var updateDesc = {
        bearing: Math.random() * 360.0,
        lat: aolat + Math.random()*0.00001,
        long: aolong + Math.random()*0.00001,
        token: token
    };
    
    var req = http.request( updateOpts(group,unit), function(res){
        res.setEncoding("utf-8");
        var response = "";
        res.on('data', function(data) {
            response += data;
        });
        res.on("end", function() {
            var reply = JSON.parse(response);
        });
    });
    req.write( JSON.stringify(updateDesc));
    req.end();
};

function startClient( name, group ) {
    var clientDesc = {
        name: name,
        bearing: 0.0,
        lat: aolat,
        long: aolong,
        key: "key"
    };
    
    var req = http.request( createOpts(group), function(res){
        res.setEncoding("utf-8");
        var response = "";
        res.on('data', function(data) {
            response += data;
        });
        res.on("end", function() {
            var reply = JSON.parse(response);
            console.log("Confirmed unit "+reply.id+ "\n" + response);            
            setInterval(function(){updateClient(reply.id, reply.token,  group)},2500);
        });
    });
    req.write( JSON.stringify(clientDesc));
    req.end();
};

startClient("chris", argv[2]);
//startClient("jim", argv[2]);
//startClient("paul", argv[2]);
//startClient("jeff", argv[2]);