import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://mbrvfxbcowpijwhubuwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icnZmeGJjb3dwaWp3aHVidXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjcyMzYsImV4cCI6MjA3MjY0MzIzNn0.AfhyvlPrZgP3RexEfHL0Z1Tw4LaXd19ZLwSmMjHRIHw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportTales() {
  // Get first 6 tales
  const { data, error } = await supabase
    .from('tales')
    .select('*')
    .limit(6);

  if (error) {
    console.error(error);
    return;
  }

  // Save to a JSON file
  fs.writeFileSync('offlineTales.json', JSON.stringify(data, null, 2));
  console.log('Offline tales exported successfully!');
}

exportTales();
