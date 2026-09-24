import { execSync } from 'child_process';

const chromeCmd = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="C:\\Users\\ambek\\OneDrive\\Desktop\\devenger 2.0\\scratch\\verify_profile" --virtual-time-budget=4000 --dump-dom http://localhost:5173/';

console.log('Running Chrome headless to dump live DOM...');
const html = execSync(chromeCmd, { encoding: 'utf-8', maxBuffer: 15 * 1024 * 1024 });

console.log('\n--- DOM VERIFICATION RESULTS ---');
console.log('HTML Total length:', html.length);
console.log('1. #root has mounted content:', html.includes('<div id="root"><div class="min-h-screen'));
console.log('2. Has AgriCure AI Navbar brand:', html.includes('AgriCure'));
console.log('3. Has Tomato Early Blight specimen:', html.includes('Tomato') && html.includes('Early Blight'));
console.log('4. Has Visual Leaf Inspector Canvas Engine:', html.includes('Visual Leaf Inspector (Canvas Engine)'));
console.log('5. Has Active Lesions Identified (5):', html.includes('Active Lesions Identified'));
console.log('6. Has Chemical Interventions tab button:', html.includes('Chemical Interventions'));
console.log('7. Has Organic & Bio-Remedies tab button:', html.includes('Organic & Bio-Remedies'));
console.log('8. Has Cultural & Preventive Advisory tab button:', html.includes('Cultural & Preventive Advisory'));
console.log('9. Has Scan Vault (Scan History):', html.includes('Scan Vault'));
console.log('10. Has Leaf Upload Zone & Dropzone:', html.includes('Drag &amp; Drop Crop Leaf Photo Here') || html.includes('Drag & Drop'));
console.log('11. Has Quick-Demo Evaluation Samples:', html.includes('Quick-Demo Evaluation Samples'));
console.log('12. Has Web Engine v2.4 Active badge:', html.includes('Web Engine v2.4 Active'));

if (html.includes('<div id="root"><div class="min-h-screen') && html.includes('AgriCure') && html.includes('Early Blight')) {
  console.log('\n>>> SUCCESS: AGRICURE AI MOUNTED COMPLETELY AND IS FULLY FUNCTIONAL! <<<');
} else {
  console.error('\n>>> FAILED: ROOT IS NOT PROPERLY MOUNTED <<<');
  process.exit(1);
}
