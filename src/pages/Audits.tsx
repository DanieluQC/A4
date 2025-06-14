import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AuditForm } from '../components/forms/AuditForm';
import { Search, Eye, Plus, ClipboardCheck, Download } from 'lucide-react';
import { mockAudits } from '../lib/mockData';

export const Audits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filteredAudits = mockAudits.filter(audit =>
    audit.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completada</Badge>;
      case 'in_progress':
        return <Badge variant="warning">En Progreso</Badge>;
      case 'planned':
        return <Badge variant="info">Programada</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const handleViewAudit = (audit: any) => {
    setSelectedAudit(audit);
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
          <h1 className="text-2xl font-bold text-gray-900">Auditorías</h1>
          <p className="text-gray-600">Gestión y seguimiento de auditorías internas</p>
        </div>
        <Button onClick={() => setShowAuditForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Auditoría
        </Button>
      </div>

      {/* ISO Compliance Info */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-4">
        <div className="flex items-center">
          <ClipboardCheck className="h-5 w-5 text-success-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-success-800">
              Cumplimiento de Normas ISO
            </h3>
            <p className="text-sm text-success-700 mt-1">
              ✅ ISO 20000-1: Cláusula 9.2 – Auditoría interna | ✅ ISO 9001: Cláusula 9.2 – Auditoría interna
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
              placeholder="Buscar auditorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Audits Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Auditorías Registradas</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alcance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
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
                {filteredAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(audit.date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {audit.scope}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {audit.result}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(audit.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAudit(audit)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        {audit.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles de la Auditoría"
        size="lg"
      >
        {selectedAudit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedAudit.date).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  {getStatusBadge(selectedAudit.status)}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Alcance</label>
              <p className="mt-1 text-sm text-gray-900">{selectedAudit.scope}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Resultado</label>
              <p className="mt-1 text-sm text-gray-900">{selectedAudit.result}</p>
            </div>
            {selectedAudit.recommendations && selectedAudit.recommendations.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700">Recomendaciones</label>
                <ul className="mt-1 text-sm text-gray-900 list-disc list-inside space-y-1">
                  {selectedAudit.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              {selectedAudit.status === 'completed' && (
                <Button variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              )}
              <Button>
                Editar Auditoría
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Audit Form */}
      <AuditForm
        isOpen={showAuditForm}
        onClose={() => setShowAuditForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};