const db = require('../db/config.js');

datos = {
    nombre : 'alejandro',
    apellido : 'cardenas',
    identificacion: '124125125',
    organizacion : 'uao',
    correo : 'ale@gaa.com',
    password: 'adasfasgaracadfafa',
}

function CrearEvaluador(datos){

    var name_doc = datos.identificacion; 
    const docRef = db.collection('evaluadores').doc(name_doc);
    docRef.set(datos);
}

function getEvaluador(identificacion){
    const docRef = db.collection('evaluadores').doc(identificacion);
    const evaluador = '';
    
}

async function AsyncgetEvaluador(req,res){
    const docRef = db.collection('evaluadores').doc(id);
    const Evaluador = await docRef.get();
    return Evaluador;
}

async function Asyncget((req,res) =>{
    try{
        const docRef = db.collection('evaluadores').doc('Alejandro-alejandro.cardenas_g@qqqq.com');
        const Evaluador = await docRef.get();
        return Evaluador;
    }catch(e){
        console.log(id);
    }

});


const a = Asyncget('124125125');
console.log(a);