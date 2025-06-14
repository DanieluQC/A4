import { format, subDays, subWeeks } from 'date-fns';

// Mock data for development
export const mockServices = [
  {
    id: '1',
    name: 'Sistema de Gestión de Vuelos',
    description: 'Sistema principal para la gestión y control de operaciones de vuelo',
    status: 'active' as const,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Plataforma de Comunicaciones',
    description: 'Sistema de comunicaciones aeroportuarias integrado',
    status: 'active' as const,
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'Sistema de Navegación',
    description: 'Sistema de ayudas a la navegación aérea',
    status: 'inactive' as const,
    created_at: '2024-02-01T10:00:00Z'
  }
];

export const mockSLAs = [
  {
    id: '1',
    name: 'Disponibilidad Sistema Vuelos',
    target: 99.9,
    current_value: 99.8,
    status: 'at_risk' as const,
    last_updated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '2',
    name: 'Tiempo Respuesta Comunicaciones',
    target: 2.0,
    current_value: 1.8,
    status: 'compliant' as const,
    last_updated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '3',
    name: 'Resolución Incidentes Críticos',
    target: 4.0,
    current_value: 5.2,
    status: 'non_compliant' as const,
    last_updated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
];

export const mockIncidents = [
  {
    id: 'INC001',
    title: 'Interrupción del sistema de tracking',
    description: 'Sistema de seguimiento de carga presenta interrupciones intermitentes',
    priority: 'high' as const,
    status: 'open' as const,
    type: 'incident' as const,
    created_at: '2025-06-10T10:00:00Z',
    updated_at: '2025-06-10T10:00:00Z'
  },
  {
    id: 'INC002',
    title: 'Consulta sobre estado de envío',
    description: 'Cliente solicita información sobre el estado de su envío',
    priority: 'low' as const,
    status: 'closed' as const,
    type: 'incident' as const,
    created_at: '2025-06-09T10:00:00Z',
    updated_at: '2025-06-09T15:00:00Z'
  },
  {
    id: 'REQ001',
    title: 'Solicitud de acceso a informe SLA',
    description: 'Solicitud de acceso a reportes de cumplimiento de SLA',
    priority: 'medium' as const,
    status: 'in_progress' as const,
    type: 'request' as const,
    created_at: '2025-06-11T10:00:00Z',
    updated_at: '2025-06-11T14:00:00Z'
  }
];

export const mockAudits = [
  {
    id: '1',
    date: '2025-05-15',
    scope: 'Cumplimiento de SLAs',
    result: '90%',
    status: 'completed' as const,
    recommendations: [
      'Mejorar documentación de procesos',
      'Implementar métricas adicionales de rendimiento'
    ],
    created_at: '2025-05-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2025-06-01',
    scope: 'Disponibilidad del sistema',
    result: '95%',
    status: 'in_progress' as const,
    recommendations: [],
    created_at: '2025-06-01T10:00:00Z'
  },
  {
    id: '3',
    date: '2025-06-12',
    scope: 'Tiempos de respuesta a incidentes',
    result: 'Programado',
    status: 'planned' as const,
    recommendations: [],
    created_at: '2025-06-12T10:00:00Z'
  }
];

export const mockNonConformities = [
  {
    id: 'NC001',
    description: 'SLA de respuesta excedido',
    cause: 'Ausencia de monitoreo real',
    corrective_action: 'Implementar alerta automática',
    status: 'open' as const,
    created_at: '2025-06-01T10:00:00Z'
  },
  {
    id: 'NC002',
    description: 'Registro incompleto en incidentes',
    cause: 'Falta de capacitación',
    corrective_action: 'Capacitación al equipo',
    status: 'closed' as const,
    created_at: '2025-05-15T10:00:00Z'
  }
];

export const mockReports = [
  {
    id: 'REP001',
    name: 'Informe mensual de SLAs',
    date: '2025-06-01',
    format: 'PDF' as const,
    status: 'completed' as const,
    created_at: '2025-06-01T10:00:00Z'
  },
  {
    id: 'REP002',
    name: 'Reporte de no conformidades',
    date: '2025-06-05',
    format: 'Excel' as const,
    status: 'completed' as const,
    created_at: '2025-06-05T10:00:00Z'
  },
  {
    id: 'REP003',
    name: 'Análisis de incidentes Q2',
    date: '2025-06-10',
    format: 'PDF' as const,
    status: 'in_progress' as const,
    created_at: '2025-06-10T10:00:00Z'
  }
];

export const mockRisks = [
  {
    id: 'RSK001',
    description: 'Caída del servidor de seguimiento de carga',
    priority: 'high' as const,
    mitigation: 'Implementar redundancia',
    status: 'open' as const,
    created_at: '2025-06-01T10:00:00Z'
  },
  {
    id: 'RSK002',
    description: 'Errores en generación de reportes',
    priority: 'medium' as const,
    mitigation: 'Validación previa de datos',
    status: 'mitigated' as const,
    created_at: '2025-05-20T10:00:00Z'
  }
];

export const mockAssets = [
  {
    id: '1',
    name: 'Servidor CORPAC-01',
    type: 'hardware' as const,
    status: 'operational' as const,
    service_id: '1',
    service_name: 'Seguimiento de Carga',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'API Tracking',
    type: 'software' as const,
    status: 'non_operational' as const,
    service_id: '2',
    service_name: 'Portal de Clientes',
    created_at: '2024-02-01T10:00:00Z'
  }
];

export const mockProblems = [
  {
    id: 'PRB001',
    description: 'Interrupciones frecuentes en la API de carga',
    root_cause: 'Sobrecarga del servidor',
    solution: 'Escalado vertical de recursos',
    status: 'open' as const,
    created_at: '2025-06-01T10:00:00Z'
  },
  {
    id: 'PRB002',
    description: 'Errores en reportes PDF generados',
    root_cause: 'Error de formato',
    solution: 'Validación de campos',
    status: 'resolved' as const,
    created_at: '2025-05-15T10:00:00Z'
  }
];

export const mockISO20000Requirements = [
  {
    id: '8.2.4',
    title: 'Catálogo de Servicios',
    status: 'compliant' as const,
    source: 'Módulo de Catálogo de Servicios',
    redirect: '/services'
  },
  {
    id: '8.3.3',
    title: 'SLAs documentados',
    status: 'in_progress' as const,
    source: 'Módulo SLAs y auditorías',
    redirect: '/slas'
  },
  {
    id: '8.6.1',
    title: 'Incidentes',
    status: 'compliant' as const,
    source: 'Módulo de Incidentes',
    redirect: '/incidents'
  },
  {
    id: '9.2',
    title: 'Auditorías realizadas',
    status: 'compliant' as const,
    source: 'Auditorías registradas',
    redirect: '/audits'
  }
];

export const mockISO9001Requirements = [
  {
    id: '6.1',
    title: 'Gestión de Riesgos',
    status: 'compliant' as const,
    source: 'Módulo de Riesgos',
    redirect: '/risks'
  },
  {
    id: '9.1',
    title: 'Evaluación de desempeño',
    status: 'in_progress' as const,
    source: 'KPIs del Dashboard',
    redirect: '/'
  },
  {
    id: '9.2',
    title: 'Auditorías internas',
    status: 'compliant' as const,
    source: 'Módulo Auditorías',
    redirect: '/audits'
  },
  {
    id: '10.2',
    title: 'Acciones correctivas',
    status: 'compliant' as const,
    source: 'No conformidades',
    redirect: '/non-conformities'
  }
];

export const mockKPIs = {
  systemAvailability: 99.8,
  activeIncidents: 2,
  slaCompliance: 90,
  customerSatisfaction: 92
};

// Chart data
export const slaComplianceData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Cumplimiento SLA (%)',
      data: [88, 92, 89, 94, 90, 90],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
};

export const incidentResolutionData = {
  labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  datasets: [
    {
      label: 'Incidentes Resueltos',
      data: [12, 19, 15, 17],
      backgroundColor: '#22c55e',
    },
    {
      label: 'Incidentes Pendientes',
      data: [3, 2, 4, 2],
      backgroundColor: '#dc2626',
    },
  ],
};