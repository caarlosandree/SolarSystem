import { NASA_API_KEY } from '@/utils/constants';

export interface AsteroidOrbitalElements {
  a: number;
  e: number;
  i: number;
  om: number;
  w: number;
  ma: number;
}

export interface NEOObject {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface SentryObject {
  des: string;
  [key: string]: unknown;
}

export interface CometObject {
  des: string;
  [key: string]: unknown;
}

export async function fetchAsteroidOrbitalElements(
  designation: string
): Promise<AsteroidOrbitalElements | null> {
  const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${designation}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.orb) {
      const orb = data.orb;
      return {
        a: parseFloat(orb.a),
        e: parseFloat(orb.e),
        i: parseFloat(orb.i),
        om: parseFloat(orb.om),
        w: parseFloat(orb.w),
        ma: parseFloat(orb.ma),
      };
    }
  } catch (err) {
    console.error('Erro na API de Asteroides:', err);
  }
  return null;
}

export async function fetchNEOs(): Promise<NEOObject[]> {
  const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${NASA_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.near_earth_objects || [];
  } catch (err) {
    console.error('Erro na API de NEO:', err);
    return [];
  }
}

export async function fetchSentryObjects(): Promise<SentryObject[]> {
  const url = 'https://ssd-api.jpl.nasa.gov/sentry.api';
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error('Erro na API Sentry:', err);
    return [];
  }
}

export async function fetchComets(): Promise<CometObject[]> {
  // Use 'kind=c' parameter to filter for comets in the CAD API
  // The 'body' parameter is for target bodies (planets), not object types
  const url = 'https://ssd-api.jpl.nasa.gov/cad.api?kind=c';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Erro na API de Cometas: HTTP', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error('Erro na API de Cometas:', err);
    return [];
  }
}

export interface FamousAsteroidData {
  name: string;
  orb: AsteroidOrbitalElements | null;
}

export async function fetchFamousAsteroids(): Promise<FamousAsteroidData[]> {
  const famousAsteroids = [
    'Apophis', 'Bennu', 'Ryugu', 'Didymos', 'Dimorphos', 'Itokawa', 'Psyche', 'Vesta',
    'Ceres', 'Pallas', 'Hygiea', 'Eros', 'Gaspra', 'Ida', 'Mathilde', 'Steins',
    'Lutetia', 'Dinkinesh', 'Toutatis', 'Florence', 'Icarus', 'Geographos', 'Castalia',
    'Toro', 'Amor', 'Apollo', 'Anteros', 'Ganymed', 'Ivar', 'Daphne', 'Europa',
    'Davida', 'Interamnia', 'Hebe', 'Iris', 'Flora', 'Metis', 'Parthenope', 'Eunomia',
    'Juno', 'Astraea', 'Thisbe', 'Cybele', 'Herculina', 'Sylvia', 'Patroclus', 'Hektor',
    'Euphrosyne', 'Fortuna', 'Massalia', 'Kleopatra', 'Dactyl', 'Linus', 'Eurybates',
    'Polymele', 'Leucus', 'Orus', 'Donaldjohanson',
  ];

  const asteroidData: FamousAsteroidData[] = [];
  
  for (const asteroid of famousAsteroids) {
    try {
      const orb = await fetchAsteroidOrbitalElements(asteroid);
      if (orb) {
        asteroidData.push({ name: asteroid, orb });
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Erro ao buscar ${asteroid}:`, error);
    }
  }
  
  return asteroidData;
}

