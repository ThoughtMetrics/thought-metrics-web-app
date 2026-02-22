import ApiService from './api.service';
import type { ApiResponse } from './api.service';
import type { ZoneHierarchy, ZoneEntry } from '@/core/types/zone.type';
import authService from './auth.service';

let cachedHierarchy: ZoneHierarchy | null = null;
let cachedFlat: ZoneEntry[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

class ZoneService {
  private async ensureAuth() {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    ApiService.setAuthToken(token);
  }

  async getHierarchy(): Promise<ZoneHierarchy> {
    if (cachedHierarchy && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedHierarchy;
    }

    await this.ensureAuth();
    const response = await ApiService.get<any>('/zones');
    if (response.success && response.data) {
      // Backend returns { zones: [...] } with field name "name" for zone
      // Map to frontend ZoneHierarchy format
      const raw = response.data.zones || response.data;
      const zones = Array.isArray(raw) ? raw : [];
      const hierarchy: ZoneHierarchy = zones.map((z: any) => ({
        zone: z.name || z.zone,
        translations: z.translations,
        districts: (z.districts || []).map((d: any) => ({
          name: d.name,
          translations: d.translations,
          acs: (d.assemblyConstituencies || d.acs || []).map((ac: any) => ({
            acNo: ac.acNo,
            name: ac.name,
            translations: ac.translations,
          })),
        })),
      }));
      cachedHierarchy = hierarchy;
      cacheTimestamp = Date.now();
      return hierarchy;
    }
    return [];
  }

  async getFlatList(): Promise<ZoneEntry[]> {
    if (cachedFlat && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedFlat;
    }

    await this.ensureAuth();
    const response = await ApiService.get<ZoneEntry[]>('/zones/flat');
    if (response.success && response.data) {
      cachedFlat = response.data;
      cacheTimestamp = Date.now();
      return response.data;
    }
    return [];
  }

  async getByAcNo(acNo: number): Promise<ZoneEntry | null> {
    await this.ensureAuth();
    const response = await ApiService.get<ZoneEntry>(`/zones/${acNo}`);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  }

  async getLocalBodies(acNo: number): Promise<Array<{ name: string; translations?: Record<string, string> }>> {
    await this.ensureAuth();
    const response = await ApiService.get<any>(`/zones/${acNo}/local-bodies`);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

  async getVillages(acNo: number, localBodyName: string): Promise<Array<{ name: string; translations?: Record<string, string> }>> {
    await this.ensureAuth();
    const encodedName = encodeURIComponent(localBodyName);
    const response = await ApiService.get<any>(`/zones/${acNo}/local-bodies/${encodedName}/villages`);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

  clearCache() {
    cachedHierarchy = null;
    cachedFlat = null;
    cacheTimestamp = 0;
  }
}

export default new ZoneService();
