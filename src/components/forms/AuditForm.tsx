import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AuditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AuditFormData {
  date: string;
  scope: string;
  status: 'planned' | 'in_progress' | 'completed';
  result: string;
  recommendations: string;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormData>();

  const onSubmit = async (data: AuditFormData) => {
    try {
      const recommendationsArray = data.recommendations
        ? data.recommendations.split('\n').filter(r => r.trim())
        : [];

      const { error } = await supabase.from('audits').insert([
        {
          date: data.date,
          scope: data.scope,
          result: data.result || 'Programado',
          status: data.status,
          recommendations: recommendationsArray,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('Auditoría creada exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating audit:', error);
      toast.error('Error al crear la auditoría');
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
      title="Nueva Auditoría"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              {...register('date', { required: 'La fecha es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.date && (
              <p className="text-sm text-error-600 mt-1">{errors.date.message}</p>
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
              <option value="planned">Programada</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
            {errors.status && (
              <p className="text-sm text-error-600 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alcance *
          </label>
          <input
            type="text"
            {...register('scope', { required: 'El alcance es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Cumplimiento de SLAs, Disponibilidad del sistema"
          />
          {errors.scope && (
            <p className="text-sm text-error-600 mt-1">{errors.scope.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resultado
          </label>
          <input
            type="text"
            {...register('result')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: 95%, Satisfactorio, Programado"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recomendaciones
          </label>
          <textarea
            {...register('recommendations')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Una recomendación por línea"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingrese cada recomendación en una línea separada
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Auditoría'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};