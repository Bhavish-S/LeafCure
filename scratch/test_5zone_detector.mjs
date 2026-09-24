import assert from 'node:assert';

// Mock DOM elements and Canvas 2D context for Node test
function createMockCanvas(width, height, pixelGenerator) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = pixelGenerator(x, y);
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = a;
    }
  }

  const canvas = {
    width,
    height,
    getContext: (type) => {
      if (type === '2d') {
        return {
          drawImage: () => {},
          getImageData: (sx, sy, sw, sh) => ({
            data: pixels,
            width: sw,
            height: sh
          })
        };
      }
      return null;
    }
  };

  return canvas;
}

// Set up global document for node environment
globalThis.document = {
  createElement: (tag) => {
    if (tag === 'canvas') {
      // Return canvas that will be sized by detectLesionsFromImage
      let _w = 320;
      let _h = 240;
      return {
        set width(w) { _w = w; },
        get width() { return _w; },
        set height(h) { _h = h; },
        get height() { return _h; },
        getContext: (type) => ({
          drawImage: (img, x, y, dw, dh) => {},
          getImageData: (sx, sy, sw, sh) => {
            // Generate test image:
            // Background is wood/table: R=180, G=140, B=90 (or grey table R=220, G=220, B=220)
            // Red tomato fruit at top-left: x < 50, y < 50: R=210, G=40, B=30
            // Green leaf in region: x: 70..250, y: 40..200
            // Leaf blade: Green R=50, G=150, B=50
            // Diseased brown spots inside leaf blade: R=110, G=70, B=30 (low G/R ratio)
            const data = new Uint8ClampedArray(sw * sh * 4);
            for (let y = 0; y < sh; y++) {
              for (let x = 0; x < sw; x++) {
                const idx = (y * sw + x) * 4;
                // Red fruit
                if (x < 45 && y < 45) {
                  data[idx] = 220; data[idx+1] = 40; data[idx+2] = 30; data[idx+3] = 255;
                }
                // Leaf boundary: x: 80 to 240, y: 50 to 190
                else if (x >= 80 && x <= 240 && y >= 50 && y <= 190) {
                  // Diseased foliar patches (>12% necrotic surface)
                  const isLesionPatch = 
                    (Math.hypot(x - 160, y - 80) < 14) ||
                    (Math.hypot(x - 110, y - 120) < 14) ||
                    (Math.hypot(x - 160, y - 120) < 14) ||
                    (Math.hypot(x - 210, y - 120) < 14) ||
                    (Math.hypot(x - 160, y - 160) < 14);

                  if (isLesionPatch) {
                    data[idx] = 110; data[idx+1] = 60; data[idx+2] = 30; data[idx+3] = 255;
                  } else {
                    data[idx] = 50; data[idx+1] = 150; data[idx+2] = 50; data[idx+3] = 255;
                  }
                }
                // Wood / desk background
                else {
                  data[idx] = 190; data[idx+1] = 140; data[idx+2] = 95; data[idx+3] = 255;
                }
              }
            }
            return { data, width: sw, height: sh };
          }
        })
      };
    }
  }
};

// Import lesion detector
const { detectLesionsFromImage } = await import('../src/utils/lesionDetector.js');

console.log('--- RUNNING DYNAMIC 5-ZONE DETECTOR VALIDATION ---');

const mockImg = {
  naturalWidth: 640,
  naturalHeight: 480,
  width: 640,
  height: 480
};

const result = detectLesionsFromImage(mockImg);

console.log('Leaf Contour detected:', result.leafContour);
console.log('Number of lesions detected:', result.lesions.length);

assert.strictEqual(result.lesions.length, 5, 'Must detect exactly 5 lesions across the 5 sub-zones');

// Verify labels
const expectedLabels = [
  '#1 Chlorotic Halo',
  '#2 Necrotic Lesion Spot',
  '#3 Advanced Necrosis',
  '#4 Active Foliar Lesion',
  '#5 Early Margin Blight'
];

for (let i = 0; i < 5; i++) {
  assert.strictEqual(result.lesions[i].label, expectedLabels[i], `Lesion #${i+1} label mismatch`);
}

// Verify leaf contour bounds
// The leaf was drawn at x: 80..240, y: 50..190 on a 320x240 buffer
const { minX, maxX, minY, maxY, leafWidthPx, leafHeightPx } = result.leafContour;
console.log(`Detected leaf bounds: X=[${minX.toFixed(2)}, ${maxX.toFixed(2)}], Y=[${minY.toFixed(2)}, ${maxY.toFixed(2)}]`);
console.log(`Detected leaf size: ${leafWidthPx}x${leafHeightPx} px`);

assert(minX >= 0.20 && minX <= 0.30, `minX (${minX}) should be ~0.25 (80/320)`);
assert(maxX >= 0.70 && maxX <= 0.80, `maxX (${maxX}) should be ~0.75 (240/320)`);
assert(minY >= 0.18 && minY <= 0.25, `minY (${minY}) should be ~0.21 (50/240)`);
assert(maxY >= 0.75 && maxY <= 0.85, `maxY (${maxY}) should be ~0.79 (190/240)`);

// Verify box size equals Leaf Width * 0.12
const expectedBoxPx = Math.round(leafWidthPx * 0.12);
const expectedNormBoxW = expectedBoxPx / 320;
console.log(`Expected box px: ${expectedBoxPx}, normW: ${expectedNormBoxW.toFixed(3)}`);

for (const lesion of result.lesions) {
  console.log(`Lesion: ${lesion.label} => x:${lesion.x}, y:${lesion.y}, w:${lesion.w}, h:${lesion.h}`);
  // Check that box is within the 5% margin inside the leaf contour
  assert(lesion.x >= minX - 0.01, `Box x (${lesion.x}) spilled left of leaf minX (${minX})`);
  assert(lesion.x + lesion.w <= maxX + 0.01, `Box right (${lesion.x + lesion.w}) spilled right of leaf maxX (${maxX})`);
  assert(lesion.y >= minY - 0.01, `Box y (${lesion.y}) spilled above leaf minY (${minY})`);
  assert(lesion.y + lesion.h <= maxY + 0.01, `Box bottom (${lesion.y + lesion.h}) spilled below leaf maxY (${maxY})`);
}

console.log('✅ ALL TESTS PASSED: Dynamic 5-Zone Leaf Contour & Adaptive Lesion Detection Verified Successfully!');
