const { render } = require("pug");
const validator = require('validator');
const bcrypt = require('bcrypt');
const db = require('../db/config');
const bucket = require('../db/bucket_functions.js');
const { Router } = require("express");


exports.login = async(req,res) =>{

    const errores = {};
    var users_data = {};
    var {correo, password} = req.body;
    if(correo != '' && password != ''){

        const docRef = db.collection('evaluadores');
        const correo_cloud = await docRef.where('correo', '==', correo).get();
        
        if(correo_cloud._size == 0){
            errores.text = 'No existe un evaluador registrado con este correo electrónico.';
            req.session.errores_login = errores; 
            res.redirect('/');
        }else{
            correo_cloud.forEach(doc => {
                users_data = doc.data();
              });

              const valid_password = await bcrypt.compare(password, users_data.password);
              if(valid_password){
                  delete users_data.password;
                  req.session.datos_login = users_data;
                  req.session.isloged = true;
                  res.redirect('/profile');
              }else{
                    errores.text = 'La contraseña es incorrecta';
                    req.session.errores_login = errores; 
                    res.redirect('/');
              }

        }
    
    }else{
        res.redirect('/');
    }


}

exports.profile = async(req,res)=>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var nombre = "";

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
        delete req.session.mensaje;
        const docRef = db.collection('usuarios');
        const usuarios = await docRef.where('id', '==', datos_login.id).get();
        var users = [];
        if(usuarios._size > 0){
            usuarios.forEach(doc => {
                users.push(doc.data());
              });
        }
        
    }

    if( isloged == true){
        if(users.length > 0){
            res.render('profile.pug',{
                datos_login,
                nombre,
                users
            });
        }
        else{
            res.render('profile.pug',{
                datos_login,
                nombre
            });
        }

    }else{
        res.redirect('/');
    }

}

exports.micuenta = (req,res) =>{

}

exports.contacto = (req,res) =>{

}

exports.cerrarsesion = (req,res) =>{
    delete req.session.isloged;
    delete req.session.datos_login;

    res.redirect('/');

}

exports.crearev = (req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var nombre = "";
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }

    if( isloged == true){

        var datos_ev = req.session.datos_ev;
        var errores_ev = req.session.errores_ev;
        var tiempo = req.session.tiempo;
        delete req.session.tiempo;
        delete req.session.datos_ev;
        delete req.session.errores_ev;
        if (typeof(errores_ev) != "undefined"){

        }else{
            errores_ev={};
        }

        if (typeof(datos_ev) != "undefined"){

        }else{
            datos_ev={};
        }

        if (typeof(tiempo) != "undefined"){

        }else{
            tiempo={};
        }

        res.render('crearev.pug',{
            datos_login,
            nombre,
            datos_ev,
            errores_ev,
            tiempo
        });

    }else{
        res.redirect('/');
    }

}

