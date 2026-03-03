import React from 'react';
import './CustomControls.css';

type CustomSliderInputProps = {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  onReset?: () => void;
  inputWidth?: string;
  unitLabel?: string;
  title?: string; // Optional tooltip/hover text
};

export function CustomSliderInput({ label, value, onChange, min = 0, max = 100, step = 1, onReset, inputWidth, unitLabel, title }: CustomSliderInputProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      // --- FIX: Clamp the typed value to the min/max limits ---
      const clampedValue = Math.max(min, Math.min(max, num));
      onChange(clampedValue);
    }
  };

  return (
    <div className="custom-control-row">
      <label title={title}>{label}</label>
      <div className="custom-slider-group">
        <input
          type="range"
          className="custom-slider"
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
        />
        <input
          type="number"
          className="custom-number-input"
          style={inputWidth ? { width: inputWidth, padding: '4px 2px' } : undefined}
          value={value}
          onChange={handleNumberChange}
          min={min}
          max={max}
          step={step}
        />
        {unitLabel && (
          <span className="custom-unit-label">{unitLabel}</span>
        )}
        {onReset && (
          <button
            onClick={onReset}
            style={{
              background: 'transparent',
              border: '1px solid #555',
              color: '#ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '4px 8px',
              lineHeight: 1
            }}
            title="Reset"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  );
}

type CustomTextInputProps = {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
};

export function CustomTextInput({ label, value, onChange }: CustomTextInputProps) {
  return (
    <div className="custom-control-row">
      <label>{label}</label>
      <input
        type="text"
        className="custom-text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type CustomButtonGroupProps = {
  children: React.ReactNode;
};

export function CustomButtonGroup({ children }: CustomButtonGroupProps) {
  return <div className="custom-button-group">{children}</div>;
}

type CustomButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function CustomButton({ onClick, children, className = '', title }: CustomButtonProps) {
  return (
    <button className={`custom-button ${className}`} onClick={onClick} title={title}>
      {children}
    </button>
  );
}