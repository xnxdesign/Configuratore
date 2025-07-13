// Dentro src/App.tsx

// --- CODICE MIGLIORATO ---
useEffect(() => {
    const appElement = appRef.current;
    if (!appElement) return;

    // Funzione per inviare l'altezza
    const sendHeight = () => {
        const height = appElement.scrollHeight;
        window.parent.postMessage({ type: 'resize-iframe', height: height }, '*');
    };

    // Invia l'altezza più volte per catturare i cambiamenti di layout
    sendHeight(); // Immediatamente
    const aLittleLater = setTimeout(sendHeight, 200); // Dopo un breve ritardo
    const later = setTimeout(sendHeight, 500); // E ancora un po' dopo

    // Aggiungiamo un "osservatore" che controlla se le dimensioni cambiano
    const resizeObserver = new ResizeObserver(() => {
        sendHeight();
    });
    resizeObserver.observe(appElement);

    // Funzione di pulizia: rimuove tutto quando il componente non serve più
    return () => {
        clearTimeout(aLittleLater);
        clearTimeout(later);
        resizeObserver.disconnect();
    };

}, [flow]); // Si attiva quando cambi schermata

  // --- CODICE AGGIUNTO ---
  // Questo "hook" si attiva ogni volta che 'flow' cambia
  useEffect(() => {
    const sendHeight = () => {
      if (appRef.current) {
        const height = appRef.current.scrollHeight;
        // Invia un messaggio alla finestra genitore (Shopify)
        window.parent.postMessage({
          type: 'resize-iframe',
          height: height
        }, '*'); // Usiamo '*' per lo sviluppo, in produzione potresti mettere 'https://tuo-dominio-shopify.com'
      }
    };

    // Invia l'altezza subito e poi di nuovo dopo un piccolo ritardo
    // per dare tempo alle immagini e ai font di caricarsi.
    sendHeight();
    const timeoutId = setTimeout(sendHeight, 500);

    // Pulisce il timeout quando il componente viene smontato
    return () => clearTimeout(timeoutId);

  }, [flow]); // Si attiva quando si passa da selezione a configuratore e viceversa


  return (
    // Aggiungiamo il ref al div principale
    <div ref={appRef} className="min-h-screen p-2 sm:p-5 text-white">
      <div className="max-w-7xl mx-auto bg-[rgba(18,18,35,0.95)] rounded-2xl shadow-[0_20px_40px_rgba(224,255,0,0.1),_0_0_80px_rgba(224,255,0,0.05),_inset_0_1px_0_rgba(255,255,255,0.1)] border border-[rgba(224,255,0,0.2)] overflow-hidden">
        {flow ? (
          <Configurator flow={flow} onBack={handleGoBack} />
        ) : (
          <FlowSelectionScreen onSelectFlow={handleSelectFlow} />
        )}
      </div>
    </div>
  );
};

export default App;