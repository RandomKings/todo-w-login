import { Container, Box, TextField, Typography, Link } from '@mui/material';
import { auth } from '/firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const Login = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(password, email);
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
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline mt-6 mb-4"
              style={{ fontSize: '1.2rem' }}
            >
              Login
            </button>
          </form>
          <Typography variant="body2" align="center" sx={{color: 'black', fontSize: '1rem'}}>
            Need an Account? <Link href="/">Signup</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