exports.validarev = async (req,res) =>{

    var {nombre, identificacion, serial, org, horas, minutos, evaluador} = req.body;
    serial = serial.toString().toUpperCase();

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var error = 0;
    var errors = {}
    var datos = {}
    var hora = "";
    if (typeof(datos_login) != "undefined"){
        Nombre_ev = datos_login.nombre + " " + datos_login.apellido;
    }else{
        isloged == false;
    }

    if( isloged == true){
        
        //Validación
        const docRef = db.collection('evaluadores');
        if(validator.matches(nombre,/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && nombre != ""){
            datos.nombre = nombre;
        }
        else{
            errors.nombre = 'El nombre no es válido o el campo "Nombre" está vacio.';
            error = error +1;
        }

        if(validator.matches(identificacion,/^[0-9]{5,}$/)){
            datos.identificacion = identificacion;
            const docRef = db.collection('usuarios');
            const usuarios = await docRef.where('id', '==', datos_login.id).where('identificacion','==',identificacion).get();

            if(usuarios._size == 0){

            }else{
                const usuario_ref = [];
                usuarios.forEach(doc => {
                    usuario_ref.push(doc.data());
    
                  });
                errors.identificacion = 'Un usuario en evaluación contiene esta identificación. Referencia: ' + usuario_ref[0].nombre;
                error = error +1;
            }
        }
        else{
            errors.identificacion = 'La identificación no es válida o el campo "identificación" está vacio.';
            error = error +1;
        }

        if(validator.matches(serial,/^[0-9a-zA-Z]{4,}$/)){

            const serialRef = db.collection('seriales').doc(serial);
            const doc = await (await serialRef.get());

            if(!doc.exists){
                errors.serial = 'El numero de serial' + serial +' no existe en la base de datos';
                error = error +1;
            }else{
                const veriref = db.collection('usuarios');
                const usuarios = await veriref.where('serial', '==', serial).get();
                if(usuarios._size == 0){
                    datos.serial = serial;
                }else{
                    errors.serial = 'El numero de serial ' + serial +' existe en otro usuario';
                    error = error +1;
                }

            }
        }
        else{
            errors.serial = 'El serial no es válido o el campo "serial" está vacio.';
            error = error +1;
        }
        //       /^[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]{2,}$/
        
        if(validator.matches(org,/^[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]+(\s*[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]*)*[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]{2,}$/)){
            datos.org = org;
        }
        else{
            errors.org = 'La organzación no es válida o el campo "organzación" está vacio.';
            error = error +1;
        }

        if(validator.matches(horas,/^[0-9]+([.][0-9]+)?$/)){

        }
        else{
            errors.tiempo = 'Los campos "Horas" y "Minutos" solo deben contener números';
            error = error +1;
        }    

        if(validator.matches(minutos,/^[0-9]+([.][0-9]+)?$/)){

        }
        else{
            errors.tiempo = 'Los campos "Horas" y "Minutos" solo deben contener números';
            error = error +1;
        }    

        if(evaluador ==  Nombre_ev){
            datos.evaluador = evaluador;
        }
        else{
            errors.evaluador = 'El evaluador no coincide';
            error = error +1;
        }    

        if(error == 0){
            delete datos.evaluador;
            datos.id = datos_login.id;
            datos.tiempo = horas + ":" + minutos;
            const docRef = await db.collection('usuarios').doc(datos.identificacion);
            docRef.set(datos);
            res.redirect('/profile/crearEv');
        }else{
            var tiempo = {};
            tiempo.horas = horas;
            tiempo.minutos = minutos;
            req.session.tiempo = tiempo;
            req.session.errores_ev = errors;
            req.session.datos_ev = datos;
            res.redirect('/profile/crearEv');
        }


    }else{
        res.redirect('/');
    }

}

exports.BuscarId = async (req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var nombre = "";
    var str_hora = "";
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
        const id = req.params.id;
        const docRef = db.collection('usuarios');
        const usuarios = await docRef.where('id', '==', datos_login.id).where('identificacion','==',id).get();
        var users = [];
        if(usuarios._size > 0){
            usuarios.forEach(doc => {
                users.push(doc.data());

              });
        }
        
    }

    if( isloged == true){
        if(users.length > 0){
            res.render('profile.pug',{
                datos_login,
                nombre,
                users
            });
        }
        else{
            res.redirect('/profile');
        }

    }else{
        res.redirect('/');
    }
}

exports.UpdateiId = async(req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var mensaje = req.session.mensaje;
    delete req.session.mensaje;
    var nombre = "";

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
        const id = req.params.id;
        const docRef = db.collection('usuarios');
        const usuarios = await docRef.where('id', '==', datos_login.id).where('identificacion','==',id).get();
        var usersupdate = [];
        if(usuarios._size > 0){
            usuarios.forEach(doc => {
                var datos = doc.data();
                var tiempo_a = [];
                str_hora = datos.tiempo;
                tiempo_a = str_hora.split(":");
                datos.horas = tiempo_a[0];
                datos.minutos = tiempo_a[1];
                usersupdate.push(datos);
              });
        }
        
    }

    if(typeof(mensaje) != "undefined"){
        mensaje = mensaje;
    }
    else{
        mensaje = "";
    }

    if( isloged == true){
        if(usersupdate.length > 0){
            res.render('profile.pug',{
                datos_login,
                nombre,
                usersupdate,
                mensaje
            });
        }
        else{
            res.redirect('/profile');
        }

    }else{
        res.redirect('/');
    }
}

