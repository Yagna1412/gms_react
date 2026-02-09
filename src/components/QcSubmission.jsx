import React, { useState } from 'react';
import { useMechanic } from '../contexts/MechanicContext';
import { toast } from 'sonner';
import { CheckCircle, Send, AlertCircle } from 'lucide-react';

export default function QCSubmission() {

  const { jobs, submitForQc } = useMechanic();

  // ✅ Checklist State
  const checklistItems = [
    'All service requirements completed',
    'No loose parts or tools',
    'Cleaned work area',
    'Tested all systems',
    'Documented all work',
    'Returned unused parts'
  ];

  const [checklist, setChecklist] = useState(
    checklistItems.map(() => false)
  );


  //  Handle Checkbox
  const toggleCheck = (index) => {

    setChecklist(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });

  };


  //  Submit Handler
  const handleSubmit = (jobId) => {
    const allChecked = checklist.every(item => item === true);

    if (!allChecked) {
      toast.error('Please complete all checklist items before submitting');
      return;
    }


    submitForQc(jobId);

    toast.success('Job submitted for Quality Control inspection');

    // Reset checklist after submit
    setChecklist(checklistItems.map(() => false));
  };


  // Filters
  const completedJobs = jobs.filter(
    j => j.status === 'Completed' && j.qcStatus === 'Pending'
  );

  const qcSubmittedJobs = jobs.filter(
    j => j.qcStatus === 'Submitted'
  );


  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">QC Submission</h1>
        <p className="text-gray-600 text-sm">
          Submit completed jobs for quality control inspection
        </p>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <span className="text-sm text-gray-600">Ready for QC</span>
          <div className="text-3xl font-bold mt-2">
            {completedJobs.length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <span className="text-sm text-gray-600">QC Pending</span>
          <div className="text-3xl font-bold mt-2">
            {qcSubmittedJobs.length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <span className="text-sm text-gray-600">First Pass Rate</span>
          <div className="text-3xl font-bold mt-2">88%</div>
        </div>

      </div>


      {/* Main Section */}
      <div className="grid grid-cols-2 gap-6">


        {/* Checklist */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">

          <h2 className="font-bold mb-4">Self-Inspection Checklist</h2>

          <div className="space-y-3">

            {checklistItems.map((item, idx) => (

              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >

                <input
                  type="checkbox"
                  checked={checklist[idx]}
                  onChange={() => toggleCheck(idx)}
                  className="w-5 h-5"
                />

                <span className="text-sm text-gray-700">
                  {item}
                </span>

              </div>

            ))}

          </div>
        </div>


        {/* Ready Jobs */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">

          <h2 className="font-bold mb-4">
            Ready for QC Submission
          </h2>

          <div className="space-y-3">

            {completedJobs.map(job => (

              <div
                key={job.id}
                className="p-4 bg-blue-50 border rounded-lg"
              >

                <div className="flex justify-between mb-3">

                  <div>
                    <div className="font-semibold">
                      {job.id}
                    </div>

                    <div className="text-sm text-gray-600">
                      {job.vehicleDetails.make}{" "}
                      {job.vehicleDetails.model}
                    </div>
                  </div>

                  <CheckCircle className="text-blue-600" />

                </div>

                <button
                  onClick={() => handleSubmit(job.id)}
                  disabled={!checklist.every(v => v)}
                  className={`w-full flex items-center justify-center gap-2
                    px-4 py-2 rounded-lg font-medium
                    ${checklist.every(v => v)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  <Send size={16} />
                  Submit for QC
                </button>

              </div>

            ))}

            {completedJobs.length === 0 && (

              <div className="text-center py-8 text-gray-500 text-sm">
                No jobs ready for QC submission
              </div>

            )}

          </div>
        </div>

      </div>


      {/* QC Pending */}
      {qcSubmittedJobs.length > 0 && (

        <div className="mt-6 bg-white rounded-xl p-6 border shadow-sm">

          <h2 className="font-bold mb-4">
            QC Pending Jobs
          </h2>

          <div className="space-y-3">

            {qcSubmittedJobs.map(job => (

              <div
                key={job.id}
                className="p-4 bg-yellow-50 border rounded-lg
                           flex justify-between items-center"
              >

                <div>
                  <div className="font-semibold">
                    {job.id}
                  </div>

                  <div className="text-sm text-gray-600">
                    {job.vehicleDetails.make}{" "}
                    {job.vehicleDetails.model}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-yellow-700 text-sm">
                  <AlertCircle size={16} />
                  Awaiting QC Review
                </div>

              </div>

            ))}

          </div>
        </div>

      )}

    </div>
  );
}

               