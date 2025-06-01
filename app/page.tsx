// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Camera, Users, Star, Clock, CheckCircle, Wifi, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { LocationMap } from "@/components/location-map";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-6">
                <motion.div 
                  className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Professional Photography Studio
                </motion.div>
                
                <motion.h1 
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  Your Creative
                  <span className="block text-primary">Studio Space</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                  Professional photography studio and creative coworking space designed 
                  to bring your artistic vision to life.
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <Link href="/book">
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <Button size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                      Book Studio Time
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/gallery">
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl">
                      View Gallery
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                className="flex items-center gap-8 pt-8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">4.9</span>
                  <span className="text-muted-foreground">(200+ reviews)</span>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Enhanced Studio Showcase */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <div className="grid grid-cols-12 gap-4 h-[500px]">
                {/* Main Studio Card */}
                <motion.div
                  className="col-span-8 row-span-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.005, y: -1 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-primary/10 via-background to-accent/20">
                    <CardContent className="h-full flex flex-col justify-center items-center p-8 text-center">
                      <motion.div
                        className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6"
                        whileHover={{ rotate: 2, scale: 1.01 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        <Camera className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3">Professional Studio</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        State-of-the-art equipment, professional lighting, and creative spaces
                      </p>
                      <motion.div 
                        className="mt-6 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.1 }}
                      >
                        Book from $75/hour
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Community Card */}
                <motion.div
                  className="col-span-4 row-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, rotate: 0.5 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <CardContent className="h-full flex flex-col justify-center items-center p-6 text-center">
                      <motion.div
                        whileHover={{ rotate: -2, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                      </motion.div>
                      <h4 className="font-semibold text-sm mb-1">Community</h4>
                      <p className="text-xs text-muted-foreground">50+ Members</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Amenities Card */}
                <motion.div
                  className="col-span-4 row-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, rotate: -0.5 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <CardContent className="h-full flex flex-col justify-center items-center p-6 text-center">
                      <div className="flex gap-2 mb-3">
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
                          <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
                          <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </motion.div>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">Amenities</h4>
                      <p className="text-xs text-muted-foreground">All Included</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Availability Card */}
                <motion.div
                  className="col-span-8 row-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Card className="h-full border-0 shadow-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                    <CardContent className="h-full flex items-center justify-between p-6">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-10 h-10 bg-orange-600 dark:bg-orange-400 rounded-full flex items-center justify-center"
                          whileHover={{ scale: 1.05, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-5 h-5 text-white dark:text-orange-900" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-sm">Available Now</h4>
                          <p className="text-xs text-muted-foreground">Ready for booking</p>
                        </div>
                      </div>
                      <motion.div
                        className="px-3 py-1 bg-orange-600 dark:bg-orange-400 text-white dark:text-orange-900 rounded-full text-xs font-medium"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.1 }}
                      >
                        24/7
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              {/* Floating Accent */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/30 rounded-full"
                animate={{ 
                  y: [0, 10, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional facilities and a supportive community to bring your creative vision to life.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Studio Service */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <motion.div 
                    className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: 1, scale: 1.01 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <Camera className="w-8 h-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-2xl">Photo Studio</CardTitle>
                  <CardDescription className="text-lg">
                    Fully equipped photography studio with professional lighting, 
                    cameras, and editing stations for all your creative needs.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {["Professional lighting setup", "High-end camera equipment", "Editing workstations"].map((item, index) => (
                      <motion.li 
                        key={item}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold">$75</span>
                      <span className="text-muted-foreground">/hour</span>
                    </div>
                    <Link href="/studio">
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        <Button className="px-6 py-3 rounded-xl">
                          Learn More
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Coworking Service */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <motion.div 
                    className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: 1, scale: 1.01 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <Users className="w-8 h-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-2xl">Coworking Space</CardTitle>
                  <CardDescription className="text-lg">
                    Join a vibrant community of freelancers and creative professionals 
                    in our inspiring coworking environment.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {["24/7 access for members", "High-speed internet", "Networking events"].map((item, index) => (
                      <motion.li 
                        key={item}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold">$25</span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                    <Link href="/coworking">
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        <Button variant="secondary" className="px-6 py-3 rounded-xl">
                          Learn More
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why Choose Studio Space?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide everything you need to create, collaborate, and grow your creative business.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Professional Equipment",
                description: "Access to industry-standard cameras, lighting, and editing tools."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Creative Community",
                description: "Connect with like-minded professionals and expand your network."
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Flexible Booking",
                description: "Book studio time or coworking space by the hour, day, or month."
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Expert Support",
                description: "Get help from our team of photography and business professionals."
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "All-Inclusive",
                description: "Everything included in one membership - no hidden fees."
              },
              {
                icon: <ArrowRight className="w-8 h-8" />,
                title: "Growth Focused",
                description: "Workshops and events designed to help you grow your creative business."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -1, scale: 1.005 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <motion.div 
                      className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"
                      whileHover={{ rotate: 1, scale: 1.01 }}
                      transition={{ duration: 0.1, ease: "easeInOut" }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Map */}
      <LocationMap />

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.005 }}
          >
            <Card className="text-center p-12 shadow-xl max-w-4xl mx-auto">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <CardTitle className="text-4xl lg:text-5xl font-bold mb-4">
                    Ready to Start Creating?
                  </CardTitle>
                  <CardDescription className="text-xl max-w-2xl mx-auto">
                    Join hundreds of creatives who trust Studio Space for their photography and coworking needs.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="pt-8">
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <Link href="/book">
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      transition={{ duration: 0.1, ease: "easeInOut" }}
                    >
                      <Button size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                        Book Your Session
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/gallery">
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      transition={{ duration: 0.1, ease: "easeInOut" }}
                    >
                      <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl">
                        View Our Work
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
