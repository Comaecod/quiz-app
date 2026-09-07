import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SCHEDULE from '../data/term1ExamSchedule.json';
import staffData from '../data/staffDirectory.json';

const OVERRIDES = {
  'Pratyusha': 'Prathusha',
  'Goutham': 'Gotham',
  'SankaraNarayana': 'Sankara Narayana',
  'Sriram': 'Sri Ram Kiran',
};

const MANUAL_ALIASES = {
  'Rama Rao': { alias: 'CRR', name: 'Challa Rama Rao' },
};

const gatherPersons = () => {
  const out = [];
  Object.values(staffData).forEach((v) => {
    if (Array.isArray(v)) v.forEach((p) => p && p.name && out.push(p));
    else if (v && typeof v === 'object' && v.name) out.push(v);
  });
  return out;
};

const ALL_PERSONS = gatherPersons();

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z]/g, '');

const findPerson = (name) => {
  const target = norm(OVERRIDES[name] || name);
  if (!target) return null;
  return ALL_PERSONS.find((p) => {
    const pn = norm(p.name);
    return pn === target || pn.includes(target) || target.includes(pn);
  }) || null;
};

const getMapping = (name) => {
  const manual = MANUAL_ALIASES[name];
  if (manual) return manual;
  const person = findPerson(name);
  if (person) return { alias: person.alias || person.name, name: person.name };
  return { alias: name, name };
};

const resolveTeacher = (name) => getMapping(name).alias;

const toEntries = (value) => {
  if (!value) return [];
  if (typeof value === 'string') return [{ branch: null, teacher: value }];
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? { branch: null, teacher: v } : { branch: v[0], teacher: v[1] }));
  }
  return [];
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseDate = (ddmmyy) => {
  const [dd, mm, yy] = ddmmyy.split('-').map(Number);
  const d = new Date(2000 + yy, mm - 1, dd);
  return { dd: String(dd).padStart(2, '0'), mm, yy, weekday: WEEKDAYS[d.getDay()] };
};

const SUBJECT_STYLE = {
  '2L': 'text-amber-600 dark:text-amber-400',
  '3L': 'text-amber-600 dark:text-amber-400',
  'Science': 'text-emerald-600 dark:text-emerald-400',
  'Sanskrit': 'text-indigo-600 dark:text-indigo-400',
  'Hindi': 'text-indigo-600 dark:text-indigo-400',
  'Telugu': 'text-indigo-600 dark:text-indigo-400',
  'English': 'text-sky-600 dark:text-sky-400',
  'Maths': 'text-rose-600 dark:text-rose-400',
  'EVS': 'text-teal-600 dark:text-teal-400',
  'Computers': 'text-violet-600 dark:text-violet-400',
  'Social Science': 'text-fuchsia-600 dark:text-fuchsia-400',
};

const Fade = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}>
    {children}
  </motion.div>
);

const Term1ExamSchedule = () => {
  const teacherKey = useMemo(() => {
    const key = {};
    Object.values(SCHEDULE.teachers).forEach((classMap) => {
      Object.values(classMap).forEach((value) => {
        toEntries(value).forEach(({ teacher }) => {
          const { alias, name } = getMapping(teacher);
          if (!key[alias]) key[alias] = name;
        });
      });
    });
    return Object.entries(key).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-primary/90" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">📝 {SCHEDULE.title}</h1>
            <p className="text-lg text-white/80">{SCHEDULE.period}</p>
          </motion.div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-8 space-y-8">
        <Fade>
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 p-6 sm:p-8">
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>📌 {SCHEDULE.title} runs on the dates shown above. The first day falls on a <span className="font-semibold text-gray-800 dark:text-gray-200">Saturday</span>, with subjects held on the weekdays listed.</p>
              <p>📌 <span className="font-semibold text-gray-800 dark:text-gray-200">2L / 3L</span> cover both <span className="font-semibold">Hindi</span> and <span className="font-semibold">Telugu</span> in our school — both teachers are listed for those cells.</p>
              <p>📌 <span className="font-semibold text-gray-800 dark:text-gray-200">Science</span> is split into Biology, Physics and Chemistry for Classes VIII–X — all three teachers are listed.</p>
              <p>📌 Teacher short names (aliases) are used for readability; see the key below the table.</p>
            </div>
          </div>
        </Fade>

        <Fade>
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">🗓️ Date Sheet</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">Scroll sideways on small screens</span>
            </div>
            <div className="overflow-x-auto">
              <table className="table-fixed mx-auto text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10">
                    <th className="sticky left-0 z-10 w-16 px-2 py-2 h-16 text-center font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap bg-white dark:bg-slate-800">Class</th>
                    {SCHEDULE.dates.map((date, i) => {
                      const { weekday, dd, mm } = parseDate(date);
                      return (
                        <th key={i} className="w-20 px-1 py-2 h-16 text-center font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          <span className="block text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{weekday}</span>
                          <span className="block text-sm">{dd} {MONTHS[mm - 1]}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE.rows.map((row, i) => (
                    <tr key={row.class} className={`border-t border-gray-100 dark:border-white/5 ${i % 2 === 1 ? 'bg-gray-50/40 dark:bg-white/[0.02]' : ''}`}>
                      <td className="sticky left-0 z-10 w-16 px-2 py-2 h-20 text-center font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap bg-white dark:bg-slate-800">
                        <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary dark:text-primary-light border border-primary/20 dark:border-primary/30">
                          {row.class}
                        </span>
                      </td>
                      {row.subjects.map((subject, j) => {
                        const entries = toEntries(SCHEDULE.teachers[row.class]?.[subject]);
                        const empty = subject === '-' || entries.length === 0;
                        return (
                          <td key={j} className="w-20 h-20 px-1 py-1 text-center align-middle border-l border-gray-100 dark:border-white/5 hover:bg-primary/[0.07] dark:hover:bg-primary/10 transition-colors">
                            {empty ? (
                              <span className="text-gray-300 dark:text-gray-600 text-lg">·</span>
                            ) : (
                              <div className="space-y-0.5">
                                <div className={`font-semibold text-xs truncate ${SUBJECT_STYLE[subject] || 'text-gray-900 dark:text-white'}`} title={subject}>{subject}</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                                  {entries.map((e, k) => (
                                    <span key={k} className="block">
                                      {e.branch ? <span className="text-gray-400 dark:text-gray-500">{e.branch} · </span> : null}
                                      <span className="font-medium text-gray-600 dark:text-gray-300">{resolveTeacher(e.teacher)}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Fade>

        <Fade delay={0.05}>
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">🧑‍🏫 Teacher Key</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {teacherKey.map(([alias, name]) => (
                <div key={alias} className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-4 py-2.5">
                  <span className="inline-flex items-center justify-center min-w-9 px-2 py-1 rounded-lg bg-primary/10 text-primary dark:text-primary-light text-xs font-bold">{alias}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate" title={name}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Term1ExamSchedule;