import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const GarageServices = () => {
  // CHANGE: call useOutletContext() directly and safely destructure
  const ctx = useOutletContext() || {};
  const { garageId: ctxGarageId, garages: ctxGarages = [], reloadGarages } = ctx;

  const [garages, setGarages] = useState(ctxGarages || []);
  const [activeGarageId, setActiveGarageId] = useState(
    ctxGarageId || localStorage.getItem("garageId") || ""
  );
  const [loadingList, setLoadingList] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    services: "",
    contact: "",
    availability: true,
  });
  const [saving, setSaving] = useState(false);

  // Helper: update URL ?garageId=
  const updateUrlParam = (id) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("garageId", id);
    else url.searchParams.delete("garageId");
    window.history.replaceState({}, "", url.toString());
  };

  // CHANGE: return the fetched list so callers can use it immediately
  const loadGarages = async () => {
    try {
      setLoadingList(true);
      const { data } = await axios.get("http://localhost:5000/api/garage/list");
      setGarages(data || []);
      return data || []; // CHANGE
    } catch (e) {
      console.error(e);
      alert("Failed to load garage list");
      return []; // CHANGE
    } finally {
      setLoadingList(false);
    }
  };

  // Prefill form using a garage object
  const prefillFromGarage = (g) => {
    if (!g) return;
    setForm({
      name: g.name || "",
      location: g.location || "",
      services: g.services || "",
      contact: g.contact || "",
      availability: typeof g.availability === "boolean" ? g.availability : true,
    });
  };

  // Try to prefill when activeGarageId changes
  useEffect(() => {
    (async () => {
      if (!activeGarageId) {
        // CHANGE: if no active, clear form (new garage mode)
        setForm({
          name: "",
          location: "",
          services: "",
          contact: "",
          availability: true,
        });
        return;
      }

      // First try current state
      const existing = (garages || []).find((g) => g._id === activeGarageId);
      if (existing) {
        prefillFromGarage(existing);
        return;
      }

      // CHANGE: If not found, fetch list now and try again using the returned list
      const list = await loadGarages();
      const found = list.find((g) => g._id === activeGarageId);
      if (found) prefillFromGarage(found);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGarageId]);

  // Sync with dashboard context changes (list + selected id)
  useEffect(() => {
    // CHANGE: update local list when context list changes
    if (ctxGarages && ctxGarages.length) {
      setGarages(ctxGarages);
      // Also try prefill if we now have the active one in ctx list
      if (activeGarageId) {
        const g = ctxGarages.find((x) => x._id === activeGarageId);
        if (g) prefillFromGarage(g);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxGarages]);

  useEffect(() => {
    // CHANGE: update active id when dashboard selection changes
    if (ctxGarageId !== undefined) {
      setActiveGarageId(ctxGarageId || "");
    }
  }, [ctxGarageId]);

  // Listen to dashboard “garageIdChange” events (when user switches active garage)
  useEffect(() => {
    const onGarageChange = (e) => {
      const id = e?.detail?.garageId || "";
      setActiveGarageId(id);
      if (id) localStorage.setItem("garageId", id);
      else localStorage.removeItem("garageId");
      updateUrlParam(id);

      const g = (garages || []).find((x) => x._id === id);
      if (g) prefillFromGarage(g);
    };
    window.addEventListener("garageIdChange", onGarageChange);
    return () => window.removeEventListener("garageIdChange", onGarageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garages]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNewGarage = () => {
    setActiveGarageId("");
    setForm({
      name: "",
      location: "",
      services: "",
      contact: "",
      availability: true,
    });
    updateUrlParam("");
  };

  const handleLoadActive = () => {
    if (!activeGarageId) return;
    const g = (garages || []).find((x) => x._id === activeGarageId);
    if (g) prefillFromGarage(g);
    else alert("Active garage not found in list. Click Reload and try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Garage Name is required");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let data;
      if (activeGarageId) {
        // Update existing garage
        const res = await axios.put(
          `http://localhost:5000/api/garage/${activeGarageId}`,
          form,
          { headers }
        );
        data = res.data;
      } else {
        const res = await axios.post("http://localhost:5000/api/garage", form, { headers });
        data = res.data;
      }

      if (data && data._id) {
        // Mark this as the active garage
        setActiveGarageId(data._id);
        localStorage.setItem("garageId", data._id);
        updateUrlParam(data._id);

        // CHANGE: update list in parent (if available) OR locally
        if (typeof reloadGarages === "function") {
          await reloadGarages();
        } else {
          setGarages((prev) => {
            const exists = prev.find((g) => g._id === data._id);
            // replace or prepend
            return exists
              ? prev.map((g) => (g._id === data._id ? data : g))
              : [data, ...prev];
          });
        }

        // CHANGE: prefill the form with the saved data
        prefillFromGarage(data);

        // Notify others
        window.dispatchEvent(new CustomEvent("garageIdChange", { detail: { garageId: data._id } }));
      }

      alert("Garage saved successfully!");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Register / Update Garage Services</h2>
        <div className="flex gap-2">
          <button
            onClick={handleLoadActive}
            className="bg-blue-100 px-3 py-2 rounded"
            disabled={!activeGarageId || loadingList}
            title="Load active garage details"
          >
            Load Active
          </button>
          <button
            onClick={loadGarages}
            className="bg-blue-600 text-white px-3 py-2 rounded"
            title="Reload garage list"
          >
            Reload
          </button>
        </div>
      </div>

      {activeGarageId && (
        <p className="text-sm text-gray-600 mb-3">
          Editing garage: <span className="font-mono">{activeGarageId}</span>
        </p>
      )}

      <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          placeholder="Garage Name"
          className="p-2 border w-full"
          required
        />
        <input
          name="location"
          onChange={handleChange}
          value={form.location}
          placeholder="Location"
          className="p-2 border w-full"
        />
        <input
          name="services"
          onChange={handleChange}
          value={form.services}
          placeholder="Services Offered"
          className="p-2 border w-full"
        />
        <input
          name="contact"
          onChange={handleChange}
          value={form.contact}
          placeholder="Contact Number"
          className="p-2 border w-full"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available
        </label>

        <button
          disabled={saving}
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Tip: If you use the same Name as an existing garage, it will update that garage.
        Use a new Name to create a separate garage.
      </p>
    </div>
  );
};

export default GarageServices;