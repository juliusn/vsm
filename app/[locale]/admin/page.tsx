import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import RestrictedContentAlert from '@/app/components/RestrictedContentAlert';
import { CounterpartyProvider } from '@/app/context/CounterpartyContext';
import { DefaultCounterpartyProvider } from '@/app/context/DefaultCounterpartyContext';
import { ProfileProvider } from '@/app/context/ProfileContext';
import { normalizeRow, normalizeTranslations } from '@/lib/normalizers';
import { counterpartiesSelector, profileSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/server';
import { Counterparty } from '@/lib/types/query-types';
import UserTable from './UserTable';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const admin = data?.claims.app_metadata?.admin;

  if (!admin) return <RestrictedContentAlert />;

  const [
    profilesResponse,
    counterpartiesResponse,
    senderResponse,
    receiverResponse,
  ] = await Promise.all([
    supabase.from('profiles').select(profileSelector),
    supabase.from('counterparties').select(counterpartiesSelector),
    supabase
      .from('counterparties')
      .select(counterpartiesSelector)
      .eq('business_id', '2948855-6')
      .single(),
    supabase
      .from('counterparties')
      .select(counterpartiesSelector)
      .eq('business_id', '3190107-1')
      .single(),
  ]);

  if (
    profilesResponse.error ||
    counterpartiesResponse.error ||
    senderResponse.error ||
    receiverResponse.error
  )
    return <DataUnavailableAlert />;

  const sender = normalizeRow(senderResponse.data);
  const receiver = normalizeRow(receiverResponse.data);

  if (!sender || !receiver) return <DataUnavailableAlert />;

  const { data: profiles } = profilesResponse;
  const { data: counterparties } = counterpartiesResponse;

  return (
    <ProfileProvider initialProfiles={profiles}>
      <CounterpartyProvider
        counterparties={normalizeTranslations<Counterparty>(counterparties)}>
        <DefaultCounterpartyProvider sender={sender} receiver={receiver}>
          <UserTable />
        </DefaultCounterpartyProvider>
      </CounterpartyProvider>
    </ProfileProvider>
  );
}
