const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  // constants.js
  const TABS = [
    { id: 'visualize', label: 'Visualize GeoJSON' },
    { id: 'calculateArea', label: 'Calculate Area' },
    { id: 'calculateDistance', label: 'Calculate Distance' },
    { id: 'addMarker', label: 'Add Marker' },
    { id: 'dragMarker', label: 'Draggable Markers' },
  ];
  export { MAPBOX_TOKEN, generateRandomColor, TABS };
