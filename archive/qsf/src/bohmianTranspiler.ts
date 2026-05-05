// Analytic-to-GLSL transpiler for Bohmian velocity field
// This module generates GLSL code for the velocity field v = (hbar/m) Im(∇ψ/ψ)
// using the analytic wave equation and its gradient.

import { transpileExpression } from './expressionTranspiler';
import type { PhysicsEquation, CustomParameter, SceneObjectType, GlobalConstant, ProjectDerivedVariable } from './types';

export function transpileBohmianVelocityToGLSL(
  waveEquation: PhysicsEquation,
  parameters: CustomParameter[],
  sceneObjects: SceneObjectType[],
  globalConstants: GlobalConstant[],
  projectVariables: ProjectDerivedVariable[] = []
): string {
  // Assume the main wavefunction expression is in waveEquation.expression
  // and that the gradient expressions are in waveEquation.gradientX, gradientY, gradientZ
  // (if not, these should be derived analytically or via symbolic diff in the future)

  // Transpile ψ and ∇ψ
  const psiExpr = transpileExpression(waveEquation.expression, waveEquation, parameters, sceneObjects, globalConstants, projectVariables);
  const gradX = waveEquation.gradientX ? transpileExpression(waveEquation.gradientX, waveEquation, parameters, sceneObjects, globalConstants, projectVariables) : '0.0';
  const gradY = waveEquation.gradientY ? transpileExpression(waveEquation.gradientY, waveEquation, parameters, sceneObjects, globalConstants, projectVariables) : '0.0';
  const gradZ = waveEquation.gradientZ ? transpileExpression(waveEquation.gradientZ, waveEquation, parameters, sceneObjects, globalConstants, projectVariables) : '0.0';

  // GLSL: v = (hbar/m) * Im(∇ψ/ψ)
  // Assume hbar and mass are available in the scope
  return `
    vec2 psi = ${psiExpr};
    vec2 dpsi_dx = ${gradX};
    vec2 dpsi_dy = ${gradY};
    vec2 dpsi_dz = ${gradZ};
    // Compute ∇ψ/ψ for each component
    vec2 grad_over_psi_x = complex_div(dpsi_dx, psi);
    vec2 grad_over_psi_y = complex_div(dpsi_dy, psi);
    vec2 grad_over_psi_z = complex_div(dpsi_dz, psi);
    // Take imaginary part for each
    float vx = (hbar / mass) * grad_over_psi_x.y;
    float vy = (hbar / mass) * grad_over_psi_y.y;
    float vz = (hbar / mass) * grad_over_psi_z.y;
    vec3 bohmian_velocity = vec3(vx, vy, vz);
  `;
}
