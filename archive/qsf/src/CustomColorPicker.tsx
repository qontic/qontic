import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import './CustomColorPicker.css';

type CustomColorPickerProps = {
  label: string;
  color: string;
  onChange: (newColor: string) => void;
};

export function CustomColorPicker({ label, color, onChange }: CustomColorPickerProps) {
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
      <div className="color-picker-container" onClick={(e) => {
        e.stopPropagation(); // --- FIX: Prevent click from reaching the canvas ---
        setIsOpen(!isOpen);
      }}>
        <div className="color-swatch" style={{ backgroundColor: color }} />
        {isOpen && (
          <div className="color-picker-popover">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
}