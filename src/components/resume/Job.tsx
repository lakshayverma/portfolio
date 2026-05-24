import type { PortfolioEntry, InterestEntry } from '@/app/types';
import FocusItems from './FocusItems';
import Stats from './Stats';

interface JobProps {
  id?: string;
  title?: string;
  items?: Array<PortfolioEntry | InterestEntry>;
  description?: string;
  statsTitle?: string | null;
}

const Job = ({
  id = 'jobs',
  title = 'Jobs',
  items = [],
  description = '',
  statsTitle = null
}: JobProps) => (
  <section id={id} className="jobs-container">
    <div className="row portfolio">
      <div className="three columns header-col">
        <h1>
          <span>{title}</span>
        </h1>
      </div>

      <div className="nine columns main-col">
        <div className="nine columns main-col">
          <p className="text-title">{description}</p>
          {items.map(item => (
            <div className="row item" key={item.id}>
              <div className="twelve columns">
                <h3>{item.name}</h3>
                <p className="info">{item.description}</p>
                {'stats' in item && <Stats id={item.id} stats={item.stats} focusText={statsTitle} />}
                {'achievements' in item && item.achievements && (
                  <FocusItems items={item.achievements} focusText="Responsibilities" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Job;
