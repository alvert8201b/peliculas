import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Layout from "./components/Layout";
import FeedView from "./views/FeedView";
import DiscoverView from "./views/DiscoverView";
import MovieDetailsView from "./views/MovieDetailsView";
import ProfileView from "./views/ProfileView";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="feed" element={<FeedView />} />
          <Route path="discover" element={<DiscoverView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="movie/:id" element={<MovieDetailsView />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
