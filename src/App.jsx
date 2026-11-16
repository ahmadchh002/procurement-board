import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProcurementBoard from './pages/ProcurementBoard/ProcurementBoard';
import ActivityLogPage from './pages/ActivityLogPage/ActivityLogPage';
import { STAGES, STAGE_PAGE_PATHS } from './utils/constants';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProcurementBoard />} />
        <Route path="/activitylog" element={<ActivityLogPage />} />
        {STAGES.map((stage) => (
          <Route
            key={stage.id}
            path={STAGE_PAGE_PATHS[stage.id]}
            element={<ProcurementBoard stagePageId={stage.id} />}
          />
        ))}
        <Route
          path="/delivered"
          element={<ProcurementBoard stagePageId="delivered" />}
        />
      </Routes>
    </BrowserRouter>
  );
}