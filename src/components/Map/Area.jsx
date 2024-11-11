import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import { toast, ToastContainer } from "react-toastify";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/material/styles";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useArea } from "../Sidebar/AreaContext";

const MapContainer = styled('div')({
  flex: 1,
  position: "relative",
});

const StyledSidebar = styled('div')(({ theme, sidebarExpanded }) => ({
  width: sidebarExpanded ? "350px" : "100px",
  backgroundColor: theme.palette.background.paper,
  padding: "20px",
  boxShadow: sidebarExpanded ? "0 8px 16px rgba(0, 0, 0, 0.2)" : "none",
  overflowY: "auto",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: sidebarExpanded ? "flex-start" : "center",
}));

const StyledLink = styled('div')(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  fontSize: "1.2em",
  color: theme.palette.primary.main,
  transition: "color 0.3s",
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const AreaItem = styled('li')(({ theme, isFocused }) => ({
  marginBottom: "15px",
  backgroundColor: isFocused ? theme.palette.primary.light : theme.palette.background.paper,
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  border: `2px solid ${isFocused ? theme.palette.primary.main : theme.palette.divider}`,
  transition: "transform 0.2s, background-color 0.3s, border-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-2px)",
  },
}));

const AreaNameInput = styled('input')(({ theme }) => ({
  width: "100%",
  padding: "8px",
  border: `1px solid ${theme.palette.divider}`,
  outline: "none",
  fontSize: "14px",
  marginBottom: "8px",
  borderRadius: "5px",
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
}));

const DeleteButton = styled('button')(({ theme }) => ({
  marginTop: "10px",
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  border: "none",
  padding: "8px 15px",
  fontSize: "12px",
  cursor: "pointer",
  borderRadius: "5px",
  transition: "background-color 0.3s, transform 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
    transform: "scale(1.05)",
  },
}));

const CalculationBox = styled('div')({
  height: "85px",
  width: "200px",
  position: "absolute",
  bottom: "40px",
  left: "380px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "15px",
  textAlign: "center",
  borderRadius: "5px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
});

const Area = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const tooltipRef = useRef();
  const [roundedArea, setRoundedArea] = useState();
  const [focusedAreaId, setFocusedAreaId] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [draw] = useState(
    new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    })
  );

  const { areas, addArea, deleteArea, updateAreaName, loading } = useArea(); // Use context functions

  useEffect(() => {
    mapboxgl.accessToken =   "pk.eyJ1Ijoia3Jpc2huYWoyMiIsImEiOiJjbTM2MnQ3NWcwMHF2MmtxdzYyOXF2NWdyIn0.k-8sGP9xQS-3GVVRPckBsQ";
    ;
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.1025, 28.7041],
      zoom: 4,
    });
  
    mapRef.current.addControl(draw);
  
    mapRef.current.on("draw.create", handleDrawEvent);
    mapRef.current.on("draw.delete", handleDrawEvent);
    mapRef.current.on("draw.update", handleDrawEvent);
  
    tooltipRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
  
    function showTooltip(e) {
      const feature = e.features[0];
      const area = turf.area(feature);
      const roundedArea = Math.round(area * 100) / 100;
      tooltipRef.current
        .setLngLat(e.lngLat)
        .setHTML(`<p style="margin: 0; font-size: 13px;">${roundedArea} m²</p>`)
        .addTo(mapRef.current);
    }
  
    function hideTooltip() {
      tooltipRef.current.remove();
    }
  
    mapRef.current.on(
      "mouseenter",
      "gl-draw-polygon-fill-inactive.cold",
      showTooltip
    );
    mapRef.current.on(
      "mouseleave",
      "gl-draw-polygon-fill-inactive.cold",
      hideTooltip
    );
  
    // Cleanup map resources on component unmount
    return () => mapRef.current.remove();
  }, [draw]);
  
  // Add this useEffect to reload areas on the map when areas change
  useEffect(() => {
    if (!mapRef.current) return;
  
    // Clear existing drawings on the map
    draw.deleteAll();
  
    // Loop through the areas and add them to the map
    areas.forEach((area) => {
      draw.add({
        id: area.id,
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: area.coordinates,
        },
        properties: {
          name: area.name,
        },
      });
    });
  }, [areas, draw]);
  

  const handleDrawEvent = () => {
    const data = draw.getAll();
    const area = data.features.length ? turf.area(data) : 0;
    setRoundedArea(Math.round(area * 100) / 100);

    if (data.features.length) {
      const newFeature = data.features[data.features.length - 1];
      const newArea = {
        id: newFeature.id,
        name: `Untitled ${areas.length + 1}`,
        size: Math.round(area * 100) / 100,
        coordinates: newFeature.geometry.coordinates,
      };
      addArea(newArea); // Use addArea from context
    }
  };

  const handleNameChange = (id, newName) => {
    updateAreaName(id, newName); // Use updateAreaName from context
  };

  const removeArea = (id) => {
    draw.delete(id);
    deleteArea(id); // Use deleteArea from context
    toast.info("Area removed successfully.");
  };

  const focusOnArea = (id) => {
    const feature = draw.get(id);
    if (feature) {
      const bbox = turf.bbox(feature);
      mapRef.current.fitBounds(bbox, { padding: 50 });
      setFocusedAreaId(id);
    }
  };

  const areaListElements = areas.map((area) => (
    <AreaItem
      key={area.id}
      isFocused={focusedAreaId === area.id}
      onClick={() => focusOnArea(area.id)}
    >
      <AreaNameInput
        type="text"
        placeholder={`Untitled ${area.id}`}
        value={area.name || ""}
        onChange={(e) => handleNameChange(area.id, e.target.value)}
      />
      <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
        <strong>Area:</strong> {area.size} m²
      </p>
      <DeleteButton onClick={() => removeArea(area.id)}>Delete</DeleteButton>
    </AreaItem>
  ));

  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Left-side Panel for Area List */}
        <StyledSidebar
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          onClick={() => setSidebarExpanded(true)}
        >
          <StyledLink>
            <FaMapMarkedAlt />
            {sidebarExpanded && <span>Area List</span>}
          </StyledLink>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul style={{ padding: 0, listStyleType: "none" }}>
              {areaListElements}
            </ul>
          )}
        </StyledSidebar>

        {/* Map Container */}
        <MapContainer ref={mapContainerRef} />

        {/* Calculation Box for Active Drawing Area */}
        <CalculationBox>
          <p style={{ margin: 0, fontFamily: "Open Sans", fontSize: 13 }}>
            Click the map to draw a polygon.
          </p>
          <div id="calculated-area">
            {roundedArea && (
              <>
                <p style={{ margin: 0, fontFamily: "Open Sans", fontSize: 13 }}>
                  <strong>{roundedArea}</strong>
                </p>
                <p style={{ margin: 0, fontFamily: "Open Sans", fontSize: 13 }}>
                  square meters
                </p>
              </>
            )}
          </div>
        </CalculationBox>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Area;