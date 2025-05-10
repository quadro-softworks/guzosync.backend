declare module '@mapbox/mapbox-sdk/services/directions' {
  export default function(options: { accessToken: string }): any;
}

declare module '@mapbox/mapbox-sdk/services/geocoding' {
  export default function(options: { accessToken: string }): any;
}

declare module '@turf/turf' {
  export function point(coordinates: number[]): any;
  export function distance(from: any, to: any): number;
  export function nearestPointOnLine(line: any, point: any): any;
}
