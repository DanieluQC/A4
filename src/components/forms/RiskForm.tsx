import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface RiskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RiskFormData {
  description: string;
  priority: 'low' | 'medium' | 'high';
  mitigation: string;
  category: string;
}

export const RiskForm: React.FC<RiskFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RiskFormData>();

  const onSubmit = async (data: RiskFormData) => {
    try {
      const { error } = await supabase.from('risks').insert([
        {
          description: data.description,
          priority: data.priority,
          mitigation: data.mitigation,
          category: data.category,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('Riesgo creado exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating risk:', error);
      toast.error('Error al crear el riesgo');
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
      title="Nuevo Riesgo"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Riesgo *
          </label>
          <textarea
            {...register('description', { required: 'La descripción es requerida' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describa el riesgo identificado"
          />
          {errors.description && (
            <p className="text-sm text-error-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad *
            </label>
            <select
              {...register('priority', { required: 'La prioridad es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar prioridad</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            {errors.priority && (
              <p className="text-sm text-error-600 mt-1">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              {...register('category', { required: 'La categoría es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar categoría</option>
              <option value="operational">Operacional</option>
              <option value="technical">Técnico</option>
              <option value="security">Seguridad</option>
              <option value="compliance">Cumplimiento</option>
              <option value="financial">Financiero</option>
            </select>
            {errors.category && (
              <p className="text-sm text-error-600 mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan de Mitigación *
          </label>
          <textarea
            {...register('mitigation', { required: 'El plan de mitigación es requerido' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describa las acciones para mitigar este riesgo"
          />
          {errors.mitigation && (
            <p className="text-sm text-error-600 mt-1">{errors.mitigation.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Riesgo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};