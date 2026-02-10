// ===== app/data/menuData.ts =====
import type { MenuData } from '~/types/menu';

export const getMainMenuData = (): MenuData => ({
  title: 'CardDemo - Menú principal',
  subtitle: 'Funciones del back-office del sistema',
  transactionId: 'CC00',
  programName: 'COMEN01',
  userRole: 'back-office',
  options: [
    {
      id: 'account-view',
      label: 'Consulta de cuenta',
      description: 'Consultar información de la cuenta',
      path: '/accounts/view',
    },
    {
      id: 'account-update',
      label: 'Actualización de cuenta',
      description: 'Modificar información de la cuenta',
      path: '/accounts/update',
    },
    {
      id: 'credit-card-list',
      label: 'Listado de tarjetas',
      description: 'Listar todas las tarjetas de crédito',
      path: '/cards/list',
    },
    {
      id: 'credit-card-view',
      label: 'Detalle de tarjeta',
      description: 'Ver datos de la tarjeta de crédito',
      path: '/cards/view',
    },
    {
      id: 'credit-card-update',
      label: 'Actualización de tarjeta',
      description: 'Modificar tarjeta de crédito',
      path: '/cards/update',
    },
    {
      id: 'transaction-list',
      label: 'Listado de transacciones',
      description: 'Listar todas las transacciones',
      path: '/transactions/list',
    },
    {
      id: 'transaction-view',
      label: 'Detalle de transacción',
      description: 'Ver detalles de la transacción',
      path: '/transactions/view',
    },
    {
      id: 'transaction-add',
      label: 'Agregar transacción',
      description: 'Registrar nueva transacción',
      path: '/transactions/add',
    },
    {
      id: 'transaction-reports',
      label: 'Reportes de transacciones',
      description: 'Generar reportes de transacciones',
      path: '/reports/transactions',
    },
    {
      id: 'bill-payment',
      label: 'Pago de servicios',
      description: 'Procesar pagos de servicios',
      path: '/payments/bills',
    },
  ],
});

export const getAdminMenuData = (): MenuData => ({
  title: 'CardDemo - Administration Menu',
  subtitle: 'Security and Administration Functions',
  transactionId: 'CADM',
  programName: 'COADM01',
  userRole: 'admin',
  options: [
    {
      id: 'user-list',
      label: 'User List (Security)',
      description: 'List all system users',
      path: '/admin/users/list',
      adminOnly: true,
    },
    {
      id: 'user-add',
      label: 'User Add (Security)',
      description: 'Add new user to system',
      path: '/admin/users/add',
      adminOnly: true,
    },
    {
      id: 'user-update',
      label: 'User Update (Security)',
      description: 'Update user information',
      path: '/admin/users/update',
      adminOnly: true,
    },
    {
      id: 'user-delete',
      label: 'User Delete (Security)',
      description: 'Delete user from system',
      path: '/admin/users/delete',
      adminOnly: true,
    },
  ],
});
