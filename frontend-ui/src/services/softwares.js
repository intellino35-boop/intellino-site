import { createCatalogService } from './catalog';

// Logiciels : GET /softwares, GET /softwares/{slug}
export const softwaresService = createCatalogService('softwares');
