import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system'
import { supabase } from '@/supabase';
import { decode } from 'base64-arraybuffer';

const EditProfile = () => {
  const { publicUrl } = useLocalSearchParams();
  const profile = useAuthStore(s => s.profile)

  const user = useAuthStore(s => s.user)

  const [username, setUsername] = useState(profile?.username); // You can handle logic for preloading
  const [bio, setBio] = useState(profile?.bio);
  const [pfpUrl, setPfpUrl] = useState(publicUrl);
  const [supabseFileNameOfImage, setSupabseFileNameOfImage] = useState('')

  const handlePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setPfpUrl(result.assets[0].uri);
    }
  };

  const handleUpdateImage = async () => {
    if (pfpUrl) {
      const base64 = await FileSystem.readAsStringAsync((pfpUrl as string), {
        encoding: 'base64'
      })

      const timeStamp = Date.now()
      const fileName = `${user?.id}/pfp_${timeStamp}.png`

      const { data, error } = await supabase
        .storage
        .from('pfps')
        .upload(fileName, decode(base64), {
          contentType: 'image/png'
        })

      if (!error) {
        Alert.alert("Profile photo updated successfully")
        setSupabseFileNameOfImage(fileName)
      }
    }
  }

  const handleUpdateData = async () => { 

    handleUpdateImage();

    const {data, error} = await supabase
      .from('profiles')
      .update({
        username: username,
        bio: bio,
        pfp: supabseFileNameOfImage
      })
    
      if (!error) {
        router.back()
      } else {
        console.log(`Error while updating profile : ${error.message}`)
      }
   }


  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1, paddingHorizontal: 20 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 15,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Edit Profile</Text>
        <TouchableOpacity>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        {pfpUrl ? (
          <Image
            source={{ uri: (pfpUrl as string) }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
        ) : (
          <FontAwesome name="user-circle" size={120} color="#777" />
        )}
        <TouchableOpacity style={{ marginTop: 10 }} onPress={handlePick} >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      {/* Username Field */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ color: '#b3b3b3', fontSize: 16, marginBottom: 8 }}>Username</Text>
        <TextInput
          value={username}
          onChangeText={(t) => setUsername(t)}
          placeholder="Enter your username"
          placeholderTextColor="#777"
          style={{
            color: 'white',
            fontSize: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#333',
            paddingVertical: 8,
          }}
        />
      </View>

      {/* Bio Field */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ color: '#b3b3b3', fontSize: 16, marginBottom: 8 }}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={t => setBio(t)}
          placeholder="Tell people about yourself"
          placeholderTextColor="#777"
          multiline
          style={{
            color: 'white',
            fontSize: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#333',
            paddingVertical: 8,
            height: 80,
          }}
        />
      </View>

      {/* Save Button */}
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            paddingVertical: 12,
            paddingHorizontal: 50,
            borderRadius: 25,
          }}
          onPress={handleUpdateData}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
