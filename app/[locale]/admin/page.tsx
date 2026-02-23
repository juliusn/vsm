import { ProfileProvider } from '@/app/context/ProfileContext';
import { createClient } from '@/lib/supabase/server';
import UserTable from './UserTable';

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
