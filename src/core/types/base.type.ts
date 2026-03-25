export interface OptionAttribute {
  key: string;
  value: string;
}

export interface LabelValuePair {
  value: string;
  label: string;
  attributes?: OptionAttribute[];
  isIntensePurchase?: boolean;
}
