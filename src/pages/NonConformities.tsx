import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { NonConformityForm } from '../components/forms/NonConformityForm';
import { Search, Eye, Plus, XCircle, Download } from 'lucide-react';
import { mockNonConformities } from '../lib/mockData';

export const NonConformities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNC, setSelectedNC] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNCForm, setShowNCForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filteredNCs = mockNonConformities.filter(nc =>
    nc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nc.cause.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="error">Abierto</Badge>;
      case 'in_progress':
        return <Badge variant="warning">En Progreso</Badge>;
      case 'closed':
        return <Badge variant="success">Cerrado</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const handleViewNC = (nc: any) => {
    setSelectedNC(nc);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">No Conformidades</h1>
          <p className="text-gray-600">Gestión de no conformidades y acciones correctivas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowNCForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva No Conformidad
          </Button>
        </div>
      </div>

      {/* ISO Compliance Info */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-success-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-success-800">
              Cumplimiento de Normas ISO
            </h3>
            <p className="text-sm text-success-700 mt-1">
              ✅ ISO 20000-1: Cláusula 10.1 – No conformidades y acciones correctivas | ✅ ISO 9001: Cláusula 10.2 – No conformidades y acciones correctivas
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
              placeholder="Buscar no conformidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Non-Conformities Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">No Conformidades Registradas</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Causa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción Correctiva
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNCs.map((nc) => (
                  <tr key={nc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {nc.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {nc.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {nc.cause}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {nc.corrective_action}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(nc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewNC(nc)}
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

      {/* NC Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles de No Conformidad"
        size="lg"
      >
        {selectedNC && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-sm text-gray-900">{selectedNC.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  {getStatusBadge(selectedNC.status)}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <p className="mt-1 text-sm text-gray-900">{selectedNC.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Causa</label>
              <p className="mt-1 text-sm text-gray-900">{selectedNC.cause}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Acción Correctiva</label>
              <p className="mt-1 text-sm text-gray-900">{selectedNC.corrective_action}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(selectedNC.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button>
                Editar No Conformidad
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Non-Conformity Form */}
      <NonConformityForm
        isOpen={showNCForm}
        onClose={() => setShowNCForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};