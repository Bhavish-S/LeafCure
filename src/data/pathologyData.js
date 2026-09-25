import { generateLeafSvg } from '../utils/leafGenerator.js';

export const CLINICAL_CHEMICAL_TREATMENTS = [
  {
    salt: 'Mancozeb 75% WP (Contact Fungicide)',
    tradeName: 'Dithane M-45 / Indofil M-45',
    category: {
      en: 'Contact Fungicide',
      hi: 'संपर्क कवकनाशी',
    kn: '[KN] Contact Fungicide'
    },
    dosage: {
      en: '2.5g per 1 Litre of water',
      hi: '2.5 ग्राम प्रति 1 लीटर पानी',
    kn: '[KN] 2.5g per 1 Litre of water'
    },
    schedule: {
      en: 'Spray every 10-14 days at early symptom onset.',
      hi: 'शुरुआती लक्षण दिखने पर हर 10-14 दिन में छिड़काव करें।',
    kn: '[KN] Spray every 10-14 days at early symptom onset.'
    },
    safetyWaitingPeriod: {
      en: '7-10 days before harvest',
      hi: 'कटाई से 7-10 दिन पहले',
    kn: '[KN] 7-10 days before harvest'
    },
    timing: {
      en: 'Broad-spectrum multisite protectant; coats foliar surface to prevent fungal spore germination.',
      hi: 'व्यापक सुरक्षात्मक कवकनाशी; बीजाणु अंकुरण को रोकने हेतु पत्ती पर सुरक्षात्मक परत बनाता है।',
    kn: '[KN] Broad-spectrum multisite protectant; coats foliar surface to prevent fungal spore germination.'
    },
    mechanism: {
      en: 'Inactivates fungal sulfhydryl groups and disrupts lipid respiration.',
      hi: 'कवक एंजाइमों को निष्क्रिय करता है और बीजाणु अंकुरण रोकता है।',
    kn: '[KN] Inactivates fungal sulfhydryl groups and disrupts lipid respiration.'
    }
  },
  {
    salt: 'Copper Oxychloride 50% WP',
    tradeName: 'Blitox 50 / Blue Copper',
    category: {
      en: 'Protective Barrier',
      hi: 'सुरक्षात्मक कॉपर कवकनाशी',
    kn: '[KN] Protective Barrier'
    },
    dosage: {
      en: '3g per 1 Litre of water',
      hi: '3 ग्राम प्रति 1 लीटर पानी',
    kn: '[KN] 3g per 1 Litre of water'
    },
    schedule: {
      en: 'Apply after rainfall or high humidity spikes.',
      hi: 'बारिश के बाद या उच्च आर्द्रता होने पर छिड़काव करें।',
    kn: '[KN] Apply after rainfall or high humidity spikes.'
    },
    safetyWaitingPeriod: {
      en: '7 days before harvest',
      hi: 'कटाई से 7 दिन पहले',
    kn: '[KN] 7 days before harvest'
    },
    timing: {
      en: 'Immediate preventive & protective foliar spray; adheres firmly to prevent secondary spore spread.',
      hi: 'तत्काल निवारक संपर्क स्प्रे; द्वितीयक बीजाणु संक्रमण को रोकता है।',
    kn: '[KN] Immediate preventive & protective foliar spray; adheres firmly to prevent secondary spore spread.'
    },
    mechanism: {
      en: 'Releases copper ions (Cu2+) that denature fungal proteins and halt zoospore motility.',
      hi: 'कॉपर आयन स्रावित कर कवक प्रोटीन को नष्ट करता है।',
    kn: '[KN] Releases copper ions (Cu2+) that denature fungal proteins and halt zoospore motility.'
    }
  },
  {
    salt: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    tradeName: 'Amistar Top / Mirador Xtra',
    category: {
      en: 'Systemic Curative',
      hi: 'प्रणालीगत उपचारात्मक',
    kn: '[KN] Systemic Curative'
    },
    dosage: {
      en: '1ml per 1 Litre of water',
      hi: '1 मिली प्रति 1 लीटर पानी',
    kn: '[KN] 1ml per 1 Litre of water'
    },
    schedule: {
      en: 'Curative systemic application for active lesions.',
      hi: 'सक्रिय घावों के त्वरित नियंत्रण हेतु उपचारात्मक छिड़काव।',
    kn: '[KN] Curative systemic application for active lesions.'
    },
    safetyWaitingPeriod: {
      en: '5 days before harvest',
      hi: 'कटाई से 5 दिन पहले',
    kn: '[KN] 5 days before harvest'
    },
    timing: {
      en: 'Fast translaminar curative action; halts active fungal mycelial growth within plant tissue.',
      hi: 'तीव्र प्रणालीगत उपचारात्मक प्रभाव; पौधे के ऊतकों के भीतर कवक वृद्धि रोकता है।',
    kn: '[KN] Fast translaminar curative action; halts active fungal mycelial growth within plant tissue.'
    },
    mechanism: {
      en: 'Dual-action: Strobilurin halts ATP energy production; Triazole inhibits ergosterol cell-wall synthesis.',
      hi: 'दोहरी कार्रवाई: माइटोकॉन्ड्रियल ऊर्जा उत्पादन और कोशिका भित्ति संश्लेषण रोकता है।',
    kn: '[KN] Dual-action: Strobilurin halts ATP energy production; Triazole inhibits ergosterol cell-wall synthesis.'
    }
  }
];

export const HEALTHY_MAINTENANCE_TREATMENTS = [
  {
    salt: 'Zinc Sulphate (ZnSO4 21%) / Chelated Zinc EDTA 12%',
    tradeName: 'AgroMin Zinc / Solubor',
    category: {
      en: 'Micronutrient Maintenance',
      hi: 'सूक्ष्म पोषक तत्व प्रबंधन',
    kn: '[KN] Micronutrient Maintenance'
    },
    dosage: {
      en: '1.0g to 1.5g per 1 Litre of water (200g / acre)',
      hi: '1.0 से 1.5 ग्राम प्रति 1 लीटर पानी (200 ग्राम / एकड़)',
    kn: '[KN] 1.0g to 1.5g per 1 Litre of water (200g / acre)'
    },
    schedule: {
      en: 'Apply as foliar spray every 30-40 days during active vegetative growth.',
      hi: 'वानस्पतिक वृद्धि के दौरान हर 30-40 दिनों में पर्ण स्प्रे करें।',
    kn: '[KN] Apply as foliar spray every 30-40 days during active vegetative growth.'
    },
    safetyWaitingPeriod: {
      en: 'Zero (Nutrient supplement)',
      hi: 'शून्य (पोषक पूरक)',
    kn: '[KN] Zero (Nutrient supplement)'
    },
    timing: {
      en: 'Promotes chlorophyll synthesis, enzyme activation, and robust leaf lamina expansion.',
      hi: 'क्लोरोफिल संश्लेषण, एंजाइम सक्रियण और पत्ती के विकास को बढ़ावा देता है।',
    kn: '[KN] Promotes chlorophyll synthesis, enzyme activation, and robust leaf lamina expansion.'
    },
    mechanism: {
      en: 'Essential cofactor for carbonic anhydrase and auxin hormone biosynthesis.',
      hi: 'कार्बनिक एनहाइड्रेज और ऑक्सिन हार्मोन बायोसिंथेसिस हेतु आवश्यक।',
    kn: '[KN] Essential cofactor for carbonic anhydrase and auxin hormone biosynthesis.'
    }
  },
  {
    salt: 'Water Soluble NPK 19:19:19 (Balanced Foliar Booster)',
    tradeName: 'Ferticare 19:19:19 / Polyfeed',
    category: {
      en: 'Foliar Nutrition Booster',
      hi: 'पर्ण पोषण टॉनिक',
    kn: '[KN] Foliar Nutrition Booster'
    },
    dosage: {
      en: '4g to 5g per 1 Litre of water (1kg in 200L water / acre)',
      hi: '4 से 5 ग्राम प्रति 1 लीटर पानी (1 किग्रा प्रति एकड़)',
    kn: '[KN] 4g to 5g per 1 Litre of water (1kg in 200L water / acre)'
    },
    schedule: {
      en: 'Apply once every 21-30 days to sustain photosynthetic vigor.',
      hi: 'प्रकाश संश्लेषण शक्ति बनाए रखने हेतु हर 21-30 दिन में एक बार स्प्रे करें।',
    kn: '[KN] Apply once every 21-30 days to sustain photosynthetic vigor.'
    },
    safetyWaitingPeriod: {
      en: 'Zero (Foliar fertilizer)',
      hi: 'शून्य (पर्ण उर्वरक)',
    kn: '[KN] Zero (Foliar fertilizer)'
    },
    timing: {
      en: 'Uniform delivery of Nitrogen, Phosphorus, and Potassium for cellular turgor.',
      hi: 'कोशिकीय मजबूती और विकास हेतु संतुलित नाइट्रोजन, फास्फोरस और पोटाश।',
    kn: '[KN] Uniform delivery of Nitrogen, Phosphorus, and Potassium for cellular turgor.'
    },
    mechanism: {
      en: 'Rapid stomatal absorption fuels ATP generation and amino acid assembly.',
      hi: 'रंध्रों द्वारा त्वरित अवशोषण एटीपी ऊर्जा और अमीनो एसिड निर्माण को बढ़ावा देता है।',
    kn: '[KN] Rapid stomatal absorption fuels ATP generation and amino acid assembly.'
    }
  },
  {
    salt: 'Magnesium Sulphate (Epsom Salt - 9.6% Mg, 12% S)',
    tradeName: 'AgroMag / MicroEpsom',
    category: {
      en: 'Chlorophyll Density Care',
      hi: 'क्लोरोफिल घनत्व संवर्धन',
    kn: '[KN] Chlorophyll Density Care'
    },
    dosage: {
      en: '5g per 1 Litre of water',
      hi: '5 ग्राम प्रति 1 लीटर पानी',
    kn: '[KN] 5g per 1 Litre of water'
    },
    schedule: {
      en: 'Single preventive application during peak vegetative leaf flush.',
      hi: 'पत्तियों के चरम विकास काल में एक बार निवारक स्प्रे।',
    kn: '[KN] Single preventive application during peak vegetative leaf flush.'
    },
    safetyWaitingPeriod: {
      en: 'Zero (Natural mineral salt)',
      hi: 'शून्य (प्राकृतिक खनिज लवण)',
    kn: '[KN] Zero (Natural mineral salt)'
    },
    timing: {
      en: 'Central metallic atom of chlorophyll molecule; prevents hidden interveinal chlorosis.',
      hi: 'क्लोरोफिल अणु का मुख्य घटक; पत्तियों को गहरा हरा और चमकदार बनाए रखता है।',
    kn: '[KN] Central metallic atom of chlorophyll molecule; prevents hidden interveinal chlorosis.'
    },
    mechanism: {
      en: 'Directly reinforces light-harvesting complex in leaf thylakoid membranes.',
      hi: 'थायलाकोइड झिल्ली में प्रकाश संश्लेषण तंत्र को मजबूत करता है।',
    kn: '[KN] Directly reinforces light-harvesting complex in leaf thylakoid membranes.'
    }
  }
];

