
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ addressCoordinates ,address}) => {
    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const positionCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCurrentPosition(positionCoords);
            }, (error) => {
                console.error("Error getting location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    // קומפוננטה לעדכון מרכז המפה
    const MapUpdater = ({ addressCoordinates }) => {
        const map = useMap();

        useEffect(() => {
            if (addressCoordinates) {
                map.setView([addressCoordinates.lat, addressCoordinates.lng], 13);
            } else if (currentPosition) {
                map.setView([currentPosition.lat, currentPosition.lng], 13);
            }
        }, [addressCoordinates, currentPosition, map]);

        return null;
    };

    // אם אין קואורדינטות, אל תציג את המפה
    if (!addressCoordinates && !currentPosition) return null; 

    return (
        <MapContainer center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [0, 0]} zoom={13} style={{ height: "400px", width: "80%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater addressCoordinates={addressCoordinates} />
            {addressCoordinates && (
                <Marker position={[addressCoordinates.lat, addressCoordinates.lng]}>
                    <Popup>
                        מיקום: {addressCoordinates.lat}, {addressCoordinates.lng}
                        כתובת :{address}{}
                    </Popup>
                </Marker>
            )}
            {currentPosition && (
                <Marker position={[currentPosition.lat, currentPosition.lng]}>
                    <Popup>
                        מיקום נוכחי: {currentPosition.lat}, {currentPosition.lng}
                        כתובת :{address}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

export default Map;
