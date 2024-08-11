import { createClient } from "@supabase/supabase-js"

const apiUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const apiKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

export const supabase = createClient(apiUrl, apiKey)