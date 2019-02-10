// GRAFICA DE TEMPERATURA---------------------------------------------------------------------------------------
$(document).ready(function () {        
    var line4 = [];
    var myArr;
    var xmlhttp = new XMLHttpRequest();
	//var url = "http://www.smartcitything.es:8080/ServiceGeoJson/ProveedorSensorHoras?horas=120&sensor=temperatura&proveedor=OE_CRIF_ACACIAS&fin=1435603596000";
	var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID=OE_CRIF_ACACIAS&sensorID=temperatura&rango=120&fin=1435603596000";
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
                    maximo = myArr[prop_name];
                    minimo = myArr[prop_name];
                    i=1; 
                }
		if (myArr[prop_name] > maximo){maximo = myArr[prop_name]}
		if (myArr[prop_name] < minimo){minimo = myArr[prop_name]}
		media += parseFloat(myArr[prop_name]);
		count += 1;
        };
	media = media/count;
	//la última marca de tiempo corresponderá a "a" ya que van en orden
        var timeInMs = Date.now();
        var plot6 = $.jqplot("graf1",  [line4], {
		    title : "Temperatura del CRIF Las Acacias. Max: " + maximo +"ºC, Min: " + minimo + "ºC, "+ "Media: "+ media.toFixed(1),
		    axesDefaults: {
        		tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        		tickOptions: {
          			angle: -30,
          			fontSize: '10pt'
        		}
    		    },	 	
                    axes: {
                        xaxis:{min:inicio, max:a, renderer: $.jqplot.DateAxisRenderer,tickOptions: { formatString: '%#d %b, %H:%M' }, tickInterval: '6 hour'}, 
                        yaxis:{min:parseInt(minimo) - 2, max:parseInt(maximo) + 2, tickOptions:{formatString:'%.0fºC'}} 
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
			lineWidth: 2.5,
			color: '#437BD0', 
			markerOptions: {
				size: 1, 
				lineWidth: 1,
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
	//var url = "http://www.smartcitything.es:8080/ServiceGeoJson/ProveedorSensorHoras?horas=120&sensor=humedad&proveedor=OE_CRIF_ACACIAS&fin=1435603596000";
var url = "http://www.smartcitything.es:8080/ServiceJson/JsonSensorObservations?proveedorID=OE_CRIF_ACACIAS&sensorID=humedad&rango=120&fin=1435603596000";
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
                    maximo = myArr[prop_name];
                    minimo = myArr[prop_name];
                    i=1; 
                }
		if (myArr[prop_name] > maximo){maximo = myArr[prop_name]}
		if (myArr[prop_name] < minimo){minimo = myArr[prop_name]}
		media += parseFloat(myArr[prop_name]);
		count += 1;	
        };
        media = media/count;
        //la última marca de tiempo corresponderá a "a" ya que van en orden
        var timeInMs = Date.now();
        var plot6 = $.jqplot("graf2",  [line4], {
		    title : "Humedad relativa Max: " + maximo + "%, Min: " + minimo +"% Media: " + media.toFixed(1),
            axesDefaults: {
        		tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        		tickOptions: {
          			angle: -30,
          			fontSize: '10pt'
        		}
    		    },	 
            axes: {
                        xaxis:{min:inicio, max:a, renderer: $.jqplot.DateAxisRenderer,
				tickOptions: {formatString: '%#d%b, %H:%M'}, tickInterval: '6 hour'}, 
                        yaxis:{min:parseInt(minimo) - 4, max:parseInt(maximo) + 4, tickOptions:{formatString:'%.0f%'}}
                    },
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
				    size: 1, 
				    lineWidth: 1,
				    color: '#437BD0' 
                },
		    }
        });
        document.getElementById('comen2').innerHTML = 'Max: ' + maximo +'%<BR>Min: ' + minimo + '%<BR> '+ 'Media: '+ media.toFixed(1)+'%';
    };
});
