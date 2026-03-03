import type { SceneObjectType, GlobalConstant, PhysicsDomain, CustomParameter, ProjectDerivedVariable, ParticleDefinition, PhysicsEquation } from './types.ts'; // <-- FIX: Added .ts extension and additional physics types
import { create, all } from 'mathjs';
import * as THREE from 'three';

export function generateUniqueName(type: string, sceneObjects: SceneObjectType[]): string {
  // 1. Flatten all objects (including children) into one list
  const allObjects: SceneObjectType[] = [];
  function walk(objs: SceneObjectType[]) {
    for (const obj of objs) {
      allObjects.push(obj);
      if (obj.children) walk(obj.children);
    }
  }
  walk(sceneObjects);

  // 2. Collect existing names that match the pattern (e.g., "box001")
  const existingNames = new Set(
    allObjects
      .map(o => o.name)
      .filter(name => name && new RegExp(`^${type.toLowerCase()}\\d{3}$`).test(name))
  );

  // 3. Find the first available number
  let counter = 1;
  let candidate: string;
  do {
    candidate = `${type.toLowerCase()}${String(counter).padStart(3, '0')}`;
    counter++;
  } while (existingNames.has(candidate));

  return candidate;
}

// --- NEW FUNCTIONS FOR PARAMETRIC SYSTEM ---

/**
 * Recursively finds the first object in the scene tree with a matching name.
 */
