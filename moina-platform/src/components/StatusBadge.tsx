type Variant = string;

const labels: Record<string, string> = {
  normal: '정상', caution: '주의', warning: '경고',
  ongoing: '진행 중', completed: '완료', failed: '실패',
  contract: '계약', shipping: '선적 중', delivered: '납품 완료', negotiating: '협상 중',
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
  const text = label ?? labels[variant] ?? variant;
  const cls = `pill pill-${variant}`;
  const sz = size === 'sm' ? { fontSize: 10, padding: '2px 8px' } : { fontSize: 11, padding: '3px 10px' };

  // dot color
  const dotColor =
    variant === 'normal' || variant === 'completed' || variant === 'delivered' || variant === 'pass'
      ? 'var(--success)'
      : variant === 'caution' || variant === 'shipping' || variant === 'ongoing'
      ? 'var(--warning)'
      : variant === 'info' || variant === 'contract'
      ? 'var(--info)'
      : 'var(--danger)';

  return (
    <span className={cls} style={sz}>
      {dot && <span className="pill-dot" style={{ background: dotColor }} />}
      {text}
    </span>
  );
}
