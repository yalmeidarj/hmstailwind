export type House = {
  id: number;
  streetNumber: string;
  lastName: string | null;
  name: string | null;
  notes: string | null;
  phoneOrEmail: string | null;
  type: string | null;
  consent: string | null;
  streetId: number;
  locationId: number;
  lastUpdated: string;
  lastUpdatedBy: string | null;
  statusAttempt: string;
};

export async function fetchHouses(): Promise<House[]> {
  const response = await fetch("https://hmsapi.herokuapp.com/houses");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}
