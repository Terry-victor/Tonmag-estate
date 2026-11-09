"use client"

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Activity, BarChart3, Building2, FileText, Gauge, Landmark, Settings, ShieldCheck, Upload, UserCog, Users } from "lucide-react"
import { auth, storage } from "@/lib/firebase"
import { APP_ROLES, PERMISSIONS, ROLE_LABELS, type AppRole, type Permission } from "@/lib/rbac"
import type { Lead, ManagedProperty, StaffMember } from "@/lib/admin-types"
import type { SaaSUser } from "@/lib/saas-types"
import { Button } from "@/components/ui/button"

const inputClass = "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
const areaClass = "min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm"

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await auth.currentUser?.getIdToken()
  if (!token) throw new Error("Your session has expired. Please sign in again.")
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers },
    cache: "no-store",
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || "Unable to complete the request.")
  return result as T
}

const navigation: { id: string; label: string; icon: typeof Gauge; any: Permission[] }[] = [
  { id: "overview", label: "Overview", icon: Gauge, any: [PERMISSIONS.DASHBOARD_VIEW] },
  { id: "leads", label: "Customer leads", icon: Users, any: [PERMISSIONS.LEADS_VIEW_ALL, PERMISSIONS.LEADS_VIEW_ASSIGNED] },
  { id: "properties", label: "Properties", icon: Building2, any: [PERMISSIONS.PROPERTIES_VIEW] },
  { id: "estates", label: "Estates", icon: Landmark, any: [PERMISSIONS.ESTATES_MANAGE] },
  { id: "content", label: "Website content", icon: FileText, any: [PERMISSIONS.CONTENT_MANAGE] },
  { id: "reports", label: "Sales reports", icon: BarChart3, any: [PERMISSIONS.SALES_REPORTS_VIEW] },
  { id: "staff", label: "Administrators", icon: UserCog, any: [PERMISSIONS.STAFF_MANAGE] },
  { id: "activity", label: "Activity log", icon: Activity, any: [PERMISSIONS.ACTIVITY_LOGS_VIEW] },
  { id: "system", label: "System settings", icon: Settings, any: [PERMISSIONS.SETTINGS_MANAGE] },
]

export function AdminDashboard({ user }: { user: SaaSUser }) {
  const query = useSearchParams()
  const allowed = useMemo(() => new Set(user.permissions), [user.permissions])
  const sections = navigation.filter((section) => section.any.some((permission) => allowed.has(permission)))
  const requested = query.get("section") || "overview"
  const [active, setActive] = useState(sections.some((section) => section.id === requested) ? requested : sections[0]?.id || "overview")
  const navigate = (id: string) => {
    if (!sections.some((section) => section.id === id)) return
    setActive(id)
    window.history.replaceState(null, "", `/dashboard?section=${id}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const can = (permission: Permission) => allowed.has(permission)

  return (
    <main className="min-h-screen bg-[#f0ece3] dark:bg-background">
      <div className="border-b border-border bg-card px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 md:flex-row md:items-center">
          <div><p className="luxury-eyebrow mb-2">TONMAG administration</p><h1 className="font-serif text-4xl leading-none sm:text-5xl">Welcome, {user.name.split(" ")[0]}.</h1><p className="mt-2 text-sm text-muted-foreground">Permissions are combined from every assigned role.</p></div>
          <div className="flex max-w-2xl flex-wrap gap-2">{user.roles.map((role) => <span key={role} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary">{ROLE_LABELS[role]}</span>)}</div>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr] lg:py-10">
        <aside className="rounded-2xl bg-navy p-3 text-white lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-2 flex items-center gap-3 px-4 py-3 text-[#e4bd79]"><ShieldCheck className="size-5" /><span className="text-xs font-extrabold uppercase tracking-wider">Role-secured</span></div>
          <nav className="flex gap-1 overflow-x-auto lg:block" aria-label="Administration sections">{sections.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold transition lg:w-full ${active === id ? "bg-white/12 text-[#e4bd79]" : "text-white/70 hover:bg-white/8 hover:text-white"}`}><Icon className="size-4" />{label}</button>)}</nav>
        </aside>
        <div className="min-w-0 animate-panel-in" key={active}>
          {active === "overview" && <OverviewSection />}
          {active === "leads" && <LeadsSection canAssign={can(PERMISSIONS.LEADS_ASSIGN)} canRecordSale={can(PERMISSIONS.SALES_RECORD)} />}
          {active === "properties" && <PropertiesSection user={user} canCreate={can(PERMISSIONS.PROPERTIES_CREATE) || can(PERMISSIONS.PROPERTIES_DELETE)} canEdit={can(PERMISSIONS.PROPERTIES_UPDATE) || can(PERMISSIONS.PROPERTIES_DELETE)} canPrice={can(PERMISSIONS.PROPERTY_PRICES_MANAGE)} canDelete={can(PERMISSIONS.PROPERTIES_DELETE)} canMedia={can(PERMISSIONS.PROPERTY_MEDIA_MANAGE)} />}
          {active === "estates" && <EstatesSection />}
          {active === "content" && <ContentSection />}
          {active === "reports" && <ReportsSection canFinancial={can(PERMISSIONS.FINANCIAL_REPORTS_VIEW)} />}
          {active === "staff" && <StaffSection currentUid={user.id} />}
          {active === "activity" && <ActivitySection />}
          {active === "system" && <SettingsSection />}
        </div>
      </div>
    </main>
  )
}

