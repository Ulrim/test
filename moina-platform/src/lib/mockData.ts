import { CultivationTank, ProductionBatch, ExportRecord, Buyer, KpiTarget, Alert } from '@/types';

export const mockTanks: CultivationTank[] = [
  { id: 't1', name: 'A-1조', volume: 5000, density: 980, targetDensity: 1000, daysSinceInoculation: 14, status: 'normal', water: { temperature: 24.5, pH: 7.2, dissolvedOxygen: 7.8, ammonia: 0.02, turbidity: 12 }, lastUpdated: '2026-08-21T08:30:00' },
  { id: 't2', name: 'A-2조', volume: 5000, density: 1150, targetDensity: 1000, daysSinceInoculation: 21, status: 'caution', water: { temperature: 26.1, pH: 7.8, dissolvedOxygen: 6.9, ammonia: 0.08, turbidity: 18 }, lastUpdated: '2026-08-21T08:30:00' },
  { id: 't3', name: 'B-1조', volume: 8000, density: 850, targetDensity: 1000, daysSinceInoculation: 7, status: 'normal', water: { temperature: 24.0, pH: 7.1, dissolvedOxygen: 8.1, ammonia: 0.01, turbidity: 10 }, lastUpdated: '2026-08-21T08:30:00' },
  { id: 't4', name: 'B-2조', volume: 8000, density: 420, targetDensity: 1000, daysSinceInoculation: 3, status: 'normal', water: { temperature: 23.8, pH: 7.0, dissolvedOxygen: 8.4, ammonia: 0.01, turbidity: 8 }, lastUpdated: '2026-08-21T08:30:00' },
  { id: 't5', name: 'C-1조', volume: 3000, density: 200, targetDensity: 800, daysSinceInoculation: 28, status: 'warning', water: { temperature: 28.3, pH: 8.2, dissolvedOxygen: 5.8, ammonia: 0.22, turbidity: 35 }, lastUpdated: '2026-08-21T08:30:00' },
  { id: 't6', name: 'C-2조', volume: 3000, density: 760, targetDensity: 800, daysSinceInoculation: 18, status: 'normal', water: { temperature: 24.2, pH: 7.3, dissolvedOxygen: 7.6, ammonia: 0.03, turbidity: 11 }, lastUpdated: '2026-08-21T08:30:00' },
];

export const mockBatches: ProductionBatch[] = [
  { id: 'b1', batchNo: 'MN-2026-047', product: '모이나 건조분말', startDate: '2026-08-01', status: 'ongoing', targetKg: 500, actualKg: 312, dha: 12.4, epa: 8.7, protein: 62.1, heavyMetal: 'pass', pathogen: 'pass', manager: '이생산' },
  { id: 'b2', batchNo: 'MN-2026-046', product: '모이나 생체', startDate: '2026-07-15', endDate: '2026-08-10', status: 'completed', targetKg: 800, actualKg: 823, dha: 11.8, epa: 8.2, protein: 61.5, heavyMetal: 'pass', pathogen: 'pass', manager: '이생산' },
  { id: 'b3', batchNo: 'MN-2026-045', product: '모이나 동결건조', startDate: '2026-07-01', endDate: '2026-07-28', status: 'completed', targetKg: 300, actualKg: 287, dha: 13.1, epa: 9.0, protein: 63.4, heavyMetal: 'pass', pathogen: 'pass', manager: '박품질' },
  { id: 'b4', batchNo: 'MN-2026-044', product: '모이나 건조분말', startDate: '2026-06-10', endDate: '2026-07-05', status: 'completed', targetKg: 600, actualKg: 578, dha: 12.0, epa: 8.5, protein: 61.9, heavyMetal: 'pass', pathogen: 'pass', manager: '이생산' },
  { id: 'b5', batchNo: 'MN-2026-040', product: '모이나 동결건조', startDate: '2026-05-01', endDate: '2026-05-25', status: 'failed', targetKg: 400, actualKg: 98, heavyMetal: 'fail', pathogen: 'pass', manager: '박품질' },
];

export const mockExportRecords: ExportRecord[] = [
  { id: 'e1', buyer: 'Viet Aqua Co., Ltd.', country: 'VN', product: '모이나 건조분말', quantityKg: 2000, pricePerKg: 18.5, totalUsd: 37000, status: 'delivered', contractDate: '2026-06-01', deliveryDate: '2026-07-15', incoterms: 'FOB' },
  { id: 'e2', buyer: 'Thai Hatchery Group', country: 'TH', product: '모이나 동결건조', quantityKg: 500, pricePerKg: 42.0, totalUsd: 21000, status: 'shipping', contractDate: '2026-07-20', incoterms: 'CIF' },
  { id: 'e3', buyer: 'Guangzhou Aquafeed Co.', country: 'CN', product: '모이나 건조분말', quantityKg: 3000, pricePerKg: 16.0, totalUsd: 48000, status: 'contract', contractDate: '2026-08-05', incoterms: 'FOB' },
  { id: 'e4', buyer: 'Manila Shrimp Farm', country: 'PH', product: '모이나 생체', quantityKg: 800, pricePerKg: 25.0, totalUsd: 20000, status: 'negotiating', contractDate: '2026-08-10', incoterms: 'EXW' },
  { id: 'e5', buyer: 'Hanoi Seafood Corp.', country: 'VN', product: '모이나 건조분말', quantityKg: 1500, pricePerKg: 18.0, totalUsd: 27000, status: 'delivered', contractDate: '2026-04-10', deliveryDate: '2026-05-30', incoterms: 'FOB' },
  { id: 'e6', buyer: 'Tokyo Bait Supply', country: 'JP', product: '모이나 동결건조', quantityKg: 200, pricePerKg: 55.0, totalUsd: 11000, status: 'delivered', contractDate: '2026-05-20', deliveryDate: '2026-06-25', incoterms: 'CIF' },
];

