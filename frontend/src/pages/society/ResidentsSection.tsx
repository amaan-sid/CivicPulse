import { useEffect, useState } from "react";
import API from "../../services/api";
import type { Resident } from "../../types/user";

function ResidentsSection() {
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    API.get("/society/residents").then((res) => setResidents(res.data));
  }, []);

  const handleUpdate = async (id: string, newValue: Resident['role']) => {
    const original = residents.find((r) => r._id === id);
    
    if (original && original.role !== newValue) {
      try {
        await API.put(`/society/residents/${id}`, { role: newValue });
        setResidents((prev) =>
          prev.map((r) => (r._id === id ? { ...r, role: newValue } : r))
        );
      } catch (err) {
        console.error("Failed to update resident", err);
      }
    }
  };

  const removeResident = async (id: string) => {
    if (!confirm("Remove resident?")) return;
    await API.delete(`/society/residents/${id}`);
    setResidents((prev) => prev.filter((r) => r._id !== id));
  };

  if(residents.length===0)return <p>Loading...</p>

  return (
    <div className="space-y-3">
      {residents.map((r) => {

        return (
          <div key={r._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <span className="font-medium">{r.name}</span>

            <select
              value={r.role}
              className="border rounded p-1"
              onChange={(e) => handleUpdate(r._id, e.target.value as any)}
            >
              <option value="resident">Resident</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>

            <button onClick={() => removeResident(r._id)} className="text-red-600 hover:underline text-sm">
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ResidentsSection;