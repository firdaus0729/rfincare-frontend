import React, { useEffect, useState } from 'react';
import { leadService } from '../../../services/leadService';
import Button from '../../../components/ui/Button';

const LeadsTab = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, []);

  if (loading) {
    return <p className="text-muted-foreground p-6">Loading leads…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Marketing leads</h2>
          <p className="text-sm text-muted-foreground">
            Captured from eligibility calculator and abandoned applications
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
      )}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Loan type</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Score</th>
              <th className="text-left p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No leads yet. They appear when guests verify OTP on the eligibility calculator.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border">
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
                  <td className="p-3 text-muted-foreground">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : '—'}
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
