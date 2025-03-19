'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ChevronRight, CircleCheckBig, Github, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signup } from "@/lib/actions/signup"
import { useState } from "react"

const signupSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid Email"
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export function SignupForm() {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const response = await signup(values.name, values.email, values.password)
    if(response.error) {
      setMessage(response.error)
      setIsError(true)
    } else {
      setMessage(response.success || null)
      setIsError(false)
      form.reset()
    }
  }
  async function handleGoogleLogin() {
    console.log("Google login initiated");
    // Add your Google authentication logic here
  }

  async function handleGithubLogin() {
    console.log("GitHub login initiated");
    // Add your GitHub authentication logic here
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xl sm:text-2xl font-semibold font-montserrat">
              <span className="hidden sm:inline">Create an account</span>
              <span className="sm:hidden">Sign Up</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Email</FormLabel>
                    <FormControl>
                      <Input 
                        className={`h-10 text-sm sm:text-base ${
                          form.formState.errors.email ? "border-red-500" : ""
                        }`} 
                        placeholder="john@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Name</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.name ? "border-red-500" : ""
                      }`} placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>     
                )}
              />
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Password</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.password ? "border-red-500" : ""
                      }`} type="password" placeholder="Minimum 8 characters" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">Confirm Password</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.confirmPassword ? "border-red-500" : ""
                      }`} type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              {message && (
                <div className={`flex items-center gap-2 text-sm sm:text-base ${
                  isError ? "text-red-500" : "text-green-500"
                }`}>
                  {isError ? (
                    <X size={20} />
                  ) : (
                    <CircleCheckBig size={20} />
                  )}
                  <span>{message}</span>
                </div>
              )}
              <Button className="w-full h-10 text-base sm:text-lg group p-5 py-6 cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] shadow-none hover:ring-3 ring-blue-500 transition-all ease-in-out duration-300" type="submit">Login
                <ChevronRight className="group-hover:translate-x-1 transition-all duration-300" />
              </Button>
              <div className="relative flex items-center justify-center mb-2">
                <div className="border-t border-gray-300 absolute w-full"></div>
                <div className="bg-background px-4 relative text-gray-500 text-sm">OR</div>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-10 text-base flex items-center justify-center gap-2 group p-5 py-6 cursor-pointer hover:shadow-[0_0_15px_rgba(234,67,53,0.6)] shadow-none hover:ring-3 ring-red-500 transition-all ease-in-out duration-300"
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="2443" height="2500" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262"     id="google">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
                  Login with Google
                </Button>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-10 text-base flex items-center justify-center gap-2 group p-5 py-6 cursor-pointer hover:shadow-[0_0_15px_rgba(36,41,47,0.6)] shadow-none hover:ring-3 ring-gray-800 transition-all ease-in-out duration-300"
                  onClick={handleGithubLogin}
                >
                  <Github size={20} />
                  Login with GitHub
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="pt-4 text-center text-sm sm:text-base">
            <Link href="/login" className="hover:text-primary/80 transition-all duration-300 ease-in-out">
              Already have an account? Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}