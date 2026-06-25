import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { type Account, type SocialProvider } from '../types/account.types';
import { useToggleSocial } from '../hooks/useAccount';

/** Inline Facebook "f" mark (lucide has no brand glyphs). */
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    </svg>
  );
}

/** Inline Google "G" mark (lucide has no brand glyph for it). */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

interface SocialRowProps {
  provider: SocialProvider;
  icon: React.ReactNode;
  connection: Account['socials'][SocialProvider];
}

function SocialRow({ provider, icon, connection }: SocialRowProps) {
  const { t } = useTranslation();
  const toggle = useToggleSocial();
  const pending = toggle.isPending;
  const { connected, displayName } = connection;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="shrink-0">{icon}</span>
      <p className="text-sm text-gray-700">
        {connected
          ? t('settings.account.social.connectedAs', {
              name: displayName ?? '',
            })
          : t(`settings.account.social.notConnected.${provider}`)}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => toggle.mutate({ provider, connected })}
        className="ms-auto gap-2"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {connected
          ? t('settings.account.social.disconnect')
          : t('settings.account.social.connect')}
      </Button>
    </div>
  );
}

interface SocialNetworksProps {
  socials: Account['socials'];
}

/** Facebook / Google connection rows. */
export function SocialNetworks({ socials }: SocialNetworksProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-700">
        {t('settings.account.social.title')}
      </h3>
      <SocialRow
        provider="facebook"
        icon={<FacebookIcon />}
        connection={socials.facebook}
      />
      <SocialRow
        provider="google"
        icon={<GoogleIcon />}
        connection={socials.google}
      />
    </div>
  );
}
