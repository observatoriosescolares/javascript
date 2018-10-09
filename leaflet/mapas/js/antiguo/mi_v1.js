function getVarsUrl() {
    var url = location.search.replace("?", "");
    var arrUrl = url.split("&");
    var urlObj = {};  
    for (var i=0; i<arrUrl.length; i++){
    	var x= arrUrl[i].split("=");
    	urlObj[x[0]]=x[1]
    }
    return urlObj;
}
// Recogemos los parámetros que vienen en la url 
var misVariablesGet = getVarsUrl();
var proveedor = misVariablesGet.proveedor;
var nombre_con = misVariablesGet.nombre;
var nombre = nombre_con.split('+').join(' ');
var rango = misVariablesGet.rango;
if( !rango ){rango="-1"};
var fin = misVariablesGet.fin;
if ( !fin ){fin="-1"};

// GRAFICA DE TEMPERATURA---------------------------------------------------------------------------------------
$(document).ready(function () {        
    var line4 = [];
    var myArr;
    var xmlhttp = new XMLHttpRequest();
	//var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID=OE_CRIF_ACACIAS&sensorID=temperatura&rango=-1&fin=1461495243187";
	var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID="+proveedor+"&sensorID=temperatura&rango="+rango+"&fin="+fin;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myArr = JSON.parse(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, false);//Si no ponemos false no funciona, método de sincronización o algo asi. 
    xmlhttp.send();
    var i = 0;
    var inicio = 0;
	var maximo = 45;
	var minimo = -10;
	var media = 0;
	var a;
	var count = 0;
    if( myArr.hasOwnProperty("NULL")){
        //console.log("es nulo nulo");
        document.getElementById('graf1').innerHTML = "NO HAY DATOS DE TEMPERATURA";
        document.getElementById('comen1').innerHTML = "NO HAY DATOS DE TEMPERATURA";
    }else{
        for (var prop_name in myArr) {
                a = parseFloat(prop_name);  //con esto pasamos a numérico con lo que se puede interpretar como una fecha
                line4.push([a, myArr[prop_name]])//incluimos el numerico en lugar del literal para ser interpretado como una fecha. 
                if (i==0){
                    inicio = a;
                    maximo = parseFloat(myArr[prop_name]);
                    minimo = parseFloat(myArr[prop_name]);
                    i=1; 
                }
		if (parseFloat(myArr[prop_name]) > maximo){maximo = parseFloat(myArr[prop_name])}
		if (parseFloat(myArr[prop_name]) < minimo){minimo = parseFloat(myArr[prop_name])}
		media += parseFloat(myArr[prop_name]);
		count += 1;
        };
	media = media/count;
	//la última marca de tiempo corresponderá a "a" ya que van en orden
        var timeInMs = Date.now();
        var plot6 = $.jqplot("graf1",  [line4], {
		    stackSeries: true,
		    showMarker: false,	
		    seriesDefaults: { fill: true},	
		    title : nombre,
		    axesDefaults: {
        		tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        		tickOptions: {
          			//angle: -20,
          			fontSize: '10pt'
        		}
    		    },	 	
                    axes: {
                        xaxis:{min:inicio, max:a, renderer: $.jqplot.DateAxisRenderer,tickOptions: { formatString: '%#d %b, %H:%M', angle: -20}, 										tickInterval: '12 hour', 
									labelOptions:{fontFamily:'Helvetica', fontSize: '12pt', textColor: '#437BD0'},
									label:'Máxima ' +maximo+ 'ºC, mínima: ' +minimo+ 'ºC y media: '+media.toFixed(1)+ 'ºC'},
                        yaxis:{min:parseInt(minimo) - 2, max:parseInt(maximo) + 2, tickOptions:{formatString:'%.0fºC'},
				labelOptions:{fontFamily:'Helvetica', fontSize: '12pt'}, 				
				label: 'Temperatura',labelRenderer: $.jqplot.CanvasAxisLabelRenderer}},
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
			lineWidth: 2.5,
			color: '#437BD0', 
			markerOptions: {
				size: 0.5, 
				lineWidth: 0.5,
				color: '#437BD0' 
			},
		    }
        });
    document.getElementById('comen1').innerHTML = 'Max: ' + maximo +'ºC <BR>Min: ' + minimo + 'ºC<BR> '+ 'Media: '+ media.toFixed(1)+'ºC';
    };
});

