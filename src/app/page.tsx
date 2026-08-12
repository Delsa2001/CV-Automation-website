"use client";

import { FormEvent, useEffect, useState } from "react";
import { Aurora } from "@/components/bits/Aurora";
import { FadeContent } from "@/components/bits/FadeContent";
import { GlareHover } from "@/components/bits/GlareHover";
import { SplitText } from "@/components/bits/SplitText";
import { SpotlightCard } from "@/components/bits/SpotlightCard";

const ATS_LOGIN_URL =
  (process.env.NEXT_PUBLIC_ATS_URL || "https://cv-automationdeshancosta.vercel.app").replace(/\/$/, "") +
  "/login";

type Vacancy = {
  id: string;
  title: string;
  location?: string | null;
  employmentType?: string | null;
  salaryRange?: string | null;
  jdText: string;
  client: { name: string };
};

export default function CareersPage() {
  const [roles, setRoles] = useState<Vacancy[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/careers")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Could not load roles");
        return Array.isArray(data) ? data : [];
      })
      .then((list) => {
        setRoles(list);
        if (list[0]) setSelectedId(list[0].id);
      })
      .catch(() => setError("Could not load roles"));
  }, []);

  const selected = roles.find((r) => r.id === selectedId) || null;

  async function apply(e: FormEvent) {
    e.preventDefault();
    if (!selectedId) {
      setError("Please choose a role first.");
      return;
    }
    if (!file) {
      setError("Please attach your CV (PDF or Word).");
      return;
    }
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("vacancyId", selectedId);
      if (note) fd.append("note", note);
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Submit failed (${res.status})`);
      setStatus(
        `Thank you${data.candidateName ? `, ${data.candidateName}` : ""}. We received your CV for ${data.vacancyTitle}.`
      );
      setFile(null);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06130f] text-[#f4efe6]">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <Aurora colorStops={["#0f766e", "#5eead4", "#042f2e"]} amplitude={1.05} blend={0.6} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06130f]/30 via-[#06130f]/55 to-[#06130f]" />

      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#7dcca8]">Lumenos Talent</p>
              <p className="text-lg font-semibold">Careers</p>
            </div>
            <a href={ATS_LOGIN_URL} className="text-sm text-white/50 transition hover:text-white">
              Consultant login
            </a>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-5 py-16">
          <p className="text-sm text-[#7dcca8]">Sri Lanka · Open roles</p>
          <SplitText
            text="Send your CV. We’ll match you to the right opportunity."
            className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
          />
          <FadeContent delay={0.25}>
            <p className="mt-5 max-w-2xl text-lg text-white/65">
              Choose a role, upload a PDF or Word CV, then submit. Our team reviews every application.
            </p>
          </FadeContent>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-5 pb-20 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            {roles.map((role, i) => (
              <FadeContent key={role.id} delay={0.08 * i}>
                <SpotlightCard
                  className={`rounded-3xl border transition ${
                    selectedId === role.id
                      ? "border-[#7dcca8] bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                  spotlightColor="rgba(125, 204, 168, 0.22)"
                >
                  <button type="button" onClick={() => setSelectedId(role.id)} className="w-full p-5 text-left">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold">{role.title}</h2>
                        <p className="mt-1 text-sm text-white/55">
                          {role.client.name}
                          {role.location ? ` · ${role.location}` : ""}
                          {role.employmentType ? ` · ${role.employmentType}` : ""}
                        </p>
                      </div>
                      {role.salaryRange ? (
                        <span className="rounded-full bg-[#7dcca8]/15 px-3 py-1 text-xs text-[#7dcca8]">
                          {role.salaryRange}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{role.jdText}</p>
                  </button>
                </SpotlightCard>
              </FadeContent>
            ))}
            {!roles.length ? (
              <p className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/50">
                No open roles right now. Check back soon.
              </p>
            ) : null}
          </div>

          <FadeContent delay={0.2}>
            <aside className="h-fit rounded-3xl bg-[#f4efe6] p-6 text-[#1c1917] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <h3 className="text-xl font-semibold">Apply with your CV</h3>
              <form className="mt-5 space-y-3" onSubmit={apply}>
                <label className="block text-sm text-[#57534e]">
                  Role *
                  <select
                    className="mt-1 w-full rounded-xl border border-[#e7e0d5] bg-white px-3 py-2"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title} — {role.client.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-[#57534e]">
                  CV (PDF or DOCX) *
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="mt-1 w-full rounded-xl border border-[#e7e0d5] bg-white px-3 py-2"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? <span className="mt-1 block text-xs text-[#0f766e]">Selected: {file.name}</span> : null}
                </label>
                <label className="block text-sm text-[#57534e]">
                  Short note (optional)
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7e0d5] bg-white px-3 py-2"
                    placeholder="Why this role, notice period, expected salary..."
                  />
                </label>
                {selected ? <p className="text-xs text-[#57534e]">Applying for: {selected.title}</p> : null}
                {error ? <p className="text-sm text-[#b91c1c]">{error}</p> : null}
                {status ? <p className="text-sm text-[#15803d]">{status}</p> : null}
                <GlareHover className="rounded-xl" glareColor="#ccfbf1" glareOpacity={0.45}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#0f766e] px-4 py-3 font-medium text-white disabled:opacity-50"
                  >
                    {loading ? "Reading your CV..." : "Submit application"}
                  </button>
                </GlareHover>
              </form>
            </aside>
          </FadeContent>
        </section>
      </div>
    </div>
  );
}
