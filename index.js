
var old_id = -1;
function loadReplies(topicId){
 /**
 * Load all the replies inside the topic based on topicId
 */
	hideCommentBox();
	old_id = -1;
	var path = '/comments' + topicId;
	$.get(path, function (json){
		var parsed = $.parseJSON(json);
		var parsed = parsed.sort(mycomparator);
		var id = 'commentSection'+topicId
		$('#'+id).empty();
		$.each(parsed, function(index, value){
			recurse(topicId, value);
		});
	});
}

function recurse(ID, sublist){
 /**
 * Recursively append replies to the page
 */
	if (sublist.ID==undefined){
		return;
	}
	else{
		$('#commentSection'+ID).append('<div id='+sublist.ID+' class="comment">'+sublist.Text+'</div>');
		$('#'+sublist.ID).append('<br><span id="vote'+sublist.ID+'" class="vote"> '+sublist.Vote+' votes </span>&nbsp;&nbsp;');
		$('#'+sublist.ID).append('<span id="replyButton'+sublist.ID+'" onclick=showCommentBox("'+sublist.ID+'") class="reply">Reply</span>&nbsp;&nbsp;&nbsp;&nbsp;');
		$('#'+sublist.ID).append('<span id="voteButton'+sublist.ID+'" onclick=voteUp("'+sublist.ID+'") class="voteup">like</span>');
		$('#'+sublist.ID).append('<div id="commentSection'+sublist.ID+'"></div>');
		$.each(sublist.replies, function(index, value){
			recurse(sublist.ID, value);
		});
	}
}

function voteUp(id) {
 /**
 * Post to server with /voteup  request to increase the vote count 
 */
	$.post('/voteup', ""+id);
	refreshPage();
	loadReplies(id.split('-')[0]);
}

function hideCommentBox(){
 /**
 * Hides the comment box from view 
 */  
	$('#active').remove();
}

function showCommentBox(id){
 /**
 * Given an id, show the comment box and the reply button 
 */
	hideCommentBox();
	if (old_id != id) {
		$('#'+id).append('<div id="active"></div>'); 
		$('#active').append('<button id="replybutton" onclick=addReply("'+id+'")>Post</button>');
		$('#active').append('<textarea id="replybox" rows="2" cols="50"></textarea>');
		old_id = id
	} else {
		old_id = -1;
	}
}

function addReply(e) {
 /**
 * Post to server with /postreply  request to post the reply
 */
	var id = "replybox";
	var replyInfo = document.getElementById(id);
	var querystring = "ID="+e+"&Reply="+replyInfo.value;
	$.post('/postReply', querystring);
	refreshPage();
	loadReplies(e.split('-')[0]);
}

function mycomparator(a,b) {
 /**
 * A function for sorting of a JSON database in descending order by Vote
 */
  return parseInt(b.Vote) - parseInt(a.Vote);
}
function refreshPage(){
 /**
 * Refreshes the page by reloading the topiclist
 */
	$.get('/alltopics', function (json) {
		var parsed = $.parseJSON(json).Topics;
		var sorted = parsed.sort(mycomparator);
		$('#topiclist').empty();
		for(var i=0; i<sorted.length; i++){
			loadTopic(i, sorted);
		}
	});
}

function loadTopic(e, parsed) {	
 /**
 * loads the topic indexed by "e" in the JSONDatabase in server
 */
	$('#'+parsed[e].ID).remove();
	$('#topiclist').append('<div id =' +parsed[e].ID+ ' class="topic">'+parsed[e].Title+'</div>');
	$('#'+parsed[e].ID).append('&nbsp;&nbsp;&nbsp;<a class="link" href="'+parsed[e].Link+'">('+parsed[e].Link+')</a><br>');
	$('#'+parsed[e].ID).append('<span id="vote'+parsed[e].ID+'" class="vote"> '+parsed[e].Vote+' votes </span>&nbsp;&nbsp;&nbsp;');
	$('#'+parsed[e].ID).append('<span id="replyButton' +parsed[e].ID+'"onclick=showCommentBox("'+parsed[e].ID+'") class="reply">Reply</span>&nbsp;&nbsp;&nbsp;');
	$('#'+parsed[e].ID).append('<span id="commentButton'+parsed[e].ID+'"onclick=loadReplies("'+parsed[e].ID+'") class="commentButton">'+parsed[e].comments+' comments</span>');
	$('#'+parsed[e].ID).append('<div id="commentSection'+parsed[e].ID+'"></div>');
}

function addTopic(){
 /**
 * Adds the topic to the JSONDatabased in the server
 */
	$.get('/alltopics', function (json) {
		var parsed = $.parseJSON(json).Topics;
		var len = parsed.length;
		var topicTitle = document.getElementById("topic");
		var link = document.getElementById("addlink");
		if (link.value == ''){
			alert("Please enter link");
		}
		else if (link.value.substring(0, 7) !== 'http://' && link.value.substring(0, 8) !== 'https://'){
			alert("Pprovide a valid http:// or https:// link");
		}
		else{
			var querystring = "ID="+len+"&Title="+topicTitle.value+"&Link="+link.value; 
			$.post('/postTopic', querystring);
			refreshPage();
			loadTopic(len, parsed);
		}
	});  
};
