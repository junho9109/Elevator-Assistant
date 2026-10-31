import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const before = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='inspection_item_revisions'`);
  console.log('columns before:', before.rows.map(r => r.column_name));

  await pool.query(`
    ALTER TABLE inspection_item_revisions
    ADD COLUMN IF NOT EXISTS equipment_type VARCHAR(20) NOT NULL DEFAULT '엘리베이터'
  `);
  console.log('ALTER TABLE done');

  const after = await pool.query(`SELECT column_name, column_default FROM information_schema.columns WHERE table_name='inspection_item_revisions'`);
  console.log('columns after:', after.rows);

  const countCheck = await pool.query(`SELECT equipment_type, COUNT(*) FROM inspection_item_revisions GROUP BY equipment_type`);
  console.log('row counts by equipment_type:', countCheck.rows);

  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
