import type { ResumeData } from '@/app/types';
import Dates from './Dates';
import FocusItems from './FocusItems';

interface ResumeProps {
  resumeData: ResumeData;
}

const Resume = ({ resumeData }: ResumeProps) => (
  <section id="resume">
    <div className="row education">
      <div className="three columns header-col">
        <h1>
          <span>Education</span>
        </h1>
      </div>

      <div className="nine columns main-col">
        {resumeData.education?.map(item => (
          <div className="row item" key={item.id}>
            <div className="twelve columns">
              <h3>{item.universityName}</h3>
              <p className="info">
                {item.specialization}
                <span>&bull;</span> <Dates dates={item.dates} />
              </p>
              <FocusItems items={item.achievements} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="row work">
      <div className="three columns header-col">
        <h1>
          <span>Work</span>
        </h1>
      </div>

      <div className="nine columns main-col">
        {resumeData.work?.map(item => (
          <div className="row item" key={item.id}>
            <div className="twelve columns">
              <h3>{item.companyName}</h3>
              <p className="info">
                {item.specialization}
                <span>&bull;</span>
                <Dates dates={item.dates} />
              </p>
              <FocusItems items={item.achievements} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="row skill">
      <div className="three columns header-col">
        <h1>
          <span>Skills</span>
        </h1>
      </div>

      <div className="nine columns main-col">
        <p>{resumeData.skillsDescription}</p>

        <div className="bars">
          <ul className="skills">
            {resumeData.skills?.map(item => (
              <li key={item.id}>
                <span className={`bar-expand ${item.skillName.toLowerCase()} percent-${item.percent}`}></span>
                <em>{item.skillName}</em>
                <span className="skill-level">{item.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Resume;
