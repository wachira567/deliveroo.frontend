import { useState, useCallback, useEffect, useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: -1.286389, // Nairobi
  lng: 36.817223,
};

// Define libraries outside to verify equal reference
const libraries = ["places"];

const OrderMap = ({ order }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Calculate center based on order
  const center = useMemo(() => {
    if (order?.pickup_lat && order?.pickup_lng) {
      return { lat: order.pickup_lat, lng: order.pickup_lng };
    }
    return defaultCenter;
  }, [order]);

  useEffect(() => {
    if (isLoaded && order?.pickup_lat && order?.destination_lat && window.google) {
       const directionsService = new window.google.maps.DirectionsService();
       
       const origin = { lat: order.pickup_lat, lng: order.pickup_lng };
       const destination = { lat: order.destination_lat, lng: order.destination_lng };
       
       directionsService.route(
         {
           origin: origin,
           destination: destination,
           travelMode: window.google.maps.TravelMode.DRIVING,
         },
         (result, status) => {
           if (status === window.google.maps.DirectionsStatus.OK) {
             setDirectionsResponse(result);
           } else {
             console.error(`Directions request failed due to ${status}`);
           }
         }
       );
    }
  }, [isLoaded, order?.pickup_lat, order?.destination_lat, order?.pickup_lng, order?.destination_lng]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
      }}
    >
      {/* Show Directions if available */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
              suppressMarkers: true, // We will render our own markers
              polylineOptions: {
                  strokeColor: "#F97316", // Orange-500
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
              }
          }}
        />
      )}

      {/* Pickup Marker */}
      {order?.pickup_lat && (
        <Marker
          position={{ lat: order.pickup_lat, lng: order.pickup_lng }}
          label="P"
          title="Pickup Location"
        />
      )}

      {/* Destination Marker */}
      {order?.destination_lat && (
        <Marker
            position={{ lat: order.destination_lat, lng: order.destination_lng }}
            label="D"
            title="Destination"
        />
      )}
      
      {/* Courier Marker */}
      {order?.current_lat && (
          <Marker
            position={{ lat: order.current_lat, lng: order.current_lng }}
            label="🚗"
            title="Courier Location"
            options={{
                zIndex: 999,
                icon: {
                    path: window.google?.maps?.SymbolPath?.CIRCLE,
                    scale: 10,
                    fillColor: "#00CCBC",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                }
            }}
          />
      )}
    </GoogleMap>
  );
};

export default OrderMap;
