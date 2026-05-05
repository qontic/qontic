import type { PhysicsEquation, CustomParameter, SceneObjectType, GlobalConstant, ProjectDerivedVariable } from './types';
import { findObjectByName } from './utils';
import { create, all } from 'mathjs';
const math = create(all, { implicit: 'auto' } as any);

export const sanitizeNameForGLSL = (name: string) => name.replace(/[^a-zA-Z0-9_]/g, '_');

/**
 * A library of GLSL functions to handle complex number arithmetic.
 * We represent a complex number as a vec2(real, imaginary).
 */
export const complexMathLib = `
  const float PI = 3.14159265359;
  const vec2 I = vec2(0.0, 1.0);

  vec2 c_add(vec2 a, vec2 b) { return a + b; }
  vec2 c_sub(vec2 a, vec2 b) { return a - b; }
  vec2 c_mul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
  vec2 c_mul_scalar(vec2 a, float s) { return a * s; }
  vec2 c_div_scalar(vec2 a, float s) { return a / s; }
  vec2 c_div(vec2 a, vec2 b) {
    float d = dot(b, b);
    return vec2(dot(a, b), a.y * b.x - a.x * b.y) / d;
  }
  vec2 c_exp(vec2 a) {
    float r = exp(a.x);
    return vec2(r * cos(a.y), r * sin(a.y));
  }
  vec2 c_sin(vec2 a) {
    return vec2(sin(a.x) * cosh(a.y), cos(a.x) * sinh(a.y));
  }
  vec2 c_cos(vec2 a) {
    return vec2(cos(a.x) * cosh(a.y), -sin(a.x) * sinh(a.y));
  }
  
  // Helper: division by i is multiplication by -i: (a,b)/i = (b,-a)
  vec2 c_div_i(vec2 a) { return vec2(a.y, -a.x); }
  
  // Add more complex functions as needed
`;

export const customFunctionLib = `
  // Helper for our custom distance function
  float distance_from_object(vec3 current_pos, vec3 object_pos) { return distance(current_pos, object_pos); }
`;

/**
 * A simple transpiler that converts a user expression string into a GLSL expression string.
 * This is a basic implementation using string replacements. A more robust solution
 * would use a proper parsing library like math.js.
 *
 * @param expression The user's expression, e.g., "exp(i * (k*z - omega*t))"
 * @param parameters The list of custom parameters to be treated as uniforms.
 * @returns A GLSL-compatible expression string.
 */
