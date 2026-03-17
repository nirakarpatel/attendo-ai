-- Run this script in the SQL Editor on your Supabase Dashboard to secure your tables
-- Now that we have Authentication configured, we must restrict access.

-- 1. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies for 'profiles' table
-- Users can only view, insert, update, and delete their own profile based on their Auth UID
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- 3. Create Policies for 'subjects' table
CREATE POLICY "Users can manage own subjects" ON subjects
    FOR ALL USING (auth.uid() = user_id);

-- 4. Create Policies for 'attendance_logs' table
CREATE POLICY "Users can manage own attendance logs" ON attendance_logs
    FOR ALL USING (auth.uid() = user_id);

-- 5. Create Policies for 'timetable' table
CREATE POLICY "Users can manage own timetable" ON timetable
    FOR ALL USING (auth.uid() = user_id);

-- 6. Create Policies for 'holidays' table
CREATE POLICY "Users can manage own holidays" ON holidays
    FOR ALL USING (auth.uid() = user_id);

-- Done! Your database is now secured. Only logged-in users can access their own data.
