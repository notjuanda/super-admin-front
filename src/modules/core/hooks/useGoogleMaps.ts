import { useContext } from 'react';
import { GoogleMapsContext } from '../context/GoogleMapsContext';

export const useGoogleMaps = () => useContext(GoogleMapsContext); 