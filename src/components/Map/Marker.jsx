import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { styled } from "@mui/material/styles";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia3Jpc2huYWoyMiIsImEiOiJjbTM2MnQ3NWcwMHF2MmtxdzYyOXF2NWdyIn0.k-8sGP9xQS-3GVVRPckBsQ";

const StyledMapContainer = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.palette.background.default,
}));

const StyledMarkerList = styled(Paper)(({ theme }) => ({
  width: "280px",
  background: theme.palette.surface.main,
  padding: "15px",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  overflowY: "auto",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledMarkerItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  backgroundColor: theme.palette.action.hover,
  marginBottom: "8px",
  borderRadius: "6px",
  transition: "background-color 0.2s ease-in-out",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledMarkerButton = styled(Button)(({ theme }) => ({
  fontSize: "12px",
  color: theme.palette.common.white,
  background: theme.palette.error.main,
  borderRadius: "5px",
  padding: "3px 8px",
  transition: "background-color 0.3s",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledEditPopup = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  left: "300px",
  zIndex: 2,
  padding: "10px",
  background: theme.palette.surface.main,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "6px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "200px",
}));

const StyledMap = styled("div")(({ theme }) => ({
  flexGrow: 1,
  position: "relative",
}));

const Marker = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [editingMarker, setEditingMarker] = useState(null);

  // Initialize map
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.1025, 28.7041],
      zoom: 4,
    });

    // Add marker on map click
    mapRef.current.on("click", (e) => {
      const coordinates = [e.lngLat.lng, e.lngLat.lat];
      const newMarker = {
        id: new Date().getTime(),
        coordinates,
        title: "Untitled Marker",
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setEditingMarker(newMarker);
    });

    return () => mapRef.current.remove();
  }, []);

  // Render markers on map
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove all markers before re-rendering
    if (mapRef.current.markers) {
      mapRef.current.markers.forEach((marker) => marker.remove());
    }
    mapRef.current.markers = [];

    markers.forEach((marker) => {
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.style.width = "20px";
      markerElement.style.height = "30px";
      markerElement.style.backgroundImage = "url('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png')";
      markerElement.style.backgroundSize = "cover";
      markerElement.style.cursor = "pointer";
      markerElement.title = marker.title;

      markerElement.addEventListener("click", () => setEditingMarker(marker));

      const mapMarker = new mapboxgl.Marker(markerElement)
        .setLngLat(marker.coordinates)
        .addTo(mapRef.current);

      mapRef.current.markers.push(mapMarker);
    });
  }, [markers]);

  const handleEditComplete = (updatedMarker) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === updatedMarker.id ? updatedMarker : marker
      )
    );
    setEditingMarker(null);
  };

  const deleteMarker = (markerId) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
    setEditingMarker(null);
  };

  const focusOnMarker = (marker) => {
    mapRef.current.flyTo({
      center: marker.coordinates,
      zoom: 8,
    });
    setEditingMarker(marker);
  };

  return (
    <StyledMapContainer>
      <StyledMarkerList>
        <Typography variant="h6" align="center" gutterBottom>
          Markers
        </Typography>
        {markers.length === 0 ? (
          <Typography variant="body1">
            No markers added yet. Click on the map to add a marker.
          </Typography>
        ) : (
          markers.map((marker) => (
            <StyledMarkerItem key={marker.id}>
              <Box onClick={() => focusOnMarker(marker)}>
                <Typography variant="subtitle1" color="primary">
                  {marker.title}
                </Typography>
              </Box>
              <StyledMarkerButton onClick={() => deleteMarker(marker.id)}>
                Delete
              </StyledMarkerButton>
            </StyledMarkerItem>
          ))
        )}
      </StyledMarkerList>

      <StyledMap ref={mapContainerRef} />

      {editingMarker && (
        <StyledEditPopup>
          <TextField
            value={editingMarker.title}
            onChange={(e) =>
              setEditingMarker({ ...editingMarker, title: e.target.value })
            }
            onBlur={() => handleEditComplete(editingMarker)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditComplete(editingMarker);
              }
            }}
            autoFocus
            label="Edit Marker Title"
            variant="outlined"
            fullWidth
          />
        </StyledEditPopup>
      )}
    </StyledMapContainer>
  );
};

export default Marker;
