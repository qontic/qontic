// An illustrative finite-duration conditional Gaussian preparation. The two
// wave states evolve independently under the same Hamiltonian during the
// transition, so changing the conditioning never corrupts leapfrog history.
export class WhichSlitMeasurement {
  constructor({ gl, vao, programs, params, geometry, makeTexture, makeFBO,
    evolve, initialize, commit, readSurface }) {
    Object.assign(this, { gl, vao, programs, params, geometry, makeTexture,
      makeFBO, evolve, initialize, commit, readSurface });
    this.surfaces = [];
    this.reset();
  }

  detector() {
    const g = this.geometry(), p = this.params;
    const rear = p.barrierX * g.width + p.barrierThick * 0.5 + 1;
    // Amplitude widths in grid cells. Slower packets need gentler localization
    // to keep their momentum spread from overwhelming the forward motion.
    const clearance = 3.5;
    const sigmaX = Math.max(2, Math.min(
      Math.max(10, 2.5 * p.hbar / Math.max(0.5, p.p0)),
      20, (g.rightX - rear) / (2 * clearance)));
    const sigmaY = Math.max(14, p.slitWidth * 0.45)
      * Math.sqrt(1.5 / Math.max(0.5, p.p0));
    // Move the detector with the packet width. Leave 3.5 widths behind its
    // center and, where space permits, at least as much room before the screen.
    // Less than 0.00004% of an unshaped Gaussian lies behind the rear face.
    return { x: rear + clearance * sigmaX, rear, sigma: [sigmaX, sigmaY] };
  }

  release() {
    for (const s of this.surfaces) {
      this.gl.deleteFramebuffer(s.fbo);
      this.gl.deleteTexture(s.texture);
    }
    this.surfaces = [];
    this.target = null;
    this.mixed = null;
  }

  reset(particle = null) {
    this.release();
    this.previous = particle ? Array.from(particle.slice(0, 2)) : null;
    this.exitSlit = 0;
    this.info = { status: 'waiting', slit: 0, elapsed: 0, duration: this.transitionDuration() };
  }

  transitionDuration() {
    // Finish within roughly six cells of forward travel, while retaining a
    // smooth finite transition even at the highest incident momentum.
    return Math.min(4, 6 * this.params.mass / Math.max(0.5, this.params.p0));
  }

  nearDetector(lookAhead) {
    return this.info.status === 'waiting' && this.previous
      && this.previous[0] >= this.detector().rear - Math.max(8, lookAhead);
  }

  surface(width, height) {
    const texture = this.makeTexture(width, height);
    const s = { texture, fbo: this.makeFBO(texture), width, height };
    this.surfaces.push(s);
    return s;
  }

