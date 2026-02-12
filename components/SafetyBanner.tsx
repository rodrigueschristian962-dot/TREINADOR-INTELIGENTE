
import React from 'react';

const SafetyBanner: React.FC = () => {
  return (
    <div className="bg-orange-600 text-white py-2 px-4 text-center text-sm font-semibold sticky top-0 z-50 shadow-md">
      ⚠️ Lembre-se: Técnica vem antes de carga. Se sentir dor aguda, pare imediatamente.
    </div>
  );
};

export default SafetyBanner;
