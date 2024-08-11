import { create } from "zustand";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthStore {
    isLoggedIn: boolean;
    user: User | null;
    fetchUser: () => Promise<void>;
    initializeUser: () => Promise<void>;
    setIsLoggedIn: (value: boolean) => Promise<void>;
    setUser: (value: any) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    user: null,

    fetchUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const jsonUser = JSON.stringify(user);
            await AsyncStorage.setItem('user', jsonUser);
            set({
                user: user,
                isLoggedIn: true,
            });
        } else {
            await AsyncStorage.removeItem('user');
            set({
                user: null,
                isLoggedIn: false,
            });
        }
    },

    initializeUser: async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            set({
                user: user,
                isLoggedIn: true,
            });
        } else {
            set({
                // user: null,
                isLoggedIn: false,
            });
        }
    },
    setIsLoggedIn: async (value: boolean) => { 
        set({
            isLoggedIn: value
        })
     },
     setUser: async (value: any) => { 
        set({
            user: value
        })
      }
}));

// When your app starts, you should call initializeUser to load the user from AsyncStorage
useAuthStore.getState().initializeUser();






// import { create } from "zustand";
// import { supabase } from "./supabase";
// import { User } from "@supabase/supabase-js";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface AuthStore {
//     isLoggedIn: boolean;
//     user: User | null;  // User can be null initially
//     fetchUser: () => Promise<void>;
// }

// export const useAuthStore = create<AuthStore>((set) => ({
//     // variables
//     isLoggedIn: false,
//     user: null ,  // Initialize user as null

//     // functions
//     fetchUser: async () => {
//         const { data: { user } } = await supabase.auth.getUser();
//         const jsonUser = JSON.stringify(user)
//         await AsyncStorage.setItem('user', jsonUser)
//         set((state) => ({
//             user: user,
//             isLoggedIn: !!user,  // Set isLoggedIn based on the presence of user
//         }));
//     },
// }));


