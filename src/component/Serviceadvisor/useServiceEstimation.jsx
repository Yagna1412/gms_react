import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

const INITIAL_FORM_DATA = {
  jobCardId: '',
  customerId: '',
  customerName: '',
  services: [],
  parts: [],
  laborCharges: 0,
  discount: 0
};

export function useServiceEstimation() {
  const { estimations, addEstimation, updateEstimation, jobCards, customers } = useServiceAdvisor();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData(INITIAL_FORM_DATA);
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer ? customer.name : ''
    }));
  };

  const handleApprove = (id) => {
    updateEstimation(id, { status: 'Approved' });
    toast.success('Estimation approved by customer (OTP verified)');
  };

  const handleSend = (estimation) => {
    toast.success(`Estimation sent to ${estimation.customerName} via WhatsApp & Email`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.jobCardId || !formData.customerId) {
      toast.error('Please select job card and customer');
      return;
    }

    const servicesTotal = formData.services.reduce((sum, service) => sum + (service.price * service.qty), 0);
    const partsTotal = formData.parts.reduce((sum, part) => sum + (part.price * part.qty), 0);
    const subtotal = servicesTotal + partsTotal + parseFloat(formData.laborCharges || 0);
    const discountAmount = (subtotal * parseFloat(formData.discount || 0)) / 100;
    const afterDiscount = subtotal - discountAmount;
    const tax = (afterDiscount * 18) / 100;
    const totalAmount = afterDiscount + tax;

    const estimationData = {
      ...formData,
      services: [{ name: 'General Service', price: 3000, qty: 1 }],
      parts: [{ name: 'Engine Oil', price: 500, qty: 2, stock: 20 }],
      laborCharges: parseFloat(formData.laborCharges) || 1000,
      discount: parseFloat(formData.discount) || 0,
      discountApproved: parseFloat(formData.discount) <= 15,
      tax: 18,
      totalAmount
    };

    addEstimation(estimationData);

    if (parseFloat(formData.discount) > 15) {
      toast.warning('Estimation created! Discount > 15% requires Admin approval.');
    } else {
      toast.success('Estimation created successfully! Valid for 7 days.');
    }

    closeModal();
  };

  const pendingCount = useMemo(
    () => estimations.filter((estimation) => estimation.status === 'Pending').length,
    [estimations]
  );

  const approvedCount = useMemo(
    () => estimations.filter((estimation) => estimation.status === 'Approved').length,
    [estimations]
  );

  const totalValueText = useMemo(() => {
    const total = estimations.reduce((sum, estimation) => sum + estimation.totalAmount, 0);
    return `${(total / 1000).toFixed(0)}K`;
  }, [estimations]);

  return {
    estimations,
    jobCards,
    customers,
    showModal,
    formData,
    pendingCount,
    approvedCount,
    totalValueText,
    openModal,
    closeModal,
    updateFormField,
    handleCustomerChange,
    handleApprove,
    handleSend,
    handleSubmit
  };
}
