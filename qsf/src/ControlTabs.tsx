import { useState, type ReactNode, useEffect } from 'react';
import './ControlTabs.css';

interface ControlTabProps {
  label: string;
  icon?: ReactNode; // Optional icon for the tab
  content: ReactNode; // Content is now just JSX
}

interface ControlTabsProps {
  tabs: ControlTabProps[];
  controlsFontSize: number;
  controlsOverlay?: ReactNode; // For the preview overlay
  infoPanelFontSize: number; // NEW: Font size for the message area
  simulationTime: number;
  physicalTimeNs: number;
  physicalNsPerSimSecond: number;
  activeParticleKineticEnergyKeV?: number;
  activeParticleWaveSpeedNmPerNs?: number;
  runtimeParticleCountActive?: number;
  runtimeParticleCountTotal?: number;
  detectorTotalHits?: number;
  performanceMetrics: Map<string, number>;
  domainLookup?: Record<string, string>;
  infoVariables?: { name: string; value: number | string }[]; // Project-level variables to show in Info panel
}

export function ControlTabs({ tabs, controlsFontSize, controlsOverlay, infoPanelFontSize, simulationTime, physicalTimeNs, activeParticleKineticEnergyKeV, activeParticleWaveSpeedNmPerNs, runtimeParticleCountActive, runtimeParticleCountTotal, detectorTotalHits, performanceMetrics, domainLookup, infoVariables }: ControlTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || '');
  const activeTabContent = tabs.find(tab => tab.label === activeTab)?.content;
  const [activeInfoTab, setActiveInfoTab] = useState<'Physics' | 'Simulation'>('Physics');

  // State to hold formatted performance metrics (per-domain, using human names when available)
  const [metrics, setMetrics] = useState<[string, string][]>([]);

  useEffect(() => {
    const lookup = domainLookup || {};
    const display = Array.from(performanceMetrics.entries()).map(([id, rate]) => [lookup[id] || id, `${rate.toFixed(1)} ups`] as [string, string]);
    setMetrics(display);
  }, [performanceMetrics, domainLookup]);

  return (
    <div className="control-tabs-container">
      <div className="control-tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`control-tab-button ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.icon && <span className="control-tab-icon">{tab.icon}</span>}
            <span className="control-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="control-panel-wrapper" style={{ fontSize: `${controlsFontSize}px` }}>
        {controlsOverlay} {/* Render overlay here */}
        <div className="control-tab-title">{activeTab}</div>
        <div className="control-controls-area">
          {/* Render the JSX content of the active tab */}
          {activeTabContent}
        </div>
        <div className="info-panel-area" style={{ fontSize: `${infoPanelFontSize}px` }}>
          <div className="info-panel-tabs">
            <button className={`info-panel-tab-button ${activeInfoTab === 'Physics' ? 'active' : ''}`} onClick={() => setActiveInfoTab('Physics')}>Physics</button>
            <button className={`info-panel-tab-button ${activeInfoTab === 'Simulation' ? 'active' : ''}`} onClick={() => setActiveInfoTab('Simulation')}>Simulation</button>
          </div>
          <div className="info-panel-content">
            {activeInfoTab === 'Physics' && (
              <div className="info-section">
                {(() => {
                  // Compact, unit-aware formatting for physical time with fs and ps
                  const ns = physicalTimeNs;
                  const absNs = Math.abs(ns);
                  let physValue: number;
                  let physUnit: string;

                  if (absNs >= 1e9 * 3600) {
                    physValue = ns / (1e9 * 3600);
                    physUnit = 'h';
                  } else if (absNs >= 1e9 * 60) {
                    physValue = ns / (1e9 * 60);
                    physUnit = 'min';
                  } else if (absNs >= 1e9) {
                    physValue = ns / 1e9;
                    physUnit = 's';
                  } else if (absNs >= 1e6) {
                    physValue = ns / 1e6;
                    physUnit = 'ms';
                  } else if (absNs >= 1e3) {
                    physValue = ns / 1e3;
                    physUnit = 'µs';
                  } else if (absNs >= 1) {
                    physValue = ns;
                    physUnit = 'ns';
                  } else if (absNs >= 1e-3) {
                    physValue = ns * 1e3;
                    physUnit = 'ps';
                  } else {
                    physValue = ns * 1e6;
                    physUnit = 'fs';
                  }

                  const simStr = simulationTime.toFixed(2);
                  // Use scientific notation for very small values to avoid showing 0.00
                  const physStr = Math.abs(physValue) < 0.01 && absNs > 0 ? physValue.toExponential(2) : physValue.toFixed(2);

                  // Compute true physical time scale (physical time per sim second)
                  const truePhysicalPerSim = simulationTime > 0 ? physicalTimeNs / simulationTime : 0;
                  const absScale = Math.abs(truePhysicalPerSim);
                  let scaleValue: number;
                  let scaleUnit: string;

                  if (absScale >= 1e9 * 3600) {
                    scaleValue = truePhysicalPerSim / (1e9 * 3600);
                    scaleUnit = 'h/s';
                  } else if (absScale >= 1e9 * 60) {
                    scaleValue = truePhysicalPerSim / (1e9 * 60);
                    scaleUnit = 'min/s';
                  } else if (absScale >= 1e9) {
                    scaleValue = truePhysicalPerSim / 1e9;
                    scaleUnit = 's/s';
                  } else if (absScale >= 1e6) {
                    scaleValue = truePhysicalPerSim / 1e6;
                    scaleUnit = 'ms/s';
                  } else if (absScale >= 1e3) {
                    scaleValue = truePhysicalPerSim / 1e3;
                    scaleUnit = 'µs/s';
                  } else if (absScale >= 1) {
                    scaleValue = truePhysicalPerSim;
                    scaleUnit = 'ns/s';
                  } else if (absScale >= 1e-3) {
                    scaleValue = truePhysicalPerSim * 1e3;
                    scaleUnit = 'ps/s';
                  } else {
                    scaleValue = truePhysicalPerSim * 1e6;
                    scaleUnit = 'fs/s';
                  }

                  const scaleStr = Math.abs(scaleValue) < 0.01 && absScale > 0 ? scaleValue.toExponential(2) : scaleValue.toFixed(2);

                  return (
                    <>
                      <div className="info-item">
                        <span className="info-label">Sim/Phys Time</span>
                        <span className="info-value">{simStr} s / {physStr} {physUnit}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Scale</span>
                        <span className="info-value">{scaleStr} {scaleUnit}</span>
                      </div>
                    </>
                  );
                })()}
                {typeof runtimeParticleCountActive === 'number' && typeof runtimeParticleCountTotal === 'number' && (
                  <div className="info-item">
                    <span className="info-label"># Part (act/total)</span>
                    <span className="info-value">{runtimeParticleCountActive} / {runtimeParticleCountTotal}</span>
                  </div>
                )}
                {typeof detectorTotalHits === 'number' && (
                  <div className="info-item">
                    <span className="info-label"># Detector Hits</span>
                    <span className="info-value">{detectorTotalHits}</span>
                  </div>
                )}
                {typeof activeParticleKineticEnergyKeV === 'number' && isFinite(activeParticleKineticEnergyKeV) && (() => {
                  // Convert from keV to eV for unit selection
                  const energyEv = activeParticleKineticEnergyKeV * 1e3;
                  const absEv = Math.abs(energyEv);
                  let displayValue: number;
                  let unit: string;

                  if (absEv >= 1e6) {
                    displayValue = energyEv / 1e6;
                    unit = 'MeV';
                  } else if (absEv >= 1e3) {
                    displayValue = energyEv / 1e3;
                    unit = 'keV';
                  } else if (absEv >= 1) {
                    displayValue = energyEv;
                    unit = 'eV';
                  } else {
                    // For anything below 1 eV, clamp to meV as the smallest unit
                    displayValue = energyEv * 1e3;
                    unit = 'meV';
                  }

                  const formatted = Math.abs(displayValue) >= 1e3 || Math.abs(displayValue) < 1e-3
                    ? displayValue.toExponential(3)
                    : displayValue.toFixed(3);

                  return (
                    <div className="info-item">
                      <span className="info-label">Kinetic E</span>
                      <span className="info-value">{formatted} {unit}</span>
                    </div>
                  );
                })()}
                {typeof activeParticleWaveSpeedNmPerNs === 'number' && isFinite(activeParticleWaveSpeedNmPerNs) && (
                  <div className="info-item">
                    <span className="info-label">Wave Speed</span>
                    <span className="info-value">{activeParticleWaveSpeedNmPerNs.toExponential(3)} nm/ns</span>
                  </div>
                )}
                {infoVariables && infoVariables.length > 0 && (
                  <div className="info-variables">
                    {infoVariables.map(v => (
                      <div className="info-item" key={v.name}>
                        <span className="info-label">{v.name}</span>
                        <span className="info-value">{typeof v.value === 'number' ? (v.value as number).toFixed(6) : String(v.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeInfoTab === 'Simulation' && (
              <div className="info-section">
                <span className="info-header">Wave Updates</span>
                {metrics.length > 0 ? metrics.map(([id, rate]) => (
                  <div className="info-item" key={id}>
                    <span className="info-label">{id}</span>
                    <span className="info-value">{rate}</span>
                  </div>
                )) : <span className="info-value-placeholder">No active domains.</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}