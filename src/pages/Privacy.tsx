const Privacy = () => (
  <div className="min-h-screen bg-background text-foreground p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Zásady ochrany osobních údajů</h1>
    <p className="text-muted-foreground text-sm mb-4">Poslední aktualizace: 4. dubna 2026</p>

    <section className="space-y-4 text-sm leading-relaxed">
      <div>
        <h2 className="text-lg font-semibold mb-2">1. Jaké údaje shromažďujeme</h2>
        <p>Při registraci shromažďujeme vaši e-mailovou adresu. Během používání aplikace ukládáme záznamy o náladě, deníkové zápisky, kontakty SOS a údaje o postupu (XP, série).</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">2. Jak údaje používáme</h2>
        <p>Vaše údaje používáme výhradně k poskytování funkcí aplikace Monkey Mind — sledování nálady, AI chat, deník a gamifikace. Údaje neprodáváme ani nesdílíme s třetími stranami za účelem marketingu.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">3. Ukládání a zabezpečení dat</h2>
        <p>Data jsou bezpečně uložena pomocí šifrovaných cloudových služeb. Přístup k vašim osobním údajům máte pouze vy prostřednictvím svého účtu.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">4. AI Chat</h2>
        <p>Konverzace s AI asistentem nejsou trvale ukládány na našich serverech. AI asistent neposkytuje lékařské ani terapeutické poradenství.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">5. Děti a mladiství</h2>
        <p>Aplikace je určena pro teenagery (13+). Uživatelé mladší 16 let by měli mít souhlas zákonného zástupce.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">6. Vaše práva</h2>
        <p>Máte právo požádat o přístup ke svým údajům, jejich opravu nebo smazání. Kontaktujte nás na e-mailu níže.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">7. Kontakt</h2>
        <p>V případě dotazů ohledně ochrany osobních údajů nás kontaktujte na: <a href="mailto:privacy@monkeymind.app" className="text-primary underline">privacy@monkeymind.app</a></p>
      </div>
    </section>

    <p className="text-muted-foreground text-xs mt-8">© 2026 Monkey Mind. Všechna práva vyhrazena.</p>
  </div>
);

export default Privacy;
