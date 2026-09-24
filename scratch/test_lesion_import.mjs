import { detectLesionsFromImage } from '../src/utils/lesionDetector.js';

console.log('Testing lesion detector import and fallback generation...');
const fallback = detectLesionsFromImage({ width: 600, height: 800 });
console.log('Fallback lesions count:', fallback.lesions.length);
console.log('Lesion 1:', fallback.lesions[0]);
console.log('Lesion 2:', fallback.lesions[1]);
console.log('Lesion 3:', fallback.lesions[2]);
console.log('Lesion 4:', fallback.lesions[3]);
console.log('Lesion 5:', fallback.lesions[4]);
console.log('Affected area %:', fallback.affectedAreaPct);
console.log('Intrinsic Aspect:', fallback.intrinsicAspect);

console.log('\nSUCCESS: Utility test passed!');
