/**
 * NBrain Enterprise Console (nbra.in) — 3-Column Architecture Logic
 * Author: Nadeem Badr
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTheme();
  initTabsAndNavigation();
  initAiSimulator();
  initRoiCalculator();
  initCustomizer();
  initPortfolioFilter();
  initSidebarSearch();
  initMediaModal();
  initFaqAccordion();
  initRfpModal();
});

/* ==========================================================================
   1. Sidebar Collapse / Expand & State
   ========================================================================== */
function initSidebar() {
  const consoleShell = document.getElementById('consoleShell');
  const collapseBtn = document.getElementById('collapseBtn');

  const isCollapsed = localStorage.getItem('nbrain-sidebar-collapsed') === 'true';
  if (isCollapsed && consoleShell) {
    consoleShell.classList.add('is-sidebar-collapsed');
  }

  if (collapseBtn && consoleShell) {
    collapseBtn.addEventListener('click', () => {
      consoleShell.classList.toggle('is-sidebar-collapsed');
      const collapsed = consoleShell.classList.contains('is-sidebar-collapsed');
      localStorage.setItem('nbrain-sidebar-collapsed', collapsed);
    });
  }
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
function initTabsAndNavigation() {
  const tabs = document.querySelectorAll('.tab');
  const navLinks = document.querySelectorAll('.nav-link');
  const switchBtns = document.querySelectorAll('.switch-to-tab');
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

  const titlesMap = {
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
  };

  function activateSection(targetId) {
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

    if (breadcrumbCurrent && titlesMap[targetId]) {
      breadcrumbCurrent.textContent = titlesMap[targetId];
    }

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

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab-target');
      activateSection(target);
    });
  });
}

/* ==========================================================================
   4. Interactive AI ROI Calculator
   ========================================================================== */
