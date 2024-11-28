import React, { useState } from "react";
import TOC from "@/components/TOC";

const TOCContainer = ({
  tocs,
  author,
  gtag,
  display,
  toggle,
  handleToggle,
  date,
  timeToRead,
}) => {
  if (tocs.length <= 0) {
    return null;
  }
  return (
    <nav className={`toc-sticky ${display}-only ${toggle ? "open" : ""}`}>
      <button
        className={`toc-toggle`}
        type="button"
        aria-label="Close Table of Contents"
        onClick={() => handleToggle()}
      >
        <h3>Table of Contents</h3>
        <span className="mobile-only">{toggle ? "X" : "▼"}</span>
      </button>
      <div className={`toc-container ${toggle ? "show" : "hide"}`}>
        <ul className="toc-list">
          <TOC
            tocs={tocs}
            gtag={gtag}
            display={display}
            toggle={toggle}
            handleToggle={handleToggle}
          />
        </ul>
      </div>
    </nav>
  );
};
export default TOCContainer;
