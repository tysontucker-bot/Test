/**
 * IEP Learning Activities — script.js
 * Complete vanilla JS implementation. No frameworks, no build tools.
 * Initialized after DOMContentLoaded.
 */

'use strict';

/* =============================================================
   CONSTANTS
   ============================================================= */

const STUDENTS = [
  { name: 'Ronan',   color: '#E8734A', emoji: '🦁' },
  { name: 'Ayden',   color: '#7C3AED', emoji: '🦊' },
  { name: 'Finnley', color: '#0891B2', emoji: '🐬' },
  { name: 'Caleb',   color: '#EC4899', emoji: '🐸' },
];

const SUBJECTS = ['ELA', 'Math', 'Social Studies', 'Science'];

const SUBJECT_META = {
  'ELA':            { icon: '📖', color: '#f59e0b' },
  'Math':           { icon: '🔢', color: '#6366f1' },
  'Social Studies': { icon: '🌎', color: '#0891b2' },
  'Science':        { icon: '🔬', color: '#22c55e' },
};

const COIN_INFO = {
  penny:   { label: 'Penny',   value: '1¢',  emoji: '🟤', altEmoji: '🪙' },
  nickel:  { label: 'Nickel',  value: '5¢',  emoji: '⚪', altEmoji: '🪙' },
  dime:    { label: 'Dime',    value: '10¢', emoji: '⚪', altEmoji: '🪙' },
  quarter: { label: 'Quarter', value: '25¢', emoji: '🟡', altEmoji: '🪙' },
};

const ACTIVITY_TYPE_LABELS = {
  'letter':              'Missing Letter',
  'word-match':          'Word Matching',
  'cvc':                 'CVC Words',
  'finnley':             'Name Letters',
  'coin-value':          'Coin Recognition',
  'more-less':           'More or Less',
  'picture-match':       'Picture Matching',
  'picture-identify':    'Picture Identification',
  'vocab-match':         'Vocabulary Matching',
  'science-picture':     'Science Pictures',
  'science-sort':        'Category Sorting',
  'number-quantity':     'Number & Quantity',
  'math-operation':      'Addition & Subtraction',
  'science-model':       'Science Models',
  'science-anchor':      'Science Concepts',
  'chronological-order': 'Chronological Order',
};

const DEFAULT_SETTINGS = {
  encourageText:  'Great job! 🎉',
  tryAgainText:   'Try again! 💪',
  completionText: 'You did it! 🌟',
  bgColor:        '#f0f4ff',
  surfaceColor:   '#ffffff',
  textColor:      '#1e293b',
  primaryColor:   '#6366f1',
  secondaryColor: '#94a3b8',
  fontFamily:     "'Segoe UI', system-ui, sans-serif",
  fontSize:       '16px',
  coinPenny:      '',
  coinNickel:     '',
  coinDime:       '',
  coinQuarter:    '',
};

const LS_SETTINGS_KEY = 'iep_settings';
const LS_HISTORY_KEY  = 'iep_history';

/* =============================================================
   ACTIVITY DATA  (all 16 types, 4 students × 4 subjects)
   ============================================================= */

