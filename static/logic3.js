// Store our API endpoint inside queryUrl

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + "Magnitude:" +feature.properties.mag + "<br>"+feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
     //  Define streetmap and darkmap layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Sateliite Map": satellite
  };
  
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });

// Add streetmap tile to map; if only one tile defined then this is a good way of doing this.
// If only one tile layer then the following will be used "L.control.layers(null, overlayMaps, " later in the code
streetmap.addTo(myMap);
// if multiple tiles are being used then the above code is not needed.  The multiple tiles will be added
// when "L.control.layers(baseMaps, overlayMaps, " 


// create layer; will attach data later on
var earthquakes = new L.LayerGroup();
// Alternate method and same as above
// var earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
// Pass in our baseMaps and overlayMaps

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    onEachFeature: popUpMsg
  }).addTo(earthquakes);

  // Here are some additional examples:  https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ 

  earthquakes.addTo(myMap);

 // Functions not working

 function circles(feature,latlng) {
  let option = {
      radius:feature.properties.mag,
      fillColor: chooseColor(feature.properties.mag),
      color: "red",
      weight: 2,
      opacity:1,
      fillOpacity: 0.5
  }
  return L.circles(latlng, option );
 }
 function chooseColor (mag){
    switch(true){
    case mag<=1:
          return "aquamarine";
    case mag<=2:
          return "greenyellow";
    case mag<=3:
          return "green";
    case mag<=4:
          return "darkgreen";
    case mag<=5:
          return "maroon";
    default:
          return "Orange";
  }
 }
//  legend works somewhat

 var legend = L.control({position: "bottomright"});
 legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  mag = ['0', '1', '2', '3', '4', '5'];
  
  div.innerHTML += "<h3>Magnitude</h3>"

  for (var i =0; i < mag.length; i++) {
    div.innerHTML += 
    '<i class= "circle" style="background:' + chooseColor(mag[i] + 1) + '"></i> ' +
        mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});
