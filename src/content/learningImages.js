/** Default images for learning programs (by id) — from shakespeareonthesound.org */
export const learningProgramImages = {
  '69f3fb305885aa36a182ab9b': '/images/learning/in-schools.jpg',
  'touring-shows': '/images/learning/tours.jpg',
  '69f3fb305885aa36a182ab9c': '/images/learning/trippingly-on-the-tongue.jpg',
  '69f3fb305885aa36a182ab9d': '/images/learning/all-the-worlds-a-stage.jpg',
  '69f3fb305885aa36a182ab9e': '/images/learning/page-to-stage-hamlet.jpg',
  '69f3fb305885aa36a182ab9f': '/images/learning/teachers-workshop.jpg',
  '69f3fb305885aa36a182aba0': '/images/learning/in-the-park.jpg',
  '69f3fb305885aa36a182aba1': '/images/learning/summer-camps.jpg',
  '69f3fb305885aa36a182aba2': '/images/learning/professional-training.jpg',
};

export function getLearningProgramImage(program) {
  if (program?.image) return program.image;
  return learningProgramImages[program?.id] || '/images/backgrounds/education-workshop.jpg';
}
