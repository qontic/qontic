// ParametricEditorModal.tsx
import { useState, useEffect, useRef } from 'react';
import type { CustomParameter, ParameterRelation } from './types.ts';
import './ParametricEditorModal.css'; // We will replace this file next

type Props = {
  show: boolean;
  onClose: () => void;
  parameters: CustomParameter[];
  relations: ParameterRelation[];
  setParameters: (p: CustomParameter[] | ((prev: CustomParameter[]) => CustomParameter[])) => void;
  setRelations: (r: ParameterRelation[] | ((prev: ParameterRelation[]) => ParameterRelation[])) => void;
};

export function ParametricEditorModal({
  show,
  onClose,
  parameters,
  relations,
  setParameters,
  setRelations,
}: Props) {
  // --- This is the key ---
  // We use local state for the "draft" text.
  // This avoids updating the main app on every keystroke.
  const [paramsText, setParamsText] = useState('');
  const [relationsText, setRelationsText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const didOpen = useRef(false);

  // When the modal is shown (or the props change),
  // reset the text areas to match the app's current state.
  useEffect(() => {
    // Is the modal being displayed?
    if (show) {
      // Check if we *just* opened it (i.e., didOpen is still false)
      // This stops it from resetting the text when a prop changes
      // (like from a slider in the main panel).
      if (!didOpen.current) {
        setParamsText(JSON.stringify(parameters, null, 2));
        setRelationsText(JSON.stringify(relations, null, 2));
        setError(null); // Clear any old errors
        didOpen.current = true; // Mark it as open
      }
    } else {
      // When the modal is closed, reset the ref for next time.
      didOpen.current = false;
    }
    // We keep these dependencies. If the main state changes,
    // this effect will run, but our new `if` statement
    // will protect the user's typing.
  }, [show, parameters, relations]);

  if (!show) {
    return null;
  }

  const handleApply = () => {
    try {
      const newParams = JSON.parse(paramsText) as CustomParameter[];
      const newRelations = JSON.parse(relationsText) as ParameterRelation[];

      // Basic validation
      if (Array.isArray(newParams) && Array.isArray(newRelations)) {
        // All good! Update the main app state
        setParameters(newParams);
        setRelations(newRelations);
        onClose(); // Close the modal
      } else {
        setError('Invalid JSON structure. Data must be an array.');
      }
    } catch (e) {
      console.error('Error parsing parametric JSON:', e);
      setError('Error parsing JSON. Check console for details.');
    }
  };

  return (
    // We use our own simple CSS classes now
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Parametric Editor</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <label htmlFor="params-textarea">Parameters</label>
          <textarea
            id="params-textarea"
            className="modal-textarea"
            value={paramsText}
            onChange={(e) => setParamsText(e.target.value)}
          />

          <label htmlFor="relations-textarea">Relations</label>
          <textarea
            id="relations-textarea"
            className="modal-textarea"
            value={relationsText}
            onChange={(e) => setRelationsText(e.target.value)}
          />
        </div>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn-apply" onClick={handleApply}>
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}