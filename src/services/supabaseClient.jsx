// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wmvcqippnjojdomkwcgl.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdmNxaXBwbmpvamRvbWt3Y2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0ODExOTAsImV4cCI6MjA1NjA1NzE5MH0.rGp1V4ZDxSeXMcNBXUcOvLAM7pXfsIGGrnqu0mz2F-k'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);