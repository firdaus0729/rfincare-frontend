import React, { useEffect, useState, useCallback } from 'react';
import { leadService } from '../../../services/leadService';
import { adminService } from '../../../services/adminService';
import Button from '../../../components/ui/Button';

const LeadsTab = () => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigneesLoading, setAssigneesLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigneesError, setAssigneesError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadAssignees = useCallback(async () => {
    setAssigneesLoading(true);
    setAssigneesError('');
    const { data, error: err } = await adminService.getStaffAssignees();
    if (err) {
      setAssigneesError(err.message);
      setEmployees([]);
      setAgents([]);
    } else {
      setEmployees(data?.employees || []);
      setAgents(data?.agents || []);
    }
    setAssigneesLoading(false);
  }, []);

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
    loadAssignees();
  }, [loadAssignees]);

  const handleRefresh = () => {
    load();
    loadAssignees();
  };

  const handleAssign = async (leadId, assignedTo) => {
    if (!assignedTo) return;
    try {
      await leadService.assignLead(leadId, assignedTo);
      setActionMsg('Lead assigned successfully.');
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

  const staffCount = employees.length + agents.length;

  const renderAssignSelect = (lead) => (
    <select
      className="w-full border border-border rounded-md px-2 py-1.5 text-sm bg-background min-w-[220px]"
      value={lead.assignedTo || ''}
      disabled={assigneesLoading || staffCount === 0}
      onChange={(e) => handleAssign(lead.id, e.target.value)}
    >
      <option value="">
        {assigneesLoading
          ? 'Loading staff…'
          : staffCount === 0
            ? 'No employees/agents — create staff first'
            : 'Assign to…'}
      </option>
      {employees.length > 0 && (
        <optgroup label="Employees">
          {employees.map((person) => (
            <option key={person.id} value={person.id}>
              {person.label}
            </option>
          ))}
        </optgroup>
      )}
      {agents.length > 0 && (
        <optgroup label="Agents">
          {agents.map((person) => (
            <option key={person.id} value={person.id}>
              {person.label}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );

  if (loading && leads.length === 0) {
    return <p className="text-muted-foreground p-6">Loading leads…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Marketing leads</h2>
          <p className="text-sm text-muted-foreground">
            Eligibility OTP leads and abandoned application drafts
          </p>
          {!assigneesLoading && staffCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {employees.length} employee(s), {agents.length} agent(s) available to assign
            </p>
          )}
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
      )}
      {assigneesError && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {assigneesError} — redeploy backend and ensure employees/agents are created in Admin.
        </div>
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
                  <td className="p-3 min-w-[240px]">
                    {renderAssignSelect(lead)}
                    {lead.assignedTo && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Assigned:{' '}
                        <span className="font-medium text-foreground">
                          {lead.assignedToCode && lead.assignedToName
                            ? `${lead.assignedToCode} — ${lead.assignedToName}`
                            : lead.assignedToName || lead.assignedToCode || 'Staff member'}
                        </span>
                        {lead.assignedToRole && (
                          <span className="text-muted-foreground">
                            {' '}
                            ({lead.assignedToRole})
                          </span>
                        )}
                      </p>
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