/* Deep-cloneable seed; modifications live in activityData at runtime */
const SEED_DATA = {
  Ronan: {
    ELA: [
      {
        id: 'ronan-ela-1', name: 'Find the Missing Letter', type: 'letter',
        questions: [
          { prompt: 'CA_', word: 'CAT', emoji: '🐱', choices: ['T','B','R','P'], correct: 'T' },
          { prompt: 'DO_', word: 'DOG', emoji: '🐶', choices: ['G','B','P','T'], correct: 'G' },
          { prompt: '_IG', word: 'PIG', emoji: '🐷', choices: ['P','B','D','T'], correct: 'P' },
          { prompt: 'HE_', word: 'HEN', emoji: '🐔', choices: ['N','B','T','M'], correct: 'N' },
          { prompt: 'SU_', word: 'SUN', emoji: '☀️', choices: ['N','B','T','M'], correct: 'N' },
          { prompt: 'CU_', word: 'CUP', emoji: '🥤', choices: ['P','B','T','M'], correct: 'P' },
          { prompt: 'HA_', word: 'HAT', emoji: '🎩', choices: ['T','B','N','M'], correct: 'T' },
          { prompt: '_ED', word: 'BED', emoji: '🛏️', choices: ['B','T','D','M'], correct: 'B' },
        ],
      },
      {
        id: 'ronan-ela-2', name: 'Match CVC Words', type: 'cvc',
        questions: [
          { word: 'CAT', emoji: '🐱', choices: ['CAT','DOG','PIG','HEN'], correct: 'CAT' },
          { word: 'DOG', emoji: '🐶', choices: ['CAT','DOG','HEN','BUG'], correct: 'DOG' },
          { word: 'PIG', emoji: '🐷', choices: ['PIG','HEN','CUP','SUN'], correct: 'PIG' },
          { word: 'HEN', emoji: '🐔', choices: ['HEN','CAT','BED','HAT'], correct: 'HEN' },
          { word: 'CUP', emoji: '🥤', choices: ['CUP','CAT','DOG','PIG'], correct: 'CUP' },
          { word: 'SUN', emoji: '☀️', choices: ['SUN','BED','HAT','HEN'], correct: 'SUN' },
          { word: 'HAT', emoji: '🎩', choices: ['HAT','CAT','SUN','CUP'], correct: 'HAT' },
        ],
      },
    ],
    Math: [
      {
        id: 'ronan-math-1', name: 'Coin Value Recognition', type: 'coin-value',
        questions: [
          { coin: 'penny',   prompt: 'What is this coin?',               choices: ['Penny','Nickel','Dime','Quarter'], correct: 'Penny'   },
          { coin: 'nickel',  prompt: 'What is this coin?',               choices: ['Penny','Nickel','Dime','Quarter'], correct: 'Nickel'  },
          { coin: 'dime',    prompt: 'What is this coin?',               choices: ['Penny','Nickel','Dime','Quarter'], correct: 'Dime'    },
          { coin: 'quarter', prompt: 'What is this coin?',               choices: ['Penny','Nickel','Dime','Quarter'], correct: 'Quarter' },
          { coin: 'penny',   prompt: 'How much is this coin worth?',     choices: ['1¢','5¢','10¢','25¢'],            correct: '1¢'      },
          { coin: 'nickel',  prompt: 'How much is this coin worth?',     choices: ['1¢','5¢','10¢','25¢'],            correct: '5¢'      },
          { coin: 'dime',    prompt: 'How much is this coin worth?',     choices: ['1¢','5¢','10¢','25¢'],            correct: '10¢'     },
          { coin: 'quarter', prompt: 'How much is this coin worth?',     choices: ['1¢','5¢','10¢','25¢'],            correct: '25¢'     },
        ],
      },
    ],
    'Social Studies': [
      {
        id: 'ronan-ss-1', name: 'Social Studies Picture Matching', type: 'picture-match',
        questions: [
          {
            prompt: 'Who helps you when you are sick?',
            choices: [{ emoji:'🩺',label:'Doctor'},{ emoji:'📚',label:'Teacher'},{ emoji:'🚒',label:'Firefighter'},{ emoji:'👮',label:'Police Officer'}],
            correct: 'Doctor',
          },
          {
            prompt: 'Who teaches you at school?',
            choices: [{ emoji:'🩺',label:'Doctor'},{ emoji:'📚',label:'Teacher'},{ emoji:'🚒',label:'Firefighter'},{ emoji:'👮',label:'Police Officer'}],
            correct: 'Teacher',
          },
          {
            prompt: 'Who puts out fires?',
            choices: [{ emoji:'🩺',label:'Doctor'},{ emoji:'📚',label:'Teacher'},{ emoji:'🚒',label:'Firefighter'},{ emoji:'👮',label:'Police Officer'}],
            correct: 'Firefighter',
          },
          {
            prompt: 'Who keeps our neighborhood safe?',
            choices: [{ emoji:'🩺',label:'Doctor'},{ emoji:'📚',label:'Teacher'},{ emoji:'🚒',label:'Firefighter'},{ emoji:'👮',label:'Police Officer'}],
            correct: 'Police Officer',
          },
          {
            prompt: 'Who delivers our letters and packages?',
            choices: [{ emoji:'📬',label:'Mail Carrier'},{ emoji:'🍳',label:'Chef'},{ emoji:'🏗️',label:'Builder'},{ emoji:'🚌',label:'Bus Driver'}],
            correct: 'Mail Carrier',
          },
          {
            prompt: 'Who cooks food at a restaurant?',
            choices: [{ emoji:'📬',label:'Mail Carrier'},{ emoji:'🍳',label:'Chef'},{ emoji:'🏗️',label:'Builder'},{ emoji:'🚌',label:'Bus Driver'}],
            correct: 'Chef',
          },
        ],
      },
    ],
    Science: [
      {
        id: 'ronan-sci-1', name: 'Science Model Identification', type: 'science-model',
        questions: [
          { emoji:'❤️',  prompt:'This organ pumps blood through your body. What is it?',  choices:['Heart','Lungs','Brain','Stomach'],  correct:'Heart'   },
          { emoji:'🫁',  prompt:'You use these to breathe. What are they?',               choices:['Heart','Lungs','Brain','Kidneys'],  correct:'Lungs'   },
          { emoji:'🧠',  prompt:'This organ controls all parts of your body. What is it?',choices:['Heart','Lungs','Brain','Stomach'],  correct:'Brain'   },
          { emoji:'🦷',  prompt:'These help you chew your food. What are they?',          choices:['Teeth','Bones','Nails','Hair'],     correct:'Teeth'   },
          { emoji:'👁️', prompt:'You see with these. What are they?',                     choices:['Ears','Eyes','Nose','Mouth'],       correct:'Eyes'    },
          { emoji:'👂',  prompt:'You hear sounds with these. What are they?',             choices:['Ears','Eyes','Nose','Mouth'],       correct:'Ears'    },
        ],
      },
    ],
  },

  Ayden: {
    ELA: [
      {
        id: 'ayden-ela-1', name: 'Alphabet Matching', type: 'letter',
        questions: [
          { prompt:'A', word:'Uppercase A', emoji:'🔤', choices:['a','b','c','d'], correct:'a', hint:'Match the uppercase to lowercase' },
          { prompt:'B', word:'Uppercase B', emoji:'🔤', choices:['b','a','c','d'], correct:'b', hint:'Match the uppercase to lowercase' },
          { prompt:'C', word:'Uppercase C', emoji:'🔤', choices:['d','c','a','b'], correct:'c', hint:'Match the uppercase to lowercase' },
          { prompt:'D', word:'Uppercase D', emoji:'🔤', choices:['d','c','e','b'], correct:'d', hint:'Match the uppercase to lowercase' },
          { prompt:'E', word:'Uppercase E', emoji:'🔤', choices:['e','f','a','b'], correct:'e', hint:'Match the uppercase to lowercase' },
          { prompt:'F', word:'Uppercase F', emoji:'🔤', choices:['f','g','e','d'], correct:'f', hint:'Match the uppercase to lowercase' },
          { prompt:'G', word:'Uppercase G', emoji:'🔤', choices:['g','h','f','e'], correct:'g', hint:'Match the uppercase to lowercase' },
          { prompt:'H', word:'Uppercase H', emoji:'🔤', choices:['h','g','i','j'], correct:'h', hint:'Match the uppercase to lowercase' },
        ],
      },
      {
        id: 'ayden-ela-2', name: 'CVC Words', type: 'cvc',
        questions: [
          { word:'BIG', emoji:'🐘', choices:['BIG','BAG','BUG','BOG'], correct:'BIG' },
          { word:'FAN', emoji:'🌀', choices:['FAN','FIN','FUN','FEN'], correct:'FAN' },
          { word:'MAP', emoji:'🗺️', choices:['MAP','MOP','MIP','MUP'], correct:'MAP' },
          { word:'RUN', emoji:'🏃', choices:['RUN','RAN','RIN','RON'], correct:'RUN' },
          { word:'TOP', emoji:'🎯', choices:['TOP','TIP','TAP','TUP'], correct:'TOP' },
          { word:'WET', emoji:'💧', choices:['WET','WAT','WIT','WUT'], correct:'WET' },
          { word:'ZAP', emoji:'⚡', choices:['ZAP','ZIP','ZUP','ZOP'], correct:'ZAP' },
        ],
      },
    ],
    Math: [
      {
        id: 'ayden-math-1', name: 'More or Less Comparison', type: 'more-less',
        questions: [
          { prompt:'Which group has MORE?',  groupA:{ label:'Group A', emoji:'🍎', count:5 }, groupB:{ label:'Group B', emoji:'🍎', count:3 }, choices:['Group A','Group B'], correct:'Group A' },
          { prompt:'Which group has LESS?',  groupA:{ label:'Group A', emoji:'⭐', count:2 }, groupB:{ label:'Group B', emoji:'⭐', count:6 }, choices:['Group A','Group B'], correct:'Group A' },
          { prompt:'Which group has MORE?',  groupA:{ label:'Group A', emoji:'🐟', count:4 }, groupB:{ label:'Group B', emoji:'🐟', count:7 }, choices:['Group A','Group B'], correct:'Group B' },
          { prompt:'Which group has LESS?',  groupA:{ label:'Group A', emoji:'🌸', count:8 }, groupB:{ label:'Group B', emoji:'🌸', count:3 }, choices:['Group A','Group B'], correct:'Group B' },
          { prompt:'Which group has MORE?',  groupA:{ label:'Group A', emoji:'🎈', count:6 }, groupB:{ label:'Group B', emoji:'🎈', count:2 }, choices:['Group A','Group B'], correct:'Group A' },
          { prompt:'Which group has LESS?',  groupA:{ label:'Group A', emoji:'🍬', count:5 }, groupB:{ label:'Group B', emoji:'🍬', count:9 }, choices:['Group A','Group B'], correct:'Group A' },
          { prompt:'Which group has MORE?',  groupA:{ label:'Group A', emoji:'🦋', count:3 }, groupB:{ label:'Group B', emoji:'🦋', count:7 }, choices:['Group A','Group B'], correct:'Group B' },
        ],
      },
    ],
    'Social Studies': [
      {
        id: 'ayden-ss-1', name: 'Social Studies Picture Identification', type: 'picture-identify',
        questions: [
          { emoji:'🏫', prompt:'What building is this?',              choices:['School','Hospital','Library','Fire Station'], correct:'School'       },
          { emoji:'🏥', prompt:'What building is this?',              choices:['School','Hospital','Library','Fire Station'], correct:'Hospital'     },
          { emoji:'📚', prompt:'What building do you find books in?', choices:['School','Hospital','Library','Fire Station'], correct:'Library'      },
          { emoji:'🚒', prompt:'Where do firefighters work?',         choices:['School','Hospital','Library','Fire Station'], correct:'Fire Station' },
          { emoji:'🏛️', prompt:'Where do people vote and make laws?', choices:['Museum','Court','City Hall','Bank'],          correct:'City Hall'   },
          { emoji:'🗺️', prompt:'What tool shows us where places are?',choices:['Globe','Map','Compass','Atlas'],              correct:'Map'          },
        ],
      },
    ],
    Science: [
      {
        id: 'ayden-sci-1', name: 'Science Category Sorting', type: 'science-sort',
        questions: [
          { item:'Dog',    emoji:'🐕', prompt:'A Dog is…',       choices:['Living','Non-Living'], correct:'Living'     },
          { item:'Rock',   emoji:'🪨', prompt:'A Rock is…',      choices:['Living','Non-Living'], correct:'Non-Living' },
          { item:'Tree',   emoji:'🌳', prompt:'A Tree is…',      choices:['Living','Non-Living'], correct:'Living'     },
          { item:'Chair',  emoji:'🪑', prompt:'A Chair is…',     choices:['Living','Non-Living'], correct:'Non-Living' },
          { item:'Fish',   emoji:'🐠', prompt:'A Fish is…',      choices:['Living','Non-Living'], correct:'Living'     },
          { item:'Water',  emoji:'💧', prompt:'Water is…',       choices:['Living','Non-Living'], correct:'Non-Living' },
          { item:'Flower', emoji:'🌺', prompt:'A Flower is…',    choices:['Living','Non-Living'], correct:'Living'     },
          { item:'Pencil', emoji:'✏️', prompt:'A Pencil is…',   choices:['Living','Non-Living'], correct:'Non-Living' },
        ],
      },
    ],
  },

  Finnley: {
    ELA: [
      {
        id: 'finnley-ela-1', name: 'Letter Matching in Names', type: 'finnley',
        questions: [
          { prompt:'F_NNLEY', name:'FINNLEY', emoji:'👦', choices:['I','A','E','O'], correct:'I' },
          { prompt:'_ONAN',   name:'RONAN',   emoji:'🦁', choices:['R','B','D','T'], correct:'R' },
          { prompt:'AY_EN',   name:'AYDEN',   emoji:'🦊', choices:['D','B','T','M'], correct:'D' },
          { prompt:'CA_EB',   name:'CALEB',   emoji:'🐸', choices:['L','N','R','T'], correct:'L' },
          { prompt:'FIN_LEY', name:'FINNLEY', emoji:'👦', choices:['N','M','K','L'], correct:'N' },
          { prompt:'RON_N',   name:'RONAN',   emoji:'🦁', choices:['A','E','I','O'], correct:'A' },
          { prompt:'FINN_EY', name:'FINNLEY', emoji:'👦', choices:['L','R','S','T'], correct:'L' },
        ],
      },
      {
        id: 'finnley-ela-2', name: 'Alphabet Recognition', type: 'letter',
        questions: [
          { prompt:'A B _ D', word:'ABCD', emoji:'🔤', choices:['C','E','F','G'], correct:'C', hint:'What letter comes next?' },
          { prompt:'D E _ G', word:'DEFG', emoji:'🔤', choices:['F','H','A','B'], correct:'F', hint:'What letter comes next?' },
          { prompt:'_ I J K', word:'HIJK', emoji:'🔤', choices:['H','G','L','M'], correct:'H', hint:'What letter is missing?' },
          { prompt:'M N _ P', word:'MNOP', emoji:'🔤', choices:['O','Q','L','K'], correct:'O', hint:'What letter comes next?' },
          { prompt:'R S _ U', word:'RSTU', emoji:'🔤', choices:['T','V','Q','W'], correct:'T', hint:'What letter is missing?' },
          { prompt:'W X _ Z', word:'WXYZ', emoji:'🔤', choices:['Y','V','A','B'], correct:'Y', hint:'What letter comes next?' },
          { prompt:'_ B C D', word:'ABCD', emoji:'🔤', choices:['A','E','F','Z'], correct:'A', hint:'What letter starts this?' },
        ],
      },
    ],
    Math: [
      {
        id: 'finnley-math-1', name: 'Number to Quantity Matching', type: 'number-quantity',
        questions: [
          { number:1, prompt:'Which shows 1?',  emoji:'⭐', choices:[1,2,3,4], correct:1 },
          { number:2, prompt:'Which shows 2?',  emoji:'🍎', choices:[1,2,3,4], correct:2 },
          { number:3, prompt:'Which shows 3?',  emoji:'🌸', choices:[2,3,4,5], correct:3 },
          { number:4, prompt:'Which shows 4?',  emoji:'🐠', choices:[3,4,5,6], correct:4 },
          { number:5, prompt:'Which shows 5?',  emoji:'🎈', choices:[4,5,6,7], correct:5 },
          { number:6, prompt:'Which shows 6?',  emoji:'🦋', choices:[5,6,7,8], correct:6 },
          { number:7, prompt:'Which shows 7?',  emoji:'🍬', choices:[6,7,8,9], correct:7 },
          { number:3, prompt:'Which group has exactly 3?', emoji:'🌟', choices:[1,2,3,5], correct:3 },
        ],
      },
    ],
    'Social Studies': [
      {
        id: 'finnley-ss-1', name: 'Vocabulary Picture Matching', type: 'vocab-match',
        questions: [
          {
            word:'Map',
            prompt:'Which picture shows a MAP?',
            choices:[{ emoji:'🗺️',label:'Map'},{ emoji:'🌍',label:'Globe'},{ emoji:'📚',label:'Book'},{ emoji:'✏️',label:'Pencil'}],
            correct:'Map',
          },
          {
            word:'Citizen',
            prompt:'Which picture shows a CITIZEN helping the community?',
            choices:[{ emoji:'🧑‍🤝‍🧑',label:'Citizen'},{ emoji:'🦁',label:'Animal'},{ emoji:'🚗',label:'Vehicle'},{ emoji:'🏔️',label:'Mountain'}],
            correct:'Citizen',
          },
          {
            word:'Rule',
            prompt:'Which picture shows a RULE being followed?',
            choices:[{ emoji:'🚦',label:'Rule'},{ emoji:'🍕',label:'Food'},{ emoji:'⚽',label:'Sport'},{ emoji:'🎸',label:'Music'}],
            correct:'Rule',
          },
          {
            word:'Landmark',
            prompt:'Which picture shows a famous LANDMARK?',
            choices:[{ emoji:'🗽',label:'Landmark'},{ emoji:'🐱',label:'Pet'},{ emoji:'🌮',label:'Food'},{ emoji:'🎒',label:'Backpack'}],
            correct:'Landmark',
          },
          {
            word:'Community',
            prompt:'Which picture shows a COMMUNITY?',
            choices:[{ emoji:'🏘️',label:'Community'},{ emoji:'🏝️',label:'Island'},{ emoji:'🏔️',label:'Mountain'},{ emoji:'🌊',label:'Ocean'}],
            correct:'Community',
          },
        ],
      },
    ],
    Science: [
      {
        id: 'finnley-sci-1', name: 'Science Model Picture Matching', type: 'science-picture',
        questions: [
          { emoji:'🌱', prompt:'What stage of plant growth is a tiny sprout?', choices:['Seedling','Flower','Fruit','Seed'],       correct:'Seedling' },
          { emoji:'🌸', prompt:'When a plant blooms it is called a…',          choices:['Seedling','Flower','Root','Bark'],        correct:'Flower'   },
          { emoji:'🌕', prompt:'This phase of the moon looks fully lit. It is the…', choices:['Full Moon','New Moon','Half Moon','Crescent'], correct:'Full Moon' },
          { emoji:'🌞', prompt:'The center of our solar system is the…',        choices:['Sun','Moon','Earth','Mars'],              correct:'Sun'      },
          { emoji:'🌧️', prompt:'Water falling from clouds is called…',         choices:['Rain','Snow','Fog','Wind'],               correct:'Rain'     },
          { emoji:'❄️', prompt:'Frozen water falling from the sky is called…', choices:['Rain','Snow','Fog','Hail'],               correct:'Snow'     },
        ],
      },
    ],
  },

  Caleb: {
    ELA: [
      {
        id: 'caleb-ela-1', name: 'Word to Picture Matching', type: 'word-match',
        questions: [
          { word:'apple',  emoji:'🍎', choices:['🍎','🍊','🍌','🍇'], correct:'🍎' },
          { word:'cat',    emoji:'🐱', choices:['🐱','🐶','🐷','🐔'], correct:'🐱' },
          { word:'sun',    emoji:'☀️', choices:['☀️','🌙','⭐','🌈'], correct:'☀️' },
          { word:'house',  emoji:'🏠', choices:['🏠','🚗','🌳','⛵'], correct:'🏠' },
          { word:'book',   emoji:'📚', choices:['📚','✏️','🎒','🖊️'], correct:'📚' },
          { word:'fish',   emoji:'🐠', choices:['🐠','🐸','🐢','🦋'], correct:'🐠' },
          { word:'ball',   emoji:'⚽', choices:['⚽','🏀','🎾','🏈'], correct:'⚽' },
          { word:'flower', emoji:'🌸', choices:['🌸','🌻','🌹','🌺'], correct:'🌸' },
        ],
      },
      {
        id: 'caleb-ela-2', name: 'CVC Recognition', type: 'cvc',
        questions: [
          { word:'BIG',  emoji:'🐘', choices:['BIG','BAG','BUG','BOG'],  correct:'BIG'  },
          { word:'HOT',  emoji:'🔥', choices:['HOT','HAT','HIT','HUT'],  correct:'HOT'  },
          { word:'MUD',  emoji:'🟫', choices:['MUD','MAD','MOD','MED'],  correct:'MUD'  },
          { word:'FLY',  emoji:'🪰', choices:['FLY','FRY','FLU','FLO'],  correct:'FLY'  },
          { word:'WEB',  emoji:'🕸️', choices:['WEB','WAB','WIB','WOB'],  correct:'WEB'  },
          { word:'JAM',  emoji:'🍇', choices:['JAM','JIM','JUM','JOM'],  correct:'JAM'  },
          { word:'LOG',  emoji:'🪵', choices:['LOG','LAG','LIG','LUG'],  correct:'LOG'  },
        ],
      },
    ],
    Math: [
      {
        id: 'caleb-math-1', name: 'Addition & Subtraction', type: 'math-operation',
        questions: [
          { equation:'1 + 1 = ?', choices:['1','2','3','4'],   correct:'2' },
          { equation:'2 + 3 = ?', choices:['4','5','6','7'],   correct:'5' },
          { equation:'3 - 1 = ?', choices:['1','2','3','4'],   correct:'2' },
          { equation:'4 + 2 = ?', choices:['5','6','7','8'],   correct:'6' },
          { equation:'5 - 2 = ?', choices:['2','3','4','5'],   correct:'3' },
          { equation:'3 + 4 = ?', choices:['5','6','7','8'],   correct:'7' },
          { equation:'8 - 3 = ?', choices:['4','5','6','7'],   correct:'5' },
          { equation:'6 + 2 = ?', choices:['7','8','9','10'],  correct:'8' },
          { equation:'9 - 4 = ?', choices:['4','5','6','7'],   correct:'5' },
          { equation:'2 + 2 = ?', choices:['2','3','4','5'],   correct:'4' },
        ],
      },
    ],
    'Social Studies': [
      {
        id: 'caleb-ss-1', name: 'Chronological Order', type: 'chronological-order',
        questions: [
          {
            prompt:'Put the morning routine in order:',
            sequence:[
              { label:'Wake Up',      emoji:'😴' },
              { label:'Get Dressed',  emoji:'👕' },
              { label:'Eat Breakfast',emoji:'🥣' },
              { label:'Go to School', emoji:'🚌' },
            ],
          },
          {
            prompt:'Put the seasons in order starting from Spring:',
            sequence:[
              { label:'Spring', emoji:'🌸' },
              { label:'Summer', emoji:'☀️' },
              { label:'Fall',   emoji:'🍂' },
              { label:'Winter', emoji:'❄️' },
            ],
          },
          {
            prompt:'Put the plant life cycle in order:',
            sequence:[
              { label:'Seed',     emoji:'🌰' },
              { label:'Sprout',   emoji:'🌱' },
              { label:'Plant',    emoji:'🌿' },
              { label:'Flower',   emoji:'🌸' },
            ],
          },
          {
            prompt:'Put these parts of the day in order:',
            sequence:[
              { label:'Morning',   emoji:'🌅' },
              { label:'Afternoon', emoji:'🌤️' },
              { label:'Evening',   emoji:'🌆' },
              { label:'Night',     emoji:'🌙' },
            ],
          },
          {
            prompt:'Put these school events in order:',
            sequence:[
              { label:'Arrive at School', emoji:'🏫' },
              { label:'Morning Class',    emoji:'📖' },
              { label:'Lunch',            emoji:'🍱' },
              { label:'Go Home',          emoji:'🏠' },
            ],
          },
        ],
      },
    ],
    Science: [
      {
        id: 'caleb-sci-1', name: 'Science Concept Identification', type: 'science-anchor',
        questions: [
          { prompt:'What do plants need to grow?',                      choices:['Water, Sunlight, Soil','Rain, Wind, Fire','Rocks, Sand, Ice','Salt, Sugar, Milk'],  correct:'Water, Sunlight, Soil' },
          { prompt:'What happens to water when it is very cold?',       choices:['It freezes into ice','It turns into steam','It disappears','It becomes a rock'],    correct:'It freezes into ice'   },
          { prompt:'What do animals need to survive?',                  choices:['Food, Water, Shelter','Paper, Glue, Paint','Wind, Fire, Sand','Rocks, Ice, Salt'], correct:'Food, Water, Shelter'  },
          { prompt:'What makes day and night happen?',                  choices:['Earth spinning','Sun moving','Moon spinning','Stars blinking'],                    correct:'Earth spinning'        },
          { prompt:'Which is a form of energy we get from the Sun?',    choices:['Light and Heat','Snow and Ice','Rocks and Soil','Wind and Rain'],                  correct:'Light and Heat'        },
          { prompt:'What do magnets do to some metal objects?',         choices:['Attract or repel them','Melt them','Make them grow','Turn them invisible'],        correct:'Attract or repel them' },
        ],
      },
    ],
  },
};

