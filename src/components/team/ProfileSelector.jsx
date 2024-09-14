import React, { useState } from 'react';
import { useProfiles } from '@/integrations/supabase/hooks/profiles';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileSelector = ({ control, name, label, disabled }) => {
  const { data: profiles, isLoading, error } = useProfiles();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <div>Loading profiles...</div>;
  if (error) return <div>Error loading profiles: {error.message}</div>;

  const filteredProfiles = profiles?.filter(profile =>
    `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("w-full justify-between", !control.value && "text-muted-foreground")}
              disabled={disabled}
            >
              {control.value
                ? profiles?.find((profile) => profile.user_id === control.value)?.first_name + ' ' + profiles?.find((profile) => profile.user_id === control.value)?.last_name
                : "Select user"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search users..." onValueChange={setSearchTerm} />
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {filteredProfiles.map((profile) => (
                <CommandItem
                  key={profile.user_id}
                  value={profile.user_id}
                  onSelect={() => {
                    control.onChange(profile.user_id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      control.value === profile.user_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {profile.first_name} {profile.last_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default ProfileSelector;