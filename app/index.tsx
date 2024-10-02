import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import Login from '@/components/Login';
import { router } from 'expo-router';
import { supabase } from '@/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  const [people, setPeople] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (!error) {
      console.log(data);
      setPeople(data);
    }
  };

  useEffect(() => {
    fetchProfiles();
    setIsMounted(true)
  }, []);

  useEffect(() => {
    if (isLoggedIn && isMounted ) {
      // If the user is logged in, navigate to the tabs screen
      router.replace('/(tabs)');
    }
    
  }, [isLoggedIn, isMounted]);

  if (!isLoggedIn) {
    return <Login />;
  }

  // Optionally, you could return a loading state or null if the navigation is in progress
  return (
    <>
    <Text>Please wait redirecting you...</Text>
    </>
  ); // or a loading indicator if you want
};

export default Index;
