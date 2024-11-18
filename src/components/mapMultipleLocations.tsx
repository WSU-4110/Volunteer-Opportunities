"use-client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapMultipleLocations = () => {
  return (
    <div className="h-[400px] w-[400px] m-auto xl:w-full xl:h-full xl:min-h-[1000px]">
      <Map
        initialViewState={{
          latitude: 39.8283,
          longitude: -98.5795,
          zoom: 4,
        }}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          margin: "auto",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_GL_MAPBOX_ACCESS_TOKEN}
      ></Map>
    </div>
  );
};

export default MapMultipleLocations;
