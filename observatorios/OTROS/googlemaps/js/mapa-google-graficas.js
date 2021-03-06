var datos;
var url = "https://iot.educa.madrid.org/ServiceJson/AllProviderJson";
var mapa = new GMaps({
		el: '#map',           //"el" es el id del div que contiene el mapa
		lat: 40.423333,
		lng: -3.728333,
		zoom: 10
});

function parsearJson (){
    $.getJSON(url, function(result){
	datos = result;
	representar(result, "all");
    });
}
parsearJson();

function representar (data, estadoSolicitado){
	$.each(data.providers, function(){
		var proveedor = this.provider;
        	var sensores = this.sensors;
		var estado = this.tags;
        	var timeInMs = Date.now();
        	var timeMenos = timeInMs - 86400000;
       		var imagen; //la hacemos global para esta funcion para modificarla antes de crear la marca
        	if (estado == ""){
			imagen = 'https://iot.educa.madrid.org/imagenes/crif_p.png';
     		} else {
			imagen = 'https://iot.educa.madrid.org/imagenes/autoescuela-peque.png';
        	}
        if (estadoSolicitado == "all" || estadoSolicitado == estado){
	   mapa.addMarker({
                lat: this.location.lat,
                lng: this.location.long,
                title: proveedor,
                click: function(e) {
                	$('.sensor').remove();
			$( "#leyenda" ).show( "fast" );
                    	$( "#aviso" ).hide("fast");
			document.getElementById("centro").innerHTML=proveedor;
			document.getElementById("temperatura").innerHTML="";
			document.getElementById("humedad").innerHTML="";
			document.getElementById("presion").innerHTML="";
			$.each(sensores, function(){
                        	if (this.time < timeMenos){
                            		imagen = 'http://www.smartcitything.es/imagenes/cruz.png';
                        }
			if (this.sensor == "temperatura"){
                        	var fecha = new Date(parseInt(this.time));
				if (this.time < timeMenos){
					document.getElementById("temperatura").innerHTML="T no actualizado";
				}else{
					document.getElementById("temperatura").innerHTML=this.value + "ºC " + fecha.getHours()+":"+(fecha.getMinutes()<10?'0':'') +fecha.getMinutes();
					}
			}
			if (this.sensor == "humedad"){
					var fecha = new Date(parseInt(this.time));
					if (this.time < timeMenos){
						document.getElementById("humedad").innerHTML="H no actualizado";
					}else{
						document.getElementById("humedad").innerHTML=this.value + "% " + fecha.getHours()+":"+ (fecha.getMinutes()<10?'0':'') + fecha.getMinutes();
					}
				}
				if (this.sensor == "presion"){
					var fecha = new Date(parseInt(this.time));
					if (this.time < timeMenos){
						document.getElementById("presion").innerHTML="P no actualizado";
					}else{  
						document.getElementById("presion").innerHTML=this.value + "hPa " + fecha.getHours()+":"+ (fecha.getMinutes()<10?'0':'') + fecha.getMinutes();
					}
				}
			});
			var loc = "./graficas/contenedorGraficasMeteo.html?proveedor="+proveedor;
        		document.getElementById('igraficas').setAttribute('src', loc);
						
						
                    },
                     icon: imagen	
                });
            }
        });
}

$("#selec-estado").on("change", function() {
	$( "#leyenda" ).hide( "fast" );
    $( "#aviso" ).show("fast");
	var estadoSelect = $("#selec-estado").val();
    mapa.removeMarkers();
	representar(datos, estadoSelect);
})
