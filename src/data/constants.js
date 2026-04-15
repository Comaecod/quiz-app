/**
 * QUIZ CONFIGURATION FILE
 *
 * This file contains all the configuration settings for the quiz application.
 * Modify these values to customize the quiz for your needs.
 */

export const QUIZ_CONFIG = {
  // Exam metadata
  examTitle: 'Bridge Course - AI & Python',
  className: 7,
  schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',

  // Question bank settings
  // totalQuestionsInBank is automatically calculated from questions.length
  questionsPerPaper: 20,

  // Marks configuration
  // Each entry represents marks for questions in a range
  // Format: [startRange, endRange, marks]
  marksPerQuestion: [
    [1, 20, 1], // Questions 1-10: 1 mark each
    // [11, 20, 1], // Questions 11-20: 2 marks each
    // [21, 30, 3], // Questions 21-30: 3 marks each
  ],

  // Negative marking
  wrongAnswerPenaltyFraction: 0.25,

  // Time limit in minutes
  timeLimitMinutes: 15,
};

/**
 * QUESTION TEMPLATE
 *
 * Use this template to add questions to the questions array below.
 *
 * FIELD DESCRIPTIONS:
 * - id: Unique identifier for the question (auto-generated if not provided)
 * - text: The question text (supports HTML for formatting)
 * - image: Optional URL to an image (can be null or empty string)
 * - type: 'single' for radio buttons, 'multiple' for checkboxes
 * - options: Array of answer options
 *   - Each option has 'text' (display text) and 'isCorrect' (boolean or array for multiple correct)
 * - explanation: Optional explanation shown after submission
 *
 * MULTIPLE CORRECT QUESTIONS:
 * - Set type: 'multiple'
 * - Set isCorrect as an array of indices for all correct answers
 * - Example: isCorrect: [0, 2] means options[0] and options[2] are correct
 *
 * SINGLE CORRECT QUESTIONS:
 * - Set type: 'single'
 * - Set isCorrect as the index of the correct option (number)
 * - Example: isCorrect: 2 means options[2] is correct
 */
