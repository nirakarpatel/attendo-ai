const STORAGE_KEY = 'attendance_app_data';

// Initial Data (empty by default)
const initialData = {
    profile: null, // { name, createdAt }
    subjects: [], // No default subjects
    log: [] // { id, subjectId, date, status: 'present' | 'absent' | 'cancelled' }
};

export const storage = {
    get: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : initialData;
        } catch (e) {
            console.error("Storage Error", e);
            return initialData;
        }
    },

    save: (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Storage Save Error", e);
        }
    },

    updateSubject: (updatedSubject) => {
        const data = storage.get();
        const newSubjects = data.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s);
        storage.save({ ...data, subjects: newSubjects });
        return newSubjects;
    },

    addSubject: (name, target = 75) => {
        const data = storage.get();
        const newSubject = {
            id: Date.now().toString(),
            name,
            total: 0,
            attended: 0,
            target
        };
        const newSubjects = [...data.subjects, newSubject];
        storage.save({ ...data, subjects: newSubjects });
        return newSubjects;
    },

    deleteSubject: (id) => {
        const data = storage.get();
        const newSubjects = data.subjects.filter(s => s.id !== id);
        storage.save({ ...data, subjects: newSubjects });
        return newSubjects;
    },

    // Profile methods
    getProfile: () => {
        const data = storage.get();
        return data.profile || null;
    },

    setProfile: (name) => {
        const data = storage.get();
        const profile = {
            name: name.trim(),
            createdAt: new Date().toISOString()
        };
        storage.save({ ...data, profile });
        return profile;
    },

    clearProfile: () => {
        const data = storage.get();
        storage.save({ ...data, profile: null });
    },

    // Export data as JSON string (for download)
    exportData: () => {
        const data = storage.get();
        return JSON.stringify(data, null, 2);
    },

    // Import data from JSON string
    importData: (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            // Validate structure
            if (data && typeof data === 'object') {
                storage.save(data);
                return { success: true, data };
            }
            return { success: false, error: "Invalid data format" };
        } catch (e) {
            return { success: false, error: "Invalid JSON file" };
        }
    },

    // Clear all data (reset)
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
