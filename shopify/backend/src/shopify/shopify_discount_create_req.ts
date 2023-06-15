import { CombinesWith } from "./shopify-discount-create-rsp";

export interface ShopifyDiscountCreateReq {
  automaticAppDiscount: AutomaticAppDiscount;
}

export interface ShopifyDiscountUpdateReq extends ShopifyDiscountCreateReq {
  id: string;
}

export interface AutomaticAppDiscount {
  combinesWith: CombinesWith;
  endsAt?:       string;
  functionId:   string;
  metafields:   Metafield[];
  startsAt:     string;
  title:        string;
}

export interface Metafield {
  description: string;
  id?:          string;
  key:         string;
  namespace:   string;
  type:        string;
  value:       string;
}