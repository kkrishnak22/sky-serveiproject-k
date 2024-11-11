// root/src/components/Login/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase"; // Ensure db is imported for Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions for adding/checking user

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  maxWidth: 450,
  margin: "60px auto",
  backgroundColor: theme.palette.surface.main,
  boxShadow: "0 12px 50px rgba(0, 0, 0, 0.2)",
  borderRadius: "15px",
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: "#DB4437",
  color: "#ffffff",
  padding: theme.spacing(2, 10),
  fontSize: "1.1rem",
  fontWeight: "700",
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.3s ease-in-out",
  '&:hover': {
    backgroundColor: "#c53929",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
  },
}));



const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
      }

      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google: ", error);
    }
  };

  const handleGuestLogin = () => {
    navigate("/");
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom sx={{ color: "primary.main", fontWeight: "700" }}>
        Sign In
      </Typography>
      <GoogleButton onClick={handleGoogleSignIn} fullWidth>
        Sign in with Google
      </GoogleButton>
      
    </StyledPaper>
  );
};

export default Login;