exports.updateUser = async(req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }

    if( isloged == true){
        var {name, identificacion, org, serial, horas, minutos, evaluador} = req.body;
        serial = serial.toString().toUpperCase();
        if(serial == ""){
            serial = "NINGUNO";
        }
        const serialRef = db.collection('seriales').doc(serial);
        const doc = await serialRef.get();

        if(!doc.exists){
            req.session.mensaje =  "El serial "+ serial +" no existe en la base de datos";
            res.redirect('/profile/update/' + identificacion);

        }else{
            if(horas == ""){
                horas = "00";
            }
            if(minutos == ""){
                minutos = "00";
            }
                
            tiempo = horas + ":" + minutos;
            var info_actualizar = {}
            req.session.mensaje = "La evaluación de " + name +" ha sido actualizada";
            info_actualizar.serial = serial;
            info_actualizar.tiempo = tiempo;
            const docRef = await db.collection('usuarios').doc(identificacion);
            docRef.update(info_actualizar);
            res.redirect('/profile');
        }

    }else{
        res.redirect('/');
    }
}

exports.updateTerminarId = async(req,res)=>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }

    if( isloged == true){
        const id = req.params.id;
        const docRef = await db.collection('usuarios').doc(id);
        terminar = {};
        terminar.serial = "NINGUNO";
        terminar.tiempo = "00:00";
        docRef.update(terminar);
        res.redirect('/profile');
    }else{
        res.redirect('/');
    }

}

exports.eliminarId = async(req,res)=>{
    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){

        const id = req.params.id;
        const docRef =  db.collection('usuarios').doc(id);
        const delete_user = await (await docRef.get()).data();
        if(delete_user){
            res.render('profile.pug',{
                datos_login,
                nombre,
                delete_user
            });
        }else{
            res.redirect('/profile');
        }


    }else{
        res.redirect('/');
    }

}

exports.eliminarEvId = async(req,res) =>{
    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){
        const id = req.params.id;
        const docRef = await db.collection('usuarios').doc(id);
        docRef.delete();
        res.redirect('/profile');
    }
    else{
        res.redirect('/');
    }
}

exports.cuenta = (req,res) =>{
    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    const datos_login_new = req.session.datos_login_new;
    const exitochangepass = req.session.pass_Change
    const isvalidated = req.session.isvalidated;
    const errores = req.session.errores;
    delete req.session.errores;
    delete req.session.datos_login_new;
    delete req.session.isvalidated;
    delete req.session.pass_Change;

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){
        res.render('cuenta.pug',{
            datos_login,
            nombre,
            datos_login_new,
            isvalidated,
            errores,
            exitochangepass
        });
    }
    else{
        res.redirect('/');
    }

}

exports.validarmiCuenta = async(req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){

        const {name,apellido,org,correo} = req.body;
        var errores = {};
        var error = 0;

        if(validator.matches(name,/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && name != ""){

        }else{
            errores.nombre = 'El campo "Nombres" está vacio o no es valido.';
            error = error +1;
        }

        if(validator.matches(apellido,/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && apellido != ""){

        }else{
            errores.apellido = 'El campo "Apellidos" está vacio o no es valido.';
            error = error +1;
        }

        if(validator.matches(org,/^[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]+(\s*[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]*)*[0-9.,a-zA-ZÀ-ÿ\u00f1\u00d1\-\_\&\^\~]{2,}$/) && org != ""){

        }else{
            errores.org = 'El campo "Organización" está vacio.';
            error = error +1;
        }

        if(validator.isEmail(correo) && correo != ""){
        
            const docRef = db.collection('evaluadores');
            const correo_cloud = await docRef.where('correo', '==', correo).get();
            if(correo_cloud._size == 0){

            }else{
                if(correo == datos_login.correo){

                }else{
                    errores.correo = "Este correo esta siendo utilizado por otro usuario.";
                    error = error +1;
                }
            }
        }else{
            errores.correo = 'El correo no es válido o el campo "Correo electrónico" está vacio.';
            error = error +1;
        }

        if(error == 0){
            if(name != datos_login.nombre || apellido != datos_login.apellido || org  != datos_login.org || correo != datos_login.correo){
                var datos_login_new = {};
                datos_login_new.nombre = name;
                datos_login_new.apellido = apellido;
                datos_login_new.org = org;
                datos_login_new.correo = correo;
                req.session.datos_login_new = datos_login_new;
                req.session.isvalidated = true;
            }
            else{

            }

            res.redirect('/profile/micuenta');
        }else{
            req.session.errores = errores;
            res.redirect('/profile/micuenta');
        }

    }
    else{
        res.redirect('/');
    }

}

exports.validarmiCuentaPass = async(req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var errores = {};
    var datos_login_new = {};

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){
        var {name,apellido,org,correo,password} = req.body;
        datos_login_new.nombre = name;
        datos_login_new.apellido = apellido;
        datos_login_new.org = org;
        datos_login_new.correo = correo;

        const docRef =  await db.collection('evaluadores').doc(datos_login.id.toString());
        const getActualEv = await (await docRef.get()).data();

        const valid_password = await bcrypt.compare(password, getActualEv.password);
        if(valid_password){
            datos_login_new.id = datos_login.id;
            docRef.update(datos_login_new);   
            req.session.datos_login = datos_login_new;  
            res.redirect('/profile/micuenta');       

        }else{
            errores.password = 'La contraseña es incorrecta';
            req.session.isvalidated = true;
            req.session.errores_login = errores; 
            req.session.datos_login_new = datos_login_new;
            res.redirect('/profile/micuenta');
        }
    }
    else{
        res.redirect('/');
    }

}

