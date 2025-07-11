import { type ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { GoogleMapsContext } from '../context/GoogleMapsContext';

export const GoogleMapsProvider = ({ children }: { children: ReactNode }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        libraries: ['places'],
    });

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, google: isLoaded ? window.google : undefined }}>
        {children}
        </GoogleMapsContext.Provider>
    );
}; 