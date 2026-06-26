import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Field } from '@/components/ui/Field';
import { paths } from '@/router/paths';
import { ApiError } from '@/types';
import { useLogin } from '../hooks/useAuth';
import {
  loginSchema,
  type AuthUser,
  type LoginInput,
} from '../types/auth.types';

/** Where a user lands after signing in, when no specific destination is set. */
function defaultRouteFor(user: AuthUser): string {
  return user.role === 'student' ? paths.studentFindTutor : paths.home;
}

/**
 * Email/password sign-in form. Validates with Zod, maps the API's 422 field
 * errors back onto inputs and surfaces a 401 as a form-level message, then
 * redirects to the originally requested page (or a role-appropriate home).
 */
export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Validation messages are stored as i18n keys (see loginSchema).
  const fieldError = (message?: string) => (message ? t(message) : undefined);

  async function onSubmit(values: LoginInput) {
    try {
      const { user } = await loginMutation.mutateAsync(values);
      const from = (location.state as { from?: Location } | null)?.from
        ?.pathname;
      navigate(from ?? defaultRouteFor(user), { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.fieldErrors) {
          for (const [field, messages] of Object.entries(error.fieldErrors)) {
            setError(field as keyof LoginInput, { message: messages[0] });
          }
          return;
        }
        setError('root', {
          message:
            error.status === 401
              ? t('auth.errors.invalidCredentials')
              : error.message,
        });
        return;
      }
      setError('root', { message: t('auth.errors.generic') });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {errors.root && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <Field
        label={t('auth.login.emailLabel')}
        htmlFor="email"
        error={fieldError(errors.email?.message)}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('auth.login.emailPlaceholder')}
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </Field>

      <Field
        label={t('auth.login.passwordLabel')}
        htmlFor="password"
        error={fieldError(errors.password?.message)}
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder={t('auth.login.passwordPlaceholder')}
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-1 w-full gap-2"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>
    </form>
  );
}
