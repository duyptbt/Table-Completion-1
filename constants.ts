import { Question, QuestionType, Section } from './types';

export const READING_PASSAGE: Section[] = [
  {
    id: 'A',
    title: 'Section A',
    content: `The term 'megalopolis' (or megacity) was first used by French geographer Jean Gottman to describe the north-eastern United States in 1961. The term is used more widely now and is defined as an urban area of more than 10 million inhabitants dominated by low-density housing. In 1995 there were 14 megacities. By 2020 there could be 30.`
  },
  {
    id: 'B',
    title: 'Section B',
    content: `Megacities are the result of the process of urbanisation. After cities grew into crowded urban centres, people who could afford to moved into suburbs at the edge of the city. When the suburbs in turn became crowded, people moved into villages and dormitory towns outside the city, but within commuting distance. In this way, for the first time since industrialisation, the countryside began to gain population, whereas cities lost their inhabitants. In the 1980s, St Louis and Detroit in America lost between 35 and 47 per cent of their populations and London lost 15 per cent in the 20 years to 1971.`
  },
  {
    id: 'C',
    title: 'Section C',
    content: `However, this movement away from cities does not mean that the city is dying. In fact it is spreading. From the old city develops a metropolitan area with many low-level urban developments. When these metropolitan areas merge together, they form megacities which contain over 10 million people. The largest of these is in America, called Boswash – a region over 300 miles long from Boston in the north to Washington, DC in the south with more than 44 million people. There are emerging megalopolises in Britain centred around London and the south-east, in Germany in the industrial region of the Ruhr and in Japan in the Tokyo-Osaka-Kyoto region.`
  },
  {
    id: 'D',
    title: 'Section D',
    content: `Megacities used to be concentrated in the developed regions but today the greater number are in developing countries – mainly in East and South Asia. Today the five largest cities are Tokyo, Mexico City, São Paulo, New York City and Mumbai. In 2020 they will probably be Tokyo, Dhaka, Mumbai, Mexico City and Delhi. At the moment just under 394 million people live in megacities, 246 million of these in developing countries. In 2020 there will be about 4 billion people living in megacities and, by 2030, 60 per cent of the world's people will be living in megacities.`
  },
  {
    id: 'E',
    title: 'Section E',
    content: `Megacities have a number of similar specific problems. Among common problems are high population concentration, high traffic levels, housing problems and, in some cases, extreme socio-economic differences. However, large population numbers alone do not create these problems; city problems are thought to be caused mostly by weak and unrepresentative city governments.`
  }
];

