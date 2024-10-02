import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/store'
import { LinearGradient } from 'expo-linear-gradient'

const Chat = () => {
    const { friend, username } = useLocalSearchParams()
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const user = useAuthStore(s => s.user)

    const deleteMessages = async () => {
        const {error: myError} = await supabase
            .from('messages')
            .delete()
            .eq('from', user?.id)
            .eq('to', friend)
        
        const {error: FriendError} = await supabase
            .from('messages')
            .delete()
            .eq('from', friend)
            .eq('to', user?.id)
        
    }

    const sendMessage = async () => {
        if (newMessage.trim() === '') return

        const { error } = await supabase
            .from('messages')
            .insert([{ from: user?.id, to: friend, content: newMessage }])

        if (error) {
            console.log('An error occurred while sending the message', error.message)
        } else {
            setNewMessage('')
        }
    }

    useEffect(() => {
        deleteMessages()

        const subscription = supabase
            .channel('room1')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    setMessages((prevMessages) => [...prevMessages, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: `${username}`,
                    headerStyle: {
                        backgroundColor: '#333333', // Dark header background
                    },
                    headerTintColor: '#ffffff', // Light text color
                    headerTitleStyle: {
                        fontSize: 20,
                    },
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {messages.map((message, index) => (
                        <View key={index} style={[
                            styles.messageContainer,
                            message.from === user?.id ? styles.myMessageContainer : styles.friendMessageContainer
                        ]}>
                            {message.from !== user?.id ? (
                                <LinearGradient
                                    colors={['#9c27b0', '#e91e63']} // Purple to pink gradient
                                    style={styles.gradientBackground}
                                >
                                    <Text style={styles.messageText}>
                                        {message.content}
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <Text style={styles.messageText}>
                                    {message.content}
                                </Text>
                            )}
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        placeholderTextColor="#888888"
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e', // Dark theme background
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollView: {
        padding: 10,
        paddingBottom: 80, // To ensure that the last messages are visible above the input area
    },
    messageContainer: {
        marginVertical: 5,
        maxWidth: '70%',
        borderRadius: 15,
        padding: 10,
        justifyContent: 'center',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#ff6f61', // Red for user's messages
        borderColor: '#cc5b53',
        borderWidth: 1,
    },
    friendMessageContainer: {
        alignSelf: 'flex-start',
        // Use gradient background for friend's messages
    },
    gradientBackground: {
        borderRadius: 15,
        padding: 10,
        maxWidth: '100%',
    },
    messageText: {
        fontSize: 16,
        color: '#ffffff',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#333333', // Dark input background
        borderTopWidth: 1,
        borderTopColor: '#444444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#444444',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 10,
        color: '#ffffff', // Text color in input field
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff6f61', // Red button background
        borderRadius: 20,
        padding: 10,
    },
    sendButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
})

export default Chat
