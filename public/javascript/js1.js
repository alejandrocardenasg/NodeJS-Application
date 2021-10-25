const btn1 = document.getElementById("btn1");
const inombre = document.getElementsByName("name");
const iapellido = document.getElementsByName("apellido");
const iorg = document.getElementsByName("org");
const icorreo = document.getElementsByName("correo");
inombre[0].addEventListener('change', ()=>{
        btn1.type = 'submit';
})
iapellido[0].addEventListener('change', ()=>{
        btn1.type = 'submit';
})
iorg[0].addEventListener('change', ()=>{
        btn1.type = 'submit';
})
icorreo[0].addEventListener('change', ()=>{
        btn1.type = 'submit';
})