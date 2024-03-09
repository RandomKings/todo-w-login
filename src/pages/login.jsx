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
          Login
        </Typography>
        <Box className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm opacity-90">
          <form onSubmit={handleSubmit}>
            <TextField margin="normal" fullWidth name="email" label="Email Address" />
            <TextField margin="normal" fullWidth name="password" label="Password" type="password" />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mb-2"
            >
              Login
            </button>
          </form>
          <Typography variant="body2" align="center" sx={{color: 'black'}}>
            Need an Account? <Link href="/">Signup</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
