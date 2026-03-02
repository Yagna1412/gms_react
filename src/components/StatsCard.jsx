export default function StatsCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-4 border">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </div>
  );
}