exports.passChange = async (req,res) =>{
    const isloged = req.session.isloged;
    const errores = req.session.errores_pass;

    delete req.session.errores_pass;
    var datos_login = req.session.datos_login;
    var passChange = true;

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){
        res.render('cuentapass.pug',{
            datos_login,
            nombre,
            passChange,
            errores
        });
    }
    else{
        res.redirect('/');
    }

}

exports.ActualizarPass = async(req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;
    var passChange = true;
    errores = {}

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){

        var {oldpassword, npassword, cpassword} = req.body;

        const docRef =  db.collection('evaluadores').doc(datos_login.id.toString());
        const getActualEv = await (await docRef.get()).data();
        var validado = false;
        const valid_password = await bcrypt.compare(oldpassword, getActualEv.password);
        if(valid_password){
            
            if(npassword == cpassword){
                if(validator.matches(npassword,/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
                    
                    validado = true;
                }
                else{
                    errores.password = 'La contraseña no cumple con los requisitos.';
                }
            }else{
                errores.password = 'La nueva contraseña no coincide con la confirmación';
            }

            if(validado){
                const hash = await bcrypt.hash(npassword,10);
                var varupdate = {}
                varupdate.password = hash;
                docRef.update(varupdate);
                req.session.pass_Change = "La contraseña ha sido actualizada con éxito"; 
                res.redirect('/profile/micuenta');   


            }else{
                req.session.errores_pass = errores; 
                res.redirect('/profile/micuenta/passChange');   
            }
    
        }else{
            errores.password = 'La contraseña es incorrecta';
            req.session.errores_pass = errores; 
            res.redirect('/profile/micuenta/passChange');
        }

    }
    else{
        res.redirect('/');
    }

}

exports.watchId = async(req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;

    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){
        const id = req.params.id;
        const docRef = db.collection('usuarios')
        const usuarios = await docRef.where('id', '==', datos_login.id).where('identificacion','==',id).get();
        var user = [];
        if(usuarios._size > 0){
            usuarios.forEach(doc => {
                user.push(doc.data());
              });
        }

        user = user[0];
        await docRef.doc(user.identificacion + '').update({
            "filename": "",
            "angles_filename": ""
        });


        Lista = await bucket.Lista(id);
        res.render('watch.pug',{
            datos_login,
            nombre,
            Lista,
            user
        });
    }
    else{
        res.redirect('/');
    }

}

exports.watchIdFile = async (req,res) =>{

    const isloged = req.session.isloged;
    var datos_login = req.session.datos_login;

    var FLASK_IP = process.env['FLASK_IP'];
    if(typeof(FLASK_IP) == "undefined"  || FLASK_IP == ""){
        FLASK_IP = 'localhost';
    }
    if (typeof(datos_login) != "undefined"){
        var nombre = datos_login.nombre + " " + datos_login.apellido;
    }
    if( isloged == true){
        const id = req.params.id;
        var filename = req.params.archivo;
        const docRef = db.collection('usuarios')
        const usuarios = await docRef.where('id', '==', datos_login.id).where('identificacion','==',id).get();
        var user = [];
        var opciones = [];
        if(usuarios._size > 0){
            usuarios.forEach(doc => {
                user.push(doc.data());
              });
        }

        user = user[0];
        try{
            opciones.push("ruido");
            opciones.push("luz");
            opciones.push("temperatura");
            opciones.push("humedad");
            var file = JSON.parse(await bucket.getJson(id + "/" + filename));
            if(file.emg.length != 0 && file.angx.length != 0 && file.angy.length != 0){
                opciones.push("emg");
                try{
                    var fileemg = JSON.parse(await bucket.getJson(id + "/" + filename + "-emg"));   
                }
                catch(e){
                    var MensajeEMG = false;
                }

            }
            else{
                delete file.emg;
            }
            let len = 10;
            filenames = req.params.archivo;
            res.render('watch_report.pug',{
                
                datos_login,
                nombre,
                user,
                file,
                fileemg,
                opciones,
                filenames,
                MensajeEMG,
                FLASK_IP
            });
        }
        catch(e){
           
        }

    }
    else{
        res.redirect('/');
    }

}

