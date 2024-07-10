import { map } from './map.js';

// Function to show a banner
export const showBanner = (message, type) => {
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
export const hideBanner = () => {
    const banner = document.getElementById('banner');
    banner.style.display = 'none';
}

// Function to play a notification sound
export const playNotificationSound = () => {
    // Create an audio element
    const audio = new Audio('./Assets/notification.mp3'); // Replace with the path to your audio file
    audio.play();
}

// Function to handle marker click
export const handleMarkerClick = (e) => {
    const coordinates = e.features[0].geometry.coordinates;
    const name = `Name: ${e.features[0].properties.Name}`;

    // Create the animated popup
    const popup = new AnimatedPopup({
        openingAnimation: { duration: 1000, easing: 'easeOutElastic', transform: 'scale' },
        closingAnimation: { duration: 300, easing: 'easeInBack', transform: 'scale' },
    }).setHTML(`<div class="custom-popup"><div class="custom-popup-content">${name}</div></div>`);

    // Set the popup position and add it to the map
    popup.setLngLat(coordinates).addTo(map);

    // Fly to the clicked location with a zoom level of 5
    map.flyTo({
        center: coordinates,
        zoom: 11,
        speed: 2, // optional, set the speed of the flyTo animation
        curve: 1.42, // optional, set the curvature of the flyTo animation
        easing: (t) => t // optional, easing function
    });
};

