/// <reference types="react" />

interface ModelMaterial {
  name: string;
  pbrMetallicRoughness: {
    setBaseColorFactor: (color: number[] | string) => void;
    baseColorTexture: {
      setTexture: (texture: any) => void;
    };
    setMetallicFactor: (value: number) => void;
    setRoughnessFactor: (value: number) => void;
  };
}

interface Model {
  materials: ModelMaterial[];
}

interface ModelViewerElement extends HTMLElement {
  src?: string | null;
  alt?: string | null;
  cameraControls?: boolean;
  autoRotate?: boolean;
  model: Model | null;
  createTexture: (uri: string, type?: '2d' | 'cube') => Promise<any>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<ModelViewerElement>,
        ModelViewerElement
      > & {
        src?: string;
        alt?: string;
        'shadow-intensity'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'rotation-per-second'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'camera-orbit'?: string;
        'field-of-view'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        'disable-zoom'?: boolean;
        'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
        ar?: boolean;
        'ar-modes'?: string;
        'tone-mapping'?: 'neutral' | 'agx' | 'commerce';
        'seamless-poster'?: boolean;
        [key: string]: any;
      };
    }
  }
}
