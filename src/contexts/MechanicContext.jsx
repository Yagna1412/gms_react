import React, { createContext, useContext, useState } from 'react';

const MechanicContext = createContext();

export const useMechanic = () => {
  const context = useContext(MechanicContext);
  if (!context) {
    throw new Error('useMechanic must be used within MechanicProvider');
  }
  return context;
};

export const MechanicProvider = ({ children }) => {
  const [currentMechanic] = useState({
    id: 'TECH/001',
    name: 'Rajesh Kumar',
    branch: 'Mumbai Main',
    specialization: 'Engine & Transmission'
  });

  // Assigned Jobs (only jobs assigned to current mechanic)
  const [jobs, setJobs] = useState([
    {
      id: 'JC/MUM/2024/0098',
      vehicleDetails: { make: 'Maruti Suzuki', model: 'Swift', regNo: 'MH02AB1234', odometer: 45000 },
      serviceRequirements: ['Engine Oil Change', 'Brake Pad Replacement', 'General Inspection'],
      complaints: ['Engine noise', 'Brake issue'],
      priority: 'Normal',
      status: 'In-Progress',
      progress: 65,
      estimatedTime: '4 hours',
      actualTime: '3.5 hours',
      startedAt: '2024-12-19 09:00',
      assignedDate: '2024-12-19',
      parts: [
        { name: 'Engine Oil 5W30', qty: 4, status: 'Issued' },
        { name: 'Brake Pads Front', qty: 1, status: 'Issued' }
      ],
      notes: [
        { time: '09:30', text: 'Started oil change', photos: 0 },
        { time: '11:00', text: 'Brake pads replaced successfully', photos: 2 }
      ],
      qcStatus: null
    },
    {
      id: 'JC/MUM/2024/0099',
      vehicleDetails: { make: 'Honda', model: 'City', regNo: 'MH03XY9012', odometer: 28000 },
      serviceRequirements: ['AC Service', 'AC Gas Refill'],
      complaints: ['AC not cooling'],
      priority: 'VIP',
      status: 'Assigned',
      progress: 0,
      estimatedTime: '3 hours',
      actualTime: null,
      startedAt: null,
      assignedDate: '2024-12-19',
      parts: [
        { name: 'AC Gas R134a', qty: 1, status: 'Pending' },
        { name: 'AC Filter', qty: 1, status: 'Pending' }
      ],
      notes: [],
      qcStatus: null
    },
    {
      id: 'JC/MUM/2024/0096',
      vehicleDetails: { make: 'Hyundai', model: 'i20', regNo: 'MH01CD5678', odometer: 32000 },
      serviceRequirements: ['Wheel Alignment', 'Tire Rotation'],
      complaints: ['Steering vibration'],
      priority: 'Normal',
      status: 'Completed',
      progress: 100,
      estimatedTime: '2 hours',
      actualTime: '1.8 hours',
      startedAt: '2024-12-18 14:00',
      completedAt: '2024-12-18 15:48',
      assignedDate: '2024-12-18',
      parts: [],
      notes: [
        { time: '14:15', text: 'Alignment completed', photos: 1 },
        { time: '15:30', text: 'Tire rotation done, ready for QC', photos: 0 }
      ],
      qcStatus: 'Pending'
    }
  ]);

  // Parts Requests
  const [partsRequests, setPartsRequests] = useState([
    {
      id: 'PR/MUM/2024/0045',
      jobCardId: 'JC/MUM/2024/0098',
      parts: [{ name: 'Brake Fluid', qty: 1 }],
      status: 'Pending',
      requestedAt: '2024-12-19 11:30',
      type: 'Additional'
    }
  ]);

//   const updatePartsRequest = (updatedRequest) => {
//   setPartsRequests(prev =>
//     prev.map(req =>
//       req.id === updatedRequest.id ? updatedRequest : req
//     )
//   );
// };

const updatePartsRequest = (updatedRequest) => {
  setPartsRequests(prev =>
    prev.map(req =>
      req.id === updatedRequest.id ? updatedRequest : req
    )
  );

 

  // ✅ IF STATUS IS RECEIVED → ALLOCATE PARTS TO JOB
  if (updatedRequest.status === 'Received') {
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === updatedRequest.jobCardId) {
          return {
            ...job,
            parts: [
              ...job.parts,
              ...updatedRequest.parts.map(p => ({
                name: p.name,
                qty: p.qty,
                status: 'Issued'
              }))
            ]
          };
        }
        return job;
      })
    );
  }
};


  // Performance Metrics (view-only, personal data)
  const [performanceMetrics] = useState({
    thisMonth: {
      jobsCompleted: 24,
      avgCompletionTime: '3.2 hours',
      qualityRating: 4.7,
      customerRating: 4.8,
      efficiencyRatio: 92,
      firstPassQC: 88
    },
    trends: {
      jobsCompleted: [18, 22, 24, 20, 26, 24],
      qualityRating: [4.5, 4.6, 4.6, 4.7, 4.8, 4.7]
    }
  });

  // Training & Certifications
  const [trainings] = useState([
    {
      id: 'TRN/001',
      title: 'Advanced Engine Diagnostics',
      status: 'In Progress',
      progress: 60,
      dueDate: '2024-12-31',
      materials: ['Video Tutorial', 'PDF Manual', 'Quiz']
    },
    {
      id: 'TRN/002',
      title: 'EV Battery Safety',
      status: 'Completed',
      progress: 100,
      completedDate: '2024-11-15',
      certificate: 'CERT/EV/001'
    }
  ]);

  const [certifications] = useState([
    {
      id: 'CERT/001',
      name: 'ASE Master Technician',
      issuedDate: '2023-06-15',
      expiryDate: '2026-06-15',
      status: 'Active'
    },
    {
      id: 'CERT/002',
      name: 'Hybrid Vehicle Specialist',
      issuedDate: '2024-01-10',
      expiryDate: '2025-12-31',
      status: 'Expiring Soon'
    }
  ]);

  // Job Operations
  const startJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'In-Progress', startedAt: new Date().toISOString(), progress: 10 }
        : job
    ));
  };

  const updateProgress = (jobId, progress, note) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const newNotes = note ? [...job.notes, { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), text: note, photos: 0 }] : job.notes;
        return { ...job, progress, notes: newNotes };
      }
      return job;
    }));
  };

  const completeJob = (jobId, finalNote) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const completedAt = new Date().toISOString();
        const startTime = new Date(job.startedAt);
        const endTime = new Date(completedAt);
        const actualTime = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(1);
        
        return {
          ...job,
          status: 'Completed',
          progress: 100,
          completedAt,
          actualTime: `${actualTime} hours`,
          notes: [...job.notes, { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), text: finalNote, photos: 0 }],
          qcStatus: 'Pending'
        };
      }
      return job;
    }));
  };

  // const submitForQC = (jobId) => {
  //   setJobs(jobs.map(job => 
  //     job.id === jobId 
  //       ? { ...job, qcStatus: 'Submitted', status: 'QC Pending' }
  //       : job
  //   ));
  // };

    const submitForQc = (jobId) => {

    setJobs(prevJobs =>
      prevJobs.map(job =>

        job.id === jobId
          ? {
              ...job,
              qcStatus: 'Submitted',
              status: 'QC Pending'
            }
          : job
      )
    );
  };

  const addNote = (jobId, note, photoCount = 0) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          notes: [...job.notes, { 
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), 
            text: note, 
            photos: photoCount 
          }]
        };
      }
      return job;
    }));
  };

  // Parts Operations
  const requestParts = (jobCardId, parts, type = 'Additional') => {
    const newRequest = {
      id: `PR/MUM/2024/${String(partsRequests.length + 46).padStart(4, '0')}`,
      jobCardId,
      parts,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      type
    };
    setPartsRequests([...partsRequests, newRequest]);
    return newRequest;
  };

  const acknowledgePartsReceipt = (requestId) => {
    setPartsRequests(partsRequests.map(req =>
      req.id === requestId ? { ...req, status: 'Received' } : req
    ));
  };

const value = {
  currentMechanic,
  jobs,
  partsRequests,
  performanceMetrics,
  trainings,
  certifications,
  startJob,
  updateProgress,
  completeJob,
  submitForQc,
  addNote,
  requestParts,
  acknowledgePartsReceipt,
  updatePartsRequest,
  
};

  return <MechanicContext.Provider value={value}>{children}</MechanicContext.Provider>;
};

