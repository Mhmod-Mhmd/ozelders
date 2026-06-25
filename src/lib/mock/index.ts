import { httpClient } from '@/lib/axios';
import { mockAdapter } from './adapter';

/**
 * Point the shared Axios client at the in-browser mock backend. Call once at
 * startup, before the app renders. Delete this call (and the `src/lib/mock`
 * folder) to talk to a real API instead — no other code changes needed.
 */
export function installMockApi(): void {
  httpClient.defaults.adapter = mockAdapter;
}
