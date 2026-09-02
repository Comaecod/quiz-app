import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import staffData from '../data/staffDirectory.json';
import { Avatar, PersonCard, capitalize } from './StaffComponents';
import PersonModal from './PersonModal';

const SectionWithConnector = ({ title, icon, count, children }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <span className="text-sm">{icon}</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full text-primary">{count}</span>
      </div>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
    </div>
    <div className="flex flex-wrap gap-4 justify-center">
      {children}
    </div>
  </div>
);

const CardButton = memo(({ person, size = 'lg', onClick }) => (
  <motion.button
    className="glass-card p-4 flex flex-col items-center cursor-pointer w-56 h-36 hover:shadow-xl transition-shadow"
    whileHover={{ scale: 1.05 }}
    onClick={() => onClick(person)}
  >
    <Avatar person={person} size={size} />
    <h3 className="mt-3 font-bold text-gray-900 dark:text-white text-sm text-center line-clamp-2 break-words" style={{ maxWidth: '180px' }}>
      {person.salutation === 'Mr' ? 'Mr.' : 'Mrs.'} {capitalize(person.name)}
    </h3>
    <p className="text-xs text-primary/80">{person.designation}</p>
  </motion.button>
));

const StaffDirectoryScreen = () => {
  const { correspondent, principal, siteSupervisor, executiveAssistant, adminTeam, staff } = staffData;
  const [selectedPerson, setSelectedPerson] = useState(null);
  const navigate = useNavigate();

  const handlePersonClick = useCallback((person) => {
    setSelectedPerson(person);
  }, []);

  return (
    <motion.div
      className="w-full pb-12 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="py-6 px-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center mb-1">
          People of SKKSV
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">Our School Family</p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/people/executive')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary text-sm font-medium hover:from-primary/30 hover:to-secondary/30 transition-all"
          >
            👥 Executive Members
          </button>
        </div>
      </motion.div>

      <div className="px-4 space-y-8">
        <div className="flex justify-center">
          <CardButton person={correspondent} size="lg" onClick={handlePersonClick} />
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-primary/30" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
        </div>

        <div className="flex justify-center gap-8 flex-wrap">
          <CardButton person={principal} size="lg" onClick={handlePersonClick} />

          {siteSupervisor && (
            <CardButton person={siteSupervisor} size="lg" onClick={handlePersonClick} />
          )}
          {executiveAssistant && (
            <CardButton person={executiveAssistant} size="lg" onClick={handlePersonClick} />
          )}
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-primary/30" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-primary/30" />
        </div>

        <div className="flex justify-center">
          <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <SectionWithConnector title="Teaching Staff" icon="👨‍🏫" count={staff.length}>
          {staff.map((person) => (
            <PersonCard key={person.id} person={person} onClick={handlePersonClick} />
          ))}
        </SectionWithConnector>

        <div className="flex justify-center">
          <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <SectionWithConnector title="Admin Team" icon="👔" count={adminTeam.length}>
          {adminTeam.map((person) => (
            <PersonCard key={person.id} person={person} onClick={handlePersonClick} />
          ))}
        </SectionWithConnector>
      </div>

      <AnimatePresence>
        {selectedPerson && (
          <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StaffDirectoryScreen;