export const TIMEZONES = [
  // Americas
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Denver", label: "Denver (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "America/Toronto", label: "Toronto (ET)" },
  { value: "America/Vancouver", label: "Vancouver (PT)" },
  { value: "America/Mexico_City", label: "Mexico City (CST)" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
  { value: "America/Buenos_Aires", label: "Buenos Aires (ART)" },

  // Europe
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
  { value: "Europe/Brussels", label: "Brussels (CET)" },
  { value: "Europe/Madrid", label: "Madrid (CET)" },
  { value: "Europe/Rome", label: "Rome (CET)" },
  { value: "Europe/Zurich", label: "Zurich (CET)" },
  { value: "Europe/Stockholm", label: "Stockholm (CET)" },
  { value: "Europe/Moscow", label: "Moscow (MSK)" },

  // Asia
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai (IST)" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Seoul", label: "Seoul (KST)" },

  // Oceania
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Australia/Melbourne", label: "Melbourne (AEST)" },
  { value: "Australia/Perth", label: "Perth (AWST)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)" },

  // Africa
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
  { value: "Africa/Cairo", label: "Cairo (EET)" },
  { value: "Africa/Lagos", label: "Lagos (WAT)" },
] as const;

export type TimezoneValue = (typeof TIMEZONES)[number]["value"];

export const getTimezoneLabel = (value: string): string => {
  return TIMEZONES.find((tz) => tz.value === value)?.label || value;
};

export const getTimezonesByRegion = () => {
  return {
    Americas: TIMEZONES.filter((tz) => tz.value.startsWith("America/")),
    Europe: TIMEZONES.filter((tz) => tz.value.startsWith("Europe/")),
    Asia: TIMEZONES.filter((tz) => tz.value.startsWith("Asia/")),
    Oceania: TIMEZONES.filter(
      (tz) =>
        tz.value.startsWith("Australia/") || tz.value.startsWith("Pacific/")
    ),
    Africa: TIMEZONES.filter((tz) => tz.value.startsWith("Africa/")),
  };
};
