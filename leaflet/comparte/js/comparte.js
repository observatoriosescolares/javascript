
var map;
var datos;
var myLayer;
var estadoAmbito = "all";
var estadoEtapa = "all";
// esta función solo es necesaria por que reseteamos el mapa completo y no solo las marcas

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

//PARSEAMOS EL GEOJSON QUE PROVIENE LA URL UTILIZANDO AJAX Y LLAMAMOS A LA FUNCIÓN QUE REPRESENTA PASÁNDOLE EL DATA

$.getJSON("https://script.googleusercontent.com/macros/echo?user_content_key=XhtKCU8kMDpy29yBT4z5VBFlR0_Mcz2d4nBqfZYdozVHX-5hTapGEOMWSCZQk6jiTs3nOK0j2IAsrJNiVoQGXGBf1VAlBd0Bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAqlTUE9PMQo4GSk3JNzJ3S90IUy8Zm3TRCNe_Kim06DFCGbQj4sWVFyabrbrqidsScfNc2fO4hD&lib=M0QKweTerVmYhf42X6XD33o62uAqfJ8lq", function(data) {
	representar(data, "all","all");
	datos = data;
    }).done(function() {
        console.log( "second success" );
    }).fail(function(variable, textStatus, error) {
        var err = textStatus + ", " + error;
    	console.log( "Request Failed: " + err );
    }).always(function() {
        console.log( "complete" );
});

$( "#selec-ambito" ).on( "change", function() {
	$( "#leyenda" ).hide( "fast" );
	estadoAmbito = $(" #selec-ambito").val();
	map.removeLayer(myLayer);
	representar(datos, estadoAmbito, estadoEtapa);
	//alert("estoy en ambito: " + estadoAmbito + estadoEtapa);
})
$( "#selec-etapa" ).on( "change", function() {
	$( "#leyenda" ).hide( "fast" );
	estadoEtapa = $( "#selec-etapa").val();
	map.removeLayer(myLayer);
	representar(datos, estadoAmbito, estadoEtapa);
	//alert("estoy en etapa: " + estadoAmbito + estadoEtapa);
})
$( "#cruz" ).on( "click" , function(){
    $( "#leyenda" ).hide( "fast" );
})
