import { Navigate, Route, Routes } from "react-router-dom";
import "./normalize.css";
import "./App.css";

import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import NotFound from "./pages/not_found/NotFound";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import TaskSolutionDetails from "./pages/job_offer_solution_details/TaskSolutionDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import MainWrapper from "./components/MainWrapper";
import SecondWrapper from "./components/SecondWrapper";
import Contact from "./pages/contact/Contact";
import Rewards from "./pages/rewards/Rewards";
import UserProfile from "./pages/user_profile/UserProfile";
import JobOfferDetails from "./pages/job_offer_details/JobOfferDetails";
import TaskFeedbackDetails from "./pages/job_offer_solutions_company/TaskFeedbackDetails";
import OAuth2 from "./pages/OAuth2/OAuth2";
import Footer from "./components/Footer";
import NewTask from "./pages/new_task/NewTask";
import Ranking from "./pages/ranking/Ranking";
import User from "./pages/user/User";
import Redirect404 from "./pages/Redirect404";
import {Ide2} from "./pages/ide/LobbyQueue.tsx";
import Lobby from "./pages/ide/Lobby.tsx";

const App = () => {
  return (
    <>
      <Navbar />
      <MainWrapper>
        <SecondWrapper>
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" />} />
            <Route path="/jobs" element={<Home />} />
            <Route
              path="/job/:id"
              element={<ProtectedRoute userContent={<JobOfferDetails />} />}
            />
            <Route
              path="/job/:id/solution"
              element={
                <ProtectedRoute
                  userContent={<TaskSolutionDetails />}
                  //companyContent={"abc"}
                />
              }
            />
            <Route
              path="/job/:jobId/solution/:solutionId"
              element={
                <ProtectedRoute
                  companyContent={<TaskFeedbackDetails />}
                  //companyContent={"abc"}
                />
              }
            />
            <Route path="/leaderboard" element={<Ranking />} />
              <Route path="/sk" element={<Lobby />} />
            <Route
              path="/job/new"
              element={<ProtectedRoute companyContent={<NewTask />} />}
            />

            <Route path="/profile/:id" element={<User />} />

            {["/me", "/me/tasks", "/me/purchases"].map((path, index) => (
              <Route
                path={path}
                element={<ProtectedRoute userContent={<UserProfile />} />}
                key={index}
              />
            ))}
            <Route
              path="/rewards/"
              element={<ProtectedRoute userContent={<Rewards />} />}
            />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/oauth2/redirect" element={<OAuth2 />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Redirect404 />} />
          </Routes>
        </SecondWrapper>
      </MainWrapper>
      <Footer />
    </>
  );
};

export default App;
