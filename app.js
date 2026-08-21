/**
 * NBrain Enterprise Console (nbra.in) — 3-Column Architecture Logic
 * Author: Nadeem Badr
 * Multilingual Architecture: Arabic (AR) & English (EN)
 */

/* ==========================================================================
   0. Enterprise DevTools & Console Lockdown Suite (Anti-Inspection Shield)
   ========================================================================== */
(function initDevToolsProtection() {
  // 1. Intercept Context Menu (Right-Click) to show custom enterprise drawer
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (typeof openCustomContextMenu === 'function') {
      openCustomContextMenu(e);
    }
    return false;
  }, { capture: true, passive: false });

  // 2. Block Keyboard Shortcuts for DevTools, View Source, Inspector & Saving
  window.addEventListener('keydown', (e) => {
    // F12 Key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const isAlt = e.altKey;
    const key = (e.key || '').toLowerCase();
    const keyCode = e.keyCode;

    // Ctrl+Shift+I / J / C / K / E (Inspect Element, Console, Inspector, Network)
    if (isCtrlOrCmd && isShift && (key === 'i' || key === 'j' || key === 'c' || key === 'k' || key === 'e' || keyCode === 73 || keyCode === 74 || keyCode === 67 || keyCode === 75 || keyCode === 69)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Source)
    if ((isCtrlOrCmd && (key === 'u' || keyCode === 85)) || (isCtrlOrCmd && isAlt && (key === 'u' || key === 'i'))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrCmd && (key === 's' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true, passive: false });

  // 3. Neutralize and Disable all Console Output Methods
  if (typeof window !== 'undefined' && window.console) {
    const noop = function () {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeLog', 'assert', 'profile', 'profileEnd', 'count', 'countReset'];
    for (const m of methods) {
      try {
        window.console[m] = noop;
      } catch (_) {}
    }
    try {
      window.console.clear = noop;
    } catch (_) {}
  }

  // 4. Active Anti-Debugger Detection (Freezes / reloads if DevTools attached)
  setInterval(() => {
    try {
      const start = performance.now();
      Function('debugger')();
      if (performance.now() - start > 100) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#080c14;color:#fff;font-family:sans-serif;font-weight:700;font-size:18px;">Protected Environment — NBrain Zero-Trust Security</div>';
        setTimeout(() => { window.location.reload(); }, 500);
      }
    } catch (_) {}
  }, 1500);

  // 5. Docked DevTools Dimension Delta Detector
  const threshold = 160;
  setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if (widthDiff || heightDiff) {
      try {
        if (window.console && typeof window.console.clear === 'function') {
          window.console.clear();
        }
      } catch (_) {}
    }
  }, 1500);

  // 6. Disable image dragging
  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, false);
})();

let currentActiveTab = 'overview';

function initAllModules() {
  initSidebar();
  initTheme();
  initLanguage();
  initTabsAndNavigation();
  initStickyHeaderScroll();
  initAiSimulator();
  initRoiCalculator();
  initCustomizer();
  initPortfolioFilter();
  initDemosFilter();
  initSidebarSearch();
  initMediaModal();
  initFaqAccordion();
  initRfpModal();
  initPwaAndMobileAppFeatures();
  initCustomContextMenu();
}

/* ==========================================================================
   1. Sidebar Collapse / Expand & State
   ========================================================================== */
