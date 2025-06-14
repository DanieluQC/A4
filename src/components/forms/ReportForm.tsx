import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ReportFormData {
  name: string;
  type: string;
  format: 'PDF' | 'Excel';
  date_from: string;
  date_to: string;
  description: string;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>();

  const generateReportId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `REP${timestamp}`;
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      const reportId = generateReportId();
      
      const { error } = await supabase.from('reports').insert([
        {
          id: reportId,
          name: data.name,
          type: data.type,
          format: data.format,
          date_from: data.date_from,
          date_to: data.date_to,
          description: data.description,
          status: 'in_progress',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Simulate report generation
      setTimeout(async () => {
        await supabase
          .from('reports')
          .update({ 
            status: 'completed',
            generated_at: new Date().toISOString(),
            file_url: `https://example.com/reports/${reportId}.${data.format.toLowerCase()}`
          })
          .eq('id', reportId);
      }, 3000);

      toast.success(`Reporte programado exitosamente con ID: ${reportId}`);
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Error al crear el reporte');
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
      title="Generar Nuevo Reporte"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Reporte *
          </label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Informe mensual de SLAs - Enero 2025"
          />
          {errors.name && (
            <p className="text-sm text-error-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Reporte *
          </label>
          <select
            {...register('type', { required: 'El tipo es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccionar tipo</option>
            <option value="sla">Informe de SLAs</option>
            <option value="incidents">Reporte de Incidentes</option>
            <option value="audits">Análisis de Auditorías</option>
            <option value="non_conformities">Reporte de No Conformidades</option>
            <option value="risks">Análisis de Riesgos</option>
            <option value="assets">Inventario de Activos</option>
            <option value="problems">Reporte de Problemas</option>
            <option value="dashboard">Dashboard Ejecutivo</option>
            <option value="iso_compliance">Cumplimiento ISO</option>
          </select>
          {errors.type && (
            <p className="text-sm text-error-600 mt-1">{errors.type.message}</p>
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
            placeholder="Descripción adicional del reporte"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio *
            </label>
            <input
              type="date"
              {...register('date_from', { required: 'La fecha inicio es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.date_from && (
              <p className="text-sm text-error-600 mt-1">{errors.date_from.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin *
            </label>
            <input
              type="date"
              {...register('date_to', { required: 'La fecha fin es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.date_to && (
              <p className="text-sm text-error-600 mt-1">{errors.date_to.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="PDF"
                {...register('format', { required: 'El formato es requerido' })}
                className="mr-2"
              />
              PDF
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Excel"
                {...register('format', { required: 'El formato es requerido' })}
                className="mr-2"
              />
              Excel
            </label>
          </div>
          {errors.format && (
            <p className="text-sm text-error-600 mt-1">{errors.format.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};