import { useSite } from '../hooks/useSite';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

// Téléphone, WhatsApp, e-mail et localisation (valeurs issues de config/intellino.php).
export default function ContactChannels({ className = 'space-y-5' }) {
    const { contact } = useSite();
    const channels = [
        {
            icon: Phone,
            label: 'Appeler',
            value: contact.phone || 'Contactez-nous',
            href: `tel:${contact.phone || '+'}`,
            tone: 'bg-green-500/10 border-green-500/20 text-green-400',
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: 'Envoyer un message',
            href: `https://wa.me/${contact.whatsapp}`,
            external: true,
            tone: 'bg-green-600/10 border-green-600/20 text-green-300',
        },
        { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}`, tone: 'bg-primary/10 border-primary/20 text-primary' },
        { icon: MapPin, label: 'Localisation', value: contact.location, href: '#', tone: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    ];

    return (
        <div className={className}>
            {channels.map(({ icon: Icon, label, value, href, external, tone }) => (
                <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-primary/30"
                >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tone}`}>
                        <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="truncate text-sm font-semibold text-white transition-colors group-hover:text-primary">{value}</div>
                    </div>
                </a>
            ))}
        </div>
    );
}
