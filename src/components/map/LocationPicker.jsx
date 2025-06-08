import React, { useEffect } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

const LocationPicker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  // Center map on position when it changes
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
};

export default LocationPicker;
