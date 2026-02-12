/**
 * Zone Type Definitions
 * Hierarchical zonal system: Zone > District > Assembly Constituency
 * Supports multi-language translations via translations map
 */

export type TnZoneName = 'North' | 'South' | 'East' | 'West' | 'Central';

export interface ZoneTranslation {
  assemblyConstituency: string;
  district: string;
  zone: string;
}

export interface ZonalInfo {
  acNo: number;
  assemblyConstituency: string;
  district: string;
  zone: TnZoneName;
  translations?: Record<string, ZoneTranslation>;
}

export interface ZoneEntry {
  acNo: number;
  assemblyConstituency: string;
  district: string;
  zone: TnZoneName;
  translations?: Record<string, ZoneTranslation>;
}

export interface AssemblyConstituencyEntry {
  acNo: number;
  name: string;
  translations?: Record<string, string>;
}

export interface DistrictEntry {
  name: string;
  translations?: Record<string, string>;
  acs: AssemblyConstituencyEntry[];
}

export interface ZoneHierarchyEntry {
  zone: TnZoneName;
  translations?: Record<string, string>;
  districts: DistrictEntry[];
}

export type ZoneHierarchy = ZoneHierarchyEntry[];

export function formatZonalDisplay(info: ZonalInfo | null | undefined): string {
  if (!info) return 'Not Assigned';
  return `${info.assemblyConstituency}, ${info.district} (${info.zone})`;
}
