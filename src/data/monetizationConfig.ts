// FILE: src/data/monetizationConfig.ts
// Direct Pakistan & Global Monetization Configuration (Volume 4)

export interface LocalPaymentMethod {
  id: string;
  label: string;
  icon: string;
  accountIdentifier: string;
  accountTitle: string;
  badge: string;
  note: string;
  network?: string;
}

export const PAYMENT_METHODS: LocalPaymentMethod[] = [
  {
    id: 'nayapay',
    label: 'NayaPay',
    icon: '💳',
    accountIdentifier: 'numanxstudio@nayapay',
    accountTitle: 'Muhammad Numan Usmani',
    badge: 'Instant 0% Fee',
    note: 'Instant free transfer using NayaPay ID across Pakistan.'
  },
  {
    id: 'jazzcash',
    label: 'JazzCash',
    icon: '📱',
    accountIdentifier: '0300-XXXXXXX',
    accountTitle: 'Muhammad Numan',
    badge: 'Mobile Account',
    note: 'Send directly to JazzCash mobile wallet or via retail shop.'
  },
  {
    id: 'easypaisa',
    label: 'Easypaisa',
    icon: '🟢',
    accountIdentifier: '0300-XXXXXXX',
    accountTitle: 'Muhammad Numan',
    badge: 'Mobile Account',
    note: 'Send via Easypaisa app, QR, or retailer.'
  },
  {
    id: 'usdt',
    label: 'Crypto USDT',
    icon: '💎',
    accountIdentifier: 'TX_USDT_TRC20_WALLET_ADDRESS',
    accountTitle: 'USDT (TRC-20 / BEP-20)',
    badge: 'Global Crypto',
    network: 'TRC-20 (Tron) or Polygon',
    note: 'Instant global settlement with low network transaction fees.'
  },
  {
    id: 'payoneer',
    label: 'Payoneer',
    icon: '🌐',
    accountIdentifier: 'numanxstudio@gmail.com',
    accountTitle: 'Muhammad Numan Usmani',
    badge: 'International Bank / USD',
    note: 'Direct recipient payment from any Payoneer account.'
  }
];
