import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Button";

function CreateSociety() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [totalFlats, setTotalFlats] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const flatsNum = Number(totalFlats);
    if (!name.trim() || !address.trim() || !city.trim() || !state.trim() || !totalFlats) {
      setError("Please fill out all required society fields.");
      return;
    }
    if (!Number.isInteger(flatsNum) || flatsNum <= 0) {
      setError("Total flats must be a positive whole number.");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/society", {
        name: name.trim(),
        code: code.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        totalFlats: flatsNum,
      });

      navigate("/societies");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create society.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          to="/societies"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Back to societies
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Create society</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Register a community so residents and staff can join using its code.
        </p>
      </div>

      <Card className="max-w-2xl p-6">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
          >
            <Icon name="alert" className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="soc-name" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Society name
              </label>
              <input
                id="soc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emerald Greens Residency"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="soc-code" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Code <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="soc-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. EGR101"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm uppercase text-zinc-900 placeholder:font-sans placeholder:normal-case placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="soc-address" className="mb-1.5 block text-xs font-medium text-zinc-700">
              Street address
            </label>
            <input
              id="soc-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Sector 42, Main Avenue"
              className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="soc-city" className="mb-1.5 block text-xs font-medium text-zinc-700">
                City
              </label>
              <input
                id="soc-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="soc-state" className="mb-1.5 block text-xs font-medium text-zinc-700">
                State
              </label>
              <input
                id="soc-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Karnataka"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="soc-flats" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Total flats
              </label>
              <input
                id="soc-flats"
                type="number"
                min={1}
                value={totalFlats}
                onChange={(e) => setTotalFlats(e.target.value)}
                placeholder="120"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-zinc-100 pt-4">
            <Link
              to="/societies"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {submitting && <Spinner className="size-4" />}
              {submitting ? "Creating…" : "Create society"}
            </button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default CreateSociety;
