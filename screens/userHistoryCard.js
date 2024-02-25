import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

const ResultComponent = ({ sdata, isModalVisible, setModalVisible }) => {
  const result = JSON.parse(sdata);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const data = Object.entries(result).map(([key, value]) => ({
    key,
    value: value.slice(0, -16),
  }));

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Icon name="ios-arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.heading}>Your Report</Text>
          <View style={styles.container}>
            {data.map((item, index) => (
              <View key={index} style={styles.row}>
                <View style={styles.key}>
                  <Text style={styles.keyText}>{item.key}</Text>
                </View>
                <View style={styles.value}>
                  <Text style={styles.valueText}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  heading:{
    fontWeight:"bold",
    marginBottom:15,
    fontSize:25,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170, // Adjust this value to set the top margin
    backgroundColor:'#ffffff',
    borderTopLeftRadius:30,
    borderTopRightRadius:30
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    left: 20,
  },
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  key: {
    width:105,
    marginRight:20,
  },
  keyText: {
    fontWeight:"bold"
  },
  resultButton: {
    backgroundColor: '#34d399',
    padding: 10,
    borderRadius: 10,
  }
});

export default ResultComponent;
