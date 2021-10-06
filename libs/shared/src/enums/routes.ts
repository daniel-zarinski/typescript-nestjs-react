export enum AuthRoutes {
  Root = '/',
}

export enum GuestRoutes {
  Login = '/login',
  CreateAccount = '/create-account',
  ForgotPassword = '/forgot-password/:status',
  ResetPassword = '/reset-password/:token',
}
