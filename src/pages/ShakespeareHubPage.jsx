import { Navigate } from 'react-router-dom';

/** Legacy route — education content lives on /learning */
export default function ShakespeareHubPage() {
  return <Navigate to="/learning" replace />;
}
