import React, { useEffect, useMemo, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const AI_URL =
  'https://ayedemirhan--0107470ece3611f1adcd1607ee4eb77e.web.val.run';


const STARTER_WORDS = [
  {
    word: 'sovereignty',
    definition:
      'the highest power to control and make decisions for a country',
    example:
      'Parliamentary sovereignty remains a central principle in UK politics.',
    collocation: 'parliamentary sovereignty',
    status: 'new',
    correctCount: 0,
    wrongCount: 0,
  },
  {
    word: 'binding',
    definition:
      'something that must be followed because it has legal force',
    example:
      'The agreement became legally binding after both sides signed it.',
    collocation: 'legally binding',
    status: 'new',
    correctCount: 0,
    wrongCount: 0,
  },
  {
    word: 'legitimacy',
    definition:
      'the quality of being accepted as right, fair, or lawful',
    example:
      'High turnout can give a government greater democratic legitimacy.',
    collocation: 'political legitimacy',
    status: 'new',
    correctCount: 0,
    wrongCount: 0,
  },
  {
    word: 'undermine',
    definition:
      'to make something weaker or less effective',
    example:
      'Corruption can undermine public trust in democratic institutions.',
    collocation: 'undermine trust',
    status: 'new',
    correctCount: 0,
    wrongCount: 0,
  },
  {
    word: 'turnout',
    definition:
      'the percentage of people who vote in an election',
    example:
      'Voter turnout fell compared with the previous election.',
    collocation: 'voter turnout',
    status: 'new',
    correctCount: 0,
    wrongCount: 0,
  },
];


export default function App() {
  const [screen, setScreen] = useState('home');

  const [words, setWords] = useState(STARTER_WORDS);
  const [score, setScore] = useState(0);

  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [fillIndex, setFillIndex] = useState(0);

  const [loaded, setLoaded] = useState(false);

  const [newWord, setNewWord] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCollocation, setNewCollocation] = useState('');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  const [quizFeedback, setQuizFeedback] = useState('');
  const [quizLocked, setQuizLocked] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);

  const [fillAnswer, setFillAnswer] = useState('');
  const [fillFeedback, setFillFeedback] = useState('');
  const [fillLocked, setFillLocked] = useState(false);


  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    if (loaded) {
      saveData();
    }
  }, [
    words,
    score,
    cardIndex,
    quizIndex,
    fillIndex,
    loaded,
  ]);


  async function loadData() {
    try {
      const savedWords =
        await AsyncStorage.getItem('hercab_words');

      const savedScore =
        await AsyncStorage.getItem('hercab_score');

      const savedCardIndex =
        await AsyncStorage.getItem('hercab_cardIndex');

      const savedQuizIndex =
        await AsyncStorage.getItem('hercab_quizIndex');

      const savedFillIndex =
        await AsyncStorage.getItem('hercab_fillIndex');


      if (savedWords) {
        const parsed = JSON.parse(savedWords);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map((item) => ({
            ...item,
            status: item.status || 'new',
            correctCount: item.correctCount || 0,
            wrongCount: item.wrongCount || 0,
          }));

          setWords(migrated);
        }
      }


      if (savedScore) {
        setScore(Number(savedScore));
      }

      if (savedCardIndex) {
        setCardIndex(Number(savedCardIndex));
      }

      if (savedQuizIndex) {
        setQuizIndex(Number(savedQuizIndex));
      }

      if (savedFillIndex) {
        setFillIndex(Number(savedFillIndex));
      }

    } catch (error) {
      console.log('Load error:', error);

    } finally {
      setLoaded(true);
    }
  }


  async function saveData() {
    try {
      await AsyncStorage.setItem(
        'hercab_words',
        JSON.stringify(words)
      );

      await AsyncStorage.setItem(
        'hercab_score',
        String(score)
      );

      await AsyncStorage.setItem(
        'hercab_cardIndex',
        String(cardIndex)
      );

      await AsyncStorage.setItem(
        'hercab_quizIndex',
        String(quizIndex)
      );

      await AsyncStorage.setItem(
        'hercab_fillIndex',
        String(fillIndex)
      );

    } catch (error) {
      console.log('Save error:', error);
    }
  }


  const masteredCount = useMemo(() => {
    return words.filter(
      (item) => item.status === 'mastered'
    ).length;
  }, [words]);


  const learningCount = useMemo(() => {
    return words.filter(
      (item) => item.status === 'learning'
    ).length;
  }, [words]);


  const hardCount = useMemo(() => {
    return words.filter(
      (item) => item.status === 'hard'
    ).length;
  }, [words]);


  const newCount = useMemo(() => {
    return words.filter(
      (item) => item.status === 'new'
    ).length;
  }, [words]);


  const totalCorrect = useMemo(() => {
    return words.reduce(
      (total, item) =>
        total + (item.correctCount || 0),
      0
    );
  }, [words]);


  const totalWrong = useMemo(() => {
    return words.reduce(
      (total, item) =>
        total + (item.wrongCount || 0),
      0
    );
  }, [words]);


  const totalAnswers =
    totalCorrect + totalWrong;


  const accuracy =
    totalAnswers === 0
      ? 0
      : Math.round(
          (totalCorrect / totalAnswers) * 100
        );


  const progress =
    words.length === 0
      ? 0
      : Math.round(
          (masteredCount / words.length) * 100
        );


  const safeCardIndex =
    words.length === 0
      ? 0
      : cardIndex % words.length;


  const safeQuizIndex =
    words.length === 0
      ? 0
      : quizIndex % words.length;


  const safeFillIndex =
    words.length === 0
      ? 0
      : fillIndex % words.length;


  const currentWord =
    words[safeCardIndex];


  const quizWord =
    words[safeQuizIndex];


  const fillWord =
    words[safeFillIndex];


  useEffect(() => {
    if (screen === 'quiz') {
      makeQuizOptions();
    }
  }, [screen, quizIndex, words.length]);


  function openScreen(name) {
    setScreen(name);

    setQuizFeedback('');
    setQuizLocked(false);

    setFillFeedback('');
    setFillAnswer('');
    setFillLocked(false);

    setAiFeedback('');
  }


  async function generateWithAI() {
    const cleanWord = newWord.trim();

    if (!cleanWord) {
      setAiFeedback('Write a word first.');
      return;
    }

    if (aiLoading) {
      return;
    }

    setAiLoading(true);
    setAiFeedback('');

    try {
      const response = await fetch(
        AI_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word: cleanWord,
          }),
        }
      );


      const rawText = await response.text();

      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `AI returned non-JSON response (${response.status})`
        );
      }


      if (!response.ok) {
        throw new Error(
          data?.error ||
          `AI request failed (${response.status})`
        );
      }


      if (
        !data.definition ||
        !data.example ||
        !data.collocation
      ) {
        throw new Error(
          'AI response is missing vocabulary fields.'
        );
      }


      setNewDefinition(
        String(data.definition)
      );

      setNewExample(
        String(data.example)
      );

      setNewCollocation(
        String(data.collocation)
      );

      setAiFeedback('Generated ✓');

    } catch (error) {
      console.log(
        'AI generation error:',
        error
      );

      setAiFeedback(
        'Could not generate. Try again.'
      );

    } finally {
      setAiLoading(false);
    }
  }


  function addWord() {
    const cleanWord = newWord.trim();


    if (!cleanWord) {
      return;
    }


    const exists =
      words.some(
        (item) =>
          item.word.toLowerCase() ===
          cleanWord.toLowerCase()
      );


    if (exists) {
      setAiFeedback(
        'This word is already in Hercab.'
      );

      return;
    }


    const item = {
      word: cleanWord,

      definition:
        newDefinition.trim() ||
        'Add a simple English definition.',

      example:
        newExample.trim() ||
        'Add a B2/C1 example sentence.',

      collocation:
        newCollocation.trim() ||
        'Add a useful collocation.',

      status: 'new',

      correctCount: 0,

      wrongCount: 0,
    };


    setWords((previous) => [
      ...previous,
      item,
    ]);


    setScore(
      (previous) => previous + 5
    );


    setNewWord('');
    setNewDefinition('');
    setNewExample('');
    setNewCollocation('');
    setAiFeedback('');


    setCardIndex(words.length);

    setScreen('learn');
  }


  function deleteWord(index) {
    const target = words[index];

    if (!target) {
      return;
    }

    const remove = () => {
      setWords((previous) =>
        previous.filter((_, i) => i !== index)
      );

      setCardIndex(0);
      setQuizIndex(0);
      setFillIndex(0);

      setQuizFeedback('');
      setQuizLocked(false);
      setFillFeedback('');
      setFillAnswer('');
      setFillLocked(false);
    };

    // Alert works on iOS/Android; on web we fall back to window.confirm.
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`Delete “${target.word}”?`)) {
        remove();
      }
      return;
    }

    Alert.alert(
      'Delete word?',
      `“${target.word}” will be removed from Hercab.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: remove },
      ]
    );
  }


  function markKnown(index) {
    setWords((previous) =>
      previous.map((item, i) => {
        if (i !== index) {
          return item;
        }


        const nextCount =
          (item.correctCount || 0) + 1;


        return {
          ...item,

          correctCount: nextCount,

          status:
            nextCount >= 3
              ? 'mastered'
              : 'learning',
        };
      })
    );
  }


  function markHard(index) {
    setWords((previous) =>
      previous.map((item, i) => {
        if (i !== index) {
          return item;
        }


        return {
          ...item,

          status: 'hard',

          wrongCount:
            (item.wrongCount || 0) + 1,
        };
      })
    );
  }


  function nextCard(known) {
    if (!currentWord) {
      return;
    }


    if (known) {
      markKnown(safeCardIndex);

      setScore(
        (previous) => previous + 5
      );

    } else {
      markHard(safeCardIndex);
    }


    setCardIndex((previous) => {
      if (words.length === 0) {
        return 0;
      }

      return (previous + 1) % words.length;
    });
  }


  function shuffle(array) {
    const result = [...array];

    for (
      let i = result.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() * (i + 1)
        );

      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  }


  function makeQuizOptions() {
    if (!quizWord) {
      setQuizOptions([]);
      return;
    }


    const others =
      shuffle(
        words.filter(
          (item) =>
            item.word !== quizWord.word
        )
      ).slice(0, 3);


    const options =
      shuffle([
        quizWord,
        ...others,
      ]);


    setQuizOptions(options);
  }


  function answerQuiz(answer) {
    if (!quizWord || quizLocked) {
      return;
    }


    setQuizLocked(true);


    if (answer === quizWord.word) {
      markKnown(safeQuizIndex);

      setScore(
        (previous) => previous + 10
      );

      setQuizFeedback(
        'Correct · +10 XP'
      );

    } else {
      markHard(safeQuizIndex);

      setQuizFeedback(
        `Correct answer: ${quizWord.word}`
      );
    }
  }


  function nextQuiz() {
    setQuizFeedback('');
    setQuizLocked(false);


    setQuizIndex((previous) => {
      if (words.length === 0) {
        return 0;
      }

      return (previous + 1) % words.length;
    });
  }


  function createBlankSentence(item) {
    if (!item) {
      return '';
    }


    const example =
      item.example || '';


    const word =
      item.word || '';


    if (!example || !word) {
      return `Write the word: ${item.definition}`;
    }


    const index =
      example
        .toLowerCase()
        .indexOf(
          word.toLowerCase()
        );


    if (index === -1) {
      return `${item.definition} → ______`;
    }


    return (
      example.slice(0, index) +
      '______' +
      example.slice(
        index + word.length
      )
    );
  }


  function checkFillAnswer() {
    if (
      !fillWord ||
      fillLocked
    ) {
      return;
    }


    const answer =
      fillAnswer
        .trim()
        .toLowerCase();


    if (!answer) {
      return;
    }


    setFillLocked(true);


    if (
      answer ===
      fillWord.word.toLowerCase()
    ) {
      markKnown(safeFillIndex);

      setScore(
        (previous) =>
          previous + 10
      );

      setFillFeedback(
        'Correct · +10 XP'
      );

    } else {
      markHard(safeFillIndex);

      setFillFeedback(
        `Correct answer: ${fillWord.word}`
      );
    }
  }


  function nextFill() {
    setFillAnswer('');
    setFillFeedback('');
    setFillLocked(false);


    setFillIndex((previous) => {
      if (words.length === 0) {
        return 0;
      }

      return (previous + 1) % words.length;
    });
  }


  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>

          <Text style={styles.logo}>
            Her
            <Text style={styles.logoAccent}>
              cab
            </Text>
          </Text>

          <Text style={styles.loadingText}>
            Loading...
          </Text>

        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.shell}>


        {screen === 'home' && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >

            <View style={styles.header}>

              <View>

                <Text style={styles.logo}>
                  Her
                  <Text style={styles.logoAccent}>
                    cab
                  </Text>
                </Text>

                <Text style={styles.tagline}>
                  SMALL WORDS. BIG WORLDS.
                </Text>

              </View>


              <View style={styles.profile}>
                <Image
                  source={require('./assets/icon.png')}
                  style={styles.profileLogo}
                />
              </View>

            </View>


            <View style={styles.hero}>

              <Text style={styles.label}>
                VOCABULARY MASTERY
              </Text>

              <View style={styles.progressCircle}>

                <Text style={styles.progress}>
                  {progress}%
                </Text>

                <Text style={styles.progressLabel}>
                  mastered
                </Text>

              </View>

              <Text style={styles.heroText}>
                {masteredCount} of {words.length} words mastered
              </Text>

            </View>


            <Text style={styles.sectionTitle}>
              Today
            </Text>


            <Pressable
              style={styles.mission}
              onPress={() =>
                openScreen('learn')
              }
            >

              <View style={styles.missionIcon}>
                <Text style={styles.accentText}>
                  ◎
                </Text>
              </View>


              <View style={styles.flexOne}>

                <Text style={styles.smallLabel}>
                  TODAY'S MISSION
                </Text>

                <Text style={styles.missionTitle}>
                  Review your words
                </Text>

                <Text style={styles.muted}>
                  {hardCount} hard · {learningCount} learning
                </Text>

              </View>


              <Text style={styles.arrow}>
                ›
              </Text>

            </Pressable>


            <View style={styles.statsRow}>

              <StatCard
                number={masteredCount}
                label="Mastered"
              />

              <StatCard
                number={learningCount}
                label="Learning"
              />

              <StatCard
                number={hardCount}
                label="Hard"
              />

            </View>


            <View style={styles.microRow}>

              <Text style={styles.microText}>
                {words.length} words
              </Text>

              <Text style={styles.microText}>
                {newCount} new
              </Text>

              <Text style={styles.microText}>
                {score} XP
              </Text>

            </View>


            <Text style={styles.sectionTitle}>
              Practice
            </Text>


            <PracticeCard
              icon="＋"
              title="Add Word"
              subtitle="Build your vocabulary."
              onPress={() =>
                openScreen('add')
              }
            />


            <PracticeCard
              icon="▣"
              title="Flashcards"
              subtitle="Active recall."
              onPress={() =>
                openScreen('learn')
              }
            />


            <PracticeCard
              icon="◎"
              title="Quiz"
              subtitle="Test your memory."
              onPress={() =>
                openScreen('quiz')
              }
            />


            <PracticeCard
              icon="✎"
              title="Fill Blank"
              subtitle="Complete the sentence."
              onPress={() =>
                openScreen('fill')
              }
            />


            <PracticeCard
              icon="▥"
              title="Stats"
              subtitle="Track your progress."
              onPress={() =>
                openScreen('stats')
              }
            />

          </ScrollView>
        )}


        {screen === 'add' && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >

            <ScreenHeader
              title="Add Word"
              onBack={() =>
                openScreen('home')
              }
            />


            <View style={styles.form}>

              <InputLabel text="WORD" />

              <TextInput
                style={styles.input}
                value={newWord}
                onChangeText={(text) => {
                  setNewWord(text);
                  setAiFeedback('');
                }}
                placeholder="e.g. legitimate"
                placeholderTextColor="#626873"
                autoCapitalize="none"
                editable={!aiLoading}
              />


              <Pressable
                style={[
                  styles.aiButton,
                  aiLoading &&
                    styles.aiButtonDisabled,
                ]}
                onPress={generateWithAI}
                disabled={aiLoading}
              >

                <Text style={styles.aiButtonText}>
                  {aiLoading
                    ? '✦ Generating...'
                    : '✦ Generate with AI'}
                </Text>

              </Pressable>


              {aiFeedback !== '' && (
                <Text
                  style={[
                    styles.aiFeedback,
                    aiFeedback === 'Generated ✓' &&
                      styles.aiSuccess,
                  ]}
                >
                  {aiFeedback}
                </Text>
              )}


              <InputLabel
                text="SIMPLE ENGLISH DEFINITION"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                ]}
                value={newDefinition}
                onChangeText={setNewDefinition}
                placeholder="A2-B1 definition"
                placeholderTextColor="#626873"
                multiline
              />


              <InputLabel
                text="B2/C1 EXAMPLE"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                ]}
                value={newExample}
                onChangeText={setNewExample}
                placeholder="Example sentence"
                placeholderTextColor="#626873"
                multiline
              />


              <InputLabel
                text="COLLOCATION"
              />

              <TextInput
                style={styles.input}
                value={newCollocation}
                onChangeText={setNewCollocation}
                placeholder="e.g. legitimate concern"
                placeholderTextColor="#626873"
              />


              <Pressable
                style={styles.primaryButton}
                onPress={addWord}
              >

                <Text style={styles.primaryButtonText}>
                  Add to Hercab
                </Text>

              </Pressable>

            </View>

          </ScrollView>
        )}


        {screen === 'learn' && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >

            <ScreenHeader
              title="Learn"
              onBack={() =>
                openScreen('home')
              }
            />


            {currentWord ? (
              <>

                <View style={styles.flashCard}>

                  <View style={styles.flashTop}>

                    <Text style={styles.counter}>
                      {safeCardIndex + 1} / {words.length}
                    </Text>

                    <View style={styles.flashActions}>
                      <StatusBadge
                        status={currentWord.status}
                      />

                      <Pressable
                        style={styles.deleteWordButton}
                        onPress={() => deleteWord(safeCardIndex)}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${currentWord.word}`}
                      >
                        <Text style={styles.deleteWordText}>×</Text>
                      </Pressable>
                    </View>

                  </View>


                  <Text style={styles.word}>
                    {currentWord.word}
                  </Text>


                  <Text style={styles.definition}>
                    {currentWord.definition}
                  </Text>


                  <Text style={styles.example}>
                    “{currentWord.example}”
                  </Text>


                  <View style={styles.collocation}>

                    <Text style={styles.collocationText}>
                      {currentWord.collocation}
                    </Text>

                  </View>


                  <Text style={styles.correctText}>
                    Correct recalls: {currentWord.correctCount || 0} / 3
                  </Text>

                </View>


                <Pressable
                  style={styles.secondaryButton}
                  onPress={() =>
                    nextCard(false)
                  }
                >

                  <Text style={styles.secondaryButtonText}>
                    Review again
                  </Text>

                </Pressable>


                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    nextCard(true)
                  }
                >

                  <Text style={styles.primaryButtonText}>
                    Know it
                  </Text>

                </Pressable>

              </>
            ) : (

              <EmptyState
                text="Add your first word."
              />

            )}

          </ScrollView>
        )}


        {screen === 'quiz' && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >

            <ScreenHeader
              title="Quiz"
              onBack={() =>
                openScreen('home')
              }
            />


            {quizWord ? (
              <View style={styles.quizCard}>

                <Text style={styles.smallLabel}>
                  WHICH WORD MEANS
                </Text>


                <Text style={styles.question}>
                  {quizWord.definition}
                </Text>


                {quizOptions.map(
                  (item, index) => (
                    <Pressable
                      key={`${item.word}-${index}`}
                      style={styles.option}
                      onPress={() =>
                        answerQuiz(item.word)
                      }
                      disabled={quizLocked}
                    >

                      <View style={styles.optionNumberBox}>
                        <Text style={styles.optionNumber}>
                          {index + 1}
                        </Text>
                      </View>


                      <Text style={styles.optionText}>
                        {item.word}
                      </Text>

                    </Pressable>
                  )
                )}


                {quizFeedback !== '' && (

                  <Text style={styles.feedback}>
                    {quizFeedback}
                  </Text>

                )}


                {quizLocked && (

                  <Pressable
                    style={styles.primaryButton}
                    onPress={nextQuiz}
                  >

                    <Text style={styles.primaryButtonText}>
                      Next
                    </Text>

                  </Pressable>

                )}

              </View>
            ) : (

              <EmptyState
                text="Add words before starting a quiz."
              />

            )}

          </ScrollView>
        )}


        {screen === 'fill' && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >

            <ScreenHeader
              title="Fill Blank"
              onBack={() =>
                openScreen('home')
              }
            />


            {fillWord ? (

              <View style={styles.quizCard}>

                <Text style={styles.smallLabel}>
                  COMPLETE THE SENTENCE
                </Text>


                <Text style={styles.fillSentence}>
                  {createBlankSentence(fillWord)}
                </Text>


                <TextInput
                  style={styles.input}
                  value={fillAnswer}
                  onChangeText={setFillAnswer}
                  placeholder="Type the missing word"
                  placeholderTextColor="#626873"
                  autoCapitalize="none"
                  editable={!fillLocked}
                />


                {!fillLocked && (

                  <Pressable
                    style={styles.primaryButton}
                    onPress={checkFillAnswer}
                  >

                    <Text style={styles.primaryButtonText}>
                      Check Answer
                    </Text>

                  </Pressable>

                )}


                {fillFeedback !== '' && (

                  <Text style={styles.feedback}>
                    {fillFeedback}
                  </Text>

                )}


                {fillLocked && (

                  <Pressable
                    style={styles.primaryButton}
                    onPress={nextFill}
                  >

                    <Text style={styles.primaryButtonText}>
                      Next
                    </Text>

                  </Pressable>

                )}

              </View>

            ) : (

              <EmptyState
                text="Add words before starting."
              />

            )}

          </ScrollView>
        )}


        {screen === 'stats' && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >

            <ScreenHeader
              title="Stats"
              onBack={() =>
                openScreen('home')
              }
            />


            <View style={styles.hero}>

              <Text style={styles.label}>
                YOUR PROGRESS
              </Text>

              <Text style={styles.bigProgress}>
                {progress}%
              </Text>

              <Text style={styles.centerMuted}>
                {masteredCount} mastered from {words.length} words
              </Text>

            </View>


            <StatsBlock
              label="Total Words"
              value={words.length}
            />

            <StatsBlock
              label="New"
              value={newCount}
            />

            <StatsBlock
              label="Learning"
              value={learningCount}
            />

            <StatsBlock
              label="Hard"
              value={hardCount}
            />

            <StatsBlock
              label="Mastered"
              value={masteredCount}
            />

            <StatsBlock
              label="Accuracy"
              value={`${accuracy}%`}
            />

            <StatsBlock
              label="Correct"
              value={totalCorrect}
            />

            <StatsBlock
              label="Wrong"
              value={totalWrong}
            />

            <StatsBlock
              label="XP"
              value={score}
            />

          </ScrollView>
        )}


        <View style={styles.bottomNav}>

          <NavItem
            label="Home"
            active={screen === 'home'}
            onPress={() =>
              openScreen('home')
            }
          />


          <NavItem
            label="Learn"
            active={screen === 'learn'}
            onPress={() =>
              openScreen('learn')
            }
          />


          <NavItem
            label="Games"
            active={
              screen === 'quiz' ||
              screen === 'fill'
            }
            onPress={() =>
              openScreen('quiz')
            }
          />


          <NavItem
            label="Add"
            active={screen === 'add'}
            onPress={() =>
              openScreen('add')
            }
          />


          <NavItem
            label="Stats"
            active={screen === 'stats'}
            onPress={() =>
              openScreen('stats')
            }
          />

        </View>

      </View>

    </SafeAreaView>
  );
}


