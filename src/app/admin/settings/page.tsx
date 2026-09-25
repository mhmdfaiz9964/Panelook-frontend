'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  adminFetch,
  runStorageLink,
  runOptimizeClear,
  getSystemStatus,
} from '@/lib/adminApi';
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  HardDrive,
  RefreshCw,
  Server,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Wrench,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

const FIELDS: { key: string; label: string; placeholder?: string; type?: 'text' | 'textarea' }[] = [
  { key: 'store_name', label: 'Store Name', placeholder: 'Panelook.lk' },
  { key: 'store_tagline', label: 'Store Tagline', placeholder: "Sri Lanka's #1 Laptop Display Store" },
  { key: 'phone', label: 'Phone Number', placeholder: '076 123 4567' },
  { key: 'whatsapp', label: 'WhatsApp Number (international format)', placeholder: '94761234567' },
  { key: 'email', label: 'Support Email', placeholder: 'info@panelook.lk' },
  { key: 'address', label: 'Store Address', placeholder: 'Colombo, Sri Lanka', type: 'textarea' },
  { key: 'currency', label: 'Currency', placeholder: 'LKR' },
  { key: 'shipping_flat_rate', label: 'Flat Shipping Rate (LKR)', placeholder: '650' },
  { key: 'whatsapp_message', label: 'Default WhatsApp Message', type: 'textarea' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'maintenance'>('general');

  // General Settings state
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // System Maintenance state
  const [runningStorageLink, setRunningStorageLink] = useState(false);
  const [runningOptimizeClear, setRunningOptimizeClear] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [consoleLogs, setConsoleLogs] = useState<
    { command: string; output: string; time: string; success: boolean }[]
  >([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Load General Settings
  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/settings');
        const json = await res.json();
        if (json.success) setValues(json.data);
        else setError('Could not load settings.');
      } catch {
        setError('Backend API is unreachable.');
      }
      setLoading(false);
    })();
  }, []);

  // Fetch System Status when switching to maintenance tab
  useEffect(() => {
    if (activeTab === 'maintenance' && !systemStatus) {
      loadSystemStatus();
    }
  }, [activeTab]);

  const loadSystemStatus = async () => {
    setStatusLoading(true);
    const res = await getSystemStatus();
    if (res.success && res.data) {
      setSystemStatus(res.data);
    }
    setStatusLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch('/admin/settings', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert(json.message || 'Could not save settings.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setSaving(false);
  };

  // Trigger Artisan storage:link
  const handleRunStorageLink = async () => {
    setRunningStorageLink(true);
    const now = new Date().toLocaleTimeString();
    try {
      const res = await runStorageLink();
      const output = res.output || res.message || 'Storage link executed.';
      setConsoleLogs((prev) => [
        {
          command: 'php artisan storage:link --force',
          output: output,
          time: now,
          success: res.success,
        },
        ...prev,
      ]);
      // Refresh status to update live link badge
      await loadSystemStatus();
    } catch (err: any) {
      setConsoleLogs((prev) => [
        {
          command: 'php artisan storage:link --force',
          output: `Error: ${err.message}`,
          time: now,
          success: false,
        },
        ...prev,
      ]);
    }
    setRunningStorageLink(false);
  };

  // Trigger Artisan optimize:clear
  const handleRunOptimizeClear = async () => {
    setRunningOptimizeClear(true);
    const now = new Date().toLocaleTimeString();
    try {
      const res = await runOptimizeClear();
      const output = res.output || res.message || 'All caches cleared.';
      setConsoleLogs((prev) => [
        {
          command: 'php artisan optimize:clear',
          output: output,
          time: now,
          success: res.success,
        },
        ...prev,
      ]);
      await loadSystemStatus();
    } catch (err: any) {
      setConsoleLogs((prev) => [
        {
          command: 'php artisan optimize:clear',
          output: `Error: ${err.message}`,
          time: now,
          success: false,
        },
        ...prev,
      ]);
    }
    setRunningOptimizeClear(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Resolve base host for browser URLs
  const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  const storageLinkDirectUrl = `${backendBaseUrl}/system/storage-link?secret=panelook_admin_2026`;
  const optimizeClearDirectUrl = `${backendBaseUrl}/system/optimize-clear?secret=panelook_admin_2026`;

  return (
    <AdminLayout title="Settings & System Tools">
      {/* Top Header & Tab Switcher */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#17203D] tracking-tight">System & Store Control</h2>
          <p className="text-xs text-[#66708A] mt-1 font-medium">
            Manage store-wide variables and trigger direct Laravel Artisan maintenance routines.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex p-1 bg-slate-200/70 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-white text-[#5425F5] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'maintenance'
                ? 'bg-white text-[#5425F5] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            System Maintenance
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* TAB 1: GENERAL STORE SETTINGS */}
      {activeTab === 'general' && (
        <>
          {loading ? (
            <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Loading settings...
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 max-w-3xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIELDS.map((f) => (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">
                      {f.label}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={values[f.key] ?? ''}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-3.5 py-2.5 border border-[#DDE2EE] rounded-xl text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5] resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[f.key] ?? ''}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full h-10 px-3.5 border border-[#DDE2EE] rounded-xl text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 shadow-xs flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Saved Successfully
                  </span>
                )}
              </div>
            </form>
          )}
        </>
      )}

      {/* TAB 2: SYSTEM MAINTENANCE & ARTISAN TOOLS */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6 max-w-5xl">
          {/* Artisan Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Storage Link */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-200 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  {systemStatus?.storage_link && (
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        systemStatus.storage_link.exists
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          systemStatus.storage_link.exists ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {systemStatus.storage_link.exists ? 'Symlink Active' : 'Not Connected'}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">Run Storage Symlink</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Executes <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-[11px]">php artisan storage:link --force</code>.
                  Connects <span className="font-mono text-slate-700">public/storage</span> to <span className="font-mono text-slate-700">storage/app/public</span> so uploaded product images display instantly.
                </p>

                {/* Direct URL Box */}
                <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Route URL</span>
                    <span className="block text-[11px] font-mono text-slate-600 truncate">{storageLinkDirectUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(storageLinkDirectUrl, 'storage')}
                    title="Copy Direct URL"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors shrink-0"
                  >
                    {copiedUrl === 'storage' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={runningStorageLink}
                  onClick={handleRunStorageLink}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {runningStorageLink ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating Link...
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-3.5 h-3.5" />
                      Run storage:link
                    </>
                  )}
                </button>
                <a
                  href={storageLinkDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-indigo-600 font-semibold inline-flex items-center gap-1"
                >
                  Open in Tab <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Card 2: Optimize Clear */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-200 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Safe Maintenance
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">Optimize Clear Caches</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Executes <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600 font-mono text-[11px]">php artisan optimize:clear</code>.
                  Clears compiled views, config, routes, and memory caches. Ideal after updating backend files or environment variables.
                </p>

                {/* Direct URL Box */}
                <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Route URL</span>
                    <span className="block text-[11px] font-mono text-slate-600 truncate">{optimizeClearDirectUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(optimizeClearDirectUrl, 'optimize')}
                    title="Copy Direct URL"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors shrink-0"
                  >
                    {copiedUrl === 'optimize' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={runningOptimizeClear}
                  onClick={handleRunOptimizeClear}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {runningOptimizeClear ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Clearing Caches...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Run optimize:clear
                    </>
                  )}
                </button>
                <a
                  href={optimizeClearDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-emerald-600 font-semibold inline-flex items-center gap-1"
                >
                  Open in Tab <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Console / Terminal Output Box */}
          <div className="bg-[#121826] rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
            {/* Terminal Window Header */}
            <div className="bg-[#1E293B] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block" />
                <span className="text-[11px] text-slate-400 font-sans font-semibold ml-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Laravel Artisan Output Console
                </span>
              </div>
              {consoleLogs.length > 0 && (
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors underline font-sans"
                >
                  Clear Console
                </button>
              )}
            </div>

            {/* Terminal Body */}
            <div className="p-4 max-h-[360px] overflow-y-auto space-y-4">
              {consoleLogs.length === 0 ? (
                <div className="text-slate-500 py-6 text-center italic">
                  No commands executed yet in this session. Click &quot;Run storage:link&quot; or &quot;Run optimize:clear&quot; above to view live CLI output.
                </div>
              ) : (
                consoleLogs.map((log, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-slate-800/80 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-bold">
                        <span className="text-slate-500">$</span> {log.command}
                      </span>
                      <span className="text-[10px] text-slate-500">{log.time}</span>
                    </div>
                    <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-slate-700 text-[11px]">
                      {log.output}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Diagnostics Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#5425F5]" />
                <h3 className="text-sm font-bold text-slate-900">Backend System Diagnostics</h3>
              </div>
              <button
                type="button"
                onClick={loadSystemStatus}
                disabled={statusLoading}
                className="text-xs text-[#5425F5] hover:underline font-semibold flex items-center gap-1 disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${statusLoading ? 'animate-spin' : ''}`} />
                Refresh Status
              </button>
            </div>

            {statusLoading && !systemStatus ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin inline mr-1.5" />
                Reading system environment...
              </div>
            ) : systemStatus ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">PHP Version</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{systemStatus.php_version}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Laravel Framework</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">v{systemStatus.laravel_version}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Environment</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block capitalize">{systemStatus.app_env}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">App URL</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">{systemStatus.app_url}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Cache Driver</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block capitalize">{systemStatus.cache_driver}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Server Software</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">{systemStatus.server_software}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Storage Symlink Target</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate font-mono text-[11px]">
                    {systemStatus.storage_link?.target || 'Direct folder connection'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl">
                Could not connect to backend diagnostics. Ensure backend is running.
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
