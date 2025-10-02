# VSM - Vanaheim Service Management

This is a dedicated platform for managing Vanaheim services.

## Requirements

- Node.js 22
- A [Supabase](https://supabase.com) project
- An email service

## How to use

1. Configure these values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
1. Use `cd` to change into the app's directory.
1. Run `npm install` to install dependencies.
1. Run `npm run dev` to start the local development server.
