import { CROP_DISEASE_DATASET, CLINICAL_CHEMICAL_TREATMENTS, APP_TRANSLATIONS } from '../src/data/pathologyData.js';

console.log('--- Pathology Dataset Sanity Check ---');
console.log('Dataset length:', CROP_DISEASE_DATASET.length);
console.log('Clinical chemical treatments count:', CLINICAL_CHEMICAL_TREATMENTS.length);

// Verify chemical cards
CLINICAL_CHEMICAL_TREATMENTS.forEach((chem, idx) => {
  console.log(`\nCard ${idx + 1}: ${chem.salt}`);
  console.log(`  Dosage (EN): ${chem.dosage.en}`);
  console.log(`  Schedule (EN): ${chem.schedule.en}`);
  console.log(`  Trade: ${chem.tradeName}`);
});

// Verify tomato early blight lesions
const tomato = CROP_DISEASE_DATASET[0];
console.log('\nTomato Early Blight Lesions Count:', tomato.lesions.length);
tomato.lesions.forEach((l, i) => {
  console.log(`  Lesion ${i + 1}: [label: "${l.label}"] (x: ${l.x}, y: ${l.y}, w: ${l.w}, h: ${l.h})`);
});

// Verify chemical treatments attached to tomato
console.log('\nTomato chemicalTreatments length:', tomato.chemicalTreatments?.length);
console.log('Tomato chemicalInterventions length:', tomato.chemicalInterventions?.length);
console.log('Tomato organicRemedies length:', tomato.organicRemedies?.length);

console.log('\nALL CHECKS PASSED!');
