import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import InfiniteScroll from "react-infinite-scroll-component";
import Task from "../tasks/Task";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import NoResults from "../../assets/no-results.png";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

function ProfilePage() {
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === profile?.owner;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileTasks, setProfileTasks] = useState({ results: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileTasks }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/tasks/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileTasks(profileTasks);
        setHasLoaded(true);
      } catch (err) {}
    };

    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col className="my-2" xs={3}>
              <div>{profile?.tasks_count}</div>
              <div>Tasks</div>
            </Col>
            <Col className="my-2 mx-3" xs={3}>
              <div>{profile?.followers_count}</div>
              <div>Followers</div>
            </Col>
            <Col className="my-2" xs={3}>
              <div>{profile?.following_count}</div>
              <div>Following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button}`}
                onClick={() => handleUnfollow(profile)}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button}`}
                onClick={() => handleFollow(profile)}
              >
                Follow
              </Button>
            ))}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  const mainProfileTasks = (
    <>
      <hr />
      <p className={`text-center`}>{profile?.owner}'s tasks</p>
      <hr />
      {profileTasks.results.length ? (
        <InfiniteScroll
          className="overflow-hidden"
          children={profileTasks.results.map((task) => (
            <Task key={task.id} {...task} setTasks={setProfileTasks} />
          ))}
          dataLength={profileTasks.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileTasks.next}
          next={() => fetchMoreData(profileTasks, setProfileTasks)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} has not made any tasks yet.`}
        />
      )}
    </>
  );

  return (
    <>
      <Row className="justify-content-center">
        <Col lg={8}>
          <PopularProfiles mobile />
          <Container className={`${appStyles.Container} ${appStyles.Content}`}>
            {hasLoaded ? (
              <>
                {mainProfile}
                {mainProfileTasks}
              </>
            ) : (
              <Asset spinner />
            )}
          </Container>
        </Col>
        <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
          <PopularProfiles />
        </Col>
      </Row>
    </>
  );
}

export default ProfilePage;
