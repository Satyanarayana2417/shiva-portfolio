
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, User } from 'lucide-react';

const AdminProfileManager = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    profileImage: '',
    bio: '',
    skills: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData(data as any);
        setPreviewImage(data.profileImage || '');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = profileData.profileImage;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const updatedData = {
        ...profileData,
        profileImage: imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'profile', 'main'), updatedData);
      
      setProfileData(updatedData);
      setImageFile(null);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <User className="text-purple-500" size={24} />
        <h2 className="text-2xl font-bold text-white">Profile Management</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">Profile Image</label>
          <div className="flex items-center space-x-4">
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
              />
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <Upload size={16} />
                <span>Upload Image</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdminProfileManager;