export const QUIZ_DATA: Question[] = [
  {
    id: 'q1',
    type: QuestionType.MATCHING,
    instruction: 'Choose the most suitable headings for sections A–E from the list of headings.',
    items: [
      { 
        id: 'A', 
        label: 'Section A',
        explanation: 'Section A định nghĩa thuật ngữ "megalopolis" (hoặc megacity) là một khu vực đô thị có hơn 10 triệu dân và đưa ra số liệu thống kê về sự phát triển của chúng.'
      },
      { 
        id: 'B', 
        label: 'Section B',
        explanation: 'Section B giải thích quá trình các thành phố mất dân cư khi mọi người chuyển ra ngoại ô và làng mạc, một quá trình được gọi là phản đô thị hóa.'
      },
      { 
        id: 'C', 
        label: 'Section C',
        explanation: 'Section C mô tả quá trình các khu vực đô thị (metropolitan areas) lan rộng và hợp nhất với nhau để hình thành các siêu đô thị (megacities).'
      },
      { 
        id: 'D', 
        label: 'Section D',
        explanation: 'Section D nhấn mạnh rằng mặc dù trước đây chúng tập trung ở các khu vực phát triển, nhưng ngày nay số lượng lớn hơn các siêu đô thị lại nằm ở các nước đang phát triển.'
      },
      { 
        id: 'E', 
        label: 'Section E',
        explanation: 'Section E liệt kê các vấn đề cụ thể phổ biến mà các siêu đô thị gặp phải, chẳng hạn như giao thông, nhà ở và sự khác biệt về kinh tế xã hội.'
      },
    ],
    options: [
      { id: 'i', label: 'i Megacities around the world' },
      { id: 'ii', label: 'ii The formation of megacities' },
      { id: 'iii', label: 'iii What is a megacity?' },
      { id: 'iv', label: 'iv Megacities and the individual' },
      { id: 'v', label: 'v Problems megacities share' },
      { id: 'vi', label: 'vi Megacities in developing countries' },
      { id: 'vii', label: 'vii Cities lose their people' },
    ],
    correctMapping: {
      'A': 'iii',
      'B': 'vii',
      'C': 'ii',
      'D': 'vi',
      'E': 'v'
    }
  },
  {
    id: 'q2',
    type: QuestionType.TABLE_COMPLETION,
    instruction: 'Complete the table based on Sections B and C. Use no more than three words for each answer.',
    headers: ['Change', 'Result'],
    rows: [
      { 
        id: 'r1', 
        col1: 'city centres become crowded', 
        col2: '(1) people ...', 
        answerKey: '1', 
        correctAnswer: ['moved into suburbs', 'move into suburbs', 'moved to suburbs'],
        explanation: 'Section B viết: "After cities grew into crowded urban centres, people who could afford to moved into suburbs..."'
      },
      { 
        id: 'r2', 
        col1: 'suburbs become crowded', 
        col2: '(2) people ...', 
        answerKey: '2', 
        correctAnswer: ['moved into villages', 'move into villages', 'moved to villages', 'dormitory towns'],
        explanation: 'Section B viết: "When the suburbs in turn became crowded, people moved into villages and dormitory towns..."'
      },
      { 
        id: 'r3', 
        col1: '(3) ...', 
        col2: 'many low-level urban developments', 
        answerKey: '3', 
        correctAnswer: ['old city develops', 'the old city', 'metropolitan area develops', 'city spreads', 'old city spreads', 'the city spreads'],
        explanation: 'Section C đề cập rằng từ thành phố cũ, một khu vực đô thị phát triển với nhiều khu phát triển đô thị thấp tầng. "In fact it is spreading."'
      },
      { 
        id: 'r4', 
        col1: '(4) ...', 
        col2: 'a megacity is formed', 
        answerKey: '4', 
        correctAnswer: ['metropolitan areas merge', 'areas merge together', 'merge together', 'areas merge'],
        explanation: 'Section C viết: "When these metropolitan areas merge together, they form megacities..."'
      },
    ]
  },
  {
    id: 'q3',
    type: QuestionType.TRUE_FALSE,
    instruction: 'Do the statements reflect the claims of the writer?',
    items: [
      { 
        id: 'tf1', 
        statement: 'A megacity is characterised by high-rise apartment blocks.', 
        correctAnswer: 'FALSE',
        explanation: 'Section A nói rằng một siêu đô thị được "dominated by low-density housing", điều này mâu thuẫn với ý tưởng về các tòa nhà chung cư cao tầng.'
      },
      { 
        id: 'tf2', 
        statement: 'Cities lose their populations when poorer people move into them.', 
        correctAnswer: 'NOT GIVEN',
        explanation: 'Bài đọc đề cập đến việc các thành phố mất dân số (Section B), nhưng không nói rằng điều này là do người nghèo chuyển đến. Nó tập trung vào việc mọi người chuyển ra ngoài.'
      },
      { 
        id: 'tf3', 
        statement: 'Movement away from cities creates metropolitan areas.', 
        correctAnswer: 'TRUE',
        explanation: 'Section C viết: "From the old city develops a metropolitan area..." ngụ ý rằng sự lan rộng/di chuyển tạo ra các khu vực này.'
      },
      { 
        id: 'tf4', 
        statement: 'There will be more megacities in developed countries than in developing countries.', 
        correctAnswer: 'FALSE',
        explanation: 'Section D nói rằng "today the greater number are in developing countries" và dự đoán sự tăng trưởng trong tương lai chủ yếu ở các khu vực đang phát triển.'
      },
      { 
        id: 'tf5', 
        statement: 'Problems in very large cities are mostly due to poor administration.', 
        correctAnswer: 'TRUE',
        explanation: 'Section E kết luận rằng "city problems are thought to be caused mostly by weak and unrepresentative city governments," điều này đề cập đến việc quản lý hành chính.'
      },
    ]
  }
];