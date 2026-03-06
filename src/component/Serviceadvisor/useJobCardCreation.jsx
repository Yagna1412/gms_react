import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

const INITIAL_FORM_DATA = {
  customerId: '',
  customerName: '',
  vehicle: '',
  complaints: '',
  odometer: '',
  priority: 'Normal',
  technician: '',
  serviceAdvisor: 'Current User'
};

export function useJobCardCreation() {
  const { jobCards, customers, addJobCard, updateJobCard, deleteJobCard } = useServiceAdvisor();
  const [showModal, setShowModal] = useState(false);
  const [viewingJobCard, setViewingJobCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const filteredJobCards = useMemo(() => jobCards.filter((jc) =>
    jc.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    || jc.id.toLowerCase().includes(searchTerm.toLowerCase())
    || jc.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  ), [jobCards, searchTerm]);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const openJobDetails = (jobCard) => setViewingJobCard(jobCard);
  const closeJobDetails = () => setViewingJobCard(null);

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((entry) => entry.id === customerId);
    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
      vehicle: customer?.vehicles?.[0] ? `${customer.vehicles[0].model} - ${customer.vehicles[0].regNo}` : ''
    }));
  };

  const handleEdit = (jobCard) => {
    setIsEditing(true);
    setEditingId(jobCard.id);
    setFormData({
      customerId: jobCard.customerId,
      customerName: jobCard.customerName,
      vehicle: jobCard.vehicle,
      complaints: Array.isArray(jobCard.complaints) ? jobCard.complaints.join(', ') : jobCard.complaints,
      odometer: jobCard.odometer || '',
      priority: jobCard.priority,
      technician: jobCard.technician || '',
      serviceAdvisor: jobCard.serviceAdvisor || 'Current User'
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Are you sure you want to delete Job Card ${id}?`)) {
      return;
    }
    deleteJobCard(id);
    toast.success(`Job Card ${id} deleted successfully`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.customerId || !formData.complaints) {
      toast.error('Please fill all required fields');
      return;
    }

    const existingJob = jobCards.find((job) => job.id === editingId);
    const processedData = {
      ...formData,
      status: isEditing ? existingJob?.status : 'In-Progress',
      progress: isEditing ? existingJob?.progress : 0,
      complaints: formData.complaints.split(',').map((entry) => entry.trim())
    };

    if (isEditing) {
      updateJobCard(editingId, processedData);
      toast.success(`Job Card ${editingId} updated successfully!`);
    } else {
      addJobCard(processedData);
      toast.success('New Job Card created successfully!');
    }

    closeModal();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'VIP': return 'bg-purple-50 text-purple-700';
      case 'Urgent': return 'bg-red-50 text-red-700';
      case 'High': return 'bg-orange-50 text-orange-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };

  return {
    jobCards,
    customers,
    showModal,
    viewingJobCard,
    searchTerm,
    isEditing,
    formData,
    filteredJobCards,
    getPriorityColor,
    setSearchTerm,
    openCreateModal,
    closeModal,
    openJobDetails,
    closeJobDetails,
    updateFormField,
    handleCustomerChange,
    handleEdit,
    handleDelete,
    handleSubmit
  };
}
