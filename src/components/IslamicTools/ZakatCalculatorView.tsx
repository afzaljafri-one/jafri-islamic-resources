import React, { useState, useMemo } from 'react';
import {
  calculateZakat,
  NISAB_WEIGHTS,
} from '../../services/islamic/zakatService';
import { ZakatAssetsInput } from '../../services/islamic/types';

interface CurrencyZakatData {
  goldPrice: string;
  silverPrice: string;
  cashInHand: string;
  bankBalances: string;
  goldGrams: string;
  goldKarat: 24 | 22 | 18;
  silverGrams: string;
  investmentsValue: string;
  businessGoodsValue: string;
  otherEligibleAssets: string;
  shortTermLiabilities: string;
}

const DEFAULT_CURRENCY_DATA: CurrencyZakatData = {
  goldPrice: '',
  silverPrice: '',
  cashInHand: '',
  bankBalances: '',
  goldGrams: '',
  goldKarat: 24,
  silverGrams: '',
  investmentsValue: '',
  businessGoodsValue: '',
  otherEligibleAssets: '',
  shortTermLiabilities: '',
};

export const ZakatCalculatorView: React.FC = () => {
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [currencyData, setCurrencyData] = useState<Record<string, CurrencyZakatData>>({
    $: { ...DEFAULT_CURRENCY_DATA },
    Rs: { ...DEFAULT_CURRENCY_DATA },
    '£': { ...DEFAULT_CURRENCY_DATA },
    '€': { ...DEFAULT_CURRENCY_DATA },
    AED: { ...DEFAULT_CURRENCY_DATA },
  });
  const [nisabStandard, setNisabStandard] = useState<'silver' | 'gold'>('silver');

  const current = currencyData[currencySymbol] || DEFAULT_CURRENCY_DATA;
  const goldPrice = current.goldPrice;
  const silverPrice = current.silverPrice;
  const cashInHand = current.cashInHand;
  const bankBalances = current.bankBalances;
  const goldGrams = current.goldGrams;
  const goldKarat = current.goldKarat;
  const silverGrams = current.silverGrams;
  const investmentsValue = current.investmentsValue;
  const businessGoodsValue = current.businessGoodsValue;
  const otherEligibleAssets = current.otherEligibleAssets;
  const shortTermLiabilities = current.shortTermLiabilities;

  const updateField = <K extends keyof CurrencyZakatData>(key: K, value: CurrencyZakatData[K]) => {
    setCurrencyData((prev) => ({
      ...prev,
      [currencySymbol]: {
        ...(prev[currencySymbol] || DEFAULT_CURRENCY_DATA),
        [key]: value,
      },
    }));
  };

  const handleCurrencyChange = (newSymbol: string) => {
    setCurrencySymbol(newSymbol);
    // All monetary amounts, asset inputs, liabilities, and bullion rates are strictly segregated per currency.
    // Switching currencies never silently reinterprets an amount from another currency.
  };

  const parseNumber = (val: string): number => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : Math.max(0, n);
  };

  const parsedGoldPrice = parseNumber(goldPrice);
  const parsedSilverPrice = parseNumber(silverPrice);

  const inputData: ZakatAssetsInput = useMemo(
    () => ({
      cashInHand: parseNumber(cashInHand),
      bankBalances: parseNumber(bankBalances),
      goldGrams: parseNumber(goldGrams),
      goldKarat,
      silverGrams: parseNumber(silverGrams),
      investmentsValue: parseNumber(investmentsValue),
      businessGoodsValue: parseNumber(businessGoodsValue),
      otherEligibleAssets: parseNumber(otherEligibleAssets),
      shortTermLiabilities: parseNumber(shortTermLiabilities),
      nisabStandard,
      customGoldPricePerGram: parsedGoldPrice,
      customSilverPricePerGram: parsedSilverPrice,
    }),
    [
      cashInHand,
      bankBalances,
      goldGrams,
      goldKarat,
      silverGrams,
      investmentsValue,
      businessGoodsValue,
      otherEligibleAssets,
      shortTermLiabilities,
      nisabStandard,
      parsedGoldPrice,
      parsedSilverPrice,
    ]
  );

  const result = useMemo(() => calculateZakat(inputData), [inputData]);

  const resetCalculator = () => {
    setCurrencyData((prev) => ({
      ...prev,
      [currencySymbol]: { ...DEFAULT_CURRENCY_DATA },
    }));
  };

  const formatCurrency = (val: number): string => {
    return `${currencySymbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6" data-testid="zakat-calculator-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-3">
              <span>Third Pillar of Islam (الزكاة)</span>
              <span>•</span>
              <span>2.5% (1/40th) of Net Zakatable Wealth</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-200">
              Zakat Calculator
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Calculate your annual Zakat obligation across cash, precious metals, trade assets,
              and investments after deducting short-term liabilities according to classical Nisab thresholds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetCalculator}
              data-testid="zakat-reset-btn"
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 transition"
            >
              Reset Values
            </button>
          </div>
        </div>
      </div>

      {/* Spot Price & Nisab Standard Configuration Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Nisab Standard & Local Bullion Rates ({currencySymbol} / gram)
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span className="text-amber-400 font-semibold" data-testid="zakat-rate-notice">
                Manual Local Market Entry Required
              </span>
              <span>•</span>
              <span>Rates vary daily by local Sarafa & jeweler markets</span>
              <span>•</span>
              <span className="text-slate-300">Unit: {currencySymbol} per gram</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="px-2 text-slate-400">Currency:</span>
              {['$', 'Rs', '£', '€', 'AED'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => handleCurrencyChange(cur)}
                  data-testid={`zakat-cur-${cur.toLowerCase()}`}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    currencySymbol === cur
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="px-2 text-slate-400">Nisab by:</span>
              <button
                onClick={() => setNisabStandard('silver')}
                data-testid="nisab-silver-toggle"
                className={`px-3 py-1 rounded font-medium transition ${
                  nisabStandard === 'silver'
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Silver (595g)
              </button>
              <button
                onClick={() => setNisabStandard('gold')}
                data-testid="nisab-gold-toggle"
                className={`px-3 py-1 rounded font-medium transition ${
                  nisabStandard === 'gold'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Gold (85g)
              </button>
            </div>
          </div>
        </div>

        {/* Informative Guidance Banner on Manual Market Rate Entry & Currency Safety */}
        <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
          <p className="font-semibold flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>Local Market Rates Required ({currencySymbol}/g):</span>
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Bullion spot rates vary across regional markets and currencies. Gold and silver prices are maintained strictly per currency ({currencySymbol}) and are never automatically converted or reinterpreted across currencies without verified live exchange feeds.
            {!goldPrice && !silverPrice && (
              <span className="block mt-1 font-semibold text-amber-300">
                ⚠️ Re-entry required: Please enter local 24K gold and fine silver rates in {currencySymbol} ({currencySymbol}/g) to calculate Nisab and evaluate Zakat.
              </span>
            )}
          </p>
        </div>

        {/* Spot Rates and Nisab Value Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Local 24K Gold Price per Gram ({currencySymbol}/g)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder={`Enter local 24K gold rate (${currencySymbol}/g)`}
              value={goldPrice}
              onChange={(e) => updateField('goldPrice', e.target.value)}
              data-testid="gold-spot-input"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-400 block mt-1" data-testid="gold-rate-unit-display">
              {parsedGoldPrice > 0 ? `Active Rate: ${currencySymbol}${parsedGoldPrice}/g` : `Manual entry required (${currencySymbol}/g)`}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Local Silver Price per Gram ({currencySymbol}/g)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder={`Enter local silver rate (${currencySymbol}/g)`}
              value={silverPrice}
              onChange={(e) => updateField('silverPrice', e.target.value)}
              data-testid="silver-spot-input"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-slate-200 font-mono focus:outline-none focus:border-slate-400"
            />
            <span className="text-[10px] text-slate-400 block mt-1" data-testid="silver-rate-unit-display">
              {parsedSilverPrice > 0 ? `Active Rate: ${currencySymbol}${parsedSilverPrice}/g` : `Manual entry required (${currencySymbol}/g)`}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-lg border transition ${
              nisabStandard === 'silver'
                ? 'bg-emerald-950/30 border-emerald-700/50'
                : 'bg-slate-950/40 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Silver Nisab ({NISAB_WEIGHTS.silverGrams}g)</span>
              {nisabStandard === 'silver' && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  Active
                </span>
              )}
            </div>
            <div className="text-lg font-bold font-mono text-slate-200" data-testid="silver-nisab-val">
              {parsedSilverPrice > 0
                ? formatCurrency(NISAB_WEIGHTS.silverGrams * parsedSilverPrice)
                : <span className="text-xs text-slate-500 font-sans font-normal">Enter silver rate</span>}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Majority classical standard (595g × {currencySymbol}/g)
            </span>
          </div>

          <div
            className={`p-3.5 rounded-lg border transition ${
              nisabStandard === 'gold'
                ? 'bg-amber-950/30 border-amber-600/50'
                : 'bg-slate-950/40 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Gold Nisab ({NISAB_WEIGHTS.goldGrams}g)</span>
              {nisabStandard === 'gold' && (
                <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                  Active
                </span>
              )}
            </div>
            <div className="text-lg font-bold font-mono text-amber-300" data-testid="gold-nisab-val">
              {parsedGoldPrice > 0
                ? formatCurrency(NISAB_WEIGHTS.goldGrams * parsedGoldPrice)
                : <span className="text-xs text-slate-500 font-sans font-normal">Enter gold rate</span>}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Alternative standard (85g × {currencySymbol}/g)
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Inputs vs Calculation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Asset & Liability Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Cash & Bank */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-xs">
                💵
              </span>
              1. Cash & Liquid Bank Funds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Cash on Hand & Petty Cash ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={cashInHand}
                  onChange={(e) => updateField('cashInHand', e.target.value)}
                  data-testid="input-cash-in-hand"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Checking & Savings Balances ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={bankBalances}
                  onChange={(e) => updateField('bankBalances', e.target.value)}
                  data-testid="input-bank-balances"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Gold & Silver */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-900/50 text-amber-400 flex items-center justify-center text-xs">
                🪙
              </span>
              2. Gold & Silver (Jewelry, Bullion, Coins)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Gold Weight (grams)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={goldGrams}
                  onChange={(e) => updateField('goldGrams', e.target.value)}
                  data-testid="input-gold-grams"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Gold Purity / Karat</label>
                <select
                  value={goldKarat}
                  onChange={(e) => updateField('goldKarat', Number(e.target.value) as 24 | 22 | 18)}
                  data-testid="select-gold-karat"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value={24}>24 Karat (99.9% Pure)</option>
                  <option value={22}>22 Karat (91.6% Pure)</option>
                  <option value={18}>18 Karat (75.0% Pure)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Silver Weight (grams)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={silverGrams}
                  onChange={(e) => updateField('silverGrams', e.target.value)}
                  data-testid="input-silver-grams"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <span>
                Gold Valuation:{' '}
                <strong className="text-amber-300 font-mono">
                  {formatCurrency(result.goldValuation)}
                </strong>
              </span>
              <span>•</span>
              <span>
                Silver Valuation:{' '}
                <strong className="text-slate-200 font-mono">
                  {formatCurrency(result.silverValuation)}
                </strong>
              </span>
            </div>
          </div>

          {/* 3. Investments, Stock & Business Goods */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-900/50 text-blue-400 flex items-center justify-center text-xs">
                📈
              </span>
              3. Investments & Trade Merchandise
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Zakatable Shares & Mutual Funds ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={investmentsValue}
                  onChange={(e) => updateField('investmentsValue', e.target.value)}
                  data-testid="input-investments"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Liquid shares or net zakatable underlying assets
                </span>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Business Inventory for Resale ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={businessGoodsValue}
                  onChange={(e) => updateField('businessGoodsValue', e.target.value)}
                  data-testid="input-business-goods"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Wholesale or retail cost value of unsold stock
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Other Zakatable Assets / Good Debts Receivable ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={otherEligibleAssets}
                onChange={(e) => updateField('otherEligibleAssets', e.target.value)}
                data-testid="input-other-assets"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Loans given out expected to be repaid, rental income saved, etc.
              </span>
            </div>
          </div>

          {/* 4. Deductible Liabilities */}
          <div className="bg-slate-900/80 border border-red-900/30 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-semibold text-red-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-red-950/60 text-red-400 flex items-center justify-center text-xs">
                📉
              </span>
              4. Deductible Short-Term Liabilities & Immediate Debts
            </h4>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Outstanding Debts & Bills Due Immediately ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={shortTermLiabilities}
                onChange={(e) => updateField('shortTermLiabilities', e.target.value)}
                data-testid="input-liabilities"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-red-200 font-mono focus:outline-none focus:border-red-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Only unpaid immediate expenses, credit card due balances, or current month installments are deductible. Long-term unmatured principal is excluded.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculation Summary & Results (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Primary Result Box */}
          <div
            className={`rounded-2xl p-6 border shadow-2xl transition-all ${
              result.isEligibleForZakat
                ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 border-emerald-500/50'
                : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Annual Zakat Payable
              </span>
              <span
                data-testid="zakat-eligibility-badge"
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  result.nisabThresholdValue === 0
                    ? 'bg-slate-700/60 text-slate-300 border border-slate-600'
                    : result.isEligibleForZakat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {result.nisabThresholdValue === 0
                  ? 'Rate Entry Required'
                  : result.isEligibleForZakat
                  ? 'Zakat Obligatory (Fard)'
                  : 'Below Nisab Threshold'}
              </span>
            </div>

            <div className="mb-4">
              <div
                className="text-4xl md:text-5xl font-extrabold font-mono text-amber-300"
                data-testid="zakat-due-amount"
              >
                {formatCurrency(result.zakatDue)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {result.nisabThresholdValue === 0
                  ? `Please enter your local ${result.nisabStandard} price per gram (${currencySymbol}/g) to evaluate Nisab threshold and obligation.`
                  : `Calculated at 2.5% on net zakatable wealth of ${formatCurrency(result.netZakatableWealth)}.`}
              </p>
            </div>

            {/* Threshold comparison progress */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Active Nisab Threshold ({result.nisabStandard}):</span>
                <span className="font-mono font-bold text-amber-300" data-testid="active-nisab-val">
                  {result.nisabThresholdValue > 0
                    ? formatCurrency(result.nisabThresholdValue)
                    : `Enter ${result.nisabStandard} rate (${currencySymbol}/g)`}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.isEligibleForZakat ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      result.nisabThresholdValue > 0
                        ? (result.netZakatableWealth / result.nisabThresholdValue) * 100
                        : 0
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Net: {formatCurrency(result.netZakatableWealth)}</span>
                <span>
                  {result.nisabThresholdValue === 0
                    ? `Awaiting ${result.nisabStandard} price entry`
                    : result.isEligibleForZakat
                    ? `Exceeds Nisab by ${formatCurrency(
                        result.netZakatableWealth - result.nisabThresholdValue
                      )}`
                    : `Short of Nisab by ${formatCurrency(
                        result.nisabThresholdValue - result.netZakatableWealth
                      )}`}
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 border-t border-slate-700/60 pt-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Gross Zakatable Wealth:</span>
                <span className="font-mono font-semibold" data-testid="summary-gross-wealth">
                  {formatCurrency(result.grossWealth)}
                </span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>Less Liabilities:</span>
                <span className="font-mono font-semibold" data-testid="summary-liabilities">
                  -{formatCurrency(result.totalLiabilities)}
                </span>
              </div>
              <div className="flex justify-between text-slate-100 font-bold border-t border-slate-800 pt-2">
                <span>Net Zakatable Base:</span>
                <span className="font-mono text-emerald-300" data-testid="summary-net-wealth">
                  {formatCurrency(result.netZakatableWealth)}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Guidelines */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <h5 className="text-slate-200 font-semibold flex items-center gap-1.5">
              <span>📖</span> Essential Zakat Conditions (Shurut)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-400">
              <li>
                <strong>Hawl (1 Lunar Year):</strong> Wealth must have been in your possession above Nisab for one complete Islamic lunar year.
              </li>
              <li>
                <strong>Primary Residence & Personal Tools:</strong> Primary homes, everyday vehicles, clothing, and professional tools are exempt.
              </li>
              <li>
                <strong>Beneficiaries (Masarif):</strong> Must be distributed to the 8 categories specified in Surah At-Tawbah (9:60).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scholarly Disclaimer Footer */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed">
        <div className="flex items-start gap-2.5">
          <span className="text-base text-amber-400 mt-0.5">⚠️</span>
          <div>
            <strong className="font-semibold text-amber-300 block mb-0.5">
              Educational Guidance & Non-Fatwa Disclaimer
            </strong>
            <p className="text-[11px] text-amber-200/80">{result.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
