import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  RotateCw,
  Info,
} from 'lucide-react';
import { calculateQibla } from '../../services/islamic/qiblaService';
import { LOCATION_PRESETS, DEFAULT_LOCATION } from '../../services/islamic/locationPresets';

export const QiblaCompassView: React.FC = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(DEFAULT_LOCATION.id);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassPermissionStatus, setCompassPermissionStatus] = useState<
    'idle' | 'granted' | 'denied' | 'unsupported'
  >('idle');

  const location = useMemo(() => {
    return (
      LOCATION_PRESETS.find((l) => l.id === selectedLocationId) || DEFAULT_LOCATION
    );
  }, [selectedLocationId]);

  const qiblaResult = useMemo(() => {
    return calculateQibla(location.latitude, location.longitude);
  }, [location]);

  // Request permission and listen to DeviceOrientation events (Mobile Safari / Chrome)
  const requestCompassPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await (window as any).DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setCompassPermissionStatus('granted');
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setCompassPermissionStatus('denied');
        }
      } catch (err) {
        console.error('Compass permission error:', err);
        setCompassPermissionStatus('denied');
      }
    } else if (typeof window !== 'undefined' && 'ondeviceorientationabsolute' in (window as any)) {
      setCompassPermissionStatus('granted');
      window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
    } else if (typeof window !== 'undefined' && 'ondeviceorientation' in (window as any)) {
      setCompassPermissionStatus('granted');
      window.addEventListener('deviceorientation', handleOrientation as any, true);
    } else {
      setCompassPermissionStatus('unsupported');
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading = (event as any).webkitCompassHeading;
    if (heading === undefined && event.alpha !== null) {
      // Android standard: alpha is counter-clockwise, invert to clockwise
      heading = (360 - event.alpha) % 360;
    }
    if (heading !== undefined && heading !== null && !isNaN(heading)) {
      setDeviceHeading(Math.round(heading));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    }
  }, []);

  // Compute pointer angle:
  // If physical device heading is available, rotate needle relative to phone's current direction.
  // Otherwise, needle points relative to fixed true North.
  const needleRotation =
    deviceHeading !== null
      ? (qiblaResult.bearingDegrees - deviceHeading + 360) % 360
      : qiblaResult.bearingDegrees;

  return (
    <div className="space-y-6" data-testid="qibla-compass-view">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Qibla Direction (اتجاه القبلة)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
            Qibla from {location.name}, <span className="text-gold-400">{location.country}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Bearing towards the Holy Kaaba in Makkah al-Mukarramah (21.4225° N, 39.8262° E)
          </p>
        </div>

        {/* Bearing Badge */}
        <div className="px-5 py-3 rounded-2xl bg-gold-500/10 border border-gold-500/40 text-center shadow-gold-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            True Qibla Bearing
          </div>
          <div
            data-testid="qibla-bearing-display"
            className="text-2xl font-mono font-bold text-gold-300"
          >
            {qiblaResult.bearingDegrees}° {qiblaResult.directionCompass}
          </div>
          <div className="text-[10px] text-slate-400 font-mono" data-testid="qibla-distance-display">
            {qiblaResult.distanceKm.toLocaleString()} km to Makkah
          </div>
        </div>
      </div>

      {/* Main Compass Rose Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Compass Dial */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-xl relative overflow-hidden">
          <div className="text-xs font-serif font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gold-400" />
            <span>
              {deviceHeading !== null
                ? `Active Device Heading: ${deviceHeading}° (Calibrated)`
                : 'True North Relative Compass (Laptop / Desktop Mode)'}
            </span>
          </div>

          {/* Compass Dial Outer Ring */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-navy-800 bg-gradient-to-b from-navy-950 to-navy-900 shadow-2xl flex items-center justify-center">
            {/* Degree Markings */}
            <div className="absolute inset-2 rounded-full border border-gold-500/20" />
            <div className="absolute inset-4 rounded-full border border-dashed border-gold-500/10" />

            {/* Cardinal Letters */}
            <span className="absolute top-2 font-bold font-mono text-sm text-gold-400">N</span>
            <span className="absolute right-3 font-bold font-mono text-xs text-slate-400">E</span>
            <span className="absolute bottom-2 font-bold font-mono text-xs text-slate-400">S</span>
            <span className="absolute left-3 font-bold font-mono text-xs text-slate-400">W</span>

            {/* Center Dial Hub */}
            <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center z-20 shadow-gold-sm">
              <div className="w-4 h-4 rounded-full bg-gold-400" />
            </div>

            {/* Qibla Needle Pointer */}
            <div
              data-testid="qibla-compass-needle"
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out z-10"
              style={{
                transform: `rotate(${needleRotation}deg)`,
              }}
            >
              {/* Gold Kaaba Arrow */}
              <div className="relative flex flex-col items-center h-full justify-between py-6">
                <div className="flex flex-col items-center -mt-2">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-gold-400 filter drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />
                  <span className="text-[10px] font-bold text-navy-950 bg-gold-400 px-1.5 py-0.2 rounded font-mono mt-1 shadow-sm">
                    QIBLA
                  </span>
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[14px] border-t-slate-600 mb-1" />
              </div>
            </div>
          </div>

          {/* Compass Sensor Control Button for Mobile */}
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={requestCompassPermission}
              data-testid="calibrate-compass-btn"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold shadow-gold-sm hover:bg-gold-400 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Enable Device Compass Sensor</span>
            </button>
            <span className="text-[11px] text-slate-400">
              {compassPermissionStatus === 'granted'
                ? '✅ Sensor Active'
                : compassPermissionStatus === 'denied'
                ? '⚠️ Permission Denied'
                : 'Tap to calibrate on smartphone'}
            </span>
          </div>
        </div>

        {/* Right: Technical Explanation & City Selector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Location Selector Card */}
          <div className="p-5 rounded-2xl bg-navy-900 border border-gold-500/30 space-y-3">
            <div className="text-xs font-serif font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Change Reference Location</span>
            </div>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              data-testid="qibla-city-select"
              className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
            >
              {LOCATION_PRESETS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.country}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="font-mono text-slate-200">{location.latitude}° N</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="font-mono text-slate-200">{location.longitude}° E</span>
              </div>
              <div className="flex justify-between">
                <span>Qibla Angle:</span>
                <span className="font-mono font-bold text-gold-400">
                  {qiblaResult.bearingDegrees}° clockwise from North
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Compass Limitation Notice */}
          <div
            data-testid="qibla-hardware-disclaimer"
            className="p-4 rounded-2xl bg-navy-900/90 border border-gold-500/20 text-xs space-y-2 text-slate-300"
          >
            <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gold-400" />
              <span>Hardware Compass Sensor Guidance</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Laptops, desktop computers, and some tablets lack built-in magnetometer (hardware compass) sensors. In desktop mode, the dial displays the <strong>true North-relative bearing ({qiblaResult.bearingDegrees}°)</strong>. To align physically, face true North and turn {qiblaResult.bearingDegrees}° clockwise.
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              On smartphones (iPhone / Android), tap <em>Enable Device Compass Sensor</em> and allow orientation permissions to orient the needle in real-time as you physically rotate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
