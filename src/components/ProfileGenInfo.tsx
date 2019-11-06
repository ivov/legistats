import React from "react";

const ProfileGenInfo = ({
  deputies,
  constituency,
  formattedConstituents,
  partyColleagues
}) => {
  return (
    <div className="profile-intro-paragraph-and-colleagues">
      <div className="profile-intro-paragraph">
        Es uno de los
        <b> {deputies} diputados </b>
        por la {constituency} y representa a
        <b> {formattedConstituents} habitantes</b>. (Censo 2010)
      </div>
      <div className="profile-party-colleagues">
        <div className="profile-party-colleagues-title">Copartidarios</div>
        <ul>
          {partyColleagues.length > 0 ? (
            partyColleagues.map(colleague => (
              <li key={colleague}>{colleague}</li>
            ))
          ) : (
            <li>No posee</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileGenInfo;
