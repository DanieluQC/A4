import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { SLAForm } from '../components/forms/SLAForm';
import { Search, Eye, AlertTriangle, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { mockSLAs } from '../lib/mockData';
import type { SLA } from '../lib/supabase';

export const SLAs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSLA, setSelectedSLA] = useState<SLA | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSLAForm, setShowSLAForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filteredSLAs = mockSLAs.filter(sla =>
    sla.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSLA = (sla: SLA) => {
    setSelectedSLA(sla);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="success">Cumple</Badge>;
      case 'at_risk':
        return <Badge variant="warning">En Riesgo</Badge>;
      case 'non_compliant':
        return <Badge variant="error">No Cumple</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const getSLAIcon = (current: number, target: number) => {
    if (current >= target) {
      return <TrendingUp className="h-4 w-4 text-success-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-error-600" />;
  };

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SLAs</h1>
          <p className="text-gray-600">Monitoreo y cumplimiento de Service Level Agreements</p>
        </div>
        <Button onClick={() => setShowSLAForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo SLA
        </Button>
      </div>

      {/* Alerts */}
      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-warning-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-warning-800">
              SLAs en riesgo detectados
            </h3>
            <p className="text-sm text-warning-700 mt-1">
              Hay {mockSLAs.filter(sla => sla.status === 'at_risk' || sla.status === 'non_compliant').length} SLAs que requieren atención inmediata.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar SLAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* SLAs Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Service Level Agreements</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objetivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actualización
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSLAs.map((sla) => (
                  <tr key={sla.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sla.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sla.target}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">
                          {sla.current_value}%
                        </span>
                        {getSLAIcon(sla.current_value, sla.target)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sla.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(sla.last_updated).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSLA(sla)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SLA Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles del SLA"
        size="lg"
      >
        {selectedSLA && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSLA.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  {getStatusBadge(selectedSLA.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Objetivo</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSLA.target}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Valor Actual</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSLA.current_value}%</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Última Actualización</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(selectedSLA.last_updated).toLocaleString('es-ES')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Historial (Últimos 30 días)</label>
              <div className="mt-2 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500">Gráfico de tendencia histórica</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button>
                Editar SLA
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* SLA Form */}
      <SLAForm
        isOpen={showSLAForm}
        onClose={() => setShowSLAForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};