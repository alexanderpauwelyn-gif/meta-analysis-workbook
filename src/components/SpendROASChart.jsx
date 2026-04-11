import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDateLabel } from '../utils/dateUtils.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const GRID_COLOR  = 'rgba(255,255,255,0.05)';
const TICK_COLOR  = 'rgba(156,163,175,0.8)';
const SPEND_COLOR = '#3b82f6';
const ROAS_COLOR  = '#10b981';

export default function SpendROASChart({ labels = [], spendSeries = [], roasSeries = [] }) {
  const displayLabels = labels.map(formatDateLabel);

  const data = {
    labels: displayLabels,
    datasets: [
      {
        label:           'Spend',
        data:            spendSeries,
        yAxisID:         'ySpend',
        borderColor:     SPEND_COLOR,
        backgroundColor: `${SPEND_COLOR}18`,
        borderWidth:     2,
        pointRadius:     3,
        pointHoverRadius: 5,
        tension:         0.3,
        fill:            true,
      },
      {
        label:           'ROAS',
        data:            roasSeries,
        yAxisID:         'yRoas',
        borderColor:     ROAS_COLOR,
        backgroundColor: 'transparent',
        borderWidth:     2,
        pointRadius:     3,
        pointHoverRadius: 5,
        tension:         0.3,
        borderDash:      [4, 3],
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    interaction:         { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: { color: TICK_COLOR, boxWidth: 12, padding: 16 },
      },
      tooltip: {
        backgroundColor: '#18181b',
        borderColor:     '#3f3f46',
        borderWidth:     1,
        titleColor:      '#e4e4e7',
        bodyColor:       '#a1a1aa',
        padding:         10,
        callbacks: {
          label(ctx) {
            if (ctx.datasetIndex === 0) {
              return ` Spend: $${Number(ctx.raw).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            return ` ROAS: ${Number(ctx.raw).toFixed(2)}x`;
          },
        },
      },
    },
    scales: {
      x: {
        grid:  { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, maxTicksLimit: 7 },
      },
      ySpend: {
        type:     'linear',
        position: 'left',
        grid:     { color: GRID_COLOR },
        ticks: {
          color:    SPEND_COLOR,
          callback: (v) => `$${Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        },
      },
      yRoas: {
        type:     'linear',
        position: 'right',
        grid:     { drawOnChartArea: false },
        ticks: {
          color:    ROAS_COLOR,
          callback: (v) => `${Number(v).toFixed(1)}x`,
        },
      },
    },
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Spend &amp; ROAS over time</h3>
      <div className="h-60">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
