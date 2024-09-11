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
import { Label } from "@/components/ui/label";

const modelOptions = [
  {
    label: "Nova",
    value: "gemini-1.5-flash",
    icon: <Snail color="gray" />,
    description: "Perforformance and speed in a small package",
    disabled: false,
  },
  {
    label: "Atom",
    value: "gemini-1.0-pro",
    icon: <Bird color="gray" />,
    description: "Lightweight and performant",
    disabled: true,
  },
  {
    label: "Titan",
    value: "gemini-1.5-pro",
    icon: <Rabbit color="gray" />,
    description: "Our fastest model for general use cases",
    disabled: true,
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
        className="flex-1 space-y-6 rounded-md border border-border p-4"
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
                      <SelectItem
                        key={index}
                        value={value.value}
                        disabled={value.disabled}
                      >
                        <div className="flex items-center gap-4">
                          {value.icon}
                          <div className="text-left">
                            <p className="font-medium">{value.label}</p>
                            <p
                              className="text-xs text-muted-foreground"
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
                <Input
                  type="number"
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  placeholder="shadcn"
                  {...field}
                />
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <FormField
            control={form.control}
            name="topP"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Top P</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topK"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Top K</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
