import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import WelcomePage from './Components/Welcome/Welcome';
import AllResourcesPage from './Components/AllResource/AllResource';
import ResourceDetailPage from './Components/ResourceDetailPage/ResourceDetail';
import ResourceManagementPage from './Components/ResourceManagement/ResourceManagement';
import CreateResourcePage from './Components/AddResource/AddResource';
import SignUp from './Components/Signup/Signup';
import CreateResourceDetails from './Components/AddResourceDetails/AddResourDetails';
import Logout from './Components/Logout/Logout';
import UpdateResource from './Components/UpdateResource/UpdateResource';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/all_resource" element={<AllResourcesPage />} />
          <Route path="/resource_detail" element={<ResourceDetailPage />} /> 
          <Route path="/resource_management" element={<ResourceManagementPage />} /> 
          <Route path="/add_resource" element={<CreateResourcePage />} />
          <Route path="/add_resource_details" element={<CreateResourceDetails />} />
          <Route path="/update_resource" element={<UpdateResource />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
