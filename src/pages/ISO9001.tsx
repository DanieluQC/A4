import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle, ExternalLink, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const mockISO9001Requirements = [
  {
    id: '6.1',
    title: 'Gestión de Riesgos y Oportunidades',
    status: 'compliant' as const,
    source: 'Módulo de Riesgos',
    redirect: '/risks'
  },
  {
    id: '8.5.1',
    title: 'Control de la producción y prestación del servicio',
    status: 'compliant' as const,
    source: 'Módulo de Activos',
    redirect: '/assets'
  },
  {
    id: '9.1',
    title: 'Seguimiento, medición, análisis y evaluación',
    status: 'compliant' as const,
    source: 'KPIs del Dashboard',
    redirect: '/'
  },
  {
    id: '9.2',
    title: 'Auditorías internas',
    status: 'compliant' as const,
    source: 'Módulo Auditorías',
    redirect: '/audits'
  },
  {
    id: '10.2',
    title: 'No conformidades y acciones correctivas',
    status: 'compliant' as const,
    source: 'No conformidades',
    redirect: '/non-conformities'
  },
  {
    id: '8.2.1',
    title: 'Comunicación con el cliente',
    status: 'in_progress' as const,
    source: 'Sistema de comunicaciones',
    redirect: '/incidents'
  }
];

export const ISO9001: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="success">Cumplido</Badge>;
      case 'in_progress':
        return <Badge variant="warning">En Proceso</Badge>;
      case 'non_compliant':
        return <Badge variant="error">No Cumplido</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const compliancePercentage = Math.round(
    (mockISO9001Requirements.filter(req => req.status === 'compliant').length / 
     mockISO9001Requirements.length) * 100
  );

  // Compliance evolution data
  const complianceEvolutionData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cumplimiento ISO 9001 (%)',
        data: [78, 82, 85, 88, 90, compliancePercentage],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución del Cumplimiento ISO 9001'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
    },
  };

  const handleViewNorm = () => {
    window.open('https://www.iso.org/standard/62085.html', '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguimiento ISO 9001</h1>
          <p className="text-gray-600">Monitoreo del cumplimiento del Sistema de Gestión de Calidad ISO 9001:2015</p>
        </div>
        <Button variant="secondary" onClick={handleViewNorm}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Norma Completa
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cumplimiento General</p>
                <p className="text-3xl font-bold text-gray-900">{compliancePercentage}%</p>
                <p className="text-sm text-success-600 mt-1">+15% vs mes anterior</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requisitos Cumplidos</p>
                <p className="text-3xl font-bold text-success-600">
                  {mockISO9001Requirements.filter(req => req.status === 'compliant').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">de {mockISO9001Requirements.length} total</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-3xl font-bold text-warning-600">
                  {mockISO9001Requirements.filter(req => req.status === 'in_progress').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">requieren atención</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Chart */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Evolución del Cumplimiento</h3>
        </CardHeader>
        <CardContent>
          <Line data={complianceEvolutionData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Requirements Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Requisitos ISO 9001</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cláusula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuente de Datos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockISO9001Requirements.map((requirement) => (
                  <tr key={requirement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {requirement.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {requirement.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(requirement.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {requirement.source}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={requirement.redirect}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ver Módulo
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};