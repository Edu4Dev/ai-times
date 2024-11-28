import React from "react";

const DraftMode = ({ on = false, isDraft }) => {
  if (on === false) return null;
  return (
    <div className="draft-mode-wrapper">
      <p>{isDraft ? "DRAFT MODE" : "SCHEDULED POST"}</p>
    </div>
  );
};

export default DraftMode;
