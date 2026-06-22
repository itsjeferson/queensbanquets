import SectionHeading from './SectionHeading.jsx';

function Experience() {
  return (
    <section className="section split-section" id="experience">
      <div className="split-panel">
        <span className="ornament" />
        <p>Designed for ceremonies, receptions, and family banquets.</p>
      </div>

      <div>
        <SectionHeading
          eyebrow="The Queens Banquet experience"
          title="A refined wedding setting with thoughtful flow."
        >
          From the first champagne welcome to the last dance, the experience is
          shaped around comfort, beauty, and celebration.
        </SectionHeading>

        <div className="experience-grid">
          <article>
            <h3>Grand arrival</h3>
            <p>Guests are welcomed through a dramatic black-and-gold entryway.</p>
          </article>
          <article>
            <h3>Elegant dining</h3>
            <p>Ivory linens, gold place settings, and warm lighting set the tone.</p>
          </article>
          <article>
            <h3>Seamless moments</h3>
            <p>Prepared spaces for portraits, speeches, cake cutting, and dancing.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Experience;