/* activityData is the live, editable copy of SEED_DATA */
let activityData = deepClone(SEED_DATA);

/* =============================================================
   APPLICATION STATE
   ============================================================= */

let state = {
  student:          null,   // { name, color, emoji }
  subject:          null,   // string
  activity:         null,   // activity object
  questions:        [],     // shuffled array for this session
  questionIndex:    0,
  score:            0,
  incorrectCount:   0,
  attemptsOnCurrent:0,
  chronoSelected:   [],     // indices into sequence[], in tap order
  chronoDisplayOrder:[],    // shuffled display order (indices into sequence[])
};

/* =============================================================
   SETTINGS
   ============================================================= */

let settings = Object.assign({}, DEFAULT_SETTINGS);

function loadSettings() {
  try {
    const stored = localStorage.getItem(LS_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      settings = Object.assign({}, DEFAULT_SETTINGS, parsed);
    }
  } catch (_) { /* malformed localStorage – use defaults */ }
}

function saveSettings() {
  try { localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
}

function applySettings() {
  const root = document.documentElement.style;
  root.setProperty('--bg-color',        settings.bgColor);
  root.setProperty('--surface-color',   settings.surfaceColor);
  root.setProperty('--text-color',      settings.textColor);
  root.setProperty('--primary-color',   settings.primaryColor);
  root.setProperty('--secondary-color', settings.secondaryColor);
  root.setProperty('--font-family',     settings.fontFamily);
  root.setProperty('--font-size-base',  settings.fontSize);
}

function resetSettings() {
  settings = Object.assign({}, DEFAULT_SETTINGS);
  saveSettings();
  applySettings();
  populateSettingsForm();
}

/* =============================================================
   DOM UTILITIES
   ============================================================= */

const $ = (id) => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = $(id);
  if (target) target.classList.add('active');
}

function showModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.remove('hidden');
  el.removeAttribute('aria-hidden');
}

function hideModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.add('hidden');
  el.setAttribute('aria-hidden', 'true');
}

/** Safe text-node helper; avoids innerHTML injection for user-derived data */
function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = String(text);
  return e;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Fisher-Yates shuffle (returns new array) */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* =============================================================
   INITIALIZATION
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applySettings();
  renderStudentGrid();
  bindGlobalListeners();
});

/* =============================================================
   STUDENT SELECTION
   ============================================================= */

function renderStudentGrid() {
  const grid = $('student-grid');
  if (!grid) return;
  grid.innerHTML = '';

  STUDENTS.forEach(student => {
    const card = el('button', 'student-card');
    card.setAttribute('aria-label', `Select student ${student.name}`);
    card.style.borderColor = student.color;
    card.style.setProperty('--student-color', student.color);

    const emojiEl = el('span', 'student-emoji', student.emoji);
    const nameEl  = el('span', 'student-name', student.name);
    nameEl.style.color = student.color;

    card.appendChild(emojiEl);
    card.appendChild(nameEl);

    card.addEventListener('click', () => selectStudent(student));
    grid.appendChild(card);
  });
}

function selectStudent(student) {
  state.student = student;
  renderSubjectGrid(student);
  showScreen('screen-subject');

  // Update badge
  const badge = $('subject-student-badge');
  if (badge) {
    badge.textContent = `${student.emoji} ${student.name}`;
    badge.style.borderLeft = `4px solid ${student.color}`;
    badge.style.color = student.color;
  }
}

/* =============================================================
   SUBJECT SELECTION
   ============================================================= */

function renderSubjectGrid(student) {
  const grid = $('subject-grid');
  if (!grid) return;
  grid.innerHTML = '';

  SUBJECTS.forEach(subject => {
    const meta = SUBJECT_META[subject] || { icon: '📌', color: '#6366f1' };
    const card = el('button', 'subject-card');
    card.setAttribute('aria-label', `Select subject ${subject}`);
    card.style.borderColor = meta.color;

    const iconEl = el('span', 'subject-icon', meta.icon);
    const nameEl = el('span', 'subject-name', subject);

    card.appendChild(iconEl);
    card.appendChild(nameEl);
    card.addEventListener('click', () => selectSubject(student, subject));
    grid.appendChild(card);
  });
}

function selectSubject(student, subject) {
  state.subject = subject;
  renderActivityList(student, subject);
  showScreen('screen-activity');

  const title = $('activity-screen-title');
  const meta  = SUBJECT_META[subject] || { icon: '📌' };
  if (title) title.textContent = `${meta.icon} ${subject} Activities`;
}

/* =============================================================
   ACTIVITY SELECTION
   ============================================================= */

function renderActivityList(student, subject) {
  const list = $('activity-list');
  if (!list) return;
  list.innerHTML = '';

  const activities = (activityData[student.name] || {})[subject] || [];

  if (!activities.length) {
    list.appendChild(el('p', 'text-muted text-center', 'No activities found.'));
    return;
  }

  activities.forEach(activity => {
    const card = el('button', 'activity-card');
    card.setAttribute('aria-label', `Start activity: ${activity.name}`);
    card.style.borderColor = student.color;

    const icon  = el('span', 'activity-card-icon', SUBJECT_META[subject]?.icon || '🎯');
    const text  = el('div',  'activity-card-text');
    const name  = el('div',  'activity-card-name', activity.name);
    const type  = el('div',  'activity-card-type', ACTIVITY_TYPE_LABELS[activity.type] || activity.type);
    const arrow = el('span', 'activity-card-arrow', '→');

    text.appendChild(name);
    text.appendChild(type);
    card.appendChild(icon);
    card.appendChild(text);
    card.appendChild(arrow);

    card.addEventListener('click', () => startActivity(activity));
    list.appendChild(card);
  });
}

/* =============================================================
   GAME: INITIALIZATION
   ============================================================= */

function startActivity(activity) {
  if (!activity || !Array.isArray(activity.questions) || !activity.questions.length) {
    alert('This activity has no questions yet.');
    return;
  }

  state.activity          = activity;
  state.questions         = shuffleArray(activity.questions);
  state.questionIndex     = 0;
  state.score             = 0;
  state.incorrectCount    = 0;
  state.attemptsOnCurrent = 0;
  state.chronoSelected    = [];
  state.chronoDisplayOrder= [];

  const titleEl = $('game-title-display');
  if (titleEl) titleEl.textContent = activity.name;

  // Color progress dots with student color
  document.documentElement.style.setProperty(
    '--student-dot-color', state.student ? state.student.color : settings.primaryColor
  );

  showScreen('screen-game');
  renderProgressDots();
  renderQuestion(0);
}

/* =============================================================
   GAME: PROGRESS DOTS
   ============================================================= */

