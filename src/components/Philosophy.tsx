
import React from 'react';

export const Philosophy: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="philosophy" className="kamp-section bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden py-12 md:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="kamp-container relative z-10">
        <div className="text-center reveal-on-scroll">
          <div className="max-w-3xl mx-auto bg-white/15 backdrop-blur-sm p-6 md:p-12 rounded-xl hover-lift">
            <blockquote className="text-lg md:text-2xl italic font-light">
              "Сила не в том, чтобы никогда не падать, а в том, чтобы всегда подниматься."
            </blockquote>
            <div className="mt-4 font-semibold">— Команда КЭМП</div>
            <div className="mt-6 md:mt-8">
              <button
                onClick={() => scrollToSection('contact')}
                className="kamp-button-primary"
              >
                Записаться на курс
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
