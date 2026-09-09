/**
 * WebHunt - Production & Development Prisma Schema Preparer
 * Automatically synchronizes prisma/schema.prisma datasource provider with DATABASE_URL
 * Ensures PostgreSQL on Vercel/Neon and SQLite during zero-config local development.
 */

const fs = require('fs');
const path = require('path');

function preparePrismaSchema() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('[PrismaConfig] Error: prisma/schema.prisma not found at:', schemaPath);
    return;
  }

  const databaseUrl = (process.env.DATABASE_URL || '').trim();
  
  // Determine intended provider:
  // If DATABASE_URL starts with postgresql:// or postgres:// or on Vercel (when not using file:) -> postgresql
  // Otherwise -> sqlite
  const isPostgres = 
    databaseUrl.startsWith('postgresql://') || 
    databaseUrl.startsWith('postgres://') || 
    (process.env.VERCEL === '1' && !databaseUrl.startsWith('file:'));

  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';
  
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Replace provider in datasource block
  const datasourceRegex = /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"([^"]+)"[\s\S]*?\}/;
  const match = schemaContent.match(datasourceRegex);

  if (match && match[1] !== targetProvider) {
    console.log(`[PrismaConfig] Switching datasource provider from "${match[1]}" to "${targetProvider}"...`);
    const updatedDatasource = match[0].replace(
      /provider\s*=\s*"[^"]+"/,
      `provider = "${targetProvider}"`
    );
    schemaContent = schemaContent.replace(datasourceRegex, updatedDatasource);
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    console.log(`[PrismaConfig] ✅ Successfully updated prisma/schema.prisma to use "${targetProvider}".`);
  } else if (match) {
    console.log(`[PrismaConfig] ✅ prisma/schema.prisma is already configured for "${targetProvider}".`);
  } else {
    console.warn('[PrismaConfig] Warning: Could not locate datasource db block in schema.prisma.');
  }
}

if (require.main === module) {
  preparePrismaSchema();
}

module.exports = { preparePrismaSchema };
