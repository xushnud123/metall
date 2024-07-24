type Meta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
  uuidHref: string;
};

type Product = {
  id: string;
  vat: number;
  quantity: number;
  name: string;
  code: string;
  images: string;
  meta: Meta;
  assortment: any;
  price: number;
  discount: number;
};

type Order = {
  id: string;
  agent_name: string;
  agent_meta: Meta;
  main_meta: Meta;
  organization_meta: Meta;
  description?: string;
  phone?: string;
  customer_order: {
    meta: Meta;
  };
  store: {
    meta: Meta;
  };
  code: string;
  meta: Meta;
  products: Product[];
  externalCode: string;
  moment: string;
  applicable: string;
  vatEnabled: string;
  vatIncluded: string;
  mainCode: string;
  agentAccount_meta: Meta;
  state_meta: Meta;
  attributes: any;
  rate?: {
    currency: {
      meta: Meta;
    };
    value: number;
  };
};
