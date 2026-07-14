import { NextResponse } from "next/server";

type AddressRequest = {
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GoogleGeocodeResult = {
  address_components: GoogleAddressComponent[];
};

type GoogleGeocodeResponse = {
  status: string;
  results: GoogleGeocodeResult[];
  error_message?: string;
};

type ZipLookupResponse = {
  places?: Array<{
    "place name": string;
    "state abbreviation": string;
  }>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AddressRequest | null;
  const streetAddress = body?.streetAddress?.trim() ?? "";
  const city = body?.city?.trim() ?? "";
  const state = body?.state?.trim().toUpperCase() ?? "";
  const zipCode = body?.zipCode?.trim() ?? "";

  if (!streetAddress || !city || !state || !zipCode) {
    return NextResponse.json(
      { valid: false, message: "City, state, street address, and ZIP code are required." },
      { status: 400 },
    );
  }

  if (!/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { valid: false, message: "ZIP code must be a valid 5-digit ZIP code." },
      { status: 400 },
    );
  }

  if (!hasStreetNumberAndName(streetAddress)) {
    return NextResponse.json(
      { valid: false, message: "Street address must include a street number and street name." },
      { status: 400 },
    );
  }

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (googleApiKey) {
    return validateWithGoogle({ streetAddress, city, state, zipCode }, googleApiKey);
  }

  return validateWithZipLookup({ streetAddress, city, state, zipCode });
}

async function validateWithGoogle(address: Required<AddressRequest>, googleApiKey: string) {
  const query = encodeURIComponent(`${address.streetAddress}, ${address.city}, ${address.state} ${address.zipCode}`);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&components=country:US&key=${googleApiKey}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return NextResponse.json(
      { valid: false, message: "Unable to validate the address right now. Try again." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as GoogleGeocodeResponse;
  const result = data.results[0];

  if (data.status !== "OK" || !result) {
    return NextResponse.json(
      { valid: false, message: "City, state, ZIP code, and street address do not match a valid address." },
      { status: 400 },
    );
  }

  const matchedCity = getComponent(result, "locality") ?? getComponent(result, "postal_town");
  const matchedState = getComponent(result, "administrative_area_level_1", "short_name");
  const matchedZip = getComponent(result, "postal_code");
  const hasStreet = Boolean(getComponent(result, "street_number") && getComponent(result, "route"));

  if (
    !hasStreet ||
    !isSameText(matchedCity, address.city) ||
    matchedState?.toUpperCase() !== address.state ||
    matchedZip !== address.zipCode
  ) {
    return NextResponse.json(
      { valid: false, message: "City, state, ZIP code, and street address do not match." },
      { status: 400 },
    );
  }

  return NextResponse.json({ valid: true });
}

async function validateWithZipLookup(address: Required<AddressRequest>) {
  const response = await fetch(`https://api.zippopotam.us/us/${address.zipCode}`, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json(
      { valid: false, message: "ZIP code does not match the selected city and state." },
      { status: 400 },
    );
  }

  const data = (await response.json()) as ZipLookupResponse;
  const matchingPlace = data.places?.some(
    (place) =>
      isSameText(place["place name"], address.city) &&
      place["state abbreviation"].toUpperCase() === address.state,
  );

  if (!matchingPlace) {
    return NextResponse.json(
      { valid: false, message: "City, state, and ZIP code do not match." },
      { status: 400 },
    );
  }

  return NextResponse.json({ valid: true });
}

function getComponent(result: GoogleGeocodeResult, type: string, key: "long_name" | "short_name" = "long_name") {
  return result.address_components.find((component) => component.types.includes(type))?.[key];
}

function hasStreetNumberAndName(streetAddress: string) {
  return /\d/.test(streetAddress) && /[a-zA-Z]/.test(streetAddress);
}

function isSameText(left?: string, right?: string) {
  return normalizeText(left) === normalizeText(right);
}

function normalizeText(value?: string) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}
