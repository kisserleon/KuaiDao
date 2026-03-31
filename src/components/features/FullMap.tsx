"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { restaurants, groceryStores } from "@/data/mock";
import { Link } from "@/i18n/navigation";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const allMarkers = [
  ...restaurants.map((r) => ({
    id: r.id,
    name: `${r.nameZh} ${r.name}`,
    lat: r.coordinates.lat,
    lng: r.coordinates.lng,
    type: "restaurant" as const,
    href: `/restaurants/${r.id}`,
  })),
  ...groceryStores.map((g) => ({
    id: `g-${g.id}`,
    name: `${g.nameZh} ${g.name}`,
    lat: g.coordinates.lat,
    lng: g.coordinates.lng,
    type: "grocery" as const,
    href: `/groceries/${g.id}`,
  })),
];

// Center on Seattle/Bellevue area
const center: [number, number] = [47.62, -122.20];

export default function FullMap() {
  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {allMarkers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {m.type === "restaurant" ? "🍜 餐厅" : "🛒 超市"}
              </div>
              <Link href={m.href} className="text-xs text-red-600 hover:underline mt-1 block">
                查看详情 →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
