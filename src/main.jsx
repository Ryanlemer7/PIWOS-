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
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyRole, setCompanyRole] = useState('');
  const [companyReady, setCompanyReady] = useState(!isSupabaseConfigured);
  const [companyName, setCompanyName] = useState('');
  const [companyCountry, setCompanyCountry] = useState('Niger');
  const [workspaceError, setWorkspaceError] = useState('');
  const [workspaceReload, setWorkspaceReload] = useState(0);
  const [orders, setOrders] = useState(initialOrders);
  const [dataBusy, setDataBusy] = useState(false);
  const displayName = session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0] || 'Membre';
  const initials = displayName.split(/[\\s._-]+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || 'OW';

  React.useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) notify('Impossible de lire la session : ' + error.message);
      setSession(data?.session || null);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setAuthReady(true);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!isSupabaseConfigured || !session?.user?.id) {
      setCompany(null);
      setCompanyRole('');
      setCompanyReady(true);
      setWorkspaceError('');
      return;
    }
    let cancelled = false;
    setCompanyReady(false);
    setWorkspaceError('');
    const loadCompany = async () => {
      const { data, error } = await supabase.from('company_members')
        .select('company_id, role, companies(id, public_name, legal_name, company_code, description, contact_email)')
        .eq('user_id', session.user.id).order('joined_at', { ascending: true }).limit(1).maybeSingle();
      if (cancelled) return;
      if (error) {
        setWorkspaceError(error.message);
        setCompany(null);
      } else {
        setCompany(data?.companies || null);
        setCompanyRole(data?.role || '');
      }
      setCompanyReady(true);
    };
    loadCompany();
    return () => { cancelled = true; };
  }, [session?.user?.id, workspaceReload]);

  React.useEffect(() => {
    if (!isSupabaseConfigured || !session?.user?.id || !company?.id) return;
    let cancelled = false;
    setDataBusy(true);
    const loadWorkspaceData = async () => {
      const [productResult, orderResult] = await Promise.all([
        supabase.from('products').select('id, name, description, category, price_amount, price_currency, stock_quantity, image_url, is_published')
          .eq('company_id', company.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('id, order_number, customer_name, status, currency, total_amount, created_at')
          .eq('company_id', company.id).order('created_at', { ascending: false }).limit(6)
      ]);
      if (cancelled) return;
      if (productResult.error) {
        setWorkspaceError('Chargement des produits impossible : ' + productResult.error.message);
      } else {
        setProducts((productResult.data || []).map(product => ({
          id: product.id, name: product.name, category: product.category || 'Général',
          price: Number(product.price_amount).toLocaleString('fr-FR') + ' ' + (product.price_currency === 'PI' ? 'π' : product.price_currency),
          stock: product.stock_quantity, tone: ['rose', 'sand', 'blue'][product.name.length % 3],
          mark: product.name.slice(0, 1).toUpperCase(), description: product.description || '',
          image_url: product.image_url, is_published: product.is_published
        })));
      }
      if (orderResult.error) {
        setWorkspaceError(current => current || ('Chargement des commandes impossible : ' + orderResult.error.message));
      } else {
        setOrders((orderResult.data || []).map(order => ({
          id: '#OW-' + order.order_number, name: order.customer_name,
          detail: new Date(order.created_at).toLocaleDateString('fr-FR') + ' · ' + order.status,
          total: Number(order.total_amount),
          amount: Number(order.total_amount).toLocaleString('fr-FR') + ' ' + (order.currency === 'PI' ? 'π' : order.currency),
          status: ({ pending: 'À confirmer', confirmed: 'Confirmée', preparing: 'En préparation', shipped: 'Expédiée', completed: 'Terminée', cancelled: 'Annulée' })[order.status] || order.status,
          color: ({ pending: 'gold', confirmed: 'blue', preparing: 'blue', shipped: 'green', completed: 'green', cancelled: 'gold' })[order.status] || 'gold'
        })));
      }
      setDataBusy(false);
    };
    loadWorkspaceData();
    return () => { cancelled = true; };
  }, [session?.user?.id, company?.id]);

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
  const submitAuth = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured) return;
    setAuthBusy(true);
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword, options: { data: { display_name: authName.trim() } } });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          notify('Compte créé. Bienvenue sur OWO.');
        } else {
          notify('Compte créé. Consulte ta boîte mail pour confirmer ton adresse avant de te connecter.');
          setAuthMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
        if (error) throw error;
        setSession(data.session);
        notify('Connexion réussie.');
      }
    } catch (error) {
      notify(error.message || 'La connexion a échoué.');
    } finally { setAuthBusy(false); }
  };
  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) notify('Déconnexion impossible : ' + error.message);
    else { setSession(null); setCompany(null); setCompanyReady(true); notify('Tu es déconnecté.'); }
  };
  const createCompany = async (event) => {
    event.preventDefault();
    if (!session?.user?.id || !companyName.trim()) return;
    setAuthBusy(true); setWorkspaceError('');
    try {
      const { data: newCompany, error: companyError } = await supabase.from('companies').insert({
        legal_name: companyName.trim(), public_name: companyName.trim(),
        registration_country: companyCountry, created_by: session.user.id
      }).select('id, public_name, legal_name, company_code, description, contact_email').single();
      if (companyError) throw companyError;
      const { error: memberError } = await supabase.from('company_members').insert({ company_id: newCompany.id, user_id: session.user.id, role: 'owner' });
      if (memberError) throw memberError;
      setCompany(newCompany); setCompanyRole('owner'); setCompanyName('');
      notify('Ton espace entreprise est créé.');
    } catch (error) { setWorkspaceError(error.message || 'La création de l’entreprise a échoué.'); }
    finally { setAuthBusy(false); }
  };
  const addProduct = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice.trim()) return;
    const amount = Number(productPrice.trim().replace(/π/gi, '').replace(/\\s/g, '').replace(',', '.'));
    if (!Number.isFinite(amount) || amount < 0) { notify('Entre un prix valide, par exemple 45 ou 45,50.'); return; }
    if (isSupabaseConfigured && session?.user?.id && company?.id) {
      setDataBusy(true);
      const { data, error } = await supabase.from('products').insert({
        company_id: company.id, name: productName.trim(), category: 'Général',
        price_amount: amount, price_currency: 'PI', stock_quantity: 1,
        is_published: true, created_by: session.user.id
      }).select('id, name, description, category, price_amount, price_currency, stock_quantity, image_url, is_published').single();
      setDataBusy(false);
      if (error) { notify('Produit non enregistré : ' + error.message); return; }
      setProducts(prev => [{
        id: data.id, name: data.name, category: data.category || 'Général',
        price: Number(data.price_amount).toLocaleString('fr-FR') + ' π', stock: data.stock_quantity,
        tone: ['rose', 'sand', 'blue'][data.name.length % 3], mark: data.name.slice(0, 1).toUpperCase(),
        description: data.description || '', image_url: data.image_url, is_published: data.is_published
      }, ...prev]);
      notify('Produit enregistré dans Supabase.');
    } else {
      setProducts(prev => [{ id: Date.now(), name: productName.trim(), category: 'Nouveau produit', price: amount.toLocaleString('fr-FR') + ' π', stock: 1, tone: 'sand', mark: productName.trim().slice(0,1).toUpperCase() }, ...prev]);
      notify('Produit ajouté à l’aperçu de démonstration.');
    }
    setProductName(''); setProductPrice(''); setShowProductForm(false);
  };
  const selectNav = (id) => { setActive(id); setMobileOpen(false); setSearch(''); };

  if (isSupabaseConfigured && !authReady) return <LoadingScreen message="Préparation de votre espace OWO…" />;
  if (isSupabaseConfigured && authReady && !session) return <AuthScreen mode={authMode} setMode={setAuthMode} email={authEmail} setEmail={setAuthEmail} password={authPassword} setPassword={setAuthPassword} name={authName} setName={setAuthName} busy={authBusy} feedback={toast} onSubmit={submitAuth} />;
  if (isSupabaseConfigured && session && !companyReady) return <LoadingScreen message="Chargement de votre espace entreprise…" />;
  if (isSupabaseConfigured && session && companyReady && workspaceError && !company) return <WorkspaceError message={workspaceError} onRetry={() => { setWorkspaceError(''); setCompanyReady(false); setWorkspaceReload(value => value + 1); }} onSignOut={signOut} />;
  if (isSupabaseConfigured && session && companyReady && !company) return <CompanySetup name={companyName} setName={setCompanyName} country={companyCountry} setCountry={setCompanyCountry} busy={authBusy} error={workspaceError} onSubmit={createCompany} onSignOut={signOut} />;

  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileOpen ? 'sidebar-open' : '')}>
      <div className="brand-lockup">
        <div className="brand-symbol">O</div>
        <div><div className="brand-name">OWO<span>.</span></div><div className="brand-tag">ÉCONOMIE EN RÉSEAU</div></div>
        <button className="icon-btn sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu"><X size={18}/></button>
      </div>
      <button className="workspace-switch" onClick={() => notify('Sélecteur d’espace : connexion Supabase à configurer.')}>
        <div className="workspace-avatar">{(company?.public_name || "O").slice(0, 1).toUpperCase()}</div><div className="workspace-text"><strong>{company?.public_name || "Espace de démonstration"}</strong><span>{companyRole ? "Rôle : " + companyRole : "Espace entreprise"}</span></div><ChevronDown size={16}/>
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
          <div className="user-avatar">{initials}</div><div className="user-meta"><strong>{displayName}</strong><span>{companyRole || "Membre OWO"}</span></div>
          <button className="icon-btn" onClick={() => setProfileMenu(!profileMenu)} aria-label="Menu du profil"><MoreHorizontal size={19}/></button>
          {profileMenu && <div className="profile-popover"><button onClick={() => notify(session?.user?.email || "Profil utilisateur")}><Users size={15}/> Mon profil</button><button onClick={signOut}><LogOut size={15}/> Déconnexion</button></div>}
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
          <button className="top-user" onClick={() => setProfileMenu(!profileMenu)}><span className="user-avatar small">{initials}</span><ChevronDown size={15}/></button>
        </div>
      </header>

      <div className="content-wrap">
        <div className="welcome-row">
          <div><div className="eyebrow"><Sparkles size={14}/> VOTRE UNIVERS, VOS OPPORTUNITÉS</div>
            <h1>{active === 'Accueil' ? <>Bonjour, {displayName} <span className="wave">✦</span></> : sectionCopy[active]?.[0] || active}</h1>
            <p className="page-subtitle">{active === 'Accueil' ? 'Voici ce qui se passe dans votre univers aujourd’hui.' : sectionCopy[active]?.[1]}</p>
          </div>
          <div className="date-chip"><span className="date-dot"/><span>{isSupabaseConfigured && session ? "ESPACE CONNECTÉ" : "ESPACE DÉMO"}</span><ChevronDown size={14}/></div>
        </div>

        {active === 'Accueil' ? <>
          <section className="hero-banner">
            <div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> L’ÉCONOMIE EN MOUVEMENT</div><h2>Un seul espace.<br/><em>Mille possibilités.</em></h2><p>Connectez votre activité, votre réseau et vos opportunités. Tout commence ici.</p><button className="gold-button" onClick={() => selectNav('Showcase')}>Explorer mon espace <ArrowRight size={16}/></button></div>
            <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="orbit-dot dot-one"/><div className="orbit-dot dot-two"/><Coin/><div className="art-caption"><span>OWO</span><small>BUILD · CONNECT · GROW</small></div></div>
            <div className="hero-index">01 <span>/ 03</span></div>
          </section>

          <div className="section-heading"><div><h2>Vue d’ensemble</h2><p>Les indicateurs de votre activité</p></div><button className="subtle-button" onClick={() => notify('Les indicateurs affichés sont des données de démonstration.')}>Cette semaine <ChevronDown size={15}/></button></div>
          <section className="metric-grid">
            <Metric icon={ShoppingBag} label="Commandes chargées" value={isSupabaseConfigured && company ? String(orders.length) : "128"} change={isSupabaseConfigured && company ? "Supabase" : "+12,8%"} trend="up" note={isSupabaseConfigured && company ? "6 dernières maximum" : "données de démonstration"}/>
            <Metric icon={Users} label="Clients récents" value={isSupabaseConfigured && company ? String(new Set(orders.map(order => order.name)).size) : "34"} change={isSupabaseConfigured && company ? "Commandes" : "+8,2%"} trend="up" note={isSupabaseConfigured && company ? "d’après les commandes" : "données de démonstration"}/>
            <Metric icon={Coins} label="Volume chargé" value={isSupabaseConfigured && company ? orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString("fr-FR") + " π" : "2 840 π"} change={isSupabaseConfigured && company ? "Commandes" : "+5,4%"} trend="up" note={isSupabaseConfigured && company ? "sur les commandes chargées" : "registre interne démo"}/>
            <Metric icon={Activity} label="Visites vitrine" value={isSupabaseConfigured && company ? "—" : "1 204"} change={isSupabaseConfigured && company ? "À connecter" : "-2,1%"} trend="down" note={isSupabaseConfigured && company ? "statistiques non activées" : "données de démonstration"}/>
          </section>

          <div className="dashboard-grid">
            <section className="panel orders-panel">
              <div className="panel-heading"><div><h3>Commandes récentes</h3><p>Suivez les dernières opérations</p></div><button className="text-button" onClick={() => selectNav('Ordres & commandes')}>Tout voir <ArrowRight size={15}/></button></div>
              <div className="order-list">{orders.map(order => <div className="order-row" key={order.id}><div className="order-icon"><ShoppingBag size={17}/></div><div className="order-main"><strong>{order.name}</strong><span>{order.id} · {order.detail}</span></div><div className="order-end"><strong>{order.amount}</strong><span className={'status status-' + order.color}><i/>{order.status}</span></div></div>)}</div>
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

    {showProductForm && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowProductForm(false); }}><form className="modal" onSubmit={addProduct}><div className="modal-header"><div><span className="eyebrow">VOTRE VITRINE</span><h2>Ajouter un produit</h2></div><button type="button" className="icon-btn" onClick={() => setShowProductForm(false)} aria-label="Fermer"><X size={19}/></button></div><p className="modal-note">{isSupabaseConfigured && session && company ? "Le produit sera enregistré dans la base de données de votre entreprise." : "Cette action modifie uniquement l’aperçu local de démonstration."}</p><label>Nom du produit<input autoFocus value={productName} onChange={e => setProductName(e.target.value)} placeholder="Ex. Sac artisanal" required /></label><label>Prix indicatif en Pi<input value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Ex. 45" required /></label><div className="modal-actions"><button type="button" className="subtle-button" onClick={() => setShowProductForm(false)}>Annuler</button><button className="gold-button" type="submit">Ajouter le produit <ArrowRight size={15}/></button></div></form></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
    <div className="demo-ribbon"><span/> {isSupabaseConfigured && session && company ? "OWO · ESPACE CONNECTÉ" : "DÉMONSTRATION · DONNÉES FICTIVES"}</div>
  </div>;
}

