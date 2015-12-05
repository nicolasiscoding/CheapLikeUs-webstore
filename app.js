// set variables for environment
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

//tell express to use the bodyParser middleware
app.use(bodyParser());

//start the mysql interface
var mysql = require('mysql');
var mysql      = require('mysql');
var connectionPool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'toor',
  database : 'schema'
});
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;
 
//   console.log('The solution is: ', rows[0].solution);
// });
 
// connection.end();

// Set server port
app.listen(80);
console.log('server is running at 127.0.0.1:80');

// views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
       
// instruct express to server up static assets
app.use(express.static('public'));

// set routes
app.get('/', function(req, res) {
  	res.render(__dirname + '/views/index');
});

app.get('/:file', function(req, res) {
  	res.sendFile(__dirname + '/views/' + req.params.file);
});

//addUser
app.post('/admin/addUser', function(req,res)
{
	console.log('creating user!');

	var usersName = req.body.usersName;
	var email = req.body.email;
	var password = req.body.password;
	var street = req.body.address;
	var isStaff = req.body.isStaff;
	console.log('Staff: ' + isStaff);
	email = email.toUpperCase();

	var checkIfUserExists = 'select count(*) as recordcount from userTable where email =\''+ email + '\'';


	connectionPool.query(checkIfUserExists, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

		console.log('Recordcount: ' + rows[0].recordcount);
		if(rows[0].recordcount == 1)
		{
			//this is a placeholder JSON for now, will incorporate render after consulting Phil
			res.send({response: 'UserExists!'})

			//res.render();
			return;
		}
		else
		{
			//if user does not exist, figure out next ID, then create insert statement

			var maxIDQuery = "select MAX(userID) +1 as nextID from userTable";
			connectionPool.query(maxIDQuery, function(err, rows, fields)
			{
				if(err)
					{
						console.log('connection error: \n\n\n');
						console.log(err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: 	err.code
						});
						return;
					}

				var nextID = rows[0].nextID;
				// console.log(rows[0].nextID);

				var insertQuery = "INSERT INTO userTable VALUES (" + nextID +", \'" + usersName +  "\', \'" + street +"\', \'"+ email + "\', \'"+password + "\', "+ isStaff + ")";
				console.log(insertQuery);
				connectionPool.query(insertQuery, function(err, rows, fields)
				{
					if(err)
					{
						console.log('connection error: \n\n\n');
						console.log(err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: 	err.code
						});
						res.render(__dirname + '/views/admin')
						return;
					}
				});

				res.render(__dirname + '/views/admin')
			});
		}
	});
});

//update
app.post('/admin/updateUser', function(req,res)
{
	var userID = req.body.userID;
	var name = req.body.name;
	var address = req.body.address;
	var email = req.body.email;
	var password = req.body.password;
	var isStaff = req.body.isStaff;

	// console.log(userID);
	// console.log(name);
	// console.log(address);
	// console.log(email);
	// console.log(password);
	// console.log(isStaff);

	if(!isStaff)
	{
		isStaff = 0;
	}

	var query = 'UPDATE userTable set name = \''+ name +'\', address = \'' + address+'\', email =\''+ email +'\', password = \''+password+'\', isStaff = '+ isStaff +' WHERE userID = '+ userID;
	console.log(query);

	connectionPool.query(query, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

	});

	res.render(__dirname + '/views/admin')
});

//delUser
app.post('/admin/deleteUser', function(req, res)
{
	var userID = req.body.userID;

	if(!userID)
	{
		res.render(__dirname + '/views/admin')
		return;
	}

	var delUserQ = 'DELETE FROM userTable where userID = ' + userID;
	console.log(delUserQ);
	connectionPool.query(delUserQ, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

	});

	res.render(__dirname + '/views/admin')
});

//addOrder Changed DATE to VARCHAR 30
app.post('/admin/addOrder', function(req, res)
{
	var date = req.body.date;
	var paid = req.body.paid;

	if(!paid)
	{
		paid = 0;
	}

	console.log(date);
	console.log(paid);


	var maxIDQuery = 'select MAX(id)+1 as maxID FROM orderTable';

	connectionPool.query(maxIDQuery, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

		var nextID = rows[0].maxID;

		var query = 'Insert into orderTable values(' + nextID +', \''+ date+ '\',  ' + paid + ')';
		console.log(query);
		connectionPool.query(query, function(err,rows,fields)
		{
			if(err)
			{
				console.log('connection error: \n\n\n');
				console.log(err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err: 	err.code
				});
				return;
			}
		});

	});
	res.render(__dirname + '/views/admin');
});

