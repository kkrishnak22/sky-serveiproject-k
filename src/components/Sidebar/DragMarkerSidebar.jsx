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
  width: "300px",
  background: theme.palette.surface.main,
  padding: theme.spacing(2),
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
  overflowY: "auto",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledMarkerItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
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
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  transition: "background-color 0.3s",
  width: "100%",
  fontWeight: theme.typography.button.fontWeight,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledEditPopup = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  left: "320px",
  zIndex: 2,
  padding: theme.spacing(2),
  background: theme.palette.surface.main,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "200px",
}));

const StyledMap = styled("div")(({ theme }) => ({
  flexGrow: 1,
  height: "100vh",
  position: "relative",
}));

const DragMarkerMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Initialize map
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.1025, 28.7041],
      zoom: 4,
    });

    return () => mapRef.current.remove();
  }, []);

  const addMarker = () => {
    const mapCenter = mapRef.current.getCenter();

    const newMarkerData = {
      id: new Date().getTime(),
      coordinates: [mapCenter.lng.toFixed(4), mapCenter.lat.toFixed(4)],
      title: "New Marker",
    };

    const newMarker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(newMarkerData.coordinates)
      .addTo(mapRef.current);

    newMarker.on("dragend", () => {
      const updatedCoordinates = newMarker.getLngLat();
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.id === newMarkerData.id
            ? {
                ...marker,
                coordinates: [
                  updatedCoordinates.lng.toFixed(4),
                  updatedCoordinates.lat.toFixed(4),
                ],
              }
            : marker
        )
      );
    });

    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { ...newMarkerData, instance: newMarker },
    ]);
  };

  const selectMarker = (marker) => {
    setSelectedMarker(marker);
    mapRef.current.flyTo({
      center: marker.coordinates,
      essential: true,
      zoom: 5,
    });
  };

  const updateMarkerTitle = (id, newTitle) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, title: newTitle } : marker
      )
    );
  };

  const deleteMarker = (id) => {
    setMarkers((prevMarkers) => {
      const remainingMarkers = prevMarkers.filter((marker) => marker.id !== id);
      const markerToRemove = prevMarkers.find((marker) => marker.id === id);
      markerToRemove.instance.remove();
      return remainingMarkers;
    });
  };

  return (
    <StyledMapContainer>
      <StyledMarkerList>
        <Typography variant="h6" align="center" gutterBottom>
          Markers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={addMarker}
          sx={{ marginBottom: 2 }}
        >
          Add Marker
        </Button>
        {markers.length === 0 ? (
          <Typography variant="body1">
            No markers added yet. Click "Add Marker" to create one.
          </Typography>
        ) : (
          markers.map((marker) => (
            <StyledMarkerItem key={marker.id} onClick={() => selectMarker(marker)}>
              <Box >
                <TextField
                  variant="outlined"
                  size="small"
                  value={marker.title}
                  onChange={(e) => updateMarkerTitle(marker.id, e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Coordinates: {marker.coordinates[0]}, {marker.coordinates[1]}
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
    </StyledMapContainer>
  );
};

export default DragMarkerMap;
