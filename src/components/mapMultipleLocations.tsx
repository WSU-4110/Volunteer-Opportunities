"use-client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapMultipleLocations = ({ listings }: { listings: any }) => {
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  return (
    <div className="h-[400px] w-[400px] m-auto xl:w-full xl:h-full">
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
      >
        {listings.length > 0 &&
          listings
            .filter(
              (listing: any) =>
                listing.listings.latitude != null &&
                listing.listings.longitude != null
            )
            .map((listing: any) => {
              return (
                <div key={listing.listings.id}>
                  <Marker
                    latitude={listing.listings.latitude}
                    longitude={listing.listings.longitude}
                    anchor="bottom"
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "2rem",
                      }}
                      onClick={() => setSelectedListing(listing.listings.id)}
                    >
                      📍
                    </div>
                  </Marker>
                  {selectedListing === listing.listings.id && (
                    <Popup
                      latitude={listing.listings.latitude}
                      longitude={listing.listings.longitude}
                      anchor="bottom"
                      onClose={() => setSelectedListing(null)} // Close popup when clicked outside
                      closeOnClick={false}
                      closeButton={false}
                    >
                      <div className="p-4 bg-white">
                        <button
                          className="mapboxgl-popup-close-button"
                          style={{
                            fontSize: "1.5rem",
                            width: "2rem",
                            height: "2rem",
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                          onClick={() => setSelectedListing(null)}
                        >
                          ×
                        </button>
                        <img
                          className="w-[100px] h-[100px] m-auto"
                          src={listing.listings.thumbnail}
                        ></img>
                        <h3 className="font-bold">{listing.listings.name}</h3>
                        <p>Address: {listing.listings.address}</p>
                      </div>
                    </Popup>
                  )}
                </div>
              );
            })}
      </Map>
    </div>
  );
};

export default MapMultipleLocations;
