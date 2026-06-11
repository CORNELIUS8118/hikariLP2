export type Intent = 'A' | 'D';

export interface FormValues {
  sei: string;
  mei: string;
  sei_kana: string;
  mei_kana: string;
  birthdate: string;
  phone: string;
  email: string;
  postal_code: string;
  address: string;
  building_name: string;
  residence_type: string;
  company_name: string;
  company_name_kana: string;
  bank_name: string;
  branch_name: string;
  account_number: string;
  account_holder: string;
  intent: Intent | '';
  agreed: boolean;
  faq_confirmed?: boolean;
  faq_confirmed_at?: string;
  faq_confirm_count?: string;
  referrer: string;
}