function ScreenHeader({
  title,
  onBack,
}) {
  return (
    <View style={styles.screenHeader}>

      <Pressable
        style={styles.backButton}
        onPress={onBack}
      >

        <Text style={styles.backText}>
          ‹
        </Text>

      </Pressable>


      <Text style={styles.screenTitle}>
        {title}
      </Text>


      <View style={styles.headerSpacer} />

    </View>
  );
}


function PracticeCard({
  icon,
  title,
  subtitle,
  onPress,
}) {
  return (
    <Pressable
      style={styles.practiceCard}
      onPress={onPress}
    >

      <View style={styles.practiceIconCircle}>

        <Text style={styles.practiceIcon}>
          {icon}
        </Text>

      </View>


      <View style={styles.flexOne}>

        <Text style={styles.practiceTitle}>
          {title}
        </Text>

        <Text style={styles.muted}>
          {subtitle}
        </Text>

      </View>


      <Text style={styles.practiceArrow}>
        ›
      </Text>

    </Pressable>
  );
}


function StatCard({
  number,
  label,
}) {
  return (
    <View style={styles.statCard}>

      <Text style={styles.statNumber}>
        {number}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>

    </View>
  );
}


function StatsBlock({
  label,
  value,
}) {
  return (
    <View style={styles.statsBlock}>

      <Text style={styles.statsBlockLabel}>
        {label}
      </Text>

      <Text style={styles.statsBlockValue}>
        {value}
      </Text>

    </View>
  );
}


