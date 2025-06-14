import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SLAFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SLAFormData {
  name: string;
  target: number;
  current_value: number;
  description: string;
}

export const SLAForm: React.FC<SLAFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SLAFormData>();

  const target = watch('target');
  const currentValue = watch('current_value');

  const getStatus = (current: number, target: number) => {
    if (!current || !target) return 'compliant';
    if (current >= target) return 'compliant';
    if (current >= target * 0.95) return 'at_risk';
    return 'non_compliant';
  };

  const onSubmit = async (data: SLAFormData) => {
    try {
      const status = getStatus(data.current_value, data.target);

      const { error } = await supabase.from('slas').insert([
        {
          name: data.name,
          target: data.target,
          current_value: data.current_value,
          status: status,
          description: data.description,
          last_updated: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('SLA creado exitosamente');
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating SLA:', error);
      toast.error('Error al crear el SLA');
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
      title="Nuevo SLA"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del SLA *
          </label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Disponibilidad Sistema Vuelos"
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
            placeholder="Descripción del SLA"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo (%) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...register('target', { 
                required: 'El objetivo es requerido',
                min: { value: 0, message: 'El valor debe ser mayor a 0' },
                max: { value: 100, message: 'El valor debe ser menor a 100' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="99.9"
            />
            {errors.target && (
              <p className="text-sm text-error-600 mt-1">{errors.target.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Actual (%) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...register('current_value', { 
                required: 'El valor actual es requerido',
                min: { value: 0, message: 'El valor debe ser mayor a 0' },
                max: { value: 100, message: 'El valor debe ser menor a 100' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="99.8"
            />
            {errors.current_value && (
              <p className="text-sm text-error-600 mt-1">{errors.current_value.message}</p>
            )}
          </div>
        </div>

        {target && currentValue && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Estado calculado: 
              <span className={`ml-2 font-medium ${
                getStatus(currentValue, target) === 'compliant' ? 'text-success-600' :
                getStatus(currentValue, target) === 'at_risk' ? 'text-warning-600' :
                'text-error-600'
              }`}>
                {getStatus(currentValue, target) === 'compliant' ? 'Cumple' :
                 getStatus(currentValue, target) === 'at_risk' ? 'En Riesgo' :
                 'No Cumple'}
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear SLA'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};