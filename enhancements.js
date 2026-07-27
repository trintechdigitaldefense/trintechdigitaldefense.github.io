// ═══════════════════════════════════════════════════════
// TRINTECH DIGITAL DEFENSE — ENHANCEMENTS MODULE
// Case studies moved to main index.html. This file handles:
// 1. WhatsApp floating button
// 2. Service selector (interactive quiz)
// ═══════════════════════════════════════════════════════

// ── 1. WHATSAPP FLOATING BUTTON ──────────────────────
(function(){
  const w = document.createElement('a');
  w.href = 'https://wa.me/18683620679?text=Hi%20Jason%2C%20I%20need%20cybersecurity%20help%20with%20my%20business.';
  w.target = '_blank';
  w.id = 'whatsapp-float';
  w.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.821 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 0 00-3.48-8.413z"/></svg>';
  Object.assign(w.style, {
    position:'fixed', bottom:'24px', right:'24px', zIndex:'9999',
    background:'#25D366', color:'white', border:'none', borderRadius:'50%',
    width:'60px', height:'60px', display:'flex', alignItems:'center',
    justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(37,211,102,.45)',
    fontSize:'24px', transition:'transform .2s, box-shadow .2s'
  });
  w.addEventListener('mouseenter', () => { w.style.transform='scale(1.1)'; w.style.boxShadow='0 6px 28px rgba(37,211,102,.6)'; });
  w.addEventListener('mouseleave', () => { w.style.transform='scale(1)'; w.style.boxShadow='0 4px 20px rgba(37,211,102,.45)'; });
  document.body.appendChild(w);
  
  const tip = document.createElement('div');
  tip.id = 'wa-tooltip';
  tip.textContent = 'Need security help? Chat with Jason';
  Object.assign(tip.style, {
    position:'fixed', bottom:'92px', right:'24px', zIndex:'9999',
    background:'rgba(5,18,26,.97)', color:'var(--text)',
    fontFamily:'monospace', fontSize:'12px',
    padding:'10px 16px', borderRadius:'8px',
    border:'1px solid rgba(0,229,255,.2)',
    whiteSpace:'nowrap', pointerEvents:'none',
    opacity:'0', transition:'opacity .25s', maxWidth:'240px'
  });
  w.addEventListener('mouseenter', () => { tip.style.opacity='1'; });
  w.addEventListener('mouseleave', () => { tip.style.opacity='0'; });
  document.body.appendChild(tip);
})();

