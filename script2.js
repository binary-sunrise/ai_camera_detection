    // Mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoYXlmenYyIiwiYSI6ImNsZXNzZW9mcTAyanozem83am12NmJlczQifQ._w2s02CV9Ufl62nRwCrY9w';

    // Initializing the Map
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard',
        projection: 'globe',
        zoom: 6.23,
        center: [76.36782, 10.38870]
    });

    // GIS DATA
    const data = 'AI_camera.geojson';

    // Add custom marker image to the map
    map.loadImage('Assets/camera4.png', (error, image) => {
        if (error) throw error;
        map.addImage('custom-marker', image);
    });

    // Geolocation control
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
    });
    map.addControl(geolocate, 'bottom-right');

    // Event handling
    map.on('style.load', () => map.setFog({}));

    map.on('load', () => {
        map.addSource('AI_camera', { type: 'geojson', data });

        map.addLayer({
            'id': 'AI_camera-locations',
            'type': 'symbol',
            'source': 'AI_camera',
            'layout': {
                'icon-image': 'custom-marker',
                'icon-size': 0.05,
                'icon-allow-overlap': false,
            }
        });

        map.on('click', 'AI_camera-locations', handleMarkerClick);
        map.on('mouseenter', 'AI_camera-locations', () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', 'AI_camera-locations', () => map.getCanvas().style.cursor = '');

        map.on('idle', checkProximity);
    });

// Function to handle marker click
function handleMarkerClick(e) {
    const coordinates = e.features[0].geometry.coordinates;
    const name = `Name: ${e.features[0].properties.Name}`;

    const popup = new AnimatedPopup({
        openingAnimation: { duration: 1000, easing: 'easeOutElastic', transform: 'scale' },
        closingAnimation: { duration: 300, easing: 'easeInBack', transform: 'scale' },
    }).setHTML(`<div class="custom-popup"><div class="custom-popup-content">${name}</div></div>`);

    popup.setLngLat(coordinates).addTo(map);
}

// Function to check proximity
function checkProximity() {
    geolocate.on('geolocate', (e) => {
        const userLocation = [e.coords.longitude, e.coords.latitude];
        const features = map.querySourceFeatures('AI_camera');

        if (features.length > 0) {
            let nearestCamera = null;
            let nearestDistance = Infinity;

            for (const feature of features) {
                const targetPoint = feature.geometry.coordinates;
                const cameraName = feature.properties.Name;

                const distance = turf.distance(turf.point(userLocation), turf.point(targetPoint), { units: 'kilometers' });

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestCamera = { name: cameraName, distance };
                }
            }

            const proximityThreshold = 5;
            const proximityThreshold2 = 1;

            if (nearestCamera && nearestCamera.distance < proximityThreshold && nearestCamera.distance >= proximityThreshold2) {
                const distanceFormatted = nearestCamera.distance.toFixed(2);
                const bannerMessage = `You are ${distanceFormatted} km from the nearest AI camera (${nearestCamera.name}).`;

                showBanner(bannerMessage, 'primary');
            } else if(nearestCamera && nearestCamera.distance < proximityThreshold2){
                const distanceFormatted = nearestCamera.distance.toFixed(2);
                const bannerMessage2 = `You are close to (${nearestCamera.name}) AI camera, Distance :${distanceFormatted}`;

                // Play notification sound for distances less than 1 km
                playNotificationSound();

                showBanner(bannerMessage2, 'warning');
            } else {
                // If no nearby cameras within 2 km, hide the banner
                hideBanner();
            }
        }
    });
}


// Function to show a banner
function showBanner(message,type) {
    const banner = document.getElementById('banner');
    const bannerContent = document.getElementById('bannerContent');

    // Update the banner content
    bannerContent.innerHTML = message;

    // Apply different styles based on the banner type
    if (type === 'primary') {
        banner.style.backgroundColor = '#42b983'; // Primary color
    } else if (type === 'warning') {
        banner.style.backgroundColor = '#ff9800'; // Warning color
    } else {
        // Customize the color for bannerMessage2
        banner.style.backgroundColor = '#4caf50'; // Green color for message2
    }

    // Show the banner
    banner.style.display = 'block';

    // // Close the banner after a delay (e.g., 5 seconds)
    // setTimeout(() => {
    //     hideBanner();
    // }, 9000); // Adjust the delay as needed
}

// Function to hide the banner
function hideBanner() {
    const banner = document.getElementById('banner');
    banner.style.display = 'none';
}


// Function to play a notification sound
function playNotificationSound() {
    // Create an audio element
    const audio = new Audio('Assets/notification.mp3'); // Replace with the path to your audio file
    audio.play();
}
