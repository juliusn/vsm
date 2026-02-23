import { createClient } from '@/lib/supabase/server';
import UserTable from './UserTable';
import { ProfileProvider } from '@/app/context/ProfileContext';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*');

  return (
    data && (
      <ProfileProvider initialProfiles={data}>
        <UserTable />
      </ProfileProvider>
    )
  );
}