exports.img_process = async (req,res) =>{

    const id = req.params.id;
    const file = req.params.dir;
    const tipo = req.params.type;
    const filename = req.params.filename;
    
    var link =  id.toString() + "/" + file + "q/";

    if(tipo == "pro"){
        link = link + filename + "-pro";
    }
    if(tipo == "nopro"){
        link = link + filename;
    }

    res.redirect('https://storage.googleapis.com/tesismlac.appspot.com/' +  link);

}

exports.watchIdFileImg = async(req,res) =>{

    // http://localhost:3000//profile/watch/img/16540345/2021-09-25__12:45:56:1__13:45:56:2

    let imagen;
    let horas = await bucket.Lista_Imagenes("16540345/2021-09-25d");
    /*let horas = [
        "12_45_57",
        "12_45_59",
        "12_51_22",
        "12_58_15",
        "13_11_15",
        "13_33_41"
    ];*/
    id = req.params.id;
    filename = req.params.archivo;
    filename = filename.split('__');
    if(filename.length == 4){
        imagen = filename[3];
    }else{
        imagen = 0;
    }
    nombre = filename[0];
    hora_inicial = filename[1];
    hora_final = filename[2];

    hora_inicial = hora_inicial.split(":");
    hora_final = hora_final.split(":");

    hora1 = hora_inicial[0];
    minuto1 = hora_inicial[1];
    segundo1 = hora_inicial[2];
    hora2 = hora_final[0];
    minuto2 = hora_final[1];
    segundo2 = hora_final[2];

    var deHora = []
    var deMin = []
    var deSeg = []
    var ih1 = 0; 
    var im1 = 0;
    var is1 = 0;
    var ih2 = horas.length - 1;
    var im2 = horas.length - 1;
    var is2 = horas.length - 1;

    horas.forEach(function(valor, indice, array){
        var min = valor.split("_");
        deHora.push(min[0]);
        deMin.push(min[1]);
        deSeg.push(min[2]);
    });

    //SEGMENTAR HORA
    if(hora1 != ""){
        ih1 = getIndice(hora1,deHora);
    }
    if(hora2 != ""){
        ih2 = getIndicef(hora2,deHora);
    }

    deMin = getArraySeg(ih1,ih2,deMin);
    deSeg = getArraySeg(ih1,ih2,deSeg);
    horas = getArraySeg(ih1,ih2,horas);
    if(minuto1 != ""){
        im1 = getIndice(minuto1,deMin);
    }
    if(minuto2 != ""){
        im2 = getIndicef(minuto2,deMin);
    }

    deSeg = getArraySeg(im1,im2,deSeg);
    horas = getArraySeg(im1,im2,horas); 
    
    if(segundo1 != ""){
        is1 = getIndice(segundo1,deSeg);
    }
    if(segundo1 != ""){
        is2 = getIndicef(segundo2,deSeg);
    } 

    horas = getArraySeg(is1,is2,horas); 

    len = horas.length;

    let link;
    let b;
    imagen = imagen%len;

    if(imagen < 0){
        b = Math.abs(imagen + len);
    }else{
        b = Math.abs(imagen)
    }

    link = id.toString() + "/" + nombre + "d/" + horas[b];
    res.redirect('https://storage.googleapis.com/tesismlac.appspot.com/' +  link);
    

}

function getIndice(dato,array){
    var index = array.findIndex(ref => ref >= dato);
    if(index == -1){
        index = 0;
    }
    return index;
}

function getIndicef(dato,array){
    var array2 = array.reverse();
    var index = array2.findIndex(ref => ref <= dato);
    if(index == -1){
        index = 0;
    }
    index = (array.length -1) - index;
    return index;
}

function getArraySeg(indice1,indice2,array){
    const index2 = indice2 + 1;
    var newarray = array.slice(indice1,index2);
    return newarray;
}