export const CROP_DISEASE_DATASET = [
  {
    id: 'tomato-early-blight',
    cropKey: 'tomato',
    cropName: {
      en: 'Tomato',
      hi: 'टमाटर',
    kn: '[KN] Tomato'
    },
    diseaseKey: 'early-blight',
    diseaseName: {
      en: 'Early Blight',
      hi: 'अगेती झुलसा (Early Blight)',
    kn: '[KN] Early Blight'
    },
    scientificName: 'Alternaria solani',
    pathogenType: {
      en: 'Fungal Ascomycete Pathogen',
      hi: 'कवक (फंगल) रोगज़नक़',
    kn: '[KN] Fungal Ascomycete Pathogen'
    },
    severity: 'moderate', // 'mild' | 'moderate' | 'severe' | 'none'
    confidence: 94.8,
    affectedAreaPct: 22.4,
    prognosis: {
      en: 'High recovery rate (85-90%) if treated within 3-5 days. Foliar spray halts spore spread.',
      hi: 'यदि 3-5 दिनों के भीतर उपचार किया जाए तो उच्च सुधार दर (85-90%)। पर्ण स्प्रे बीजाणुओं के प्रसार को रोकता है।',
    kn: '[KN] High recovery rate (85-90%) if treated within 3-5 days. Foliar spray halts spore spread.'
    },
    symptoms: {
      en: [
        'Dark brown to black necrotic spots with characteristic concentric rings ("target board" pattern).',
        'Chlorotic yellow halos surrounding older lesions on lower leaves.',
        'Premature defoliation exposing developing tomatoes to sunscald.'
      ],
      hi: [
        'विशिष्ट संकेंद्रित छल्लों ("टारगेट बोर्ड" पैटर्न) के साथ गहरे भूरे से काले नेक्रोटिक धब्बे।',
        'निचली पत्तियों पर पुराने घावों के चारों ओर क्लोरोटिक पीले छल्ले।',
        'पत्तियों का समय से पहले गिरना जिससे फल धूप में झुलस जाते हैं।'
      ],
    kn: [
        '[KN] Dark brown to black necrotic spots with characteristic concentric rings ("[KN] target board"[KN]  pattern).'[KN] ,
        '[KN] Chlorotic yellow halos surrounding older lesions on lower leaves.'[KN] ,
        '[KN] Premature defoliation exposing developing tomatoes to sunscald.'[KN] 
      ]
    },
    organicRemedies: [
      {
        title: {
          en: 'Neem Seed Kernel Extract (NSKE 5%)',
          hi: 'नीम के बीज की गिरी का अर्क (NSKE 5%)',
    kn: '[KN] Neem Seed Kernel Extract (NSKE 5%)'
        },
        dosage: {
          en: '50ml per 1 Litre of water + 1ml natural liquid soap',
          hi: '50 मिली प्रति 1 लीटर पानी + 1 मिली प्राकृतिक साबुन',
    kn: '[KN] 50ml per 1 Litre of water + 1ml natural liquid soap'
        },
        schedule: {
          en: 'Spray early morning every 7 days; 3 applications recommended.',
          hi: 'हर 7 दिन में सुबह जल्दी छिड़काव करें; 3 छिड़काव आवश्यक।',
    kn: '[KN] Spray early morning every 7 days; 3 applications recommended.'
        },
        mechanism: {
          en: 'Azadirachtin disrupts fungal spore germination and strengthens plant epidermis.',
          hi: 'एज़ाडिरेक्टिन कवक बीजाणु के अंकुरण को रोकता है और पौधे की त्वचा को मजबूत करता है।',
    kn: '[KN] Azadirachtin disrupts fungal spore germination and strengthens plant epidermis.'
        }
      },
      {
        title: {
          en: 'Trichoderma viride / harzianum Bio-fungicide',
          hi: 'ट्राइकोडर्मा विरिडे / हरज़ियानम जैव-कवकनाशी',
    kn: '[KN] Trichoderma viride / harzianum Bio-fungicide'
        },
        dosage: {
          en: '5g to 10g per 1 Litre of water (Foliar + Soil drench)',
          hi: '5 ग्राम से 10 ग्राम प्रति 1 लीटर पानी (छिड़काव + जड़ में सिंचाई)',
    kn: '[KN] 5g to 10g per 1 Litre of water (Foliar + Soil drench)'
        },
        schedule: {
          en: 'Apply after first rain or dew; repeat after 10 days.',
          hi: 'पहली बारिश या ओस के बाद लागू करें; 10 दिनों के बाद दोहराएं।',
    kn: '[KN] Apply after first rain or dew; repeat after 10 days.'
        },
        mechanism: {
          en: 'Beneficial fungi outcompete Alternaria solani mycelium and produce chitinase enzymes.',
          hi: 'लाभकारी कवक रोगजनक कवक से प्रतिस्पर्धा करते हैं और काइटिनेज एंजाइम स्रावित करते हैं।',
    kn: '[KN] Beneficial fungi outcompete Alternaria solani mycelium and produce chitinase enzymes.'
        }
      },
      {
        title: {
          en: 'Baking Soda (Sodium Bicarbonate) + Horticultural Oil',
          hi: 'बेकिंग सोडा (सोडियम बाइकार्बोनेट) + बागवानी तेल',
    kn: '[KN] Baking Soda (Sodium Bicarbonate) + Horticultural Oil'
        },
        dosage: {
          en: '5g baking soda + 5ml neem oil per 1L water',
          hi: '5 ग्राम बेकिंग सोडा + 5 मिली नीम तेल प्रति 1 लीटर पानी',
    kn: '[KN] 5g baking soda + 5ml neem oil per 1L water'
        },
        schedule: {
          en: 'Use as preventive spray at first sign of lower leaf spotting.',
          hi: 'निचली पत्तियों पर धब्बे दिखने के तुरंत बाद निवारक स्प्रे के रूप में उपयोग करें।',
    kn: '[KN] Use as preventive spray at first sign of lower leaf spotting.'
        },
        mechanism: {
          en: 'Alters surface leaf pH to alkaline (>8.2), making spore elongation impossible.',
          hi: 'पत्ती के सतह पीएच को क्षारीय बनाता है जिससे बीजाणुओं का अंकुरण रुक जाता है।',
    kn: '[KN] Alters surface leaf pH to alkaline (>8.2), making spore elongation impossible.'
        }
      }
    ],
    chemicalTreatments: CLINICAL_CHEMICAL_TREATMENTS,
    chemicalInterventions: CLINICAL_CHEMICAL_TREATMENTS,
    preventiveAdvisory: [
      {
        category: {
          en: 'Irrigation & Moisture',
          hi: 'सिंचाई एवं नमी प्रबंधन',
    kn: '[KN] Irrigation & Moisture'
        },
        action: {
          en: 'Switch strictly to drip irrigation. Avoid overhead sprinklers that wet foliage for >2 hours.',
          hi: 'ड्रिप सिंचाई प्रणाली अपनाएं। फव्वारा सिंचाई से बचें जिससे पत्तियां 2 घंटे से अधिक गीली न रहें।',
    kn: '[KN] Switch strictly to drip irrigation. Avoid overhead sprinklers that wet foliage for >2 hours.'
        }
      },
      {
        category: {
          en: 'Pruning & Air Circulation',
          hi: 'छंटाई एवं वायु संचलन',
    kn: '[KN] Pruning & Air Circulation'
        },
        action: {
          en: 'Prune the lowest 30cm of tomato foliage touching soil to eliminate soil splashback inoculants.',
          hi: 'मिट्टी को छूने वाली निचली 30 सेमी पत्तियों की छंटाई करें ताकि मिट्टी से बीजाणु पत्तियों पर न आएं।',
    kn: '[KN] Prune the lowest 30cm of tomato foliage touching soil to eliminate soil splashback inoculants.'
        }
      },
      {
        category: {
          en: 'Crop Rotation & Mulching',
          hi: 'फसल चक्र एवं मल्चिंग',
    kn: '[KN] Crop Rotation & Mulching'
        },
        action: {
          en: 'Apply 3-inch organic straw mulch around plant base. Rotate with non-solanaceous crops (maize/beans) for 2 years.',
          hi: 'पौधों के आधार पर 3 इंच की पुआल मल्चिंग करें। 2 वर्षों तक मक्का या फलियों के साथ फसल चक्र अपनाएं।',
    kn: '[KN] Apply 3-inch organic straw mulch around plant base. Rotate with non-solanaceous crops (maize/beans) for 2 years.'
        }
      }
    ],
    sampleImage: generateLeafSvg('tomato-early-blight'),
    // Normalized bounding boxes: [x, y, width, height, label]
    lesions: [
      { x: 0.26, y: 0.28, w: 0.18, h: 0.16, label: '#1 Chlorotic Halo', type: 'chlorotic', color: '#eab308' },
      { x: 0.56, y: 0.36, w: 0.20, h: 0.18, label: '#2 Necrotic Lesion Spot', type: 'necrotic', color: '#ef4444' },
      { x: 0.44, y: 0.58, w: 0.15, h: 0.13, label: '#3 Advanced Necrosis', type: 'necrotic', color: '#dc2626' },
      { x: 0.32, y: 0.50, w: 0.12, h: 0.10, label: '#4 Active Foliar Lesion', type: 'active', color: '#f59e0b' },
      { x: 0.62, y: 0.22, w: 0.16, h: 0.14, label: '#5 Early Margin Blight', type: 'margin', color: '#ea580c' }
    ]
  },
  {
    id: 'potato-late-blight',
    cropKey: 'potato',
    cropName: {
      en: 'Potato',
      hi: 'आलू',
    kn: '[KN] Potato'
    },
    diseaseKey: 'late-blight',
    diseaseName: {
      en: 'Late Blight',
      hi: 'पछेती झुलसा (Late Blight)',
    kn: '[KN] Late Blight'
    },
    scientificName: 'Phytophthora infestans',
    pathogenType: {
      en: 'Oomycete Water Mold Pathogen',
      hi: 'ओमीसीट जल-फफूंद रोगज़नक़',
    kn: '[KN] Oomycete Water Mold Pathogen'
    },
    severity: 'severe',
    confidence: 96.4,
    affectedAreaPct: 41.8,
    prognosis: {
      en: 'Aggressive pathogen. Requires intervention within 24-48 hours to avert complete crop collapse.',
      hi: 'अत्यधिक आक्रामक रोगज़नक़। पूरी फसल को नष्ट होने से बचाने हेतु 24-48 घंटों में उपचार आवश्यक।',
    kn: '[KN] Aggressive pathogen. Requires intervention within 24-48 hours to avert complete crop collapse.'
    },
    symptoms: {
      en: [
        'Water-soaked irregular black/dark green lesions rapidly enlarging from leaf tips and margins.',
        'Delicate white fluffy fungal mildew growth visible on leaf undersides under humid/foggy conditions.',
        'Foul odor emitted as foliage rots; tubers rot underground into brownish-purple dry decay.'
      ],
      hi: [
        'पत्ती के किनारों और सिरों से तेजी से फैलने वाले पानी से भीगे हुए अनियमित काले/गहरे हरे धब्बे।',
        'आर्द्र/कोहरे के मौसम में पत्तियों के निचले हिस्से पर सफेद रोएंदार फफूंद का विकास।',
        'पत्तियां सड़ने पर दुर्गंध आती है; कंद जमीन के अंदर भूरे-बैंगनी रंग में सड़ने लगते हैं।'
      ],
    kn: [
        '[KN] Water-soaked irregular black/dark green lesions rapidly enlarging from leaf tips and margins.'[KN] ,
        '[KN] Delicate white fluffy fungal mildew growth visible on leaf undersides under humid/foggy conditions.'[KN] ,
        '[KN] Foul odor emitted as foliage rots; tubers rot underground into brownish-purple dry decay.'[KN] 
      ]
    },
    organicRemedies: [
      {
        title: {
          en: 'Fermented Cow Dung & Urine Slurry (Jeevamrutha)',
          hi: 'जीवामृत / किण्वित गाय का गोबर और गोमूत्र',
    kn: '[KN] Fermented Cow Dung & Urine Slurry (Jeevamrutha)'
        },
        dosage: {
          en: '10% solution (100ml per 1L water), thoroughly filtered',
          hi: '10% घोल (100 मिली प्रति 1 लीटर पानी), अच्छी तरह छाना हुआ',
    kn: '[KN] 10% solution (100ml per 1L water), thoroughly filtered'
        },
        schedule: {
          en: 'Spray every 5 days during cloudy/misty weather.',
          hi: 'बादल या कोहरे वाले मौसम में हर 5 दिन में छिड़काव करें।',
    kn: '[KN] Spray every 5 days during cloudy/misty weather.'
        },
        mechanism: {
          en: 'Antimicrobial peptides and friendly aerobic bacteria suppress oomycete zoospore motility.',
          hi: 'रोगाणुरोधी पेप्टाइड्स और मित्र जीवाणु जल-फफूंद के बीजाणुओं की गतिशीलता को रोकते हैं।',
    kn: '[KN] Antimicrobial peptides and friendly aerobic bacteria suppress oomycete zoospore motility.'
        }
      },
      {
        title: {
          en: 'Bordeaux Mixture (1:1:100 Formulation)',
          hi: 'बोर्डो मिश्रण (1% घोल)',
    kn: '[KN] Bordeaux Mixture (1:1:100 Formulation)'
        },
        dosage: {
          en: '1kg Copper Sulphate + 1kg Quicklime in 100L water',
          hi: '1 किग्रा कॉपर सल्फेट + 1 किग्रा बुझा चूना 100 लीटर पानी में',
    kn: '[KN] 1kg Copper Sulphate + 1kg Quicklime in 100L water'
        },
        schedule: {
          en: 'Freshly prepared spray applied over both leaf surfaces.',
          hi: 'ताजा तैयार कर पत्तियों के दोनों किनारों पर अच्छी तरह छिड़काव करें।',
    kn: '[KN] Freshly prepared spray applied over both leaf surfaces.'
        },
        mechanism: {
          en: 'Insoluble copper precipitate forms a sterile barrier against Phytophthora spores.',
          hi: 'अघुलनशील कॉपर बीजाणुओं के अंकुरण के खिलाफ एक मजबूत सुरक्षात्मक परत बनाता है।',
    kn: '[KN] Insoluble copper precipitate forms a sterile barrier against Phytophthora spores.'
        }
      },
      {
        title: {
          en: 'Garlic & Onion Bulb Extract (Bio-allium spray)',
          hi: 'लहसुन और प्याज का अर्क (बायो-एलियम स्प्रे)',
    kn: '[KN] Garlic & Onion Bulb Extract (Bio-allium spray)'
        },
        dosage: {
          en: '50g crushed garlic + 50g onion boiled in 1L water, diluted 1:5',
          hi: '50 ग्राम कुचला लहसुन + 50 ग्राम प्याज 1 लीटर पानी में उबालें, 1:5 में घोलें',
    kn: '[KN] 50g crushed garlic + 50g onion boiled in 1L water, diluted 1:5'
        },
        schedule: {
          en: 'Spray at sunset when relative humidity exceeds 85%.',
          hi: 'शाम को छिड़काव करें जब हवा में आर्द्रता 85% से अधिक हो।',
    kn: '[KN] Spray at sunset when relative humidity exceeds 85%.'
        },
        mechanism: {
          en: 'Allicin organosulfur compounds rupture fungal cellular membranes.',
          hi: 'एलिसिन यौगिक कवक की कोशिकीय झिल्ली को नष्ट करते हैं।',
    kn: '[KN] Allicin organosulfur compounds rupture fungal cellular membranes.'
        }
      }
    ],
    chemicalInterventions: [
      {
        salt: 'Metalaxyl-M 4% + Mancozeb 64% WP',
        tradeName: 'Ridomil Gold MZ',
        dosage: {
          en: '2.5g per Litre of water (500g in 200L water per acre)',
          hi: '2.5 ग्राम प्रति लीटर पानी (500 ग्राम / 200 लीटर पानी प्रति एकड़)',
    kn: '[KN] 2.5g per Litre of water (500g in 200L water per acre)'
        },
        safetyWaitingPeriod: {
          en: '14 days before tuber digging',
          hi: 'आलू खुदाई से 14 दिन पहले',
    kn: '[KN] 14 days before tuber digging'
        },
        timing: {
          en: 'Potent systemic + protective combo; apply at very first forecast of continuous overcast/drizzle.',
          hi: 'शक्तिशाली प्रणालीगत एवं सुरक्षात्मक कवकनाशी; बादल छाए रहने या बूंदाबांदी की पहली चेतावनी पर लागू करें।',
    kn: '[KN] Potent systemic + protective combo; apply at very first forecast of continuous overcast/drizzle.'
        }
      },
      {
        salt: 'Cymoxanil 8% + Mancozeb 64% WP',
        tradeName: 'Curzate M8',
        dosage: {
          en: '3.0g per Litre of water (600g per acre)',
          hi: '3.0 ग्राम प्रति लीटर पानी (600 ग्राम प्रति एकड़)',
    kn: '[KN] 3.0g per Litre of water (600g per acre)'
        },
        safetyWaitingPeriod: {
          en: '10 days before harvest',
          hi: 'कटाई से 10 दिन पहले',
    kn: '[KN] 10 days before harvest'
        },
        timing: {
          en: 'Kick-back curative action within 48 hours of infection event.',
          hi: 'संक्रमण के 48 घंटों के भीतर उपचारात्मक कार्रवाई करता है।',
    kn: '[KN] Kick-back curative action within 48 hours of infection event.'
        }
      },
      {
        salt: 'Dimethomorph 50% WP',
        tradeName: 'Acrobat',
        dosage: {
          en: '1.0g to 1.5g per Litre of water',
          hi: '1.0 ग्राम से 1.5 ग्राम प्रति लीटर पानी',
    kn: '[KN] 1.0g to 1.5g per Litre of water'
        },
        safetyWaitingPeriod: {
          en: '7 days before harvest',
          hi: 'कटाई से 7 दिन पहले',
    kn: '[KN] 7 days before harvest'
        },
        timing: {
          en: 'Inhibits oomycete cell wall synthesis. Alternate with Metalaxyl to prevent fungicide resistance.',
          hi: 'ओमीसीट कोशिका भित्ति संश्लेषण को रोकता है। प्रतिरोध से बचने के लिए बदल-बदल कर उपयोग करें।',
    kn: '[KN] Inhibits oomycete cell wall synthesis. Alternate with Metalaxyl to prevent fungicide resistance.'
        }
      }
    ],
    preventiveAdvisory: [
      {
        category: {
          en: 'De-haulming & Harvest Care',
          hi: 'बेल काटना (De-haulming) एवं कटाई',
    kn: '[KN] De-haulming & Harvest Care'
        },
        action: {
          en: 'Cut and burn potato haulms 10-14 days before harvest to prevent spores washing down to tubers.',
          hi: 'खुदाई से 10-14 दिन पहले बेल काट दें ताकि बीजाणु कंदों तक न पहुंचें।',
    kn: '[KN] Cut and burn potato haulms 10-14 days before harvest to prevent spores washing down to tubers.'
        }
      },
      {
        category: {
          en: 'Certified Disease-Free Seed',
          hi: 'प्रमाणित रोगमुक्त बीज',
    kn: '[KN] Certified Disease-Free Seed'
        },
        action: {
          en: 'Always use certified seed tubers. Never plant tubers exhibiting brownish flesh discoloration.',
          hi: 'हमेशा प्रमाणित बीज कंदों का उपयोग करें। भूरे या दागदार कंदों की बुवाई कभी न करें।',
    kn: '[KN] Always use certified seed tubers. Never plant tubers exhibiting brownish flesh discoloration.'
        }
      },
      {
        category: {
          en: 'Earthing-Up / High Ridges',
          hi: 'मिट्टी चढ़ाना (Earthing-Up)',
    kn: '[KN] Earthing-Up / High Ridges'
        },
        action: {
          en: 'Create broad, high ridges (at least 20cm soil cover) over developing tubers.',
          hi: 'कंदों के ऊपर कम से कम 20 सेमी की चौड़ी और ऊंची मेड़ बनाएं ताकि बीजाणु सीधे कंदों को न छुएं।',
    kn: '[KN] Create broad, high ridges (at least 20cm soil cover) over developing tubers.'
        }
      }
    ],
    sampleImage: generateLeafSvg('potato-late-blight'),
    lesions: [
      { x: 0.45, y: 0.08, w: 0.36, h: 0.26, label: '#1 Apex Water-Soaked Rot', type: 'necrotic', color: '#ef4444' },
      { x: 0.65, y: 0.32, w: 0.22, h: 0.34, label: '#2 Expanding Margin Necrosis', type: 'margin', color: '#ea580c' },
      { x: 0.16, y: 0.38, w: 0.22, h: 0.28, label: '#3 Advanced Necrosis', type: 'necrotic', color: '#dc2626' },
      { x: 0.38, y: 0.44, w: 0.20, h: 0.18, label: '#4 Chlorotic Decay Zone', type: 'chlorotic', color: '#eab308' },
      { x: 0.50, y: 0.58, w: 0.18, h: 0.16, label: '#5 Active Foliar Lesion', type: 'active', color: '#f59e0b' }
    ]
  },
  {
    id: 'healthy-corn',
    cropKey: 'corn',
    cropName: {
      en: 'Corn / Maize',
      hi: 'मक्का (Corn / Maize)',
    kn: '[KN] Corn / Maize'
    },
    diseaseKey: 'healthy',
    diseaseName: {
      en: 'Healthy Crop (No Pathogen Detected)',
      hi: 'स्वस्थ फसल (कोई रोग नहीं मिला)',
    kn: '[KN] Healthy Crop (No Pathogen Detected)'
    },
    scientificName: 'Zea mays L.',
    pathogenType: {
      en: 'Physiologically Sound (Zero Pathogen)',
      hi: 'शारीरिक रूप से स्वस्थ (रोगमुक्त)',
    kn: '[KN] Physiologically Sound (Zero Pathogen)'
    },
    severity: 'none',
    confidence: 99.2,
    affectedAreaPct: 0.0,
    prognosis: {
      en: 'Optimal plant vigor and photosynthetic capacity. Projected yield target on schedule.',
      hi: 'पौधे का स्वास्थ्य और प्रकाश संश्लेषण क्षमता इष्टतम है। अनुमानित उपज लक्ष्य सही दिशा में है।',
    kn: '[KN] Optimal plant vigor and photosynthetic capacity. Projected yield target on schedule.'
    },
    symptoms: {
      en: [
        'Vibrant, deep violet green foliage with intact parallel leaf venation.',
        'Zero necrotic lesions, chlorotic haloing, or fungal pustules detected.',
        'Waxy cuticle layer intact with strong tensile leaf vigor.'
      ],
      hi: [
        'समानांतर शिराओं के साथ चमकदार गहरा हरा रंग।',
        'कोई नेक्रोटिक घाव, पीलापन या फंगल धब्बे मौजूद नहीं हैं।',
        'मोमी सुरक्षात्मक परत स्वस्थ और पत्ती की मजबूती उत्कृष्ट है।'
      ],
    kn: [
        '[KN] Vibrant, deep violet green foliage with intact parallel leaf venation.'[KN] ,
        '[KN] Zero necrotic lesions, chlorotic haloing, or fungal pustules detected.'[KN] ,
        '[KN] Waxy cuticle layer intact with strong tensile leaf vigor.'[KN] 
      ]
    },
    organicRemedies: [
      {
        title: {
          en: 'Seaweed Extract Bio-Stimulant (Kelp Foliar)',
          hi: 'समुद्री शैवाल अर्क (बायो-उत्तेजक स्प्रे)',
    kn: '[KN] Seaweed Extract Bio-Stimulant (Kelp Foliar)'
        },
        dosage: {
          en: '2ml to 3ml per Litre of water',
          hi: '2 मिली से 3 मिली प्रति 1 लीटर पानी',
    kn: '[KN] 2ml to 3ml per Litre of water'
        },
        schedule: {
          en: 'Apply once every 21 days during knee-high to tasseling stages.',
          hi: 'घुटने की ऊंचाई से लेकर मंजर निकलने तक हर 21 दिन में एक बार स्प्रे करें।',
    kn: '[KN] Apply once every 21 days during knee-high to tasseling stages.'
        },
        mechanism: {
          en: 'Supplies natural cytokinins and betaines to boost stress resilience and root vigor.',
          hi: 'तनाव सहनशीलता और जड़ विकास को बढ़ावा देने हेतु प्राकृतिक साइटोकिनिन प्रदान करता है।',
    kn: '[KN] Supplies natural cytokinins and betaines to boost stress resilience and root vigor.'
        }
      },
      {
        title: {
          en: 'Vermiwash + Panchagavya Nutrient Booster',
          hi: 'वर्मीवॉश + पंचगव्य पोषक टॉनिक',
    kn: '[KN] Vermiwash + Panchagavya Nutrient Booster'
        },
        dosage: {
          en: '30ml Panchagavya per 1L water',
          hi: '30 मिली पंचगव्य प्रति 1 लीटर पानी',
    kn: '[KN] 30ml Panchagavya per 1L water'
        },
        schedule: {
          en: 'Apply during early vegetative growth.',
          hi: 'प्रारंभिक वनस्पति वृद्धि अवस्था में स्प्रे करें।',
    kn: '[KN] Apply during early vegetative growth.'
        },
        mechanism: {
          en: 'Nourishes phyllosphere microbiome and increases chlorophyll density.',
          hi: 'पत्तियों के सूक्ष्मजीवों को पोषण देता है और क्लोरोफिल की मात्रा बढ़ाता है।',
    kn: '[KN] Nourishes phyllosphere microbiome and increases chlorophyll density.'
        }
      }
    ],
    chemicalInterventions: [
      {
        salt: 'Zinc Sulphate (ZnSO4 21%) / Chelated Zinc EDTA 12%',
        tradeName: 'AgroMin Zinc / Solubor',
        dosage: {
          en: '1.0g Chelated Zinc EDTA per Litre of water (200g / acre)',
          hi: '1.0 ग्राम चिलेटेड जिंक EDTA प्रति लीटर पानी (200 ग्राम प्रति एकड़)',
    kn: '[KN] 1.0g Chelated Zinc EDTA per Litre of water (200g / acre)'
        },
        safetyWaitingPeriod: {
          en: 'None (Micronutrient maintenance)',
          hi: 'कोई नहीं (सूक्ष्म पोषक तत्व)',
    kn: '[KN] None (Micronutrient maintenance)'
        },
        timing: {
          en: 'Preventive micronutrient foliar spray at 30-35 days after sowing.',
          hi: 'बुवाई के 30-35 दिन बाद निवारक सूक्ष्म पोषक तत्व स्प्रे।',
    kn: '[KN] Preventive micronutrient foliar spray at 30-35 days after sowing.'
        }
      },
      {
        salt: 'Water Soluble NPK 19:19:19',
        tradeName: 'Ferticare 19:19:19',
        dosage: {
          en: '5.0g per Litre of water (1kg / 200L / acre)',
          hi: '5.0 ग्राम प्रति लीटर पानी (1 किग्रा प्रति एकड़)',
    kn: '[KN] 5.0g per Litre of water (1kg / 200L / acre)'
        },
        safetyWaitingPeriod: {
          en: 'None',
          hi: 'कोई नहीं',
    kn: '[KN] None'
        },
        timing: {
          en: 'Pre-flowering vegetative boost.',
          hi: 'फूल आने से पहले वानस्पतिक शक्ति हेतु।',
    kn: '[KN] Pre-flowering vegetative boost.'
        }
      }
    ],
    preventiveAdvisory: [
      {
        category: {
          en: 'Balanced Nitrogen Timing',
          hi: 'संतुलित नाइट्रोजन प्रबंधन',
    kn: '[KN] Balanced Nitrogen Timing'
        },
        action: {
          en: 'Split urea application into 3 equal doses (sowing, knee-high, tasseling) to prevent lush succulent growth prone to fall armyworm.',
          hi: 'यूरिया को 3 बराबर भागों में विभाजित करें (बुवाई, घुटने की ऊंचाई, फूल आने पर) ताकि कीटों का प्रकोप न हो।',
    kn: '[KN] Split urea application into 3 equal doses (sowing, knee-high, tasseling) to prevent lush succulent growth prone to fall armyworm.'
        }
      },
      {
        category: {
          en: 'Scouting for Fall Armyworm (FAW)',
          hi: 'फॉल आर्मीवर्म की निगरानी',
    kn: '[KN] Scouting for Fall Armyworm (FAW)'
        },
        action: {
          en: 'Inspect whorl leaves twice weekly for small pinholes or frass.',
          hi: 'सप्ताह में दो बार पौधे के बीच वाले पत्तों की जांच करें ताकि कीट के छेद या मल दिखने पर तुरंत रोक सकें।',
    kn: '[KN] Inspect whorl leaves twice weekly for small pinholes or frass.'
        }
      },
      {
        category: {
          en: 'Moisture Stress Management',
          hi: 'नमी संरक्षण',
    kn: '[KN] Moisture Stress Management'
        },
        action: {
          en: 'Ensure critical irrigation at tasseling and silking stages; moisture deficiency here reduces cob filling by up to 40%.',
          hi: 'मंजर और सिल्क निकलने की अवस्था में पर्याप्त पानी दें, इस समय सूखा पड़ने पर उपज 40% तक घट सकती है।',
    kn: '[KN] Ensure critical irrigation at tasseling and silking stages; moisture deficiency here reduces cob filling by up to 40%.'
        }
      }
    ],
    sampleImage: generateLeafSvg('healthy-corn'),
    lesions: []
  },
  {
    id: 'apple-cedar-rust',
    cropKey: 'apple',
    cropName: {
      en: 'Apple',
      hi: 'सेब (Apple)',
    kn: '[KN] Apple'
    },
    diseaseKey: 'cedar-rust',
    diseaseName: {
      en: 'Cedar Apple Rust',
      hi: 'सीडार सेब रतुआ (Cedar Apple Rust)',
    kn: '[KN] Cedar Apple Rust'
    },
    scientificName: 'Gymnosporangium juniperi-virginianae',
    pathogenType: {
      en: 'Heteroecious Rust Fungus',
      hi: 'द्विपोषी रतुआ कवक (Rust Fungus)',
    kn: '[KN] Heteroecious Rust Fungus'
    },
    severity: 'mild',
    confidence: 93.1,
    affectedAreaPct: 11.2,
    prognosis: {
      en: 'Manageable with early season targeted protection. Low risk of fruit deformities if sprayed now.',
      hi: 'शुरुआती सुरक्षात्मक उपायों से आसानी से नियंत्रित। समय पर छिड़काव से फलों को नुकसान नहीं होता।',
    kn: '[KN] Manageable with early season targeted protection. Low risk of fruit deformities if sprayed now.'
    },
    symptoms: {
      en: [
        'Small, bright greenish-yellow spots on upper leaf surface turning vivid orange-red with darker centres.',
        'Cluster cups (aecia) erupting like tiny tubes on the underside of older leaf spots.',
        'Premature leaf drop in severe cases; secondary alternate host is Eastern Red Cedar.'
      ],
      hi: [
        'पत्ती की ऊपरी सतह पर छोटे चमकीले पीले धब्बे जो बाद में नारंगी-लाल हो जाते हैं।',
        'पत्ती के निचले हिस्से में छोटे ट्यूबलर कप (एशिया) उभर आते हैं।',
        'गंभीर मामलों में पत्तियां झड़ जाती हैं; इसका दूसरा मेजबान पौधा जुनिपर (Cedar) है।'
      ],
    kn: [
        '[KN] Small, bright greenish-yellow spots on upper leaf surface turning vivid orange-red with darker centres.'[KN] ,
        '[KN] Cluster cups (aecia) erupting like tiny tubes on the underside of older leaf spots.'[KN] ,
        '[KN] Premature leaf drop in severe cases; secondary alternate host is Eastern Red Cedar.'[KN] 
      ]
    },
    organicRemedies: [
      {
        title: {
          en: 'Wettable Sulfur (Micronized 80% WDG)',
          hi: 'घुलनशील गंधक (माइक्रोनाइज्ड सल्फर 80%)',
    kn: '[KN] Wettable Sulfur (Micronized 80% WDG)'
        },
        dosage: {
          en: '2.5g per Litre of water',
          hi: '2.5 ग्राम प्रति 1 लीटर पानी',
    kn: '[KN] 2.5g per Litre of water'
        },
        schedule: {
          en: 'Apply at tight cluster to pink bud stage; do not apply when temperatures exceed 29°C (85°F).',
          hi: 'कली खिलने की अवस्था में स्प्रे करें; 29 डिग्री सेल्सियस से अधिक तापमान पर उपयोग न करें।',
    kn: '[KN] Apply at tight cluster to pink bud stage; do not apply when temperatures exceed 29°C (85°F).'
        },
        mechanism: {
          en: 'Elemental sulfur halts rust spore respiration and electron transport.',
          hi: 'गंधक रतुआ कवक के बीजाणु श्वसन और ऊर्जा उत्पादन को अवरुद्ध करता है।',
    kn: '[KN] Elemental sulfur halts rust spore respiration and electron transport.'
        }
      },
      {
        title: {
          en: 'Potassium Bicarbonate Foliar Spray',
          hi: 'पोटेशियम बाइकार्बोनेट पर्ण स्प्रे',
    kn: '[KN] Potassium Bicarbonate Foliar Spray'
        },
        dosage: {
          en: '4g to 5g per Litre of water + wetting agent',
          hi: '4 से 5 ग्राम प्रति लीटर पानी + स्टीकर',
    kn: '[KN] 4g to 5g per Litre of water + wetting agent'
        },
        schedule: {
          en: 'Apply within 24 hours of spring rain event.',
          hi: 'वसंत ऋतु की बारिश के 24 घंटे के भीतर लागू करें।',
    kn: '[KN] Apply within 24 hours of spring rain event.'
        },
        mechanism: {
          en: 'Rapidly collapses basidiospores through osmotic pressure imbalance.',
          hi: 'परासरण दाब बदलकर बीजाणुओं को तुरंत निष्क्रिय करता है।',
    kn: '[KN] Rapidly collapses basidiospores through osmotic pressure imbalance.'
        }
      }
    ],
    chemicalInterventions: [
      {
        salt: 'Myclobutanil 10% WP',
        tradeName: 'Systhane / Rally 40WSP',
        dosage: {
          en: '0.5g to 0.7g per Litre of water (100g / 200L)',
          hi: '0.5 से 0.7 ग्राम प्रति लीटर पानी (100 ग्राम प्रति 200 लीटर)',
    kn: '[KN] 0.5g to 0.7g per Litre of water (100g / 200L)'
        },
        safetyWaitingPeriod: {
          en: '14 days before harvest',
          hi: 'कटाई से 14 दिन पहले',
    kn: '[KN] 14 days before harvest'
        },
        timing: {
          en: 'Triazole curative fungicide offering 72-96 hours of post-infection kickback activity.',
          hi: 'ट्रायजोल उपचारात्मक कवकनाशी जो संक्रमण के 72-96 घंटों बाद तक असरदार रहता है।',
    kn: '[KN] Triazole curative fungicide offering 72-96 hours of post-infection kickback activity.'
        }
      },
      {
        salt: 'Propiconazole 25% EC',
        tradeName: 'Tilt',
        dosage: {
          en: '1.0ml per Litre of water',
          hi: '1.0 मिली प्रति लीटर पानी',
    kn: '[KN] 1.0ml per Litre of water'
        },
        safetyWaitingPeriod: {
          en: '21 days before harvest',
          hi: 'कटाई से 21 दिन पहले',
    kn: '[KN] 21 days before harvest'
        },
        timing: {
          en: 'Systemic foliar spray during shoot elongation.',
          hi: 'शाखाओं की वृद्धि के समय प्रणालीगत छिड़काव।',
    kn: '[KN] Systemic foliar spray during shoot elongation.'
        }
      }
    ],
    preventiveAdvisory: [
      {
        category: {
          en: 'Alternate Host Eradication',
          hi: 'वैकल्पिक मेजबान (जुनिपर) प्रबंधन',
    kn: '[KN] Alternate Host Eradication'
        },
        action: {
          en: 'Inspect nearby landscape for Juniper/Eastern Red Cedar trees with brown woody galls. Remove cedar galls within a 1km radius.',
          hi: 'बगीचे के 1 किमी के दायरे में जुनिपर पेड़ों की जांच करें और उन पर बनी गोल गांठों को नष्ट करें।',
    kn: '[KN] Inspect nearby landscape for Juniper/Eastern Red Cedar trees with brown woody galls. Remove cedar galls within a 1km radius.'
        }
      },
      {
        category: {
          en: 'Resistant Cultivars',
          hi: 'प्रतिरोधी किस्में',
    kn: '[KN] Resistant Cultivars'
        },
        action: {
          en: 'Plant rust-resistant apple cultivars like Enterprise, Freedom, Liberty, or Priscilla in high-risk zones.',
          hi: 'उच्च जोखिम वाले क्षेत्रों में रतुआ प्रतिरोधी किस्मों का रोपण करें।',
    kn: '[KN] Plant rust-resistant apple cultivars like Enterprise, Freedom, Liberty, or Priscilla in high-risk zones.'
        }
      }
    ],
    sampleImage: generateLeafSvg('apple-cedar-rust'),
    lesions: [
      { x: 0.32, y: 0.32, w: 0.12, h: 0.12, label: '#1 Chlorotic Halo', type: 'chlorotic', color: '#eab308' },
      { x: 0.60, y: 0.40, w: 0.14, h: 0.14, label: '#2 Orange Rust Pustule', type: 'necrotic', color: '#ef4444' },
      { x: 0.38, y: 0.56, w: 0.11, h: 0.11, label: '#3 Mid-Vein Lesion', type: 'necrotic', color: '#dc2626' },
      { x: 0.54, y: 0.64, w: 0.09, h: 0.09, label: '#4 Active Foliar Lesion', type: 'active', color: '#f59e0b' },
      { x: 0.48, y: 0.24, w: 0.13, h: 0.13, label: '#5 Early Margin Blight', type: 'margin', color: '#ea580c' }
    ]
  }
];

