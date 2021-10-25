const express = require('express');
const router = express.Router();
const { render } = require('pug');

//importar controlador
const proyectosController = require('../controllers/proyectoController.js');
const proyectosController2 = require('../controllers/proyectoController2.js');
module.exports = function(){

    //RUTA HOME
    router.get('/',proyectosController.proyectosHome);

    router.get('/registro',proyectosController.RegistroForm1);

    router.post('/validar-Form-registro',proyectosController.validarFormRegistro)

    router.get('/registroConf',proyectosController.RegistroForm2);

    router.post('/validar-Form2-registro',proyectosController.validarForm2Registro)

    router.get('/prueba', proyectosController.prueba);

    router.get('/RegistrarEvaluador', proyectosController.registrarevaluador)

    router.post('/Login', proyectosController2.login);

    router.get('/profile', proyectosController2.profile);

    router.post('/profile', proyectosController2.profile)

    router.get('/profile/contacto', proyectosController2.contacto);

    router.get('/cerrarsesion',proyectosController2.cerrarsesion);

    router.get('/profile/crearEv', proyectosController2.crearev);

    router.post('/profile/crearEv/validar', proyectosController2.validarev);

    router.get('/profile/BuscarId/:id', proyectosController2.BuscarId);

    router.get('/profile/update/:id', proyectosController2.UpdateiId);

    router.post('/profile/update', proyectosController2.updateUser);

    router.get('/profile/update/terminar/:id', proyectosController2.updateTerminarId);

    router.get('/profile/eliminar/:id', proyectosController2.eliminarId);

    router.get('/profile/eliminarEv/:id', proyectosController2.eliminarEvId);

    router.get('/profile/micuenta', proyectosController2.cuenta);

    router.post('/profile/micuenta/validate', proyectosController2.validarmiCuenta);

    router.post('/profile/micuenta/validatePassword', proyectosController2.validarmiCuentaPass);

    router.get('/profile/micuenta/passChange', proyectosController2.passChange);

    router.post('/profile/micuenta/passChange/ActualizarPass', proyectosController2.ActualizarPass);

    router.get('/profile/watch/:id', proyectosController2.watchId);

    router.get('/profile/watch/:id/:archivo', proyectosController2.watchIdFile);

    router.get('/profile/watch/img/:id/:archivo', proyectosController2.watchIdFileImg);

    router.get('/profile/watch/procs/:id/:dir/:type/:filename', proyectosController2.img_process);

    return router;
}