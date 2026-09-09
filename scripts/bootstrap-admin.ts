import prisma from '../lib/db';
import { hashPassword } from '../lib/auth/password';

export async function bootstrapAdmin(customPassword?: string) {
  const adminEmail = 'gackstoneb@gmail.com';
  const adminName = 'Gackstone Baraka';
  const adminPassword = customPassword || process.env.WEBHUNT_ADMIN_BOOTSTRAP_PASSWORD || '@Gackstone02';

  console.log('=======================================================');
  console.log(' WEBHUNT SECURE PERMANENT ADMINISTRATOR BOOTSTRAP ');
  console.log('=======================================================\n');

  console.log(`[AdminBootstrap] Checking existing account for: ${adminEmail}`);
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { profile: true },
  });

  const passwordHash = await hashPassword(adminPassword);

  let user;
  if (!existingUser) {
    console.log('[AdminBootstrap] No existing account found. Creating permanent administrator...');
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash,
        role: 'admin',
        status: 'active',
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
        verificationOtpHash: null,
        verificationOtpExpiry: null,
        verificationOtpAttempts: 0,
        failedLoginAttempts: 0,
        lockoutUntil: null,
        profile: {
          create: {
            fullName: adminName,
            professionalTitle: 'Lead Software Engineer & Platform Administrator',
            bio: 'Principal Software Engineer and Administrator of the WebHunt Lead Discovery Workspace.',
            skillsJson: JSON.stringify([
              'Next.js',
              'React',
              'TypeScript',
              'Node.js',
              'PostgreSQL',
              'Tailwind CSS',
              'Security & Cryptography',
            ]),
            currency: 'USD',
            timezone: 'Africa/Nairobi',
            city: 'Nairobi',
            country: 'Kenya',
            email: adminEmail,
          },
        },
      },
    });
    console.log(`✅ [AdminBootstrap] Administrator account created successfully (ID: ${user.id})`);
  } else {
    console.log('[AdminBootstrap] Existing account found. Safely reconciling administrator state...');
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: adminName,
        passwordHash,
        role: 'admin',
        status: 'active',
        emailVerified: existingUser.emailVerified || new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
        verificationOtpHash: null,
        verificationOtpExpiry: null,
        verificationOtpAttempts: 0,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    if (!existingUser.profile) {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          fullName: adminName,
          professionalTitle: 'Lead Software Engineer & Platform Administrator',
          skillsJson: JSON.stringify([
            'Next.js',
            'React',
            'TypeScript',
            'Node.js',
            'PostgreSQL',
            'Tailwind CSS',
          ]),
          currency: 'USD',
          timezone: 'Africa/Nairobi',
          city: 'Nairobi',
          country: 'Kenya',
          email: adminEmail,
        },
      });
    }

    console.log(`✅ [AdminBootstrap] Administrator account reconciled successfully (ID: ${user.id})`);
  }

  console.log('\n--- Administrator Verification ---');
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Status: ${user.status}`);
  console.log(`Email Verified: ${user.emailVerified ? 'YES (' + user.emailVerified.toISOString() + ')' : 'NO'}`);
  console.log('Password Hash Type: scrypt + 16-byte cryptographically secure salt');
  console.log('Plaintext Password in DB: NONE (never stored)');
  console.log('=======================================================\n');

  return user;
}

if (require.main === module) {
  bootstrapAdmin()
    .catch((err) => {
      console.error('[AdminBootstrap] Failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
