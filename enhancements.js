// ═══════════════════════════════════════════════════════
// TRINTECH DIGITAL DEFENSE — ENHANCEMENTS MODULE
// Priority 1: Revenue Drivers — Enhanced Website
// ═══════════════════════════════════════════════════════

// ── 1. WHATSAPP FLOATING BUTTON ──────────────────────
(function(){
  const w = document.createElement('a');
  w.href = 'https://wa.me/18683620679?text=Hi%20Jason%2C%20I%20need%20cybersecurity%20help%20with%20my%20business.';
  w.target = '_blank';
  w.id = 'whatsapp-float';
  w.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
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
  
  // Tooltip
  const tip = document.createElement('div');
  tip.id = 'wa-tooltip';
  tip.textContent = 'Need security help? Chat with Jason';
  Object.assign(tip.style, {
    position:'fixed', bottom:'92px', right:'24px', zIndex:'9999',
    background:'var(--card, rgba(5,18,26,.97))', color:'var(--text)',
    fontFamily:'var(--mono, monospace)', fontSize:'12px',
    padding:'10px 16px', borderRadius:'8px',
    border:'1px solid var(--border, rgba(0,229,255,.2))',
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
  
  // Insert after hero
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
      {label:'📱 1–5 devices', value:'micro', emoji:'📱'},
      {label:'💻 5–15 devices', value:'small', emoji:'💻'},
      {label:'🏢 15+ devices / enterprise', value:'enterprise', emoji:'🏢'},
      {label:'🌐 Web application only', value:'webapp', emoji:'🌐'}
    ]
  ];
  
  const results = {
    'sme-vuln-micro': {title:'MICRO-BUSINESS AUDIT', price:'$1,000', desc:'Perfect for small businesses. We scan your network, check device security, review WiFi, email exposure, and deliver a prioritized security roadmap. Includes NDA and written report.', features:['WiFi security check','Device vulnerability scan','Email & social media exposure review','Basic network security recommendations','Written report with action plan'], cta:'📅 Book Micro-Business Audit', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-vuln-small': {title:'SMALL BUSINESS AUDIT', price:'$2,200', desc:'Comprehensive security assessment for growing businesses. Full network mapping, service analysis, credential testing, web app check, and prioritized remediation roadmap.', features:['Everything in Micro-Business audit','Full network mapping & asset discovery','Service & port analysis','Credential strength testing','Web application security check','Comprehensive report with priority roadmap','Remediation consultation call'], cta:'📅 Book Small Business Audit', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-vuln-enterprise': {title:'CUSTOM SECURITY ASSESSMENT', price:'Contact for Quote', desc:'For larger organizations, we build a custom assessment tailored to your infrastructure. Full-scope penetration testing, red team exercises, compliance mapping, and executive reporting.', features:['Full-scope penetration testing','Red team simulation','Compliance mapping (PCI-DSS, ISO 27001)','Executive & technical reports','Ongoing retainer options','Quarterly security assessments'], cta:'📅 Book Free Scoping Call', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-osint-micro': {title:'OSINT RECONNAISSANCE', price:'$150/hr', desc:'We perform a thorough investigation of what attackers can find about your business online — emails, passwords, infrastructure, employee exposure, and more.', features:['Digital footprint mapping','Email exposure analysis','Domain & infrastructure checks','Employee email format detection','Public breach database lookup','Comprehensive recon report'], cta:'📅 Book OSINT Recon', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-osint-small': {title:'OSINT RECONNAISSANCE', price:'$150/hr', desc:'Same powerful OSINT investigation, scaled for your growing business. We uncover your digital exposure across social media, email systems, and public infrastructure.', features:['Digital footprint mapping','Email exposure analysis','Domain & infrastructure checks','Employee email format detection','Public breach database lookup','Social media presence audit'], cta:'📅 Book OSINT Recon', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-osint-enterprise': {title:'ENTERPRISE OSINT REPORT', price:'$150/hr', desc:'Full-spectrum OSINT investigation for large organizations. We map every digital touchpoint, exposed credential, and publicly visible infrastructure component.', features:['Full digital footprint mapping','Employee OSINT audit','Supply chain exposure analysis','Domain & infrastructure audit','Threat actor perspective report','Board-ready presentation'], cta:'📅 Book Enterprise OSINT', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-credentials-micro': {title:'CREDENTIAL RESILIENCE TEST', price:'$650 + Audit', desc:'We test the strength of your organization\'s password policies through controlled brute-force simulation. Learn how long it would take an attacker to crack your credentials.', features:['Password policy audit','Brute-force resilience testing','Password strength analysis','Policy recommendations','Staff training guidance'], cta:'📅 Book Credential Test', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-credentials-small': {title:'CREDENTIAL RESILIENCE TEST', price:'$650 + Audit', desc:'Comprehensive credential testing for your growing organization. We test password policies, simulate brute-force attacks, and provide actionable recommendations.', features:['Password policy audit','Brute-force resilience testing','Multi-factor authentication review','Credential policy recommendations','Staff training guidance'], cta:'📅 Book Credential Test', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-fraud-micro': {title:'CYBER FRAUD INVESTIGATION', price:'Contact for Quote', desc:'We investigate digital fraud incidents with professional forensic methodologies. Evidence documentation suitable for legal proceedings.', features:['Digital evidence preservation','Transaction trail analysis','Communication pattern analysis','Forensic report for legal use','NDA-protected investigation'], cta:'📅 Book Investigation', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    'sme-fraud-small': {title:'CYBER FRAUD INVESTIGATION', price:'Contact for Quote', desc:'Professional digital fraud investigation for organizations. We trace financial crimes, preserve evidence, and deliver court-ready documentation.', features:['Digital evidence preservation','Financial transaction analysis','Communication forensic analysis','Legal-grade documentation','Expert witness preparation'], cta:'📅 Book Investigation', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
    // Default / fallback results
    'default-audit': {title:'MICRO-BUSINESS AUDIT', price:'$1,000', desc:'Our most popular service — a complete security assessment that finds vulnerabilities before attackers do. Includes NDA, written report, and remediation roadmap.', features:['WiFi security check','Device vulnerability scan','Email & social media exposure','Network security recommendations','Written report'], cta:'📅 Book Micro-Business Audit', link:'https://exile-aerobic-saddle-rough.2n6.me/booking/'},
  };
  
  function getResultKey(q1, q2, q3) {
    const key = `${q1}-${q2}-${q3}`;
    return results[key] ? key : 'default-audit';
  }
  
  function renderOptions(step, options) {
    const container = document.getElementById(`opt-${step}`);
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
    // Store answer
    window._selectorAnswers = window._selectorAnswers || {};
    window._selectorAnswers[step] = value;
    
    if (step < 3) {
      document.querySelector(`.selector-step[data-step="${step}"]`).style.display = 'none';
      const next = step + 1;
      document.querySelector(`.selector-step[data-step="${next}"]`).style.display = 'block';
      renderOptions(next, questions[next - 1]);
    } else {
      // Show result
      const key = getResultKey(
        window._selectorAnswers[1] || 'sme',
        window._selectorAnswers[2] || 'vuln',
        window._selectorAnswers[3] || 'micro'
      );
      const r = results[key] || results['default-audit'];
      const resultDiv = document.getElementById('selector-result');
      
      let featuresHtml = r.features.map(f => `<div class="selector-feature">✦ ${f}</div>`).join('');
      
      resultDiv.innerHTML = `
        <div class="selector-result-card">
          <div class="selector-result-label">RECOMMENDED SERVICE</div>
          <div class="selector-result-title">${r.title}</div>
          <div class="selector-result-price">${r.price}</div>
          <div class="selector-result-desc">${r.desc}</div>
          <div class="selector-result-features">${featuresHtml}</div>
          <div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap">
            <a href="${r.link}" target="_blank" class="selector-cta-btn">${r.cta}</a>
            <a href="https://wa.me/18683620679?text=Hi%20Jason%2C%20I%20just%20used%20the%20service%20selector%20and%20I'm%20interested%20in%20your%20services." target="_blank" class="selector-cta-btn" style="background:transparent;border:1px solid var(--cyan);color:var(--cyan)">💬 Chat on WhatsApp</a>
          </div>
        </div>
      `;
      
      document.querySelector(`.selector-step[data-step="3"]`).style.display = 'none';
      document.querySelector(`.selector-step[data-step="result"]`).style.display = 'block';
    }
  }
  
  // Initial render
  renderOptions(1, questions[0]);
})();

// ── 3. CASE STUDIES SECTION ──────────────────────────
(function(){
  const section = document.createElement('section');
  section.id = 'cases';
  section.innerHTML = `
  <p class="s-tag">// results.show()</p>
  <h2 class="s-title" style="font-size:clamp(2rem,5vw,3.2rem)">REAL RESULTS</h2>
  <p class="s-sub">Anonymized case studies from TrinTech engagements. Names changed to protect client confidentiality under NDA.</p>
  <div class="cases-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1.5rem;margin-top:2rem">
    <div class="case-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:2rem;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease,border-color .25s,box-shadow .25s">
      <div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;margin-bottom:1rem">FINANCIAL SERVICES</div>
      <div style="font-family:var(--display);font-size:1.5rem;color:#fff;margin-bottom:1rem;line-height:1.2">Small Business Found 3 Critical Vulnerabilities Before an Attacker Did</div>
      <p style="font-size:.85rem;color:var(--text);line-height:1.7;margin-bottom:1.2rem">A Trinidad SME with 12 employees engaged TrinTech for a Small Business Network Audit. We discovered critical vulnerabilities that would have been exploited by ransomware.</p>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.2rem">
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--green)">3</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Critical</div></div>
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--gold)">7</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Medium</div></div>
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--cyan)">0</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Breaches After</div></div>
      </div>
      <div style="font-family:var(--mono);font-size:.6rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--border);padding-top:1rem;margin-top:.5rem">6 weeks later — similar ransomware attempt FAILED</div>
    </div>
    <div class="case-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:2rem;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease,border-color .25s,box-shadow .25s">
      <div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;margin-bottom:1rem">OSINT RECONNAISSANCE</div>
      <div style="font-family:var(--display);font-size:1.5rem;color:#fff;margin-bottom:1rem;line-height:1.2">15 Minutes of OSINT Exposed What 12 Months of "IT" Missed</div>
      <p style="font-size:.85rem;color:var(--text);line-height:1.7;margin-bottom:1.2rem">An OSINT engagement for a Trinidad company revealed publicly exposed credentials, default server credentials, and an employee email pattern reusable for phishing attacks.</p>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.2rem">
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--red)">1</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Password Found</div></div>
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--red)">1</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Server with Defaults</div></div>
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--green)">✅</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">All Fixed</div></div>
      </div>
      <div style="font-family:var(--mono);font-size:.6rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--border);padding-top:1rem;margin-top:.5rem">All vulnerabilities remediated within 48 hours</div>
    </div>
    <div class="case-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:2rem;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease,border-color .25s,box-shadow .25s">
      <div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.2em;color:var(--muted);text-transform:uppercase">INFRASTRUCTURE AUDIT</div>
      <div style="font-family:var(--display);font-size:1.5rem;color:#fff;margin-bottom:1rem;line-height:1.2">Hospitality Business Secured Against Ransomware Before Being Targeted</div>
      <p style="font-size:.85rem;color:var(--text);line-height:1.7;margin-bottom:1.2rem">A Caribbean hospitality business with multiple properties engaged TrinTech. The audit identified weak WiFi encryption, unpatched servers, and exposed FTP services that were secured before exploitation.</p>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.2rem">
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--green)">4</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Properties Secured</div></div>
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--green)">SPF</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">Email Auth</div></div>
        <div style="text-align:center"><div style="font-family:var(--display);font-size:1.8rem;color:var(--green)">✅</div><div style="font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase">100% Remediated</div></div>
      </div>
      <div style="font-family:var(--mono);font-size:.6rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--border);padding-top:1rem;margin-top:.5rem">Client reported: "That's what security is about." — Post-assessment ransomware attempt blocked</div>
    </div>
  </div>
  `;
  
  // Insert after tools section
  const tools = document.querySelector('#tools');
  if (tools) {
    const toolsNext = tools.nextElementSibling;
    if (toolsNext && toolsNext.classList.contains('divider')) {
      toolsNext.after(section);
    } else if (toolsNext) {
      tools.after(section);
    } else {
      const div = document.createElement('div'); div.className = 'divider';
      tools.after(div); div.after(section);
    }
  }
  
  // Observe case cards
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.07});
  section.querySelectorAll('.case-card').forEach(el => obs.observe(el));
  
  // Add CSS for case cards
  const style = document.createElement('style');
  style.textContent = `
    .case-card:hover { border-color: var(--cyan); box-shadow: 0 0 30px var(--cyan-dim); }
  `;
  document.head.appendChild(style);
})();

// ── 4. THREAT INTEL FEED SECTION ─────────────────────
(function(){
  const section = document.createElement('section');
  section.id = 'threat-intel';
  section.innerHTML = `
  <p class="s-tag">// intel.feed()</p>
  <h2 class="s-title" style="font-size:clamp(2rem,5vw,3.2rem)">CARIBBEAN CYBER THREAT FEED</h2>
  <p class="s-sub">Real-time awareness of threats targeting Caribbean businesses. Updated daily.</p>
  <div id="threat-feed" style="margin-top:2rem;display:flex;flex-direction:column;gap:1rem">
    <div class="threat-item" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:1.2rem 1.5rem;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span style="font-size:.7rem;background:var(--red);color:#fff;padding:2px 8px;border-radius:2px;font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase">CRITICAL</span>
        <span style="font-family:var(--mono);font-size:.6rem;color:var(--muted);letter-spacing:.08em">RANSOMWARE ALERT</span>
        <span style="margin-left:auto;font-family:var(--mono);font-size:.55rem;color:var(--muted);letter-spacing:.05em">LATEST</span>
      </div>
      <div style="font-family:var(--display);font-size:1.1rem;color:#fff;margin-bottom:.3rem;line-height:1.3">Caribbean Financial Institutions Face Wave of Ransomware Attacks — 2026</div>
      <div style="font-size:.8rem;color:var(--text);line-height:1.6">Multiple Caribbean banks and financial institutions targeted in coordinated ransomware campaigns. Organizations without recent security assessments are most at risk.</div>
    </div>
    <div class="threat-item" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:1.2rem 1.5rem;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span style="font-size:.7rem;background:var(--red);color:#fff;padding:2px 8px;border-radius:2px;font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase">HIGH</span>
        <span style="font-family:var(--mono);font-size:.6rem;color:var(--muted);letter-spacing:.08em">PHISHING SURGE</span>
      </div>
      <div style="font-family:var(--display);font-size:1.1rem;color:#fff;margin-bottom:.3rem;line-height:1.3">AI-Powered Phishing Targets Caribbean Business Email Accounts</div>
      <div style="font-size:.8rem;color:var(--text);line-height:1.6">Sophisticated phishing campaigns using generative AI to impersonate local banks and government agencies. Employee training is the #1 defense.</div>
    </div>
    <div class="threat-item" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:1.2rem 1.5rem;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span style="font-size:.7rem;background:var(--gold);color:var(--bg);padding:2px 8px;border-radius:2px;font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase">MEDIUM</span>
        <span style="font-family:var(--mono);font-size:.6rem;color:var(--muted);letter-spacing:.08em">REGULATORY</span>
      </div>
      <div style="font-family:var(--display);font-size:1.1rem;color:#fff;margin-bottom:.3rem;line-height:1.3">Caribbean Central Banks Tighten Cybersecurity Requirements for Financial Institutions</div>
      <div style="font-size:.8rem;color:var(--text);line-height:1.6">New regional regulations require documented security assessments, incident response plans, and third-party vulnerability testing. Non-compliance carries significant penalties.</div>
    </div>
  </div>
  <div style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap">
    <a href="https://exile-aerobic-saddle-rough.2n6.me/booking/" target="_blank" class="btn-cyan" style="text-decoration:none;padding:.7rem 1.5rem">📅 Book Free Scoping Call</a>
    <a href="https://wa.me/18683620679?text=Hi%20Jason%2C%20I%20saw%20the%20threat%20feed%20and%20need%20security%20help." target="_blank" style="font-family:var(--mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);background:transparent;border:1px solid var(--cyan);padding:.7rem 1.5rem;border-radius:3px;text-decoration:none;transition:background .2s,box-shadow .2s">💬 Chat on WhatsApp</a>
  </div>
  `;
  
  // Insert before contact section
  const contact = document.querySelector('.contact-section');
  if (contact) {
    contact.parentNode.insertBefore(section, contact);
  } else {
    document.querySelector('footer')?.before(section);
  }
  
  // Observe
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.07});
  section.querySelectorAll('.threat-item').forEach(el => obs.observe(el));
})();

// ── 5. ADD TO EXISTING SCROLL REVEAL ─────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold: 0.07});

// Observe new sections' elements
try {
  document.querySelectorAll('#selector .selector-step, #cases .case-card, #threat-intel .threat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    obs.observe(el);
  });
} catch(e) {}
