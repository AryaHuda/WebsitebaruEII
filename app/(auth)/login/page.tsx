import {Metadata} from "next"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import LoginForm from "@/app/(auth)/login/LoginForm";
import dynamic from "next/dynamic";

const Link = dynamic(() => import('next/link'), {
  ssr:false,
})

export const metadata: Metadata = {
  title: "Login",
  description: "Login page.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="container flex justify-center items-center h-screen w-screen">
        <Card className="w-2/7">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password below to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <LoginForm/>
          </CardContent>
          <CardFooter>
            <div className="flex-1">
              <CardDescription className="mt-1">
                {"Don't"} have an account? <Link href="/register"
                                                 className="font-bold text-card-foreground">Register</Link>
              </CardDescription>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
