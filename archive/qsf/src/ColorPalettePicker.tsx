import { useState, useRef, useEffect } from 'react';
import './ColorPalettePicker.css';

type ColorPalettePickerProps = {
  label: string;
  palettes: Record<string, string>;
  selectedPalette: string;
  onChange: (newPalette: string) => void;
};

export function ColorPalettePicker({ label, palettes, selectedPalette, onChange }: ColorPalettePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-control-row" ref={popoverRef}>
      <label>{label}</label>
      <div className="palette-picker-container">
        <div className="palette-swatch-current" onClick={() => setIsOpen(!isOpen)}>
          <div className="palette-gradient" style={{ backgroundImage: palettes[selectedPalette] }} />
        </div>
        {isOpen && (
          <div className="palette-picker-popover">
            {Object.entries(palettes).map(([name, gradient]) => (
              <div
                key={name}
                className="palette-option"
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                }}
              >
                <div className="palette-gradient" style={{ backgroundImage: gradient }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}