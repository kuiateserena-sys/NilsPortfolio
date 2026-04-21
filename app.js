/**
 * Portfolio OTELE Nils — logique centralisée
 * --------------------------------------------------
 * CONFIG : chemins, liens sociaux, Formspree, phrases typing.
 * Traduire : objet TRANSLATIONS (clés = attributs data-i18n du HTML).
 */

(function () {
  'use strict';

  /* ========== CONFIG ========== */
  const CONFIG = {
    /** Photo présente à la racine du projet (modifiable si tu déplaces le fichier) */
    HERO_PHOTO_PATH: 'photo.jpeg',
    /** PDF CV : place ton fichier dans assets/cv.pdf */
    CV_PATH: 'assets/cv.pdf',
    /** Remplace par ton profil GitHub */
    GITHUB_URL: 'https://github.com/',
    /** Placeholders réseaux — remplace # par tes URLs */
    FACEBOOK_URL: '#',
    LINKEDIN_URL: '#',
    /**
     * Formspree ou autre endpoint POST (vide = message + option mailto)
     * Ex. 'https://formspree.io/f/abcdwxyz'
     */
    FORM_ENDPOINT: '',
    /** Phrases affichées en effet « typing » dans le hero */
    TYPING_PHRASES_FR: [
      'Je conçois des interfaces web modernes et soignées.',
      'Code, design et vidéo : une approche créative complète.',
      'Objectif : des expériences numériques claires et mémorables.',
      'Disponible pour vos sites, landing pages et supports visuels.',
    ],
    TYPING_PHRASES_EN: [
      'I craft modern, polished web interfaces.',
      'Code, design & video: a full creative approach.',
      'Goal: clear, memorable digital experiences.',
      'Available for websites, landing pages and visual assets.',
    ],
    TYPING_SPEED_MS: 42,
    TYPING_PAUSE_MS: 2200,
    SCROLL_NAV_ACTIVE_OFFSET: 120,
  };

  const STORAGE_KEY = 'portfolio-lang';
  let currentLang = 'fr';
  let typingTimer = null;
  let typingPhraseIndex = 0;
  let typingCharIndex = 0;
  let typingDeleting = false;
  let prefersReducedMotion = false;

  /** Clés i18n : même libellé que data-i18n dans index.html */
  const TRANSLATIONS = {
    fr: {
      'loader.text': 'Chargement',
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.skills': 'Compétences',
      'nav.projects': 'Projets',
      'nav.services': 'Services',
      'nav.contact': 'Contact',
      'nav.hobbies': 'Passions',
      'hero.eyebrow': 'Étudiant en Génie Logiciel',
      'hero.level': 'Niveau 1 — IUGET',
      'hero.taglineFallback': 'Je transforme des idées en expériences numériques claires et soignées.',
      'hero.ctaProjects': 'Voir mes projets',
      'hero.ctaCv': 'Télécharger CV',
      'hero.ctaContact': 'Me contacter',
      'hero.badge1': 'UI futuriste',
      'hero.badge2': 'Front-end',
      'hero.badge3': 'Créatif & rigoureux',
      'hero.stat1': 'Projets',
      'hero.stat2': 'Services',
      'hero.stat3': 'Disponibilité',
      'hero.stat3val': 'Freelance',
      'about.title': 'À propos',
      'about.kicker': 'Profil & mindset',
      'about.lead': 'Hybride : ingénierie logicielle, design d’interface et narration visuelle.',
      'about.h1': 'Analyse',
      'about.h1d': 'Découper les problèmes pour des solutions claires et mesurables.',
      'about.h2': 'Création',
      'about.h2d': 'Des interfaces qui donnent envie d’explorer et de comprendre.',
      'about.h3': 'Impact',
      'about.h3d': 'Des livrables utiles pour les vrais utilisateurs — pas du décor.',
      'skills.kicker': 'Stack & outils',
      'skills.lead': 'Les barres progressent au scroll : compétences vivantes, jamais figées.',
      'projects.kicker': 'Réalisations',
      'projects.lead': 'Ouvrez une carte pour lire le détail et déclencher une prise de contact.',
      'services.kicker': 'Offre pro',
      'services.lead': 'Des formats clairs — du site vitrine au montage — pour avancer vite sans sacrifier le style.',
      'contact.kicker': 'Lien direct',
      'contact.lead': 'Priorité aux réponses rapides sur WhatsApp ou email professionnel.',
      'contact.ctaTitle': 'Un brief ou une idée ?',
      'contact.ctaText': 'Expliquez votre besoin en quelques lignes : proposition d’un créneau d’échange sous 48h.',
      'contact.ctaBtn': 'Écrire maintenant',
      'about.p1':
        'Étudiant en génie logiciel, je combine un esprit analytique et une approche perspicace des problèmes pour concevoir des solutions numériques utiles et agréables à utiliser.',
      'about.p2':
        'Passionné par la technologie et la création digitale, je m’intéresse autant au code qu’au design et à la façon dont une interface raconte une histoire et guide l’utilisateur.',
      'about.p3':
        'En quête constante d’apprentissage, je valorise le travail rigoureux, la communication claire et l’impact concret des projets sur les personnes qui les utilisent.',
      'skills.title': 'Compétences',
      'projects.title': 'Projets',
      'projects.library.title': 'Mini bibliothèque',
      'projects.currency.title': 'Convertisseur de devises',
      'projects.calculator.title': 'Mini calculatrice',
      'projects.hotel.title': 'Landing page hôtel',
      'projects.elearning.title': 'Mini site e-learning',
      'projects.orbe.title': 'Carte de visite ORBE.FI',
      'projects.flyers.title': 'Flyers hôtel Palais des Princesses',
      'projects.videos.title': 'Vidéos publicitaires',
      'projects.library.desc':
        'Application de gestion de livres : ajout, recherche et parcours simple d’une petite collection — focus sur la structure et l’ergonomie.',
      'projects.currency.desc':
        'Outil de conversion de devises avec mise à jour des montants et interface épurée pour tester des interactions JavaScript.',
      'projects.calculator.desc':
        'Calculatrice web minimaliste : opérations de base, gestion des erreurs et design lisible sur mobile.',
      'projects.hotel.desc':
        'Landing page pour un établissement : sections hero, services et appel à l’action, mise en page responsive.',
      'projects.elearning.desc':
        'Micro-plateforme d’apprentissage : navigation par modules et présentation de contenus pédagogiques.',
      'projects.orbe.desc':
        'Identité ORBE.FI : carte de visite numérique et déclinaisons graphiques cohérentes avec la marque.',
      'projects.flyers.desc':
        'Création de flyers pour l’hôtel Palais des Princesses : hiérarchie visuelle, typographie et tonalité premium.',
      'projects.videos.desc':
        'Montages publicitaires courts : rythme, transitions et habillage pour la promotion sur les réseaux.',
      'services.title': 'Services freelance',
      'services.web.title': 'Développement site web',
      'services.web.desc':
        'Sites vitrines et pages structurées, responsive et soignées pour votre présence en ligne.',
      'services.landing.title': 'Landing pages',
      'services.landing.desc':
        'Pages d’atterrissage orientées conversion, message clair et appel à l’action visible.',
      'services.graphic.title': 'Design graphique',
      'services.graphic.desc':
        'Flyers, cartes de visite et supports visuels cohérents avec votre image de marque.',
      'services.video.title': 'Montage vidéo',
      'services.video.desc':
        'Montage dynamique pour pubs, réseaux sociaux et présentations courtes impactantes.',
      'services.miniapp.title': 'Mini applications web',
      'services.miniapp.desc':
        'Petits outils interactifs (calcul, conversion, gestion légère) adaptés à vos besoins.',
      'services.cta': 'Demander un service',
      'contact.title': 'Contact',
      'contact.emailLabel': 'Email',
      'contact.whatsapp': 'WhatsApp — +237 652 757 240',
      'contact.facebook': 'Facebook (lien à compléter)',
      'contact.linkedin': 'LinkedIn (lien à compléter)',
      'contact.github': 'GitHub',
      'hobbies.kicker': 'Équilibre',
      'hobbies.lead': 'Sport, lecture et voyages : de quoi garder curiosité et énergie dans les projets.',
      'hobbies.title': 'Passions',
      'hobbies.football': 'Football',
      'hobbies.basketball': 'Basketball',
      'hobbies.reading': 'Lecture',
      'hobbies.travel': 'Voyage',
      'footer.rights': 'Tous droits réservés.',
      'footer.yearLabel': 'Année',
      'footer.emailShort': '@',
      'modal.close': 'Fermer',
      'modal.consult': 'Consulter le projet',
      'form.title': 'Demande',
      'form.titleProject': 'Demande liée au projet',
      'form.titleService': 'Demande de service',
      'form.hint': 'Remplissez tous les champs. Je vous répondrai dès que possible.',
      'form.name': 'Nom',
      'form.email': 'Email',
      'form.subject': 'Objet',
      'form.message': 'Message',
      'form.submit': 'Envoyer la demande',
      'form.back': 'Retour',
      'form.sending': 'Envoi en cours…',
      'form.success': 'Message envoyé. Merci !',
      'form.error': 'Impossible d’envoyer. Réessaie ou contacte-moi par email.',
      'form.configNeeded': 'Configure FORM_ENDPOINT dans js/app.js (ex. Formspree) pour activer l’envoi en ligne.',
      'form.subjectProjectPrefix': 'Projet : ',
      'form.subjectServicePrefix': 'Service : ',
    },
    en: {
      'loader.text': 'Loading',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.services': 'Services',
      'nav.contact': 'Contact',
      'nav.hobbies': 'Hobbies',
      'hero.eyebrow': 'Software Engineering Student',
      'hero.level': 'Year 1 — IUGET',
      'hero.taglineFallback': 'I turn ideas into clear, polished digital experiences.',
      'hero.ctaProjects': 'View my projects',
      'hero.ctaCv': 'Download CV',
      'hero.ctaContact': 'Contact me',
      'hero.badge1': 'Futuristic UI',
      'hero.badge2': 'Front-end',
      'hero.badge3': 'Creative & rigorous',
      'hero.stat1': 'Projects',
      'hero.stat2': 'Services',
      'hero.stat3': 'Availability',
      'hero.stat3val': 'Freelance',
      'about.title': 'About',
      'about.kicker': 'Profile & mindset',
      'about.lead': 'A hybrid path: software engineering, UI design, and visual storytelling.',
      'about.h1': 'Analysis',
      'about.h1d': 'Breaking problems down into clear, measurable solutions.',
      'about.h2': 'Creation',
      'about.h2d': 'Interfaces people actually want to explore and understand.',
      'about.h3': 'Impact',
      'about.h3d': 'Useful deliverables for real users — not just pretty mockups.',
      'skills.kicker': 'Stack & tools',
      'skills.lead': 'Bars animate on scroll: skills as something alive, not frozen.',
      'projects.kicker': 'Work',
      'projects.lead': 'Open a card for details and to start a conversation.',
      'services.kicker': 'Offer',
      'services.lead': 'Clear formats — from showcase sites to video — move fast without cheap looks.',
      'contact.kicker': 'Direct line',
      'contact.lead': 'Fast replies on WhatsApp or professional email.',
      'contact.ctaTitle': 'A brief or an idea?',
      'contact.ctaText': 'Describe your need in a few lines — I’ll suggest a time to talk within 48h.',
      'contact.ctaBtn': 'Email me now',
      'about.p1':
        'As a software engineering student, I combine analytical thinking with a sharp eye for problems to build digital solutions that are useful and pleasant to use.',
      'about.p2':
        'Passionate about technology and digital creation, I care as much about code as design and how an interface tells a story and guides the user.',
      'about.p3':
        'Always learning, I value rigor, clear communication, and the concrete impact of projects on the people who use them.',
      'skills.title': 'Skills',
      'projects.title': 'Projects',
      'projects.library.title': 'Mini library',
      'projects.currency.title': 'Currency converter',
      'projects.calculator.title': 'Mini calculator',
      'projects.hotel.title': 'Hotel landing page',
      'projects.elearning.title': 'Mini e-learning site',
      'projects.orbe.title': 'ORBE.FI business card',
      'projects.flyers.title': 'Palais des Princesses hotel flyers',
      'projects.videos.title': 'Promotional videos',
      'projects.library.desc':
        'Book management mini-app: add, search and browse a small collection — focus on structure and UX.',
      'projects.currency.desc':
        'Currency conversion tool with clean UI to practice JavaScript interactions.',
      'projects.calculator.desc':
        'Minimal web calculator: basic operations, error handling, mobile-friendly layout.',
      'projects.hotel.desc':
        'Hotel landing page: hero, services and call-to-action in a responsive layout.',
      'projects.elearning.desc':
        'Micro learning platform: module navigation and presentation of learning content.',
      'projects.orbe.desc':
        'ORBE.FI identity: digital business card and graphic variations aligned with the brand.',
      'projects.flyers.desc':
        'Flyers for Palais des Princesses hotel: visual hierarchy, typography and premium tone.',
      'projects.videos.desc':
        'Short promotional edits: pacing, transitions and polish for social promotion.',
      'services.title': 'Freelance services',
      'services.web.title': 'Website development',
      'services.web.desc': 'Showcase sites and structured, responsive pages for your online presence.',
      'services.landing.title': 'Landing pages',
      'services.landing.desc': 'Conversion-focused landing pages with a clear message and visible CTA.',
      'services.graphic.title': 'Graphic design',
      'services.graphic.desc': 'Flyers, business cards and visuals consistent with your brand.',
      'services.video.title': 'Video editing',
      'services.video.desc': 'Dynamic editing for ads, social media and impactful short pieces.',
      'services.miniapp.title': 'Mini web applications',
      'services.miniapp.desc': 'Small interactive tools (calc, conversion, light management) tailored to you.',
      'services.cta': 'Request a service',
      'contact.title': 'Contact',
      'contact.emailLabel': 'Email',
      'contact.whatsapp': 'WhatsApp — +237 652 757 240',
      'contact.facebook': 'Facebook (link TBD)',
      'contact.linkedin': 'LinkedIn (link TBD)',
      'contact.github': 'GitHub',
      'hobbies.kicker': 'Balance',
      'hobbies.lead': 'Sports, reading, travel — curiosity and energy for creative work.',
      'hobbies.title': 'Hobbies',
      'hobbies.football': 'Football',
      'hobbies.basketball': 'Basketball',
      'hobbies.reading': 'Reading',
      'hobbies.travel': 'Travel',
      'footer.rights': 'All rights reserved.',
      'footer.yearLabel': 'Year',
      'footer.emailShort': '@',
      'modal.close': 'Close',
      'modal.consult': 'View project',
      'form.title': 'Request',
      'form.titleProject': 'Project inquiry',
      'form.titleService': 'Service request',
      'form.hint': 'Fill in all fields. I will get back to you as soon as possible.',
      'form.name': 'Name',
      'form.email': 'Email',
      'form.subject': 'Subject',
      'form.message': 'Message',
      'form.submit': 'Send request',
      'form.back': 'Back',
      'form.sending': 'Sending…',
      'form.success': 'Message sent. Thank you!',
      'form.error': 'Could not send. Try again or email me directly.',
      'form.configNeeded': 'Set FORM_ENDPOINT in js/app.js (e.g. Formspree) to enable online delivery.',
      'form.subjectProjectPrefix': 'Project: ',
      'form.subjectServicePrefix': 'Service: ',
    },
  };

  const SERVICE_LABEL_KEYS = {
    web: 'services.web.title',
    landing: 'services.landing.title',
    graphic: 'services.graphic.title',
    video: 'services.video.title',
    miniapp: 'services.miniapp.title',
  };

  function t(key) {
    const bundle = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
    return bundle[key] !== undefined ? bundle[key] : (TRANSLATIONS.fr[key] !== undefined ? TRANSLATIONS.fr[key] : key);
  }

  function setLang(lang) {
    if (lang !== 'fr' && lang !== 'en') return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll('#lang-fr, #lang-en').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    restartTyping();
    if (state.open && state.mode === 'project' && state.projectId) {
      fillProjectModal(state.projectId);
    }
    updateModalCloseLabel();
  }

  function updateModalCloseLabel() {
    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      var label = t('modal.close');
      closeBtn.setAttribute('aria-label', label);
      closeBtn.setAttribute('title', label);
    }
  }

  /* ========== Éléments DOM fréquents ========== */
  const elLoader = document.getElementById('page-loader');
  const elHeader = document.querySelector('.site-header');
  const elNavToggle = document.getElementById('nav-toggle');
  const elNavMenu = document.getElementById('nav-menu');
  const elScrollProgress = document.getElementById('scroll-progress');
  const elHeroPhoto = document.getElementById('hero-photo');
  const elTyped = document.getElementById('typed-text');
  const elFooterYear = document.getElementById('footer-year');
  const elModalRoot = document.getElementById('modal-root');
  const elModalBackdrop = document.getElementById('modal-backdrop');
  const elModalClose = document.getElementById('modal-close');
  const elPanelDetail = document.getElementById('modal-panel-detail');
  const elPanelForm = document.getElementById('modal-panel-form');
  const elModalTitle = document.getElementById('modal-title');
  const elModalDesc = document.getElementById('modal-desc');
  const elModalConsult = document.getElementById('modal-btn-consult');
  const elFormHeading = document.getElementById('modal-form-heading');
  const elFormHint = document.getElementById('modal-form-desc');
  const elLeadForm = document.getElementById('lead-form');
  const elFormBack = document.getElementById('form-back');
  const elFormStatus = document.getElementById('form-status');
  const canvasParticles = document.getElementById('particles-canvas');

  const state = {
    open: false,
    mode: null,
    projectId: null,
    serviceKey: null,
    lastFocus: null,
  };

  function initConfigLinks() {
    if (elHeroPhoto) elHeroPhoto.src = CONFIG.HERO_PHOTO_PATH;
    var gh = document.getElementById('contact-github-link');
    var fgh = document.getElementById('footer-github-link');
    if (gh) gh.href = CONFIG.GITHUB_URL;
    if (fgh) fgh.href = CONFIG.GITHUB_URL;
    var fb = document.getElementById('contact-facebook');
    var li = document.getElementById('contact-linkedin');
    var fbF = document.getElementById('footer-facebook');
    var liF = document.getElementById('footer-linkedin');
    if (fb) fb.href = CONFIG.FACEBOOK_URL;
    if (li) li.href = CONFIG.LINKEDIN_URL;
    if (fbF) fbF.href = CONFIG.FACEBOOK_URL;
    if (liF) liF.href = CONFIG.LINKEDIN_URL;
    document.querySelectorAll('a[href="assets/cv.pdf"]').forEach(function (a) {
      a.setAttribute('href', CONFIG.CV_PATH);
    });
  }

  /* ========== Loader ========== */
  function initLoader() {
    document.body.classList.add('loader-active');
    window.addEventListener('load', function () {
      if (elLoader) elLoader.classList.add('is-done');
      document.body.classList.remove('loader-active');
      if (elLoader) elLoader.setAttribute('aria-busy', 'false');
    });
  }

  /* ========== Curseur ========== */
  function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.body.classList.add('is-custom-cursor');
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    var mx = 0;
    var my = 0;
    var rx = 0;
    var ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    });
    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    var hoverSelector = 'a, button, [role="button"], input, textarea, .project-card';
    function targetElement(t) {
      var n = t;
      while (n && n.nodeType !== 1) n = n.parentNode;
      return n || null;
    }
    document.addEventListener(
      'mouseenter',
      function (e) {
        var el = targetElement(e.target);
        if (el && typeof el.matches === 'function' && el.matches(hoverSelector)) ring.classList.add('is-hover');
      },
      true
    );
    document.addEventListener(
      'mouseleave',
      function (e) {
        var el = targetElement(e.target);
        if (el && typeof el.matches === 'function' && el.matches(hoverSelector)) ring.classList.remove('is-hover');
      },
      true
    );
  }

  /* ========== Nav sticky + mobile ========== */
  function initNav() {
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (elHeader) elHeader.classList.toggle('is-scrolled', y > 40);
      updateScrollProgress();
      parallaxBlobs(y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (elNavToggle && elNavMenu) {
      elNavToggle.addEventListener('click', function () {
        var open = elNavMenu.classList.toggle('is-open');
        elNavToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      elNavMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          elNavMenu.classList.remove('is-open');
          elNavToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && elNavMenu && elNavMenu.classList.contains('is-open')) {
        elNavMenu.classList.remove('is-open');
        if (elNavToggle) elNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function updateScrollProgress() {
    if (!elScrollProgress) return;
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    elScrollProgress.style.width = pct + '%';
  }

  function parallaxBlobs(scrollY) {
    if (prefersReducedMotion) return;
    var b1 = document.querySelector('.parallax-blob--1');
    var b2 = document.querySelector('.parallax-blob--2');
    var b3 = document.querySelector('.parallax-blob--3');
    if (b1) b1.style.transform = 'translateY(' + scrollY * 0.06 + 'px)';
    if (b2) b2.style.transform = 'translateY(' + -scrollY * 0.04 + 'px)';
    if (b3) b3.style.transform = 'translate(-50%, ' + scrollY * 0.025 + 'px)';
  }

  /* ========== Reveal + barres compétences ========== */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var skillFills = document.querySelectorAll('.skill-card__fill');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
      skillFills.forEach(animateSkillFill);
      return;
    }
    try {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            if (entry.target.classList.contains('skill-card')) {
              var fill = entry.target.querySelector('.skill-card__fill');
              if (fill) animateSkillFill(fill);
            }
          });
        },
        { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } catch (err) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
      skillFills.forEach(animateSkillFill);
    }
  }

  function animateSkillFill(fill) {
    var target = parseInt(fill.getAttribute('data-target') || '0', 10);
    fill.style.setProperty('--target-width', target + '%');
    requestAnimationFrame(function () {
      fill.classList.add('is-animated');
    });
  }

  /* ========== Typing ========== */
  function getTypingPhrases() {
    return currentLang === 'en' ? CONFIG.TYPING_PHRASES_EN : CONFIG.TYPING_PHRASES_FR;
  }

  function restartTyping() {
    typingPhraseIndex = 0;
    typingCharIndex = 0;
    typingDeleting = false;
    if (typingTimer) clearInterval(typingTimer);
    typingTimer = null;
    if (!elTyped) return;
    if (prefersReducedMotion) {
      elTyped.textContent = getTypingPhrases()[0] || '';
      return;
    }
    tickTyping();
  }

  function tickTyping() {
    if (!elTyped || prefersReducedMotion) return;
    var phrases = getTypingPhrases();
    if (!phrases.length) return;
    var phrase = phrases[typingPhraseIndex % phrases.length];
    if (!typingDeleting) {
      typingCharIndex++;
      elTyped.textContent = phrase.slice(0, typingCharIndex);
      if (typingCharIndex >= phrase.length) {
        typingDeleting = true;
        typingTimer = setTimeout(tickTyping, CONFIG.TYPING_PAUSE_MS);
        return;
      }
    } else {
      typingCharIndex--;
      elTyped.textContent = phrase.slice(0, typingCharIndex);
      if (typingCharIndex <= 0) {
        typingDeleting = false;
        typingPhraseIndex++;
      }
    }
    typingTimer = setTimeout(tickTyping, typingDeleting ? CONFIG.TYPING_SPEED_MS / 2 : CONFIG.TYPING_SPEED_MS);
  }

  /* ========== Particules ========== */
  function initParticles() {
    if (!canvasParticles || prefersReducedMotion) return;
    var ctx = canvasParticles.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var w = 0;
    var h = 0;
    var count = window.matchMedia('(max-width: 768px)').matches ? 36 : 70;

    function resize() {
      w = canvasParticles.clientWidth || window.innerWidth;
      h = canvasParticles.clientHeight || window.innerHeight;
      canvasParticles.width = w * dpr;
      canvasParticles.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      particles.length = 0;
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          a: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(61, 158, 255, ' + p.a + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    resize();
    spawn();
    window.addEventListener('resize', function () {
      resize();
      spawn();
    });
    requestAnimationFrame(frame);
  }

  /* ========== Modale ========== */
  function trapFocus(e) {
    if (!state.open || !elModalRoot) return;
    if (e.key !== 'Tab') return;
    var focusables = elModalRoot.querySelectorAll(
      'button:not([hidden]), [href], input:not([hidden]), textarea:not([hidden]), select, [tabindex]:not([tabindex="-1"])'
    );
    var list = Array.prototype.filter.call(focusables, function (n) {
      return !n.hasAttribute('disabled') && n.offsetParent !== null;
    });
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal() {
    if (!elModalRoot) return;
    state.lastFocus = document.activeElement;
    elModalRoot.hidden = false;
    elModalRoot.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    state.open = true;
    document.addEventListener('keydown', onModalKey);
    setTimeout(function () {
      var focusTarget = elModalRoot.querySelector(
        state.mode === 'service' ? '#lead-name' : '#modal-btn-consult, #modal-close'
      );
      if (focusTarget) focusTarget.focus();
    }, 50);
  }

  function closeModal() {
    if (!elModalRoot) return;
    elModalRoot.hidden = true;
    elModalRoot.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.open = false;
    state.mode = null;
    state.projectId = null;
    state.serviceKey = null;
    document.removeEventListener('keydown', onModalKey);
    resetFormPanels();
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') state.lastFocus.focus();
  }

  function onModalKey(e) {
    if (e.key === 'Escape') closeModal();
    trapFocus(e);
  }

  function resetFormPanels() {
    if (elPanelDetail) elPanelDetail.hidden = false;
    if (elPanelForm) elPanelForm.hidden = true;
    if (elLeadForm) elLeadForm.reset();
    if (elFormStatus) {
      elFormStatus.textContent = '';
      elFormStatus.classList.remove('is-error', 'is-success');
    }
    if (elModalConsult) elModalConsult.style.display = '';
  }

  function showFormPanel(isService) {
    if (elPanelDetail) elPanelDetail.hidden = true;
    if (elPanelForm) elPanelForm.hidden = false;
    if (elFormHeading) elFormHeading.textContent = t(isService ? 'form.titleService' : 'form.titleProject');
    if (elFormHint) elFormHint.textContent = t('form.hint');
    setTimeout(function () {
      var n = document.getElementById('lead-name');
      if (n) n.focus();
    }, 30);
  }

  function fillProjectModal(projectId) {
    if (!elModalTitle || !elModalDesc) return;
    var titleKey = 'projects.' + projectId + '.title';
    var descKey = 'projects.' + projectId + '.desc';
    elModalTitle.textContent = t(titleKey);
    elModalDesc.textContent = t(descKey);
  }

  function openProjectDetail(projectId) {
    state.mode = 'project';
    state.projectId = projectId;
    resetFormPanels();
    fillProjectModal(projectId);
    openModal();
  }

  function openServiceFlow(serviceKey) {
    state.mode = 'service';
    state.serviceKey = serviceKey;
    resetFormPanels();
    if (elModalConsult) elModalConsult.style.display = 'none';
    var labelKey = SERVICE_LABEL_KEYS[serviceKey] || 'services.title';
    if (elModalTitle) elModalTitle.textContent = t(labelKey);
    if (elModalDesc) elModalDesc.textContent = t('form.hint');
    showFormPanel(true);
    var subj = document.getElementById('lead-subject');
    if (subj) subj.value = t('form.subjectServicePrefix') + t(labelKey);
    openModal();
  }

  function initModals() {
    document.querySelectorAll('.project-card[data-project-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openProjectDetail(btn.getAttribute('data-project-id'));
      });
    });
    document.querySelectorAll('.js-service-request').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openServiceFlow(btn.getAttribute('data-service-key') || 'web');
      });
    });
    if (elModalConsult) {
      elModalConsult.addEventListener('click', function () {
        showFormPanel(false);
        var subj = document.getElementById('lead-subject');
        if (subj && state.projectId) {
          var titleKey = 'projects.' + state.projectId + '.title';
          subj.value = t('form.subjectProjectPrefix') + t(titleKey);
        }
      });
    }
    if (elFormBack) {
      elFormBack.addEventListener('click', function () {
        if (state.mode === 'project') {
          elPanelForm.hidden = true;
          elPanelDetail.hidden = false;
          if (elModalConsult) elModalConsult.style.display = '';
        } else {
          closeModal();
        }
      });
    }
    [elModalBackdrop, elModalClose].forEach(function (el) {
      if (el) el.addEventListener('click', closeModal);
    });
    if (elModalClose) {
      elModalClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
      });
    }
    if (elModalRoot) {
      elModalRoot.querySelector('.modal__dialog').addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  }

  /* ========== Formulaire ========== */
  function initForm() {
    if (!elLeadForm) return;
    elLeadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = elLeadForm.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;

      var name = document.getElementById('lead-name');
      var email = document.getElementById('lead-email');
      var subject = document.getElementById('lead-subject');
      var message = document.getElementById('lead-message');
      if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
        elFormStatus.textContent = t('form.error');
        elFormStatus.classList.add('is-error');
        return;
      }

      if (!CONFIG.FORM_ENDPOINT) {
        var body =
          'Nom: ' +
          name.value +
          '\nEmail: ' +
          email.value +
          '\nObjet: ' +
          subject.value +
          '\n\n' +
          message.value;
        var mail =
          'mailto:nilsotele491@gmail.com?subject=' +
          encodeURIComponent(subject.value) +
          '&body=' +
          encodeURIComponent(body);
        elFormStatus.textContent =
          currentLang === 'en'
            ? 'Opening your email app… Add FORM_ENDPOINT in js/app.js for direct sending.'
            : 'Ouverture de votre messagerie… Ajoutez FORM_ENDPOINT dans js/app.js pour un envoi direct.';
        elFormStatus.classList.remove('is-error');
        elFormStatus.classList.add('is-success');
        window.location.href = mail;
        return;
      }

      elFormStatus.classList.remove('is-error', 'is-success');
      elFormStatus.textContent = t('form.sending');

      var fd = new FormData(elLeadForm);
      fd.append('_replyto', email.value);

      fetch(CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network');
          elFormStatus.textContent = t('form.success');
          elFormStatus.classList.add('is-success');
          elLeadForm.reset();
        })
        .catch(function () {
          elFormStatus.textContent = t('form.error');
          elFormStatus.classList.add('is-error');
        });
    });
  }

  /* ========== Langue ========== */
  function initLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (_) {}
    if (stored === 'en' || stored === 'fr') currentLang = stored;
    setLang(currentLang);
    document.getElementById('lang-fr')?.addEventListener('click', function () {
      setLang('fr');
    });
    document.getElementById('lang-en')?.addEventListener('click', function () {
      setLang('en');
    });
  }

  /* ========== Footer année ========== */
  function initFooterYear() {
    if (elFooterYear) elFooterYear.textContent = String(new Date().getFullYear());
  }

  /* ========== Bootstrap ========== */
  function init() {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initConfigLinks();
    initLang();
    initFooterYear();
    updateModalCloseLabel();
    initLoader();
    initCursor();
    initNav();
    initReveal();
    initParticles();
    initModals();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
