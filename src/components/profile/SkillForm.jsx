import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateSkill } from '@/integrations/supabase';
import { toast } from 'sonner';

const skillSchema = z.object({
  skill_name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be 100 characters or less'),
});

const SkillForm = ({ profileId }) => {
  const createSkill = useCreateSkill();
  const [skills, setSkills] = useState([]);

  const form = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await createSkill.mutateAsync({
        user_id: profileId,
        skill_name: data.skill_name,
      });
      setSkills([...skills, data.skill_name]);
      form.reset();
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
      console.error('Add skill error:', error);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Add Skills</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="skill_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter a skill" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createSkill.isPending}>
            {createSkill.isPending ? 'Adding...' : 'Add Skill'}
          </Button>
        </form>
      </Form>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Added Skills:</h4>
        <ul className="list-disc list-inside">
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillForm;