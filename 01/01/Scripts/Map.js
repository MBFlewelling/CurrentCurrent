require(["esri/map", "esri/dijit/LocateButton","esri/layers/ArcGISDynamicMapServiceLayer","esri/dijit/Search","dojo/domReady!"], function(Map, LocateButton,ArcGISDynamicMapServiceLayer, Search) {
    $("#submitButton").remove()
    $("#address").val("")
    var map = new Map("map2", {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "hybrid"
    });

    solarInsulation= new ArcGISDynamicMapServiceLayer("http://104.210.42.117/arcgis/rest/services/CC/CC_NearUoR_Area_Solar_Insolation/MapServer");
    solarInsulation.setVisibleLayers([1])

    map.addLayer(solarInsulation)

    //geoLocate = new LocateButton({
    //    map: map,
    //    scale:17
    //}, "LocateButton");
    //geoLocate.startup();
    //var x = document.getElementById("address");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {

        map.centerAndZoom([position.coords.longitude,position.coords.latitude], 19);
    }
    $( "#locateImg" ).on( "click", getLocation );
    var s = new Search({
        map:map,
        enableInfoWindow:false,
        zoomScale: 10,
        autoNavigate:false,
        enableSuggestions: false
    },address);
    s.startup();


    s.on("search-results", function(result){
        console.log(result)
        map.centerAndZoom(result.results[0][0].feature.geometry, 20);
    })
    s.search("901 east colton ave, Redlands, CA")

    //    .then(function(response){
    //
    //    map.centerAndZoom(response[0][0].feature.geometry, 20);
    //});

    console.log($(".arcgisSearch .searchBtn").html="")


});
