//var map = L.map('map').setView([40.505, -3.79], 11);
var map;
var datos;
var myLayer;
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
        var presion = parseFloat(feature.properties.presion).toFixed(0);
		document.getElementById("centro").innerHTML=feature.properties.descripcion;
		document.getElementById("temperatura").innerHTML=parseFloat(feature.properties.temperatura).toFixed(0) + "ºC";
		document.getElementById("humedad").innerHTML=parseFloat(feature.properties.humedad).toFixed(0) + "%";
		document.getElementById("presion").innerHTML=parseFloat(feature.properties.presion).toFixed(0)+ "hPa";
        document.getElementById("time").innerHTML=ultimaMedida(feature.properties.time);
        document.getElementById("tags").innerHTML=feature.properties.tags;
		var loc = "./graficas/contenedorGraficasMeteo.html?proveedor="+feature.properties.proveedorID;
       	document.getElementById('igraficas').setAttribute('src', loc);
	});
}

function representar(data, filtro){
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
			switch (filtro){
                case "all":
                    visibilidad = "true";
                    break;
                case "pruebas":
                    if (feature.properties.tags == "pruebas"){
                        visibilidad = true;
                    }else{
                        visibilidad = false
                    }
                    break;
                case "operativos":
                    if (feature.properties.tags == ""){visibilidad = true}else{visibilidad = false}
            }
            return visibilidad;
    	},
		// onEachFeature: función que se llama cada vez que un GeoJson se añade al layer
        onEachFeature: onEachFeature
	}).addTo(map);
}

//PARSEAMOS EL GEOJSON QUE PROVIENE LA URL UTILIZANDO AJAX Y LLAMAMOS A LA FUNCIÓN QUE REPRESENTA PASÁNDOLE EL DATA
$.getJSON("https://iot.educa.madrid.org/ServiceJson/EO_AllComponent", function(data) {
	representar(data, "all");
	datos = data;
});

$("#selec-estado").on("change", function() {
	$( "#leyenda" ).hide( "fast" );
    $( "#aviso" ).show("fast");
	var estadoSelect = $("#selec-estado").val();
    map.removeLayer(myLayer);
	representar(datos, estadoSelect);
})


