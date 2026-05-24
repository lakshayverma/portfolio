import Image from 'next/image';
import type { ResumeData } from '@/app/types';

interface AboutProps {
  resumeData: ResumeData;
}

const About = ({ resumeData }: AboutProps) => (
  <section id="about">
    <div className="row">
      <div className="three columns">
        <Image
          className="profile-pic"
          src="/images/profile.png"
          alt={resumeData.name}
          width={120}
          height={120}
          style={{ borderRadius: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="nine columns main-col">
        <h2>About Me</h2>
        <p>{resumeData.aboutMe}</p>
      </div>
    </div>
  </section>
);

export default About;
