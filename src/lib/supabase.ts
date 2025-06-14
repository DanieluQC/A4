import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface SLA {
  id: string;
  name: string;
  target: number;
  current_value: number;
  status: 'compliant' | 'non_compliant' | 'at_risk';
  last_updated: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Audit {
  id: string;
  date: string;
  scope: string;
  result: string;
  status: 'planned' | 'in_progress' | 'completed';
  recommendations: string[];
  created_at: string;
}

export interface NonConformity {
  id: string;
  description: string;
  cause: string;
  corrective_action: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
}

export interface Risk {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'closed';
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'service';
  status: 'operational' | 'maintenance' | 'non_operational';
  service_id?: string;
  created_at: string;
}

export interface Problem {
  id: string;
  description: string;
  root_cause?: string;
  solution?: string;
  status: 'open' | 'investigating' | 'resolved';
  created_at: string;
}