  draw(program, destination, textures, uniforms) {
    const gl = this.gl;
    gl.disable(gl.BLEND);
    gl.useProgram(program);
    gl.bindVertexArray(this.vao);
    gl.bindFramebuffer(gl.FRAMEBUFFER, destination?.fbo ?? null);
    if (destination) gl.viewport(0, 0, destination.width, destination.height);
    textures.forEach((texture, unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    });
    uniforms(name => gl.getUniformLocation(program, name));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  overlap(original, gaussian) {
    const gl = this.gl, g = this.geometry();
    let width = g.width, height = g.height, source = original, first = true;
    const temporary = [];
    do {
      const next = this.surface(Math.ceil(width / 2), Math.ceil(height / 2));
      temporary.push(next);
      this.draw(this.programs.overlap, next, [source, gaussian], u => {
        gl.uniform1i(u('uSource'), 0);
        gl.uniform1i(u('uGaussian'), 1);
        gl.uniform2i(u('uSourceSize'), width, height);
        gl.uniform1i(u('uFirst'), first ? 1 : 0);
      });
      width = next.width; height = next.height; source = next.texture; first = false;
    } while (width > 1 || height > 1);
    const result = this.readSurface(temporary.at(-1).fbo, 1, 1);
    for (const s of temporary) {
      gl.deleteFramebuffer(s.fbo); gl.deleteTexture(s.texture);
      this.surfaces.splice(this.surfaces.indexOf(s), 1);
    }
    return result;
  }

  observe(particle, original, physicsFrame) {
    if (!this.params.whichSlit || this.info.status !== 'waiting') return;
    const point = Array.from(particle.slice(0, 2)), previous = this.previous;
    this.previous = point;
    if (particle[2] !== 1) { this.info.status = 'missed'; return; }
    if (!previous) return;
    const d = this.detector(), g = this.geometry(), dx = point[0] - previous[0];
    if (point[0] < d.rear - 1) this.exitSlit = 0;
    if (dx <= 0) return;
    if (previous[0] < d.rear && point[0] >= d.rear) {
      const y = previous[1] + (point[1] - previous[1]) * (d.rear - previous[0]) / dx;
      const slit = y >= g.height / 2 ? 1 : -1;
      const center = g.height / 2 + slit * this.params.slitSep / 2;
      if (Math.abs(y - center) <= this.params.slitWidth / 2 + 1.5) this.exitSlit = slit;
    }
    if (!this.exitSlit || previous[0] >= d.x || point[0] < d.x) return;
    // The outcome is an aperture, not the particle's exact transverse position.
    // Centering every packet on its particle suppresses diffraction sampling;
    // copying the two-slit local current also locks in its outward deflection.
    const center = [point[0], g.height / 2 + this.exitSlit * this.params.slitSep / 2];
    const momentum = [this.params.p0, 0];
    // At a farther plane the actual particle can already be well off the slit
    // axis, especially with Pauli guidance. Do not prepare a wave whose tiny
    // tail contains that particle: its large log-density gradient gives a
    // violent sideways velocity (and can reverse the Pauli longitudinal one).
    // Broaden the transverse preparation instead, retaining both its slit
    // center and the particle's actual position. The tighter low-momentum
    // bound also limits how much of the longitudinal spreading it can sample.
    const maxOffset = Math.max(0.25, Math.min(1.5,
      0.6 * this.params.p0 * d.sigma[0] / this.params.hbar));
    d.sigma[1] = Math.max(d.sigma[1], Math.abs(point[1] - center[1]) / maxOffset);
    this.info = { status: 'collapsing', slit: this.exitSlit, elapsed: 0, duration: this.transitionDuration(),
      point, center, sigma: d.sigma, momentum, detectorX: d.x, barrierRear: d.rear,
      triggerFrame: physicsFrame, lastDt: 0 };
    this.allocate();
    this.initialize(this.target[0].fbo, center, d.sigma, momentum);
    const [norm, targetNorm, real, imaginary] = this.overlap(original, this.target[0].texture);
    const magnitude = Math.hypot(real, imaginary);
    this.info.gain = Math.sqrt(norm / Math.max(targetNorm, 1e-20));
    this.info.overlap = Math.max(0, Math.min(1, magnitude / Math.sqrt(Math.max(norm * targetNorm, 1e-20))));
    this.info.phase = magnitude > 1e-16 ? [real / magnitude, -imaginary / magnitude] : [1, 0];
    this.info.initialNorm = norm;
    this.mix(original);
  }

  allocate() {
    const g = this.geometry();
    this.target = [this.surface(g.width, g.height), this.surface(g.width, g.height)];
    this.targetFlip = 0;
    this.mixed = this.surface(g.width, g.height);
  }

  mix(original) {
    const gl = this.gl, info = this.info;
    this.draw(this.programs.mix, this.mixed, [original, this.target[this.targetFlip].texture], u => {
      gl.uniform1i(u('uOriginal'), 0); gl.uniform1i(u('uGaussian'), 1);
      gl.uniform2f(u('uProgress'), info.elapsed / info.duration, Math.max(0, info.elapsed - info.lastDt) / info.duration);
      gl.uniform1f(u('uGain'), info.gain); gl.uniform1f(u('uOverlap'), info.overlap);
      gl.uniform2fv(u('uPhase'), info.phase);
    });
  }

  advance(original, dt) {
    if (this.info.status !== 'collapsing') return;
    this.evolve(this.target[this.targetFlip].texture, this.target[1 - this.targetFlip].fbo);
    this.targetFlip = 1 - this.targetFlip;
    this.info.elapsed = Math.min(this.info.duration, this.info.elapsed + dt);
    this.info.lastDt = dt;
    this.mix(original);
    if (this.info.elapsed >= this.info.duration - 1e-9) {
      this.commit(this.mixed.fbo);
      this.info.status = 'detected';
      this.release();
    }
  }

  waveTexture(original) {
    return this.info.status === 'collapsing' ? this.mixed.texture : original;
  }

  drawDetector(stageWidth, stageHeight) {
    if (!this.params.whichSlit) return;
    const gl = this.gl, d = this.detector();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const program = this.programs.detector;
    gl.useProgram(program); gl.bindVertexArray(this.vao);
    const u = name => gl.getUniformLocation(program, name);
    gl.uniform2f(u('uStageSize'), stageWidth, stageHeight);
    gl.uniform1f(u('uDetectorX'), d.x);
    gl.uniform1f(u('uSlitSeparation'), this.params.slitSep);
    gl.uniform1f(u('uSlitWidth'), this.params.slitWidth);
    gl.uniform1i(u('uDetectedSlit'), this.info.slit);
    gl.uniform1f(u('uProgress'), this.info.status === 'collapsing' ? this.info.elapsed / this.info.duration : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.BLEND); gl.bindVertexArray(null);
  }

  snapshot() {
    return { info: structuredClone(this.info), previous: this.previous?.slice(), exitSlit: this.exitSlit,
      targetWave: this.target ? this.readSurface(this.target[this.targetFlip].fbo, this.geometry().width, this.geometry().height) : null };
  }

  restore(snapshot, original) {
    if (!snapshot) return;
    this.info = structuredClone(snapshot.info);
    this.previous = snapshot.previous?.slice(); this.exitSlit = snapshot.exitSlit;
    if (this.info.status === 'collapsing') {
      this.allocate();
      const gl = this.gl, g = this.geometry();
      gl.bindTexture(gl.TEXTURE_2D, this.target[0].texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, g.width, g.height, gl.RGBA, gl.FLOAT, snapshot.targetWave);
      this.mix(original);
    }
  }
}
