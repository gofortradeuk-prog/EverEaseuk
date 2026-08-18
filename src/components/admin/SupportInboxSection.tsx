import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  UserCheck, 
  ArrowRight, 
  X, 
  MessageSquare, 
  ShieldAlert, 
  RefreshCw,
  PhoneCall,
  Check
} from 'lucide-react';
import { SupportTicket, AdminUser } from '../../types';

interface SupportInboxSectionProps {
  tickets: SupportTicket[];
  loading: boolean;
  onRefresh: () => void;
  currentAdminUid: string;
  currentAdminName: string;
  onAssignTicket: (ticketId: string, adminUid: string, adminName: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved', notes: string) => Promise<{ success: boolean; error?: string }>;
}

export const SupportInboxSection: React.FC<SupportInboxSectionProps> = ({
  tickets,
  loading,
  onRefresh,
  currentAdminUid,
  currentAdminName,
  onAssignTicket,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [assignModalTicket, setAssignModalTicket] = useState<SupportTicket | null>(null);
  const [resolutionModalTicket, setResolutionModalTicket] = useState<SupportTicket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available support staff list for assignment
  const SUPPORT_STAFF_MEMBERS = [
    { uid: currentAdminUid || 'admin_support_james', name: `${currentAdminName || 'James Wilson'} (You)` },
    { uid: 'admin_support_sarah', name: 'Sarah Jenkins (Safeguarding Lead)' },
    { uid: 'admin_support_david', name: 'David Evans (Tech Support Specialist)' },
    { uid: 'admin_super_arthur', name: 'Dr. Arthur Pendelton (Clinical / Safety)' },
  ];

  const [selectedStaffUid, setSelectedStaffUid] = useState(SUPPORT_STAFF_MEMBERS[0].uid);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.userPhone || '').includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const handleAssign = async () => {
    if (!assignModalTicket) return;
    const staff = SUPPORT_STAFF_MEMBERS.find((s) => s.uid === selectedStaffUid) || SUPPORT_STAFF_MEMBERS[0];
    setIsSubmitting(true);
    const res = await onAssignTicket(assignModalTicket.id, staff.uid, staff.name.replace(' (You)', ''));
    setIsSubmitting(false);
    if (res.success) {
      setAssignModalTicket(null);
    } else {
      alert('Could not assign ticket: ' + res.error);
    }
  };

  const handleResolve = async () => {
    if (!resolutionModalTicket) return;
    setIsSubmitting(true);
    const res = await onUpdateStatus(
      resolutionModalTicket.id, 
      'resolved', 
      resolutionNotes || 'Contacted senior and resolved inquiry.'
    );
    setIsSubmitting(false);
    if (res.success) {
      setResolutionModalTicket(null);
      setResolutionNotes('');
      if (selectedTicket?.id === resolutionModalTicket.id) {
        setSelectedTicket(null);
      }
    } else {
      alert('Could not update status: ' + res.error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-rose-700" /> URGENT</span>;
      case 'high':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-[11px] font-black uppercase tracking-wider">HIGH</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold uppercase">NORMAL</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-black uppercase flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-black uppercase flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-600" /> In Progress</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-black uppercase flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Open</span>;
    }
  };

  return (
    <div className="space-y-6" id="admin-support-inbox-section">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-indigo-700" />
              <span>Support & Safeguarding Escalation Inbox</span>
            </h2>
            <p className="text-sm text-slate-500">
              Inbound inquiries, scam check escalations, and family support requests across all UK members.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1 text-xs font-bold"
            title="Refresh inbox"
            id="refresh-inbox-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search tickets by member name, phone, or issue description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-400 transition-all"
              id="admin-inbox-search-input"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                id={`filter-inbox-status-${st}`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" id="admin-tickets-table">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-xs">
              <tr>
                <th className="px-5 py-4">Ticket / Escalation</th>
                <th className="px-5 py-4">Senior Member</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Assigned Staff</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No tickets found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {ticket.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                          {ticket.description}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(ticket.createdAt).toLocaleString('en-GB')}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{ticket.userName}</p>
                      {ticket.userPhone ? (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {ticket.userPhone}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">{ticket.userEmail || 'Member'}</p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {getPriorityBadge(ticket.priority)}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>

                    <td className="px-5 py-4 text-xs">
                      {ticket.assignedAdminName ? (
                        <span className="font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          {ticket.assignedAdminName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          id={`view-ticket-${ticket.id}`}
                        >
                          Details
                        </button>

                        <button
                          onClick={() => {
                            setAssignModalTicket(ticket);
                            setSelectedStaffUid(ticket.assignedAdminUid || currentAdminUid || SUPPORT_STAFF_MEMBERS[0].uid);
                          }}
                          className="px-2.5 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          id={`assign-ticket-${ticket.id}`}
                        >
                          Assign
                        </button>

                        {ticket.status !== 'resolved' && (
                          <button
                            onClick={() => {
                              setResolutionModalTicket(ticket);
                              setResolutionNotes('');
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                            id={`resolve-ticket-${ticket.id}`}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Escalation Details
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h3 className="text-xl font-black text-white">{selectedTicket.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              {/* Member Contact Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold uppercase text-slate-400">Senior Member</span>
                  <p className="text-base font-bold text-slate-900">{selectedTicket.userName}</p>
                  <p className="text-xs text-slate-500">{selectedTicket.userEmail}</p>
                </div>

                {selectedTicket.userPhone && (
                  <a
                    href={`tel:${selectedTicket.userPhone}`}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Senior ({selectedTicket.userPhone})</span>
                  </a>
                )}
              </div>

              {/* Full Inquiry Description */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Member Request / Incident Description
                </h4>
                <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl text-slate-800 leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Raw Payload (if scam or technical inquiry) */}
              {selectedTicket.rawPayload && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Incident Safeguarding Metadata
                  </h4>
                  <div className="p-3.5 bg-slate-900 text-purple-300 rounded-2xl font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(selectedTicket.rawPayload, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Resolution Notes if already resolved */}
              {selectedTicket.resolutionNotes && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-xs font-bold uppercase text-emerald-800">Resolution Record</span>
                  <p className="text-sm font-semibold text-emerald-950">{selectedTicket.resolutionNotes}</p>
                  <p className="text-xs text-emerald-700">Resolved by support staff</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>

              {selectedTicket.status !== 'resolved' && (
                <button
                  onClick={() => {
                    const t = selectedTicket;
                    setSelectedTicket(null);
                    setResolutionModalTicket(t);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assignModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Assign Ticket to Staff Member</h3>
            <p className="text-xs text-slate-500">
              Assigning will notify the staff member and record an entry in the security audit logs.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-700">Select Staff Admin</label>
              <select
                value={selectedStaffUid}
                onChange={(e) => setSelectedStaffUid(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-400"
                id="assign-staff-select"
              >
                {SUPPORT_STAFF_MEMBERS.map((s) => (
                  <option key={s.uid} value={s.uid}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAssignModalTicket(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {resolutionModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Resolve Safeguarding Ticket</h3>
            <p className="text-xs text-slate-500">
              Summarise the telephone or online advice provided to <strong>{resolutionModalTicket.userName}</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-700">Staff Resolution Notes *</label>
              <textarea
                rows={3}
                placeholder="e.g. Telephoned Margaret, confirmed SMS was fake HMRC phishing text, advised her to block the 079 number and not click the link."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-400"
                id="ticket-resolution-notes"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResolutionModalTicket(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Saving...' : 'Mark Ticket Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
