//Mapbox token 
mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoYXlmenYyIiwiYSI6ImNsZXNzZW9mcTAyanozem83am12NmJlczQifQ._w2s02CV9Ufl62nRwCrY9w';

//Initializing the Map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    projection: 'globe',
    zoom: 6.23,
    center: [76.36782, 10.38870]
});

//GIS DATA
const data = 'AI_camera.geojson';

// Add the custom marker image to the map

map.loadImage(
    "Assets/camera.png", // Replace with the URL of your custom marker image
    function (error, image) {
        if (error) throw error;
        map.addImage('custom-marker', image);
    }
    );

//Navigation control

// map.addControl(new mapboxgl.NavigationControl({
//     visualizePitch: true,
//     showCompass: true
// }));


//Geolocation control

var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
});

map.addControl(geolocate);

// geolocate.on('geolocate', function(e) {
//     var lon = e.coords.longitude;
//     var lat = e.coords.latitude
//     var position = [lon, lat];
// });


map.on('style.load', () => {
    map.setFog({});
});

map.on('load', () => {
    map.addSource('AI_camera', {
        type: 'geojson',
        data: data
    });

    map.addLayer({
        'id': 'AI_camera-locations',
        'type': 'symbol',
        'source': 'AI_camera',
        'layout': {
            'icon-image': 'custom-marker', // Reference to the custom marker image
            'icon-size': 0.05, // Adjust the size as needed
            'icon-allow-overlap': false, // Allow icons to overlap
        }
    });

    

    map.on('click', 'AI_camera-locations', (e) => {
      const coordinates = e.features[0].geometry.coordinates;
      const Name = "Name: " + e.features[0].properties.Name;

      console.log(Name);

      // // Populate the popup and set its coordinates
      // new mapboxgl.Popup()
      // .setLngLat(coordinates)
      // .setHTML(
      //     `<div class="custom-popup">
      //     <div class="custom-popup-content">${Name}</div>
      //     </div>`
      // )
      // .addTo(map);

      //animated popup
      var popup= new AnimatedPopup({
        openingAnimation: {
          duration: 1000,
          easing: "easeOutElastic",
          transform: "scale",
        },
        closingAnimation: {
          duration: 300,
          easing: "easeInBack",
          transform: "scale",
        },
      }).setHTML(
        `<div class="custom-popup">
      <div class="custom-popup-content">${Name}</div>
       </div>`
    );

      // create DOM element for the marker
        var el = document.createElement("div");
        el.id = "marker";

      // create the marker
      new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
  
    });

    // Change the cursor style to indicate clickable marker
    map.on('mouseenter', 'AI_camera-locations', () => {
        map.getCanvas().style.cursor = 'pointer';
        });

    map.on('mouseleave', 'AI_camera-locations', () => {
        // Reset cursor style and close the popup when mouse leaves the marker
        map.getCanvas().style.cursor = '';
    });

    //Check proximity on map move
    // map.on('move', function () {
    //     checkProximity();
    // });

    // Check proximity initially
    map.on('idle', function() {
        checkProximity();
      });
    
});

function checkProximity() {

    geolocate.on('geolocate', function(e) {
        var lon = e.coords.longitude;
        var lat = e.coords.latitude
        var position = [lon, lat];
    
        // var userLocation = map.getCenter();
        var userLocation = position ;
        // var targetPoint = [76.36782, 10.38870];
        var features = map.querySourceFeatures('AI_camera');
    // });

        if (features.length > 0) {
            // Use the first AI camera location as the target point
            var targetPoint = features[0].geometry.coordinates;
            var cameraName = features[0].properties.Name;

            console.log(targetPoint)

            var distance = turf.distance(
                // turf.point(userLocation.toArray()),
                turf.point(userLocation),
                turf.point(targetPoint),
                { units: 'kilometers' }
            );

            var proximityThreshold = 10; // Adjust the threshold distance as needed

            if (distance < proximityThreshold) {
            // Show alert when user is near the target point
            // alert(`You are ${distance} kms from the AI camera ${cameraName}`);

                // new mapboxgl.Popup()
                // .setLngLat(targetPoint)
                // .setHTML(
                //     `<div class="custom-popup">
                //         <div class="custom-popup-content">${cameraName}</div>
                //     </div>`
                // )
                // .addTo(map);

                new AnimatedPopup({
                    openingAnimation: {
                        duration: 1000,
                        easing: 'easeOutElastic',
                        transform: 'scale'
                    },
                    closingAnimation: {
                        duration: 300,
                        easing: 'easeInBack',
                        transform: 'scale'
                    }
                }).setLngLat(targetPoint).setHTML(`<div class="custom-popup">
                <div class="custom-popup-content">${cameraName}</div>
            </div>`).addTo(map);

            // Close the alert after 3 seconds (3000 milliseconds)
            // setTimeout(() => {
            //     alert.close(); // Note: This may not be available in all browsers
            // }, 1000);
            
            }

        }

    // var distance = turf.distance(
    //     turf.point(userLocation.toArray()),
    //     turf.point(targetPoint),
    //     { units: 'kilometers' }
    // );

    // var proximityThreshold = 0;

    // if (distance < proximityThreshold) {
    //     // Show popup when user is near the target point
    //     popup.setLngLat(targetPoint)
    //         .setHTML('You are near the target point!')
    //         .addTo(map);
    // } else {
    //     // Remove popup if not near the target point
    //     popup.remove();
    // }
    });
}

// map.addControl(
//     new mapboxgl.GeolocateControl({
//         positionOptions: {
//             enableHighAccuracy: true
//         },
//         trackUserLocation: true,
//         showUserHeading: true
//     })
// );
