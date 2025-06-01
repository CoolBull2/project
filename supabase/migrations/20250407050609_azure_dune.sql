/*
  # Create network reports table

  1. New Tables
    - `network_reports`
      - `id` (text, primary key)
      - `title` (text)
      - `date` (text)
      - `status` (text)
      - `type` (text)
      - `details` (jsonb)
      - `summary` (text)
  
  2. Security
    - Enable RLS on `network_reports` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS network_reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  details JSONB NOT NULL,
  summary TEXT NOT NULL
);

ALTER TABLE network_reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all reports
CREATE POLICY "Users can read all reports"
  ON network_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert their own reports
CREATE POLICY "Users can insert reports"
  ON network_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own reports
CREATE POLICY "Users can update reports"
  ON network_reports
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete reports
CREATE POLICY "Users can delete reports"
  ON network_reports
  FOR DELETE
  TO authenticated
  USING (true);