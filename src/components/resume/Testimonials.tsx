import type { ResumeData } from '@/app/types';

interface TestimonialsProps {
  resumeData: ResumeData;
}

const Testimonials = ({ resumeData }: TestimonialsProps) => (
  <section id="testimonials">
    <div className="text-container">
      <div className="row">
        <div className="two columns header-col">
          <h1>
            <span>What others are saying</span>
          </h1>
        </div>
        <div className="ten columns flex-container">
          <div className="flexslider">
            <ul className="slides">
              {resumeData.testimonials?.map(item => (
                <li key={item.id}>
                  <blockquote>
                    <p>{item.description}</p>
                    <cite>{item.name}</cite>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
