"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, User, Mail, Phone, Clock, MessageSquare, Camera, Users } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
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
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  bookingType: z.enum(["studio", "coworking"]),
  date: z.date({
    required_error: "A date is required.",
  }),
  startTime: z.string().min(1, {
    message: "Please select a start time.",
  }),
  endTime: z.string().min(1, {
    message: "Please select an end time.",
  }),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof formSchema>;

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Example of unavailable time slots data - in real app, fetch from API
const UNAVAILABLE_TIME_SLOTS = [
  { date: "2023-12-01", startTime: "09:00", endTime: "11:00" },
  { date: "2023-12-01", startTime: "14:00", endTime: "16:00" },
  { date: "2023-12-02", startTime: "13:00", endTime: "15:00" },
  { date: new Date().toISOString().split('T')[0], startTime: "10:00", endTime: "13:00" },
];

// Function to check if a time slot is available
const isTimeSlotAvailable = (date: Date, time: string): boolean => {
  if (!date) return true; 
  
  const dateString = date.toISOString().split('T')[0];
  const timeNumber = parseInt(time.split(':')[0]);
  
  // Check against unavailable slots
  return !UNAVAILABLE_TIME_SLOTS.some((slot) => {
    if (slot.date !== dateString) return false;
    
    const slotStartTime = parseInt(slot.startTime.split(':')[0]);
    const slotEndTime = parseInt(slot.endTime.split(':')[0]);
    
    return timeNumber >= slotStartTime && timeNumber < slotEndTime;
  });
};

