"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in nextjs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  position: { lat: number; lng: number };
  setPosition: (pos: { lat: number; lng: number }) => void;
  onAddressFetched?: (address: any) => void;
}

const LocationMarker = ({ position, setPosition, onAddressFetched }: LocationMapProps) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker 
      position={position} 
      ref={markerRef}
      draggable={true}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition({ lat: newPos.lat, lng: newPos.lng });
          }
        },
      }}
    />
  );
};

export default function LocationMap({ position, setPosition, onAddressFetched }: LocationMapProps) {
  // Free Nominatim Reverse Geocoding
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`, {
          headers: {
            'Accept-Language': 'en'
          }
        });
        const data = await res.json();
        if (onAddressFetched) {
          onAddressFetched(data.address || {});
        }
      } catch (error) {
        console.error("Failed to reverse geocode:", error);
      }
    };

    // Debounce the fetch slightly to prevent spamming the free API while dragging
    const timeoutId = setTimeout(() => {
      fetchAddress();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [position.lat, position.lng, onAddressFetched]);

  return (
    <MapContainer center={position} zoom={14} scrollWheelZoom={false} className="w-full h-full z-0 rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
