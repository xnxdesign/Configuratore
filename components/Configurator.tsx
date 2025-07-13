
import React, { useState, useMemo, useCallback } from 'react';
import { Flow, Configuration, StradaleConfiguration, MotardConfiguration, GraphicType, FinishType } from '../types';
import { STRADALE_MODEL_URL, MOTARD_MODEL_URL, PRICES, PRODUCT_IDS, COLOR_PALETTE } from '../constants';
import ModelViewerComponent from './ModelViewerComponent';
import ColorPalette from './ColorPalette';

// --- HELPER COMPONENTS (defined outside main component) ---

const OptionGroup: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
    <div className={`mb-8 bg-[rgba(18,18,35,0.6)] rounded-xl p-6 border border-[rgba(224,255,0,0.1)] backdrop-blur-sm ${className}`}>
        <h3 className="text-xl font-bold text-white mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-[#e0ff00] after:to-transparent">
            {title}
        </h3>
        {children}
    </div>
);

const RadioOption: React.FC<{ name: string, value: string, label: string, price: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, label, price, checked, onChange }) => (
    <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${checked ? 'border-[#e0ff00] bg-[rgba(224,255,0,0.1)]' : 'border-[rgba(224,255,0,0.2)] hover:border-[#e0ff00]'}`}>
        <div className="flex items-center">
            <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="h-5 w-5 mr-4 accent-[#e0ff00] bg-gray-700" />
            <span className={`font-semibold ${checked ? 'text-[#e0ff00]' : 'text-white'}`}>{label}</span>
        </div>
        <span className="font-bold text-[#00ff88]">{price}</span>
    </label>
);

const KitCheckbox: React.FC<{ kitId: string; label: string; price: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ kitId, label, price, checked, onChange }) => (
    <label htmlFor={kitId} className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/20 rounded-lg">
        <div className="flex items-center">
            <input type="checkbox" id={kitId} name="kit" checked={checked} onChange={onChange} className="h-6 w-6 mr-4 accent-[#e0ff00] bg-gray-700 rounded-md border-slate-500" />
            <span className="font-semibold text-lg text-white">{label}</span>
        </div>
        <span className="font-bold text-lg text-[#00ff88]">{price}</span>
    </label>
);

// --- MAIN CONFIGURATOR COMPONENT ---

interface ConfiguratorProps {
  flow: Flow;
  onBack: () => void;
}

const Configurator: React.FC<ConfiguratorProps> = ({ flow, onBack }) => {
    const isStradale = flow === Flow.Stradale;
    
    const initialStradaleState: StradaleConfiguration = {
        type: Flow.Stradale,
        graficaType: GraphicType.Meta,
        primaryColor: COLOR_PALETTE[0].hex,
        finish: FinishType.Lucida,
    };

    const initialMotardState: MotardConfiguration = {
        type: Flow.Motard,
        kits: { canale: false, raggi: false, nipples: false },
        canaleOptions: {
            type: GraphicType.Meta,
            primaryColor: COLOR_PALETTE[0].hex,
            finish: FinishType.Lucida,
        },
        raggiColor: COLOR_PALETTE[0].hex,
        nipplesColor: COLOR_PALETTE[0].hex,
    };

    const [configuration, setConfiguration] = useState<Configuration>(isStradale ? initialStradaleState : initialMotardState);

    const updateConfig = <K extends keyof Configuration>(key: K, value: Configuration[K]) => {
        setConfiguration(prev => ({ ...prev, [key]: value }));
    };
    
    const updateStradaleConfig = <K extends keyof StradaleConfiguration>(key: K, value: StradaleConfiguration[K]) => {
        setConfiguration(prev => ({ ...(prev as StradaleConfiguration), [key]: value }));
    };

    const updateMotardConfig = <K extends keyof MotardConfiguration>(key: K, value: MotardConfiguration[K]) => {
        setConfiguration(prev => ({ ...(prev as MotardConfiguration), [key]: value }));
    };

    const handleTextureUpload = (file: File | undefined, kit: 'stradale' | 'canale') => {
        if (!file) return;
        if(kit === 'stradale' && configuration.type === Flow.Stradale) {
            updateStradaleConfig('texture', file);
        } else if (kit === 'canale' && configuration.type === Flow.Motard) {
            const newCanaleOptions = {...configuration.canaleOptions, texture: file};
            updateMotardConfig('canaleOptions', newCanaleOptions);
        }
    };

    const removeTexture = (kit: 'stradale' | 'canale') => {
        if(kit === 'stradale' && configuration.type === Flow.Stradale) {
            updateStradaleConfig('texture', undefined);
        } else if (kit === 'canale' && configuration.type === Flow.Motard) {
            const newCanaleOptions = {...configuration.canaleOptions, texture: undefined};
            updateMotardConfig('canaleOptions', newCanaleOptions);
        }
    };
    
    const totalPrice = useMemo(() => {
        let price = 0;
        if (configuration.type === Flow.Stradale) {
            price += configuration.graficaType === GraphicType.Meta ? PRICES['kit-canale-meta'] : PRICES['kit-canale-intero'];
            if(configuration.finish !== FinishType.Lucida) price += PRICES[`finitura-${configuration.finish}`];
        } else {
            let kitCount = 0;
            if (configuration.kits.canale) {
                kitCount++;
                price += configuration.canaleOptions.type === GraphicType.Meta ? PRICES['kit-canale-meta'] : PRICES['kit-canale-intero'];
                if(configuration.canaleOptions.finish !== FinishType.Lucida) price += PRICES[`finitura-${configuration.canaleOptions.finish}`];
            }
            if (configuration.kits.raggi) { kitCount++; price += PRICES['kit-raggi']; }
            if (configuration.kits.nipples) { kitCount++; price += PRICES['kit-nipples']; }

            if(kitCount === 3) {
                price *= 0.9; // 10% discount
            }
        }
        return price;
    }, [configuration]);

    const getCartItems = useCallback(() => {
        const items: { id: string, quantity: number }[] = [];
        if (configuration.type === Flow.Stradale) {
            const variantKey = configuration.graficaType === GraphicType.Meta ? 'kit-canale-meta' : 'kit-canale-intero';
            items.push({ id: PRODUCT_IDS[variantKey], quantity: 1 });
            if (configuration.finish !== FinishType.Lucida) {
                items.push({ id: PRODUCT_IDS[`finitura-${configuration.finish}`], quantity: 1 });
            }
        } else {
            if (configuration.kits.canale) {
                const variantKey = configuration.canaleOptions.type === GraphicType.Meta ? 'kit-canale-meta' : 'kit-canale-intero';
                items.push({ id: PRODUCT_IDS[variantKey], quantity: 1 });
                if (configuration.canaleOptions.finish !== FinishType.Lucida) {
                    items.push({ id: PRODUCT_IDS[`finitura-${configuration.canaleOptions.finish}`], quantity: 1 });
                }
            }
            if (configuration.kits.raggi) items.push({ id: PRODUCT_IDS['kit-raggi'], quantity: 1 });
            if (configuration.kits.nipples) items.push({ id: PRODUCT_IDS['kit-nipples'], quantity: 1 });
        }
        return items;
    }, [configuration]);

    const isAddToCartDisabled = useMemo(() => getCartItems().length === 0, [getCartItems]);

    const handleBuyNow = () => {
        if (isAddToCartDisabled) return;
        const items = getCartItems();
        const checkoutUrl = `/cart/${items.map(item => `${item.id}:${item.quantity}`).join(',')}`;
        window.location.href = checkoutUrl;
    };
    
    return (
        <div className="main-configurator">
            <header className="configurator-header flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b border-[rgba(224,255,0,0.2)] bg-[rgba(10,10,25,0.8)] backdrop-blur-md">
                <button onClick={onBack} className="back-btn self-start md:self-center bg-[rgba(108,117,125,0.2)] text-[#e0ff00] border border-[rgba(224,255,0,0.3)] py-2 px-5 rounded-full text-sm font-semibold transition-all hover:bg-[rgba(224,255,0,0.1)] hover:border-[#e0ff00]">
                    ← Torna Indietro
                </button>
                <h2 className="text-2xl md:text-3xl font-extrabold text-shadow-[0_0_20px_rgba(224,255,0,0.5)]">
                    {isStradale ? 'Moto Stradale' : 'Motard / Enduro'}
                </h2>
                {/* Price display is now moved below */}
                 <div className="w-48 hidden md:block"></div> {/* Placeholder to balance the header */}
            </header>

            <ModelViewerComponent modelUrl={isStradale ? STRADALE_MODEL_URL : MOTARD_MODEL_URL} config={configuration} flow={flow} />

            <div className="options-panel p-4 md:p-10 bg-[rgba(10,10,25,0.6)] backdrop-blur-lg">
                {configuration.type === Flow.Stradale && (
                    <div id="stradale-options">
                        <OptionGroup title="Tipo Grafica">
                            <div className="flex flex-col gap-4">
                                <RadioOption name="grafica-type" value={GraphicType.Meta} label="Metà Cerchio" price="€47,00" checked={configuration.graficaType === GraphicType.Meta} onChange={(e) => updateStradaleConfig('graficaType', e.target.value as GraphicType)} />
                                <RadioOption name="grafica-type" value={GraphicType.Intero} label="Intero Cerchio" price="€97,00" checked={configuration.graficaType === GraphicType.Intero} onChange={(e) => updateStradaleConfig('graficaType', e.target.value as GraphicType)} />
                            </div>
                        </OptionGroup>
                        <OptionGroup title="Colore Principale">
                            <ColorPalette selectedColor={configuration.primaryColor} onSelectColor={(color) => updateStradaleConfig('primaryColor', color)} paletteId="stradale-primary" />
                        </OptionGroup>
                        {configuration.graficaType === 'intero' && (
                             <OptionGroup title="Colore Secondario">
                                <ColorPalette selectedColor={configuration.secondaryColor} onSelectColor={(color) => updateStradaleConfig('secondaryColor', color)} paletteId="stradale-secondary" />
                            </OptionGroup>
                        )}
                        <OptionGroup title="Finitura">
                             <div className="flex flex-col gap-4">
                                {Object.values(FinishType).map(finish => (
                                    <RadioOption key={finish} name="finish" value={finish} label={finish.charAt(0).toUpperCase() + finish.slice(1)} price={`+€${(PRICES[`finitura-${finish}`] || 0).toFixed(2)}`} checked={configuration.finish === finish} onChange={(e) => updateStradaleConfig('finish', e.target.value as FinishType)} />
                                ))}
                            </div>
                        </OptionGroup>
                        <OptionGroup title="Upload Grafica Personalizzata">
                            <div className="flex flex-col items-center gap-4">
                                <label htmlFor="texture-upload" className="w-full text-center py-3 px-6 bg-gradient-to-r from-[#e0ff00] to-[#80ff00] text-black font-bold rounded-full cursor-pointer transition-transform hover:scale-105">Carica Immagine</label>
                                <input id="texture-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleTextureUpload(e.target.files?.[0], 'stradale')} />
                                {configuration.texture && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-300 mb-2">{configuration.texture.name}</p>
                                        <button onClick={() => removeTexture('stradale')} className="py-2 px-4 bg-red-600 text-white font-semibold rounded-full text-sm">Rimuovi</button>
                                    </div>
                                )}
                            </div>
                        </OptionGroup>
                    </div>
                )}
                 {configuration.type === Flow.Motard && (
                    <div id="motard-options">
                        {/* Bundle Message */}
                        {Object.values(configuration.kits).filter(k => k).length === 3 ? (
                            <div className="mb-8 text-center p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-300 font-semibold">
                                🎉 Sconto Bundle applicato: <strong>-10%</strong>
                            </div>
                        ) : (
                            <div className="mb-8 text-center p-4 rounded-lg bg-amber-500/20 border border-amber-500 text-amber-300 font-semibold">
                                💡 Aggiungi tutti e 3 i kit per ottenere il <strong>10% di sconto</strong>!
                            </div>
                        )}

                        {/* Canale Kit */}
                        <OptionGroup title="Kit Canale">
                            <KitCheckbox
                                kitId="kit-canale"
                                label="Kit Canale"
                                price={`da €${PRICES['kit-canale-meta'].toFixed(2)}`}
                                checked={configuration.kits.canale}
                                onChange={(e) => updateMotardConfig('kits', { ...configuration.kits, canale: e.target.checked })}
                            />
                            {configuration.kits.canale && (
                                <div className="pl-6 pt-4 mt-4 border-l-2 border-slate-700/50 ml-4 space-y-6">
                                    <div>
                                        <h4 className="text-md font-bold text-slate-300 mb-3">Tipo Grafica</h4>
                                        <div className="flex flex-col gap-4">
                                            <RadioOption name="canale-grafica-type" value={GraphicType.Meta} label="Metà Cerchio" price={`€${PRICES['kit-canale-meta'].toFixed(2)}`} checked={configuration.canaleOptions.type === GraphicType.Meta} onChange={(e) => updateMotardConfig('canaleOptions', {...configuration.canaleOptions, type: e.target.value as GraphicType})} />
                                            <RadioOption name="canale-grafica-type" value={GraphicType.Intero} label="Intero Cerchio" price={`€${PRICES['kit-canale-intero'].toFixed(2)}`} checked={configuration.canaleOptions.type === GraphicType.Intero} onChange={(e) => updateMotardConfig('canaleOptions', {...configuration.canaleOptions, type: e.target.value as GraphicType})} />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-md font-bold text-slate-300 mb-3">Colore Principale</h4>
                                        <ColorPalette selectedColor={configuration.canaleOptions.primaryColor} onSelectColor={(color) => updateMotardConfig('canaleOptions', {...configuration.canaleOptions, primaryColor: color})} paletteId="motard-canale-primary" />
                                    </div>
                                    
                                    {configuration.canaleOptions.type === GraphicType.Intero && (
                                        <div>
                                            <h4 className="text-md font-bold text-slate-300 mb-3">Colore Secondario</h4>
                                            <ColorPalette selectedColor={configuration.canaleOptions.secondaryColor} onSelectColor={(color) => updateMotardConfig('canaleOptions', {...configuration.canaleOptions, secondaryColor: color})} paletteId="motard-canale-secondary" />
                                        </div>
                                    )}
                                    
                                    <div>
                                        <h4 className="text-md font-bold text-slate-300 mb-3">Finitura</h4>
                                        <div className="flex flex-col gap-4">
                                            {Object.values(FinishType).map(finish => (
                                                <RadioOption key={finish} name="canale-finish" value={finish} label={finish.charAt(0).toUpperCase() + finish.slice(1)} price={`+€${(PRICES[`finitura-${finish}`] || 0).toFixed(2)}`} checked={configuration.canaleOptions.finish === finish} onChange={(e) => updateMotardConfig('canaleOptions', {...configuration.canaleOptions, finish: e.target.value as FinishType})} />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-bold text-slate-300 mb-3">Upload Grafica</h4>
                                        <div className="flex flex-col items-center gap-4">
                                            <label htmlFor="motard-texture-upload" className="w-full text-center py-3 px-6 bg-gradient-to-r from-[#e0ff00] to-[#80ff00] text-black font-bold rounded-full cursor-pointer transition-transform hover:scale-105">Carica Immagine</label>
                                            <input id="motard-texture-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleTextureUpload(e.target.files?.[0], 'canale')} />
                                            {configuration.canaleOptions.texture && (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-300 mb-2">{configuration.canaleOptions.texture.name}</p>
                                                    <button onClick={() => removeTexture('canale')} className="py-2 px-4 bg-red-600 text-white font-semibold rounded-full text-sm">Rimuovi</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </OptionGroup>

                        {/* Raggi Kit */}
                        <OptionGroup title="Kit Raggi">
                            <KitCheckbox
                                kitId="kit-raggi"
                                label="Kit Raggi"
                                price={`€${PRICES['kit-raggi'].toFixed(2)}`}
                                checked={configuration.kits.raggi}
                                onChange={(e) => updateMotardConfig('kits', { ...configuration.kits, raggi: e.target.checked })}
                            />
                            {configuration.kits.raggi && (
                                <div className="pl-6 pt-4 mt-4 border-l-2 border-slate-700/50 ml-4">
                                    <h4 className="text-md font-bold text-slate-300 mb-3">Colore Raggi</h4>
                                    <ColorPalette selectedColor={configuration.raggiColor} onSelectColor={(color) => updateMotardConfig('raggiColor', color)} paletteId="motard-raggi" />
                                </div>
                            )}
                        </OptionGroup>

                        {/* Nipples Kit */}
                        <OptionGroup title="Kit Nipples">
                            <KitCheckbox
                                kitId="kit-nipples"
                                label="Kit Nipples"
                                price={`€${PRICES['kit-nipples'].toFixed(2)}`}
                                checked={configuration.kits.nipples}
                                onChange={(e) => updateMotardConfig('kits', { ...configuration.kits, nipples: e.target.checked })}
                            />
                            {configuration.kits.nipples && (
                                <div className="pl-6 pt-4 mt-4 border-l-2 border-slate-700/50 ml-4">
                                    <h4 className="text-md font-bold text-slate-300 mb-3">Colore Nipples</h4>
                                    <ColorPalette selectedColor={configuration.nipplesColor} onSelectColor={(color) => updateMotardConfig('nipplesColor', color)} paletteId="motard-nipples" />
                                </div>
                            )}
                        </OptionGroup>
                    </div>
                )}
            </div>
            
            <form action="/cart/add" method="post" encType="multipart/form-data" id="product-form" onSubmit={(e) => { if(isAddToCartDisabled) e.preventDefault(); }}>
                 <input type="hidden" name="form_type" value="product" />
                 <input type="hidden" name="utf8" value="✓" />
                 <div id="cart-items-container">
                    {getCartItems().map(item => <input key={item.id} type="hidden" name="items[][id]" value={item.id} />)}
                 </div>
                 <div className="purchase-section p-6 md:p-10 bg-[rgba(10,10,25,0.8)] border-t border-[rgba(224,255,0,0.2)]">
                    <div className="price-display flex flex-col items-center gap-2 mb-6 bg-[rgba(224,255,0,0.05)] py-4 px-6 rounded-xl border border-[rgba(224,255,0,0.2)]">
                        <span className="text-base text-gray-300 uppercase font-semibold tracking-wider">Prezzo Finale</span>
                        <span className="text-3xl font-black text-[#e0ff00] [text-shadow:0_0_20px_rgba(224,255,0,0.8)]">
                            {totalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <button type="submit" name="add" className="btn-add-to-cart w-full py-4 px-8 rounded-full text-lg font-black uppercase tracking-widest transition-all bg-gradient-to-r from-[#e0ff00] to-[#80ff00] text-black shadow-[0_15px_35px_rgba(224,255,0,0.3)] hover:enabled:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isAddToCartDisabled}>
                            Aggiungi al Carrello
                        </button>
                        <button type="button" onClick={handleBuyNow} className="btn-buy-now w-full py-4 px-8 rounded-full text-lg font-black uppercase tracking-widest transition-all bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_15px_35px_rgba(255,107,0,0.3)] hover:enabled:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isAddToCartDisabled}>
                            Acquista Ora
                        </button>
                    </div>
                 </div>
            </form>
        </div>
    );
};


export default Configurator;