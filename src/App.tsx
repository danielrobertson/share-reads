
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";
import MyListsPage from "./pages/MyListsPage";
import NotFound from "./pages/NotFound";
import ListViewPage from "./pages/ListViewPage";
import EditListPage from "./pages/EditListPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<SearchPage />} />
            <Route path="my-lists" element={<MyListsPage />} />
            <Route path="list/:id" element={<ListViewPage />} />
            <Route path="list/:id/edit" element={<EditListPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
