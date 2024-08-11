import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '@/supabase';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSignup = async () => {
        try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (!signUpError) {
                Alert.alert("Please check your mail")
            } else {
                Alert.alert('Sign-up error:', signUpError.message);
            }
        } catch (err) {
            console.log(err);
        }

        router.replace({ pathname: '/additional-information' });
    };

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
                    headerShown: true, // Displays the header
                    title: 'Sign Up',  // Custom title for the screen
                    headerStyle: {
                        backgroundColor: '#202120', // Dark background for the header
                    },
                    headerTintColor: '#fff', // White text for the title and back button
                    headerTitleStyle: {
                        fontWeight: 'bold', // Bold title for better visibility
                        fontSize: 24,       // Larger font size for the title
                    },
                    headerBackTitleVisible: false, // Hides the back title text, showing only the arrow
                    headerShadowVisible: false, // Removes the shadow for a flat look
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
                    Create Account
                </Text>
                <TextInput
                    value={email}
                    onChangeText={t => setEmail(t)}
                    placeholder='someone@example.com'
                    placeholderTextColor="#888"
                    keyboardType='email-address'
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
                    value={password}
                    onChangeText={t => setPassword(t)}
                    placeholder='Enter your password'
                    placeholderTextColor="#888"
                    secureTextEntry={true}
                    style={{
                        width: '100%',
                        padding: 15,
                        borderRadius: 8,
                        backgroundColor: '#202120',
                        borderWidth: 1,
                        borderColor: '#444745',
                        color: '#fff',
                        marginBottom: 25,
                    }}
                />
                <TouchableOpacity onPress={handleSignup}>
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
                            Sign Up
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Signup;
