'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ChevronRight, Github, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/routes"
import { login } from "@/lib/actions/login"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { reset } from "@/lib/actions/reset-password"
import { NewPasswordSchema, resetSchema } from "@/lib/schemas"
import { newPassword } from "@/lib/actions/new-password"



export default function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<{
    type: 'error' | 'success' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    }
  })
  
  async function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    try {
      setStatus({ type: null, message: '' });
      const res = await newPassword(values, token);
      console.log("Server action result:", res);
      if (res.success) {
        setStatus({ 
          type: 'success', 
          message: res.success 
        });
      }
      else {
        setStatus({ 
          type: 'error', 
          message: res.error! 
        });
      }
    } catch(err) {
      console.log(err);
      setStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xl sm:text-2xl font-semibold font-montserrat">
              Reset Your Password
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {status.type && (
            <Alert 
              variant={status.type === 'error' ? 'destructive' : 'default'} 
              className={`mb-4 ${status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}`}
            >
              {status.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              <AlertTitle className="text-sm font-medium">
                {status.type === 'error' ? 'Error' : 'Success'}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {status.message}
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-lg">New Password</FormLabel>
                    <FormControl>
                      <Input className={`h-10 text-sm sm:text-base ${
                        form.formState.errors.password ? "border-red-500" : ""
                      }`} placeholder="Enter your new password" {...field} type="password" />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base" />
                  </FormItem>
                )}
              />
              
              <Button className="w-full h-10 text-base sm:text-lg group p-5 py-6 cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] shadow-none hover:ring-3 ring-blue-500 transition-all ease-in-out duration-300" type="submit">Confirm New Password
                <ChevronRight className="group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </form>
          </Form>
          <div className="pt-4 text-center text-sm sm:text-base">
            <Link href="/login">
              <div className="hover:scale-105 transition-all hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)] duration-300 ease-in-out">Back to Login</div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}