export default function BookPage() {
  const t = useTranslations('booking');
  const tCommon = useTranslations('common');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bookingType: "studio",
      startTime: "",
      endTime: "",
      message: "",
    },
  });

  const BOOKING_TYPES = [
    {
      id: "studio" as const,
      title: t('serviceSelection.studio.title'),
      description: t('serviceSelection.studio.description'),
      price: t('serviceSelection.studio.price'),
      features: [
        t('serviceSelection.studio.feature1'),
        t('serviceSelection.studio.feature2'),
        t('serviceSelection.studio.feature3'),
        t('serviceSelection.studio.feature4')
      ],
      icon: Camera
    },
    {
      id: "coworking" as const,
      title: t('serviceSelection.coworking.title'),
      description: t('serviceSelection.coworking.description'),
      price: t('serviceSelection.coworking.price'),
      features: [
        t('serviceSelection.coworking.feature1'),
        t('serviceSelection.coworking.feature2'),
        t('serviceSelection.coworking.feature3'),
        t('serviceSelection.coworking.feature4')
      ],
      icon: Users
    }
  ];

  const steps = [
    { id: 1, title: t('steps.service'), icon: Check },
    { id: 2, title: t('steps.details'), icon: User },
    { id: 3, title: t('steps.schedule'), icon: Clock },
    { id: 4, title: t('steps.confirm'), icon: Check },
  ];

  const selectedBookingType = BOOKING_TYPES.find(
    (type) => type.id === form.watch("bookingType")
  );

  const handleNext = () => {
    // Validate current step before proceeding
    let fieldsToValidate: (keyof BookingFormValues)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["bookingType"];
        break;
      case 2:
        fieldsToValidate = ["name", "email", "phone"];
        break;
      case 3:
        fieldsToValidate = ["date", "startTime", "endTime"];
        break;
    }

    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      }
    });
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: BookingFormValues) => {
    setIsLoading(true);
    
    try {
      // Generate booking ID here for consistency
      const bookingId = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Here you would typically submit to your backend
      console.log("Booking submitted:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create query parameters for the success page
      const params = new URLSearchParams({
        bookingId: bookingId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        service: values.bookingType,
        date: values.date.toISOString().split('T')[0],
        startTime: values.startTime,
        endTime: values.endTime,
        ...(values.message && { message: values.message }),
      });
      
      // Redirect to success page with booking data
      router.push(`/booking-success?${params.toString()}`);
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-8xl">
        <motion.div 
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-accent rounded-full text-sm font-medium mb-4">
              <Camera className="w-4 h-4 mr-2 text-primary" />
              {t('badge')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-foreground">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            className="flex justify-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <motion.div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200",
                      currentStep >= step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-xs sm:text-sm font-medium">{step.id}</span>
                    )}
                  </motion.div>
                  <div className="ml-2 sm:ml-3 hidden sm:block">
                    <p className={cn(
                      "text-sm font-medium transition-colors whitespace-nowrap",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-6 sm:w-8 h-0.5 mx-2 sm:mx-4 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 lg:p-8">
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
                        <div className="text-center mb-6 sm:mb-8">
                          <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('serviceSelection.title')}</h2>
                          <p className="text-sm sm:text-base text-muted-foreground">{t('serviceSelection.description')}</p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="bookingType"
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                                {BOOKING_TYPES.map((type) => (
                                  <motion.div
                                    key={type.id}
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                    transition={{ duration: 0.1 }}
                                  >
                                    <Card 
                                      className={cn(
                                        "cursor-pointer transition-all duration-200 hover:shadow-lg h-full border-2",
                                        field.value === type.id 
                                          ? "ring-2 ring-primary bg-primary/5 border-primary/30" 
                                          : "hover:shadow-md border-border/50 hover:border-primary/20"
                                      )}
                                      onClick={() => field.onChange(type.id)}
                                    >
                                      <CardHeader className="pb-3 sm:pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                              <type.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                            </div>
                                            <CardTitle className="text-lg sm:text-xl">{type.title}</CardTitle>
                                          </div>
                                          <span className="text-base sm:text-lg font-bold text-primary">{type.price}</span>
                                        </div>
                                        <p className="text-sm sm:text-base text-muted-foreground">{type.description}</p>
                                      </CardHeader>
                                      <CardContent className="pt-0">
                                        <ul className="space-y-2">
                                          {type.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-xs sm:text-sm">
                                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-2 flex-shrink-0" />
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

                    {/* Step 2: Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold mb-2">{t('details.title')}</h2>
                          <p className="text-muted-foreground">{t('details.description')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  {t('fullName')}
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
                                  {t('email')}
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
                                  {t('phone')}
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
                          <h2 className="text-2xl font-bold mb-2">{t('schedule.title')}</h2>
                          <p className="text-muted-foreground">{t('schedule.description')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="md:col-span-3 mb-6">
                            <div className="bg-accent/20 rounded-xl p-4 mb-2">
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                {t('schedule.dateTimeSelection')}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {t('schedule.dateTimeHelpText')}
                              </p>
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col md:col-span-3">
                                <FormLabel className="text-base flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  {tCommon('date')}
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "pl-3 text-left font-normal h-14 rounded-xl border-2 transition-all",
                                          field.value 
                                            ? "border-primary/50 shadow-sm shadow-primary/20" 
                                            : "text-muted-foreground",
                                          "hover:bg-primary/5"
                                        )}
                                      >
                                        {field.value ? (
                                          <span className="font-medium">{format(field.value, "PPP")}</span>
                                        ) : (
                                          <span>{t('schedule.pickDate')}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-5 w-5 text-primary/70" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 border-2 border-primary/30 rounded-xl shadow-xl shadow-primary/10" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="rounded-xl"
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
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-base flex items-center gap-2 mb-2">
                                  <Clock className="w-4 h-4 text-primary" />
                                  {t('schedule.startTime')}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-14 rounded-xl border-2 hover:bg-primary/5 transition-all focus:border-primary/50 focus:shadow-sm focus:shadow-primary/20">
                                      <SelectValue placeholder={t('schedule.startTime')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="border-2 border-primary/30 rounded-xl shadow-xl shadow-primary/10">
                                    {TIME_SLOTS.map((time) => {
                                      const isAvailable = isTimeSlotAvailable(form.watch("date"), time);
                                      
                                      return (
                                        <SelectItem 
                                          key={time} 
                                          value={time}
                                          disabled={!isAvailable}
                                          className={cn(
                                            "focus:bg-primary/10 focus:text-primary rounded-lg my-1 transition-colors",
                                            !isAvailable && "text-muted-foreground opacity-50"
                                          )}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Clock className={cn("w-4 h-4", !isAvailable && "text-muted-foreground")} />
                                            <span>{time}</span>
                                            {!isAvailable && <span className="ml-auto text-xs text-red-500">{t('schedule.unavailable')}</span>}
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
                                <FormLabel className="text-base flex items-center gap-2 mb-2">
                                  <Clock className="w-4 h-4 text-primary" />
                                  {t('schedule.endTime')}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-14 rounded-xl border-2 hover:bg-primary/5 transition-all focus:border-primary/50 focus:shadow-sm focus:shadow-primary/20">
                                      <SelectValue placeholder={t('schedule.endTime')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="border-2 border-primary/30 rounded-xl shadow-xl shadow-primary/10">
                                    {TIME_SLOTS.map((time) => {
                                      // Getting the index of the selected start time
                                      const startTimeIndex = TIME_SLOTS.findIndex(t => t === form.watch("startTime"));
                                      const currentTimeIndex = TIME_SLOTS.findIndex(t => t === time);
                                      
                                      // Check both time order constraints and availability
                                      const isBeforeStartTime = form.watch("startTime") && currentTimeIndex <= startTimeIndex;
                                      const isTimeUnavailable = !isTimeSlotAvailable(form.watch("date"), time);
                                      const isDisabled = isBeforeStartTime || isTimeUnavailable;
                                      
                                      // Get reason for being disabled
                                      let disabledReason = "";
                                      if (isBeforeStartTime) disabledReason = t('schedule.mustBeAfterStart');
                                      if (isTimeUnavailable) disabledReason = t('schedule.unavailable');
                                      
                                      return (
                                        <SelectItem 
                                          key={time} 
                                          value={time} 
                                          disabled={isDisabled}
                                          className={cn(
                                            "focus:bg-primary/10 focus:text-primary rounded-lg my-1 transition-colors",
                                            isDisabled && "text-muted-foreground opacity-50"
                                          )}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Clock className={cn("w-4 h-4", isDisabled && "text-muted-foreground")} />
                                            <span>{time}</span>
                                            {isDisabled && (
                                              <span className="ml-auto text-xs text-red-500">{disabledReason}</span>
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
                                {t('schedule.additionalMessage')}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('schedule.messagePlaceholder')}
                                  className="resize-none min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {t('schedule.messageDescription')}
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
                          <h2 className="text-2xl font-bold mb-2">{t('review.title')}</h2>
                          <p className="text-muted-foreground">{t('review.description')}</p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">{t('review.service')}</h3>
                              <p className="text-muted-foreground">{selectedBookingType?.title}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">{t('review.dateTime')}</h3>
                              <p className="text-muted-foreground">
                                {form.getValues("date") && format(form.getValues("date"), "PPP")}<br/>
                                {form.getValues("startTime")} - {form.getValues("endTime")}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">{t('review.contact')}</h3>
                              <p className="text-muted-foreground">
                                {form.getValues("name")}<br/>
                                {form.getValues("email")}<br/>
                                {form.getValues("phone")}
                              </p>
                            </div>
                            {form.getValues("message") && (
                              <div>
                                <h3 className="font-semibold mb-2">{t('review.additionalMessage')}</h3>
                                <p className="text-muted-foreground">{form.getValues("message")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
                    {currentStep > 1 ? (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1 }}
                        className="order-2 sm:order-1"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          {t('navigation.previous')}
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="order-2 sm:order-1" />
                    )}

                    {currentStep < steps.length ? (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1 }}
                        className="order-1 sm:order-2"
                      >
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                          {t('navigation.next')}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1 }}
                        className="order-1 sm:order-2"
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                          {isLoading ? t('navigation.submitting') : t('navigation.submitBooking')}
                          <Check className="w-4 h-4" />
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