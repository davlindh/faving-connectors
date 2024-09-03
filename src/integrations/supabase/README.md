# Supabase Database Schema

This document outlines the expected tables in our Supabase database based on the implemented hooks.

## Users
- user_id (uuid, primary key)
- first_name (text)
- last_name (text)
- email (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Profiles
- user_id (uuid, primary key, foreign key to users.user_id)
- first_name (text)
- last_name (text)
- avatar_url (text)
- location (text)
- bio (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Projects
- project_id (uuid, primary key)
- creator_id (uuid, foreign key to users.user_id)
- project_name (text)
- description (text)
- category (text)
- budget (numeric)
- start_date (timestamp with time zone)
- end_date (timestamp with time zone)
- location (text)
- required_skills (text[])
- status (text)

## Skills
- skill_id (uuid, primary key)
- user_id (uuid, foreign key to users.user_id)
- skill_name (text)

## Services
- service_id (uuid, primary key)
- user_id (uuid, foreign key to users.user_id)
- service_name (text)
- description (text)
- category (text)
- price (numeric)

## Knowledge Base
- article_id (uuid, primary key)
- author_id (uuid, foreign key to users.user_id)
- title (text)
- content (text)
- category (text)
- published_at (timestamp with time zone)
- updated_at (timestamp with time zone)
- created_at (timestamp with time zone)

## Booking Requests
- booking_request_id (uuid, primary key)
- service_id (uuid, foreign key to services.service_id)
- user_id (uuid, foreign key to users.user_id)
- provider_id (uuid, foreign key to users.user_id)
- requested_date (timestamp with time zone)
- message (text)
- status (text)
- created_at (timestamp with time zone)

## Messages
- message_id (uuid, primary key)
- sender_id (uuid, foreign key to users.user_id)
- recipient_id (uuid, foreign key to users.user_id)
- content (text)
- sent_at (timestamp with time zone)

## Project Interests
- interest_id (uuid, primary key)
- project_id (uuid, foreign key to projects.project_id)
- user_id (uuid, foreign key to users.user_id)
- expressed_at (timestamp with time zone)

## Team Member Requests
- id (uuid, primary key)
- project_id (uuid, foreign key to projects.project_id)
- user_id (uuid, foreign key to users.user_id)
- status (text)
- created_at (timestamp with time zone)

Note: This schema is inferred from the implemented hooks and may not reflect the exact structure in the Supabase database. Always refer to the actual Supabase dashboard for the most up-to-date and accurate schema information.