import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";

// Set Mapbox Access Token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const defaultCenter = [36.817223, -1.286389]; // Nairobi [lng, lat]

const OrderMap = ({ order }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const pickupMarker = useRef(null);
  const destinationMarker = useRef(null);
  const courierMarker = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
        if (map.current) map.current.remove();
    };
  }, []);

  // Update Markers and Route
  useEffect(() => {
    if (!map.current || !order) return;

    // Pickup Marker
    if (order.pickup_lat && order.pickup_lng) {
        if (!pickupMarker.current) {
            pickupMarker.current = new mapboxgl.Marker({ color: "#ea580c" }) // Orange-600
                .setLngLat([order.pickup_lng, order.pickup_lat])
                .setPopup(new mapboxgl.Popup().setText("Pickup"))
                .addTo(map.current);
        } else {
            pickupMarker.current.setLngLat([order.pickup_lng, order.pickup_lat]);
        }
    }

    // Destination Marker
    if (order.destination_lat && order.destination_lng) {
        if (!destinationMarker.current) {
            destinationMarker.current = new mapboxgl.Marker({ color: "#2563eb" }) // Blue-600
                .setLngLat([order.destination_lng, order.destination_lat])
                .setPopup(new mapboxgl.Popup().setText("Destination"))
                .addTo(map.current);
        } else {
            destinationMarker.current.setLngLat([order.destination_lng, order.destination_lat]);
        }
    }

    // Courier Marker
    if (order.current_lat && order.current_lng) {
        if (!courierMarker.current) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/3063/3063823.png)'; // Simple car icon or similar
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.backgroundSize = '100%';
            
            // For now using default marker but green to represent courier if custom icon fails
            courierMarker.current = new mapboxgl.Marker({ color: "#00ccbc", scale: 0.8 }) 
                .setLngLat([order.current_lng, order.current_lat])
                .setPopup(new mapboxgl.Popup().setText("Courier"))
                .addTo(map.current);
        } else {
            courierMarker.current.setLngLat([order.current_lng, order.current_lat]);
        }
    }

    // Draw Route
    if (order.pickup_lat && order.destination_lat) {
        fetchRoute();
    }

    // Fit Bounds
    const bounds = new mapboxgl.LngLatBounds();
    if (order.pickup_lng) bounds.extend([order.pickup_lng, order.pickup_lat]);
    if (order.destination_lng) bounds.extend([order.destination_lng, order.destination_lat]);
    if (order.current_lng) bounds.extend([order.current_lng, order.current_lat]);

    if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, { padding: 50 });
    }

  }, [order]);

  const fetchRoute = async () => {
      try {
          const query = await axios.get(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${order.pickup_lng},${order.pickup_lat};${order.destination_lng},${order.destination_lat}`,
              {
                  params: {
                      access_token: mapboxgl.accessToken,
                      geometries: 'geojson',
                      overview: 'full'
                  }
              }
          );

          if (query.data.routes && query.data.routes.length > 0) {
              const route = query.data.routes[0];
              const geojson = {
                  type: 'Feature',
                  properties: {},
                  geometry: route.geometry
              };

              if (map.current.getSource('route')) {
                  map.current.getSource('route').setData(geojson);
              } else {
                  // Wait for style to load before adding layer
                  if (map.current.isStyleLoaded()) {
                      addRouteLayer(geojson);
                  } else {
                      map.current.once('style.load', () => addRouteLayer(geojson));
                  }
              }
          }
      } catch (error) {
          console.error("Error fetching route", error);
      }
  };

  const addRouteLayer = (geojson) => {
      if (!map.current.getSource('route')) {
          map.current.addLayer({
              id: 'route',
              type: 'line',
              source: {
                  type: 'geojson',
                  data: geojson
              },
              layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
              },
              paint: {
                  'line-color': '#f97316', // Orange
                  'line-width': 5,
                  'line-opacity': 0.75
              }
          });
      }
  };

  return (
    <div 
        ref={mapContainer} 
        className="w-full h-[500px] rounded-lg shadow-md"
    />
  );
};

export default OrderMap;
