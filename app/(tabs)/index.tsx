import { View, Text, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { supabase } from '@/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Import the FontAwesome icon library
import { router } from 'expo-router';

const ChatWithPeople = () => {
  const [people, setPeople] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (!error) {
      const updatedPeople = await Promise.all(
        data.map(async (person) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('pfps')
            .getPublicUrl(person.pfp);


          return { ...person, pfpUrl: publicUrl };
        })
      );
      setPeople(updatedPeople);
    } else {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [people]);

  const filteredPeople = people.filter(person =>
    person.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(t) => setSearchQuery(t)}
        />
      </View>
      <ScrollView>
        {filteredPeople.map(person => (
          <TouchableOpacity
            key={person.id}
            style={styles.profileContainer}
            onPress={() => {
              router.navigate({
                pathname: `../chat/${person.id}`,
                params: {
                  username: person.username
                }
              })
            }}>
            {person.pfpUrl && (
              <Image
                source={{ uri: person.pfpUrl }}
                style={styles.profileImage}
              />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.username}>{person.username}</Text>
              {person.bio && <Text style={styles.bio}>{person.bio}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatWithPeople;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark theme background
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Subtle border for separation
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular avatar
    borderWidth: 2,
    borderColor: '#1db954', // Highlight around the avatar
  },
  textContainer: {
    marginLeft: 15,
    flex: 1, // Allow text to expand and take up space
  },
  username: {
    color: '#ffffff', // White text color
    fontSize: 18,
    fontWeight: '600', // Slightly bold username
  },
  bio: {
    color: '#aaaaaa', // Grey for bio text
    fontSize: 14,
    marginTop: 4,
  },
});
