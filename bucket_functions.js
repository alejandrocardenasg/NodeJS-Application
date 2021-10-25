const bucket = require('../db/bucket');
const validator = require('validator');

const Lista = async(CarpetaUsuario) =>{

    var lista_files = [];
    const options = {
        prefix: CarpetaUsuario,
    };
    try{
        const [files] = await bucket.getFiles(options);
        files.forEach(file => {
            var nombre = file.name;
            nombre = nombre.replace(CarpetaUsuario + '/', '');
            nombre = nombre.replace('.json', '')
            
            if(validator.isDate(nombre, 'yyyy-MM-dd') && nombre.slice(-4) != "-emg"){
                lista_files.push(nombre);
            }

            /*
            if(nombre.slice(-4) != "-emg"){

            }
            */
        });
        console.log(lista_files);
        return(lista_files);

    }catch(err){
        console.log(err);
    }
}

const Lista_Imagenes = async(CarpetaUsuario) =>{

    var lista_files = [];
    const options = {
        prefix: CarpetaUsuario,
    };
    try{
        const [files] = await bucket.getFiles(options);
        files.forEach(file => {
            var nombre = file.name;
            nombre = nombre.replace(CarpetaUsuario + '/', '');
            if(nombre != ''){
                lista_files.push(nombre);
            }


        });
        console.log(lista_files);
        return(lista_files);

    }catch(err){
        console.log(err);
    }
}

const getJson = async (PathFile) => new Promise((resolve, reject) => {
    let buf = ''
    bucket.file(PathFile)
      .createReadStream()
      .on('data', d => (buf += d))
      .on('end', () => resolve(buf))
      .on('error', e => reject(e))
  })
 

module.exports = {
    Lista,
    getJson,
    Lista_Imagenes
}
