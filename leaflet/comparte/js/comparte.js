//var map = L.map('map').setView([40.505, -3.79], 11);
var map;
var datos;
var myLayer;
var estadoAmbito = "all";
var estadoEtapa = "all";
// esta función solo es necesaria por que reseteamos el mapa completo y no solo las marcas
var convivencia = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/convivencia.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [-1,-1],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});
  
var inclusion = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/inclusion.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [20, 10],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});
var medioambiente = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/medioambiente.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [20, 10],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});

var otros = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/escuela.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [20, 10],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});

var metodologia = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/metodologia.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [20, 10],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});

var tic = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/tic.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [20, 10],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});
function crearMapa(){
    map = L.map('map').setView([40.405, -3.73], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors | CRIF Las Acacias'
    }).addTo(map);

    map.on('click', function () {
        //map.removeLayer(mylayer);
    });
}
crearMapa();
function onClick(e) {
   	// Se ejecuta cada vez que hacemos click sobre la marca, es una función redundante. 
}  

function ultimaMedida(timeStamp){
      var fecha = new Date(timeStamp);
      var ultima = fecha.getDate().toString() + "/" + (fecha.getMonth()+1).toString() + "/" + fecha.getFullYear().toString() + " " + fecha.getHours().toString() + ":" + (fecha.getMinutes()<10?'0':'').toString() + fecha.getMinutes().toString();
      return ultima;
}
 
function onEachFeature(feature, layer) {
	// Durante la carga de "data" en el array que se añade al mapa se asinga un popup a cada marca
	//layer.bindPopup("<a target=\"_blank\" href=\"" + feature.properties.enlace + "\">web del proyecto</a>");
	// Después asignamos un evento click a cada marca.
  	layer.on('click', function(e) {
		document.getElementById("centro").innerHTML=feature.properties.centro;
		document.getElementById("ambito").innerHTML="<b>ÁMBITO:</b> " + feature.properties.ambito;
		document.getElementById("etapa").innerHTML="<b>ETAPA:</b> " + feature.properties.etapa;
		document.getElementById("descripcion").innerHTML="<b>DESCRIPCIÓN:</b> " + feature.properties.descripcion;
        	document.getElementById("enlace").innerHTML="<a target=\"_blank\" href=\"" + feature.properties.enlace + "\">enlace</a>";
        	$( "#leyenda" ).show( "fast" );
	});
    	// Eventos con los que podemos actuar
	//layer.on('mouseover', function(e) {
	//	//pruebas.iconSize(4,4);
	//	document.getElementById("e")style.cursor = "pointer";
	//});
    	//layer.on('mouseout', function(e) {
	//  $( "#leyenda" ).hide( "fast" );
	//});*/
}

function representar(data, ambito, etapa){
    // Ponemos l.geoJson como una variable para poder después borrar todas las marcas 
    myLayer = L.geoJson(data, {
        // pointToLayer
		pointToLayer: function(feature, latlng) {
			var icono;
			switch (feature.properties.ambito) {
				
  				case "Convivencia":
 					icono = convivencia;
 					break;
    				case "Inclusión":
        				icono = inclusion;
        				break;
				case "Medio Ambiente":
        				icono = medioambiente;
        				break;
				case "Metodología":
        				icono = metodologia;
        				break;
				case "TIC":
        				icono = tic;
        				break;
    				default:
        				icono = otros;
			}
			return L.marker(latlng, {
				icon: icono
        		}).on('click', onClick);
      		},
		// Filter: Podemos filtrar las marques que se dibujan con un "true" o "false"
		filter: function(feature, layer) {
			var visibilidad = false;
			if ((ambito == "all" && etapa == "all") || (ambito == "all" && feature.properties.etapa == etapa) || (etapa == "all" && feature.properties.ambito == ambito) || (feature.properties.ambito == ambito && feature.properties.etapa == etapa)){visibilidad = true;}
            		return visibilidad;
    		},
		// onEachFeature: función que se llama cada vez que un GeoJson se añade al layer
        onEachFeature: onEachFeature
	}).addTo(map);
}

//PARSEAMOS EL GEOJSON QUE PROVIENE LA URL UTILIZANDO AJAX Y LLAMAMOS A LA FUNCIÓN QUE REPRESENTA PASÁNDOLE EL DATA

// https de nuevo: https://script.googleusercontent.com/macros/echo?user_content_key=XhtKCU8kMDpy29yBT4z5VBFlR0_Mcz2d4nBqfZYdozVHX-5hTapGEOMWSCZQk6jiTs3nOK0j2IAsrJNiVoQGXGBf1VAlBd0Bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAqlTUE9PMQo4GSk3JNzJ3S90IUy8Zm3TRCNe_Kim06DFCGbQj4sWVFyabrbrqidsScfNc2fO4hD&lib=M0QKweTerVmYhf42X6XD33o62uAqfJ8lq
// url vieja:  https://script.googleusercontent.com/macros/echo?user_content_key=SWFc-3sQi9sna9TMAI8AnPvdxTmKaZwmqpwWBMR6hckowR5b-gqpZXBy96WSJ2ISbSYJO9REaUv9P6cJaZgKixyojPROkPMIm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI7bJHnJ-eJr0gWxK_o2antMoO5Nf87R3jJY8rc6IsQGfy6iRLWzR60n-OJs8rPC_UW-dnclfdIe&lib=MvDgdm_fmzszgEhwAQMC-TY62uAqfJ8lq

$.getJSON("https://script.googleusercontent.com/macros/echo?user_content_key=XhtKCU8kMDpy29yBT4z5VBFlR0_Mcz2d4nBqfZYdozVHX-5hTapGEOMWSCZQk6jiTs3nOK0j2IAsrJNiVoQGXGBf1VAlBd0Bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAqlTUE9PMQo4GSk3JNzJ3S90IUy8Zm3TRCNe_Kim06DFCGbQj4sWVFyabrbrqidsScfNc2fO4hD&lib=M0QKweTerVmYhf42X6XD33o62uAqfJ8lq", function(data) {
	representar(data, "all","all");
	datos = data;
	
}).done(function() {
    console.log( "second success" );
})
  .fail(function(variable, textStatus, error) {
        var err = textStatus + ", " + error;
    	console.log( "Request Failed: " + err );
})
  .always(function() {
    console.log( "complete" );
});

$("#selec-ambito").on("change", function() {
	$( "#leyenda" ).hide( "fast" );
	estadoAmbito = $("#selec-ambito").val();
	map.removeLayer(myLayer);
	representar(datos, estadoAmbito, estadoEtapa);
	//alert("estoy en ambito: " + estadoAmbito + estadoEtapa);
})
$("#selec-etapa").on("change", function() {
	$( "#leyenda" ).hide( "fast" );
	estadoEtapa = $("#selec-etapa").val();
	map.removeLayer(myLayer);
	representar(datos, estadoAmbito, estadoEtapa);
	//alert("estoy en etapa: " + estadoAmbito + estadoEtapa);
})
$( "#cruz" ).on( "click" , function(){
    $( "#leyenda" ).hide( "fast" );
})

