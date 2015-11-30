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
			var query = 'SELECT * FROM Product WHERE name LIKE \'%' + req.body.search +'%\' ORDER BY ProductID asc';
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
					res.render(__dirname + '/views/guest', rows)
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
			var query = 'SELECT * FROM Product WHERE name LIKE \'%' + req.body.search +'%\' ORDER BY ProductID asc';
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

					//For Phillip: This will go to the 'customer.ejs' and give you the rows object
					res.render(__dirname + '/views/customer', rows)
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
						console.log('at least one staff record')
						res.render(__dirname + '/views/admin')
						// next();
					}
					else if(rows[0].recordCount >=1 && rows[0].isStaff == 0)
					{
						console.log('at least one nonstaff record')
						res.render(__dirname + '/views/customer')
						// next();
					}
					else 
					{
						console.log('invalid login')
						console.log('in 503 error box, invalid user')
						res.statusCode = 503;
						res.send({
							statuscode: '503',
							result: 'E-mail or Password is incorrect',
						});
					}
				}
			});
			connection.release();
		}
	});
});

