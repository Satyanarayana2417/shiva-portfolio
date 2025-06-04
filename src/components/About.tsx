
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Palette, Lightbulb, Users } from 'lucide-react';

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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

  const features = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable and efficient code that scales',
    },
    {
      icon: Palette,
      title: 'Creative Design',
      description: 'Crafting beautiful and intuitive user interfaces',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Always exploring new technologies and methodologies',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working effectively with teams to deliver great products',
    },
  ];

  return (
    <section
      id="about"
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
            About <span className="text-purple-500">Me</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 bg-purple-500 mx-auto mb-8"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
             Passionate About AI & Innovation
            </h3>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              My tech journey began with a simple HTML page in high school, sparking a passion for programming and web development. Since then, I’ve built dynamic websites and explored AI applications, blending creativity and technology to craft efficient, real-world solutions.
            </p>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              My ultimate objective is to use technology to solve real-world problems. I aspire to build innovative applications, such as an AI-based safety mechanism for planes In the future, I aim to explore entrepreneurship by starting a tech-powered hotel or cafe business that integrates AI and automation for an enhanced customer experience.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 mt-6"
            >
              Download Resume
            </motion.button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <feature.icon className="text-purple-500 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2 text-lg">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
