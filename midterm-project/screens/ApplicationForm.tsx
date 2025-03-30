import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../src/types';
import { useJobs } from '../context/JobsContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = StackScreenProps<RootStackParamList, 'ApplicationForm'>;

const formatPhoneNumber = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

const ApplicationForm: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { applyForJob } = useJobs();
  const { job } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contact: Yup.string()
      .required('Contact is required')
      .min(14, 'Phone number must be at least 10 digits')
      .matches(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        'Phone number must be in (123) 456-7890 format'
      ),
    reason: Yup.string().required('Please provide a reason'),
  });

  const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
    const unformattedContact = values.contact.replace(/\D/g, '');
    applyForJob(route.params.job, { ...values, contact: unformattedContact });
    resetForm();
    navigation.navigate('JobFinder', {shouldRefresh: false});
  };

  const placeholderColor = theme === 'dark' ? '#888' : '#999';

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: theme === 'dark' ? '#121212' : '#fff' }}>
      <Formik
        initialValues={{ name: '', email: '', contact: '', reason: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm, setFieldValue }) => (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  resetForm();
                  setTimeout(() => setRefreshing(false), 1000);
                }}
              />
            }
          >
            <View>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f0f0', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}>
                <Ionicons name="document-text-outline" size={30} color={theme === 'dark' ? '#fff' : '#333'} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme === 'dark' ? '#fff' : '#333', flexShrink: 1, flexWrap: 'wrap' }}>
                  Apply For {job.title}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <View style={{ marginBottom: 24 }}>
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor={placeholderColor}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  style={{ borderWidth: 1, borderColor: theme === 'dark' ? '#333' : '#ccc', borderRadius: 8, padding: 12, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                />
                {touched.name && errors.name && <Text style={{ color: 'red', marginTop: 4, fontSize: 14 }}>{errors.name}</Text>}
              </View>

              <View style={{ marginBottom: 24 }}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={placeholderColor}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  style={{ borderWidth: 1, borderColor: theme === 'dark' ? '#333' : '#ccc', borderRadius: 8, padding: 12, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                />
                {touched.email && errors.email && <Text style={{ color: 'red', marginTop: 4, fontSize: 14 }}>{errors.email}</Text>}
              </View>

              <View style={{ marginBottom: 24 }}>
                <TextInput
                  placeholder="Phone Number (123) 456-7890"
                  placeholderTextColor={placeholderColor}
                  onChangeText={(text) => {
                    const formatted = formatPhoneNumber(text);
                    setFieldValue('contact', formatted);
                  }}
                  onBlur={handleBlur('contact')}
                  value={values.contact}
                  keyboardType="phone-pad"
                  maxLength={14}
                  style={{ borderWidth: 1, borderColor: theme === 'dark' ? '#333' : '#ccc', borderRadius: 8, padding: 12, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                />
                {touched.contact && errors.contact && <Text style={{ color: 'red', marginTop: 4, fontSize: 14 }}>{errors.contact}</Text>}
              </View>

              <View style={{ marginBottom: 24 }}>
                <TextInput
                  placeholder="Why should we hire you?"
                  placeholderTextColor={placeholderColor}
                  onChangeText={handleChange('reason')}
                  onBlur={handleBlur('reason')}
                  value={values.reason}
                  multiline
                  numberOfLines={4}
                  style={{ borderWidth: 1, borderColor: theme === 'dark' ? '#333' : '#ccc', borderRadius: 8, padding: 12, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff', color: theme === 'dark' ? '#fff' : '#000', height: 120, textAlignVertical: 'top' }}
                />
                {touched.reason && errors.reason && <Text style={{ color: 'red', marginTop: 4, fontSize: 14 }}>{errors.reason}</Text>}
              </View>

              <TouchableOpacity onPress={() => handleSubmit()} style={{ backgroundColor: '#2196F3', borderRadius: 25, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 }} activeOpacity={0.7}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ApplicationForm;