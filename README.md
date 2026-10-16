# OWO — plateforme économique en réseau

OWO est une application web mobile-first destinée aux entreprises, commerçants, pionniers et membres d'un réseau économique. Cette version initiale met en place l'interface de démonstration, la structure frontend et une première migration PostgreSQL/Supabase.

## État du projet

- [x] Interface responsive en français, identité visuelle noir et or.
- [x] Navigation entre les 10 espaces : Showcase, Back-office, Ordres & commandes, Clients, Messagerie, Réseau, Banque, Juridique, Audit et Services.
- [x] Vitrine avec recherche et ajout de produits dans l'état local de démonstration.
- [x] Indicateur en ligne/hors ligne.
- [x] Client Supabase préparé avec variables d'environnement.
- [x] Migration initiale avec profils, entreprises, membres, produits, commandes, publications, réactions, messages, notifications, registre interne, documents juridiques et audit.
- [ ] Authentification réelle et parcours d'inscription d'entreprise.
- [ ] Application de la migration au projet Supabase OWO-APP et tests RLS en environnement connecté.
- [ ] Stockage, temps réel, synchronisation hors-ligne persistante et notifications réelles.
- [ ] Tests automatisés et déploiement.

Les nombres, commandes, produits et prix de l'interface sont des données fictives locales. Ils ne sont ni enregistrés dans Supabase ni liés à des transactions réelles.

## Démarrage local

Prérequis : Node.js 20+ et npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Dans `.env.local`, renseigner les valeurs depuis **Supabase > OWO-APP > Project Settings > API** :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (ou la clé publishable)

Ne jamais placer la clé `service_role` ou une clé secrète dans le frontend, dans GitHub ou dans un fichier préfixé `VITE_`.

## Base de données

La migration initiale se trouve dans `supabase/migrations/202610160001_initial_schema.sql`. Elle est à examiner puis à appliquer au projet **OWO-APP** uniquement. Elle ne modifie pas les projets Supabase `OWO`, `Pique` ou `OWOS`.

La migration active RLS sur les tables métier et utilise des fonctions de contrôle d'appartenance pour l'isolation des entreprises. Les réactions négatives exigent un motif d'au moins 20 caractères. Les événements d'audit et les écritures du registre interne ne disposent pas de politique de modification/suppression pour les rôles applicatifs ordinaires.

## Vérifications de sécurité

Les contrôles de régression SQL sont dans `supabase/tests/database/rls_security.pgtap.sql` (pgTAP) et `supabase/tests/database/rls_security.test.sql` (assertions SQL). Après avoir installé Docker et la Supabase CLI, démarrez l'environnement local puis lancez :

```bash
supabase start
supabase test db
```

Ces tests vérifient les privilèges de colonnes, les contraintes composites inter-entreprises, les triggers de protection des rôles et l'audit. Ils restent des contrôles structurels : des scénarios comportementaux multi-utilisateurs avec plusieurs entreprises doivent encore être ajoutés et exécutés avant la production.

## Sécurité et limites

- L'interface est une démonstration et ne remplace pas encore les tests de sécurité.
- Le registre est un registre interne de suivi : il ne constitue pas un compte bancaire et n'exécute aucun paiement Pi.
- L'assistant juridique, la messagerie, les notifications et les services sont des espaces préparés, pas encore des intégrations actives.
- Avant la production : tester les politiques RLS avec plusieurs utilisateurs/entreprises, revoir les autorisations de création de membres, ajouter les tests automatisés et configurer les sauvegardes/alertes.

## Développement

Le travail initial est conservé sur la branche `owo-integration`. La branche `main` n'est pas modifiée par cette intégration.
