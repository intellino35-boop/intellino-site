import { createCatalogService } from './catalog';

// Solutions : GET /solutions, GET /solutions/{slug}
export const solutionsService = createCatalogService('solutions');
