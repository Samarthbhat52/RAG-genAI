"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModelSettingsSchema } from "@/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DynamicIcons from "@/components/DynamicIcons";
import { Rabbit, Bird, Snail } from "lucide-react";

const modelOptions = [
  {
    label: "Nova",
    value: "gemini-1.5-flash",
    icon: <Snail color="gray" />,
    description: "Perforformance and speed in a small package",
  },
  {
    label: "Atom",
    value: "gemini-1.0-pro",
    icon: <Bird color="gray" />,
    description: "Lightweight and performant",
  },
  {
    label: "Titan",
    value: "gemini-1.5-pro",
    icon: <Rabbit color="gray" />,
    description: "Our fastest model for general use cases",
  },
];

function ModelSettings() {
  const form = useForm<z.infer<typeof ModelSettingsSchema>>({
    resolver: zodResolver(ModelSettingsSchema),
    defaultValues: {
      model: "gemini-1.5-flash",
      temperature: 0.7,
      maxOutputTokens: 256,
      topP: 0.95,
      topK: 4,
    },
  });

  function onSubmit(values: z.infer<typeof ModelSettingsSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-border space-y-8 rounded-md border p-4"
      >
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="items-start [&_[data-description]]:hidden">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {modelOptions.map((value, index) => {
                    return (
                      <SelectItem key={index} value={value.value}>
                        <div className="flex items-center gap-4">
                          {value.icon}
                          <div className="text-left">
                            <p className="font-medium">{value.label}</p>
                            <p
                              className="text-muted-foreground text-xs"
                              data-description
                            >
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature</FormLabel>
              <FormControl>
                <Input type="number" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxOutputTokens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max output tokens</FormLabel>
              <FormControl>
                <Input type="number" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="topP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Top P</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topK"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Top K</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

export default ModelSettings;
