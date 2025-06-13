// components/booking-form.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, User, Mail, Phone, Clock, MessageSquare, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters.")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces."),
  email: z.string()
    .email("Please enter a valid email address.")
    .max(100, "Email must be less than 100 characters."),
  phone: z.string()
    .min(10, "Please enter a valid phone number.")
    .max(20, "Phone number is too long.")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number."),
  bookingType: z.enum(["studio", "coworking"]),
  date: z.date({
    required_error: "A date is required.",
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Date cannot be in the past."),
  startTime: z.string()
    .min(1, "Please select a start time."),
  endTime: z.string()
    .min(1, "Please select an end time."),
  message: z.string()
    .max(500, "Message must be less than 500 characters.")
    .optional(),
}).refine((data) => {
  const start = parseInt(data.startTime.replace(':', ''));
  const end = parseInt(data.endTime.replace(':', ''));
  return end > start;
}, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

type BookingFormValues = z.infer<typeof formSchema>;

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const BOOKING_TYPES = [
  {
    id: "studio",
    title: "Photography Studio",
    description: "Professional studio with lighting and equipment",
    price: "$75/hour",
    features: ["Professional lighting", "Camera equipment rental", "Editing stations", "Props & backdrops"]
  },
  {
    id: "coworking",
    title: "Coworking Space",
    description: "Flexible workspace with all amenities",
    price: "$25/day",
    features: ["24/7 access", "High-speed internet", "Meeting rooms", "Coffee & snacks"]
  }
];

const steps = [
  { id: 1, title: "Service", icon: Check },
  { id: 2, title: "Details", icon: User },
  { id: 3, title: "Schedule", icon: Clock },
  { id: 4, title: "Confirm", icon: Check },
];

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: "studio",
    },
  });

  const watchBookingType = form.watch("bookingType");
  const watchDate = form.watch("date");
  const selectedBookingType = BOOKING_TYPES.find(type => type.id === watchBookingType);

  // Check for unavailable time slots when date changes
  const checkAvailability = useCallback(async (date: Date) => {
    try {
      const response = await fetch(`/api/bookings/availability?date=${date.toISOString()}&type=${watchBookingType}`);
      if (response.ok) {
        const data = await response.json();
        setUnavailableSlots(data.unavailableSlots || []);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  }, [watchBookingType]);

  useEffect(() => {
    if (watchDate) {
      checkAvailability(watchDate);
    }
  }, [watchDate, checkAvailability]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return form.getValues("bookingType") ? true : false;
      case 2:
        const result = await form.trigger(["name", "email", "phone"]);
        return result;
      case 3:
        return await form.trigger(["date", "startTime", "endTime"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      nextStep();
    }
  };

  async function onSubmit(data: BookingFormValues) {
    try {
      setIsLoading(true);
      setSubmitStatus('loading');

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          type: data.bookingType,
          date: data.date.toISOString(),
          start_time: data.startTime,
          end_time: data.endTime,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit booking');
      }

      setSubmitStatus('success');

      toast.success("Booking Request Submitted", {
        description: "We've received your booking request. You'll receive a confirmation email shortly.",
        duration: 5000,
      });

      // Wait a moment to show success state
      setTimeout(() => {
      form.reset();
      setCurrentStep(1);
        setSubmitStatus('idle');
        router.push('/booking-success');
      }, 2000);

    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
      
      toast.error("Booking Failed", {
        description: error instanceof Error ? error.message : "There was an error submitting your booking. Please try again.",
        duration: 5000,
      });
      
      // Reset status after showing error
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div 
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
              Book Your Space
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reserve your creative space in just a few simple steps. We&apos;ll confirm your booking within 24 hours.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      currentStep >= step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </motion.div>
                  <div className="ml-3 hidden sm:block">
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-4 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Service Selection */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold mb-2">Choose Your Service</h2>
                          <p className="text-muted-foreground">Select the type of space you&apos;d like to book</p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="bookingType"
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid md:grid-cols-2 gap-6">
                                {BOOKING_TYPES.map((type) => (
                                  <motion.div
                                    key={type.id}
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                    transition={{ duration: 0.1 }}
                                  >
                                    <Card 
                                      className={cn(
                                        "cursor-pointer transition-all duration-200 hover:shadow-lg h-full",
                                        field.value === type.id 
                                          ? "ring-2 ring-primary bg-primary/5" 
                                          : "hover:shadow-md"
                                      )}
                                      onClick={() => field.onChange(type.id)}
                                    >
                                      <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <CardTitle className="text-xl">{type.title}</CardTitle>
                                          <span className="text-lg font-bold text-primary">{type.price}</span>
                                        </div>
                                        <p className="text-muted-foreground text-base">{type.description}</p>
                                      </CardHeader>
                                      <CardContent className="pt-0">
                                        <ul className="space-y-3">
                                          {type.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm">
                                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                              {feature}
                                            </li>
                                          ))}
                                        </ul>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 2: Contact Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold mb-2">Your Details</h2>
                          <p className="text-muted-foreground">Tell us how to reach you</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Full Name
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...field}
                                    className="h-12"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    {...field}
                                    className="h-12"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Schedule */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
                          <p className="text-muted-foreground">When would you like to book?</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "pl-3 text-left font-normal h-12",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="Start time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {TIME_SLOTS.map((time) => {
                                      const isUnavailable = unavailableSlots.includes(time);
                                      return (
                                        <SelectItem 
                                          key={time} 
                                          value={time}
                                          disabled={isUnavailable}
                                          className={isUnavailable ? "opacity-50 cursor-not-allowed" : ""}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <span>{time}</span>
                                            {isUnavailable && (
                                              <span className="text-xs text-red-500 ml-2">Unavailable</span>
                                            )}
                                          </div>
                                      </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="End time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {TIME_SLOTS.map((time) => {
                                      const startTime = form.getValues("startTime");
                                      const isBeforeStart = startTime && parseInt(time.replace(':', '')) <= parseInt(startTime.replace(':', ''));
                                      const isUnavailable = unavailableSlots.includes(time);
                                      const disabled = isBeforeStart || isUnavailable;
                                      
                                      return (
                                        <SelectItem 
                                          key={time} 
                                          value={time}
                                          disabled={disabled}
                                          className={disabled ? "opacity-50 cursor-not-allowed" : ""}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <span>{time}</span>
                                            {isUnavailable && (
                                              <span className="text-xs text-red-500 ml-2">Unavailable</span>
                                            )}
                                            {isBeforeStart && !isUnavailable && (
                                              <span className="text-xs text-gray-500 ml-2">Before start</span>
                                            )}
                                          </div>
                                      </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="mt-6">
                              <FormLabel className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Additional Message (Optional)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your project or any special requirements..."
                                  className="resize-none min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Let us know about your specific needs or any questions you have.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold mb-2">Review Your Booking</h2>
                          <p className="text-muted-foreground">Please confirm your details below</p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">Service</h3>
                              <p className="text-muted-foreground">{selectedBookingType?.title}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Date & Time</h3>
                              <p className="text-muted-foreground">
                                {form.getValues("date") && format(form.getValues("date"), "PPP")}<br/>
                                {form.getValues("startTime")} - {form.getValues("endTime")}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Contact</h3>
                              <p className="text-muted-foreground">
                                {form.getValues("name")}<br/>
                                {form.getValues("email")}<br/>
                                {form.getValues("phone")}
                              </p>
                            </div>
                            {form.getValues("message") && (
                              <div>
                                <h3 className="font-semibold mb-2">Message</h3>
                                <p className="text-muted-foreground">{form.getValues("message")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {currentStep < steps.length ? (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center gap-2"
                        >
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: submitStatus === 'idle' ? 1.005 : 1 }}
                        whileTap={{ scale: submitStatus === 'idle' ? 0.995 : 1 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading || submitStatus !== 'idle'}
                          className={cn(
                            "flex items-center gap-2 min-w-[140px]",
                            submitStatus === 'success' && "bg-green-600 hover:bg-green-700",
                            submitStatus === 'error' && "bg-red-600 hover:bg-red-700"
                          )}
                        >
                          {submitStatus === 'loading' && (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                              />
                              Submitting...
                            </>
                          )}
                          {submitStatus === 'success' && (
                            <>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Check className="w-4 h-4" />
                              </motion.div>
                              Submitted!
                            </>
                          )}
                          {submitStatus === 'error' && (
                            <>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <XCircle className="w-4 h-4" />
                              </motion.div>
                              Try Again
                            </>
                          )}
                          {submitStatus === 'idle' && (
                            <>
                              Submit Booking
                          <Check className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
