drop trigger if exists "orders_set_order_number" on "public"."orders";

drop policy "Service role can insert order items" on "public"."order_items";

drop policy "Service role can insert orders" on "public"."orders";

drop policy "Service role can update orders" on "public"."orders";

drop policy "Admins can update order items" on "public"."order_items";

drop policy "Users can view their own order items" on "public"."order_items";

drop policy "Users can view their own orders" on "public"."orders";

alter table "public"."orders" drop constraint "orders_display_order_number_key";

drop function if exists "public"."generate_order_number"();

drop function if exists "public"."set_order_number"();

drop index if exists "public"."orders_display_order_number_key";

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "phone" text,
    "default_shipping_address_line1" text,
    "default_shipping_address_line2" text,
    "default_shipping_city" text,
    "default_shipping_postal_code" text,
    "default_shipping_country" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."profiles" enable row level security;

alter table "public"."orders" drop column "display_order_number";

alter table "public"."products" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."products" alter column "updated_at" set default timezone('utc'::text, now());

drop sequence if exists "public"."order_number_seq";

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

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

create policy "Admins can update orders"
on "public"."orders"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text)))));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Admins can update order items"
on "public"."order_items"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text)))));


create policy "Users can view their own order items"
on "public"."order_items"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND ((orders.user_id = auth.uid()) OR (EXISTS ( SELECT 1
           FROM user_roles
          WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text)))))))));


create policy "Users can view their own orders"
on "public"."orders"
as permissive
for select
to public
using (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))))));



