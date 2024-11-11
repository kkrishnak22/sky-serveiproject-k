// root/src/components/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Paper, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase"; // Ensure db is imported for Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions for adding/checking user

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 40,
  maxWidth: 450,
  margin: "60px auto",
  backgroundColor: "#ffffff",
  boxShadow: "0 12px 50px rgba(0, 0, 0, 0.2)",
  borderRadius: "15px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: 25,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
  padding: "15px 0",
  fontSize: "1.1rem",
  fontWeight: "700",
  borderRadius: "15px",
  transition: "all 0.3s ease-in-out",
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  marginTop: 20,
  backgroundColor: "#DB4437", // Google red color
  color: "#ffffff",
  padding: "15px 0",
  fontSize: "1.1rem",
  fontWeight: "700",
  borderRadius: "15px",
  transition: "all 0.3s ease-in-out",
  '&:hover': {
    backgroundColor: "#c53929",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
  },
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // If the user doesn't exist, create a new document
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        console.log("New user document created in Firestore.");
      } else {
        // Update last login time if user exists
        await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
        console.log("User's last login time updated.");
      }

      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google: ", error);
    }
  };

  return (
    <>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <StyledButton type="submit" variant="contained" fullWidth>
            Login
          </StyledButton>
        </form>
        <Divider sx={{ my: 3 }}>or</Divider>
        <GoogleButton onClick={handleGoogleSignIn} fullWidth>
          Sign in with Google
        </GoogleButton>
      </StyledPaper>
    </>
  );
};

export default Login;