function renderProgressDots() {
  const container = $('progress-dots');
  if (!container) return;
  container.innerHTML = '';

  const total = state.questions.length;
  const color = state.student ? state.student.color : settings.primaryColor;

  state.questions.forEach((_, i) => {
    const dot = el('span', 'progress-dot');
    dot.setAttribute('aria-label', `Question ${i + 1}`);
    if (i < state.questionIndex)       dot.classList.add('completed');
    else if (i === state.questionIndex) dot.classList.add('current');

    if (i <= state.questionIndex) dot.style.background = color;

    container.appendChild(dot);
  });

  updateGameHeader();
}

function updateGameHeader() {
  const scoreEl = $('game-score-display');
  if (scoreEl) {
    const total = state.questions.length;
    scoreEl.textContent = `Score: ${state.score} / ${total}  •  Q${state.questionIndex + 1} of ${total}`;
  }
}

/* =============================================================
   GAME: QUESTION RENDERING  (dispatcher)
   ============================================================= */

function renderQuestion(index) {
  const q = state.questions[index];
  if (!q) { showCompletion(); return; }

  state.attemptsOnCurrent = 0;
  state.chronoSelected    = [];

  const promptCard  = $('prompt-card');
  const choicesGrid = $('choices-grid');
  if (!promptCard || !choicesGrid) return;

  promptCard.innerHTML  = '';
  choicesGrid.innerHTML = '';
  choicesGrid.className = 'choices-grid';    // reset custom cols
  hideFeedback();

  renderProgressDots();

  const type = state.activity.type;

  switch (type) {
    case 'letter':              renderLetterQ(q, promptCard, choicesGrid);              break;
    case 'word-match':          renderWordMatchQ(q, promptCard, choicesGrid);           break;
    case 'cvc':                 renderCVCQ(q, promptCard, choicesGrid);                 break;
    case 'finnley':             renderFinnleyQ(q, promptCard, choicesGrid);             break;
    case 'coin-value':          renderCoinValueQ(q, promptCard, choicesGrid);           break;
    case 'more-less':           renderMoreLessQ(q, promptCard, choicesGrid);            break;
    case 'picture-match':       renderPictureMatchQ(q, promptCard, choicesGrid);        break;
    case 'picture-identify':    renderPictureIdentifyQ(q, promptCard, choicesGrid);     break;
    case 'vocab-match':         renderVocabMatchQ(q, promptCard, choicesGrid);          break;
    case 'science-picture':     renderSciencePictureQ(q, promptCard, choicesGrid);      break;
    case 'science-sort':        renderScienceSortQ(q, promptCard, choicesGrid);         break;
    case 'number-quantity':     renderNumberQuantityQ(q, promptCard, choicesGrid);      break;
    case 'math-operation':      renderMathOperationQ(q, promptCard, choicesGrid);       break;
    case 'science-model':       renderScienceModelQ(q, promptCard, choicesGrid);        break;
    case 'science-anchor':      renderScienceAnchorQ(q, promptCard, choicesGrid);       break;
    case 'chronological-order': renderChronologicalOrderQ(q, promptCard, choicesGrid);  break;
    default:
      promptCard.appendChild(el('p', 'prompt-question', 'Unknown activity type: ' + type));
  }
}

/* =============================================================
   ACTIVITY RENDERERS
   ============================================================= */

/* --- LETTER: find the missing letter (e.g., "CA_") --- */
function renderLetterQ(q, promptCard, choicesGrid) {
  if (q.emoji) promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('div', 'big-text', q.prompt));
  promptCard.appendChild(el('p', 'prompt-hint', q.hint || 'Find the missing letter!'));

  const shuffled = shuffleArray([...q.choices]);
  choicesGrid.classList.add('cols-4');
  shuffled.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('aria-label', `Choose letter ${letter}`);
    btn.dataset.choice = letter;
    btn.appendChild(el('span', 'choice-letter-text', letter));
    btn.addEventListener('click', () => handleAnswer(letter, btn));
    choicesGrid.appendChild(btn);
  });
}

/* --- WORD-MATCH: show word, pick the right emoji picture --- */
function renderWordMatchQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('p', 'prompt-hint', 'Match the word to the picture:'));
  promptCard.appendChild(el('div', 'medium-text', q.word ? q.word.toUpperCase() : ''));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, choice, null);
    choicesGrid.appendChild(btn);
  });
}

/* --- CVC: show emoji picture, pick the right word --- */
function renderCVCQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('p', 'prompt-hint', 'What word matches this picture?'));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(word => {
    const btn = makeChoiceBtn(word, null, word);
    choicesGrid.appendChild(btn);
  });
}

/* --- FINNLEY: missing letter in a name --- */
function renderFinnleyQ(q, promptCard, choicesGrid) {
  if (q.emoji) promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('div', 'big-text', q.prompt));
  promptCard.appendChild(el('p', 'prompt-hint', 'Find the missing letter in the name!'));

  const shuffled = shuffleArray([...q.choices]);
  choicesGrid.classList.add('cols-4');
  shuffled.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('aria-label', `Choose letter ${letter}`);
    btn.dataset.choice = letter;
    btn.appendChild(el('span', 'choice-letter-text', letter));
    btn.addEventListener('click', () => handleAnswer(letter, btn));
    choicesGrid.appendChild(btn);
  });
}

/* --- COIN-VALUE: show coin, answer name or value --- */
function renderCoinValueQ(q, promptCard, choicesGrid) {
  const wrap = el('div', 'coin-display-wrap');

  // Coin visual: prefer custom image, fall back to emoji
  const coinKey = q.coin;
  const settingsKey = 'coin' + (coinKey.charAt(0).toUpperCase() + coinKey.slice(1));
  const imageUrl = settings[settingsKey];
  const info = COIN_INFO[coinKey] || { label: coinKey, value: '?', altEmoji: '🪙' };

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = info.label;
    img.className = 'coin-image';
    img.onerror = function () {
      this.replaceWith(el('span', 'coin-emoji-big', info.altEmoji));
    };
    wrap.appendChild(img);
  } else {
    wrap.appendChild(el('span', 'coin-emoji-big', info.altEmoji));
  }

  const badge = el('span', 'coin-label-badge', info.label);
  wrap.appendChild(badge);
  promptCard.appendChild(wrap);
  promptCard.appendChild(el('p', 'prompt-question', q.prompt || 'What is this coin?'));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    choicesGrid.appendChild(btn);
  });
}

/* --- MORE-LESS: compare two groups --- */
function renderMoreLessQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  const groups = el('div', 'more-less-groups');

  [q.groupA, q.groupB].forEach(grp => {
    const groupEl   = el('div', 'more-less-group');
    const labelEl   = el('div', 'more-less-group-label', grp.label);
    const itemsEl   = el('div', 'more-less-items');
    const countEl   = el('div', 'more-less-count', `(${grp.count})`);

    // Render individual emoji items
    const count = Math.min(grp.count, 12); // cap display at 12 for layout
    for (let i = 0; i < count; i++) {
      itemsEl.appendChild(el('span', '', grp.emoji));
    }

    groupEl.appendChild(labelEl);
    groupEl.appendChild(itemsEl);
    groupEl.appendChild(countEl);
    groups.appendChild(groupEl);
  });

  promptCard.appendChild(groups);

  choicesGrid.classList.add('cols-2');
  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    choicesGrid.appendChild(btn);
  });
}

/* --- PICTURE-MATCH: description → pick picture --- */
function renderPictureMatchQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice.label, choice.emoji, choice.label);
    choicesGrid.appendChild(btn);
  });
}

/* --- PICTURE-IDENTIFY: picture → pick answer --- */
function renderPictureIdentifyQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    choicesGrid.appendChild(btn);
  });
}

/* --- VOCAB-MATCH: word → pick picture --- */
function renderVocabMatchQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('div', 'medium-text', q.word));
  promptCard.appendChild(el('p', 'prompt-hint', q.prompt || 'Which picture matches this word?'));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice.label, choice.emoji, choice.label);
    choicesGrid.appendChild(btn);
  });
}

/* --- SCIENCE-PICTURE: picture → identify --- */
function renderSciencePictureQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    choicesGrid.appendChild(btn);
  });
}

/* --- SCIENCE-SORT: sort item into category --- */
function renderScienceSortQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('div', 'medium-text', q.item));
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  choicesGrid.classList.add('cols-2');
  q.choices.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    choicesGrid.appendChild(btn);
  });
}

/* --- NUMBER-QUANTITY: show number, pick matching quantity of dots --- */
function renderNumberQuantityQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('div', 'number-big', String(q.number)));
  promptCard.appendChild(el('p', 'prompt-hint', q.prompt || 'Which shows the right amount?'));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(count => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('aria-label', `Choose ${count} ${q.emoji || '⭐'}`);
    btn.dataset.choice = String(count);

    const dots = el('span', 'quantity-display', (q.emoji || '⭐').repeat(Math.min(count, 10)));
    const num  = el('span', 'text-muted', `(${count})`);
    num.style.fontSize = '0.7em';
    btn.appendChild(dots);
    btn.appendChild(num);

    btn.addEventListener('click', () => handleAnswer(String(count), btn));
    choicesGrid.appendChild(btn);
  });
}

