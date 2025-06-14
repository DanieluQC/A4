import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AssetFormData {
  name: string;
  type: 'hardware' | 'software' | 'service';
  status: 'operational' | 'maintenance' | 'non_operational';
  service_id: string;
  description: string;
  location: string;
}

export const AssetForm: React.FC<AssetFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormData>();

  const onSubmit = async (data: AssetFormData) => {
    try {
      const { error } = await supabase.from('assets').insert([
        {
          name: data.name,
          type: data.type,
          status: data.status,
          service_id: data.service_id || null,
          description: data.description,
          location: data.location,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('Activo creado exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating asset:', error);
      toast.error('Error al crear el activo');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nuevo Activo"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Activo *
          </label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Servidor CORPAC-01"
          />
          {errors.name && (
            <p className="text-sm text-error-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descripción del activo"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              {...register('type', { required: 'El tipo es requerido' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="service">Servicio</option>
            </select>
            {errors.type && (
              <p className="text-sm text-error-600 mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              {...register('status', { required: 'El estado es requerido' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar estado</option>
              <option value="operational">Operativo</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="non_operational">No Operativo</option>
            </select>
            {errors.status && (
              <p className="text-sm text-error-600 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicio Vinculado
            </label>
            <input
              type="text"
              {...register('service_id')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ID del servicio (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ej: Sala de servidores A"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Activo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};