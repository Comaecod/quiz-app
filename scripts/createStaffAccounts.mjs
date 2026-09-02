import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SERVICE_ACCOUNT_PATH = resolve(__dirname, '..', 'serviceAccountKey.json');
const STAFF_DIRECTORY_PATH = resolve(__dirname, '..', 'src', 'data', 'staffDirectory.json');

const DEFAULT_PASSWORD = 'test@123';

const STAFF = [
  { name: 'Padma Gayathri', email: 'padma.gayathri@skksv.com', subtype: 'principal', staffId: 'principal-1' },
  { name: 'Aramangalamanthalakshmi', email: 'aramangalamanthalakshmi.a@skksv.com', subtype: 'reception', staffId: 'admin-1' },
  { name: 'Sanneboina Sandhya', email: 'sanneboina.sandhya@skksv.com', subtype: 'reception', staffId: 'admin-2' },
  { name: 'Chaganti Rugveda Sharma', email: 'chaganti.rugveda@skksv.com', subtype: 'reception', staffId: 'admin-3' },
  { name: 'Vishnubhatla Lakshmi Kameswari', email: 'vishnubhatla.lakshmi@skksv.com', subtype: 'teacher', staffId: 'staff-1' },
  { name: 'Hari Anjana Devi', email: 'hari.anjana@skksv.com', subtype: 'teacher', staffId: 'staff-2' },
  { name: 'Bandaru Gotham Yasodhar', email: 'bandaru.gotham@skksv.com', subtype: 'teacher', staffId: 'staff-3' },
  { name: 'Voduri Nagaraju', email: 'voduri.nagaraju@skksv.com', subtype: 'teacher', staffId: 'staff-5' },
  { name: 'Anand G', email: 'anand.g@skksv.com', subtype: 'teacher', staffId: 'staff-6' },
  { name: 'Challa Sujatha', email: 'challa.sujatha@skksv.com', subtype: 'teacher', staffId: 'staff-7' },
  { name: 'Geetha K', email: 'geetha.k@skksv.com', subtype: 'teacher', staffId: 'staff-8' },
  { name: 'Kuppa Gnanarajasri', email: 'kuppa.gnanarajasri@skksv.com', subtype: 'teacher', staffId: 'staff-9' },
  { name: 'Dhataram Laxmi Narsingh Rao', email: 'dhataram.laxmi@skksv.com', subtype: 'teacher', staffId: 'staff-10' },
  { name: 'Pidathala Sankara Narayana Sastry', email: 'pidathala.sankara@skksv.com', subtype: 'teacher', staffId: 'staff-11' },
  { name: 'Dhataram Prathusha', email: 'dhataram.prathusha@skksv.com', subtype: 'teacher', staffId: 'staff-12' },
  { name: 'Arjun Padhan', email: 'arjun.padhan@skksv.com', subtype: 'teacher', staffId: 'staff-13' },
  { name: 'Renjith M N', email: 'renjith.m@skksv.com', subtype: 'teacher', staffId: 'staff-14' },
  { name: 'Jonnavittula Venugopal', email: 'jonnavittula.venugopal@skksv.com', subtype: 'teacher', staffId: 'staff-15' },
  { name: 'Kasibhotla Sri Ram Kiran', email: 'kasibhotla.sri@skksv.com', subtype: 'teacher', staffId: 'staff-17' },
  { name: 'Mukku Trinath', email: 'mukku.trinath@skksv.com', subtype: 'teacher', staffId: 'staff-18' },
  { name: 'Bandaru Chandra Mohan Rao', email: 'bandaru.chandra@skksv.com', subtype: 'teacher', staffId: 'staff-19' },
  { name: 'Ranganayakulu Podili', email: 'ranganayakulu.podili@skksv.com', subtype: 'teacher', staffId: 'staff-20' },
  { name: 'T Sampath Kumar Reddy', email: 'sampath.kumar@skksv.com', subtype: 'teacher', staffId: 'staff-21' },
];

const SUBTYPE_DESIGNATION = { principal: 'Principal', reception: 'Receptionist', teacher: 'Teacher' };

