import { View, Text, Alert, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store';
import { supabase } from '@/supabase';
import { FontAwesome } from '@expo/vector-icons';

// Define a type for the profile
type Profile = {
  id: string;
  username: string;
  pfp?: string; // Optional profile picture field
  bio?: string;
};

const Profile = () => {
  const user = useAuthStore((s) => s.user);
  // const [profile, setProfile] = useState<Profile | null>(null); // Initialize as null
  const [pfpUrl, setPfpUrl] = useState('');
  const profile = useAuthStore(s => s.profile)
  const setProfile = useAuthStore(s => s.setProfile)


  const fetchProfile = async () => {
    console.log(`user : ${user}`)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id);

    if (!profileError && profileData && profileData.length > 0) {
      setProfile(profileData[0]); // Set the profile data
      console.log(profile);
    } else {
      Alert.alert('Some error occurred, please try again');
      console.log(profileError?.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchPfp = async () => {
    if (profile?.pfp) {
      // Check if profile and pfp exist
      const { data: publicUrl } = supabase.storage.from('pfps').getPublicUrl(profile.pfp);

      setPfpUrl(publicUrl.publicUrl);
      console.log(publicUrl.publicUrl);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchPfp(); // Fetch profile picture if profile is loaded
    }
  }, [profile]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'black',
        flex: 1,
      }}
    >
      {/* Top header similar to Instagram */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#2a2a2a',
        }}
      >
        {/* Username on the left */}
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          {profile?.username || 'Username'}
        </Text>

        {/* Hamburger menu icon on the right */}
        <FontAwesome name="bars" size={24} color={'white'} />
      </View>

      {/* Profile Picture Section */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 30,
        }}
      >
        {pfpUrl && (
          <Image
            source={{ uri: pfpUrl }}
            style={{ width: 150, height: 150, borderRadius: 99 }} // Ensure width and height are defined
          />
        )}
      </View>

      {/* Improved username and bio section */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          alignItems: 'center',
        }}
      >
        {/* Username */}
        <Text
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 5,
          }}
        >
          {profile?.username || 'User'}
        </Text>

        {/* Bio */}
        {profile?.bio ? (
          <Text
            style={{
              color: '#b3b3b3',
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: 15,
            }}
          >
            {profile.bio}
          </Text>
        ) : (
          <Text
            style={{
              color: '#b3b3b3',
              fontSize: 16,
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 22,
              marginBottom: 15,
            }}
          >
            Add a bio to tell more about yourself.
          </Text>
        )}

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={{
            borderColor: '#777',
            borderWidth: 1,
            paddingVertical: 8,
            paddingHorizontal: 30,
            borderRadius: 5,
          }}
          onPress={() => router.navigate({pathname:'/edit-profile', params: {publicUrl : pfpUrl}})}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
