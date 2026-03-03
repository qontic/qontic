// <-- FIX: Add ParametricData and .ts extension
import type { ProjectData } from './types.ts';

/**
 * A custom replacer for JSON.stringify to format arrays of primitives on a single line.
 */
function replacer(key: string, value: any) {
  // Don't save refs
  if (key === 'ref') return undefined;

  // Do not persist derived wave normalization data; it will be recomputed on load.
  if (key === 'minMagnitude' || key === 'maxMagnitude' || key === 'logMinMagnitude') {
    return undefined;
  }

  // Compact array formatting for primitives
  if (Array.isArray(value) && value.every(item => typeof item !== 'object')) {
    return JSON.stringify(value);
  }

  return value;
}

export function saveProjectToFile(projectData: ProjectData, filename: string) {
  let data = JSON.stringify(projectData, replacer, 2);
  // Post-process to remove quotes from inline numeric arrays produced by the
  // replacer (e.g., "[1,2,3]") without touching other bracketed strings like
  // particle expressions. We restrict this to arrays of numbers, commas, and
  // whitespace so expressions such as "[hbar * k * x]" remain quoted.
  data = data.replace(/"\[([0-9eE+\-.,\s]+)\]"/g, '[$1]');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadProjectFromFile(): Promise<{ data: ProjectData; fileName: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string) as ProjectData;
            // Basic validation
            if (data.sceneObjects && data.parameters && data.relations && data.units) {
              resolve({ data, fileName: file.name });
            } else {
               console.error('Invalid project file. Missing keys.');
               resolve(null);
            }
          } catch (error) {
            console.error('Error parsing JSON file:', error);
            resolve(null);
          }
        };
        reader.readAsText(file);
      } else {
        resolve(null);
      }
    };
    input.click();
  });
}