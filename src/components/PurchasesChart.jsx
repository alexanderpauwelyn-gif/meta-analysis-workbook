import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatDateLabel } from '../utils/dateUtils.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GRID_COLOR = 'rgba(255,255,255,0.05)';
const TICK_COLOR = 'rgba(156,163,175,0.8)';
const BAR_COLOR  = 'rgba(139,92,246,0.8)';
const BAR_HOVER  = 'rgba(139,92,246,1)';

export default function PurchasesChart({ labels = [], purchasesSeries = [] }) {
  const displayLabels = labels.map(formatDateLabel);

  const data = {
    labels: displayLabels,
    datasets: [
      {
        label:            'Purchases',
        data:             purchasesSeries,
        backgroundColor: BAR_COLOR,
        hoverBackgroundColor: BAR_HOVER,
        borderRadius:     4,
        borderSkipped:    false,
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        borderColor:     '#3f3f46',
        borderWidth:     1,
        titleColor:      '#e4e4e7',
        bodyColor:       '#a1a1aa',
        padding:         10,
        callbacks: {
          label: (ctx) => ` Purchases: ${Number(ctx.raw).toLocaleString('en-US')}`,
        },
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: { color: TICK_COLOR, maxTicksLimit: 7 },
      },
      y: {
        grid:     { color: GRID_COLOR },
        ticks:    { color: TICK_COLOR },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Purchases over time</h3>
      <div className="h-60">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
