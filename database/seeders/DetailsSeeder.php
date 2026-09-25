<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Software;
use App\Models\Solution;
use Illuminate\Database\Seeder;

/**
 * Textes des pages de détail Solutions / Produits.
 * Ne remplit que les champs vides : les modifications faites dans l'admin sont conservées.
 */
class DetailsSeeder extends Seeder
{
    public function run(): void
    {
        $solutions = [
            'logiciel' => [
                "Nous concevons des applications web, mobiles et des logiciels métiers pensés pour vos processus, vos utilisateurs et les conditions réelles de connectivité.",
                ['Applications sur mesure, adaptées à votre métier', 'Fonctionnement fiable même avec une connexion limitée', 'Interfaces simples, pensées pour vos équipes', 'Maintenance et évolutions assurées dans la durée'],
            ],
            'entreprises' => [
                "Nous équipons les organisations d'outils de gestion et d'infrastructures fiables pour gagner en efficacité au quotidien : présence, RH, automatisation et réseaux.",
                ['Suivi précis du temps et des effectifs', 'Tâches répétitives automatisées', 'Infrastructure stable et sécurisée', 'Tableaux de bord pour piloter votre activité'],
            ],
            'securite' => [
                "Nous protégeons vos sites, vos équipements et vos données : de la vidéosurveillance au contrôle d'accès, jusqu'à l'audit de votre sécurité informatique.",
                ['Surveillance de vos sites à distance, en temps réel', 'Accès maîtrisés et traçables', 'Détection et alertes rapides en cas d\'incident', 'Audit et recommandations adaptés à votre contexte'],
            ],
            'cloud' => [
                "Nous hébergeons et administrons vos sites, applications et données sur des infrastructures performantes, avec des sauvegardes régulières.",
                ['Haute disponibilité de vos services', 'Sauvegardes automatiques et restauration rapide', 'Ressources ajustables selon vos besoins', 'Supervision et support technique réactif'],
            ],
            'ia' => [
                "Nous mettons l'intelligence artificielle au service de vos opérations : automatisation intelligente, analyse de données et assistants virtuels.",
                ['Décisions éclairées grâce à vos données', 'Automatisation des tâches à faible valeur ajoutée', 'Assistants disponibles en continu pour vos clients', 'Solutions pragmatiques, adaptées à votre maturité numérique'],
            ],
            'iot' => [
                "Nous connectons vos équipements pour mesurer, surveiller et piloter à distance : énergie, capteurs, automatisation et objets connectés.",
                ['Mesures en temps réel de vos installations', 'Réduction des pertes et de la consommation d\'énergie', 'Alertes automatiques en cas d\'anomalie', 'Pilotage à distance depuis le web ou le mobile'],
            ],
        ];

        foreach ($solutions as $slug => [$description, $benefits]) {
            $solution = Solution::where('slug', $slug)->first();
            $solution?->fill(array_filter([
                'description' => $solution->description ? null : $description,
                'benefits' => $solution->benefits ? null : $benefits,
            ]))->save();
        }

        $products = [
            'smart-energy' => [
                "IntellIno Smart Energy mesure en continu la consommation électrique de vos bâtiments et équipements. Les données sont envoyées dans le cloud et consultables depuis un tableau de bord web ou mobile, pour repérer les gaspillages, anticiper les surcharges et suivre vos économies.",
                ['Bureaux et bâtiments administratifs', 'Sites industriels et ateliers', 'Hôtels, écoles et centres de santé', 'Installations solaires et groupes électrogènes'],
            ],
            'security-box' => [
                "IntellIno Security Box réunit vidéosurveillance, contrôle d'accès et alertes dans une solution unique. Vous suivez vos sites en direct, recevez une notification dès qu'un événement est détecté et gérez les accès à distance.",
                ['Entrepôts et sites de stockage', 'Agences et commerces', 'Établissements scolaires', 'Résidences et sites multi-bâtiments'],
            ],
            'smart-attendance' => [
                "IntellIno Smart Attendance automatise le pointage de vos équipes grâce à des terminaux biométriques ou mobiles. Les heures, retards et absences sont centralisés et exportables vers la paie, sans saisie manuelle.",
                ['Entreprises multi-sites', 'Institutions et administrations', 'Établissements scolaires', 'Chantiers et équipes terrain'],
            ],
        ];

        foreach ($products as $slug => [$details, $useCases]) {
            $product = Product::where('slug', $slug)->first();
            $product?->fill(array_filter([
                'details' => $product->details ? null : $details,
                'use_cases' => $product->use_cases ? null : $useCases,
            ]))->save();
        }

        $this->realisations();
        $this->posts();
        $this->softwares();
    }

