// Mise en forme légère du texte saisi dans l'admin (aucun HTML interprété) :
// blocs séparés par une ligne vide, « ## » pour un intertitre, lignes « - » pour une liste.
export default function ArticleBody({ text }) {
    const blocks = (text ?? '')
        .replace(/\r\n/g, '\n')
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter(Boolean);

    return (
        <div className="space-y-6">
            {blocks.map((block, i) => {
                if (block.startsWith('## ')) {
                    return (
                        <h2 key={i} className="pt-4 text-2xl font-black text-white md:text-3xl">
                            {block.slice(3)}
                        </h2>
                    );
                }

                const lines = block.split('\n').map((l) => l.trim());
                if (lines.every((l) => l.startsWith('- '))) {
                    return (
                        <ul key={i} className="space-y-3">
                            {lines.map((l) => (
                                <li key={l} className="flex items-start gap-3 text-lg text-white/80">
                                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    {l.slice(2)}
                                </li>
                            ))}
                        </ul>
                    );
                }

                return (
                    <p key={i} className="text-lg leading-relaxed text-white/80">
                        {lines.join(' ')}
                    </p>
                );
            })}
        </div>
    );
}