//updateOrder
app.post('/admin/updateOrder', function(req, res)
{
	var id = req.body.ID;
	var date = req.body.date;
	var paid = req.body.paid;

	if(!paid)
	{
		paid = 0;
	}

	var query = 'UPDATE orderTable SET date = \''+ date +'\' , paid = \''+ paid +'\' WHERE id = ' + id;
	console.log(query);

	connectionPool.query(query, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}
	});

	res.render(__dirname + '/views/admin');
});


//deleteOrder
app.post('/admin/deleteOrder', function(req,res)
{
	var id = req.body.orderID;

	var query = 'DELETE FROM orderTable Where id = ' + id;
	console.log(query);
	connectionPool.query(query, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

	});

	res.render(__dirname + '/views/admin');
});

//addProd NEED TO FINISH
app.post('/admin/addProd',function(req,res)
	{
		var name = req.body.name;
		var price = req.body.price;
		var stockquantity = req.body.stockquantity;
		var description = req.body.description;
		var active = req.body.active;

		var nextIDquery = 'select MAX(ProductID) +1 as nextID from Product';
		connectionPool.query(nextIDquery, function(err,rows,fields)
		{
			var nextID = rows[0].nextID;

			var insertQuery = 'INSERT INTO Product values (\''+ nextID  +'\' ,\''+  name +'\', \''+  price  +'\',\''+ stockquantity +'\',\'' + description + '\',\''+ active+ '\',\'0\')';
			console.log(insertQuery);
			connectionPool.query(insertQuery, function(err, rows, fields)
				{
					if(err)
					{
						console.log('connection error: \n\n\n');
						console.log(err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: 	err.code
						});
						return;
					}
				});

		});

		res.render(__dirname + '/views/admin');
	});

//updateProd 
app.post('/admin/updateProd', function(req, res)
{
	var productID = req.body.productID;
	var name = req.body.name;
	var price = req.body.price;
	var stockquantity = req.body.stockquantity;
	var description = req.body.description;
	var active = req.body.active;

	var query = 'UPDATE Product SET name = \''+ name +'\', price ='+  price +' , stockquantity ='+ stockquantity +' , active ='+ active +', description = \''+ description+'\', alert = 0 WHERE ProductID= ' + productID;
	console.log(query);

	connectionPool.query(query, function(err,rows,field)
		{
			if(err)
			{
				console.log('connection error: \n\n\n');
				console.log(err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err: 	err.code
				});
				return;
			}
		});

	res.render(__dirname + '/views/admin');
});

//deleteProd
app.post('/admin/deleteProd', function(req,res)
{	
	var prodID = req.body.productID;

	var query = 'DELETE FROM Product Where ProductID = ' + prodID;
	console.log(query);
		connectionPool.query(query, function(err,rows,fields)
		{
			if(err)
			{
				console.log('connection error: \n\n\n');
				console.log(err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err: 	err.code
				});
				return;
			}
		});
	res.render(__dirname + '/views/admin');
});

