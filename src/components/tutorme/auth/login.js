"use client"
import React from 'react';
import { signIn } from "next-auth/react";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons"
import { Navbar } from '../home/nav/navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Button
} from "@/components/ui/button"
export const LoginPage = ({ providers }) => {
  return (
  <div className='m-4 mt-2 h-full'>
    <div class="w-full flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 class="text-4xl font-bold mt-2">TutorMe Beta</h1>
        <h1 class="text-4xl font-bold mt-2  "><span class="text-yellow-400">Franklin</span> NHS</h1>
    </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name} className='flex flex-col justify-center items-center w-full h-full min-h-screen mb-8 transition-all duration-1000 ease-in-out hover:bg-gray-100 hover:shadow-lg hover:scale-105'>
            <h2 className="text-2xl text-center mb-4">Login to TutorMe <span class="text-yellow-400 font-bold">Franklin</span></h2>
            <Button className="w-full max-w-md h-12 text-white bg-yellow-400 font-bold rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105" onClick={() => signIn(provider.id)}>
                <EnvelopeOpenIcon className="h-6 w-6 mr-2" />Sign in with {provider.name}
            </Button>
        </div>
      ))}
  </div>
  );
}

export default LoginPage;