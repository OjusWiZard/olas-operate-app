import { MiddlewareServiceTemplate } from '@/client/types';
import { SERVICE_TEMPLATES } from '@/constants/serviceTemplates';

export const useServiceTemplates = () => {
  const getServiceTemplates = (): MiddlewareServiceTemplate[] => SERVICE_TEMPLATES;
  const getServiceTemplate = (hash: string): MiddlewareServiceTemplate | undefined =>
    SERVICE_TEMPLATES.find((template) => template.hash === hash);

  return {
    getServiceTemplate,
    getServiceTemplates,
    serviceTemplate: SERVICE_TEMPLATES[0], // Default to the first template
  };
};
