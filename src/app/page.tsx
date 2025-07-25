"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { addProject, db, deleteProject } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyIcon, EditIcon, EllipsisIcon, InfoIcon, ListCheckIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import Project from "@/types/Project";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateUUID } from "@/lib/uuid";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDebounce } from "use-debounce";

const ProjectInfoFormSchema = z.object({
    title: z.string().nonempty("Title cannot be empty"),
    description: z.string().or(z.literal(""))
});

const ProjectInfoForm = ({ form }: { form: UseFormReturn<z.infer<typeof ProjectInfoFormSchema>> }) => (
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
                    <Textarea autoComplete="off" placeholder="Tell something about your project" className="resize-y" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    </>
);

const RenameProjectDialog = ({ project }: { project: Project }) => {
    const renameForm = useForm<z.infer<typeof ProjectInfoFormSchema>>({
        resolver: zodResolver(ProjectInfoFormSchema),
        defaultValues: {
            title: project.title,
            description: project.description
        }
    });

    const handleRenameSubmit = async (data: z.infer<typeof ProjectInfoFormSchema>) => {
        await db.projects.update(project.uuid, {
            title: data.title,
            description: data.description,
            editDate: Date.now()
        });
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Rename Project</DialogTitle>
                <DialogDescription>Change the name of your project.</DialogDescription>
            </DialogHeader>
            <Form {...renameForm}>
                <form onSubmit={renameForm.handleSubmit(handleRenameSubmit)} className="grid gap-3">
                    <ProjectInfoForm form={renameForm} />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">Rename</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}

const DeleteProjectDialog = ({ project }: { project: Project }) => {
    const handleDelete = async () => {
        deleteProject(project.uuid);
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete the project &quot;{project.title}&quot;? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} asChild>
                    <Button variant="destructive">Delete</Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

const ProjectDropdown = ({ project }: { project: Project }): ReactNode => {
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const isMobile = useIsMobile();

    const handleDuplicate = async () => {
        let originProject = await db.projects.where('uuid').equals(project.origin).first();
        if (!originProject) originProject = project;
        let newProjectTitle = originProject.title;

        const duplication = await db.duplications.where('uuid').equals(originProject.uuid).first();
        if (!duplication) return;
        newProjectTitle = `${originProject.title} (${duplication.count + 1})`;
        await db.duplications.update(duplication.uuid, {
            ...duplication,
            count: duplication.count + 1
        });

        const newProject = {
            ...project,
            uuid: generateUUID(),
            creationDate: Date.now(),
            editDate: Date.now(),
            title: newProjectTitle,
            origin: originProject.uuid
        };
        addProject(newProject as Project);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <EllipsisIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMobile ? "end" : "start"} className="min-w-48">
                <div className="flex flex-row items-center justify-between">
                    <DropdownMenuLabel className="font-semibold">{project.title}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
                        <PencilIcon /> <span className="sr-only">Rename</span>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => console.log("Edit Project")}>
                        <EditIcon className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                        <CopyIcon className="mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteAlertOpen(true)}>
                        <TrashIcon className="mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Project Info")}>
                    <InfoIcon className="mr-2" /> Info
                </DropdownMenuItem>
            </DropdownMenuContent>

            <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                <RenameProjectDialog project={project} />
            </Dialog>
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <DeleteProjectDialog project={project} />
            </AlertDialog>
        </DropdownMenu>
    );
};

const ProjectDescription = ({ project }: { project: Project }): ReactNode => {
    if (!project.description) return <></>;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <InfoIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h3 className="font-semibold text-lg">Project Description</h3>
                <p className="text-sm text-muted-foreground">
                    {project.description}
                </p>
            </PopoverContent>
        </Popover>
    );
}

const ProjectContainer = ({
    project
}: {
    project: Project
}): ReactNode => {
    const date = new Date(project.editDate);
    return (
        <AspectRatio ratio={16 / 9}>
            <Card className="relative rounded-lg shadow-md w-full h-full overflow-hidden hover:scale-[101%] hover:drop-shadow-xl duration-100">
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white dark:from-black to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 p-2 w-full flex flex-row justify-between items-center">
                    <div>
                        <h3 className="text-sm sm:text-sm md:text-md lg:text-lg font-semibold line-clamp-1">{project.title}</h3>
                        {project.description && <p className="text-sm text-secondary-foreground line-clamp-1">{project.description}</p>}
                        {project.editDate && <p className="text-sm text-secondary-foreground">Last edit date: {date.toLocaleDateString()}, {date.toLocaleTimeString()}</p>}
                    </div>
                    <div className="flex flex-col lg:xl:flex-row items-center gap-1">
                        <ProjectDescription project={project} />
                        <ProjectDropdown project={project} />
                    </div>
                </div>
            </Card>
        </AspectRatio>
    )
};

export default function Home(): ReactNode {
    const isMobile = useIsMobile();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 300);

    const projects = useLiveQuery(() => (
        db.projects.filter((project) => project.title.toLowerCase().includes(debouncedSearch.toLowerCase())).toArray()
    ), [debouncedSearch]);

    const newProjectForm = useForm<z.infer<typeof ProjectInfoFormSchema>>({
        resolver: zodResolver(ProjectInfoFormSchema),
        defaultValues: {
            title: "New ClipFusion Project",
            description: ""
        }
    });

    const newProjectSubmit = async (data: z.infer<typeof ProjectInfoFormSchema>) => {
        const date = Date.now();
        addProject({
            uuid: generateUUID(),
            creationDate: date,
            editDate: date,
            title: data.title,
            description: data.description,
            origin: ""
        } as Project);
    };

    return (
        <>
            <div className="flex flex-row items-center gap-2 absolute top-0 left-0 p-5 z-40" tabIndex={1}>
                <SidebarTrigger size="lg"/>
                <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Project Library</h2>
                {projects && <Label className="text-muted-foreground text-sm">(Found {projects.length} projects)</Label>}
            </div>
            <div className="p-5 w-full h-full">
                <div aria-hidden className="fixed top-0 left-0 w-full z-10">
                    <div className="sticky top-0 left-0 w-full h-safe-area-inset-top bg-[#0a0a0a]" />
                </div>
                <div className="h-8" />
                <div className="flex flex-row items-center justify-between sticky top-safe bg-background gap-2 mt-3 pb-2 pt-2 w-full z-40">
                    <div className="flex flex-row items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusIcon /> {!isMobile && "New Project"}
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
                                        <ProjectInfoForm form={newProjectForm} />
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
                            <ListCheckIcon /> {!isMobile && "Select Projects"}
                        </Toggle>
                        <Search placeholder="Search Projects" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
                    {projects && projects.map((project) => <ProjectContainer key={project.uuid} project={project} />)}
                </div>
                {(projects != undefined && projects.length == 0) && (
                    <div className="w-full h-full flex justify-center items-center">
                        <Label className="text-muted-foreground">Nothing to Show</Label>
                    </div>
                )}
            </div>
        </>
    );
};
