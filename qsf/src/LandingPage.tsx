import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectData } from './types';
import './LandingPage.css';

interface ModelInfo {
  fileName: string;
  projectName: string;
  importer: () => Promise<{ default: ProjectData }>;
}

export function LandingPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      // This is a Vite-specific feature that finds all .json files in ../models/
      // and prepares them for dynamic import.
      const modelModules = import.meta.glob<true, string, { default: ProjectData }>('../models/*.json', { eager: true });

      const modelList: ModelInfo[] = [];

      for (const path in modelModules) {
        const module = modelModules[path];
        const fileName = path.split('/').pop() ?? 'unknown.json';
        const projectName = module.default.projectName || 'Untitled Model';

        // We need a way to re-import later, so we create a dynamic importer function.
        // This is a bit of a trick to pass the import logic to the next page.
        // The /* @vite-ignore */ comment below is used to suppress a warning from Vite's static analyzer.
        // Vite cannot analyze a fully dynamic import path, but we know the path will be valid at runtime.
        const importer = () => import(/* @vite-ignore */ `../models/${fileName}`);

        modelList.push({
          fileName,
          projectName,
          importer,
        });
      }

      setModels(modelList);
      setLoading(false);
    };

    fetchModels();
  }, []);

  if (loading) {
    return <div>Loading models...</div>;
  }

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>Quantum Simulation Framework</h1>
        <h2>Select a Model to Begin</h2>
        <ul className="model-list">
          {models.map((model) => (
            <li key={model.fileName}>
              {/* We pass the fileName in the URL and a signal to load it */}
              <Link to={`/simulation/${model.fileName}`} className="model-link">
                {model.projectName}
                <span className="model-filename">{model.fileName}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="landing-footer">
          <p>You can also drag-and-drop a local `.json` file onto the editor.</p>
        </div>
      </div>
    </div>
  );
}