//in order to emulate synchonous behavior, I have to write everything as call back functions which may make the code messy
app.post('/createUser', function(req,res)
{
	console.log('creating user!');

	var usersName = req.body.usersname;
	var email = req.body.email;
	var password = req.body.password;
	var street = req.body.street;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	email = email.toUpperCase();

	var checkIfUserExists = 'select count(*) as recordcount from userTable where email =\''+ email + '\'';


	connectionPool.query(checkIfUserExists, function(err, rows, fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

		console.log('Recordcount: ' + rows[0].recordcount);
		if(rows[0].recordcount == 1)
		{
			//this is a placeholder JSON for now, will incorporate render after consulting Phil
			res.send({response: 'UserExists!'})

			//res.render();
			return;
		}
		else
		{
			//if user does not exist, figure out next ID, then create insert statement

			var maxIDQuery = "select MAX(userID) +1 as nextID from userTable";
			connectionPool.query(maxIDQuery, function(err, rows, fields)
			{
				if(err)
					{
						console.log('connection error: \n\n\n');
						console.log(err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: 	err.code
						});
						return;
					}

				var nextID = rows[0].nextID;
				// console.log(rows[0].nextID);

				var insertQuery = "INSERT INTO userTable VALUES (" + nextID +", \'" + usersName +  "\', \'" + street + " " + city + ", " + state + " " + zip +"\', \'" + email +"\', \'"+ password + "\', 0)";
				connectionPool.query(insertQuery, function(err, rows, fields)
				{
					if(err)
					{
						console.log('connection error: \n\n\n');
						console.log(err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: 	err.code
						});
						return;
					}
				});

				//query for all 
				var query = 'SELECT * FROM Product WHERE name LIKE \'%%\' ORDER BY ProductID asc';
				console.log(query);
				connectionPool.query(query, function(err, rows, fields)
				{
					if(err)
					{
						console.log(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err: 	err.code
						});
					}
					else
					{
						//For Phillip: This will go to the 'customer.ejs' and give you the rows object
						res.render(__dirname + '/views/customer', {data: rows})
					}
				});


			});
		}
	});

});


//this is a route for the guestPage
app.post('/req/guestItems', function(req,res)
{

	console.log('Posting items for guests!!');
	connectionPool.getConnection(function(err, connection)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
		}
		else
		{
			var query = 'SELECT * FROM Product WHERE name LIKE \'%' + req.body.search +'%\' AND active = 1 ORDER BY price asc';
			console.log(query);
			connection.query(query, req.params.id, function(err, rows, fields)
			{
				if(err)
				{
					console.log(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: 	err.code
					});
				}
				else
				{
					// res.send({
					// 	result: 'success',
					// 	err: 	'',
					// 	fields: fields,
					// 	json: 	rows,
					// 	length: rows.length
					// });

					//For Phillip: This will go to the 'guest.ejs' and give you the rows object
					console.log(rows);

					res.render(__dirname + '/views/guest', {data: rows});
				}
			});
			connection.release();
		}
	});
	// connection.destroy();
});

//this is a route for the customer page's search request
app.post('/req/customerItems', function(req,res)
{

	console.log('Posting items for customer!!');
	connectionPool.getConnection(function(err, connection)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
		}
		else
		{
			var query = 'SELECT * FROM Product WHERE name LIKE \'%' + req.body.search +'%\' AND active = 1 ORDER BY price asc';
			console.log(query);
			connection.query(query, req.params.id, function(err, rows, fields)
			{
				if(err)
				{
					console.log(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: 	err.code
					});
				}
				else
				{
					//For Phillip: This will go to the 'customer.ejs' and give you the rows object
					res.render(__dirname + '/views/customer', {data: rows})
				}
			});
			connection.release();
		}
	});
	// connection.destroy();
});

app.post('/login/', function(req,res)
{
	//debug for routes to make sure everything is working properly
	console.log('I am in the login post route');

	//connect to SQL pool
	connectionPool.getConnection(function(err, connection)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error, having issue connecting to MYSQL DB instance',
				err: 	err.code
			});
		}
		else
		{
			var user = req.body.email;
			user = user.toUpperCase();
			var password = req.body.password;

			console.log('user: ' + user);
			console.log('password: ' + password);

			var query = 'select COUNT(*) AS recordCount, isStaff from userTable where email = \''+user+'\' AND password = \''+password+'\'';
			console.log(query);
			connection.query(query, req.params.id, function(err, rows, fields)
			{
				if(err)
				{
					//another connection issue
					console.log('in 500 error box')
					console.log(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: 	err.code
					});
				}
				else
				{
					//if the query was successful, we check to see if their exists a record of this query

					//debug print count of records that match parameters
					// console.log(rows[0].recordCount)

					//if the return query has a user that has admin privileges, redirect them to the admin page
					
					console.log(rows[0].isStaff);
					if(rows[0].recordCount >=1 && rows[0].isStaff == 1)
					{
						console.log('at least one staff record');

						//if we have a item with an alert flag
						var alert = "select ProductID, name, stockquantity from Product where alert = 1";

						connectionPool.query(alert, function(err,rows,fields)
						{
							console.log(rows);
							if(!rows[0])
							{
								res.render(__dirname + '/views/admin');
								return;
							}

							res.render(__dirname + '/views/admin_alert', {data: rows});
							return;
						});

						// next();
					}
					else if(rows[0].recordCount >=1 && rows[0].isStaff == 0)
					{

						console.log('at least one nonstaff record');

						//query for all 
						var query = 'SELECT * FROM Product WHERE name LIKE \'%%\' ORDER BY ProductID asc';
						// console.log(query);
						connection.query(query, req.params.id, function(err, rows, fields)
						{
							if(err)
							{
								console.log(err);
								res.statusCode = 500;
								res.send({
									result: 'error',
									err: 	err.code
								});
							}
							else
							{
								//For Phillip: This will go to the 'customer.ejs' and give you the rows object
								
								console.log(rows);
								res.render(__dirname + '/views/customer' , {data: rows});
							}
						});
						// next();
					}
					else 
					{
						console.log('invalid login')
						console.log('in 503 error box, invalid user')
						res.statusCode = 503;
						res.render(__dirname + '/views/index_alert');
					}
				}
			});
			connection.release();
		}
	});
});

