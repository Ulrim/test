type Variant = string;

const styles: Record<string, string> = {
  normal: 'bg-emerald-100 text-emerald-700',
  caution: 'bg-amber-100 text-amber-700',
  warning: 'bg-red-100 text-red-700',
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  contract: 'bg-indigo-100 text-indigo-700',
  shipping: 'bg-amber-100 text-amber-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  negotiating: 'bg-slate-100 text-slate-600',
  pass: 'bg-emerald-100 text-emerald-700',
  fail: 'bg-red-100 text-red-700',
  pending: 'bg-slate-100 text-slate-500',
  info: 'bg-blue-100 text-blue-700',
  active: 'bg-red-100 text-red-700',
};

const labels: Record<string, string> = {
  normal: '정상', caution: '주의', warning: '경고',
  ongoing: '진행 중', completed: '완료', failed: '실패',
  contract: '계약', shipping: '선적 중', delivered: '낙품 완료', negotiating: '협상 중',
  pass: '합격', fail: '불합격', pending: '검사 중',
  info: '정보', active: '미처리',
  hatchery: '부화장', feed_manufacturer: '사료제조', farm: '양식장', distributor: '유통',
};

interface Props {
  variant: Variant;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function StatusBadge({ variant, label, size = 'md', dot = false }: Props) {
  const style = styles[variant] ?? 'bg-slate-100 text-slate-600';
  const text = label ?? labels[variant] ?? variant;
  const sz = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
  const dotColor =
    variant === 'normal' || variant === 'completed' || variant === 'delivered' || variant === 'pass'
      ? 'bg-emerald-500'
      : variant === 'caution' || variant === 'shipping' || variant === 'ongoing'
      ? 'bg-amber-500'
      : 'bg-red-500';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${style} ${sz}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {text}
    </span>
  );
}
