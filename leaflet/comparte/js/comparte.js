//var map = L.map('map').setView([40.505, -3.79], 11);
var map;
var datos;
var myLayer;
var estadoAmbito = "all";
var estadoEtapa = "all";
// esta función solo es necesaria por que reseteamos el mapa completo y no solo las marcas
var pruebas = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/imagenes/autoescuela-peque.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [20, 25],
    iconAnchor:  [0, 0],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});
  
var nube = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/imagenes/crif_p.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});

function crearMapa(){
    map = L.map('map').setView([40.505, -3.79], 11);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
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
	// layer.bindPopup("<h1>" + feature.properties.descripcion + "</h1>");
	// Después asignamos un evento click a cada marca.
	layer.on('click', function(e) {
		$('.sensor').remove();
		$( "#leyenda" ).show( "fast" );
        $( "#aviso" ).hide("fast");
		document.getElementById("centro").innerHTML=feature.properties.centro;
		document.getElementById("ambito").innerHTML=feature.properties.ambito;
		document.getElementById("etapa").innerHTML=feature.properties.etapa;
		document.getElementById("descripcion").innerHTML=feature.properties.descripcion;
	});
}

function representar(data, ambito, etapa){
    // Ponemos l.geoJson como una variable para poder después borrar todas las marcas 
    myLayer = L.geoJson(data, {
        // pointToLayer
		pointToLayer: function(feature, latlng) {
			var icono;
			if (feature.properties.tags == "pruebas"){
				icono = pruebas;
                	}else{
                    		icono = nube;
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
$.getJSON("https://script.googleusercontent.com/macros/echo?user_content_key=SWFc-3sQi9sna9TMAI8AnPvdxTmKaZwmqpwWBMR6hckowR5b-gqpZXBy96WSJ2ISbSYJO9REaUv9P6cJaZgKixyojPROkPMIm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI7bJHnJ-eJr0gWxK_o2antMoO5Nf87R3jJY8rc6IsQGfy6iRLWzR60n-OJs8rPC_UW-dnclfdIe&lib=MvDgdm_fmzszgEhwAQMC-TY62uAqfJ8lq", function(data) {
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
	$( "#aviso" ).show("fast");
	estadoAmbito = $("#selec-ambito").val();
	map.removeLayer(myLayer);
	representar(datos, estadoAmbito, estadoEtapa);
	//alert("estoy en ambito: " + estadoAmbito + estadoEtapa);
})
$("#selec-etapa").on("change", function() {
	$( "#leyenda" ).hide( "fast" );
	$( "#aviso" ).show("fast");
	estadoEtapa = $("#selec-etapa").val();
	map.removeLayer(myLayer);
	representar(datos, estadoAmbito, estadoEtapa);
	//alert("estoy en etapa: " + estadoAmbito + estadoEtapa);
})


