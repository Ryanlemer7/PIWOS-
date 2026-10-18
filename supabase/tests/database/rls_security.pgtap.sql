begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

select ok(
  not has_table_privilege('authenticated', 'public.messages', 'UPDATE'),
  'authenticated has no table-level UPDATE grant on messages'
);
select ok(
  has_column_privilege('authenticated', 'public.messages', 'read_at', 'UPDATE'),
  'authenticated can update message read_at'
);
select ok(
  not has_column_privilege('authenticated', 'public.messages', 'body', 'UPDATE')
  and not has_column_privilege('authenticated', 'public.messages', 'sender_id', 'UPDATE'),
  'message body and sender identity are not client-updatable'
);
select ok(
  not has_table_privilege('authenticated', 'public.notifications', 'UPDATE'),
  'authenticated has no table-level UPDATE grant on notifications'
);
select ok(
  has_column_privilege('authenticated', 'public.notifications', 'read_at', 'UPDATE')
  and not has_column_privilege('authenticated', 'public.notifications', 'title', 'UPDATE')
  and not has_column_privilege('authenticated', 'public.notifications', 'user_id', 'UPDATE'),
  'only notification read_at is client-updatable'
);
select ok(
  not has_table_privilege('authenticated', 'public.audit_events', 'INSERT'),
  'authenticated cannot insert audit events directly'
);
select ok(
  not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'audit_events' and cmd = 'INSERT'
  ),
  'audit events have no client INSERT policy'
);
select ok(
  exists (select 1 from pg_constraint where conrelid = 'public.order_items'::regclass and conname = 'order_items_company_order_fk'),
  'order items reference orders with a composite company key'
);
select ok(
  exists (select 1 from pg_constraint where conrelid = 'public.order_items'::regclass and conname = 'order_items_company_product_fk'),
  'order items reference products with a composite company key'
);
select ok(
  exists (select 1 from pg_trigger where tgrelid = 'public.company_members'::regclass and tgname = 'guard_company_membership_before_write' and not tgisinternal),
  'membership writes run through the role and last-owner guard'
);
select ok(
  exists (select 1 from pg_trigger where tgrelid = 'public.orders'::regclass and tgname = 'audit_orders' and not tgisinternal),
  'order changes generate database-owned audit events'
);
select ok(
  exists (select 1 from pg_trigger where tgrelid = 'public.showcase_posts'::regclass and tgname = 'guard_posts_actor' and not tgisinternal),
  'post inserts validate the authenticated author'
);
select ok(
  exists (select 1 from pg_trigger where tgrelid = 'public.orders'::regclass and tgname = 'immutable_order_fields' and not tgisinternal),
  'order tenant and creator attribution cannot be reassigned'
);
select ok(
  not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles read signed-in profiles'
  ),
  'unrestricted profile-read policy is absent'
);

select * from finish();
rollback;
