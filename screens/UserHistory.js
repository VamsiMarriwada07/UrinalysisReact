import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultComponent from './userHistoryCard';

const UserHistory = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    // Load user history from AsyncStorage when the component mounts
    loadUserHistory();
  }, []); // Empty dependency array to only run this effect once during mount

  useEffect(() => {
    // Update user history whenever it changes
    AsyncStorage.setItem('userHistory', JSON.stringify(userHistory));
  }, [userHistory]); // Add userHistory as a dependency

  const clearUserHistory = () => {
    AsyncStorage.removeItem('userHistory')
      .then(() => {
        setUserHistory([]);
        Alert.alert('User History Cleared', 'Your user history has been cleared.');
      })
      .catch((error) => {
        console.error('Error clearing user history:', error);
      });
  };

  const loadUserHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('userHistory');
      if (storedHistory) {
        setUserHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };

  const loadResultData = async (index) => {
    try {
      const storedResultData = await AsyncStorage.getItem(`resultData-${index}`);
      if (storedResultData) {
        setSelectedResult(JSON.parse(storedResultData));
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error loading result data:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => loadResultData(index + 1)}
    >
    <View style={styles.historyItem}>
      <Text style={styles.historyItemText}>{item}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:50}}>
      <Text style={styles.heading}>User History</Text>
      <FlatList
        data={userHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      {selectedResult && (
        <ResultComponent
          sdata={JSON.stringify(selectedResult)}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      <View style={{marginBottom:15}}>
      <TouchableOpacity onPress={clearUserHistory} style={styles.clearButton}>
        <Text style={{color:"#fff"}}>Clear</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontSize: 24,
    },
    historyItemContainer: {
      marginBottom: 10,
    },
    historyItem: {
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor:'#e9ecef',
      marginBottom: 10,
    },
    historyItemText: {
      fontSize: 16,
    },
    clearButton: {
      backgroundColor: '#ff6961',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
  });

export default UserHistory;
