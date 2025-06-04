import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useToast } from '@/hooks/use-toast';
import { FolderPlus, Pencil, Trash2, Save, Image, Link, Github, ExternalLink, X, AlertTriangle } from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt?: any;
}

const AdminProjectManager = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [recentlyUpdated, setRecentlyUpdated] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    githubUrl: '',
    liveUrl: '',
    tags: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectData[];
      setProjects(projectsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const resetForm = () => {
    setProjectForm({
      title: '',
      description: '',
      githubUrl: '',
      liveUrl: '',
      tags: '',
    });
    setImageFile(null);
    setPreviewImage('');
    setEditingProject(null);
    setFormError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
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
      setFormError('');
    }
  };

  const validateForm = () => {
    if (!projectForm.title.trim()) {
      setFormError('Project title is required');
      return false;
    }
    if (!projectForm.description.trim()) {
      setFormError('Project description is required');
      return false;
    }
    if (!imageFile && !previewImage) {
      setFormError('Project image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      let imageUrl = editingProject?.imageUrl || '';
      
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }
      
      const tagsArray = projectForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      if (editingProject) {
        // Update existing project
        await updateDoc(doc(db, 'projects', editingProject.id), {
          title: projectForm.title,
          description: projectForm.description,
          githubUrl: projectForm.githubUrl,
          liveUrl: projectForm.liveUrl,
          imageUrl: imageUrl,
          tags: tagsArray,
          updatedAt: serverTimestamp(),
        });
        
        // Set the recently updated project ID
        setRecentlyUpdated(editingProject.id);
        
        // Clear the highlight after 3 seconds
        setTimeout(() => {
          setRecentlyUpdated('');
        }, 3000);
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        // Create new project
        await addDoc(collection(db, 'projects'), {
          title: projectForm.title,
          description: projectForm.description,
          githubUrl: projectForm.githubUrl,
          liveUrl: projectForm.liveUrl,
          imageUrl: imageUrl,
          tags: tagsArray,
          createdAt: serverTimestamp(),
        });
        
        toast({
          title: "Success",
          description: "Project added successfully",
        });
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: editingProject 
          ? "Failed to update project" 
          : "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: ProjectData) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      tags: project.tags?.join(', ') || '',
    });
    setPreviewImage(project.imageUrl);
    
    // Scroll to form with smooth behavior
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    toast({
      title: "Editing Project",
      description: `Now editing: ${project.title}`,
    });
  };

  const handleDelete = async (projectId: string) => {
    setDeleteConfirm(projectId);
  };

  const confirmDelete = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Project Form */}
      <div ref={formRef} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FolderPlus className="text-purple-500" size={24} />
            <h2 className="text-2xl font-bold text-white">
              {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
            </h2>
          </div>
          {editingProject && (
            <motion.button
              onClick={resetForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">Project Title *</label>
            <input
              type="text"
              name="title"
              value={projectForm.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="My Amazing Project"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={projectForm.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Describe your project in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Github size={16} />
                  <span>GitHub URL</span>
                </div>
              </label>
              <input
                type="url"
                name="githubUrl"
                value={projectForm.githubUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <ExternalLink size={16} />
                  <span>Live Demo URL</span>
                </div>
              </label>
              <input
                type="url"
                name="liveUrl"
                value={projectForm.liveUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <div className="flex items-center space-x-2">
                <Link size={16} />
                <span>Tags (comma separated)</span>
              </div>
            </label>
            <input
              type="text"
              name="tags"
              value={projectForm.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="React, TypeScript, Tailwind CSS"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <div className="flex items-center space-x-2">
                <Image size={16} />
                <span>Project Image *</span>
              </div>
            </label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Project preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                />
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="project-image"
                />
                <label
                  htmlFor="project-image"
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Image size={16} />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save size={16} />
              <span>
                {isSubmitting
                  ? 'Saving...'
                  : editingProject
                  ? 'Update Project'
                  : 'Save Project'}
              </span>
            </motion.button>

            {editingProject && (
              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Existing Projects</h2>
          <span className="text-sm text-gray-400">{projects.length} projects found</span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-700">
            <FolderPlus size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No projects yet. Add your first project above!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-gray-900 p-4 rounded-lg border ${
                  recentlyUpdated === project.id 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-700'
                } flex flex-col md:flex-row gap-4 transition-all duration-500 relative`}
              >
                {/* Delete confirmation modal */}
                {deleteConfirm === project.id && (
                  <div className="absolute inset-0 bg-gray-900/95 rounded-lg backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="bg-gray-800 p-4 border border-red-500 rounded-lg max-w-xs">
                      <div className="flex items-center space-x-2 text-red-500 mb-3">
                        <AlertTriangle size={20} />
                        <h3 className="font-bold">Confirm Deletion</h3>
                      </div>
                      <p className="text-gray-300 mb-4">Are you sure you want to delete "{project.title}"? This action cannot be undone.</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => confirmDelete(project.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex-1"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={cancelDelete}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {recentlyUpdated === project.id && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    Updated
                  </div>
                )}
                <div className="md:w-1/4">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.createdAt && new Date(project.createdAt.toDate()).toLocaleDateString()}
                  </div>
                </div>
                <div className="md:w-1/4 flex flex-row md:flex-col justify-end gap-2">
                  <motion.button
                    onClick={() => handleEdit(project)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 flex-1"
                  >
                    <Pencil size={16} />
                    <span className="hidden md:inline">Edit</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(project.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 flex-1"
                  >
                    <Trash2 size={16} />
                    <span className="hidden md:inline">Delete</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminProjectManager;
