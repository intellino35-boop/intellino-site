import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import AdminLayout, { Card } from '../../Layouts/AdminLayout';

export default function Blocks({ collections }) {
    return (
        <AdminLayout title="Blocs des pages">
            <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
                Les listes de textes affichées sur les pages du site (chiffres clés, valeurs, FAQ, étapes du Lab…). Ajoutez, modifiez,
                supprimez ou réordonnez leurs éléments : les changements apparaissent immédiatement sur le site.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {collections.map((c) => (
                    <Link key={c.type} href={`/admin/contenu/${c.type}`} className="group">
                        <Card className="flex h-full items-center gap-4 p-5 transition-colors group-hover:border-primary/30">
                            <div className="min-w-0 flex-1">
                                <div className="font-semibold text-white group-hover:text-primary">{c.label}</div>
                                <div className="mt-0.5 truncate text-xs text-muted-foreground">{c.page}</div>
                            </div>
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">{c.count}</span>
                            <ChevronRight size={18} className="text-white/30 group-hover:text-primary" />
                        </Card>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
