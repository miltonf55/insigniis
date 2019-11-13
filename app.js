const express= require('express');
const mysql=require('mysql');
const session = require('express-session');
const path = require('path');
const CryptoJS = require("crypto-js");

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
		if(letras(nom) && letras(app) && letras(apm)){
			if (alphaNumC(usu)&&alphaNumC(pass)) {
				if(correo(mail) && fecha(dat)){
					if(pass==pass2){
						nomC=cifrar(nom);
						appC=cifrar(app);
						apmC=cifrar(apm);
						usuC=cifrar(usu);
						pasC=cifrar(pass);
						con.query('INSERT INTO usuario(`nom_usu`,`app_usu`,`apm_usu`,`fec_usu`,`usu_usu`,`cor_usu`,`pas_usu`) values("'+nomC+'","'+appC+'","'+apmC+'","'+dat+'","'+usuC+'","'+mail+'","'+pasC+'")',(err,respuesta,fields)=> {
							txt='Usuario y/o correo ya registrados';
							if(err)return res.render('warning', {txt})
							res.render('succesRe');
						});
					}
					else{
						txt='Las contraseñas no coinciden'
						res.render('warning', {txt});		
					}
				}
				else{
					txt='Correo o fecha invalida'
					res.render('warning', {txt});
				}
				
			}
			else{
				txt='El usuario y contraseña solo acepta letras, números y estos caracteres epeciales .¿?¡!<>';
				res.render('warning', {txt});
			}
		}
		else{
			txt='Ingresa solo letras en el nombre y apellidos.'
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
	let txt='La contraseña solo acepta letras, números y estos caracteres epeciales .¿?¡!<>';
	if (alphaNumC(pass)) {
		txt='Correo Invalido';
		if(correo(usu)){
			txt='Usuario y/o contraseña incorrecta';
			if((usu=='milton@admon.com' && pass=='DarlingInTheFranxx002')||(usu=='mortales@admon.com' && pass=='LasNalgasDeLaxXgordaXx')){
				req.session.loggedin = true;
				req.session.username = 'admon';
				req.session.cookie.maxAge = 60*60*1000;
				res.redirect('/homeAd');
			}
			else{
				loginC(usu, function (err,data){
					pas=data.map(obj => obj.pas_usu);
					if (data.length > 0) {
						pasD=decifrar(pas);
						if(pasD==pass){
							req.session.loggedin = true;
							req.session.username = usu;
							req.session.cookie.maxAge = 5400000; //Hora y media
							res.redirect('/home')
						}
						else{
							res.render('warning', {txt});
						}
					} else {
						res.render('warning', {txt});
					}			
				});	
			}
		}
		else{
			res.render('warning', {txt});
		}
		
	}
	else{
		res.render('warning', {txt});
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
				nomC = data.map(obj => obj.nom_usu);
				appC = data.map(obj => obj.app_usu);
				apmC = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usuC = data.map(obj => obj.usu_usu);
				fec = data.map(obj => obj.fec_usu);
				nom= new Array(nomC.length);
				app= new Array(nomC.length);
				apm= new Array(nomC.length);
				usu= new Array(nomC.length);
				for (let i=0; i<nomC.length; i++) {
					nom[i]=decifrar(nomC[i]);
				}
				for (let i=0; i<nomC.length; i++) {
					app[i]=decifrar(appC[i]);
				}
				for (let i=0; i<nomC.length; i++) {
					usu[i]=decifrar(usuC[i]);
				}
				for (let i=0; i<nomC.length; i++) {
					apm[i]=decifrar(apmC[i]);
				}
				res.render('verUsuarios', {nom, app, apm, cor, usu, fec});
		});
				
	} else {
		res.render('index');
	}
});
app.get('/modUsuAd', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getUsuarios(function (err,data){
				let txt='Error al obtner los usuarios, intentalo más tarde';
				if(err)return res.render('warning2', {txt})	
				id = data.map(obj => obj.id_usu);
				nomC = data.map(obj => obj.nom_usu);
				appC = data.map(obj => obj.app_usu);
				apmC = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usuC = data.map(obj => obj.usu_usu);
				nom= new Array(nomC.length);
				app= new Array(nomC.length);
				apm= new Array(nomC.length);
				usu= new Array(nomC.length);
				for (let i=0; i<nomC.length; i++) {
					nom[i]=decifrar(nomC[i]);
				}
				for (let i=0; i<nomC.length; i++) {
					app[i]=decifrar(appC[i]);
				}
				for (let i=0; i<nomC.length; i++) {
					usu[i]=decifrar(usuC[i]);
				}
				for (let i=0; i<nomC.length; i++) {
					apm[i]=decifrar(apmC[i]);
				}
				res.render('modUsuarios', {id, nom, app, apm, cor, usu});
		});
				
	} else {
		res.render('index');
	}
});
app.post('/editarUsu', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		let id=req.body.id
		let nomD=req.body.nom
		let appD=req.body.app
		let apmD=req.body.apm
		let mail=req.body.dino
		let usuD=req.body.usu
		let txt='Usuario actualizado'
		if(letras(nomD) && letras(appD) && letras(apmD)){
			if (alphaNumC(usuD)) {
				if(correo(mail)){
					nom=cifrar(nomD);
					app=cifrar(appD);
					apm=cifrar(apmD);
					usu=cifrar(usuD);
					res.render('exito', {txt})
					con.query('UPDATE usuario SET nom_usu="'+nom+'", app_usu="'+app+'", apm_usu="'+apm+'", usu_usu="'+usu+'", cor_usu="'+mail+'" WHERE id_usu="'+id+'"',(err,respuesta,fields)=> {
						if(err){
							txt='Hubo un error, vuelva a intentarlo más tarde';
						}

					});
				}
				else{
					txt='Correo o fecha invalida'
					res.render('warning', {txt});
				}
				
			}
			else{
				txt='El usuario y contraseña solo acepta letras, números y estos caracteres epeciales .¿?¡!<>';
				res.render('warning', {txt});
			}
		}
		else{
			txt='Ingresa solo letras en el nombre y apellidos.'
			res.render('warning', {txt});
		}
		
	} else {
		res.render('index');
	}
	res.end();
});
app.get('/elUsuAd', function(req, res) {
	if (req.session.loggedin && req.session.username=='admon') {
		getUsuarios(function (err,data){
				let txt='Error al obtner los usuarios, intentalo más tarde';
				if(err)return res.render('warning2', {txt})	
				id = data.map(obj => obj.id_usu);
				usuC = data.map(obj => obj.usu_usu);
				usu= new Array(usuC.length);
				for (let i=0; i<usuC.length; i++) {
					usu[i]=decifrar(usuC[i]);
				}
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
		
		con.query('DELETE FROM usuario WHERE id_usu="'+id+'"',(err,respuesta,fields)=> {
			
			if(err){
				txt='Hubo un error al eliminar el dinosaurio'
				return res.render('warning2', {txt})	
			}
			else{
				res.render('exito', {txt})
			}
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
		res.render('contacto');
				
	} else {
		res.render('index');
	}
});
app.get('/aviso', function(req, res) {
	if (req.session.loggedin) {
		res.render('aviso');
				
	} else {
		res.render('index');
	}
});
app.get('/datosUsu', function(req, res) {
	if (req.session.loggedin) {
		let usu=req.session.username;
		getDatUsu(usu, function (err,data){
				nomC = data.map(obj => obj.nom_usu);
				appC = data.map(obj => obj.app_usu);
				apmC = data.map(obj => obj.apm_usu);
				cor = data.map(obj => obj.cor_usu);
				usuC = data.map(obj => obj.usu_usu);
				nom=decifrar(nomC);
				app=decifrar(appC);
				apm=decifrar(apmC);
				usu=decifrar(usuC);
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
				pasC = data.map(obj => obj.pas_usu);
				pas=decifrar(pas);
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
		if(alphaNumC(pass)){
			if(pass==pass2){
				let txt='Contraseña actualizada'
				res.render('exitoU', {txt})
				pasC=cifrar(pass);
				con.query('UPDATE usuario SET pas_usu="'+pasC+'" WHERE cor_usu="'+user+'"',(err,respuesta,fields)=> {
					txt='Hubo un error, vuelva a intentarlo más tarde';
					if(err)return res.render('errorU', {txt})	
				})
			}
			else{
				txt='La contraseña solo acepta letras, números y estos caracteres epeciales .¿?¡!<>';
				res.render('errorU', {txt})
			}
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
		if(escritura(des) && num(delito) && num(del)){
			let txt='Reporte agregado'
			res.render('exitoU', {txt})
			getDatUsu(usu, function (err,data){
				idU = data.map(obj => obj.id_usu);
				con.query('INSERT INTO reporte(`des_rep`,`id_tip`,`id_del`,`id_usu`) values("'+des+'","'+delito+'","'+del+'","'+idU+'")',(err,respuesta,fields)=> {
					txt='Hubo un error, vuelva a intentarlo más tarde';
					if(err)return res.render('errorU', {txt})	
				});
			});
		}
		else{
			txt='Modificaste algun valor, vuelva a intentarlo más tarde';
			res.render('errorU', {txt})	
		}
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
function loginC(cor, callback) {
    con.query('SELECT pas_usu FROM usuario WHERE cor_usu=?', [cor],function(err, rows) {
		if(err) return callback(err);
		callback(null, rows);
    });
}
//Security
function letras(checkStr){
	var checkOk="ABDEFGHIJHKLMNÑOPQRSTUVWXYZÁÉÍÓÚ"+"abcdefghijklmnopqrstuvwxyzáéíóú"+" ";
    var todovalido=true;
    for(i=0;i<checkStr.length;i++)
    {
        ch=checkStr.charAt(i);
        for(j=0;j<checkOk.length;j++)
        {
            if(ch==checkOk.charAt(j))
            {
                break;
            }
        }
        if(j==checkOk.length)
        {
            todovalido=false;
            break;
        }
	}
	if(checkStr.length<1 || checkStr.length>20){
		todovalido=false;
	}
	return todovalido;
}
function alphaNumC(checkStr){
	var checkOk="ABDEFGHIJHKLMNÑOPQRSTUVWXYZÁÉÍÓÚ"+"abcdefghijklmnopqrstuvwxyzáéíóú"+"1234567890.¡?¿!<>";
    var todovalido=true;
    for(i=0;i<checkStr.length;i++)
    {
        ch=checkStr.charAt(i);
        for(j=0;j<checkOk.length;j++)
        {
            if(ch==checkOk.charAt(j))
            {
                break;
            }
        }
        if(j==checkOk.length)
        {
            todovalido=false;
            break;
        }
	}
	if(checkStr.length<1 || checkStr.length>30){
		todovalido=false;
	}
	return todovalido;
}
function escritura(checkStr){
	var checkOk="ABDEFGHIJHKLMNÑOPQRSTUVWXYZÁÉÍÓÚ"+"abcdefghijklmnopqrstuvwxyzáéíóú"+" 1234567890.¡?¿!<>#$%&()=,;:-_";
    var todovalido=true;
    for(i=0;i<checkStr.length;i++)
    {
        ch=checkStr.charAt(i);
        for(j=0;j<checkOk.length;j++)
        {
            if(ch==checkOk.charAt(j))
            {
                break;
            }
        }
        if(j==checkOk.length)
        {
            todovalido=false;
            break;
        }
	}
	if(checkStr.length<4 || checkStr.length>255){
		todovalido=false;
	}
	return todovalido;
}
function correo(checkStr){
	var checkOk="ABDEFGHIJHKLMNÑOPQRSTUVWXYZ"+"abcdefghijklmnopqrstuvwxyz"+"1234567890.¡?¿!<>@";
    var todovalido=true;
    for(i=0;i<checkStr.length;i++)
    {
        ch=checkStr.charAt(i);
        for(j=0;j<checkOk.length;j++)
        {
            if(ch==checkOk.charAt(j))
            {
                break;
            }
        }
        if(j==checkOk.length)
        {
            todovalido=false;
            break;
        }
	}
	if(checkStr.length<5 || checkStr.length>30){
		todovalido=false;
	}
	return todovalido;
}
function fecha(checkStr){
	var checkOk="1234567890-";
    var todovalido=true;
    for(i=0;i<checkStr.length;i++)
    {
        ch=checkStr.charAt(i);
        for(j=0;j<checkOk.length;j++)
        {
            if(ch==checkOk.charAt(j))
            {
                break;
            }
        }
        if(j==checkOk.length)
        {
            todovalido=false;
            break;
        }
	}
	if(!checkStr.length==10){
		todovalido=false;
	}
	return todovalido;
}
function num(checkStr){
	var checkOk="1234567890";
    var todovalido=true;
    for(i=0;i<checkStr.length;i++)
    {
        ch=checkStr.charAt(i);
        for(j=0;j<checkOk.length;j++)
        {
            if(ch==checkOk.charAt(j))
            {
                break;
            }
        }
        if(j==checkOk.length)
        {
            todovalido=false;
            break;
        }
	}
	if(checkStr.length<1 || checkStr.length>2){
		todovalido=false;
	}
	return todovalido;
}
var key='Darling002';
function cifrar(txt){
	var ciphertext = CryptoJS.AES.encrypt(txt, key);
	return ciphertext;
}
function decifrar(ciphertext){
	var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), key);
	var plaintext = bytes.toString(CryptoJS.enc.Utf8);
	return plaintext;
}
app.listen(3030,()=>{
	console.log('Servidor escuchando en el puerto 3030')
})








