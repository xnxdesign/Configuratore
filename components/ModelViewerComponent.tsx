import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MAPPED_FINISHES } from '../constants';
import { FinishType } from '../types';

// Dichiarazione del tipo per l'elemento model-viewer, se non l'hai già fatto globalmente
// Aiuta TypeScript a capire le proprietà e gli eventi.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}

interface ModelViewerComponentProps {
    modelUrl: string;
    config: any;
    flow: 'stradale' | 'motard';
}

const ModelViewerComponent: React.FC<ModelViewerComponentProps> = ({ modelUrl, config, flow }) => {
    const modelViewerRef = useRef<any>(null); // Usiamo 'any' per semplicità con Web Components
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [textureUrls, setTextureUrls] = useState<{ [key: string]: string }>({});

    // --- LOGICA DI AGGIORNAMENTO DEL MODELLO (invariata, era già corretta) ---
    const applyChange = useCallback(async <T,>(
        changeFn: (modelViewer: any, value: T) => Promise<void> | void,
        value: T
    ) => {
        if (value === undefined || value === null) return;
        const modelViewer = modelViewerRef.current;
        if (modelViewer?.model) {
            try {
                await changeFn(modelViewer, value);
            } catch (e) {
                console.error("Failed to apply model change:", e);
            }
        }
    }, []);
    
    useEffect(() => {
        const newTextureUrls: { [key: string]: string } = {};
        if (config.texture) newTextureUrls.stradaleTexture = URL.createObjectURL(config.texture);
        if (config.canaleOptions?.texture) newTextureUrls.motardTexture = URL.createObjectURL(config.canaleOptions.texture);
        setTextureUrls(newTextureUrls);
        
        return () => {
            Object.values(newTextureUrls).forEach(URL.revokeObjectURL);
        };
    }, [config.texture, config.canaleOptions?.texture]);

    const applyColor = useCallback(async (modelViewer: any, { materialName, color }: { materialName: string, color?: string}) => {
        if (!color || !modelViewer.model) return;
        const material = modelViewer.model.materials.find((m:any) => m.name === materialName);
        if (material) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(null);
            material.pbrMetallicRoughness.setBaseColorFactor(color === 'rainbow' ? [1,1,1] : color);
        } else {
            console.warn(`Material "${materialName}" not found in model.`);
        }
    }, []);

    const applyFinish = useCallback(async (modelViewer: any, { materialName, finish }: { materialName: string, finish?: FinishType }) => {
        if (!finish || !modelViewer.model) return;
        const material = modelViewer.model.materials.find((m:any) => m.name === materialName);
        if (material) {
            const finishProps = MAPPED_FINISHES[finish];
            material.pbrMetallicRoughness.setRoughnessFactor(finishProps.roughness);
            material.pbrMetallicRoughness.setMetallicFactor(finishProps.metallic);
        } else {
            console.warn(`Material "${materialName}" not found in model.`);
        }
    }, []);

    const applyTexture = useCallback(async (modelViewer: any, { materialName, textureUrl }: { materialName: string, textureUrl?: string }) => {
        if (!textureUrl || !modelViewer.model) return;
        const material = modelViewer.model.materials.find((m:any) => m.name === materialName);
        if (material) {
            const texture = await modelViewer.createTexture(textureUrl);
            material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
        } else {
            console.warn(`Material "${materialName}" not found in model.`);
        }
    }, []);

    useEffect(() => {
        if (flow !== 'stradale') return;
        if (config.texture && textureUrls.stradaleTexture) {
            applyChange(applyTexture, { materialName: 'Materiale_Canale_A', textureUrl: textureUrls.stradaleTexture });
        } else {
            applyChange(applyColor, { materialName: 'Materiale_Canale_A', color: config.primaryColor });
            applyChange(applyFinish, { materialName: 'Materiale_Canale_A', finish: config.finish });
        }
        if (config.graficaType === 'intero') {
            if (config.texture && textureUrls.stradaleTexture) {
                applyChange(applyTexture, { materialName: 'Materiale_Canale_B', textureUrl: textureUrls.stradaleTexture });
            } else {
                const colorForB = config.secondaryColor || config.primaryColor;
                applyChange(applyColor, { materialName: 'Materiale_Canale_B', color: colorForB });
                applyChange(applyFinish, { materialName: 'Materiale_Canale_B', finish: config.finish });
            }
        } else {
            applyChange(applyColor, { materialName: 'Materiale_Canale_B', color: '#1A1A1A' });
            applyChange(applyFinish, { materialName: 'Materiale_Canale_B', finish: FinishType.Lucida });
        }
    }, [flow, config.graficaType, config.primaryColor, config.secondaryColor, config.finish, config.texture, textureUrls.stradaleTexture, applyChange, applyColor, applyFinish, applyTexture]);

    useEffect(() => {
        if (flow !== 'motard' || !config.kits?.canale) return;
        const { canaleOptions } = config;
        if (canaleOptions?.texture && textureUrls.motardTexture) {
            applyChange(applyTexture, { materialName: 'Materiale_Canale_A', textureUrl: textureUrls.motardTexture });
        } else {
            applyChange(applyColor, { materialName: 'Materiale_Canale_A', color: canaleOptions?.primaryColor });
            applyChange(applyFinish, { materialName: 'Materiale_Canale_A', finish: canaleOptions?.finish });
        }
        if (canaleOptions?.type === 'intero') {
            if (canaleOptions?.texture && textureUrls.motardTexture) {
                applyChange(applyTexture, { materialName: 'Materiale_Canale_B', textureUrl: textureUrls.motardTexture });
            } else {
                const colorForB = canaleOptions?.secondaryColor || canaleOptions?.primaryColor;
                applyChange(applyColor, { materialName: 'Materiale_Canale_B', color: colorForB });
                applyChange(applyFinish, { materialName: 'Materiale_Canale_B', finish: canaleOptions?.finish });
            }
        } else {
            applyChange(applyColor, { materialName: 'Materiale_Canale_B', color: '#1A1A1A' });
            applyChange(applyFinish, { materialName: 'Materiale_Canale_B', finish: FinishType.Lucida });
        }
    }, [flow, config.kits?.canale, config.canaleOptions, textureUrls.motardTexture, applyChange, applyColor, applyFinish, applyTexture]);
    
    useEffect(() => { 
        if (flow === 'motard' && config.kits?.raggi) {
            applyChange(applyColor, { materialName: 'Materiale_Raggi', color: config.raggiColor }); 
        }
    }, [flow, config.kits?.raggi, config.raggiColor, applyChange, applyColor]);

    useEffect(() => { 
        if (flow === 'motard' && config.kits?.nipples) {
            applyChange(applyColor, { materialName: 'Materiale_Nipples', color: config.nipplesColor });
        }
    }, [flow, config.kits?.nipples, config.nipplesColor, applyChange, applyColor]);
    // --- FINE LOGICA DI AGGIORNAMENTO ---

    // --- GESTIONE CARICAMENTO ED ERRORI (MODIFICATO) ---
    useEffect(() => {
        const modelViewer = modelViewerRef.current;
        if (!modelViewer) return;

        // Reset state for new model
        setIsLoading(true);
        setError(null);
        setLoadingProgress(0);
        
        const handleLoad = () => {
            setIsLoading(false);
            setError(null); // <-- CORREZIONE 1: Assicurati che l'errore venga rimosso al caricamento
        };
        const handleError = (event: any) => {
            setIsLoading(false);
            setError(`Errore nel caricamento del modello 3D. Dettaglio: ${event.detail?.sourceError?.message || 'Errore sconosciuto'}`);
        };
        const handleProgress = (event: any) => {
            setLoadingProgress(event.detail.totalProgress);
        };

        modelViewer.addEventListener('load', handleLoad);
        modelViewer.addEventListener('error', handleError);
        modelViewer.addEventListener('progress', handleProgress);

        return () => {
            modelViewer.removeEventListener('load', handleLoad);
            modelViewer.removeEventListener('error', handleError);
            modelViewer.removeEventListener('progress', handleProgress);
        };
    }, [modelUrl]); // Dipende solo da modelUrl per setup e cleanup degli eventi

    return (
        // --- CORREZIONE 2: Modificate le classi per dimensione e stile ---
        <div className="w-full h-[60vh] md:h-[75vh] p-4 relative bg-[radial-gradient(ellipse_at_center,_rgba(224,255,0,0.05)_0%,_transparent_70%)] border-b border-[rgba(224,255,0,0.2)]">
            <model-viewer
                ref={modelViewerRef}
                src={modelUrl}
                alt="Cerchio da Moto"
                shadow-intensity="1" // Un'ombra leggermente più definita
                camera-controls
                auto-rotate
                rotation-per-second="20deg" // Rotazione leggermente più lenta
                camera-orbit="0deg 75deg 2.5m" // Leggermente più distante
                field-of-view="30deg"
                loading="eager"
                disable-zoom
                interaction-prompt="none"
                ar-modes="webxr scene-viewer quick-look"
                tone-mapping="neutral"
                seamless-poster
                // --- CORREZIONE 3: classe per riempire il contenitore ---
                class="w-full h-full"
            >
            </model-viewer>

            {/* Overlays, la loro logica ora funzionerà correttamente */}
            {isLoading && !error && (
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
                    <div className="w-48 h-1 bg-[rgba(224,255,0,0.2)] rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-gradient-to-r from-[#e0ff00] to-[#80ff00] transition-all duration-300" 
                            style={{ width: `${loadingProgress * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex justify-center items-center p-4 z-10">
                    <div className="text-center bg-[rgba(18,18,35,0.9)] p-8 rounded-lg border border-[rgba(224,255,0,0.3)] backdrop-blur-sm">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="font-bold text-lg mb-2">Modello 3D non disponibile</h3>
                        <p className="text-sm text-gray-400 max-w-xs">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelViewerComponent;