import Image from 'next/image';
import type { ResumeData } from '@/app/types';

interface HeaderProps {
  resumeData: ResumeData;
}

const Header = ({ resumeData }: HeaderProps) => {
  return (
    <>
      <header id="home" style={{ position: 'relative' }}>
        <Image
          src="/images/header-background.svg"
          alt="Header Background"
          fill
          priority
          style={{ objectFit: 'cover', zIndex: -10 }}
        />
        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            <i className="fa fa-bars" aria-hidden="true" />
          </a>
          <a className="mobile-btn" href="#hide-nav" title="Hide navigation">
            <i className="fa fa-times" aria-hidden="true" />
          </a>
          <ul id="nav" className="nav">
            <li className="current">
              <a className="smoothscroll" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#resume">
                Resume
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#jobs">
                Jobs
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#testimonials">
                Testimonials
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#interests">
                Interests
              </a>
            </li>
          </ul>
        </nav>

        <div className="row banner">
          <div className="banner-text">
            <h1 className="responsive-headline">{resumeData.name}</h1>
            <h3 style={{ color: '#fff', fontFamily: 'sans-serif ', fontWeight: 700 }}>
              {resumeData.role}
            </h3>
            <h3 style={{ color: '#fff', fontFamily: 'serif', fontStyle: 'italic' }}>
              {resumeData.roleDescription}
            </h3>
            <hr />
            <ul className="social">
              {resumeData.socialLinks?.map(item => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <i className={item.className}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll" href="#about">
            <i className="fa fa-chevron-down"></i>
          </a>
        </p>
      </header>
    </>
  );
};

export default Header;
