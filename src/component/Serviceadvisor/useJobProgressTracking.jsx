import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

export function useJobProgressTracking() {
  const { jobCards, deleteJobCard } = useServiceAdvisor();
  const [viewJob, setViewJob] = useState(null);

  const activeJobs = useMemo(
    () => jobCards.filter((jc) => jc.status === 'In-Progress' || jc.status === 'Quality Check'),
    [jobCards]
  );

  const inProgressCount = useMemo(
    () => jobCards.filter((j) => j.status === 'In-Progress').length,
    [jobCards]
  );

  const qualityCheckCount = useMemo(
    () => jobCards.filter((j) => j.status === 'Quality Check').length,
    [jobCards]
  );

  const openJob = (job) => setViewJob(job);
  const closeJob = () => setViewJob(null);

  const handleDelete = (id) => {
    if (!window.confirm(`Delete Job Card ${id}?`)) {
      return;
    }

    deleteJobCard(id);
    toast.success('Job Card deleted');
  };

  return {
    activeJobs,
    viewJob,
    inProgressCount,
    qualityCheckCount,
    openJob,
    closeJob,
    handleDelete
  };
}
