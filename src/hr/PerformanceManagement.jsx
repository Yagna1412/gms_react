import {useState} from "react";
import { Star, Eye, TrendingUp,X } from "lucide-react";

const PerformanceManagement = ({ reviews, setReviews }) => {
    {/* KPI CALCULATIONS */}
  const pendingCount = reviews.filter(r => r.status === "Pending").length;
  const completedReviews = reviews.filter(r => r.status === "Completed");

  const averageScore =
    completedReviews.length > 0
      ? (
          completedReviews.reduce((sum, r) => sum + r.score, 0) /
          completedReviews.length
        ).toFixed(2)
      : "0.00";

      {/* Modal State */}
      const [showModal, setShowModal] = useState(false);

      const [cycleData, setCycleData] = useState({
        name:"",
        from:"",
        to:"",
        type:"Annual",
        employees:"All",
        reviewwer:"",
        dueDate:"",
      });

  {/*ACTIONS*/}
 const startAppraisalCycle = () => {
    setShowModal(true);
  };

  const submitCycle = () => {
    alert(`Appraisal Cycle "${cycleData.name}" started `);
    setShowModal(false);
  };

  const viewReview = (review) => {
    alert(`Viewing review for ${review.name}`);
  };

  return (
    <div className="px-6 pt-20 pb-10">

     

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
          <h2 className="text-2xl font-bold">Performance Management</h2>
          <p className="text-gray-600">
            Manage employee appraisals 
          </p>
        </div>

        <button
          onClick={startAppraisalCycle}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className="text-lg">+</span> Start Appraisal Cycle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Pending */}
        <div className="bg-white border rounded-2xl p-6">
          <div className = "flex justify-between items-center">
            <p className="text-gray-600 ">Pending Reviews</p>
            <TrendingUp className="text-yellow-500"/>
          </div>
          <h1 className="text-3xl font-bold mt-2">{pendingCount}</h1>
        </div>

        {/* Completed */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Completed</p>
            <Star className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mt-2">
            {completedReviews.length}
          </h1>
        </div>

        {/* Average */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Average Score</p>
            <Star className="text-blue-500"/>
          </div>
          <h1 className="text-3xl font-bold mt-2">{averageScore}</h1>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 px-6 py-4 text-sm font-bold text-gray-600 border-b">
          <div>EMPLOYEE</div>
          <div>CYCLE</div>
          <div>REVIEW DATE</div>
          <div>OVERALL SCORE</div>
          <div>REVIEWER</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>

        {reviews.map(review => (
          <div
            key={review.id}
            className="grid grid-cols-7 px-6 py-4 items-center border-b last:border-none"
          >
            <div>
              <p className="font-semibold">{review.name}</p>
              <p className="text-xs text-gray-500">{review.empId}</p>
            </div>

            <div>{review.cycle}</div>
            <div>{review.date}</div>

            <div className="flex items-center gap-1">
              {review.score ? (
                <>
                  <span className="font-semibold">{review.score}</span>
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                </>
              ) : (
                "-"
              )}
            </div>

            <div>{review.reviewer}</div>

            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  review.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {review.status}
              </span>
            </div>

            <div>
              <button
                onClick={() => viewReview(review)}
                className="text-gray-600 hover:text-black"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
       {/* Start Appraisal cycle */}
       {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className = "bg-white rounded-2xl w-[500px] p-6 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400">
                <X />
              </button>

              <h2 className="text-xl font-bold mb-4">
                Start Appraisal Cycle
              </h2>

              <div className="space-y-3">
                <input 
                    className="w-full border rounder-lg px-3 py-2"
                    placeholder="Cycle Name (e.g. Q1 2025)"
                    onChange={e => setCycleData({...cycleData, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                          type="date"
                          className="border rounded-lg px-3 py-2"
                          onChange={e => setCycleData({...cycleData, from: e.target.value})}
                          />
                          <input
                              tyoe="date"
                              className="border rounded-lg px-3 py-2"
                              onChange={e => setCycleData({...cycleData, to: e.target.value})}
                              />
                    </div>

                    <select 
                        className="w-full border rounded-lg px-3 py-2"
                        onChange={e => setCycleData({...cycleData, type: e.target.value})}
                        >
                          <option>Annual</option>
                          <option>Quaterly</option>
                          <option>Probation</option>
                        </select>
                        <select
                              className="w-full border rounded-lg px-3 py-2"
                              onChange={e => setCycleData({...cycleData, employees: e.target.value})}
                              >
                                <option>All Employees</option>
                                <option>Department-wise</option>
                                <option>Individual</option>
                              </select>
                        <input
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Reviewer Name"
                            onChnage={e => setCycleData({...cycleData, reviewer: e.target.value})}
                            />
                            <input 
                                type="date"
                                className="w-full border rounded-lg px-3 py-2"
                                onChange={e => setCycleData({...cycleData, dueDate: e.target.value})}
                                />
                        </div>

                        <button
                            onClick={submitCycle}
                            className="mt-5 bg-black text-white w-full py-2 rounded-lg">
                              Start Cycle
                            </button>
          </div>
        </div>
       )}
   </div>   
        
      );
    };

    export default PerformanceManagement;