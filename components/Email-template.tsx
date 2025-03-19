import React from "react";

interface EmailTemplateProps {
  firstName: string;
  token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  token
}) => (
  <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-indigo-600 px-6 py-4">
      <h1 className="text-xl font-bold text-white">Hi {firstName},</h1>
    </div>
    <div className="p-6">
      <p className="text-gray-700 mb-6">
        Please verify your email address by clicking the link below:
      </p>
      <a 
        href={`http://localhost:3000/verify-email?token=${token}`}
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
      >
        Verify Email
      </a>
      <p className="mt-6 pt-4 text-sm text-gray-500 border-t border-gray-200">
        If you did not request this email, please ignore it.
      </p>
    </div>
  </div>
)