function Metric({ icon: Icon, label, value, change, trend, note }) {
  return <article className="metric-card"><div className="metric-top"><span className="metric-icon"><Icon size={18}/></span><span className={'metric-change ' + trend}>{trend === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></article>;
}
function QuickLink({ icon: Icon, title, subtitle, onClick }) {
  return <button className="quick-link" onClick={onClick}><span className="quick-icon"><Icon size={18}/></span><span className="quick-copy"><strong>{title}</strong><small>{subtitle}</small></span><ArrowUpRight size={16} className="quick-arrow"/></button>;
}
function Showcase({ products, search, setSearch, onAdd, onProductClick }) {
  return <><section className="showcase-banner"><div><div className="eyebrow"><Store size={14}/> VITRINE ENTREPRISE</div><h2>Vos produits, votre signature.</h2><p>Un espace pour présenter ce que vous faites de mieux.</p></div><div className="showcase-banner-icon"><Package size={48}/></div></section><div className="section-heading product-heading"><div><h2>Catalogue produits</h2><p>{products.length} produit(s) dans cet aperçu</p></div><button className="gold-button" onClick={onAdd}><Plus size={16}/> Ajouter un produit</button></div><div className="catalog-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." /></div><button className="subtle-button" onClick={() => setSearch('')}>Tous les produits <ChevronDown size={15}/></button></div><div className="product-grid">{products.map((p) => <button className="product-card" key={p.id} onClick={() => onProductClick(p)}><div className={'product-art ' + p.tone}><span className="product-stamp">{p.mark}</span><span className="product-art-caption">OWO SELECT</span><div className="product-art-orbit"/></div><div className="product-info"><div><span className="product-category">{p.category}</span><h3>{p.name}</h3></div><strong className="product-price">{p.price}</strong></div><div className="product-meta"><span>{p.stock} en stock{p.is_published === undefined ? " (démo)" : ""}</span><span className="product-view">Voir <ArrowUpRight size={14}/></span></div></button>)}</div>{products.length === 0 && <div className="empty-state"><Package size={30}/><strong>Aucun résultat</strong><span>Essaie un autre mot-clé.</span></div>}<div className="disclaimer-line"><ShieldCheck size={15}/> Les produits et prix affichés sont fictifs. Aucun paiement n’est effectué.</div></>;
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


function LoadingScreen({ message }) {
  return <main className="auth-screen"><section className="auth-card"><div className="auth-brand"><div className="brand-symbol">O</div><div><div className="brand-name">OWO<span>.</span></div><div className="brand-tag">ÉCONOMIE EN RÉSEAU</div></div></div><div className="auth-loading"><span className="loading-spinner"/><p>{message}</p></div></section></main>;
}
function AuthScreen({ mode, setMode, email, setEmail, password, setPassword, name, setName, busy, feedback, onSubmit }) {
  return <main className="auth-screen"><section className="auth-card">
    <div className="auth-brand"><div className="brand-symbol">O</div><div><div className="brand-name">OWO<span>.</span></div><div className="brand-tag">ÉCONOMIE EN RÉSEAU</div></div></div>
    <div className="auth-eyebrow">VOTRE UNIVERS, VOS OPPORTUNITÉS</div><h1>{mode === 'signup' ? 'Créez votre compte.' : 'Ravi de vous revoir.'}</h1>
    <p className="auth-intro">{mode === 'signup' ? 'Rejoignez OWO et préparez votre espace professionnel.' : 'Connectez-vous pour retrouver votre espace entreprise et vos données.'}</p>
    {feedback && <div className="auth-feedback" role="status">{feedback}</div>}
    <form className="auth-form" onSubmit={onSubmit}>
      {mode === 'signup' && <label>Nom affiché<input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" autoComplete="name" required /></label>}
      <label>Adresse e-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" required /></label>
      <label>Mot de passe<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8 caractères minimum" minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required /></label>
      <button className="gold-button auth-submit" type="submit" disabled={busy}>{busy ? 'Patientez…' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'} <ArrowRight size={16}/></button>
    </form>
    <p className="auth-switch">{mode === 'signup' ? 'Vous avez déjà un compte ?' : 'Vous découvrez OWO ?'} <button type="button" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>{mode === 'signup' ? 'Se connecter' : 'Créer un compte'}</button></p>
    <div className="auth-security"><ShieldCheck size={16}/><span>Connexion gérée par Supabase Auth. Les droits d’accès restent contrôlés par la base de données.</span></div>
  </section></main>;
}
function CompanySetup({ name, setName, country, setCountry, busy, error, onSubmit, onSignOut }) {
  return <main className="auth-screen"><section className="auth-card">
    <div className="auth-brand"><div className="brand-symbol">O</div><div><div className="brand-name">OWO<span>.</span></div><div className="brand-tag">ESPACE ENTREPRISE</div></div></div>
    <div className="auth-eyebrow">PREMIÈRE ÉTAPE</div><h1>Créons votre espace.</h1><p className="auth-intro">Cet espace vous permettra de gérer votre vitrine, vos produits et vos commandes. Vous en serez le propriétaire.</p>
    {error && <div className="auth-error">{error}</div>}
    <form className="auth-form" onSubmit={onSubmit}>
      <label>Nom de l’entreprise<input value={name} onChange={e => setName(e.target.value)} placeholder="Ex. AMAD HOUSE" required minLength={2}/></label>
      <label>Pays d’enregistrement<select value={country} onChange={e => setCountry(e.target.value)}><option>Niger</option><option>Burkina Faso</option><option>Bénin</option><option>Côte d’Ivoire</option><option>Togo</option><option>Sénégal</option><option>Mali</option><option>Autre</option></select></label>
      <button className="gold-button auth-submit" type="submit" disabled={busy}>{busy ? 'Création…' : 'Créer mon espace'} <ArrowRight size={16}/></button>
    </form><button className="auth-logout" onClick={onSignOut}>Se déconnecter</button>
  </section></main>;
}
function WorkspaceError({ message, onRetry, onSignOut }) {
  return <main className="auth-screen"><section className="auth-card">
    <div className="auth-brand"><div className="brand-symbol">O</div><div><div className="brand-name">OWO<span>.</span></div><div className="brand-tag">ESPACE ENTREPRISE</div></div></div>
    <div className="auth-error"><strong>Impossible de charger votre espace.</strong><p>{message}</p><small>Vérifiez que la migration OWO a été appliquée au projet Supabase configuré et que les politiques RLS sont actives.</small></div>
    <div className="auth-actions"><button className="gold-button" onClick={onRetry}>Réessayer <ArrowRight size={16}/></button><button className="subtle-button" onClick={onSignOut}>Se déconnecter</button></div>
  </section></main>;
}

createRoot(document.getElementById('root')).render(<App />);