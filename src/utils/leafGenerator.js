// Generates self-contained, high-fidelity SVG data URLs of realistic crop leaves with pathology markers

export function generateLeafSvg(type) {
  let svgContent = '';

  if (type === 'tomato-early-blight') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <radialGradient id="leafGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="60%" stop-color="#15803d" />
          <stop offset="100%" stop-color="#14532d" />
        </radialGradient>
        <radialGradient id="lesionGrad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#261b11" />
          <stop offset="45%" stop-color="#543310" />
          <stop offset="75%" stop-color="#ca8a04" />
          <stop offset="100%" stop-color="#84cc16" stop-opacity="0.1" />
        </radialGradient>
        <radialGradient id="lesionGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1c1917" />
          <stop offset="50%" stop-color="#713f12" />
          <stop offset="85%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#65a30d" stop-opacity="0" />
        </radialGradient>
        <filter id="leafShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- Background Canvas Pattern -->
      <rect width="500" height="500" fill="#0f172a" />
      <circle cx="250" cy="250" r="230" fill="#064e3b" opacity="0.15" />

      <!-- Stem -->
      <path d="M250 490 Q248 380 250 250 Q252 140 250 50" stroke="#78350f" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#leafShadow)"/>
      <path d="M250 490 Q248 380 250 250 Q252 140 250 50" stroke="#84cc16" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.7"/>

      <!-- Serrated Tomato Leaf Shape -->
      <path d="M250 60 
               C290 85, 360 110, 390 160 
               C410 195, 380 220, 420 250 
               C440 265, 410 295, 390 310 
               C360 330, 340 310, 320 370 
               C300 420, 265 440, 250 460
               C235 440, 200 420, 180 370
               C160 310, 140 330, 110 310
               C90 295, 60 265, 80 250
               C120 220, 90 195, 110 160
               C140 110, 210 85, 250 60 Z"
            fill="url(#leafGrad)" filter="url(#leafShadow)" stroke="#166534" stroke-width="3" />

      <!-- Leaf Veins -->
      <path d="M250 80 Q250 250 250 450" stroke="#bbf7d0" stroke-width="3.5" fill="none" opacity="0.75" />
      <!-- Lateral veins -->
      <path d="M250 150 Q310 135 370 155" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M250 150 Q190 135 130 155" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M250 220 Q320 210 400 240" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M250 220 Q180 210 100 240" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M250 290 Q310 290 375 305" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M250 290 Q190 290 125 305" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M250 360 Q290 360 330 380" stroke="#bbf7d0" stroke-width="1.8" fill="none" opacity="0.5" />
      <path d="M250 360 Q210 360 170 380" stroke="#bbf7d0" stroke-width="1.8" fill="none" opacity="0.5" />

      <!-- Chlorotic yellow patches (Early Blight Halo) -->
      <circle cx="170" cy="200" r="48" fill="#facc15" opacity="0.45" filter="blur(6px)" />
      <circle cx="330" cy="230" r="54" fill="#facc15" opacity="0.4" filter="blur(6px)" />
      <circle cx="270" cy="330" r="40" fill="#facc15" opacity="0.5" filter="blur(5px)" />
      <circle cx="210" cy="290" r="32" fill="#eab308" opacity="0.4" filter="blur(4px)" />

      <!-- Concentric Target Spots (Alternaria Solani hallmarks) -->
      <!-- Lesion 1 -->
      <ellipse cx="170" cy="200" rx="36" ry="32" fill="url(#lesionGrad1)" />
      <circle cx="170" cy="200" r="26" stroke="#451a03" stroke-width="2" fill="none" opacity="0.7" stroke-dasharray="4,2"/>
      <circle cx="170" cy="200" r="18" stroke="#1c1917" stroke-width="2.5" fill="none" opacity="0.85"/>
      <circle cx="170" cy="200" r="8" fill="#0c0a09" />

      <!-- Lesion 2 -->
      <ellipse cx="330" cy="230" rx="42" ry="38" fill="url(#lesionGrad2)" />
      <circle cx="330" cy="230" r="30" stroke="#451a03" stroke-width="2" fill="none" opacity="0.7" stroke-dasharray="5,2"/>
      <circle cx="330" cy="230" r="20" stroke="#1c1917" stroke-width="2.5" fill="none" opacity="0.85"/>
      <circle cx="330" cy="230" r="9" fill="#0c0a09" />

      <!-- Lesion 3 -->
      <ellipse cx="270" cy="330" rx="28" ry="25" fill="url(#lesionGrad1)" />
      <circle cx="270" cy="330" r="17" stroke="#1c1917" stroke-width="2" fill="none" opacity="0.7"/>
      <circle cx="270" cy="330" r="7" fill="#0c0a09" />

      <!-- Small satellite lesions -->
      <circle cx="210" cy="290" r="14" fill="#451a03" opacity="0.9" />
      <circle cx="210" cy="290" r="6" fill="#0c0a09" />
      <circle cx="310" cy="140" r="10" fill="#713f12" opacity="0.8" />
      <circle cx="140" cy="270" r="12" fill="#713f12" opacity="0.85" />
    </svg>`;
  } else if (type === 'potato-late-blight') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <radialGradient id="potatoGrad" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#34d399" />
          <stop offset="55%" stop-color="#059669" />
          <stop offset="100%" stop-color="#064e3b" />
        </radialGradient>
        <linearGradient id="blightWaterSoaked" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1c1917" />
          <stop offset="40%" stop-color="#292524" />
          <stop offset="80%" stop-color="#44403c" />
          <stop offset="100%" stop-color="#a3e635" stop-opacity="0.2" />
        </linearGradient>
        <filter id="leafShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.6"/>
        </filter>
      </defs>

      <rect width="500" height="500" fill="#0f172a" />
      <circle cx="250" cy="250" r="230" fill="#047857" opacity="0.15" />

      <!-- Stem -->
      <path d="M250 490 Q248 370 250 250 Q252 130 250 45" stroke="#78350f" stroke-width="8" stroke-linecap="round" fill="none" filter="url(#leafShadow)"/>

      <!-- Ovate Potato Leaflet -->
      <path d="M250 50 
               C330 70, 420 150, 430 240 
               C440 330, 360 410, 250 460 
               C140 410, 60 330, 70 240 
               C80 150, 170 70, 250 50 Z" 
            fill="url(#potatoGrad)" filter="url(#leafShadow)" stroke="#047857" stroke-width="3"/>

      <!-- Veins -->
      <path d="M250 65 Q250 250 250 445" stroke="#a7f3d0" stroke-width="3" fill="none" opacity="0.7" />
      <path d="M250 140 Q330 140 400 170" stroke="#a7f3d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 140 Q170 140 100 170" stroke="#a7f3d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 220 Q350 220 420 255" stroke="#a7f3d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 220 Q150 220 80 255" stroke="#a7f3d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 300 Q330 300 395 340" stroke="#a7f3d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 300 Q170 300 105 340" stroke="#a7f3d0" stroke-width="2" fill="none" opacity="0.5" />

      <!-- Water-soaked necrotic rot along leaf margins (Phytophthora infestans) -->
      <!-- Large tip & right margin rot -->
      <path d="M250 50 C290 60, 370 100, 400 160 C380 190, 320 180, 290 140 C260 110, 240 80, 250 50 Z" 
            fill="url(#blightWaterSoaked)" opacity="0.95" />
      <path d="M400 160 C425 210, 430 270, 390 320 C360 300, 330 270, 340 230 C350 190, 380 170, 400 160 Z" 
            fill="url(#blightWaterSoaked)" opacity="0.95" />

      <!-- Left margin necrotic patch -->
      <path d="M100 180 C80 230, 75 290, 110 340 C140 330, 170 290, 160 250 C150 210, 120 190, 100 180 Z" 
            fill="url(#blightWaterSoaked)" opacity="0.9" />

      <!-- Center decaying lesion -->
      <ellipse cx="230" cy="260" rx="45" ry="35" fill="url(#blightWaterSoaked)" />
      
      <!-- Pale fungal sporulation border around dead tissue -->
      <path d="M290 140 C320 180, 380 190, 400 160" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75" stroke-dasharray="2,3"/>
      <path d="M340 230 C330 270, 360 300, 390 320" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75" stroke-dasharray="2,3"/>
      <path d="M160 250 C170 290, 140 330, 110 340" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7" stroke-dasharray="2,3"/>
      
      <!-- Dying pale yellow margin -->
      <circle cx="310" cy="200" r="30" fill="#fef08a" opacity="0.3" filter="blur(6px)"/>
      <circle cx="180" cy="270" r="35" fill="#fef08a" opacity="0.3" filter="blur(6px)"/>
    </svg>`;
  } else if (type === 'healthy-corn') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="cornGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="25%" stop-color="#22c55e" />
          <stop offset="70%" stop-color="#16a34a" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
        <filter id="leafShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.6"/>
        </filter>
      </defs>

      <rect width="500" height="500" fill="#0f172a" />
      <circle cx="250" cy="250" r="230" fill="#10b981" opacity="0.15" />

      <!-- Healthy Arching Corn Monocot Blade -->
      <path d="M140 480 
               C170 380, 210 240, 250 140 
               C270 90, 310 50, 380 40 
               C360 80, 330 160, 310 230 
               C280 340, 240 420, 210 480 Z" 
            fill="url(#cornGrad)" filter="url(#leafShadow)" stroke="#15803d" stroke-width="2.5" />

      <!-- Prominent Central Midrib (Corn characteristic) -->
      <path d="M175 480 C205 380, 245 240, 280 140 C295 95, 330 65, 375 42" 
            stroke="#f0fdf4" stroke-width="4.5" fill="none" opacity="0.85" />

      <!-- Crisp Parallel Monocot Venation Lines -->
      <path d="M165 480 C195 380, 235 240, 270 140 C285 100, 315 75, 355 52" stroke="#dcfce7" stroke-width="1.5" fill="none" opacity="0.45" />
      <path d="M155 480 C185 380, 225 240, 260 140 C275 105, 300 85, 335 65" stroke="#dcfce7" stroke-width="1.5" fill="none" opacity="0.45" />
      <path d="M185 480 C215 380, 255 240, 290 140 C305 100, 340 75, 370 55" stroke="#dcfce7" stroke-width="1.5" fill="none" opacity="0.45" />
      <path d="M195 480 C225 380, 265 240, 300 140 C315 105, 345 85, 372 65" stroke="#dcfce7" stroke-width="1.5" fill="none" opacity="0.45" />

      <!-- Waxy Leaf Sheen Highlight -->
      <path d="M210 320 C235 250, 265 170, 295 120" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round" filter="blur(2px)"/>

      <!-- Healthy badge indicator inside artwork -->
      <g transform="translate(360, 380)">
        <circle cx="40" cy="40" r="35" fill="#15803d" stroke="#4ade80" stroke-width="3" />
        <path d="M28 40 L36 48 L52 30" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </svg>`;
  } else if (type === 'apple-cedar-rust') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <radialGradient id="appleGrad" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="60%" stop-color="#16a34a" />
          <stop offset="100%" stop-color="#065f46" />
        </radialGradient>
        <radialGradient id="rustSpot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#9a3412" />
          <stop offset="40%" stop-color="#ea580c" />
          <stop offset="80%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#facc15" />
        </radialGradient>
        <filter id="leafShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.6"/>
        </filter>
      </defs>

      <rect width="500" height="500" fill="#0f172a" />
      <circle cx="250" cy="250" r="230" fill="#ea580c" opacity="0.1" />

      <!-- Stem -->
      <path d="M250 490 Q248 370 250 250 Q252 130 250 50" stroke="#78350f" stroke-width="7" stroke-linecap="round" fill="none" filter="url(#leafShadow)"/>

      <!-- Apple Leaf Shape -->
      <path d="M250 55 
               C340 90, 410 180, 400 280 
               C390 370, 330 430, 250 460 
               C170 430, 110 370, 100 280 
               C90 180, 160 90, 250 55 Z" 
            fill="url(#appleGrad)" filter="url(#leafShadow)" stroke="#065f46" stroke-width="3"/>

      <!-- Veins -->
      <path d="M250 70 Q250 250 250 445" stroke="#bbf7d0" stroke-width="3" fill="none" opacity="0.75" />
      <path d="M250 150 Q320 150 380 180" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 150 Q180 150 120 180" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 240 Q330 240 390 280" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 240 Q170 240 110 280" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 330 Q310 330 360 370" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.5" />
      <path d="M250 330 Q190 330 140 370" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.5" />

      <!-- Bright Orange Rust Pustules (Cedar Apple Rust) -->
      <circle cx="180" cy="180" r="26" fill="url(#rustSpot)" />
      <circle cx="180" cy="180" r="14" fill="#7c2d12" />
      <circle cx="180" cy="180" r="5" fill="#431407" />

      <circle cx="320" cy="220" r="32" fill="url(#rustSpot)" />
      <circle cx="320" cy="220" r="18" fill="#7c2d12" />
      <circle cx="320" cy="220" r="7" fill="#431407" />

      <circle cx="210" cy="300" r="24" fill="url(#rustSpot)" />
      <circle cx="210" cy="300" r="12" fill="#7c2d12" />

      <circle cx="290" cy="340" r="20" fill="url(#rustSpot)" />
      <circle cx="290" cy="340" r="10" fill="#7c2d12" />

      <circle cx="310" cy="140" r="16" fill="url(#rustSpot)" />
      <circle cx="150" cy="260" r="18" fill="url(#rustSpot)" />
    </svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}
