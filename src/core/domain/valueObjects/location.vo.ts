/**
 * Represents a geographical location.
 */
export interface Location {
  latitude: number;
  longitude: number;
  address?: string; // Optional address string
  // Consider adding timestamp if it represents a specific reading
  // timestamp?: Date;
}
