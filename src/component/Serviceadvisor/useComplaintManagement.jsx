import { useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

const INITIAL_FORM_DATA = {
  customerId: '',
  customerName: '',
  jobCardId: '',
  category: 'Service Quality',
  severity: 'Low',
  description: '',
  department: 'Operations'
};

export function useComplaintManagement() {
  const { complaints, addComplaint, updateComplaint, deleteComplaint } = useServiceAdvisor();

  const [showModal, setShowModal] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData(INITIAL_FORM_DATA);
  };

  const openComplaint = (complaint) => setViewComplaint(complaint);
  const closeComplaint = () => setViewComplaint(null);

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.customerId || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    addComplaint({
      ...formData,
      status: 'Pending',
      filedDate: new Date().toISOString().split('T')[0]
    });

    toast.success('Complaint registered successfully');
    closeModal();
  };

  const handleEscalate = (id) => {
    updateComplaint(id, { status: 'Escalated' });
    toast.success('Complaint escalated to management');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    deleteComplaint(id);
    toast.success('Complaint deleted successfully');
  };

  const getSeverityColor = (severity) => ({
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-blue-100 text-blue-700'
  }[severity]);

  return {
    complaints,
    showModal,
    viewComplaint,
    formData,
    getSeverityColor,
    openModal,
    closeModal,
    openComplaint,
    closeComplaint,
    updateFormField,
    handleSubmit,
    handleEscalate,
    handleDelete
  };
}
