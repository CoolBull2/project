/*
  # Create network reports table

  1. New Tables
    - `network_reports`
      - `id` (uuid, primary key)
      - `title` (text)
      - `date` (timestamptz)
      - `status` (text)
      - `type` (text)
      - `details` (jsonb)
      - `summary` (text)

  2. Security
    - Enable RLS on `network_reports` table
    - Add policy for public access (since this is a demo app)
*/

CREATE TABLE IF NOT EXISTS network_reports (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL,
  type text NOT NULL,
  details jsonb NOT NULL,
  summary text NOT NULL
);

ALTER TABLE network_reports ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes
CREATE POLICY "Allow public access"
  ON network_reports
  FOR ALL
  TO public
  USING (true);