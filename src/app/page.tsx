"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FormEvent, ReactNode, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ListCheckIcon, PlusIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import Project from "@/types/Project";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateUUID } from "@/lib/uuid";

const NewProjectFormSchema = z.object({
    title: z.string().nonempty("Title cannot be empty"),
    description: z.string().or(z.literal(""))
});

const ProjectContainer = ({
    project
}: {
    project: Project
}): ReactNode => {
    return (
        <AspectRatio ratio={16 / 9} key={project.uuid}>
            <Card className=" rounded-lg shadow-md p-4 w-full h-full overflow-hidden">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                {project.description && <p className="text-sm text-gray-600">{project.description}</p>}
            </Card>
        </AspectRatio>
    )
};

export default function Home(): ReactNode {
    const isMobile = useIsMobile();
    const [search, setSearch] = useState('');

    const projects = useLiveQuery(() => {
        return db.projects.filter((project) => project.title.includes(search)).toArray();
    });

    const newProjectForm = useForm<z.infer<typeof NewProjectFormSchema>>({
        resolver: zodResolver(NewProjectFormSchema),
        defaultValues: {
            title: "New ClipFusion Project",
            description: ""
        }
    });

    const newProjectSubmit = async (data: z.infer<typeof NewProjectFormSchema>) => {
        const date = Date.now();
        await db.projects.add({
            uuid: generateUUID(),
            creationDate: date,
            editDate: date,
            title: data.title,
            description: data.description,
            origin: ""
        });
    };

    return (
        <div className="p-5 w-full h-full">
            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger size="lg"/>
                <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Project Library</h2>
                {projects && <Label className="text-muted-foreground text-sm">(Found {projects.length} projects)</Label>}
            </div>
            <div className="flex flex-row items-center justify-between sticky top-0 bg-background gap-2 mt-3 pb-2 pt-2 w-full overscroll-none z-50">
                <div className="flex flex-row items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon/> {!isMobile && "New Project"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Create New Project
                                </DialogTitle>
                                <DialogDescription>
                                    Fill in the information about your project. You can change it at any time later.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...newProjectForm}>
                                <form onSubmit={newProjectForm.handleSubmit(newProjectSubmit)} className="grid gap-3">
                                    <FormField control={newProjectForm.control} name="title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                    <FormField control={newProjectForm.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tell something about your project" className="resize-y" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button type="submit">Create</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <Toggle variant="outline">
                        <ListCheckIcon/> {!isMobile && "Select Projects"}
                    </Toggle>
                    <Search placeholder="Search Projects" value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                {projects && projects.map((project) => <ProjectContainer project={project}/>)}
            </div>
            {(projects != undefined && projects.length == 0) && (
                <div className="w-full h-full flex justify-center items-center">
                    <Label className="text-muted-foreground">Nothing to Show</Label>
                </div> 
            )}
        </div>
    );
};
