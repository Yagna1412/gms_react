import { useContext } from 'react';
import { ServiceAdvisorContext } from './ServiceAdvisorContextObject';

export function useServiceAdvisor() {
  const context = useContext(ServiceAdvisorContext);

  if (!context) {
    throw new Error('useServiceAdvisor must be used within ServiceAdvisorProvider');
  }

  return context;
}
