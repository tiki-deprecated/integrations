/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface OrderReq {
  app_id: number;
  billing_address: {
    address1: string;
    address2: string;
    city: string;
    company: string;
    country: string;
    first_name: string;
    last_name: string;
    phone: string;
    province: string;
    zip: string;
    name: string;
    province_code: string;
    country_code: string;
    latitude: string;
    longitude: string;
  };
  browser_ip: string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: string;
  checkout_token: string;
  client_details: {
    accept_language: string;
    browser_height: number;
    browser_ip: string;
    browser_width: number;
    session_hash: string;
    user_agent: string;
  };
  closed_at: string;
  company: {
    id: number;
    location_id: number;
  };
  created_at: string;
  currency: string;
  current_total_additional_fees_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  current_total_discounts: string;
  current_total_discounts_set: {
    current_total_discounts_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
  };
  current_total_duties_set: {
    current_total_duties_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
  };
  current_total_price: string;
  current_total_price_set: {
    current_total_price_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
  };
  current_subtotal_price: string;
  current_subtotal_price_set: {
    current_subtotal_price_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
  };
  current_total_tax: string;
  current_total_tax_set: {
    current_total_tax_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
  };
  customer: {
    id: number;
    email: string;
    accepts_marketing: boolean;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    state: string;
    note: string;
    verified_email: boolean;
    multipass_identifier: string;
    tax_exempt: boolean;
    tax_exemptions: [string];
    phone: string;
    tags: string;
    currency: string;
    addresses: [
      {
        address1: string;
        address2: string;
        city: string;
        company: string;
        country: string;
        first_name: string;
        last_name: string;
        phone: string;
        province: string;
        zip: string;
        name: string;
        province_code: string;
        country_code: string;
        country_name: string;
        customer_id: string;
        latitude: string;
        longitude: string;
        default: boolean;
        id: number;
      }
    ];
    admin_graphql_api_id: string;
    default_address: {
      address1: string;
      address2: string;
      city: string;
      company: string;
      country: string;
      first_name: string;
      last_name: string;
      phone: string;
      province: string;
      zip: string;
      name: string;
      province_code: string;
      country_code: string;
      country_name: string;
      customer_id: string;
      latitude: string;
      longitude: string;
      default: boolean;
      id: number;
    };
  };
  customer_locale: string;
  discount_applications: [
    {
      type: string;
      title: string;
      description: string;
      value: string;
      value_type: string;
      allocation_method: string;
      target_selection: string;
      target_type: string;
    }
  ];
  discount_codes: [
    {
      code: string;
      amount: string;
      type: string;
    }
  ];
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillments: [
    {
      created_at: string;
      id: number;
      order_id: number;
      status: string;
      tracking_company: string;
      tracking_number: string;
      updated_at: string;
    }
  ];
  fulfillment_status: string;
  gateway: string;
  id: number;
  landing_site: string;
  line_items: [
    {
      attributed_staffs: [
        {
          id: string;
          quantity: number;
        }
      ];
      fulfillable_quantity: number;
      fulfillment_service: string;
      fulfillment_status: string;
      grams: number;
      id: number;
      price: string;
      product_id: number;
      quantity: number;
      requires_shipping: boolean;
      sku: string;
      title: string;
      variant_id: number;
      variant_title: string;
      vendor: string;
      name: string;
      gift_card: boolean;
      price_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
        presentment_money: {
          amount: string;
          currency_code: string;
        };
      };
      properties: [
        {
          name: string;
          value: string;
        }
      ];
      taxable: boolean;
      tax_lines: [
        {
          title: string;
          price: string;
          price_set: {
            shop_money: {
              amount: string;
              currency_code: string;
            };
            presentment_money: {
              amount: string;
              currency_code: string;
            };
          };
          channel_liable: boolean;
          rate: number;
        }
      ];
      total_discount: string;
      total_discount_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
        presentment_money: {
          amount: string;
          currency_code: string;
        };
      };
      discount_allocations: [
        {
          amount: string;
          discount_application_index: number;
          amount_set: {
            shop_money: {
              amount: string;
              currency_code: string;
            };
            presentment_money: {
              amount: string;
              currency_code: string;
            };
          };
        }
      ];
      origin_location: {
        id: number;
        country_code: string;
        province_code: string;
        name: string;
        address1: string;
        address2: string;
        city: string;
        zip: string;
      };
      duties: [
        {
          id: string;
          harmonized_system_code: string;
          country_code_of_origin: string;
          shop_money: {
            amount: string;
            currency_code: string;
          };
          presentment_money: {
            amount: string;
            currency_code: string;
          };
          tax_lines: [
            {
              title: string;
              price: string;
              rate: number;
              price_set: {
                shop_money: {
                  amount: string;
                  currency_code: string;
                };
                presentment_money: {
                  amount: string;
                  currency_code: string;
                };
              };
              channel_liable: boolean;
            }
          ];
          admin_graphql_api_id: string;
        }
      ];
    }
  ];
  location_id: number;
  merchant_of_record_app_id: number;
  name: string;
  note: string;
  note_attributes: [
    {
      name: string;
      value: string;
    }
  ];
  number: number;
  order_number: number;
  original_total_additional_fees_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  original_total_duties_set: {
    original_total_duties_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
  };
  payment_details: {
    avs_result_code: string;
    credit_card_bin: string;
    cvv_result_code: string;
    credit_card_number: string;
    credit_card_company: string;
  };
  payment_terms: {
    amount: number;
    currency: string;
    payment_terms_name: string;
    payment_terms_type: string;
    due_in_days: number;
    payment_schedules: [
      {
        amount: number;
        currency: string;
        issued_at: string;
        due_at: string;
        completed_at: string;
        expected_payment_method: string;
      }
    ];
  };
  payment_gateway_names: [string];
  phone: string;
  presentment_currency: string;
  processed_at: string;
  processing_method: string;
  referring_site: string;
  refunds: [
    {
      id: number;
      order_id: number;
      created_at: string;
      note: string;
      user_id: number;
      processed_at: string;
      refund_line_items: [];
      transactions: [];
      order_adjustments: [];
    }
  ];
  shipping_address: {
    address1: string;
    address2: string;
    city: string;
    company: string;
    country: string;
    first_name: string;
    last_name: string;
    latitude: string;
    longitude: string;
    phone: string;
    province: string;
    zip: string;
    name: string;
    country_code: string;
    province_code: string;
  };
  shipping_lines: [
    {
      code: string;
      price: string;
      price_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
        presentment_money: {
          amount: string;
          currency_code: string;
        };
      };
      discounted_price: string;
      discounted_price_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
        presentment_money: {
          amount: string;
          currency_code: string;
        };
      };
      source: string;
      title: string;
      tax_lines: [];
      carrier_identifier: string;
      requested_fulfillment_service_id: string;
    }
  ];
  source_name: string;
  source_identifier: string;
  source_url: string;
  subtotal_price: string;
  subtotal_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  tags: string;
  tax_lines: [
    {
      price: number;
      rate: number;
      title: string;
      channel_liable: boolean;
    }
  ];
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_line_items_price: string;
  total_line_items_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_outstanding: string;
  total_price: string;
  total_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_shipping_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_tax: string;
  total_tax_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: number;
  order_status_url: {
    order_status_url: string;
  };
}
