import React from "react";

const ProfileIntro = ({
  activeLegislator,
  legislatorType,
  party,
  constituency,
  regionFlagPath
}) => {
  return (
    <>
      <div className="profile-name">{activeLegislator}</div>
      <div className="profile-intro">
        <div className="profile-intro-text">
          {legislatorType} del partido {party} por la {constituency}
        </div>
        <div className="profile-flag">
          <img src={regionFlagPath} alt="Bandera regional" />
        </div>
      </div>
    </>
  );
};

export default ProfileIntro;
