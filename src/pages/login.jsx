import { Container, Box, TextField, Typography, Link, Button } from '@mui/material';
import { auth, googleAuthProvider } from '/firebase'; // Assuming you have auth and googleAuthProvider correctly initialized
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { signInWithPopup } from 'firebase/auth'; // Import signInWithPopup from the Modular SDK

const Login = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider); // Use signInWithPopup from Modular SDK
      navigate('/homepage');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate('/homepage');
    }
  }, [user, navigate]);

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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField margin="normal" fullWidth name="email" label="Email Address" variant="outlined" />
            <TextField margin="normal" fullWidth name="password" label="Password" type="password" variant="outlined" />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '10px' }}
              
            >
              Login
            </Button>
          </form>
          <div className="flex items-center mt-4">
              <hr className="flex-grow border-gray-300 mr-4" />
              <span className="text-gray-500">or</span>
              <hr className="flex-grow border-gray-300 ml-4" />
            </div>
          <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              className="text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-500/50 font-bold py-2 px-4 rounded-full mt-4 w-full text-center inline-flex items-center justify-center dark:focus:ring-red-500/55 me-2 mb-2"
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
              </svg>
              Login with Google
            </button>
            
          <Typography variant="body2" align="center" sx={{color: 'black', fontSize: '1rem'}}>
            Need an Account? <Link href="/">Signup</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
