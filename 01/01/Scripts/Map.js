var mapInfo={}
var mapGraphics={}
var CircularJSON = window.CircularJSON
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
//alert("supports touch="+supportsTouch)
var isFlipped=false;
var isFirst=false;
var storedExtent
var storedAddress
var storedBasmap
var solarInsLayer
if(localStorage["mapInfo"]){
storedExtent=JSON.parse(localStorage["mapInfo"]);
}
if(localStorage["storedAddress"]){
    isFirst = true;
    storedAddress=JSON.parse(localStorage["storedAddress"]);
}
if(localStorage["storedBasemap"]){
    storedBasmap=JSON.parse(localStorage["storedBasemap"]);

}
if(localStorage["solarInsLayer"]){
    solarInsLayer=JSON.parse(localStorage["solarInsLayer"]);

}


//document.getElementById("#baseMapImg").addEventListener("click", baseMapToggle)
//baseMapToggle()
require(["esri/map", "esri/dijit/LocateButton","esri/layers/ArcGISDynamicMapServiceLayer","esri/dijit/Search","dojo/domReady!"], function(Map, LocateButton,ArcGISDynamicMapServiceLayer, Search) {
    $("#submitButton").remove()
    $("#address").val("")
    var map = new Map("mapCard", {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "hybrid",
        logo: false,
        showAttribution: false,
        smartNavigation: false
    });
    console.log(localStorage['message'])
    var solarInsolation = new ArcGISDynamicMapServiceLayer("http://104.210.42.117/arcgis/rest/services/CC/CC_NearUoR_Area_Solar_Insolation/MapServer", {
        id: "solarInsolation"
    });
    solarInsolation.setVisibleLayers([1])

    map.addLayer(solarInsolation)

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {

        map.centerAndZoom([position.coords.longitude, position.coords.latitude], 19);
    }

    $("#locateImg").on("click", getLocation);
    var s = new Search({
        map: map,
        enableInfoWindow: false,
        zoomScale: 10,
        autoNavigate: false,
        enableSuggestions: false
    }, address);
    s.startup();

    map.on("load",function(){

        if(solarInsLayer=="off"){
            solarInsolation.hide();
            $("#solarInsolation").attr('checked', false)
            $("#layerLegend").hide()
        }

        if(storedExtent){
            console.log(storedExtent)
            map.centerAndZoom(storedExtent["center"], storedExtent['zoom'])
        }
        if(storedAddress){
            s.set("value",storedAddress)
            s.search()

        }
        if(storedBasmap=="streets"){
            $("#baseMapImg").css("background-image", 'url("mapImg/satellite.jpg")')
            $("#baseMapLable").text("Satellite")
            map.setBasemap("streets")
        }

        map.graphics.on("graphic-add", function () {
        $('.card').css('display', 'relative')

        mapGraphics=map.graphics.graphics[1].attributes.Match_addr


        //map.graphics = mapGraphics

        console.log(map.graphics)
    })
})
    s.on("search-results", function(result){
        localStorage["storedAddress"]=JSON.stringify(result.results[0][0].feature.attributes.Match_addr);
        if(isFirst) {

            isFirst= false
            return
        }else{
            map.centerAndZoom(result.results[0][0].feature.geometry, 20);
        }
        saveButtonEnabler()
    })


    $("#map2").flip({
        trigger:'manual'
    })

    $(".flipToggle").click(function(){
        $("#map2").flip('toggle')
        if(isFlipped==false){
            isFlipped=true
        }else{
            isFlipped=false
        }
    })
    function storeMap(){
        mapInfo['center'] = map.extent.getCenter();
        mapInfo['zoom'] = map.getZoom();
        //console.log(mapInfo)
        localStorage.mapInfo = JSON.stringify(mapInfo);
        //console.log(localStorage)
        //console.log(localStorage.mapInfo)
        //console.log(JSON.parse(localStorage.mapInfo)['center'])

    }
    map.on("extent-change",function(){
        storeMap()
    })
    $("baseMapImg").css("background-image", "url(/mapImg/satellite.jpg)")
    if(localStorage['message']=='hello') {
        localStorage.message = "moo"
    }else if(localStorage['message']=='moo'){
        localStorage.message ='hello'
    }
    function baseMapToggle(){
        //alert("hello")
        $("#baseMapImg").css("background-image", "url(/mapImg/satellite.jpg)")
    }
    //document.getElementById("#baseMapImg").addEventListener("click", baseMapToggle)
    //baseMapToggle()
    $("document").ready(function(){
        $('#baseMapImg').click(function(){
            var imgLable = $("#baseMapLable").text();
            console.log(imgLable)
            if(imgLable=="Satellite"){
                $("#baseMapImg").css("background-image", 'url("mapImg/Street.jpg")')
                $("#baseMapLable").text("Streets")
                map.setBasemap("hybrid")
                localStorage["storedBasemap"]=JSON.stringify("hybrid")
            }else if(imgLable=="Streets"){
                $("#baseMapImg").css("background-image", 'url("mapImg/satellite.jpg")')
                $("#baseMapLable").text("Satellite")
                map.setBasemap("streets")
                localStorage["storedBasemap"]=JSON.stringify("streets")
            }
        })
    })
    var bodyHTML = document.getElementsByTagName('body')[0];
    function disableBodyScroll() {
        //console.log("lock")
        if(isFlipped==false) {
            $('body').css('overflowY', 'hidden');
        }
        //$('html').css()
    }
    function enableBodyScroll() {
        bodyHTML.style.overflowY = 'auto';
    }
    function toggleSI(layer){
        //console.log('woof')
        map.getLayer(this.id).hide();
    }
    $('#mapCard').mouseover(disableBodyScroll)
    $('.card').mouseout(enableBodyScroll)
    $('#solarInsolation').click(function(){
        if(this.checked){
            map.getLayer(this.id).show();
            $("#layerLegend").show()
            localStorage["solarInsLayer"]=JSON.stringify("on")
        }else{
            map.getLayer(this.id).hide();
            $("#layerLegend").hide()
            localStorage["solarInsLayer"]=JSON.stringify("off")
        }
    })
    function detectIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

});
