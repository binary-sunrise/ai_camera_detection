
import { data } from '../data/AI_camera.js';
import { checkProximity } from './proximity.js';
import { handleMarkerClick } from './ui.js';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoYXlmenYyIiwiYSI6ImNsZXNzZW9mcTAyanozem83am12NmJlczQifQ._w2s02CV9Ufl62nRwCrY9w';

// Initializing the Map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    projection: 'globe',
    zoom: 6.23,
    center: [76.36782, 10.38870]
});

// Geolocation control
export const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
});
map.addControl(geolocate, 'bottom-right');

export const mapinit = () => {
    // Add custom marker image to the map
    map.loadImage("./Assets/camera.png", (error, image) => {
        if (error) throw error;
        map.addImage("custom-marker", image);
    });

    // Event handling
    map.on("style.load", () => map.setFog({}));

    map.on("load", () => {
        map.addSource("AI_camera", { type: "geojson", data });

        map.addLayer({
            id: "AI_camera-locations",
            type: "symbol",
            source: "AI_camera",
            layout: {
                "icon-image": "custom-marker",
                "icon-size": 0.04,
                "icon-allow-overlap": false,
            },
        });
    });

    map.on("click", "AI_camera-locations", handleMarkerClick);
    map.on("mouseenter", "AI_camera-locations",
        () => (map.getCanvas().style.cursor = "pointer")
    );
    map.on("mouseleave", "AI_camera-locations",
        () => (map.getCanvas().style.cursor = "")
    );

    map.on("idle", checkProximity);
}

export { map };  // Export the map object to use it in other modules
