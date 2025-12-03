import type { AsteroidOrbitalElements } from '@/services/nasaApi';

export function keplerToCartesian(orb: AsteroidOrbitalElements): { x: number; y: number; z: number } {
  const DEG2RAD = Math.PI / 180;
  const a = orb.a;
  const e = orb.e;
  const i = orb.i * DEG2RAD;
  const om = orb.om * DEG2RAD;
  const w = orb.w * DEG2RAD;
  let M = orb.ma * DEG2RAD;

  let E = M;
  for (let j = 0; j < 10; j++) {
    E = M + e * Math.sin(E);
  }
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );
  const r = a * (1 - e * Math.cos(E));
  const x_orb = r * Math.cos(nu);
  const y_orb = r * Math.sin(nu);
  const x = x_orb * (Math.cos(w) * Math.cos(om) - Math.sin(w) * Math.sin(om) * Math.cos(i)) -
        y_orb * (Math.sin(w) * Math.cos(om) + Math.cos(w) * Math.sin(om) * Math.cos(i));
  const y = x_orb * (Math.cos(w) * Math.sin(om) + Math.sin(w) * Math.cos(om) * Math.cos(i)) +
        y_orb * (Math.cos(w) * Math.cos(om) * Math.cos(i) - Math.sin(w) * Math.sin(om));
  const z = x_orb * Math.sin(w) * Math.sin(i) + y_orb * Math.cos(w) * Math.sin(i);
  return { x, y, z };
}