    private function softwares(): void
    {
        $softwares = [
            'scolaire' => [
                "Une plateforme en ligne pour gérer toute la vie d'un établissement : inscriptions, classes, notes, bulletins, présences et frais de scolarité. Direction, enseignants et comptabilité travaillent sur les mêmes données, et les parents sont informés rapidement.",
                ['Élèves et inscriptions', 'Classes et matières', 'Saisie des notes et bulletins PDF', 'Suivi des présences et absences', 'Facturation et paiements des frais', 'Annonces aux parents par SMS'],
                ['Écoles primaires', 'Collèges et lycées', 'Établissements privés', 'Centres de formation'],
            ],
            'rh' => [
                "IntellIno RH centralise les informations de vos collaborateurs et automatise le suivi du temps de travail. Couplé à Smart Attendance, il récupère directement les pointages pour produire des rapports fiables.",
                ['Dossiers des employés', 'Présences et pointage', 'Demandes et suivi des congés', 'Rapports RH et exports pour la paie', 'Organigramme et services', 'Accès par rôle'],
                ['PME et grandes entreprises', 'Institutions et administrations', 'Structures multi-sites'],
            ],
            'business' => [
                "IntellIno Business réunit la gestion commerciale et opérationnelle de votre entreprise dans un seul outil : ventes, stocks, achats et facturation, avec des tableaux de bord pour suivre votre activité en temps réel.",
                ['Ventes et devis', 'Gestion des stocks', 'Achats et fournisseurs', 'Facturation et encaissements', 'Fichier clients', 'Tableaux de bord de direction'],
                ['Commerces et distributeurs', 'PME de services', 'Startups en croissance'],
            ],
            'cloud' => [
                "IntellIno Cloud héberge vos sites, applications et données sur une infrastructure administrée par nos équipes, avec des sauvegardes régulières et un support réactif.",
                ['Hébergement de sites web', 'Serveurs privés virtuels (VPS)', 'Hébergement de vos applications métiers', 'Sauvegardes automatiques', 'Supervision et maintenance', 'Support technique'],
                ['Entreprises et PME', 'Institutions', 'Éditeurs de logiciels', 'Associations et ONG'],
            ],
        ];

        foreach ($softwares as $slug => [$details, $features, $audiences]) {
            $software = Software::where('slug', $slug)->first();
            $software?->fill(array_filter([
                'details' => $software->details ? null : $details,
                'features' => $software->features ? null : $features,
                'audiences' => $software->audiences ? null : $audiences,
            ]))->save();
        }
    }

    private function realisations(): void
    {
        $realisations = [
            'systeme-de-videosurveillance' => ['Entreprise industrielle', 2024,
                "Le site de production s'étendait sur plusieurs bâtiments sans vision d'ensemble : les incidents étaient constatés trop tard et les images existantes étaient de mauvaise qualité.\n\nNous avons conçu un plan de couverture complet, installé des caméras HD sur un réseau dédié et centralisé l'enregistrement. Les responsables consultent désormais les images en direct depuis leur poste ou leur téléphone, et l'équipe de sécurité a été formée à l'exploitation du système.",
            ],
            'systeme-de-presence-biometrique' => ['Institution publique', 2024,
                "Avec plus de 200 employés répartis sur plusieurs services, le suivi des présences reposait sur des registres papier difficiles à exploiter pour la paie.\n\nNous avons déployé des terminaux biométriques reliés à un logiciel RH centralisé. Les heures d'arrivée, retards et absences sont enregistrés automatiquement, et les rapports mensuels sont générés en quelques clics. Un support technique accompagne l'institution au quotidien.",
            ],
            'infrastructure-reseau-dentreprise' => ['Établissement scolaire', 2023,
                "L'établissement souffrait d'un réseau saturé et non sécurisé, ne couvrant qu'une partie des salles et de l'administration.\n\nNous avons repensé l'architecture : câblage structuré, switchs administrables, Wi-Fi couvrant l'ensemble du campus et séparation des réseaux élèves, enseignants et administration. Le résultat : une connexion stable, sécurisée et facile à maintenir.",
            ],
            'developpement-dun-logiciel-de-gestion' => ['PME commerciale', 2023,
                "La gestion des stocks, des ventes et de la facturation se faisait sur des tableurs dispersés, source d'erreurs et de pertes de temps.\n\nNous avons développé un ERP sur mesure couvrant les achats, les stocks, les ventes et la facturation, avec des tableaux de bord pour la direction. Les équipes ont été formées, et nous assurons la maintenance et les évolutions de la solution.",
            ],
        ];

        foreach ($realisations as $slug => [$client, $year, $details]) {
            $realisation = Realisation::where('slug', $slug)->first();
            $realisation?->fill(array_filter([
                'client' => $realisation->client ? null : $client,
                'year' => $realisation->year ? null : $year,
                'details' => $realisation->details ? null : $details,
            ]))->save();
        }
    }

