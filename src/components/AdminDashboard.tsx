import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Mail, Phone, User, Calendar, Trash2, LogOut, MessageSquare, Settings, FolderKanban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminProfileManager from './AdminProfileManager';
import AdminProjectManager from './AdminProjectManager';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: any;
  status?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'submissions' | 'profile' | 'projects'>('submissions');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const q = query(collection(db, 'contactSubmissions'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactSubmission[];
      setSubmissions(submissionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
      setSubmissions(submissions.filter(sub => sub.id !== id));
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
      onLogout();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const sendToWhatsApp = (submission: ContactSubmission) => {
    const message = `Contact Form Submission:
Name: ${submission.name}
Email: ${submission.email}
Message: ${submission.message}
Submitted: ${new Date(submission.timestamp?.toDate()).toLocaleString()}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/9121055512?text=${encodedMessage}`; // Updated WhatsApp number
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center flex-col sm:flex-row space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-purple-500">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'submissions' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Submissions</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'projects' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FolderKanban size={18} />
              <span className="hidden sm:inline">Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {activeTab === 'profile' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Profile Management</h2>
              <p className="text-gray-400">Update your profile information and images</p>
            </div>
            <AdminProfileManager />
          </div>
        ) : activeTab === 'projects' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Project Management</h2>
              <p className="text-gray-400">Add, edit or remove projects from your portfolio</p>
            </div>
            <AdminProjectManager />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Contact Submissions</h2>
              <p className="text-gray-400">Manage contact form submissions from your website</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">No submissions yet</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {submissions.map((submission) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <User className="text-purple-500" size={24} />
                        <div>
                          <h3 className="text-xl font-semibold">{submission.name}</h3>
                          <p className="text-gray-400 flex items-center">
                            <Mail size={16} className="mr-1" />
                            {submission.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => sendToWhatsApp(submission)}
                          className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
                          title="Send to WhatsApp"
                        >
                          <Phone size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Message:</h4>
                      <p className="text-gray-300 bg-gray-900 p-4 rounded-lg">{submission.message}</p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar size={16} className="mr-1" />
                      Submitted: {submission.timestamp ? new Date(submission.timestamp.toDate()).toLocaleString() : 'Unknown'}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
