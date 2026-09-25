import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import ErrorBoundary from './Components/ErrorBoundary';
import RequireAuth from './Components/RequireAuth';
import ScrollToTop from './Components/ScrollToTop';
import { Loading } from './Components/states';

// Pages chargées à la demande : le visiteur ne télécharge pas le code de l'administration.
const Home = lazy(() => import('./Pages/Home'));
const SolutionsIndex = lazy(() => import('./Pages/Solutions/Index'));
const SolutionShow = lazy(() => import('./Pages/Solutions/Show'));
const ProductsIndex = lazy(() => import('./Pages/Products/Index'));
const ProductShow = lazy(() => import('./Pages/Products/Show'));
const SoftwaresIndex = lazy(() => import('./Pages/Softwares/Index'));
const SoftwareShow = lazy(() => import('./Pages/Softwares/Show'));
const RealisationsIndex = lazy(() => import('./Pages/Realisations/Index'));
const RealisationShow = lazy(() => import('./Pages/Realisations/Show'));
const BlogIndex = lazy(() => import('./Pages/Blog/Index'));
const BlogShow = lazy(() => import('./Pages/Blog/Show'));
const LabVision = lazy(() => import('./Pages/Lab/Vision'));
const LabRecherche = lazy(() => import('./Pages/Lab/Recherche'));
const LabProjets = lazy(() => import('./Pages/Lab/Projets'));
const LabPartenariats = lazy(() => import('./Pages/Lab/Partenariats'));
const About = lazy(() => import('./Pages/About'));
const Contact = lazy(() => import('./Pages/Contact'));
const LegalNotice = lazy(() => import('./Pages/Legal/Notice'));
const LegalPrivacy = lazy(() => import('./Pages/Legal/Privacy'));
const NotFound = lazy(() => import('./Pages/ComingSoon'));

const AdminLogin = lazy(() => import('./Pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./Pages/Admin/Dashboard'));
const AdminMessages = lazy(() => import('./Pages/Admin/Messages/Index'));
const AdminMessage = lazy(() => import('./Pages/Admin/Messages/Show'));
const AdminContentIndex = lazy(() => import('./Pages/Admin/Content/Index'));
const AdminContentForm = lazy(() => import('./Pages/Admin/Content/Form'));
const AdminBlocks = lazy(() => import('./Pages/Admin/Blocks'));
const AdminSettings = lazy(() => import('./Pages/Admin/Settings'));
const AdminUsers = lazy(() => import('./Pages/Admin/Users/Index'));
const AdminUserForm = lazy(() => import('./Pages/Admin/Users/Form'));
const AdminProfile = lazy(() => import('./Pages/Admin/Profile'));

const guard = (element, permission) => <RequireAuth permission={permission}>{element}</RequireAuth>;

export default function App() {
    const location = useLocation();

    return (
        <ErrorBoundary resetKey={location.pathname}>
            <ScrollToTop />
            <Suspense fallback={<Loading className="min-h-screen bg-[#080808]" />}>
                <Routes>
                    {/* Site public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/solutions" element={<SolutionsIndex />} />
                    <Route path="/solutions/:slug" element={<SolutionShow />} />
                    <Route path="/produits" element={<ProductsIndex />} />
                    <Route path="/produits/:slug" element={<ProductShow />} />
                    <Route path="/logiciels" element={<SoftwaresIndex />} />
                    <Route path="/logiciels/:slug" element={<SoftwareShow />} />
                    <Route path="/realisations" element={<RealisationsIndex />} />
                    <Route path="/realisations/:slug" element={<RealisationShow />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogShow />} />
                    <Route path="/lab" element={<Navigate to="/lab/vision" replace />} />
                    <Route path="/lab/vision" element={<LabVision />} />
                    <Route path="/lab/recherche" element={<LabRecherche />} />
                    <Route path="/lab/projets" element={<LabProjets />} />
                    <Route path="/lab/partenariats" element={<LabPartenariats />} />
                    <Route path="/a-propos" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/mentions-legales" element={<LegalNotice />} />
                    <Route path="/confidentialite" element={<LegalPrivacy />} />

                    {/* Administration (jeton requis ; permissions vérifiées aussi par l'API) */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={guard(<AdminDashboard />)} />
                    <Route path="/admin/messages" element={guard(<AdminMessages />, 'messages')} />
                    <Route path="/admin/messages/:id" element={guard(<AdminMessage />, 'messages')} />
                    <Route path="/admin/contenu/:type" element={guard(<AdminContentIndex />)} />
                    <Route path="/admin/contenu/:type/nouveau" element={guard(<AdminContentForm />)} />
                    <Route path="/admin/contenu/:type/:id" element={guard(<AdminContentForm />)} />
                    <Route path="/admin/blocs" element={guard(<AdminBlocks />, 'blocks')} />
                    <Route path="/admin/parametres" element={guard(<AdminSettings />, 'settings')} />
                    <Route path="/admin/utilisateurs" element={guard(<AdminUsers />, 'users')} />
                    <Route path="/admin/utilisateurs/nouveau" element={guard(<AdminUserForm />, 'users')} />
                    <Route path="/admin/utilisateurs/:id/modifier" element={guard(<AdminUserForm />, 'users')} />
                    <Route path="/admin/mon-compte" element={guard(<AdminProfile />)} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}
