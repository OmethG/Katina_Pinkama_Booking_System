import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
function SearchControl({ setLocation }) {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;

        map.setView(latlng, 17);

        setLocation({
          lat: latlng.lat,
          lng: latlng.lng,
        });
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map, setLocation]);

  return null;
}
function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  if (!location.lat) return null;

  return (
    <Marker
      position={[location.lat, location.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target.getLatLng();

          setLocation({
            lat: marker.lat,
            lng: marker.lng,
          });
        },
      }}
    />
  );
}
export default function LocationPicker({ location, setLocation }) {
  return (
    <div className="space-y-3">
      <label className="block font-medium">
        Select Your Location
      </label>

      <MapContainer
        center={[25.2048, 55.2708]}
        zoom={11}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
        attribution='&copy; OpenStreetMap contributors & CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <SearchControl setLocation={setLocation} />

        <LocationMarker
          location={location}
          setLocation={setLocation}
        />
      </MapContainer>

      {location.lat && (
        <div className="rounded-lg bg-gray-100 p-3 text-sm">
          <strong>Selected Coordinates</strong>

          <br />

          Latitude: {location.lat.toFixed(6)}

          <br />

          Longitude: {location.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}