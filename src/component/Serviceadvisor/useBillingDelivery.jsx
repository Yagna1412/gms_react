import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

export function useBillingDelivery() {
  const { invoices, jobCards } = useServiceAdvisor();
  const [viewInvoice, setViewInvoice] = useState(null);

  const readyForDelivery = useMemo(
    () => jobCards.filter((jc) => jc.status === 'Quality Check' || jc.status === 'Ready for Delivery'),
    [jobCards]
  );

  const handleViewInvoice = (invoice) => {
    setViewInvoice(invoice);
  };

  const closeInvoice = () => {
    setViewInvoice(null);
  };

  const handleDelivery = (invoice) => {
    toast.success(`Vehicle for Job Card ${invoice.jobCardId} marked as delivered`);
  };

  return {
    invoices,
    readyForDelivery,
    viewInvoice,
    handleViewInvoice,
    closeInvoice,
    handleDelivery
  };
}
