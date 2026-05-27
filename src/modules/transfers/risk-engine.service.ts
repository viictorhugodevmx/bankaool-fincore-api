import { AccountDocument } from '../accounts/account.model';

type RiskInput = {
  amount: number;
  description: string;
  fromAccount: AccountDocument;
};

export type RiskResult = {
  riskScore: number;
  riskReasons: string[];
  requiresReview: boolean;
};

export const evaluateTransferRisk = ({
  amount,
  description,
  fromAccount,
}: RiskInput): RiskResult => {
  let riskScore = 0;
  const riskReasons: string[] = [];

  if (amount >= 20000) {
    riskScore += 60;
    riskReasons.push('High amount transfer');
  }

  if (amount > fromAccount.dailyLimit) {
    riskScore += 50;
    riskReasons.push('Amount exceeds daily limit');
  }

  const suspiciousWords = ['fraud', 'urgent', 'crypto', 'cashout', 'test-risk'];
  const normalizedDescription = description.toLowerCase();

  const hasSuspiciousWord = suspiciousWords.some((word) =>
    normalizedDescription.includes(word)
  );

  if (hasSuspiciousWord) {
    riskScore += 40;
    riskReasons.push('Suspicious transfer description');
  }

  return {
    riskScore,
    riskReasons,
    requiresReview: riskScore >= 50,
  };
};