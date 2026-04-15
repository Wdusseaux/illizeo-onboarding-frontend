// Re-export all admin render functions from domain-specific files.
// This file acts as a single entry point for the main component.
import { createAdminDashboardSuivi } from './AdminDashboardSuivi';
import { createAdminParcoursDocs } from './AdminParcoursDocs';
import { createAdminWorkflowsTemplates } from './AdminWorkflowsTemplates';
import { createAdminNPSContrats } from './AdminNPSContrats';
import { createAdminCooptation } from './AdminCooptation';
import { createAdminIntegrations } from './AdminIntegrations';
import { createAdminSidebarComponent } from './AdminSidebarComponent';

/**
 * Creates all admin render functions by delegating to domain-specific factories.
 */
export function createAdminRenders(ctx: any) {
  const adminDashboardSuivi = createAdminDashboardSuivi(ctx);
  const adminParcoursDocs = createAdminParcoursDocs(ctx);
  const adminWorkflowsTemplates = createAdminWorkflowsTemplates(ctx);
  const adminNPSContrats = createAdminNPSContrats(ctx);
  const adminCooptation = createAdminCooptation(ctx);
  const adminIntegrations = createAdminIntegrations(ctx);
  const adminSidebarComponent = createAdminSidebarComponent(ctx);

  return {
    ...adminDashboardSuivi,
    ...adminParcoursDocs,
    ...adminWorkflowsTemplates,
    ...adminNPSContrats,
    ...adminCooptation,
    ...adminIntegrations,
    renderSidebar_admin: adminSidebarComponent.renderSidebar_admin,
  };
}