function StatusBadge({
  status,
}) {
  const label =
    status === 'mastered'
      ? 'MASTERED'
      : status === 'learning'
      ? 'LEARNING'
      : status === 'hard'
      ? 'HARD'
      : 'NEW';


  return (
    <View
      style={[
        styles.badge,

        status === 'hard' &&
          styles.badgeHard,

        status === 'mastered' &&
          styles.badgeMastered,
      ]}
    >

      <Text style={styles.badgeText}>
        {label}
      </Text>

    </View>
  );
}


function InputLabel({
  text,
}) {
  return (
    <Text style={styles.inputLabel}>
      {text}
    </Text>
  );
}


function EmptyState({
  text,
}) {
  return (
    <View style={styles.emptyState}>

      <Text style={styles.emptyStateText}>
        {text}
      </Text>

    </View>
  );
}


function NavItem({
  label,
  active,
  onPress,
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >

      <Text
        style={
          active
            ? styles.navDotActive
            : styles.navDot
        }
      >
        ●
      </Text>


      <Text
        style={
          active
            ? styles.navTextActive
            : styles.navText
        }
      >
        {label}
      </Text>

    </Pressable>
  );
}


const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#090A0D',
  },


  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: '#0B0D11',
  },


  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },


  flexOne: {
    flex: 1,
  },


  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  loadingText: {
    color: '#737A85',
    marginTop: 12,
  },


  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },


  logo: {
    color: '#F5F5F3',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },


  logoAccent: {
    color: '#E77972',
  },


  tagline: {
    color: '#656C78',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 5,
  },


  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#181B21',
    borderWidth: 1,
    borderColor: '#323740',
    alignItems: 'center',
    justifyContent: 'center',
  },


  profileLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },


  hero: {
    backgroundColor: '#12151A',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#252A32',
    padding: 22,
    marginBottom: 16,
  },


  label: {
    color: '#7C8490',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },


  progressCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignSelf: 'center',
    marginVertical: 24,
    backgroundColor: '#16191F',
    borderWidth: 8,
    borderColor: '#303640',
    alignItems: 'center',
    justifyContent: 'center',
  },


  progress: {
    color: '#F4F4F2',
    fontSize: 52,
    fontWeight: '300',
  },


  progressLabel: {
    color: '#777F8A',
    fontSize: 11,
    marginTop: 2,
  },


  heroText: {
    color: '#A0A6AE',
    textAlign: 'center',
    fontSize: 13,
  },


  sectionTitle: {
    color: '#F2F2F0',
    fontSize: 21,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },


  mission: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16191F',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#292E37',
    padding: 16,
  },


  missionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#39201F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },


  accentText: {
    color: '#E77972',
    fontSize: 24,
  },


  smallLabel: {
    color: '#777E88',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.3,
  },


  missionTitle: {
    color: '#F2F3F4',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },


  muted: {
    color: '#777F8A',
    fontSize: 12,
    marginTop: 4,
  },


  arrow: {
    color: '#EA8A83',
    fontSize: 28,
  },


  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },


  statCard: {
    width: '31.5%',
    backgroundColor: '#15181D',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#262B33',
    paddingVertical: 15,
    alignItems: 'center',
  },


  statNumber: {
    color: '#F3F3F2',
    fontSize: 21,
    fontWeight: '700',
  },


  statLabel: {
    color: '#707782',
    fontSize: 9,
    marginTop: 4,
  },


  microRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },


  microText: {
    color: '#636A75',
    fontSize: 10,
  },


  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14171C',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#252A32',
    padding: 16,
    marginBottom: 10,
  },


  practiceIconCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#1E2128',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },


  practiceIcon: {
    color: '#E77972',
    fontSize: 20,
  },


  practiceTitle: {
    color: '#F1F2F2',
    fontSize: 16,
    fontWeight: '700',
  },


  practiceArrow: {
    color: '#6E7580',
    fontSize: 26,
  },


  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },


  screenTitle: {
    color: '#F3F3F1',
    fontSize: 20,
    fontWeight: '700',
  },


  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#16191F',
    borderWidth: 1,
    borderColor: '#292E36',
    alignItems: 'center',
    justifyContent: 'center',
  },


  backText: {
    color: '#F4F4F2',
    fontSize: 28,
  },


  headerSpacer: {
    width: 42,
  },


  form: {
    backgroundColor: '#14171C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#282D35',
    padding: 18,
  },


  inputLabel: {
    color: '#777F89',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 14,
    marginBottom: 7,
  },


  input: {
    backgroundColor: '#0E1014',
    borderWidth: 1,
    borderColor: '#292E36',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#F4F4F2',
    fontSize: 15,
  },


  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },


  aiButton: {
    backgroundColor: '#1A1D23',
    borderWidth: 1,
    borderColor: '#593936',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },


  aiButtonDisabled: {
    opacity: 0.55,
  },


  aiButtonText: {
    color: '#E77972',
    fontSize: 14,
    fontWeight: '700',
  },


  aiFeedback: {
    color: '#E77972',
    fontSize: 11,
    marginTop: 8,
  },


  aiSuccess: {
    color: '#8CB9A5',
  },


  primaryButton: {
    backgroundColor: '#D96E68',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 14,
  },


  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },


  secondaryButton: {
    backgroundColor: '#171A20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2F38',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 14,
  },


  secondaryButtonText: {
    color: '#C9CDD3',
    fontWeight: '600',
  },


  flashCard: {
    backgroundColor: '#14171C',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#292E36',
    padding: 24,
  },


  flashTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },


  flashActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },


  deleteWordButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#241719',
    borderWidth: 1,
    borderColor: '#553035',
    alignItems: 'center',
    justifyContent: 'center',
  },


  deleteWordText: {
    color: '#E77972',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
  },


  counter: {
    color: '#777F89',
    fontSize: 11,
  },


  badge: {
    backgroundColor: '#292D34',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },


  badgeHard: {
    backgroundColor: '#402423',
  },


  badgeMastered: {
    backgroundColor: '#1D3730',
  },


  badgeText: {
    color: '#C8CDD3',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },


  word: {
    color: '#F5F5F3',
    fontSize: 42,
    fontWeight: '800',
  },


  definition: {
    color: '#D9DCE1',
    fontSize: 18,
    lineHeight: 27,
    marginTop: 18,
  },


  example: {
    color: '#858C96',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 20,
    fontStyle: 'italic',
  },


  collocation: {
    alignSelf: 'flex-start',
    backgroundColor: '#38211F',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 20,
  },


  collocationText: {
    color: '#E98B84',
    fontSize: 12,
    fontWeight: '600',
  },


  correctText: {
    color: '#646B75',
    fontSize: 11,
    marginTop: 18,
  },


  quizCard: {
    backgroundColor: '#14171C',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#292E36',
    padding: 20,
  },


  question: {
    color: '#F1F2F2',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 33,
    marginTop: 12,
    marginBottom: 20,
  },


  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171A20',
    borderWidth: 1,
    borderColor: '#30353E',
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },


  optionNumberBox: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#22262D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },


  optionNumber: {
    color: '#E77972',
    fontSize: 12,
    fontWeight: '700',
  },


  optionText: {
    color: '#EEF0F2',
    fontSize: 15,
  },


  feedback: {
    color: '#E98A84',
    fontWeight: '700',
    marginTop: 12,
  },


  fillSentence: {
    color: '#F1F2F2',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 32,
    marginTop: 14,
    marginBottom: 24,
  },


  bigProgress: {
    color: '#F3F4F4',
    fontSize: 64,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 18,
  },


  centerMuted: {
    color: '#777F8A',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },


  statsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#15181D',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#282D35',
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 10,
  },


  statsBlockLabel: {
    color: '#777F8A',
    fontSize: 13,
  },


  statsBlockValue: {
    color: '#F3F4F4',
    fontSize: 20,
    fontWeight: '700',
  },


  emptyState: {
    backgroundColor: '#14171C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#282D35',
    padding: 30,
    alignItems: 'center',
  },


  emptyStateText: {
    color: '#777F8A',
    fontSize: 14,
    textAlign: 'center',
  },


  bottomNav: {
    height: 82,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0D0F13',
    borderTopWidth: 1,
    borderTopColor: '#20242A',
    paddingBottom: 4,
  },


  navItem: {
    alignItems: 'center',
    width: 62,
  },


  navDotActive: {
    color: '#E77972',
    fontSize: 13,
  },


  navDot: {
    color: '#68707A',
    fontSize: 13,
  },


  navTextActive: {
    color: '#E77972',
    fontSize: 9,
    marginTop: 4,
  },


  navText: {
    color: '#68707A',
    fontSize: 9,
    marginTop: 4,
  },

});