export const mockBuyers: Buyer[] = [
  { id: 'by1', name: 'Viet Aqua Co., Ltd.', country: 'VN', type: 'hatchery', status: 'active', lastContact: '2026-08-15', totalUsd: 64000 },
  { id: 'by2', name: 'Hanoi Seafood Corp.', country: 'VN', type: 'farm', status: 'active', lastContact: '2026-08-10', totalUsd: 27000 },
  { id: 'by3', name: 'Guangzhou Aquafeed Co.', country: 'CN', type: 'feed_manufacturer', status: 'active', lastContact: '2026-08-18', totalUsd: 48000 },
  { id: 'by4', name: 'Thai Hatchery Group', country: 'TH', type: 'hatchery', status: 'active', lastContact: '2026-08-12', totalUsd: 21000 },
  { id: 'by5', name: 'Manila Shrimp Farm', country: 'PH', type: 'farm', status: 'negotiating', lastContact: '2026-08-19', totalUsd: 0 },
  { id: 'by6', name: 'Tokyo Bait Supply', country: 'JP', type: 'distributor', status: 'active', lastContact: '2026-07-30', totalUsd: 11000 },
  { id: 'by7', name: 'Seoul Aqua Partners', country: 'KR', type: 'distributor', status: 'prospect', lastContact: '2026-08-01', totalUsd: 0 },
];

export const mockKpiTargets: KpiTarget[] = [
  { label: '수출액', unit: '시 USD', target2026: 200, target2027: 500, actual: 164, year: 2026 },
  { label: '국내 매출', unit: '백만원', target2026: 2200, target2027: 4000, actual: 1420, year: 2026 },
  { label: '모이나 생산량', unit: '톤', target2026: 20, target2027: 50, actual: 13.8, year: 2026 },
  { label: '고용 인원', unit: '명', target2026: 30, target2027: 40, actual: 24, year: 2026 },
  { label: '수출 국가 수', unit: '개국', target2026: 5, target2027: 8, actual: 4, year: 2026 },
  { label: '바이어 계약 수', unit: '개사', target2026: 10, target2027: 20, actual: 6, year: 2026 },
];

export const mockAlerts: Alert[] = [
  { id: 'a1', tankId: 't5', type: 'water', severity: 'warning', message: 'C-1조 수온 28.3°C - 상한 초과 (기준: 26°C)', createdAt: '2026-08-21T07:15:00', read: false },
  { id: 'a2', tankId: 't5', type: 'water', severity: 'warning', message: 'C-1조 암모니아 0.22 mg/L - 기준치 초과', createdAt: '2026-08-21T07:16:00', read: false },
  { id: 'a3', tankId: 't2', type: 'water', severity: 'caution', message: 'A-2조 수온 26.1°C - 주의 수준', createdAt: '2026-08-21T06:50:00', read: false },
  { id: 'a4', type: 'production', severity: 'info', message: '배치 MN-2026-047 목표 달성률 62.4%', createdAt: '2026-08-21T09:00:00', read: true },
  { id: 'a5', type: 'export', severity: 'info', message: 'Thai Hatchery Group 선적 완료 예정 (8/25)', createdAt: '2026-08-20T14:30:00', read: true },
];

export function generateChartData(tankId: string, hours = 24) {
  const baseValues: Record<string, { temp: number; pH: number; do: number; ammonia: number }> = {
    t1: { temp: 24.5, pH: 7.2, do: 7.8, ammonia: 0.02 },
    t2: { temp: 26.1, pH: 7.8, do: 6.9, ammonia: 0.08 },
    t3: { temp: 24.0, pH: 7.1, do: 8.1, ammonia: 0.01 },
    t4: { temp: 23.8, pH: 7.0, do: 8.4, ammonia: 0.01 },
    t5: { temp: 28.3, pH: 8.2, do: 5.8, ammonia: 0.22 },
    t6: { temp: 24.2, pH: 7.3, do: 7.6, ammonia: 0.03 },
  };
  const base = baseValues[tankId] ?? { temp: 24.5, pH: 7.2, do: 7.8, ammonia: 0.02 };
  return Array.from({ length: hours }, (_, i) => {
    const hour = String(i % 24).padStart(2, '0') + ':00';
    return {
      time: hour,
      temperature: +(base.temp + (Math.sin(i / 4) * 0.4)).toFixed(1),
      pH: +(base.pH + (Math.sin(i / 6) * 0.05)).toFixed(2),
      dissolvedOxygen: +(base.do + (Math.cos(i / 5) * 0.2)).toFixed(1),
      ammonia: +(base.ammonia + (Math.sin(i / 8) * 0.005)).toFixed(3),
    };
  });
}

export const monthlyProductionData = [
  { month: '3월', kg: 620 }, { month: '4월', kg: 850 }, { month: '5월', kg: 490 },
  { month: '6월', kg: 1120 }, { month: '7월', kg: 1350 }, { month: '8월', kg: 940 },
];

export const monthlyExportData = [
  { month: '3월', usd: 11000 }, { month: '4월', usd: 27000 }, { month: '5월', usd: 15000 },
  { month: '6월', usd: 37000 }, { month: '7월', usd: 48000 }, { month: '8월', usd: 26000 },
];
