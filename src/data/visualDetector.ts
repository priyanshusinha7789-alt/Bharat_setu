export interface VisualMetadata {
  visualType: 'plant_growth' | 'water_cycle' | 'triangle_geometry' | 'circle_geometry' | 'solar_system' | 'animal_nature' | 'counting_math' | 'classroom_chat' | 'pedagogy_concept';
  conceptTitle: string;
  keyElements: string[];
}

/**
 * Semantic classifier to select appropriate visual illustration for primary students
 */
export function detectVisualFallback(sourceText: string, translatedText: string = ''): VisualMetadata {
  const combined = (sourceText + ' ' + translatedText).toLowerCase();

  if (/\b(vapour|vapor|steam|heated|boil|boiling|evaporat|वाष्प|भाप|गरम करने|বাষ্প|জল বাষ্প)\b/i.test(combined)) {
    return {
      visualType: 'water_cycle',
      conceptTitle: 'Evaporation & States of Matter',
      keyElements: ['Liquid water', 'Thermal heating', 'Ascending vapour particles']
    };
  }

  if (/\b(plant|plants|leaf|leaves|sunlight|photosynthesis|tree|trees|seed|sprout|soil|पौध|पेड़|पत्त|धूप|झाड़|গাছ|পাতা)\b/i.test(combined)) {
    return {
      visualType: 'plant_growth',
      conceptTitle: 'Plant Photosynthesis & Growth',
      keyElements: ['Sunlight energy', 'Water absorption', 'Plant food preparation']
    };
  }

  if (/\b(triangle|three sides|3 sides|angle|angles|polygon|corner|त्रिभुज|भुजा|कोन|त्रिकोण|ত্রিভুজ|বাহু)\b/i.test(combined)) {
    return {
      visualType: 'triangle_geometry',
      conceptTitle: 'Triangle Geometry & Sides',
      keyElements: ['Side 1 (Base)', 'Side 2 (Left)', 'Side 3 (Right)']
    };
  }

  if (/\b(circle|round|wheel|sphere|circular|perimeter|radius|गोल|वृत्त|चक्र|বৃত্ত)\b/i.test(combined)) {
    return {
      visualType: 'circle_geometry',
      conceptTitle: 'Circular Geometry & Shapes',
      keyElements: ['Center point', 'Continuous curved perimeter', 'Radius distance']
    };
  }

  if (/\b(sun|moon|star|stars|planet|space|sky|orbit|day|night|चाँद|तारे|आसमान|सूर्य|ग्रह)\b/i.test(combined)) {
    return {
      visualType: 'solar_system',
      conceptTitle: 'Planets & Celestial Motion',
      keyElements: ['Central Sun', 'Orbital path', 'Atmospheric cycle']
    };
  }

  if (/\b(animal|bird|cat|dog|fish|cow|lion|forest|creature|जानवर|पशु|पक्षी|चिड़िया)\b/i.test(combined)) {
    return {
      visualType: 'animal_nature',
      conceptTitle: 'Living Animals & Nature',
      keyElements: ['Natural habitat', 'Living creature', 'Ecosystem link']
    };
  }

  if (/\b(count|number|numbers|one|two|three|four|five|ten|plus|minus|math|maths|add|गिन|संख्या|जोड़|अंक)\b/i.test(combined)) {
    return {
      visualType: 'counting_math',
      conceptTitle: 'Foundational Counting & Numbers',
      keyElements: ['Numeral symbols', 'Visual token counting', 'Equivalence balance']
    };
  }

  if (/\b(hello|hi|namaste|kem cho|kasa|kaise|kya|bhai|yaar|friend|dost|talk|listen|bol|suno|सुनो|नमस्ते|কেমন)\b/i.test(combined)) {
    return {
      visualType: 'classroom_chat',
      conceptTitle: 'Classroom Dialogue & Expression',
      keyElements: ['Teacher expression', 'Mother tongue translation', 'Student comprehension']
    };
  }

  return {
    visualType: 'pedagogy_concept',
    conceptTitle: 'Curricular Concept Learning',
    keyElements: ['Concept definition', 'Vernacular context', 'Primary explanation']
  };
}