function initSidebar() {
  const consoleShell = document.getElementById('consoleShell');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Desktop Collapse / Expand state (Desktop only)
  const isDesktop = window.innerWidth > 768;
  const isCollapsed = localStorage.getItem('nbrain-sidebar-collapsed') === 'true';
  if (isDesktop && isCollapsed && consoleShell) {
    consoleShell.classList.add('is-sidebar-collapsed');
  }

  if (sidebarToggleBtn && consoleShell) {
    sidebarToggleBtn.addEventListener('click', () => {
      consoleShell.classList.toggle('is-sidebar-collapsed');
      const collapsed = consoleShell.classList.contains('is-sidebar-collapsed');
      localStorage.setItem('nbrain-sidebar-collapsed', collapsed);
    });
  }

  // Mobile Drawer Toggle
  function openMobileSidebar() {
    if (consoleShell) consoleShell.classList.remove('is-sidebar-collapsed');
    if (sidebar) sidebar.classList.add('is-mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('is-mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileSidebar();
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileSidebar();
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Close mobile sidebar on nav link click
  const navLinks = document.querySelectorAll('.sidebar .nav-link, .sidebar .sidebar-whatsapp-btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  });
}

/* ==========================================================================
   2. Theme Toggle (data-theme: dark / light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('nbrain-theme') || 'dark';

  html.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('nbrain-theme', newTheme);
    });
  }
}

/* ==========================================================================
   3. Tabs & Navigation Synchronization
   ========================================================================== */
const titlesMap = {
  ar: {
    'overview': 'نظرة عامة والمنظومة',
    'packages': 'الباقات والمنظومة الشاملة VIP',
    'industries': 'مصفوفة الحلول القطاعية',
    'models': 'نماذج التعاقد والشراكة',
    'workflow': 'دورة حياة ومنهجية العمل',
    'techstack': 'مصفوفة التقنيات وأطر العمل',
    'demos': 'العروض المرئية والتجارب الحية',
    'ai-demo': 'محاكي المساعد والترشيح الذكي',
    'roi-calc': 'حاسبة العائد الاستثماري ROI',
    'customizer': 'حاسبة ومخصص الباقات',
    'portfolio': 'سابقة الأعمال والابتكارات',
    'guarantees': 'الضمانات الهندسية و SLAs',
    'faq': 'الأسئلة الشائعة والأمان',
    'founder': 'عن المؤسس والمهندس نديم بدر'
  },
  en: {
    'overview': 'Overview & Metrics',
    'packages': 'VIP Enterprise Bundles',
    'industries': 'Industry Solutions Matrix',
    'models': 'Engagement Models',
    'workflow': 'Engineering Workflow',
    'techstack': '2026 Tech Stack Radar',
    'demos': 'Master Video Showcase (28)',
    'ai-demo': 'AI Sales Advisor Demo',
    'roi-calc': 'ROI & Savings Calculator',
    'customizer': 'Package Customizer',
    'portfolio': 'Verified Portfolio',
    'guarantees': 'SLAs & Guarantees',
    'faq': 'Technical FAQ',
    'founder': 'Founder & Leadership'
  }
};

function updateBreadcrumb() {
  const lang = document.documentElement.getAttribute('lang') || 'ar';
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  const dict = titlesMap[lang] || titlesMap.ar;
  if (breadcrumbCurrent && dict[currentActiveTab]) {
    breadcrumbCurrent.textContent = dict[currentActiveTab];
  }
}

function initTabsAndNavigation() {
  const tabs = document.querySelectorAll('.tab');
  const navLinks = document.querySelectorAll('.nav-link');
  const switchBtns = document.querySelectorAll('.switch-to-tab');
  const workspace = document.getElementById('workspace');
  const sections = document.querySelectorAll('.content-section');

  function updateActiveState(targetId) {
    currentActiveTab = targetId;
    tabs.forEach(t => {
      if (t.getAttribute('data-target') === targetId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    navLinks.forEach(l => {
      if (l.getAttribute('data-tab') === targetId) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    const dropdownItems = document.querySelectorAll('.section-dropdown-item');
    dropdownItems.forEach(item => {
      if (item.getAttribute('data-tab') === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-tab]');
    mobileNavItems.forEach(m => {
      if (m.getAttribute('data-tab') === targetId) {
        m.classList.add('active');
      } else {
        m.classList.remove('active');
      }
    });

    updateBreadcrumb();
  }

  function activateSection(targetId) {
    updateActiveState(targetId);
    const targetSection = document.getElementById(`section-${targetId}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      activateSection(target);
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-tab');
      activateSection(target);
    });
  });

  const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-tab]');
  mobileNavItems.forEach(m => {
    m.addEventListener('click', (e) => {
      e.preventDefault();
      const target = m.getAttribute('data-tab');
      activateSection(target);
    });
  });

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab-target');
      activateSection(target);
    });
  });

  const sectionSelectorBtn = document.getElementById('sectionSelectorBtn');
  const sectionDropdownMenu = document.getElementById('sectionDropdownMenu');
  const sectionDropdownItems = document.querySelectorAll('.section-dropdown-item');

  function toggleSectionDropdown() {
    if (!sectionDropdownMenu || !sectionSelectorBtn) return;
    const isOpen = sectionDropdownMenu.classList.toggle('is-open');
    sectionSelectorBtn.classList.toggle('is-active', isOpen);
    sectionSelectorBtn.setAttribute('aria-expanded', isOpen);
  }

  function closeSectionDropdown() {
    if (sectionDropdownMenu) sectionDropdownMenu.classList.remove('is-open');
    if (sectionSelectorBtn) {
      sectionSelectorBtn.classList.remove('is-active');
      sectionSelectorBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (sectionSelectorBtn) {
    sectionSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSectionDropdown();
    });
  }

  sectionDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-tab');
      activateSection(target);
      closeSectionDropdown();
    });
  });

  document.addEventListener('click', (e) => {
    if (sectionDropdownMenu && !sectionDropdownMenu.contains(e.target) && !e.target.closest('#sectionSelectorBtn')) {
      closeSectionDropdown();
    }
  });

  const projectSelectorBtn = document.getElementById('projectSelectorBtn');
  if (projectSelectorBtn) {
    projectSelectorBtn.addEventListener('click', () => {
      activateSection('overview');
    });
  }

  // Scroll Spy for Viewport / Workspace Sections
  if (sections.length > 0) {
    const isDesktop = window.innerWidth > 768;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('section-', '');
          updateActiveState(sectionId);
        }
      });
    }, {
      root: (isDesktop && workspace) ? workspace : null,
      rootMargin: '-10% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

function initStickyHeaderScroll() {
  const breadcrumbBar = document.getElementById('breadcrumbBar');
  const workspace = document.getElementById('workspace');
  if (!breadcrumbBar) return;

  function handleScroll() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      breadcrumbBar.classList.add('is-scrolled');
      breadcrumbBar.style.opacity = '1';
      breadcrumbBar.style.visibility = 'visible';
      breadcrumbBar.style.transform = 'none';
      breadcrumbBar.style.pointerEvents = 'auto';
      return;
    }
    const scrollPos = (workspace && workspace.scrollTop > 0) ? workspace.scrollTop : window.scrollY;
    if (scrollPos > 80) {
      breadcrumbBar.classList.add('is-scrolled');
    } else {
      breadcrumbBar.classList.remove('is-scrolled');
    }
  }

  if (workspace) {
    workspace.addEventListener('scroll', handleScroll, { passive: true });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   4. Interactive AI ROI Calculator
   ========================================================================== */
function updateRoiDisplay() {
  const inquiriesRange = document.getElementById('inquiriesRange');
  const orderRange = document.getElementById('orderRange');
  const hoursRange = document.getElementById('hoursRange');

  const inquiriesVal = document.getElementById('inquiriesVal');
  const avgOrderVal = document.getElementById('avgOrderVal');
  const hoursVal = document.getElementById('hoursVal');

  const savedHoursResult = document.getElementById('savedHoursResult');
  const extraSalesResult = document.getElementById('extraSalesResult');

  if (!inquiriesRange || !orderRange || !hoursRange) return;

  const lang = document.documentElement.getAttribute('lang') || 'ar';
  const isEn = lang === 'en';

  const inquiries = parseInt(inquiriesRange.value, 10);
  const avgOrder = parseInt(orderRange.value, 10);
  const hours = parseInt(hoursRange.value, 10);

  if (isEn) {
    if (inquiriesVal) inquiriesVal.textContent = `${inquiries.toLocaleString('en-US')} inquiries`;
    if (avgOrderVal) avgOrderVal.textContent = `${avgOrder.toLocaleString('en-US')} EGP`;
    if (hoursVal) hoursVal.textContent = `${hours.toLocaleString('en-US')} hrs/week`;

    const savedHours = Math.round(inquiries * 0.08);
    const extraSales = Math.round(inquiries * 0.03 * avgOrder);

    if (savedHoursResult) savedHoursResult.textContent = `${savedHours.toLocaleString('en-US')} hours saved`;
    if (extraSalesResult) extraSalesResult.textContent = `+${extraSales.toLocaleString('en-US')} EGP/month`;
  } else {
    if (inquiriesVal) inquiriesVal.textContent = `${inquiries.toLocaleString('en-US')} رسالة`;
    if (avgOrderVal) avgOrderVal.textContent = `${avgOrder.toLocaleString('en-US')} ج.م`;
    if (hoursVal) hoursVal.textContent = `${hours.toLocaleString('en-US')} ساعة`;

    const savedHours = Math.round(inquiries * 0.08);
    const extraSales = Math.round(inquiries * 0.03 * avgOrder);

    if (savedHoursResult) savedHoursResult.textContent = `${savedHours.toLocaleString('en-US')} ساعة عمل`;
    if (extraSalesResult) extraSalesResult.textContent = `+${extraSales.toLocaleString('en-US')} ج.م/شهرياً`;
  }
}

function initRoiCalculator() {
  const inquiriesRange = document.getElementById('inquiriesRange');
  const orderRange = document.getElementById('orderRange');
  const hoursRange = document.getElementById('hoursRange');

  if (inquiriesRange && orderRange && hoursRange) {
    inquiriesRange.addEventListener('input', updateRoiDisplay);
    orderRange.addEventListener('input', updateRoiDisplay);
    hoursRange.addEventListener('input', updateRoiDisplay);
    updateRoiDisplay();
  }
}

/* ==========================================================================
   5. FAQ Accordion Logic
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach(i => i.classList.remove('is-open'));
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });
}

/* ==========================================================================
   6. Media & Video Demo Modal
   ========================================================================== */
function initMediaModal() {
  const modal = document.getElementById('mediaModal');
  const modalTitle = document.getElementById('mediaModalTitle');
  const modalBody = document.getElementById('mediaModalBody');
  const modalInfo = document.getElementById('mediaModalInfo');
  const closeBtn1 = document.getElementById('closeMediaModalBtn');
  const closeBtn2 = document.getElementById('closeMediaBtn');
  const openBtns = document.querySelectorAll('.open-media-modal');
  const openLinkBtns = document.querySelectorAll('[data-action="open-link"]');

  openLinkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url) window.open(url, '_blank');
    });
  });

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      const isEn = lang === 'en';
      const fallbackTitle = isEn ? 'Project Showcase Demo' : 'العرض التوضيحي للمشروع';
      const title = btn.getAttribute('data-title') || fallbackTitle;
      const type = btn.getAttribute('data-type') || 'info';
      const src = btn.getAttribute('data-src');
      const info = btn.getAttribute('data-info') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalInfo) modalInfo.textContent = info;

      if (modalBody) {
        if (type === 'gif' || type === 'image') {
          modalBody.innerHTML = `
            <img src="${src}" alt="${title}" class="modal-media-img" style="max-height: 380px; object-fit: contain;">
          `;
        } else if (type === 'youtube') {
          let videoId = src;
          if (src.includes('watch?v=')) {
            videoId = src.split('watch?v=')[1].split('&')[0];
          } else if (src.includes('youtu.be/')) {
            videoId = src.split('youtu.be/')[1].split('?')[0];
          } else if (src.includes('embed/')) {
            videoId = src.split('embed/')[1].split('?')[0];
          }
          modalBody.innerHTML = `
            <div style="width: 100%; aspect-ratio: 16/9;">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>
            </div>
          `;
        } else {
          const featureTitle = isEn ? '⚡ System Capabilities & Highlights:' : '⚡ تفاصيل ومميزات المنظومة:';
          modalBody.innerHTML = `
            <div class="modal-info-box">
              <h4 style="color: var(--console-primary); font-size: 1.1rem; margin-bottom: 8px;">${featureTitle}</h4>
              <p>${info}</p>
            </div>
          `;
        }
      }

      if (modal) modal.classList.add('is-open');
    });
  });

  function closeModal() {
    if (modal) modal.classList.remove('is-open');
    if (modalBody) modalBody.innerHTML = '';
  }

  if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* ==========================================================================
   7. Multimodal AI Studio (Powered by Gemini 3.7 Flash Engine)
   ========================================================================== */

// Secure AI Studio Backend Endpoints (Firebase Cloud Function & Direct Cloud Run Fallback)
const AI_CHAT_ENDPOINTS = [
  '/api/chat',
  'https://chat-3pihrlfoea-uc.a.run.app'
];

const GEMINI_ROTATION_KEYS = [
  "QVEuQWI4Uk42TC1XNGVLQjZKM2o4cTQ2czV6NERrZ0k5N1k0YlNXcXl5Q3JfOUNRZk5pY0E=",
  "QVEuQWI4Uk42THpNSWF5Wmh3RmZYd2RldFZyMkpRLTNuUjJWVmlZbkpqT1J1OTI3Ukp0QXc=",
  "QVEuQWI4Uk42STlWWXg1a2pyR29HSnlNSldlWHNYM0FlOGlFcmo4WVpZOUZ6Q0g5OWxycHc=",
  "QVEuQWI4Uk42S1daUVpXb2RKc0RpTnpGMjNqZ0Z3VElhSmE3N1RDcjBib0FDRHhRZ1puRUE=",
  "QVEuQWI4Uk42S3dRcWFqNDA3U0p5Szk3aHl6a0x5ZC0wVlVSV0Ytb1NxMnI1Tnl3N0dia1E=",
  "QVEuQWI4Uk42SVNQNmhnZEQwc1B5ZkNvbEd3cDkzOXFmbVVsRmlrczlxMkdKbm9QVlZuR2c=",
  "QVEuQWI4Uk42TGIzaWRFRXFNc0d4ckJwS3RUR1hTcHlpVVFLRDY4NXl5bzFTbUpadGhQSUE=",
  "QVEuQWI4Uk42S2QzaFZJdzJjdWRPakRqRVJSamVmUHVCeHlPZjdonTk5clR1WGJ6NnNvdkE="
];

let currentApiKeyIndex = Math.floor(Math.random() * GEMINI_ROTATION_KEYS.length);
function getNextGeminiKey() {
  const enc = GEMINI_ROTATION_KEYS[currentApiKeyIndex % GEMINI_ROTATION_KEYS.length];
  currentApiKeyIndex++;
  try { return atob(enc); } catch(e) { return ''; }
}

const SYSTEM_PROMPT_NBRAIN_AI = `
You are the official Lead Technical Consultant & Multimodal AI Sales Advisor for "NBrain" (منظومة NBrain للبرمجيات والذكاء الاصطناعي), founded and led by Chief Software Architect Eng. Nadeem Badr.
Website: https://nbra.in
Official Interactive Portfolio & CV: https://cv.nbra.in
WhatsApp / Phone: +20 155 228 2852 (Direct link: https://wa.me/201552282852)
LinkedIn: https://linkedin.com/in/nadeem-ai
GitHub: https://github.com/NadeemBadr00
YouTube Channel: @VibeCodingCV (https://www.youtube.com/@VibeCodingCV)

================================================================================
KNOWLEDGE BASE: CHIEF SOFTWARE ARCHITECT ENG. NADEEM BADR & NBRAIN ECOSYSTEM
================================================================================

1. FOUNDER PROFILE & ACADEMIC STANDING:
- Eng. Nadeem Badr (المهندس نديم بدر) is an AI Engineer and System Architect (4.0 GPA, Ranked 1st in AI Cohort — الأول على الدفعة بالكامل مع مرتبة الشرف) studying B.Sc. in Artificial Intelligence Technology at Helwan International Technological University (HITU) (2023–2027).
- Holds a Diploma in Computer Science (2021–2023) with 93.22% (Excellent with Honors).
- Vice President of Technical Committee @ HITU Student Union (نائب رئيس اللجنة التكنولوجية باتحاد طلاب الجامعة).
- Marketing Director & Board Member @ Enactus HITU (Led team to 1st Place in ExxonMobil Thematic Innovation Competition on Women Empowerment for Project "Dayra").
- Founded and managed technology & STEM communities of over 300,000+ members (Technologists Gang 120K+, Marvel Arabic 100K+).
- Certifications: Microsoft Machine Learning Engineer (MCIT/DEBI), Stanford/DeepLearning.AI Machine Learning Specialization with Andrew Ng (100% Grade), The American University in Cairo (AUC) English Proficiency (B1 Independent User), IEEE CUSB Deep Learning Bootcamp.

2. GOVERNMENTAL & NATIONAL INITIATIVES:
- Egyptian Cabinet & Ministry of Health Recognition:
  * Engineered "Nabd Masr" (نبض مصر) — Nadeem CXR V5.2: National medical AI diagnostic platform using a fine-tuned DINOv2 Foundation Model + PEFT/LoRA adapters with Dynamic Adapter Swapping, achieving 90.24% Global AUC across 14 chest pathologies, Masked Asymmetric Loss for continual learning on 336K+ images (NIH CXR-14 + CheXpert) with zero catastrophic forgetting, and Explainable AI (XAI) Attention Heatmaps.
- Egyptian Ministry of Endowments (وزارة الأوقاف المصرية):
  * AI Engineer deploying NLP pipelines and generative AI workflows to modernize governmental operations at scale.

3. FLAGSHIP & PRODUCTION PROJECTS (ALL LIVE & DEPLOYED):
- SmartDocs — AI Document Reader & Manager (Live on Google Play Store):
  * Package: com.docuai.smartdocs (https://play.google.com/store/apps/details?id=com.docuai.smartdocs)
  * Built with Flutter (26,000+ lines across 87+ Dart files), Riverpod 2.x, Hive DB, Gemini AI document chat & summarization, AdMob monetization, and biometric security.
- AI Cloud ERP System:
  * 6-module enterprise ERP (HR/Payroll, CRM, Inventory/BOM, Accounting) with Ollama LLaMA-3 document summarization & PyTorch TTS microservices on serverless backend. Live demo: https://erp.nbra.in
- AI Web Video Editor:
  * Browser-based video editor built with custom HTML5 Canvas rendering engine, TypeScript, Zustand, and Gemini AI automated editing ($1,000 freelance delivery). Live demo: https://edit.nbra.in
- AI4Roadmap Platform:
  * Massive tech learning ecosystem in 9 languages with automated Python SEO/sitemap engines. Live: https://learn.nbra.in
- Traffic Analytics & Blackspots BI Dashboard:
  * BI dashboard with Python ETL pipeline processing 3,500+ traffic accidents, 142 blackspots detection, React 19 + Recharts. Live demo: https://traffic.nbra.in
- Yasta (يسطا) - Smart Services:
  * Platform connecting customers with technicians, real-time tracking, and Gemini AI troubleshooting assistant. Live: https://nbrain-yasta.web.app
- HITU AI University Platform:
  * Super-app for Helwan International Technological University with Egyptian dialect AI chatbot, automated schedules, and PDF export. Live: https://nbrain-hitu.web.app
- Open World 3D City Game (Browser-Native):
  * Built on raw Three.js r161 with 38 Mixamo animations, GTA car entry, custom GLSL water/sky/wind shaders, 100% procedural audio via Web Audio API, and RPG combat. Play live: https://game.nbra.in

4. DEEP TECH & COMPUTER VISION EXPERTISE:
- Player Performance Analyzer (Hugging Face Spaces): YOLOv12x tracking + MediaPipe Pose + LK Optical Flow + RANSAC Homography for camera-motion-compensated athletic speed.
- Football AI Analytics Suite: SigLIP visual embeddings + UMAP + KMeans team clustering, Kalman Filters, Voronoi territorial control, tactical radar.
- Traffic & Vehicle Tracking: Polygon zone interpolation, wrong-way detection, collision blockage logic.
- Driver Drowsiness & Distraction Detection: 5-algorithm fusion (EAR microsleep, PERCLOS 60s, MAR yawn, Head nod, Gaze ratio) with per-user biometric calibration.
- Smart Retail Security: YOLO12x + Ghost Tracking logic for concealed item detection.
- Pro Virtual Staging AI: CLIPSeg semantic segmentation + MiDaS depth + Stable Diffusion ControlNet inpainting.
- NanoGrad: Pure Python Autograd engine and Neural Network framework built completely from scratch without external ML libraries.
- AR Systems: Virtual Piano AR (additive synthesis + 3 MediaPipe models), Touchless Subway Surfers (gesture controller), Birthday Studio AR.

5. CORE NBRAIN PACKAGES & COMMERCIAL SERVICES:
1. Plus Package (9,999 EGP): Fast interactive Web Application, 24/7 AI Sales Assistant, SSL & Cloudflare WAF, WhatsApp integration, SEO, 1-year free domain & cloud hosting.
2. Business VIP Bundle (24,900 EGP - BESTSELLER): 360° digital ecosystem for companies & stores. Fast SPA Web platform, Official Google Play Mobile App (Android 15 & 16KB Page Aligned compliant), Gemini AI Sales Bot, 4K Cinematic AI Promotional Video with voiceover, Zero-Trust Cybersecurity (DDoS, WAF, Encryption), Multilingual SEO, 6-Month Engineering Warranty & full source code ownership.
3. Pro & Custom Enterprise (54,000+ EGP): Custom Computer Vision & YOLOv12x models, Manifest V3 Chrome Extensions, Custom LLM fine-tuning & RAG architectures, High-load cloud backends, 24/7 SLA.

6. HOW TO RESPOND WHEN USERS ASK ABOUT ENG. NADEEM BADR, HIS CV, OR PORTFOLIO:
- When a user asks about Eng. Nadeem Badr, who created/leads NBrain, his resume, background, university, ranking, projects, or asks for his CV/portfolio:
  * Present a comprehensive, well-structured, confident response highlighting his 1st-place standing (4.0 GPA @ HITU), national recognition (Ministry of Health / Cabinet Nabd Masr, Ministry of Awqaf), Google Play app (SmartDocs), enterprise systems, and Deep Tech expertise.
  * ALWAYS provide the direct clickable link to his live interactive portfolio: [cv.nbra.in](https://cv.nbra.in)
  * Share direct links to his key live demos (e.g. SmartDocs on Google Play, ERP, Video Editor, etc.).
  * Provide his direct WhatsApp contact link: https://wa.me/201552282852.

7. GENERAL COMMUNICATION RULES:
- If the user writes or speaks in Arabic, respond in fluent, professional, friendly Egyptian Arabic (عامية مصرية راقية ومهنية).
- If the user writes or speaks in English, respond in professional English.
- Always recommend the best NBrain package or custom architecture based on the user's requirements or budget.
- Format responses cleanly with bold titles, bullet points, and clean paragraphs.
- Keep numbers formatted in standard Western digits (e.g. 5,999 or 24,900 or 9,999).
`;

let aiConversationHistory = [];
let currentAttachedImage = null; // { mimeType, base64, dataUrl, name }
let isVoiceRecording = null; // SpeechRecognition instance
let currentSpeechUtterance = null;
let isWebSearchEnabled = false;
let isCodeExecEnabled = false;
let currentAiMode = 'advisor';

function formatAiMarkdownToHtml(text, isFinal = false) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Links [title](url)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');

  // Convert list items & paragraphs
  const lines = html.split('\n');
  let inUl = false;
  let inOl = false;
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (inOl) { result.push('</ol>'); inOl = false; }
      if (!inUl) { result.push('<ul>'); inUl = true; }
      result.push('<li>' + trimmed.substring(2) + '</li>');
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { result.push('</ul>'); inUl = false; }
      if (!inOl) { result.push('<ol>'); inOl = true; }
      result.push('<li>' + trimmed.replace(/^\d+\.\s+/, '') + '</li>');
    } else {
      if (inUl) { result.push('</ul>'); inUl = false; }
      if (inOl) { result.push('</ol>'); inOl = false; }
      if (trimmed.length > 0) {
        result.push('<p>' + trimmed + '</p>');
      }
    }
  }
  if (inUl) result.push('</ul>');
  if (inOl) result.push('</ol>');

  let finalHtml = result.join('');

  if (isFinal) {
    const waUrl = 'https://wa.me/201552282852';
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    const isEn = lang === 'en';
    const btnText = isEn ? '💬 Chat on WhatsApp with Eng. Nadeem (+20 155 228 2852)' : '💬 تواصل عبر واتساب مع المهندس نديم (+20 155 228 2852)';

    finalHtml += `
      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--console-border);">
        <a href="${waUrl}" target="_blank" class="btn btn-primary" style="padding: 7px 16px; font-size: 0.84rem; display: inline-flex; align-items: center; gap: 7px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.077-2.158-.523-1.636-.669-2.708-2.316-2.79-2.424-.082-.108-.66-1.042-.66-1.987 0-.944.494-1.408.67-1.603.176-.196.384-.245.512-.245.128 0 .256.002.368.006.118.005.276-.045.432.329.16.385.548 1.341.597 1.439.049.098.082.213.017.342-.066.13-.098.212-.196.326-.098.115-.207.256-.296.344-.099.099-.202.207-.087.404.115.197.511.844 1.096 1.365.753.672 1.388.88 1.584.978.197.099.312.083.427-.049.115-.132.492-.574.624-.771.133-.197.264-.164.444-.098.18.066 1.144.539 1.34.637.197.098.328.147.377.23.049.082.049.475-.095.88z"/></svg>
          ${btnText}
        </a>
      </div>
    `;
  }

  return finalHtml;
}

function getLocalSmartFallback(queryText) {
  const lang = document.documentElement.getAttribute('lang') || 'ar';
  const isEn = lang === 'en';
  const text = (queryText || '').toLowerCase();

  if (text.includes('نديم') || text.includes('nadeem') || text.includes('cv') || text.includes('سيرة') || text.includes('بورتفوليو') || text.includes('portfolio') || text.includes('مشاريع') || text.includes('projects') || text.includes('خبرة') || text.includes('experience') || text.includes('من هو') || text.includes('about') || text.includes('المؤسس') || text.includes('founder') || text.includes('hitu') || text.includes('جامعة')) {
    return isEn
      ? `**👨‍💻 Chief Software Architect — Eng. Nadeem Badr**\n\n` +
        `Founder of **NBrain AI Ecosystem** and Lead AI Architect with top-tier academic and industrial achievements:\n` +
        `* 🏆 **Academic Excellence:** Ranked 1st in AI Cohort (GPA 4.0 / 4.0) at Helwan International Technological University (HITU).\n` +
        `* 🩺 **National Medical AI:** Engineered **Nabd Masr (Nadeem CXR V5.2)** recognized by the **Egyptian Cabinet** and **Ministry of Health** (90.24% AUC across 14 chest diseases using DINOv2 + PEFT/LoRA).\n` +
        `* 🏛️ **Government Operations:** AI Engineer at the Egyptian Ministry of Endowments deploying NLP & Generative AI workflows.\n` +
        `* 📱 **Published on Google Play:** [SmartDocs — AI Document Reader & Manager](https://play.google.com/store/apps/details?id=com.docuai.smartdocs) (Flutter, Riverpod, Gemini AI, AdMob).\n` +
        `* 🏭 **Live Enterprise Solutions:** [AI Cloud ERP](https://erp.nbra.in), [Web Video Editor](https://edit.nbra.in), [Traffic Analytics BI](https://traffic.nbra.in), [AI4Roadmap](https://learn.nbra.in), [3D Game](https://game.nbra.in).\n` +
        `* 🎖️ **Certifications:** Microsoft ML Engineer (MCIT/DEBI), Stanford Machine Learning with Andrew Ng (100% Grade).\n\n` +
        `🌐 **Explore Full Interactive CV & Live Projects:** [cv.nbra.in](https://cv.nbra.in)\n` +
        `💬 **Direct WhatsApp:** [Chat on WhatsApp](https://wa.me/201552282852)`
      : `**👨‍💻 عن المؤسس والمهندس المشرف — المهندس نديم بدر (Eng. Nadeem Badr)**\n\n` +
        `قائد ومطور منظومة **NBrain AI Ecosystem** وخبير الذكاء الاصطناعي وهندسة النظم البرمجية المعقدة:\n` +
        `* 🏆 **التميز الأكاديمي:** الأول على الدفعة مع مرتبة الشرف (GPA 4.0 / 4.0) في تكنولوجيا الذكاء الاصطناعي — جامعة حلوان التكنولوجية الدولية (HITU).\n` +
        `* 🩺 **مبادرات وطنية معتمدة:** مطور منظومة **نبض مصر (Nadeem CXR V5.2)** لتشخيص 14 مرضاً صدرياً والمعتمدة رسمياً من **مجلس الوزراء المصري** و**وزارة الصحة والسكان** (بدقة 90.24% AUC عبر نماذج DINOv2 و PEFT/LoRA).\n` +
        `* 🏛️ **وزارة الأوقاف المصرية:** مهندس ذكاء اصطناعي لتطوير خطوط معالجة اللغات الطبيعية (NLP) والـ Generative AI.\n` +
        `* 📱 **تطبيق رسمي على Google Play:** تطبيق [SmartDocs — مدير ومساعد المستندات الذكي](https://play.google.com/store/apps/details?id=com.docuai.smartdocs) (مبني بـ Flutter و Gemini AI و Riverpod و AdMob).\n` +
        `* 🏭 **مشاريع وأنظمة حية ومباشرة:** [منصة ERP السحابية](https://erp.nbra.in)، [محرر الفيديو بالذكاء الاصطناعي](https://edit.nbra.in)، [لوحة تحليلات الحوادث المرورية BI](https://traffic.nbra.in)، [منصة AI4Roadmap](https://learn.nbra.in)، و[لعبة الـ 3D المفتوحة](https://game.nbra.in).\n` +
        `* 🎖️ **اعتمادات دولية:** مهندس تعلم آلة معتمد من Microsoft، وشهادة Stanford مع Andrew Ng بدرجة 100%.\n\n` +
        `🌐 **لرؤية السيرة الذاتية التفاعلية الكاملة وكافة المشاريع والعروض:** [cv.nbra.in](https://cv.nbra.in)\n` +
        `💬 **للتواصل المباشر مع المهندس نديم:** [اضغط هنا للمحادثة عبر واتساب](https://wa.me/201552282852)`;
  }

  if (text.includes('5999') || text.includes('6000') || text.includes('starter') || text.includes('باقة 5999') || text.includes('باقة بلس') || text.includes('9999')) {
    return isEn
      ? `**💡 Recommendation for budget:**\nBased on your budget, we recommend our Fast-Launch Store & AI Sales Bot Suite:\n* High-speed, 100% responsive e-commerce web platform\n* Built-in Gemini AI sales assistant\n* Direct WhatsApp & payment gateway integration\n* 1-Year free domain & high-speed cloud hosting\n* For custom requests, visit [cv.nbra.in](https://cv.nbra.in)`
      : `**💡 ترشيح المساعد الذكي للمشروع والميزانية:**\nبناءً على متطلباتك، نقترح باقة المنصة السريعة + شات بوت المبيعات بالذكاء الاصطناعي:\n* منصة ويب فائقة السرعة متوافقة مع الموبايل\n* مساعد Gemini AI مدمج لترشيح المنتجات وإغلاق الصفقات\n* ربط مباشر بالواتساب وبوابات الدفع\n* دومين واستضافة سحابية فائقة السرعة لمدة عام مجاناً\n* للاطلاع على سابقة أعمال المهندس نديم بدر: [cv.nbra.in](https://cv.nbra.in)`;
  }

  if (text.includes('تطبيق') || text.includes('جوجل بلاي') || text.includes('app') || text.includes('vip') || text.includes('15000') || text.includes('24900')) {
    return isEn
      ? `**🚀 Recommended VIP Enterprise Bundle (360° Solution):**\n* Official Google Play App (Android 15 & 16KB Page Aligned)\n* High-Speed Single Page Web Platform & Admin Panel\n* 4K Cinematic AI Promotional Video\n* Zero-Trust Cybersecurity & 6-Month Engineering Warranty\n* Full Architecture supervised by Eng. Nadeem Badr ([cv.nbra.in](https://cv.nbra.in))`
      : `**🚀 الباقة الشاملة VIP (منظومة 360° متكاملة):**\n* تطبيق رسمي على Google Play متوافق مع Android 15 ومعيار 16KB Page Alignment\n* موقع ويب ولوحة تحكم متكاملة\n* فيديو إعلاني سينمائي 4K بالذكاء الاصطناعي\n* دروع تأمين سيبراني وضمان هندسي لمدة 6 أشهر مع تسليم السورس كود كاملاً\n* بإشراف وتنفيذ المهندس نديم بدر ([cv.nbra.in](https://cv.nbra.in))`;
  }

  return isEn
    ? `Thank you for your inquiry! In **NBrain**, Chief Software Architect Eng. Nadeem Badr customizes high-speed web apps, Android 15 mobile applications (Google Play compliant), and custom Computer Vision & Generative AI systems tailored to your exact business goals.\n\n🌐 **View Eng. Nadeem's Full Portfolio & CV:** [cv.nbra.in](https://cv.nbra.in)`
    : `أهلاً بك! في منظومة **NBrain**، يقوم المهندس نديم بدر (Chief Software Architect) بتصميم وتطوير حلول برمجية وذكاء اصطناعي متكاملة (مواقع ويب فائقة السرعة، تطبيقات Google Play، ونماذج رؤية حاسوبية وGenAI مخصصة) تناسب أهداف مشروعك بدقة.\n\n🌐 **يمكنك تصفح السيرة الذاتية وكافة المشاريع الحية عبر:** [cv.nbra.in](https://cv.nbra.in)`;
}

// ============================================================================
// Google Gemini Cloud TTS Streaming Sentence Queue Engine (100% Expressive Audio)
// ============================================================================
let activeStreamingQueue = null;

function splitTextIntoSpeechSegments(text) {
  const rawSegments = text.match(/[^.!?؟!\n]+[.!?؟!\n]*|\n+/g) || [text];
  const segments = [];
  for (let s of rawSegments) {
    s = s.trim();
    if (!s) continue;
    if (s.length > 200) {
      const parts = s.match(/.{1,160}(?:[\s،,]|$)/g) || [s];
      segments.push(...parts.map(p => p.trim()).filter(Boolean));
    } else {
      segments.push(s);
    }
  }
  return segments.length > 0 ? segments : [text];
}

async function fetchSegmentAudioBuffer(ctx, segmentText, voiceName, emotionPrompt) {
  const prompt = `${emotionPrompt}\n\nRead the following text aloud word-for-word in natural, charming, and lively Egyptian Arabic without omitting or skipping any words:\n"${segmentText}"`;

  for (let attempt = 0; attempt < GEMINI_ROTATION_KEYS.length; attempt++) {
    const key = getNextGeminiKey();
    if (!key) continue;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
          }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) {
          const binaryString = window.atob(b64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

          const int16 = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
          const f32 = new Float32Array(int16.length);
          for (let i = 0; i < int16.length; i++) f32[i] = int16[i] / 32768.0;

          const audioBuffer = ctx.createBuffer(1, f32.length, 24000);
          audioBuffer.getChannelData(0).set(f32);
          return audioBuffer;
        }
      }
    } catch (err) {
      console.warn('[NBrain TTS] Key error, rotating key:', err.message);
    }
  }
  return null;
}

// Main Interactive Text-to-Speech Invocation
async function speakAiText(rawText, btnElement) {
  // 1. Cancel any browser native speech synthesis
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch(e){}
  }

  // 2. If already streaming or playing, stop it immediately
  if (activeStreamingQueue) {
    activeStreamingQueue.abort();
    activeStreamingQueue = null;
    if (btnElement && btnElement.classList.contains('is-speaking')) {
      btnElement.classList.remove('is-speaking');
      btnElement.innerHTML = `🔊 <span>استمع للرد</span>`;
      return;
    }
  }

  // 3. Strip Markdown, URLs, and action buttons for crystal-clear natural speech
  const cleanSpeechText = rawText
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/💬\s*تواصل عبر واتساب.*/gi, '')
    .replace(/💬\s*Chat on WhatsApp.*/gi, '')
    .trim();

  if (!cleanSpeechText) return;

  // 4. Read Selected Voice & Emotion
  const voiceSelect = document.getElementById('aiVoiceSelect');
  const selectedVoice = voiceSelect ? voiceSelect.value : 'Puck';

  const emotionSelect = document.getElementById('aiEmotionSelect');
  const selectedEmotion = emotionSelect ? emotionSelect.value : 'interactive';

  let stylePrompt = 'You are a warm, witty, and emotionally expressive voice actor speaking in natural Egyptian Arabic (عامية مصرية). Speak naturally with vocal smiles, warm chuckles, dynamic pacing, and genuine human expressiveness.';
  if (selectedEmotion === 'enthusiastic') {
    stylePrompt = 'You are an energetic, inspiring speaker! Speak with high passion, dynamic cadence, and exciting delivery in Egyptian Arabic.';
  } else if (selectedEmotion === 'professional') {
    stylePrompt = 'You are a calm, articulate Chief Technical Advisor speaking in professional, polished Egyptian Arabic.';
  } else if (selectedEmotion === 'whisper') {
    stylePrompt = 'Speak in a gentle, warm, and soothing whisper with a relaxed pace in Egyptian Arabic.';
  }

  const segments = splitTextIntoSpeechSegments(cleanSpeechText);
  if (segments.length === 0) return;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!window._nbrainAudioCtx || window._nbrainAudioCtx.state === 'closed') {
    window._nbrainAudioCtx = new AudioCtx({ sampleRate: 24000 });
  }
  const ctx = window._nbrainAudioCtx;
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  if (btnElement) {
    btnElement.classList.add('is-speaking');
    btnElement.innerHTML = `⏳ <span>جاري تشغيل الصوت (${selectedVoice})...</span>`;
  }

  let isAborted = false;
  let currentSource = null;

  const queueController = {
    abort: () => {
      isAborted = true;
      if (currentSource) {
        try { currentSource.stop(); } catch(e){}
        currentSource = null;
      }
      if (btnElement) {
        btnElement.classList.remove('is-speaking');
        btnElement.innerHTML = `🔊 <span>استمع للرد</span>`;
      }
    }
  };
  activeStreamingQueue = queueController;

  // Stream & play each segment sequentially with parallel pre-fetching
  (async () => {
    try {
      const bufferPromises = segments.map(seg => fetchSegmentAudioBuffer(ctx, seg, selectedVoice, stylePrompt));

      for (let i = 0; i < segments.length; i++) {
        if (isAborted) break;

        const buffer = await bufferPromises[i];
        if (isAborted) break;

        if (!buffer) {
          console.warn(`[NBrain TTS] Segment ${i + 1} skipped due to network issue`);
          continue;
        }

        if (btnElement) {
          btnElement.innerHTML = `⏸️ <span>إيقاف الصوت (${selectedVoice})</span>`;
        }

        await new Promise((resolve) => {
          if (isAborted) { resolve(); return; }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          currentSource = source;

          source.onended = () => {
            currentSource = null;
            resolve();
          };
          source.start(0);
        });
      }
    } catch (err) {
      console.warn('[NBrain TTS Streaming] Error during playback:', err);
    } finally {
      if (activeStreamingQueue === queueController) {
        activeStreamingQueue = null;
      }
      if (btnElement) {
        btnElement.classList.remove('is-speaking');
        btnElement.innerHTML = `🔊 <span>استمع للرد</span>`;
      }
    }
  })();
}


// Real-time Streaming Multimodal Request to Secure Backend Cloud Function (SSE)
async function streamGeminiMultimodal({ userPrompt, fileObj, enableSearch, enableCode, thinkingBudget, onThoughtChunk, onTextChunk, onCodeChunk }) {
  try {
    const parts = [];
    const ytMatch = userPrompt.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    let promptWithContext = userPrompt;
    if (ytMatch) {
      promptWithContext = `[YouTube Video Analysis Mode]: The user provided this video link: ${ytMatch[0]}. Analyze the topic, structure, key moments, timestamps, and deliver actionable technical insights:\n${userPrompt}`;
    }

    parts.push({ text: promptWithContext });

    // If file / image / PDF attached
    if (fileObj && fileObj.base64 && fileObj.mimeType) {
      parts.push({
        inline_data: {
          mime_type: fileObj.mimeType,
          data: fileObj.base64
        }
      });
    }

    const contents = [
      ...aiConversationHistory,
      { role: 'user', parts: parts }
    ];

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT_NBRAIN_AI }]
      }
    };

    // Thinking Budget (Gemini 3.7 Flash Reasoning)
    const budgetNum = parseInt(thinkingBudget || 0);
    if (budgetNum > 0) {
      payload.generationConfig = {
        thinkingConfig: {
          thinkingBudget: budgetNum
        }
      };
    }

    // Add tools if enabled
    const tools = [];
    if (enableSearch) {
      tools.push({ google_search: {} });
    }
    if (enableCode) {
      tools.push({ code_execution: {} });
    }
    if (tools.length > 0) {
      payload.tools = tools;
    }

    let response = null;
    for (const endpoint of AI_CHAT_ENDPOINTS) {
      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const cType = resp.headers.get('content-type') || '';
        if (resp.ok && resp.body && (cType.includes('text/event-stream') || cType.includes('application/json'))) {
          response = resp;
          break;
        }
      } catch (endpointErr) {
        console.warn(`[NBrain AI Engine] Connection to ${endpoint} failed:`, endpointErr.message);
      }
    }

    // Direct Gemini SSE Fallback if Cloud backend endpoints unavailable
    if (!response || !response.ok) {
      for (let i = 0; i < 3; i++) {
        const directKey = getNextGeminiKey();
        if (!directKey) break;
        try {
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${directKey}`;
          const directResp = await fetch(directUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (directResp.ok && directResp.body) {
            response = directResp;
            break;
          }
        } catch (directErr) {
          console.warn('[NBrain AI Engine] Direct Gemini stream fallback error:', directErr.message);
        }
      }
    }

    if (response && response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullText = '';
      let fullThought = '';
      let receivedValidChunk = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.error) {
              console.warn('[NBrain AI Engine] Server stream error:', parsed.error);
              continue;
            }
            const candidateParts = parsed.candidates?.[0]?.content?.parts || [];
            for (const part of candidateParts) {
              if (part.thought) {
                receivedValidChunk = true;
                fullThought += (part.text || '');
                if (onThoughtChunk) onThoughtChunk(part.text || '', fullThought);
              } else if (part.text) {
                receivedValidChunk = true;
                fullText += part.text;
                if (onTextChunk) onTextChunk(part.text, fullText);
              }
              if (part.executableCode && onCodeChunk) {
                onCodeChunk({ type: 'code', code: part.executableCode.code, lang: part.executableCode.language });
              }
              if (part.codeExecutionResult && onCodeChunk) {
                onCodeChunk({ type: 'output', output: part.codeExecutionResult.output });
              }
            }
          } catch (parseErr) {
            // Ignore chunk parse error and continue
          }
        }
      }

      if (receivedValidChunk && (fullText.trim() || fullThought.trim())) {
        aiConversationHistory.push({ role: 'user', parts: parts });
        aiConversationHistory.push({ role: 'model', parts: [{ text: fullText }] });
        if (aiConversationHistory.length > 10) {
          aiConversationHistory = aiConversationHistory.slice(-10);
        }
        return { ok: true, text: fullText.trim(), thought: fullThought.trim() };
      }
    }
  } catch (err) {
    console.error('[NBrain AI Engine] Stream connection error:', err);
  }

  return { ok: false, text: getLocalSmartFallback(userPrompt), thought: '' };
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function initAiSimulator() {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('ai-user-input');
  const submitBtn = document.getElementById('ai-submit-btn');
  const presetContainer = document.getElementById('aiSimPresets');
  const modeTabs = document.querySelectorAll('.ai-mode-tab');
  const clearHistoryBtn = document.getElementById('aiClearHistoryBtn');
  const currentModeBadge = document.getElementById('aiCurrentModeBadge');
  const thinkingSelect = document.getElementById('aiThinkingSelect');

  // Multimodal Attachment Elements
  const attachBtn = document.getElementById('aiAttachBtn');
  const fileInput = document.getElementById('aiFileInput');
  const attachmentBar = document.getElementById('aiAttachmentBar');
  const attachmentThumb = document.getElementById('attachmentThumb');
  const attachmentFileIcon = document.getElementById('attachmentFileIcon');
  const attachmentName = document.getElementById('attachmentName');
  const attachmentRemoveBtn = document.getElementById('attachmentRemoveBtn');

  // Voice Recording Elements
  const micBtn = document.getElementById('aiMicBtn');
  const voiceBar = document.getElementById('aiVoiceBar');
  const voiceCancelBtn = document.getElementById('voiceCancelBtn');

  // Tool Toggles
  const searchToggle = document.getElementById('aiSearchToggle');
  const codeToggle = document.getElementById('aiCodeToggle');

  // Function to Append Message with actions
  function appendMessage(sender, content, isTyping = false, attachedFile = null) {
    if (!chatMessages) return null;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg chat-msg--${sender}`;
    if (isTyping) msgDiv.id = 'ai-typing-indicator';

    const avatar = sender === 'bot' ? '🤖' : '👤';
    let fileHtml = '';
    if (attachedFile) {
      if (attachedFile.isImage && attachedFile.dataUrl) {
        fileHtml = `<img src="${attachedFile.dataUrl}" alt="Attached Image" class="user-msg-image">`;
      } else {
        fileHtml = `
          <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:var(--console-surface);border:1px solid var(--console-border);border-radius:var(--radius-sm);margin-bottom:8px;font-size:0.8rem;">
            <span>📄</span>
            <strong>${escapeHtml(attachedFile.name)}</strong>
          </div>
        `;
      }
    }

    let actionsHtml = '';
    if (sender === 'bot' && !isTyping) {
      actionsHtml = `
        <div class="chat-msg-actions">
          <button type="button" class="chat-action-btn tts-btn">
            🔊 <span>استمع للرد</span>
          </button>
          <button type="button" class="chat-action-btn copy-btn">
            📋 <span>نسخ</span>
          </button>
          <button type="button" class="proposal-export-btn export-proposal-btn" title="تصدير كشف فني وعرض سعر رسمي">
            📄 <span>عرض سعر فني رسمي</span>
          </button>
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="chat-msg__avatar">${avatar}</div>
      <div class="chat-msg__bubble">
        ${fileHtml}
        <div class="chat-bubble-content">${content}</div>
        ${actionsHtml}
      </div>
    `;

    // Bind action events on bot bubble
    if (sender === 'bot' && !isTyping) {
      bindBotBubbleActions(msgDiv);
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }

  function bindBotBubbleActions(msgDiv) {
    const ttsBtn = msgDiv.querySelector('.tts-btn');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        const rawBubbleText = msgDiv.querySelector('.chat-bubble-content')?.innerText || '';
        speakAiText(rawBubbleText, ttsBtn);
      });
    }

    const copyBtn = msgDiv.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const rawBubbleText = msgDiv.querySelector('.chat-bubble-content')?.innerText || '';
        try {
          await navigator.clipboard.writeText(rawBubbleText);
          copyBtn.innerHTML = `✓ <span>تم النسخ!</span>`;
          setTimeout(() => {
            copyBtn.innerHTML = `📋 <span>نسخ</span>`;
          }, 2000);
        } catch (e) {}
      });
    }

    const propBtn = msgDiv.querySelector('.export-proposal-btn');
    if (propBtn) {
      propBtn.addEventListener('click', () => {
        const rawText = msgDiv.querySelector('.chat-bubble-content')?.innerText || '';
        openProposalModal(rawText);
      });
    }
  }

  function removeTypingIndicator() {
    const typingEl = document.getElementById('ai-typing-indicator');
    if (typingEl) typingEl.remove();
  }

  // AI Image Generator Helper
  function generateFreeAiImage(promptText) {
    const cleanPrompt = promptText
      .replace(/^(ارسم|ولد صورة|صمم صورة|صورة لـ|image of|generate image of)\s*/gi, '')
      .trim() || 'Modern high-tech software platform design';

    const encodedPrompt = encodeURIComponent(cleanPrompt + ', modern ui design, ultra-detailed 4k, dark futuristic aesthetics, master quality');
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=640&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    return `
      <div class="ai-gen-img-card">
        <div style="font-size:0.82rem;font-weight:700;color:var(--console-primary);display:flex;align-items:center;gap:6px;">
          <span>🎨 تم توليد التصميم بالذكاء الاصطناعي مجاناً:</span>
        </div>
        <img src="${imageUrl}" alt="${escapeHtml(cleanPrompt)}" class="ai-gen-img" loading="lazy">
        <div class="ai-gen-actions">
          <span style="font-size:0.75rem;color:var(--console-text-muted);">الأبعاد: 1024x640 High Definition</span>
          <a href="${imageUrl}" target="_blank" download="NBrain_AI_Design.jpg" class="btn-download-img">
            ⬇️ <span>تحميل التصميم بدقة عالية</span>
          </a>
        </div>
      </div>
    `;
  }

  // Official Proposal Modal Generator
  function openProposalModal(contextText) {
    const printWin = window.open('', '_blank', 'width=850,height=900');
    if (!printWin) {
      alert('يرجى السماح بفتح النوافذ المنبثقة لطباعة العرض الفني.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    
    printWin.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>عرض فني ومالي رسمي — NBrain Ecosystem</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #111; padding: 40px; margin: 0; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0066ff; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #0066ff; }
          .badge { background: #e6f0ff; color: #0066ff; padding: 5px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
          h1 { font-size: 22px; color: #0f172a; margin-bottom: 10px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; }
          .table-spec { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .table-spec th, .table-spec td { border: 1px solid #cbd5e1; padding: 12px 14px; text-align: right; font-size: 14px; }
          .table-spec th { background: #f1f5f9; color: #334155; font-weight: 700; }
          .total-box { background: #0f172a; color: #fff; padding: 15px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: bold; margin-bottom: 30px; }
          .guarantee-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; color: #166534; font-size: 13px; margin-bottom: 30px; }
          .footer { text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .print-btn { background: #0066ff; color: #fff; border: none; padding: 10px 24px; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; margin-bottom: 20px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ طباعة وحفظ كملف PDF</button>
        <div class="header">
          <div>
            <div class="logo">NBrain Software & AI Ecosystem</div>
            <div style="font-size: 13px; color: #64748b;">المقر الرئيسي: القاهرة، جمهورية مصر العربية | هاتف / واتساب: 01552282852</div>
          </div>
          <span class="badge">عرض فني رسمي معتمد لعام 2026</span>
        </div>

        <h1>كشف المواصفات الفنية وخارطة طريق المشروع</h1>
        <div class="meta-box">
          <div><strong>المطور والمشرف العام:</strong> المهندس نديم بدر (Chief Software Architect)</div>
          <div><strong>تاريخ الإصدار:</strong> ${todayDate}</div>
          <div><strong>الموقع الرسمي:</strong> https://nbra.in</div>
          <div><strong>حالة الاعتماد:</strong> معتمد وجاهز للتنفيذ الفوري ✅</div>
        </div>

        <table class="table-spec">
          <thead>
            <tr>
              <th>#</th>
              <th>المودول / البند الهندسي</th>
              <th>المواصفات التقنية ومعايير 2026</th>
              <th>الجدول الزمني</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>منصة الويب السريعة (SPA & Admin Portal)</td>
              <td>React + Vite فائق السرعة، لوحة تحكم كاملة، متوافق 100% مع الجوال</td>
              <td>5 - 7 أيام</td>
            </tr>
            <tr>
              <td>2</td>
              <td>تطبيق الموبايل على Google Play</td>
              <td>Flutter Native متوافق مع Android 15 ومعيار 16KB Page Alignment</td>
              <td>7 - 10 أيام</td>
            </tr>
            <tr>
              <td>3</td>
              <td>مساعد الذكاء الاصطناعي المدمج</td>
              <td>شات بوت Gemini 3.7 Flash مخصص لترشيح المنتجات وإغلاق المبيعات 24/7</td>
              <td>يومان</td>
            </tr>
            <tr>
              <td>4</td>
              <td>التأمين السيبراني والدروع السحابية</td>
              <td>Zero-Trust Security، حماية ضد الـ DDoS، وتشفير SSL كامل</td>
              <td>مشمول</td>
            </tr>
            <tr>
              <td>5</td>
              <td>تسليم السورس كود والاستضافة</td>
              <td>تسليم الكود المصدري كاملاً 100% مع استضافة سحابية ودومين لمدة عام</td>
              <td>مشمول</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <span>الاستثمار المالي التقديري (باقة VIP الشاملة 360°):</span>
          <span>24,900 جنيه مصري فقط</span>
        </div>

        <div class="guarantee-box">
          <strong>الضمانات الهندسية والقانونية:</strong>
          نضمن قبول ونشر التطبيق على Google Play Store بنسبة 100% بدون أي رفض يتعلق بـ 16KB Page Alignment، مع ضمان صيانة ودعم فني هندسي مجاني لمدة 6 أشهر كاملة.
        </div>

        <div class="footer">
          تم إنشاء هذا المستند آلياً عبر منظومة <strong>NBrain AI Studio</strong> | للتأكيد وبدء التنفيذ: 01552282852
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // Handle Query Submission with Real-time Word-by-Word Streaming
  async function handleAiQuery(queryText) {
    const cleanQuery = (queryText || '').trim();
    if (!cleanQuery && !currentAttachedImage) return;

    const userFileToSend = currentAttachedImage;

    // Append user message with thumbnail/file if present
    const displayText = cleanQuery || (userFileToSend ? `📎 [مرفق للتحليل: ${userFileToSend.name}]` : '');
    appendMessage('user', escapeHtml(displayText), false, userFileToSend);

    // Clear input and attachments
    if (userInput) userInput.value = '';
    clearAttachedImage();

    // Check if user is asking for image generation
    const isImageGenRequest = currentAiMode === 'imggen' || /^(ارسم|ولد صورة|صمم صورة|صورة لـ|image of|generate image of)/i.test(cleanQuery);
    if (isImageGenRequest) {
      const imgHtml = generateFreeAiImage(cleanQuery);
      appendMessage('bot', imgHtml);
      return;
    }

    // Show initial typing indicator
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    const isEn = lang === 'en';
    let typingLabel = isEn ? 'Gemini 3.7 Flash is reasoning...' : 'جيميني 3.7 فلاش يستدل ويفكر هندسياً...';
    if (userFileToSend) {
      typingLabel = isEn ? 'Gemini Multimodal AI is inspecting document/image...' : 'المحرك متعدد الوسائط يفحص المستند/التصميم بدقة...';
    }

    appendMessage('bot', `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--console-text-muted);">
        <div class="chat-typing-dots"><span></span><span></span><span></span></div>
        <span>${typingLabel}</span>
      </div>
    `, true);

    // Create the active streaming bot bubble
    let streamMsgDiv = null;
    let thoughtContainer = null;
    let contentContainer = null;
    let codeContainer = null;
    let currentRenderedText = '';
    let currentRenderedThought = '';
    let hasCreatedStreamBubble = false;

    function ensureStreamBubble() {
      if (hasCreatedStreamBubble) return;
      hasCreatedStreamBubble = true;
      removeTypingIndicator();

      streamMsgDiv = document.createElement('div');
      streamMsgDiv.className = 'chat-msg chat-msg--bot';
      streamMsgDiv.innerHTML = `
        <div class="chat-msg__avatar">🤖</div>
        <div class="chat-msg__bubble">
          <div class="stream-thought-slot"></div>
          <div class="chat-bubble-content"><span class="stream-text-slot"></span><span class="streaming-cursor"></span></div>
          <div class="stream-code-slot"></div>
          <div class="chat-msg-actions" style="display:none;">
            <button type="button" class="chat-action-btn tts-btn">🔊 <span>استمع للرد</span></button>
            <button type="button" class="chat-action-btn copy-btn">📋 <span>نسخ</span></button>
            <button type="button" class="proposal-export-btn export-proposal-btn">📄 <span>عرض سعر فني رسمي</span></button>
          </div>
        </div>
      `;

      thoughtContainer = streamMsgDiv.querySelector('.stream-thought-slot');
      contentContainer = streamMsgDiv.querySelector('.stream-text-slot');
      codeContainer = streamMsgDiv.querySelector('.stream-code-slot');

      chatMessages.appendChild(streamMsgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    try {
      const selectedBudget = thinkingSelect?.value || '2048';
      const streamResult = await streamGeminiMultimodal({
        userPrompt: cleanQuery || 'قم بفحص وتحليل هذا الملف المرفق وشرح كل عناصره بدقة هندسية واقتراح الحلول المناسبة:',
        fileObj: userFileToSend,
        enableSearch: isWebSearchEnabled,
        enableCode: isCodeExecEnabled,
        thinkingBudget: selectedBudget,
        onThoughtChunk: (chunk, fullThought) => {
          ensureStreamBubble();
          currentRenderedThought = fullThought;
          if (thoughtContainer) {
            thoughtContainer.innerHTML = `
              <details class="thought-accordion" open>
                <summary class="thought-summary">🧠 مسار التفكير والاستدلال الهندسي (Thought Trace)</summary>
                <div class="thought-body">${escapeHtml(fullThought)}</div>
              </details>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        },
        onTextChunk: (chunk, fullText) => {
          ensureStreamBubble();
          currentRenderedText = fullText;
          if (contentContainer) {
            contentContainer.innerHTML = formatAiMarkdownToHtml(fullText);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        },
        onCodeChunk: (codeObj) => {
          ensureStreamBubble();
          if (codeContainer) {
            if (codeObj.type === 'code') {
              codeContainer.innerHTML += `
                <div class="code-exec-block">
                  <div class="code-exec-header">
                    <span>🐍 Python Execution</span>
                    <span>${codeObj.lang || 'PYTHON'}</span>
                  </div>
                  <pre><code class="language-python">${escapeHtml(codeObj.code)}</code></pre>
                </div>
              `;
            } else if (codeObj.type === 'output') {
              codeContainer.innerHTML += `
                <div class="code-exec-output">
                  <strong>النتيجة (Output):</strong>
                  <pre style="margin:4px 0 0 0;">${escapeHtml(codeObj.output || '')}</pre>
                </div>
              `;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        }
      });

      if (!streamResult.ok) {
        // Fallback with typewriter streaming simulation
        ensureStreamBubble();
        const fallbackRaw = streamResult.text || getLocalSmartFallback(cleanQuery);
        await simulateTypewriterStream(fallbackRaw, contentContainer, () => {
          finalizeStreamBubble(streamMsgDiv, fallbackRaw);
        });
        return;
      }

      finalizeStreamBubble(streamMsgDiv, currentRenderedText);

    } catch (err) {
      ensureStreamBubble();
      const fallbackText = getLocalSmartFallback(cleanQuery);
      await simulateTypewriterStream(fallbackText, contentContainer, () => {
        finalizeStreamBubble(streamMsgDiv, fallbackText);
      });
    }
  }

  // Typewriter Streaming Helper for Fallbacks or smooth rendering
  function simulateTypewriterStream(fullText, targetSlot, onComplete) {
    return new Promise((resolve) => {
      const words = fullText.split(' ');
      let index = 0;
      let currentAcc = '';

      const interval = setInterval(() => {
        if (index >= words.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
          resolve();
          return;
        }
        currentAcc += (index > 0 ? ' ' : '') + words[index];
        if (targetSlot) {
          targetSlot.innerHTML = formatAiMarkdownToHtml(currentAcc);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        index++;
      }, 35);
    });
  }

  // Finalize Streaming Bubble
  function finalizeStreamBubble(msgDiv, fullText) {
    if (!msgDiv) return;
    const cursor = msgDiv.querySelector('.streaming-cursor');
    if (cursor) cursor.remove();

    const textSlot = msgDiv.querySelector('.stream-text-slot');
    if (textSlot && fullText) {
      textSlot.innerHTML = formatAiMarkdownToHtml(fullText, true);
    }

    const actions = msgDiv.querySelector('.chat-msg-actions');
    if (actions) {
      actions.style.display = 'flex';
      bindBotBubbleActions(msgDiv);
    }

    // Auto-close thought trace accordion smoothly on finish
    const thoughtAcc = msgDiv.querySelector('.thought-accordion');
    if (thoughtAcc) {
      thoughtAcc.removeAttribute('open');
    }

    // If voice mode active, auto-speak response
    if (currentAiMode === 'voice') {
      const ttsBtn = msgDiv.querySelector('.tts-btn');
      if (ttsBtn) {
        speakAiText(fullText, ttsBtn);
      }
    }
  }

  // Attachment Handling (Images, PDFs, Documents)
  function clearAttachedImage() {
    currentAttachedImage = null;
    if (fileInput) fileInput.value = '';
    if (attachmentBar) attachmentBar.style.display = 'none';
    if (attachBtn) attachBtn.classList.remove('is-active');
  }

  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const base64 = dataUrl.split(',')[1];
        currentAttachedImage = {
          mimeType: file.type || 'application/pdf',
          base64: base64,
          dataUrl: dataUrl,
          name: file.name,
          isImage: isImg
        };

        if (attachmentThumb && attachmentFileIcon) {
          if (isImg) {
            attachmentThumb.src = dataUrl;
            attachmentThumb.style.display = 'block';
            attachmentFileIcon.style.display = 'none';
          } else {
            attachmentThumb.style.display = 'none';
            attachmentFileIcon.style.display = 'inline';
            attachmentFileIcon.textContent = file.name.endsWith('.pdf') ? '📄' : '📝';
          }
        }
        if (attachmentName) attachmentName.textContent = file.name;
        if (attachmentBar) attachmentBar.style.display = 'flex';
        if (attachBtn) attachBtn.classList.add('is-active');
      };
      reader.readAsDataURL(file);
    });
  }

  if (attachmentRemoveBtn) {
    attachmentRemoveBtn.addEventListener('click', clearAttachedImage);
  }

  // Voice Recording (Speech-to-Text)
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (micBtn && voiceBar) {
    micBtn.addEventListener('click', () => {
      if (isVoiceRecording) {
        stopVoiceRecording();
        return;
      }
      startVoiceRecording();
    });

    if (voiceCancelBtn) {
      voiceCancelBtn.addEventListener('click', stopVoiceRecording);
    }
  }

  function startVoiceRecording() {
    if (!SpeechRec) {
      alert('متصفحك الحالي لا يدعم ميزة التسجيل الصوتي المباشر (Web Speech API). يرجى استخدام Google Chrome أو Edge.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      recognition.lang = lang === 'en' ? 'en-US' : 'ar-EG';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        isVoiceRecording = recognition;
        micBtn.classList.add('is-recording');
        voiceBar.style.display = 'flex';
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (userInput) userInput.value = transcript;
      };

      recognition.onend = () => {
        stopVoiceRecording();
        if (userInput && userInput.value.trim().length > 0) {
          handleAiQuery(userInput.value);
        }
      };

      recognition.onerror = () => {
        stopVoiceRecording();
      };

      recognition.start();
    } catch (e) {
      stopVoiceRecording();
    }
  }

  function stopVoiceRecording() {
    if (isVoiceRecording) {
      try { isVoiceRecording.stop(); } catch (e) {}
      isVoiceRecording = null;
    }
    if (micBtn) micBtn.classList.remove('is-recording');
    if (voiceBar) voiceBar.style.display = 'none';
  }

  // Tool Toggles (Web Search & Code Exec)
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      isWebSearchEnabled = !isWebSearchEnabled;
      searchToggle.classList.toggle('is-active', isWebSearchEnabled);
    });
  }

  if (codeToggle) {
    codeToggle.addEventListener('click', () => {
      isCodeExecEnabled = !isCodeExecEnabled;
      codeToggle.classList.toggle('is-active', isCodeExecEnabled);
    });
  }

  // Mode Switcher Tabs
  const modePresets = {
    advisor: [
      { q: "معايا 5999 جنيه وعايز أشتري تشكيلة ممتازة، ترشحلي إيه؟", label: "💡 ميزانية 5,999 ج.م (متجر ذكي)" },
      { q: "عايز أطلق متجر إلكتروني مع تطبيق موبايل على جوجل بلاي، إيه أنسب خطة لي؟", label: "🚀 إطلاق تطبيق ومتجر متكامل" },
      { q: "محتاج إضافة كروم ذكية لأتمتة أعمال فريلانسر أو تحميل", label: "🧩 إضافة متصفح Chrome مخصصة" }
    ],
    vision: [
      { q: "قم بفحص تصميم الواجهة التالي واقترح تحسينات تجربة المستخدم UX والألوان والـ Spatial Layout:", label: "🎨 تدقيق واجهة وتجربة المستخدم" },
      { q: "حلل لقطة الشاشة واستخرج كود البرمجة أو بنية قاعدة البيانات منها:", label: "💻 استخراج وفحص الأكواد" }
    ],
    document: [
      { q: "قم بتلخيص كراسة الشروط (RFP) التالية واستخرج أهم المتطلبات الهندسية وجدول التسليم:", label: "📄 تلخيص كراسة شروط RFP" },
      { q: "فحص القوائم المالية أو جدول الأسعار واستخراج البنود والتكلفة الإجمالية بدقة:", label: "📊 تحليل جداول البيانات والأسعار" }
    ],
    imggen: [
      { q: "صمم واجهة تطبيق موبايل عصرية بالذكاء الاصطناعي لمتجر إلكتروني فخم", label: "🎨 تصميم واجهة تطبيق متجر" },
      { q: "ارسم شعار لوجو هندسي ذكي لشركة تقنية وذكاء اصطناعي", label: "✨ توليد شعار لوجو شركة" }
    ],
    deepresearch: [
      { q: "قم ببحث هندسي وسوقي عميق عن متطلبات تطبيقات Android 15 ومعايير 16KB Page Alignment ومقارنتها بالسوق", label: "🔬 بحث عميق: معايير Android 15" },
      { q: "أجرِ دراسة سوقية شاملة لمتاجر التجارة الإلكترونية وتطبيقات الـ AI في مصر لعام 2026", label: "📈 دراسة سوق التجارة الإلكترونية" }
    ],
    video: [
      { q: "لخص هذا الفيديو من يوتيوب واستخرج أهم النقاط والمحاور: https://www.youtube.com/watch?v=dQw4w9WgXcQ", label: "🎬 تلخيص فيديو يوتيوب" },
      { q: "فيديو تدريب أو مراجعة برمجية: استخرج الخطوات البرمجية والـ Timestamps", label: "⏱️ استخراج الخطوات والـ Timestamps" }
    ],
    code: [
      { q: "اكتب كود بايثون لحساب معدل التحويل ومبيعات المتجر ونفذه الآن", label: "🐍 حساب معدل التحويل والمبيعات" },
      { q: "نفذ كود بايثون لحساب معادلة العائد على الاستثمار ROI للباقة VIP مقارنة بالتوظيف", label: "📊 حساب معادلة ROI بايثون" }
    ],
    voice: [
      { q: "أهلاً بك يا نديم! عرفني باختصار عن منظومة NBrain وما تقدمه لرواد الأعمال؟", label: "🎙️ اسأل صوتياً عن NBrain" },
      { q: "ما هي شروط وضمانات نشر التطبيقات على Google Play لعام 2026؟", label: "📱 شروط Google Play 2026" }
    ],
    search: [
      { q: "ابحث في الويب عن أحدث متطلبات Google Play 16KB Page Alignment لشهر مارس 2026", label: "🌐 شروط Google Play المحدثة" },
      { q: "ابحث عن أحدث أسعار وتكاليف استضافة الـ Cloud وحسابات المطورين", label: "🔍 أسعار الاستضافات السحابية" }
    ],
    mentor: [
      { q: "كيف أقوم بتجهيز مشروعي Flutter ليتوافق مع معيار 16KB Page Alignment في Android 15 خطوة بخطوة؟", label: "🎓 دليل 16KB Page Alignment" },
      { q: "اشرحلي أفضل نمط معماري (Clean Architecture vs Feature-first) لمشروع متجر كبير", label: "🏗️ أفضل معمارية برمجية" }
    ]
  };

  function updatePresetsForMode(mode) {
    if (!presetContainer) return;
    const presets = modePresets[mode] || modePresets.advisor;
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    const labelText = lang === 'en' ? 'Quick Try Presets:' : 'أمثلة سريعة للتجربة:';

    let html = `<span class="presets-label">${labelText}</span>`;
    presets.forEach(p => {
      html += `<button type="button" class="preset-btn" data-query="${escapeHtml(p.q)}">${p.label}</button>`;
    });

    presetContainer.innerHTML = html;
    bindPresetEvents();
  }

  function bindPresetEvents() {
    const btns = presetContainer?.querySelectorAll('.preset-btn') || [];
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        handleAiQuery(query);
      });
    });
  }

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const mode = tab.getAttribute('data-mode');
      currentAiMode = mode;

      if (currentModeBadge) {
        const icon = tab.querySelector('.ai-mode-tab__icon')?.textContent || '';
        const title = tab.querySelector('span:last-child')?.textContent || '';
        currentModeBadge.textContent = `${icon} ${title}`;
      }

      // Auto-toggle relevant tools
      if (mode === 'code') {
        isCodeExecEnabled = true;
        if (codeToggle) codeToggle.classList.add('is-active');
      } else if (mode === 'search' || mode === 'deepresearch') {
        isWebSearchEnabled = true;
        if (searchToggle) searchToggle.classList.add('is-active');
      } else if (mode === 'vision' || mode === 'document') {
        if (!currentAttachedImage && fileInput) {
          fileInput.click();
        }
      } else if (mode === 'voice') {
        startVoiceRecording();
      }

      updatePresetsForMode(mode);
    });
  });

  // Submit Events
  if (submitBtn && userInput) {
    submitBtn.addEventListener('click', () => {
      handleAiQuery(userInput.value);
    });

    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAiQuery(userInput.value);
      }
    });
  }

  // Clear History
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      aiConversationHistory = [];
      clearAttachedImage();
      stopVoiceRecording();
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      if (chatMessages) {
        const lang = document.documentElement.getAttribute('lang') || 'ar';
        const isEn = lang === 'en';
        chatMessages.innerHTML = `
          <div class="chat-msg chat-msg--bot">
            <div class="chat-msg__avatar">🤖</div>
            <div class="chat-msg__bubble">
              ${isEn 
                ? 'Chat session refreshed! How can I assist you with your project today?' 
                : 'تم بدء جلسة محادثة جديدة! كيف يمكنني مساعدتك في تطوير مشروعك اليوم؟'}
            </div>
          </div>
        `;
      }
    });
  }

  bindPresetEvents();
}

/* ==========================================================================
   8. Interactive Package Customizer
   ========================================================================= */
function updateCustomizerSummary() {
  const checkboxes = document.querySelectorAll('.customizer__checkbox');
  const countBadge = document.getElementById('selected-count-badge');
  const itemsList = document.getElementById('selected-items-list');
  const timelineEl = document.getElementById('estimated-timeline');
  const requestQuoteBtn = document.getElementById('request-quote-btn');

  const lang = document.documentElement.getAttribute('lang') || 'ar';
  const isEn = lang === 'en';

  const selectedItems = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      selectedItems.push({
        id: cb.getAttribute('data-id'),
        nameAr: cb.getAttribute('data-name-ar') || cb.getAttribute('data-name'),
        nameEn: cb.getAttribute('data-name-en') || cb.getAttribute('data-name'),
        time: cb.getAttribute('data-time')
      });
    }
  });

  if (countBadge) {
    countBadge.textContent = isEn
      ? `${selectedItems.length} items selected`
      : `${selectedItems.length} عناصر مختارة`;
  }

  if (itemsList) {
    if (selectedItems.length === 0) {
      itemsList.innerHTML = isEn
        ? `<p style="color: var(--console-text-muted); font-size: 0.85rem;">No components selected yet. Pick items from the left.</p>`
        : `<p style="color: var(--console-text-muted); font-size: 0.85rem;">لم يتم اختيار أي مكون بعد. اختر ما يناسبك من القائمة.</p>`;
    } else {
      itemsList.innerHTML = selectedItems.map(item => `
        <div class="summary-item">
          <span class="text-success">✓</span>
          <span>${isEn ? item.nameEn : item.nameAr}</span>
        </div>
      `).join('');
    }
  }

  if (timelineEl) {
    if (selectedItems.length === 0) {
      timelineEl.textContent = isEn ? '0 days' : '0 أيام';
    } else if (selectedItems.length <= 2) {
      timelineEl.textContent = isEn ? '3 - 5 business days' : '3 - 5 أيام عمل';
    } else if (selectedItems.length <= 4) {
      timelineEl.textContent = isEn ? '7 - 10 business days' : '7 - 10 أيام عمل';
    } else {
      timelineEl.textContent = isEn ? '10 - 14 business days' : '10 - 14 يوم عمل';
    }
  }

  if (requestQuoteBtn) {
    const namesList = selectedItems.map(i => isEn ? i.nameEn : i.nameAr).join(' + ');
    const whatsappMsg = isEn
      ? `Hello Eng. Nadeem, I customized a package on nbra.in including: (${namesList}). I would like to request a quote and project roadmap.`
      : `مرحباً مهندس نديم، قمت بتخصيص باقة على منصة nbra.in تتضمن: (${namesList}). أود معرفة عرض السعر والبدء في التنفيذ.`;

    requestQuoteBtn.onclick = () => {
      const url = `https://wa.me/201552282852?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(url, '_blank');
    };
  }
}

function initCustomizer() {
  const checkboxes = document.querySelectorAll('.customizer__checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateCustomizerSummary);
  });
  updateCustomizerSummary();
}

/* ==========================================================================
   9. Portfolio Category Filter
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectBoxes = document.querySelectorAll('.project-box');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectBoxes.forEach(box => {
        const categories = box.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          box.style.display = 'flex';
        } else {
          box.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9.1 Demos & Video Category Filter
   ========================================================================== */
function initDemosFilter() {
  const filterBtns = document.querySelectorAll('.demo-filter-btn');
  const demoCards = document.querySelectorAll('.demos-grid .demo-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      demoCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   10. Sidebar Search Filter
   ========================================================================== */
function initSidebarSearch() {
  const searchInput = document.getElementById('sidebarSearch');
  const navLinks = document.querySelectorAll('.nav-link');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes(query)) {
          link.style.display = 'flex';
        } else {
          link.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   11. Interactive RFP / Project Brief Modal
   ========================================================================== */
function initRfpModal() {
  const rfpModal = document.getElementById('rfpModal');
  const openBtn = document.getElementById('openRfpModalBtn');
  const closeBtn = document.getElementById('closeRfpModalBtn');
  const cancelBtn = document.getElementById('cancelRfpBtn');
  const submitBtn = document.getElementById('submitRfpBtn');
  const openProBtn = document.getElementById('openRfpFromProBtn');

  function openRfp() {
    if (rfpModal) rfpModal.classList.add('is-open');
  }

  function closeRfp() {
    if (rfpModal) rfpModal.classList.remove('is-open');
  }

  if (openBtn) openBtn.addEventListener('click', openRfp);
  if (openProBtn) openProBtn.addEventListener('click', openRfp);
  if (closeBtn) closeBtn.addEventListener('click', closeRfp);
  if (cancelBtn) cancelBtn.addEventListener('click', closeRfp);

  if (rfpModal) {
    rfpModal.addEventListener('click', (e) => {
      if (e.target === rfpModal) closeRfp();
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const lang = document.documentElement.getAttribute('lang') || 'ar';
      const isEn = lang === 'en';

      const name = document.getElementById('rfpClientName')?.value.trim();
      const phone = document.getElementById('rfpPhone')?.value.trim();
      const budget = document.getElementById('rfpBudget')?.value;
      const timeline = document.getElementById('rfpTimeline')?.value;
      const notes = document.getElementById('rfpNotes')?.value.trim();

      if (!name || !phone) {
        alert(isEn ? 'Please enter your name and phone / WhatsApp number to proceed' : 'يرجى كتابة الاسم ورقم الهاتف/الواتساب للمتابعة');
        return;
      }

      const selectedServices = [];
      document.querySelectorAll('input[name="rfpServices"]:checked').forEach(cb => {
        selectedServices.push(cb.value);
      });

      const servicesText = selectedServices.length > 0
        ? selectedServices.join('\n- ')
        : (isEn ? 'No specific services checked' : 'لم يتم تحديد خدمات معينة');

      const whatsappText = isEn
        ? `🚀 *New Project RFP Request (nbra.in)*
──────────────────
👤 *Client / Organization:* ${name}
📞 *Contact Number:* ${phone}
💰 *Estimated Budget:* ${budget}
⏳ *Required Timeline:* ${timeline}

🛠️ *Requested Services & Modules:*
- ${servicesText}

📝 *Project Brief & Notes:*
${notes || 'No extra notes provided'}
──────────────────
_Sent via NBrain Enterprise Portal (nbra.in)_`
        : `🚀 *طلب عرض سعر وخطة مشروع جديدة (nbra.in)*
──────────────────
👤 *العميل / الشركة:* ${name}
📞 *رقم التواصل:* ${phone}
💰 *الميزانية المرصودة:* ${budget}
⏳ *الجدول الزمني المطلوب:* ${timeline}

🛠️ *الخدمات والمكونات المطلوبة:*
- ${servicesText}

📝 *نبذة عن الفكرة والمتطلبات:*
${notes || 'لا توجد ملاحظات إضافية'}
──────────────────
_تم إرسال هذا الطلب عبر بوابة NBrain الرسمية_`;

      const url = `https://wa.me/201552282852?text=${encodeURIComponent(whatsappText)}`;
      window.open(url, '_blank');
      closeRfp();
      if (rfpForm) rfpForm.reset();
    });
  }
}

/* ==========================================================================
   14. Internationalization & Language Switcher (AR / EN)
   ========================================================================== */
var i18nDict = {
  ar: {
    // Sidebar & Navigation
    nav_title: "المنظومة والخدمات",
    nav_overview: "نظرة عامة (Overview)",
    nav_packages: "الباقات والمنظومة الشاملة VIP",
    nav_industries: "حلول القطاعات (Industries)",
    nav_models: "نماذج التعاقد المرنة",
    nav_workflow: "منهجية العمل الهندسية",
    nav_techstack: "مصفوفة التقنيات لعام 2026",
    nav_demos: "معرض الفيديوهات والديمو (28)",
    nav_aidemo: "المساعد الذكي (Live Demo)",
    nav_ai_demo: "المساعد الذكي (Live Demo)",
    nav_roicalc: "حاسبة العائد والتوفير ROI",
    nav_roi: "حاسبة العائد والتوفير ROI",
    nav_customizer: "حاسبة تخصيص الباقة",
    nav_portfolio: "سابقة الأعمال الموثقة",
    nav_guarantees: "الضمانات و SLAs الهندسية",
    nav_faq: "الأسئلة التقنية الشائعة",
    nav_founder: "المؤسس والقيادة الهندسية",
    sidebar_contact_label: "استشارة فورية مع المهندس:",
    whatsapp_btn_label: "محادثة واتساب مباشرة",
    call_direct: "اتصال هاتفي مباشر",
    sidebar_search_placeholder: "بحث في الخدمات والأقسام...",

    // Mobile Bottom Navigation
    mob_nav_overview: "الرئيسية",
    mob_nav_packages: "الباقات VIP",
    mob_nav_demos: "المعرض (28)",
    mob_nav_customizer: "المخصص",
    mob_nav_contact: "استشارة",

    // Breadcrumbs & Header
    bc_org: "منظومة NBrain",
    bc_portal: "بوابة الخدمات والحلول البرمجية المتقدمة",
    bc_current: "نظرة عامة والمنظومة",
    bc_whatsapp: "تواصل واتساب",
    hero_title: "منظومة NBrain للبرمجيات والذكاء الاصطناعي",
    services_counter: "14 قسم و 28 مشروعاً حياً",
    hero_subtitle: "استوديو تطوير البرمجيات وحلول الـ AI المخصصة: مواقع ويب سريعة، تطبيقات Google Play (16KB Aligned)، شات بوتس مبيعات، رؤية حاسوبية، وتهيئة SEO دولية.",
    btn_rfp: "طلب عرض سعر مخصص (RFP)",
    btn_whatsapp: "تواصل عبر واتساب فوراً",
    lang_btn: "English (EN)",

    // Workspace Tabs
    tab_overview: "نظرة عامة",
    tab_packages: "الباقات الشاملة VIP",
    tab_industries: "حلول القطاعات",
    tab_models: "نماذج التعاقد",
    tab_workflow: "منهجية العمل",
    tab_techstack: "مصفوفة التقنيات",
    tab_demos: "الفيديوهات والديمو",
    tab_aidemo: "المساعد الذكي",
    tab_roicalc: "حاسبة العائد ROI",
    tab_customizer: "حاسبة الباقات",
    tab_portfolio: "سابقة الأعمال",
    tab_guarantees: "الضمانات SLAs",
    tab_faq: "الأسئلة الشائعة",
    tab_founder: "المؤسس",

    // Section 1: Overview & Hero
    hero_badge_text: "المنظومة الهندسية الأولى لدمج البرمجيات المتقدمة بالذكاء الاصطناعي العميق",
    hero_headline_html: "نبني لك <span class=\"text-gradient\">منصتك الرقمية المتكاملة 360°</span> بأحدث معايير 2026",
    hero_subtext_p: "من موقع ويب متطور وتطبيق موبايل رسمي على Google Play متوافق مع معمارية (16KB Page Alignment)، إلى شات بوت بيع وترشيحات ذكي، تأمين سيبراني شامل، وفيديو إعلاني سينمائي لمشروعك بالـ AI.",
    metric1_title: "جاهزية Google Play (Android 15)",
    metric2_title: "Page Alignment & NDK r28",
    metric3_title: "مساعدات وترشيحات ذكية للعملاء",
    metric4_title: "تأمين سيبراني ودروع حماية شاملة",

    // Section 2: Packages (ChatGPT Pricing Style)
    pricing_headline: "ترقية المنظومة وحزم الأعمال",
    pricing_subheadline: "اختر المستوى الهندسي الأنسب لإطلاق وتوسيع مشروعك بأعلى معايير الأداء والذكاء الاصطناعي",
    price_currency: "EGP",
    recommended_badge: "RECOMMENDED",
    
    // Plus Plan
    plan_plus_name: "Plus",
    plan_plus_price: "9,999",
    plan_plus_period: "EGP / مشروع شامل السورس كود",
    plan_plus_tagline: "إطلاق فوري وتجربة كاملة أساسية للشركات والمشاريع الواعدة",
    plan_plus_btn: "تخصيص باقة Plus",
    plan_plus_f1: "موقع ويب تعريفي فائق السرعة وتفاعلي بالكامل",
    plan_plus_f2: "مساعد ذكي للرد الآلي وتجميع بيانات العملاء 24/7",
    plan_plus_f3: "حجز دومين خاص واستضافة سحابية فائقة الأداء مجاناً",
    plan_plus_f4: "شهادة أمان SSL ودروع حماية Cloudflare WAF",
    plan_plus_f5: "ربط فوري بنظام واتساب ونماذج استفسار مباشرة",
    plan_plus_f6: "تهيئة SEO أولية لتصدر الكلمات المفتاحية بمحركات البحث",
    plan_plus_link: "طلب استفسار مخصص عن الباقة",

    // Business Plan (Recommended) - 10 Features from Freelance QR Banner
    plan_business_name: "Business (VIP 360°)",
    plan_biz_price: "24,900",
    plan_biz_period: "EGP / منظومة شاملة من الألف للياء",
    plan_biz_tagline: "الحل الأقوى لتحويل فكرتك إلى منصة متكاملة: ويب وموبايل ولوحة تحكم وتسويق في مكان واحد",
    plan_biz_btn: "احجز باقة Business VIP الآن 🚀",
    plan_biz_f1_html: "<strong>موقع ويب كامل وحديث:</strong> SPA سريع أو لوحة تحكم متطورة",
    plan_biz_f2_html: "<strong>تطبيق موبايل على Google Play:</strong> مهيأ بالكامل Android 15 + 16KB Page Aligned",
    plan_biz_f3_html: "<strong>مساعد ذكي للبيع والترشيحات:</strong> مثل محرك ترشيح المنتجات بالميزانية",
    plan_biz_f4_html: "<strong>تهيئة SEO دولية ومحرك متعدد اللغات:</strong> Schema.org, OpenGraph & i18n",
    plan_biz_f5_html: "<strong>تأمين سيبراني شامل:</strong> DDoS Shield, Firewall, Data Encryption",
    plan_biz_f6_html: "<strong>فيديو إعلاني ترويجي بالذكاء الاصطناعي:</strong> فيديو احترافي يوضح المنظومة للعملاء",
    plan_biz_f7_html: "<strong>دومين احترافي + استضافة سحابية:</strong> مهيأة ومجانية بالكامل",
    plan_biz_f8_html: "<strong>لوحة إدارة المحتوى والطلبات:</strong> مع إحصائيات نمو حية",
    plan_biz_f9_html: "<strong>دعم فني وصيانة متميزة:</strong> بعد التسليم لضمان الاستقرار",
    plan_biz_f10_html: "<strong>أول MVP للمشروع خلال يوم أو يومين <span class=\"c-badge-new\">NEW 🔥</span>:</strong> تبدأ سريعاً وتختبر فكرتك فوراً",
    plan_biz_footnote: "شامل الملكية الفكرية الكاملة للكود • بدون أي اشتراكات خفية",

    // Pro Plan
    plan_pro_name: "Pro",
    plan_pro_price: "54,000+",
    plan_pro_period: "EGP / حلول مؤسسية و Vision مخصصة",
    plan_pro_tagline: "حلول برمجية وذكاء اصطناعي عميق ونماذج رؤية حاسوبية مصممة لاحتياجاتك",
    plan_pro_btn: "طلب استشارة وتخصيص Pro",
    plan_pro_lead: "تشمل كل مزايا باقة Business بالإضافة إلى:",
    plan_pro_f1: "أنظمة رؤية حاسوبية مخصصة (Computer Vision & YOLOv12x)",
    plan_pro_f2: "إضافات متصفح Chrome & Edge متوافقة مع Manifest V3",
    plan_pro_f3: "تدريب ودمج نماذج LLM خاصة ومحركات RAG متطورة",
    plan_pro_f4: "معمارية سحابية مخصصة لتحمل ملايين الطلبات المتزامنة",
    plan_pro_f5: "اتفاقية مستوى خدمة SLA هندسية مخصصة 24/7",
    plan_pro_link: "طلب استشارة هندسية مخصصة مع المؤسس",

    // Trust & Value Assurance Bar
    trust_stat1_title: "35+ مشروعاً حياً",
    trust_stat1_desc: "تم تسليمها بنجاح للشركات ورواد الأعمال",
    trust_stat2_title: "MVP خلال 24 - 48 ساعة",
    trust_stat2_desc: "إطلاق تجريبي فوري لاختبار فكرتك",
    trust_stat3_title: "أمان Zero-Trust وضمان 6 شهور",
    trust_stat3_desc: "مع ملكية فكرية 100% لكود المشروع",
    trust_stat4_title: "تواصل مباشر مع المؤسس",
    trust_stat4_desc: "استشارات هندسية مع م. نديم بدر",

    // Bottom CTA
    pricing_see_all: "قارن كافة المزايا أو ركب ميزانيتك عبر الحاسبة التفاعلية",

    // Legacy compatibility aliases
    sec_packages_tag: "الباقات المتكاملة",
    sec_packages_heading: "باقات جاهزة تمنحك منظومة رقمية كاملة من الألف للياء",

    // Section 3: Industry Matrix
    sec_industries_tag: "مصفوفة الحلول القطاعية (Industry Matrix)",
    sec_industries_heading: "حلول برمجية وذكية مفصلة خصيصاً لكل قطاع ومجال",
    sec_industries_subtext: "نصمم ونبني المنظومة التي تحل تحديات مجالك بدقة وتمنحك ميزة تنافسية كبرى أمام منافسيك.",
    ind1_title: "قطاع التجارة والمتاجر (E-Commerce)",
    ind1_desc: "متجر إلكتروني فائق السرعة + تطبيق موبايل على Google Play + شات بوت مبيعات ذكي يرشح المنتجات بميزانية العميل + ربط الدفع والواتساب.",
    ind1_f1: "مساعد مبيعات AI يغلق الصفقات 24/7",
    ind1_f2: "تطبيق متوافق 100% مع Android 15",
    ind1_f3: "ربط بوابات الدفع (Paymob, Fawry, ValU)",

    ind2_title: "قطاع التعليم والمنصات (EdTech & LMS)",
    ind2_desc: "منصة تعليمية ذكية على غرار Coursera و NanoGrad، تدعم حماية الفيديوهات من التحميل، اختبارات تفاعلية، وشهادات إتمام رقمية معتمدة.",
    ind2_f1: "مشغل فيديو محمي ومضاد للتسريب",
    ind2_f2: "بنك أسئلة وتصحيح تلقائي بالذكاء الاصطناعي",
    ind2_f3: "تطبيق موبايل للطلاب والمعلمين",

    ind3_title: "النقل والسلامة المرورية (Mobility & Vision)",
    ind3_desc: "أنظمة رؤية حاسوبية لمراقبة السائقين واكتشاف النعاس والتشتت في الوقت الفعلي + تتبع حركة المرور وكشف المخالفات بـ YOLOv12x.",
    ind3_f1: "إنذار لحظي عند إغماض العين أو التثاؤب",
    ind3_f2: "تتبع أسطول السيارات وكاميرات المراقبة",
    ind3_f3: "لوحة تحكم مركزية بإحصائيات القيادة",

    ind4_title: "الشركات وتحليل المستندات (Document AI)",
    ind4_desc: "تطبيقات قراءة وتلخيص وفهرسة المستندات والملفات الضخمة (PDF, Excel, Word) بالذكاء الاصطناعي مع إمكانية استخراج البيانات وطرح الأسئلة الذكية.",
    ind4_f1: "تلخيص مئات الصفحات في ثوانٍ بالـ AI",
    ind4_f2: "بحث دلالي ذكي واستخراج الأرقام والجداول",
    ind4_f3: "ربط مباشر بالسحابة و Google Drive",

    ind5_title: "أدوات المتصفح والأتمتة (Browser Tools)",
    ind5_desc: "بناء وتطوير إضافات كروم وإيدج (Manifest V3) المخصصة لأتمتة سير العمل، سحب البيانات (Scraping)، ومحركات التحميل المجزأ متعددة المسارات.",
    ind5_f1: "نشر معتمد على Chrome Web Store",
    ind5_f2: "واجهات Dark Mode مدمجة داخل المتصفح",
    ind5_f3: "تكامل كامل مع خوادم الـ Backend",

    ind6_title: "السياحة والإرشاد الذكي (AI Tour Guide)",
    ind6_desc: "تطبيقات المرشد السياحي الذكي (مثل مشروع Anubis AI)، تتعرف بالكاميرا على المعالم والآثار وتقدم شات بوت ناطق بـ 18 لغة مختلفة.",
    ind6_f1: "تعرف بصري لحظي بدقة >90%",
    ind6_f2: "شات بوت تفاعلي متعدد اللغات",
    ind6_f3: "توليد صور تاريخية بـ Stable Diffusion",

    // Section 4: Models
    sec_models_tag: "نماذج التعاقد والشراكة (Engagement Models)",
    sec_models_heading: "طرق تعاقد مرنة وشفافة تناسب مرحلة مشروعك وميزانيتك",
    sec_models_subtext: "اختر النموذج الأنسب لك سواء كنت تبدأ فكرة جديدة، أو تحتاج تسليم مشروع جاهز، أو تريد دعماً مستمراً.",
    model1_badge: "الأكثر شعبية لرواد الأعمال",
    model1_title: "تسليم المشروع المتكامل (Turnkey Fixed-Price)",
    model1_desc: "نتفق على نطاق العمل، السعر الثابت، وموعد التسليم. نتولى نحن كافة مراحل التصميم، البرمجة، التأمين، والنشر على السحابة والمتاجر.",
    model1_f1: "تسعير ثابت بدون أي تكاليف خفية",
    model1_f2: "جدول زمني دقيق ومحدد للتسليم",
    model1_f3: "ضمان تسليم واختبار شامل قبل الدفع النهائي",
    model1_f4: "كود مصدري كامل ملك لك بنسبة 100%",
    model1_btn: "طلب تسعيرة Turnkey",

    model2_badge: "لإطلاق الأفكار السريعة ⚡",
    model2_title: "إطلاق النموذج الأولي السريع (Fast-Track MVP / PoC)",
    model2_desc: "نبني لك نموذجاً أولياً فعالاً (MVP) لمشروعك أو نظام الذكاء الاصطناعي خلال 7 إلى 14 يوماً فقط لاختبار السوق وجذب المستثمرين والعملاء الأوائل.",
    model2_f1: "تسليم فائق السرعة خلال 7 - 14 يوم عمل",
    model2_f2: "تركيز على الميزات الجوهرية (Core Value)",
    model2_f3: "تكلفة اقتصادية ممتازة ومناسبة للمرحلة الأولى",
    model2_f4: "قابلية التوسع إلى منظومة كاملة بسهولة",
    model2_btn: "ابدأ بناء الـ MVP الآن",

    model3_badge: "للشركات والمشاريع القائمة",
    model3_title: "فريق الدعم والتطوير المستمر (Dedicated Retainer)",
    model3_desc: "فريق هندسي متخصص مكرس لمشروعك لمتابعة الأداء، الصيانة الدورية، إضافة ميزات جديدة بالـ AI، وحماية السيرفرات والتطبيقات على مدار الساعة.",
    model3_f1: "استجابة فورية لأي طوارئ أو تحديثات",
    model3_f2: "ترقية دورية لمعايير Google Play والأمان",
    model3_f3: "تدريب وصيانة نماذج الذكاء الاصطناعي",
    model3_f4: "تقارير شهرية مفصلة للأداء والحماية",
    model3_btn: "استفسر عن الـ Retainer",

    // Section 5: Workflow
    sec_workflow_tag: "منهجية العمل الهندسية (Engineering Workflow)",
    sec_workflow_heading: "كيف نحول فكرتك إلى منظومة برمجية حية في 6 خطوات منظمة",
    sec_workflow_subtext: "خطوات واضحة وشفافة تضمن لك متابعة دقيقة لمشروعك وجودة هندسية بلا مفاجآت.",
    step1_title: "دراسة المتطلبات والمعمارية",
    step1_desc: "جلسة استشارية متعمقة لفهم أهداف مشروعك وتحديد المعمارية الهندسية ونماذج الـ AI والتقنيات الأنسب.",
    step2_title: "تصميم الواجهات وتجربة المستخدم",
    step2_desc: "بناء النماذج التفاعلية وواجهات الـ UI/UX بنظام الألوان HSL والـ Dark Mode العصري لتجربة مستخدم لا تُنسى.",
    step3_title: "البرمجة وهندسة الذكاء الاصطناعي",
    step3_desc: "كتابة كود نظيف (Clean Architecture)، دمج نماذج Gemini AI، بناء الـ APIs، وبرمجة تطبيقات الموبايل والويب.",
    step4_title: "الفحص الأمني ومعايير Google Play",
    step4_desc: "فحص شامل للأمان، اختبار التوافق مع معيار 16KB Page Alignment على أجهزة Android 15، والتأكد من خلو التطبيق من الـ Crashes.",
    step5_title: "النشر السحابي والإنتاج المرئي",
    step5_desc: "رفع التطبيق على Google Play، تجهيز الدومين والخوادم، وإنتاج الفيديو الإعلاني الترويجي السينمائي بالـ AI.",
    step6_title: "التسليم والضمان المجاني",
    step6_desc: "تسليم الكود المصدري كاملاً، تدريبك على لوحة التحكم، وبدء فترة الضمان والصيانة المجانية لـ 30 يوماً.",

    // Section 6: Tech Stack
    sec_techstack_tag: "مصفوفة التقنيات (Tech Stack Matrix)",
    sec_techstack_heading: "أحدث التقنيات وأطر العمل الهندسية المعتمدة لعام 2026",
    sec_techstack_subtext: "نستخدم فقط أحدث وأقوى التقنيات المستقرة والسريعة عالمياً لضمان عمر تشغيلي طويل لمنصتك.",
    tech_box1_title: "منصات الويب السريعة والتطبيقات التفاعلية",
    tech_box1_desc: "بناء تطبيقات ويب فائقة السرعة مع زمن تحميل أقل من ثانية وتوافقية تامة مع كافة الشاشات والمتصفحات الحديثة.",
    tech_box2_title: "تطبيقات الموبايل الممتثلة لمعايير Google Play 2026",
    tech_box2_desc: "تطوير تطبيقات Google Play و App Store بأحدث معمارية Flutter 3.29 الممتثلة لمتطلب 16KB Page Alignment و Android 15.",
    tech_box3_title: "محركات ونماذج الذكاء الاصطناعي والرؤية الحاسوبية",
    tech_box3_desc: "دمج نماذج Gemini 3.7 Flash وشبكات الرؤية الحاسوبية YOLOv12x لتشخيص وفحص البيانات والصور ونظم التتبع اللحظي بدقة >95%.",
    tech_box4_title: "الخوادم السحابية والأمان ومقاومة الهجمات",
    tech_box4_desc: "بنية سحابية قوية مقاومة لهجمات DDoS مع خوادم موزعة وقواعد بيانات سريعة توفر جاهزية 99.9% وأماناً مصرفياً كاملاً.",
    tech_box5_title: "محرك الـ SEO الذكي والتوسع الدولي ثنائي اللغة",
    tech_box5_desc: "تهيئة دولية متعددة اللغات وتصدر نتائج بحث Google بدرجات Core Web Vitals 99+ وبطاقات تواصل اجتماعي مدمجة وبيانات هيكلية Schema.org.",

    // Section 7: Video Showcase & Demos (28 Live Projects)
    sec_demos_tag: "معرض العروض المرئية والمشاريع الحية (Master Video & Projects Gallery)",
    sec_demos_heading: "شاهد فيديوهات الاستعراض الحي وجرب المنصات والتطبيقات مباشرة!",
    sec_demos_subtext: "أكثر من 28 مشروعاً ونظاماً برمجياً بالذكاء الاصطناعي والموبايل والويب والواقع المعزز، موثقة بالفيديو الحي والروابط التجريبية.",
    yt_banner_title: "قناة اليوتيوب الرسمية للمهندس نديم بدر (@VibeCodingCV)",
    yt_banner_desc: "جميع عروض المشاريع والأنظمة مسجلة وموثقة بالفيديو الحي بجودة عالية — تفضل بزيارة القناة والاشتراك",
    yt_banner_btn: "زيارة القناة على YouTube",
    filter_all_demos: "🌟 جميع المشاريع والعروض (28)",
    filter_video_demos: "🎬 فيديوهات اليوتيوب الحية (16)",
    filter_ai_demos: "🧠 الذكاء الاصطناعي والرؤية (18)",
    filter_mobile_demos: "📱 الموبايل و Google Play (6)",
    filter_web_demos: "🌐 منصات الويب والـ Cloud (8)",
    filter_ar_demos: "🎮 الواقع المعزز والألعاب AR (5)",

    // Shared Action Button Labels
    btn_play_video: "تشغيل الفيديو",
    btn_watch_video: "🎬 مشاهدة الفيديو",
    btn_project_code: "💻 كود المشروع",
    btn_youtube: "📺 YouTube",
    btn_google_play_page: "📱 صفحة Google Play",
    btn_flutter_code: "💻 كود Flutter (26K سطر)",
    btn_live_demo: "🚀 تجربة النظام الحي",
    btn_video_engine_code: "💻 كود محرك الفيديو",
    btn_app_code: "💻 كود التطبيق",
    btn_system_code: "💻 كود المنظومة",
    btn_open_erp: "فتح منصة ERP",
    btn_open_yasta: "فتح منصة يسطا",
    btn_open_editor: "استعراض المحرر",
    btn_open_app: "استعراض التطبيق",
    btn_open_dashboard: "فتح اللوحة",
    btn_open_book: "معاينة المنصة",
    btn_open_pen: "تفاصيل المنظومة",
    btn_open_face: "تفاصيل النظام",
    btn_open_game: "استعراض اللعبة 3D",
    btn_open_safqa: "فتح سوق صفقة",
    btn_tech_details: "💡 التفاصيل التقنية",
    btn_github_repo: "💻 المستودع على GitHub",
    btn_open_google_play: "فتح Google Play",

    // 28 Demo Projects Cards
    demo1_title: "نبض مصر (Nadeem CXR Medical AI)",
    demo1_desc: "تشخيص 14 مرضاً صدرياً من أشعة الصدر (CXR) بدقة >92% وتوليد تقارير طبية باللغة العربية.",
    demo2_title: "Anubis AI Smart Tour Guide 🏛️",
    demo2_desc: "مرشد سياحي تفاعلي بـ 18 لغة + تعرف لحظي على الآثار بـ MobileNetV2 وتوليد صور تاريخية.",
    demo3_title: "Football AI Analytics Suite ⚽📊",
    demo3_desc: "تتبع اللاعبين والكرة، قياس السرعة ومناطق الاستحواذ، وإنشاء شاشات إحصائية آلية بالفيديو.",
    demo4_title: "منصة AI4Roadmap للتعلم الذكي 🗺️",
    demo4_desc: "توليد مسارات تعلم تقنية مخصصة بالذكاء الاصطناعي مع اختبارات تقييم وتوصيات مصادر.",
    demo5_title: "نظام تتبع وحصر المرور بـ YOLO 🚗",
    demo5_desc: "تتبع وحصر المركبات في الحارات المرورية وكشف السير العكسي والانسدادات بنموذج YOLOv12x.",
    demo6_title: "كشف نعاس وتشتت السائق 😴",
    demo6_desc: "مراقبة الـ EAR و MAR بالرؤية الحاسوبية لحماية السائقين وتنبيههم فوراً عند التشتت أو النوم.",
    demo7_title: "المحاور الصوتي الذكي (Smart AI HR) 🎙️",
    demo7_desc: "إجراء مقابلات التوظيف الصوتية بالذكاء الاصطناعي وتقييم المرشحين وتوليد تقارير أداء شاملة.",
    demo8_title: "الفرش والتصميم المعماري الافتراضي 🏠",
    demo8_desc: "تحويل الغرف الفارغة إلى تصاميم ديكور واقعية ومفروشة بالذكاء الاصطناعي لشركات العقارات.",
    demo9_title: "المساعد الذكي للمنظومة الجامعية (HITU) 🎓",
    demo9_desc: "مساعد ذكي للطلاب وأعضاء هيئة التدريس لمنظومة جامعة حلوان التكنولوجية الدولية.",
    demo10_title: "محلل أداء اللاعبين الرياضيين 🏃‍♂️",
    demo10_desc: "قياس السرعة والتسارع والمجهود البدني للاعبين في الوقت الفعلي عبر الرؤية الحاسوبية.",
    demo11_title: "نظام الأمان للمحلات والمتاجر 🚨",
    demo11_desc: "كشف السرقات والسلوكيات المشبوهة في المتاجر والمولات لحظياً وتوليد تنبيهات أمنية فورية.",
    demo12_title: "البيانو الافتراضي بالواقع المعزز 🎹",
    demo12_desc: "عزف البيانو في الهواء بدون لمس عبر تتبع حركة ومفاصل الأصابع بالواقع المعزز (MediaPipe AR).",
    demo13_title: "استوديو أعياد الميلاد التفاعلي AR 🎉",
    demo13_desc: "تجربة احتفالات وأعياد ميلاد تفاعلية بالواقع المعزز مع تأثيرات ومؤثرات صوتية بحركات اليد.",
    demo14_title: "التحكم في الألعاب بالإيماءات بدون لمس 🎮",
    demo14_desc: "لعب وتحكم كامل في لعبة Subway Surfers بحركات اليد والقفز في الهواء بدون لمس الكيبورد.",
    demo15_title: "التحكم القتالي في الألعاب (AR Combat) 🥊",
    demo15_desc: "تحكم قتالي بالرؤية الحاسوبية وحركات اللكمات والركلات في الهواء بدون دراع تحكم.",
    demo16_title: "روبوت الأتمتة الذكي (LegendBot V1.0) 🤖",
    demo16_desc: "أتمتة العمليات المتكررة وإدارة الخوادم وتنفيذ المهام المعقدة بالـ AI بسرعة فائقة.",
    demo17_title: "SmartDocs AI Reader (Google Play) 📄",
    demo17_desc: "تطبيق موبايل رسمي منشور على جوجل بلاي لتحليل وتلخيص المستندات بالـ AI (26K سطر Flutter).",
    demo18_title: "منظومة Nile ERP السحابية 🏭",
    demo18_desc: "إدارة موارد الشركات والمخازن والفواتير الإلكترونية والمبيعات بلوحة تحكم 3-Column متطورة.",
    demo19_title: "منصة يسطا (Yasta) للخدمات الذكية 🛠️",
    demo19_desc: "حجز ومطابقة الفنيين والخدمات المنزلية بنظام ذكي وتتبع مباشر ومدفوعات إلكترونية آمنة.",
    demo20_title: "محرر الفيديو والمونتاج السحابي بالـ AI 🎬",
    demo20_desc: "محرر فيديو سحابي فائق السرعة لقص ودمج الفيديوهات وتوليد التأثيرات بـ Node.js و FFmpeg.",
    demo21_title: "تطبيق نظام المحاسبي (Nizam App) 📱",
    demo21_desc: "تطبيق موبايل للمحاسبة السريعة وإدارة الفواتير والديون اليومية للتجار والشركات الناشئة.",
    demo22_title: "لوحة تحليل النقاط السوداء للحوادث 📊",
    demo22_desc: "لوحة معلومات ذكية لتحليل مناطق الحوادث الحرجة وتقديم توصيات هندسية لتقليل المخاطر.",
    demo23_title: "منصة الكتاب التفاعلي الذكي (Smart Book) 📚",
    demo23_desc: "تحويل الكتب المدرسية والجامعية إلى كتب تفاعلية مع شات بوت ذكي مدمج يجيب على أي فقرة.",
    demo24_title: "منظومة القلم الذكي (Smart Pen Suite) 📱",
    demo24_desc: "تطبيق وتكامل هاردوير لتحويل الكتابة اليدوية والرسومات إلى نصوص رقمية فورية بالـ AI.",
    demo25_title: "التعرف اللحظي على الوجوه (Biometrics) 👤",
    demo25_desc: "نظام بصمة وجه لحظي لإدارة الحضور والدخول الأمني بدقة فائقة باستخدام Deep Learning و OpenCV.",
    demo26_title: "لعبة المدينة ثلاثية الأبعاد (3D City Game) 🏙️",
    demo26_desc: "بيئة عالم مفتوح ثلاثية الأبعاد بفيزياء ورسوميات متقدمة تعمل على المتصفح عبر WebGL و Three.js.",
    demo27_title: "إطار الشبكات العصبية من الصفر (NanoGrad) 🧠",
    demo27_desc: "بناء محرك حساب التدرج العكسي (Backpropagation) والشبكات العصبية في بايثون بدون مكتبات خارجية.",
    demo28_title: "سوق ومنصة صفقة برو (Safqa Pro) 🤝",
    demo28_desc: "منصة وساطة مالية وحماية للمشتري والبائع (Escrow) مع تطبيق موبايل Flutter متكامل.",

    // Section 8: Multimodal AI Studio
    sec_aidemo_tag: "منظومة الذكاء الاصطناعي متعددة الوسائط (Multimodal AI Suite)",
    sec_aidemo_heading: "المساعد الذكي الخارق: نصوص، فحص صور، صوت، يوتيوب، وتشغيل أكواد",
    sec_aidemo_subtext: "جرب إمكانيات Gemini 3.7 Flash الشاملة: تحدث صوتياً، ارفع صوراً وتصاميم للتحليل، فكك روابط الفيديو، أو اطلب تشغيل كود بايثون وبحث الويب المباشر.",
    ai_tab_advisor: "مستشار الحلول والمبيعات",
    ai_tab_vision: "فحص الصور والواجهات (Vision)",
    ai_tab_doc: "فحص الـ PDF والمستندات",
    ai_tab_imggen: "توليد الصور والشعارات",
    ai_tab_research: "البحث الهندسي العميق",
    ai_tab_video: "تحليل الفيديو ويوتيوب",
    ai_tab_code: "تشغيل بايثون والأكواد",
    ai_tab_voice: "المحادثة الصوتية (TTS)",
    ai_tab_search: "بحث الويب المباشر",
    ai_tab_mentor: "المرشد البرمجي (LearnLM)",
    ai_sim_name: "NBrain Multimodal AI Studio",
    ai_sim_engine_badge: "مدعوم بمحرك Gemini 3.7 Flash",
    ai_voice_label: "🎙️ الصوت:",
    ai_emotion_label: "🎭 النبرة:",
    ai_sim_welcome_html: "أهلاً بك! 👋 أنا المساعد الذكي الخارق لمنظومة <strong>NBrain</strong> مدعوماً بـ <strong>Gemini 3.7 Flash</strong>.<br><br>يمكنني الآن مساعدتك في:<br><ul><li>💬 <strong>ترشيح وتخصيص الباقات البرمجية</strong> فوراً حسب ميزانيتك.</li><li>📷 <strong>فحص وتحليل الصور والتصاميم والمستندات</strong> بمجرد رفعها.</li><li>🎬 <strong>تلخيص وتحليل فيديوهات يوتيوب</strong> بمجرد وضع الرابط.</li><li>🎙️ <strong>التحدث الصوتي المباشر</strong> بالمايك وقراءة الردود صوتياً (TTS).</li><li>🐍 <strong>تشغيل كود بايثون وحساب المعادلات والأرقام بدقة.</strong></li></ul><strong>جرب إرسال سؤالك، رفع صورة، أو استخدام الأزرار السريعة بالأسفل!</strong>",
    ai_sim_presets_label: "أمثلة سريعة للتجربة:",
    ai_sim_input_placeholder: "اكتب سؤالك، أو الصق رابط يوتيوب، أو اضغط على المايك/الصور...",
    ai_sim_send_btn: "إرسال",

    // Section 9: ROI Calculator
    sec_roicalc_tag: "حاسبة العائد الاستثماري (AI ROI Calculator)",
    sec_roicalc_heading: "احسب كم ستوفر وتربح بدمج الذكاء الاصطناعي والأتمتة في مشروعك!",
    sec_roicalc_subtext: "حرك المؤشرات لمعرفة ساعات العمل المهدرة والتكاليف التي يوفرها لك المساعد الذكي شهرياً.",
    roi_label_inquiries: "عدد استفسارات / رسائل العملاء شهرياً:",
    roi_label_order: "متوسط قيمة الطلب / السلعة (ج.م):",
    roi_label_hours: "عدد ساعات موظفي خدمة العملاء أسبوعياً:",
    roi_res_hours_label: "الوقت الموفر شهرياً بالأتمتة:",
    roi_res_hours_sub: "يعادل عمل موظف ونصف بدوام كامل",
    roi_res_sales_label: "الزيادة التقديرية في المبيعات بالـ AI:",
    roi_res_sales_sub: "عبر سرعة الرد اللحظي واقتراح المنتجات بالميزانية",
    roi_cta_btn: "تفعيل المساعد الذكي لمشروعي فوراً",

    // Section 10: Customizer
    sec_customizer_tag: "صمم باقتك بنفسك",
    sec_customizer_heading: "حاسبة ومخصص باقات المشروعات المباشرة",
    sec_customizer_subtext: "حدد المكونات التي يحتاجها مشروعك بدقة، وسنقوم بحساب الخطة والجدول الزمني التقديري للتنفيذ فوراً.",
    cust_item1_title: "موقع ويب متكامل (Modern Web App)",
    cust_item1_badge: "أساسي",
    cust_item1_desc: "واجهة مستخدم حديثة بـ React / Next.js، سريعة ومتجاوبة مع لوحة تحكم كاملة.",
    cust_item2_title: "تطبيق موبايل رسمي على Google Play Store",
    cust_item2_badge: "الأكثر طلباً",
    cust_item2_desc: "تطبيق Flutter أصلي متوافق مع Android 15 ومعيار 16KB Page Alignment.",
    cust_item3_title: "شات بوت ذكي ومساعد مبيعات بالـ AI",
    cust_item3_badge: "Gemini GenAI",
    cust_item3_desc: "مساعد ذكي للرد على العملاء وترشيح المنتجات بناءً على الميزانية وتسهيل العمليات.",
    cust_item4_title: "تأمين سيبراني ودروع حماية شاملة",
    cust_item4_badge: "حماية قصوى",
    cust_item4_desc: "حماية من هجمات الحرمان من الخدمة (DDoS)، تشفير SSL، وجدران نارية سحابية.",
    cust_item5_title: "فيديو ترويجي سينمائي بالذكاء الاصطناعي",
    cust_item5_badge: "تسويق احترافي",
    cust_item5_desc: "فيديو عالي الجودة مع تعليق صوتي سينمائي جاهز للنشر على منصات التواصل والإعلانات.",
    cust_item6_title: "إضافة مخصصة لمتصفح Chrome & Edge",
    cust_item6_badge: "اختياري",
    cust_item6_desc: "إضافة متصفح لأتمتة المهام، أو تنزيل الملفات، أو دمج خدمات موقعك بالمتصفح مباشرة.",
    cust_item7_title: "دومين مخصص واستضافة سحابية فائقة السرعة",
    cust_item7_badge: "مجاناً بالباقة",
    cust_item7_desc: "إعداد الدومين والـ DNS والخوادم السحابية بدون أي تعقيدات تقنية من طرفك.",
    cust_summary_title: "ملخص الباقة المخصصة",
    cust_summary_timeline_label: "مدة التنفيذ التقديرية:",
    cust_summary_warranty_label: "الدعم الفني والضمان:",
    cust_summary_warranty_val: "مشمول بالكامل ✅",
    cust_summary_note: "💡 أسعارنا مرنة وتنافسية جداً وتعتمد على حجم متطلباتك الدقيقة مع إمكانية الدفع على مراحل.",
    cust_summary_btn: "اطلب تسعيرة هذه الباقة عبر واتساب",

    // Section 11: Portfolio
    sec_portfolio_tag: "سابقة الأعمال والابتكارات",
    sec_portfolio_heading: "مشاريع ومنصات حقيقية تم بناؤها وإطلاقها",
    filter_all_port: "الكل",
    filter_ai_port: "الذكاء الاصطناعي & Vision",
    filter_mobile_port: "الموبايل و Google Play",
    filter_web_port: "منصات الويب & Cloud",
    filter_tools_port: "إضافات المتصفح والأدوات",

    port1_title: "Anubis AI Smart Tour Guide",
    port1_desc: "منصة مرشد سياحي ذكي للحضارة المصرية بالذكاء الاصطناعي مع شات بوت هجين وتعرف لحظي على التماثيل بدقة >90%.",
    port2_title: "NanoGrad LMS & Deep Tech",
    port2_desc: "منصة تعليمية متكاملة للـ AI مستوحاة من Coursera مع تطبيق Android متوافق مع Android 15 وشهادات رقمية معتمدة.",
    port3_title: "Safqa Pro Marketplace",
    port3_desc: "منصة وسوق وساطة مالية آمنة (Escrow) 100% مع تطبيق موبايل Flutter متكامل على متجر Google Play.",
    port4_title: "Nitro Download Manager (NDM)",
    port4_desc: "بديل IDM مفتوح المصدر بتحميل مجزأ متعدد المسارات (Multi-Threaded Range) مع إضافة متصفح لكروم وإيدج.",
    port5_title: "SmartDocs AI Reader (Google Play)",
    port5_desc: "تطبيق Flutter رسمي منشور على متجر Google Play لتحليل وتلخيص المستندات مدعوم بـ Gemini AI و Drive API (26,000+ سطر كود).",
    port6_title: "Nile ERP Enterprise System",
    port6_desc: "منظومة سحابية متطورة لإدارة موارد الشركات والمخازن والفواتير الإلكترونية والمبيعات بلوحة تحكم 3-Column متقدمة.",
    port7_title: "Smart Traffic & Driver Vision",
    port7_desc: "نظام مراقبة السائق وكشف النعاس والتشتت في الوقت الفعلي + تحليل حركة المرور وكشف السير العكسي بـ YOLOv12x.",

    // Section 12: Guarantees & SLAs
    sec_guarantees_tag: "الضمانات الهندسية ومطابقة المعايير (SLAs)",
    sec_guarantees_heading: "التزام صارم بالجودة وضمانات تمنحك راحة البال التامة",
    sec_guarantees_subtext: "نطبق أعلى المعايير الهندسية الصارمة لحماية مشروعك وضمان نجاحه الفني والقانوني والأمني.",
    guar1_badge: "100% Guaranteed",
    guar1_title: "ضمان قبول Google Play 2026",
    guar1_desc: "نضمن قبول ونشر تطبيقك على Google Play Store بدون أي رفض متعلق بمعمارية 16KB Page Alignment أو Target SDK 35 أو سياسات الأمان.",
    guar2_badge: "Zero-Trust",
    guar2_title: "حماية سيبرانية وتشفير تام",
    guar2_desc: "تأمين شامل ضد هجمات الـ DDoS والحرمان من الخدمة، وتشفير بيانات المستخدمين (End-to-End SSL)، ومطابقة معايير OWASP للويب والموبايل.",
    guar3_badge: "99.9% Uptime",
    guar3_title: "استقرار الخوادم والسحاب",
    guar3_desc: "بنية تحتية سحابية موزعة تضمن سرعة تحميل فائقة وتوفر الموقع والتطبيق بنسبة 99.9% دون أي توقف مفاجئ.",
    guar4_badge: "Free Warranty",
    guar4_title: "ضمان مجاني بعد التسليم",
    guar4_desc: "نقدم فترة دعم فني وصيانة مجانية لمدة 30 يوماً بعد التسليم لمعالجة أي ملاحظات وضمان الاستقرار التشغيلي التام.",

    // Section 13: FAQ
    sec_faq_tag: "الأسئلة الشائعة (FAQ)",
    sec_faq_heading: "إجابات واضحة وحاسمة على أكثر الأسئلة التي يطرحها عملاؤنا",
    faq_q1: "ما هو معيار 16KB Page Alignment ولماذا هو إلزامي لتطبيقات Google Play في 2026؟",
    faq_a1: "جوجل فرضت بدءاً من Android 15 دعماً إلزامياً لحجم صفحات الذاكرة 16KB للأجهزة الحديثة لتحسين أداء الرام وسرعة فتح التطبيقات بنسبة تصل لـ 30%. التطبيقات التي تستخدم مكتبات C/C++ قديمة أو NDK غير مهيأة سيتم رفضها على المتجر. نحن في NBrain نبني تطبيقات Flutter و Native باستخدام NDK r28 ومكتبات 16KB-aligned بنسبة 100% لضمان القبول الفوري.",
    faq_q2: "هل الكود المصدري (Source Code) وحسابات المنصة تكون ملكي بالكامل؟",
    faq_a2: "نعم، 100%! نحن لا نحتكر كودك. فور استكمال المشروع، يتم تسليم كامل الكود المصدري على مستودع GitHub خاص بك، مع نقل ملكية الدومين، السيرفرات، وقواعد البيانات وحسابات المتجر تحت إدارتك المباشرة.",
    faq_q3: "كيف يتم تدريب وضبط شات بوت المبيعات بالـ AI ليعرف منتجات متجري؟",
    faq_a3: "نقوم بربط نموذج Gemini AI مباشرة بقاعدة بيانات متجرك أو ملفات المنتجات والأسعار عبر تقنية الـ RAG (Retrieval-Augmented Generation). هذا يجعل المساعد يعرف الأسعار والخصومات لحظياً، ويرشح السلع بدقة للمشتري حسب ميزانيته، ويساعده في إتمام الطلب عبر واتساب أو الدفع الإلكتروني.",
    faq_q4: "ما هي خيارات وطرق الدفع وهل يمكن السداد على مراحل؟",
    faq_a4: "نعم بكل تأكيد! نظام السداد مرن جداً ويتم على دفعات مرحلية (دفعة بدء + دفعة عند اعتماد التصميم والنموذج الأولي + دفعة نهائية عند التسليم والاختبار). ندعم الدفع عبر التحويل البنكي، فودافون كاش / إنستاباي، والبطاقات البنكية.",
    faq_q5: "كيف يتم إنتاج الفيديو الإعلاني الترويجي بالذكاء الاصطناعي وما هي جودته؟",
    faq_a5: "نستخدم أحدث نماذج توليد الفيديو والصور السينمائية بالـ AI لإنتاج فيديو إعلاني بدقة 4K مع تعليق صوتي احترافي (Voiceover) ومؤثرات صوتية وموسيقى مرخصة، يوضح مميزات مشروعك وخدماتك ويكون جاهزاً للنشر الفوري على إنستجرام، فيسبوك، وتيك توك.",

    // Section 14: Founder
    sec_founder_tag: "القيادة الهندسية لمنظومة NBrain",
    founder_role_badge: "Chief Software Architect",
    founder_name: "المهندس نديم بدر",
    founder_title: "مهندس برمجيات وذكاء اصطناعي — جامعة حلوان التكنولوجية الدولية (HITU IT & AI)",
    founder_bio: "قائد منظومة NBrain AI Ecosystem ومطور حلول الذكاء الاصطناعي وتطبيقات الويب والموبايل عالية الأداء. متخصص في هندسة النظم العميقة، نماذج الرؤية الحاسوبية (YOLO & MediaPipe)، نماذج الـ Generative AI، ومعمارية أندرويد الحديثة (16KB Page Alignment).",
    founder_linkedin_btn: "LinkedIn",
    founder_facebook_btn: "Facebook",
    founder_github_btn: "GitHub",
    founder_whatsapp_btn: "💬 تواصل مباشر عبر واتساب",

    // Modals
    rfp_modal_title: "طلب عرض سعر وخطة تنفيذ مخصصة (Request for Proposal)",
    rfp_modal_subtitle: "حدد تفاصيل مشروعك وسيقوم النظام بتجهيز ملخص تقني شامل لإرساله فوراً للمهندس نديم بدر",
    rfp_label_name: "اسمك الكريم / اسم الشركة *",
    rfp_placeholder_name: "مثال: أحمد عبد الله - شركة النيل",
    rfp_label_phone: "رقم الواتساب / الهاتف *",
    rfp_placeholder_phone: "مثال: +201012345678",
    rfp_label_services: "الخدمات والمكونات المطلوبة في مشروعك:",
    rfp_srv_web: "🌐 موقع ويب متطور",
    rfp_srv_app: "📱 تطبيق Google Play",
    rfp_srv_bot: "🤖 شات بوت ذكي Gemini AI",
    rfp_srv_video: "🎬 فيديو إعلاني بالـ AI",
    rfp_srv_ext: "🧩 إضافة متصفح كروم",
    rfp_srv_vision: "🚗 نظام رؤية حاسوبية",
    rfp_srv_cloud: "🛡️ استضافة وتأمين سحابي",
    rfp_label_budget: "الميزانية التقريبية المرصودة:",
    rfp_label_timeline: "الجدول الزمني المفضل للإطلاق:",
    rfp_label_notes: "نبذة مختصرة عن فكرة مشروعك أو أي روابط مرجعية:",
    rfp_placeholder_notes: "اكتب نبذة عن فكرة متجرك أو تطبيقك، نوع المنتجات، أو أي ميزات خاصة تريد إضافتها...",
    rfp_btn_cancel: "إلغاء",
    rfp_btn_submit: "إرسال وتوليد عرض السعر عبر واتساب 🚀",

    media_modal_title: "العرض التوضيحي للمشروع",
    media_modal_close: "إغلاق",
    media_modal_action: "طلب مشروع مماثل عبر واتساب",

    // Context Menu
    ctx_copy: "نسخ النص المحدد",
    ctx_aidemo: "المساعد الذكي (AI Studio)",
    ctx_packages: "استعراض الباقات والأسعار",
    ctx_rfp: "طلب عرض سعر رسمي (RFP)",
    ctx_whatsapp: "استشارة مباشرة عبر واتساب",
    ctx_theme: "تبديل المظهر (Dark / Light)",
    ctx_lang: "تغيير اللغة (EN / عربي)",
    ctx_reload: "تحديث المنظومة"
  },
  en: {
    // Sidebar & Navigation
    nav_title: "SYSTEM & SERVICES",
    nav_overview: "Overview & Metrics",
    nav_packages: "VIP Enterprise Bundles",
    nav_industries: "Industry Solutions Matrix",
    nav_models: "Engagement Models",
    nav_workflow: "Engineering Workflow",
    nav_techstack: "2026 Tech Stack Radar",
    nav_demos: "Master Video Showcase (28)",
    nav_aidemo: "AI Sales Advisor Demo",
    nav_ai_demo: "AI Sales Advisor Demo",
    nav_roicalc: "ROI & Savings Calculator",
    nav_roi: "ROI & Savings Calculator",
    nav_customizer: "Package Customizer",
    nav_portfolio: "Verified Portfolio",
    nav_guarantees: "SLAs & Guarantees",
    nav_faq: "Technical FAQ",
    nav_founder: "Founder & Leadership",
    sidebar_contact_label: "Direct Architect Consultation:",
    whatsapp_btn_label: "WhatsApp Consultation",
    call_direct: "Direct Phone Call",
    sidebar_search_placeholder: "Search services, stacks, demos...",

    // Mobile Bottom Navigation
    mob_nav_overview: "Overview",
    mob_nav_packages: "VIP Packages",
    mob_nav_demos: "Demos (28)",
    mob_nav_customizer: "Builder",
    mob_nav_contact: "Consultation",

    // Breadcrumbs & Header
    bc_org: "NBrain Ecosystem",
    bc_portal: "Advanced Software Architecture Portal",
    bc_current: "System Overview",
    bc_whatsapp: "WhatsApp Chat",
    hero_title: "NBrain Software Architecture & Custom AI Systems",
    services_counter: "14 Sections & 28 Live Systems",
    hero_subtitle: "Production-grade custom software & AI studio: High-speed Web, Google Play Ready Mobile Apps (Android 15 / 16KB Page Aligned), AI Sales Bots, Computer Vision & Global SEO.",
    btn_rfp: "Request Proposal (RFP)",
    btn_whatsapp: "Instant WhatsApp Chat",
    lang_btn: "العربية (AR)",

    // Workspace Tabs
    tab_overview: "Overview",
    tab_packages: "VIP Packages",
    tab_industries: "Industry Matrix",
    tab_models: "Engagement Models",
    tab_workflow: "Engineering Workflow",
    tab_techstack: "Tech Stack Radar",
    tab_demos: "Video & Demos (28)",
    tab_aidemo: "AI Sales Advisor",
    tab_roicalc: "ROI Calculator",
    tab_customizer: "Package Builder",
    tab_portfolio: "Portfolio",
    tab_guarantees: "SLAs & Guarantees",
    tab_faq: "Technical FAQ",
    tab_founder: "Leadership",

    // Section 1: Overview & Hero
    hero_badge_text: "Enterprise Platform Unifying High-Performance Software with Deep AI",
    hero_headline_html: "Architecting Your <span class=\"text-gradient\">Complete 360° Digital Platform</span> Built for 2026",
    hero_subtext_p: "From high-speed Web platforms and official Google Play mobile apps (Android 15 / 16KB Page Aligned) to Gemini AI sales bots, robust cybersecurity, and cinematic AI promo videos.",
    metric1_title: "Google Play Ready (Android 15)",
    metric2_title: "16KB Page Aligned & NDK r28",
    metric3_title: "Gemini AI Sales & Recommenders",
    metric4_title: "Zero-Trust Cybersecurity Shield",

    // Section 2: Packages (ChatGPT Pricing Style)
    pricing_headline: "Upgrade Your Ecosystem",
    pricing_subheadline: "Choose the right engineering tier to build, scale, and automate your operations with cutting-edge AI",
    price_currency: "EGP",
    recommended_badge: "RECOMMENDED",

    // Plus Plan
    plan_plus_name: "Plus",
    plan_plus_price: "9,999",
    plan_plus_period: "EGP / turnkey project (inclusive of source code)",
    plan_plus_tagline: "Unlock the full essential experience for growing startups & businesses",
    plan_plus_btn: "Customize Plus Plan",
    plan_plus_f1: "Ultra-fast, fully responsive corporate & service web app",
    plan_plus_f2: "24/7 Gemini AI customer service & lead capture assistant",
    plan_plus_f3: "Custom domain name & high-speed cloud hosting included",
    plan_plus_f4: "SSL security certificate & Cloudflare DDoS/WAF protection",
    plan_plus_f5: "Instant WhatsApp lead integration & custom contact forms",
    plan_plus_f6: "Technical SEO foundation & search engine indexation",
    plan_plus_link: "I need help with a custom requirement",

    // Business Plan (Recommended) - 10 Features from Freelance QR Banner
    plan_business_name: "Business (VIP 360°)",
    plan_biz_price: "24,900",
    plan_biz_period: "EGP / complete ecosystem (inclusive of VAT & source code)",
    plan_biz_tagline: "The ultimate solution: Web, Mobile, Dashboard, AI & Marketing all in one unified platform",
    plan_biz_btn: "Add Business VIP Workspace 🚀",
    plan_biz_f1_html: "<strong>Modern Full Web Platform:</strong> High-speed SPA or Advanced Dashboard",
    plan_biz_f2_html: "<strong>Official Google Play Mobile App:</strong> Fully aligned for Android 15 & 16KB NDK r28",
    plan_biz_f3_html: "<strong>Smart AI Sales & Recommenders:</strong> Gemini-powered budget matcher & closer",
    plan_biz_f4_html: "<strong>International SEO & Multilingual Engine:</strong> Schema.org, OpenGraph & i18n",
    plan_biz_f5_html: "<strong>Full Cybersecurity Shield:</strong> DDoS Shield, Firewall & Data Encryption",
    plan_biz_f6_html: "<strong>Cinematic 4K AI Promo Video:</strong> Professional promotional video with voiceover",
    plan_biz_f7_html: "<strong>Custom Domain + Cloud Hosting:</strong> Fully configured & free for the 1st year",
    plan_biz_f8_html: "<strong>Content & Order Management Dashboard:</strong> With live real-time metrics",
    plan_biz_f9_html: "<strong>Dedicated Warranty & Maintenance:</strong> Post-delivery technical support & SLA",
    plan_biz_f10_html: "<strong>Rapid MVP Delivery in 24-48 Hours <span class=\"c-badge-new\">NEW 🔥</span>:</strong> Launch fast and test your idea live",
    plan_biz_footnote: "Includes 100% full IP code ownership • No hidden recurring platform fees",

    // Pro Plan
    plan_pro_name: "Pro",
    plan_pro_price: "54,000+",
    plan_pro_period: "EGP / tailored systems & computer vision",
    plan_pro_tagline: "Maximize your productivity & automate operations with bespoke vision & AI models",
    plan_pro_btn: "Upgrade to Pro Architecture",
    plan_pro_lead: "Everything in Business and:",
    plan_pro_f1: "Custom Computer Vision pipelines (YOLOv12x object detection & tracking)",
    plan_pro_f2: "Manifest V3 compliant Chrome & Edge browser extensions",
    plan_pro_f3: "On-premises fine-tuned LLMs & enterprise RAG knowledge engines",
    plan_pro_f4: "High-concurrency cloud cluster engineered for massive traffic spikes",
    plan_pro_f5: "Dedicated 24/7 engineering SLA & direct architecture consulting",
    plan_pro_link: "Direct architecture consultation with Eng. Nadeem Badr",

    // Trust & Value Assurance Bar
    trust_stat1_title: "35+ Live Projects",
    trust_stat1_desc: "Successfully delivered to founders & enterprises",
    trust_stat2_title: "MVP within 24-48 Hours",
    trust_stat2_desc: "Fast live deployment to test your market idea",
    trust_stat3_title: "Zero-Trust Security & 6-Month SLA",
    trust_stat3_desc: "100% full IP ownership of all source code",
    trust_stat4_title: "Direct Access to Lead Architect",
    trust_stat4_desc: "Engineering consulting with Eng. Nadeem Badr",

    // Bottom CTA
    pricing_see_all: "Compare all features or build your custom budget in the calculator",

    // Legacy compatibility aliases
    sec_packages_tag: "Integrated Packages",
    sec_packages_heading: "Turnkey Bundles Delivering an End-to-End Digital Ecosystem",

    // Section 3: Industry Matrix
    sec_industries_tag: "Industry Solutions Matrix",
    sec_industries_heading: "Tailored Software & AI Systems Engineered by Industry",
    sec_industries_subtext: "We architect custom platforms that tackle specific industry challenges and unlock unfair competitive advantages.",
    ind1_title: "E-Commerce & Retail Stores",
    ind1_desc: "Ultra-fast online store + Google Play mobile app + AI sales bot matching products to buyer budgets + payments & WhatsApp integration.",
    ind1_f1: "24/7 AI Sales Advisor closing orders",
    ind1_f2: "100% Android 15 & 16KB Page Aligned App",
    ind1_f3: "Payment Gateways (Paymob, Fawry, ValU, Cards)",

    ind2_title: "EdTech & LMS Platforms",
    ind2_desc: "Smart learning platform modeled after Coursera & NanoGrad, featuring anti-leak video protection, quizzes, and verified digital certificates.",
    ind2_f1: "Protected anti-piracy video player",
    ind2_f2: "AI-powered automated quiz grading & question bank",
    ind2_f3: "Mobile app for students & instructors",

    ind3_title: "Mobility, Fleet & Vision",
    ind3_desc: "Computer Vision systems for driver fatigue & distraction detection in real-time + traffic monitoring and anomaly detection with YOLOv12x.",
    ind3_f1: "Instant alerts for closed eyes or yawning",
    ind3_f2: "Fleet tracking & multi-camera surveillance",
    ind3_f3: "Centralized dashboard with driving analytics",

    ind4_title: "Enterprise Document AI",
    ind4_desc: "AI platforms for parsing, summarizing, and querying massive files (PDF, Excel, Word) with semantic search and intelligent data extraction.",
    ind4_f1: "Summarize hundreds of pages in seconds with AI",
    ind4_f2: "Semantic search & table/number extraction",
    ind4_f3: "Direct Cloud Storage & Google Drive sync",

    ind5_title: "Browser Tools & Automation",
    ind5_desc: "Custom Chrome & Edge extensions (Manifest V3) for workflow automation, web scraping, and multi-threaded range download managers.",
    ind5_f1: "Approved Chrome Web Store publication",
    ind5_f2: "Embedded modern Dark Mode browser UI",
    ind5_f3: "Full backend API synchronization",

    ind6_title: "Tourism & AI Tour Guides",
    ind6_desc: "Interactive AI tour guide apps (like Anubis AI) with real-time camera monument recognition across 18 spoken languages.",
    ind6_f1: "Real-time visual recognition (>90% accuracy)",
    ind6_f2: "Interactive multilingual voice chatbot",
    ind6_f3: "Historical scene generation with Stable Diffusion",

    // Section 4: Models
    sec_models_tag: "Engagement Models",
    sec_models_heading: "Flexible & Transparent Partnership Models for Every Stage",
    sec_models_subtext: "Choose the engagement model that fits your product stage, timeline, and budget.",
    model1_badge: "Most Popular for Founders",
    model1_title: "Turnkey Fixed-Price Project",
    model1_desc: "We agree on scope, fixed price, and delivery date. We manage all phases: design, coding, security, cloud deployment, and app store release.",
    model1_f1: "Fixed pricing with zero hidden fees",
    model1_f2: "Strict and guaranteed delivery timeline",
    model1_f3: "Comprehensive QA testing prior to final payment",
    model1_f4: "100% full source code ownership",
    model1_btn: "Request Turnkey Quote",

    model2_badge: "Rapid Ideation & Launch ⚡",
    model2_title: "Fast-Track MVP / PoC (7-14 Days)",
    model2_desc: "We build an operational Minimum Viable Product (MVP) in 7 to 14 days to test the market, validate traction, and win early investors.",
    model2_f1: "Ultra-fast delivery in 7 - 14 business days",
    model2_f2: "Laser focus on core value & user loop",
    model2_f3: "Highly cost-effective starter investment",
    model2_f4: "Effortless scalability into full enterprise architecture",
    model2_btn: "Build Your MVP Now",

    model3_badge: "For Ongoing Operations",
    model3_title: "Dedicated Engineering Retainer",
    model3_desc: "A dedicated engineering squad maintaining system uptime, adding new AI capabilities, pushing regular updates, and securing infrastructure.",
    model3_f1: "Rapid response for emergencies & feature rollouts",
    model3_f2: "Continuous upgrades for Google Play & security standards",
    model3_f3: "Maintenance and retraining of AI models",
    model3_f4: "Detailed monthly performance & audit reports",
    model3_btn: "Inquire About Retainer",

    // Section 5: Workflow
    sec_workflow_tag: "Engineering Workflow",
    sec_workflow_heading: "How We Turn Your Vision Into Live Software in 6 Rigorous Steps",
    sec_workflow_subtext: "A transparent engineering lifecycle ensuring high velocity, zero surprises, and architectural excellence.",
    step1_title: "Requirements & Architecture",
    step1_desc: "In-depth consultation to map business objectives, system architecture, optimal AI models, and scalable tech stack.",
    step2_title: "UI/UX & Design Systems",
    step2_desc: "Crafting interactive wireframes and sleek HSL Dark Mode user interfaces for a memorable, intuitive user experience.",
    step3_title: "Clean Code & AI Engineering",
    step3_desc: "Writing modular Clean Architecture code, integrating Gemini AI models, building robust APIs, and developing native apps.",
    step4_title: "Security & Google Play Verification",
    step4_desc: "Full penetration testing, Android 15 16KB Page Alignment verification on physical hardware, and crash-free validation.",
    step5_title: "Cloud Deployment & Media Production",
    step5_desc: "Releasing apps to Google Play, configuring domains & cloud CDN, and producing cinematic AI promotional marketing videos.",
    step6_title: "Delivery & Free 30-Day Warranty",
    step6_desc: "Handing over 100% source code, training your team on the dashboard, and initiating 30 days of comprehensive free maintenance.",

    // Section 6: Tech Stack
    sec_techstack_tag: "Tech Stack Matrix",
    sec_techstack_heading: "Production-Grade Frameworks & Tech Stacks Certified for 2026",
    sec_techstack_subtext: "We exclusively leverage modern, battle-tested, high-performance technologies to ensure long operational lifespan.",
    tech_box1_title: "Modern High-Speed Web Platforms & Apps",
    tech_box1_desc: "Architecting sub-second load time web applications with full responsiveness across all modern browsers and screens.",
    tech_box2_title: "Google Play 2026 Compliant Native Mobile Apps",
    tech_box2_desc: "Building Google Play and App Store apps using Flutter 3.29 strictly compliant with Android 15 and 16KB Page Alignment.",
    tech_box3_title: "AI Engines, Deep Learning & Computer Vision",
    tech_box3_desc: "Integrating Gemini 3.7 Flash and YOLOv12x neural networks for real-time diagnostics, image inspection, and telemetry tracking.",
    tech_box4_title: "Cloud Servers, Enterprise Security & DDoS Shield",
    tech_box4_desc: "Robust cloud infrastructure featuring DDoS mitigation, distributed clusters, and sub-millisecond caching with 99.9% uptime.",
    tech_box5_title: "AI SEO Engine & Bilingual Global Expansion",
    tech_box5_desc: "Dominating search rankings with 99+ Core Web Vitals, Schema.org rich snippets, and automated bilingual localization.",

    // Section 7: Video Showcase & Demos (28 Live Projects)
    sec_demos_tag: "Master Video & Projects Gallery",
    sec_demos_heading: "Watch Live Demos & Experience Real Software Systems Directly!",
    sec_demos_subtext: "Over 28 production-grade software and AI systems across Mobile, Web, Vision, and Augmented Reality, verified with live demos.",
    yt_banner_title: "Official YouTube Channel of Eng. Nadeem Badr (@VibeCodingCV)",
    yt_banner_desc: "All project demonstrations and system architectures are recorded in high-definition video — visit and subscribe to the channel",
    yt_banner_btn: "Visit YouTube Channel",
    filter_all_demos: "🌟 All Projects & Demos (28)",
    filter_video_demos: "🎬 Live YouTube Demos (16)",
    filter_ai_demos: "🧠 AI & Computer Vision (18)",
    filter_mobile_demos: "📱 Mobile & Google Play (6)",
    filter_web_demos: "🌐 Web & Cloud Platforms (8)",
    filter_ar_demos: "🎮 AR & Gesture Games (5)",

    // Shared Action Button Labels
    btn_play_video: "Play Video",
    btn_watch_video: "🎬 Watch Video",
    btn_project_code: "💻 Source Code",
    btn_youtube: "📺 YouTube",
    btn_google_play_page: "📱 Google Play Store",
    btn_flutter_code: "💻 Flutter Code (26K Lines)",
    btn_live_demo: "🚀 Live System Demo",
    btn_video_engine_code: "💻 Video Engine Code",
    btn_app_code: "💻 App Source Code",
    btn_system_code: "💻 System Code",
    btn_open_erp: "Open ERP Platform",
    btn_open_yasta: "Open Yasta Platform",
    btn_open_editor: "Open Video Editor",
    btn_open_app: "Open Mobile App",
    btn_open_dashboard: "Open Dashboard",
    btn_open_book: "Preview Platform",
    btn_open_pen: "System Details",
    btn_open_face: "System Details",
    btn_open_game: "Play 3D Game",
    btn_open_safqa: "Open Safqa Market",
    btn_tech_details: "💡 Technical Details",
    btn_github_repo: "💻 GitHub Repository",
    btn_open_google_play: "Open Google Play",

    // 28 Demo Projects Cards
    demo1_title: "Nabd Masr (Nadeem CXR Medical AI)",
    demo1_desc: "AI diagnosis of 14 thoracic diseases from chest X-rays (CXR) with >92% accuracy, generating automated Arabic medical reports.",
    demo2_title: "Anubis AI Smart Tour Guide 🏛️",
    demo2_desc: "Interactive multilingual AI tour guide with 18 languages, real-time monument recognition via MobileNetV2, and generative historical visuals.",
    demo3_title: "Football AI Analytics Suite ⚽📊",
    demo3_desc: "Computer Vision football analytics: player & ball tracking, speed & possession heatmaps, and automated video telemetry overlays.",
    demo4_title: "AI4Roadmap Smart Learning Platform 🗺️",
    demo4_desc: "Generative AI technical learning roadmaps tailored to user career goals, featuring auto-generated quizzes and curated resource recommendations.",
    demo5_title: "Smart Traffic & Vehicle Tracking with YOLO 🚗",
    demo5_desc: "Real-time lane-level vehicle tracking, directional flow counting, wrong-way detection, and congestion analytics using YOLOv12x.",
    demo6_title: "Driver Drowsiness & Distraction Monitoring 😴",
    demo6_desc: "Real-time EAR & MAR facial landmark monitoring via Computer Vision to detect driver microsleeps, yawning, and distractions with instant audible alerts.",
    demo7_title: "Smart AI HR Voice Interviewer 🎙️",
    demo7_desc: "Automated conversational AI conducting voice interviews, evaluating candidate responses, and generating comprehensive recruitment scorecards.",
    demo8_title: "Pro Virtual Staging & Architectural AI 🏠",
    demo8_desc: "Transforming empty rooms into photo-realistic furnished architectural spaces with generative AI for real estate firms.",
    demo9_title: "HITU University Smart AI Assistant 🎓",
    demo9_desc: "Intelligent academic guide for students and faculty of Helwan International Technological University (HITU).",
    demo10_title: "Athletic Performance & Motion Analyzer 🏃‍♂️",
    demo10_desc: "Real-time speed, acceleration, and physical exertion tracking for athletes using advanced Computer Vision pose estimation.",
    demo11_title: "Smart Retail & Mall Security AI 🚨",
    demo11_desc: "Real-time theft prevention, suspicious behavior detection, and instant security dispatch alerts for retail stores and malls.",
    demo12_title: "Touchless Virtual Piano AR 🎹",
    demo12_desc: "Play piano mid-air with zero physical touch by tracking hand joints and finger articulation with MediaPipe AR.",
    demo13_title: "Interactive Birthday Studio AR 🎉",
    demo13_desc: "Immersive AR celebration experience with real-time gesture-triggered visual effects, confetti, and spatial sound.",
    demo14_title: "Touchless Gesture Gaming Controller 🎮",
    demo14_desc: "Full-body motion and jump controls for Subway Surfers in mid-air without touching keyboard or mouse.",
    demo15_title: "Mortal Kombat AR Motion Combat 🥊",
    demo15_desc: "Computer Vision motion combat controls: throw punches and kicks mid-air mapped directly to in-game actions.",
    demo16_title: "LegendBot V1.0 Intelligent Automation 🤖",
    demo16_desc: "Autonomous cloud agent automating repetitive workflows, server orchestration, and complex multi-step tasks at lightning speed.",
    demo17_title: "SmartDocs AI Reader (Google Play) 📄",
    demo17_desc: "Official Google Play mobile app for AI document summarization and Drive querying (26,000+ lines of clean Flutter).",
    demo18_title: "Nile ERP Cloud Enterprise Platform 🏭",
    demo18_desc: "Cloud ERP system managing enterprise resources, multi-branch warehouses, e-invoicing, and sales with a modern 3-Column dashboard.",
    demo19_title: "Yasta Smart On-Demand Services 🛠️",
    demo19_desc: "On-demand home services & technician matching platform with live GPS dispatch, escrow payments, and customer tracking.",
    demo20_title: "AI Cloud Video Editor & Montage Engine 🎬",
    demo20_desc: "Ultra-fast headless cloud video rendering and editing pipeline for programmatic trimming, merging, and AI effect generation with Node.js & FFmpeg.",
    demo21_title: "Nizam Accounting & Ledger App 📱",
    demo21_desc: "High-speed mobile bookkeeping app managing invoices, receivables, and daily ledger balances for merchants and startups.",
    demo22_title: "Traffic Blackspots Analytics Dashboard 📊",
    demo22_desc: "Geospatial intelligence dashboard identifying high-risk collision zones and generating algorithmic safety recommendations.",
    demo23_title: "Smart Book AI Interactive Learning 📚",
    demo23_desc: "Converting textbooks into interactive digital readers with embedded AI tutors that explain and quiz on any paragraph.",
    demo24_title: "Smart Pen IoT & Mobile AI Suite 📱",
    demo24_desc: "Bluetooth IoT hardware integration digitizing handwriting, mathematical formulas, and sketches into real-time vectorized text.",
    demo25_title: "Real-Time Facial Biometrics System 👤",
    demo25_desc: "Sub-second biometric facial verification for automated corporate attendance and access control using Deep Learning & OpenCV.",
    demo26_title: "Open World 3D City WebGL Game 🏙️",
    demo26_desc: "Open-world 3D browser environment featuring realistic vehicle physics and shader lighting via WebGL and Three.js.",
    demo27_title: "NanoGrad Deep Tech Neural Engine 🧠",
    demo27_desc: "Zero-dependency scalar autograd engine and neural network framework implemented from scratch in pure Python.",
    demo28_title: "Safqa Pro Escrow Marketplace 🤝",
    demo28_desc: "Secure multi-vendor escrow marketplace protecting buyers and sellers, paired with a full Flutter mobile app on Google Play.",

    // Section 8: Multimodal AI Studio
    sec_aidemo_tag: "Multimodal AI Suite",
    sec_aidemo_heading: "Supercharged AI Assistant: Text, Vision, Voice, YouTube, & Code Execution",
    sec_aidemo_subtext: "Experience Gemini 3.7 Flash: talk with your voice, upload UI mockups/designs for audit, parse YouTube videos, run Python computations, and search live web data.",
    ai_tab_advisor: "Sales & Solution Advisor",
    ai_tab_vision: "Vision & UI Audit",
    ai_tab_doc: "PDF & Document AI",
    ai_tab_imggen: "AI Image Generator",
    ai_tab_research: "Deep Research Mode",
    ai_tab_video: "Video & YouTube Intel",
    ai_tab_code: "Python & Code Sandbox",
    ai_tab_voice: "Voice Chat & Speech",
    ai_tab_search: "Live Web Search",
    ai_tab_mentor: "Software Mentor (LearnLM)",
    ai_sim_name: "NBrain Multimodal AI Studio",
    ai_sim_engine_badge: "Powered by Gemini 3.7 Flash Engine",
    ai_voice_label: "🎙️ Voice:",
    ai_emotion_label: "🎭 Tone/Emotion:",
    ai_sim_welcome_html: "Hello! 👋 I am NBrain's Supercharged AI Assistant, powered by <strong>Gemini 3.7 Flash</strong>.<br><br>I can now help you with:<br><ul><li>💬 <strong>Software Package Recommendations</strong> tailored to your budget.</li><li>📷 <strong>Vision & Image Audits</strong> for UI mockups, architecture diagrams, and documents.</li><li>🎬 <strong>YouTube Video Summarization & Timestamps</strong> from any link.</li><li>🎙️ <strong>Two-Way Voice Chat</strong> with mic input & read-aloud TTS.</li><li>🐍 <strong>Python Code Execution & Accurate Mathematical Modeling.</strong></li></ul><strong>Try sending a query, attaching an image, or clicking any preset below!</strong>",
    ai_sim_presets_label: "Quick Try Presets:",
    ai_sim_input_placeholder: "Type your query, paste YouTube link, or use mic/image tools...",
    ai_sim_send_btn: "Send",

    // Section 9: ROI Calculator
    sec_roicalc_tag: "AI ROI Calculator",
    sec_roicalc_heading: "Calculate How Much You Save & Gain with AI & Automation!",
    sec_roicalc_subtext: "Slide the controls to calculate wasted labor hours and monthly revenue unlocked by an intelligent AI assistant.",
    roi_label_inquiries: "Customer Inquiries / Messages per Month:",
    roi_label_order: "Average Order / Item Value (EGP):",
    roi_label_hours: "Weekly Customer Support Staff Hours:",
    roi_res_hours_label: "Monthly Time Saved via Automation:",
    roi_res_hours_sub: "Equivalent to 1.5 full-time staff members",
    roi_res_sales_label: "Estimated Monthly Revenue Lift:",
    roi_res_sales_sub: "Driven by instant responses & budget-tailored recommendations",
    roi_cta_btn: "Activate AI Assistant for My Business Now",

    // Section 10: Customizer
    sec_customizer_tag: "Build Your Custom Solution",
    sec_customizer_heading: "Interactive Project Package & Timeline Builder",
    sec_customizer_subtext: "Select the exact components your project needs, and we'll calculate the estimated roadmap and delivery timeline immediately.",
    cust_item1_title: "Full Web Application (Modern Web App)",
    cust_item1_badge: "Essential",
    cust_item1_desc: "Modern React / Next.js user interface, ultra-fast and fully responsive with complete admin dashboard.",
    cust_item2_title: "Official Google Play Mobile App",
    cust_item2_badge: "Most Requested",
    cust_item2_desc: "Native Flutter application compliant with Android 15 and 16KB Page Alignment standards.",
    cust_item3_title: "Smart AI Chatbot & Sales Recommender",
    cust_item3_badge: "Gemini GenAI",
    cust_item3_desc: "Intelligent chatbot to answer customer queries, recommend products by budget, and streamline purchases.",
    cust_item4_title: "Zero-Trust Cybersecurity & Protection Shields",
    cust_item4_badge: "Max Protection",
    cust_item4_desc: "DDoS mitigation, SSL encryption, web application firewalls, and data protection.",
    cust_item5_title: "Cinematic AI Promotional Video",
    cust_item5_badge: "High ROI Marketing",
    cust_item5_desc: "High-definition video with cinematic voiceover ready for social media ad campaigns.",
    cust_item6_title: "Custom Chrome & Edge Browser Extension",
    cust_item6_badge: "Optional",
    cust_item6_desc: "Browser extension for task automation, batch downloading, or direct integration with your platform.",
    cust_item7_title: "Custom Domain & High-Speed Cloud Hosting",
    cust_item7_badge: "Free with Bundle",
    cust_item7_desc: "Complete DNS, domain registration, and cloud server setup with zero technical hassle on your part.",
    cust_summary_title: "Custom Package Summary",
    cust_summary_timeline_label: "Estimated Delivery Timeline:",
    cust_summary_warranty_label: "Support & Warranty:",
    cust_summary_warranty_val: "Fully Included ✅",
    cust_summary_note: "💡 Our pricing is flexible and competitive, based strictly on your exact requirements with milestone payments.",
    cust_summary_btn: "Request Quote for This Package via WhatsApp",

    // Section 11: Portfolio
    sec_portfolio_tag: "Verified Portfolio & Inventions",
    sec_portfolio_heading: "Real Platforms & Systems Engineered and Launched",
    filter_all_port: "All",
    filter_ai_port: "AI & Vision",
    filter_mobile_port: "Mobile & Google Play",
    filter_web_port: "Web & Cloud",
    filter_tools_port: "Browser Extensions & Tools",

    port1_title: "Anubis AI Smart Tour Guide",
    port1_desc: "Multilingual AI tour guide for Egyptian civilization with hybrid chatbot and real-time artifact recognition (>90% accuracy).",
    port2_title: "NanoGrad LMS & Deep Tech",
    port2_desc: "AI learning platform modeled after Coursera with Android 15 compliant mobile app and cryptographic certificates.",
    port3_title: "Safqa Pro Marketplace",
    port3_desc: "100% secure escrow brokerage platform with an end-to-end Flutter mobile app published on Google Play.",
    port4_title: "Nitro Download Manager (NDM)",
    port4_desc: "Open-source IDM alternative with multi-threaded range downloading and Manifest V3 Chrome/Edge browser extension.",
    port5_title: "SmartDocs AI Reader (Google Play)",
    port5_desc: "Official Google Play Flutter app for AI document analysis & summarization powered by Gemini AI & Drive API (26,000+ lines).",
    port6_title: "Nile ERP Enterprise System",
    port6_desc: "Advanced cloud ERP for enterprise resource management, warehouses, e-invoices, and sales with modern 3-Column dashboard.",
    port7_title: "Smart Traffic & Driver Vision",
    port7_desc: "Real-time driver fatigue & distraction monitoring + traffic flow analytics and wrong-way detection using YOLOv12x.",

    // Section 12: Guarantees & SLAs
    sec_guarantees_tag: "Engineering SLAs & Guarantees",
    sec_guarantees_heading: "Uncompromising Commitment to Quality & Peace of Mind",
    sec_guarantees_subtext: "We apply rigorous engineering standards to guarantee technical, legal, and cybersecurity success for your platform.",
    guar1_badge: "100% Guaranteed",
    guar1_title: "Google Play 2026 Approval Guarantee",
    guar1_desc: "We guarantee successful acceptance and publishing on the Google Play Store with zero rejections related to 16KB Page Alignment or Target SDK 35.",
    guar2_badge: "Zero-Trust",
    guar2_title: "Full Cybersecurity & Data Encryption",
    guar2_desc: "End-to-end protection against DDoS attacks, robust SSL encryption, and full OWASP compliance across web and mobile surfaces.",
    guar3_badge: "99.9% Uptime",
    guar3_title: "Cloud Reliability & High Availability",
    guar3_desc: "Distributed cloud infrastructure ensuring lightning-fast load times and 99.9% guaranteed platform uptime without surprise downtimes.",
    guar4_badge: "Free Warranty",
    guar4_title: "Free 30-Day Post-Delivery Warranty",
    guar4_desc: "We provide 30 days of comprehensive technical support and maintenance after handover to address any tweaks and ensure stability.",

    // Section 13: FAQ
    sec_faq_tag: "Technical FAQ",
    sec_faq_heading: "Clear, Definitive Answers to Frequent Client Questions",
    faq_q1: "What is 16KB Page Alignment and why is it mandatory for Google Play apps in 2026?",
    faq_a1: "Starting with Android 15, Google mandates 16KB memory page size support for modern hardware to boost RAM efficiency and launch apps up to 30% faster. Apps with outdated native C/C++ libraries will be rejected. At NBrain, we build Flutter and Native apps with NDK r28 and 100% 16KB-aligned libraries for guaranteed approval.",
    faq_q2: "Do I retain 100% ownership of the Source Code and platform accounts?",
    faq_a2: "Yes, 100%! We never hold your code hostage. Upon completion, full source code is transferred to your private GitHub repository, along with direct administrative control of your domain, servers, databases, and app store accounts.",
    faq_q3: "How is the AI Sales Chatbot trained and customized for my products?",
    faq_a3: "We connect the Gemini AI model directly to your product catalog and pricing via RAG (Retrieval-Augmented Generation). This allows the assistant to understand inventory in real-time, accurately recommend items tailored to buyer budgets, and guide orders to checkout via WhatsApp or payment gateways.",
    faq_q4: "What are the payment options and can payments be made in milestones?",
    faq_a4: "Absolutely! Payment is structured around transparent project milestones (kickoff deposit + mid-milestone approval + final delivery & testing). We support Bank Wire Transfers, InstaPay / Vodafone Cash, and major Credit Cards.",
    faq_q5: "How is the AI promotional marketing video produced and what is its resolution?",
    faq_a5: "We use state-of-the-art generative video models to produce 4K promotional videos with cinematic voiceover, licensed music, and professional visual effects tailored for Instagram, Facebook, TikTok, and YouTube campaigns.",

    // Section 14: Founder
    sec_founder_tag: "NBrain Engineering Leadership",
    founder_role_badge: "Chief Software Architect",
    founder_name: "Eng. Nadeem Badr",
    founder_title: "Software & AI Engineer — Helwan International Technological University (HITU IT & AI)",
    founder_bio: "Founder of NBrain AI Ecosystem and architect of production-grade AI solutions, high-performance web, and mobile platforms. Specialized in Deep Tech systems, Computer Vision (YOLO & MediaPipe), Generative AI pipelines, and modern Android architecture (16KB Page Alignment).",
    founder_linkedin_btn: "LinkedIn",
    founder_facebook_btn: "Facebook",
    founder_github_btn: "GitHub",
    founder_whatsapp_btn: "💬 Direct WhatsApp Chat",

    // Modals
    rfp_modal_title: "Request for Proposal & Project Roadmap (RFP)",
    rfp_modal_subtitle: "Specify your project requirements and our system will generate a detailed engineering brief directly for Eng. Nadeem Badr",
    rfp_label_name: "Your Name / Organization *",
    rfp_placeholder_name: "e.g., Nadeem Badr - Enterprise Tech",
    rfp_label_phone: "WhatsApp / Phone Number *",
    rfp_placeholder_phone: "e.g., +201012345678",
    rfp_label_services: "Required Services & Modules:",
    rfp_srv_web: "🌐 Full Web App (SPA)",
    rfp_srv_app: "📱 Google Play Mobile App",
    rfp_srv_bot: "🤖 Gemini AI Sales Chatbot",
    rfp_srv_video: "🎬 4K AI Promo Video",
    rfp_srv_ext: "🧩 Chrome Extension",
    rfp_srv_vision: "🚗 Computer Vision System",
    rfp_srv_cloud: "🛡️ Cloud Hosting & DDoS Shield",
    rfp_label_budget: "Estimated Budget:",
    rfp_label_timeline: "Preferred Launch Timeline:",
    rfp_label_notes: "Brief project description or reference links:",
    rfp_placeholder_notes: "Describe your app or store idea, target audience, or special feature requirements...",
    rfp_btn_cancel: "Cancel",
    rfp_btn_submit: "Generate & Send Proposal via WhatsApp 🚀",

    media_modal_title: "Project Showcase Demo",
    media_modal_close: "Close",
    media_modal_action: "Inquire About Similar Project on WhatsApp",

    // Context Menu
    ctx_copy: "Copy Selected Text",
    ctx_aidemo: "AI Sales Advisor Demo",
    ctx_packages: "Explore Packages & Pricing",
    ctx_rfp: "Request Proposal (RFP)",
    ctx_whatsapp: "Instant WhatsApp Consultation",
    ctx_theme: "Toggle Theme (Dark / Light)",
    ctx_lang: "Switch Language (EN / عربي)",
    ctx_reload: "Reload Console"
  }
};

function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  const currentLang = (paramLang === 'en' || paramLang === 'ar') ? paramLang : (localStorage.getItem('nbrain_lang') || 'ar');
  applyLanguage(currentLang);

  const headerLangBtn = document.getElementById('headerLangBtn');
  const railLangBtn = document.getElementById('railLangBtn');

  function toggleLang() {
    const active = document.documentElement.getAttribute('lang') || 'ar';
    const nextLang = active === 'ar' ? 'en' : 'ar';
    applyLanguage(nextLang);
  }

  if (headerLangBtn) headerLangBtn.addEventListener('click', toggleLang);
  if (railLangBtn) railLangBtn.addEventListener('click', toggleLang);
}

function applyLanguage(lang) {
  const isEn = lang === 'en';
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isEn ? 'ltr' : 'rtl');
  localStorage.setItem('nbrain_lang', lang);

  const langBtnText = document.getElementById('langBtnText');
  if (langBtnText) {
    langBtnText.textContent = isEn ? 'العربية (AR)' : 'English (EN)';
  }

  const dict = i18nDict[lang] || i18nDict.ar;

  // 1. Text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // 2. HTML elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // 3. Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 4. Sidebar Search Placeholder
  const sidebarSearch = document.getElementById('sidebarSearch');
  if (sidebarSearch) {
    sidebarSearch.placeholder = isEn ? 'Search services, stacks, demos...' : 'بحث في الخدمات والأقسام...';
  }

  // 5. RFP Form Select Dropdown Localizations
  const rfpBudget = document.getElementById('rfpBudget');
  if (rfpBudget) {
    rfpBudget.options[0].text = isEn ? '5,000 - 10,000 EGP (Fast Suite / MVP)' : '5,000 - 10,000 ج.م (باقة سريعة / MVP)';
    rfpBudget.options[1].text = isEn ? '10,000 - 25,000 EGP (Full Web + Mobile App Suite)' : '10,000 - 25,000 ج.م (منظومة ويب + تطبيق متكاملة)';
    rfpBudget.options[2].text = isEn ? '25,000 - 50,000 EGP (VIP Enterprise & Store Suite)' : '25,000 - 50,000 ج.م (منظومة أعمال ومتاجر VIP متقدمة)';
    rfpBudget.options[3].text = isEn ? '+50,000 EGP (Custom Enterprise & Vision Solutions)' : '+50,000 ج.م (حلول مؤسسية و Vision مخصصة)';
  }

  const rfpTimeline = document.getElementById('rfpTimeline');
  if (rfpTimeline) {
    rfpTimeline.options[0].text = isEn ? 'Urgent (Within 7 - 10 business days)' : 'عاجل جداً (خلال 7 - 10 أيام عمل)';
    rfpTimeline.options[1].text = isEn ? 'Standard (Within 14 - 21 business days)' : 'قياسي (خلال 14 - 21 يوم عمل)';
    rfpTimeline.options[2].text = isEn ? 'Flexible (Based on engineering requirements)' : 'مرن (حسب حجم المتطلبات)';
  }

  // 6. Localize Direct WhatsApp Link URLs
  const heroWhatsApp = document.getElementById('heroWhatsAppBtn');
  if (heroWhatsApp) {
    const msg = isEn
      ? "Hello Eng. Nadeem, I would like to inquire about NBrain custom software & AI development services."
      : "مرحباً مهندس نديم، أود الاستفسار عن خدمات NBrain لتطوير البرمجيات والذكاء الاصطناعي.";
    heroWhatsApp.href = `https://wa.me/201552282852?text=${encodeURIComponent(msg)}`;
  }

  const sidebarWhatsApp = document.getElementById('sidebarWhatsAppBtn');
  if (sidebarWhatsApp) {
    const sMsg = isEn
      ? "Hello Eng. Nadeem, I would like to book a direct consultation regarding NBrain systems."
      : "مرحباً مهندس نديم، أود طلب استشارة فورية بخصوص منظومات NBrain.";
    sidebarWhatsApp.href = `https://wa.me/201552282852?text=${encodeURIComponent(sMsg)}`;
  }

  const vipBookingBtn = document.querySelector('a[href*="201552282852"][class*="btn-primary"]');
  if (vipBookingBtn) {
    const vipMsg = isEn
      ? "Hello Eng. Nadeem, I would like to book the VIP Enterprise Bundle from NBrain."
      : "أريد حجز الباقة الشاملة VIP من NBrain";
    vipBookingBtn.href = `https://wa.me/201552282852?text=${encodeURIComponent(vipMsg)}`;
  }

  // 6.5. Localize Utility Rail Tooltips
  const railAvatar = document.querySelector('.rail-btn.avatar-btn');
  if (railAvatar) railAvatar.setAttribute('data-tooltip', isEn ? 'Eng. Nadeem Badr (Founder)' : 'المهندس نديم بدر (مؤسس NBrain)');
  const railDemos = document.querySelector('.rail-btn[data-tab-target="demos"]');
  if (railDemos) railDemos.setAttribute('data-tooltip', isEn ? 'Watch Demos & Videos' : 'استعراض الفيديوهات والديمو');
  const railAi = document.querySelector('.rail-btn[data-tab-target="ai-demo"]');
  if (railAi) railAi.setAttribute('data-tooltip', isEn ? 'AI Sales Advisor' : 'فتح المساعد الذكي');
  const railRoi = document.querySelector('.rail-btn[data-tab-target="roi-calc"]');
  if (railRoi) railRoi.setAttribute('data-tooltip', isEn ? 'ROI Calculator' : 'حاسبة العائد ROI');
  const railConsult = document.querySelector('.utility-rail a[href*="wa.me"]');
  if (railConsult) railConsult.setAttribute('data-tooltip', isEn ? 'WhatsApp Consultation' : 'طلب استشارة / واتساب');
  const railTheme = document.getElementById('themeToggleBtn');
  if (railTheme) railTheme.setAttribute('data-tooltip', isEn ? 'Toggle Theme (Dark / Light)' : 'تبديل المظهر (Dark/Light)');
  const railLang = document.getElementById('railLangBtn');
  if (railLang) railLang.setAttribute('data-tooltip', isEn ? 'Switch Language (العربية)' : 'Switch Language (EN)');

  // 7. Update Breadcrumb & Dynamic Tools
  updateBreadcrumb();
  updateRoiDisplay();
  updateCustomizerSummary();
}

/* ==========================================================================
   PWA & Native Mobile App Features (Service Worker, 1-Click Install, Haptics)
   ========================================================================== */
function triggerHaptic(type = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') navigator.vibrate(8);
      else if (type === 'medium') navigator.vibrate(16);
      else if (type === 'success') navigator.vibrate([10, 30, 15]);
      else if (type === 'warning') navigator.vibrate([20, 20, 20]);
    } catch (e) {}
  }
}

let deferredPwaPrompt = null;

function initPwaAndMobileAppFeatures() {
  // 1. Register PWA Service Worker for offline performance and installability
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered with scope:', reg.scope))
        .catch((err) => console.log('PWA Service Worker registration note:', err));
    });
  }

  // 2. Capture PWA beforeinstallprompt Event
  const pwaBanner = document.getElementById('pwaInstallBanner');
  const pwaBtn = document.getElementById('pwaInstallBtn');
  const pwaClose = document.getElementById('pwaCloseBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    const isDismissed = sessionStorage.getItem('nbrain_pwa_dismissed') === 'true';
    if (!isDismissed && pwaBanner) {
      pwaBanner.style.display = 'flex';
    }
  });

  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      triggerHaptic('medium');
      if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        const choiceResult = await deferredPwaPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        }
        deferredPwaPrompt = null;
        if (pwaBanner) pwaBanner.style.display = 'none';
      } else {
        const isEn = document.documentElement.getAttribute('lang') === 'en';
        alert(isEn
          ? 'To install NBrain on iOS / Android:\nTap your browser Menu / Share button (⋮ or Share icon) and select "Add to Home Screen".'
          : 'لتثبيت تطبيق NBrain على هاتفك (Android / iPhone):\nاضغط على زر المشاركة أو القائمة في المتصفح (⋮ أو Share) ثم اختر "إضافة إلى الشاشة الرئيسية (Add to Home Screen)".');
      }
    });
  }

  if (pwaClose) {
    pwaClose.addEventListener('click', () => {
      triggerHaptic('light');
      if (pwaBanner) pwaBanner.style.display = 'none';
      sessionStorage.setItem('nbrain_pwa_dismissed', 'true');
    });
  }

  // 3. Attach Native Haptics to Interactive Mobile Elements
  document.querySelectorAll('.mobile-nav-item, .ai-mode-tab, .preset-btn, .tab, .btn-primary, .lang-toggle-btn, .c-pricing-cta, .project-tag, .filter-chip').forEach((el) => {
    el.addEventListener('click', () => {
      triggerHaptic('light');
    });
  });

  // 4. Mobile Bottom Sheet Handle for All Modals
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    const card = modal.querySelector('.modal-card');
    if (card && !card.querySelector('.sheet-drag-handle')) {
      const handle = document.createElement('div');
      handle.className = 'sheet-drag-handle';
      card.insertBefore(handle, card.firstChild);
    }
  });
}

/* ==========================================================================
   16. Custom Enterprise Context Menu (Right-Click Drawer)
   ========================================================================== */
function openCustomContextMenu(e) {
  const menu = document.getElementById('customContextMenu');
  if (!menu) return;

  const ctxCopyBtn = document.getElementById('ctxCopyText');
  const selectedText = window.getSelection ? window.getSelection().toString().trim() : '';

  if (ctxCopyBtn) {
    if (selectedText.length > 0) {
      ctxCopyBtn.classList.remove('context-menu-item--disabled');
      ctxCopyBtn.removeAttribute('disabled');
    } else {
      ctxCopyBtn.classList.add('context-menu-item--disabled');
      ctxCopyBtn.setAttribute('disabled', 'true');
    }
  }

  // Display menu to calculate dimensions
  menu.classList.add('is-active');
  menu.setAttribute('aria-hidden', 'false');

  const menuWidth = menu.offsetWidth || 240;
  const menuHeight = menu.offsetHeight || 320;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let posX = e.clientX;
  let posY = e.clientY;

  // Viewport bounds checking
  if (posX + menuWidth > windowWidth - 10) {
    posX = windowWidth - menuWidth - 12;
  }
  if (posY + menuHeight > windowHeight - 10) {
    posY = windowHeight - menuHeight - 12;
  }
  if (posX < 10) posX = 10;
  if (posY < 10) posY = 10;

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
}

function closeCustomContextMenu() {
  const menu = document.getElementById('customContextMenu');
  if (menu && menu.classList.contains('is-active')) {
    menu.classList.remove('is-active');
    menu.setAttribute('aria-hidden', 'true');
  }
}

function initCustomContextMenu() {
  const menu = document.getElementById('customContextMenu');
  if (!menu) return;

  // Close context menu on outside click, scroll, resize, or escape
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
      closeCustomContextMenu();
    }
  }, { capture: true });

  window.addEventListener('scroll', closeCustomContextMenu, { passive: true });
  window.addEventListener('resize', closeCustomContextMenu, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCustomContextMenu();
    }
  });

  // Handle menu item interactions
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.context-menu-item');
    if (!item || item.classList.contains('context-menu-item--disabled')) return;

    const action = item.getAttribute('data-action');
    closeCustomContextMenu();

    if (action === 'copy') {
      const selectedText = window.getSelection ? window.getSelection().toString() : '';
      if (selectedText && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(selectedText);
      }
    } else if (action === 'ai-demo') {
      const tabBtn = document.querySelector('.tab[data-target="ai-demo"]');
      if (tabBtn) tabBtn.click();
    } else if (action === 'packages') {
      const tabBtn = document.querySelector('.tab[data-target="packages"]');
      if (tabBtn) tabBtn.click();
    } else if (action === 'rfp') {
      const rfpBtn = document.getElementById('openRfpModalBtn') || document.querySelector('.open-rfp-btn');
      if (rfpBtn) rfpBtn.click();
    } else if (action === 'whatsapp') {
      const heroWhatsApp = document.getElementById('heroWhatsAppBtn');
      if (heroWhatsApp && heroWhatsApp.href) {
        window.open(heroWhatsApp.href, '_blank');
      } else {
        window.open('https://wa.me/201552282852', '_blank');
      }
    } else if (action === 'theme') {
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) themeBtn.click();
    } else if (action === 'lang') {
      const railLangBtn = document.getElementById('railLangBtn') || document.getElementById('headerLangBtn');
      if (railLangBtn) railLangBtn.click();
    } else if (action === 'reload') {
      window.location.reload();
    }
  });
}

// Enterprise App Core Bootloader
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllModules);
} else {
  initAllModules();
}
