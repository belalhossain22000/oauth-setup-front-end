"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For redirecting after successful login
import { jwtDecode } from "jwt-decode";
import { LogOut, MailIcon } from 'lucide-react';

interface User {
  displayName: string;
  email: string;
  photo: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Router instance for redirection

  useEffect(() => {
    // Check URL params for token or fallback to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get("token");

    if (token) {
      // Store token in localStorage if it's from URL
      localStorage.setItem("token", token);
    } else {
      // If no token in URL, retrieve from localStorage
      token = localStorage.getItem("token");
    }

    if (token) {
      try {
        // Decode token to extract user information
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser); // Set the user data in state
        router.push("/"); // Redirect to homepage or another page after successful login
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token"); // Remove invalid token
        router.push("/"); // Redirect to login if token is invalid
      }
    } else {
      router.push("/"); // Redirect to login if no token found
    }
  }, [router]);

  const handleGoogleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Redirect to the backend to handle Google login
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null)
  }

  return (
    <>
      {!user ? (
        <div className="min-h-screen">
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-300 rounded-md group hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>
                <svg
                  className="w-5 h-5 text-gray-700 fill-current group-hover:text-blue-500"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                Sign in with Google
              </span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="text-center p-6 bg-gray-800 text-white">
              <img
                className="h-32 w-32 rounded-full mx-auto"
                src={user.photo || "/default-avatar.png"}
                alt="User avatar"
              />
              <h1 className="text-2xl font-semibold mt-4">{user.displayName}</h1>
              <p className="text-sm">Full stack Developer</p>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MailIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center my-10'>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </>

      )}
    </>
  );
};

export default Home;
