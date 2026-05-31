import { Link } from 'react-router-dom';
import { utilityLinks } from '@/content/nav';

export default function NavUtilityBar({ light = false }) {
  return (
    <div
      className={`hidden lg:block border-b ${
        light ? 'bg-cream border-navy/10' : 'bg-[hsl(220_52%_8%)] border-white/10'
      }`}
    >
      <div className="max-w-[92rem] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between min-h-[2.25rem] text-[11px]">
          <p className={`font-inter tracking-wide ${light ? 'text-navy/55' : 'text-white/45'}`}>
            Pinkney Park · Rowayton, CT
          </p>
          <ul className="flex items-center gap-5">
            {utilityLinks.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`font-inter font-medium transition-colors ${
                    light ? 'text-navy/70 hover:text-navy' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
