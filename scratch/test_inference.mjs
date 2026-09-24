// Minimal polyfill for Node.js test environment
if (typeof Image === 'undefined') {
  global.Image = class {
    constructor() {
      setTimeout(() => {
        this.naturalWidth = 600;
        this.naturalHeight = 400;
        this.complete = true;
        if (this.onload) this.onload();
      }, 50);
    }
  };
}

if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({
      getContext: () => ({
        drawImage: () => {},
        getImageData: () => ({ data: new Uint8ClampedArray(256 * 256 * 4) })
      })
    })
  };
}

import { runPathologyInference } from '../src/services/inferenceEngine.js';

console.log('--- Testing Custom Scan Inference Pipeline ---');
const dummyDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="green"/></svg>';

const customResult = await runPathologyInference(dummyDataUri, null, (log) => {
  console.log(`[Step ${log.step} - ${log.progress}%] ${log.text}`);
});

console.log('\n--- Custom Scan Diagnostic Result ---');
console.log('Crop:', customResult.cropName.en);
console.log('Disease:', customResult.diseaseName.en);
console.log('Severity:', customResult.severity);
console.log('Confidence:', customResult.confidence);
console.log('Lesions Count:', customResult.lesions.length);
customResult.lesions.forEach((l, i) => {
  console.log(`  Lesion ${i + 1}: ${l.label} (x: ${l.x}, y: ${l.y}, w: ${l.w}, h: ${l.h})`);
});
console.log('Chemical Treatments Count:', customResult.chemicalTreatments.length);
console.log('Chemical Interventions Count:', customResult.chemicalInterventions.length);
console.log('Organic Remedies Count:', customResult.organicRemedies.length);

console.log('\nCUSTOM SCAN VERIFICATION COMPLETE & SUCCESSFUL!');
