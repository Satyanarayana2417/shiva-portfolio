
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Calendar } from 'lucide-react';

const Education = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const educationData = [
    {
      degree: "Bachelor of Technology ",
      institution: "KIET Engineering College",
      period: "2023 - 2027",
      description: "Currently pursuing a degree in Computer Science Engineering [Data Science], focusing on web development and data engineering.",
      gpa: "8.1"
    },
    {
      degree: "Intermediate Education",
      institution: "Sri Chaitanya Junior College",
      period: "2021-2023",
      description: "Studied MPC (Math, Physics, Chemistry) group, building a solid foundation for technical fields.",
      gpa: "78%"
    },
    {
      degree: "Secondary Education ",
      institution: "DR KKR's Gowtham School",
      period: "2020-2021",
      description: "Focused on core subjects and developed an early passion for technology and innovation.",
      gpa: "99.8%"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
      id="education"
      ref={ref}
      className="py-16 sm:py-20 lg:py-32 bg-gray-800 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-6xl">
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
            My <span className="text-purple-500">Education</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 bg-purple-500 mx-auto mb-8"
          />
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
          >
            My academic journey and continuous learning path in technology and development.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-8"
        >
          {educationData.map((education, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {education.degree}
                    </h3>
                    <h4 className="text-lg text-purple-500 font-semibold">
                      {education.institution}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar size={20} />
                  <span className="font-medium">{education.period}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {education.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-500 font-semibold">
                  GPA: {education.gpa}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