export function findObjectByName(
  objects: SceneObjectType[],
  name: string
): SceneObjectType | null {
  for (const obj of objects) {
    if (obj.name === name) {
      return obj;
    }
    if (obj.children) {
      const found = findObjectByName(obj.children, name);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// --- NEW: Levenshtein distance function to find closest match for suggestions ---
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}


/**
 * <-- NEW: This is the upgraded, more powerful expression evaluator.
 * It replaces the old 'evaluateExpression' function.
 * It takes a "scope" of all parameters (e.g., { slitSeparation: 100, wallHeight: 500 })
 * and can evaluate complex expressions.
 */
const math = create(all, { implicit: 'auto' } as any); // FIX: Use type assertion to bypass outdated type definition

export function evaluateExpressionWithScope(
  expression: string,
  scope: Record<string, any>,
  allowComplex = false // NEW: Flag to allow complex number results
): any | null {
  try {
    let result = math.evaluate(expression, scope);

    // If complex numbers are allowed, return them directly
    if (allowComplex && result && typeof result === 'object' && result.isComplex) {
      return result;
    }

    // Otherwise, if the result is a complex number, take its magnitude for validation.
    // This maintains the old behavior for validators that expect a single number.
    if (result && typeof result === 'object' && (result as any).isComplex) {
      result = (result as any).abs();
    }

    // If the result is a boolean, treat it as a numeric mask: true → 1, false → 0.
    // This is convenient for region predicates like "abs(z - z0) < dz and abs(x)<1".
    if (typeof result === 'boolean') {
      return result ? 1 : 0;
    }

    // Check for valid numeric result
    if (typeof result !== 'number' || !isFinite(result)) {
      console.warn(`Expression "${expression}" did not evaluate to a finite number. Result:`, result);
      return null;
    }

    return result;
  } catch (e) {
    // --- NEW: Smart error handling ---
    if (e instanceof Error) {
      // Check for "Undefined symbol" error from math.js
      const undefinedSymbolMatch = e.message.match(/Undefined symbol (\w+)/);
      if (undefinedSymbolMatch && undefinedSymbolMatch[1]) {
        const undefinedSymbol = undefinedSymbolMatch[1];
        let suggestion = '';

        // Try to find a suggestion from the scope keys (our object names)
        const scopeKeys = Object.keys(scope);
        let minDistance = Infinity;
        let bestMatch = '';

        for (const key of scopeKeys) {
          const distance = getLevenshteinDistance(undefinedSymbol.toLowerCase(), key.toLowerCase());
          if (distance < minDistance && distance <= 2) { // Only suggest if it's a close match
            minDistance = distance;
            bestMatch = key;
          }
        }
        if (bestMatch) suggestion = ` Did you mean '${bestMatch}'?`;
        
        // --- FIX: Instead of throwing, log a warning and return null ---
        // This prevents the entire application from crashing on a bad expression.
        console.warn(`Expression evaluation failed: Object '${undefinedSymbol}' not found.${suggestion}`);
        return null;
      }
    }
    // For other errors, log them and return null to prevent a crash.
    console.warn(`Expression "${expression}" failed to evaluate.`, e);
    return null;
  }
}


/**
 * Sets a nested property on an object using a dot-notation string path.
 * e.g., setPropertyByPath(obj, 'scale.x', 5) will set obj.scale[0] = 5
 */
export function setPropertyByPath(
  // <-- FIX (Linter Error 1): Changed 'any' to 'Record<string, unknown>' for a safer signature
  obj: Record<string, unknown>, 
  path: string,
  value: number
): boolean {
  const keys = path.split('.');
  
  // <-- FIX (Linter Error 2): We use 'any' here for the internal traversal
  // but we disable the linter warning just for this one line.
  // This is the correct, standard way to handle this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj; 

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    // <-- FIX (Linter Error 3): Added robust type checks
    if (
      typeof current !== 'object' ||
      current === null ||
      !Object.prototype.hasOwnProperty.call(current, key)
    ) {
      console.warn(`Path does not exist: cannot read property '${key}' of`, current);
      return false; // Path doesn't exist or is not an object
    }
    // We can now safely traverse
    current = current[key];
  }

  const finalKey = keys[keys.length - 1];
  
  // Ensure 'current' is a valid object/array before setting
  if (typeof current !== 'object' || current === null) {
      console.warn(`Cannot set property '${finalKey}' on non-object:`, current);
      return false;
  }

  // Special handling for our vector arrays (position, rotation, scale)
  if (Array.isArray(current) && (finalKey === 'x' || finalKey === 'y' || finalKey === 'z')) {
    const index = finalKey === 'x' ? 0 : finalKey === 'y' ? 1 : 2;
    if (typeof current[index] === 'number') {
      current[index] = value;
      return true;
    }
  }

  // Handle direct properties
  if (typeof current[finalKey] === 'number') {
    current[finalKey] = value;
    return true;
  }
  
  // This was the source of the bug. The logic was flawed and caused mutation.
  // The `current[index] = value` check above is now the single source of truth for array updates.
  if (Object.prototype.hasOwnProperty.call(current, finalKey) && typeof current[finalKey] !== 'number') {
      console.warn(`Could not set property at path: ${path}. Final key "${finalKey}" exists but is not a number.`);
      return false;
  }

  console.warn(`Could not set property at path: ${path}. Final key "${finalKey}" not found or not a number.`);
  return false;
}

/**
 * --- NEW: A single, reusable function to build the evaluation scope. ---
 * This will be used by both the validator and the domain renderer to ensure consistency.
 */
export function buildEvaluationScope(
  sceneObjects: SceneObjectType[],
  globalConstants: GlobalConstant[]
): Record<string, number> {
  const scope: Record<string, any> = {};

  // Add global constants to scope
  for (const constant of globalConstants) {
    scope[constant.name] = constant.value;
  }

  // Add all scene object properties to scope (e.g., "TopScreen.z", "TopScreen.dz")
  const allObjects: SceneObjectType[] = [];
  function walk(objects: SceneObjectType[]) {
    if (!Array.isArray(objects)) return;
    for (const obj of objects) {
      allObjects.push(obj);
      if (obj.children) walk(obj.children);
    }
  }
  walk(sceneObjects);

  for (const obj of allObjects) {
    if (!obj.name) continue;
    // --- THE DEFINITIVE FIX ---
    // Create a "flat" scope with variables like 'Source_x', 'Source_dx', etc.
    // This matches what expandShorthand and expandMacro expect.
    const varName = obj.name.replace(/\s/g, '_');

    scope[`${varName}_x`] = obj.position[0];
    scope[`${varName}_y`] = obj.position[1];
    scope[`${varName}_z`] = obj.position[2];
    scope[`${varName}_dx`] = obj.scale[0];
    scope[`${varName}_dy`] = obj.scale[1];
    scope[`${varName}_dz`] = obj.scale[2];
  }

  return scope;
}

// --- NEW: Shared helper to build a physics evaluation scope at a point ---
// This consolidates the CPU-side scope construction used by both the
// wave evaluation and the particle velocity evaluation so that any
// symbol (e.g., r_s) that is valid for the wave is also valid for
// particle dynamics.
export function buildPhysicsScopeAt(
  domain: PhysicsDomain,
  waveEq: PhysicsEquation | undefined,
  staticScope: Record<string, any>,
  parameters: CustomParameter[],
  projectVariables: ProjectDerivedVariable[] | undefined,
  particles: ParticleDefinition[] | undefined,
  position: { x: number; y: number; z: number },
  simTime: number,
  timeScale: number,
): { scope: Record<string, any>; numParticles: number } {
  const numParticles = waveEq?.numberOfParticles || 1;
  const scope: Record<string, any> = { ...staticScope };

  // Parameters
  (parameters ?? []).forEach(p => {
    scope[p.name] = p.value;
  });

  // Particle mass (selected particle for this domain, if any)
  if (particles && particles.length > 0) {
    const particleId = domain.selectedParticleId || particles[0].id;
    const particle = particles.find(p => p.id === particleId) || particles[0];
    const massVal = (particle as any).mass ?? (particle as any).massKg;
    if (massVal !== undefined) scope['mass'] = massVal;
  }

  // Project-level derived variables (with macro expansion, to match validation).
  // NOTE: This comes *after* mass so that project variables like
  // omega = 0.5*hbar*c^2*k^2/mass can be evaluated correctly.
  if (projectVariables && projectVariables.length > 0) {
    for (const pv of projectVariables) {
      if (!pv.name || !pv.expression) continue;
      const expr = expandMacro(pv.expression, 1);
      const val = evaluateExpressionWithScope(expr, scope);
      if (val !== null && isFinite(val)) {
        scope[pv.name] = val;
      }
    }
  }

  // Time and position: t is interpreted in physical nanoseconds.
  const physicalTimeNs = simTime * timeScale;
  scope['t'] = physicalTimeNs;
  scope['x'] = position.x;
  scope['y'] = position.y;
  scope['z'] = position.z;

  // Domain-level derived variables from the wave equation (if any)
  if (waveEq && Array.isArray(waveEq.derivedVariables) && waveEq.derivedVariables.length > 0) {
    for (const v of waveEq.derivedVariables) {
      if (!v.name || !v.expression) continue;
      const expr = expandMacro(v.expression, numParticles);
      const val = evaluateExpressionWithScope(expr, scope);
      if (val !== null && isFinite(val)) {
        scope[v.name] = val;
      }
    }
  }

  return { scope, numParticles };
}

// --- Shared helper to evaluate |psi|^2 at a given position/time ---
// Uses buildPhysicsScopeAt so that scope construction is identical
// wherever the wave equation is evaluated.
export function evaluateWaveMagnitudeSqAt(
  domain: PhysicsDomain,
  waveEq: PhysicsEquation | undefined,
  staticScope: Record<string, any>,
  parameters: CustomParameter[],
  projectVariables: ProjectDerivedVariable[] | undefined,
  particles: ParticleDefinition[] | undefined,
  position: { x: number; y: number; z: number },
  simTime: number,
  timeScale: number,
  requireValidated = true,
): number | null {
  if (!waveEq || (requireValidated && !waveEq.isValidated)) return null;

  const { scope, numParticles } = buildPhysicsScopeAt(
    domain,
    waveEq,
    staticScope,
    parameters,
    projectVariables,
    particles,
    position,
    simTime,
    timeScale,
  );

  const mainExpr = expandMacro(waveEq.expression, numParticles);
  const psiVal = evaluateExpressionWithScope(mainExpr, scope);
  if (psiVal === null || typeof psiVal !== 'number' || !isFinite(psiVal)) {
    // Debug invalid evaluations of psi so we can diagnose why
    // certain expressions (e.g., y-dependent ones) fail on
    // specific previews even after validation.
    console.warn(
      'evaluateWaveMagnitudeSqAt: invalid psiVal',
      {
        domainId: domain.id,
        expr: mainExpr,
        position: { x: position.x, y: position.y, z: position.z },
        simTime,
        timeScale,
        rawVal: psiVal,
        scopeXYZT: { x: scope.x, y: scope.y, z: scope.z, t: scope.t },
      }
    );
    return null;
  }
  const magSq = psiVal * psiVal;
  return magSq > 0 ? magSq : null;
}

/**
 * Parses a domain definition string to extract the min/max bounds for each axis.
 * This is a simplified parser that looks for patterns like 'x > 5', 'x < 10', etc.
 * It assumes 'and' as a logical connector.
 */
export function parseDomainBounds(domain: import('./types').PhysicsDomain, sceneObjects: SceneObjectType[], sceneBounds: THREE.Box3 | null, globalConstants: GlobalConstant[], particles?: import('./types').ParticleDefinition[]): THREE.Box3 {
  // --- NEW: Handle geometric shapes first ---
  if (domain.shape === 'box' ) {
    const center = new THREE.Vector3().fromArray(domain.center || [0, 0, 0]);
    const size = new THREE.Vector3().fromArray(domain.size || [1, 1, 1]);
    const halfSize = size.clone().multiplyScalar(0.5);

    const min = center.clone().sub(halfSize);
    const max = center.clone().add(halfSize);

    return new THREE.Box3(min, max);
  }

  // --- Fallback to rule-based parsing for 'custom' or undefined shapes ---
  const definition = domain.rules[0]?.definition || '';
  const bounds = {
    min: { x: -Infinity, y: -Infinity, z: -Infinity },
    max: { x: Infinity, y: Infinity, z: Infinity },
  };

  const scope = buildEvaluationScope(sceneObjects, globalConstants);

  // --- NEW: Add particle mass to scope ---
  const particleList = particles || [];
  const particleId = domain.selectedParticleId || (particleList.length > 0 ? particleList[0].id : undefined);
  const particle = particleList.find(p => p.id === particleId);
  if (particle) {
    const massVal = (particle as any).mass ?? (particle as any).massKg;
    if (massVal !== undefined) (scope as any)['mass'] = massVal;
  }


  const clauses = definition.split(/\s+(?:and|or|&&|\|\|)\s+/);

  for (const clause of clauses) {
    // Match the axis, operator, and the rest of the expression
    const absMatch = clause.match(/\babs\s*\(\s*([xyz])\s*\)\s*([><]=?)\s*(.*)/);
    // --- FIX: Use expandShorthand to correctly parse object properties ---
    if (absMatch) {
      const axis = absMatch[1] as 'x' | 'y' | 'z';
      const operator = absMatch[2];
      const expression = absMatch[3].trim(); // e.g., "sphere001.z"
      const expandedExpression = expandShorthand(expression);
      const value = evaluateExpressionWithScope(expandedExpression, scope);

      if (value !== null) {
        if (operator === '<' || operator === '<=') {
          bounds.max[axis] = Math.min(bounds.max[axis], value);
          bounds.min[axis] = Math.max(bounds.min[axis], -value);
        } else {
          // Handling `abs(x) > value` would create a disjoint domain, which Box3 doesn't support.
          // We can ignore this case for now or log a warning.
          console.warn(`Domain parser: Operator "${operator}" with abs() is not supported for Box3 bounds.`);
        }
      }
      continue; // Move to the next clause
    }
    const comparisonMatch = clause.match(/\b([xyz])\s*([><]=?)\s*(.*)/); // e.g., x > 5

    if (comparisonMatch) {
      const axis = comparisonMatch[1] as 'x' | 'y' | 'z';
      const operator = comparisonMatch[2];
      const expression = comparisonMatch[3].trim(); // e.g., "sphere001.z"
      const expandedExpression = expandShorthand(expression); // <-- THE CRITICAL FIX
      const value = evaluateExpressionWithScope(expandedExpression, scope);

      if (value !== null) {
        if (operator === '>' || operator === '>=') {
          bounds.min[axis] = Math.max(bounds.min[axis], value);
        } else if (operator === '<' || operator === '<=') {
          bounds.max[axis] = Math.min(bounds.max[axis], value);
        }
      }
    }
  }

  const defaultBounds = new THREE.Box3(new THREE.Vector3(-10, -10, -10), new THREE.Vector3(10, 10, 10));
  const effectiveBounds = sceneBounds && !sceneBounds.isEmpty() ? sceneBounds : defaultBounds;

  const min = new THREE.Vector3(isFinite(bounds.min.x) ? bounds.min.x : effectiveBounds.min.x, isFinite(bounds.min.y) ? bounds.min.y : effectiveBounds.min.y, isFinite(bounds.min.z) ? bounds.min.z : effectiveBounds.min.z);
  const max = new THREE.Vector3(isFinite(bounds.max.x) ? bounds.max.x : effectiveBounds.max.x, isFinite(bounds.max.y) ? bounds.max.y : effectiveBounds.max.y, isFinite(bounds.max.z) ? bounds.max.z : effectiveBounds.max.z);
  return new THREE.Box3(min, max);
}

/**
 * Expands shorthand property access like `Source.x` or `'Screen Left'.dx`
 * into a flat variable name like `Source_x` or `Screen_Left_dx`.
 */
export function expandShorthand(expression: string): string {
  if (!expression) return '';

  // This regex finds patterns like:
  // 1. 'An Object Name'.property -> quotedName: 'An Object Name', prop: 'property'
  // 2. AnObjectName.property     -> unquotedName: 'AnObjectName', prop: 'property'
  const regex = /(?:'([^']+)'|([a-zA-Z0-9_]+))\s*\.\s*([a-zA-Z_][a-zA-Z0-9_]*)/g;

  return expression.replace(regex, (_, quotedName, unquotedName, prop) => {
    const objectName = quotedName || unquotedName;
    // Replace spaces with underscores for the final variable name
    const varName = objectName.replace(/\s+/g, '_');
    // e.g., 'Source.dx' becomes 'Source_dx'
    // e.g., "'Screen Left'.x" becomes "Screen_Left_x"
    return `${varName}_${prop}`;
  });
}