/* export const questions = [
  // =====================================================
  // ARTIFICIAL INTELLIGENCE - CLASS 7 MCQS
  // =====================================================
  {
    id: 1,
    text: "What does the word <b>'Artificial'</b> mean in the context of AI?",
    image: null,
    type: "single",
    options: [
      { text: "Something that occurs naturally" },
      { text: "Something made by humans" },
      { text: "Something that is very expensive" },
      { text: "Something that is invisible" },
    ],
    isCorrect: 1,
    explanation: "'Artificial' refers to things created by human beings rather than nature.",
  },
  {
    id: 2,
    text: "Which of the following abilities are included in the definition of <b>'Intelligence'</b>? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Ability to think" },
      { text: "Ability to solve problems" },
      { text: "Ability to learn from experience" },
      { text: "Ability to breathe naturally" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "Intelligence involves thinking, problem-solving, and learning. Breathing is a biological process, not a measure of intelligence.",
  },
  {
    id: 3,
    text: "Artificial Intelligence allows machines to perform tasks that usually require ________ intelligence.",
    image: null,
    type: "single",
    options: [
      { text: "Mechanical" },
      { text: "Human" },
      { text: "Animal" },
      { text: "Alien" },
    ],
    isCorrect: 1,
    explanation: "AI mimics human intelligence to perform tasks like reasoning and decision-making.",
  },
  {
    id: 4,
    text: "Which of these is a primary reason why AI was developed?",
    image: null,
    type: "single",
    options: [
      { text: "To replace humans in all sports" },
      { text: "To make human work easier and more efficient" },
      { text: "To make computers look more colorful" },
      { text: "To eliminate the need for electricity" },
    ],
    isCorrect: 1,
    explanation: "AI was developed to reduce human effort and solve complex problems more efficiently.",
  },
  {
    id: 5,
    text: "Identify the <b>Voice Assistants</b> mentioned in your syllabus. (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Google Assistant" },
      { text: "Siri" },
      { text: "Netflix" },
      { text: "WhatsApp" },
    ],
    isCorrect: [0, 1],
    explanation: "Google Assistant and Siri are classic examples of AI-powered voice assistants.",
  },
  {
    id: 6,
    text: "How does an AI system learn over time?",
    image: null,
    type: "single",
    options: [
      { text: "By eating food" },
      { text: "By learning from data and experience" },
      { text: "By sleeping at night" },
      { text: "By being manufactured in a factory" },
    ],
    isCorrect: 1,
    explanation: "AI works by analyzing large amounts of information and identifying patterns in data.",
  },
  {
    id: 7,
    text: "Which of the following can AI do in the field of <b>Agriculture</b>? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Predicting weather conditions" },
      { text: "Monitoring crop health" },
      { text: "Using drones to spray crops" },
      { text: "Cooking the harvested vegetables" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI helps farmers with weather prediction, crop health monitoring, and drone technology.",
  },
  {
    id: 8,
    text: "A computer can analyze thousands of pieces of information in ________, which might take humans many hours.",
    image: null,
    type: "single",
    options: [
      { text: "Days" },
      { text: "Seconds" },
      { text: "Months" },
      { text: "Years" },
    ],
    isCorrect: 1,
    explanation: "Speed is a major advantage of AI; it can process data much faster than the human brain.",
  },
  {
    id: 9,
    text: "<b>Recommendation systems</b> suggest content based on:",
    image: null,
    type: "single",
    options: [
      { text: "Random selection" },
      { text: "The weight of the user" },
      { text: "User behavior and preferences" },
      { text: "The weather outside" },
    ],
    isCorrect: 2,
    explanation: "AI studies what you like or watch to suggest similar content you might enjoy.",
  },
  {
    id: 10,
    text: "What are some <b>disadvantages</b> of AI? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "High cost of development" },
      { text: "Requires no electricity" },
      { text: "Loss of some jobs due to automation" },
      { text: "Lack of human emotions" },
    ],
    isCorrect: [0, 2, 3],
    explanation: "High costs, job displacement, and the absence of emotions are common drawbacks of AI.",
  },
  {
    id: 11,
    text: "Face recognition technology analyzes ________ to confirm a user's identity.",
    image: null,
    type: "single",
    options: [
      { text: "Heartbeat" },
      { text: "Facial features" },
      { text: "Fingerprint" },
      { text: "Voice pitch" },
    ],
    isCorrect: 1,
    explanation: "AI analyzes facial patterns and features to unlock devices or identify people.",
  },
  {
    id: 12,
    text: "In the field of <b>Healthcare</b>, AI can help with: (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Detecting diseases early" },
      { text: "Assisting in surgeries" },
      { text: "Analyzing medical reports" },
      { text: "Curing diseases without any medicine" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI assists doctors in diagnosis, analysis, and surgery, though medicine is still required for treatment.",
  },
  {
    id: 13,
    text: "AI learning is similar to how humans learn from practice.",
    image: null,
    type: "single",
    options: [
      { text: "True" },
      { text: "False" },
    ],
    isCorrect: 0,
    explanation: "AI systems improve their performance through repeated training and patterns, similar to human practice.",
  },
  {
    id: 14,
    text: "Which app uses AI to find the fastest route and traffic conditions?",
    image: null,
    type: "single",
    options: [
      { text: "A calculator" },
      { text: "Navigation and Maps" },
      { text: "A notes app" },
      { text: "A flashlight app" },
    ],
    isCorrect: 1,
    explanation: "Navigation apps use AI to process real-time traffic data to find the best routes.",
  },
  {
    id: 15,
    text: "AI is used in <b>Transportation</b> for: (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Traffic management" },
      { text: "Self-driving cars" },
      { text: "Smart navigation" },
      { text: "Building manual bicycles" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI is key in managing traffic, helping cars drive themselves, and smart mapping.",
  },
  {
    id: 16,
    text: "Which of the following is an advantage of AI?",
    image: null,
    type: "single",
    options: [
      { text: "It needs frequent rest" },
      { text: "It can work continuously without getting tired" },
      { text: "It is very cheap to maintain" },
      { text: "It has deep human feelings" },
    ],
    isCorrect: 1,
    explanation: "Unlike humans, machines do not experience fatigue and can work 24/7.",
  },
  {
    id: 17,
    text: "AI in <b>Education</b> can provide: (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Personalized learning support" },
      { text: "Creating practice tests" },
      { text: "Answering student questions" },
      { text: "Doing physical exercise for students" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI tools personalize learning and provide academic support but cannot perform physical tasks for humans.",
  },
  {
    id: 18,
    text: "If a computer is shown thousands of pictures of cats and dogs, it can learn to identify them. This is an example of:",
    image: null,
    type: "single",
    options: [
      { text: "Hardware repair" },
      { text: "Learning from data/patterns" },
      { text: "Social media marketing" },
      { text: "Natural growth" },
    ],
    isCorrect: 1,
    explanation: "This is a core example of how AI uses data (images) to recognize patterns.",
  },
  {
    id: 19,
    text: "What does AI require to function? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Electricity" },
      { text: "Internet" },
      { text: "Technical knowledge" },
      { text: "Human blood" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI systems are electronic and digital, requiring power, connectivity, and human expertise to build.",
  },
  {
    id: 20,
    text: "In the future, AI may help with which of the following?",
    image: null,
    type: "single",
    options: [
      { text: "Smart cities" },
      { text: "Stopping the rotation of Earth" },
      { text: "Making humans stop thinking" },
      { text: "Creating artificial oxygen" },
    ],
    isCorrect: 0,
    explanation: "AI is expected to play a huge role in the development of intelligent 'Smart Cities'.",
  },
  {
    id: 21,
    text: "Which of these is NOT a task AI can perform?",
    image: null,
    type: "single",
    options: [
      { text: "Understanding speech" },
      { text: "Recognizing images" },
      { text: "Feeling real human love" },
      { text: "Solving problems" },
    ],
    isCorrect: 2,
    explanation: "Machines cannot truly experience or 'feel' human emotions like love.",
  },
  {
    id: 22,
    text: "Which tasks can Voice Assistants perform? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Making phone calls" },
      { text: "Searching the internet" },
      { text: "Setting reminders" },
      { text: "Cooking a physical meal" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "Voice assistants handle digital tasks, not physical chores like cooking.",
  },
  {
    id: 23,
    text: "AI systems become ________ at performing tasks over time with more training.",
    image: null,
    type: "single",
    options: [
      { text: "Slower" },
      { text: "Better" },
      { text: "Worse" },
      { text: "Confused" },
    ],
    isCorrect: 1,
    explanation: "The more data and training an AI receives, the more accurate and 'better' it becomes.",
  },
  {
    id: 24,
    text: "The main goal of AI is to building machines that can mimic ________.",
    image: null,
    type: "single",
    options: [
      { text: "Plants" },
      { text: "Human intelligence" },
      { text: "Rocks" },
      { text: "Gravity" },
    ],
    isCorrect: 1,
    explanation: "AI is specifically designed to replicate the cognitive abilities of humans.",
  },
  {
    id: 25,
    text: "Which of the following fields use AI? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Agriculture" },
      { text: "Healthcare" },
      { text: "Education" },
      { text: "Transportation" },
    ],
    isCorrect: [0, 1, 2, 3],
    explanation: "AI has applications in all these major sectors.",
  },
  {
    id: 26,
    text: "What is an advantage of AI regarding data?",
    image: null,
    type: "single",
    options: [
      { text: "It cannot read data" },
      { text: "It can process large amounts of data" },
      { text: "It makes data more expensive" },
      { text: "It deletes data automatically" },
    ],
    isCorrect: 1,
    explanation: "AI excels at handling and analyzing 'Big Data' that would overwhelm a human.",
  },
  {
    id: 27,
    text: "AI helps farmers by improving ________ systems.",
    image: null,
    type: "single",
    options: [
      { text: "Irrigation" },
      { text: "Entertainment" },
      { text: "Fashion" },
      { text: "Gaming" },
    ],
    isCorrect: 0,
    explanation: "AI helps optimize water usage in farming through smart irrigation.",
  },
  {
    id: 28,
    text: "Why might some jobs be reduced due to AI?",
    image: null,
    type: "single",
    options: [
      { text: "Because machines get tired" },
      { text: "Because of automation of tasks" },
      { text: "Because machines are lazy" },
      { text: "Because machines are slow" },
    ],
    isCorrect: 1,
    explanation: "Automation allows machines to do tasks previously done by humans, which may lead to job reductions in some areas.",
  },
  {
    id: 29,
    text: "AI is growing very slowly.",
    image: null,
    type: "single",
    options: [
      { text: "True" },
      { text: "False" },
    ],
    isCorrect: 1,
    explanation: "AI is actually growing very quickly in the modern world.",
  },
  {
    id: 30,
    text: "Which platforms use AI to suggest videos or products? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Video streaming apps" },
      { text: "Online stores" },
      { text: "Physical notebooks" },
      { text: "Wooden pencils" },
    ],
    isCorrect: [0, 1],
    explanation: "Digital platforms like YouTube, Netflix, or Amazon use AI recommendation systems.",
  },
  {
    id: 31,
    text: "What is the role of AI in <b>Face Recognition</b>?",
    image: null,
    type: "single",
    options: [
      { text: "To draw pictures of faces" },
      { text: "To analyze facial features and confirm identity" },
      { text: "To change the color of the user's skin" },
      { text: "To make the user look older" },
    ],
    isCorrect: 1,
    explanation: "AI analyzes patterns in a face to verify if the person is the authorized user.",
  },
  {
    id: 32,
    text: "Which of these are examples of AI processing in Maps? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Estimated travel time" },
      { text: "Traffic conditions" },
      { text: "Fastest route" },
      { text: "Drawing the physical road" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI calculates travel times, routes, and traffic, but it doesn't build the actual roads.",
  },
  {
    id: 33,
    text: "Machines can fully replace human thinking and emotions.",
    image: null,
    type: "single",
    options: [
      { text: "True" },
      { text: "False" },
    ],
    isCorrect: 1,
    explanation: "One of the limitations of AI is that it cannot fully replicate human emotions or complex consciousness.",
  },
  {
    id: 34,
    text: "In the context of the future, AI will help with: (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Intelligent robots" },
      { text: "Advanced medical treatments" },
      { text: "Improved farming methods" },
      { text: "Time travel to the past" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI will improve robotics, medicine, and farming, but time travel remains science fiction.",
  },
  {
    id: 35,
    text: "AI development and maintenance is generally ________.",
    image: null,
    type: "single",
    options: [
      { text: "Free" },
      { text: "Low cost" },
      { text: "High cost" },
      { text: "Only for children" },
    ],
    isCorrect: 2,
    explanation: "A major disadvantage is the significant expense involved in creating and maintaining AI systems.",
  },
  {
    id: 36,
    text: "Which field uses AI to detect diseases early?",
    image: null,
    type: "single",
    options: [
      { text: "Agriculture" },
      { text: "Healthcare" },
      { text: "Transportation" },
      { text: "Entertainment" },
    ],
    isCorrect: 1,
    explanation: "Early disease detection is a crucial application of AI in the medical (healthcare) field.",
  },
  {
    id: 37,
    text: "<b>Intelligence</b> means the ability to: (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Understand" },
      { text: "Think" },
      { text: "Solve problems" },
      { text: "Ignore facts" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "Intelligence involves understanding, thinking, and solving problems.",
  },
  {
    id: 38,
    text: "AI can work without any technical knowledge from humans.",
    image: null,
    type: "single",
    options: [
      { text: "True" },
      { text: "False" },
    ],
    isCorrect: 1,
    explanation: "AI requires significant technical knowledge to build, train, and maintain.",
  },
  {
    id: 39,
    text: "Which of the following is a benefit of AI in **Education**?",
    image: null,
    type: "single",
    options: [
      { text: "It replaces the need for students to learn" },
      { text: "It creates personalized learning tools" },
      { text: "It deletes all homework" },
      { text: "It gives students free food" },
    ],
    isCorrect: 1,
    explanation: "AI provides tools that adapt to each student's unique learning speed and style.",
  },
  {
    id: 40,
    text: "AI learns from patterns in ________.",
    image: null,
    type: "single",
    options: [
      { text: "Data" },
      { text: "Clouds" },
      { text: "Clothing" },
      { text: "Water" },
    ],
    isCorrect: 0,
    explanation: "Data is the 'food' for AI; it learns by finding patterns within that data.",
  },
  {
    id: 41,
    text: "Which of the following are examples of AI in daily life? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Face Recognition" },
      { text: "Voice Assistants" },
      { text: "Recommendation Systems" },
      { text: "Manual Hand Fans" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "Manual fans do not use AI, but the others are common AI applications.",
  },
  {
    id: 42,
    text: "AI helps farmers increase ________.",
    image: null,
    type: "single",
    options: [
      { text: "Rainfall" },
      { text: "Crop production" },
      { text: "The size of the sun" },
      { text: "Their own age" },
    ],
    isCorrect: 1,
    explanation: "By monitoring health and weather, AI helps produce more crops efficiently.",
  },
  {
    id: 43,
    text: "What does AI help doctors analyze?",
    image: null,
    type: "single",
    options: [
      { text: "Movie scripts" },
      { text: "Medical reports" },
      { text: "Sports scores" },
      { text: "The stock market" },
    ],
    isCorrect: 1,
    explanation: "AI helps doctors by quickly analyzing complex medical reports and scans.",
  },
  {
    id: 44,
    text: "AI reduces human ________.",
    image: null,
    type: "single",
    options: [
      { text: "Effort" },
      { text: "Intelligence" },
      { text: "Height" },
      { text: "Memory" },
    ],
    isCorrect: 0,
    explanation: "The purpose of AI is to take over difficult or repetitive tasks to reduce the work humans have to do.",
  },
  {
    id: 45,
    text: "If used responsibly, AI can help build a better future.",
    image: null,
    type: "single",
    options: [
      { text: "True" },
      { text: "False" },
    ],
    isCorrect: 0,
    explanation: "Responsibility is key to ensuring AI benefits society.",
  },
  {
    id: 46,
    text: "Which of these is <b>NOT</b> a voice assistant?",
    image: null,
    type: "single",
    options: [
      { text: "Siri" },
      { text: "Google Assistant" },
      { text: "Calculator" },
      { text: "Alexa (implied)" },
    ],
    isCorrect: 2,
    explanation: "A standard calculator performs math but doesn't act as a voice-driven assistant.",
  },
  {
    id: 47,
    text: "In transportation, AI is used for smart ________.",
    image: null,
    type: "single",
    options: [
      { text: "Bicycles" },
      { text: "Navigation" },
      { text: "Shoes" },
      { text: "Windows" },
    ],
    isCorrect: 1,
    explanation: "Smart navigation is a key feature of AI in transportation.",
  },
  {
    id: 48,
    text: "What does AI study to give suggestions in online stores? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "User behavior" },
      { text: "Previous purchases" },
      { text: "The user's favorite color" },
      { text: "The user's dreams" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI looks at behavior, purchases, and preferences. It cannot read dreams.",
  },
  {
    id: 49,
    text: "AI can process information ________ than humans in many tasks.",
    image: null,
    type: "single",
    options: [
      { text: "Slower" },
      { text: "Faster" },
      { text: "At the same speed" },
      { text: "With more emotion" },
    ],
    isCorrect: 1,
    explanation: "Speed is one of AI's greatest advantages over human manual work.",
  },
  {
    id: 50,
    text: "Conclusion: AI allows machines to: (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Learn" },
      { text: "Think" },
      { text: "Perform human-like tasks" },
      { text: "Become human beings" },
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI mimics human intelligence and tasks, but machines remain machines and do not become biological humans.",
  },
]; */

