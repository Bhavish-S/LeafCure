import { processImageDataBuffer, generateFallbackLesions } from '../src/utils/lesionDetector.js';

console.log('====================================================');
console.log('TESTING FOCUSED LESION-FIRST DETECTION ALGORITHM');
console.log('====================================================\n');

const sw = 320;
const sh = 240;

// ========================================================
// SCENARIO 1: CLEAN 100% HEALTHY GREEN LEAF (Screenshot 24)
// ========================================================
console.log('--- TEST 1: Clean Healthy Green Leaf ---');
const healthyData = new Uint8Array(sw * sh * 4);

for (let y = 0; y < sh; y++) {
  for (let x = 0; x < sw; x++) {
    const idx = (y * sw + x) * 4;
    // Foliage pixel: Vibrant healthy green (R: 45, G: 160, B: 50)
    healthyData[idx] = 45;      // R
    healthyData[idx + 1] = 160;  // G
    healthyData[idx + 2] = 50;   // B
    healthyData[idx + 3] = 255;  // A
  }
}

const healthyResult = processImageDataBuffer(healthyData, sw, sh, 640, 480, 480 / 640);
console.log('Result isHealthy:', healthyResult.isHealthy);
console.log('Health Index:', healthyResult.healthIndex + '%');
console.log('Necrotic Ratio:', healthyResult.necroticRatio);
console.log('Detected Lesion Count:', healthyResult.lesions.length);

if (healthyResult.isHealthy === true && healthyResult.lesions.length === 0) {
  console.log('>>> [PASS] Healthy leaf correctly classified with 0 bounding boxes!\n');
} else {
  console.error('>>> [FAIL] Healthy leaf failed classification!', healthyResult);
  process.exit(1);
}

// ========================================================
// SCENARIO 2: SCREENSHOT 25 (Heavily diseased leaf surrounded by background canopy)
// Global image is 95% green, but central leaf has 5% brown necrotic & yellow halo
// ========================================================
console.log('--- TEST 2: Screenshot 25 Scenario (Diseased leaf in dense background canopy) ---');
const canopyData = new Uint8Array(sw * sh * 4);

// Fill entire canvas with background green canopy (R: 50, G: 150, B: 45)
for (let y = 0; y < sh; y++) {
  for (let x = 0; x < sw; x++) {
    const idx = (y * sw + x) * 4;
    canopyData[idx] = 50;
    canopyData[idx + 1] = 150;
    canopyData[idx + 2] = 45;
    canopyData[idx + 3] = 255;
  }
}

// Inject central brown necrotic lesion centered at (x: 160, y: 120) with radius 22
// Earthy brown tones (R: 85, G: 55, B: 30)
// And surrounding yellow chlorotic halo (radius 22 to 34) (R: 165, G: 155, B: 45)
const cx = 160;
const cy = 120;
let injectedNecrotic = 0;
let injectedChlorotic = 0;

for (let y = 0; y < sh; y++) {
  for (let x = 0; x < sw; x++) {
    const dist = Math.hypot(x - cx, y - cy);
    const idx = (y * sw + x) * 4;

    if (dist <= 20) {
      // Necrotic brown core
      canopyData[idx] = 85;
      canopyData[idx + 1] = 55;
      canopyData[idx + 2] = 30;
      injectedNecrotic++;
    } else if (dist <= 32) {
      // Chlorotic yellow halo
      canopyData[idx] = 165;
      canopyData[idx + 1] = 155;
      canopyData[idx + 2] = 45;
      injectedChlorotic++;
    }
  }
}

console.log(`Injected ${injectedNecrotic} necrotic pixels and ${injectedChlorotic} chlorotic halo pixels.`);
console.log(`Total image pixels: ${sw * sh}, Global Necrosis %: ${(injectedNecrotic / (sw * sh) * 100).toFixed(2)}% (Very low globally!)`);

const diseasedResult = processImageDataBuffer(canopyData, sw, sh, 640, 480, 480 / 640);
console.log('Result isHealthy:', diseasedResult.isHealthy);
console.log('Necrotic Ratio in focus:', diseasedResult.necroticRatio);
console.log('Chlorotic Ratio in focus:', diseasedResult.chloroticRatio);
console.log('Estimated Affected Area %:', diseasedResult.affectedAreaPct + '%');
console.log('Detected Lesion Count:', diseasedResult.lesions.length);

console.log('\nInspecting Generated Bounding Boxes:');
diseasedResult.lesions.forEach((l, idx) => {
  console.log(`  Box ${idx + 1}: ${l.label} [color: ${l.color}] (x: ${l.x}, y: ${l.y}, w: ${l.w}, h: ${l.h})`);
});

// Verification criteria:
// 1. Must be flagged as isHealthy === false
if (diseasedResult.isHealthy !== false) {
  console.error('>>> [FAIL] Diseased leaf was incorrectly marked healthy!');
  process.exit(1);
}

// 2. Must generate 5 bounding boxes
if (diseasedResult.lesions.length !== 5) {
  console.error(`>>> [FAIL] Expected 5 bounding boxes, got ${diseasedResult.lesions.length}`);
  process.exit(1);
}

// 3. Expected labels:
const expectedLabels = [
  '#1 Chlorotic Margin',
  '#2 Necrotic Core',
  '#3 Active Lesion',
  '#4 Expanding Blight',
  '#5 Foliar Margin Decay'
];

for (let i = 0; i < expectedLabels.length; i++) {
  if (diseasedResult.lesions[i].label !== expectedLabels[i]) {
    console.error(`>>> [FAIL] Label mismatch at box ${i + 1}: expected "${expectedLabels[i]}", got "${diseasedResult.lesions[i].label}"`);
    process.exit(1);
  }
}

// 4. Centroid Check:
// The injection was at cx = 160, cy = 120. In normalized coords: cx/sw = 0.50, cy/sh = 0.50.
// Verify the boxes are centered around (0.50, 0.50) within reasonable lesion span, NOT in outer corners!
const coreBox = diseasedResult.lesions[1]; // #2 Necrotic Core
const coreCenterX = coreBox.x + coreBox.w / 2;
const coreCenterY = coreBox.y + coreBox.h / 2;
console.log(`\nCore Box Center: (x: ${coreCenterX.toFixed(3)}, y: ${coreCenterY.toFixed(3)}) vs expected (0.500, 0.500)`);

if (Math.abs(coreCenterX - 0.50) > 0.05 || Math.abs(coreCenterY - 0.50) > 0.05) {
  console.error('>>> [FAIL] Core bounding box is not centered on the actual necrotic lesion!');
  process.exit(1);
}

console.log('>>> [PASS] All test assertions verified successfully!');
console.log('====================================================');
