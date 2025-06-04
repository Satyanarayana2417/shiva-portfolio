// This service manages project data operations

// Sample projects data (replace with actual data from your portfolio)
let projects = [
  {
    id: '1',
    title: 'Kinetic Web Replica',
    description: 'A modern portfolio website with animated elements and smooth transitions.',
    imageUrl: '/images/projects/project1.jpg',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    demoLink: 'https://demo.example.com/kinetic'
    // codeLink field removed
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Full-featured online shopping platform with cart, checkout and payment processing.',
    imageUrl: '/images/projects/project2.jpg',
    technologies: ['Next.js', 'MongoDB', 'Stripe'],
    demoLink: 'https://demo.example.com/ecommerce'
    // codeLink field removed
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates.',
    imageUrl: '/images/projects/project3.jpg',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    demoLink: 'https://demo.example.com/tasks'
    // codeLink field removed
  },
  {
    id: '4',
    title: 'Weather Dashboard',
    description: 'Interactive weather application showing forecasts and historical data.',
    imageUrl: '/images/projects/project4.jpg',
    technologies: ['JavaScript', 'Chart.js', 'Weather API'],
    demoLink: 'https://demo.example.com/weather'
    // codeLink field removed
  }
];

// Get all projects
export const getProjects = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...projects]);
    }, 300);
  });
};

// Get a single project by ID
export const getProjectById = async (id) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const project = projects.find(p => p.id === id);
      if (project) {
        resolve({...project});
      } else {
        reject(new Error('Project not found'));
      }
    }, 300);
  });
};

// Update a project
export const updateProject = async (updatedProject) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        projects[index] = {...updatedProject};
        resolve({...updatedProject});
      } else {
        reject(new Error('Project not found'));
      }
    }, 300);
  });
};

// Delete a project
export const deleteProject = async (id) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = projects.length;
      projects = projects.filter(p => p.id !== id);
      
      if (projects.length < initialLength) {
        resolve({ success: true });
      } else {
        reject(new Error('Project not found'));
      }
    }, 300);
  });
};

// Create a new project
export const createProject = async (newProject) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const projectWithId = {
        ...newProject,
        id: Date.now().toString()
      };
      projects.push(projectWithId);
      resolve({...projectWithId});
    }, 300);
  });
};
