import { ACCOUNT_STATUS, CUSTOMER_STATUS, TRANSFER_STATUS } from '../../constants/status';
import { Account } from '../accounts/account.model';
import { Customer } from '../customers/customer.model';
import { Transfer } from '../transfers/transfer.model';

export type DashboardSummary = {
  customers: {
    total: number;
    active: number;
    pendingKyc: number;
    blocked: number;
    rejected: number;
  };
  accounts: {
    total: number;
    active: number;
    blocked: number;
    closed: number;
    totalBalance: number;
  };
  transfers: {
    total: number;
    today: number;
    completed: number;
    pendingReview: number;
    rejected: number;
    failed: number;
  };
  risk: {
    alerts: number;
    highRiskCustomers: number;
    pendingReviewTransfers: number;
  };
};

const getStartOfToday = (): Date => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const startOfToday = getStartOfToday();

  const [
    totalCustomers,
    activeCustomers,
    pendingKycCustomers,
    blockedCustomers,
    rejectedCustomers,
    totalAccounts,
    activeAccounts,
    blockedAccounts,
    closedAccounts,
    balanceResult,
    totalTransfers,
    transfersToday,
    completedTransfers,
    pendingReviewTransfers,
    rejectedTransfers,
    failedTransfers,
    highRiskCustomers,
  ] = await Promise.all([
    Customer.countDocuments(),
    Customer.countDocuments({ kycStatus: CUSTOMER_STATUS.ACTIVE }),
    Customer.countDocuments({ kycStatus: CUSTOMER_STATUS.PENDING_KYC }),
    Customer.countDocuments({ kycStatus: CUSTOMER_STATUS.BLOCKED }),
    Customer.countDocuments({ kycStatus: CUSTOMER_STATUS.REJECTED }),

    Account.countDocuments(),
    Account.countDocuments({ status: ACCOUNT_STATUS.ACTIVE }),
    Account.countDocuments({ status: ACCOUNT_STATUS.BLOCKED }),
    Account.countDocuments({ status: ACCOUNT_STATUS.CLOSED }),

    Account.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' },
        },
      },
    ]),

    Transfer.countDocuments(),
    Transfer.countDocuments({ createdAt: { $gte: startOfToday } }),
    Transfer.countDocuments({ status: TRANSFER_STATUS.COMPLETED }),
    Transfer.countDocuments({ status: TRANSFER_STATUS.PENDING_REVIEW }),
    Transfer.countDocuments({ status: TRANSFER_STATUS.REJECTED }),
    Transfer.countDocuments({ status: TRANSFER_STATUS.FAILED }),

    Customer.countDocuments({ riskLevel: 'high' }),
  ]);

  const totalBalance = balanceResult[0]?.totalBalance ?? 0;

  return {
    customers: {
      total: totalCustomers,
      active: activeCustomers,
      pendingKyc: pendingKycCustomers,
      blocked: blockedCustomers,
      rejected: rejectedCustomers,
    },
    accounts: {
      total: totalAccounts,
      active: activeAccounts,
      blocked: blockedAccounts,
      closed: closedAccounts,
      totalBalance,
    },
    transfers: {
      total: totalTransfers,
      today: transfersToday,
      completed: completedTransfers,
      pendingReview: pendingReviewTransfers,
      rejected: rejectedTransfers,
      failed: failedTransfers,
    },
    risk: {
      alerts: pendingReviewTransfers + highRiskCustomers,
      highRiskCustomers,
      pendingReviewTransfers,
    },
  };
};