const express = require('express');
const path = require('path');
const session = require('express-session');

//Importar rutas
const routes = require('./routes/index.js');

//Aplicación de express
const app = express();

//Cargar archivos estáticos

app.use(express.static('public'));

//Habilitar pug - views
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//Habilitar body parser : Leer datos de formulario

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Habilitar middleware de session

app.use(session({
    secret: 'session-1',
    resave: false,
    saveUninitialized: false
}));

//Rutas
app.use('/',routes());

app.listen(3000);
