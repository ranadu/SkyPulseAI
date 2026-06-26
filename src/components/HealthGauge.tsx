import { healthHex as healthColor } from '../utils/format';

interface HealthGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function HealthGauge({ score, size = 80, strokeWidth = 8, label }: HealthGaugeProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75; // 270 degree arc
  const fill = arc * (score / 100);
  const gap = circ - arc;
  const color = healthColor(score);

  // Rotate so arc starts bottom-left and ends bottom-right
  const rotate = 135;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: `rotate(${rotate}deg)` }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arc} ${gap}`}
          strokeLinecap="round"
        />
        {/* Foreground fill */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div className="text-center -mt-10" style={{ transform: 'none' }}>
        <div className="text-lg font-bold" style={{ color }}>{score}%</div>
        {label && <div className="text-xs text-slate-500">{label}</div>}
      </div>
    </div>
  );
}
