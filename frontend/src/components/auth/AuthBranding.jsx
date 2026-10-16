// frontend/src/components/auth/AuthBranding.jsx
import { schoolInfo } from '../../config/roleConfig';

const AuthBranding = ({ compact = false, dark = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={schoolInfo.logo}
          alt={schoolInfo.name}
          className="w-10 h-10 object-contain drop-shadow-md"
        />
        <div>
          <h1 className={`font-bold text-base leading-tight
            ${dark ? 'text-white' : 'text-neutral-900'}`}>
            {schoolInfo.short}
          </h1>
          <p className={`text-xs
            ${dark ? 'text-white/60' : 'text-neutral-500'}`}>
            {schoolInfo.tagline}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={schoolInfo.logo}
        alt={schoolInfo.name}
        className="w-24 h-24 sm:w-28 sm:h-28 object-contain
                   drop-shadow-xl mb-4"
      />
      <h1 className={`text-2xl sm:text-3xl font-bold mb-1
        ${dark ? 'text-white' : 'text-neutral-900'}`}>
        {schoolInfo.name}
      </h1>
      <p className={`text-sm
        ${dark ? 'text-white/70' : 'text-neutral-500'}`}>
        {schoolInfo.tagline}
      </p>
    </div>
  );
};

export default AuthBranding;