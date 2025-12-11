import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

export default function ReportIncidentPage() {
  const [address, setAddress] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // ⭐ Fetch address from coordinates
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
        setSuggestions([]); // clear any suggestions
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error(error);
      setAddress("Error fetching address");
    }
  };

  // 📍 Get GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAddress(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  // 🧠 Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 500); // ⏳ 500ms debounce to avoid calling API too fast

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const payload = { location: address, type: incidentType, description };
      await submitReport(payload);
      setSuccessMsg('Report submitted successfully.');
      setAddress('');
      setIncidentType('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-lg bg-white mt-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">📝 Report New Incident</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Location Input + GPS Button + Suggestions */}
        <div className="relative">
          <label className="block text-gray-700 mb-2 font-semibold">Location</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter incident location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Button
              type="button"
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={handleGetLocation}
              disabled={isLocating}
            >
              {isLocating ? "Locating..." : <MapPin className="h-5 w-5" />}
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
              {isLoadingSuggestions && (
                <li className="p-2 text-gray-400 text-center text-xs">Loading...</li>
              )}
            </ul>
          )}
        </div>

        {/* Incident Type */}
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Incident Type</label>
          <Input value={incidentType} onChange={(e) => setIncidentType(e.target.value)} type="text" placeholder="e.g., Breakdown, Accident, Fire" required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what happened..." rows="4" required />
        </div>

        <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {submitting ? 'Submitting...' : 'Submit Report'}
        </Button>
        {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
        {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
      </form>
    </div>
  );
}

async function submitReport(payload) {
  // Use fetch to the backend API; API client could be used instead
  const res = await fetch('http://localhost:5000/api/reports/public', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to submit report');
  }
  return res.json();
}
