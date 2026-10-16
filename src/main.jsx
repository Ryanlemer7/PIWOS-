import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness,
  Building2, Check, ChevronDown, CircleHelp, ClipboardList, Coins, Command,
  Compass, CreditCard, FileCheck2, FileText, Globe2, Handshake, Heart, Home,
  LayoutDashboard, LogOut, Menu, MessageCircle, MoreHorizontal, Package,
  Plus, Search, Send, Settings2, ShieldCheck, ShoppingBag, Sparkles, Store,
  TrendingUp, Users, Wallet, Wifi, WifiOff, X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';
import './styles.css';

const navGroups = [
  { label: 'ESPACE', items: [
    { id: 'Accueil', icon: LayoutDashboard },
    { id: 'Showcase', icon: Store },
    { id: 'Back-office', icon: BriefcaseBusiness },
    { id: 'Ordres & commandes', icon: ClipboardList },
    { id: 'Clients', icon: Users },
  ]},
  { label: 'COMMUNAUTÉ', items: [
    { id: 'Messagerie', icon: MessageCircle, count: '3' },
    { id: 'Réseau', icon: Globe2 },
    { id: 'Services', icon: Compass },
  ]},
  { label: 'GESTION', items: [
    { id: 'Banque', icon: Wallet },
    { id: 'Juridique', icon: FileCheck2 },
    { id: 'Audit', icon: ShieldCheck },
  ]},
];

const initialProducts = [
  { id: 1, name: 'Sac Naya', category: 'Mode & accessoires', price: '45 π', stock: 18, tone: 'rose', mark: 'N' },
  { id: 2, name: 'Ensemble Kora', category: 'Prêt-à-porter', price: '72 π', stock: 7, tone: 'sand', mark: 'K' },
  { id: 3, name: 'Montre Sira', category: 'Accessoires', price: '38 π', stock: 24, tone: 'blue', mark: 'S' },
];
const initialOrders = [
  { id: '#OW-1048', name: 'Aminata B.', detail: 'Sac Naya · 1 article', amount: '45 π', status: 'À confirmer', color: 'gold' },
  { id: '#OW-1047', name: 'Moussa T.', detail: 'Ensemble Kora · 1 article', amount: '72 π', status: 'En préparation', color: 'blue' },
  { id: '#OW-1046', name: 'Fatou D.', detail: 'Montre Sira · 2 articles', amount: '76 π', status: 'Expédiée', color: 'green' },
];
const sectionCopy = {
  'Showcase': ['Votre vitrine, partout.', 'Présentez vos produits et faites grandir votre clientèle.'],
  'Back-office': ['Votre entreprise en un regard.', 'Centralisez votre activité et vos opérations quotidiennes.'],
  'Ordres & commandes': ['Chaque commande compte.', 'Suivez les demandes, préparez les ventes et gardez le fil.'],
  'Clients': ['Des relations qui durent.', 'Retrouvez vos clients et l’historique de vos échanges.'],
  'Messagerie': ['La conversation continue.', 'Échangez avec votre réseau depuis un espace unique.'],
  'Réseau': ['Le réseau crée les opportunités.', 'Découvrez les entreprises et les personnes autour de vous.'],
  'Banque': ['Gardez le contrôle.', 'Consultez le registre interne de vos mouvements.'],
  'Juridique': ['Avancez en confiance.', 'Organisez vos documents et vos échéances juridiques.'],
  'Audit': ['La transparence avant tout.', 'Consultez les événements et les actions enregistrés.'],
  'Services': ['Des outils à portée de main.', 'Explorez les services qui accompagnent votre activité.'],
};

function Coin() {
  return <div className="coin-stage" aria-label="Pièce OWO animée">
    <div className="coin">
      <div className="coin-face coin-front"><span className="coin-ring" /><span className="coin-logo">OWO</span><span className="coin-sub">UNIVERS • OPPORTUNITÉS</span></div>
      <div className="coin-face coin-back"><span className="coin-ring" /><span className="coin-mark">✦</span><span className="coin-sub">CORIE · OWO</span></div>
    </div>
    <span className="coin-shadow" />
  </div>;
}

