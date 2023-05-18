//importing modules
const dotenv = require("dotenv");
const express = require('express');
const mysql = require('mysql');
const sMysql = require('sync-mysql');
const session = require('express-session');
const path = require('path');
const util = require('util');
var validator = require('validator');
var moment = require('moment');

// make console.log prefix with timestamp
require('log-prefix')(() => `[${moment().format('YYYY-MM-DD HH:mm:ss')}] %s `);

const app = express();
dotenv.config();

const port = process.env.APP_PORT || 5069;

//async mysql connection for async queries
const connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USERNAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME,
    port     : process.env.DB_PORT
});
//synced mysql connection for sync queries
const sConnection = new sMysql({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USERNAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME,
    port     : process.env.DB_PORT
});

//using sessions
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));
//send responses as json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// validation functions 
function isEmailValid(email){
    if (!validator.isEmail(email)) return false;
    let emailexists = false;
    results = sConnection.query('(select email from user where email=?) union all (select email from admin where email=?)',
                    [email,email]
    );
	if(results.length > 0){
		emailexists = true;
	}
	return !emailexists;
}
function isEmpty(val){
    if(val){
		return false;
	}
	return true;
}
function isInt(value) {
	return !isNaN(value) && 
		   parseInt(Number(value)) == value && 
		   !isNaN(parseInt(value, 10));
}




// Authenticating users
app.post('/userAuth', function(request, response) {
	let userId = request.body.userId;
	let password = request.body.password;
	if (userId && password) {
		connection.query('SELECT * FROM user WHERE userId = ? AND password = ?', [userId, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.type = "user";
				request.session.currentUser = userId;
                request.session.name = results[0].name;
				//response.redirect('/home');
                console.log("a user logged in : " + request.session.currentUser);
                response.json({ loggedin: true })
			} else {
				response.json({ loggedin: false })
			}			
			response.end();
		});
	} else {
		response.json({ loggedin: false })
		response.end();
	}
});

//Authenticating Admins
app.post('/adminAuth', function(request, response) {
	let adminId = request.body.adminId;
	let password = request.body.password;
	if (adminId && password) {
		connection.query('SELECT * FROM admin WHERE adminId = ? AND password = ?', [adminId, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.type = "admin";
				request.session.currentUser = adminId;
                request.session.name = results[0].name;
                console.log("an admin logged in : " + request.session.currentUser);
                response.json({ loggedin: true })
			} else {
				response.json({ loggedin: false })
                

			}			
			response.end();
		});
	} else {
		response.json({ loggedin: false })
		response.end();
	}
});


//testing if user or admin is auth
app.get('/isAuth', function(request, response) {
	if (request.session.loggedin) {
		response.json({ loggedin: true, sessionName: request.session.name, sessionType: request.session.type})
		//response.send('Welcome back, ' + request.session.name + ' you are : '+ request.session.type);
	} else {
		response.json({ loggedin: false, sessionName: null, sessionType: null})
		//response.send('You are not logged in !');
	}
	response.end();
});

app.get('/deAuth', function(request, response) {
	request.session.destroy();
    response.send('Session Destroyed !');
});

// adding users
app.post('/addUser', function(request, response) {

	let name = request.body.name;
	let email = request.body.email;
    let password = request.body.password;
    let depId = request.body.depId;
    let errors = {
        errorName:false,
        errorEmail:false,
        errorPassword:false,
        errorDepId:false,
        errorAuth:false
    }
    let valid = true;
	if(!(request.session.loggedin && (request.session.type === "admin"))){
        console.log("not logged in ! :: " + request.session.loggedin + "::" + request.session.type)
        errors.errorAuth = true;
        valid = false
    }
    if(!isEmailValid(email) && !errors.errorAuth){
        errors.errorEmail = true;
        valid = false;
    }
    if(password.length < 8 && !errors.errorAuth){
        errors.errorPassword = true;
        valid = false
    }
    
    //TODO validation of depId & name

	if (valid) {
		connection.query('INSERT INTO user(name, email, password, depId) VALUES (?,?,?,?);', [name, email, password, depId], function(error, results, fields) {
			if (error) throw error;			
			response.json({ added: true, errors: errors});
		});
	} else {
		response.json({ 
            added: false,
            errors: errors,
        })
		response.end();
	}
});


//adding admins
app.post('/addAdmin', function(request, response) {

	let name = request.body.name;
	let email = request.body.email;
    let password = request.body.password;
    let errors = {
        errorName:false,
        errorEmail:false,
        errorPassword:false,
        errorAuth:false
    }
    let valid = true;
	if(!(request.session.loggedin && (request.session.type === "admin"))){
        console.log("Attempt without login ! :: " + request.session.loggedin + "::" + request.session.type)
        errors.errorAuth = true;
        valid = false
    }
    if(!isEmailValid(email) && !errors.errorAuth){
        errors.errorEmail = true;
        valid = false;
    }
    if(password.length < 8 && !errors.errorAuth){
        errors.errorPassword = true;
        valid = false
    }
	
    //Todo name validation
    

	if (valid) {
		connection.query('INSERT INTO admin(name, email, password) VALUES (?,?,?);', [name, email, password], function(error, results, fields) {
			if (error) throw error;			
			response.json({ added: true, errors: errors});
		});
	} else {
		response.json({ 
            added: false,
            errors: errors,
        })
		response.end();
	}
});



