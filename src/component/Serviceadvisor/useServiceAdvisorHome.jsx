import { useMemo } from 'react';
import { useServiceAdvisor } from './useServiceAdvisor';

export function useServiceAdvisorHome() {
  const { appointments, estimations, jobCards, complaints, currentBranch } = useServiceAdvisor();

  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === today),
    [appointments, today]
  );

  const scheduledToday = useMemo(
    () => todayAppointments.filter((appointment) => appointment.status === 'Scheduled').length,
    [todayAppointments]
  );

  const inProgressToday = useMemo(
    () => todayAppointments.filter((appointment) => appointment.status === 'In-Progress').length,
    [todayAppointments]
  );

  const pendingEstimations = useMemo(
    () => estimations.filter((estimation) => estimation.status === 'Pending').length,
    [estimations]
  );

  const jobsInProgress = useMemo(
    () => jobCards.filter((jobCard) => jobCard.status === 'In-Progress').length,
    [jobCards]
  );

  const pendingDeliveries = useMemo(
    () => jobCards.filter((jobCard) => jobCard.status === 'Quality Check' || jobCard.status === 'Ready for Delivery').length,
    [jobCards]
  );

  const activeComplaints = useMemo(
    () => complaints.filter((complaint) => complaint.status !== 'Resolved').length,
    [complaints]
  );

  const pendingEstimationItems = useMemo(
    () => estimations.filter((estimation) => estimation.status === 'Pending').slice(0, 3),
    [estimations]
  );

  const activeComplaintItems = useMemo(
    () => complaints.filter((complaint) => complaint.status !== 'Resolved'),
    [complaints]
  );

  const totalEstimationValueK = useMemo(() => {
    const total = estimations.reduce((sum, estimation) => sum + estimation.totalAmount, 0);
    return (total / 1000).toFixed(0);
  }, [estimations]);

  return {
    currentBranch,
    estimations,
    jobCards,
    todayAppointments,
    scheduledToday,
    inProgressToday,
    pendingEstimations,
    jobsInProgress,
    pendingDeliveries,
    activeComplaints,
    pendingEstimationItems,
    activeComplaintItems,
    totalEstimationValueK
  };
}
