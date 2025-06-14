import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  BarChart3,
  BookOpen,
  Target,
  AlertTriangle,
  ClipboardCheck,
  XCircle,
  FileText,
  Shield,
  HardDrive,
  Search,
  Award,
  CheckCircle,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Catálogo de Servicios', href: '/services', icon: BookOpen },
  { name: 'SLAs', href: '/slas', icon: Target },
  { name: 'Incidentes y Solicitudes', href: '/incidents', icon: AlertTriangle },
  { name: 'Auditorías', href: '/audits', icon: ClipboardCheck },
  { name: 'No Conformidades', href: '/non-conformities', icon: XCircle },
  { name: 'Reportes', href: '/reports', icon: FileText },
  { name: 'Riesgos', href: '/risks', icon: Shield },
  { name: 'Activos', href: '/assets', icon: HardDrive },
  { name: 'Problemas', href: '/problems', icon: Search },
  { name: 'ISO 20000-1', href: '/iso-20000', icon: Award },
  { name: 'ISO 9001', href: '/iso-9001', icon: CheckCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50',
          'lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold">Menú</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};