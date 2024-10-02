import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '@/supabase'

const Profiles = () => {
    const [profiles, setProfiles] = useState<any[]>([])

    const fetchProfiles = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')

        if (!error && data) {
            setProfiles(data)
        } else {
            Alert.alert("An error occured", error.message)
        }
        
    }

    return (
        <View>
            {profiles.map(profile => (
                <>
                    <Text>{profile?.username}</Text>
                </>
            ))}
        </View>
    )
}

export default Profiles