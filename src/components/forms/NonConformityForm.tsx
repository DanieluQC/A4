import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface NonConformityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface NonConformityFormData {
  description: string;
  cause: string;
  corrective_action: string;
  category: string;
  severity: 'minor' | 'major' | 'critical';
}

export const NonConformityForm: React.FC<NonConformityFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NonConformityFormData>();

  const onSubmit = async (data: NonConformityFormData) => {
    try {
      const { error } = await supabase.from('non_conformities').insert([
        {
          description: data.description,
          cause: data.cause,
          corrective_action: data.corrective_action,
          category: data.category,
          severity: data.severity,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('No conformidad creada exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating non-conformity:', error);
      toast.error('Error al crear la no conformidad');
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
      title="Nueva No Conformidad"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la No Conformidad *
          </label>
          <textarea
            {...register('description', { required: 'La descripción es requerida' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describa la no conformidad identificada"
          />
          {errors.description && (
            <p className="text-sm text-error-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              {...register('category', { required: 'La categoría es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar categoría</option>
              <option value="iso_20000">ISO 20000-1</option>
              <option value="iso_9001">ISO 9001</option>
              <option value="sla">SLA</option>
              <option value="process">Proceso</option>
              <option value="documentation">Documentación</option>
            </select>
            {errors.category && (
              <p className="text-sm text-error-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severidad *
            </label>
            <select
              {...register('severity', { required: 'La severidad es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar severidad</option>
              <option value="minor">Menor</option>
              <option value="major">Mayor</option>
              <option value="critical">Crítica</option>
            </select>
            {errors.severity && (
              <p className="text-sm text-error-600 mt-1">{errors.severity.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Causa *
          </label>
          <textarea
            {...register('cause', { required: 'La causa es requerida' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Identifique la causa de la no conformidad"
          />
          {errors.cause && (
            <p className="text-sm text-error-600 mt-1">{errors.cause.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acción Correctiva *
          </label>
          <textarea
            {...register('corrective_action', { required: 'La acción correctiva es requerida' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describa la acción correctiva a implementar"
          />
          {errors.corrective_action && (
            <p className="text-sm text-error-600 mt-1">{errors.corrective_action.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear No Conformidad'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};