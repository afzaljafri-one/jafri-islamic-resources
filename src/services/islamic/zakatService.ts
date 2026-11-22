// ==============================================================================
// Multi-Asset Zakat Calculation Service
// Milestone M4: Islamic Services & Tools
// Calculates eligible zakatable assets, Nisab thresholds, and 2.5% payable
// ==============================================================================

import { ZakatAssetsInput, ZakatCalculationOutput } from './types';

// Classical Nisab weights
export const NISAB_WEIGHTS = {
  silverGrams: 595, // Classical consensus: 200 Dirhams = 595g (or 612.36g in Indo-Pak)
  goldGrams: 85,    // Classical consensus: 20 Dinars = 85g (or 87.48g in Indo-Pak)
};

export function calculateZakat(input: ZakatAssetsInput): ZakatCalculationOutput {
  const goldPrice = Math.max(0, input.customGoldPricePerGram || 0);
  const silverPrice = Math.max(0, input.customSilverPricePerGram || 0);

  // Gold purity factor: 24k = 1.0, 22k = 22/24 (0.916), 18k = 18/24 (0.75)
  let karatMultiplier = 1.0;
  if (input.goldKarat === 22) karatMultiplier = 22 / 24;
  else if (input.goldKarat === 18) karatMultiplier = 18 / 24;

  const goldValuation = Math.max(0, input.goldGrams * goldPrice * karatMultiplier);
  const silverValuation = Math.max(0, input.silverGrams * silverPrice);

  const cashTotal = Math.max(0, input.cashInHand) + Math.max(0, input.bankBalances);
  const investments = Math.max(0, input.investmentsValue);
  const businessGoods = Math.max(0, input.businessGoodsValue);
  const otherAssets = Math.max(0, input.otherEligibleAssets);

  const grossWealth =
    cashTotal + goldValuation + silverValuation + investments + businessGoods + otherAssets;

  const liabilities = Math.max(0, input.shortTermLiabilities);
  const netZakatableWealth = Math.max(0, grossWealth - liabilities);

  // Nisab threshold calculation based on user-entered local bullion rates
  const silverNisabValue = NISAB_WEIGHTS.silverGrams * silverPrice;
  const goldNisabValue = NISAB_WEIGHTS.goldGrams * goldPrice;

  const nisabThresholdValue =
    input.nisabStandard === 'gold' ? goldNisabValue : silverNisabValue;

  const isEligibleForZakat = nisabThresholdValue > 0 && netZakatableWealth >= nisabThresholdValue;
  const zakatDue = isEligibleForZakat ? parseFloat((netZakatableWealth * 0.025).toFixed(2)) : 0;

  return {
    grossWealth: parseFloat(grossWealth.toFixed(2)),
    totalLiabilities: parseFloat(liabilities.toFixed(2)),
    netZakatableWealth: parseFloat(netZakatableWealth.toFixed(2)),
    goldValuation: parseFloat(goldValuation.toFixed(2)),
    silverValuation: parseFloat(silverValuation.toFixed(2)),
    nisabStandard: input.nisabStandard,
    nisabThresholdValue: parseFloat(nisabThresholdValue.toFixed(2)),
    isEligibleForZakat,
    zakatDue,
    zakatRate: '2.5%',
    spotPricesUsed: {
      goldPerGram: goldPrice,
      silverPerGram: silverPrice,
      currency: 'User Entered',
      source: 'User-specified local market rate',
    },
    disclaimer:
      'EDUCATIONAL ESTIMATE: This Zakat calculation is provided for estimation and educational guidance only. It is not a formal fatwa or binding religious verdict. Jurisprudential opinions vary on the deductibility of long-term mortgages, retirement accounts, and personal jewelry. Please consult your local trusted scholar or mufti for individualized rulings.',
  };
}
