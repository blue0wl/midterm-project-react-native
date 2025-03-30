import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Job } from '../src/types';
import { useJobs } from '../context/JobsContext';
import { fetchJobs } from '../api/jobService';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StatusBar } from 'react-native'; 
import { Image } from 'react-native'; 

type Props = StackScreenProps<RootStackParamList, 'JobFinder'>;

export const JobFinderScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme, toggleTheme } = useTheme();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { saveJob, savedJobs } = useJobs();
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme === 'dark' ? '#121212' : '#f5f5f5');
      StatusBar.setTranslucent(true);
    }
  }, [theme]);

  const toggleTags = (jobId: string) => {
    setExpandedTags(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginBottom: 20,
      height: 44

    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8, 
    },
    themeToggle: {
      padding: 10,
      borderRadius: 50,
      backgroundColor: theme === 'dark' ? '#333' : '#eee',
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
    },
    searchInput: {
      padding: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333' : '#ddd',
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    jobCard: {
      padding: 16,
      marginBottom: 16,
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
      marginBottom: 4,
      color: theme === 'dark' ? '#fff' : '#333',
    },
    company: {
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 16,
      marginBottom: 12,
    },
    detailsContainer: {
      marginBottom: 12,
    },
    detail: {
      fontSize: 14,
      color: theme === 'dark' ? '#ccc' : '#444',
      marginBottom: 4,
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontWeight: '600',
      marginBottom: 6,
      color: theme === 'dark' ? '#fff' : '#333',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginRight: -8,
    },
    tag: {
      backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 8,
      fontSize: 12,
      color: theme === 'dark' ? '#fff' : '#333',
      overflow: 'hidden',
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
    loader: {
      marginTop: 20,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: theme === 'dark' ? '#aaa' : '#666',
      fontSize: 16,
    },
    listContent: {
      paddingBottom: 16,
    },
    savedJobsButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      justifyContent: 'center',
      height: 48,
      alignItems: 'center'
    },
    savedJobsButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#333',
    },
    savedButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#333',
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
      zIndex: -1,
    },
    countBadgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countBadge: {
      backgroundColor: '#4CAF50',
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 6,
    },
    countText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    savedText: {
      color: theme === 'dark' ? '#fff' : '#333',
      fontWeight: 'bold',
      fontSize: 14,
    },
    viewMoreTag: {
      backgroundColor: theme === 'dark' ? '#A782EC' : '#A782EC',
    },
    viewMoreText: {
      color: theme === 'dark' ? '#fff' : '#fff',
    },
    logo: {
      width: 130, // Adjust based on your logo dimensions
      height: 130, // Adjust based on your logo dimensions
      resizeMode: 'contain',
      marginTop: -4,
      marginLeft: -13
    },
    themeImage: {
      width: 24, // Adjust based on your image dimensions
      height: 24, // Adjust based on your image dimensions
      resizeMode: 'contain',
      tintColor: theme === 'dark' ? '#fff' : '#333', 
    },
    themeToggleContainer: {
      padding: 10,
      borderRadius: 50,
      backgroundColor: theme === 'dark' ? '#333' : '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  });

  const filteredJobs = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return allJobs.filter(job => {
      const searchFields = [
        job.title?.toLowerCase(),
        job.company?.toLowerCase(),
        job.jobType?.toLowerCase(),
        ...(job.tags ?? []).map(tag => tag.toLowerCase()),
        ...(job.locations ?? []).map(loc => loc.toLowerCase())
      ];
      return searchFields.some(field => field?.includes(searchTerm));
    });
  }, [search, allJobs]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const jobs = await fetchJobs();
      setAllJobs(jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allJobs.length > 0 && __DEV__) {
      console.log('First job:', JSON.stringify(allJobs[0], null, 2));
      console.log('All job IDs:', allJobs.map(j => j.id));
    }
  }, [allJobs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadJobs().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadJobs();
  }, []);

  const renderJobItem = ({ item }: { item: Job }) => {
    const isExpanded = expandedTags[item.id] || false;
    const visibleTags = isExpanded ? item.tags ?? [] : (item.tags ?? []).slice(0, 3);
    const hasMoreTags = (item.tags?.length ?? 0) > 3;

    return (
      <View style={styles.jobCard}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.company}>{item.company}</Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>🗓️ Type: {item.jobType}</Text>
          <Text style={styles.detail}>🏢 Model: {item.workModel}</Text>
          <Text style={styles.detail}>📶 Level: {item.seniorityLevel}</Text>
          <Text style={styles.detail}>💰 Salary: {item.salary}</Text>
        </View>
        
        {(item.locations ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Locations:</Text>
            <View style={styles.tagsContainer}>
              {(item.locations ?? []).map((location = '', index) => (
                <Text 
                  key={`${item.id}-location-${index}-${location}`}
                  style={styles.tag}
                  numberOfLines={1}
                >
                  {location}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {(item.tags ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags:</Text>
            <View style={styles.tagsContainer}>
              {visibleTags.map((tag = '', index) => (
                <Text 
                  key={`${item.id}-tag-${index}-${tag}`}
                  style={styles.tag}
                  numberOfLines={1}
                >
                  {tag}
                </Text>
              ))}
              {hasMoreTags && (
                <TouchableOpacity
                  onPress={() => toggleTags(item.id)}
                  style={[styles.tag, styles.viewMoreTag]}
                >
                  <Text style={styles.viewMoreText}>
                    {isExpanded ? 'View Less' : 'View More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => saveJob(item)}
            style={[
              styles.actionButton,
              { 
                backgroundColor: savedJobs.some(j => j.id === item.id) 
                  ? '#4CAF50' 
                  : '#FF9800' 
              }
            ]}
          >
            <Text style={styles.actionButtonText}>
              {savedJobs.some(j => j.id === item.id) ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ApplicationForm', { job: item })}
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          >
            <Text style={styles.actionButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{ 
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: 'transparent' 
      }} />
      
      <SafeAreaView 
        style={[styles.container, { 
          paddingTop: Platform.OS === 'android' ? 30 : 0
        }]}
        edges={[ 'right', 'left', 'bottom']}
      >
        <View style={styles.header}>
          <Image 
            source={require('../assets/job_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={{ flex: 1 }} />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SavedJobs')}
              style={styles.savedButtonContainer}
            >
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{savedJobs.length}</Text>
              </View>
              <Text style={styles.savedText}>Saved</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
  onPress={toggleTheme}
  style={styles.themeToggleContainer}
  activeOpacity={0.7}
>
  <Image
    source={theme === 'dark' 
      ? require('../assets/newlight.png') 
      : require('../assets/dark.png')}
    style={styles.themeImage}
  />
</TouchableOpacity>
          </View>
        </View>
        
        <TextInput
          placeholder="Search jobs..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          clearButtonMode="while-editing"
        />
        
        {loading && !refreshing ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2196F3']}
              />
            }
            renderItem={renderJobItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {search ? 'No matching jobs found' : 'No jobs available'}
              </Text>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default JobFinderScreen;