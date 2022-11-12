import FilterFactory from './FilterFactory'
import DishFilter from './DishFilter'
import FilterHelper from './FilterHelper'


export {
  DishFilter,
  FilterFactory,
  FilterHelper,
}

// export const FiltersDOMConfiguration = [
//   {
//     type: RecipeFilter.Seasonal,
//     xpath: '//p[text()="Plus"]/../../..',
//     items: [
//       { label: 'Seasonal dishes', xpath: '//button[text()="Afficher uniquement des recettes de saison"]'}
//     ]
//   },
//   {
//     type: RecipeFilter.Difficulty,
//     xpath: '//p[text()="Difficulté"]/../../..',
//     items: [
//       { label: 'Very easy', xpath: '//button[text()="Très facile"]'},
//       { label: 'Easy', xpath: '//button[text()="Facile"]'},
//       { label: 'Medium', xpath: '//button[text()="Moyen"]'},
//       { label: 'Hard', xpath: '//button[text()="Difficile"]'}
//     ]
//   },
//   {
//     type: RecipeFilter.Duration,
//     xpath: '//p[text()="Type de plat"]/../../..',
//     items: [
//       { label: 'Less than 15mns', xpath: '//button[text()="Moins de 15 minutes"]'},
//       { label: 'Less than 30mns', xpath: '//button[text()="Moins de 30 minutes"]'},
//       { label: 'Less than 45mns', xpath: '//button[text()="Moins de 45 minutes"]'}
//     ]
//   },
//   {
//     type: RecipeFilter.Cost,
//     xpath: '//p[text()="Type de plat"]/../../..',
//     items: [
//       { label: 'Cheap', xpath: '//button[text()="Bon marché"]'},
//       { label: 'Medium-priced', xpath: '//button[text()="Facile"]'},
//       { label: 'Quiet expensive', xpath: '//button[text()="Assez cher"]'}
//     ]
//   }
// ]
