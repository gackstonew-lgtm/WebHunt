/**
 * WebHunt - Production & Development Prisma Schema Preparer
 * Automatically synchronizes prisma/schema.prisma datasource provider with DATABASE_URL
 * Ensures PostgreSQL on Vercel/Neon and SQLite during zero-config local development.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getDatabaseUrl() {
  const envUrl = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL || 
    process.env.PRISMA_DATABASE_URL;

  if (envUrl) {
    return envUrl.trim();
  }
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^(?:DATABASE_URL|POSTGRES_PRISMA_URL|POSTGRES_URL|PRISMA_DATABASE_URL)=["']?([^"'\r\n]+)["']?/m);
    if (match) {
      process.env.DATABASE_URL = match[1].trim();
      return process.env.DATABASE_URL;
    }
  }
  return 'file:./dev.db';
}

function preparePrismaSchema() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('[PrismaConfig] Error: prisma/schema.prisma not found at:', schemaPath);
    return;
  }

  const databaseUrl = getDatabaseUrl();
  const isPlaceholder = databaseUrl.includes('ep-your-project-id') || databaseUrl.includes('username:password@');
  
  // Determine intended provider:
  // If valid non-placeholder PostgreSQL URL or in Vercel environment -> postgresql
  // Otherwise -> sqlite for zero-config local development
  const isPostgres = 
    ((databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) && !isPlaceholder) || 
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

async function deployMigrationsIfPostgres() {
  const databaseUrl = getDatabaseUrl();
  const isPlaceholderUrl = databaseUrl.includes('username:password@') || databaseUrl.includes('ep-your-project-id');
  const isPostgres = 
    ((databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) && !isPlaceholderUrl) || 
    (process.env.VERCEL === '1' && !databaseUrl.startsWith('file:'));

  if (isPostgres) {
    console.log('[PrismaConfig] PostgreSQL datasource detected. Deploying pending Prisma migrations...');
    try {
      const prismaCliPath = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js');
      execSync(`node "${prismaCliPath}" migrate deploy`, {
        stdio: 'inherit',
        env: process.env,
        cwd: path.join(__dirname, '..')
      });
      console.log('[PrismaConfig] ✅ Migrations deployed successfully.');

      // Automatically reconcile permanent administrator account
      try {
        console.log('[PrismaConfig] Provisioning / reconciling administrator account...');
        const jiti = require('jiti')(path.join(__dirname, '..'), { alias: { '@': path.join(__dirname, '..') } });
        const { bootstrapAdmin } = jiti('./scripts/bootstrap-admin.ts');
        await bootstrapAdmin();
      } catch (adminErr) {
        console.warn('[PrismaConfig] Administrator provisioning note:', adminErr.message);
      }
    } catch (err) {
      console.error('[PrismaConfig] ❌ Migration deployment failed:', err.message);
      if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
        throw err;
      }
    }
  } else if (isPlaceholderUrl) {
    console.log('[PrismaConfig] Placeholder PostgreSQL DATABASE_URL detected. Skipping migration deployment.');
  } else {
    console.log('[PrismaConfig] Local SQLite / non-PostgreSQL datasource detected.');
  }
}

if (require.main === module) {
  preparePrismaSchema();
  if (process.argv.includes('--deploy') || process.env.VERCEL === '1') {
    deployMigrationsIfPostgres().catch(console.error);
  }
}

module.exports = { preparePrismaSchema, deployMigrationsIfPostgres };
