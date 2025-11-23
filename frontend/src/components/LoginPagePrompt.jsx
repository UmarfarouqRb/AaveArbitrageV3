import { usePrivy } from '@privy-io/react-auth';

const LoginPagePrompt = () => {
  const { login } = usePrivy();
  return (
    <div className="login-prompt-container">
      <h2>Please Log In</h2>
      <p>You need to be logged in to access the application.</p>
      <button onClick={login}>Log In</button>
    </div>
  );
};

export default LoginPagePrompt;
