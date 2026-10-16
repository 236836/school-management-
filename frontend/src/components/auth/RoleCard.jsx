// frontend/src/components/auth/RoleCard.jsx
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const RoleCard = ({ role, onSelect, index = 0 }) => {
  const Icon = role.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{
        delay:    index * 0.1,
        duration: 0.5,
        ease:     'easeOut',
      }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(role)}
      className="group relative w-full overflow-hidden rounded-3xl
                 bg-white dark:bg-neutral-800
                 shadow-lg hover:shadow-2xl
                 transition-all duration-500 ease-out
                 border border-neutral-200 dark:border-neutral-700
                 cursor-pointer text-left"
    >
      {/* ── Image Section ───────────────────────────────── */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={role.image}
          alt={role.title}
          className="w-full h-full object-cover
                     transition-transform duration-700 ease-out
                     group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t
                        ${role.gradient} opacity-70
                        group-hover:opacity-80
                        transition-opacity duration-500`} />

        {/* Icon Badge */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 rounded-2xl
                          bg-white/25 backdrop-blur-md
                          border border-white/40
                          flex items-center justify-center
                          shadow-lg
                          group-hover:scale-110 group-hover:rotate-3
                          transition-transform duration-500">
            <Icon size={22} className="text-white drop-shadow-md" />
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="text-2xl font-bold text-white
                         drop-shadow-lg mb-1">
            {role.title}
          </h3>
        </div>
      </div>

      {/* ── Content Section ─────────────────────────────── */}
      <div className="p-5 sm:p-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400
                      leading-relaxed mb-4 min-h-[3rem]">
          {role.description}
        </p>

        {/* Arrow Action */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold"
                style={{ color: role.accent }}>
            Continue as {role.title}
          </span>

          <div className="w-9 h-9 rounded-full
                          flex items-center justify-center
                          transition-all duration-300 ease-out
                          group-hover:translate-x-1"
               style={{
                 backgroundColor: role.accent,
                 boxShadow: `0 4px 12px ${role.accent}40`,
               }}>
            <ChevronRight size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div
        className="absolute inset-0 pointer-events-none
                   opacity-0 group-hover:opacity-100
                   transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px at center bottom,
                       ${role.accent}15, transparent 70%)`,
        }}
      />
    </motion.button>
  );
};

export default RoleCard;