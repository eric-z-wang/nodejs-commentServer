/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


http = require('http');
fs = require('fs');
path = require('path');
var qs = require('querystring');

PORT = 31160;

/* format of Topics....
 * {"ID":"0", "Title":"INTERESTING", "Link":"google.com", "Vote":"1", "replies":[
 * {"Text":"0x0","ID":"0-0","Vote":"0","replies":[{"Text":"0x0x0", *  "ID":"0-0-0","Vote":"0","replies":[{"Text":"0x0x0x0","ID":"0-0-0-0","Vote":"0","replies":[]}]},
 * {"Text":"0x0x1","ID":"0-0-1","Vote":"0","replies":[]}]},{"Text":"0x1","ID":"0-1","Vote":"0","replies":[]}]},{
 * 
 * "ID":"13", "Title":"AWESOME STUFF", "Link":"reddit.com", "Vote":"2", "replies":[]}}
 */
var JSONDatabase = {
	"Topics": [
			// {"ID":"0", "Title":"2", "Link":"google.com", "Vote":"0", "replies":[]},
			// {"ID":"1", "Title":"1", "Link":"google.com", "Vote":"1", "replies":[]}
			
	] };
	
MIME_TYPES = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.txt': 'text/plain'
};

function serveFile(filePath, response) {
 /**
 * Reads the file at filePath
 */
	path.exists(filePath, function(exists) {
		if (!exists) {
			response.writeHead(404);
			response.end();
			return;
		}
		
		fs.readFile(filePath, function(error, content) {
			if (error) {
				response.writeHead(500);
				response.end();
				return;
			}
			
			var extension = path.extname(filePath);
			var mimeType = MIME_TYPES[extension];
			response.writeHead(200,
					{'Content-Type': mimeType ? mimeType : 'text/html'});
			response.end(content, 'uft-8');
		});
	});
}

http.createServer(function(request, response) {
	console.log(request.url);
	// Main index
	if (request.url == '/') {
		serveFile('./index.html', response);
	}
	// Serving index.js
	else if (request.url == '/index.js') {
		serveFile('./index.js', response);
	}
	// Serving format.css
	else if (request.url == '/format.css') {
		serveFile('./format.css', response); 
	}
	// Increasing the vote
	else if (request.url == '/inc') {
		vote++;
	}
	// Posting new topic
	else if (request.method == 'POST'){
		// posting a new topic
		if (request.url == '/postTopic') {
			var topicQuery = "";
			// Load topic info.
			request.on('data', function(buf){
				topicQuery += buf;
			});
			// Push the topic info into the JSON.
			request.on('end', function(){
				var data = qs.parse(topicQuery);
				var newNode = {
					"ID" : data.ID,
					"Title" : data.Title,
					"Link" : data.Link,
					"Vote" : 0,
					"comments": 0,
					"replies" : []
				};
				JSONDatabase.Topics.push(newNode);
			});
		 }
	
		else if (request.url == '/postReply'){
			var commentQuery = "";
			// Load reply info.
			request.on('data', function(buf){
				commentQuery += buf;
			});
			// Push the topic info into the JSON.
			request.on('end', function(){
				var content = qs.parse(commentQuery)
				var pathIndex = content.ID.split('-');
				// Find the correct spot for this reply.
				var comment = JSONDatabase.Topics[pathIndex[0]];
				comment.comments++;
				for (var i=1; i<pathIndex.length; i++){
					comment = comment.replies[pathIndex[i]];
				}
				var child = {
					"Text" : content.Reply,
					"ID" : content.ID+ "-" +comment.replies.length,
					"Vote" : 0,
					"replies" : []
				};
				comment.replies.push(child);
				response.end(JSON.stringify(JSONDatabase.Topics));
			});
		}
		else if (request.url == '/voteup') {
			var id = "";
			// Load reply info.
			request.on('data', function(buf){
				id += buf;
			});
			// Push the topic info into the JSON.
			request.on('end', function(){
				console.log(""+id);
				var pathIndex = id.split('-');
				// Find the correct spot for this reply.
				var vote = JSONDatabase.Topics[pathIndex[0]];
				vote.Vote++;
				for (var i=1; i<pathIndex.length; i++){
					vote = vote.replies[pathIndex[i]];
				}
				vote.Vote++;
				response.end(JSON.stringify(JSONDatabase.Topics));
			});
		}
	}
	else if (request.url == '/alltopics')  {
	//Return to the client the JSONDatabase for client to append to webpage
		response.writeHead(200, {'Content-Type':'text/plain'});
		response.end(JSON.stringify(JSONDatabase));
	}
	else if (request.url.substring(0,9) == '/comments'){
	//Processes the comment with topicID, the request would look like /comment1,
	//The server will respond by giving client the replies from topic with ID=1
		var topicID = request.url.substring(9, request.url.length);
		response.writeHead(200, {'Content-Type':'text/plain'});
		var allTopics = JSONDatabase.Topics;
		var i = 0;
		for (i=0; i<allTopics.length; i++){
			if (allTopics[i].ID == topicID){
				response.end(JSON.stringify(allTopics[i].replies));
				console.log(JSON.stringify(allTopics[i].replies));
			}
		}            
	}
	else {
		response.writeHead(404);
		response.end('Resource not found.');
	}
}).listen(PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');

