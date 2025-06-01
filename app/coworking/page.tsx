"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Wifi, Coffee, Printer, Video, Zap } from "lucide-react";
import { motion } from "framer-motion";

const amenities = [
  {
    icon: Users,
    title: "Community Space",
    description: "Open collaborative areas for networking and idea sharing."
  },
  {
    icon: Wifi,
    title: "High-Speed Internet",
    description: "Fiber internet with guaranteed speeds for seamless work."
  },
  {
    icon: Coffee,
    title: "Free Coffee & Snacks",
    description: "Unlimited coffee, tea, and healthy snacks throughout the day."
  },
  {
    icon: Printer,
    title: "Office Equipment",
    description: "Printing, scanning, and office supplies available."
  },
  {
    icon: Video,
    title: "Meeting Rooms",
    description: "Private meeting rooms available for calls and presentations."
  },
  {
    icon: Zap,
    title: "24/7 Access",
    description: "Round-the-clock access for maximum flexibility."
  }
];

const memberships = [
  {
    name: "Day Pass",
    price: "$25",
    duration: "per day",
    features: [
      "Desk access for 8 hours",
      "Free Wi-Fi",
      "Coffee & snacks",
      "Basic office equipment"
    ]
  },
  {
    name: "Monthly",
    price: "$200",
    duration: "per month",
    features: [
      "Everything in day pass",
      "24/7 access",
      "Meeting room credits",
      "Community events access",
      "Mail handling"
    ],
    popular: true
  },
  {
    name: "Annual",
    price: "$1,800",
    duration: "per year",
    features: [
      "Everything in monthly",
      "Priority booking",
      "Guest passes included",
      "Free event hosting",
      "Dedicated storage"
    ]
  }
];

export default function CoworkingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Creative Coworking Space
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              A vibrant community workspace designed for freelancers, entrepreneurs, 
              and creative professionals. Connect, collaborate, and create in an 
              inspiring environment.
            </motion.p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/book">
                <Button size="lg" className="mr-4">
                  Book Your Spot
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline">
                  Tour the Space
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="grid gap-8 md:grid-cols-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {[
              { value: "50+", label: "Active Members" },
              { value: "24/7", label: "Access Available" },
              { value: "5", label: "Meeting Rooms" },
              { value: "100%", label: "Uptime Guarantee" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Workspace Amenities
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to be productive and comfortable
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {amenities.map((amenity, index) => (
              <motion.div 
                key={amenity.title} 
                className="flex flex-col items-center text-center p-6 bg-background rounded-lg border h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <motion.div
                  whileHover={{ rotate: 3, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <amenity.icon className="h-12 w-12 mb-4 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{amenity.title}</h3>
                <p className="text-muted-foreground">{amenity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Membership Options
            </h2>
            <p className="mt-4 text-muted-foreground">
              Flexible plans to suit your working style and schedule
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {memberships.map((membership, index) => (
              <motion.div
                key={membership.name}
                className={`relative p-6 rounded-lg border h-full ${
                  membership.popular 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -3, scale: 1.01 }}
              >
                {membership.popular && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  >
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </motion.div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold">{membership.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{membership.price}</span>
                    <span className="text-muted-foreground ml-1">{membership.duration}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {membership.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={feature} 
                      className="flex items-center text-sm"
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.05) + (featureIndex * 0.03), ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <Link href="/book" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <Button 
                      className="w-full" 
                      variant={membership.popular ? 'default' : 'outline'}
                    >
                      Choose {membership.name}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            className="mx-auto max-w-3xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
              Join Our Creative Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with like-minded professionals, attend networking events, 
              and be part of a supportive community that helps you grow your business.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3 text-center max-w-5xl mx-auto">
            {[
              {
                title: "Weekly Events",
                description: "Networking mixers, workshops, and skill-sharing sessions every week."
              },
              {
                title: "Mentor Network", 
                description: "Access to experienced professionals and industry mentors."
              },
              {
                title: "Collaboration",
                description: "Find project partners and collaborate on exciting opportunities."
              }
            ].map((item, index) => (
              <motion.div 
                key={item.title}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 