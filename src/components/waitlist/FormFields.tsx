import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import SecureLocationAutocomplete from "../SecureLocationAutocomplete";
import { FormData } from "./FormValidation";

interface FormFieldsProps {
  control: Control<FormData>;
}

const FormFields = ({ control }: FormFieldsProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Full Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  className="bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-slate-400 text-black placeholder:text-slate-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Email Address *</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-slate-400 text-black placeholder:text-slate-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Location (City & Country) *</FormLabel>
              <FormControl>
                <SecureLocationAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Start typing your city..."
                  className="bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-slate-400 text-black placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <FormField
          control={control}
          name="signupFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Who are you signing up for? *</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { value: "myself", label: "Myself" },
                      { value: "parent", label: "A parent" },
                      { value: "child", label: "A child" },
                      { value: "loved-one", label: "A loved one" },
                      { value: "other", label: "Other" }
                    ].map((option, index) => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                          field.value === option.value 
                            ? "border-purple-500 bg-purple-50 shadow-sm" 
                            : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-25"
                        )}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer text-slate-700 flex-1">{option.label}</Label>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <FormField
          control={control}
          name="careType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">What type of care are you most interested in? *</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { value: "elder-care", label: "Elder Care" },
                      { value: "post-surgery", label: "Post-Surgery Support" },
                      { value: "pediatric-care", label: "Pediatric Care" },
                      { value: "telehealth", label: "Telehealth / Virtual Doctor" },
                      { value: "home-remedies", label: "Home Remedies / Lifestyle" },
                      { value: "urgent-care", label: "Urgent Care" }
                    ].map((option, index) => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                          field.value === option.value 
                            ? "border-purple-500 bg-purple-50 shadow-sm" 
                            : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-25"
                        )}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer text-slate-700 flex-1">{option.label}</Label>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
      >
        <FormField
          control={control}
          name="hearAbout"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">How did you hear about CareBow? *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Social media, friend, search engine, etc." 
                  className="bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-slate-400 text-black placeholder:text-slate-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <FormField
          control={control}
          name="questions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Any questions or suggestions for us?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Let us know what you're hoping to see in CareBow..."
                  className="min-h-[120px] bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-slate-400 resize-none text-black placeholder:text-slate-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </>
  );
};

export default FormFields;
