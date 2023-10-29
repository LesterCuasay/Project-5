import React from "react";

import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import Profile from "./Profile";

import { useProfileData } from "../../contexts/ProfileDataContext";

const PopularProfiles = ({ isDark, mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container
      className={`p-md-2 ${
        isDark ? appStyles.ContentDarkMode : appStyles.Content
      } ${mobile && "d-lg-none text-center mb-3"}`}
    >
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} isDark={isDark} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;