function App() {
  const [active, setActive] = useState('Accueil');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [toast, setToast] = useState('');
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [profileMenu, setProfileMenu] = useState(false);

  React.useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const filteredProducts = useMemo(() => products.filter(p => (p.name + ' ' + p.category).toLowerCase().includes(search.toLowerCase())), [products, search]);
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };
  const addProduct = (e) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice.trim()) return;
    setProducts(prev => [{ id: Date.now(), name: productName.trim(), category: 'Nouveau produit', price: productPrice.trim().includes('π') ? productPrice.trim() : productPrice.trim() + ' π', stock: 1, tone: 'sand', mark: productName.trim().slice(0,1).toUpperCase() }, ...prev]);
    setProductName('');
    setProductPrice('');
    setShowProductForm(false);
    notify('Produit ajouté à l’aperçu de démonstration.');
  };
  const selectNav = (id) => { setActive(id); setMobileOpen(false); setSearch(''); };

  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileOpen ? 'sidebar-open' : '')}>
      <div className="brand-lockup">
        <div className="brand-symbol">O</div>
        <div><div className="brand-name">OWO<span>.</span></div><div className="brand-tag">ÉCONOMIE EN RÉSEAU</div></div>
        <button className="icon-btn sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu"><X size={18}/></button>
      </div>
      <button className="workspace-switch" onClick={() => notify('Sélecteur d’espace : connexion Supabase à configurer.')}>
        <div className="workspace-avatar">A</div><div className="workspace-text"><strong>AMAD HOUSE</strong><span>Espace entreprise</span></div><ChevronDown size={16}/>
      </button>
      <nav className="side-nav">
        {navGroups.map(group => <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map(item => { const Icon = item.icon; return <button key={item.id} className={'nav-item ' + (active === item.id ? 'active' : '')} onClick={() => selectNav(item.id)}>
            <Icon size={18} strokeWidth={1.8}/><span>{item.id}</span>{item.count && <span className="nav-count">{item.count}</span>}
          </button>; })}
        </div>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><div><strong>Besoin d’aide ?</strong><span>Guides & tutoriels</span></div><ArrowUpRight size={15}/></div>
        <button className="nav-item settings-item" onClick={() => notify('Les paramètres seront reliés au compte utilisateur.')}><Settings2 size={18}/><span>Paramètres</span></button>
        <div className="user-profile">
          <div className="user-avatar">TD</div><div className="user-meta"><strong>Thérèse D.</strong><span>Administratrice</span></div>
          <button className="icon-btn" onClick={() => setProfileMenu(!profileMenu)} aria-label="Menu du profil"><MoreHorizontal size={19}/></button>
          {profileMenu && <div className="profile-popover"><button onClick={() => notify('Profil bientôt connecté à Supabase.')}><Users size={15}/> Mon profil</button><button onClick={() => notify('La déconnexion sera activée avec Auth.')}><LogOut size={15}/> Déconnexion</button></div>}
        </div>
      </div>
    </aside>
    {mobileOpen && <button className="scrim" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu"><Menu size={20}/></button><div className="breadcrumb">Espace entreprise <span>/</span> <strong>{active}</strong></div></div>
        <div className="topbar-actions">
          <div className={'connection-pill ' + (online ? 'connected' : 'disconnected')}>{online ? <Wifi size={14}/> : <WifiOff size={14}/>}<span>{online ? 'En ligne' : 'Hors ligne'}</span></div>
          <button className="icon-btn notification-btn" onClick={() => notify('Vous êtes à jour pour cette démonstration.')} aria-label="Notifications"><Bell size={19}/><i/></button>
          <div className="topbar-divider"/>
          <button className="top-user" onClick={() => setProfileMenu(!profileMenu)}><span className="user-avatar small">TD</span><ChevronDown size={15}/></button>
        </div>
      </header>

      <div className="content-wrap">
        <div className="welcome-row">
          <div><div className="eyebrow"><Sparkles size={14}/> VOTRE UNIVERS, VOS OPPORTUNITÉS</div>
            <h1>{active === 'Accueil' ? <>Bonjour, Thérèse <span className="wave">✦</span></> : sectionCopy[active]?.[0] || active}</h1>
            <p className="page-subtitle">{active === 'Accueil' ? 'Voici ce qui se passe dans votre univers aujourd’hui.' : sectionCopy[active]?.[1]}</p>
          </div>
          <div className="date-chip"><span className="date-dot"/><span>ESPACE DÉMO</span><ChevronDown size={14}/></div>
        </div>

        {active === 'Accueil' ? <>
          <section className="hero-banner">
            <div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> L’ÉCONOMIE EN MOUVEMENT</div><h2>Un seul espace.<br/><em>Mille possibilités.</em></h2><p>Connectez votre activité, votre réseau et vos opportunités. Tout commence ici.</p><button className="gold-button" onClick={() => selectNav('Showcase')}>Explorer mon espace <ArrowRight size={16}/></button></div>
            <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="orbit-dot dot-one"/><div className="orbit-dot dot-two"/><Coin/><div className="art-caption"><span>OWO</span><small>BUILD · CONNECT · GROW</small></div></div>
            <div className="hero-index">01 <span>/ 03</span></div>
          </section>

          <div className="section-heading"><div><h2>Vue d’ensemble</h2><p>Les indicateurs de votre activité</p></div><button className="subtle-button" onClick={() => notify('Les indicateurs affichés sont des données de démonstration.')}>Cette semaine <ChevronDown size={15}/></button></div>
          <section className="metric-grid">
            <Metric icon={ShoppingBag} label="Commandes" value="128" change="+12,8%" trend="up" note="vs. semaine dernière"/>
            <Metric icon={Users} label="Nouveaux clients" value="34" change="+8,2%" trend="up" note="vs. semaine dernière"/>
            <Metric icon={Coins} label="Volume enregistré" value="2 840 π" change="+5,4%" trend="up" note="registre interne démo"/>
            <Metric icon={Activity} label="Visites vitrine" value="1 204" change="-2,1%" trend="down" note="vs. semaine dernière"/>
          </section>

          <div className="dashboard-grid">
            <section className="panel orders-panel">
              <div className="panel-heading"><div><h3>Commandes récentes</h3><p>Suivez les dernières opérations</p></div><button className="text-button" onClick={() => selectNav('Ordres & commandes')}>Tout voir <ArrowRight size={15}/></button></div>
              <div className="order-list">{initialOrders.map(order => <div className="order-row" key={order.id}><div className="order-icon"><ShoppingBag size={17}/></div><div className="order-main"><strong>{order.name}</strong><span>{order.id} · {order.detail}</span></div><div className="order-end"><strong>{order.amount}</strong><span className={'status status-' + order.color}><i/>{order.status}</span></div></div>)}</div>
              <div className="panel-footer"><span>Exemple de données · non transactionnelles</span><button className="icon-btn" onClick={() => notify('Les commandes seront chargées depuis Supabase après configuration.')} aria-label="Actualiser"><Activity size={16}/></button></div>
            </section>
            <section className="panel quick-panel">
              <div className="panel-heading"><div><h3>Accès rapide</h3><p>Vos outils essentiels</p></div><Command size={18} className="muted-icon"/></div>
              <div className="quick-links">
                <QuickLink icon={Plus} title="Ajouter un produit" subtitle="Enrichir la vitrine" onClick={() => { setActive('Showcase'); setShowProductForm(true); }}/>
                <QuickLink icon={Send} title="Envoyer un message" subtitle="Contacter votre réseau" onClick={() => selectNav('Messagerie')}/>
                <QuickLink icon={FileText} title="Mes documents" subtitle="Retrouver vos fichiers" onClick={() => selectNav('Juridique')}/>
                <QuickLink icon={Handshake} title="Découvrir le réseau" subtitle="Nouvelles opportunités" onClick={() => selectNav('Réseau')}/>
              </div>
            </section>
          </div>
          <section className="network-strip"><div className="network-symbol"><Globe2 size={23}/></div><div className="network-copy"><strong>Votre réseau est votre force.</strong><span>Rencontrez des entreprises, échangez et faites émerger de nouvelles opportunités.</span></div><button className="outline-gold-button" onClick={() => selectNav('Réseau')}>Explorer le réseau <ArrowRight size={15}/></button></section>
        </> : active === 'Showcase' ? <Showcase products={filteredProducts} search={search} setSearch={setSearch} onAdd={() => setShowProductForm(true)} onProductClick={(p) => notify(p.name + ' — fiche produit de démonstration.')} /> :
          <SectionView active={active} onNavigate={selectNav} notify={notify} />}

        <footer className="page-footer"><span>© 2026 OWO · Construire ensemble, grandir ensemble.</span><span><ShieldCheck size={13}/> Démonstration : les protections serveur restent à tester avant production.</span></footer>
      </div>
    </main>

    {showProductForm && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowProductForm(false); }}><form className="modal" onSubmit={addProduct}><div className="modal-header"><div><span className="eyebrow">VOTRE VITRINE</span><h2>Ajouter un produit</h2></div><button type="button" className="icon-btn" onClick={() => setShowProductForm(false)} aria-label="Fermer"><X size={19}/></button></div><p className="modal-note">Cette action modifie uniquement l’aperçu local de démonstration.</p><label>Nom du produit<input autoFocus value={productName} onChange={e => setProductName(e.target.value)} placeholder="Ex. Sac artisanal" required /></label><label>Prix indicatif en Pi<input value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Ex. 45" required /></label><div className="modal-actions"><button type="button" className="subtle-button" onClick={() => setShowProductForm(false)}>Annuler</button><button className="gold-button" type="submit">Ajouter le produit <ArrowRight size={15}/></button></div></form></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
    <div className="demo-ribbon"><span/> DÉMONSTRATION · DONNÉES FICTIVES</div>
  </div>;
}

