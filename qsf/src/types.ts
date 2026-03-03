// The full type definitions for your project

// Optional detector configuration attached to a scene object (e.g. a screen).
// This describes a counting surface and resolution but does not store
// runtime hit data (that is handled separately by the simulation).
export type DetectorConfig = {
  enabled: boolean; // Whether this object acts as a detector
  // Which face of a box-like object defines the counting surface.
  // This reuses the same naming convention as InjectionSurface.face.
  face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  // Number of divisions along the two in-surface axes (U/V grid).
  uDivisions: number;
  vDivisions: number;
  // Optional color palette name for visualizing hit counts on this
  // detector. Falls back to a reasonable default when omitted.
  palette?: string;
};

export type SceneObjectType = {
  id: string;
  type: string;
  name?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  size?: number; // Used for axes, etc.
  axisLength?: number; // The logical/numeric length of an axis
  labelTextSize?: number; // For controlling axis label size from Leva
  color?: string;
  opacity?: number;
  visible?: boolean; // NEW: To control object visibility
  physicsTransparent?: boolean; // NEW: Whether particles treat this object as transparent (no absorption)
  tubeInnerRadius?: number; // For tube type: inner radius as fraction of outer radius (0-1), default 0.8
  // Optional detector definition attached to this object.
  detector?: DetectorConfig;
  children?: SceneObjectType[];
};

export type InjectionSurfaceKind = 'rect' | 'sphereProjected' | 'sphereSection' | 'cylinderSection';

export interface InjectionSurface {
  id: string;
  name: string;
  kind: InjectionSurfaceKind;
  sourceObjectId: string;
  targetObjectId?: string;
  face?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  uSegments?: number;
  vSegments?: number;
  thetaMin?: number;
  thetaMax?: number;
  phiMin?: number;
  phiMax?: number;
  /**
   * How particles are placed on this surface at spawn time.
   * - 'freeform': uniform random (default, existing behaviour)
   * - 'quantum': |ψ|²-weighted via rolling pre-traced pool
   */
  spawnMode?: 'freeform' | 'quantum';
  /**
   * For 'quantum' mode with 'domainCrossing' trigger: which upstream
   * domain id(s) fire the injection event.  If empty / absent, spawning
   * uses the continuous fixed-rate path.
   */
  linkedFromDomainIds?: string[];
  /** Pre-traced pool capacity (default 200). Only used in quantum mode. */
  quantumPoolSize?: number;
}

// For the Toolbar and TransformControls
export type TransformControlsMode = 'translate' | 'rotate' | 'scale';

// For the different camera perspectives
export type CameraViewType = '3D' | 'xy' | 'xz' | 'yz';

// --- NEW: Types for the new Parametric System ---
// This section is new

// Defines a custom slider (e.g., "slitSeparation")
export type CustomParameter = {
  id: string;
  name: string;
  label: string;
  tabName?: string; // The Leva tab this control goes in
  folderName?: string; // NEW: For grouping in the custom UI
  // Optional quantity type for units display, e.g. 'distance', 'time', 'energy'
  quantity?: 'distance' | 'time' | 'energy' | 'mass' | 'angle' | 'dimensionless';
  value: number;
  min: number;
  max: number;
  step: number;
  /** Optional math.js expression evaluated against current parameter values to compute a dynamic min/max */
  minExpression?: string;
  maxExpression?: string;
};

// Defines the link between a parameter and an object's property
export type ParameterRelation = {
  id: string;
  expression: string; // This will now ONLY be the right-hand side, e.g., "slitSeparation - slitWidth"
  isValidated?: boolean;
};

// --- NEW: Types for the new Physics/Wave System ---

/**
 * A rule defining a boundary for a domain, e.g., "z > wall.position.z".
 * This will require an advanced parser in the future.
 */
export interface DomainRule {
  id: string;
  definition: string; // The logical expression for the rule.
  isValidated?: boolean;
}

/**
 * Represents a single physics equation (wave or trajectory).
 */
export interface PhysicsEquation {
  id: string;
  name: string;
  type: 'wave' | 'trajectory' | 'particle';
  expression: string; // e.g., "sin(k * z - omega * t)"
  derivedVariables?: { id: string; name: string; expression: string; showExpanded?: boolean; isValidated?: boolean; }[];
  isValidated?: boolean;
  numberOfParticles?: number;
  // Optional analytic gradients for GPU Bohmian velocity
  gradientX?: string; // dψ/dx
  gradientY?: string; // dψ/dy
  gradientZ?: string; // dψ/dz
  // Optional human-readable description of the law used to compute
  // this equation (for example, a Bohmian velocity formula). This is
  // shown in the UI but not parsed or evaluated directly.
  displayFormula?: string;
}

/**
 * A Physics Domain, which acts as a container for rules and equations.
 */
export interface PhysicsDomain {
  id: string;
  name: string;
  rules: DomainRule[];
  waveEquation?: PhysicsEquation;
  particleEquation?: PhysicsEquation;
  // selected particle ID (from project-level registry)
  selectedParticleId?: string;

  // NEW: Geometric shape definition for the domain
  shape?: 'box' | 'custom';
  center?: [number, number, number];
  size?: [number, number, number]; // For box: [width, height, depth]. For sphere: [radius, radius, radius]

  // NEW: Visualization controls for the wave function
  amplitudeMode?: 'flat' | 'linear' | 'log'; // How amplitude affects opacity
  opacityFactor?: number; // Overall density/opacity multiplier
  colorPalette?: string; // NEW: Name of the color palette to use
  minMagnitude?: number;  // The calculated min magnitude at t=0 for normalization
  maxMagnitude?: number;  // The calculated max magnitude at t=0 for normalization
  logMinMagnitude?: number; // The calculated min non-zero magnitude for log scaling

  // Particle injection configuration for this domain
  particleMaxCount?: number;

  // Optional analytic expression defining the particle injection surface region.
  particleInjectionSurfaceExpr?: string;

  // Optional list of geometric injection surfaces for this domain.
  injectionSurfaces?: InjectionSurface[];
}

/**
 * A global constant available in all formula expressions.
 */
export interface GlobalConstant {
  id: string;
  name: string; // The name used in formulas, e.g., "hbar"
  value: number;
  units?: string; // e.g., "J*s"
}

export interface ProjectDerivedVariable {
  id: string;
  name: string;
  expression: string;
  showInInfo?: boolean; // If true, show in the info panel
  isValidated?: boolean;
}

export type ProjectUnits = {
  distance: string;
  energy?: string;
  mass?: string;
   time?: string;
  // ... we can add more categories here later
};

export type ProjectData = {
  projectName: string;
  projectVersion: string;
  sceneObjects: SceneObjectType[];
  parameters: CustomParameter[];
  relations: ParameterRelation[];
  physicsDomains: PhysicsDomain[]; // Replaces waveFunctions
  globalConstants: GlobalConstant[];
  // Project-level particle registry (optional)
  particles?: ParticleDefinition[];
  // Project-level derived variables (available across domains)
  projectVariables?: ProjectDerivedVariable[];
  // Default camera view when loading the project
  defaultCameraView?: CameraViewType;

  units: ProjectUnits; 
  // We can add more here later, like 'physics' or 'settings'
};

export type ParticleType = 'electron' | 'proton' | 'neutron' | 'custom';

export interface ParticleDefinition {
  id: string;
  name: string; // display name
  type: ParticleType;
  mass: number; // mass in the project's chosen units
  notes?: string;
}