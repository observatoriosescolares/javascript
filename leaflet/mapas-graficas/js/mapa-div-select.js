var datos;
var url = "http://iot.educa.madrid.org/ServiceJson/AllProviderJson";
var mapa = new GMaps({
		el: '#map',           //"el" es el id del div que contiene el mapa
		lat: 40.423333,
		lng: -3.728333,
		zoom: 10
});

function parsearJson (){
    $.getJSON(url, function(result){
	    //proveedores = JSON.parse(result);  No es necesario el parseo ya que getJSON lo hace directamente mandando un array. Ademas jquery resuelve el asincronismo y finaliza cuando ya ha recibido todo. 
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
						document.getElementById("descripcion").innerHTML="descripcion: " + proveedor;
						document.getElementById("estado").innerHTML="estado: " + estado;
						$.each(sensores, function(){
                            if (this.time < timeMenos){
                                imagen = 'https://iot.educa.madrid.org/imagenes/cruz.png';
                            }
							var fecha = new Date(parseInt(this.time));
							var p = document.createElement('p');
							p.className = "sensor";
							p.innerHTML = this.sensor +": "+ this.value + " <br>ultima medida: " + fecha.getHours()+":"+fecha.getMinutes();
							document.getElementById("leyenda").appendChild(p);
						});
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
