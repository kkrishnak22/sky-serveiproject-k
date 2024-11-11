// root/src/components/Sidebar/AreaContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, deleteDoc, getDocs, doc, query, where, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "../Auth/AuthContext";

const AreaContext = createContext();

export const useArea = () => useContext(AreaContext);

export const AreaProvider = ({ children }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAreas();
    } else {
      setAreas([]);
    }
  }, [user]);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const areaCollection = collection(db, "areas");
      const q = query(areaCollection, where("userId", "==", user.uid));
      const areaSnapshot = await getDocs(q);
      const areaList = areaSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          coordinates: JSON.parse(data.coordinates), // Deserialize coordinates
        };
      });
      setAreas(areaList);
    } catch (error) {
      console.error("Error fetching areas from Firebase: ", error);
      toast.error("Failed to load areas. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addArea = async (newArea) => {
    if (!user) return;
    try {
      const areaData = {
        ...newArea,
        userId: user.uid,
        coordinates: JSON.stringify(newArea.coordinates), // Serialize coordinates
      };
      const docRef = await addDoc(collection(db, "areas"), areaData);
      setAreas((prev) => [...prev, { ...newArea, id: docRef.id }]);
      toast.success("Area added successfully!");
    } catch (error) {
      console.error("Error adding new area: ", error);
      toast.error("Failed to add area. Please try again later.");
    }
  };

  const deleteArea = async (id) => {
    try {
      await deleteDoc(doc(db, "areas", id));
      setAreas((prev) => prev.filter((area) => area.id !== id));
      toast.success("Area deleted successfully!");
    } catch (error) {
      console.error("Error deleting area: ", error);
      toast.error("Failed to delete area. Please try again later.");
    }
  };

  const updateAreaName = async (id, newName) => {
    try {
      const areaDoc = doc(db, "areas", id);
      await updateDoc(areaDoc, { name: newName });
      setAreas((prevAreas) =>
        prevAreas.map((area) =>
          area.id === id ? { ...area, name: newName } : area
        )
      );
      toast.success("Area name updated successfully!");
    } catch (error) {
      console.error("Error updating area name: ", error);
      toast.error("Failed to update area name. Please try again later.");
    }
  };

  return (
    <AreaContext.Provider value={{ areas, addArea, deleteArea, updateAreaName, loading }}>
      {children}
    </AreaContext.Provider>
  );
};
