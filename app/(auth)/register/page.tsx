import * as React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import dynamic from "next/dynamic";
import RegisterForm from "@/app/(auth)/register/RegisterForm";

export const metadata = {
  title: "Register",
  description: "Register page.",
}

const Link = dynamic(() => import("next/link"), {ssr: false});

export default function RegisterPage() {
  return (
    <div className="container flex justify-center items-center h-screen w-screen">
      <Card className="w-2/7">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm/>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Already have an account? <Link href={"/login"} className="font-bold text-card-foreground">Login</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};