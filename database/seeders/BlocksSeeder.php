<?php

namespace Database\Seeders;

use App\Models\SiteBlock;
use Illuminate\Database\Seeder;

/**
 * Textes initiaux des blocs de pages. Une collection n'est remplie que si elle est vide :
 * les modifications faites dans l'admin ne sont jamais écrasées.
 */
class BlocksSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->collections() as $collection => $blocks) {
            if (SiteBlock::where('collection', $collection)->exists()) {
                continue;
            }
            foreach ($blocks as $i => $block) {
                [$icon, $title, $text, $link] = $block + [null, null, null, null];
                SiteBlock::create(compact('collection', 'icon', 'title', 'text', 'link') + ['sort_order' => $i]);
            }
        }
    }

    private function collections(): array
    {
        return [
            'chiffres' => [
                [null, '8+', "Domaines d'expertise"],
                [null, '100%', 'Solutions sur mesure'],
                [null, 'IA', 'Technology Lab actif'],
                [null, 'Africa', 'Vision continentale'],
            ],
            'domaines' => [
                ['💻', 'Logiciels & SaaS'],
                ['🌐', 'Cloud & Hébergement'],
                ['🔐', 'Cybersécurité'],
                ['📡', 'Réseaux & Télécoms'],
                ['📹', 'Sécurité électronique'],
                ['🤖', 'Intelligence Artificielle'],
                ['⚡', 'IoT & Systèmes intelligents'],
                ['🧪', 'Recherche & Innovation'],
            ],
            'pourquoi' => [
                ['🌍', 'Compréhension des réalités africaines', 'Des solutions adaptées aux besoins, aux infrastructures et aux contraintes locales. Nous pensons et construisons africain.'],
                ['🧠', 'Innovation & Création', "Nous ne faisons pas qu'utiliser la technologie. Nous la concevons, l'améliorons et la rendons accessible."],
                ['🔧', 'Accompagnement complet', "De l'installation à la formation, en passant par le support technique — nous sommes là à chaque étape."],
                ['🚀', "Vision d'avenir", 'IntellIno investit dans la R&D pour développer les technologies africaines de demain, avec une ambition internationale.'],
            ],
            'secteurs' => [
                ['🏢', 'Entreprises'],
                ['🏫', 'Éducation'],
                ['🏥', 'Santé'],
                ['🏨', 'Hôtellerie'],
                ['🏭', 'Industrie'],
                ['🌾', 'Agriculture'],
                ['🏛️', 'Institutions publiques'],
                ['💼', 'PME & Startups'],
            ],
            'etapes-lab' => [
                ['🔬', 'Recherche', "Comprendre un problème réel : observation du terrain, échanges avec les utilisateurs, étude de l'existant."],
                ['💡', 'Innovation', 'Explorer les pistes techniques et imaginer des réponses adaptées aux contraintes locales.'],
                ['🎨', 'Conception', "Définir l'architecture, l'électronique, le logiciel et l'expérience utilisateur."],
                ['🛠️', 'Prototype', 'Construire une première version fonctionnelle pour valider les choix.'],
                ['🧪', 'Test', "Éprouver le prototype en conditions réelles et l'améliorer à partir des retours."],
                ['📦', 'Produit', 'Industrialiser : fiabilité, documentation, production et support.'],
                ['🚀', 'Commercialisation', "Déployer auprès des clients et accompagner l'adoption sur le terrain."],
            ],
            'piliers' => [
                ['🎯', 'Notre mission', "Connecter l'Afrique et sécuriser ses rêves : accompagner les entreprises et les institutions dans leur transformation numérique avec des solutions fiables, adaptées et durables."],
                ['🔭', 'Notre vision', "Une Afrique qui ne se contente pas de consommer la technologie, mais qui la conçoit, la produit et l'exporte, avec des solutions pensées pour ses réalités et ouvertes sur le monde."],
                ['🧭', 'Notre approche', "Écouter avant de proposer, concevoir sur mesure, puis accompagner dans la durée : de l'installation à la formation, en passant par le support technique."],
            ],
            'valeurs' => [
                ['💡', 'Innovation', 'Chercher en permanence de meilleures façons de résoudre les problèmes de nos clients.'],
                ['🤝', 'Proximité', 'Comprendre le terrain, les contraintes locales et parler le langage de nos clients.'],
                ['⭐', 'Exigence', 'Livrer des solutions robustes, documentées et pensées pour durer.'],
                ['🌍', 'Engagement', "Contribuer à l'émergence d'un écosystème technologique africain."],
            ],
            'faq' => [
                [null, 'Quels types de projets accompagnez-vous ?', 'Logiciels et applications, solutions pour entreprises (présence, RH, automatisation), sécurité électronique et cybersécurité, cloud et hébergement, intelligence artificielle, IoT et réseaux. Consultez nos solutions pour le détail.', '/solutions'],
                [null, 'Pouvez-vous adapter une solution à mon organisation ?', 'Oui. Toutes nos solutions sont conçues sur mesure, en tenant compte de vos processus, de vos infrastructures et de vos contraintes locales.'],
                [null, 'Assurez-vous la formation et le support après la mise en service ?', "Oui. Nous accompagnons nos clients de l'installation à la formation des utilisateurs, puis assurons le support technique et la maintenance."],
                [null, 'Travaillez-vous avec les institutions publiques ?', "Oui. Nous intervenons auprès des entreprises, PME et startups, mais aussi des établissements d'éducation et de santé, de l'hôtellerie, de l'industrie, de l'agriculture et des institutions publiques."],
                [null, 'Comment devenir partenaire du Technology Lab ?', 'Choisissez le sujet « Partenariat » dans le formulaire et présentez-nous votre organisation et votre idée : nous reviendrons vers vous pour en discuter.'],
            ],
            'apres-contact' => [
                ['📩', 'Réception', 'Votre message est transmis directement à notre équipe.'],
                ['📞', 'Premier échange', 'Un expert vous recontacte pour mieux comprendre votre besoin et votre contexte.'],
                ['📋', 'Proposition', 'Nous vous présentons une solution adaptée, avec son planning et son budget.'],
            ],
            'demarche' => [
                ['🔍', 'Écoute & audit', 'Nous analysons vos besoins, vos contraintes et votre existant.'],
                ['📐', 'Conception', 'Nous proposons une solution adaptée, chiffrée et planifiée.'],
                ['🛠️', 'Déploiement', 'Nous installons, configurons et testons avec vos équipes.'],
                ['🎓', 'Formation', 'Vos utilisateurs sont formés pour être autonomes.'],
                ['🤝', 'Support', 'Nous assurons la maintenance et le suivi dans la durée.'],
            ],
            'atouts-logiciels' => [
                ['🌐', 'Accessible partout', 'Une application en ligne, utilisable depuis un ordinateur, une tablette ou un smartphone.'],
                ['🛠️', 'Adaptable', 'Paramétrée selon votre organisation, vos règles et votre vocabulaire.'],
                ['🎓', 'Prise en main accompagnée', 'Installation, formation des utilisateurs et support technique inclus dans notre accompagnement.'],
            ],
            'principes-lab' => [
                ['🌍', 'Partir du terrain', 'Chaque projet commence par un problème réel, observé chez nos clients ou dans notre environnement.'],
                ['🔧', 'Concevoir pour les contraintes locales', "Coupures d'électricité, connectivité variable, coûts : nos solutions sont pensées pour fonctionner dans ces conditions."],
                ['📈', "Aller jusqu'au produit", "Un prototype ne suffit pas : notre objectif est d'industrialiser et de mettre les solutions entre les mains des utilisateurs."],
                ['🌐', 'Penser Afrique, viser le monde', "Des technologies conçues pour l'Afrique, avec une ambition internationale."],
            ],
            'axes-recherche' => [
                ['⚡', 'Énergie intelligente', 'Mesure, suivi et optimisation de la consommation électrique, y compris sur les réseaux instables et les installations solaires.'],
                ['🔐', 'Sécurité connectée', "Vidéosurveillance, contrôle d'accès et détection d'événements pilotables à distance."],
                ['🤖', 'Intelligence artificielle', 'Analyse de données, automatisation intelligente et assistants adaptés aux usages locaux.'],
                ['📡', 'IoT & connectivité', 'Capteurs et objets connectés capables de fonctionner avec une connectivité limitée.'],
                ['👥', 'Gestion des organisations', 'Outils numériques pour la présence, les ressources humaines et la gestion scolaire.'],
                ['☁️', 'Cloud & infrastructures', 'Hébergement, sauvegarde et services en ligne fiables pour les organisations africaines.'],
            ],
            'partenaires-lab' => [
                ['🎓', 'Universités & écoles', "Projets de recherche, stages, sujets de fin d'études et transfert de connaissances."],
                ['🏢', 'Entreprises', 'Co-développement de solutions répondant à vos besoins métier et tests en conditions réelles.'],
                ['🏛️', 'Institutions & collectivités', "Projets pilotes au service des citoyens, de l'éducation, de la santé ou de l'énergie."],
                ['🚀', 'Startups & innovateurs', 'Mise en commun de compétences techniques pour accélérer des projets innovants.'],
                ['🔌', 'Fabricants & intégrateurs', 'Collaboration sur le matériel, les composants et la distribution de nos produits.'],
                ['💼', 'Investisseurs & bailleurs', "Accompagnement du passage à l'échelle des technologies conçues par le Lab."],
            ],
            'apports-lab' => [
                ['🧠', 'Expertise technique', 'Logiciel, électronique, IoT, IA, réseaux et sécurité réunis dans une même équipe.'],
                ['🗺️', 'Connaissance du terrain', 'Une compréhension concrète des réalités et des contraintes africaines.'],
                ['🔄', 'Méthode éprouvée', 'Un parcours structuré, de la recherche à la commercialisation.'],
            ],
        ];
    }
}
