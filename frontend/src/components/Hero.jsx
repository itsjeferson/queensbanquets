import { useLandingContent } from '../content/LandingContentContext.jsx';

function Hero() {
  const {
    content: { heroContent },
  } = useLandingContent();

  const backgroundUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD4DLyVU1YrR8CRaASVouRz53kdS6pExr0eljjXk1aW3hOO2jCoX4LZMq51ubBn1WQRgelhqvBQzxHxSeabz42cTi7IRSu6Xwz6npILel4YKn4N7naLo6HrKLE8jRBJT54AXsb9RYgCMc2eGH5cKMNPawSbjkcFpwtGzp4gMJPkQQXC_BmUcnjFXhJONoASmvBXIYfnUU01CTtJWTUIDuphaqpdoCOQz39iXeK3RG2hFxr5bEQR0hGqg5--YzdMsj5vuyPRqkFGUN8';

  return (
    <section
      className="relative min-h-[min(90dvh,920px)] w-full flex items-center justify-center overflow-hidden py-20 sm:py-24"
      id="home"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
          role="img"
          aria-label="A cinematic, wide-angle shot of a grand ballroom gala"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 text-center text-white w-full max-w-4xl px-page-x">
        <span className="font-label-md text-[11px] sm:text-label-md uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 block text-white/90 text-balance">
          {heroContent.eyebrow}
        </span>
        <h1 className="font-display-lg !text-white text-[clamp(2.15rem,7vw,4rem)] md:text-display-lg mb-6 sm:mb-8 leading-[1.15] text-balance">
          Where Heritage Meets{' '}
          <br className="hidden xs:block" />
          <span className="italic font-normal text-white/95">Timeless Splendor</span>
        </h1>
        <p className="font-body-lg text-[0.95rem] sm:text-body-lg mb-8 sm:mb-10 max-w-2xl mx-auto text-white/85 text-pretty">
          {heroContent.copy}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 w-full max-w-md sm:max-w-none mx-auto">
          <a
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-primary-container text-on-primary-container font-label-md uppercase tracking-widest hover:scale-105 transition-all duration-300 text-center text-[12px] sm:text-label-md"
            href="#services"
          >
            {heroContent.primaryCta}
          </a>
          <a
            className="px-8 sm:px-10 py-3.5 sm:py-4 backdrop-blur-md bg-white/10 border border-white/50 text-white font-label-md uppercase tracking-widest hover:bg-white hover:text-[#1b1c1c] transition-all duration-300 text-center text-[12px] sm:text-label-md"
            href="#contact"
          >
            {heroContent.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
