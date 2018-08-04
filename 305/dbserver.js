var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID
var dbUrl = "mongodb://localhost:27017/";

(function() 
 {
	var fs, http, qs, server, url;
	http = require('http');
	url = require('url');
	qs = require('querystring');
	fs = require('fs');
	
	var loginStatus = false, loginUser = "";
	
	server = http.createServer(function(req, res) 
	{
		var action, form, formData, msg, publicPath, urlData, stringMsg;
		urlData = url.parse(req.url, true);
		action = urlData.pathname;
		publicPath = __dirname + "\\public\\";
		console.log(req.url);
		
		
		
				if (action === "/Signup") 
		{
			console.log("signup");
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						user.id = "0";
           
						//msg = JSON.stringify(user);
						//stringMsg = JSON.parse(msg);
            
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
						
						
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						
						var username =splitName[1];
						var password =splitPassword[1];
						
						
						console.log("login="+username);
						console.log("password="+password);
						
            /*
            console.log("split=" + msg[1]);
						
						res.writeHead(200, 
						{
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
            */
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("customers").count({"Name" : username,"Password" : password}, function(err, count)
							{
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									if(err) throw err;
									console.log("user exist");
									db.close();
									return res.end("fail");
								}
								else
								{
									dbo.collection("customers").insertOne({"Name" : username,"Password" : password}, function(err, res) 
									{
										if (err) throw err;
										console.log("1 document inserted");
										db.close();
										//return res.end(msg);
									});
									return res.end("Record inserted");
								}
							});
							
							
							dbo.collection("customers").find({}).toArray(function(err, result) {
							if (err) throw err;
								console.log(result);
								db.close();
							});
						});
					});
				});
				
			} 
			else 
			{
        //form = publicPath + "ajaxSignupForm.html"; 
				form = "login0408.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
    else if( action ==="/newpage")
		{
			res.writeHead(200, 
			{
				"Content-Type": "text/html"
			});
			return res.end("<h1>welcome to new page</h1><p><a href=\"/Signup\">register</a></p>");
		}

    else if (action === "/login0408")
		{
			console.log("login");
			if (req.method === "POST") 
			{
				console.log("action = post");
    
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data server="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempPassword = splitMsg[1];
            
            var splitName = tempSplitName.split("=");
						var splitPassword = tempPassword.split("=");
            //04082018
            var username =splitName[1];
						var password =splitPassword[1];
            //04082018
					  //var searchDB = "Name : " + splitName[1];
            console.log("login="+username);
						console.log("password="+password);
            
            /* 04082018
						console.log("mess="+msg);
						console.log("mess="+formData);
						console.log("user=" + splitName[1] + ", password=" + splitPassword[1]);
            */
						//console.log("split=" + msg[1]);
						//console.log("search=" + searchDB);
            //04082018
            /*
						res.writeHead(200, 
						{
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
            */
				   // return res.end("hi iam logins");
        
            
            // 1. connect mongo db
            MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
              dbo.collection("customers").count({"Name" : username, "Password" : password}, function(err, count)

							//dbo.collection("customers").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count)                                
							{
								console.log(err, count);
								finalcount = count;
								if(err) throw err;
								if(finalcount > 0)
								{
									loginStatus = true;
									loginUser = splitName[1];
									console.log("user exist, user is: " + loginUser);
									db.close();
									return res.end("Login Success");
								}
								else
								{
									db.close();
									console.log("user or pw not match");
									return res.end("fail");
								}
							});
						});
					});
				});
			}
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "login0408.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
    }
      //else if (action === "/searchpage")
      else if (action === "/Search")
		{
			console.log("search");
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
						console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
						console.log("split: " + splitMsg[1]);
            /*
						res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});
            */
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							var query = { Name: splitMsg[1] };
							dbo.collection("customers").find(query).toArray(function(err, result) 
							{
    						if (err) throw err;
    						//console.log("result: " + result);
								db.close();
								var resultReturn = JSON.stringify(result);
								console.log("return: " + resultReturn);
								return res.end(resultReturn);
							});
						});
					});
				});
			}
			else 
        //04082018
			{
				form = "searchpage.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
    
    		else if (action === "/readfavourlist")
		{
			
				
				if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						
						
						
						var splitName = tempSplitName.split("=");
						
						
						var username =splitName[1];
						
						
						
						console.log("login="+username);
						
						/*
					res.writeHead(200, 
						{
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
            */
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("favourlist").find({"user" : username}).toArray(function(err, result) 
							{
								if (err) throw err;
									console.log(result);
								db.close();
								var resultReturn = JSON.stringify(result);
									console.log(resultReturn);
									return res.end(resultReturn);
							});
						});
					});
				});
			}
			
		}

      
       
		
    //else if (action === "/favlist")
    else if (action === "/addfavourlist")
		{
			if(loginStatus)
			{
				console.log("add favour");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
							var user;
							user = qs.parse(formData);
							msg = JSON.stringify(user);
							stringMsg = JSON.parse(msg);
							var splitMsg = formData.split("=");
							console.log("mess="+msg);
							console.log("mess="+formData);
              /*
							res.writeHead(200, 
							{
								"Content-Type": "application/json",
								"Content-Length": msg.length
							});
              */
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = {"user" : loginUser, "favourite" : splitMsg[1]};
								dbo.collection("favourlist").count(myobj, function(err, count)
								{
									console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										if(err) throw err;
										console.log("fav exist");
										db.close();
										return res.end("fail");
									}
									else
									{
										dbo.collection("favourlist").insertOne(myobj, function(err, res) 
										{
											if (err) throw err;
											console.log("fav inserted");
											db.close();
										});
										return res.end(msg);
									}
								});
							});
						});
					});
				}
			}
      		else if (action === "/removefavourlist")
		{
			
				console.log("remove favour");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
							var user;
							user = qs.parse(formData);
							
							
							var splitMsg = formData.split("&");
							var tempSplitName = splitMsg[0];
							
						
						
							var splitName = tempSplitName.split("=");
							
						
							var favid=splitName[1];
						
						
						
						console.log("login="+favid);
						
							
							//res.writeHead(200, 
							//{
						//		"Content-Type": "application/json",
						//		"Content-Length": msg.length
						//	});
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = {_id : new ObjectID(favid)};
								console.log(myobj);
								dbo.collection("favourlist").count(myobj, function(err, count)
								{
									console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										dbo.collection("favourlist").deleteOne(myobj, function(err, res) 
										{
											if (err) throw err;
											console.log("fav removed");
											db.close();
										});
										return res.end(msg);
									}
									else
									{
										if(err) throw err;
										console.log("fav not exist");
										db.close();
										return res.end("fail");
									}
								});
								
								 dbo.collection("favourlist").find({}).toArray(function(err, result) {
											if (err) throw err;
											console.log(result);
											db.close();
								});
								
								
							});
						});
					});
				}
			
		
		}
      //04082018end
      /*
			else
			{
				console.log("no user detected.");
			}*/
		}
	/*
		else if (action === "/favlist")
     // else if (action === "/readfavourlist")
		{
			if(!loginStatus)
			{
				console.log("no logged in user found");
			}
			else
			{
				console.log("favlist");
        //console.log("read favour");
        /*
				MongoClient.connect(dbUrl, function(err, db) 
				{
					var finalcount;
					if (err) throw err;
					var dbo = db.db("mydb");
					var myobj = stringMsg;
					dbo.collection("favourlist").find({"user" : loginUser}, {"_id" : 0, "command" : 1, "texttitle" : 1}).toArray(function(err, result) 
					{
    				if (err) throw err;
    				console.log(result);
    				db.close();
						var resultReturn = JSON.stringify(result);
						console.log(resultReturn);
            return res.end(resultReturn);
					});
				});*/
    /*
        MongoClient.connect(dburl, function(err, db) {
							if (err) throw err;
							var dbo = db.db("asm");
							dbo.collection("profile").find({}).toArray(function(err, result) {
								
								if (err) throw err;
								var checking =-1;
								for (i = 0; i < result.length; i++) { 
										if(result[i].id === stringMsg.id){
											console.log("\tRecord Found");
											console.log("\t\tfav value: "+ result[i].fav);
											response.writeHead(200, {
												"Content-Type": "text/html"
											});
											return response.end(result[i].fav);
											break;
										}
								}
								db.close();
							});					
						});
			}
		}
*/
		else 
		{
      //handle redirect
			if(req.url === "/index")
			{
        if(loginStatus)
				{
					sendFileContent(res, "login0408.html", "text/html");
				}
				else
				{
					//sendFileContent(res, "login620.html", "text/html");//min
          sendFileContent(res, "index.html", "text/html");
				}
			}
			else if (req.url === "/Signuppage")
			{
				sendFileContent(res, "signuppage.html", "text/html");
			}
			else if (req.url === "/login0408")
			{
				//sendFileContent(res, "loginpage.html", "text/html");
        sendFileContent(res, "login0408.html", "text/html");
			}
      else if (req.url === "/logout")
			{
				loginStatus = false;
				loginUser = "";
				sendFileContent(res, "index.html", "text/html");
			}

      else if (req.url === "/favlistpage")
			{
        sendFileContent(res, "favlistpage.html", "text/html");
			}
      else if (req.url === "/searchpage")
			{
        sendFileContent(res, "searchpage.html", "text/html");
			}
     

			else if(req.url === "/")
			{
				console.log("Requested URL is url" + req.url);
				res.writeHead(200, 
				{
					'Content-Type': 'text/html'
				});
				res.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + req.url);
			}
			else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
			else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
			else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/jpg");
			}
			else
			{
				console.log("Requested URL is: " + req.url);
				res.end();
			}

		}
	});

	server.listen(8888);

	console.log("Server is running�Atime is" + new Date());


	function sendFileContent(response, fileName, contentType)
	{
		fs.readFile(fileName, function(err, data)
		{
			if(err)
			{
				response.writeHead(404);
				response.write("Not Found!");
			}
			else
			{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
	}
 }).call(this);
