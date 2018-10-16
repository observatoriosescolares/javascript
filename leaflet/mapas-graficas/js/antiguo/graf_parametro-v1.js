//----------------------------------------------------------------------------------------------------
//DEFINICIÓN DE VARIABLES Y RECOGIDA DE PARÁMETROS DE LA URL. 
var misVariablesGet = getVarsUrl();
var proveedor = misVariablesGet.proveedor;
if (!proveedor) {proveedor = "OE_I_EDU"}
var rango = misVariablesGet.rango;
if ( !rango ) { rango = "0.02"}
var fin = misVariablesGet.fin;
if ( !fin ){fin="-1"};
var parametro = misVariablesGet.parametro;
if (!parametro){parametro = "temperatura"};
//-------------------------------------------------------------------------
var inicio=0;
var finGra=0;
var maximo=0;
var minimo=0;
var media=0; //si no ponemos el cero pone que no está definida. 
var plot6;
var xmlhttp = new XMLHttpRequest();
//var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID=OE_I_EDU&sensorID=temperatura&rango=0.02;
var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID="+proveedor+"&sensorID="+parametro+"&rango="+rango+"&fin=-1";

// REPRESENTACIÓN GRÁFICA-------------------------------------------------
$(document).ready(function () {  
    var myArr = {};  
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
        {
              myArr = JSON.parse(xmlhttp.responseText);
		      if (JSON.stringify(myArr)=='{}'){
                    deleteGraf();
              }else{
                    if (plot6){
                        plot6.destroy();
                    }
                    updateSeries();
              }
        }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();  
    window.setInterval(updateSeries, 4000);
});
function rellenarArray(Arr){
    var line4 = [];
    a = 0;
    var j = 0;
    count = 0;
    media = 0;
    for (var prop_name in Arr) {
        a = parseFloat(prop_name);  
        line4.push([a, Arr[prop_name]]) 
        if (j==0){
            inicio = a;
            maximo = parseFloat(Arr[prop_name]);
            minimo = parseFloat(Arr[prop_name]);
            j = 1; 
        }
        if (parseFloat(Arr[prop_name]) > maximo){maximo = parseFloat(Arr[prop_name])}
        if (parseFloat(Arr[prop_name]) < minimo){minimo = parseFloat(Arr[prop_name])}
        media += parseFloat(Arr[prop_name]);
        count += 1;
    };
    finGra = a;
    media = media/count;
    return line4;
};
function crearGrafica(myArr1){
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    } //Se puede utilizar para la finalización de la gráfica pero 
    inicioGra = 
	plot6 = $.jqplot("parametro",  [myArr1], {	
		    //title : nombre,
		    axesDefaults: {
        		tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        		tickOptions: {
          			//angle: -20,
          			fontSize: '10pt'
        		}
            },	 	
            axes: {
                //xaxis:{ min:(Date.now()-(3600*rango*1000)), max:Date.now(), renderer: $.jqplot.DateAxisRenderer,
		xaxis:{ min:(finGra-(3600*rango*1000)), max: finGra, renderer: $.jqplot.DateAxisRenderer,
			tickOptions: {formatString: '%#d %b, %H:%M:%S', angle: -20}, 					    				tickInterval: '0.05 hour', numberTicks: '7',
			labelOptions:{fontFamily:'Helvetica', fontSize: '12pt', textColor: '#437BD0'},
			label:'Máxima ' +maximo+ ', mínima: ' +minimo+ ' y media: '+media.toFixed(1)
                },
                yaxis:{min:minimo -2 , max:maximo + 2, 
			tickOptions:{formatString:'%.0f'},
			labelOptions:{fontFamily:'Helvetica', fontSize: '12pt'}, 				
			label: parametro ,labelRenderer: $.jqplot.CanvasAxisLabelRenderer}
                },
            	highlighter: {
                	show: true,
                	sizeAdjust: 10.0, //Circulo alrededor del punto del que se escribe el valor
                	tooltipFormatString: '%H:%M %.0fºC'
      		},
      		cursor: {
        	 	show: true,
                	tooltipLocation:'sw',
                	zoom:true, 
        	 	showTooltip:true //Ventana con los datos sobre la base de la gráfica
      		},
		seriesDefaults: {
                	rendererOptions: { smooth: true},  //el número de puntos tiene que ser como mínimo 3 
                	fill: true, fillToZero: true, fillColor: '#437BD0', fillAndStroke: true, fillAlpha: 0.8,   
                	lineWidth: 1, color: '#437BD0', 
                markerOptions: {
			size: 4, 
			color: '#437BD0' 
			},
		}
    });
    document.getElementById("comen").innerHTML="media: "+ media.toFixed(2) + "</br>maximo: " + maximo + "</br>minimo: " + minimo + "</br>ult. obser. : <h2> " + ((Date.now() - finGra)/1000).toFixed(0)+ "s </h2>";
};
function getVarsUrl() {
    var url = location.search.replace("?", "");
    var arrUrl = url.split("&");
    var urlObj = {};  
    for (var i=0; i<arrUrl.length; i++){
    	var x= arrUrl[i].split("=");
    	urlObj[x[0]]=x[1]
    }
    return urlObj;
};
function updateSeries() {
        var myArr;
    	xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myArr = JSON.parse(xmlhttp.responseText);
                if (JSON.stringify(myArr)=='{}'){
                    deleteGraf();
                }else{
                    line4 = rellenarArray(myArr);
                    if (plot6){
                        plot6.destroy();
                    }
                    if (count > 2){
                        crearGrafica(line4); //si no hay datos no se crea y después no
                    }
                    //plot6.series[0].data = line4;
                    //plot6.axes.xaxis.min = finGra - 120000;
                    //plot6.axes.xaxis.max = finGra;
                    //plot6.axes.yaxis.min = minimo -2;
                    //plot6.axes.yaxis.max = maximo + 2;
                    //plot6.replot();
                    //plot6.resetAxesScale();
		          }
        	}
    	}
    	xmlhttp.open("GET", url, false);
    	xmlhttp.send();	
    }
function deleteGraf (){
    if (plot6){
        plot6.destroy();
    }
    document.getElementById("parametro").innerHTML ="No hay datos del parámetro: " + parametro;
    document.getElementById("comen").innerHTML="";
}
