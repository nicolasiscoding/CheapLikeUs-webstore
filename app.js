// set variables for environment
var express = require('express');
var app = express();
var path = require('path');

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
  	res.sendFile(__dirname + '/views/index.html');
});

app.get('/:file', function(req, res) {
	console.log('here!');
  	res.sendFile(__dirname + '/views/' + req.params.file);
});

app.get('/req/:itemname', function(req,res)
{
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
			var query = 'SELECT * FROM Product WHERE name LIKE \'%' + req.params.itemname +'%\' ORDER BY ProductID asc';
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
					res.send({
						result: 'success',
						err: 	'',
						fields: fields,
						json: 	rows,
						length: rows.length
					});
				}
			});
			connection.release();
		}
	});
	// connection.destroy();
});

