/**setup node.js server**/
var fs = require('fs');
var server = require('http').createServer(function(req, response) {
        fs.readFile(__dirname+'/now_chat.html', function(err, data) {
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write(data);
                response.end();
        });
});

/*
var http = require("http");
var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello\n');
})
*/

server.listen(8080);

/**webremix!**/

var remix = require('webremix');
var url_pattern = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");


/**now.js work**/
//based on https://github.com/Flotype/now/tree/master/examples/helloworld_example

//set up the server
var nowjs = require("now");
var everyone = nowjs.initialize(server);

//chat room vars
var number_users = 0;
var course_name;

nowjs.on("connect", function() {
	/*everyone.count(function(count) {
		everyone.now.updateNumberUsers(count);
	});*/
        number_users++;
        everyone.now.updateNumberUsers(number_users);

        console.log("Joined: "+this.now.name);
        console.log("total users: "+number_users);
        everyone.now.receiveServerMessage("<b><font color='#1a9900'>---"+this.now.name + " has joined---</font></b>");
});

nowjs.on("disconnect", function() {
	/*everyone.count(function(count) {
		everyone.now.updateNumberUsers(count);
	});*/
        number_users--;
	if (number_users<0) {number_users=0;}
        everyone.now.updateNumberUsers(number_users);
        console.log("Left: "+this.now.name);
        console.log("total users: "+number_users);
        everyone.now.receiveServerMessage("<b><font color='#d11111'>---"+this.now.name + " has left---</font></b>");
});

everyone.now.distributeMessage = function(message) {
        var sender_name = this.now.name;
        if (url_pattern.test(message)) {
                remix.generate(message, function(err, resp) {
                        console.log(resp);
                        everyone.now.receiveMessage(sender_name, resp);
                });
        }
        else {
            everyone.now.receiveMessage(this.now.name, message);
        }
};

