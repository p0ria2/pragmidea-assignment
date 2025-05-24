'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingButton,
} from '@/_components';
import { signIn, signUp } from '@/_lib/auth-client';
import { cn } from '@/_lib/css-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useAuth } from '../_providers/AuthProvider';

const MIN_PASSWORD_LENGTH = Number(process.env.NEXT_PUBLIC_MIN_PASS_LEN);
type Provider = 'email' | Parameters<typeof signIn.social>[0]['provider'];

export default function SignIn() {
  const { isSignInOpen, openSignIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isPending, setIsPending] = useState<
    { email: boolean } & Partial<Record<Provider, boolean>>
  >({
    email: false,
  });
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().refine(
      (val) => {
        return val.length >= (isRegister ? MIN_PASSWORD_LENGTH : 1);
      },
      {
        message: isRegister
          ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
          : '',
      }
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const PasswordIcon = showPassword ? Eye : EyeOff;

  const handleToggleRegister = () => {
    setIsRegister(!isRegister);
    form.reset();
    form.setFocus('email');
  };

  const onSubmitCallback = useMemo<
    (provider: Provider) => Parameters<typeof signIn.email>[1]
  >(
    () => (provider) => ({
      onRequest: () => {
        setIsPending({ ...isPending, [provider]: true });
      },
      onResponse: () => {
        setIsPending({ ...isPending, [provider]: false });
      },
      onSuccess: () => {
        openSignIn(false);
        form.reset();
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || 'Something went wrong');
      },
    }),
    [isPending, openSignIn, form]
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isRegister) {
      signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.email,
          callbackURL: '/',
        },
        onSubmitCallback('email')
      );
    } else {
      signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        onSubmitCallback('email')
      );
    }
  };

  const handleSignInWithSocial = (provider: Exclude<Provider, 'email'>) => {
    setIsPending({ ...isPending, [provider]: true });
    signIn.social(
      {
        provider,
        callbackURL: '/',
      },
      onSubmitCallback(provider)
    );
  };

  return (
    <Dialog open={isSignInOpen} onOpenChange={openSignIn}>
      <DialogContent className="max-w-[400px]!">
        <DialogHeader>
          <DialogTitle>{isRegister ? 'Register' : 'Sign in'}</DialogTitle>
          <DialogDescription>
            {isRegister
              ? 'Create an account to continue.'
              : 'Sign in to your account to continue.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl
                    className={cn({
                      'border-red-500': form.formState.errors.email,
                    })}
                  >
                    <Input {...field} endIcon={<Mail />} autoFocus />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl
                    className={cn({
                      'border-red-500': form.formState.errors.password,
                    })}
                  >
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      endIcon={
                        <PasswordIcon
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer"
                        />
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              className="mt-2 mb-4 w-full cursor-pointer"
              type="submit"
              isLoading={isPending.email}
            >
              {isRegister ? 'Register' : 'Sign in'}
            </LoadingButton>

            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              {isRegister
                ? 'Already have an account?'
                : "Don't have an account?"}
              <span
                className="text-primary cursor-pointer"
                onClick={handleToggleRegister}
              >
                {isRegister ? 'Sign in' : 'Register'}
              </span>
            </div>
          </form>

          {!isRegister && (
            <>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-border h-px w-full"></div>
                <span className="text-muted-foreground text-sm">Or</span>
                <div className="bg-border h-px w-full"></div>
              </div>

              <LoadingButton
                className="w-full cursor-pointer bg-black hover:bg-blue-500"
                type="submit"
                disabled={isPending.email}
                isLoading={isPending.google}
                onClick={() => handleSignInWithSocial('google')}
              >
                Sign in with Google
              </LoadingButton>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}

