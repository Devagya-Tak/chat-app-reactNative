import { View, Text, Pressable, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { decode } from 'base64-arraybuffer'
import { useAuthStore } from '@/store';
import { supabase } from '@/supabase';

const AdditionalInformation = () => {
  const [image, setImage] = useState<null | string>(null);

  const user = useAuthStore(s => s.user)
  const fetchUser = useAuthStore(s => s.fetchUser)

  useEffect(() => {
    
  
    fetchUser();
  }, [])
  

  const handlePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUploadImage = async () => {
    // Upload image logic here
    if (image) {
      
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64'
      })
      const fileName = `${user}/pfp.png`
      const { data, error } = await supabase
        .storage
        .from('pfps')
        .upload(fileName, decode(base64), {
          contentType: 'image/png'
        })
      if (!error) {
        Alert.alert("profile photo uploaded sucessfully")
      } else {
        Alert.alert("An error occured", error.message)
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'black',
        flex: 1,
        paddingLeft: 5,
        justifyContent: 'center',
        alignItems: 'center', // Center content horizontally
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text
        style={{
          color: 'white',
          marginBottom: 20, // Add space between text and image picker box
        }}
      >
        Additional Information
      </Text>
      <View
        style={{
          backgroundColor: '#33322e',
          width: 200,
          height: 200,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#6b6a67',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20, // Space between image picker and other elements
        }}
      >
        {image ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'relative', // Make the container relative for absolute positioning of the button
              borderRadius: 10,
              overflow: 'hidden', // Ensure the button stays within the image boundaries
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={{ uri: image }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            <Pressable
              onPress={handleUploadImage}
              style={{
                position: 'absolute',
                bottom: 4, // Position the button at the bottom of the image
                //  width: '%', // Make the button full width
                backgroundColor: 'rgba(6, 161, 29, 0.8)', // Add some transparency for better visibility
                paddingHorizontal: 20,
                paddingVertical: 15,
                justifyContent: 'center',
                alignItems: 'center', // Center the text inside the button
                borderRadius: 5
              }}
            >
              <Text style={{ color: 'white' }}>Upload Image</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handlePick}
            style={{
              backgroundColor: '#06a11d',
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white' }}>Pick Image</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdditionalInformation;
