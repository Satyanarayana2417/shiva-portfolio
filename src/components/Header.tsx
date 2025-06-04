
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Track active section for navigation highlighting
      const sections = ['home', 'about', 'skills', 'education', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl sm:text-2xl font-bold text-purple-500"
          >
            Portfolio
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="relative text-gray-300 hover:text-purple-500 transition-all duration-300 group py-2 px-1"
                >
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Underline animation */}
                  <motion.span
                    className="absolute left-0 bottom-0 h-0.5 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isActive ? '100%' : 0,
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                    whileHover={{
                      width: '100%',
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  />
                  
                  {/* Hover background glow */}
                  <motion.span
                    className="absolute inset-0 bg-purple-500/10 rounded-md -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.2 }
                    }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-purple-500 transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800 rounded-lg mt-2 overflow-hidden"
          >
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left py-2 px-2 rounded transition-all duration-300 ${
                      isActive 
                        ? 'text-purple-500 bg-purple-500/10' 
                        : 'text-gray-300 hover:text-purple-500 hover:bg-purple-500/5'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
