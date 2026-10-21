import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CardPage from './pages/CardPage';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import StagePage from './pages/StagePage';
import Stats from './pages/Stats';
import Wrong from './pages/Wrong';
import { AppProvider } from './store/app';
import { SessionProvider } from './store/session';

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <SessionProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:id" element={<StagePage />} />
              <Route path="/card/:id" element={<CardPage />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
              <Route path="/wrong" element={<Wrong />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </SessionProvider>
      </AppProvider>
    </HashRouter>
  );
}
