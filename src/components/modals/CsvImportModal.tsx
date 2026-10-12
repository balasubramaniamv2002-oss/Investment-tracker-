import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { TransactionType, CurrencyCode } from '../../types';

import { resolveIndianTicker } from '../../utils/indianTickerLookup';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedRow {
  rowNum: number;
  date: string;
  portfolio: string;
  symbol: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fees: number;
  currency: CurrencyCode;
  notes: string;
  isValid: boolean;
  errors: string[];
}

const SAMPLE_CSV = `Date,Portfolio,Symbol,Type,Quantity,Price,Fees,Currency,Notes
2025-06-15,Core Wealth: Nifty 50 & Bluechips,NIFTYBEES,buy,250,265.50,20,INR,Zerodha Nifty SIP
2025-07-01,Core Wealth: Nifty 50 & Bluechips,RELIANCE,buy,25,2850.00,50,INR,Monthly tranche
2025-07-15,High Alpha: Defense, Retail & Tech,HAL,buy,30,4210.00,45,INR,Defence order accumulation
2025-08-01,Core Wealth: Nifty 50 & Bluechips,TCS,buy,15,3950.00,30,INR,Quarterly equity buy
2025-09-01,Safe Haven: SGB, Gold, FDs & Property,SGB-2024,buy,10,7250.00,0,INR,RBI Gold tranche
2025-09-20,High Alpha: Defense, Retail & Tech,ZOMATO,buy,500,240.00,25,INR,Quick commerce allocation`;

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { portfolios, assets, addCustomAsset, importTransactionsBatch, user } = useTracker();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vestoria_transactions_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvText(text);
        parseAndValidateCsv(text);
      };
      reader.readAsText(file);
    }
  };

  const loadSample = () => {
    setCsvText(SAMPLE_CSV);
    parseAndValidateCsv(SAMPLE_CSV);
  };

  const parseAndValidateCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setParsedRows([]);
      return;
    }

    // Header parse
    const rows: ParsedRow[] = [];
    const validSymbols = new Set(assets.map((a) => a.symbol.toUpperCase()));

    for (let i = 1; i < lines.length; i++) {
      // Split by comma respecting quotes
      const line = lines[i];
      const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());

      const date = cols[0] || '';
      const portfolioName = cols[1] || '';
      const symbol = (cols[2] || '').toUpperCase();
      const rawType = (cols[3] || 'buy').toLowerCase();
      const quantity = parseFloat(cols[4] || '0');
      const price = parseFloat(cols[5] || '0');
      const fees = parseFloat(cols[6] || '0');
      const currency = (cols[7] || user.baseCurrency).toUpperCase() as CurrencyCode;
      const notes = cols[8] || '';

      const errors: string[] = [];

      if (!date || isNaN(new Date(date).getTime())) {
        errors.push('Invalid or missing date (use YYYY-MM-DD)');
      } else if (date > new Date().toISOString().split('T')[0]) {
        errors.push('Date cannot be in future');
      }

      if (!symbol) {
        errors.push('Symbol is required');
      } else if (!validSymbols.has(symbol)) {
        errors.push(`Symbol ${symbol} not in asset catalog (will default to custom)`);
      }

      if (isNaN(quantity) || quantity <= 0) {
        errors.push('Quantity must be > 0');
      }

      if (isNaN(price) || price < 0) {
        errors.push('Price cannot be negative');
      }

      const validTypes: TransactionType[] = ['buy', 'sell', 'dividend', 'deposit', 'withdrawal'];
      const type: TransactionType = validTypes.includes(rawType as TransactionType)
        ? (rawType as TransactionType)
        : 'buy';

      rows.push({
        rowNum: i,
        date,
        portfolio: portfolioName,
        symbol,
        type,
        quantity,
        price,
        fees: isNaN(fees) ? 0 : fees,
        currency,
        notes,
        isValid: errors.filter((e) => !e.includes('custom')).length === 0,
        errors,
      });
    }

    setParsedRows(rows);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    setIsImporting(true);
    const validToImport = parsedRows.filter((r) => r.isValid);

    const mapped = validToImport.map((r) => {
      // Find matching portfolio or default to first portfolio
      const matchedPort = portfolios.find(
        (p) => p.name.toLowerCase() === r.portfolio.toLowerCase()
      );
      const portId = matchedPort ? matchedPort.id : portfolios[0]?.id || 'port_core';

      // Find or dynamically resolve Indian asset
      let matchedAsset = assets.find((a) => a.symbol.toUpperCase() === r.symbol.toUpperCase());
      if (!matchedAsset) {
        const resolved = resolveIndianTicker(r.symbol);
        matchedAsset = addCustomAsset({
          symbol: resolved.symbol,
          name: resolved.name,
          type: resolved.type,
          currency: 'INR',
          exchange: 'NSE / BSE',
          sector: resolved.sector,
        });
      }
      const assetId = matchedAsset.id;

      return {
        portfolioId: portId,
        assetId,
        type: r.type,
        date: r.date,
        quantity: r.quantity,
        price: r.price,
        fees: r.fees,
        currency: r.currency,
        notes: r.notes || `CSV Import: ${r.portfolio}`,
      };
    });

    importTransactionsBatch(mapped);
    setIsImporting(false);
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="text-blue-500" size={20} />
              CSV Transactions Import Wizard
            </h2>
            <p className="text-xs text-slate-400">
              Bulk import transactions with automatic column validation & error reporting
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {step === 'upload' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-8 text-center transition-colors bg-slate-800/30">
                <Upload className="mx-auto text-blue-400 mb-3" size={36} />
                <h3 className="text-sm font-semibold text-white mb-1">
                  Choose a CSV file or drag & drop here
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Supports headers: Date, Portfolio, Symbol, Type, Quantity, Price, Fees, Currency, Notes
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md transition-colors">
                    Browse File
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={loadSample}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Load Sample Data
                  </button>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Download size={14} /> Download Template
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Or paste raw CSV text directly:
                </label>
                <textarea
                  rows={4}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste CSV rows here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
                {csvText.trim().length > 0 && (
                  <button
                    onClick={() => parseAndValidateCsv(csvText)}
                    className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Analyze & Preview CSV
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Validation Status Bar */}
              <div className="flex items-center justify-between bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 size={16} />
                    <span>{validCount} valid entries ready</span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <AlertTriangle size={16} />
                      <span>{invalidCount} entries with errors</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Change File
                </button>
              </div>

              {/* Table Preview */}
              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Symbol</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Portfolio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {parsedRows.map((r) => (
                      <tr
                        key={r.rowNum}
                        className={r.isValid ? 'hover:bg-slate-800/40' : 'bg-rose-950/20'}
                      >
                        <td className="p-2.5">
                          {r.isValid ? (
                            <span className="text-emerald-400">✓ Valid</span>
                          ) : (
                            <span
                              className="text-rose-400 underline cursor-help"
                              title={r.errors.join(', ')}
                            >
                              ✕ Error
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">{r.date}</td>
                        <td className="p-2.5 font-bold text-white">{r.symbol}</td>
                        <td className="p-2.5 uppercase">{r.type}</td>
                        <td className="p-2.5">{r.quantity}</td>
                        <td className="p-2.5">${r.price.toFixed(2)}</td>
                        <td className="p-2.5 truncate max-w-[100px] text-slate-400">
                          {r.portfolio}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invalidCount > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  Note: Only the {validCount} valid transactions will be imported. Rows with validation errors will be skipped safely.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          {step === 'preview' && (
            <button
              onClick={handleConfirmImport}
              disabled={validCount === 0 || isImporting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              {isImporting ? 'Importing...' : `Confirm & Import ${validCount} Transactions`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
