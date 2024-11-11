// Sidebar.js
import React from "react";
import { TABS } from "../../utils/utils";
import VisualizeSidebar from "./VisualizeSidebar";
import AreaSidebar from "./AreaSidebar";
import DistanceSidebar from "./DistanceSidebar";
import AddMarkerSidebar from "./AddMarkerSidebar";
import DragMarkerSidebar from "./DragMarkerSidebar";



const Sidebar = ({ activeTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {activeTab === TABS.VISUALIZE && <VisualizeSidebar />}
        {activeTab === TABS.CALCULATE_AREA && <AreaSidebar />}
        {activeTab === TABS.CALCULATE_DISTANCE && <DistanceSidebar />}
        {activeTab === TABS.ADD_MARKER && <AddMarkerSidebar />}
        {activeTab === TABS.DRAG_MARKER && <DragMarkerSidebar />}
      </div>
    </div>
  );
};

export default Sidebar;
