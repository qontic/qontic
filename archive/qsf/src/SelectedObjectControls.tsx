import { useState, useRef, useEffect } from 'react';
import type { SceneObjectType, TransformControlsMode, PhysicsDomain, ParameterRelation } from './types.ts';
import * as THREE from 'three';
import { CustomSliderInput, CustomButton, CustomButtonGroup } from './CustomControls';
import { CustomColorPicker } from './CustomColorPicker';
import './SelectedObjectControls.css';
import * as math from 'mathjs';
import { expandMacro } from './utils';
import { PALETTE_DEFINITIONS, getCssGradient } from './colorPalettes';
import { ColorPalettePicker } from './ColorPalettePicker';

// Palette map used by ColorPalettePicker (built once at module level)
const DETECTOR_PALETTES: Record<string, string> = Object.keys(PALETTE_DEFINITIONS).reduce(
  (acc, key) => { acc[key] = getCssGradient(key); return acc; },
  {} as Record<string, string>
);

// Helper function to derive Bohmian particle velocity from wave equation
const deriveBohmianVelocity = (domain: PhysicsDomain): string | null => {
  if (!domain.waveEquation) return null;

  const waveEq = domain.waveEquation;
  const numParticles = waveEq.numberOfParticles || 1;
  if (numParticles !== 1) return null;

  try {
    let expanded = expandMacro(waveEq.expression, numParticles);

    // Inline derived variables
    if (waveEq.derivedVariables && waveEq.derivedVariables.length > 0) {
      for (const v of waveEq.derivedVariables) {
        if (!v.name || !v.expression) continue;
        const defExpanded = expandMacro(v.expression, numParticles);
        if (!defExpanded) continue;
        const pattern = new RegExp(`\\b${v.name}\\b`, 'g');
        expanded = expanded.replace(pattern, `(${defExpanded})`);
      }
    }

    const psiNode = math.parse(expanded);
    const dPsiDx = math.derivative(psiNode, 'x');
    const dPsiDy = math.derivative(psiNode, 'y');
    const dPsiDz = math.derivative(psiNode, 'z');

    const psiStr = psiNode.toString();
    const ratioDx = math.simplify(`(${dPsiDx.toString()})/(${psiStr})`);
    const ratioDy = math.simplify(`(${dPsiDy.toString()})/(${psiStr})`);
    const ratioDz = math.simplify(`(${dPsiDz.toString()})/(${psiStr})`);

    const imagOf = (node: any): string => {
      const raw = node.toString().replace(/\s+/g, '');
      const conj = raw.replace(/\bi\b/g, '(-i)');
      const expr = `((${raw})-(${conj}))/(2*i)`;
      const simplified = math.simplify(expr);
      return simplified.toString();
    };

    const simplifyWithDerived = (exprStr: string): string => {
      let out = exprStr.replace(/\s+/g, '');
      if (!domain.waveEquation?.derivedVariables) return out;
      for (const v of domain.waveEquation.derivedVariables) {
        if (!v.name || !v.expression) continue;
        const defExpanded = expandMacro(v.expression, numParticles);
        if (!defExpanded) continue;
        let pattern = defExpanded.replace(/\s+/g, '');
        try {
          pattern = math.simplify(defExpanded).toString().replace(/\s+/g, '');
        } catch {}
        if (!pattern) continue;
        out = out.split(pattern).join(v.name);
      }
      return out;
    };

    const imDx = simplifyWithDerived(imagOf(ratioDx));
    const imDy = simplifyWithDerived(imagOf(ratioDy));
    const imDz = simplifyWithDerived(imagOf(ratioDz));

    const simplifyComponent = (expr: string): string => {
      try {
        return math.simplify(expr).toString();
      } catch {
        return expr;
      }
    };

    const vx = simplifyComponent(`hbar/mass*(${imDx})`);
    const vy = simplifyComponent(`hbar/mass*(${imDy})`);
    const vz = simplifyComponent(`hbar/mass*(${imDz})`);

    return `[${vx},${vy},${vz}]`;
  } catch (e) {
    console.warn('Failed to derive Bohmian velocity:', e);
    return null;
  }
};

