const SHADER_FILES = {
  UNIFORMS_WGSL: "shaders/uniforms.wgsl",
  PALETTE_WGSL: "shaders/palette.wgsl",
  WAVE_INIT_BODY: "shaders/wave-init.wgsl",
  WAVE_STEP_BODY: "shaders/wave-step.wgsl",
  PARTICLE_UPDATE_BODY: "shaders/particle-update.wgsl",
  CLOUD_BODY: "shaders/cloud.wgsl",
  PARTICLE_RENDER_BODY: "shaders/particle-render.wgsl",
  DENSITY_BODY: "shaders/density.wgsl",
  BOX_SHELL_BODY: "shaders/box-shell.wgsl",
  AXIS_ARROW_BODY: "shaders/axis-arrow.wgsl",
  FIELD_LINE_BODY: "shaders/field-line.wgsl",
  EQUIPOTENTIAL_BODY: "shaders/equipotential.wgsl",
  INFO_OVERLAY_BODY: "shaders/info-overlay.wgsl",
};

async function loadShaderText(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) {
    throw new Error(`Could not load shader ${path}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function applyShaderDefines(source, defines) {
  return source.replace(/\$\{([A-Z0-9_]+)\}/g, (match, name) => {
    if (Object.hasOwn(defines, name)) return String(defines[name]);
    return match;
  });
}

export async function createShaderSources({ WAVE_WORKGROUP_SIZE, PARTICLE_WORKGROUP_SIZE }) {
  const entries = await Promise.all(
    Object.entries(SHADER_FILES).map(async ([name, path]) => [name, await loadShaderText(path)])
  );
  const sources = Object.fromEntries(entries);
  const defines = { WAVE_WORKGROUP_SIZE, PARTICLE_WORKGROUP_SIZE };

  const withDefines = (source, extraDefines = {}) => applyShaderDefines(source, { ...defines, ...extraDefines });
  const withUniforms = (source, extraDefines = {}) => sources.UNIFORMS_WGSL + withDefines(source, extraDefines);
  const withUniformsAndPalette = source => sources.UNIFORMS_WGSL + sources.PALETTE_WGSL + withDefines(source);

  return {
    WAVE_INIT_WGSL: withUniforms(sources.WAVE_INIT_BODY),
    WAVE_STEP_WGSL: withUniforms(sources.WAVE_STEP_BODY),
    PARTICLE_UPDATE_WGSL: withUniforms(sources.PARTICLE_UPDATE_BODY),
    CLOUD_WGSL: withUniformsAndPalette(sources.CLOUD_BODY),
    PARTICLE_RENDER_WGSL: withUniforms(sources.PARTICLE_RENDER_BODY),
    DENSITY_WGSL: withUniforms(sources.DENSITY_BODY),
    BOX_SHELL_WGSL: withUniforms(sources.BOX_SHELL_BODY),
    AXIS_ARROW_WGSL: withUniforms(sources.AXIS_ARROW_BODY),
    FIELD_LINE_WGSL: withUniforms(sources.FIELD_LINE_BODY),
    EQUIPOTENTIAL_WGSL: withUniforms(sources.EQUIPOTENTIAL_BODY, {
      EQUIPOTENTIAL_PROJECT_TO_BOTTOM: 1,
    }),
    EQUIPOTENTIAL_LEVELSET_WGSL: withUniforms(sources.EQUIPOTENTIAL_BODY, {
      EQUIPOTENTIAL_PROJECT_TO_BOTTOM: 0,
    }),
    INFO_OVERLAY_WGSL: withDefines(sources.INFO_OVERLAY_BODY),
  };
}