/**
 * Expands custom macros like `distance(ObjectName)` into valid math.js expressions.
 *
 * For now, distance([x,y,z], [ax,ay,az]) is translated to the Euclidean norm
 * using only standard math.js operations so that we can safely differentiate
 * with respect to x, y, z when deriving Bohmian dynamics.
 */
export function expandMacro(expression: string, numParticles = 1): string {
  if (!expression) return '';
  // Regex to find distance(ObjectName) or distance('Object Name')
  const distanceRegex = /distance\(\s*(?:'([^']+)'|([a-zA-Z0-9_]+))\s*\)/g;

  let expandedExpr = expression.replace(distanceRegex, (_, quotedName, unquotedName) => {
    const objectName = quotedName || unquotedName;
    const safeObjectName = objectName.replace(/\s+/g, '_');

    const ax = `${safeObjectName}_x`;
    const ay = `${safeObjectName}_y`;
    const az = `${safeObjectName}_z`;

    if (numParticles > 1) {
      // For now, distance() will refer to the first particle in a multi-particle system.
      // NOTE: x1,y1,z1 are the coordinates for particle #1.
      return `sqrt((x1 - ${ax})^2 + (y1 - ${ay})^2 + (z1 - ${az})^2)`;
    }

    // Single particle case: position (x,y,z)
    return `sqrt((x - ${ax})^2 + (y - ${ay})^2 + (z - ${az})^2)`;
  });

  return expandedExpr;
}

// NOTE: CPU-based estimateMagnitudeRange has been removed in favor of GPU-based
// normalization computed in WaveCompute and fed back via callbacks.