import React, { useState, useRef, useEffect } from "react";
import FileUploader from "../FileUploader/FileUploader";
import { generateRandomColor } from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import { FaLayerGroup, FaUpload } from "react-icons/fa";
import { Checkbox } from "antd";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-toastify/dist/ReactToastify.css";
import { MAPBOX_TOKEN } from "../../utils/utils";
import { styled } from "@mui/material/styles";

mapboxgl.accessToken =  "pk.eyJ1Ijoia3Jpc2huYWoyMiIsImEiOiJjbTM2MnQ3NWcwMHF2MmtxdzYyOXF2NWdyIn0.k-8sGP9xQS-3GVVRPckBsQ";

const StyledSidebar = styled("div")(({ theme, sidebarExpanded }) => ({
  width: sidebarExpanded ? "300px" : "100px",
  background: theme.palette.background.paper,
  backdropFilter: "blur(10px)",
  padding: "20px",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: sidebarExpanded ? "flex-start" : "center",
  boxShadow: sidebarExpanded ? "0 8px 16px rgba(0, 0, 0, 0.2)" : "none",
}));

const StyledLink = styled("div")(({ theme }) => ({
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

const StyledLayerItem = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  borderRadius: "4px",
  transition: "background 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Layer = () => {
  const [layers, setLayers] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      projection: "globe",
      center: [108, 4],
      zoom: 2,
    });

    mapRef.current.on("style.load", () => {
      mapRef.current.setFog({});
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("earthquakes", {
        type: "geojson",
        data: "",
      });

      mapRef.current.addLayer({
        id: "earthquakes-layer",
        type: "circle",
        source: "earthquakes",
        paint: {
          "circle-radius": 4,
          "circle-stroke-width": 2,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
      });
    });

    return () => mapRef.current.remove();
  }, []);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      const fileName = file.name.toLowerCase();

      reader.onload = (e) => {
        const data = e.target.result;
        const id = `layer-${file.name}-${index}`;

        if (fileName.endsWith(".geojson")) {
          try {
            const geojson = JSON.parse(data);
            addLayerToMap(fileName, geojson, id);
          } catch (error) {
            toast.error("Invalid GeoJSON format.");
          }
        } else if (fileName.endsWith(".kml")) {
        //  convertKMLtoGeoJSON(data, (geojson) => addLayerToMap(geojson, id));
        } else {
          toast.error(
            "Unsupported file type. Only .geojson and .kml are supported."
          );
        }
      };

      reader.readAsText(file);
    });
  };

  const addLayerToMap = (fileName, geojson, layerId) => {
    try {
      const sourceId = `source-${fileName}-${layerId}`;
      const uniqueLayerId = `layer-${fileName}-${layerId}`;

      if (!mapRef.current.getSource(sourceId)) {
        const color = generateRandomColor();

        mapRef.current.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });

        mapRef.current.addLayer({
          id: uniqueLayerId,
          type: "fill",
          source: sourceId,
          layout: {},
          paint: {
                "fill-color": color,
                "fill-opacity": 0.5,
              },
        });
        mapRef.current.addLayer({
          id: uniqueLayerId,
          type: 'line',
          source: sourceId,
          layout: {},
          paint: {
            'line-color': color,
            'line-width': 3
          }
        });
        setLayers((prev) => [
          ...prev,
          { layerId: uniqueLayerId, name: fileName, color, visible: true },
        ]);
      } else {
        mapRef.current.getSource(sourceId).setData(geojson);
        toast.info(`Layer "${uniqueLayerId}" data updated.`);
      }
    } catch (error) {
      toast.error("An error occurred while adding the layer.");
    }
  };

  const handleLayerVisibilityChange = (layerId, visible) => {
    const layer = mapRef.current.getLayer(layerId);
    if (layer) {
      mapRef.current.setLayoutProperty(
        layerId,
        "visibility",
        visible ? "visible" : "none"
      );
    }
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.layerId === layerId ? { ...layer, visible } : layer
      )
    );
  };
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <StyledSidebar
        sidebarExpanded={sidebarExpanded}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        onClick={() => setSidebarExpanded(true)}
      >
        <StyledLink>
          <FaUpload />
          {sidebarExpanded && <span>Upload Files</span>}
        </StyledLink>
        <FileUploader onFileUpload={handleFileUpload} />
        <StyledLink>
          <FaLayerGroup />
          {sidebarExpanded && <span>Layer Controls</span>}
        </StyledLink>
        <div className="layer-controls">
          {layers.map((layer) => (
            <StyledLayerItem key={layer.layerId}>
              <Checkbox
                checked={layer.visible}
                onChange={(e) =>
                  handleLayerVisibilityChange(layer.layerId, e.target.checked)
                }
                style={{ color: layer.color }}
              >
                {sidebarExpanded && <span>{layer.name}</span>}
              </Checkbox>
            </StyledLayerItem>
          ))}
        </div>
      </StyledSidebar>

      <div
        ref={mapContainerRef}
        style={{ flex: 1, position: "relative" }}
        onClick={() => setSidebarExpanded(false)}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Layer;
