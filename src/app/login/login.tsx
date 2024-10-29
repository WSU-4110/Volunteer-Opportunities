"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { Session } from "next-auth";

const Login = ({
  authStatus,
  signOut,
  signIn,
}: {
  authStatus?: Session | undefined;
  signOut: () => void;
  signIn: (arg: string) => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/login_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}
      ></div>

      {/* Login Section */}
      <div
        style={{
          width: "400px",
          minHeight: "100vh",
          padding: "40px 30px",
          backgroundColor: "#ffffffcc",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          marginTop: "20px",
        }}
      >
        {status == "loading" ? (
          <div className="w-fit my-0 m-auto">
            <ClipLoader />
          </div>
        ) : !authStatus ? (
          <>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "20px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: "16px",
                marginBottom: "30px",
                color: "#555",
              }}
            ></p>
            <button
              onClick={() => signIn("google")}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "15px",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#357ae8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#4285F4";
              }}
            >
              Sign in with Google
            </button>
          </>
        ) : (
          <>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "20px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Welcome, {authStatus.user?.name}
            </h1>
            <p
              style={{
                fontSize: "16px",
                marginBottom: "30px",
                color: "#555",
              }}
            >
              You are logged in as {authStatus.user?.email}
            </p>
            <button
              onClick={() => signOut()}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e33b3b";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#ff4d4d";
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