    private function posts(): void
    {
        $bodies = [
            'tech-lab-vision' => <<<'TXT'
                L'Afrique est aujourd'hui l'un des marchés les plus dynamiques pour le numérique. Pourtant, la plupart des technologies utilisées sur le continent sont conçues ailleurs, pour d'autres contextes. C'est de ce constat qu'est né le IntellIno Technology Lab.

                ## Partir des problèmes réels

                Coupures d'électricité, connectivité irrégulière, coûts d'équipement élevés : ces contraintes ne sont pas des détails. Elles déterminent si une solution fonctionnera ou non sur le terrain. Au Lab, chaque projet commence par l'observation d'un problème concret rencontré par nos clients.

                ## Une méthode en sept étapes

                Nous suivons un parcours structuré, de l'idée au produit commercialisé :

                - Recherche et compréhension du besoin
                - Innovation et exploration des pistes techniques
                - Conception et prototypage
                - Tests en conditions réelles
                - Industrialisation et commercialisation

                ## Des premiers produits concrets

                IntellIno Smart Energy, Security Box et Smart Attendance sont les premiers résultats de cette démarche. Ils répondent à des besoins que nous rencontrons chaque jour : maîtriser sa consommation d'énergie, sécuriser ses sites et suivre la présence de ses équipes.

                Notre conviction est simple : l'Afrique ne doit pas seulement consommer la technologie, elle doit aussi la créer.
                TXT,
            'cybersecurite-afrique' => <<<'TXT'
                La transformation numérique des entreprises africaines s'accélère : paiement mobile, services en ligne, données dans le cloud. Cette évolution crée de nouvelles opportunités, mais aussi de nouveaux risques.

                ## Des menaces bien réelles

                Les attaques ne visent pas seulement les grandes organisations. Les PME sont souvent des cibles privilégiées, car moins protégées. Les menaces les plus fréquentes sont :

                - L'hameçonnage (phishing) par e-mail ou messagerie
                - Les rançongiciels qui bloquent les données
                - Les mots de passe faibles ou réutilisés
                - Les équipements et logiciels non mis à jour

                ## Des mesures simples et efficaces

                Une bonne sécurité commence par des bases solides : sauvegardes régulières et testées, mises à jour systématiques, authentification à deux facteurs, et sensibilisation des équipes. Ces mesures, peu coûteuses, réduisent fortement les risques.

                ## Évaluer avant d'investir

                Chaque organisation est différente. Un audit permet d'identifier les vulnérabilités prioritaires et d'investir là où c'est le plus utile. C'est la démarche que nous proposons à nos clients : comprendre, prioriser, puis agir.
                TXT,
            'iot-energie' => <<<'TXT'
                L'énergie représente une part importante des coûts de nombreuses entreprises, en particulier dans l'industrie. Pourtant, la consommation reste souvent mal connue : on constate la facture, sans savoir où part l'énergie.

                ## Mesurer pour comprendre

                Les objets connectés changent la donne. Des capteurs installés sur les tableaux électriques et les équipements mesurent la consommation en continu et transmettent les données vers une plateforme accessible en ligne.

                ## Des bénéfices rapides

                Une fois la consommation visible, les gains apparaissent vite :

                - Repérer les équipements les plus énergivores
                - Détecter les consommations anormales la nuit ou le week-end
                - Anticiper les surcharges et les pannes
                - Suivre l'efficacité des actions d'économie

                ## Adapté aux réalités locales

                Dans un contexte de coupures fréquentes et de recours aux groupes électrogènes ou au solaire, le suivi en temps réel permet aussi d'optimiser l'utilisation de chaque source d'énergie. C'est l'objectif d'IntellIno Smart Energy : rendre la gestion de l'énergie simple, mesurable et rentable.
                TXT,
        ];

        foreach ($bodies as $slug => $body) {
            Post::where('slug', $slug)->whereNull('body')->update(['body' => $body]);
        }
    }
}
