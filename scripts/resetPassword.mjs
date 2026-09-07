import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SERVICE_ACCOUNT_PATH = resolve(__dirname, '..', 'serviceAccountKey.json');
const DEFAULT_PASSWORD = 'test@123';

const args = process.argv.slice(2);

function usage() {
  console.log(`
🔑 Reset a user's Firebase Auth login password.

Usage:
  node scripts/resetPassword.mjs <email> [newPassword] [flags]
  node scripts/resetPassword.mjs --list

Arguments:
  email         Target user's email (e.g. staff-1@skksv.com)
  newPassword   New password (default: ${DEFAULT_PASSWORD})

Flags:
  --list        List all users (emails) to pick the target
  --force       Set forcePasswordChange=true so the user must change it on next login (default)
  --no-force    Leave forcePasswordChange as-is

Examples:
  node scripts/resetPassword.mjs staff-1@skksv.com
  node scripts/resetPassword.mjs staff-1@skksv.com newpass456
  node scripts/resetPassword.mjs staff-1@skksv.com newpass456 --no-force
  node scripts/resetPassword.mjs --list
`);
}

async function main() {
  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('❌ serviceAccountKey.json not found. Get it from Firebase Console → Project Settings → Service Accounts.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();
  const auth = getAuth();

  console.log(`\n🔑 Password Reset — Project: ${serviceAccount.project_id}\n`);

  if (args.includes('--list')) {
    const snap = await db.collection('users').orderBy('role').get();
    console.log('  Role     | Name                             | Email');
    console.log('  ---------+----------------------------------+------------------------------------------');
    for (const d of snap.docs) {
      const u = d.data();
      const role = String(u.role || '').padEnd(8);
      const name = String(u.displayName || '').padEnd(32);
      const email = String(u.email || '').padEnd(40);
      console.log(`  ${role} | ${name} | ${email}`);
    }
    console.log(`\n  Total users: ${snap.size}`);
    process.exit(0);
  }

  const email = args.find(a => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a));
  if (!email) {
    usage();
    process.exit(1);
  }

  const explicitPassword = args.find(a => !a.startsWith('--') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a));
  const newPassword = explicitPassword || DEFAULT_PASSWORD;
  const forceChange = args.includes('--no-force') ? false : args.includes('--force') ? true : true;

  try {
    const user = await auth.getUserByEmail(email);

    await auth.updateUser(user.uid, { password: newPassword });

    const updates = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (forceChange) updates.forcePasswordChange = true;
    await db.collection('users').doc(user.uid).update(updates);

    console.log(`  ✅ ${user.displayName || user.email} <${email}>`);
    console.log(`     Auth password set to:  ${newPassword}`);
    console.log(`     Force change on login:  ${forceChange ? 'YES' : 'no'}`);
  } catch (err) {
    console.error(`  ❌ ${err.message}`);
    process.exit(1);
  }

  process.exit(0);
}

main();