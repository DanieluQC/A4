import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'error' | 'success';
  timestamp: string;
}

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsData: Alert[] = [];

        // Check for SLAs at risk
        const { data: slas } = await supabase
          .from('slas')
          .select('name, status, current_value, target')
          .in('status', ['at_risk', 'non_compliant']);

        slas?.forEach(sla => {
          alertsData.push({
            id: `sla-${sla.name}`,
            title: `SLA en riesgo: ${sla.name}`,
            description: `El SLA está ${sla.status === 'at_risk' ? 'en riesgo' : 'incumplido'} (${sla.current_value}% vs ${sla.target}%)`,
            severity: sla.status === 'at_risk' ? 'warning' : 'error',
            timestamp: '5 min'
          });
        });

        // Check for critical incidents
        const { data: incidents } = await supabase
          .from('incidents')
          .select('id, title, priority, status')
          .eq('priority', 'critical')
          .in('status', ['open', 'in_progress']);

        incidents?.forEach(incident => {
          alertsData.push({
            id: `incident-${incident.id}`,
            title: 'Incidente crítico abierto',
            description: `${incident.title} - ${incident.id}`,
            severity: 'error',
            timestamp: '1 hora'
          });
        });

        // Check for completed audits
        const { data: audits } = await supabase
          .from('audits')
          .select('scope, result, status')
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1);

        if (audits && audits.length > 0) {
          alertsData.push({
            id: `audit-${audits[0].scope}`,
            title: 'Auditoría completada',
            description: `${audits[0].scope} finalizada - Resultado: ${audits[0].result}`,
            severity: 'success',
            timestamp: '2 horas'
          });
        }

        setAlerts(alertsData.slice(0, 3)); // Show only top 3 alerts
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Alertas Recientes</h3>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Alertas Recientes</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
              <p className="text-gray-500">No hay alertas activas</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {alert.severity === 'error' && (
                    <AlertTriangle className="h-5 w-5 text-error-500" />
                  )}
                  {alert.severity === 'warning' && (
                    <Clock className="h-5 w-5 text-warning-500" />
                  )}
                  {alert.severity === 'success' && (
                    <CheckCircle className="h-5 w-5 text-success-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.title}
                    </p>
                    <Badge variant={alert.severity === 'error' ? 'error' : alert.severity === 'warning' ? 'warning' : 'success'} size="sm">
                      {alert.timestamp}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {alert.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};