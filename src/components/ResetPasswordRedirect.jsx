import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get the token from URL parameters
    const token = searchParams.get("token");

    // Redirect to the forgot-password page with the token
    if (token) {
      navigate(`/forgot-password?token=${token}`, { replace: true });
    } else {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, searchParams]);

  // Show loading while redirecting
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%)",
        color: "white",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            animation: "spin 1s linear infinite",
          }}
        >
          ⏳
        </div>
        <p>Redirecting to password reset...</p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordRedirect;
