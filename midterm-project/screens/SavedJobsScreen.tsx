import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Platform, StatusBar } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../src/types';
import { useJobs } from '../context/JobsContext';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

type Props = StackScreenProps<RootStackParamList, 'SavedJobs'>;

const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { savedJobs, removeJob } = useJobs();
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  // Simulating a data refresh, you can replace this with an API call if needed.
  await new Promise(resolve => setTimeout(resolve, 1000));
  setRefreshing(false);
};

  const toggleDescription = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 20
    },
    headerContainer: {
      marginBottom: 16,
      marginTop: 20
    },
    backButton: {
      position: 'absolute',
      left: 8,
      zIndex: 2,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#333',
    },
    titleBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f0f0',
      paddingVertical: 16,
      paddingHorizontal: 16,
      paddingLeft: 15,
      borderRadius: 8,
      marginTop: 40,
    },
    titleIcon: {
      marginRight: 10,
    },
    emptyText: {
      color: theme === 'dark' ? '#fff' : '#333',
    },
    jobCard: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    jobTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: theme === 'dark' ? '#fff' : '#333',
    },
    company: {
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 16,
      marginBottom: 12,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    actionButton: {
      padding: 12,
      borderRadius: 20,
      minWidth: '48%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    removeButton: {
      backgroundColor: '#ff6b6b',
    },
    applyButton: {
      backgroundColor: '#2196F3',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    descriptionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#A782EC' : '#A782EC',
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    descriptionButtonText: {
      color: theme === 'dark' ? '#fff' : '#fff',
      fontSize: 14,
    },
    jobDescription: {
      color: theme === 'dark' ? '#ccc' : '#666',
      fontSize: 14,
      marginBottom: 12,
      lineHeight: 20,
      textAlign: 'left',
    },
    jobDetails: {
      marginBottom: 12,
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 14,
    },
    locationsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
      alignItems: 'center',
    },
    locationChip: {
      backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    locationText: {
      color: theme === 'dark' ? '#fff' : '#333',
      fontSize: 12,
    },
  });

  const handleRemove = (jobId: string) => {
    Alert.alert(
      "Remove Job",
      "Are you sure you want to remove this job from the list?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => removeJob(jobId),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <>
      {Platform.OS === 'android' && (
        <View style={{ 
          height: StatusBar.currentHeight,
          backgroundColor: 'transparent' 
        }} />
      )}
      
      <SafeAreaView 
        style={[styles.container, {paddingHorizontal: 16}]}
        edges={['right', 'left', 'bottom']}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme === 'dark' ? '#fff' : '#333'} 
            />
          </TouchableOpacity>
          <View style={styles.titleBox}>
            <View style={styles.titleIcon}>
              <Ionicons 
                name="bookmark"
                size={30} 
                color={theme === 'dark' ? '#fff' : '#333'}
                style={styles.titleIcon}
              />
            </View>
            <Text style={styles.title}>Saved Jobs</Text>
          </View>
        </View>
        
        {savedJobs.length === 0 ? (
          <Text style={styles.emptyText}>No saved jobs yet</Text>
        ) : (
          <FlatList
  data={savedJobs}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.company}>{item.company}</Text>
      
      {item.locations && (
        <View style={styles.locationsContainer}>
          <Ionicons name="location" size={14} color={theme === 'dark' ? '#aaa' : '#666'} style={{ marginRight: 4 }} />
          {Array.isArray(item.locations) 
            ? item.locations.map((location, index) => (
                <View key={index} style={styles.locationChip}>
                  <Text style={styles.locationText}>📍 {location.trim()}</Text>
                </View>
              ))
            : null}
        </View>
      )}

      {item.salary && <Text style={styles.jobDetails}>💰 {item.salary}</Text>}

      <TouchableOpacity onPress={() => toggleDescription(item.id)} style={styles.descriptionButton} activeOpacity={0.7}>
        <Text style={styles.descriptionButtonText}>
          {expandedJobs[item.id] ? 'Hide Description' : 'View Description'}
        </Text>
      </TouchableOpacity>

      {expandedJobs[item.id] && (
  <Text style={styles.jobDescription}>
    {[
      item.jobType && `It is a ${item.jobType.toLowerCase()} job`,
      item.workModel && `with a ${item.workModel.toLowerCase()} work model`,
      item.seniorityLevel && `and requires a ${item.seniorityLevel.toLowerCase()} level`
    ]
      .filter(Boolean)
      .join(' ') + '.'}
  </Text>
)}

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleRemove(item.id)} style={[styles.actionButton, styles.removeButton]} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Remove</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('ApplicationForm', { job: item })} style={[styles.actionButton, styles.applyButton]} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
  refreshing={refreshing}
  onRefresh={handleRefresh}
  showsVerticalScrollIndicator={false}
/>

        )}
      </SafeAreaView>
    </>
  );
};

export default SavedJobsScreen;