/* --- MATH-OPERATION: equation → pick answer --- */
function renderMathOperationQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('div', 'prompt-equation', q.equation));
  promptCard.appendChild(el('p', 'prompt-hint', 'Choose the correct answer'));

  choicesGrid.classList.add('cols-4');
  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('aria-label', `Answer ${choice}`);
    btn.dataset.choice = choice;
    btn.appendChild(el('span', 'choice-letter-text', choice));
    btn.addEventListener('click', () => handleAnswer(choice, btn));
    choicesGrid.appendChild(btn);
  });
}

/* --- SCIENCE-MODEL: emoji model → identify --- */
function renderScienceModelQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('span', 'big-emoji', q.emoji));
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    choicesGrid.appendChild(btn);
  });
}

/* --- SCIENCE-ANCHOR: concept question → pick answer --- */
function renderScienceAnchorQ(q, promptCard, choicesGrid) {
  promptCard.appendChild(el('p', 'prompt-question', q.prompt));

  choicesGrid.classList.add('cols-1');
  const shuffled = shuffleArray([...q.choices]);
  shuffled.forEach(choice => {
    const btn = makeChoiceBtn(choice, null, choice);
    btn.style.textAlign = 'left';
    btn.style.justifyContent = 'flex-start';
    btn.style.padding = '14px 20px';
    choicesGrid.appendChild(btn);
  });
}

/* --- CHRONOLOGICAL-ORDER: tap items in sequence --- */
function renderChronologicalOrderQ(q, promptCard, choicesGrid) {
  if (!q.sequence || !q.sequence.length) {
    promptCard.appendChild(el('p', 'text-muted', 'No sequence data.'));
    return;
  }

  promptCard.appendChild(el('p', 'prompt-question', q.prompt));
  const hint = el('p', 'chrono-instruction', `Tap the items in the correct order (1 → ${q.sequence.length})`);
  promptCard.appendChild(hint);

  // Build shuffled display order
  const n = q.sequence.length;
  state.chronoDisplayOrder = shuffleArray([...Array(n).keys()]);
  state.chronoSelected     = [];

  // Replace choices-grid with chrono-grid layout
  choicesGrid.className = 'choices-grid chrono-grid';

  state.chronoDisplayOrder.forEach((seqIdx, displayPos) => {
    const item = q.sequence[seqIdx];
    const btn  = document.createElement('button');
    btn.className = 'choice-btn chrono-btn';
    btn.setAttribute('aria-label', `Select ${item.label}`);
    btn.dataset.seqIndex = String(seqIdx);
    btn.id = `chrono-btn-${seqIdx}`;

    const numSpan = el('span', 'chrono-num hidden', '');
    numSpan.id = `chrono-num-${seqIdx}`;

    btn.appendChild(numSpan);
    btn.appendChild(el('span', 'chrono-emoji', item.emoji));
    btn.appendChild(el('span', 'chrono-label', item.label));

    btn.addEventListener('click', () => handleChronologicalTap(seqIdx, btn));
    choicesGrid.appendChild(btn);
  });
}

/* =============================================================
   CHOICE BUTTON FACTORY
   ============================================================= */

/**
 * Creates a standard choice button.
 * @param {string} value    – data-choice value used in answer checking
 * @param {string|null} emojiText – emoji displayed prominently (or null)
 * @param {string|null} labelText – text label below emoji (or null)
 */
function makeChoiceBtn(value, emojiText, labelText) {
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.setAttribute('aria-label', `Choose ${labelText || emojiText || value}`);
  btn.dataset.choice = value;

  if (emojiText) btn.appendChild(el('span', 'choice-emoji-big', emojiText));
  if (labelText) btn.appendChild(el('span', 'choice-word-text', labelText));

  btn.addEventListener('click', () => handleAnswer(value, btn));
  return btn;
}

/* =============================================================
   GAME: ANSWER HANDLING
   ============================================================= */

function handleAnswer(choice, btn) {
  // Prevent answering if already correct (avoid double-clicks during animation)
  if (btn.classList.contains('correct')) return;

  const q       = state.questions[state.questionIndex];
  const correct = String(q.correct);
  const chosen  = String(choice);
  const isRight = chosen === correct;

  state.attemptsOnCurrent++;

  if (isRight) {
    // Mark button as correct
    btn.classList.add('correct');
    // Disable ALL choices to prevent double-answers
    disableAllChoices();

    if (state.attemptsOnCurrent === 1) state.score++;
    showFeedback(true);
    setTimeout(() => advanceQuestion(), 1600);
  } else {
    state.incorrectCount++;
    btn.classList.add('wrong');
    btn.disabled = true; // disable only this wrong choice
    showFeedback(false);
  }
}

/* --- Chronological Order special handler --- */
function handleChronologicalTap(seqIdx, btn) {
  if (btn.disabled || btn.classList.contains('selected')) return;

  const tapOrder = state.chronoSelected.length + 1;
  state.chronoSelected.push(seqIdx);

  btn.classList.add('selected');
  const numEl = document.getElementById(`chrono-num-${seqIdx}`);
  if (numEl) {
    numEl.textContent = String(tapOrder);
    numEl.classList.remove('hidden');
  }

  const q = state.questions[state.questionIndex];
  if (state.chronoSelected.length === q.sequence.length) {
    // All items tapped — check order
    checkChronologicalOrder(q);
  }
}

function checkChronologicalOrder(q) {
  const n       = q.sequence.length;
  const correct = [...Array(n).keys()]; // [0,1,2,...,n-1]
  const isRight = state.chronoSelected.every((v, i) => v === correct[i]);

  if (isRight) {
    // Mark all buttons correct
    state.chronoDisplayOrder.forEach(seqIdx => {
      const btn = document.getElementById(`chrono-btn-${seqIdx}`);
      if (btn) { btn.classList.add('selected-correct'); btn.disabled = true; }
    });
    // Award a point only if this is the first attempt (no wrong tries)
    if (state.attemptsOnCurrent === 0) state.score++;
    showFeedback(true);
    setTimeout(() => advanceQuestion(), 1700);
  } else {
    state.incorrectCount++;
    state.attemptsOnCurrent++;
    // Flash all selected as wrong, then reset
    state.chronoDisplayOrder.forEach(seqIdx => {
      const btn = document.getElementById(`chrono-btn-${seqIdx}`);
      if (btn && btn.classList.contains('selected')) {
        btn.classList.add('selected-wrong');
      }
    });
    showFeedback(false);
    setTimeout(() => {
      // Reset selection
      state.chronoSelected = [];
      state.chronoDisplayOrder.forEach(seqIdx => {
        const btn = document.getElementById(`chrono-btn-${seqIdx}`);
        if (btn) {
          btn.classList.remove('selected', 'selected-wrong');
          btn.disabled = false;
          const numEl = document.getElementById(`chrono-num-${seqIdx}`);
          if (numEl) { numEl.textContent = ''; numEl.classList.add('hidden'); }
        }
      });
    }, 1000);
  }
}

function disableAllChoices() {
  const grid = $('choices-grid');
  if (!grid) return;
  grid.querySelectorAll('.choice-btn').forEach(btn => { btn.disabled = true; });
}

/* =============================================================
   GAME: FEEDBACK OVERLAY
   ============================================================= */

function showFeedback(isCorrect) {
  const overlay = $('feedback-overlay');
  const msg     = $('feedback-message');
  if (!overlay || !msg) return;

  msg.textContent = isCorrect ? settings.encourageText : settings.tryAgainText;
  overlay.className = `feedback-overlay ${isCorrect ? '' : 'feedback-wrong'}`;
  overlay.classList.remove('hidden');

  // Auto-hide wrong feedback quickly so student can retry
  if (!isCorrect) {
    setTimeout(hideFeedback, 900);
  }
}

function hideFeedback() {
  const overlay = $('feedback-overlay');
  if (overlay) overlay.classList.add('hidden');
}

/* =============================================================
   GAME: ADVANCE QUESTION
   ============================================================= */

function advanceQuestion() {
  hideFeedback();
  state.questionIndex++;
  if (state.questionIndex >= state.questions.length) {
    showCompletion();
  } else {
    renderQuestion(state.questionIndex);
  }
}

/* =============================================================
   COMPLETION SCREEN
   ============================================================= */

function showCompletion() {
  const total    = state.questions.length;
  const score    = state.score;
  const pct      = total > 0 ? Math.round((score / total) * 100) : 0;

  const headingEl = $('completion-heading');
  const scoreEl   = $('completion-score-display');
  const statEl    = $('completion-stat-row');
  const iconEl    = $('completion-icon');

  if (headingEl) headingEl.textContent = settings.completionText;
  if (scoreEl)   scoreEl.textContent   = `${score} / ${total}`;
  if (statEl)    statEl.textContent    = `${pct}% correct  •  ${state.incorrectCount} mistake${state.incorrectCount !== 1 ? 's' : ''}`;

  // Trophy emoji based on performance
  if (iconEl) {
    iconEl.textContent = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '⭐';
  }

  // Tint card with student color
  const card = document.querySelector('.completion-card');
  if (card && state.student) {
    card.style.borderTop = `6px solid ${state.student.color}`;
  }

  saveSession();
  showScreen('screen-completion');
}

