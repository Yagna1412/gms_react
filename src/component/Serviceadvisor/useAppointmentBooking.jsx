import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';
import { DEFAULT_TIME_SLOTS } from './data/mockData';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM_DATA = {
  customerId: '',
  customerName: '',
  vehicle: '',
  date: getTodayDate(),
  time: '',
  serviceType: '',
  technician: '',
  duration: '2 hours'
};

export function useAppointmentBooking() {
  const { appointments, customers, addAppointment, updateAppointment } = useServiceAdvisor();

  const [showModal, setShowModal] = useState(false);
  const [viewDate, setViewDate] = useState(getTodayDate());
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const filteredAppointments = useMemo(
    () => appointments.filter((apt) => apt.date === viewDate),
    [appointments, viewDate]
  );

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM_DATA, date: getTodayDate() });
  };

  const openBookingModal = () => setShowModal(true);
  const closeBookingModal = () => {
    setShowModal(false);
    resetForm();
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);

    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
      vehicle: customer?.vehicles?.[0]
        ? `${customer.vehicles[0].model} - ${customer.vehicles[0].regNo}`
        : ''
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.customerId || !formData.date || !formData.time || !formData.serviceType) {
      toast.error('Please fill all required fields');
      return;
    }

    addAppointment(formData);
    toast.success(`Appointment booked for ${formData.customerName}. Reminder will be sent 24h before.`);
    closeBookingModal();
  };

  const handleCancel = (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) {
      return;
    }

    updateAppointment(appointmentId, { status: 'Cancelled' });
    toast.success('Appointment cancelled');
  };

  const handleReschedule = (appointment) => {
    setFormData({
      customerId: appointment.customerId,
      customerName: appointment.customerName,
      vehicle: appointment.vehicle,
      date: appointment.date,
      time: appointment.time,
      serviceType: appointment.serviceType,
      technician: appointment.technician,
      duration: appointment.duration
    });
    setShowModal(true);
  };

  return {
    customers,
    filteredAppointments,
    formData,
    showModal,
    viewDate,
    minDate: getTodayDate(),
    timeSlots: DEFAULT_TIME_SLOTS,
    openBookingModal,
    closeBookingModal,
    setViewDate,
    updateFormField,
    handleCustomerChange,
    handleSubmit,
    handleCancel,
    handleReschedule
  };
}
