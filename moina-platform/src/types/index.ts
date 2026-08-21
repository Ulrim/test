// ── 배양조 ─────────────────────────────────────
export type TankStatus = 'normal' | 'caution' | 'warning';

export interface CultivationTank {
  id: string;
  name: string;
  volume: number;       // ℓ
  density: number;      // 마리/ℓ
  targetDensity: number;
  daysSinceInoculation: number;
  status: TankStatus;
  water: {
    temperature: number;
    pH: number;
    dissolvedOxygen: number;
    ammonia: number;
    turbidity: number;
  };
  lastUpdated: string;
}

// ── 생산 배치 ──────────────────────────────────
export type BatchStatus = 'ongoing' | 'completed' | 'failed';

export interface ProductionBatch {
  id: string;
  batchNo: string;
  product: string;
  startDate: string;
  endDate?: string;
  status: BatchStatus;
  targetKg: number;
  actualKg?: number;
  dha?: number;
  epa?: number;
  protein?: number;
  heavyMetal?: 'pass' | 'fail' | 'pending';
  pathogen?: 'pass' | 'fail' | 'pending';
  manager: string;
}

// ── 수출 ───────────────────────────────────────
export type ExportStatus = 'contract' | 'shipping' | 'delivered' | 'negotiating';
export type Country = 'VN' | 'CN' | 'TH' | 'PH' | 'JP' | 'KR';

export interface ExportRecord {
  id: string;
  buyer: string;
  country: Country;
  product: string;
  quantityKg: number;
  pricePerKg: number;
  totalUsd: number;
  status: ExportStatus;
  contractDate: string;
  deliveryDate?: string;
  incoterms: 'FOB' | 'CIF' | 'EXW';
}

export interface Buyer {
  id: string;
  name: string;
  country: Country;
  type: 'hatchery' | 'feed_manufacturer' | 'farm' | 'distributor';
  status: 'active' | 'negotiating' | 'prospect';
  lastContact: string;
  totalUsd: number;
}

// ── KPI ────────────────────────────────────────
export interface KpiTarget {
  label: string;
  unit: string;
  target2026: number;
  target2027: number;
  actual: number;
  year: 2026 | 2027;
}

// ── 알림 ───────────────────────────────────────
export interface Alert {
  id: string;
  tankId?: string;
  type: 'water' | 'production' | 'export' | 'system';
  severity: 'info' | 'caution' | 'warning';
  message: string;
  createdAt: string;
  read: boolean;
}
