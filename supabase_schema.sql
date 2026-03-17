-- Run this entire script in the SQL Editor on your Supabase Dashboard

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- We'll use the device ID here
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  streak_current INTEGER DEFAULT 0,
  streak_longest INTEGER DEFAULT 0,
  streak_last_active_date DATE,
  milestones INTEGER[] DEFAULT '{}'::INTEGER[]
);

-- 2. Subjects Table
CREATE TABLE subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_percentage INTEGER DEFAULT 75,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Attendance Logs Table
CREATE TABLE attendance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(subject_id, date) -- Only one log per subject per day
);

-- 4. Timetable Table
CREATE TABLE timetable (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- 5. Holidays Table
CREATE TABLE holidays (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(user_id, date)
);

-- Note: We are not using Supabase Auth (since we chose Device ID), so we need to enable 
-- public access to these tables for now, or write Row Level Security (RLS) policies 
-- that check against the Device ID sent from the frontend.
-- Since this is a simple app without real login, we can just allow anonymous access.
-- Warning: In a real production app without authentication, anyone with the Anon Key 
-- could read/write this database if RLS is disabled.

-- Disable RLS for ease of use since we don't have true Auth (Device ID only)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE timetable DISABLE ROW LEVEL SECURITY;
ALTER TABLE holidays DISABLE ROW LEVEL SECURITY;
