# OWO — plateforme économique en réseau

OWO est une application web mobile-first destinée aux entreprises, commerçants et membres d'un réseau économique. Le dépôt contient une interface React/Vite, un client Supabase et une migration PostgreSQL avec des règles d'isolation par entreprise.

## Fonctionnalités implémentées dans cette branche

- [x] Interface responsive en français, identité visuelle noir et or.
- [x] Navigation entre les 10 espaces : Showcase, Back-office, Ordres & commandes, Clients, Messagerie, Réseau, Banque, Juridique, Audit et Services.
- [x] Inscription et connexion par e-mail/mot de passe avec Supabase Auth.
- [x] Parcours de création d'un espace entreprise et attribution du rôle initial de propriétaire.
- [x] Chargement des produits et des six commandes les plus récentes de l'entreprise connectée, en respectant les politiques RLS.
- [x] Ajout de produits dans Supabase lorsque le backend est configuré ; ajout local en mode démo sinon.
- [x] Indicateur en ligne/hors ligne et affichage explicite du mode démo/connexion.
- [x] Migration initiale avec profils, entreprises, membres, produits, commandes, publications, réactions, messages, notifications, registre interne, documents juridiques et audit.
- [x] Tests SQL structurels et workflow GitHub Actions pour le build frontend et les tests de base locale.
- [ ] Appliquer et valider la migration dans l'environnement Supabase dédié OWO-APP.
- [ ] Exécuter les tests RLS comportementaux avec plusieurs utilisateurs et entreprises.
- [ ] Finaliser la vitrine publique sans connexion, le panier et la création de commandes côté client.
- [ ] Activer les modules Messagerie, Réseau, Banque, Juridique, Audit et Services avec leurs flux de données complets.
- [ ] Stockage, temps réel, synchronisation hors-ligne persistante et notifications réelles.
- [ ] Finaliser les tests de bout en bout et le déploiement.

Les produits et commandes affichés sans configuration Supabase sont des données fictives locales. Les indicateurs de visites ne sont pas encore connectés à un système d'analytique. Aucun paiement Pi ou bancaire n'est effectué.

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

Sans ces deux variables, l'application reste en mode démo et n'enregistre pas les données. Avec ces variables, l'authentification et les opérations de données nécessitent que le schéma et les politiques RLS correspondantes soient installés sur le projet cible.

## Base de données

La migration initiale se trouve dans `supabase/migrations/202610160001_initial_schema.sql`. Elle doit être examinée puis appliquée au projet dédié **OWO-APP** uniquement. Elle n'a pas été appliquée depuis ce dépôt et ne modifie pas les projets Supabase `OWO`, `Pique` ou `OWOS`.

La migration active RLS sur les tables métier et utilise des fonctions de contrôle d'appartenance pour l'isolation des entreprises. Les réactions négatives exigent un motif d'au moins 20 caractères. Les événements d'audit et les écritures du registre interne ne disposent pas de politique de modification/suppression pour les rôles applicatifs ordinaires.

## Vérifications de sécurité

Les contrôles de régression SQL sont dans `supabase/tests/database/rls_security.pgtap.sql` (pgTAP) et `supabase/tests/database/rls_security.test.sql` (assertions SQL). Après avoir installé Docker et la Supabase CLI, démarrez l'environnement local puis lancez :

```bash
supabase start
supabase test db
```

Ces tests vérifient les privilèges de colonnes, les contraintes composites inter-entreprises, les triggers de protection des rôles et l'audit. Ils restent des contrôles structurels : des scénarios comportementaux multi-utilisateurs avec plusieurs entreprises doivent encore être ajoutés et exécutés avant la production.

## Sécurité et limites

- Le frontend n'utilise que la clé publique/publishable Supabase. La clé `service_role` ne doit jamais être exposée au navigateur.
- Les données métier doivent être protégées par RLS côté PostgreSQL ; un filtrage côté interface ne constitue pas une protection.
- Le registre est un registre interne de suivi : il ne constitue pas un compte bancaire et n'exécute aucun paiement Pi.
- Les modules secondaires sont encore des espaces préparés, pas des intégrations complètes.
- Avant la production : appliquer la migration au projet dédié, vérifier les tests SQL, tester les accès multi-utilisateurs/entreprises, compléter les flux de commandes et configurer sauvegardes et alertes.

## Développement

Le travail est conservé sur la branche `owo-integration` et proposé dans la [PR n° 1](https://github.com/Ryanlemer7/PIWOS-/pull/1). La branche `main` n'est pas modifiée par cette intégration.
