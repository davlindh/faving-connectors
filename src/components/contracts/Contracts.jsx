import React, { useState } from 'react';
import { useContracts, useCreateContract, useUpdateContract, useDeleteContract } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';

const contractSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  terms: z.string().min(1, 'Terms are required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

const Contracts = () => {
  const { data: contracts, isLoading, error } = useContracts();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const deleteContract = useDeleteContract();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  const form = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      title: '',
      description: '',
      terms: '',
      start_date: '',
      end_date: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (editingContract) {
        await updateContract.mutateAsync({ contractId: editingContract.id, updates: data });
        toast.success('Contract updated successfully');
      } else {
        await createContract.mutateAsync(data);
        toast.success('Contract created successfully');
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingContract(null);
    } catch (error) {
      toast.error('Error saving contract');
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    form.reset({
      title: contract.title,
      description: contract.description,
      terms: contract.terms,
      start_date: format(new Date(contract.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(contract.end_date), 'yyyy-MM-dd'),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (contractId) => {
    try {
      await deleteContract.mutateAsync(contractId);
      toast.success('Contract deleted successfully');
    } catch (error) {
      toast.error('Error deleting contract');
    }
  };

  if (isLoading) return <div>Loading contracts...</div>;
  if (error) return <div>Error loading contracts: {error.message}</div>;

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>Create New Contract</Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {contracts?.map((contract) => (
          <Card key={contract.id}>
            <CardHeader>
              <CardTitle>{contract.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{contract.description}</p>
              <p>Start Date: {format(new Date(contract.start_date), 'PP')}</p>
              <p>End Date: {format(new Date(contract.end_date), 'PP')}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => handleEdit(contract)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDelete(contract.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContract ? 'Edit Contract' : 'Create New Contract'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingContract ? 'Update' : 'Create'} Contract</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;