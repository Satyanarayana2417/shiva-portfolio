import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Hero = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [profileData, setProfileData] = useState({
    name: 'Chodisetti Satyanarayana',
    profileImage: 'https://i.ibb.co/84MLtr61/IMG-20250529-094657.webp'
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'profile', 'main'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfileData(prev => ({
          ...prev,
          ...data,
          // Ensure name always has a fallback
          name: data.name || 'Chodisetti Satyanarayana'
        }));
      }
    });

    return () => unsubscribe();
  }, []);

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

  const imageVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="home"
      ref={ref}
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center lg:text-left order-2 lg:order-1 pt-10"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-purple-500 text-lg sm:text-xl md:text-2xl font-medium mb-2">
                Hello, I'm
              </h2>
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                Chodisetti Satyanarayana
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-6 min-h-[2.5rem] flex items-center justify-center lg:justify-start">
                <Typewriter
                  options={{
                    strings: [
                      'Web Developer',
                      'AI Enthusiast',
                      
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
              </div>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                B.Tech Computer Science student passionate about innovation, technology,
and entrepreneurship. Skilled in web development,
with a vision to solve real-world problems
through creativity and AI-driven solutions.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 w-full sm:w-auto"
                >
                  View My Work
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 w-full sm:w-auto"
                >
                  Get In Touch
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-center lg:justify-start space-x-6">
                {[
                  { icon: Github, href: 'https://github.com/Satyanarayana2417', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/satyanarayanach2417/', label: 'LinkedIn' },
                  { icon: Mail, href: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#sent?compose=new', label: 'Email' },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
            >
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-purple-500 shadow-xl"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="cursor-pointer"
          onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown size={32} className="text-purple-500" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
