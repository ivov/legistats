import React from "react";

const ProfilePhoto = ({ photoUrl }) => {
  return (
    <div className="profile-photo">
      <img
        src={photoUrl}
        alt="Fotografía del legislador"
        width="240"
        height="240"
      />
    </div>
  );
};

export default ProfilePhoto;
