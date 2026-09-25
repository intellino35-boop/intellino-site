import { Link } from '@inertiajs/react';
import LegalLayout, { Fill, Section } from '../../Layouts/LegalLayout';

const sections = [
    ['responsable', 'Responsable du traitement'],
    ['collecte', 'Données collectées'],
    ['finalites', 'Utilisation des données'],
    ['destinataires', 'Destinataires'],
    ['conservation', 'Durée de conservation'],
    ['cookies', 'Cookies'],
    ['tiers', 'Services tiers'],
    ['securite', 'Sécurité'],
    ['droits', 'Vos droits'],
    ['modifications', 'Modifications'],
];

export default function Privacy({ legal, sessionMinutes }) {
    const email = legal.privacy_email;

    return (
        <LegalLayout title="Politique de" accent="confidentialité" updatedAt={legal.updated_at} sections={sections}>
            <p className="text-lg text-white/80">
                {legal.company} attache une grande importance à la protection de vos données personnelles. Cette page explique quelles
                informations sont collectées sur ce site, pourquoi, et comment exercer vos droits.
            </p>

            <Section id="responsable" title="Responsable du traitement">
                <p>
                    Le responsable du traitement est <Fill value={legal.company} label="raison sociale" />, dont le siège est situé{' '}
                    <Fill value={legal.address} label="adresse" />, <Fill value={legal.country} label="pays" />. Pour toute question relative à vos
                    données : <a href={`mailto:${email}`}>{email}</a>.
                </p>
            </Section>

            <Section id="collecte" title="Données collectées">
                <p>
                    La navigation sur le site ne nécessite aucune inscription. Les seules données personnelles collectées sont celles que
                    vous saisissez volontairement dans le <Link href="/contact">formulaire de contact</Link> :
                </p>
                <ul>
                    <li>votre nom et votre adresse e-mail (obligatoires) ;</li>
                    <li>le nom de votre organisation et votre numéro de téléphone (facultatifs) ;</li>
                    <li>le sujet et le contenu de votre message.</li>
                </ul>
                <p>
                    Nous vous invitons à ne pas transmettre d'informations sensibles (données de santé, coordonnées bancaires, mots de passe…)
                    dans ce formulaire.
                </p>
            </Section>

            <Section id="finalites" title="Utilisation des données">
                <p>
                    Ces informations sont utilisées uniquement pour répondre à votre demande et, le cas échéant, assurer le suivi de votre
                    projet. Elles ne sont ni vendues, ni louées, ni utilisées à des fins publicitaires, et ne font l'objet d'aucune décision
                    automatisée.
                </p>
            </Section>

            <Section id="destinataires" title="Destinataires">
                <p>
                    Vos messages sont enregistrés dans la base de données du site et consultables uniquement par les membres autorisés de
                    l'équipe {legal.company}, via un espace d'administration protégé. Ils ne sont transmis à aucun tiers, sauf obligation
                    légale.
                </p>
            </Section>

            <Section id="conservation" title="Durée de conservation">
                <p>
                    Les messages de contact sont conservés pendant{' '}
                    <Fill value={legal.retention_months && `${legal.retention_months} mois`} label="durée de conservation" /> à compter de leur
                    réception, puis supprimés, sauf si une relation commerciale s'est engagée entre-temps. Vous pouvez demander leur suppression
                    à tout moment.
                </p>
            </Section>

            <Section id="cookies" title="Cookies">
                <p>Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement :</p>
                <ul>
                    <li>
                        un <strong className="text-white">cookie de session</strong>, qui maintient votre navigation et permet d'afficher la
                        confirmation d'envoi du formulaire ; il expire après {sessionMinutes} minutes d'inactivité ;
                    </li>
                    <li>
                        un <strong className="text-white">cookie de sécurité</strong> (XSRF-TOKEN), qui protège les formulaires contre les
                        envois frauduleux ;
                    </li>
                    <li>
                        pour les seuls administrateurs du site, un cookie « se souvenir de moi » s'ils cochent cette option à la connexion.
                    </li>
                </ul>
                <p>
                    Aucun cookie publicitaire, de mesure d'audience ou de réseau social n'est déposé. Ces cookies étant indispensables, ils ne
                    nécessitent pas votre consentement préalable.
                </p>
            </Section>

            <Section id="tiers" title="Services tiers">
                <p>
                    Toutes les ressources du site (images, polices de caractères, scripts) sont servies directement par notre serveur :
                    aucun service tiers n'est contacté lorsque vous consultez nos pages. Si vous utilisez le lien WhatsApp, votre échange
                    est soumis à la politique de confidentialité de WhatsApp.
                </p>
            </Section>

            <Section id="securite" title="Sécurité">
                <p>
                    Nous mettons en œuvre des mesures techniques pour protéger vos données : espace d'administration accessible uniquement
                    par mot de passe, mots de passe stockés sous forme chiffrée (hachée), limitation du nombre de tentatives de connexion et
                    d'envois du formulaire, et protection des formulaires contre les requêtes frauduleuses.
                </p>
            </Section>

            <Section id="droits" title="Vos droits">
                <p>
                    Conformément à <Fill value={legal.law} label="loi applicable sur la protection des données" />, vous disposez des droits
                    suivants sur vos données :
                </p>
                <ul>
                    <li>droit d'accès et de rectification ;</li>
                    <li>droit à l'effacement ;</li>
                    <li>droit d'opposition et de limitation du traitement.</li>
                </ul>
                <p>
                    Pour exercer ces droits, écrivez-nous à <a href={`mailto:${email}`}>{email}</a>. Nous vous répondrons dans les meilleurs
                    délais. Vous pouvez également saisir l'autorité de protection des données compétente dans votre pays.
                </p>
            </Section>

            <Section id="modifications" title="Modifications">
                <p>
                    Cette politique peut être mise à jour, notamment en cas d'évolution du site ou de la réglementation. La date de dernière
                    mise à jour figure en haut de cette page.
                </p>
            </Section>
        </LegalLayout>
    );
}
