<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Software;
use App\Models\Solution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $solutions = [
            ['logiciel', '💻', 'Solutions Digitales', 'blue', ['Développement Web', 'Applications mobiles', 'Logiciels métiers', 'ERP', 'SaaS']],
            ['entreprises', '🏢', 'Solutions Entreprises', 'purple', ['Gestion de présence', 'Gestion RH', 'Automatisation', 'Réseaux', 'Infrastructure']],
            ['securite', '🔐', 'Sécurité & Cybersécurité', 'red', ['Vidéosurveillance', "Contrôle d'accès", 'Alarmes', 'Sécurité informatique', 'Audit']],
            ['cloud', '☁️', 'Cloud & Infrastructure', 'cyan', ['Hébergement Web', 'SaaS', 'VPS', 'Serveurs', 'Sauvegarde']],
            ['ia', '🤖', 'Intelligence Artificielle', 'green', ['Solutions IA', 'Automatisation intelligente', 'Analyse de données', 'Assistants IA']],
            ['iot', '⚡', 'IoT & Technologies Intelligentes', 'yellow', ['Monitoring', 'Capteurs', 'Énergie intelligente', 'Automatisation', 'Objets connectés']],
        ];
        foreach ($solutions as $i => [$slug, $icon, $title, $color, $items]) {
            Solution::updateOrCreate(['slug' => $slug], compact('icon', 'title', 'color', 'items') + ['sort_order' => $i]);
        }

        $products = [
            ['smart-energy', '⚡', 'Énergie intelligente & connectée', 'IntellIno Smart Energy',
                'Surveillez et analysez votre consommation énergétique en temps réel.', 'Nouveau', 'green',
                ['Monitoring électrique', 'Alertes en temps réel', 'Historique & rapports', 'Cloud synchronisé']],
            ['security-box', '🔐', 'Sécurité connectée', 'IntellIno Security Box',
                'La sécurité connectée pour vos infrastructures. Contrôle total, alertes instantanées.', 'Phare', 'primary',
                ['Vidéosurveillance', "Contrôle d'accès", 'Alertes intelligentes', 'Accès distant']],
            ['smart-attendance', '👥', 'Présence intelligente', 'IntellIno Smart Attendance',
                'Gérez intelligemment la présence de vos équipes avec précision.', 'Populaire', 'blue',
                ['Pointage automatique', 'Rapports RH', 'Intégration paie', 'Application mobile']],
        ];
        foreach ($products as $i => [$slug, $icon, $category, $name, $description, $badge, $badge_color, $features]) {
            Product::updateOrCreate(['slug' => $slug], compact('icon', 'category', 'name', 'description', 'badge', 'badge_color', 'features') + ['sort_order' => $i]);
        }

        $softwares = [
            ['scolaire', '🎓', 'Gestion Scolaire', 'Gestion complète des établissements scolaires.'],
            ['rh', '👥', 'IntellIno RH', 'Employés, présence, congés, rapports.'],
            ['business', '📊', 'IntellIno Business', 'Solutions de gestion pour entreprises.'],
            ['cloud', '☁️', 'IntellIno Cloud', 'Infrastructure et services Cloud.'],
        ];
        foreach ($softwares as $i => [$slug, $icon, $name, $description]) {
            Software::updateOrCreate(['slug' => $slug], compact('icon', 'name', 'description') + ['sort_order' => $i]);
        }

        $realisations = [
            ['📹', 'Sécurité', 'Système de vidéosurveillance', 'red',
                "Installation complète d'un système de vidéosurveillance pour une entreprise industrielle.",
                ['Caméras HD', 'Réseau dédié', 'Configuration', 'Formation']],
            ['👥', 'Entreprise', 'Système de présence biométrique', 'blue',
                "Déploiement d'un système de gestion de présence pour une institution avec 200+ employés.",
                ['Biométrie', 'Logiciel RH', 'Rapports', 'Support']],
            ['🌐', 'Réseaux', "Infrastructure réseau d'entreprise", 'green',
                "Conception et déploiement d'une infrastructure réseau sécurisée pour un établissement scolaire.",
                ['Câblage', 'Switch', 'Wifi', 'Sécurité']],
            ['💻', 'Logiciel', "Développement d'un logiciel de gestion", 'purple',
                "Développement d'une solution ERP sur mesure pour une PME commerciale.",
                ['ERP', 'Sur mesure', 'Formation', 'Maintenance']],
        ];
        foreach ($realisations as $i => [$icon, $category, $title, $color, $description, $tags]) {
            Realisation::updateOrCreate(['title' => $title], compact('icon', 'category', 'color', 'description', 'tags') + [
                'slug' => Str::slug($title),
                'sort_order' => $i,
            ]);
        }

        $posts = [
            ['tech-lab-vision', 'Innovation', 'IntellIno Technology Lab : vers des produits technologiques africains',
                "Comment IntellIno transforme les défis locaux en opportunités d'innovation technologique.", '2025-03-01'],
            ['cybersecurite-afrique', 'Cybersécurité', 'Les enjeux de la cybersécurité pour les entreprises africaines',
                "Un tour d'horizon des menaces actuelles et des solutions adaptées au contexte africain.", '2025-02-01'],
            ['iot-energie', 'IoT', "L'IoT au service de l'efficacité énergétique",
                "Comment les objets connectés révolutionnent la gestion de l'énergie dans les industries.", '2025-01-01'],
        ];
        foreach ($posts as [$slug, $category, $title, $excerpt, $published_at]) {
            Post::updateOrCreate(['slug' => $slug], compact('category', 'title', 'excerpt', 'published_at'));
        }
    }
}
