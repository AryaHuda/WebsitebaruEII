"use client";
import { DialogClose } from "@/components/ui/dialog";
import { useEffect } from "react";
import Loading from "@/components/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { capitalize } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  username: z.string(),
  newUsername: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  role: z.string(),
});

export default function FormEditProfile({
  user,
  open,
  setOpen,
  loading,
  setLoading,
  mutate,
  hidden = [],
}: {
  user: any;
  open: boolean;
  setOpen: any;
  loading: boolean;
  setLoading: any;
  mutate: any;
  hidden?: string[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      newUsername: user.username,
      role: user.role,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: user.name,
        username: user.username,
        newUsername: user.username,
        role: user.role,
      });
    }
  }, [open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Something went wrong");
      mutate();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {Object.entries(formSchema.shape)
            .filter((schema) => !hidden.includes(schema[0]))
            .map(([fieldName, _]) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof typeof formSchema.shape} // Cast the fieldName to the specific keys defined in formSchema.shape
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{capitalize(fieldName)}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <div className="flex justify-end gap-2 pt-4 ">
            <Button variant="default" className="flex px-4" type="submit">
              <Loading loading={loading} size={20} className="-ml-2 mr-2" />
              Edit
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
