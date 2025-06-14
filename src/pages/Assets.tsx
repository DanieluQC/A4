import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AssetForm } from '../components/forms/AssetForm';
import { Search, Eye, Plus, HardDrive, AlertTriangle } from 'lucide-react';
import { mockAssets } from '../lib/mockData';

export const Assets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filteredAssets = mockAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.service_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'hardware':
        return <Badge variant="info">Hardware</Badge>;
      case 'software':
        return <Badge variant="success">Software</Badge>;
      case 'service':
        return <Badge variant="warning">Servicio</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Operativo</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Mantenimiento</Badge>;
      case 'non_operational':
        return <Badge variant="error">No Operativo</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const handleViewAsset = (asset: any) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const nonOperationalCount = mockAssets.filter(asset => asset.status === 'non_operational').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activos</h1>
          <p className="text-gray-600">Gestión y control de activos tecnológicos</p>
        </div>
        <Button onClick={() => setShowAssetForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Activo
        </Button>
      </div>

      {/* Alerts */}
      {nonOperationalCount > 0 && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-error-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-error-800">
                Activos no operativos detectados
              </h3>
              <p className="text-sm text-error-700 mt-1">
                Hay {nonOperationalCount} activo(s) no operativo(s) que requieren atención.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ISO Compliance Info */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-4">
        <div className="flex items-center">
          <HardDrive className="h-5 w-5 text-success-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-success-800">
              Cumplimiento de Normas ISO
            </h3>
            <p className="text-sm text-success-700 mt-1">
              ✅ ISO 20000-1: Cláusula 8.5.4 – Control de activos | ✅ ISO 9001: Cláusula 8.5.1 – Control de la producción y la prestación del servicio
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
              placeholder="Buscar activos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Inventario de Activos</h3>
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
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio Vinculado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(asset.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asset.service_name || 'No asignado'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAsset(asset)}
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

      {/* Asset Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles del Activo"
        size="lg"
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{selectedAsset.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <div className="mt-1">
                  {getTypeBadge(selectedAsset.type)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  {getStatusBadge(selectedAsset.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Registro</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedAsset.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Servicio Vinculado</label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedAsset.service_name || 'No asignado'}
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button>
                Editar Activo
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Asset Form */}
      <AssetForm
        isOpen={showAssetForm}
        onClose={() => setShowAssetForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};