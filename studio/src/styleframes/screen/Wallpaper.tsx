import React from 'react';
import {LineScreen, gv} from './LineScreen';

/** Desktop wallpaper: THE ORB rising over a horizon, screened like the video feeds (static; drawn once). */
export const Wallpaper: React.FC<{w?: number; h?: number}> = ({w = 1920, h = 1080}) => (
  <LineScreen
    width={w}
    height={h}
    dpr={typeof window !== 'undefined' ? Math.min(1.25, (window.devicePixelRatio || 1) * 1.2) : 1}
    staticKey="wall-v1"
    pitch={7}
    soften={2}
    floor={0.02}
    hiAt={0.72}
    bg="#04060A"
    ink="#12303B"
    hi="#3C8C9E"
    paint={(c) => {
      const sky = c.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, gv(0.05));
      sky.addColorStop(0.7, gv(0.12));
      sky.addColorStop(1, gv(0.02));
      c.fillStyle = sky;
      c.fillRect(0, 0, w, h);
      // the orb
      const ox = w * 0.74;
      const oy = h * 0.86;
      const R = h * 0.44;
      const body = c.createRadialGradient(ox + R * 0.35, oy - R * 0.45, R * 0.05, ox, oy, R);
      body.addColorStop(0, gv(0.62));
      body.addColorStop(0.55, gv(0.24));
      body.addColorStop(1, gv(0.08));
      c.fillStyle = body;
      c.beginPath();
      c.arc(ox, oy, R, 0, Math.PI * 2);
      c.fill();
      // rim light
      c.strokeStyle = gv(0.9);
      c.lineWidth = 5;
      c.beginPath();
      c.arc(ox, oy, R - 3, -Math.PI * 0.95, -Math.PI * 0.1);
      c.stroke();
      // horizon
      const hz = h * 0.9;
      c.fillStyle = gv(0.015);
      c.fillRect(0, hz, w, h - hz);
      const glow = c.createLinearGradient(0, hz - 60, 0, hz);
      glow.addColorStop(0, 'rgba(0,0,0,0)');
      glow.addColorStop(1, gv(0.3));
      c.fillStyle = glow;
      c.fillRect(0, hz - 60, w, 60);
    }}
  />
);