// ----GRAFICA DE HUMEDAD-----------------------------------------------
$(document).ready(function () {        
        var line4 = [];
        var myArr;
        //importación de datos desde el servidor: http://www.w3schools.com/json/tryit.asp?filename=tryjson_http
        var xmlhttp = new XMLHttpRequest();
	//var url = "http://www.smartcitything.es:8080/ServiceGeoJson/ProveedorSensorHoras?horas=92&sensor=humedad&proveedor="+proveedor+"&fin=-1";
	var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID="+proveedor+"&sensorID=humedad&rango="+rango;
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myArr = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, false);//Si no ponemos false no funciona, método de sincronización o algo asi. 
        xmlhttp.send();
        //document.getElementById('graf2').innerHTML = 'NO HAY DATOS DE HUMEDAD' + xmlhttp.statusText;//STATUSTEXT Solo tiene valor después del send
        var i = 0;
        var inicio = 0;
	var maximo;
	var minimo;
	var media = 0;
	var count = 0;
	var a;
    if( myArr.hasOwnProperty("NULL")){
        console.log("es nulo nulo");
        document.getElementById('graf2').innerHTML = "NO HAY DATOS DE HUMEDAD";
        document.getElementById('comen2').innerHTML = "NO HAY DATOS DE HUMEDAD";
    }else{
        for (var prop_name in myArr) {
                a = parseInt(prop_name);  //con esto pasamos a numérico con lo que se puede interpretar como una fecha
                line4.push([a, myArr[prop_name]])//incluimos el numerico en lugar del literal para ser interpretado como una fecha. 
                if (i==0){
                    inicio = a; 
                    maximo = parseFloat(myArr[prop_name]);
                    minimo = parseFloat(myArr[prop_name]);
                    i=1; 
                }
		if (parseFloat(myArr[prop_name]) > maximo){maximo = myArr[prop_name]}
		if (parseFloat(myArr[prop_name]) < minimo){minimo = myArr[prop_name]}
		media += parseFloat(myArr[prop_name]);
		count += 1;	
        };
	maximo = 80;
	//if (maximo > 100){maximo = 100;};
	//if (minimo < 0){minimo == 0;};
        media = media/count;
        //la última marca de tiempo corresponderá a "a" ya que van en orden
        var timeInMs = Date.now();
        var plot6 = $.jqplot("graf2",  [line4], {
		    	axesDefaults: {
        			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        			tickOptions: {
          				//angle: -20,
          				fontSize: '10pt'}},	 
            		axes: {
                        	xaxis:{min:inicio, max:a, renderer: $.jqplot.DateAxisRenderer, tickOptions: {formatString: '%#d%b, %H:%M', angle: -20}, tickInterval: '12 hour',
					labelOptions:{fontFamily:'Helvetica', fontSize: '12pt', textColor: '#437BD0'}, 
					label:'Máxima ' +maximo+ '%, mínima: ' +minimo+ '% y media: '+media.toFixed(1)+ '%'}, 
                        	yaxis:{min:parseInt(minimo) - 4, max:parseInt(maximo) + 4, tickOptions:{formatString:'%.0f%'}, 
					labelOptions:{fontFamily:'Helvetica', fontSize: '12pt'}, 
					label:'Humedad', labelRenderer: $.jqplot.CanvasAxisLabelRenderer}},
		    	highlighter: {
        			show: true,
        			sizeAdjust: 7.5
      		    	},
      		    	cursor: {
        	    		show: true,
		    		zoom:true, 
        	    		showTooltip:true
      		   	 },
		    	seriesDefaults: {
                		lineWidth: 2.5,
                	color: '#437BD0', 
                	markerOptions: {
				    size: 0.5, 
				    lineWidth: 0.5,
				    color: '#437BD0' 
                },
		    }
        });
        document.getElementById('comen2').innerHTML = 'Max: ' + maximo +'%<BR>Min: ' + minimo + '%<BR> '+ 'Media: '+ media.toFixed(1)+'%';
    };
});
//----GRAFICA DE PRESIÓN-----------------------------------------------------
$(document).ready(function () {        
    var line4 = [];
    var myArr;
    var xmlhttp = new XMLHttpRequest();
    //var url = "http://www.smartcitything.es:8080/ServiceGeoJson/ProveedorSensorHoras?horas=92&sensor=presion&proveedor="+proveedor+"&fin=-1";
    var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID="+proveedor+"&sensorID=presion&rango="+rango;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            myArr = JSON.parse(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, false);//Si no ponemos false no funciona, método de sincronización o algo asi. 
    xmlhttp.send();
    var i = 0;
    var inicio = 0;
	var maximo;
	var minimo;
    	var media = 0;
	var count = 0;
	var a;
    //-- SI CONTIENE UNA PROPIEDAD LLAMADA NULL ES PORQUE NO HAY DATOS DE LA GRÁFICA. 
    if( myArr.hasOwnProperty("NULL")){
        //console.log("es nulo nulo");
        document.getElementById('graf3').innerHTML = "NO HAY DATOS DE PRESIÓN PARA ESTE PROVEEDOR";
        document.getElementById('comen3').innerHTML = "NO HAY DATOS DE PRESIÓN PARA ESTE PROVEEDOR";
    }else{
        console.log("ESTE SALIENDO POR NO NULL");
        for (var prop_name in myArr) {
            var a = parseInt(prop_name);  //con esto pasamos a numérico con lo que se puede interpretar como una fecha
            line4.push([a, myArr[prop_name]])//incluimos el numerico en lugar del literal para ser interpretado como una fecha. 
            if (i==0){
                inicio = a; 
                maximo = parseFloat(myArr[prop_name]);
                minimo = parseFloat(myArr[prop_name]);
                i=1; 
            }
            if (parseFloat(myArr[prop_name]) > maximo){maximo = parseFloat(myArr[prop_name])};
            if (parseFloat(myArr[prop_name]) < minimo){minimo = parseFloat(myArr[prop_name])};
            media += parseFloat(myArr[prop_name]);
            count += 1;
        };
        media = media/count;
        maximo = 950;
        minimo = 930;
	   //la última marca de tiempo corresponderá a "a" ya que van en orden
        var timeInMs = Date.now();
        var plot6 = $.jqplot("graf3",  [line4], {
            	axesDefaults: {
        		tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        		tickOptions: {
          			//angle: -20,
          			fontSize: '10pt'}},	 
            		axes: {
            			xaxis: {min:inicio, max:a, renderer: $.jqplot.DateAxisRenderer,tickOptions: { formatString: '%#d %b, %H:%M', angle: -20},
					tickInterval: '12 hour',
					labelOptions:{fontFamily:'Helvetica', fontSize: '12pt', textColor: '#437BD0'}, 
					label:'Máxima ' +maximo+ ', hPa mínima: '+minimo+ 'hPa y media: '+media.toFixed(0)+ 'hPa'}, 
                		yaxis: {min:parseInt(minimo) - 10 , max:parseInt(maximo) + 10, tickOptions:{formatString:'%.0f'},
					labelOptions:{fontFamily:'Helvetica', fontSize: '12pt'}, 	
					label:'Presión', labelRenderer: $.jqplot.CanvasAxisLabelRenderer}},
		        highlighter: {
        		      show: true,
        		      sizeAdjust: 20
      		        },
      		 	cursor: {
        	           show: true,
		    	   zoom:true, 
        	           showTooltip:false
      		        },
			seriesDefaults: {
                		lineWidth: 2.5,
                		color: '#437BD0', 
                		markerOptions: {
				    size: 0.5, 
				    lineWidth: 0.5,
				    color: '#437BD0'}}
        });
        document.getElementById('comen3').innerHTML = 'Max: ' + maximo +' hPa, <BR>Min: ' + minimo + ' hPa,<BR> '+ 'Media: '+ media.toFixed(2) + ' hPa';
    };
});
