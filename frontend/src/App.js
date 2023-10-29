import { useEffect, useState } from "react";

import styles from "./App.module.css";
import Container from "react-bootstrap/Container";

import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import TaskCreateForm from "./pages/tasks/TaskCreateForm";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TaskPage from "./pages/tasks/TaskPage";
import TasksPage from "./pages/tasks/TasksPage";
import TaskEditForm from "./pages/tasks/TaskEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import NotFound from "./components/NotFound";

import { Route, Switch } from "react-router-dom";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import "./api/axiosDefaults";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  const preference = window.matchMedia("(prefers-color-scheme: dark").matches;
  const initialIsDark =
    localStorage.getItem("isDark") === "true" ? true : preference;
  const [isDark, setIsDark] = useState(initialIsDark);

  useEffect(() => {
    localStorage.setItem("isDark", isDark);
  }, [isDark]);

  return (
    <div className={styles.App} data-theme={isDark ? "dark" : "light"}>
      <NavBar isDark={isDark} setIsDark={setIsDark} />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <TasksPage
                message="No results found. Adjust the search keyword."
                isDark={isDark}
              />
            )}
          />
          <Route
            exact
            path="/feed"
            render={() => (
              <TasksPage
                message="No results found, Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
                isDark={isDark}
              />
            )}
          />
          <Route
            exact
            path="/favourited"
            render={() => (
              <TasksPage
                message="No results found, Adjust the search keyword or favourite a task."
                filter={`favourites__owner__profile=${profile_id}&ordering=-favourites__created_at&`}
                isDark={isDark}
              />
            )}
          />
          <Route
            exact
            path="/signin"
            render={() => <SignInForm isDark={isDark} />}
          />
          <Route
            exact
            path="/signup"
            render={() => <SignUpForm isDark={isDark} />}
          />
          <Route
            exact
            path="/tasks/create"
            render={() => <TaskCreateForm isDark={isDark} />}
          />
          <Route
            exact
            path="/tasks/:id/"
            render={() => <TaskPage isDark={isDark} />}
          />
          <Route
            exact
            path="/tasks/:id/edit"
            render={() => <TaskEditForm isDark={isDark} />}
          />
          <Route
            exact
            path="/profiles/:id"
            render={() => <ProfilePage isDark={isDark} />}
          />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm isDark={isDark} />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm isDark={isDark} />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm isDark={isDark} />}
          />
          <Route render={() => <NotFound isDark={isDark} />} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
