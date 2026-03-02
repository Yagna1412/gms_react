import { useState } from "react";
import {
  MdSecurity,
  MdLock,
  MdBackup,
  MdTimeline,
  MdStorage,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";

export default function SecurityControl() {
  const [twoFA, setTwoFA] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");

  const accessLogs = [
    {
      user: "Admin",
      action: "Login",
      timestamp: "2024-12-18 09:00 AM",
      ip: "192.168.1.1",
      status: "Success",
    },
    {
      user: "Rajesh Kumar",
      action: "Update Branch",
      timestamp: "2024-12-18 10:30 AM",
      ip: "192.168.1.5",
      status: "Success",
    },
    {
      user: "Unknown",
      action: "Failed Login",
      timestamp: "2024-12-18 11:15 AM",
      ip: "203.0.113.0",
      status: "Failed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Security & Control</h1>
        <p className="text-gray-500">
          Access permissions, monitor activities, and data backup
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="2FA Status"
          value={twoFA ? "ON" : "OFF"}
          icon={<MdSecurity />}
          bg="bg-green-100 text-green-600"
        />

        <StatsCard
          title="Session Timeout"
          value="30m"
          icon={<MdLock />}
          bg="bg-blue-100 text-blue-600"
        />

        <StatsCard
          title="Auto Backup"
          value={autoBackup ? "ON" : "OFF"}
          icon={<MdStorage />}
          bg="bg-green-100 text-green-600"
        />

        <StatsCard
          title="Access Logs"
          value={accessLogs.length}
          icon={<MdTimeline />}
          bg="bg-purple-100 text-purple-600"
        />
      </div>

      {/* SECURITY SETTINGS CARD */}
      <div className="bg-white rounded-2xl border p-6 space-y-6">
        <h2 className="text-xl font-bold">Security Settings</h2>

        {/* 2FA */}
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-gray-500 text-sm">
              Add an extra layer of security to your account
            </p>
          </div>

          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`px-6 py-2 rounded-xl font-medium border ${
              twoFA
                ? "bg-green-100 text-green-700 border-green-500"
                : "bg-gray-100 text-gray-600 border-gray-400"
            }`}
          >
            {twoFA ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* AUTO BACKUP */}
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h3 className="font-semibold">Auto Backup</h3>
            <p className="text-gray-500 text-sm">
              Automatically backup data every day at 3:00 AM
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last backup: 2024-12-18 03:00 AM
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`px-6 py-2 rounded-xl font-medium border ${
                autoBackup
                  ? "bg-green-100 text-green-700 border-green-500"
                  : "bg-gray-100 text-gray-600 border-gray-400"
              }`}
            >
              {autoBackup ? "Enabled" : "Disabled"}
            </button>

            <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl">
              <MdBackup /> Backup Now
            </button>
          </div>
        </div>

        {/* SESSION TIMEOUT */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Session Timeout</h3>
            <p className="text-gray-500 text-sm">
              Auto logout after inactivity
            </p>
          </div>

          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="border rounded-xl px-4 py-2"
          >
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>60 minutes</option>
          </select>
        </div>
      </div>

      {/* ACCESS LOGS TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Access Logs</h2>
          <p className="text-gray-500 text-sm">
            Monitor user activities and security events
          </p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Timestamp</th>
              <th className="p-4 text-left">IP Address</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {accessLogs.map((log, i) => (
              <tr key={i} className="border-t">
                <td className="p-4 font-medium">{log.user}</td>
                <td className="p-4">{log.action}</td>
                <td className="p-4">{log.timestamp}</td>
                <td className="p-4">{log.ip}</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
