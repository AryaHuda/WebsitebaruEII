"use client";
import React, {ChangeEvent, useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {createUser} from "@/lib/firebase/db";
import AlertRegisterSuccess from "@/app/(auth)/register/AlertRegisterSuccess";
import {useToast} from "@/components/ui/use-toast";

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    name: "",
  });

  const {toast, toasts} = useToast()

  console.log(toasts)

  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(formValues);

      const user: RegisterUser = {
        email: formValues.email,
        password: formValues.password,
        name: formValues.name,
      };

      await createUser(user);

      toast({})
      setLoading(false);
      setFormValues({email: "", password: "", name: ""});
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormValues({...formValues, [name]: value});
  };

  return (
    <div>
      {toasts[0]?.open && (
        <div className="absolute top-24 right-8 animate-in">
          <AlertRegisterSuccess/>
        </div>
      )}

      <form method="POST" className="grid gap-4" onSubmit={onSubmit}>
        {error && (
          <p className="text-center font-medium font-sans bg-destructive-foreground p-2 text-destructive">
            {error}
          </p>
        )}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            onChange={handleChange}
            value={formValues.name}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="email@example.com"
            onChange={handleChange}
            value={formValues.email}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formValues.password}
          />
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