export const APP_TRANSLATIONS = {
  en: {
    aiAnalyzing: 'AI Deep Analysis in progress...',
    appTitle: 'PlantCure AI',
    appSubtitle: 'Botanical Analysis & Diagnostic Interface',
    engineBadge: 'Inference Engine Active',
    navNewScan: 'Analyze Image',
    navSaved: 'Archives',
    navAdvisory: 'Care Guidelines',
    heroTitle: 'Advanced Botanical Analysis & Plant Care',
    heroDesc: 'Leverage our completely local computer vision engine to analyze plant health directly on your device. Securely upload photos or use our camera tool for immediate insights into plant pathology.',
    dropzoneTitle: 'Drop Plant Image Here',
    dropzoneSubtitle: 'or click to select from your device (JPG, PNG, WebP supported)',
    cameraBtn: 'Open Device Camera',
    sampleSectionTitle: 'Example Datasets',
    sampleSectionSubtitle: 'Select a sample below to run an instant analysis demonstration:',
    scanningTitle: 'Processing Image Data...',
    scanStep1: 'Loading image data into secure processing buffer...',
    scanStep2: 'Analyzing spectral frequencies and identifying anomalies...',
    scanStep3: 'Mapping lesion geometry and evaluating surface integrity...',
    scanStep4: 'Cross-referencing biological patterns with botanical database...',
    scanStep5: 'Finalizing diagnosis and generating customized care protocol...',
    detectionConfidence: 'Match Confidence',
    severityLabel: 'Severity Assessment',
    pathogenTypeLabel: 'Biological Category',
    affectedAreaLabel: 'Surface Damage Area',
    prognosisLabel: 'Expected Recovery Prognosis',
    visualInspectorTitle: 'Geometric Anomaly Inspector',
    showBoundingBoxes: 'Highlight Detection Zones',
    showHeatmap: 'Thermal Anomaly Overlay',
    toggleLabels: 'Display Diagnostic Labels',
    activeLesionsCount: 'Anomalous Zones Detected',
    tabOrganic: 'Organic & Bio-Remedies',
    tabChemical: 'Chemical Interventions',
    tabPreventive: 'Cultural & Preventive Advisory',
    btnPrintReport: 'Print / Save Web Diagnostic Report',
    historyTitle: 'Diagnostic Scan Vault (Local History)',
    historyEmpty: 'No previous scans saved in this browser. Run a diagnosis above to save your first record.',
    clearHistoryBtn: 'Clear All History',
    deleteScan: 'Delete',
    viewScan: 'Inspect Scan',
    closeModal: 'Close',
    captureSnapshot: 'Capture Leaf Snapshot',
    cameraModalTitle: 'Live Crop Leaf Camera Capture',
    cameraNotice: 'Align the affected crop leaf in center frame with good daylight.',
    cameraFallback: 'Camera access denied or not available. Please use file upload.',
    reportTitle: 'PlantCure AI – Plant Pathology Field Diagnostic Report',
    reportDate: 'Inspection Date & Time',
    reportCertId: 'Diagnostic Certification ID',
    disclaimer: 'Advisory Note: Always adhere to national chemical safety guidelines and pesticide label regulations. Use personal protective gear during spraying.',
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    none: 'Healthy / None',
    foliageHealthyStatus: 'Status: Foliage Healthy (No Active Pathogens Detected)',
    healthyCropVerdict: 'Healthy Crop (Zea mays / Solanum)',
    healthyFungicideNotice: 'Status: Foliage is completely healthy. Chemical fungicides are NOT recommended or required. Displaying preventive micronutrient and foliar maintenance guidelines.',
    login: 'Login / Sign Up',
    logout: 'Logout',
    myPlants: 'My Plants',
    authTitle: 'Welcome to PlantCure AI',
    authSubtitle: 'Sign in to sync your scans and track your plants across devices.',
    emailLogin: 'Sign in with Email',
    googleLogin: 'Sign in with Google',
    emailPlaceholder: 'Enter your email',
    authSuccess: 'Check your email for the login link!',
    authError: 'Error sending magic link. Please try again.',
    cloudSynced: 'Cloud Synced',
    localOnly: 'Local Only',
    myPlantsEmpty: 'You haven\'t added any plants yet.',
    addPlant: 'Add New Plant',
    plantName: 'Plant Name / Identifier',
    plantSpecies: 'Species (Optional)',
    createPlant: 'Create Profile',
    whyDiagnosis: 'Why this diagnosis?',
    symptomsMatched: 'Symptoms matched by AI:',
    disclaimerText: 'AI-assisted diagnosis — not a substitute for a professional agronomist.',
    feedbackQuestion: 'Was this diagnosis accurate?',
    feedbackThanks: 'Thanks for your feedback!'
  },
  hi: {
    aiAnalyzing: 'एआई डीप एनालिसिस चल रहा है...',
    appTitle: 'एग्रीक्योर एआई',
    appSubtitle: 'वेब-आधारित फसल रोग पहचान एवं कृषि सलाह पोर्टल',
    engineBadge: 'वेब इंजन v2.4 सक्रिय',
    navNewScan: 'नया स्कैन',
    navSaved: 'सहेजे गए निदान',
    navAdvisory: 'कृषि सलाह',
    heroTitle: 'स्मार्ट फसल रोग पहचान और सटीक कृषि सलाह',
    heroDesc: 'अपने ब्राउज़र में सीधे त्वरित एआई पत्ती रोग निदान। फ़ील्ड फ़ोटो अपलोड करें या त्वरित नमूनों का परीक्षण करें। सटीक घाव पहचान, आत्मविश्वास स्कोर और जैविक तथा रासायनिक उपचार प्राप्त करें।',
    dropzoneTitle: 'रोगग्रस्त पत्ती की फोटो यहां खींचकर छोड़ें',
    dropzoneSubtitle: 'या अपने मोबाइल/कंप्यूटर से फ़ाइल चुनें (PNG, JPG, WebP)',
    cameraBtn: 'वेब कैमरे से फोटो लें',
    sampleSectionTitle: 'त्वरित डेमो नमूने (1-क्लिक परीक्षण)',
    sampleSectionSubtitle: 'बिना किसी फ़ाइल के तुरंत परीक्षण करने के लिए नीचे दिए गए किसी भी पत्ते पर क्लिक करें:',
    scanningTitle: 'पत्ती रोग विश्लेषण प्रक्रिया जारी है...',
    scanStep1: '[200 OK] छवि कैनवास बफर में लोड हुई और 512x512 पर सामान्यीकृत हुई...',
    scanStep2: 'आरजीबी रंग संतुलन और क्लोरोसिस सूचकांक का विश्लेषण...',
    scanStep3: 'रोगग्रस्त घाव के निर्देशांक और सतह क्षेत्र का विभाजन...',
    scanStep4: 'पादप रोग विज्ञान डेटाबेस से विशेषताओं का मिलान...',
    scanStep5: 'जैविक और रासायनिक उपचार नुस्खे तैयार किए जा रहे हैं...',
    detectionConfidence: 'रोग पहचान विश्वास (Confidence)',
    severityLabel: 'गंभीरता का स्तर',
    pathogenTypeLabel: 'रोगज़नक़ वर्गीकरण',
    affectedAreaLabel: 'प्रभावित पत्ती क्षेत्र',
    prognosisLabel: 'पुनर्प्राप्ति और फसल स्वास्थ्य दृष्टिकोण',
    visualInspectorTitle: 'विजुअल लीफ इंस्पेक्टर (कैनवास इंजन)',
    showBoundingBoxes: 'घाव बाउंडिंग बॉक्स दिखाएं',
    showHeatmap: 'पैथोलॉजी हीटमैप ओवरले',
    toggleLabels: 'घाव लेबल दिखाएं',
    activeLesionsCount: 'पहचाने गए सक्रिय घाव',
    tabOrganic: 'जैविक एवं प्राकृतिक उपचार',
    tabChemical: 'रासायनिक कवकनाशी हस्तक्षेप',
    tabPreventive: 'निवारक एवं कृषि प्रबंधन सलाह',
    btnPrintReport: 'वेब निदान रिपोर्ट प्रिंट / सहेजें',
    historyTitle: 'निदान स्कैन वॉल्ट (लोकल हिस्ट्री)',
    historyEmpty: 'इस ब्राउज़र में कोई पुराना स्कैन नहीं मिला। पहला रिकॉर्ड सहेजने हेतु ऊपर एक पत्ती स्कैन करें।',
    clearHistoryBtn: 'समस्त इतिहास हटाएं',
    deleteScan: 'हटाएं',
    viewScan: 'निदान देखें',
    closeModal: 'बंद करें',
    captureSnapshot: 'पत्ती की तस्वीर लें',
    cameraModalTitle: 'लाइव फसल पत्ती कैमरा कैप्चर',
    cameraNotice: 'प्रभावित पत्ती को पर्याप्त धूप में कैमरे के केंद्र में रखें।',
    cameraFallback: 'कैमरा उपलब्ध नहीं है या अनुमति अस्वीकृत है। कृपया फ़ाइल अपलोड का उपयोग करें।',
    reportTitle: 'एग्रीक्योर एआई – पादप रोग विज्ञान क्षेत्र निदान रिपोर्ट',
    reportDate: 'निरीक्षण दिनांक एवं समय',
    reportCertId: 'निदान प्रमाणन संख्या',
    disclaimer: 'सलाह नोट: कीटनाशक लेबल नियमों और राष्ट्रीय सुरक्षा दिशानिर्देशों का हमेशा पालन करें। छिड़काव के दौरान मास्क और दस्तानों का प्रयोग करें।',
    mild: 'हल्का (Mild)',
    moderate: 'मध्यम (Moderate)',
    severe: 'गंभीर (Severe)',
    none: 'स्वस्थ / कोई रोग नहीं',
    foliageHealthyStatus: 'स्थिति: पत्ती पूर्णतः स्वस्थ (कोई सक्रिय रोगज़नक़ नहीं मिला)',
    healthyCropVerdict: 'स्वस्थ फसल (Zea mays / Solanum)',
    healthyFungicideNotice: 'स्थिति: पत्ती पूर्णतः स्वस्थ है। रासायनिक कवकनाशी की आवश्यकता नहीं है। निवारक सूक्ष्म पोषक तत्व एवं पर्ण रखरखाव सलाह प्रदर्शित की जा रही है।',
    login: 'लॉगिन / साइन अप',
    logout: 'लॉगआउट',
    myPlants: 'मेरे पौधे',
    authTitle: 'एग्रीक्योर एआई में आपका स्वागत है',
    authSubtitle: 'अपने स्कैन को सिंक करने और अपने पौधों को ट्रैक करने के लिए साइन इन करें।',
    emailLogin: 'ईमेल से साइन इन करें',
    googleLogin: 'Google से साइन इन करें',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    authSuccess: 'लॉगिन लिंक के लिए अपना ईमेल जांचें!',
    authError: 'मैजिक लिंक भेजने में त्रुटि। कृपया पुनः प्रयास करें।',
    cloudSynced: 'क्लाउड सिंक किया गया',
    localOnly: 'केवल स्थानीय',
    myPlantsEmpty: 'आपने अभी तक कोई पौधा नहीं जोड़ा है।',
    addPlant: 'नया पौधा जोड़ें',
    plantName: 'पौधे का नाम / पहचानकर्ता',
    plantSpecies: 'प्रजाति (वैकल्पिक)',
    createPlant: 'प्रोफ़ाइल बनाएं',
    whyDiagnosis: 'यह निदान क्यों?',
    symptomsMatched: 'एआई द्वारा पहचाने गए लक्षण:',
    disclaimerText: 'एआई-सहायक निदान — पेशेवर कृषि विज्ञानी का विकल्प नहीं है।',
    feedbackQuestion: 'क्या यह निदान सटीक था?',
    feedbackThanks: 'आपकी प्रतिक्रिया के लिए धन्यवाद!'
  },
  kn: {
    aiAnalyzing: '[KN] ' + 'एआई डीप एनालिसिस चल रहा है...',
    appTitle: '[KN] ' + 'एग्रीक्योर एआई',
    appSubtitle: '[KN] ' + 'वेब-आधारित फसल रोग पहचान एवं कृषि सलाह पोर्टल',
    engineBadge: '[KN] ' + 'वेब इंजन v2.4 सक्रिय',
    navNewScan: '[KN] ' + 'नया स्कैन',
    navSaved: '[KN] ' + 'सहेजे गए निदान',
    navAdvisory: '[KN] ' + 'कृषि सलाह',
    heroTitle: '[KN] ' + 'स्मार्ट फसल रोग पहचान और सटीक कृषि सलाह',
    heroDesc: '[KN] ' + 'अपने ब्राउज़र में सीधे त्वरित एआई पत्ती रोग निदान। फ़ील्ड फ़ोटो अपलोड करें या त्वरित नमूनों का परीक्षण करें। सटीक घाव पहचान, आत्मविश्वास स्कोर और जैविक तथा रासायनिक उपचार प्राप्त करें।',
    dropzoneTitle: '[KN] ' + 'रोगग्रस्त पत्ती की फोटो यहां खींचकर छोड़ें',
    dropzoneSubtitle: '[KN] ' + 'या अपने मोबाइल/कंप्यूटर से फ़ाइल चुनें (PNG, JPG, WebP)',
    cameraBtn: '[KN] ' + 'वेब कैमरे से फोटो लें',
    sampleSectionTitle: '[KN] ' + 'त्वरित डेमो नमूने (1-क्लिक परीक्षण)',
    sampleSectionSubtitle: '[KN] ' + 'बिना किसी फ़ाइल के तुरंत परीक्षण करने के लिए नीचे दिए गए किसी भी पत्ते पर क्लिक करें:',
    scanningTitle: '[KN] ' + 'पत्ती रोग विश्लेषण प्रक्रिया जारी है...',
    scanStep1: '[KN] ' + '[200 OK] छवि कैनवास बफर में लोड हुई और 512x512 पर सामान्यीकृत हुई...',
    scanStep2: '[KN] ' + 'आरजीबी रंग संतुलन और क्लोरोसिस सूचकांक का विश्लेषण...',
    scanStep3: '[KN] ' + 'रोगग्रस्त घाव के निर्देशांक और सतह क्षेत्र का विभाजन...',
    scanStep4: '[KN] ' + 'पादप रोग विज्ञान डेटाबेस से विशेषताओं का मिलान...',
    scanStep5: '[KN] ' + 'जैविक और रासायनिक उपचार नुस्खे तैयार किए जा रहे हैं...',
    detectionConfidence: '[KN] ' + 'रोग पहचान विश्वास (Confidence)',
    severityLabel: '[KN] ' + 'गंभीरता का स्तर',
    pathogenTypeLabel: '[KN] ' + 'रोगज़नक़ वर्गीकरण',
    affectedAreaLabel: '[KN] ' + 'प्रभावित पत्ती क्षेत्र',
    prognosisLabel: '[KN] ' + 'पुनर्प्राप्ति और फसल स्वास्थ्य दृष्टिकोण',
    visualInspectorTitle: '[KN] ' + 'विजुअल लीफ इंस्पेक्टर (कैनवास इंजन)',
    showBoundingBoxes: '[KN] ' + 'घाव बाउंडिंग बॉक्स दिखाएं',
    showHeatmap: '[KN] ' + 'पैथोलॉजी हीटमैप ओवरले',
    toggleLabels: '[KN] ' + 'घाव लेबल दिखाएं',
    activeLesionsCount: '[KN] ' + 'पहचाने गए सक्रिय घाव',
    tabOrganic: '[KN] ' + 'जैविक एवं प्राकृतिक उपचार',
    tabChemical: '[KN] ' + 'रासायनिक कवकनाशी हस्तक्षेप',
    tabPreventive: '[KN] ' + 'निवारक एवं कृषि प्रबंधन सलाह',
    btnPrintReport: '[KN] ' + 'वेब निदान रिपोर्ट प्रिंट / सहेजें',
    historyTitle: '[KN] ' + 'निदान स्कैन वॉल्ट (लोकल हिस्ट्री)',
    historyEmpty: '[KN] ' + 'इस ब्राउज़र में कोई पुराना स्कैन नहीं मिला। पहला रिकॉर्ड सहेजने हेतु ऊपर एक पत्ती स्कैन करें।',
    clearHistoryBtn: '[KN] ' + 'समस्त इतिहास हटाएं',
    deleteScan: '[KN] ' + 'हटाएं',
    viewScan: '[KN] ' + 'निदान देखें',
    closeModal: '[KN] ' + 'बंद करें',
    captureSnapshot: '[KN] ' + 'पत्ती की तस्वीर लें',
    cameraModalTitle: '[KN] ' + 'लाइव फसल पत्ती कैमरा कैप्चर',
    cameraNotice: '[KN] ' + 'प्रभावित पत्ती को पर्याप्त धूप में कैमरे के केंद्र में रखें।',
    cameraFallback: '[KN] ' + 'कैमरा उपलब्ध नहीं है या अनुमति अस्वीकृत है। कृपया फ़ाइल अपलोड का उपयोग करें।',
    reportTitle: '[KN] ' + 'एग्रीक्योर एआई – पादप रोग विज्ञान क्षेत्र निदान रिपोर्ट',
    reportDate: '[KN] ' + 'निरीक्षण दिनांक एवं समय',
    reportCertId: '[KN] ' + 'निदान प्रमाणन संख्या',
    disclaimer: '[KN] ' + 'सलाह नोट: कीटनाशक लेबल नियमों और राष्ट्रीय सुरक्षा दिशानिर्देशों का हमेशा पालन करें। छिड़काव के दौरान मास्क और दस्तानों का प्रयोग करें।',
    mild: '[KN] ' + 'हल्का (Mild)',
    moderate: '[KN] ' + 'मध्यम (Moderate)',
    severe: '[KN] ' + 'गंभीर (Severe)',
    none: '[KN] ' + 'स्वस्थ / कोई रोग नहीं',
    foliageHealthyStatus: '[KN] ' + 'स्थिति: पत्ती पूर्णतः स्वस्थ (कोई सक्रिय रोगज़नक़ नहीं मिला)',
    healthyCropVerdict: '[KN] ' + 'स्वस्थ फसल (Zea mays / Solanum)',
    healthyFungicideNotice: '[KN] ' + 'स्थिति: पत्ती पूर्णतः स्वस्थ है। रासायनिक कवकनाशी की आवश्यकता नहीं है। निवारक सूक्ष्म पोषक तत्व एवं पर्ण रखरखाव सलाह प्रदर्शित की जा रही है।',
    login: '[KN] ' + 'लॉगिन / साइन अप',
    logout: '[KN] ' + 'लॉगआउट',
    myPlants: '[KN] ' + 'मेरे पौधे',
    authTitle: '[KN] ' + 'एग्रीक्योर एआई में आपका स्वागत है',
    authSubtitle: '[KN] ' + 'अपने स्कैन को सिंक करने और अपने पौधों को ट्रैक करने के लिए साइन इन करें।',
    emailLogin: '[KN] ' + 'ईमेल से साइन इन करें',
    googleLogin: '[KN] ' + 'Google से साइन इन करें',
    emailPlaceholder: '[KN] ' + 'अपना ईमेल दर्ज करें',
    authSuccess: '[KN] ' + 'लॉगिन लिंक के लिए अपना ईमेल जांचें!',
    authError: '[KN] ' + 'मैजिक लिंक भेजने में त्रुटि। कृपया पुनः प्रयास करें।',
    cloudSynced: '[KN] ' + 'क्लाउड सिंक किया गया',
    localOnly: '[KN] ' + 'केवल स्थानीय',
    myPlantsEmpty: '[KN] ' + 'आपने अभी तक कोई पौधा नहीं जोड़ा है।',
    addPlant: '[KN] ' + 'नया पौधा जोड़ें',
    plantName: '[KN] ' + 'पौधे का नाम / पहचानकर्ता',
    plantSpecies: '[KN] ' + 'प्रजाति (वैकल्पिक)',
    createPlant: '[KN] ' + 'प्रोफ़ाइल बनाएं',
    whyDiagnosis: '[KN] ' + 'यह निदान क्यों?',
    symptomsMatched: '[KN] ' + 'एआई द्वारा पहचाने गए लक्षण:',
    disclaimerText: '[KN] ' + 'एआई-सहायक निदान — पेशेवर कृषि विज्ञानी का विकल्प नहीं है।',
    feedbackQuestion: '[KN] ' + 'क्या यह निदान सटीक था?',
    feedbackThanks: '[KN] ' + 'आपकी प्रतिक्रिया के लिए धन्यवाद!'
  }
};
