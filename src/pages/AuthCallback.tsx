
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get URL hash
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting auth session:", error);
      }
      
      // Redirect to the home page regardless of the result
      navigate("/", { replace: true });
    };
    
    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg">Processing authentication, please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
