import React from 'react';
import { Bell, Plus, Zap, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { BlenderAssetIcon } from '../components/common/Blender3DIcons';
import { formatCurrency } from '../utils/currency';

interface AlertsViewProps {
  onOpenAddAlert: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onOpenAddAlert }) => {
  const {
    alerts,
    toggleAlert,
    deleteAlert,
    assetsMap,
    prices,
    refreshPricesNow,
    isRefreshingPrices,
    triggeredAlerts,
    clearTriggeredAlerts,
    user,
  } = useTracker();

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Price &amp; Volatility Alerts</h2>
          <p className="text-xs text-slate-400">
            Monitored by scheduled Cloud Function every 15 minutes with Web Push and Email delivery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshPricesNow}
            disabled={isRefreshingPrices}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Simulate scheduled background job to check alert conditions"
          >
            <Zap size={14} className="text-amber-400" />
            <span>Test Trigger Engine</span>
          </button>

          <button
            onClick={onOpenAddAlert}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            <span>Set New Alert</span>
          </button>
        </div>
      </div>

      {/* Triggered Events Box if any */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Zap size={16} /> Recent Alert Triggers ({triggeredAlerts.length})
            </h3>
            <button
              onClick={clearTriggeredAlerts}
              className="text-xs text-amber-400 hover:text-amber-200 underline"
            >
              Clear Log
            </button>
          </div>
          <div className="space-y-2">
            {triggeredAlerts.map((ta, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 p-3 rounded-xl border border-amber-500/20 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-bold text-white">{ta.alert.assetId}</span>
                  <span>reached ${ta.triggeredValue.toLocaleString()}</span>
                  <span className="text-slate-400">
                    (Condition: {ta.alert.condition} ${ta.alert.threshold})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock size={12} />
                  <span>{ta.time}</span>
                  <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                    Sent via {ta.alert.channel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Alerts List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">Configured Price Monitors</h3>

        {alerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No active alerts configured. Add one to be notified when target prices hit.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((al) => {
              const asset = assetsMap[al.assetId];
              const curPrice = prices[al.assetId]?.price || 0;

              let conditionLabel = '';
              if (al.condition === 'above') conditionLabel = `Rises Above $${al.threshold.toLocaleString()}`;
              if (al.condition === 'below') conditionLabel = `Drops Below $${al.threshold.toLocaleString()}`;
              if (al.condition === 'change_up_pct') conditionLabel = `Surges > +${al.threshold}% in 24h`;
              if (al.condition === 'change_down_pct') conditionLabel = `Plunges > -${al.threshold}% in 24h`;

              return (
                <div
                  key={al.id}
                  className={`p-4 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                    al.active
                      ? 'bg-slate-800/50 border-slate-700/80'
                      : 'bg-slate-900/40 border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {asset && <BlenderAssetIcon type={asset.type} size={32} />}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {asset?.symbol || al.assetId}
                        </span>
                        <span className="text-xs text-slate-400">
                          {asset?.name}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-blue-400 mt-0.5">
                        Condition: {conditionLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Current Market:</div>
                      <div className="text-xs font-mono font-bold text-white">
                        ${curPrice.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Delivery:</div>
                      <div className="text-xs font-semibold text-slate-300 capitalize">
                        {al.channel}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleAlert(al.id)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        al.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {al.active ? 'Active' : 'Paused'}
                    </button>

                    <button
                      onClick={() => deleteAlert(al.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