function Heading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="luxury-eyebrow mb-2">{eyebrow}</p><h2 className="font-serif text-4xl leading-none sm:text-5xl">{title}</h2></div>{action}</div>
}

function Notice({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null
  return <p role={error ? "alert" : "status"} className={`mb-5 rounded-xl border p-4 text-sm ${error ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10"}`}>{error || message}</p>
}

function Loading() { return <div className="grid min-h-48 place-items-center rounded-2xl bg-card text-sm text-muted-foreground">Loading authorized data…</div> }

function OverviewSection() {
  const [data, setData] = useState<{ roles: string[]; metrics: { label: string; value: string | number; detail: string }[]; recentActivity: Record<string, unknown>[] } | null>(null)
  const [error, setError] = useState("")
  useEffect(() => { void adminRequest<typeof data>("/api/admin/overview").then(setData).catch((cause) => setError(cause.message)) }, [])
  if (!data && !error) return <Loading />
  return <><Heading eyebrow="Authorized workspace" title="Operations overview" /><Notice error={error} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data?.metrics.map((metric) => <article key={metric.label} className="rounded-2xl bg-card p-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{metric.label}</p><p className="mt-3 text-3xl font-bold">{metric.value}</p><p className="mt-2 text-xs text-muted-foreground">{metric.detail}</p></article>)}</div>{Boolean(data?.recentActivity.length) && <div className="mt-6 rounded-2xl bg-card p-6"><h3 className="font-serif text-2xl">Recent system activity</h3><div className="mt-5 space-y-3">{data?.recentActivity.map((entry) => <div key={String(entry.id)} className="flex justify-between gap-4 border-b border-border pb-3 text-sm last:border-0"><span><strong>{String(entry.action)}</strong> · {String(entry.actorName)}</span><span className="text-xs text-muted-foreground">{new Date(String(entry.createdAt)).toLocaleString()}</span></div>)}</div></div>}</>
}

function LeadsSection({ canAssign, canRecordSale }: { canAssign: boolean; canRecordSale: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [assignees, setAssignees] = useState<{ uid: string; name: string }[]>([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const load = useCallback(async () => {
    const result = await adminRequest<{ leads: Lead[] }>("/api/admin/leads")
    setLeads(result.leads)
    if (canAssign) setAssignees((await adminRequest<{ assignees: { uid: string; name: string }[] }>("/api/admin/assignees")).assignees)
  }, [canAssign])
  useEffect(() => { void load().catch((cause) => setError(cause.message)) }, [load])
  const update = async (id: string, changes: Record<string, unknown>) => {
    setError(""); setMessage("")
    try { await adminRequest("/api/admin/leads", { method: "PATCH", body: JSON.stringify({ id, ...changes }) }); setMessage("Lead updated."); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update lead.") }
  }
  return <><Heading eyebrow="Sales operations" title="Customer leads" /><Notice error={error} message={message} />{!leads.length ? <div className="grid min-h-56 place-items-center rounded-2xl bg-card text-center"><div><Users className="mx-auto text-primary" /><p className="mt-3 font-bold">No authorized leads to display</p></div></div> : <div className="space-y-4">{leads.map((lead) => <LeadCard key={lead.id} lead={lead} assignees={assignees} canAssign={canAssign} canRecordSale={canRecordSale} onUpdate={update} />)}</div>}</>
}

function LeadCard({ lead, assignees, canAssign, canRecordSale, onUpdate }: { lead: Lead; assignees: { uid: string; name: string }[]; canAssign: boolean; canRecordSale: boolean; onUpdate: (id: string, changes: Record<string, unknown>) => Promise<void> }) {
  const [note, setNote] = useState("")
  const [visitDate, setVisitDate] = useState("")
  const [visitLocation, setVisitLocation] = useState("")
  const [saleAmount, setSaleAmount] = useState("")
  return <article className="rounded-2xl bg-card p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 lg:flex-row"><div><h3 className="font-serif text-2xl">{lead.name}</h3><p className="mt-1 text-sm text-muted-foreground">{lead.email} · {lead.phone || "No phone"}</p><p className="mt-3 max-w-3xl text-sm leading-6">{lead.message}</p></div><div className="grid min-w-64 gap-3 sm:grid-cols-2 lg:grid-cols-1"><select className={inputClass} value={lead.status} onChange={(event) => void onUpdate(lead.id, { status: event.target.value })}>{["new", "contacted", "qualified", "site_visit_scheduled", "negotiating", "won", "lost"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select>{canAssign && <select className={inputClass} value={lead.assignedTo || ""} onChange={(event) => void onUpdate(lead.id, { assignedTo: event.target.value || null })}><option value="">Unassigned</option>{assignees.map((person) => <option key={person.uid} value={person.uid}>{person.name}</option>)}</select>}</div></div><div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-3"><div className="flex gap-2"><input className={inputClass} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Interaction note" /><Button variant="outline" onClick={() => { if (note.trim()) void onUpdate(lead.id, { interaction: { type: "note", note } }).then(() => setNote("")) }}>Add</Button></div><div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><input className={inputClass} type="datetime-local" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} /><input className={inputClass} value={visitLocation} onChange={(event) => setVisitLocation(event.target.value)} placeholder="Visit location" /><Button variant="outline" onClick={() => { if (visitDate && visitLocation) void onUpdate(lead.id, { siteVisit: { scheduledFor: new Date(visitDate).toISOString(), location: visitLocation } }).then(() => { setVisitDate(""); setVisitLocation("") }) }}>Schedule</Button></div><div className="flex gap-2">{canRecordSale ? <><input className={inputClass} type="number" min="1" value={saleAmount} onChange={(event) => setSaleAmount(event.target.value)} placeholder="Completed sale (NGN)" /><Button onClick={() => { const amountNgn = Number(saleAmount); if (amountNgn > 0) void onUpdate(lead.id, { completedSale: { amountNgn } }).then(() => setSaleAmount("")) }}>Record</Button></> : <><input className={inputClass} value={saleAmount} onChange={(event) => setSaleAmount(event.target.value)} placeholder="Sales progress update" /><Button onClick={() => { if (saleAmount.trim()) void onUpdate(lead.id, { salesUpdate: saleAmount }).then(() => setSaleAmount("")) }}>Submit</Button></>}</div></div></article>
}

function StaffSection({ currentUid }: { currentUid: string }) {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [form, setForm] = useState({ name: "", email: "", password: "", roles: [] as AppRole[] })
  const [error, setError] = useState(""); const [message, setMessage] = useState("")
  const load = useCallback(async () => setStaff((await adminRequest<{ staff: StaffMember[] }>("/api/admin/staff")).staff), [])
  useEffect(() => { void load().catch((cause) => setError(cause.message)) }, [load])
  const create = async (event: FormEvent) => { event.preventDefault(); setError(""); try { const result = await adminRequest<{ staffId: string }>("/api/admin/staff", { method: "POST", body: JSON.stringify(form) }); setForm({ name: "", email: "", password: "", roles: [] }); setMessage(`Staff account created. Employee ID: ${result.staffId}`); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create account.") } }
  const save = async (member: StaffMember) => { try { const payload = member.staffId ? { uid: member.uid, name: member.name, roles: member.roles, active: member.active } : { uid: member.uid, name: member.name }; const result = await adminRequest<{ staffId: string }>("/api/admin/staff", { method: "PATCH", body: JSON.stringify(payload) }); setMessage(member.staffId ? "Staff access updated." : `Employee ID assigned: ${result.staffId}`); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update account.") } }
  return <><Heading eyebrow="Super Administrator" title="Administrator management" /><Notice error={error} message={message} /><form onSubmit={create} className="mb-6 rounded-2xl bg-card p-6"><h3 className="font-serif text-2xl">Create staff account</h3><div className="mt-5 grid gap-4 md:grid-cols-3"><input required className={inputClass} placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input required type="email" className={inputClass} placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><input required minLength={12} type="password" className={inputClass} placeholder="Temporary password (12+ characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div><RoleSelector value={form.roles} onChange={(roles) => setForm({ ...form, roles })} /><Button className="mt-5" disabled={!form.roles.length}>Create account</Button></form><div className="space-y-4">{staff.map((member) => <StaffCard key={member.uid} member={member} self={member.uid === currentUid} onChange={(next) => setStaff((items) => items.map((item) => item.uid === next.uid ? next : item))} onSave={save} onDelete={async () => { if (!window.confirm(`Delete ${member.name}'s administrator account?`)) return; try { await adminRequest(`/api/admin/staff?uid=${encodeURIComponent(member.uid)}`, { method: "DELETE" }); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete account.") } }} />)}</div></>
}

function RoleSelector({ value, onChange, disabled }: { value: AppRole[]; onChange: (roles: AppRole[]) => void; disabled?: boolean }) {
  return <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{Object.values(APP_ROLES).map((role) => <label key={role} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"><input type="checkbox" disabled={disabled} checked={value.includes(role)} onChange={(event) => onChange(event.target.checked ? [...value, role] : value.filter((item) => item !== role))} /><span>{ROLE_LABELS[role]}</span></label>)}</div>
}

function StaffCard({ member, self, onChange, onSave, onDelete }: { member: StaffMember; self: boolean; onChange: (member: StaffMember) => void; onSave: (member: StaffMember) => Promise<void>; onDelete: () => Promise<void> }) {
  return <article className="rounded-2xl bg-card p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><input className="border-0 bg-transparent font-serif text-2xl outline-none" value={member.name} onChange={(event) => onChange({ ...member, name: event.target.value })} /><p className="text-sm text-muted-foreground">{member.email}{self ? " · Your account" : ""}</p><p className="mt-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">{member.staffId || "ID assigned when saved"}</p></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled={self} checked={member.active} onChange={(event) => onChange({ ...member, active: event.target.checked })} />Active</label></div><RoleSelector disabled={self} value={member.roles} onChange={(roles) => onChange({ ...member, roles })} /><div className="mt-4 flex gap-2"><Button onClick={() => void onSave(member)}>{member.staffId ? "Save changes" : "Save & assign employee ID"}</Button>{!self && <Button variant="outline" onClick={() => void onDelete()}>Delete account</Button>}</div></article>
}

function PropertiesSection({ user, canCreate, canEdit, canPrice, canDelete, canMedia }: { user: SaaSUser; canCreate: boolean; canEdit: boolean; canPrice: boolean; canDelete: boolean; canMedia: boolean }) {
  const [items, setItems] = useState<ManagedProperty[]>([]); const [error, setError] = useState(""); const [message, setMessage] = useState("")
  const [form, setForm] = useState({ name: "", location: "", description: "", status: "draft", availableUnits: 0, constructionProgress: 0 })
  const load = useCallback(async () => setItems((await adminRequest<{ properties: ManagedProperty[] }>("/api/admin/properties")).properties), [])
  useEffect(() => { void load().catch((cause) => setError(cause.message)) }, [load])
  const create = async (event: FormEvent) => { event.preventDefault(); try { await adminRequest("/api/admin/properties", { method: "POST", body: JSON.stringify(form) }); setForm({ name: "", location: "", description: "", status: "draft", availableUnits: 0, constructionProgress: 0 }); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create property.") } }
  const save = async (property: ManagedProperty) => { try { const payload = { ...property }; if (!canPrice) delete payload.priceNgn; await adminRequest("/api/admin/properties", { method: "PATCH", body: JSON.stringify(payload) }); setMessage("Property updated."); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update property.") } }
  const upload = async (property: ManagedProperty, file: File) => { try { const target = ref(storage, `property-media/${user.id}/${crypto.randomUUID()}-${file.name}`); await uploadBytes(target, file, { contentType: file.type }); const url = await getDownloadURL(target); await save({ ...property, media: [...property.media, url] }) } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to upload media.") } }
  return <><Heading eyebrow="Listings & availability" title="Property management" /><Notice error={error} message={message} />{canCreate && <form onSubmit={create} className="mb-6 rounded-2xl bg-card p-6"><h3 className="font-serif text-2xl">Add property listing</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><input required className={inputClass} placeholder="Property name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input required className={inputClass} placeholder="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /><textarea className={`${areaClass} sm:col-span-2`} placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div><Button className="mt-4">Create draft</Button></form>}<div className="space-y-4">{items.map((property) => <PropertyEditor key={property.id} property={property} canEdit={canEdit} canPrice={canPrice} canDelete={canDelete} canMedia={canMedia} onChange={(next) => setItems((all) => all.map((item) => item.id === next.id ? next : item))} onSave={save} onUpload={upload} onDelete={async () => { if (!window.confirm(`Delete ${property.name}?`)) return; await adminRequest(`/api/admin/properties?id=${encodeURIComponent(property.id)}`, { method: "DELETE" }); await load() }} />)}</div></>
}

function PropertyEditor({ property, canEdit, canPrice, canDelete, canMedia, onChange, onSave, onUpload, onDelete }: { property: ManagedProperty; canEdit: boolean; canPrice: boolean; canDelete: boolean; canMedia: boolean; onChange: (property: ManagedProperty) => void; onSave: (property: ManagedProperty) => Promise<void>; onUpload: (property: ManagedProperty, file: File) => Promise<void>; onDelete: () => Promise<void> }) {
  const input = useRef<HTMLInputElement>(null)
  return <article className="rounded-2xl bg-card p-5"><div className="grid gap-4 md:grid-cols-2"><input disabled={!canEdit} className={inputClass} value={property.name} onChange={(event) => onChange({ ...property, name: event.target.value })} /><input disabled={!canEdit} className={inputClass} value={property.location} onChange={(event) => onChange({ ...property, location: event.target.value })} /><textarea disabled={!canEdit} className={`${areaClass} md:col-span-2`} value={property.description} onChange={(event) => onChange({ ...property, description: event.target.value })} /><select disabled={!canEdit} className={inputClass} value={property.status} onChange={(event) => onChange({ ...property, status: event.target.value as ManagedProperty["status"] })}>{["draft", "published", "sold", "unavailable"].map((status) => <option key={status}>{status}</option>)}</select><input disabled={!canPrice} className={inputClass} type="number" min="0" placeholder={canPrice ? "Price (NGN)" : "Price changes require Super Admin"} value={property.priceNgn || ""} onChange={(event) => onChange({ ...property, priceNgn: Number(event.target.value) })} /><label className="text-xs font-bold uppercase tracking-wider">Available units<input disabled={!canEdit} className={`${inputClass} mt-2`} type="number" min="0" value={property.availableUnits} onChange={(event) => onChange({ ...property, availableUnits: Number(event.target.value) })} /></label><label className="text-xs font-bold uppercase tracking-wider">Construction progress<input disabled={!canEdit} className={`${inputClass} mt-2`} type="number" min="0" max="100" value={property.constructionProgress} onChange={(event) => onChange({ ...property, constructionProgress: Number(event.target.value) })} /></label></div><div className="mt-4 flex flex-wrap gap-2">{canEdit && <Button onClick={() => void onSave(property)}>Save listing</Button>}{canMedia && <><input ref={input} className="sr-only" type="file" accept="image/*,video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(property, file) }} /><Button variant="outline" onClick={() => input.current?.click()}><Upload /> Upload media</Button></>}{canDelete && <Button variant="outline" onClick={() => void onDelete()}>Delete</Button>}</div></article>
}

function EstatesSection() { return <SimpleCrudSection title="Estates & developments" endpoint="/api/admin/estates" collectionKey="estates" fields={["name", "location", "description"]} /> }
function ContentSection() { return <SimpleCrudSection title="Website content" endpoint="/api/admin/content" collectionKey="content" fields={["type", "title", "imageUrl", "body"]} /> }

function SimpleCrudSection({ title, endpoint, collectionKey, fields }: { title: string; endpoint: string; collectionKey: string; fields: string[] }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]); const [form, setForm] = useState<Record<string, string>>({ type: "announcement" }); const [error, setError] = useState("")
  const load = useCallback(async () => { const result = await adminRequest<Record<string, Record<string, unknown>[]>>(endpoint); setItems(result[collectionKey] || []) }, [endpoint, collectionKey])
  useEffect(() => { void load().catch((cause) => setError(cause.message)) }, [load])
  const submit = async (event: FormEvent) => { event.preventDefault(); const payload = endpoint.endsWith("estates") ? { ...form, constructionProgress: 0 } : { ...form, published: false }; try { await adminRequest(endpoint, { method: "POST", body: JSON.stringify(payload) }); setForm({ type: "announcement" }); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save record.") } }
  const edit = async (item: Record<string, unknown>) => {
    const isEstate = endpoint.endsWith("estates")
    const primary = window.prompt(isEstate ? "Estate name" : "Content title", String(item.name || item.title || ""))?.trim()
    if (!primary) return
    const detail = window.prompt(isEstate ? "Description" : "Content body", String(item.description || item.body || ""))?.trim()
    if (!detail) return
    const payload = isEstate
      ? { id: item.id, name: primary, location: String(item.location || "Nigeria"), description: detail, constructionProgress: Number(item.constructionProgress || 0) }
      : { id: item.id, type: item.type, title: primary, body: detail, imageUrl: String(item.imageUrl || ""), published: item.published === true }
    try { await adminRequest(endpoint, { method: "PATCH", body: JSON.stringify(payload) }); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update record.") }
  }
  const remove = async (item: Record<string, unknown>) => {
    if (!window.confirm("Delete this record?")) return
    try { await adminRequest(`${endpoint}?id=${encodeURIComponent(String(item.id))}`, { method: "DELETE" }); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete record.") }
  }
  const togglePublish = async (item: Record<string, unknown>) => {
    try { await adminRequest(endpoint, { method: "PATCH", body: JSON.stringify({ id: item.id, type: item.type, title: item.title, body: item.body, imageUrl: item.imageUrl || "", published: item.published !== true }) }); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to change publishing status.") }
  }
  return <><Heading eyebrow="Publishing operations" title={title} /><Notice error={error} /><form onSubmit={submit} className="rounded-2xl bg-card p-6"><div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => field === "description" || field === "body" ? <textarea key={field} required className={`${areaClass} sm:col-span-2`} placeholder={field} value={form[field] || ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /> : field === "type" ? <select key={field} className={inputClass} value={form.type || "announcement"} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="announcement">Announcement</option><option value="banner">Banner</option><option value="testimonial">Testimonial</option></select> : <input key={field} required className={inputClass} placeholder={field} value={form[field] || ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}</div><Button className="mt-4">Add record</Button></form><div className="mt-6 grid gap-4 md:grid-cols-2">{items.map((item) => <article key={String(item.id)} className="rounded-2xl bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">{String(item.type || "Development")}{"published" in item ? ` · ${item.published ? "Published" : "Draft"}` : ""}</p><h3 className="mt-2 font-serif text-2xl">{String(item.title || item.name)}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{String(item.body || item.description || item.location || "")}</p><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={() => void edit(item)}>Edit</Button>{"published" in item && <Button variant="outline" onClick={() => void togglePublish(item)}>{item.published ? "Unpublish" : "Publish"}</Button>}<Button variant="outline" onClick={() => void remove(item)}>Delete</Button></div></article>)}</div></>
}

function ReportsSection({ canFinancial }: { canFinancial: boolean }) {
  const [data, setData] = useState<{ totals: Record<string, number>; representatives: { uid: string; name: string; assignedLeads: number; completedSales: number }[] } | null>(null); const [error, setError] = useState("")
  useEffect(() => { void adminRequest<typeof data>("/api/admin/reports").then(setData).catch((cause) => setError(cause.message)) }, [])
  return <><Heading eyebrow="Sales performance" title="Reports & analytics" /><Notice error={error} />{!data ? <Loading /> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(data.totals).filter(([key]) => canFinancial || key !== "revenueNgn").map(([key, value]) => <article key={key} className="rounded-2xl bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{key.replaceAll(/([A-Z])/g, " $1")}</p><p className="mt-3 text-2xl font-bold">{key === "revenueNgn" ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value) : value}</p></article>)}</div><div className="mt-6 overflow-x-auto rounded-2xl bg-card"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b border-border"><th className="p-4">Representative</th><th className="p-4">Assigned leads</th><th className="p-4">Completed sales</th></tr></thead><tbody>{data.representatives.map((person) => <tr key={person.uid} className="border-b border-border last:border-0"><td className="p-4 font-bold">{person.name}</td><td className="p-4">{person.assignedLeads}</td><td className="p-4">{person.completedSales}</td></tr>)}</tbody></table></div></>}</>
}

function ActivitySection() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]); const [error, setError] = useState("")
  useEffect(() => { void adminRequest<{ activity: Record<string, unknown>[] }>("/api/admin/activity").then((result) => setItems(result.activity)).catch((cause) => setError(cause.message)) }, [])
  return <><Heading eyebrow="Security audit" title="System activity" /><Notice error={error} /><div className="rounded-2xl bg-card p-6"><div className="space-y-4">{items.map((item) => <div key={String(item.id)} className="flex flex-col justify-between gap-1 border-b border-border pb-4 text-sm last:border-0 sm:flex-row"><span><strong>{String(item.action)}</strong> by {String(item.actorName)}</span><span className="text-xs text-muted-foreground">{new Date(String(item.createdAt)).toLocaleString()}</span></div>)}</div></div></>
}

function SettingsSection() {
  const [settings, setSettings] = useState<Record<string, string | number | boolean>>({ companyName: "TONMAG Homes", supportEmail: "", supportPhone: "", leadResponseTargetHours: 24, maintenanceMode: false }); const [error, setError] = useState(""); const [message, setMessage] = useState("")
  useEffect(() => { void adminRequest<{ settings: Record<string, string | number | boolean> }>("/api/admin/settings").then((result) => setSettings((current) => ({ ...current, ...result.settings }))).catch((cause) => setError(cause.message)) }, [])
  const submit = async (event: FormEvent) => { event.preventDefault(); try { const { updatedAt: _updatedAt, updatedBy: _updatedBy, ...payload } = settings; await adminRequest("/api/admin/settings", { method: "PATCH", body: JSON.stringify(payload) }); setMessage("System settings updated.") } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save settings.") } }
  return <><Heading eyebrow="Super Administrator" title="System settings" /><Notice error={error} message={message} /><form onSubmit={submit} className="max-w-3xl rounded-2xl bg-card p-6"><div className="grid gap-4 sm:grid-cols-2"><input className={inputClass} value={String(settings.companyName || "")} onChange={(event) => setSettings({ ...settings, companyName: event.target.value })} placeholder="Company name" /><input type="email" className={inputClass} value={String(settings.supportEmail || "")} onChange={(event) => setSettings({ ...settings, supportEmail: event.target.value })} placeholder="Support email" /><input className={inputClass} value={String(settings.supportPhone || "")} onChange={(event) => setSettings({ ...settings, supportPhone: event.target.value })} placeholder="Support phone" /><input type="number" min="1" max="168" className={inputClass} value={Number(settings.leadResponseTargetHours || 24)} onChange={(event) => setSettings({ ...settings, leadResponseTargetHours: Number(event.target.value) })} /><label className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={Boolean(settings.maintenanceMode)} onChange={(event) => setSettings({ ...settings, maintenanceMode: event.target.checked })} />Maintenance mode</label></div><Button className="mt-5">Save system settings</Button></form></>
}
