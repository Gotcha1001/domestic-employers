import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return <div className="flex justify-center pt-20">{children}</div>;
};

export default AuthLayout;
