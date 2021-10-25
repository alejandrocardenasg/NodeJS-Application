const { render } = require("pug");
const validator = require('validator');
const bcrypt = require('bcrypt');
const bucket = require('../db/bucket_functions.js');
const db = require('../db/config');
const fs = require('fs');

exports.proyectosHome = (req,res)=>{
    var registered = req.session.registered;
    var errores = req.session.errores_login;
    delete req.session.errores_login;
    delete req.session.registered;

    if (typeof(errores) != "undefined"){

    }else{
        errores={};
    }

    if (typeof(registered) != "undefined"){

    }else{
        registered= "";
    }

    res.render('index.pug',{
        TituloPagina : 'Login',
        errores,
        registered
    });
}

//'/registro'
exports.RegistroForm1 = (req,res)=>{
    var recovery_f1 = req.session.form1;
    var errors_f1 = req.session.errors;
    delete req.session.form1;
    delete req.session.errors;

    if (typeof(errors_f1) != "undefined"){

    }else{
        errors_f1={};
    }
    if (typeof(recovery_f1) != "undefined"){

    }else{
        recovery_f1={};
    }
    res.render('registro-form1.pug',{
        TituloPagina : 'Registro',
        recovery_f1,
        errors_f1
    });

    /*
    if(recovery_f1 == null){
        const recovery_f1 = {
            nombre: '',
            apellido: '',
            org: '',
            correo: ''
        }
        const errors_f1 = {
            nombre: '',
            apellido: '',
            org: '',
            correo: ''
        }
        res.render('registro-form1.pug',{
            TituloPagina : 'Registro',
            recovery_f1,
            errors_f1
        });
    }else{
        res.render('registro-form1.pug',{
            TituloPagina : 'Registro',
            recovery_f1,
            errors_f1
        });
    }
    */

}

///validar-Form-registro
exports.validarFormRegistro = async (req,res)=>{

    var {nombre, apellido, org, correo} = req.body;
    var nombre = nombre.toString();
    var apellido = apellido.toString();
    var org = org.toString();
    var errors = {};
    var dato = {};

    if(validator.matches(nombre,/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && nombre != ""){
        val_nombre = nombre;
        dato.nombre = val_nombre;
    }
    else{
        val_nombre = '';
        errors.nombre = 'El nombre no es válido o el campo "Nombre" está vacio.';
    }

    if(validator.matches(apellido,/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && apellido != ""){
        val_apellido = apellido;
        dato.apellido = val_apellido;
    }
    else{
        errors.apellido = 'El apellido no es válido o el campo "Apellido" está vacio.';
        val_apellido = '';
    }

    if(validator.matches(org,/^[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]+(\s*[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]*)*[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]+$/) && org != ""){
        val_org = org;
        dato.org = val_org;
    }
    else{
        errors.org = 'El campo "Organización" está vacio.';
        val_org = '';
    }

    if(validator.isEmail(correo) && correo != ""){
        
        const docRef = db.collection('evaluadores');
        const correo_cloud = await docRef.where('correo', '==', correo).get();
        if(correo_cloud._size == 0){
            val_correo = correo.toString();
            dato.correo = val_correo;
        }else{
            errors.correo = 'Este correo ya ha sido registrado por un evaluador';
            val_correo = '';
        }
    }else{
        errors.correo = 'El correo no es válido o el campo "Correo electrónico" está vacio.';
        val_correo = '';
    }

    req.session.form1 = dato;
    req.session.errors = errors;

    if(val_nombre == '' || val_apellido == '' || val_org == '' || val_correo == ''){
        res.redirect('/registro');
    }else{
        correo = correo.toString();
        req.session.form1fill = true;
        res.redirect('/registroConf');
    }

    }
//registroConf
exports.RegistroForm2 = (req,res)=>{

    const form1fill = req.session.form1fill;
    delete req.session.form1fill;

    if(form1fill == true){
        var errors_f2 = req.session.errors;
        delete req.session.errors;
    
        res.render('registro-form2.pug',{
            TituloPagina: 'Registro',
            errors_f2
        });
    }else{
        res.redirect('/registro');
    }


}

//validar-Form2-registro
exports.validarForm2Registro = (req,res)=>{

    const recovery_f1 = req.session.form1;
    delete req.session.errors;

    var {correo, password, conf_password} = req.body;
    var correo = correo.toString();
    var password = password.toString();
    var conf_password = conf_password.toString();

    var errors = {}; 
    
    error1 = true;
    error2 = true;

    if(validator.isEmail(correo) && correo != ""){
        if(correo == recovery_f1.correo){
            error1 = false;
        }
        else{
            errors.correo = 'El correo no coincide con el formulario anterior.';
        }
    }else{
        errors.correo = 'El correo no es válido o el campo "Correo electrónico" está vacio.';
    }

    if(validator.matches(password,/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
        
        if(password == conf_password){
            error2 = false;
        }
        else{
            errors.contraseña = 'Las contraseñas no coinciden. Intentelo de nuevo.'
        }
    }
    else{
        errors.contraseña = 'La contraseña no cumple con los requisitos.';
    }

    req.session.errors = errors;

    if(error1 != false || error2 != false){
        res.redirect('/registroConf');
    }else{
        // const usuario = new ArmarUsuario(datos);
        var usuario = req.session.form1;
        usuario.password = password;
        delete req.session.form1;
        delete req.session.errors;
        req.session.form2 = usuario;
        res.redirect('/RegistrarEvaluador');
    }
}

exports.registrarevaluador = async(req,res)=>{
    
    var Evaluador = req.session.form2;
    delete req.session.form2;
    try{
        var fin = false;
        const hash = await bcrypt.hash(Evaluador.password,10);
        Evaluador.password = hash;
        var id = getRandomArbitrary();
        while(fin == false){
            const docRef_id = db.collection('evaluadores');
            const id_user = await docRef_id.where('id', '==', id).get();
            if(id_user._size == 0){
                fin = true;
            }else{
                id = getRandomArbitrary();
            }
        }
        Evaluador.id = id;
        name_doc = id.toString();
        const docRef = await db.collection('evaluadores').doc(name_doc);
        docRef.set(Evaluador);
        req.session.registered = "¡Registro satisfactorio!";
        res.redirect('/')

    }catch(e){
        console.log(e);
        res.status(500);
    }
   
}

exports.prueba = async (req,res)=>{
} 

// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary() {
    return Math.floor(Math.random() * (1000 - 1) + 1);
  }

