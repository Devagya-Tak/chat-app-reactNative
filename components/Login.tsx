import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useAuthStore } from '@/store';
import { supabase } from '@/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack } from 'expo-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const isLoggedIn = useAuthStore(state => state.isLoggedIn)
    const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn)
    const fetchUser = useAuthStore( s => s.fetchUser)
    

    const handleLogin = async () => {
        console.log('login button clicked')
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        console.log("object")
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!error) {
            Alert.alert("User logged in succesfully")
            setIsLoggedIn(true)
            console.log(user?.id)
            fetchUser()
        } else {
            Alert.alert("Error: ", error.message)
        }

        
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
                <TouchableOpacity onPress={handleLogin}>
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
                            Login
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>
                        Don't have an account?{' '}
                        <Link href={'/signup'} style={{ color: '#FF512F', fontWeight: 'bold' }}>
                            Signup
                        </Link>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Login;