import { createCatalogService } from './catalog';

// Produits : GET /products, GET /products/{slug}
export const productsService = createCatalogService('products');
