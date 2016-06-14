$(document).ready(function(){
  $("#search").on("submit",function(e){
    e.preventDefault();
    var formData = {
      'sinput'              : $('input[name=sinput]').val()
    };

    $.ajax({
      type: "GET",
      url: 'https://maps.googleapis.com/maps/api/geocode/json?',
      data: {
        address: formData.sinput,
        key: 'AIzaSyDOUl9py-eXL1uG8enK2ZHxxOT12UCNGBw',
        sensor : false
      },
      success: function (result) {
        var LON = result.results[0].geometry.location.lng;
        var LAT = result.results[0].geometry.location.lat;
          $.ajax({
            type: "GET",
            url: 'http://api.openweathermap.org/data/2.5/weather?',
            data: {
              lat: LAT,
              lon: LON,
              APPID: 'fcfff140956d2d65cf64b97aed23e429',
              units: 'imperial'
            },
            success: function (response) {
              document.getElementById("desc").innerText
              = response.weather[0].description;
              document.getElementById("temperature").innerText
              = "Current Temperature: " + response.main.temp + " F";  
            }
          });
      }
    });

  });
});

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = sinput;
  var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// function search() {
//   var searchval =
// }
