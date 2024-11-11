import React from "react";

const FileUploader = ({ onFileUpload }) => (
  <input
    type="file"
    multiple
    accept=".geojson,.kml"
    onChange={onFileUpload}
    style={{
      margin: "10px 0",
      padding: "5px",
      cursor: "pointer",
      width: "100%",
    }}
  />
);

export default FileUploader;
