import { useState, useEffect } from 'react';
import './ParametricEditorModal.css'; // Reuse the same CSS for a consistent look

type Props = {
  show: boolean;
  title: string;
  initialName: string;
  initialFormula: string;
  nameLabel?: string;
  formulaLabel?: string;
  onClose: () => void;
  onSave: (newName: string, newFormula: string) => void;
};

export function FormulaEditorModal({
  show,
  title,
  initialName,
  initialFormula,
  nameLabel = "Name",
  formulaLabel = "Formula / Expression",
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');

  // When the modal is shown, populate its state from the props
  useEffect(() => {
    if (show) {
      setName(initialName);
      setFormula(initialFormula);
    }
  }, [show, initialName, initialFormula]);

  if (!show) {
    return null;
  }

  const handleApply = () => {
    onSave(name, formula);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <label htmlFor="formula-name-input">{nameLabel}</label>
          <input
            id="formula-name-input"
            type="text"
            className="modal-input" // We'll need to add this class to the CSS
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="formula-textarea">{formulaLabel}</label>
          <textarea
            id="formula-textarea"
            className="modal-textarea"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            rows={5}
          />
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-apply" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}