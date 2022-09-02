const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rcsxumrsycbzrvbpapnq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3h1bXJzeWNienJ2YnBhcG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwODc2ODEsImV4cCI6MTk3NzY2MzY4MX0.CqmssummcG6RYmwuI8hcmqhkPGGi6XefUUOGslcsilU";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