export const questions = [
  {
    id: 1,
    text: "What does the word \"artificial\" mean in the context of Artificial Intelligence (AI)?",
    image: null,
    type: "single",
    options: [
      { text: "Made by humans (not natural)" },
      { text: "Very intelligent" },
      { text: "Powered by electricity" },
      { text: "Wild or untamed" }
    ],
    isCorrect: 0,
    explanation: "Artificial means man-made (not naturally occurring)."
  },
  {
    id: 2,
    text: "What does the word \"intelligence\" mean in general?",
    image: null,
    type: "single",
    options: [
      { text: "The ability to think, learn, and solve problems" },
      { text: "Having many computers" },
      { text: "Being very fast" },
      { text: "Living forever" }
    ],
    isCorrect: 0,
    explanation: "Intelligence is the ability to think, learn, understand, and solve problems."
  },
  {
    id: 3,
    text: "What is Artificial Intelligence (AI)?",
    image: null,
    type: "single",
    options: [
      { text: "Ability of machines to think, learn, and make decisions like humans" },
      { text: "Physical strength of robots" },
      { text: "Programming smartphones only" },
      { text: "A type of power source" }
    ],
    isCorrect: 0,
    explanation: "AI enables machines to think, learn, and perform tasks requiring human-like intelligence."
  },
  {
    id: 4,
    text: "Why was Artificial Intelligence developed? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "To make human work easier and more efficient" },
      { text: "To increase manual labor" },
      { text: "To process large amounts of information quickly" },
      { text: "To reduce human effort in tasks" }
    ],
    isCorrect: [0, 2, 3],
    explanation: "AI was created to ease human work and handle big data quickly."
  },
  {
    id: 5,
    text: "How does an AI system learn to perform tasks?",
    image: null,
    type: "multiple",
    options: [
      { text: "By analyzing large amounts of data" },
      { text: "By random guessing" },
      { text: "By finding patterns in the data" },
      { text: "By repeated training and practice" }
    ],
    isCorrect: [0, 2, 3],
    explanation: "AI learns from large datasets, finds patterns, and improves with training."
  },
  {
    id: 6,
    text: "Which of the following tasks are examples of what AI can do? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Speech recognition (understanding spoken words)" },
      { text: "Image recognition/classification" },
      { text: "Playing outdoor sports by itself" },
      { text: "Making decisions using data" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "AI includes speech recognition and image classification, and can make data-driven decisions."
  },
  {
    id: 7,
    text: "Which of the following are examples of voice assistants? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Google Assistant" },
      { text: "Siri" },
      { text: "Alexa" },
      { text: "Google Maps" }
    ],
    isCorrect: [0, 1, 2],
    explanation: "Voice assistants include Google Assistant, Siri, and Alexa (not Google Maps)."
  },
  {
    id: 8,
    text: "Which of the following are examples of recommendation systems? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Video apps suggesting videos you may like" },
      { text: "A mail app sending unread mails" },
      { text: "Online stores showing products you may want" },
      { text: "Streaming services recommending songs" }
    ],
    isCorrect: [0, 2, 3],
    explanation: "Recommendation systems suggest videos, songs, and products based on user behavior."
  },
  {
    id: 9,
    text: "Which of the following information do navigation apps provide using AI? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Fastest driving route to a destination" },
      { text: "Weather forecast" },
      { text: "Estimated travel time" },
      { text: "Current traffic conditions" }
    ],
    isCorrect: [0, 2, 3],
    explanation: "Navigation apps use AI to find the fastest route, estimate time, and show traffic conditions."
  },
  {
    id: 10,
    text: "The image shows a smartphone using a camera with boxes around a face. Which AI application does this illustrate?",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Facial_Recognition22.jpg",
    type: "single",
    options: [
      { text: "Voice assistant" },
      { text: "Recommendation system" },
      { text: "Navigation app" },
      { text: "Face recognition" }
    ],
    isCorrect: 3,
    explanation: "The image illustrates face recognition (locking/unlocking phone by face)."
  },
  {
    id: 11,
    text: "This image shows an aerial drone flying over crops. How does AI help farmers in this context? (Select all that apply)",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Agricultural_drone_in_use_on_rice_field_near_Nisoshi,_Aomori.jpg",
    type: "multiple",
    options: [
      { text: "Predicting weather conditions for farming" },
      { text: "Planting seeds manually" },
      { text: "Monitoring crop health via sensors or drones" },
      { text: "Using drones to spray pesticides or fertilizer" }
    ],
    isCorrect: [0, 2, 3],
    explanation: "AI helps predict weather, monitor crops, and control drones for spraying, increasing efficiency."
  },
  {
    id: 12,
    text: "The person in this image is a doctor analyzing medical data on computers. How does AI assist in healthcare? (Select all that apply)",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Hospital_Pathologist_working_at_a_computer.jpg",
    type: "multiple",
    options: [
      { text: "Analyzing medical reports and imaging" },
      { text: "Detecting diseases early" },
      { text: "Performing surgery autonomously" },
      { text: "Scheduling hospital staff" }
    ],
    isCorrect: [0, 1],
    explanation: "AI helps analyze reports and detect diseases early (and can assist in surgery)."
  },
  {
    id: 13,
    text: "In which way is AI used in education? (Select all that apply)",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Demo_at_Mukumu_Girls_high_school_Kakamega.jpg",
    type: "multiple",
    options: [
      { text: "Providing online learning tools and tutorials" },
      { text: "Answering students' questions using AI tutors" },
      { text: "Creating practice tests and exercises" },
      { text: "Teaching physical education in gym class" }
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI provides online tools, answers questions, and generates practice tests for personalized learning."
  },
  {
    id: 14,
    text: "The image shows a Waymo autonomous vehicle. Which AI application does this represent?",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Waymo_Chrysler_Pacifica_driveless_minivan.jpg",
    type: "single",
    options: [
      { text: "Voice assistant" },
      { text: "Self-driving car technology" },
      { text: "Virtual assistant robot" },
      { text: "Medical diagnosis" }
    ],
    isCorrect: 1,
    explanation: "Waymo vehicles illustrate self-driving car technology, an AI application in transportation."
  },
  {
    id: 15,
    text: "What are some advantages of Artificial Intelligence? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Works faster than humans on many tasks" },
      { text: "Processes large amounts of data quickly" },
      { text: "Needs frequent rest breaks" },
      { text: "Can work continuously without getting tired" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "AI can work faster, handle big data, and run continuously without fatigue."
  },
  {
    id: 16,
    text: "What are some disadvantages of AI? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "High development and maintenance costs" },
      { text: "Cannot fully replace human thinking or emotions" },
      { text: "Requires little electricity or internet" },
      { text: "May lead to reduction of some jobs" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "AI can be costly, lacks human emotion, and may reduce jobs (while needing power/internet)."
  },
  {
    id: 17,
    text: "Which of the following are potential future developments of AI? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Development of smart cities" },
      { text: "Advanced medical treatments and diagnosis" },
      { text: "Human teleportation technology" },
      { text: "More intelligent robots" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "Future AI may enable smart cities, medical advances, and more intelligent robots."
  },
  {
    id: 18,
    text: "In which of these fields is AI already helping people, as mentioned in the content? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Agriculture" },
      { text: "Education" },
      { text: "Entertainment industry" },
      { text: "Healthcare" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "AI is used in agriculture, education, healthcare, and also transportation."
  },
  {
    id: 19,
    text: "Which of the following is NOT typically done by AI today?",
    image: null,
    type: "single",
    options: [
      { text: "Recognizing human speech" },
      { text: "Solving complex problems with data" },
      { text: "Washing laundry like a human" },
      { text: "Identifying objects in images" }
    ],
    isCorrect: 2,
    explanation: "AI can recognize speech, identify images, and analyze problems, but does not literally wash clothes."
  },
  {
    id: 20,
    text: "Which of the following tasks can voice assistants perform? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Make phone calls" },
      { text: "Send text messages" },
      { text: "Fly a drone" },
      { text: "Set reminders" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "Voice assistants can make calls, send messages, and set reminders (they do not fly drones)."
  },
  {
    id: 21,
    text: "The image shows an Amazon Echo Dot smart speaker. Which category of device is this?",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/77/Alexa_Amazon_Echo_Dot_3rd_Gen_Smart_Speaker_-_Sandstone_Fabric_(Creative_Commons)_(51048461088).jpg",
    type: "single",
    options: [
      { text: "Voice-controlled smart speaker (voice assistant)" },
      { text: "Tablet computer" },
      { text: "Virtual reality headset" },
      { text: "Electric kettle" }
    ],
    isCorrect: 0,
    explanation: "Amazon Echo Dot is a voice-controlled smart speaker (digital assistant device)."
  },
  {
    id: 22,
    text: "This image shows a smart urban farm. Which area of AI use does it represent?",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Smartfarm.jpg",
    type: "single",
    options: [
      { text: "AI in agriculture" },
      { text: "AI in healthcare" },
      { text: "AI in entertainment" },
      { text: "AI in transport" }
    ],
    isCorrect: 0,
    explanation: "The image of a smart farm illustrates AI applied in agriculture (e.g., automated farming methods)."
  },
  {
    id: 23,
    text: "Which of the following is NOT an example of AI in the context given?",
    image: null,
    type: "single",
    options: [
      { text: "Understanding human speech" },
      { text: "Unlocking phone with face" },
      { text: "Shopping online with suggestions" },
      { text: "Basic calculator doing arithmetic" }
    ],
    isCorrect: 3,
    explanation: "A simple calculator performing arithmetic is not considered AI (it's basic computing)."
  },
  {
    id: 24,
    text: "Which of the following tasks are commonly done by voice assistants? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Making phone calls" },
      { text: "Sending text messages" },
      { text: "Taking photographs automatically" },
      { text: "Setting reminders" }
    ],
    isCorrect: [0, 1, 3],
    explanation: "Voice assistants can make calls, send texts, and set reminders; they do not automatically take photos."
  },
  {
    id: 25,
    text: "Which of these devices often use face recognition technology? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Smartphones for unlocking" },
      { text: "Airport security cameras" },
      { text: "Old-fashioned locks with keys" },
      { text: "Classic wristwatches" }
    ],
    isCorrect: [0, 1],
    explanation: "Face recognition is used in smartphone unlocking and some security systems, not in mechanical locks or watches."
  },
  {
    id: 26,
    text: "What is a benefit of using recommendation systems on video/music apps?",
    image: null,
    type: "single",
    options: [
      { text: "It suggests new content based on your preferences" },
      { text: "It randomly plays videos without pattern" },
      { text: "It increases your computer's battery usage" },
      { text: "It replaces all manual search" }
    ],
    isCorrect: 0,
    explanation: "Recommendation systems suggest videos or songs based on user likes and behavior."
  },
  {
    id: 27,
    text: "Which of the following is NOT an advantage of AI?",
    image: null,
    type: "single",
    options: [
      { text: "Can work continuously without fatigue" },
      { text: "Processes large amounts of data quickly" },
      { text: "Always provides creative emotional decisions" },
      { text: "Works faster than humans on many tasks" }
    ],
    isCorrect: 2,
    explanation: "AI does not have human-like creativity or emotions; that is not listed as an advantage here."
  },
  {
    id: 28,
    text: "Which of the following is NOT a disadvantage of AI?",
    image: null,
    type: "single",
    options: [
      { text: "High development cost" },
      { text: "Needs electricity and internet" },
      { text: "Fully replaces human intuition" },
      { text: "May lead to loss of some jobs" }
    ],
    isCorrect: 2,
    explanation: "Claiming AI fully replaces human intuition is incorrect (AI can’t fully mimic human creativity/emotion)."
  },
  {
    id: 29,
    text: "Which of the following describe how AI learns? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Detects patterns in training data" },
      { text: "Guesses randomly without data" },
      { text: "Improves through repeated practice" },
      { text: "Operates without any examples" }
    ],
    isCorrect: [0, 2],
    explanation: "AI learns by detecting data patterns and improving with practice; it does not guess randomly without data."
  },
  {
    id: 30,
    text: "Which of the following is NOT a method AI uses to learn?",
    image: null,
    type: "single",
    options: [
      { text: "Learning from large datasets" },
      { text: "Pattern recognition and training" },
      { text: "Random guessing without data" },
      { text: "Incremental improvement with examples" }
    ],
    isCorrect: 2,
    explanation: "AI does not rely on random guessing without data; it uses data-driven learning methods instead."
  },
  {
    id: 31,
    text: "Which field was NOT explicitly mentioned as using AI in the content?",
    image: null,
    type: "single",
    options: [
      { text: "Agriculture" },
      { text: "Education" },
      { text: "Entertainment (movies/games)" },
      { text: "Transportation" }
    ],
    isCorrect: 2,
    explanation: "The content listed agriculture, education, healthcare, transportation, but not the entertainment industry specifically."
  },
  {
    id: 32,
    text: "How might AI be used in smart city planning? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Optimizing traffic light timing" },
      { text: "Managing energy usage and grids" },
      { text: "Predicting weather patterns" },
      { text: "Tracking wildlife in forests" }
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI can optimize traffic, energy grids, and use weather predictions in smart cities (wildlife tracking is not city planning)."
  },
  {
    id: 33,
    text: "Which of the following tasks become easier or faster with AI? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Analyzing large datasets" },
      { text: "Solving repetitive calculations" },
      { text: "Understanding spoken language" },
      { text: "Automatically planning the quickest routes" }
    ],
    isCorrect: [0, 1, 2, 3],
    explanation: "AI excels at processing big data, doing repetitive tasks, understanding speech, and calculating optimal routes."
  },
  {
    id: 34,
    text: "Which of the following is currently NOT well performed by AI?",
    image: null,
    type: "single",
    options: [
      { text: "Identifying objects in images" },
      { text: "Predicting product recommendations" },
      { text: "Learning and reasoning exactly like humans" },
      { text: "Analyzing speech to text" }
    ],
    isCorrect: 2,
    explanation: "AI can identify images, make recommendations, convert speech to text, but true human-like reasoning is not yet achieved."
  },
  {
    id: 35,
    text: "Which of the following statements about AI are correct? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "AI can continuously work without fatigue" },
      { text: "AI automatically has human emotions" },
      { text: "AI processes large amounts of data fast" },
      { text: "AI always gives perfect answers" }
    ],
    isCorrect: [0, 2],
    explanation: "AI can work without getting tired and handle big data fast, but it does not have emotions or always perfect answers."
  },
  {
    id: 36,
    text: "Which of the following are examples of AI technologies? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Machine learning algorithms" },
      { text: "Neural networks" },
      { text: "Basic touchscreens" },
      { text: "Calculator chip" }
    ],
    isCorrect: [0, 1],
    explanation: "Machine learning and neural networks are AI techniques; touchscreens and basic calculator chips are not AI."
  },
  {
    id: 37,
    text: "Which of the following things can AI do today? (Select all that apply)",
    image: null,
    type: "multiple",
    options: [
      { text: "Translate speech between languages" },
      { text: "Compose simple music or artwork" },
      { text: "Drive cars autonomously on some roads" },
      { text: "Teleport objects physically" }
    ],
    isCorrect: [0, 1, 2],
    explanation: "AI can translate languages, create simple art, and drive cars (it cannot teleport objects)."
  },
  {
    id: 38,
    text: "AI is mentioned in all of these fields EXCEPT:",
    image: null,
    type: "single",
    options: [
      { text: "Healthcare" },
      { text: "Transportation" },
      { text: "Mining and minerals" },
      { text: "Education" }
    ],
    isCorrect: 2,
    explanation: "The content mentions agriculture, healthcare, education, transportation; it does not specifically mention mining."
  },
  {
    id: 39,
    text: "Which of these statements about AI is TRUE?",
    image: null,
    type: "single",
    options: [
      { text: "AI never makes mistakes." },
      { text: "AI can work continuously without fatigue." },
      { text: "AI requires no power or data." },
      { text: "AI completely replaces human feelings." }
    ],
    isCorrect: 1,
    explanation: "AI can work continuously without getting tired, unlike humans (the other statements are false)."
  },
  {
    id: 40,
    text: "Which of these cannot be done by current AI systems?",
    image: null,
    type: "single",
    options: [
      { text: "Recognizing spoken commands" },
      { text: "Predicting the weather" },
      { text: "Performing creative work with emotions" },
      { text: "Analyzing images" }
    ],
    isCorrect: 2,
    explanation: "Current AI cannot truly perform emotional/creative tasks like a human (it handles speech, weather, and images)."
  },
  {
    id: 41,
    text: "The image shows a human brain made of circuits. What concept is being illustrated?",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/64/Dall-e_3_(jan_'24)_artificial_intelligence_icon.png",
    type: "single",
    options: [
      { text: "Artificial Intelligence" },
      { text: "Digital art without meaning" },
      { text: "Human neuroscience only" },
      { text: "A computer virus" }
    ],
    isCorrect: 0,
    explanation: "A brain of circuits symbolizes AI – machines mimicking human thinking (artificial intelligence)."
  },
  {
    id: 42,
    text: "The image shows heavy road traffic. Which AI application area can help manage this situation?",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Bit_of_a_traffic_jam.jpg",
    type: "single",
    options: [
      { text: "Smart traffic management" },
      { text: "Voice assistant technology" },
      { text: "Face recognition" },
      { text: "Online recommendation system" }
    ],
    isCorrect: 0,
    explanation: "AI-driven traffic management systems help optimize traffic flow and reduce congestion."
  },
  {
    id: 43,
    text: "This image shows a robot at an airport. What AI-related field does this best represent?",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Changi_Airport%2C_Singapore_with_robot%2C_2023-02-21.jpg",
    type: "single",
    options: [
      { text: "Autonomous robotics/Intelligent machines" },
      { text: "Speech-to-text translation" },
      { text: "Medical imaging AI" },
      { text: "Social media AI" }
    ],
    isCorrect: 0,
    explanation: "The airport robot exemplifies autonomous robots and intelligent machines, a future AI application."
  },
  {
    id: 44,
    text: "This futuristic city image illustrates which concept?",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/City_of_the_future.jpg",
    type: "single",
    options: [
      { text: "A smart city managed by AI" },
      { text: "Ancient historical city" },
      { text: "Agricultural farmland" },
      { text: "Virtual reality game environment" }
    ],
    isCorrect: 0,
    explanation: "The image represents a smart city of the future, an area where AI can manage infrastructure."
  },
  {
    id: 45,
    text: "Which of these statements correctly describes AI learning from data?",
    image: null,
    type: "single",
    options: [
      { text: "AI improves its performance as it is trained with more examples" },
      { text: "AI performance gets worse with more data" },
      { text: "AI learning does not depend on the amount of data" },
      { text: "AI forgets patterns when trained more" }
    ],
    isCorrect: 0,
    explanation: "AI learns better with more training data, improving its task performance over time."
  },
  {
    id: 46,
    text: "Which of the following is an example of AI making life easier?",
    image: null,
    type: "single",
    options: [
      { text: "A voice assistant setting reminders automatically" },
      { text: "A bicycle pedaled by a person" },
      { text: "Paper maps for navigation" },
      { text: "Manual calculators" }
    ],
    isCorrect: 0,
    explanation: "Voice assistants (AI) can automate tasks like setting reminders, making life easier."
  },
  {
    id: 47,
    text: "Which of the following is NOT a way AI is used responsibly for a better future?",
    image: null,
    type: "single",
    options: [
      { text: "Building smart cities with better planning" },
      { text: "Improving advanced medical care" },
      { text: "Helping in personalized education" },
      { text: "Replacing all human teachers" }
    ],
    isCorrect: 3,
    explanation: "Replacing all human teachers is not realistic; AI aids education but doesn't fully replace human teachers."
  },
  {
    id: 48,
    text: "All of the following are potential benefits of AI except:",
    image: null,
    type: "single",
    options: [
      { text: "Working without sleep" },
      { text: "High accuracy in tasks" },
      { text: "Requiring no electricity" },
      { text: "Analyzing large data sets" }
    ],
    isCorrect: 2,
    explanation: "AI needs electricity and data; 'requiring no electricity' is not a benefit of AI."
  },
  {
    id: 49,
    text: "Which of the following is NOT considered an AI application in daily life?",
    image: null,
    type: "single",
    options: [
      { text: "Digital voice assistants (e.g., Siri)" },
      { text: "Autonomous navigation apps" },
      { text: "Smartphone face unlock" },
      { text: "Ordinary wristwatch" }
    ],
    isCorrect: 3,
    explanation: "Smartwatches or wristwatches are not AI; voice assistants, navigation, and face unlock use AI."
  },
  {
    id: 50,
    text: "All of the following fields use AI except:",
    image: null,
    type: "single",
    options: [
      { text: "Medicine and healthcare" },
      { text: "Education and tutoring" },
      { text: "Space travel planning" },
      { text: "Modern agriculture" }
    ],
    isCorrect: 2,
    explanation: "AI is used in healthcare, education, agriculture, but 'space travel planning' was not mentioned in the content."
  }
];

  // =====================================================
  // ADD MORE QUESTIONS BELOW
  // =====================================================

  // Template for new single correct question:
  // {
  //   id: X,
  //   text: "Your question text here?",
  //   image: null, // or "https://example.com/image.jpg"
  //   type: "single",
  //   options: [
  //     { text: "Option A" },
  //     { text: "Option B" },
  //     { text: "Option C" },
  //     { text: "Option D" },
  //   ],
  //   isCorrect: 1, // Index of correct answer (0-based)
  //   explanation: "Explanation of the correct answer.",
  // },

  // Template for new multiple correct question:
  // {
  //   id: X,
  //   text: "Which options are correct? (Select all that apply)",
  //   image: null,
  //   type: "multiple",
  //   options: [
  //     { text: "Option A" },
  //     { text: "Option B" },
  //     { text: "Option C" },
  //     { text: "Option D" },
  //   ],
  //   isCorrect: [0, 2], // Array of indices for all correct answers
  //   explanation: "Explanation of why these are correct.",
  // },


/**
 * Calculate total marks for the exam based on questionsPerPaper
 * @param {number} numQuestions - Number of questions in the paper
 * @returns {number} Total marks possible
 */
export const calculateTotalMarks = (numQuestions) => {
  let total = 0;
  const { marksPerQuestion } = QUIZ_CONFIG;

  for (let i = 1; i <= numQuestions; i++) {
    const markConfig = marksPerQuestion.find(
      ([start, end]) => i >= start && i <= end,
    );
    if (markConfig) {
      total += markConfig[2];
    }
  }

  return total;
};

/**
 * Get marks for a specific question number
 * @param {number} questionNumber - The question number (1-based)
 * @returns {number} Marks for that question
 */
export const getMarksForQuestion = (questionNumber) => {
  const { marksPerQuestion } = QUIZ_CONFIG;
  const markConfig = marksPerQuestion.find(
    ([start, end]) => questionNumber >= start && questionNumber <= end,
  );
  return markConfig ? markConfig[2] : 1;
};
