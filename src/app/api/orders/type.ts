export type Meta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
  uuidHref: string;
};

export type CurrencyMeta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
  uuidHref: string;
};

export type Currency = {
  meta: CurrencyMeta;
};

export type EmployeeMeta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
  uuidHref: string;
};

export type Employee = {
  meta: EmployeeMeta;
};

export type GroupMeta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
};

export type Group = {
  meta: GroupMeta;
};

export type Organization = {
  meta: Meta;
  id: string;
  accountId: string;
  owner: Employee;
  shared: boolean;
  group: Group;
  updated: string;
  name: string;
  externalCode: string;
  archived: boolean;
  created: string;
  companyType: string;
  legalTitle: string;
  email: string;
  accounts: {
    meta: Meta;
  };
  isEgaisEnable: boolean;
  payerVat: boolean;
  director: string;
  directorPosition: string;
  chiefAccountant: string;
};

export type ContactPersonMeta = {
  href: string;
  type: string;
  mediaType: string;
  size: number;
  limit: number;
  offset: number;
};

export type Counterparty = {
  meta: Meta;
  id: string;
  accountId: string;
  owner: Employee;
  shared: boolean;
  group: Group;
  updated: string;
  name: string;
  externalCode: string;
  archived: boolean;
  created: string;
  companyType: string;
  legalTitle: string;
  legalAddress: string;
  legalAddressFull: {
    addInfo: string;
  };
  inn: string;
  kpp: string;
  accounts: {
    meta: Meta;
  };
  tags: any[];
  contactpersons: {
    meta: ContactPersonMeta;
  };
  notes: {
    meta: ContactPersonMeta;
  };
  salesAmount: number;
  files: {
    meta: ContactPersonMeta;
  };
};

export type StateMeta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
};

export type State = {
  meta: StateMeta;
};

export type ProductMeta = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
  uuidHref: string;
};

export type Product = {
  meta: ProductMeta;
  id: string;
  accountId: string;
  owner: Employee;
  shared: boolean;
  group: Group;
  updated: string;
  name: string;
  code: string;
  externalCode: string;
  archived: boolean;
  pathName: string;
  useParentVat: boolean;
  uom: {
    meta: Meta;
  };
  images: {
    meta: ContactPersonMeta;
  };
  minPrice: {
    value: number;
    currency: Currency;
  };
  salePrices: {
    value: number;
    currency: Currency;
    priceType: {
      meta: Meta;
      id: string;
      name: string;
      externalCode: string;
    };
  }[];
  buyPrice: {
    value: number;
    currency: Currency;
  };
  barcodes: {
    ean13: string;
  }[];
  paymentItemType: string;
  discountProhibited: boolean;
  article: string;
  weight: number;
  volume: number;
  variantsCount: number;
  isSerialTrackable: boolean;
  trackingType: string;
  files: {
    meta: ContactPersonMeta;
  };
};

export type CustomerOrderPosition = {
  meta: Meta;
  id: string;
  accountId: string;
  quantity: number;
  price: number;
  discount: number;
  vat: number;
  vatEnabled: boolean;
  assortment: Product;
  shipped: number;
  reserve: number;
};

export type Positions = {
  meta: ContactPersonMeta;
  rows: CustomerOrderPosition[];
};

export type InvoiceOut = {
  meta: Meta;
};

export type SalesChannel = {
  meta: Meta;
};

export type CustomerOrder = {
  meta: Meta;
  id: string;
  accountId: string;
  owner: Employee;
  shared: boolean;
  group: Group;
  updated: string;
  name: string;
  externalCode: string;
  moment: string;
  applicable: boolean;
  value: number;
  rate: {
    currency: Currency;
  };
  sum: number;
  store: {
    meta: Meta;
  };
  agent: Counterparty;
  organization: Organization;
  state: State;
  created: string;
  printed: boolean;
  published: boolean;
  files: {
    meta: ContactPersonMeta;
  };
  positions: Positions;
  vatEnabled: boolean;
  vatIncluded: boolean;
  vatSum: number;
  payedSum: number;
  shippedSum: number;
  invoicedSum: number;
  reservedSum: number;
  invoicesOut: InvoiceOut[];
  shipmentAddress: string;
  shipmentAddressFull: {
    addInfo: string;
  };
  salesChannel: SalesChannel;
};
