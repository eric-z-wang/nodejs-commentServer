                                          node.js Comment Server
      

- A server that handles user comments and displays them in a tree like structure







DataStructure and Manual:

JSONdatabase is a json array with multiple objects of topics.

Topic:
Each of the topic is a listed array with multiple objects, where it consist of topic id, link, vote, # of comments, and reply. They are sorted based on the vote #, where the highest vote # the topic have, will be at the top of the topic list. The vote # of the topic is based on the sum of all the reply votes it recieves.

Reply: 
Each replies is another listed array with multiple objects, where it consist of text, ID, vote, and more list of replies if applicable. The vote # is based on how many times this reply got liked by a user. The replies are also sorted by having the highest vote # reply at the top. The replies are also threaded in the way that if I replied to "reply A" I will be considered as a sublist inside of "reply A".

Vote:
Vote is just a number generated when a user clicks Like on the reply.

Comments: 
Clicking the "comment" text will Expand all the replies, if they were colllapsed. Does not work the other way around.


Manual:

1) type the path to the node file and run it with the server.js
2) type: pathtonode server.js
3) open browser: type localhost:31160 in the browser bar

4) To post a topic, just use the text box on the right with a 140 elements limit. Then post a link with the "http://" format. Click Add My Topic. The topic will appear on the topic list on the left.
5) Next to the topic is a blue link, where if you click on it, the browser will get redirected to that link.

6) If you click reply, you can add a comment to either the topic or to another comments.
7) If you click the "comments" text next to the "reply" text, it will  expand the comment on that topic.
8) Clicking the "Like" button next to a reply, you will add a vote to that reply comment, as well as add increment the topic vote.

