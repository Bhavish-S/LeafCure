// Scratch test for dynamic lesion heuristic
function testHeuristic() {
  console.log('Testing lesion heuristic simulation logic...');
  
  // Create a synthetic 400x600 portrait leaf image with 3 distinct brown/yellow spots
  // Spot 1 at (150, 200) - Necrotic spot
  // Spot 2 at (280, 350) - Chlorotic halo
  // Spot 3 at (180, 480) - Margin blight
  
  const width = 400;
  const height = 600;
  
  // Grid 20x20
  const cols = 20;
  const rows = 20;
  const cellW = width / cols;
  const cellH = height / rows;
  
  console.log(`Dimensions: ${width}x${height}, Aspect Ratio: ${(height/width).toFixed(2)}`);
  console.log('Cell size:', cellW, cellH);
}

testHeuristic();
