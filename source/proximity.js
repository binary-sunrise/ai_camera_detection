import { showBanner, hideBanner, playNotificationSound } from './ui.js';
import { geolocate, map } from './map.js';

// Function to check proximity
export const checkProximity = () => {
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
            } else if (nearestCamera && nearestCamera.distance < proximityThreshold2) {
                const distanceFormatted = nearestCamera.distance.toFixed(2);
                const bannerMessage2 = `You are close to (${nearestCamera.name}) AI camera, Distance: ${distanceFormatted}`;

                // Play notification sound for distances less than 1 km
                playNotificationSound();

                showBanner(bannerMessage2, 'warning');
            } else {
                // If no nearby cameras within the thresholds, hide the banner
                hideBanner();
            }
        }
    });
}
