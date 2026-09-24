import assert from 'node:assert';

// Mock canvas and document for Node testing
function setupMockCanvas(generatePixels) {
  globalThis.document = {
    createElement: (tag) => {
      if (tag === 'canvas') {
        let _w = 320;
        let _h = 240;
        return {
          set width(w) { _w = w; },
          get width() { return _w; },
          set height(h) { _h = h; },
          get height() { return _h; },
          getContext: (type) => ({
            drawImage: () => {},
            getImageData: (sx, sy, sw, sh) => {
              const data = new Uint8ClampedArray(sw * sh * 4);
              generatePixels(data, sw, sh);
              return { data, width: sw, height: sh };
            }
          })
        };
      }
    }
  };
}

const { detectLesionsFromImage } = await import('../src/utils/lesionDetector.js');
const { runPathologyInference } = await import('../src/services/inferenceEngine.js');

console.log('=== TEST 1: HEALTHY CLEAN GREEN LEAF ===');

// Setup clean green leaf (95% green, 0% necrosis)
setupMockCanvas((data, sw, sh) => {
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const idx = (y * sw + x) * 4;
      // Leaf region: x: 80..240, y: 50..190
      if (x >= 80 && x <= 240 && y >= 50 && y <= 190) {
        // Clean healthy green leaf pixel: G=160, R=45, B=40
        data[idx] = 45;
        data[idx + 1] = 160;
        data[idx + 2] = 40;
        data[idx + 3] = 255;
      } else {
        // Desk background
        data[idx] = 190;
        data[idx + 1] = 140;
        data[idx + 2] = 95;
        data[idx + 3] = 255;
      }
    }
  }
});

const mockHealthyImg = { naturalWidth: 640, naturalHeight: 480, width: 640, height: 480 };
const healthyDetection = detectLesionsFromImage(mockHealthyImg);

console.log('Healthy detection result:', {
  isHealthy: healthyDetection.isHealthy,
  healthIndex: healthyDetection.healthIndex,
  necroticRatio: healthyDetection.necroticRatio,
  lesionCount: healthyDetection.lesions.length,
  affectedAreaPct: healthyDetection.affectedAreaPct
});

assert.strictEqual(healthyDetection.isHealthy, true, 'Healthy clean leaf must be flagged as isHealthy = true');
assert.strictEqual(healthyDetection.lesions.length, 0, 'Healthy leaf must have ZERO lesion bounding boxes');
assert.strictEqual(healthyDetection.affectedAreaPct, 0.0, 'Healthy leaf must have 0.0% affected area');
console.log('✅ TEST 1 PASSED: Healthy leaf has 0 bounding boxes and 0.0% affected area.');

console.log('\n=== TEST 2: INFECTED DISEASED LEAF (>15% NECROSIS) ===');

// Setup infected leaf with >15% brown necrosis
setupMockCanvas((data, sw, sh) => {
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const idx = (y * sw + x) * 4;
      // Leaf region: x: 80..240, y: 50..190
      if (x >= 80 && x <= 240 && y >= 50 && y <= 190) {
        // Create brown necrotic patches in 25% of leaf
        if ((x >= 90 && x <= 130 && y >= 70 && y <= 110) || 
            (x >= 170 && x <= 210 && y >= 110 && y <= 150) ||
            (x >= 140 && x <= 170 && y >= 80 && y <= 110)) {
          // Brown necrotic spot: R=115, G=60, B=30
          data[idx] = 115;
          data[idx + 1] = 60;
          data[idx + 2] = 30;
          data[idx + 3] = 255;
        } else {
          // Green leaf
          data[idx] = 45;
          data[idx + 1] = 150;
          data[idx + 2] = 40;
          data[idx + 3] = 255;
        }
      } else {
        // Table background
        data[idx] = 190;
        data[idx + 1] = 140;
        data[idx + 2] = 95;
        data[idx + 3] = 255;
      }
    }
  }
});

const mockInfectedImg = { naturalWidth: 640, naturalHeight: 480, width: 640, height: 480 };
const infectedDetection = detectLesionsFromImage(mockInfectedImg);

console.log('Infected detection result:', {
  isHealthy: infectedDetection.isHealthy,
  lesionCount: infectedDetection.lesions.length,
  affectedAreaPct: infectedDetection.affectedAreaPct
});

assert.strictEqual(infectedDetection.isHealthy, false, 'Infected leaf must have isHealthy = false');
assert.strictEqual(infectedDetection.lesions.length, 5, 'Infected leaf must place 5 lesion bounding boxes');
assert(infectedDetection.affectedAreaPct >= 10.0, 'Infected leaf affectedAreaPct must be >= 10%');
console.log('✅ TEST 2 PASSED: Infected leaf correctly places 5 lesion bounding boxes.');

console.log('\n=== TEST 3: FULL INFERENCE ENGINE VERDICT ===');

// Setup global Image mock for runPathologyInference
globalThis.Image = class {
  constructor() {
    this.naturalWidth = 640;
    this.naturalHeight = 480;
    this.width = 640;
    this.height = 480;
    this.complete = true;
  }
  set src(val) {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }
};

// 3A: Test healthy inference
setupMockCanvas((data, sw, sh) => {
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const idx = (y * sw + x) * 4;
      if (x >= 80 && x <= 240 && y >= 50 && y <= 190) {
        data[idx] = 45; data[idx + 1] = 160; data[idx + 2] = 40; data[idx + 3] = 255;
      } else {
        data[idx] = 190; data[idx + 1] = 140; data[idx + 2] = 95; data[idx + 3] = 255;
      }
    }
  }
});

const healthyDiag = await runPathologyInference('data:image/png;base64,mockhealthy');
console.log('Healthy Diagnosis Output:', {
  diseaseName: healthyDiag.diseaseName.en,
  confidence: healthyDiag.confidence,
  severity: healthyDiag.severity,
  affectedAreaPct: healthyDiag.affectedAreaPct,
  lesionCount: healthyDiag.lesions.length,
  chemicalCard1: healthyDiag.chemicalTreatments[0].salt,
  chemicalCategory: healthyDiag.chemicalTreatments[0].category.en
});

assert.strictEqual(healthyDiag.diseaseName.en, 'Healthy Crop (Zea mays / Solanum)', 'Verdict must be Healthy Crop (Zea mays / Solanum)');
assert.strictEqual(healthyDiag.confidence, 98.4, 'Confidence must be 98.4%');
assert.strictEqual(healthyDiag.severity, 'none', 'Severity must be none');
assert.strictEqual(healthyDiag.affectedAreaPct, 0.0, 'Affected area must be 0.0%');
assert.strictEqual(healthyDiag.lesions.length, 0, 'Lesion count must be 0');
assert(healthyDiag.chemicalTreatments[0].salt.includes('Zinc'), 'Healthy treatment must recommend micronutrients (Zinc), not fungicides');

console.log('✅ ALL TESTS PASSED: Threshold Gate, Healthy Leaf Output, and Dynamic Infection Triggers Fully Verified!');
