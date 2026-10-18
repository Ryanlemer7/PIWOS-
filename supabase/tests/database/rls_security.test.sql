-- Run with: supabase test db
-- These checks validate that critical grants, constraints, and triggers are present.
-- They do not replace authenticated multi-tenant behavioral tests.
do $$
begin
  if has_table_privilege('authenticated', 'public.messages', 'UPDATE') then
    raise exception 'authenticated must not have table-level UPDATE on messages';
  end if;
  if not has_column_privilege('authenticated', 'public.messages', 'read_at', 'UPDATE') then
    raise exception 'authenticated must be able to update message read_at';
  end if;
  if has_column_privilege('authenticated', 'public.messages', 'body', 'UPDATE')
     or has_column_privilege('authenticated', 'public.messages', 'sender_id', 'UPDATE') then
    raise exception 'authenticated must not update message body or sender_id';
  end if;

  if has_table_privilege('authenticated', 'public.notifications', 'UPDATE') then
    raise exception 'authenticated must not have table-level UPDATE on notifications';
  end if;
  if not has_column_privilege('authenticated', 'public.notifications', 'read_at', 'UPDATE') then
    raise exception 'authenticated must be able to update notification read_at';
  end if;
  if has_column_privilege('authenticated', 'public.notifications', 'title', 'UPDATE')
     or has_column_privilege('authenticated', 'public.notifications', 'user_id', 'UPDATE') then
    raise exception 'authenticated must not update notification content or owner';
  end if;

  if has_table_privilege('authenticated', 'public.audit_events', 'INSERT') then
    raise exception 'authenticated must not insert audit events directly';
  end if;
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'audit_events' and cmd = 'INSERT'
  ) then
    raise exception 'audit_events must not expose an INSERT RLS policy';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.order_items'::regclass
      and conname = 'order_items_company_order_fk'
  ) then
    raise exception 'order_items must enforce company/order composite foreign key';
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.order_items'::regclass
      and conname = 'order_items_company_product_fk'
  ) then
    raise exception 'order_items must enforce company/product composite foreign key';
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.company_members'::regclass
      and tgname = 'guard_company_membership_before_write'
      and not tgisinternal
  ) then
    raise exception 'company membership role guard trigger is missing';
  end if;
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.orders'::regclass
      and tgname = 'audit_orders'
      and not tgisinternal
  ) then
    raise exception 'order audit trigger is missing';
  end if;
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.showcase_posts'::regclass
      and tgname = 'guard_posts_actor'
      and not tgisinternal
  ) then
    raise exception 'post author identity guard trigger is missing';
  end if;
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'profiles read signed-in profiles'
  ) then
    raise exception 'legacy unrestricted profile policy must not exist';
  end if;
end;
$$;
