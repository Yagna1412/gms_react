import React, { useState, useEffect } from 'react';
import { useMechanic } from '../contexts/MechanicContext';
import { toast } from 'sonner';
import { Play, Check, Activity, Plus } from 'lucide-react';

export default function JobExecution() {
  const { jobs, startJob, updateProgress, completeJob } = useMechanic();

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [progressNote, setProgressNote] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [localChecklist, setLocalChecklist] = useState([]);
  const [liveNotes, setLiveNotes] = useState([]);

  const activeJobs = jobs.filter(
    j => j.status === 'Assigned' || j.status === 'In-Progress'
  );

  const job = jobs.find(j => j.id === selectedJobId);

  /* ----- INITIALIZE CHECKLIST WHEN JOB CHANGES ------ */
  useEffect(() => {
    if (!job) {
      setLocalChecklist([]);
      setLiveNotes([]);
      return;
    }

    if (job.checklist?.length) {
      setLocalChecklist(
        job.checklist.map(item => ({
          label: item.label,
          done: !!item.done,
        }))
      );
    } else if (job.serviceRequirements?.length) {
      setLocalChecklist(
        job.serviceRequirements.map(item => ({
          label: item,
          done: false,
        }))
      );
    } else {
      setLocalChecklist([]);
    }

    setLiveNotes([]);
  }, [job?.id]);

  /* ----- AUTO PROGRESS + LIVE NOTES FROM CHECKLIST ---- */
  useEffect(() => {
    if (!job || !localChecklist.length) return;

    const total = localChecklist.length;
    const completed = localChecklist.filter(i => i.done).length;
    const percent = Math.round((completed / total) * 100);

    updateProgress(job.id, percent, `Checklist: ${completed}/${total}`);

    const notes = localChecklist
      .filter(item => item.done)
      .map(item => ({
        message: `${item.label} completed`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

    setLiveNotes(notes);
  }, [localChecklist]);

  /* ----- HANDLERS ------ */

  const handleToggleChecklist = (index) => {
    setLocalChecklist(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleStartJob = (jobId) => {
    startJob(jobId);
    toast.success('Job started!');
  };

  const handleUpdateProgress = (jobId, newProgress) => {
    updateProgress(
      jobId,
      newProgress,
      progressNote || `Progress updated to ${newProgress}%`
    );
    toast.success(`Progress updated to ${newProgress}%`);
    setProgressNote('');
  };

  const handleAddLiveNote = () => {
    if (!job || !progressNote.trim()) return;
    updateProgress(job.id, job.progress, progressNote);
    setProgressNote('');
  };

  const handleCompleteJob = (jobId) => {
    if (!completionNote.trim()) {
      toast.error('Please add completion notes');
      return;
    }
    completeJob(jobId, completionNote);
    toast.success('Job completed!');
    setCompletionNote('');
    setSelectedJobId(null);
  };

  /* ------ UI ---- */

  return (
    <div className="p-8 space-y-6">
      

      {/* JOB SELECTOR */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {activeJobs.map(j => (
          <button
            key={j.id}
            onClick={() => setSelectedJobId(j.id)}
            className={`px-4 py-2 rounded-lg border text-sm ${
              selectedJobId === j.id
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {j.vehicleDetails?.make} • {j.vehicleDetails?.regNo}
          </button>
        ))}
      </div>

      {!job && (
        <div className="bg-white p-12 rounded-xl text-center border">
          <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Select a job to start working</p>
        </div>
      )}


      {job && (
        <>

               {/* TOP BAR */} 
          <div className="bg-white rounded-xl p-6 border flex justify-between items-center sticky top-0 z-10"> 
            <div> 
              <h2 className="text-2xl font-bold text-black"> 
                {job.vehicleDetails?.make} {job.vehicleDetails?.model} 
              </h2> 
              <p className="text-sm text-gray-600"> 
                Reg: {job.vehicleDetails?.regNo} • Job ID: {job.id} 
              </p> 
            </div> 
 
            <div className="flex items-center gap-4"> 
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ 
                job.status === 'Assigned' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-green-50 text-green-700' 
              }`}> 
                {job.status} 
              </span> 
 
              {job.status === 'Assigned' && ( 
                <button 
                  onClick={() => handleStartJob(job.id)} 
                  className="flex items-center gap-2 px-5 py-2 bg-[#2563EB] text-white rounded-lg" 
                > 
                  <Play className="w-4 h-4" /> 
                  Start Job 
                </button> 
              )} 
            </div> 
          </div> 
 
          {/* PROGRESS + MILESTONES */} 
          <div className="bg-white rounded-xl p-8 border grid grid-cols-3 gap-8 items-center"> 
            <div className="flex justify-center"> 
              <div className="relative w-40 h-40"> 
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100"> 
                  <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" /> 
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    stroke="#22C55E" 
                    strokeWidth="10" 
                    fill="none" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * (job.progress || 0)) / 100} 
                    strokeLinecap="round" 
                  /> 
                </svg> 
                <div className="absolute inset-0 flex flex-col items-center justify-center"> 
                  <span className="text-3xl font-bold">{job.progress || 0}%</span> 
                  <span className="text-xs text-gray-500">Completed</span> 
                </div> 
              </div> 
            </div> 
 
            <div className="col-span-2"> 
              <h3 className="font-semibold mb-4">Progress Milestones</h3> 
              <div className="flex items-center justify-between"> 
                {[25, 50, 75, 100].map((step, idx) => ( 
                  <React.Fragment key={step}> 
                    <button 
                      onClick={() => handleUpdateProgress(job.id, step)} 
                      disabled={job.progress >= step} 
                      className={`w-12 h-12 rounded-full font-semibold transition ${ 
                        job.progress >= step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 hover:bg-[#1D4ED8] hover:text-white text-gray-700 cursor-pointer' 
                      }`} 
                    > 
                      {step} 
                    </button> 
                    {idx < 3 && <div className="flex-1 h-1 mx-2 bg-gray-200 rounded" />} 
                  </React.Fragment> 
                ))} 
              </div> 
 
              <div className="flex gap-2 mt-4"> 
                <textarea 
                  value={progressNote} 
                  onChange={(e) => setProgressNote(e.target.value)} 
                  placeholder="Add progress update..." 
                  className="w-full border rounded-lg p-2 text-sm" 
                /> 
                <button 
                  onClick={handleAddLiveNote} 
                  className="px-3 bg-[#2563EB] text-white rounded-lg" 
                > 
                  <Plus size={18} /> 
                </button> 
              </div> 
            </div> 
          </div> 
          {/* WorkSpace */}
          <div className="grid grid-cols-3 gap-6">

            {/* CHECKLIST */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Checklist</h3>
              <div className="space-y-3">
                {localChecklist.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklist(i)}
                      className="accent-blue-500"
                    />
                    <span className={item.done ? 'line-through text-gray-400' : ''}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* LIVE NOTES */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Live Notes</h3>
              <div className="space-y-3">
                {liveNotes.map((n, i) => (
                  <div key={i} className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-500">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Actions</h3>
              <textarea
                value={completionNote}
                onChange={e => setCompletionNote(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Final completion notes..."
              />
              <button
                onClick={() => handleCompleteJob(job.id)}
                disabled={job.progress < 100}
                className="mt-4 w-full py-3 bg-[#2563EB] text-white rounded-lg"
              >
                <Check className="inline w-4 h-4 mr-2 " />
                Mark Completed
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
