import type { TransformControlsMode } from './types.ts';
import './Toolbar.css'; // You'd need to create this CSS file

type Props = {
  mode: TransformControlsMode;
  setMode: (mode: TransformControlsMode) => void;
};

export function Toolbar({ mode, setMode }: Props) {
  return (
    <div className="toolbar-container">
      <button
        className={mode === 'translate' ? 'active' : ''}
        onClick={() => setMode('translate')}
      >
        Move (W)
      </button>
      <button
        className={mode === 'rotate' ? 'active' : ''}
        onClick={() => setMode('rotate')}
      >
        Rotate (E)
      </button>
      <button
        className={mode === 'scale' ? 'active' : ''}
        onClick={() => setMode('scale')}
      >
        Scale (R)
      </button>
    </div>
  );
}