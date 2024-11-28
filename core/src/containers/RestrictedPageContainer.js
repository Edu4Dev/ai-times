import React, { useState } from "react";
import version from "@/content/settings/version";
const RestrictedPage = ({ setPassword }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (event.target[0].value !== version.gitUser) return null;
    setPassword(true);
  };
  return (
    <div className="restricted-page">
      <h1>You aren't supposed to be in here.</h1>
      <form onSubmit={handleSubmit} method="get">
        <input type="text" name="rp-pass" id="rp-pass" placeholder="password" />
        <button>OK</button>
      </form>
    </div>
  );
};
export default RestrictedPage;
