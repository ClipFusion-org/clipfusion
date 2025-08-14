import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

const ProjectRenameFormSchema = z.object({
    title: z.string().nonempty("Title cannot be empty"),
    description: z.string().or(z.literal(""))
});

export type ProjectRenameForm = z.infer<typeof ProjectRenameFormSchema>;

export const ProjectRenameFormFields = ({ form }: { form: UseFormReturn<ProjectRenameForm> }) => (
    <>
        <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea {...field} autoComplete="off" placeholder="Say something about your project" className="resize-y" wrap="hard" />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    </>
);

export const useProjectRenameForm = () => {
    const form =  useForm<ProjectRenameForm>({
        resolver: zodResolver(ProjectRenameFormSchema),
        defaultValues: {
            title: '',
            description: ''
        },
        mode: "onChange"
    });

    return form;
}