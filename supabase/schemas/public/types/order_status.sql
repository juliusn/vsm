CREATE TYPE "public"."order_status" AS ENUM (
  'submitted',
  'received',
  'completed',
  'canceled'
);
