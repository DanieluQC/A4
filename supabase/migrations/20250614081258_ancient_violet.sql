/*
  # Complete COBA Monitoring Platform Schema

  1. New Tables
    - `services` - Catálogo de servicios
    - `slas` - Service Level Agreements
    - `incidents` - Incidentes y solicitudes
    - `audits` - Auditorías internas
    - `non_conformities` - No conformidades
    - `reports` - Reportes generados
    - `risks` - Gestión de riesgos
    - `assets` - Activos tecnológicos
    - `problems` - Gestión de problemas

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Sample Data
    - Insert initial data for testing
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SLAs table
CREATE TABLE IF NOT EXISTS slas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  target numeric NOT NULL CHECK (target > 0),
  current_value numeric NOT NULL DEFAULT 0 CHECK (current_value >= 0),
  status text NOT NULL DEFAULT 'compliant' CHECK (status IN ('compliant', 'at_risk', 'non_compliant')),
  service_id uuid REFERENCES services(id),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  type text NOT NULL DEFAULT 'incident' CHECK (type IN ('incident', 'request')),
  category text,
  assigned_to text,
  service_id uuid REFERENCES services(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  scope text NOT NULL,
  result text NOT NULL DEFAULT 'Programado',
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  recommendations text[] DEFAULT '{}',
  auditor text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Non-conformities table
CREATE TABLE IF NOT EXISTS non_conformities (
  id text PRIMARY KEY,
  description text NOT NULL,
  cause text NOT NULL,
  corrective_action text NOT NULL,
  category text NOT NULL DEFAULT 'process',
  severity text NOT NULL DEFAULT 'minor' CHECK (severity IN ('minor', 'major', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  responsible text,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  format text NOT NULL DEFAULT 'PDF' CHECK (format IN ('PDF', 'Excel')),
  description text,
  date_from date NOT NULL,
  date_to date NOT NULL,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  file_url text,
  created_at timestamptz DEFAULT now(),
  generated_at timestamptz
);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
  id text PRIMARY KEY,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text NOT NULL DEFAULT 'operational',
  mitigation text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'mitigated', 'closed')),
  probability numeric DEFAULT 0.5 CHECK (probability >= 0 AND probability <= 1),
  impact numeric DEFAULT 0.5 CHECK (impact >= 0 AND impact <= 1),
  owner text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hardware', 'software', 'service')),
  status text NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'non_operational')),
  description text,
  location text,
  service_id uuid REFERENCES services(id),
  purchase_date date,
  warranty_expiry date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id text PRIMARY KEY,
  description text NOT NULL,
  root_cause text,
  solution text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text NOT NULL DEFAULT 'infrastructure',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
  related_incidents text[],
  assigned_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE slas ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update services" ON services FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all slas" ON slas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert slas" ON slas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update slas" ON slas FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all incidents" ON incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert incidents" ON incidents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update incidents" ON incidents FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all audits" ON audits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert audits" ON audits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update audits" ON audits FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all non_conformities" ON non_conformities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert non_conformities" ON non_conformities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update non_conformities" ON non_conformities FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all reports" ON reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert reports" ON reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update reports" ON reports FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all risks" ON risks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert risks" ON risks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update risks" ON risks FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all assets" ON assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert assets" ON assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update assets" ON assets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can read all problems" ON problems FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert problems" ON problems FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update problems" ON problems FOR UPDATE TO authenticated USING (true);

-- Insert sample data
INSERT INTO services (name, description, status) VALUES
('Sistema de Gestión de Vuelos', 'Sistema principal para la gestión y control de operaciones de vuelo', 'active'),
('Plataforma de Comunicaciones', 'Sistema de comunicaciones aeroportuarias integrado', 'active'),
('Sistema de Navegación', 'Sistema de ayudas a la navegación aérea', 'inactive'),
('Control de Tráfico Aéreo', 'Sistema de control y monitoreo del tráfico aéreo', 'active'),
('Gestión de Carga', 'Sistema de seguimiento y gestión de carga aérea', 'active');

-- Get service IDs for foreign key references
DO $$
DECLARE
    vuelos_id uuid;
    comunicaciones_id uuid;
    navegacion_id uuid;
    control_id uuid;
    carga_id uuid;
BEGIN
    SELECT id INTO vuelos_id FROM services WHERE name = 'Sistema de Gestión de Vuelos';
    SELECT id INTO comunicaciones_id FROM services WHERE name = 'Plataforma de Comunicaciones';
    SELECT id INTO navegacion_id FROM services WHERE name = 'Sistema de Navegación';
    SELECT id INTO control_id FROM services WHERE name = 'Control de Tráfico Aéreo';
    SELECT id INTO carga_id FROM services WHERE name = 'Gestión de Carga';

    -- Insert SLAs
    INSERT INTO slas (name, description, target, current_value, status, service_id) VALUES
    ('Disponibilidad Sistema Vuelos', 'Disponibilidad del sistema de gestión de vuelos', 99.9, 99.8, 'at_risk', vuelos_id),
    ('Tiempo Respuesta Comunicaciones', 'Tiempo de respuesta del sistema de comunicaciones', 2.0, 1.8, 'compliant', comunicaciones_id),
    ('Resolución Incidentes Críticos', 'Tiempo de resolución de incidentes críticos (horas)', 4.0, 5.2, 'non_compliant', control_id),
    ('Disponibilidad Control Tráfico', 'Disponibilidad del sistema de control de tráfico', 99.95, 99.97, 'compliant', control_id),
    ('Tiempo Procesamiento Carga', 'Tiempo de procesamiento de información de carga', 30.0, 28.5, 'compliant', carga_id);

    -- Insert Assets
    INSERT INTO assets (name, type, status, description, location, service_id) VALUES
    ('Servidor CORPAC-01', 'hardware', 'operational', 'Servidor principal del sistema de vuelos', 'Sala de servidores A', vuelos_id),
    ('API Tracking', 'software', 'non_operational', 'API de seguimiento de carga', 'Virtual', carga_id),
    ('Router Principal', 'hardware', 'operational', 'Router principal de comunicaciones', 'Sala de comunicaciones', comunicaciones_id),
    ('Sistema Radar', 'hardware', 'maintenance', 'Sistema de radar para control de tráfico', 'Torre de control', control_id),
    ('Base de Datos Oracle', 'software', 'operational', 'Base de datos principal', 'Virtual', vuelos_id);
END $$;

-- Insert Incidents
INSERT INTO incidents (id, title, description, priority, status, type, category) VALUES
('INC001', 'Interrupción del sistema de tracking', 'Sistema de seguimiento de carga presenta interrupciones intermitentes', 'high', 'open', 'incident', 'software'),
('INC002', 'Consulta sobre estado de envío', 'Cliente solicita información sobre el estado de su envío', 'low', 'closed', 'incident', 'access'),
('REQ001', 'Solicitud de acceso a informe SLA', 'Solicitud de acceso a reportes de cumplimiento de SLA', 'medium', 'in_progress', 'request', 'access'),
('INC003', 'Falla en comunicaciones torre', 'Pérdida de comunicación con torre de control', 'critical', 'open', 'incident', 'network'),
('REQ002', 'Nuevo usuario sistema vuelos', 'Solicitud de creación de usuario para sistema de vuelos', 'medium', 'resolved', 'request', 'access');

-- Insert Audits
INSERT INTO audits (date, scope, result, status, recommendations) VALUES
('2025-05-15', 'Cumplimiento de SLAs', '90%', 'completed', ARRAY['Mejorar documentación de procesos', 'Implementar métricas adicionales de rendimiento']),
('2025-06-01', 'Disponibilidad del sistema', '95%', 'in_progress', ARRAY[]),
('2025-06-12', 'Tiempos de respuesta a incidentes', 'Programado', 'planned', ARRAY[]),
('2025-04-20', 'Seguridad de la información', '88%', 'completed', ARRAY['Actualizar políticas de seguridad', 'Capacitación en ciberseguridad']),
('2025-07-01', 'Gestión de cambios', 'Programado', 'planned', ARRAY[]);

-- Insert Non-conformities
INSERT INTO non_conformities (id, description, cause, corrective_action, category, severity, status) VALUES
('NC001', 'SLA de respuesta excedido', 'Ausencia de monitoreo en tiempo real', 'Implementar alerta automática', 'sla', 'major', 'open'),
('NC002', 'Registro incompleto en incidentes', 'Falta de capacitación del personal', 'Capacitación al equipo de soporte', 'process', 'minor', 'closed'),
('NC003', 'Documentación desactualizada', 'Falta de proceso de revisión', 'Establecer revisión trimestral', 'documentation', 'minor', 'in_progress'),
('NC004', 'Backup fallido', 'Error en configuración', 'Revisar y corregir configuración', 'iso_20000', 'major', 'open');

-- Insert Reports
INSERT INTO reports (id, name, type, format, description, date_from, date_to, status) VALUES
('REP001', 'Informe mensual de SLAs - Enero 2025', 'sla', 'PDF', 'Reporte mensual de cumplimiento de SLAs', '2025-01-01', '2025-01-31', 'completed'),
('REP002', 'Reporte de no conformidades Q1', 'non_conformities', 'Excel', 'Análisis de no conformidades del primer trimestre', '2025-01-01', '2025-03-31', 'completed'),
('REP003', 'Análisis de incidentes Q2', 'incidents', 'PDF', 'Reporte de incidentes del segundo trimestre', '2025-04-01', '2025-06-30', 'in_progress'),
('REP004', 'Inventario de activos', 'assets', 'Excel', 'Inventario completo de activos tecnológicos', '2025-01-01', '2025-06-30', 'completed');

-- Insert Risks
INSERT INTO risks (id, description, priority, category, mitigation, status, probability, impact) VALUES
('RSK001', 'Caída del servidor de seguimiento de carga', 'high', 'technical', 'Implementar redundancia y backup automático', 'open', 0.3, 0.8),
('RSK002', 'Errores en generación de reportes', 'medium', 'operational', 'Validación previa de datos y testing', 'mitigated', 0.4, 0.5),
('RSK003', 'Pérdida de comunicaciones críticas', 'high', 'security', 'Sistema de comunicaciones redundante', 'open', 0.2, 0.9),
('RSK004', 'Incumplimiento de normativas ISO', 'medium', 'compliance', 'Auditorías internas regulares', 'mitigated', 0.3, 0.6);

-- Insert Problems
INSERT INTO problems (id, description, root_cause, solution, priority, category, status) VALUES
('PRB001', 'Interrupciones frecuentes en la API de carga', 'Sobrecarga del servidor durante picos de tráfico', 'Escalado vertical de recursos y optimización de consultas', 'high', 'infrastructure', 'investigating'),
('PRB002', 'Errores en reportes PDF generados', 'Error de formato en plantillas', 'Validación de campos y actualización de plantillas', 'medium', 'application', 'resolved'),
('PRB003', 'Lentitud en sistema de vuelos', 'Base de datos no optimizada', 'Optimización de índices y consultas', 'medium', 'infrastructure', 'open'),
('PRB004', 'Fallos intermitentes en comunicaciones', NULL, NULL, 'high', 'network', 'open');