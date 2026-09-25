import { Link, usePage } from '@inertiajs/react';
import LegalLayout, { Fill, Section } from '../../Layouts/LegalLayout';

const sections = [
    ['editeur', 'Éditeur du site'],
    ['publication', 'Responsable de la publication'],
    ['hebergement', 'Hébergement'],
    ['propriete', 'Propriété intellectuelle'],
    ['responsabilite', 'Responsabilité'],
    ['liens', 'Liens externes'],
    ['donnees', 'Données personnelles'],
    ['droit', 'Droit applicable'],
];

export default function Notice({ legal }) {
    const { contact } = usePage().props;

    return (
        <LegalLayout title="Mentions" accent="légales" updatedAt={legal.updated_at} sections={sections}>
            <Section id="editeur" title="Éditeur du site">
                <p>
                    Le présent site est édité par <Fill value={legal.company} label="raison sociale" />, <Fill value={legal.legal_form} label="forme juridique" />
                    {' '}au capital de <Fill value={legal.capital} label="capital social" />.
                </p>
                <ul>
                    <li>
                        Immatriculation : <Fill value={legal.registration} label="n° RCCM / NIF" />
                    </li>
                    <li>
                        Siège social : <Fill value={legal.address} label="adresse" />, <Fill value={legal.country} label="pays" />
                    </li>
                    <li>
                        E-mail : <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </li>
                    <li>
                        Téléphone : <Fill value={contact.phone} label="téléphone (INTELLINO_PHONE)" />
                    </li>
                </ul>
            </Section>

            <Section id="publication" title="Responsable de la publication">
                <p>
                    Le responsable de la publication est <Fill value={legal.director} label="nom et fonction" />.
                </p>
            </Section>

            <Section id="hebergement" title="Hébergement">
                <p>
                    Le site est hébergé par <Fill value={legal.host_name} label="nom de l'hébergeur" />, <Fill value={legal.host_address} label="adresse de l'hébergeur" />.
                </p>
            </Section>

            <Section id="propriete" title="Propriété intellectuelle">
                <p>
                    L'ensemble des éléments de ce site (textes, logo, marques, noms de produits tels que IntellIno Smart Energy, Security Box
                    ou Smart Attendance, mise en page) est la propriété de {legal.company}, sauf mention contraire. Toute reproduction,
                    représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.
                </p>
                <p>Certaines illustrations proviennent de banques d'images tierces et restent la propriété de leurs auteurs.</p>
            </Section>

            <Section id="responsabilite" title="Responsabilité">
                <p>
                    {legal.company} s'efforce de fournir des informations exactes et à jour, mais ne peut garantir l'absence d'erreurs ou
                    d'omissions. Les informations présentées sur ce site sont données à titre indicatif et ne constituent pas une offre
                    contractuelle. Pour toute demande précise, <Link href="/contact">contactez-nous</Link>.
                </p>
                <p>
                    {legal.company} ne saurait être tenue responsable des dommages résultant de l'utilisation du site ou de
                    l'impossibilité d'y accéder.
                </p>
            </Section>

            <Section id="liens" title="Liens externes">
                <p>
                    Le site peut contenir des liens vers des sites ou services tiers (par exemple WhatsApp). {legal.company} n'exerce aucun
                    contrôle sur ces services et décline toute responsabilité quant à leur contenu ou à leurs pratiques.
                </p>
            </Section>

            <Section id="donnees" title="Données personnelles">
                <p>
                    Le traitement des informations transmises via le formulaire de contact est décrit dans notre{' '}
                    <Link href="/confidentialite">politique de confidentialité</Link>.
                </p>
            </Section>

            <Section id="droit" title="Droit applicable">
                <p>
                    Les présentes mentions légales sont régies par le droit en vigueur en/au <Fill value={legal.country} label="pays" />. En cas de
                    litige, et à défaut de résolution amiable, les tribunaux compétents de ce pays seront seuls compétents.
                </p>
            </Section>
        </LegalLayout>
    );
}
