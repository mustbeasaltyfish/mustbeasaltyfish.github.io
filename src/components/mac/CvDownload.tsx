import cv from "../../assets/documents/yukai-wu-cv.pdf";

export function CvDownload() {
  return (
    <a
      className="mac-button cv-download"
      href={cv}
      download="Yukai-Wu-CV.pdf"
      title="Download Yukai Wu's CV (PDF)"
    >
      Download CV <span aria-hidden="true">↓</span>
    </a>
  );
}
