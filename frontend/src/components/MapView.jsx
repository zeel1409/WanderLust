import { useEffect, useRef, useState } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ coordinates, listings = [], zoom = 12 }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapError, setMapError] = useState(false);

    useEffect(() => {
        if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.your_mapbox_public_token_here') {
            setMapError(true);
            return;
        }

        let mapboxgl;
        const initMap = async () => {
            try {
                mapboxgl = await import('mapbox-gl');
                await import('mapbox-gl/dist/mapbox-gl.css');
                mapboxgl = mapboxgl.default;
                mapboxgl.accessToken = MAPBOX_TOKEN;

                if (!mapContainer.current || map.current) return;

                const center = coordinates?.coordinates
                    ? [coordinates.coordinates[0], coordinates.coordinates[1]]
                    : listings.length > 0 && listings[0].location?.coordinates?.coordinates
                        ? [listings[0].location.coordinates.coordinates[0], listings[0].location.coordinates.coordinates[1]]
                        : [0, 20];

                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/light-v11',
                    center,
                    zoom: coordinates ? zoom : 2,
                });

                map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

                // Single marker
                if (coordinates?.coordinates) {
                    const popup = new mapboxgl.Popup({ offset: 25 }).setText('Property location');
                    new mapboxgl.Marker({ color: '#FF385C' })
                        .setLngLat([coordinates.coordinates[0], coordinates.coordinates[1]])
                        .setPopup(popup)
                        .addTo(map.current);
                }

                // Multiple listing markers
                listings.forEach((listing) => {
                    if (!listing.location?.coordinates?.coordinates) return;
                    const [lng, lat] = listing.location.coordinates.coordinates;
                    if (lng === 0 && lat === 0) return;

                    const el = document.createElement('div');
                    el.className = 'mapbox-marker';
                    el.textContent = `$${listing.price}`;
                    el.style.cssText = `
            background: #FF385C; color: white; border-radius: 20px;
            padding: 4px 10px; font-size: 12px; font-weight: 700;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: pointer;
            font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap;
          `;

                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px">
              <strong style="font-size:13px">${listing.title}</strong>
              <p style="margin:2px 0;color:#666;font-size:12px">${listing.location.city}, ${listing.location.country}</p>
              <strong style="color:#FF385C">$${listing.price}/night</strong>
            </div>`
                    );

                    new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map.current);
                });
            } catch (err) {
                console.error('Mapbox error:', err);
                setMapError(true);
            }
        };

        initMap();
        return () => { if (map.current) { map.current.remove(); map.current = null; } };
    }, []);

    if (mapError) {
        return (
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-6">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-gray-600 font-medium text-sm">Map unavailable</p>
                <p className="text-gray-400 text-xs mt-1">Add your Mapbox token to <code>.env</code></p>
            </div>
        );
    }

    return <div ref={mapContainer} className="w-full h-full rounded-2xl" />;
};

export default MapView;
