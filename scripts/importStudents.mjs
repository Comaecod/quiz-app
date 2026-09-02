import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import XLSX from 'xlsx';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SERVICE_ACCOUNT_PATH = resolve(__dirname, '..', 'serviceAccountKey.json');
const EXCEL_PATHS = [
  resolve(__dirname, '..', 'exports', 'students.xlsx'),
  process.argv[2] ? resolve(process.cwd(), process.argv[2]) : null,
].filter(Boolean);

const DEFAULT_PASSWORD = 'test@123';
const RESIDENCE_MAP = {
  D: '1',
  H: '2',
};

const normalizeClass = (value) => String(value ?? '').trim().replace(/[^0-9]/g, '');

function validateRow(row) {
  const problems = [];
  if (!row.name) problems.push('name is empty');
  if (!row.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) problems.push('email is missing/invalid');
  if (!row.classNum) problems.push('class is empty');
  if (!['1', '2'].includes(row.dayScholarOrHostel)) problems.push(`residence '${row.residence}' is not D or H`);
  return problems;
}

async function main() {
  const excelPath = EXCEL_PATHS.find(p => existsSync(p));
  if (!excelPath) {
    console.error('❌ students.xlsx not found. Place it at exports/students.xlsx or pass a path argument.');
    process.exit(1);
  }

  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('❌ serviceAccountKey.json not found. Get it from Firebase Console → Project Settings → Service Accounts.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();
  const auth = getAuth();

  console.log(`\n🧑‍🎓 Bulk Student Import — Project: ${serviceAccount.project_id}\n`);
  console.log(`📄 Excel: ${excelPath}`);

  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const header = Object.keys(rows[0] || {});
  const pick = (...aliases) => header.find(h => aliases.some(a => String(h).trim().toLowerCase() === a.toLowerCase()));

  const nameKey = pick('name', 'student name', 'studentname');
  const residenceKey = pick('residence', 'day scholar or hostel', 'hostel');
  const classKey = pick('class');
  const sectionKey = pick('section');
  const emailKey = pick('email', 'email id', 'emailid', 'email address');

  if (!nameKey || !residenceKey || !emailKey || !classKey) {
    console.error(`❌ Could not find required columns in the sheet. Detected headers: ${JSON.stringify(header)}`);
    process.exit(1);
  }

  console.log(`  Columns → name: '${nameKey}', residence: '${residenceKey}', class: '${classKey}', section: '${sectionKey || '—'}', email: '${emailKey}'`);

  const records = [];
  const seenEmails = new Map();
  for (const raw of rows) {
    const email = String(raw[emailKey] ?? '').trim().toLowerCase();
    const name = String(raw[nameKey] ?? '').trim();
    const residence = String(raw[residenceKey] ?? '').trim().toUpperCase();
    const dayScholarOrHostel = RESIDENCE_MAP[residence] || '';
    const section = String(raw[sectionKey] ?? '').trim();
    const record = {
      name,
      residentRaw: residence,
      dayScholarOrHostel,
      classNum: normalizeClass(raw[classKey]),
      section,
      email,
    };
    record.issues = validateRow(record);
    if (record.issues.length === 0) {
      if (seenEmails.has(email)) seenEmails.set(email, seenEmails.get(email) + 1);
      else seenEmails.set(email, 1);
    }
    records.push(record);
  }

  const skipped = records.filter(r => r.issues.length > 0);
  const duplicateEmails = records
    .filter(r => r.issues.length === 0 && seenEmails.get(r.email) > 1)
    .map(r => r.email);
  const toCreate = records.filter(r => r.issues.length === 0 && seenEmails.get(r.email) === 1);

  console.log(`  Total rows: ${records.length}`);
  console.log(`  To create: ${toCreate.length}`);
  console.log(`  Skipped (validation): ${skipped.length}`);
  console.log(`  Skipped (duplicate email in file): ${duplicateEmails.length}`);
  if (skipped.length) {
    console.log('\n  ⚠️ Skipped rows:');
    skipped.slice(0, 20).forEach(r => console.log(`   - ${r.name || '(no name)'} | ${r.email || '(no email)'} | ${r.issues.join(', ')}`));
    if (skipped.length > 20) console.log(`   ... and ${skipped.length - 20} more`);
  }
  if (duplicateEmails.length) {
    console.log('\n  ⚠️ Duplicate emails:');
    [...new Set(duplicateEmails)].slice(0, 20).forEach(e => console.log(`   - ${e}`));
  }

  if (toCreate.length === 0) {
    console.log('\n✅ Nothing to import.');
    process.exit(0);
  }

  const created = [];
  const failed = [];

  for (let i = 0; i < toCreate.length; i++) {
    const r = toCreate[i];
    const label = `[${i + 1}/${toCreate.length}] ${r.name} <${r.email}>`;
    try {
      const existing = await auth.getUserByEmail(r.email).catch(() => null);
      if (existing) {
        failed.push({ ...r, error: 'email already exists in Auth' });
        console.log(`  ❌ ${label} — already exists`);
        continue;
      }
      const userRecord = await auth.createUser({
        email: r.email,
        password: DEFAULT_PASSWORD,
        displayName: r.name,
      });
      const now = FieldValue.serverTimestamp();
      await db.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        email: r.email,
        displayName: r.name,
        role: 'student',
        roleSubtype: null,
        phone: '',
        studentClass: r.classNum,
        section: r.section,
        dayScholarOrHostel: r.dayScholarOrHostel,
        status: 'active',
        profileImage: '',
        customFields: {},
        createdBy: null,
        forcePasswordChange: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      });
      created.push(r);
      console.log(`  ✅ ${label}`);
    } catch (err) {
      failed.push({ ...r, error: err.message });
      console.error(`  ❌ ${label} — ${err.message}`);
    }
  }

  console.log(`\n📊 Summary: ${created.length} created, ${failed.length} failed, ${skipped.length} skipped (validation), ${duplicateEmails.length} skipped (duplicates).`);

  if (created.length > 0) {
    const csvPath = resolve(__dirname, '..', 'exports', 'student-credentials.csv');
    const escapeCsv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = ['Name,Class,Section,Residence,Email,Password'];
    const residenceLabel = { 1: 'Day Scholar', 2: 'Veda Hostel' };
    for (const r of created) {
      lines.push([r.name, r.classNum, r.section, residenceLabel[r.dayScholarOrHostel] || '', r.email, DEFAULT_PASSWORD].map(escapeCsv).join(','));
    }
    writeFileSync(csvPath, '\ufeff' + lines.join('\n'), 'utf-8');
    console.log(`📄 Credentials written to: ${csvPath}`);
  }

  process.exit(0);
}

main();