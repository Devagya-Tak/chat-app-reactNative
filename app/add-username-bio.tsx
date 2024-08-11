import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { supabase } from '@/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack } from 'expo-router';

const AddUsernameBio = () => {
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')

    const user = useAuthStore(s => s.user)
    const fetchUser = useAuthStore(s => s.fetchUser)

    useEffect(() => {


        fetchUser
    }, [])


    const handleInformation = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: user,
                    username: username
                })
            if (!error) {
                Alert.alert("Information submitted successfully")
            } else {
                Alert.alert("Something went wrong", error.message)
            }
        } catch (err) {
            console.error(err);

        }
    };

    const rand = async () => {
        const { data, error } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl('folder/avatar1.png', 10)
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            paddingHorizontal: 20,
        }}>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <View style={{ width: '100%' }}>
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: 20,
                    textAlign: 'center',
                }}>
                    Welcome Back
                </Text>
                <TextInput
                    value={username}
                    onChangeText={t => setUsername(t)}
                    placeholder='Enter your username'
                    placeholderTextColor="#888"
                    keyboardType='default'
                    style={{
                        width: '100%',
                        padding: 15,
                        borderRadius: 8,
                        backgroundColor: '#202120',
                        borderWidth: 1,
                        borderColor: '#444745',
                        color: '#fff',
                        marginBottom: 15,
                    }}
                />
                <TextInput
                    value={bio}
                    onChangeText={t => setBio(t)}
                    placeholder='Tell us about yourself' // Changed placeholder text
                    placeholderTextColor="#888"
                    multiline // Enable multiline input
                    numberOfLines={4} // Adjust number of lines as needed
                    style={{
                        width: '100%',
                        padding: 15,
                        borderRadius: 8,
                        backgroundColor: '#202120',
                        borderWidth: 1,
                        borderColor: '#444745',
                        color: '#fff',
                        marginBottom: 25,
                        textAlignVertical: 'top' // Align text to the top
                    }}
                />

                <TouchableOpacity onPress={handleInformation}>
                    <LinearGradient
                        colors={['#FF512F', '#DD2476']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingVertical: 15,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                            Submit
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddUsernameBio;
