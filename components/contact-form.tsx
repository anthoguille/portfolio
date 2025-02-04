"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/actions";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe de tener al menos 2 caracteres"),
  email: z.string().email("Dirección electrónica inválida"),
  message: z.string().min(10, "El mensaje debe de tener al menos 10 caracteres"),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Este será el action
  const onSubmit = async(values: z.infer<typeof formSchema>)  =>{
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);

    const result = await sendContactMessage(formData);

    if (result.success) {
      toast("Mensaje enviado con éxito");
      form.reset();
    } else {
      toast.error(result.error || "Error al enviar el mensaje");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre Ejemplo" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo (email)</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Dime en que puedo ayudarte"
                  {...field}
                  className="min-h-[120px]"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Enviar mensaje
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
