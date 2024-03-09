import { Container, Box, TextField, Typography, Link } from '@mui/material';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth,db } from '/firebase';
import { useEffect, useState } from 'react'; // Import useState
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [errorMessage, setErrorMessage] = useState(null); // State to store error message

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value; // Capture username from the form
    createUserWithEmailAndPassword(email, password).then(() => {
      // Save user details to Firestore after successful registration
      saveUserToFirestore(email, username);
    });
  };

  const saveUserToFirestore = (email, username) => {
    // Get the UID (user ID) of the newly registered user
    const uid = auth.currentUser.uid;
  
    // Save user details to Firestore with the UID as document ID
    addDoc(collection(db, 'users'), {
      uid: uid, // Store the UID as well
      username: username
    })
    .then(() => {
      console.log("User details saved to Firestore");
      navigate('/login');
    })
    .catch((error) => {
      console.error("Error saving user details:", error);
      // Handle error
    });
  };
  

  useEffect(() => {
    if (user) {
      navigate('/login');
    } else if (error) {
      // Check if error is due to existing user
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Account already exists.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  }, [user, error, navigate]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h6">
          Register
        </Typography>
        <Box className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm opacity-90">
          <form onSubmit={handleSubmit}>
            <TextField margin="normal" fullWidth name="email" label="Email Address" className="mb-4" />
            <TextField margin="normal" fullWidth name="password" label="Password" type="password" className="mb-4" />
            <TextField margin="normal" fullWidth name="username" label="Username" className="mb-4" /> {/* Add input field for username */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </form>
          {/* Display error message if exists */}
          {errorMessage && (
            <Typography variant="body2" align="center" mt={2} sx={{ color: 'red' }}>
              {errorMessage}
            </Typography>
          )}
          <Typography variant="body2" align="center" mt={2} sx={{ color: 'black' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="always">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
