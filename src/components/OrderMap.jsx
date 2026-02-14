import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
  LoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

// Component wrapper for loading Google Maps script
const OrderMapWrapper = ({ order, showRoute = true }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <OrderMap order={order} showRoute={showRoute} />
    </LoadScript>
  );
};

const OrderMap = ({ order, showRoute = true }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
  });

  useEffect(() => {
    if (order?.current_lat && order?.current_lng) {
      setCenter({ lat: order.current_lat, lng: order.current_lng });
    } else if (order?.pickup_lat && order?.pickup_lng) {
      setCenter({ lat: order.pickup_lat, lng: order.pickup_lng });
    }
  }, [order]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Calculate route path
  const getRoutePath = () => {
    const path = [];

    if (order?.pickup_lat && order?.pickup_lng) {
      path.push({ lat: order.pickup_lat, lng: order.pickup_lng });
    }

    if (order?.current_lat && order?.current_lng) {
      path.push({ lat: order.current_lat, lng: order.current_lng });
    }

    if (order?.destination_lat && order?.destination_lng) {
      path.push({ lat: order.destination_lat, lng: order.destination_lng });
    }

    return path;
  };

  const routePath = getRoutePath();

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Pickup Marker */}
      {order?.pickup_lat && order?.pickup_lng && (
        <Marker
          position={{ lat: order.pickup_lat, lng: order.pickup_lng }}
          label="📍"
          title="Pickup Location"
        />
      )}

      {/* Current Location Marker (Courier) */}
      {order?.current_lat && order?.current_lng && (
        <Marker
          position={{ lat: order.current_lat, lng: order.current_lng }}
          label="🚗"
          title="Current Location"
        />
      )}

      {/* Destination Marker */}
      {order?.destination_lat && order?.destination_lng && (
        <Marker
          position={{ lat: order.destination_lat, lng: order.destination_lng }}
          label="🏠"
          title="Destination"
        />
      )}

      {/* Route Polyline */}
      {showRoute && routePath.length > 1 && (
        <Polyline
          path={routePath}
          options={{
            strokeColor: "#FF6B00",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
};

export { OrderMapWrapper as default };