function Metric({ icon: Icon, label, value, change, trend, note }) {
  return <article className="metric-card"><div className="metric-top"><span className="metric-icon"><Icon size={18}/></span><span className={'metric-change ' + trend}>{trend === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></article>;
}
function QuickLink({ icon: Icon, title, subtitle, onClick }) {
  return <button className="quick-link" onClick={onClick}><span className="quick-icon"><Icon size={18}/></span><span className="quick-copy"><strong>{title}</strong><small>{subtitle}</small></span><ArrowUpRight size={16} className="quick-arrow"/></button>;
}
function Showcase({ products, search, setSearch, onAdd, onProductClick }) {
  return <><section className="showcase-banner"><div><div className="eyebrow"><Store size={14}/> VITRINE ENTREPRISE</div><h2>Vos produits, votre signature.</h2><p>Un espace pour présenter ce que vous faites de mieux.</p></div><div className="showcase-banner-icon"><Package size={48}/></div></section><div className="section-heading product-heading"><div><h2>Catalogue produits</h2><p>{products.length} produit(s) dans cet aperçu</p></div><button className="gold-button" onClick={onAdd}><Plus size={16}/> Ajouter un produit</button></div><div className="catalog-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." /></div><button className="subtle-button" onClick={() => setSearch('')}>Tous les produits <ChevronDown size={15}/></button></div><div className="product-grid">{products.map((p) => <button className="product-card" key={p.id} onClick={() => onProductClick(p)}><div className={'product-art ' + p.tone}><span className="product-stamp">{p.mark}</span><span className="product-art-caption">OWO SELECT</span><div className="product-art-orbit"/></div><div className="product-info"><div><span className="product-category">{p.category}</span><h3>{p.name}</h3></div><strong className="product-price">{p.price}</strong></div><div className="product-meta"><span>{p.stock} en stock (démo)</span><span className="product-view">Voir <ArrowUpRight size={14}/></span></div></button>)}</div>{products.length === 0 && <div className="empty-state"><Package size={30}/><strong>Aucun résultat</strong><span>Essaie un autre mot-clé.</span></div>}<div className="disclaimer-line"><ShieldCheck size={15}/> Les produits et prix affichés sont fictifs. Aucun paiement n’est effectué.</div></>;
}
function SectionView({ active, onNavigate, notify }) {
  const copy = sectionCopy[active] || ['Bienvenue sur OWO', 'Retrouvez ici les outils de votre espace.'];
  const items = {
    'Back-office': [{icon:BriefcaseBusiness,title:'Vue opérationnelle',desc:'Suivi des activités de votre entreprise.'},{icon:Users,title:'Équipe & rôles',desc:'Préparation de la gestion des collaborateurs.'},{icon:Activity,title:'Indicateurs',desc:'Les chiffres clés au même endroit.'}],
    'Ordres & commandes': [{icon:ClipboardList,title:'Toutes les commandes',desc:'Liste, statut et historique des commandes.'},{icon:Package,title:'Préparation',desc:'Suivi de la préparation et de la livraison.'},{icon:Check,title:'Confirmation',desc:'Flux de validation à connecter.'}],
    'Clients': [{icon:Users,title:'Répertoire clients',desc:'Profils et coordonnées autorisées.'},{icon:Heart,title:'Fidélité',desc:'Suivi des relations commerciales.'},{icon:MessageCircle,title:'Conversations',desc:'Retrouver les échanges associés.'}],
    'Messagerie': [{icon:MessageCircle,title:'Messages privés',desc:'Conversations protégées entre membres.'},{icon:Bell,title:'Notifications',desc:'Événements importants de votre espace.'},{icon:ShieldCheck,title:'Confidentialité',desc:'Les accès seront contrôlés par compte.'}],
    'Réseau': [{icon:Globe2,title:'Découvrir les entreprises',desc:'Explorer les vitrines publiques.'},{icon:Users,title:'Communauté',desc:'Rencontrer des membres du réseau.'},{icon:Handshake,title:'Opportunités',desc:'Créer des liens professionnels.'}],
    'Banque': [{icon:Wallet,title:'Registre interne',desc:'Vue des mouvements internes de démonstration.'},{icon:TrendingUp,title:'Synthèse',desc:'Lecture des entrées et sorties enregistrées.'},{icon:ShieldCheck,title:'Sécurité financière',desc:'Aucun compte bancaire réel ou paiement n’est activé.'}],
    'Juridique': [{icon:FileText,title:'Documents',desc:'Classer les documents de votre entreprise.'},{icon:FileCheck2,title:'Contrats & échéances',desc:'Préparer le suivi documentaire.'},{icon:Sparkles,title:'Assistant juridique',desc:'Aide à l’information, à valider avant usage.'}],
    'Audit': [{icon:ShieldCheck,title:'Journal d’activité',desc:'Historique horodaté des actions.'},{icon:Activity,title:'Événements sensibles',desc:'Suivi des opérations nécessitant une traçabilité.'},{icon:FileText,title:'Exports',desc:'Préparation des rapports d’audit.'}],
    'Services': [{icon:Compass,title:'Explorer les services',desc:'Accéder aux outils disponibles dans le réseau.'},{icon:CircleHelp,title:'Guides & tutoriels',desc:'Apprendre à utiliser les fonctionnalités.'},{icon:Sparkles,title:'Nouveautés',desc:'Les prochains services OWO.'}],
  };
  return <><section className="section-hero"><div className="section-hero-icon"><Sparkles size={28}/></div><div><div className="eyebrow">L’UNIVERS OWO</div><h2>{copy[0]}</h2><p>{copy[1]}</p></div></section><div className="section-heading"><div><h2>Votre espace {active.toLowerCase()}</h2><p>Les modules sont préparés pour la prochaine phase d’intégration.</p></div><span className="phase-pill">Phase 1 · Interface</span></div><div className="module-grid">{(items[active] || []).map((item) => { const Icon = item.icon; return <article className="module-card" key={item.title}><div className="module-icon"><Icon size={21}/></div><h3>{item.title}</h3><p>{item.desc}</p><button className="text-button" onClick={() => notify('Ce module sera activé lors du raccordement aux services et aux données réels.')}>Ouvrir le module <ArrowRight size={15}/></button></article>; })}</div><section className="integration-note"><div className="integration-note-icon"><ShieldCheck size={20}/></div><div><strong>Connexion sécurisée en préparation</strong><p>{isSupabaseConfigured ? 'Les variables Supabase sont présentes. Les tables et politiques doivent encore être appliquées et les accès testés.' : 'Ajoutez les variables Supabase dans le fichier .env.local après avoir configuré le projet. Aucune clé secrète ne doit être publiée dans le navigateur.'}</p></div><button className="outline-gold-button" onClick={() => notify('Consultez le README pour les étapes de configuration.')}>Voir les étapes <ArrowRight size={15}/></button></section></>;
}

createRoot(document.getElementById('root')).render(<App />);