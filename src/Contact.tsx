export default function Contact() {
  return (
    <section className="portfolio-section contact-section" id="contact">
      <div className="container contact-card">
        <div>
          <p className="section-kicker">Contact & Availability</p>
          <h2>Let&apos;s connect.</h2>
          <p>
            I am available for software engineering opportunities, full-stack MERN development,
            internships, and collaborative projects. Feel free to reach out directly via email
            or connect online.
          </p>

          <div className="contact-details">
            <div>
              <strong>Personal Email: </strong>
              <a href="mailto:mfaysalmetul@gmail.com">mfaysalmetul@gmail.com</a>
            </div>
            <div>
              <strong>Internship / Office Reference: </strong>
              <a href="mailto:hr.bayshorecommunication@gmail.com">hr.bayshorecommunication@gmail.com</a>
            </div>
            <div>
              <strong>Schedule & Office Hours: </strong>
              <span>Sunday to Thursday, 10:00 AM – 6:00 PM</span>
            </div>
            <div>
              <strong>Location: </strong>
              <span>Block - A, Flat 2A, House, 21 Road No. 1, Dhaka 1212</span>
            </div>
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
