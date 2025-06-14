import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ServiceFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>();

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const { error } = await supabase.from('services').insert([
        {
          name: data.name,
          description: data.description,
          status: data.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('Servicio creado exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Error al crear el servicio');
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
      title="Nuevo Servicio"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Servicio *
          </label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Sistema de Gestión de Vuelos"
          />
          {errors.name && (
            <p className="text-sm text-error-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            {...register('description', { required: 'La descripción es requerida' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descripción detallada del servicio"
          />
          {errors.description && (
            <p className="text-sm text-error-600 mt-1">{errors.description.message}</p>
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
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          {errors.status && (
            <p className="text-sm text-error-600 mt-1">{errors.status.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Servicio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};