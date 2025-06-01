"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, User, Mail, Phone, Clock, MessageSquare, Camera, Users } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
        t('serviceSelection.studio.features.lighting'),
        t('serviceSelection.studio.features.equipment'),
        t('serviceSelection.studio.features.editing'),
        t('serviceSelection.studio.features.props')
      ],
      icon: Camera
    },
    {
      id: "coworking" as const,
      title: t('serviceSelection.coworking.title'),
      description: t('serviceSelection.coworking.description'),
      price: t('serviceSelection.coworking.price'),
      features: [
        t('serviceSelection.coworking.features.access'),
        t('serviceSelection.coworking.features.internet'),
        t('serviceSelection.coworking.features.meetings'),
        t('serviceSelection.coworking.features.refreshments')
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
      // Here you would typically submit to your backend
      console.log("Booking submitted:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and redirect
      router.push("/booking-success");
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reserve your creative space in just a few simple steps. We'll confirm your booking within 24 hours.
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
                          <h2 className="text-2xl font-bold mb-2">{t('serviceSelection.title')}</h2>
                          <p className="text-muted-foreground">{t('serviceSelection.description')}</p>
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
                                          <div className="flex items-center gap-3">
                                            <type.icon className="w-6 h-6 text-primary" />
                                            <CardTitle className="text-xl">{type.title}</CardTitle>
                                          </div>
                                          <span className="text-lg font-bold text-primary">{type.price}</span>
                                        </div>
                                        <p className="text-muted-foreground text-base">{type.description}</p>
                                      </CardHeader>
                                      <CardContent className="pt-0">
                                        <ul className="space-y-2">
                                          {type.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm">
                                              <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
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
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{tCommon('date')}</FormLabel>
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
                                          <span>{t('schedule.pickDate')}</span>
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
                                <FormLabel>{t('schedule.startTime')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder={t('schedule.startTime')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {TIME_SLOTS.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
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
                                <FormLabel>{t('schedule.endTime')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder={t('schedule.endTime')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {TIME_SLOTS.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
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
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          {t('navigation.previous')}
                        </Button>
                      </motion.div>
                    ) : (
                      <div />
                    )}

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
                          {t('navigation.next')}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center gap-2"
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