function loadDirectory() {
  if (!existsSync(STAFF_DIRECTORY_PATH)) return new Map();
  try {
    const data = JSON.parse(readFileSync(STAFF_DIRECTORY_PATH, 'utf-8'));
    const map = new Map();
    const groups = ['principal', 'correspondent', 'siteSupervisor', 'executiveAssistant'];
    for (const key of groups) {
      if (data[key]) map.set(data[key].id, data[key]);
    }
    for (const person of [...(data.adminTeam || []), ...(data.staff || [])]) {
      if (person?.id) map.set(person.id, person);
    }
    return map;
  } catch {
    return new Map();
  }
}

function validateStaff() {
  const seen = new Map();
  const problems = [];
  for (const s of STAFF) {
    if (!s.name) problems.push(`${s.email || '?'}: name empty`);
    s.email = String(s.email ?? '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) problems.push(`${s.name}: invalid email '${s.email}'`);
    seen.set(s.email, s);
  }
  for (const s of STAFF) {
    if ([...seen.values()].filter(x => x.email === s.email).length > 1) {
      problems.push(`duplicate email in file: ${s.email}`);
    }
  }
  return problems;
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
  const directory = loadDirectory();

  console.log(`\n👩‍🏫 Bulk Staff Account Import — Project: ${serviceAccount.project_id}\n`);

  const problems = validateStaff();
  if (problems.length) {
    console.error('❌ Validation problems:');
    problems.forEach(p => console.error(`   - ${p}`));
    process.exit(1);
  }

  console.log(`  Staff to create: ${STAFF.length} (1 principal, ${STAFF.filter(s => s.subtype === 'reception').length} reception, ${STAFF.filter(s => s.subtype === 'teacher').length} teacher)`);

  for (const s of STAFF) {
    const dir = directory.get(s.staffId);
    if (!dir) console.warn(`  ⚠️ No staffDirectory entry found for ${s.staffId} (${s.name}) — using '${SUBTYPE_DESIGNATION[s.subtype]}'`);
  }

  const created = [];
  const failed = [];

  for (let i = 0; i < STAFF.length; i++) {
    const s = STAFF[i];
    const label = `[${i + 1}/${STAFF.length}] ${s.name} <${s.email}> (${s.staffId})`;
    try {
      const existing = await auth.getUserByEmail(s.email).catch(() => null);
      if (existing) {
        failed.push({ ...s, error: 'email already exists in Auth' });
        console.log(`  ⚠️ ${label} — already exists, skipped`);
        continue;
      }

      const dir = directory.get(s.staffId);
      const designation = dir?.designation || SUBTYPE_DESIGNATION[s.subtype];
      const salutation = dir?.salutation || '';

      const userRecord = await auth.createUser({
        email: s.email,
        password: DEFAULT_PASSWORD,
        displayName: s.name,
      });

      const now = FieldValue.serverTimestamp();
      await db.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        email: s.email,
        displayName: s.name,
        role: 'staff',
        roleSubtype: s.subtype,
        staffId: s.staffId,
        designation,
        salutation,
        phone: '',
        status: 'active',
        profileImage: '',
        customFields: {},
        createdBy: null,
        forcePasswordChange: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      });

      created.push({ ...s, designation });
      console.log(`  ✅ ${label}`);
    } catch (err) {
      failed.push({ ...s, error: err.message });
      console.error(`  ❌ ${label} — ${err.message}`);
    }
  }

  console.log(`\n📊 Summary: ${created.length} created, ${failed.length} failed.`);
  if (failed.length) {
    console.log('\n  Skipped/errors:');
    failed.forEach(f => console.log(`   - ${f.name} | ${f.email} | ${f.error}`));
  }

  if (created.length > 0) {
    const csvPath = resolve(__dirname, '..', 'exports', 'staff-credentials.csv');
    const escapeCsv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = ['Name,Designation,Email,Password'];
    for (const r of created) {
      lines.push([r.name, r.designation, r.email, DEFAULT_PASSWORD].map(escapeCsv).join(','));
    }
    writeFileSync(csvPath, '\ufeff' + lines.join('\n'), 'utf-8');
    console.log(`📄 Credentials written to: ${csvPath}`);
  }

  process.exit(0);
}

main();