function initRoiCalculator() {
  const inquiriesRange = document.getElementById('inquiriesRange');
  const orderRange = document.getElementById('orderRange');
  const hoursRange = document.getElementById('hoursRange');

  const inquiriesVal = document.getElementById('inquiriesVal');
  const avgOrderVal = document.getElementById('avgOrderVal');
  const hoursVal = document.getElementById('hoursVal');

  const savedHoursResult = document.getElementById('savedHoursResult');
  const extraSalesResult = document.getElementById('extraSalesResult');

  function calculateROI() {
    if (!inquiriesRange || !orderRange || !hoursRange) return;

    const inquiries = parseInt(inquiriesRange.value, 10);
    const avgOrder = parseInt(orderRange.value, 10);
    const hours = parseInt(hoursRange.value, 10);

    if (inquiriesVal) inquiriesVal.textContent = `${inquiries.toLocaleString('ar-EG')} رسالة`;
    if (avgOrderVal) avgOrderVal.textContent = `${avgOrder.toLocaleString('ar-EG')} ج.م`;
    if (hoursVal) hoursVal.textContent = `${hours.toLocaleString('ar-EG')} ساعة`;

    // Calculation formulas
    const savedHours = Math.round(inquiries * 0.08);
    const extraSales = Math.round(inquiries * 0.03 * avgOrder);

    if (savedHoursResult) savedHoursResult.textContent = `${savedHours.toLocaleString('ar-EG')} ساعة عمل`;
    if (extraSalesResult) extraSalesResult.textContent = `+${extraSales.toLocaleString('ar-EG')} ج.م/شهرياً`;
  }

  if (inquiriesRange && orderRange && hoursRange) {
    inquiriesRange.addEventListener('input', calculateROI);
    orderRange.addEventListener('input', calculateROI);
    hoursRange.addEventListener('input', calculateROI);
    calculateROI();
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
      const title = btn.getAttribute('data-title') || 'العرض التوضيحي للمشروع';
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
          modalBody.innerHTML = `
            <div style="width: 100%; aspect-ratio: 16/9;">
              <iframe width="100%" height="100%" src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>
            </div>
          `;
        } else {
          modalBody.innerHTML = `
            <div class="modal-info-box">
              <h4 style="color: var(--console-primary); font-size: 1.1rem; margin-bottom: 8px;">⚡ تفاصيل ومميزات المنظومة:</h4>
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
   7. AI Smart Budget Recommender Simulator
   ========================================================================== */
function initAiSimulator() {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('ai-user-input');
  const submitBtn = document.getElementById('ai-submit-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  function appendMessage(sender, htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg chat-msg--${sender}`;

    const avatar = sender === 'bot' ? '🤖' : '👤';
    msgDiv.innerHTML = `
      <div class="chat-msg__avatar">${avatar}</div>
      <div class="chat-msg__bubble">${htmlContent}</div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleAiQuery(queryText, budget) {
    if (!queryText.trim()) return;

    appendMessage('user', queryText);
    userInput.value = '';

    setTimeout(() => {
      let botResponse = '';
      const text = queryText.toLowerCase();

      if (budget === '5999' || text.includes('5999') || text.includes('6000') || text.includes('ميزانية 5999')) {
        botResponse = `
          <strong>💡 ترشيح المساعد الذكي لميزانية (5,999 ج.م):</strong>
          <br>
          بناءً على ميزانيتك المحددة (5,999 جنيه)، يقترح الذكاء الاصطناعي أفضل باقة منتجات/خدمات متكاملة تمنحك أقصى قيمة لمتجرك ومشروعك:
          <div class="product-recommend-card">
            <div class="product-recommend-card__title">📦 باقة المتجر السريعة + شات بوت المبيعات بالـ AI</div>
            <div class="product-recommend-card__price">5,999 ج.م (شاملة الخصم والتجهيز)</div>
            <ul style="margin: 8px 0; padding-right: 20px; font-size: 0.85rem; color: var(--console-text);">
              <li>موقع متجر إلكتروني فائق السرعة متوافق 100% مع الموبايل</li>
              <li>مساعد Gemini AI مدمج لترشيح المنتجات للزبائن ومساعدتهم في الشراء</li>
              <li>ربط مباشر بالواتساب ووسائل الدفع</li>
              <li>دومين وهوست سريع لمدة سنة كاملة مجاناً</li>
            </ul>
            <a href="https://wa.me/201222777345?text=%D8%A3%D9%88%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D8%A8%D8%A7%D9%82%D8%A9%205999%20%D8%AC%D9%86%D9%8A%D9%87%20%D8%A7%D9%84%D8%AA%D9%8A%20%D8%B1%D8%B4%D8%AD%D9%87%D8%A7%20%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1%20%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A" target="_blank" class="btn btn-primary" style="margin-top: 8px; padding: 6px 14px; font-size: 0.82rem;">
              🚀 حجز هذه الباقة فوراً عبر واتساب
            </a>
          </div>
        `;
      } else if (budget === '15000' || text.includes('تطبيق') || text.includes('متجر') || text.includes('جوجل بلاي')) {
        botResponse = `
          <strong>🚀 الترشيح المثالي لإطلاق تطبيق ومتجر متكامل:</strong>
          <br>
          أنسب خيار لمشروعك هو <strong>الباقة الشاملة VIP (All-In-One 360°)</strong>:
          <div class="product-recommend-card">
            <div class="product-recommend-card__title">🏆 باقة المنظومة الشاملة VIP</div>
            <div class="product-recommend-card__price">تطبيق Google Play + موقع ويب + AI + فيديو إعلاني</div>
            <ul style="margin: 8px 0; padding-right: 20px; font-size: 0.85rem; color: var(--console-text);">
              <li>تطبيق Android 15 متوافق 100% مع معايير 16KB Page Alignment</li>
              <li>موقع ويب متكامل بلوحة تحكم كاملة</li>
              <li>فيديو ترويجي سينمائي بالذكاء الاصطناعي لمنصتك</li>
              <li>تأمين سيبراني ودومين واستضافة سحابية مشمولة مجاناً</li>
            </ul>
            <a href="https://wa.me/201222777345?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%B4%D8%A7%D9%85%D9%84%D8%A9%20VIP" target="_blank" class="btn btn-primary" style="margin-top: 8px; padding: 6px 14px; font-size: 0.82rem;">
              💬 تواصل مع المهندس نديم لمناقشة التفاصيل
            </a>
          </div>
        `;
      } else if (budget === '3000' || text.includes('كروم') || text.includes('extension') || text.includes('إضافة')) {
        botResponse = `
          <strong>🧩 ترشيح إضافات المتصفح (Chrome Extension):</strong>
          <br>
          نطور لك إضافة كروم/إيدج احترافية متوافقة مع Manifest V3 مثل أدوات التحميل الذكي (Nitro Download Manager) أو أدوات استخراج البيانات والأتمتة السريعة مع إمكانية نشرها على Chrome Web Store.
        `;
      } else {
        botResponse = `
          شكراً لتواصلك! 😊 تم تحليل طلبك: <em>"${queryText}"</em>.
          <br><br>
          في منظومة <strong>NBrain</strong> يمكننا تخصيص الحل البرمجي المناسب تماماً لميزانيتك واحتياجاتك الهندسية سواء كنت بحاجة لموقع، تطبيق موبايل، أو نظام ذكاء اصطناعي.
          <br><br>
          👉 <strong>تفضل بالتواصل المباشر مع المهندس نديم بدر عبر واتساب:</strong>
          <br>
          <a href="https://wa.me/201222777345?text=${encodeURIComponent('مرحباً مهندس نديم، أود الاستفسار عن: ' + queryText)}" target="_blank" class="btn btn-primary" style="margin-top: 8px; padding: 6px 14px; font-size: 0.85rem;">
            💬 تواصل الآن عبر واتساب
          </a>
        `;
      }

      appendMessage('bot', botResponse);
    }, 500);
  }

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

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const budget = btn.getAttribute('data-budget');
      const query = btn.getAttribute('data-query');
      handleAiQuery(query, budget);
    });
  });
}

/* ==========================================================================
   8. Interactive Package Customizer
   ========================================================================== */
function initCustomizer() {
  const checkboxes = document.querySelectorAll('.customizer__checkbox');
  const countBadge = document.getElementById('selected-count-badge');
  const itemsList = document.getElementById('selected-items-list');
  const timelineEl = document.getElementById('estimated-timeline');
  const requestQuoteBtn = document.getElementById('request-quote-btn');

  function updateSummary() {
    const selectedItems = [];

    checkboxes.forEach(cb => {
      if (cb.checked) {
        selectedItems.push({
          id: cb.getAttribute('data-id'),
          name: cb.getAttribute('data-name'),
          time: cb.getAttribute('data-time')
        });
      }
    });

    if (countBadge) {
      countBadge.textContent = `${selectedItems.length} عناصر مختارة`;
    }

    if (itemsList) {
      if (selectedItems.length === 0) {
        itemsList.innerHTML = `<p style="color: var(--console-text-muted); font-size: 0.85rem;">لم يتم اختيار أي مكون بعد. اختر ما يناسبك من القائمة.</p>`;
      } else {
        itemsList.innerHTML = selectedItems.map(item => `
          <div class="summary-item">
            <span class="text-success">✓</span>
            <span>${item.name}</span>
          </div>
        `).join('');
      }
    }

    if (timelineEl) {
      if (selectedItems.length === 0) {
        timelineEl.textContent = '0 أيام';
      } else if (selectedItems.length <= 2) {
        timelineEl.textContent = '3 - 5 أيام عمل';
      } else if (selectedItems.length <= 4) {
        timelineEl.textContent = '7 - 10 أيام عمل';
      } else {
        timelineEl.textContent = '10 - 14 يوم عمل';
      }
    }

    if (requestQuoteBtn) {
      const namesList = selectedItems.map(i => i.name).join(' + ');
      const whatsappMsg = `مرحباً مهندس نديم، قمت بتخصيص باقة على منصة nbra.in تتضمن: (${namesList}). أود معرفة عرض السعر والبدء في التنفيذ.`;
      
      requestQuoteBtn.onclick = () => {
        const url = `https://wa.me/201222777345?text=${encodeURIComponent(whatsappMsg)}`;
        window.open(url, '_blank');
      };
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateSummary);
  });

  updateSummary();
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
  const rfpForm = document.getElementById('rfpForm');

  function openRfp() {
    if (rfpModal) rfpModal.classList.add('is-open');
  }

  function closeRfp() {
    if (rfpModal) rfpModal.classList.remove('is-open');
  }

  if (openBtn) openBtn.addEventListener('click', openRfp);
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

      const name = document.getElementById('rfpClientName')?.value.trim();
      const phone = document.getElementById('rfpPhone')?.value.trim();
      const budget = document.getElementById('rfpBudget')?.value;
      const timeline = document.getElementById('rfpTimeline')?.value;
      const notes = document.getElementById('rfpNotes')?.value.trim();

      if (!name || !phone) {
        alert('يرجى كتابة الاسم ورقم الهاتف/الواتساب للمتابعة');
        return;
      }

      const selectedServices = [];
      document.querySelectorAll('input[name="rfpServices"]:checked').forEach(cb => {
        selectedServices.push(cb.value);
      });

      const servicesText = selectedServices.length > 0 ? selectedServices.join('\n- ') : 'لم يتم تحديد خدمات معينة';

      const whatsappText = `🚀 *طلب عرض سعر وخطة مشروع جديدة (nbra.in)*
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

      const url = `https://wa.me/201222777345?text=${encodeURIComponent(whatsappText)}`;
      window.open(url, '_blank');
      closeRfp();
      if (rfpForm) rfpForm.reset();
    });
  }
}

