import React, { useEffect, useState } from 'react';
import { leadService } from '../../../services/leadService';
import { adminService } from '../../../services/adminService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LeadsTab = () => {
  const [leads, setLeads] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await leadService.listLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    Promise.all([adminService.getAllEmployees(), adminService.getAllAgents()])
      .then(([empRes, agentRes]) => {
        const list = [
          ...(empRes?.data || []).map((e) => ({
            id: e.id,
            label: `${e.employeeName || e.employee_name || 'Employee'} (${e.email})`,
          })),
          ...(agentRes?.data || []).map((a) => ({
            id: a.id,
            label: `${a.agentName || a.agent_name || 'Agent'} (${a.email})`,
          })),
        ];
        setAssignees(list);
      })
      .catch(() => setAssignees([]));
  }, []);

  const handleAssign = async (leadId, assignedTo) => {
    if (!assignedTo) return;
    try {
      await leadService.assignLead(leadId, assignedTo);
      setActionMsg('Lead assigned.');
      load();
    } catch (err) {
      setActionMsg(err?.response?.data?.error || 'Assign failed');
    }
  };

  const handleResumeLink = async (lead, sendNotification = false) => {
    try {
      if (!lead.sessionKey) {
        setActionMsg('No saved session for this lead yet.');
        return;
      }
      const data = await leadService.createLeadResumeLink(lead.id, {
        frontendOrigin: window.location.origin,
        sendNotification,
        channel: 'email',
      });
      await navigator.clipboard?.writeText(data.url);
      setActionMsg(
        sendNotification
          ? `Continue link sent and copied: ${data.url}`
          : `Continue link copied: ${data.url}`,
      );
    } catch (err) {
      setActionMsg(err?.response?.data?.error || 'Could not create resume link');
    }
  };

  if (loading) {
    return <p className="text-muted-foreground p-6">Loading leads…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Marketing leads</h2>
          <p className="text-sm text-muted-foreground">
            Eligibility OTP leads and abandoned application drafts
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
      )}
      {actionMsg && (
        <div className="p-3 bg-primary/10 text-primary rounded-lg text-sm break-all">{actionMsg}</div>
      )}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Loan type</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Score</th>
              <th className="text-left p-3">Assign</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border align-top">
                  <td className="p-3">{lead.fullName || '—'}</td>
                  <td className="p-3">
                    <div>{lead.email}</div>
                    <div className="text-muted-foreground">{lead.phone}</div>
                  </td>
                  <td className="p-3">{lead.loanType || '—'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3">{lead.eligibilityScore ?? '—'}</td>
                  <td className="p-3 min-w-[180px]">
                    <select
                      className="w-full border border-border rounded-md px-2 py-1.5 text-sm bg-background"
                      defaultValue=""
                      onChange={(e) => handleAssign(lead.id, e.target.value)}
                    >
                      <option value="">Assign to…</option>
                      {assignees.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                    {lead.assignedTo && (
                      <p className="text-xs text-muted-foreground mt-1">Assigned</p>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!lead.sessionKey}
                        onClick={() => handleResumeLink(lead, false)}
                      >
                        Copy resume link
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!lead.sessionKey}
                        onClick={() => handleResumeLink(lead, true)}
                      >
                        Email resume link
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTab;
