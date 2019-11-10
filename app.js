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
	if (req.session.loggedin) {
		if(req.session.username=='admon'){
			res.render('homeAd.jade');
		}
		else{
			res.render('homeU.jade');
		}
				
	} else {
		res.render('index');
	}
	
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
	let txt;
	try {
		if(pass==pass2){
			con.query('INSERT INTO usuario(`nom_usu`,`app_usu`,`apm_usu`,`fec_usu`,`usu_usu`,`cor_usu`,`pas_usu`) values("'+nom+'","'+app+'","'+apm+'","'+dat+'","'+usu+'","'+mail+'","'+pass+'")',(err,respuesta,fields)=> {
				txt='Usuario y/o correo ya registrados';
				if(err)return res.render('warning', {txt})
				res.render('succesRe');
			})
		}
		else{
			txt='Las contraseñas no coinciden'
			res.render('warning', {txt});		
		}
	} catch (error) {
		console.log(error);
		txt='Hubo un error, vuelva a intentarlo más tarde';
		res.render('warning', {txt});
	}
		
	
	
});

app.post('/loginU',(req,res)=> {
	let usu=req.body.dino;
	let pass=req.body.pass;
	let txt='Usuario y/o contraseña incorrecta';
	if(usu=='milton@admon.com' && pass=='qwerty'){
		req.session.loggedin = true;
		req.session.username = 'admon';
		req.session.cookie.maxAge = 60*60*1000;
		res.redirect('/homeAd');
	}
	else{
		con.query('SELECT * FROM usuario WHERE cor_usu = ? AND pas_usu = ?', [usu, pass], function(err, results, fields) {
			if (err) throw err;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = usu;
				req.session.cookie.maxAge = 60*60*1000;
				res.redirect('/home')
			} else {
				res.render('warning', {txt});
			}			
		});	
	}
});
app.get('/logout', function(req, res) {
	if (req.session.loggedin) {
		req.session.destroy();
		res.render('index');
	} else {
		res.render('index');
	}
	res.end();
});
app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.render('home');
	} else {
		res.render('index');
	}
	res.end();
});
app.get('/verUsuAd', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getUsuarios(function (err,data){
				nom = data.map(obj => obj.nom_usu);
				app = data.map(obj => obj.app_usu);
				apm = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usu = data.map(obj => obj.usu_usu);
				fec = data.map(obj => obj.fec_usu);
				var usuarios=[nom, app, apm, cor, usu];
				res.render('verUsuarios', {nom, app, apm, cor, usu, fec});
		});
				
	} else {
		res.render('index');
	}
});
app.get('/modUsuAd', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getUsuarios(function (err,data){
				id = data.map(obj => obj.id_usu);
				nom = data.map(obj => obj.nom_usu);
				app = data.map(obj => obj.app_usu);
				apm = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usu = data.map(obj => obj.usu_usu);
				res.render('modUsuarios', {id, nom, app, apm, cor, usu});
		});
				
	} else {
		res.render('index');
	}
});
app.post('/editarUsu', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		let id=req.body.id
		let nom=req.body.nom
		let app=req.body.app
		let apm=req.body.apm
		let mail=req.body.dino
		let usu=req.body.usu
		let txt='Usuario actualizado'
		res.render('exito', {txt})
		con.query('UPDATE usuario SET nom_usu="'+nom+'", app_usu="'+app+'", apm_usu="'+apm+'", usu_usu="'+usu+'", cor_usu="'+mail+'" WHERE id_usu="'+id+'"',(err,respuesta,fields)=> {
			txt='Hubo un error, vuelva a intentarlo más tarde';
			if(err)return res.render('warning2', {txt})	
		})
	} else {
		res.render('index');
	}
	res.end();
});
app.get('/elUsuAd', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getUsuarios(function (err,data){
				id = data.map(obj => obj.id_usu);
				usu = data.map(obj => obj.usu_usu);
				res.render('eliminarUsuarios', {id, usu});
		});
				
	} else {
		res.render('index');
	}
});
app.post('/killUsu', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		let id=req.body.id
		let txt='Usuario eliminado'
		res.render('exito', {txt})
		con.query('DELETE FROM usuario WHERE id_usu="'+id+'"',(err,respuesta,fields)=> {
			txt='Hubo un erro al eliminar el dinosaurio'
			if(err)return res.render('warning2', {txt})	
		})
	} else {
		res.render('index');
	}
	res.end();
});


app.get('/homeAd', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		res.render('homeAd.jade');
				
	} else {
		res.render('index');
	}
});

//DELITOS ADMON
app.get('/modDel', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getDelitos(function (err,data){
			id = data.map(obj => obj.id_tip);
			nom = data.map(obj => obj.nom_tip);
			res.render('modDelitos', {id, nom});
		});
				
	} else {
		res.render('index');
	}
});

app.get('/addDel', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getDelitos(function (err,data){
				id = data.map(obj => obj.id_tip);
				nom = data.map(obj => obj.nom_tip);
				res.render('addDelitos', {id, nom});
		});
				
	} else {
		res.render('index');
	}
});

