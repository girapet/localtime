
export const geolocation = window.navigator?.geolocation;

// alternate location for development

export const fixedGeolocation = (latitude, longitude) => ({
  getCurrentPosition: (callback) => {
    callback({ 
      coords: { 
        latitude, 
        longitude
      }
    });
  }
});

export default { geolocation, fixedGeolocation }