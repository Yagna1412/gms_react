import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useMechanic } from '../contexts/MechanicContext';


export default function ProgressUpdates() {
  const { jobs } = useMechanic();

  const [selectedJob, setSelectedJob] = useState('');
  const [noteText, setNoteText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const activeJobs = jobs.filter(j => j.status === 'In-Progress');

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleAddNote = () => {
    if (!selectedJob || !noteText) {
      toast.error('Please select job and enter note');
      return;
    }

    const job = jobs.find(j => j.id === selectedJob);
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newUpdate = {
      jobId: job.id,
      note: noteText,
      time,
      photos
    };

    setRecentUpdates(prev => [newUpdate, ...prev]);

    toast.success('Progress update added');

    setSelectedJob('');
    setNoteText('');
    setPhotos([]);
  };

  // Group updates by Job ID
  const groupedUpdates = recentUpdates.reduce((acc, update) => {
    acc[update.jobId] = acc[update.jobId] || [];
    acc[update.jobId].push(update);
    return acc;
  }, {});

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Progress Updates</h1>
        <p className="text-gray-600 text-sm">
          Add notes and photos to track job progress
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT – ADD UPDATE */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="font-bold mb-4">Add Progress Update</h2>

          <div className="space-y-4">
            {/* Select Job */}
            <div>
              <label className="block text-xs font-semibold mb-2">
                SELECT JOB
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border rounded-lg"
              >
                <option value="">Choose active job</option>
                {activeJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.id} - {job.vehicleDetails.regNo}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Note */}
            <div>
              <label className="block text-xs font-semibold mb-2">
                PROGRESS NOTE
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows="4"
                placeholder="Describe what you've completed..."
                className="w-full px-4 py-3 bg-gray-50 border rounded-lg"
              />
            </div>

            {/* Upload Photos */}
            <div>
              <label className="block text-xs font-semibold mb-2">
                UPLOAD PHOTOS
              </label>
              <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block">
                <Upload className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {photos.length > 0
                    ? `${photos.length} photo(s) selected`
                    : 'Click to upload work photos'}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleAddNote}
              className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Add Update
            </button>
          </div>
        </div>

        {/* RIGHT – RECENT UPDATES */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="font-bold mb-4">Recent Updates</h2>

          {Object.keys(groupedUpdates).length === 0 && (
            <p className="text-sm text-gray-500">No updates yet</p>
          )}

          {Object.entries(groupedUpdates).map(([jobId, updates]) => (
            <div key={jobId} className="mb-6">
              <h3 className="font-semibold mb-3">{jobId}</h3>

              <div className="space-y-3">
                {updates.map((u, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">{u.note}</p>
                      <p className="text-xs text-gray-500">{u.time}</p>
                    </div>

                    {u.photos.length > 0 && (
                      <button
                        onClick={() => setSelectedUpdate(u)}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        View ({u.photos.length})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW MODAL */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[520px] max-h-[80vh] overflow-y-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Progress Update</h3>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Info */}
            <p className="text-sm text-gray-600 mb-1">
              Job ID: <span className="font-medium">{selectedUpdate.jobId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {selectedUpdate.time}
            </p>

            {/* Note */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm">{selectedUpdate.note}</p>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-3 gap-3">
              {selectedUpdate.photos.map((photo, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt="work"
                  className="w-full h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
