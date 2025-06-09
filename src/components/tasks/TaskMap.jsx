import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Map reference component to access the map instance
export const MapReference = ({ mapRef }) => {
  const map = useMap();
  
  // Set the map instance to the ref when the component mounts
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  
  return null;
};

// Component to listen for map movements and show circle after zooming
const ZoomListener = ({ setIsZooming, locationActive, userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locationActive && userLocation) {
      // Set isZooming to true when location is active
      setIsZooming(true);
      
      // Listen for the moveend event (fired after zoom/pan animations complete)
      const onMoveEnd = () => {
        setIsZooming(false);
      };
      
      map.on('moveend', onMoveEnd);
      
      // Clean up the event listener
      return () => {
        map.off('moveend', onMoveEnd);
      };
    }
  }, [map, locationActive, userLocation, setIsZooming]);
  
  return null;
};

const formatVND = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

const TaskMap = ({ 
  mapRef, 
  userLocation, 
  locationActive, 
  searchRadius, 
  filteredTasks, 
  handleViewTaskDetails, 
  createCategoryIcon, 
  getCategoryName,
  getCategoryIconElement,
  getCategoryColor 
}) => {
  const [isZooming, setIsZooming] = useState(false);

  return (
    <MapContainer
      center={[16.0583, 108.2772]}
      zoom={5}
      className="w-full h-full z-0"
    >
      <MapReference mapRef={mapRef} />
      <ZoomListener 
        setIsZooming={setIsZooming} 
        locationActive={locationActive} 
        userLocation={userLocation} 
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* User location circle - only show when not zooming */}
      {locationActive && userLocation && !isZooming && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={searchRadius}
          pathOptions={{
            color: "#16a34a", // green-600
            fillColor: "#16a34a",
            fillOpacity: 0.1,
          }}
        />
      )}

      {/* User location marker */}
      {locationActive && userLocation && (
        <Marker 
          position={[userLocation.lat, userLocation.lng]}
          icon={L.divIcon({
            className: "custom-marker-icon",
            html: `<div style="background-color: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 3px solid white;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="1"></circle>
                    </svg>
                  </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
          })}
        >
          <Popup>
            <div className="text-center">
              <p className="font-medium">Vị trí của bạn</p>
              <p className="text-sm text-gray-500">Bán kính tìm kiếm: {searchRadius/1000} km</p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Task markers */}
      {filteredTasks.map((task, idx) => (
        <Marker
          key={task._id || idx}
          position={[task.lat, task.lng]}
          icon={createCategoryIcon(getCategoryName(task))}
        >
          <Popup minWidth={250}>
            <div className="popup-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                {getCategoryIconElement(getCategoryName(task))}
                <span
                  className="ml-2 text-sm font-medium"
                  style={{ color: getCategoryColor(getCategoryName(task)) }}
                >
                  {getCategoryName(task)}
                </span>
              </div>
              <strong className="block text-lg mb-1">{task.title}</strong>
              <p className="mb-2 font-medium text-green-600">
                {formatVND(task.price)}
              </p>
              <p className="mb-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3 inline mr-1" /> {task.location}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTaskDetails(idx);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm font-medium w-full text-center"
              >
                Xem công việc
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TaskMap;
