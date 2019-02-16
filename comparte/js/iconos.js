//Iconos utilizados en los mapas

var convivencia = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/convivencia.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [45, 45],
    iconAnchor:  [0, 0],
    popupAnchor: [-1,-1],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
});
  
var artistica = new L.Icon({
    iconUrl: 'https://iot.educa.madrid.org/javascript/comparte/imagenes/iconos/artistica.png',
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

// Función que escribe los iconos solicitados en el mapa
// Utiliza los nombres de variables definidos anteriormente. 
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
                case "Educación Artística":
        				icono = artistica;
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

