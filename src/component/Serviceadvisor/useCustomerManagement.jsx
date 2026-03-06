import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

const INITIAL_FORM_DATA = {
  name: '',
  phone: '',
  email: '',
  address: '',
  type: 'Regular'
};

const INITIAL_VEHICLE_DATA = {
  make: '',
  model: '',
  year: '',
  regNo: '',
  vin: ''
};

export function useCustomerManagement() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, addVehicleToCustomer, currentBranch } = useServiceAdvisor();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [vehicleData, setVehicleData] = useState(INITIAL_VEHICLE_DATA);

  const filteredCustomers = useMemo(() => customers.filter((cust) => {
    const matchesSearch = cust.name.toLowerCase().includes(searchTerm.toLowerCase())
      || cust.phone.includes(searchTerm)
      || cust.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || cust.type === typeFilter;
    const matchesBranch = cust.branch === currentBranch;
    return matchesSearch && matchesType && matchesBranch;
  }), [customers, searchTerm, typeFilter, currentBranch]);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
    setShowModal(true);
  };

  const closeCustomerModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const openViewCustomer = (customer) => setViewingCustomer(customer);
  const closeViewCustomer = () => setViewingCustomer(null);

  const openVehicleModal = (customer) => {
    setSelectedCustomer(customer);
    setShowVehicleModal(true);
  };

  const closeVehicleModal = () => {
    setShowVehicleModal(false);
    setSelectedCustomer(null);
    setVehicleData(INITIAL_VEHICLE_DATA);
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateVehicleField = (field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (customer) => {
    setIsEditing(true);
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      type: customer.type
    });
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }
    deleteCustomer(id);
    toast.success('Customer removed successfully');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    if (isEditing) {
      updateCustomer(editingId, formData);
      toast.success(`Customer "${formData.name}" updated successfully!`);
    } else {
      const duplicatePhone = customers.find((cust) => cust.phone === formData.phone);
      const duplicateEmail = customers.find((cust) => cust.email === formData.email);

      if (duplicatePhone) {
        toast.error('Customer with this phone number already exists');
        return;
      }

      if (duplicateEmail) {
        toast.error('Customer with this email already exists');
        return;
      }

      addCustomer({ ...formData, vehicles: [] });
      toast.success(`Customer "${formData.name}" registered successfully! Welcome SMS sent.`);
    }

    closeCustomerModal();
  };

  const handleAddVehicle = (event) => {
    event.preventDefault();
    if (!vehicleData.make || !vehicleData.model || !vehicleData.regNo) {
      toast.error('Please fill all required vehicle fields');
      return;
    }
    addVehicleToCustomer(selectedCustomer.id, vehicleData);
    toast.success('Vehicle added successfully');
    closeVehicleModal();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'VIP': return 'bg-purple-50 text-purple-700';
      case 'Premium': return 'bg-blue-50 text-blue-700';
      case 'Regular': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return {
    currentBranch,
    searchTerm,
    typeFilter,
    showModal,
    viewingCustomer,
    showVehicleModal,
    selectedCustomer,
    isEditing,
    formData,
    vehicleData,
    filteredCustomers,
    getTypeColor,
    setSearchTerm,
    setTypeFilter,
    openCreateModal,
    closeCustomerModal,
    openViewCustomer,
    closeViewCustomer,
    openVehicleModal,
    closeVehicleModal,
    updateFormField,
    updateVehicleField,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleAddVehicle
  };
}
