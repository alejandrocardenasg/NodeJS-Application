const btn_luz = document.getElementById('mostrar_luz');
const btn_temp = document.getElementById('mostrar_temperatura');
const btn_ruido = document.getElementById('mostrar_ruido');
const btn_emg = document.getElementById('mostrar_emg');
let chart1l,chart2l,chart3l;
let chart1r,chart2r,chart3r;
let chart1t,chart2t,chart3t;
let chart1e,chart1eb,chart2e,chart3e;

btn_temp.addEventListener("click", ()=>{
    mainf3("temperatura");
});

btn_luz.addEventListener("click", ()=>{
    mainf2("luz");
});

btn_ruido.addEventListener("click", ()=>{
    mainf("ruido");
});

btn_emg.addEventListener("click", ()=>{
    mainfe("emg");
});

function mainfe(opcion){
    let ids = {};
    ids.horasin = 'horas_in_' + opcion;
    ids.horasfin = 'horas_fin_' + opcion;
    ids.minin = 'minutos_in_' + opcion;
    ids.minfin = 'minutos_fin_' + opcion;
    ids.segin = 'segundos_in_' + opcion;
    ids.segfin = 'segundos_fin_' + opcion;
    ids.btnref = 'btn_ref_' + opcion;
    ids.ref = 'ref_' + opcion;
    ids.graficos = 'graficos_' + opcion;
    ids.graficas_stats1 = 'graficas_stats1_' + opcion;
    ids.grafica1 = 'grafica1_' + opcion;
    ids.grafica1b = 'grafica1b_' + opcion;
    ids.grafica2 = 'grafica2_' + opcion;
    ids.grafica3 = 'grafica3_' + opcion;
    ids.referencia_max = 'referencia_max_' + opcion;
    ids.referencia_min = 'referencia_min_' + opcion;
    ids.btn_source = "mostrar_" + opcion;
    var hora_in = "";
    var hora_fin = "";
    var minuto_in = "";
    var minuto_fin = "";
    var num = 0;
    hora_in = document.getElementsByName(ids.horasin)[0].value;
    hora_fin = document.getElementsByName(ids.horasfin)[0].value;
    minuto_in = document.getElementsByName(ids.minin)[0].value;
    minuto_fin = document.getElementsByName(ids.minfin)[0].value;
    segundo_in = document.getElementsByName(ids.segin)[0].value;
    segundo_fin = document.getElementsByName(ids.segfin)[0].value;

    const btn_ref = document.getElementById(ids.btnref);
    const ref_element = document.getElementById(ids.ref);
    ref_element.style.display = "block";
    const graficos = document.getElementById(ids.graficos);
    const graficos_stats = document.getElementById(ids.graficas_stats1);
    graficos.style.display = "block";
    //graficos_stats.style.display = "none";
    let variable;
    let label_var,label_var_min,label_var_max ;

    variable1 = "#{fileemg.cmv_r}";
    variable2 = "#{file.angx}";
    variable3 = "#{file.angy}";
    label_var1 = "Electromiografía (CMV)";
    label_var2 = "Angulos en x (°)";
    label_var3 = "Angulos en y (°)";
    label_var_min = "Mínimo emg";
    label_var_max = "Máximo emg";


    variable1 = variable1.split(",");
    variable2 = variable2.split(",");
    variable3 = variable3.split(",");

    if(hora_in.length == 1){
        hora_in = '0' + hora_in;
    }
    if(hora_fin.length == 1){
        hora_fin = '0' + hora_fin;
    }
    if(minuto_in.length == 1){
        minuto_in = '0' + minuto_in;
    }
    if(minuto_fin.length == 1){
        minuto_fin = '0' + minuto_fin;
    }
    if(segundo_in.length == 1){
        segundo_in = '0' + segundo_in;
    }
    if(segundo_fin.length == 1){
        segundo_fin = '0' + segundo_fin;
    }
    var salida = getDatosemg(variable1,variable2,variable3,hora_in,minuto_in,hora_fin,minuto_fin,segundo_in,segundo_fin);
    s_horas_e = salida.horas;
    s_datos_ea = salida.datos1;
    s_datos_eb = salida.datos2;
    s_datos_ec = salida.datos3;

    var req = {
                type: 'line',
                data: {
                    labels: s_horas_e,
                    datasets:[
                        {
                            label: label_var1,
                            data: s_datos_ea,
                            backgroundColor: "rgba(255,153,0,0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(255, 153, 0,0.3)',
                            tension: 0.2
                        }
                    ]
                }
            }
    var reqb = {
                type: 'line',
                data: {
                    labels: s_horas_e,
                    datasets:[
                        {
                            label: label_var2,
                            data: s_datos_eb,
                            backgroundColor: "rgba(253, 15, 241, 0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(253, 15, 241, 0.3)',
                            tension: 0.2
                        },
                        {
                            label: label_var3,
                            data: s_datos_ec,
                            backgroundColor: "rgba(15, 90, 253, 0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(15, 90, 253, 0.3)',
                            tension: 0.2
                        }
                    ]
                }
            }
    graficar1(opcion,ids.grafica1,req);
    graficar1b(opcion,ids.grafica1b,reqb);               

    //IMAGEN
    
    //let hora_inicial = hora_in + ":" + minuto_in + ":" + segundo_in;
    //let hora_finale = hora_fin + ":" + minuto_fin + ":" + segundo_fin;               
    let hora_inicial = s_horas_e[0];
    let hora_finale = s_horas_e[s_horas_e.length - 1];
    let count = 0;


    const imagen = document.getElementById("image_ref");
    const dec = document.getElementById("dec");
    const inc = document.getElementById("inc");
    let link = "/profile/watch/img/" + "#{user.identificacion}" + "/" +"#{filenames}" + "__" + hora_inicial + "__" + hora_finale;
    imagen.setAttribute("src",link);
    
    dec.addEventListener("click", ()=> {
        count = count - 1;
        let link = "/profile/watch/img/" + "#{user.identificacion}" + "/" +"#{filenames}" + "__" + hora_inicial + "__" + hora_finale + "__" + count;
        imagen.setAttribute("src",link);

    });

    inc.addEventListener("click", ()=>{
        count = count + 1;
        let link = "/profile/watch/img/" + "#{user.identificacion}" + "/" +"#{filenames}" + "__" + hora_inicial + "__" + hora_finale + "__" + count;
        imagen.setAttribute("src",link);
    });

    btn_ref.addEventListener("click", ()=>{
        const referencia_max = document.getElementsByName(ids.referencia_max)[0].value;
        const referencia_min = document.getElementsByName(ids.referencia_min)[0].value;
        if(referencia_max != "" && referencia_min != "" && referencia_min < referencia_max){

            //const graficos_stats = document.getElementById(ids.graficas_stats1);
            //graficos_stats.style.display = "block";
            let tamaño = s_horas_e.length;
            var array_ref_max = new Array(tamaño);
            array_ref_max.fill(referencia_max,0,tamaño);
            var array_ref_min = new Array(tamaño);
            array_ref_min.fill(referencia_min,0,tamaño);
            req = {
                    type: 'line',
                    data: {
                        labels: s_horas_e,
                        datasets:[{
                            label: label_var1,
                            data: s_datos_ea,
                            backgroundColor: "rgba(255,153,0,0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(255, 153, 0,0.3)',
                            tension: 0.2
                        },
                        {
                            label: label_var_min,
                            data: array_ref_min,
                            backgroundColor: "rgba(42,142,26,0)",
                            pointRadius:1,
                            borderColor: 'rgb(75, 192, 120)'
                        },
                        {
                            label: label_var_max,
                            data: array_ref_max,
                            backgroundColor: "rgba(242, 16, 16, 0)",
                            pointRadius:1,
                            borderColor: 'rgba(242, 16, 16)'  
                        }]
                    }
                }
            graficar1(opcion,ids.grafica1,req);

        }
    });
}

