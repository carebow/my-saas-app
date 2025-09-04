
import { z } from "zod";

// Enhanced validation with security improvements
export const formSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(320, "Email must be less than 320 characters")
    .refine((email) => {
      // Block common disposable email domains
      const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      return !disposableDomains.includes(domain);
    }, "Please use a permanent email address"),
  
  location: z.string()
    .min(3, "Please enter your city and country")
    .max(200, "Location must be less than 200 characters")
    .regex(/^[a-zA-Z\s,'-]+$/, "Location can only contain letters, spaces, commas, hyphens, and apostrophes"),
  
  signupFor: z.enum(["myself", "parent", "child", "loved-one", "other"]),
  
  careType: z.enum([
    "elder-care",
    "post-surgery", 
    "pediatric-care",
    "telehealth",
    "home-remedies",
    "urgent-care"
  ]),
  
  hearAbout: z.string()
    .min(1, "Please tell us how you heard about us")
    .max(500, "Response must be less than 500 characters"),
  
  questions: z.string()
    .max(1000, "Questions must be less than 1000 characters")
    .optional(),
});

export type FormData = z.infer<typeof formSchema>;

// Input sanitization function
export const sanitizeFormData = (data: FormData): FormData => {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .trim()
  };

  return {
    fullName: sanitizeString(data.fullName),
    email: sanitizeString(data.email.toLowerCase()),
    location: sanitizeString(data.location),
    signupFor: data.signupFor,
    careType: data.careType,
    hearAbout: sanitizeString(data.hearAbout),
    questions: data.questions ? sanitizeString(data.questions) : undefined,
  };
};
