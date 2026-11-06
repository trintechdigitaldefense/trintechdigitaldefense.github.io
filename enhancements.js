// LEGACY MODULE — NOT LOADED BY THE WEBSITE.
// The service selector below contains historical pricing and descriptions.
// Do not include this file in any page until every recommendation is revalidated
// against the current published source of truth and independently tested.
// The homepage enquiry and pricing experience are maintained in index.html.

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
