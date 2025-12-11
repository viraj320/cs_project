import React, { useEffect, useState } from "react";
import axios from "axios";
// Showing list of visitor bookings (customer name/email)
// CHANGE: read selected garage from Dashboard via Outlet context
import { useOutletContext } from "react-router-dom";

// No chart usage anymore

const GarageVisits = () => {
  // CHANGE: get garageId from Dashboard context
  const outlet = useOutletContext();
  const ctxGarageId = outlet?.garageId;

  // Initial garageId from Dashboard context OR URL OR localStorage
  // CHANGE: prioritize ctxGarageId first
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const initialId =
    ctxGarageId ||
    (search && search.get("garageId")) ||
    localStorage.getItem("garageId") ||
    "";

  const [visitData, setVisitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGarageId, setActiveGarageId] = useState(initialId);
  const [inputGarageId, setInputGarageId] = useState(initialId);

  const updateUrlParam = (id) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location);
    if (id) url.searchParams.set("garageId", id);
    else url.searchParams.delete("garageId");
    window.history.replaceState({}, "", url);
  };

  const fetchVisits = async () => {
    setLoading(true);
    try {
      // Fetch booking records for this garage — treat each booking as a visit
      const params = activeGarageId ? { garageId: activeGarageId } : undefined;
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:5000/api/garage/bookings", { params, headers });
      setVisitData(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE: re-fetch when activeGarageId changes
  useEffect(() => {
    fetchVisits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGarageId]);

  // CHANGE: sync with Dashboard selection (runs when sidebar selection changes)
  useEffect(() => {
    if (ctxGarageId !== undefined) {
      const id = ctxGarageId || "";
      setInputGarageId(id);
      setActiveGarageId(id);
      if (id) localStorage.setItem("garageId", id);
      else localStorage.removeItem("garageId");
      updateUrlParam(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxGarageId]);

  // NOTE: Removed window 'garageIdChange' listener to avoid double updates
  // (Dashboard context now drives selection changes)

  const handleApplyFilter = () => {
    const id = inputGarageId.trim();
    setActiveGarageId(id);
    if (id) localStorage.setItem("garageId", id);
    else localStorage.removeItem("garageId");
    updateUrlParam(id);
  };

  const handleClearFilter = () => {
    setInputGarageId("");
    setActiveGarageId("");
    localStorage.removeItem("garageId");
    updateUrlParam("");
  };

  // total visits is the number of booking records returned
  const total = visitData.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Customer Visits Analytics</h2>
        <span className="text-sm text-gray-600">Total: {total}</span>
      </div>

      {/* Removed filter UI — the dashboard selection controls which garage is shown */}

      {loading ? (
        <p>Loading...</p>
      ) : visitData.length ? (
        <div className="space-y-3">
          {visitData.map((b) => {
            const custName = b.customerName || b.customerId?.name || "Unknown";
            const custEmail = b.customerEmail || b.customerId?.email || "-";
            const when = b.date ? new Date(b.date).toLocaleString() : (b.createdAt ? new Date(b.createdAt).toLocaleString() : "-");
            return (
              <div key={b._id} className="p-3 border rounded flex justify-between items-start">
                <div>
                  <div className="font-semibold">{custName}</div>
                  <div className="text-sm text-gray-600">{custEmail}</div>
                  <div className="text-sm text-gray-500 mt-1">Service: {b.service || "-"}</div>
                </div>
                <div className="text-xs text-gray-500">{when}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No visitors found{activeGarageId ? " for this garage" : ""}.</p>
      )}
    </div>
  );
};

export default GarageVisits;