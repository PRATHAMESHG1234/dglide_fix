import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/componentss/ui/form';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';

import { forgotPassword } from '../../services/auth';
import { notify } from '@/hooks/toastUtils';

interface AuthForgotPasswordProps {
  setMailConfirm: (value: boolean) => void;
  setGetUserName: (name: string | null) => void;
}

const emailSchema = z.object({
  email: z.string().email('Must be a valid email').nonempty('Email is required')
});

type EmailFormValues = z.infer<typeof emailSchema>;

const AuthForgotPassword: React.FC<AuthForgotPasswordProps> = ({
  setMailConfirm,
  setGetUserName
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sendingLoader, setSendingLoader] = useState(false);

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' }
  });

  const getFirstNameFromEmail = (email: string): string | null => {
    if (!email) return null;
    const nameRegex = /^([a-zA-Z]+)/;
    const match = email.match(nameRegex);
    return match ? match[1] : null;
  };

  const onSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    try {
      setSendingLoader(true);

      const response = await forgotPassword(data.email);

      if (response.status) {
        notify.success('Check mail for reset password link');
        setMailConfirm(true);
        setGetUserName(getFirstNameFromEmail(data.email));
      } else {
        notify.error(response.message || 'Error sending reset password email');
        throw new Error(
          response.message || 'Error sending reset password email'
        );
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSendingLoader(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address / Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-md border border-gray-300 px-4 py-2"
                />
              </FormControl>
              <FormMessage>
                {methods.formState.errors.email?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className="mt-4">
          <Button
            type="submit"
            disabled={sendingLoader}
            className="w-full bg-primary text-white"
          >
            {!sendingLoader ? (
              'Send Mail'
            ) : (
              <span className="inline-flex items-center">
                <svg
                  className="mr-2 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  ></path>
                </svg>
                Sending...
              </span>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AuthForgotPassword;
