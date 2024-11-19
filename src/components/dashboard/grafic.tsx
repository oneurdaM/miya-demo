/* eslint-disable @typescript-eslint/no-explicit-any */
import {Line} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js'
import {format} from 'date-fns'

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale
)

const SessionDurationChart = ({data}: any) => {


  const chartData = {
    labels: data.map((item: any) =>
      format(
        new Date(
          item.date.substring(0,4),
          item.date.substring(4,6) - 1,
          item.date.substring(6,8)
        ),
        'dd/MM/yyyy'
      )
    ), // Formatear fecha
    datasets: [
      {
        label: 'Duración Promedio de Sesión (minutos)',
        data: data.map(
          (item: any) => parseFloat(item.averageSessionDuration) / 60
        ), // Convertir a minutos
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
      },

      {
        label: 'Número de Sesiones',
        data: data.map((item: any) => parseInt(item.sessions)), // Asegúrate de que tengas esta métrica
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // Otro color para distinguir
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
      },

      {
        label: 'Promedio de Páginas por Sesión',
        data: data.map((item: any) =>
          parseFloat(item.averagePageviewsPerSession)
        ),
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // Color diferente
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default SessionDurationChart
