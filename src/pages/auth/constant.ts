export const loginFormConstant = {
  initialFormData: {
    thoughtMetricsId: '',
    password: '',
    rememberMe: false,
  },
  storeName: 'login-form-store',
  validationMessages: {
    thoughtMetricsId: 'Thought Metrics ID is required',
    password: 'Password is required',
    loginError: 'Invalid credentials. Please check your ID and password.',
    submitError: 'Login failed. Please try again.',
  },
  formResetDelay: 1000,
  apiSimulationDelay: 1500,
  ui: {
    pageTitle: 'Log in to Thought Metrics',
    fieldLabels: {
      thoughtMetricsId: 'Thought Metrics ID',
      password: 'Password',
    },
    checkboxLabels: {
      rememberMe: 'Remember me',
    },
    buttons: {
      continue: 'Continue',
      continuing: 'Signing in...',
      createAccount: 'Create a Thought Metrics ID',
    },
    links: {
      noAccount: "Don't have an account?",
      resetPassword: 'Click here',
      createAccount: 'Create a Thought Metrics ID',
    },
    successMessage: {
      title: 'Welcome Back!',
      description: 'You have successfully logged in to Thought Metrics.',
    },
  },
};

export const signUpFormConstant = {

};