app.post('/sumDelito',(req,res) => {
	if (req.session.loggedin && req.session.username=='admon') {
		let des=req.body.des
		let txt='Delito Agregado'
		res.render('exito', {txt})
		try {
				con.query('INSERT INTO tipodelito(`nom_tip`) values("'+des+'")',(err,respuesta,fields)=> {
					txt='Hubo un error, vuelva a intentarlo más tarde';
					if(err)return res.render('warning2', {txt})
					res.render('succesRe');
				})
		} catch (error) {
			console.log(error);
			txt='Hubo un error, vuelva a intentarlo más tarde';
			res.render('warning2', {txt});
		}	
	} else {
		res.render('index');
	}
});
app.post('/editarDel', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		let id=req.body.id
		let nom=req.body.nom
		let txt='Delito actualizado'
		res.render('exito', {txt})
		con.query('UPDATE tipodelito SET nom_tip="'+nom+'" WHERE id_tip="'+id+'"',(err,respuesta,fields)=> {
			txt='Hubo un error, vuelva a intentarlo más tarde';
			if(err)return res.render('warning2', {txt})	
		})
	} else {
		res.render('index');
	}
	res.end();
});
//add the router
//app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.

//PART USER
app.get('/contacto', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDatUsu(usu, function (err,data){
				pas = data.map(obj => obj.pas_usu);
				res.render('modPass', {pas});
		});
				
	} else {
		res.render('index');
	}
});
app.get('/aviso', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDatUsu(usu, function (err,data){
				pas = data.map(obj => obj.pas_usu);
				res.render('modPass', {pas});
		});
				
	} else {
		res.render('index');
	}
});
app.get('/datosUsu', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDatUsu(usu, function (err,data){
				nom = data.map(obj => obj.nom_usu);
				app = data.map(obj => obj.app_usu);
				apm = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usu = data.map(obj => obj.usu_usu);
				res.render('datosUsu', {nom, app, apm, cor, usu});
		});
				
	} else {
		res.render('index');
	}
});
app.get('/modPass', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDatUsu(usu, function (err,data){
				pas = data.map(obj => obj.pas_usu);
				res.render('modPass', {pas});
		});
				
	} else {
		res.render('index');
	}
});
app.get('/addReporte', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDelegaciones(function (err,data){
				del = data.map(obj => obj.nom_del);
				id = data.map(obj => obj.id_del);
				getDelitos(function (err,data){
					delito = data.map(obj => obj.nom_tip);
					idD = data.map(obj => obj.id_tip);
					res.render('agregarRep', {id,del, delito, idD});
				});
		});		
	} else {
		res.render('index');
	}
});
app.get('/verReportes', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getReportes(function (err,data){
				des = data.map(obj => obj.des_rep);
				del = data.map(obj => obj.nom_del);
				delito = data.map(obj => obj.nom_tip);
				txt='Ver Reportes';
				res.render('verReportes', {des,del,delito, txt});
		});		
	} else {
		res.render('index');
	}
});
app.get('/reportesUsuario', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDatUsu(usu, function (err,data){
				id = data.map(obj => obj.id_usu);
				getReportesU(id, function (err,data){
					des = data.map(obj => obj.des_rep);
					del = data.map(obj => obj.nom_del);
					delito = data.map(obj => obj.nom_tip);
					txt='Mis Reportes';
					res.render('verReportes', {des,del,delito, txt});
				});	
		});
			
	} else {
		res.render('index');
	}
});
app.post('/editarPass', function(req, res) {
	if (req.session.loggedin) {
		let user=req.session.username;
		let pass=req.body.pass;
		let pass2=req.body.pass2;
		if(pass==pass2){
			let txt='Contraseña actualizada'
			res.render('exitoU', {txt})
			con.query('UPDATE usuario SET pas_usu="'+pass+'" WHERE cor_usu="'+user+'"',(err,respuesta,fields)=> {
				txt='Hubo un error, vuelva a intentarlo más tarde';
				if(err)return res.render('errorU', {txt})	
			})
		}
		else{
			txt='Las constraseñas no coinciden, vuelva a intentarlo';
			res.render('errorU', {txt})
		}
		
	} else {
		res.render('index');
	}
	res.end();
});
app.post('/sumReporte', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		let delito=req.body.delito;
		let del=req.body.delegacion;
		let des=req.body.des;
		console.log(delito)
		let txt='Reporte agregado'
		res.render('exitoU', {txt})
		getDatUsu(usu, function (err,data){
			idU = data.map(obj => obj.id_usu);
			con.query('INSERT INTO reporte(`des_rep`,`id_tip`,`id_del`,`id_usu`) values("'+des+'","'+delito+'","'+del+'","'+idU+'")',(err,respuesta,fields)=> {
				txt='Hubo un error, vuelva a intentarlo más tarde';
				if(err)return res.render('errorU', {txt})	
			});
		});
	} else {
		res.render('index');
	}
	res.end();
});

//Callbacks DB
function getUsuarios(callback) {
    con.query('SELECT * FROM usuario', function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}
function getDelitos(callback) {
    con.query('SELECT * FROM tipodelito ORDER BY nom_tip', function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}
function getDatUsu(usu, callback) {
    con.query('SELECT * FROM usuario where cor_usu=?',[usu], function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}
function getDelegaciones(callback) {
    con.query('SELECT * FROM delegacion', function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}
function getReportes(callback) {
    con.query('SELECT id_rep, des_rep, nom_tip, nom_del FROM reporte INNER JOIN tipodelito ON reporte.id_tip=tipodelito.id_tip INNER JOIN delegacion ON reporte.id_del=delegacion.id_del ORDER BY id_rep DESC LIMIT 15', function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}
function getReportesU(id, callback) {
    con.query('SELECT id_rep, des_rep, nom_tip, nom_del FROM reporte INNER JOIN tipodelito ON reporte.id_tip=tipodelito.id_tip INNER JOIN delegacion ON reporte.id_del=delegacion.id_del where id_usu=? ORDER BY id_rep DESC LIMIT 15', [id],function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}

app.listen(3030,()=>{
	console.log('Servidor escuchando en el puerto 3030')
})








