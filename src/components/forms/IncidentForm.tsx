import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface IncidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'incident' | 'request';
  onSuccess: () => void;
}

interface IncidentFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  service_id?: string;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  isOpen,
  onClose,
  type,
  onSuccess,
}) => {
  const [services, setServices] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormData>();

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, name')
        .eq('status', 'active');
      setServices(data || []);
    };
    
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const generateIncidentId = (type: string) => {
    const prefix = type === 'incident' ? 'INC' : 'REQ';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const onSubmit = async (data: IncidentFormData) => {
    try {
      const incidentId = generateIncidentId(type);
      
      const { error } = await supabase.from('incidents').insert([
        {
          id: incidentId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: 'open',
          type: type,
          category: data.category,
          service_id: data.service_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success(`${type === 'incident' ? 'Incidente' : 'Solicitud'} creado exitosamente con ID: ${incidentId}`);
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Error al crear el registro');
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
      title={`Nuevo ${type === 'incident' ? 'Incidente' : 'Solicitud de Servicio'}`}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            {...register('title', { required: 'El título es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ingrese el título"
          />
          {errors.title && (
            <p className="text-sm text-error-600 mt-1">{errors.title.message}</p>
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
            placeholder="Describa el incidente o solicitud"
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
              <option value="critical">Crítica</option>
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
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Red</option>
              <option value="access">Acceso</option>
              <option value="other">Otro</option>
            </select>
            {errors.category && (
              <p className="text-sm text-error-600 mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicio Relacionado
          </label>
          <select
            {...register('service_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccionar servicio (opcional)</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};