export function transpileExpression(
  expression: string,
  waveEquation: PhysicsEquation, // <-- ADDED
  parameters: CustomParameter[],
  sceneObjects: SceneObjectType[], // knownVariables is no longer needed
  globalConstants: GlobalConstant[],
  projectVariables: ProjectDerivedVariable[] = []
): string {
  // Pass 0: Expand object position component references like Source_x, Source_y, Source_z
  let glslExpr = expression;
  sceneObjects.forEach(obj => {
    if (obj.name) {
      const sanitizedName = sanitizeNameForGLSL(obj.name);
      glslExpr = glslExpr.replace(new RegExp(`\\b${obj.name}_x\\b`, 'g'), `u_${sanitizedName}_position.x`);
      glslExpr = glslExpr.replace(new RegExp(`\\b${obj.name}_y\\b`, 'g'), `u_${sanitizedName}_position.y`);
      glslExpr = glslExpr.replace(new RegExp(`\\b${obj.name}_z\\b`, 'g'), `u_${sanitizedName}_position.z`);
    }
  });

  // Pass 1: Expand custom macros like distance(ObjectName) first.
  glslExpr = glslExpr.replace(/distance\(\s*(?:'([^']+)'|([a-zA-Z0-9_]+))\s*\)/g, (match, quotedName, unquotedName) => {
    const objectName = quotedName || unquotedName;
    const obj = findObjectByName(sceneObjects, objectName);
    if (obj) {
      const sanitizedName = sanitizeNameForGLSL(objectName);
      return `distance(current_pos, u_${sanitizedName}_position)`;
    }
    return match; // If object not found, leave it to cause a compile error.
  });

  // Pass 2: Use MathJS to parse the expression and rebuild it as valid GLSL.
  // This handles operator precedence, converts '^' to 'pow()', and ensures integers are floats.
  try {
    const node = math.parse(glslExpr);

    const compileToGLSL = (node: any): string => {
      if (node.isConstantNode) {
        const val = node.value;
        // Force integers to be floats (e.g., 2 -> 2.0) for GLSL compatibility
        if (typeof val === 'number' && Number.isInteger(val)) {
          return val.toFixed(1);
        }
        return String(val);
      }
      if (node.isSymbolNode) {
        const name = node.name;

        // --- FIX: Check for derived variables FIRST ---
        if ((waveEquation.derivedVariables || []).some(v => v.name === name)) {
          return sanitizeNameForGLSL(name);
        }

        // --- NEW: Project-level derived variables map to uniforms ---
        if ((projectVariables || []).some(v => v.name === name)) {
          return `u_${sanitizeNameForGLSL(name)}`;
        }

        // Built-ins
        if (name === 't') return 'u_time';
        if (name === 'i') return 'I';
        // DO NOT hardcode 'k' or 'omega' here — they must come from derived variables in JSON.
        if (name === 'mass') return 'u_particle_mass'; // particle mass uniform (project units handled elsewhere)
        if (name === 'x' || name === 'y' || name === 'z') return name;

        // parameters and global constants -> uniforms
        if (parameters.some(p => p.name === name)) return `u_${sanitizeNameForGLSL(name)}`;
        if (globalConstants.some(c => c.name === name)) return `u_${sanitizeNameForGLSL(name)}`;

        // Fallback: sanitize to a GLSL-safe identifier (this lets arbitrary derived-variable-like names work)
        return sanitizeNameForGLSL(name);
      }
      if (node.isOperatorNode) {
        const args = node.args.map(compileToGLSL);
        if (node.op === '^') return `pow(${args[0]}, ${args[1]})`;
        // Handle implicit multiplication (e.g. 2x)
        if (node.op === '*' && node.implicit) return `${args[0]} * ${args[1]}`;
        // Handle unary operators (-, +, not)
        if (node.fn === 'unaryMinus') return `(-${args[0]})`;
        if (node.fn === 'unaryPlus') return `(+${args[0]})`;
        // Handle division by I: a / i becomes c_div_i(a)
        if (node.op === '/' && args[1] === 'I') return `c_div_i(${args[0]})`;

        const looksComplex = (s: string) => /\bI\b|c_exp\s*\(|c_sin\s*\(|c_cos\s*\(/.test(s);

        // General complex division: if either side looks complex, use c_div
        if (node.op === '/') {
          if (looksComplex(args[0]) || looksComplex(args[1])) {
            const toComplex = (s: string) => (looksComplex(s) ? s : `vec2(${s}, 0.0)`);
            return `c_div(${toComplex(args[0])}, ${toComplex(args[1])})`;
          }
        }

        // General complex multiplication: if either side looks complex, use c_mul
        if (node.op === '*') {
          if (looksComplex(args[0]) || looksComplex(args[1])) {
            const toComplex = (s: string) => (looksComplex(s) ? s : `vec2(${s}, 0.0)`);
            return `c_mul(${toComplex(args[0])}, ${toComplex(args[1])})`;
          }
        }

        return `${args[0]} ${node.op} ${args[1]}`;
      }
      if (node.isFunctionNode) {
        const args = node.args.map(compileToGLSL).join(', ');
        return `${node.name}(${args})`;
      }
      if (node.isParenthesisNode) {
        return `(${compileToGLSL(node.content)})`;
      }
      return String(node);
    };

    glslExpr = compileToGLSL(node);
  } catch (e) {
    console.warn("Transpiler: MathJS parse failed, falling back to raw string.", e);
    // Fallback to the raw string if parsing fails (though likely GLSL will fail too)
  }

  // Pass 3: Replace standard math functions with their complex counterparts if needed
  if (glslExpr.includes('I')) {
    glslExpr = glslExpr
      .replace(/\bexp\b/g, 'c_exp')
      .replace(/\bsin\b/g, 'c_sin')
      .replace(/\bcos\b/g, 'c_cos');
  }

  return glslExpr;
}

/**
 * Finds all object names referenced inside distance() calls in an expression.
 * @param expression The expression string to scan.
 * @returns A Set of unique object names.
 */
export function findObjectReferencesInExpression(expression: string): Set<string> {
  const references = new Set<string>();
  const regex = /distance\s*\(\s*([a-zA-Z0-9_]+)\s*\)/g;
  let match;
  while ((match = regex.exec(expression)) !== null) {
    references.add(match[1]);
  }
  return references;
}

export function transpileToGLSL(waveEquation: PhysicsEquation, parameters: CustomParameter[], sceneObjects: SceneObjectType[], globalConstants: GlobalConstant[], projectVariables: ProjectDerivedVariable[] = []): string {
  // --- FIX: Define all known variables, including built-ins ---

  const { expression, derivedVariables = [] } = waveEquation;

  // 1. Transpile derived variables first
  const derivedVariableLines = derivedVariables.map(v => {
    const sanitizedName = sanitizeNameForGLSL(v.name);
    // Pass all known variables for context.
    const transpiledExpr = transpileExpression(v.expression, waveEquation, parameters, sceneObjects, globalConstants, projectVariables);
    // For now, assume derived vars are floats. A more advanced system would track types.
    return `float ${sanitizedName} = ${transpiledExpr};`;
  }).join('\n  ');

  // 2. Transpile the main expression
  const finalExpr = transpileExpression(expression, waveEquation, parameters, sceneObjects, globalConstants, projectVariables);

  // --- FIX: Determine if the result is complex based on the final transpiled string ---
  const isComplex = finalExpr.includes('I');
  const mainExpressionLine = isComplex 
    ? `vec2 result = ${finalExpr};` 
    : `vec2 result = vec2(${finalExpr}, 0.0);`;

  // 3. Assemble the final GLSL code block
  const fullCode = `
    ${derivedVariableLines}
    ${mainExpressionLine}
  `;
  //console.log("transpiler output:", fullCode);
  return fullCode;
}