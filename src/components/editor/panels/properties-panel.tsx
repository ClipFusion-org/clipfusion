import { useEditorStore } from "@/stores/useEditorStore";
import { Panel, PanelContent, PanelHeader, PanelFooter } from "./panel";
import { CollapsibleText, Muted, NothingToShowPlaceholder, SwitchableText } from "@/components/typography";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import z from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import resolutions from "@/constants/resolutions";
import aspectRatios from "@/constants/aspectRatios";
import { getProjectRatio, getProjectResolutionString } from "@/types/Project";

const ProjectPropertiesFormSchema = z.object({
    title: z.string().nonempty(),
    description: z.string().trim().or(z.string('')),
    resolution: z.string(),
    ratio: z.string()
});

type ProjectPropertiesForm = z.infer<typeof ProjectPropertiesFormSchema>;

const PropertyName = (props: React.ComponentProps<typeof Muted>) => (
    <Muted {...props} className={cn("text-sm", props.className)} />
);

const PropertyValue = ({
    defaultOpen,
    ...props
}: React.ComponentProps<typeof NothingToShowPlaceholder> & {
    defaultOpen?: boolean
}) => (
    props.children ? <CollapsibleText defaultOpen={defaultOpen} {...props} /> : <NothingToShowPlaceholder />
);

const AlignedFormItem = (props: React.ComponentProps<typeof FormItem>) => (
    <FormItem {...props} className={cn("grid grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] w-full", props.className)} />
);

const ProjectPropertiesFormFields = ({ form }: { form: UseFormReturn<ProjectPropertiesForm> }) => (
    <>
        <FormField control={form.control} name="title" render={({ field }) => (
            <AlignedFormItem>
                <FormLabel>Title</FormLabel>
                <div>
                    <FormControl>
                        <Input autoComplete="false" spellCheck="false" {...field} />
                    </FormControl>
                    <FormMessage />
                </div>
            </AlignedFormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
            <AlignedFormItem>
                <FormLabel>Description</FormLabel>
                <div>
                    <FormControl>
                        <Textarea placeholder="Say something about your project" className="break-words overflow-x-auto" autoComplete="false" spellCheck="false" {...field} />
                    </FormControl>
                    <FormMessage />
                </div>
            </AlignedFormItem>
        )} />

        <FormField control={form.control} name="resolution" render={({ field }) => (
            <AlignedFormItem>
                <FormLabel>Resolution</FormLabel>
                <div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select resolution" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {resolutions.map((resolution) => (
                                <SelectItem key={resolution.name} value={`${resolution.height}`}>{resolution.name} ({resolution.height}p)</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </div>
            </AlignedFormItem>
        )} />

        <FormField control={form.control} name="ratio" render={({ field }) => (
            <AlignedFormItem>
                <FormLabel>Format</FormLabel>
                <div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {aspectRatios.map((aspectRatio) => (
                                <SelectItem key={aspectRatio.name} value={`${aspectRatio.a}:${aspectRatio.b}`}>{aspectRatio.name} ({aspectRatio.a}:{aspectRatio.b})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </AlignedFormItem>
        )} />
    </>
);
const ModifyProjectPropertiesDialog = () => {
    const project = useEditorStore((state) => state.project);
    const setProject = useEditorStore((state) => state.setProject);

    const form = useForm<ProjectPropertiesForm>({
        resolver: zodResolver(ProjectPropertiesFormSchema),
        mode: "onChange"
    });

    const onSubmit = (values: ProjectPropertiesForm) => {
        setProject((prev) => ({
            ...prev,
            title: values.title,
            description: values.description,
            height: +values.resolution,
            ratio: values.ratio
        }));
    };

    React.useEffect(() => {
        if (project) {
            form.reset({
                title: project.title,
                description: project.description,
                resolution: `${project.height}`,
                ratio: project.ratio
            });
        }
    }, [project]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PencilIcon /> Modify
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modify Project Properties</DialogTitle>
                    <DialogDescription>Change title, description resolution etc.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <ProjectPropertiesFormFields form={form} />
                        <DialogFooter>
                            <DialogClose asChild onClick={() => form.reset()}>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild onClick={(e) => {
                                const errors = form.formState.errors;
                                if (errors.title || errors.description || errors.resolution || errors.ratio) {
                                    e.preventDefault();
                                }
                            }}>
                                <Button type="submit">OK</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

const PropertiesPanel = () => {
    const { project } = useEditorStore();

    if (!project.uuid) {
        return (
            <Panel>
                <PanelContent>
                    <div className="w-full h-full flex justify-center items-center">
                        Nothing to Show
                    </div>
                </PanelContent>
            </Panel>
        );
    }

    return (
        <Panel>
            <PanelHeader>Properties</PanelHeader>
            <PanelContent className="p-0 flex flex-col justify-between">
                <div className="grid grid-cols-[1fr_2fr] w-full p-4">
                    <PropertyName>Title:</PropertyName>
                    <PropertyValue>{project.title}</PropertyValue>

                    <PropertyName>Description:</PropertyName>
                    <PropertyValue>{project.description}</PropertyValue>

                    <PropertyName>Resolution:</PropertyName>
                    <PropertyValue>
                        <SwitchableText a={`${project.height}p`} b={getProjectResolutionString(project)} />
                    </PropertyValue>

                    <PropertyName>Ratio:</PropertyName>
                    <PropertyValue>{project.ratio}</PropertyValue>
                </div>
                <PanelFooter className="flex flex-row justify-end h-12 shrink-0">
                    <ModifyProjectPropertiesDialog />
                </PanelFooter>
            </PanelContent>
        </Panel>
    );
};


export default PropertiesPanel;