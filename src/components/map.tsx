import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return (
    <Map
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: 10,
      }}
      style={{ width: "100%", height: "500px", overflow: "hidden" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_GL_MAPBOX_ACCESS_TOKEN}
    >
      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <div
          style={{
            cursor: "pointer",
            color: "red",
            fontSize: "2rem",
          }}
        >
          📍
        </div>
      </Marker>
    </Map>
  );
};

export default MapComponent;
