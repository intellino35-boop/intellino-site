import { createCatalogService } from './catalog';

// Réalisations : GET /realisations, GET /realisations/{slug}
export const realisationsService = createCatalogService('realisations');
