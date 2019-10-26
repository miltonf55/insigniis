const express= require('express');
const mysql=require('mysql');
const session = require('express-session');
const path = require('path');

var app=express();
var bodyParser=require('body-parser');
var con= mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'n0m3l0',
	database:'insigniisDB'
});

con.connect();

app.set('view engine', 'jade');
app.use( bodyParser.json() )
app.use(session({
	secret: 'n0m3l0',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ 
	extended:true
}))

app.use(express.static('public'));
app.get('/', (req,res)=>{
	res.render('index')
}); 

app.post('/agregarUsuario',(req,res) => {
	let nom=req.body.nom
	let app=req.body.app
	let apm=req.body.apm
	let dat=req.body.dat
	let mail=req.body.dino
	let usu=req.body.usu
	let pass=req.body.pass
	let pass2=req.body.pass2
	if(pass==pass2){
		con.query('INSERT INTO usuario(`nom_usu`,`app_usu`,`apm_usu`,`fec_usu`,`usu_usu`,`cor_usu`,`pas_usu`) values("'+nom+'","'+app+'","'+apm+'","'+dat+'","'+usu+'","'+mail+'","'+pass+'")',(err,respuesta,fields)=> {
	
			if(err)return console.log('ERROR',err)
			res.send('Olad')
			//res.render('seccesRe');
		})
	}
	else{
		res.render('warning');		
	}
	
});

app.post('/loginU',(req,res)=> {
	let usu=req.body.dino;
	let pass=req.body.pass;
	if(usu=='milton@admon.com' && pass=='qwerty'){
		req.session.loggedin = true;
		req.session.username = 'admon';
		req.session.cookie.maxAge = 60*60*10;
		res.redirect('/homeAd');
	}
	else{
		con.query('SELECT * FROM usuario WHERE cor_usu = ? AND pas_usu = ?', [usu, pass], function(err, results, fields) {
			if (err) throw err;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = usu;
				req.session.cookie.maxAge = 60*60;
				//res.redirect('/home');
				res.end('Haz iniciado sesión correctamente')
			} else {
				res.render('warning2');
			}			
		});	
	}
});
app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});
app.get('/homeAd', function(req, res) {
	//let main= req.body.getElementById('main');
	console.log('Entro un admon');
	res
	if (req.session.loggedin) {
		getUsuarios(function (err,data){
				nom = data.map(obj => obj.nom_usu);
				app = data.map(obj => obj.app_usu);
				apm = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usu = data.map(obj => obj.usu_usu);
				var usuarios=[nom, app, apm, cor, usu];
				console.log(usuarios)
				res.render('verUsuarios', {nom: nom, app: app, apm: apm, cor: cor, usu: usu});
		});
				
	} else {
		res.send('Please login to view this page!');
	}
});

function getUsuarios(callback) {
    con.query('SELECT * FROM usuario', function(err, rows) {
        if(err) return callback(err);
		callback(null, rows);
    });
}

//add the router
//app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.
app.listen(3030,()=>{
	console.log('Servidor escuchando en el puerto 3030')
})










