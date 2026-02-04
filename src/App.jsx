import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SubjectCard } from "./components/SubjectCard";
import { AddSubjectModal } from "./components/AddSubjectModal";
import { ProfileModal } from "./components/ProfileModal";
import { DataBackup } from "./components/DataBackup";
import { Button } from "./components/ui/Button";
import { storage } from "./services/storage";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data function (reusable)
  const loadData = () => {
    const data = storage.get();
    setSubjects(data.subjects);
    setProfile(data.profile);
  };

  // Load data on mount
  useEffect(() => {
    loadData();
    setLoading(false);
  }, []);

  // Show profile modal if no profile exists (first time user)
  useEffect(() => {
    if (!loading && !profile) {
      setIsProfileModalOpen(true);
    }
  }, [loading, profile]);

  const handleSaveProfile = (name) => {
    const newProfile = storage.setProfile(name);
    setProfile(newProfile);
  };

  const handleAddSubject = (name, target) => {
    const updatedSubjects = storage.addSubject(name, target);
    setSubjects(updatedSubjects);
  };

  const handleUpdateSubject = (updatedSubject) => {
    const updatedSubjects = storage.updateSubject(updatedSubject);
    setSubjects(updatedSubjects);
  };

  const handleDeleteSubject = (id) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      const updatedSubjects = storage.deleteSubject(id);
      setSubjects(updatedSubjects);
    }
  };

  const handleDataImported = () => {
    // Refresh all data after import
    loadData();
  };

  const overallPercentage = subjects.length > 0
    ? Math.round(subjects.reduce((acc, sub) => acc + (sub.total === 0 ? 100 : (sub.attended / sub.total) * 100), 0) / subjects.length)
    : 0;

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        profile={profile}
        onEditProfile={() => setIsProfileModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      <main className="container mx-auto px-4 pt-8 max-w-5xl">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {profile ? `${greeting}, ${profile.name}!` : "My Attendance"}
            </h1>
            <p className="text-muted-foreground">Track your progress and stay safe.</p>
          </div>

          {subjects.length > 0 && (
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Overall Goal</span>
              <span className="text-2xl font-bold text-primary">{overallPercentage}%</span>
            </div>
          )}
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-secondary/5">
            <p className="text-xl text-muted-foreground mb-6">No subjects added yet.</p>
            <Button onClick={() => setIsModalOpen(true)} size="lg" className="rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onUpdate={handleUpdateSubject}
                onDelete={handleDeleteSubject}
              />
            ))}

            {/* Quick Add Button Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group h-full min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-primary">Add New Subject</span>
            </button>
          </div>
        )}
      </main>

      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSubject}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        currentName={profile?.name}
      />

      <DataBackup
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataImported={handleDataImported}
      />

      <Footer />
    </div>
  );
}

export default App;
