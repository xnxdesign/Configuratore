
import React, { useState } from 'react';
import { Flow } from './types';
import Configurator from './components/Configurator';

const FlowCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <div
        onClick={onClick}
        className="group relative bg-[rgba(18,18,35,0.8)] border-2 border-[rgba(224,255,0,0.3)] rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out hover:border-[#e0ff00] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(224,255,0,0.3)] backdrop-blur-md overflow-hidden"
    >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[rgba(224,255,0,0.1)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
        <div className="relative z-10">
            <div className="text-6xl mb-6 drop-shadow-[0_0_20px_rgba(224,255,0,0.8)]">{icon}</div>
            <h3 className="text-2xl font-bold mb-4 text-shadow-[0_0_10px_rgba(224,255,0,0.3)]">{title}</h3>
            <p className="text-gray-400 mb-8 text-lg">{description}</p>
            <button className="bg-gradient-to-r from-[#e0ff00] to-[#80ff00] text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider shadow-[0_8px_25px_rgba(224,255,0,0.3)] transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(224,255,0,0.4)] group-hover:-translate-y-0.5">
                Inizia Configurazione
            </button>
        </div>
    </div>
);

const FlowSelectionScreen: React.FC<{ onSelectFlow: (flow: Flow) => void }> = ({ onSelectFlow }) => (
    <div className="p-10 sm:p-16 text-center bg-[radial-gradient(ellipse_at_center,_rgba(224,255,0,0.1)_0%,_transparent_70%)]">
      <h2 className="text-4xl md:text-5xl font-black mb-5 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#e0ff00] [text-shadow:0_0_20px_rgba(224,255,0,0.5)] tracking-tighter">
        Personalizza il Tuo Cerchio
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-[#e0ff00] to-[#ff00ff] mx-auto my-5 rounded-full shadow-[0_0_20px_rgba(224,255,0,0.6)]"></div>
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mt-10">
        <FlowCard
          icon="🏍️"
          title="Moto Stradale"
          description="Personalizza il canale del cerchio"
          onClick={() => onSelectFlow(Flow.Stradale)}
        />
        <FlowCard
          icon="🏁"
          title="Motard / Enduro"
          description="Kit componibili per personalizzazione completa"
          onClick={() => onSelectFlow(Flow.Motard)}
        />
      </div>
    </div>
);


const App: React.FC = () => {
  const [flow, setFlow] = useState<Flow | null>(null);

  const handleSelectFlow = (selectedFlow: Flow) => {
    setFlow(selectedFlow);
  };

  const handleGoBack = () => {
    setFlow(null);
  };

  return (
    <div className="min-h-screen p-2 sm:p-5 text-white">
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
