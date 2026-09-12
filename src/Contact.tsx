export default function Contact() {
  return (
    <section className="portfolio-section contact-section" id="contact">
      <div className="container contact-card">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>Let&apos;s connect.</h2>
          <p>
            I am interested in web development, software projects, internship opportunities,
            and collaborative work. Feel free to contact me by email or connect with me online.
          </p>
          <div className="contact-details">
            <a href="mailto:mfaysalmetul@gmail.com">mfaysalmetul@gmail.com</a>
            <span>BRAC University, Bangladesh</span>
          </div>
        </div>

        <div className="contact-actions">
          <a className="primary-button" href="mailto:mfaysalmetul@gmail.com">Email Me</a>
          <a
            className="outline-button"
            href="https://github.com/metul001"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="outline-button"
            href="https://www.linkedin.com/in/mahir-faysal-metul-2b2380308/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
