create type "public"."approval_status_enum" as enum ('pending', 'approved', 'rejected');

drop policy "Authenticated users can insert their own todos" on "public"."todos";

drop policy "Authenticated users can select todos" on "public"."todos";

revoke delete on table "public"."todos" from "anon";

revoke insert on table "public"."todos" from "anon";

revoke references on table "public"."todos" from "anon";

revoke select on table "public"."todos" from "anon";

revoke trigger on table "public"."todos" from "anon";

revoke truncate on table "public"."todos" from "anon";

revoke update on table "public"."todos" from "anon";

revoke delete on table "public"."todos" from "authenticated";

revoke insert on table "public"."todos" from "authenticated";

revoke references on table "public"."todos" from "authenticated";

revoke select on table "public"."todos" from "authenticated";

revoke trigger on table "public"."todos" from "authenticated";

revoke truncate on table "public"."todos" from "authenticated";

revoke update on table "public"."todos" from "authenticated";

revoke delete on table "public"."todos" from "service_role";

revoke insert on table "public"."todos" from "service_role";

revoke references on table "public"."todos" from "service_role";

revoke select on table "public"."todos" from "service_role";

revoke trigger on table "public"."todos" from "service_role";

revoke truncate on table "public"."todos" from "service_role";

revoke update on table "public"."todos" from "service_role";

alter table "public"."todos" drop constraint "todos_user_id_fkey";

alter table "public"."todos" drop constraint "todos_pkey";

drop index if exists "public"."todos_pkey";

drop table "public"."todos";

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "first_name" text not null,
    "approval_status" approval_status_enum not null default 'pending'::approval_status_enum,
    "approval_status_set_by" uuid,
    "last_name" text
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (first_name);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(first_name) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_user()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
	delete from auth.users where id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  raise log 'new = %', new;
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');

  RETURN new;
END;$function$
;

CREATE OR REPLACE FUNCTION public.install_available_extensions_and_test()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE extension_name TEXT;
allowed_extentions TEXT[] := string_to_array(current_setting('supautils.privileged_extensions'), ',');
BEGIN 
  FOREACH extension_name IN ARRAY allowed_extentions 
  LOOP
    SELECT trim(extension_name) INTO extension_name;
    /* skip below extensions check for now */
    CONTINUE WHEN extension_name = 'pgroonga' OR  extension_name = 'pgroonga_database' OR extension_name = 'pgsodium';
    CONTINUE WHEN extension_name = 'plpgsql' OR  extension_name = 'plpgsql_check' OR extension_name = 'pgtap';
    CONTINUE WHEN extension_name = 'supabase_vault' OR extension_name = 'wrappers';
    RAISE notice 'START TEST FOR: %', extension_name;
    EXECUTE format('DROP EXTENSION IF EXISTS %s CASCADE', quote_ident(extension_name));
    EXECUTE format('CREATE EXTENSION %s CASCADE', quote_ident(extension_name));
    RAISE notice 'END TEST FOR: %', extension_name;
  END LOOP;
    RAISE notice 'EXTENSION TESTS COMPLETED..';
    return true;
END;
$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));



