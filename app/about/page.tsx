'use client';

import Image from 'next/image';
import { Coffee, Globe, Heart, Shield, Truck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const values = [
    {
      icon: Coffee,
      title: 'Quality First',
      description: 'We source only the finest coffee beans from sustainable farms worldwide.',
    },
    {
      icon: Heart,
      title: 'Passion for Coffee',
      description: 'Our love for coffee drives us to deliver exceptional products and experiences.',
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We believe in building lasting relationships through honest business practices.',
    },
    {
      icon: Globe,
      title: 'Global Responsibility',
      description: 'Supporting coffee communities and promoting environmental sustainability.',
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Creating connections between coffee farmers, roasters, and enthusiasts.',
    },
    {
      icon: Truck,
      title: 'Reliable Service',
      description: 'Ensuring timely delivery and exceptional customer support at every step.',
    },
  ];

  const team = [
    {
      name: 'Danis Alfonso',
      role: 'Master Roaster',
      image: '/team/roaster.jpg',
      description: 'With 15 years of experience in coffee roasting, Sarah ensures every batch meets our high standards.',
    },
    {
      name: 'Michael Chen',
      role: 'Green Coffee Buyer',
      image: '/team/buyer.jpg',
      description: 'Michael travels the world to source the best coffee beans and build relationships with farmers.',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Quality Control',
      image: '/team/quality.jpg',
      description: "Elena's refined palate and attention to detail maintain our coffee's exceptional quality.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="relative w-full h-full"
          >
            <Image
              src="/about-hero.jpg"
              alt="Coffee plantation at sunrise"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col justify-center h-full text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Crafting Excellence in Every Cup
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              From farm to cup, we&apos;re dedicated to bringing you the world&apos;s finest coffee
              while supporting sustainable practices and communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="relative h-[400px] rounded-2xl overflow-hidden group"
              variants={fadeInUp}
            >
              <Image
                src="/about-story.jpg"
                alt="Coffee cupping session"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 2025, Selvas Coffee emerged from a simple yet powerful idea:
                  to bridge the gap between exceptional coffee producers and discerning coffee lovers.
                </p>
                <p>
                  Our journey began with extensive travel through the world&apos;s premier coffee-growing
                  regions, building direct relationships with farmers who share our passion for quality
                  and sustainability.
                </p>
                <p>
                  Today, we&apos;re proud to be a leading force in the specialty coffee trade,
                  known for our commitment to excellence, fair practices, and environmental
                  stewardship.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These core principles guide everything we do, from selecting our coffee beans
              to serving our customers and supporting coffee communities.
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-6 h-6 text-primary transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white transition-colors duration-500 group-hover:text-primary">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-all duration-500 group-hover:text-gray-900 dark:group-hover:text-white">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our passionate experts work tirelessly to ensure you receive the highest quality
              coffee and service.
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 dark:text-white">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-[0.15] before:mix-blend-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.1)]">
            Join Us in Our Coffee Journey
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.1)]">
            Experience the difference of truly exceptional coffee while supporting
            sustainable practices and communities worldwide.
          </p>
          <motion.a
            href="/products"
            className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Our Products
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: 3 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
} 