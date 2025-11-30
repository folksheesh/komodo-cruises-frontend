 const BASE_URL = "https://script.google.com/macros/s/AKfycbwvfIHPdbGq7cVlbX6g1IPoBdE2xIqYD9fZJclMlq9AYAFGa--e3eGV15HbYfrj2z4vLw/exec";

// Types
export type CabinItem =
  | string
  | {
      name: string;
      available?: number;
      id?: string;
      shipname?: string;
      /** Some sheets use "cabin name" as a key */
      [key: string]: any;
    };
export type CabinOperator = { operator: string; cabins: CabinItem[] };
export type CabinsResponse = { ok: true; resource: 'cabins'; operators: CabinOperator[]; allCabins: string[] };
export type AvailabilityOperator = { operator: string; total: number; cabins: CabinItem[] };
export type AvailabilityResponse = { ok: true; date: string; total: number; operators: AvailabilityOperator[] };
export type OperatorItem = { operator: string; sourceSheet: string };
export type OperatorsResponse = { ok: true; resource: 'operators'; total: number; operators: OperatorItem[] };

// Utility functions
function buildUrl(params: Record<string, string | undefined>): string {
  const url = new URL(BASE_URL);
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  }
  
  url.search = searchParams.toString();
  return url.toString();
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data?.ok === false) {
    throw new Error(data.error || 'API error');
  }
  
  return data as T;
}

// In-memory cache for getCabins
const cabinsCache = new Map<string, CabinsResponse>();
// In-memory cache and in-flight map for getAvailability
const availabilityCache = new Map<string, AvailabilityResponse>();
const availabilityInflight = new Map<string, Promise<AvailabilityResponse>>();
// In-memory cache for operators
let operatorsCache: OperatorsResponse | null = null;

// API functions
export async function getOperators(): Promise<OperatorsResponse> {
  if (operatorsCache) return operatorsCache;

  const url = buildUrl({ resource: 'operators' });
  const response = await fetch(url);
  const data = await handleResponse<OperatorsResponse>(response);
  operatorsCache = data;
  return data;
}

export async function getCabins(sheet?: string): Promise<CabinsResponse> {
  const cacheKey = `cabins|${sheet || ''}`;
  
  if (cabinsCache.has(cacheKey)) {
    return cabinsCache.get(cacheKey)!;
  }
  
  const url = buildUrl({ resource: 'cabins', sheet });
  const response = await fetch(url);
  const data = await handleResponse<CabinsResponse>(response);
  
  cabinsCache.set(cacheKey, data);
  return data;
}

export async function getAvailability(date: string, sheet?: string): Promise<AvailabilityResponse> {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }

  const cacheKey = `${date}|${sheet || ''}`;
  if (availabilityCache.has(cacheKey)) {
    return availabilityCache.get(cacheKey)!;
  }
  if (availabilityInflight.has(cacheKey)) {
    return availabilityInflight.get(cacheKey)!;
  }

  const url = buildUrl({ resource: 'availability', date, sheet });
  const promise = fetch(url)
    .then(resp => handleResponse<AvailabilityResponse>(resp))
    .then(data => {
      availabilityCache.set(cacheKey, data);
      availabilityInflight.delete(cacheKey);
      return data;
    })
    .catch(err => {
      availabilityInflight.delete(cacheKey);
      throw err;
    });
  availabilityInflight.set(cacheKey, promise);
  return promise;
}

// Helper function for Results page (optional)
export async function getAvailabilityRange(params: {
  from: string;
  to: string;
  region: string;
  cabins: string[];
}) {
  const { from, to, region, cabins } = params;
  
  // Generate date range
  const startDate = new Date(from);
  const endDate = new Date(to);
  const dates: string[] = [];
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  const sheet = `${region} (Normalized)`;
  const perDate: Array<{ date: string; total: number; cabins: string[] }> = [];
  let totalSum = 0;
  
  for (const date of dates) {
    try {
      const availability = await getAvailability(date, sheet);

      // Normalize cabin items to base name strings for filtering
      const cabinBaseNames: string[] = (availability.operators[0]?.cabins || []).map((c: CabinItem) => {
        if (typeof c === 'string') {
          return c.split(' (')[0];
        }
        const raw = (c.name || c['cabin name'] || '').toString();
        return raw.split(' (')[0];
      });

      // Filter cabins to only include those in our selection
      const filteredCabins = cabinBaseNames.filter((baseName) => cabins.includes(baseName));
      
      const dayTotal = filteredCabins.length;
      totalSum += dayTotal;
      
      perDate.push({
        date,
        total: dayTotal,
        cabins: filteredCabins
      });
    } catch (error) {
      console.warn(`Failed to get availability for ${date}:`, error);
      perDate.push({
        date,
        total: 0,
        cabins: []
      });
    }
  }
  
  return {
    dateRange: { from, to },
    operator: region,
    totals: totalSum,
    perDate
  };
}

// Example usage (for testing):
// const cabins = await getCabins();
// console.log(cabins.operators.map(o => o.operator));
// const availability = await getAvailability('2025-10-12');
// console.log(availability.total, availability.operators);
