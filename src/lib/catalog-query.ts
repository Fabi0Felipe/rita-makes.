import { queryOptions } from "@tanstack/react-query";

import { getCatalog } from "./catalog.functions";
import { FALLBACK_SETTINGS, type Category, type Product, type StoreSettings } from "./catalog";

export type Catalog = {
  categories: Category[];
  products: Product[];
  settings: StoreSettings;
};

export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: async (): Promise<Catalog> => {
    const data = await getCatalog();
    return {
      categories: data.categories as Category[],
      products: data.products as Product[],
      settings: (data.settings as StoreSettings | null) ?? FALLBACK_SETTINGS,
    };
  },
});