// ── 2. SERVICE SELECTOR (Interactive Quiz) ───────────
(function(){
  const section = document.createElement('section');
  section.id = 'selector';
  section.innerHTML = `
  <p class="s-tag" style="margin-top:0">// find.your.service()</p>
  <h2 class="s-title" style="font-size:clamp(2rem,5vw,3.2rem)">WHAT DO YOU NEED?</h2>
  <p class="s-sub" style="margin-bottom:2.5rem">Answer 3 quick questions — get your recommended service in 30 seconds.</p>
  
  <div class="selector-container">
    <div class="selector-step" data-step="1">
      <p class="selector-q">What type of business are you?</p>
      <div class="selector-options" id="opt-1"></div>
    </div>
    <div class="selector-step" data-step="2" style="display:none">
      <p class="selector-q">What's your biggest concern?</p>
      <div class="selector-options" id="opt-2"></div>
    </div>
    <div class="selector-step" data-step="3" style="display:none">
      <p class="selector-q">How many systems need protection?</p>
      <div class="selector-options" id="opt-3"></div>
    </div>
    <div class="selector-step" data-step="result" style="display:none">
      <div id="selector-result"></div>
    </div>
  </div>
  `;
  
  const hero = document.querySelector('.hero');
  if (hero) hero.after(section);
  
  const questions = [
    [
      {label:'🏢 Small Business', value:'sme', emoji:'🏢'},
      {label:'🏦 Financial Institution', value:'finance', emoji:'🏦'},
      {label:'🏥 Healthcare / Govt', value:'health', emoji:'🏥'},
      {label:'🌐 Individual / Startup', value:'startup', emoji:'🌐'}
    ],
    [
      {label:'🔍 Find vulnerabilities before hackers do', value:'vuln', emoji:'🔍'},
      {label:'📊 Understand our digital exposure', value:'osint', emoji:'📊'},
      {label:'🔑 Test password strength', value:'credentials', emoji:'🔑'},
      {label:'💳 Investigate fraud/financial crime', value:'fraud', emoji:'💳'}
    ],
    [
      {label:'📱 1-5 devices', value:'micro', emoji:'📱'},
      {label:'💻 5-15 devices', value:'small', emoji:'💻'},
      {label:'🏢 15+ devices / enterprise', value:'enterprise', emoji:'🏢'},
      {label:'🌐 Web application only', value:'webapp', emoji:'🌐'}
    ]
  ];
  
  const results = {
    'sme-vuln-micro': {title:'MICRO-BUSINESS AUDIT', price:'$1,000', desc:'Perfect for small businesses. We scan your network, check device security, review WiFi, email exposure, and deliver a prioritized security roadmap. Includes NDA and written report.', features:['WiFi security check','Device vulnerability scan','Email & social media exposure review','Basic network security recommendations','Written report with action plan'], cta:'Book Micro-Business Audit', link:'#pricing'},
    'sme-vuln-small': {title:'SMALL BUSINESS AUDIT', price:'$2,200', desc:'Comprehensive security assessment for growing businesses. Full network mapping, service analysis, credential testing, web app check, and prioritized remediation roadmap.', features:['Everything in Micro-Business audit','Full network mapping & asset discovery','Service & port analysis','Credential strength testing','Web application security check','Comprehensive report with priority roadmap','Remediation consultation call'], cta:'Book Small Business Audit', link:'#pricing'},
    'sme-vuln-enterprise': {title:'CUSTOM SECURITY ASSESSMENT', price:'Contact for Quote', desc:'For larger organizations, we build a custom assessment tailored to your infrastructure. Full-scope penetration testing, red team exercises, compliance mapping, and executive reporting.', features:['Full-scope penetration testing','Red team simulation','Compliance mapping (PCI-DSS, ISO 27001)','Executive & technical reports','Ongoing retainer options','Quarterly security assessments'], cta:'Book Free Scoping Call', link:'#contact'},
    'sme-osint-micro': {title:'OSINT RECONNAISSANCE', price:'$150/hr', desc:'We perform a thorough investigation of what attackers can find about your business online — emails, passwords, infrastructure, employee exposure, and more.', features:['Digital footprint mapping','Email exposure analysis','Domain & infrastructure checks','Employee email format detection','Public breach database lookup','Comprehensive recon report'], cta:'Book OSINT Recon', link:'#contact'},
    'sme-osint-small': {title:'OSINT RECONNAISSANCE', price:'$150/hr', desc:'Same powerful OSINT investigation, scaled for your growing business. We uncover your digital exposure across social media, email systems, and public infrastructure.', features:['Digital footprint mapping','Email exposure analysis','Domain & infrastructure checks','Employee email format detection','Public breach database lookup','Social media presence audit'], cta:'Book OSINT Recon', link:'#contact'},
    'sme-osint-enterprise': {title:'ENTERPRISE OSINT REPORT', price:'$150/hr', desc:'Full-spectrum OSINT investigation for large organizations. We map every digital touchpoint, exposed credential, and publicly visible infrastructure component.', features:['Full digital footprint mapping','Employee OSINT audit','Supply chain exposure analysis','Domain & infrastructure audit','Threat actor perspective report','Board-ready presentation'], cta:'Book Enterprise OSINT', link:'#contact'},
    'sme-credentials-micro': {title:'CREDENTIAL RESILIENCE TEST', price:'$650 + Audit', desc:'We test the strength of your organization password policies through controlled brute-force simulation. Learn how long it would take an attacker to crack your credentials.', features:['Password policy audit','Brute-force resilience testing','Password strength analysis','Policy recommendations','Staff training guidance'], cta:'Book Credential Test', link:'#contact'},
    'sme-credentials-small': {title:'CREDENTIAL RESILIENCE TEST', price:'$650 + Audit', desc:'Comprehensive credential testing for your growing organization. We test password policies, simulate brute-force attacks, and provide actionable recommendations.', features:['Password policy audit','Brute-force resilience testing','Multi-factor authentication review','Credential policy recommendations','Staff training guidance'], cta:'Book Credential Test', link:'#contact'},
    'sme-fraud-micro': {title:'CYBER FRAUD INVESTIGATION', price:'Contact for Quote', desc:'We investigate digital fraud incidents with professional forensic methodologies. Evidence documentation suitable for legal proceedings.', features:['Digital evidence preservation','Transaction trail analysis','Communication pattern analysis','Forensic report for legal use','NDA-protected investigation'], cta:'Book Investigation', link:'#contact'},
    'sme-fraud-small': {title:'CYBER FRAUD INVESTIGATION', price:'Contact for Quote', desc:'Professional digital fraud investigation for organizations. We trace financial crimes, preserve evidence, and deliver court-ready documentation.', features:['Digital evidence preservation','Financial transaction analysis','Communication forensic analysis','Legal-grade documentation','Expert witness preparation'], cta:'Book Investigation', link:'#contact'},
    'default-audit': {title:'MICRO-BUSINESS AUDIT', price:'$1,000', desc:'Our most popular service — a complete security assessment that finds vulnerabilities before attackers do. Includes NDA, written report, and remediation roadmap.', features:['WiFi security check','Device vulnerability scan','Email & social media exposure','Network security recommendations','Written report'], cta:'Book Micro-Business Audit', link:'#pricing'},
  };
  
  function getResultKey(q1, q2, q3) {
    const key = q1 + '-' + q2 + '-' + q3;
    return results[key] ? key : 'default-audit';
  }
  
  function renderOptions(step, options) {
    const container = document.getElementById('opt-' + step);
    if (!container) return;
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'selector-btn';
      btn.innerHTML = opt.label;
      btn.onclick = () => handleSelection(step, opt.value);
      container.appendChild(btn);
    });
  }
  
  function handleSelection(step, value) {
    window._selectorAnswers = window._selectorAnswers || {};
    window._selectorAnswers[step] = value;
    
    if (step < 3) {
      document.querySelector('.selector-step[data-step="' + step + '"]').style.display = 'none';
      const next = step + 1;
      document.querySelector('.selector-step[data-step="' + next + '"]').style.display = 'block';
      renderOptions(next, questions[next - 1]);
    } else {
      const key = getResultKey(
        window._selectorAnswers[1] || 'sme',
        window._selectorAnswers[2] || 'vuln',
        window._selectorAnswers[3] || 'micro'
      );
      const r = results[key] || results['default-audit'];
      const resultDiv = document.getElementById('selector-result');
      
      let featuresHtml = r.features.map(f => '<div class="selector-feature">✦ ' + f + '</div>').join('');
      
      resultDiv.innerHTML = '<div class="selector-result-card">' +
        '<div class="selector-result-label">RECOMMENDED SERVICE</div>' +
        '<div class="selector-result-title">' + r.title + '</div>' +
        '<div class="selector-result-price">' + r.price + '</div>' +
        '<div class="selector-result-desc">' + r.desc + '</div>' +
        '<div class="selector-result-features">' + featuresHtml + '</div>' +
        '<div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap">' +
          '<a href="' + r.link + '" class="selector-cta-btn">' + r.cta + '</a>' +
          '<a href="https://wa.me/18683620679?text=Hi%20Jason%2C%20I%20just%20used%20the%20service%20selector%20and%20I%27m%20interested%20in%20your%20services." target="_blank" class="selector-cta-btn" style="background:transparent;border:1px solid var(--cyan);color:var(--cyan)">Chat on WhatsApp</a>' +
        '</div>' +
      '</div>';
      
      document.querySelector('.selector-step[data-step="3"]').style.display = 'none';
      document.querySelector('.selector-step[data-step="result"]').style.display = 'block';
    }
  }
  
  renderOptions(1, questions[0]);
})();
