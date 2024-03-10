import { Container, Box, TextField, Typography, Link } from '@mui/material';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '/firebase';
import { useEffect, useState } from 'react'; // Import useState
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';

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
    <Container
    maxWidth="sm"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
          <Box
          sx={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
          <Box className="bg-gray-100 shadow-md rounded px-10 pt-8 pb-10 mb-6 w-full opacity-90" sx={{ borderRadius: 12 }}>
          <Typography component="h1" variant="h4" align="center" color="black" fontWeight="bold" mb={4}>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField margin="normal" fullWidth name="email" label="Email Address" style={{ marginBottom: '16px' }} />
            <TextField margin="normal" fullWidth name="password" label="Password" type="password" style={{ marginBottom: '16px' }} />
            <TextField margin="normal" fullWidth name="username" label="Username" style={{ marginBottom: '16px' }} /> {/* Add input field for username */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline mt-6 mb-4"
              style={{ fontSize: '1.2rem' }}
            >
              Register
            </button>
          </form>
          {/* Display error message if exists */}
          {errorMessage && (
            <Typography variant="body2" align="center" style={{ color: 'red', marginBottom: '16px' }}>
              {errorMessage}
            </Typography>
          )}
          <Typography  variant="body2" align="center" sx={{color: 'black', fontSize: '1rem'}}>
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
