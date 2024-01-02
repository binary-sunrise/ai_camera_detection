mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoYXlmenYyIiwiYSI6ImNsZXNzZW9mcTAyanozem83am12NmJlczQifQ._w2s02CV9Ufl62nRwCrY9w';


    const map = new mapboxgl.Map({
        container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-v9', // style URL
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 6.23, // starting zoom
        center: [76.36782, 10.38870] // // starting center in [lng, lat]
    });


    const data = 'AI_camera.geojson'

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    map.on('load', () => {
        // map.loadImage('/Assets/camera.png', function (error, image) {
        //     if (error) throw error;
        //     map.addImage('custom-marker', image);
            map.addSource('AI_camera', {
                type: 'geojson',
                // Use a URL for the value for the `data` property.
                data: data
            });
            map.addLayer({
                'id': 'AI_camera-locations',
                'type': 'circle',
                'source': 'AI_camera',
                'paint': {
                    'circle-radius': 4,
                    'circle-stroke-width': 2,
                    'circle-color': 'red',
                    'circle-stroke-color': 'white'
                },
                // 'layout': {
                //     'icon-image': 'custom-marker',
                //     'icon-size': 0.5
                // }
            })

            

        // Check proximity on map move
        map.on('move', function () {
            checkProximity();
        });

        // Check proximity initially
        checkProximity();
    });
    // Function to check proximity and show alert
    function checkProximity() {
        var userLocation = map.getCenter();
        var targetPoint = [76.36782, 10.38870]; // Replace with the coordinates of your target point

        var distance = turf.distance(
            turf.point(userLocation.toArray()),
            turf.point(targetPoint),
            { units: 'kilometers' }
        );

        // Set your desired proximity threshold
        var proximityThreshold = 0; // in kilometers

        if (distance < proximityThreshold) {
            alert('You are near the target point!');
        }
    }
    // Add geolocate control to the map.
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
    );