import Header from '@/components/global/Header';
import Background from '@/components/global/ImageBackground';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../global/Button';

const SelfAssessment = () => {
  const [answers, setAnswers] = useState(Array(7).fill(null));
  const [resultText, setResultText] = useState('');

  const questions = [
    { question: 'Feelings nervous, anxious or on edge', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Not being able to stop or control worrying', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Worrying too much about different things', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Trouble relaxing', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Being so restless that it is hard to sit still', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Becoming easily annoyed or irritable', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Feeling afraid as if something awful might happen', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  ];

  const handleSelectOption = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateTotal = () => {
    if (answers.includes(null)) {
      alert('Please answer all questions.');
      return;
    }

    const total = answers.reduce((acc, curr) => acc + curr, 0);

    if (total >= 0 && total <= 4) {
      setResultText('Minimal Anxiety');
    } else if (total >= 5 && total <= 9) {
      setResultText('Mild Anxiety');
    } else if (total >= 10 && total <= 14) {
      setResultText('Moderate Anxiety');
    } else if (total >= 15 && total <= 21) {
      setResultText('Severe Anxiety');
    }
  };

  const resetAssessment = () => {
    setAnswers(Array(7).fill(null));
    setResultText('');
  };

  return (
  <Header>
     <Background>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>GAD-7 Anxiety</Text>
          {questions.map((questionObj, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.questionText}>{questionObj.question}</Text>
              {questionObj.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => handleSelectOption(index, optionIndex)}
                  style={[
                    styles.optionContainer,
                    answers[index] === optionIndex ? styles.selectedOption : {},
                  ]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginLeft: 10,
                      backgroundColor: answers[index] === optionIndex ? 'orange' : 'white',
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
          {resultText !== '' &&<View style={{flexDirection:'row',alignSelf:'center'}}>
          <Text style={styles.averageText}>GAD-7 Anxiety Severity:</Text>
          <Text style={styles.result}>{resultText}</Text>
            </View>}
          <Button buttonType="login" onPress={calculateTotal} buttonStyles={styles.button}>
            Calculate
          </Button>
          <Button buttonType="login" onPress={resetAssessment} buttonStyles={styles.button}>
            Reset
          </Button>
        </View>
      </ScrollView>
     </Background>
      </Header>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 120,
  },
  card: {
    alignSelf: "center",
    justifyContent:'space-between',
    backgroundColor: "#B6A2CF",
    borderRadius: 10,
    padding: 20,
    width: "85%", // Adjust width as needed
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For iOS
    marginTop: 20,
    // flexDirection: "row",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'white'
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedOption: {
    // backgroundColor: 'blue',
  },
  optionText: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 10,
  },
  button: {
    marginTop: 30,
   backgroundColor:'#B6A2CF'
  },
  averageText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color:'white'
  },
  result: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color:'#fdc500'
  },
});

export default SelfAssessment;