//TODO needs testing
//adding departements
app.post('/addDep', function(request, response) {
	let depName = request.body.depName;
	let depPhoneNum = request.body.depPhoneNum;
	let errors = {
		depNameError:false,
		depPhoneNumError:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to add departement (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		if(!depName){
			errors.depNameError = true;
			valid = false
		}
		if(!depPhoneNum){
			errors.depPhoneNumError = true;
			valid = false
		}else{
			if(!isMobilePhone(depPhoneNum, 'any')){
				errors.depPhoneNumError = true;
				valid = false;
			}
		}	
	}
	if (valid) {
		connection.query('INSERT INTO departement(depName, depPhoneNum) VALUES (?,?);', [depName, depPhoneNum], function(error, results, fields) {
			if (error) throw error;
			response.json({ added: true, errors: errors});
		});
	} else {
		response.json({
			added: false,
			errors: errors,
		})
		response.end();
	}
});




//adding tickets
app.post('/addTicket', function(request, response) {
	let errors = {
		titleError:false,
		severityError:false,
		deviceTypeError:false,
		inventoryNumError:false,
		serialNumError:false,
		descriptionError:false,
        errorAuth:false
    }
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "user")){
		console.log("Invalid attempt to add ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}

	let title = request.body.title;
	let severity = request.body.severity;
	let deviceType = request.body.deviceType;
	let inventoryNum = request.body.inventoryNum;
	let serialNum = request.body.serialNum;
	let description = request.body.description;

	let userId = request.session.currentUser;
	let dateSubmitted = moment().format('YYYY-MM-DD hh:mm:ss');


	//TODO edit the validation of tickets
	//validating the ticket
	if(!errors.errorAuth){
		errors.titleError = isEmpty(title);
		errors.severityError = isEmpty(severity);
		errors.deviceTypeError = isEmpty(deviceType);
		errors.inventoryNumError = isEmpty(inventoryNum);
		errors.serialNumError = isEmpty(serialNum);
		errors.descriptionError = isEmpty(description);
		if(errors.titleError||errors.severityError||errors.deviceTypeError||errors.inventoryNumError||errors.serialNumError||errors.descriptionError){
			valid = false;
		}
	}


	if (valid) {
		querytext = "INSERT INTO ticket(title,severity,userId,dateSubmitted,deviceType,inventoryNum,serialNum,description) VALUES (?,?,?,?,?,?,?,?);"
		connection.query(querytext, [title,severity,userId,dateSubmitted,deviceType,inventoryNum,serialNum,description], function(error, results, fields) {
			if (error) throw error;			
			response.json({
				added: true, errors: errors
			});
			response.end();
		});
	} else {
		response.json({ 
            added: false,
            errors: errors,
        })
		response.end();
	}
});


//adding fixings
app.post('/addFixing', function(request, response) {
	let errors = {
		ticketIdError:false,
		adminIdError:false,
		statusError:false,
		dateAssignedError:false,
		remarksError:false,
        errorAuth:false,
		errorAlreadyAssigned:false
    }
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to add fixing (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}

	let ticketId = request.body.ticketId;
	let status = request.body.status;
	let remarks = request.body.remarks;

	let adminId = request.session.currentUser;
	let dateAssigned = moment().format('YYYY-MM-DD hh:mm:ss');

	//TODO edit the validation of fixings !
	// validating the fixing
	if(!errors.errorAuth){
		errors.ticketIdError = isEmpty(ticketId);
		errors.statusError = isEmpty(status) || !isInt(status);
		errors.remarksError = isEmpty(remarks);
		if(errors.ticketIdError||errors.statusError||errors.remarksError){
			valid = false;
		}
	}
	if(valid){
		//check if the ticket is already assigned using syncmysql
		let querytext = "SELECT * FROM fixing WHERE ticketId = ?;"
		let result = sConnection.query(querytext, [ticketId]);
		if(result.length > 0){
			console.log("Invalid attempt to add fixing (already assigned) :: " + request.session.loggedin + "::" + request.session.type)
			errors.errorAlreadyAssigned = true;
			valid = false;
		}
	}
	if (valid) {
		querytext = "INSERT INTO fixing(ticketId,adminId,status,dateAssigned,dateFixed,remarks)VALUES(?,?,?,?,NULL,?);"
		connection.query(querytext, [ticketId,adminId,status,dateAssigned,remarks], function(error, results, fields) {
			if (error) throw error;			
			response.json({
				added: true, errors: errors
			});
			response.end();
		});
	} else {
		response.json({ 
            added: false,
            errors: errors,
        })
		response.end();
	}
});

//view all tickets for admin
app.get('/viewTickets', function(request, response) {
	if(request.session.loggedin && request.session.type === "admin"){
		connection.query('SELECT * FROM ticket', function (error, results, fields) {
			if (error) throw error;
			response.json({
				result: results,
				errors : {
					errorAuth : false
				}
			});
		});
	} else {
		response.json({
			errors : {
				errorAuth : true
			}
		})
	}
});

//view a single ticket for admin
app.get('/viewTicket/:id', function(request, response) {
	let errors = {
		noTicketFoundError:false,
		ticketIdError:false,
		errorAuth:false
	}
	let valid = true;
	let ticketId = request.params.id;
	if(!ticketId){
		TicketIdError = true;
		valid = false;
	}
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}

	if(valid){
		connection.query('SELECT * FROM ticket WHERE ticketId = ?', [ticketId], function (error, results, fields) {
			if (error) throw error;
			//check if results from query is not empty
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.noTicketFoundError = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//view a single ticket only if its posted by the same user
app.get('/viewTicketUser/:id', function(request, response) {
	let errors = {
		noTicketFoundError:false,
		ticketIdError:false,
		errorAuth:false
	}
	let valid = true;
	let ticketId = request.params.id;
	if(!ticketId){
		TicketIdError = true;
		valid = false;
	}
	if(!(request.session.loggedin && request.session.type === "user")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM ticket WHERE ticketId = ?', [ticketId], function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				if(results[0].userId == request.session.currentUser){
					response.json({
						result : results,
						errors: errors
					});
				}else{
					errors.errorAuth = true;
					response.json({
						errors: errors
					})
				}
			}else{
				errors.noTicketFoundError = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//view all the tickets posted by the same user
app.get('/viewTicketsUser', function(request, response) {
	let errors = {
		errorNoTicketsFound:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "user")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM ticket WHERE userId = ?', [request.session.currentUser], function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.errorNoTicketsFound = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//view tickets that have fixing by the same admin
app.get('/viewTicketsAdmin', function(request, response) {
	let errors = {
		errorNoTicketsFound:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM ticket WHERE ticketId IN (SELECT ticketId FROM fixing WHERE adminId = ?)', [request.session.currentUser], function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.errorNoTicketsFound = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//view all the tickets that are not assigned yet
app.get('/viewTicketsNotAssigned', function(request, response) {
	let errors = {
		errorNoTicketsFound:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM ticket WHERE ticketId NOT IN (SELECT ticketId FROM fixing)', function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.errorNoTicketsFound = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//view all the tickets that has a fixing
app.get('/viewTicketsAssigned', function(request, response) {
	let errors = {
		errorNoTicketsFound:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM ticket WHERE ticketId IN (SELECT ticketId FROM fixing)', function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.errorNoTicketsFound = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//view all the tickets that are fixed (the fixing assigned has status 1 or 2)
app.get('/viewTicketsFixed', function(request, response) {
	let errors = {
		errorNoTicketsFound:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "admin")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM ticket WHERE ticketId IN (SELECT ticketId FROM fixing WHERE status = 1 OR status = 2)', function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.errorNoTicketsFound = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

//TODO needs testing
//check if a user's ticket is assigned to any admin , provided the ticketId
app.get('/checkTicketAssigned/:id', function(request, response) {
	let errors = {
		errorTicketId : false,
		errorNoTicketsFound:false,
		errorAuth:false
	}
	let valid = true;
	if(!(request.session.loggedin && request.session.type === "user")){
		console.log("Invalid attempt to view ticket (auth) :: " + request.session.loggedin + "::" + request.session.type)
		errors.errorAuth = true;
		valid = false
	}
	if(!request.params.id){
		console.log("Invalid attempt to view ticket (ticketId) :: " + request.params.id)
		errors.errorTicketId = true;
		valid = false
	}
	if(valid){
		connection.query('SELECT * FROM fixing WHERE ticketId = ?', [request.params.id], function (error, results, fields) {
			if (error) throw error;
			if(results.length > 0){
				response.json({
					result : results,
					errors: errors
				});
			}else{
				errors.errorNoTicketsFound = true;
				response.json({
					errors: errors
				})
			}
		});
	} else {
		response.json({
			errors: errors
		})
	}
});

app.listen(port, () => {
	console.log("--------------------------------------------")
	console.log(`This app is listening on port ${port}`)
	console.log("To access the app, go to http://localhost:" + port + "/")
	console.log("")
	console.log("Note this app is not secure, so do not use any sensitive information, and do not use this app on a public network.")
	console.log("This app is still in development, so expect bugs and errors.")
	console.log("To change the port, database credentials, or other settings, edit the .env file.")
	console.log("")
	console.log("Press Ctrl+C to quit.")
	console.log("--------------------------------------------")
});
