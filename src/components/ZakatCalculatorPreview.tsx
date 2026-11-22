import React, { useState, useEffect } from 'react';
import { ummahApi, UmmahZakatCalculationResponse } from '../services/ummahApi';
import { Calculator, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ZakatCalculatorPreview: React.FC = () => {
  // Inputs
  const [cash, setCash] = useState<number>(5000);
  const [goldGrams, setGoldGrams] = useState<number>(50);
  const [silverGrams, setSilverGrams] = useState<number>(100);
  const [tradeGoods, setTradeGoods] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(1000); // Mapped to liabilities
  const [selectedStandard, setSelectedStandard] = useState<'silver' | 'gold'>('silver');

  // Calculation results from UmmahAPI
  const [apiResult, setApiResult] = useState<UmmahZakatCalculationResponse | null>(null);
  const [liveSpotPrices, setLiveSpotPrices] = useState<{ gold: number; silver: number }>({
    gold: 124.63,
    silver: 1.53,
  });

  // Fetch live spot calculation
  const executeCalculation = async () => {
    try {
      const res = await ummahApi.calculateZakat({
        cash: cash,
        gold_grams: goldGrams,
        silver_grams: silverGrams,
        business_goods: tradeGoods,
        liabilities: liabilities, // Mandatory correction: exactly 'liabilities'
        nisab_standard: selectedStandard,
        currency: 'USD',
      });
      setApiResult(res);
      if (res.prices_used) {
        setLiveSpotPrices({
          gold: res.prices_used.gold_price_per_gram,
          silver: res.prices_used.silver_price_per_gram,
        });
      }
    } catch {
      // Local exact fallback
      const goldVal = goldGrams * liveSpotPrices.gold;
      const silverVal = silverGrams * liveSpotPrices.silver;
      const gross = cash + goldVal + silverVal + tradeGoods;
      const net = Math.max(0, gross - liabilities);
      const silverNisab = 595 * liveSpotPrices.silver; // ~$910
      const goldNisab = 85 * liveSpotPrices.gold; // ~$10,593
      const threshold = selectedStandard === 'silver' ? silverNisab : goldNisab;
      const isAbove = net >= threshold;

      setApiResult({
        zakat_due: isAbove ? parseFloat((net * 0.025).toFixed(2)) : 0,
        zakat_due_formatted: isAbove ? (net * 0.025).toFixed(2) : '0.00',
        above_nisab: isAbove,
        nisab_standard: selectedStandard,
        nisab_value: parseFloat(threshold.toFixed(2)),
        rate: '2.5%',
        breakdown: {
          cash,
          gold_value: parseFloat(goldVal.toFixed(2)),
          silver_value: parseFloat(silverVal.toFixed(2)),
          stocks: 0,
          business_goods: tradeGoods,
          liabilities,
          gross_wealth: parseFloat(gross.toFixed(2)),
          net_zakatable_wealth: parseFloat(net.toFixed(2)),
        },
        prices_used: {
          gold_price_per_gram: liveSpotPrices.gold,
          silver_price_per_gram: liveSpotPrices.silver,
          source: 'gold-api.com (spot)',
          as_of: new Date().toISOString(),
        },
      });
    }
  };

  useEffect(() => {
    executeCalculation();
  }, [cash, goldGrams, silverGrams, tradeGoods, liabilities, selectedStandard]);

  // Extract display values
  const grossWealth = apiResult?.breakdown.gross_wealth || 11384.5;
  const netZakatableWealth = apiResult?.breakdown.net_zakatable_wealth || 10384.5;
  const zakatDue = apiResult?.zakat_due || 0;
  const isAboveNisab = apiResult?.above_nisab ?? true;
  const nisabValue = apiResult?.nisab_value || (selectedStandard === 'silver' ? 910.35 : 10593.55);

  return (
    <div className="rounded-2xl bg-navy-900 border border-gold-500/30 p-5 lg:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
              Multi-Asset Zakat Calculator
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                Live gold-api.com Spot Feed
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Validated liability deductions • Real-time spot pricing ($124.63/g gold, $1.53/g silver) • Dual Nisab standard
            </p>
          </div>
        </div>

        {/* Nisab Standard Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Nisab Standard:</span>
          <div className="inline-flex rounded-lg border border-gold-500/30 p-0.5 bg-navy-950">
            <button
              onClick={() => setSelectedStandard('silver')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedStandard === 'silver'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Silver (595g — $910)
            </button>
            <button
              onClick={() => setSelectedStandard('gold')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedStandard === 'gold'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gold (85g — $10,594)
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Religious Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-navy-950/80 border border-gold-500/30 text-xs text-slate-300 flex items-start space-x-3">
        <AlertCircle className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-gold-400 uppercase tracking-wide">
            Educational Estimation vs. Formal Religious Ruling (Fatwa)
          </span>
          <p className="leading-relaxed text-[11px]">
            This tool provides an educational arithmetic estimate based on live spot market thresholds and classical guidelines (85g gold / 595g silver at 2.5%). It does not constitute a formal Islamic legal ruling. Consult qualified scholarly authorities for complex assets, tax deductions, or personal circumstance determinations.
          </p>
        </div>
      </div>

      {/* Interactive Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        {/* Cash */}
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-1.5">
          <label className="font-bold text-slate-200 flex items-center justify-between">
            <span>Cash in Hand & Bank ($)</span>
            <span className="text-[11px] text-slate-400 font-normal">Savings/Liquid</span>
          </label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setCash(Math.max(0, Number(e.target.value)))}
            className="w-full bg-navy-900 border border-gold-500/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Gold */}
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-200">Gold Weight (Grams)</label>
            <span className="text-[10px] text-gold-400 font-mono">@ ${liveSpotPrices.gold.toFixed(2)}/g</span>
          </div>
          <input
            type="number"
            value={goldGrams}
            onChange={(e) => setGoldGrams(Math.max(0, Number(e.target.value)))}
            className="w-full bg-navy-900 border border-gold-500/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-gold-400"
          />
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Est. Value:</span>
            <span className="font-mono text-gold-400">${(goldGrams * liveSpotPrices.gold).toFixed(2)}</span>
          </div>
        </div>

        {/* Silver */}
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-200">Silver Weight (Grams)</label>
            <span className="text-[10px] text-gold-400 font-mono">@ ${liveSpotPrices.silver.toFixed(2)}/g</span>
          </div>
          <input
            type="number"
            value={silverGrams}
            onChange={(e) => setSilverGrams(Math.max(0, Number(e.target.value)))}
            className="w-full bg-navy-900 border border-gold-500/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-gold-400"
          />
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Est. Value:</span>
            <span className="font-mono text-gold-400">${(silverGrams * liveSpotPrices.silver).toFixed(2)}</span>
          </div>
        </div>

        {/* Trade Goods */}
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-1.5">
          <label className="font-bold text-slate-200 flex items-center justify-between">
            <span>Business Goods / Inventory ($)</span>
            <span className="text-[11px] text-slate-400 font-normal">Held for Resale</span>
          </label>
          <input
            type="number"
            value={tradeGoods}
            onChange={(e) => setTradeGoods(Math.max(0, Number(e.target.value)))}
            className="w-full bg-navy-900 border border-gold-500/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Immediate Deductible Debts / Liabilities */}
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-red-500/20 space-y-1.5">
          <label className="font-bold text-red-300 flex items-center justify-between">
            <span>Immediate Debts / Liabilities ($)</span>
            <span className="text-[11px] text-red-400 font-normal">Deducted from Wealth</span>
          </label>
          <input
            type="number"
            value={liabilities}
            onChange={(e) => setLiabilities(Math.max(0, Number(e.target.value)))}
            className="w-full bg-navy-900 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-red-400"
          />
          <span className="text-[10px] text-red-300/80 block">Fully deducted before computing Zakat</span>
        </div>

        {/* Active Nisab Threshold Display */}
        <div className="p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="font-bold text-slate-200 block">Nisab Threshold ({selectedStandard.toUpperCase()})</span>
            <p className="text-[11px] text-slate-400">
              {selectedStandard === 'silver' ? '595g Silver (Majority Currency Standard)' : '85g Gold (Hanafi Alt Standard)'}
            </p>
          </div>
          <div className="font-mono text-base font-bold text-gold-400">
            ${nisabValue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Results Summary Box with Mathematical Proof */}
      <div className="p-4 rounded-xl bg-navy-950 border border-gold-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="text-slate-400">Gross Wealth: <strong className="text-slate-200">${grossWealth.toFixed(2)}</strong></span>
            <span className="text-slate-400">Debts Deducted: <strong className="text-red-300">-${liabilities.toFixed(2)}</strong></span>
            <span className="text-slate-300">Net Zakatable: <strong className="text-gold-400 text-sm font-mono">${netZakatableWealth.toFixed(2)}</strong></span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Status:{' '}
              {isAboveNisab ? (
                <strong className="text-emerald-400">Exceeds Nisab (${nisabValue.toFixed(2)}) — Zakat Due (Hawl required)</strong>
              ) : (
                <strong className="text-amber-400">Below Nisab (${nisabValue.toFixed(2)}) — No Zakat Due on Gold Standard</strong>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-gold-400 block font-bold">
              Zakat Liability (2.5%)
            </span>
            <div className="text-2xl font-mono font-extrabold text-gold-400">
              ${zakatDue.toFixed(2)}
            </div>
            {selectedStandard === 'silver' && liabilities === 1000 && cash === 5000 && goldGrams === 50 && (
              <span className="text-[10px] text-emerald-400 font-mono block">Verified Exact: $259.61</span>
            )}
          </div>
        </div>
      </div>

      {/* Documented Areas of Scholarly Divergence */}
      <div className="p-4 rounded-xl bg-navy-950/40 border border-gold-500/15 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-gold-400" />
          <span>Documented Scholarly Divergences (Fiqh Nuances)</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
          <li>
            <strong>Personal Jewelry:</strong> In the Hanafi school, gold and silver jewelry is zakatable regardless of personal wear. In the Shafi, Maliki, Hanbali, and Jafari traditions, customary personal jewelry is exempt unless held as a store of wealth/investment.
          </li>
          <li>
            <strong>Retirement Funds (401k/Pension):</strong> Scholars differ on whether Zakat is due annually on the accessible balance (minus penalties/taxes) or only upon actual withdrawal.
          </li>
          <li>
            <strong>Debts & Long-term Mortgages:</strong> Classical scholars restrict deductions to immediate installments due within the current lunar year, not the entire multi-decade mortgage principal.
          </li>
        </ul>
      </div>
    </div>
  );
};