function mainf3(opcion){
    let ids = {};
    ids.horasin = 'horas_in_' + opcion;
    ids.horasfin = 'horas_fin_' + opcion;
    ids.minin = 'minutos_in_' + opcion;
    ids.minfin = 'minutos_fin_' + opcion;
    ids.btnref = 'btn_ref_' + opcion;
    ids.ref = 'ref_' + opcion;
    ids.graficos = 'graficos_' + opcion;
    ids.graficas_stats1 = 'graficas_stats1_' + opcion;
    ids.grafica1 = 'grafica1_' + opcion;
    ids.grafica2 = 'grafica2_' + opcion;
    ids.grafica3 = 'grafica3_' + opcion;
    ids.referencia_max = 'referencia_max_' + opcion;
    ids.referencia_min = 'referencia_min_' + opcion;
    ids.btn_source = "mostrar_" + opcion;
    var hora_in = "";
    var hora_fin = "";
    var minuto_in = "";
    var minuto_fin = "";
    var num = 0;
    hora_in = document.getElementsByName(ids.horasin)[0].value;
    hora_fin = document.getElementsByName(ids.horasfin)[0].value;
    minuto_in = document.getElementsByName(ids.minin)[0].value;
    minuto_fin = document.getElementsByName(ids.minfin)[0].value;

    const btn_ref = document.getElementById(ids.btnref);
    const ref_element = document.getElementById(ids.ref);
    ref_element.style.display = "block";
    const graficos = document.getElementById(ids.graficos);
    const graficos_stats = document.getElementById(ids.graficas_stats1);
    graficos.style.display = "block";
    graficos_stats.style.display = "none";
    let variable;
    let label_var,label_var_min,label_var_max ;
    switch(opcion){
        case "luz":
            variable = "#{file.luz}";
            label_var = "luminosidad (Lx)";
            label_var_min = "Mínima luminosidad";
            label_var_max = "Máxima luminosidad";
            break;
        case "ruido":
            variable = "#{file.ruido}";
            label_var = "Ruido (dB)";
            label_var_min = "Mínimo ruido";
            label_var_max = "Máxima ruido";
            break;
        case "temperatura":
            variable = "#{file.temperatura}";
            label_var = "Temperatura (°C)";
            label_var_min = "Mínima temperatura";
            label_var_max = "Máxima temperatura";
            break;  
    }

    variable = variable.split(",");
    if(hora_in.length == 1){
        hora_in = '0' + hora_in;
    }
    if(hora_fin.length == 1){
        hora_fin = '0' + hora_fin;
    }
    if(minuto_in.length == 1){
        minuto_in = '0' + minuto_in;
    }
    if(minuto_fin.length == 1){
        minuto_fin = '0' + minuto_fin;
    }
    var salida = getDatos(variable,hora_in,minuto_in,hora_fin,minuto_fin);
    s_horas_3 = salida.horas;
    s_datos_3 = salida.datos;
    var req = {
                type: 'line',
                data: {
                    labels: s_horas_3,
                    datasets:[{
                        label: label_var,
                        data: s_datos_3,
                        backgroundColor: "rgba(255,153,0,0.8)",
                        pointRadius:2,
                        borderColor: 'rgba(255, 153, 0,0.3)',
                        tension: 0.2
                    }]
                }
            }
    graficar1(opcion,ids.grafica1,req);

    btn_ref.addEventListener("click", ()=>{
        const referencia_max = document.getElementsByName(ids.referencia_max)[0].value;
        const referencia_min = document.getElementsByName(ids.referencia_min)[0].value;
        if(referencia_max != "" && referencia_min != "" && referencia_min < referencia_max){

            const graficos_stats = document.getElementById(ids.graficas_stats1);
            graficos_stats.style.display = "block";
            let tamaño = s_horas_3.length;
            var array_ref_max = new Array(tamaño);
            array_ref_max.fill(referencia_max,0,tamaño);
            var array_ref_min = new Array(tamaño);
            array_ref_min.fill(referencia_min,0,tamaño);
            req = {
                    type: 'line',
                    data: {
                        labels: s_horas_3,
                        datasets:[{
                            label: label_var,
                            data: s_datos_3,
                            backgroundColor: "rgba(255,153,0,0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(255, 153, 0,0.3)',
                            tension: 0.2
                        },
                        {
                            label: label_var_min,
                            data: array_ref_min,
                            backgroundColor: "rgba(42,142,26,0)",
                            pointRadius:1,
                            borderColor: 'rgb(75, 192, 120)'
                        },
                        {
                            label: label_var_max,
                            data: array_ref_max,
                            backgroundColor: "rgba(242, 16, 16, 0)",
                            pointRadius:1,
                            borderColor: 'rgba(242, 16, 16)'  
                        }]
                    }
                }
            graficar1(opcion,ids.grafica1,req);

            var p1 = getPorcentaje(referencia_min,referencia_max,s_datos_3);
            var p2 = getPorcentaje(referencia_min,referencia_max,variable);
            let textos = [];
            let unidad;
            switch(opcion){
                case "ruido":
                    unidad = "dB";
                    break;
                case "luz":
                    unidad = "Lx";
                    break;
                case "temperatura":
                    unidad = "°C";
                    break;
            }

            textos.push("Menores a " + referencia_min + " " +unidad);
            textos.push("Entre " + referencia_min  + " " + unidad + " y " + referencia_max + " " +unidad);
            textos.push("mayores a " + referencia_max + " " +unidad);


            const req2 = {
                    type: 'pie',
                    data: {
                        labels: textos,
                        datasets:[{
                            data: p1,
                            backgroundColor: [
                                'rgb(233, 76, 59)',
                                'rgb(0, 119, 149)',
                                'rgb(171, 200, 198)'
                            ],
                            hoverOffset: 4,
                            datalabels: {
                                color: "black",
                                font: {
                                    size: 14
                                },
                                anchor: "end",
                                backgroundColor: "white",
                                borderColor: "black",
                                borderRadius: 1,
                                borderWidth: 1,
                                formatter: function(value, context) {
                                    return value + '%';
                                }
                            }
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {

                            }
                        }
                    },
                    plugins: [ChartDataLabels],
                        options: {
                            layout:{
                                padding: 10
                            }
                        }
                } 
            
            const req3 = {
                    type: 'pie',
                    data: {
                        labels: textos,
                        datasets:[{
                            data: p2,
                            backgroundColor: [
                                'rgb(233, 76, 59)',
                                'rgb(0, 119, 149)',
                                'rgb(171, 200, 198)'
                            ],
                            hoverOffset: 4,
                            datalabels: {
                                color: "black",
                                font: {
                                    size: 14
                                },
                                anchor: "end",
                                backgroundColor: "white",
                                borderColor: "black",
                                borderRadius: 1,
                                borderWidth: 1,
                                formatter: function(value, context) {
                                        return value + '%';
                                }
                            }
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {

                            }
                        }
                    },
                    plugins: [ChartDataLabels],
                        options: {
                            layout:{
                                padding: 10
                            }   
                        }
                } 

            graficar2(opcion,ids.grafica2,req2);
            graficar3(opcion,ids.grafica3,req3);

        }
    });
}

function mainf2(opcion){
    let ids = {};
    ids.horasin = 'horas_in_' + opcion;
    ids.horasfin = 'horas_fin_' + opcion;
    ids.minin = 'minutos_in_' + opcion;
    ids.minfin = 'minutos_fin_' + opcion;
    ids.btnref = 'btn_ref_' + opcion;
    ids.ref = 'ref_' + opcion;
    ids.graficos = 'graficos_' + opcion;
    ids.graficas_stats1 = 'graficas_stats1_' + opcion;
    ids.grafica1 = 'grafica1_' + opcion;
    ids.grafica2 = 'grafica2_' + opcion;
    ids.grafica3 = 'grafica3_' + opcion;
    ids.referencia_max = 'referencia_max_' + opcion;
    ids.referencia_min = 'referencia_min_' + opcion;
    ids.btn_source = "mostrar_" + opcion;
    var hora_in = "";
    var hora_fin = "";
    var minuto_in = "";
    var minuto_fin = "";
    var num = 0;
    hora_in = document.getElementsByName(ids.horasin)[0].value;
    hora_fin = document.getElementsByName(ids.horasfin)[0].value;
    minuto_in = document.getElementsByName(ids.minin)[0].value;
    minuto_fin = document.getElementsByName(ids.minfin)[0].value;

    const btn_ref = document.getElementById(ids.btnref);
    const ref_element = document.getElementById(ids.ref);
    ref_element.style.display = "block";
    const graficos = document.getElementById(ids.graficos);
    const graficos_stats = document.getElementById(ids.graficas_stats1);
    graficos.style.display = "block";
    graficos_stats.style.display = "none";
    let variable;
    let label_var,label_var_min,label_var_max ;
    switch(opcion){
        case "luz":
            variable = "#{file.luz}";
            label_var = "luminosidad (Lx)";
            label_var_min = "Mínima luminosidad";
            label_var_max = "Máxima luminosidad";
            break;
        case "ruido":
            variable = "#{file.ruido}";
            label_var = "Ruido (dB)";
            label_var_min = "Mínimo ruido";
            label_var_max = "Máxima ruido";
            break;
        case "temperatura":
            variable = "#{file.temperatura}";
            label_var = "Temperatura (°C)";
            label_var_min = "Mínima temperatura";
            label_var_max = "Máxima temperatura";
            break;  
    }

    variable = variable.split(",");
    if(hora_in.length == 1){
        hora_in = '0' + hora_in;
    }
    if(hora_fin.length == 1){
        hora_fin = '0' + hora_fin;
    }
    if(minuto_in.length == 1){
        minuto_in = '0' + minuto_in;
    }
    if(minuto_fin.length == 1){
        minuto_fin = '0' + minuto_fin;
    }
    var salida = getDatos(variable,hora_in,minuto_in,hora_fin,minuto_fin);
    s_horas_2 = salida.horas;
    s_datos_2 = salida.datos;
    var req = {
                type: 'line',
                data: {
                    labels: s_horas_2,
                    datasets:[{
                        label: label_var,
                        data: s_datos_2,
                        backgroundColor: "rgba(255,153,0,0.8)",
                        pointRadius:2,
                        borderColor: 'rgba(255, 153, 0,0.3)',
                        tension: 0.2
                    }]
                }
            }
    graficar1(opcion,ids.grafica1,req);

    btn_ref.addEventListener("click", ()=>{
        const referencia_max = document.getElementsByName(ids.referencia_max)[0].value;
        const referencia_min = document.getElementsByName(ids.referencia_min)[0].value;
        if(referencia_max != "" && referencia_min != "" && referencia_min < referencia_max){

            const graficos_stats = document.getElementById(ids.graficas_stats1);
            graficos_stats.style.display = "block";
            let tamaño = s_horas_2.length;
            var array_ref_max = new Array(tamaño);
            array_ref_max.fill(referencia_max,0,tamaño);
            var array_ref_min = new Array(tamaño);
            array_ref_min.fill(referencia_min,0,tamaño);
            req = {
                    type: 'line',
                    data: {
                        labels: s_horas_2,
                        datasets:[{
                            label: label_var,
                            data: s_datos_2,
                            backgroundColor: "rgba(255,153,0,0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(255, 153, 0,0.3)',
                            tension: 0.2
                        },
                        {
                            label: label_var_min,
                            data: array_ref_min,
                            backgroundColor: "rgba(42,142,26,0)",
                            pointRadius:1,
                            borderColor: 'rgb(75, 192, 120)'
                        },
                        {
                            label: label_var_max,
                            data: array_ref_max,
                            backgroundColor: "rgba(242, 16, 16, 0)",
                            pointRadius:1,
                            borderColor: 'rgba(242, 16, 16)'  
                        }]
                    }
                }
            graficar1(opcion,ids.grafica1,req);

            var p1 = getPorcentaje(referencia_min,referencia_max,s_datos_2);
            var p2 = getPorcentaje(referencia_min,referencia_max,variable);
            let textos = [];
            let unidad;
            switch(opcion){
                case "ruido":
                    unidad = "dB";
                    break;
                case "luz":
                    unidad = "Lx";
                    break;
                case "temperatura":
                    unidad = "°C";
                    break;
            }

            textos.push("Menores a " + referencia_min + " " +unidad);
            textos.push("Entre " + referencia_min  + " " + unidad + " y " + referencia_max + " " +unidad);
            textos.push("mayores a " + referencia_max + " " +unidad);


            const req2 = {
                    type: 'pie',
                    data: {
                        labels: textos,
                        datasets:[{
                            data: p1,
                            backgroundColor: [
                                'rgb(233, 76, 59)',
                                'rgb(0, 119, 149)',
                                'rgb(171, 200, 198)'
                            ],
                            hoverOffset: 4,
                            datalabels: {
                                color: "black",
                                font: {
                                    size: 14
                                },
                                anchor: "end",
                                backgroundColor: "white",
                                borderColor: "black",
                                borderRadius: 1,
                                borderWidth: 1,
                                formatter: function(value, context) {
                                    return value + '%';
                                }
                            }
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {

                            }
                        }
                    },
                    plugins: [ChartDataLabels],
                        options: {
                            layout:{
                                padding: 10
                            }
                        }
                } 
            
            const req3 = {
                    type: 'pie',
                    data: {
                        labels: textos,
                        datasets:[{
                            data: p2,
                            backgroundColor: [
                                'rgb(233, 76, 59)',
                                'rgb(0, 119, 149)',
                                'rgb(171, 200, 198)'
                            ],
                            hoverOffset: 4,
                            datalabels: {
                                color: "black",
                                font: {
                                    size: 14
                                },
                                anchor: "end",
                                backgroundColor: "white",
                                borderColor: "black",
                                borderRadius: 1,
                                borderWidth: 1,
                                formatter: function(value, context) {
                                        return value + '%';
                                }
                            }
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {

                            }
                        }
                    },
                    plugins: [ChartDataLabels],
                        options: {
                            layout:{
                                padding: 10
                            }   
                        }
                } 

            graficar2(opcion,ids.grafica2,req2);
            graficar3(opcion,ids.grafica3,req3);

        }
    });
}

function mainf(opcion){
    let ids = {};
    ids.horasin = 'horas_in_' + opcion;
    ids.horasfin = 'horas_fin_' + opcion;
    ids.minin = 'minutos_in_' + opcion;
    ids.minfin = 'minutos_fin_' + opcion;
    ids.btnref = 'btn_ref_' + opcion;
    ids.ref = 'ref_' + opcion;
    ids.graficos = 'graficos_' + opcion;
    ids.graficas_stats1 = 'graficas_stats1_' + opcion;
    ids.grafica1 = 'grafica1_' + opcion;
    ids.grafica2 = 'grafica2_' + opcion;
    ids.grafica3 = 'grafica3_' + opcion;
    ids.referencia_max = 'referencia_max_' + opcion;
    ids.referencia_min = 'referencia_min_' + opcion;
    ids.btn_source = "mostrar_" + opcion;
    var hora_in = "";
    var hora_fin = "";
    var minuto_in = "";
    var minuto_fin = "";
    var num = 0;
    hora_in = document.getElementsByName(ids.horasin)[0].value;
    hora_fin = document.getElementsByName(ids.horasfin)[0].value;
    minuto_in = document.getElementsByName(ids.minin)[0].value;
    minuto_fin = document.getElementsByName(ids.minfin)[0].value;

    const btn_ref = document.getElementById(ids.btnref);
    const ref_element = document.getElementById(ids.ref);
    ref_element.style.display = "block";
    const graficos = document.getElementById(ids.graficos);
    const graficos_stats = document.getElementById(ids.graficas_stats1);
    graficos.style.display = "block";
    graficos_stats.style.display = "none";
    let variable;
    let label_var,label_var_min,label_var_max ;
    switch(opcion){
        case "luz":
            variable = "#{file.luz}";
            label_var = "luminosidad (Lx)";
            label_var_min = "Mínima luminosidad";
            label_var_max = "Máxima luminosidad";
            break;
        case "ruido":
            variable = "#{file.ruido}";
            label_var = "Ruido (dB)";
            label_var_min = "Mínimo ruido";
            label_var_max = "Máxima ruido";
            break;
        case "temperatura":
            variable = "#{file.temperatura}";
            label_var = "Temperatura (°C)";
            label_var_min = "Mínima temperatura";
            label_var_max = "Máxima temperatura";
            break;  
    }

    variable = variable.split(",");
    if(hora_in.length == 1){
        hora_in = '0' + hora_in;
    }
    if(hora_fin.length == 1){
        hora_fin = '0' + hora_fin;
    }
    if(minuto_in.length == 1){
        minuto_in = '0' + minuto_in;
    }
    if(minuto_fin.length == 1){
        minuto_fin = '0' + minuto_fin;
    }
    var salida = getDatos(variable,hora_in,minuto_in,hora_fin,minuto_fin);
    s_horas = salida.horas;
    s_datos = salida.datos;
    var req = {
                type: 'line',
                data: {
                    labels: s_horas,
                    datasets:[{
                        label: label_var,
                        data: s_datos,
                        backgroundColor: "rgba(255,153,0,0.8)",
                        pointRadius:2,
                        borderColor: 'rgba(255, 153, 0,0.3)',
                        tension: 0.2
                    }]
                }
            }
    graficar1(opcion,ids.grafica1,req);

    btn_ref.addEventListener("click", ()=>{
        const referencia_max = document.getElementsByName(ids.referencia_max)[0].value;
        const referencia_min = document.getElementsByName(ids.referencia_min)[0].value;
        if(referencia_max != "" && referencia_min != "" && referencia_min < referencia_max){

            const graficos_stats = document.getElementById(ids.graficas_stats1);
            graficos_stats.style.display = "block";
            let tamaño = s_horas.length;
            var array_ref_max = new Array(tamaño);
            array_ref_max.fill(referencia_max,0,tamaño);
            var array_ref_min = new Array(tamaño);
            array_ref_min.fill(referencia_min,0,tamaño);
            req = {
                    type: 'line',
                    data: {
                        labels: s_horas,
                        datasets:[{
                            label: label_var,
                            data: s_datos,
                            backgroundColor: "rgba(255,153,0,0.8)",
                            pointRadius:2,
                            borderColor: 'rgba(255, 153, 0,0.3)',
                            tension: 0.2
                        },
                        {
                            label: label_var_min,
                            data: array_ref_min,
                            backgroundColor: "rgba(42,142,26,0)",
                            pointRadius:1,
                            borderColor: 'rgb(75, 192, 120)'
                        },
                        {
                            label: label_var_max,
                            data: array_ref_max,
                            backgroundColor: "rgba(242, 16, 16, 0)",
                            pointRadius:1,
                            borderColor: 'rgba(242, 16, 16)'  
                        }]
                    }
                }
            graficar1(opcion,ids.grafica1,req);

            var p1 = getPorcentaje(referencia_min,referencia_max,s_datos);
            var p2 = getPorcentaje(referencia_min,referencia_max,variable);
            let textos = [];
            let unidad;
            switch(opcion){
                case "ruido":
                    unidad = "dB";
                    break;
                case "luz":
                    unidad = "Lx";
                    break;
                case "temperatura":
                    unidad = "°C";
                    break;
            }

            textos.push("Menores a " + referencia_min + " " +unidad);
            textos.push("Entre " + referencia_min  + " " + unidad + " y " + referencia_max + " " +unidad);
            textos.push("mayores a " + referencia_max + " " +unidad);


            const req2 = {
                    type: 'pie',
                    data: {
                        labels: textos,
                        datasets:[{
                            data: p1,
                            backgroundColor: [
                                'rgb(233, 76, 59)',
                                'rgb(0, 119, 149)',
                                'rgb(171, 200, 198)'
                            ],
                            hoverOffset: 4,
                            datalabels: {
                                color: "black",
                                font: {
                                    size: 14
                                },
                                anchor: "end",
                                backgroundColor: "white",
                                borderColor: "black",
                                borderRadius: 1,
                                borderWidth: 1,
                                formatter: function(value, context) {
                                    return value + '%';
                                }
                            }
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {

                            }
                        }
                    },
                    plugins: [ChartDataLabels],
                        options: {
                            layout:{
                                padding: 10
                            }
                        }
                } 
            
            const req3 = {
                    type: 'pie',
                    data: {
                        labels: textos,
                        datasets:[{
                            data: p2,
                            backgroundColor: [
                                'rgb(233, 76, 59)',
                                'rgb(0, 119, 149)',
                                'rgb(171, 200, 198)'
                            ],
                            hoverOffset: 4,
                            datalabels: {
                                color: "black",
                                font: {
                                    size: 14
                                },
                                anchor: "end",
                                backgroundColor: "white",
                                borderColor: "black",
                                borderRadius: 1,
                                borderWidth: 1,
                                formatter: function(value, context) {
                                        return value + '%';
                                }
                            }
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {

                            }
                        }
                    },
                    plugins: [ChartDataLabels],
                        options: {
                            layout:{
                                padding: 10
                            }   
                        }
                } 

            graficar2(opcion,ids.grafica2,req2);
            graficar3(opcion,ids.grafica3,req3);

        }
    });
}

function getDatos(datos,hora1,minuto1,hora2,minuto2){

    var horas = "#{file.hora}";
    horas = horas.split(",");
    var deHora = [];
    var deMin = [];
    var horac = [];
    var ih1 = 0; 
    var im1 = 0;
    var ih2 = horas.length - 1;
    var im2 = horas.length - 1;
    horas.forEach(function(valor, indice, array){
        var min = valor.split(":");
        deHora.push(min[0]);
        deMin.push(min[1]);
    });

    if(hora1 != ""){
        ih1 = getIndice(hora1,deHora);
    }
    if(hora2 != ""){
        ih2 = getIndicef(hora2,deHora);
    }

    deMin = getArraySeg(ih1,ih2,deMin);
    horas = getArraySeg(ih1,ih2,horas);
    datos = getArraySeg(ih1,ih2,datos);

    if(minuto1 != ""){
        im1 = getIndice(minuto1,deMin);
    }
    if(minuto2 != ""){
        im2 = getIndicef(minuto2,deMin);
    }

    if(im2 < im1){
        im1 = 0;
        im2 = deMin.length -1;
    }

    horas = getArraySeg(im1,im2,horas);
    datos = getArraySeg(im1,im2,datos);
    salida = {}
    salida.horas = horas;
    salida.datos = datos;
    return salida;
}

function getDatosemg(datos1,datos2,datos3,hora1,minuto1,hora2,minuto2, segundo1,segundo2){

    var horas = "#{file.horas}";
    horas = horas.split(",");
    var deHora = [];
    var deMin = [];
    var horac = [];
    var deSeg = [];
    var ih1 = 0; 
    var im1 = 0;
    var is1 = 0;
    var ih2 = horas.length - 1;
    var im2 = horas.length - 1;
    var is2 = horas.length - 1;
    horas.forEach(function(valor, indice, array){
        var min = valor.split(":");
        deHora.push(min[0]);
        deMin.push(min[1]);
        deSeg.push(min[2]);
    });

    if(hora1 != ""){
        ih1 = getIndice(hora1,deHora);
    }
    if(hora2 != ""){
        ih2 = getIndicef(hora2,deHora);
    }

    deMin = getArraySeg(ih1,ih2,deMin);
    deSeg = getArraySeg(ih1,ih2,deSeg);
    horas = getArraySeg(ih1,ih2,horas);
    datos1 = getArraySeg(ih1,ih2,datos1);
    datos2 = getArraySeg(ih1,ih2,datos2);
    datos3 = getArraySeg(ih1,ih2,datos3);


    if(minuto1 != ""){
        im1 = getIndice(minuto1,deMin);
    }
    if(minuto2 != ""){
        im2 = getIndicef(minuto2,deMin);
    }

    if(im2 < im1){
        im1 = 0;
        im2 = deMin.length -1;
    }

    deSeg = getArraySeg(im1,im2,deSeg);
    horas = getArraySeg(im1,im2,horas);
    datos1 = getArraySeg(im1,im2,datos1);
    datos2 = getArraySeg(im1,im2,datos2);
    datos3 = getArraySeg(im1,im2,datos3);
    
    if(segundo1 != ""){
        is1 = getIndice(segundo1, deSeg);
    }                
    if(segundo2 != ""){
        is2 = getIndicef(segundo2, deSeg);  
    }

    horas = getArraySeg(is1,is2,horas);
    datos1 = getArraySeg(is1,is2,datos1);
    datos2 = getArraySeg(is1,is2,datos2);
    datos3 = getArraySeg(is1,is2,datos3);
    
    salida = {}
    salida.horas = horas;
    salida.datos1 = datos1;
    salida.datos2 = datos2;
    salida.datos3 = datos3;
    return salida;
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

function getPorcentaje(minimo,maximo,datos){
    let tamaño = datos.length;
    var p1 = 0;
    var p2 = 0;
    var p3 = 0;
    datos.forEach(function(valor, indice, array){
        if(valor >= maximo){
            p3 = p3 +1;
        }else{
            if(valor > minimo){
                p2 = p2 + 1;
            }else{
                p1 =p1 + 1;
            }
        }

    });       
    p1 = (p1/tamaño)*100;
    p1 = p1.toFixed(1);
    p2 = (p2/tamaño)*100;
    p2 = p2.toFixed(1);
    p3 = (p3/tamaño)*100;
    p3 = p3.toFixed(1);
    var salida = [];
    salida.push(p1);
    salida.push(p2);
    salida.push(p3);
    return salida;
}

function graficar1(opcion,id,conf){
    switch(opcion){
        case "ruido":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart1r){
                chart1r.clear();
                chart1r.destroy();
            }

            chart1r = new Chart(ctx,conf);
            break;

        case "luz":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart1l){
                chart1l.clear();
                chart1l.destroy();
            }

            chart1l = new Chart(ctx,conf);
            break;

        case "temperatura":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart1t){
                chart1t.clear();
                chart1t.destroy();
            }

            chart1t = new Chart(ctx,conf);
            break;

        case "emg":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart1e){
                chart1e.clear();
                chart1e.destroy();
            }

            chart1e = new Chart(ctx,conf);
            break;
    }

}

function graficar1b(opcion,id,conf){
    var ctx = document.getElementById(id).getContext('2d');
    if(chart1eb){
        chart1eb.clear();
        chart1eb.destroy();
    }

    chart1eb = new Chart(ctx,conf);
}

function graficar2(opcion,id,conf){
    switch(opcion){
        case "ruido":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart2r){
                chart2r.clear();
                chart2r.destroy();
            }

            chart2r = new Chart(ctx,conf);
            break;

        case "luz":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart2l){
                chart2l.clear();
                chart2l.destroy();
            }

            chart2l = new Chart(ctx,conf);
            break;

        case "temperatura":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart2t){
                chart2t.clear();
                chart2t.destroy();
            }

            chart2t = new Chart(ctx,conf);
            break;
    }

}

function graficar3(opcion,id,conf){
    switch(opcion){
        case "ruido":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart3r){
                chart3r.clear();
                chart3r.destroy();
            }

            chart3r = new Chart(ctx,conf);
            break;

        case "luz":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart3l){
                chart3l.clear();
                chart3l.destroy();
            }

            chart3l = new Chart(ctx,conf);
            break;

        case "temperatura":
            var ctx = document.getElementById(id).getContext('2d');
            if(chart3t){
                chart3t.clear();
                chart3t.destroy();
            }

            chart3t = new Chart(ctx,conf);
            break;
    }

}