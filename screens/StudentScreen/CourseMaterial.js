import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import baseURL from '../../config';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const CourseMaterial = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const route = useRoute();
  const {course, studentId} = route.params;
  console.log('bbb', studentId);
  const [activeTab, setActiveTab] = useState('Books');
  const [subTab, setSubTab] = useState('Lesson Plan');
  const [weekNo, setWeekNo] = useState('');
  const [lessonPlan, setLessonPlan] = useState(null);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [referenceMaterials, setReferenceMaterials] = useState([]);
  const [books, setBooks] = useState([]);
  const [myLessonPlans, setMyLessonPlans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLessonPlan, setCurrentLessonPlan] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const fetchLessonPlans = async () => {
    try {
      const response = await fetch(
        `${baseURL}/LessonPlan/getAllLessonPlan?courseCode=${course.courseCode}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result);
      if (result.status === 'Success') {
        setLessonPlans(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch Lesson Plans Error: ', error);
      Alert.alert('Error', 'Failed to fetch lesson plans');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${baseURL}/CourseBookAssign/getCourseAssignedBook?courseCode=${course.courseCode}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Books API Response:', result);
      if (result.status === 'Success') {
        setBooks(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch Books Error: ', error);
      Alert.alert('Error', 'Failed to fetch books');
    }
  };

  const fetchReferenceMaterials = async () => {
    try {
      const response = await fetch(
        `${baseURL}/Reference/getReferenceMaterial?courseCode=${course.courseCode}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('References API Response:', result);
      if (result.status === 'Success') {
        setReferenceMaterials(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch References Error: ', error);
      Alert.alert('Error', 'Failed to fetch reference materials');
    }
  };

  const fetchMyLessonPlans = async () => {
    try {
      const response = await fetch(
        `${baseURL}/LessonPlan/getMyLessonPlan?studentId=${studentId}&courseCode=${course.courseCode}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('My Lesson Plans API Response:', result);
      if (result.status === 'Success') {
        setMyLessonPlans(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch My Lesson Plans Error: ', error);
      Alert.alert('Error', 'Failed to fetch my lesson plans');
    }
  };

  const uploadLessonPlan = async () => {
    if (!weekNo || !selectedPdf) {
      Alert.alert('Error', 'Please enter week number and select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('lessonPlanTitle', weekNo);
    formData.append('creatorId', studentId);
    formData.append('creatorType', 'Student');
    formData.append('courseCode', course.courseCode);
    formData.append('lessonPlanPdf', {
      uri: selectedPdf.uri,
      type: selectedPdf.type,
      name: selectedPdf.name,
    });

    try {
      const response = await fetch(`${baseURL}/LessonPlan/addLessonPlan`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      if (result.status === 'Success') {
        Alert.alert('Success', result.message);
        fetchMyLessonPlans();
        setWeekNo('');
        setSelectedPdf(null);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Upload Lesson Plan Error: ', error);
      Alert.alert('Error', 'Failed to upload lesson plan');
    }
  };

  const editLessonPlan = lessonPlan => {
    setCurrentLessonPlan(lessonPlan);
    setWeekNo(lessonPlan.lessonPlanTitle);
    setIsModalVisible(true);
  };

  const updateLessonPlan = async () => {
    if (!weekNo || (currentLessonPlan && !selectedPdf)) {
      Alert.alert('Error', 'Please enter week number and select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('lessonPlanTitle', weekNo);
    if (selectedPdf) {
      formData.append('lessonPlanPdf', {
        uri: selectedPdf.uri,
        type: selectedPdf.type,
        name: selectedPdf.name,
      });
    }

    try {
      const response = await fetch(
        `${baseURL}/LessonPlan/updateLessonPlan?id=${currentLessonPlan.lessonPlanId}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const result = await response.json();
      if (result.status === 'Success') {
        Alert.alert('Success', result.message);
        fetchMyLessonPlans();
        setIsModalVisible(false);
        setWeekNo('');
        setSelectedPdf(null);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Update Lesson Plan Error: ', error);
      Alert.alert('Error', 'Failed to update lesson plan');
    }
  };

  const deleteLessonPlan = async lessonPlanId => {
    try {
      const response = await fetch(
        `${baseURL}/LessonPlan/removeLessonPlan?id=${lessonPlanId}`,
        {
          method: 'DELETE',
        },
      );
      const result = await response.json();
      if (result.status === 'Success') {
        fetchMyLessonPlans(); // Refresh the list
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Delete Lesson Plan Error: ', error);
      Alert.alert('Error', 'Failed to delete lesson plan');
    }
  };

  const shareLessonPlan = lessonPlanId => {
    const courseCode = course.courseCode;
    navigation.navigate('ShareReference', {
      lessonPlanId,
      courseCode,
      studentId,
    });
  };

  const selectPdf = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedPdf(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'Books') {
        fetchBooks();
      } else if (activeTab === 'Weekly LP' && subTab === 'Lesson Plan') {
        fetchLessonPlans();
      } else if (activeTab === 'Weekly LP' && subTab === 'Reference Material') {
        fetchReferenceMaterials();
      } else if (activeTab === 'My Lesson Plan') {
        fetchMyLessonPlans();
      }
    }, [activeTab, subTab]),
  );

  return (
    <View style={styles.container}>
      <Text>{studentId}</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('Books')}
          style={[styles.tabButton, activeTab === 'Books' && styles.activeTab]}>
          <Text
            style={[
              styles.tabText,
              activeTab !== 'Books' && styles.inactiveTabText,
            ]}>
            Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Weekly LP')}
          style={[
            styles.tabButton,
            activeTab === 'Weekly LP' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              activeTab !== 'Weekly LP' && styles.inactiveTabText,
            ]}>
            Weekly LP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          //onPress={() => setActiveTab('My Lesson Plan')}
          onPress={() => setActiveTab('My Lesson Plan')}
          style={[
            styles.tabButton,
            activeTab === 'My Lesson Plan' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              activeTab !== 'My Lesson Plan' && styles.inactiveTabText,
            ]}>
            My References
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Books' && (
        <FlatList
          data={books}
          keyExtractor={item => item.bookId.toString()}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Title: {item.bookName}</Text>
              <Text style={styles.itemText}>Author: {item.bookAuthorName}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PDFReaderScreen', {
                    pdfUri: item.bookPdfPath,
                  })
                }>
                <Text style={styles.linkText}>Open PDF</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text>No books assigned to this course.</Text>}
        />
      )}
      {activeTab === 'Weekly LP' && (
        <View style={styles.contentContainer}>
          <View style={styles.subTabContainer}>
            <TouchableOpacity
              onPress={() => setSubTab('Lesson Plan')}
              style={[
                styles.tabButton,
                subTab === 'Lesson Plan' && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  subTab !== 'Lesson Plan' && styles.inactiveTabText,
                ]}>
                Lesson Plan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSubTab('Reference Material')}
              style={[
                styles.tabButton,
                subTab === 'Reference Material' && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  subTab !== 'Reference Material' && styles.inactiveTabText,
                ]}>
                Reference Material
              </Text>
            </TouchableOpacity>
          </View>

          {subTab === 'Lesson Plan' && (
            <FlatList
              data={lessonPlans}
              keyExtractor={item => item.lessonPlanId.toString()}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    Title: {item.lessonPlanTitle}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PDFReaderScreen', {
                        pdfUri: item.lessonPlanPdfPatn,
                      })
                    }>
                    <Text style={styles.linkText}>Open PDF</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text>No lesson plans available.</Text>}
            />
          )}

          {subTab === 'Reference Material' && (
            <FlatList
              data={referenceMaterials}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    Title: {item.referenceTitle}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(item.referenceUri)}>
                    <Text style={styles.linkText}>Open Reference</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text>No reference materials available.</Text>
              }
            />
          )}
        </View>
      )}
      {activeTab === 'My Lesson Plan' && (
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Week No"
            value={weekNo}
            onChangeText={setWeekNo}
          />
          <TouchableOpacity style={styles.button} onPress={selectPdf}>
            <Text style={styles.buttonText}>Browse PDF</Text>
          </TouchableOpacity>
          {selectedPdf && (
            <Text style={styles.selectedFileText}>{selectedPdf.name}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={uploadLessonPlan}>
            <Text style={styles.buttonText}>Add Reference</Text>
          </TouchableOpacity>

          <FlatList
            data={myLessonPlans}
            keyExtractor={item => item.lessonPlanId.toString()}
            renderItem={({item}) => (
              <View style={styles.lessonPlanContainer}>
                <Text style={styles.lessonPlanText}>
                  Week {item.lessonPlanTitle}
                </Text>
                <View style={styles.lessonPlanActions}>
                  <TouchableOpacity onPress={() => editLessonPlan(item)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteLessonPlan(item.lessonPlanId)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      shareLessonPlan(item.lessonPlanId, item.studentId)
                    }>
                    <Text style={styles.shareText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text>No lesson plans available.</Text>}
          />

          <Modal
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text>Edit Lesson Plan</Text>
              <TextInput
                style={styles.input}
                placeholder="Week No"
                value={weekNo}
                onChangeText={setWeekNo}
              />
              <TouchableOpacity style={styles.button} onPress={selectPdf}>
                <Text style={styles.buttonText}>Browse PDF</Text>
              </TouchableOpacity>
              {selectedPdf && (
                <Text style={styles.selectedFileText}>{selectedPdf.name}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={updateLessonPlan}>
                <Text style={styles.buttonText}>Update Lesson Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#5B5D8B',
  },
  inactiveTabText: {
    color: '#5B5D8B',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    flex: 1,
  },
  subTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lessonPlanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  lessonPlanText: {
    fontSize: 16,
    color: 'black',
  },
  lessonPlanActions: {
    flexDirection: 'row',
  },
  editText: {
    color: '#5B5D8B',
    marginRight: 10,
  },
  deleteText: {
    color: '#ff0000',
    marginRight: 10,
  },
  shareText: {
    color: '#5B5D8B',
    marginRight: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  modalContent: {
    padding: 20,
  },
  cancelText: {
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 10,
  },
  selectedFileText: {
    marginBottom: 10,
    color: 'black',
  },
  linkText: {
    color: '#5B5D8B',
    textDecorationLine: 'underline',
  },
});

export default CourseMaterial;
