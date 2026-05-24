import Image from 'next/image';
import type { ResumeData } from '@/app/types';

interface PortfolioProps {
  resumeData: ResumeData;
}

const Portfolio = ({ resumeData }: PortfolioProps) => (
  <section id="portfolio">
    <div className="row">
      <div className="twelve columns collapsed">
        <h1>Check Out Some of My Works.</h1>
        <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
          {resumeData.portfolio?.map(item => (
            <div className="columns portfolio-item" key={item.id}>
              <div className="item-wrap">
                <a href="#">
                  <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                    <Image
                      src={item.imgurl}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="item-img"
                    />
                  </div>
                  <div className="overlay">
                    <div className="portfolio-item-meta">
                      <h5>{item.name}</h5>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Portfolio;
