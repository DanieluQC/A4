import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ProblemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProblemFormData {
  description: string;
  root_cause: string;
  solution: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormData>();

  const onSubmit = async (data: ProblemFormData) => {
    try {
      const { error } = await supabase.from('problems').insert([
        {
          description: data.description,
          root_cause: data.root_cause || null,
          solution: data.solution || null,
          priority: data.priority,
          category: data.category,
          status: data.root_cause ? 'investigating' : 'open',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('Problema creado exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating problem:', error);
      toast.error('Error al crear el problema');
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
      title="Nuevo Problema"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Problema *
          </label>
          <textarea
            {...register('description', { required: 'La descripción es requerida' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describa el problema identificado"
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
              <option value="infrastructure">Infraestructura</option>
              <option value="application">Aplicación</option>
              <option value="network">Red</option>
              <option value="security">Seguridad</option>
              <option value="process">Proceso</option>
            </select>
            {errors.category && (
              <p className="text-sm text-error-600 mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Causa Raíz
          </label>
          <textarea
            {...register('root_cause')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Causa raíz identificada (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solución Propuesta
          </label>
          <textarea
            {...register('solution')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Solución propuesta (opcional)"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Problema'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};