function saveSession() {
  const record = {
    date:           new Date().toISOString(),
    student_name:   state.student ? state.student.name : 'Unknown',
    task_name:      state.activity ? state.activity.name : 'Unknown',
    correct_count:  state.score,
    incorrect_count:state.incorrectCount,
    total:          state.questions.length,
  };
  try {
    const history = getHistory();
    history.unshift(record);
    // Keep last 100 sessions
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch (_) {}
}

function getHistory() {
  try {
    const stored = localStorage.getItem(LS_HISTORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return [];
}

/* =============================================================
   SETTINGS MODAL
   ============================================================= */

function openSettings() {
  populateSettingsForm();
  showModal('modal-settings');
}

function populateSettingsForm() {
  setValue('set-encourage',    settings.encourageText);
  setValue('set-tryagain',     settings.tryAgainText);
  setValue('set-completion',   settings.completionText);
  setValue('set-bg-color',     settings.bgColor);
  setValue('set-surface-color',settings.surfaceColor);
  setValue('set-text-color',   settings.textColor);
  setValue('set-primary-color',settings.primaryColor);
  setValue('set-secondary-color', settings.secondaryColor);
  setValue('set-font-family',  settings.fontFamily);
  setValue('set-font-size',    settings.fontSize);
  setValue('set-coin-penny',   settings.coinPenny);
  setValue('set-coin-nickel',  settings.coinNickel);
  setValue('set-coin-dime',    settings.coinDime);
  setValue('set-coin-quarter', settings.coinQuarter);
}

function readAndSaveSettings() {
  settings.encourageText   = getVal('set-encourage')      || DEFAULT_SETTINGS.encourageText;
  settings.tryAgainText    = getVal('set-tryagain')       || DEFAULT_SETTINGS.tryAgainText;
  settings.completionText  = getVal('set-completion')     || DEFAULT_SETTINGS.completionText;
  settings.bgColor         = getVal('set-bg-color')       || DEFAULT_SETTINGS.bgColor;
  settings.surfaceColor    = getVal('set-surface-color')  || DEFAULT_SETTINGS.surfaceColor;
  settings.textColor       = getVal('set-text-color')     || DEFAULT_SETTINGS.textColor;
  settings.primaryColor    = getVal('set-primary-color')  || DEFAULT_SETTINGS.primaryColor;
  settings.secondaryColor  = getVal('set-secondary-color')|| DEFAULT_SETTINGS.secondaryColor;
  settings.fontFamily      = getVal('set-font-family')    || DEFAULT_SETTINGS.fontFamily;
  settings.fontSize        = getVal('set-font-size')      || DEFAULT_SETTINGS.fontSize;
  settings.coinPenny       = getVal('set-coin-penny')   || '';
  settings.coinNickel      = getVal('set-coin-nickel')  || '';
  settings.coinDime        = getVal('set-coin-dime')    || '';
  settings.coinQuarter     = getVal('set-coin-quarter') || '';
  saveSettings();
  applySettings();
  hideModal('modal-settings');
}

function setValue(id, val) {
  const el = $(id);
  if (el) el.value = val || '';
}

function getVal(id) {
  const el = $(id);
  return el ? el.value : '';
}

/* =============================================================
   ACTIVITY EDITOR MODAL
   ============================================================= */

function openEditor() {
  if (!state.activity) { alert('No activity is active.'); return; }
  renderEditorBody();
  showModal('modal-editor');
}

function renderEditorBody() {
  const body = $('editor-body');
  if (!body) return;
  body.innerHTML = '';

  const act = state.activity;
  const titleEl = el('p', 'prompt-hint', `Activity: ${act.name} · Type: ${act.type}`);
  titleEl.style.marginBottom = '16px';
  body.appendChild(titleEl);

  act.questions.forEach((q, qi) => {
    const block = el('div', 'editor-question-block');
    const heading = el('h4', '', `Question ${qi + 1}`);
    block.appendChild(heading);

    const fields = getEditorFields(act.type, q);
    fields.forEach(f => {
      const label = el('label', 'editor-field-label', f.label);
      let input;
      if (f.type === 'select' && f.options) {
        input = document.createElement('select');
        input.className = 'editor-input';
        f.options.forEach(opt => {
          const o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          if (opt === f.value) o.selected = true;
          input.appendChild(o);
        });
      } else {
        input = document.createElement('input');
        input.type  = f.type || 'text';
        input.className = 'editor-input';
        input.value = f.value !== undefined ? String(f.value) : '';
        if (f.placeholder) input.placeholder = f.placeholder;
      }
      input.dataset.qi    = String(qi);
      input.dataset.field = f.key;
      label.appendChild(input);
      block.appendChild(label);
    });

    // Sequence editor for chronological-order
    if (act.type === 'chronological-order' && q.sequence) {
      const seqHeading = el('p', 'editor-field-label', 'Sequence Items (in correct order):');
      block.appendChild(seqHeading);
      q.sequence.forEach((item, si) => {
        const row = el('div', 'editor-sequence-item');
        const num = el('span', 'editor-seq-num', String(si + 1));
        const emojiInput = document.createElement('input');
        emojiInput.type  = 'text';
        emojiInput.className = 'editor-input editor-input-sm';
        emojiInput.value = item.emoji || '';
        emojiInput.placeholder = 'Emoji';
        emojiInput.dataset.qi     = String(qi);
        emojiInput.dataset.field  = `seq_emoji_${si}`;
        const labelInput = document.createElement('input');
        labelInput.type  = 'text';
        labelInput.className = 'editor-input editor-input-sm';
        labelInput.value = item.label || '';
        labelInput.placeholder = 'Label';
        labelInput.dataset.qi    = String(qi);
        labelInput.dataset.field = `seq_label_${si}`;
        row.appendChild(num);
        row.appendChild(emojiInput);
        row.appendChild(labelInput);
        block.appendChild(row);
      });
    }

    body.appendChild(block);
  });
}

function getEditorFields(type, q) {
  const choicesStr = Array.isArray(q.choices)
    ? q.choices.map(c => (typeof c === 'object' ? `${c.emoji}:${c.label}` : c)).join(', ')
    : '';

  const base = [
    { key: 'correct', label: 'Correct Answer', type: 'text', value: q.correct, placeholder: 'exact match of a choice' },
  ];

  switch (type) {
    case 'letter':
    case 'finnley':
      return [
        { key: 'prompt',  label: 'Prompt (word with _ blank)', type: 'text', value: q.prompt },
        { key: 'emoji',   label: 'Emoji',                      type: 'text', value: q.emoji  },
        { key: 'choices', label: 'Choices (comma-separated)',  type: 'text', value: choicesStr },
        ...base,
      ];
    case 'word-match':
    case 'cvc':
      return [
        { key: 'word',    label: 'Word',                       type: 'text', value: q.word  },
        { key: 'emoji',   label: 'Emoji',                      type: 'text', value: q.emoji },
        { key: 'choices', label: 'Choices (comma-separated)',  type: 'text', value: choicesStr },
        ...base,
      ];
    case 'coin-value':
      return [
        { key: 'coin',    label: 'Coin Type', type: 'select', value: q.coin,
          options: ['penny','nickel','dime','quarter'] },
        { key: 'prompt',  label: 'Question',  type: 'text', value: q.prompt },
        { key: 'choices', label: 'Choices (comma-separated)', type: 'text', value: choicesStr },
        ...base,
      ];
    case 'more-less':
      return [
        { key: 'prompt',        label: 'Question',       type: 'text',   value: q.prompt },
        { key: 'groupA_label',  label: 'Group A Label',  type: 'text',   value: q.groupA && q.groupA.label },
        { key: 'groupA_emoji',  label: 'Group A Emoji',  type: 'text',   value: q.groupA && q.groupA.emoji },
        { key: 'groupA_count',  label: 'Group A Count',  type: 'number', value: q.groupA && q.groupA.count },
        { key: 'groupB_label',  label: 'Group B Label',  type: 'text',   value: q.groupB && q.groupB.label },
        { key: 'groupB_emoji',  label: 'Group B Emoji',  type: 'text',   value: q.groupB && q.groupB.emoji },
        { key: 'groupB_count',  label: 'Group B Count',  type: 'number', value: q.groupB && q.groupB.count },
        ...base,
      ];
    case 'picture-match':
    case 'vocab-match':
      return [
        { key: 'prompt',  label: 'Question / Word',                   type: 'text', value: q.prompt || q.word },
        { key: 'choices', label: 'Choices (emoji:label, comma-sep)',   type: 'text', value: choicesStr },
        ...base,
      ];
    case 'picture-identify':
    case 'science-picture':
    case 'science-model':
      return [
        { key: 'emoji',   label: 'Emoji',                            type: 'text', value: q.emoji  },
        { key: 'prompt',  label: 'Question',                         type: 'text', value: q.prompt },
        { key: 'choices', label: 'Choices (comma-separated)',        type: 'text', value: choicesStr },
        ...base,
      ];
    case 'science-sort':
      return [
        { key: 'item',    label: 'Item Name',   type: 'text', value: q.item  },
        { key: 'emoji',   label: 'Emoji',        type: 'text', value: q.emoji },
        { key: 'prompt',  label: 'Question',     type: 'text', value: q.prompt },
        { key: 'choices', label: 'Categories (comma-separated)', type: 'text', value: choicesStr },
        ...base,
      ];
    case 'number-quantity':
      return [
        { key: 'number',  label: 'Number',      type: 'number', value: q.number },
        { key: 'emoji',   label: 'Emoji',        type: 'text',   value: q.emoji  },
        { key: 'prompt',  label: 'Question',     type: 'text',   value: q.prompt },
        { key: 'choices', label: 'Choices (comma-separated numbers)', type: 'text', value: choicesStr },
        ...base,
      ];
    case 'math-operation':
      return [
        { key: 'equation', label: 'Equation (e.g. 2 + 3 = ?)', type: 'text', value: q.equation },
        { key: 'choices',  label: 'Choices (comma-separated)',  type: 'text', value: choicesStr },
        ...base,
      ];
    case 'science-anchor':
      return [
        { key: 'prompt',  label: 'Question',                   type: 'text', value: q.prompt },
        { key: 'choices', label: 'Choices (comma-separated)',  type: 'text', value: choicesStr },
        ...base,
      ];
    case 'chronological-order':
      return [
        { key: 'prompt', label: 'Instruction Prompt', type: 'text', value: q.prompt },
        // Sequence items are rendered separately
      ];
    default:
      return [
        { key: 'prompt',  label: 'Prompt',  type: 'text', value: q.prompt  },
        { key: 'choices', label: 'Choices', type: 'text', value: choicesStr },
        ...base,
      ];
  }
}

function saveEditorChanges() {
  const body = $('editor-body');
  if (!body) return;

  const act = state.activity;
  const inputs = body.querySelectorAll('[data-qi][data-field]');

  inputs.forEach(input => {
    const qi    = parseInt(input.dataset.qi, 10);
    const field = input.dataset.field;
    const value = input.value.trim();
    const q     = act.questions[qi];
    if (!q) return;

    // Handle sequence fields
    if (field.startsWith('seq_')) {
      const parts = field.split('_'); // seq, emoji/label, index
      const prop  = parts[1];        // 'emoji' or 'label'
      const si    = parseInt(parts[2], 10);
      if (q.sequence && q.sequence[si]) q.sequence[si][prop] = value;
      return;
    }

    // Handle nested more-less fields
    if (field.startsWith('groupA_')) {
      const prop = field.replace('groupA_', '');
      if (!q.groupA) q.groupA = {};
      q.groupA[prop] = prop === 'count' ? parseInt(value, 10) || 0 : value;
      return;
    }
    if (field.startsWith('groupB_')) {
      const prop = field.replace('groupB_', '');
      if (!q.groupB) q.groupB = {};
      q.groupB[prop] = prop === 'count' ? parseInt(value, 10) || 0 : value;
      return;
    }

    // choices: parse comma-separated, handling emoji:label format
    if (field === 'choices') {
      const parts = value.split(',').map(s => s.trim()).filter(Boolean);
      const type  = act.type;
      if (type === 'picture-match' || type === 'vocab-match') {
        q.choices = parts.map(part => {
          const colonIdx = part.indexOf(':');
          if (colonIdx > -1) {
            return { emoji: part.slice(0, colonIdx).trim(), label: part.slice(colonIdx + 1).trim() };
          }
          return { emoji: '', label: part };
        });
      } else if (type === 'number-quantity') {
        q.choices = parts.map(p => parseInt(p, 10) || 0);
      } else {
        q.choices = parts;
      }
      return;
    }

    // number fields
    if (field === 'number') {
      q[field] = parseInt(value, 10) || 0;
      return;
    }

    // all other plain fields
    q[field] = value;
  });

  // Re-sync state.questions in case order changed
  state.questions = shuffleArray(act.questions);
  state.questionIndex = 0;
  state.score = 0;
  state.incorrectCount = 0;
  state.attemptsOnCurrent = 0;

  hideModal('modal-editor');
  renderQuestion(state.questionIndex);
  renderProgressDots();
}

/* =============================================================
   SESSION HISTORY MODAL
   ============================================================= */

function openHistory() {
  renderHistoryBody();
  showModal('modal-history');
}

function renderHistoryBody() {
  const body = $('history-body');
  if (!body) return;
  body.innerHTML = '';

  const history = getHistory();
  if (!history.length) {
    body.appendChild(el('p', 'history-empty', 'No sessions recorded yet. Complete an activity to see history here!'));
    return;
  }

  history.forEach(record => {
    const item     = el('div', 'history-item');
    const header   = el('div', 'history-item-header');
    const nameEl   = el('span', 'history-item-name', record.student_name || 'Unknown');
    const dateEl   = el('span', 'history-item-date', formatDate(record.date));
    const taskEl   = el('div', 'history-item-task', record.task_name || 'Unknown Activity');
    const total    = record.total || (record.correct_count + record.incorrect_count);
    const scoreEl  = el('div', 'history-item-score', '');
    const corr     = el('span', 'history-score-correct', `✅ ${record.correct_count} correct`);
    const wrong    = el('span', 'history-score-wrong',   `  ❌ ${record.incorrect_count} mistakes`);

    scoreEl.appendChild(corr);
    scoreEl.appendChild(wrong);
    header.appendChild(nameEl);
    header.appendChild(dateEl);
    item.appendChild(header);
    item.appendChild(taskEl);
    item.appendChild(scoreEl);
    body.appendChild(item);
  });
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit' });
  } catch (_) { return isoStr || ''; }
}

function clearHistory() {
  if (!confirm('Clear all session history?')) return;
  try { localStorage.removeItem(LS_HISTORY_KEY); } catch (_) {}
  renderHistoryBody();
}

/* =============================================================
   GLOBAL EVENT LISTENERS
   ============================================================= */

function bindGlobalListeners() {
  // --- Navigation ---
  safeClick('back-to-students',   () => showScreen('screen-student'));
  safeClick('back-to-subjects',   () => {
    if (state.student) renderSubjectGrid(state.student);
    showScreen('screen-subject');
  });
  safeClick('back-to-activities', () => {
    if (state.student && state.subject) renderActivityList(state.student, state.subject);
    showScreen('screen-activity');
  });

  // --- Completion buttons ---
  safeClick('btn-play-again',     () => {
    if (state.activity) startActivity(state.activity);
  });
  safeClick('btn-choose-another', () => {
    if (state.student && state.subject) renderActivityList(state.student, state.subject);
    showScreen('screen-activity');
  });
  safeClick('btn-go-home',        () => showScreen('screen-student'));

  // --- Settings ---
  safeClick('btn-open-settings-home', openSettings);
  safeClick('btn-open-settings-game', openSettings);
  safeClick('close-settings',         () => hideModal('modal-settings'));
  safeClick('btn-cancel-settings',    () => hideModal('modal-settings'));
  safeClick('btn-save-settings',      readAndSaveSettings);
  safeClick('btn-reset-settings',     () => {
    if (confirm('Reset all settings to defaults?')) resetSettings();
  });

  // Live color preview
  ['set-bg-color','set-surface-color','set-text-color',
   'set-primary-color','set-secondary-color'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => {
      document.documentElement.style.setProperty(
        '--' + id.replace('set-','').replace('-color','') + '-color',
        el.value
      );
    });
  });

  // --- Activity Editor ---
  safeClick('btn-edit-activity',  openEditor);
  safeClick('close-editor',       () => hideModal('modal-editor'));
  safeClick('btn-cancel-editor',  () => hideModal('modal-editor'));
  safeClick('btn-save-editor',    saveEditorChanges);

  // --- Session History ---
  safeClick('btn-session-history',     openHistory);
  safeClick('close-history',           () => hideModal('modal-history'));
  safeClick('btn-close-history-footer',() => hideModal('modal-history'));
  safeClick('btn-clear-history',       clearHistory);

  // Close modals on overlay click
  ['modal-settings','modal-editor','modal-history'].forEach(id => {
    const overlay = $(id);
    if (!overlay) return;
    overlay.addEventListener('click', e => {
      if (e.target === overlay) hideModal(id);
    });
  });

  // Close modals on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['modal-settings','modal-editor','modal-history'].forEach(id => {
        const m = $(id);
        if (m && !m.classList.contains('hidden')) hideModal(id);
      });
    }
  });
}

/** Attach a click listener if the element exists */
function safeClick(id, handler) {
  const el = $(id);
  if (el) el.addEventListener('click', handler);
}