type Props = {
  selectedId: string;
  selectedObjectData: SceneObjectType;
  updateObject: (id: string, newProps: Partial<SceneObjectType> | ((prev: SceneObjectType) => Partial<SceneObjectType>)) => void;
  updateAllDomains: (updater: (domain: PhysicsDomain) => PhysicsDomain) => void;
  updateAllRelations: (updater: (relation: ParameterRelation) => ParameterRelation) => void;
  deleteObject: (id: string) => void;
  isDragging: boolean; // <-- NEW: To prevent feedback loops
  sceneBounds: THREE.Box3 | null;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  transformMode: TransformControlsMode;
  setTransformMode: (mode: TransformControlsMode) => void;
  onChangeDetectorPalette?: (palette: string) => void;
};

export function SelectedObjectControls({
  selectedId,
  selectedObjectData,
  updateObject,
  updateAllDomains,
  updateAllRelations,
  deleteObject,
  sceneBounds,
  onClose,
  containerRef,
  transformMode,
  setTransformMode,
  onChangeDetectorPalette,
}: Props) {
  const bounds = sceneBounds ?? new THREE.Box3();
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  
  // Track local changes for Save/Cancel pattern
  const [localName, setLocalName] = useState(selectedObjectData.name ?? '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const originalName = useRef(selectedObjectData.name ?? '');

  // Update local state when selected object changes
  useEffect(() => {
    setLocalName(selectedObjectData.name ?? '');
    originalName.current = selectedObjectData.name ?? '';
    setHasUnsavedChanges(false);
  }, [selectedId, selectedObjectData.name]);

  // --- THE FIX: Calculate initial position relative to the container, not the window ---
  const [panelPosition, setPanelPosition] = useState(() => {
    const container = containerRef.current;
    if (!container) return { x: 100, y: 5 }; // Fallback
    const containerWidth = container.getBoundingClientRect().width;
    const panelWidth = 280; // As defined in SelectedObjectControls.css
    return { x: containerWidth - panelWidth - 5, y: 5 };
  });
  const dragStartOffset = useRef({ x: 0, y: 0 }); // This will store the mouse offset from the panel's top-left corner
  const panelRef = useRef<HTMLDivElement>(null);

  const { name, color, opacity, type } = selectedObjectData;

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPanel(true);
    dragStartOffset.current = {
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    setPanelPosition({
      x: e.clientX - dragStartOffset.current.x,
      y: e.clientY - dragStartOffset.current.y,
    });
  };

  const onMouseUp = () => {
    setIsDraggingPanel(false);
  };

  useEffect(() => {
    if (isDraggingPanel) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingPanel]);

  const updateVec3 = (prop: 'position' | 'rotation' | 'scale', axis: number, value: number) => {
    updateObject(selectedId, (prev) => {
      const newVec = [...prev[prop]] as [number, number, number];
      newVec[axis] = value;
      return { [prop]: newVec };
    });
  };

  // --- NEW: Function to handle the final name change and update all expressions ---
  const handleNameChange = () => {
    const oldName = originalName.current;
    const newName = localName.trim();

    if (!newName || newName === oldName) {
      setLocalName(oldName); // Revert if name is empty or unchanged
      setHasUnsavedChanges(false);
      return;
    }

    setIsRenaming(true);
    console.log(`[NameChange] Renaming object from "${oldName}" to "${newName}"`);

    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        // 1. Update the object's name itself
        updateObject(selectedId, { name: newName });

        // 2. Create a regex to find the old name as a whole word
        const oldNameRegex = new RegExp(`\\b${oldName}\\b`, 'g');

        // 3. Update all physics domain rules, wave equations, particle equations, and derived variables
        updateAllDomains(domain => {
          const updatedDomain = {
            ...domain,
            rules: domain.rules.map(rule => ({ 
              ...rule, 
              definition: rule.definition.replace(oldNameRegex, newName) 
            }))
          };

          // Update wave equation expression and derived variables
          if (domain.waveEquation) {
            const oldExpr = domain.waveEquation.expression || '';
            const newExpr = oldExpr.replace(oldNameRegex, newName);
            if (oldExpr !== newExpr) {
              console.log(`[NameChange] Wave equation updated in domain "${domain.name}"`);
            }
            updatedDomain.waveEquation = {
              ...domain.waveEquation,
              expression: newExpr,
              derivedVariables: domain.waveEquation.derivedVariables?.map(v => ({
                ...v,
                expression: (v.expression || '').replace(oldNameRegex, newName)
              }))
            };
          }

          // Update particle equation expression and derived variables
          if (domain.particleEquation) {
            const oldExpr = domain.particleEquation.expression || '';
            const newExpr = oldExpr.replace(oldNameRegex, newName);
            if (oldExpr !== newExpr) {
              console.log(`[NameChange] Particle equation updated in domain "${domain.name}": "${oldExpr}" -> "${newExpr}"`);
            }
            updatedDomain.particleEquation = {
              ...domain.particleEquation,
              expression: newExpr,
              derivedVariables: domain.particleEquation.derivedVariables?.map(v => ({
                ...v,
                expression: (v.expression || '').replace(oldNameRegex, newName)
              }))
            };
          }

          return updatedDomain;
        });

        // 5. Re-derive Bohmian particle velocities from the updated wave equations
        updateAllDomains(domain => {
          if (!domain.waveEquation || !domain.particleEquation) return domain;
          
          const newParticleExpr = deriveBohmianVelocity(domain);
          if (!newParticleExpr) return domain;

          console.log(`[NameChange] Re-deriving particle velocity for domain "${domain.name}"`);
          return {
            ...domain,
            particleEquation: {
              ...domain.particleEquation,
              expression: newParticleExpr
            }
          };
        });

        // 6. Update all parameter relation expressions AND their target IDs
        updateAllRelations(relation => ({
          ...relation,
          id: relation.id.replace(oldNameRegex, newName),
          expression: relation.expression.replace(oldNameRegex, newName)
        }));

        originalName.current = newName;
        setHasUnsavedChanges(false);
      } finally {
        setIsRenaming(false);
      }
    }, 0);
  };

  const handleSave = () => {
    if (!hasUnsavedChanges || isRenaming) return;
    if (localName !== originalName.current) {
      handleNameChange();
    }
    // Close after saving (handleNameChange already resets hasUnsavedChanges)
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Close without saving?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={panelRef}
      className="selected-object-controls-container"
      // --- THE FIX: Add position: 'absolute' and use top/left for positioning ---
      // This ensures the panel is correctly placed within the <Html> overlay.
      // The 'transform' property was not working as intended in this context.
      style={{ position: 'absolute', top: panelPosition.y, left: panelPosition.x, pointerEvents: 'auto' }} // --- THE FIX (Part 2): Capture events on the panel itself
      onPointerDown={(e) => e.stopPropagation()}
      // --- THE FIX: Stop click events from propagating to the canvas ---
      onClick={(e) => e.stopPropagation()}
    >
      <div className="selected-object-controls-header" onMouseDown={onMouseDown}>
        <span>{name} ({type})</span>
        <div className="panel-header-buttons">
          <button onClick={() => setIsMinimized(!isMinimized)} className="panel-header-btn">
            {isMinimized ? '□' : '_'}
          </button>
          <button onClick={handleClose} className="panel-header-btn" title="Close without saving">
            &times;
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div className="selected-object-controls-content">
        {isRenaming && (
          <div style={{ 
            padding: '8px', 
            backgroundColor: '#333', 
            borderRadius: '4px', 
            marginBottom: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            Updating formulas...
          </div>
        )}
        <div className="custom-control-row">
          <label>Name</label>
          <input
            type="text"
            className="custom-text-input"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              setHasUnsavedChanges(e.target.value.trim() !== originalName.current);
            }}
            disabled={isRenaming}
          />
        </div>

        {/* Object Type Conversion */}
        {type !== 'axes' && type !== 'group' && (
          <div className="custom-control-row">
            <label>Type</label>
            <select
              className="custom-text-input"
              value={type}
              onChange={(e) => {
                const newType = e.target.value as 'box' | 'sphere' | 'cylinder';
                if (newType === type) return;

                // Preserve scale - all objects have [x, y, z] scale components
                updateObject(selectedId, { type: newType });
              }}
            >
              <option value="box">Box</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="tube">Tube</option>
            </select>
          </div>
        )}

        <CustomButtonGroup>
          <CustomButton
            onClick={() => setTransformMode('translate')}
            className={transformMode === 'translate' ? 'active' : ''}
          >
            Move (S)
          </CustomButton>
          <CustomButton
            onClick={() => setTransformMode('rotate')}
            className={transformMode === 'rotate' ? 'active' : ''}
          >
            Rotate (E)
          </CustomButton>
          <CustomButton
            onClick={() => setTransformMode('scale')}
            className={transformMode === 'scale' ? 'active' : ''}
          >
            Scale (R)
          </CustomButton>
        </CustomButtonGroup>

        {(() => {
          const propMap = { translate: 'position', rotate: 'rotation', scale: 'scale' } as const;
          const activeProp = propMap[transformMode];
          const data = selectedObjectData[activeProp];
          const isRotation = activeProp === 'rotation';

          // For rotation we present values in degrees to the user,
          // while keeping radians in the underlying scene data.
          const radToDeg = (r: number) => (r * 180) / Math.PI;
          const degToRad = (d: number) => (d * Math.PI) / 180;

          const min = activeProp === 'position' ? undefined : isRotation ? -180 : 0.001;
          const max = activeProp === 'position' ? undefined : isRotation ? 180 : undefined;
          const step = isRotation ? 1 : activeProp === 'scale' ? 0.1 : 0.01;

          return (
            <>
              <CustomSliderInput
                label={isRotation ? 'Rot X (°)' : 'X'}
                value={isRotation ? radToDeg(data[0]) : data[0]}
                onChange={(v) => updateVec3(activeProp, 0, isRotation ? degToRad(v) : v)}
                min={activeProp === 'position' ? bounds.min.x : min}
                max={activeProp === 'position' ? bounds.max.x : max}
                step={step}
              />
              <CustomSliderInput
                label={isRotation ? 'Rot Y (°)' : 'Y'}
                value={isRotation ? radToDeg(data[1]) : data[1]}
                onChange={(v) => updateVec3(activeProp, 1, isRotation ? degToRad(v) : v)}
                min={activeProp === 'position' ? bounds.min.y : min}
                max={activeProp === 'position' ? bounds.max.y : max}
                step={step}
              />
              <CustomSliderInput
                label={isRotation ? 'Rot Z (°)' : 'Z'}
                value={isRotation ? radToDeg(data[2]) : data[2]}
                onChange={(v) => updateVec3(activeProp, 2, isRotation ? degToRad(v) : v)}
                min={activeProp === 'position' ? bounds.min.z : min}
                max={activeProp === 'position' ? bounds.max.z : max}
                step={step}
              />
            </>
          );
        })()}
        {type !== 'group' && (
          <>
            <CustomColorPicker label="Color" color={color ?? '#ffffff'} onChange={(v) => updateObject(selectedId, { color: v })} />
            <CustomSliderInput label="Opacity" value={opacity ?? 1} onChange={(v) => updateObject(selectedId, { opacity: v })} min={0} max={1} step={0.05} />
          </>
        )}
        {type === 'tube' && (
          <CustomSliderInput 
            label="Wall Thickness" 
            value={1 - (selectedObjectData.tubeInnerRadius ?? 0.8)} 
            onChange={(v) => updateObject(selectedId, { tubeInnerRadius: 1 - v })} 
            min={0.05} 
            max={0.9} 
            step={0.05} 
          />
        )}

        {/* Detector configuration (first step: define geometry & resolution) */}
        {type !== 'axes' && type !== 'group' && (
          <>
            <div className="custom-control-row" style={{ marginTop: '8px', borderTop: '1px solid #444', paddingTop: '6px' }}>
              <label>Detector</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={!!selectedObjectData.detector?.enabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    if (!enabled) {
                      updateObject(selectedId, { detector: { enabled: false, face: 'front', uDivisions: 64, vDivisions: 64 } });
                    } else {
                      const existing = selectedObjectData.detector || { face: 'front', uDivisions: 64, vDivisions: 64 };
                      updateObject(selectedId, { detector: { ...existing, enabled: true } });
                    }
                  }}
                />
                <span style={{ fontSize: '11px', color: '#ccc' }}>Enable particle detector on this object</span>
              </div>
            </div>

            {selectedObjectData.detector?.enabled && (
              <>
                <div className="custom-control-row">
                  <label>Detector Face</label>
                  <select
                    className="custom-text-input"
                    value={selectedObjectData.detector?.face ?? 'front'}
                    onChange={(e) => {
                      const face = e.target.value as 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
                      const det = selectedObjectData.detector || { enabled: true, face: 'front', uDivisions: 64, vDivisions: 64 };
                      updateObject(selectedId, { detector: { ...det, face } });
                    }}
                  >
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>

                <ColorPalettePicker
                  label="Detector Palette"
                  palettes={DETECTOR_PALETTES}
                  selectedPalette={selectedObjectData.detector?.palette ?? 'blue'}
                  onChange={(palette) => {
                    const det = selectedObjectData.detector || { enabled: true, face: 'front', uDivisions: 64, vDivisions: 64 };
                    updateObject(selectedId, { detector: { ...det, palette } });
                    onChangeDetectorPalette?.(palette);
                  }}
                />

                <CustomSliderInput
                  label="U Divisions"
                  value={selectedObjectData.detector?.uDivisions ?? 64}
                  onChange={(v) => {
                    const det = selectedObjectData.detector || { enabled: true, face: 'front', uDivisions: 64, vDivisions: 64 };
                    updateObject(selectedId, { detector: { ...det, uDivisions: Math.max(1, Math.round(v)) } });
                  }}
                  min={1}
                  max={512}
                  step={1}
                  title="Number of bins along the first in-surface axis"
                />

                <CustomSliderInput
                  label="V Divisions"
                  value={selectedObjectData.detector?.vDivisions ?? 64}
                  onChange={(v) => {
                    const det = selectedObjectData.detector || { enabled: true, face: 'front', uDivisions: 64, vDivisions: 64 };
                    updateObject(selectedId, { detector: { ...det, vDivisions: Math.max(1, Math.round(v)) } });
                  }}
                  min={1}
                  max={512}
                  step={1}
                  title="Number of bins along the second in-surface axis"
                />
              </>
            )}
          </>
        )}

        <CustomButtonGroup>
          <CustomButton 
            onClick={handleSave}
            className={hasUnsavedChanges && !isRenaming ? 'apply-active' : 'apply-inactive'}
          >
            Apply
          </CustomButton>
          <CustomButton onClick={() => updateObject(selectedId, { rotation: [0, 0, 0] })}>
            Align Axes
          </CustomButton>
          <CustomButton
            className="danger"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${name || 'this object'}"?`)) {
                deleteObject(selectedId);
              }
            }}
          >
            Delete
          </CustomButton>
        </CustomButtonGroup>
        </div>
      )}
    </div>
  );
}