
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firebase
      await addDoc(collection(db, 'contactSubmissions'), {
        ...formData,
        timestamp: serverTimestamp(),
        status: 'new'
      });

      // Redirect to WhatsApp
      const whatsappMessage = `Hi, I'm reaching out via your portfolio site!

Name: ${formData.name}
Email: ${formData.email}
Message: ${formData.message}`;
      
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/9121055512?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Redirecting to WhatsApp!",
        description: "Your message has been saved and you're being redirected to WhatsApp.",
      });

      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'snsnarayanac@gmail.com',
      href: 'mailto:snsnarayanac@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 9121055512',
      href: 'tel:+91 9121055512',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Kakinada, Andhra Pradesh',
      href: '#',
    },
  ];

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
      id="contact"
      ref={ref}
      className="py-16 sm:py-20 lg:py-32 bg-gray-900 px-4 sm:px-6 lg:px-8"
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
            Get In <span className="text-purple-500">Touch</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 bg-purple-500 mx-auto mb-8"
          />
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
          >
            I'm always open to discussing new opportunities and interesting projects.
            Let's create something amazing together!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Let's talk about your project
              </h3>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
                I'm currently available for freelance work and full-time opportunities.
                Whether you have a project in mind or just want to chat about technology,
                I'd love to hear from you.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 text-gray-300 hover:text-purple-500 transition-colors duration-300 group"
                >
                  <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 group-hover:border-purple-500 transition-colors duration-300">
                    <info.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{info.title}</h4>
                    <p className="text-sm">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send size={20} />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-16 pt-8 border-t border-gray-700"
        >
          <p className="text-gray-400">
            Copyright © 2025 chsatyanarayana | All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
