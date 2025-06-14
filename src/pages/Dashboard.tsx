import React, { useState, useEffect } from 'react';
import { KPICard } from '../components/dashboard/KPICard';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IncidentForm } from '../components/forms/IncidentForm';
import { ReportForm } from '../components/forms/ReportForm';
import { 
  Activity, 
  AlertTriangle, 
  Target, 
  Users, 
  Plus, 
  FileText, 
  ClipboardCheck 
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const Dashboard: React.FC = () => {
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [kpis, setKpis] = useState({
    systemAvailability: 0,
    activeIncidents: 0,
    slaCompliance: 0,
    customerSatisfaction: 92
  });
  const [loading, setLoading] = useState(true);

  const fetchKPIs = async () => {
    try {
      // Fetch SLA compliance
      const { data: slas } = await supabase
        .from('slas')
        .select('status');
      
      const compliantSLAs = slas?.filter(sla => sla.status === 'compliant').length || 0;
      const totalSLAs = slas?.length || 1;
      const slaCompliance = Math.round((compliantSLAs / totalSLAs) * 100);

      // Fetch active incidents
      const { data: incidents } = await supabase
        .from('incidents')
        .select('status')
        .in('status', ['open', 'in_progress']);
      
      const activeIncidents = incidents?.length || 0;

      // Calculate system availability (average of all SLAs)
      const { data: slaValues } = await supabase
        .from('slas')
        .select('current_value');
      
      const avgAvailability = slaValues?.length 
        ? slaValues.reduce((sum, sla) => sum + sla.current_value, 0) / slaValues.length
        : 99.5;

      setKpis({
        systemAvailability: Math.round(avgAvailability * 10) / 10,
        activeIncidents,
        slaCompliance,
        customerSatisfaction: 92
      });
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      toast.error('Error al cargar los KPIs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const slaComplianceData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cumplimiento SLA (%)',
        data: [88, 92, 89, 94, 90, kpis.slaCompliance],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const incidentResolutionData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Incidentes Resueltos',
        data: [12, 19, 15, 17],
        backgroundColor: '#22c55e',
      },
      {
        label: 'Incidentes Pendientes',
        data: [3, 2, 4, kpis.activeIncidents],
        backgroundColor: '#dc2626',
      },
    ],
  };

  const handleFormSuccess = () => {
    fetchKPIs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de servicios CORPAC</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowReportForm(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
          <Button onClick={() => setShowIncidentForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Incidente
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Disponibilidad del Sistema"
          value={`${kpis.systemAvailability}%`}
          trend={kpis.systemAvailability >= 99.9 ? "up" : "down"}
          trendValue={kpis.systemAvailability >= 99.9 ? "Objetivo cumplido" : "Por debajo del objetivo"}
          icon={Activity}
          color={kpis.systemAvailability >= 99.9 ? "green" : "red"}
        />
        <KPICard
          title="Incidentes Activos"
          value={kpis.activeIncidents}
          trend={kpis.activeIncidents > 2 ? "up" : kpis.activeIncidents === 0 ? "neutral" : "down"}
          trendValue={kpis.activeIncidents === 0 ? "Sin incidentes" : `${kpis.activeIncidents} activos`}
          icon={AlertTriangle}
          color={kpis.activeIncidents > 2 ? "red" : kpis.activeIncidents === 0 ? "green" : "yellow"}
        />
        <KPICard
          title="Cumplimiento de SLAs"
          value={`${kpis.slaCompliance}%`}
          trend={kpis.slaCompliance >= 95 ? "up" : kpis.slaCompliance >= 85 ? "neutral" : "down"}
          trendValue={kpis.slaCompliance >= 95 ? "Excelente" : kpis.slaCompliance >= 85 ? "Bueno" : "Requiere atención"}
          icon={Target}
          color={kpis.slaCompliance >= 95 ? "green" : kpis.slaCompliance >= 85 ? "yellow" : "red"}
        />
        <KPICard
          title="Satisfacción del Cliente"
          value={`${kpis.customerSatisfaction}%`}
          trend="up"
          trendValue="+2% este mes"
          icon={Users}
          color="green"
        />
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Cumplimiento de SLAs</h3>
            </CardHeader>
            <CardContent>
              <Line data={slaComplianceData} options={chartOptions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Resolución de Incidentes</h3>
            </CardHeader>
            <CardContent>
              <Bar data={incidentResolutionData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <AlertsPanel />
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setShowIncidentForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Incidente
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Nueva Auditoría
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setShowReportForm(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forms */}
      <IncidentForm
        isOpen={showIncidentForm}
        onClose={() => setShowIncidentForm(false)}
        type="incident"
        onSuccess={handleFormSuccess}
      />

      <ReportForm
        isOpen={showReportForm}
        onClose={() => setShowReportForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};