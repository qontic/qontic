import { useEffect } from 'react';
import type {
  SceneObjectType,
  CustomParameter,
  ParameterRelation,
  GlobalConstant,
} from './types.ts'; // <-- FIX: Added .ts extension
import {
  findObjectByName,
  evaluateExpressionWithScope, // <-- NEW: Using our upgraded parser
  setPropertyByPath,
  expandShorthand, // <-- NEW: Use the shared function
} from './utils.ts'; // <-- FIX: Added .ts extension

type Props = {
  parameters: CustomParameter[];
  // <-- FIX: Added the correct function type for setParameters
  setParameters: (p: CustomParameter[] | ((prev: CustomParameter[]) => CustomParameter[])) => void;
  relations: ParameterRelation[];
  globalConstants: GlobalConstant[];
  sceneObjects: SceneObjectType[];
  updateObject: (id: string, newProps: Partial<SceneObjectType>) => void;
  objectCount: number;
};

/**
 * The main component that renders the "Parametric Editor"
 */
export function ParametricManager(props: Props) {
  const {
    parameters,
    relations,
    globalConstants,
    sceneObjects,
    updateObject,
  } = props;

  // <-- NEW: THIS 'useEffect' IS THE SOLVER -->
  // This hook runs whenever the parameters, relations, or objects change.
  useEffect(() => {

    // If there are no relations to process, do nothing.
    // This prevents the solver from running unnecessarily and causing loops.
    if (relations.length === 0) return;

    // 1. Create the "scope" object for our parser by combining constants and parameters.
    const constantsScope = globalConstants.reduce((acc, constant) => {
      acc[constant.name] = constant.value;
      return acc;
    }, {} as Record<string, number>);

    // e.g., { slitSeparation: 100, totalWallHeight: 500 }
    const paramsScope = parameters.reduce((acc, param) => {
      acc[param.name] = param.value;
      return acc;
    }, {} as Record<string, number>);

    const fullScope = { ...constantsScope, ...paramsScope };

    // --- NEW: Batch updates to prevent overwriting ---
    // We create a map of working objects to accumulate changes for the same object
    const modifiedObjectsMap = new Map<string, SceneObjectType>();

    // Helper to get a working copy of an object
    const getWorkingObject = (original: SceneObjectType) => {
      if (!modifiedObjectsMap.has(original.id)) {
        modifiedObjectsMap.set(original.id, JSON.parse(JSON.stringify(original)));
      }
      return modifiedObjectsMap.get(original.id)!;
    };

    // 2. Loop through ALL relations and apply them to the working copies
    for (const relation of relations) {
      // --- NEW: Parse the unified assignment expression ---
      // --- REFACTORED: Use the new structure ---
      const leftHandSide = relation.id; // Target is the ID, e.g., "TopScreen.dy"
      const rightHandSide = relation.expression; // Expression is the formula

      // Use regex to extract 'ObjectName' and 'property.path'
      // --- DEFINITIVE FIX: This regex correctly handles both quoted and unquoted object names ---
      const match = leftHandSide.match(/^(?:'([^']*)'|([a-zA-Z0-9_-]+))\.(.*)$/);
      if (!match) {
        console.warn(`Parametric solver: Invalid assignment target "${leftHandSide}"`);
        continue;
      }

      // The object name will be in either the first (quoted) or second (unquoted) capture group
      const targetObjectId = match[1] || match[2];
      
      // --- THE CORRECT FIX ---
      // The property path needs to be converted from shorthand ('dy') to the full path ('scale.y')
      // This was the missing piece. We create a temporary expression to expand.
      const shorthandProperty = match[3]; // e.g., 'dy', 'position.x'
      const propertyMap: Record<string, string> = { 'x': 'position.x', 'y': 'position.y', 'z': 'position.z', 'dx': 'scale.x', 'dy': 'scale.y', 'dz': 'scale.z', 'rx': 'rotation.x', 'ry': 'rotation.y', 'rz': 'rotation.z' };
      const targetProperty = propertyMap[shorthandProperty] || shorthandProperty;

      // Find the target object in the scene
      const targetObject = findObjectByName(sceneObjects, targetObjectId);
      if (!targetObject) {
        console.warn(`Parametric solver: Could not find object "${targetObjectId}"`);
        continue;
      }

      // 3. Evaluate the expression using the full scope
      const expandedRightHandSide = expandShorthand(rightHandSide); // Use shared function
      const newValue = evaluateExpressionWithScope(expandedRightHandSide, fullScope);
      if (newValue === null) {
        console.warn(`Parametric solver: Invalid expression "${rightHandSide}"`);
        continue;
      }

      // --- NEW: Validate the calculated value ---
      // Check for non-finite numbers (NaN, Infinity)
      if (!isFinite(newValue)) {
        console.warn(`Parametric solver: Calculated value for "${targetProperty}" is not a finite number (${newValue}). Skipping update.`);
        continue;
      }

      // Check for non-positive scale values, which can make objects disappear
      if (targetProperty.includes('scale') && newValue <= 0) {
        console.warn(`Parametric solver: Calculated scale for "${targetProperty}" is non-positive (${newValue}). This can make objects disappear or render incorrectly. Skipping update.`);
        continue;
      }

      // 4. Get the working copy of the object
      const workingObject = getWorkingObject(targetObject);

      // 5. Apply the new value to the working copy
      const success = setPropertyByPath(workingObject, targetProperty, newValue);

      if (!success) {
        console.warn(`Parametric solver: Could not set property "${targetProperty}"`);
      }
    }

    // 6. Dispatch updates for all modified objects
    modifiedObjectsMap.forEach((newObj, id) => {
      const original = findObjectByName(sceneObjects, newObj.name!);
      if (!original) return;

      const changes: Partial<SceneObjectType> = {};
      let hasChanges = false;

      // Check standard props that might have changed
      (['position', 'rotation', 'scale', 'opacity', 'color', 'visible'] as const).forEach(key => {
         if (JSON.stringify(original[key]) !== JSON.stringify(newObj[key])) {
            changes[key] = newObj[key] as any;
            hasChanges = true;
         }
      });

      if (hasChanges) {
        updateObject(id, changes);
      }
    });
    // This solver runs EVERY time a parameter or relation changes.
    // By removing `sceneObjects` from the dependency array, we break the infinite loop.
    // The solver should only run when its INPUTS change, not its OUTPUTS.
  }, [parameters, relations, globalConstants, props.objectCount, updateObject]);

  return null;
}