import type { ResumeData } from '@/app/types';

interface FooterProps {
  resumeData: ResumeData;
}

const Footer = ({ resumeData }: FooterProps) => {
  const year = new Date();

  return (
    <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">
            {resumeData.socialLinks?.map(item => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <i className={item.className} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div id="go-top">
          <a className="smoothscroll" title="Back to Top" href="#home">
            <i className="fa fa-chevron-up" />
          </a>
        </div>

        <small>
          Copyright {year.getFullYear()} | {resumeData.name}
        </small>
      </div>
    </footer>
  );
};

export default Footer;
