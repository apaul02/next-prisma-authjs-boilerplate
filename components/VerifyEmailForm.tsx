"use client";

import { newVerification } from "@/lib/actions/new-verification";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<{
    type: 'error' | 'success' | null;
    message: string;
  }>({ type: null, message: '' });

  const onSubmit = useCallback( async () => {
    setStatus({ type: null, message: '' });
    if(!token) {
      setStatus({ 
        type: 'error', 
        message: 'Token is missing. Please try again.' 
      });
      return;
    }
    const res = await newVerification(token);
    if(res.success) {
      setStatus({
        type: 'success',
        message: res.success
      });
    } else {
      setStatus({
        type: 'error',
        message: res.error || 'An unexpected error occurred. Please try again.'
      });
    }

  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit])
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Verifying your email
          </h2>
          
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
          
          {!status.type && (
            <>
              <p className="text-center text-gray-600">
                Please wait while we verify your email address.
              </p>
              
              {/* Loader */}
              <div className="flex items-center justify-center w-full py-4">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              </div>
            </>
          )}
          
          {status.type && (
            <Link 
              href="/login" 
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Back to login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}