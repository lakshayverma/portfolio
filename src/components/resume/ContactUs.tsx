import type { ResumeData } from '@/app/types';

interface ContactUsProps {
  resumeData: ResumeData;
}

const ContactUs = ({ resumeData }: ContactUsProps) => (
  <section id="contact">
    <div className="row section-head">
      <div className="ten columns">
        <p className="lead">{resumeData.endNote}</p>
      </div>
    </div>
  </section>
);

export default ContactUs;
