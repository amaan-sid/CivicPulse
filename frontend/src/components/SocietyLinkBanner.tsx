import { useEffect, useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setUser } from "../features/auth/authSlice";
import API from "../services/api";
import type { Society } from "../types/society";
import { Icon } from "./ui/Icon";

function SocietyLinkBanner({ onLinked }: { onLinked?: () => void }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  const [societies, setSocieties] = useState<Society[]>([]);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const needsLink = Boolean(
    user && (user.role === "resident" || user.role === "staff") && !user.societyResolved
  );

  useEffect(() => {
    if (!needsLink) return;
    API.get<Society[]>("/society/public")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setSocieties(list);
        if (list.length > 0) setSelected(list[0]._id);
      })
      .catch(() => {
        /* ignore */
      });
  }, [needsLink]);

  if (!needsLink && !success) return null;

  const handleLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await API.patch("/auth/society", { society: selected });
      if (res.data?.user) {
        dispatch(setUser(res.data.user));
        setSuccess(res.data.message || "Society linked successfully.");
        onLinked?.();
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not link society.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs font-medium text-emerald-800">
        <Icon name="check" className="size-4 shrink-0" />
        <span>{success}</span>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Icon name="building" className="mt-0.5 size-4 shrink-0 text-zinc-600" />
          <div>
            <p className="text-sm font-semibold text-zinc-900">Link your society to get started</p>
            <p className="text-xs text-zinc-500">
              Select a registered society below to view and submit issues.
            </p>
          </div>
        </div>

        {societies.length > 0 && (
          <form onSubmit={handleLink} className="flex flex-wrap items-center gap-2">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              {societies.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} {s.code ? `(${s.code})` : ""}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {saving ? "Linking…" : "Link society"}
            </button>
          </form>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default SocietyLinkBanner;