app.post('/user/checkout', function(req,res)
{
	console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;
	var cart = req.body.cart;

	var grandTotal = 0;
	for(var i = 0; i < cart.length; i++)
	{
		console.log(cart[i].total);
		grandTotal+=Number(cart[i].total);
	}

	console.log(grandTotal);
	// console.log(Date.now())

	//nextID
	var maxIDQuery = 'select MAX(id)+1 as maxID FROM orderTable';
	connectionPool.query(maxIDQuery, function(err,rows,fields)
	{
		if(err)
		{
			console.log('connection error: \n\n\n');
			console.log(err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: 	err.code
			});
			return;
		}

		var orderID = rows[0].maxID;
		var userIDquery = 'SELECT userID FROM userTable WHERE email = \'' + email +'\' AND password = \''+ password +'\'';
		connectionPool.query(userIDquery, function(err, rows, fields)
		{
			if(err)
			{
				console.log('connection error: \n\n\n');
				console.log(err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err: 	err.code
				});
				return;
			}
			if(!rows[0])
			{
				res.send(
				{
					result: 'Invalid username/password'
				});
				console.log('invalidUser/Pass');
				return;
			}

			var userID = rows[0].userID;
			var insertIntoOrderTable = 'INSERT INTO orderTable Values('+ orderID+', (SELECT NOW()), 1)';
			console.log(insertIntoOrderTable);
			connectionPool.query(insertIntoOrderTable, function(err,rows,fields)
				{
					if(err)
					{
						console.log('connection error: \n\n\n');
						console.log(err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: 	err.code
						});
						return;
					}

					var insertIntouserOrderTable = 'INSERT INTO userorderTable Values('+ orderID + ','+ userID + ')';
					console.log(insertIntouserOrderTable);
					connectionPool.query(insertIntouserOrderTable, function(err,rows,fields)
						{
							if(err)
							{
								console.log('connection error: \n\n\n');
								console.log(err);
								res.statusCode = 503;
								res.send({
									result: 'error',
									err: 	err.code
								});
								return;
							}
						});

					res.send({
						CustomerNumber: userID,
						ReceiptNum: orderID,
						BilledAmount: grandTotal
					});

					for(var i =0; i < cart.length; i++)
					{
						var Pid = cart[i].pid;
						var newQuantQuery = 'SELECT (stockquantity-1) AS s, ProductID FROM Product WHERE ProductID =' + Pid;
						connectionPool.query(newQuantQuery, function(err,rows,fields)
						{
								if(err)
								{
									console.log('connection error: \n\n\n');
									console.log(err);
									res.statusCode = 503;
									res.send({
										result: 'error',
										err: 	err.code
									});
								}

								var productIDscoped = rows[0].ProductID;
								var newQuant = rows[0].s;
								var updateQuant = 'UPDATE Product SET stockquantity ='+ newQuant +' WHERE ProductID =' + productIDscoped;
								connectionPool.query(updateQuant, function(err,rows,fields)
								{
									if(err)
									{
										console.log('connection error: \n\n\n');
										console.log(err);
										res.statusCode = 503;
										res.send({
											result: 'error',
											err: 	err.code
										});
									}								
								});
						});
					}

				});

		});
	});
});
