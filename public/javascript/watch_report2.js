
const contenedor_imagen_postural = document.getElementById("imagen_postural");
const btn_procesar = document.getElementById("procesar_imagen");
const img_no = document.getElementById("imagen_no_process");
const img_pro = document.getElementById("imagen_process");

btn_procesar.addEventListener("click", ()=>{

    contenedor_imagen_postural.style.display = "inline";
    
    var link1 = "/profile/watch/procs/" + "#{user.identificacion}" + "/" + "#{filenames}" + "/" + "nopro" + "/" + "#{user.filename}";
    var link2 = "/profile/watch/procs/" + "#{user.identificacion}" + "/" + "#{filenames}" + "/" + "pro" + "/" + "#{user.filename}";
    console.log("listo");
    img_no.setAttribute("src",link1);
    img_pro.setAttribute("src",link2);
});