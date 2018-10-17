
  var my_json;

  var map = L.map('map').setView([40.505, -3.79], 11);

  //Incluimos la capa del mapa de openstreetmap
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  //Definimos la variable icono para después poder modificar las características. 
  var smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
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
        	// console.log('Layer clicked!', e);
		//alert("descripción: " + descripcion);
		$('.sensor').remove();
		$( "#leyenda" ).show( "fast" );
                $( "#aviso" ).hide("fast");
		document.getElementById("centro").innerHTML=feature.properties.descripcion;
		document.getElementById("temperatura").innerHTML=feature.properties.temperatura + " ºC";
		document.getElementById("humedad").innerHTML=feature.properties.humedad + " %";
		document.getElementById("presion").innerHTML=feature.properties.presion + " hPa";
        document.getElementById("time").innerHTML=ultimaMedida(feature.properties.time);
		var loc = "./graficas/contenedorGraficasMeteo.html?proveedor="+feature.properties.proveedorID;
        	document.getElementById('igraficas').setAttribute('src', loc);
        });
  }
  //PARSEAMOS EL GEOJSON QUE PROVIENE LA URL UTILIZANDO AJAX
  $.getJSON("https://iot.educa.madrid.org/ServiceJson/EO_AllComponent", function(data) {
  	L.geoJson(data, {
		// pointToLayer 
  		pointToLayer: function(feature, latlng) {
        		return L.marker(latlng, {
        			icon: nube
        		}).on('click', onClick);
      		},
		// Filter: Podemos filtrar las marques que se dibujan con un "true" o "false"
		filter: function(feature, layer) {
			var visibilidad = true;
			if (feature.properties.proveedorID == "OE_Granadilla"){visibilidad=false;}
        		return visibilidad;
    		},
		// onEachFeature: función que se llama cada vez que un GeoJson se añade al layer
      		onEachFeature: onEachFeature
    	}).addTo(map);
  });

