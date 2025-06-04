import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const Projects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fallback projects in case Firebase has no data yet
  const fallbackProjects = [
    {
      title: 'Flight Price Predictor',
      description: 'A machine learning application that predicts flight ticket prices based on various parameters using regression techniques.',
      image: 'https://c4.wallpaperflare.com/wallpaper/690/636/859/flight-takeoff-hd-airport-runway-wallpaper-preview.jpg',
      tags: ['python', 'scikit-learn', 'matplotlib', 'Pandas'],
      
      liveUrl: 'https://skyprice-predictor-m6qk.vercel.app/',
    },
    {
      title: 'Beverages Order Platform',
      description: 'A full-stack website for seamless juice orders and efficient shop management with user-friendly design.',
      image: 'https://media.istockphoto.com/id/504754220/photo/cocktails.jpg?s=612x612&w=0&k=20&c=NxIzGT-LbUS0BAPoCMDY3mEp96AnIxxldbWmFMeeD-A=',
      tags: ['HTML', 'CSS', 'Javascript', 'Node.js'],
  
      liveUrl: 'https://squeeze-in-truffle-43677.netlify.app/',
    },
   
    {
      title: ' Ignite Gym Website',
      description: 'A full-stack fitness platform for gym memberships, workout tracking, and user management with responsive UI.',
      image: 'https://t4.ftcdn.net/jpg/03/17/72/47/360_F_317724775_qHtWjnT8YbRdFNIuq5PWsSYypRhOmalS.jpg',
      tags: ['HTML', 'CSS', 'Javascript', 'Node.js'],
     
      liveUrl: 'https://ignite-prime-experience-860untq97.vercel.app',
    },
    {
      title: 'Portfolio Website',
      description: 'A personal portfolio website to showcase projects, skills, and experience with smooth navigation and responsive design.',
      image: 'https://assets-global.website-files.com/5e39e095596498a8b9624af1/5f6e93d250a6d04f4eae9f02_Backgrounds-WFU-thumbnail-(size).jpg',
      tags: ['HTML', 'CSS', 'JS', 'React'],
      githubUrl: '#',
      liveUrl: '#',
    },
  
  ];

  // Use Firebase projects if available, otherwise use fallbacks
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="py-16 sm:py-20 lg:py-32 bg-gray-800 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            My <span className="text-purple-500">Projects</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 bg-purple-500 mx-auto mb-8"
          />
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Here are some of my recent projects that showcase my skills and experience.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {displayProjects.map((project) => (
              <motion.div
                key={project.id || project.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-800 p-2 rounded-full text-white hover:text-purple-500 transition-colors duration-300"
                        aria-label="View on GitHub"
                      >
                        <Github size={20} />
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-800 p-2 rounded-full text-white hover:text-purple-500 transition-colors duration-300"
                        aria-label="View Live Demo"
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-500 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/Satyanarayana2417"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 inline-block"
          >
            View All Projects
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
