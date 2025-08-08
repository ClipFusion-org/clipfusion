"use client";

import React, { ComponentProps, createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { addProject, db, deleteProject } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ALargeSmallIcon, ArrowDownIcon, ArrowUpIcon, CalendarIcon, ClockIcon, CopyIcon, EditIcon, EllipsisIcon, Grid2X2CheckIcon, Grid2X2XIcon, InfoIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Project from "@/types/Project";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDebounce } from "use-debounce";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, generateUUID, truncate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import StaticSidebarTrigger from "@/components/static-sidebar-trigger";
import SidebarTriggerAdjustable from "@/components/sidebar-trigger-adjustable";
import ScrollFadingTitle from "@/components/scroll-fading-title";
import AscendingCard from "@/components/ascending-card";
import Link from "next/link";
import StickyTopContainer from "@/components/sticky-top-container";
import { useRouter } from "next/navigation";
import SwipeToDelete from "@/components/swipe-to-delete";

type SortingType = "byCreationDate"
    | "byEditDate"
    | "byTitle";

const defaultSortingType: SortingType = "byCreationDate";

const sortProjects = (a: Project, b: Project, sortingType: SortingType) => {
    switch (sortingType) {
        case "byCreationDate": return b.creationDate - a.creationDate;
        case "byEditDate": return b.editDate - a.editDate;
        case "byTitle": return a.title.localeCompare(b.title);
    }
};

const sortingTypeToString = (sortingType: SortingType) => {
    switch (sortingType) {
        case "byCreationDate": return "By Creation Date";
        case "byEditDate": return "By Edit Date";
        case "byTitle": return "By Title";
    }
};

const SortingTypeIcon = ({
    sortingType
}: {
    sortingType: SortingType
}) => {
    switch (sortingType) {
        case "byCreationDate": return <CalendarIcon />;
        case "byEditDate": return <ClockIcon />;
        case "byTitle": return <ALargeSmallIcon />;
    }
};

const SortingTypeMenuItem = ({
    sortingType,
    currentSortingType,
    setSortingType
}: {
    sortingType: SortingType,
    currentSortingType: SortingType
    setSortingType: Dispatch<SetStateAction<SortingType>>,
}) => (
    <DropdownMenuCheckboxItem checked={currentSortingType == sortingType} onCheckedChange={() => setSortingType(sortingType)}>
        <SortingTypeIcon sortingType={sortingType} /> {sortingTypeToString(sortingType)}
    </DropdownMenuCheckboxItem>
);

interface SelectContextData {
    selecting: boolean;
    setSelecting: Dispatch<SetStateAction<boolean>>;
    selectedProjects: string[];
    setSelectedProjects: Dispatch<SetStateAction<string[]>>;
};

const SelectContext = createContext<SelectContextData | null>(null);

const useSelectContext = (): SelectContextData => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectContext is not provided");
    return context;
};

const ProjectInfoFormSchema = z.object({
    title: z.string().nonempty("Title cannot be empty"),
    description: z.string().or(z.literal(""))
});

type ProjectInfoForm = z.infer<typeof ProjectInfoFormSchema>;

const ProjectInfoFormFields = ({ form }: { form: UseFormReturn<ProjectInfoForm> }) => (
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
                    <Textarea {...field} autoComplete="off" placeholder="Tell something about your project" className="resize-y" />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    </>
);

const RenameProjectDialog = ({ project }: { project: Project }) => {
    const renameForm = useForm<ProjectInfoForm>({
        resolver: zodResolver(ProjectInfoFormSchema),
        defaultValues: {
            title: project.title,
            description: project.description
        },
        mode: "onChange"
    });

    const handleRenameSubmit = async (data: ProjectInfoForm) => {
        console.log(data);
        console.log(project.uuid);
        console.log(data.title);
        db.projects.update(project.uuid, {
            title: data.title,
            description: data.description,
            editDate: Date.now()
        });
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Rename Project</DialogTitle>
                <DialogDescription>Change information of your project.</DialogDescription>
            </DialogHeader>
            <Form {...renameForm}>
                <form onSubmit={renameForm.handleSubmit(handleRenameSubmit)} className="grid gap-3">
                    <ProjectInfoFormFields form={renameForm} />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            if (renameForm.formState.errors.title) e.preventDefault();
                        }} asChild>
                            <Button type="submit" >Rename</Button>
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
                    Are you sure you want to delete the project &quot;{truncate(project.title, 32)}&quot;? This action cannot be undone.
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

const ProjectDropdown = ({
    project,
    selected
}: {
    project: Project,
    selected: boolean
}): ReactNode => {
    const router = useRouter();
    const { selecting, setSelecting, selectedProjects, setSelectedProjects } = useSelectContext();
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const isMobile = useIsMobile();

    const handleSelect = () => {
        if (!selecting) {
            setSelecting(true);
            setSelectedProjects([]);
        }

        const index = selectedProjects.indexOf(project.uuid);
        if (index >= 0) {
            selectedProjects.splice(index, 1);
            setSelectedProjects([...selectedProjects]);
        } else {
            setSelectedProjects([...selectedProjects, project.uuid]);
        }
    };

    const handleEdit = () => router.push(`/editor/${project.uuid}`);

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

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <EllipsisIcon />
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="px-safe-or-2 pb-safe-or-2 gap-1">
                    <SheetHeader className="m-0 p-2 gap-0">
                        <div className="flex flex-row items-center w-[95%]">
                            <SheetTitle className="font-semibold line-clamp-1">{project.title}</SheetTitle>
                            <SheetClose asChild>
                                <Button variant="ghost" onClick={(e) => {
                                    e.preventDefault();
                                    setRenameDialogOpen(true);
                                }}>
                                    <PencilIcon /><span className="sr-only">Rename</span>
                                </Button>
                            </SheetClose>
                        </div>
                        <SheetDescription>Additional Options for the Project</SheetDescription>
                    </SheetHeader>
                    <Separator />
                    <SheetClose asChild>
                        <Button variant="ghost" className="justify-start w-full" onClick={handleSelect}>
                            {selected ? <Grid2X2XIcon /> : <Grid2X2CheckIcon />}{selected ? "Deselect" : "Select"}
                        </Button>
                    </SheetClose>
                    <Button variant="ghost" className="justify-start w-full" onClick={handleEdit}>
                        <EditIcon /> Edit
                    </Button>
                    <SheetClose asChild>
                        <Button variant="ghost" className="justify-start w-full" onClick={handleDuplicate}>
                            <CopyIcon /> Duplicate
                        </Button>
                    </SheetClose>
                    <Button variant="ghost" className="text-red-400 justify-start w-full" onClick={() => setDeleteAlertOpen(true)}>
                        <TrashIcon /> Delete
                    </Button>
                    <Separator />
                    <SheetClose asChild>
                        <Button variant="ghost" className="justify-start w-full" onClick={() => console.log("Project Info")}>
                            <InfoIcon /> Info
                        </Button>
                    </SheetClose>
                </SheetContent>
                <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                    <RenameProjectDialog project={project} />
                </Dialog>
                <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                    <DeleteProjectDialog project={project} />
                </AlertDialog>
            </Sheet>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <EllipsisIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMobile ? "end" : "start"} className="min-w-48">
                <div className="flex flex-row items-center justify-between w-full">
                    <DropdownMenuLabel className="font-semibold">{project.title}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        setRenameDialogOpen(true)
                    }}>
                        <PencilIcon /><span className="sr-only">Rename</span>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleSelect}>
                        {selected ? <Grid2X2XIcon className="mr-2" /> : <Grid2X2CheckIcon className="mr-2" />} {selected ? "Deselect" : "Select"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                        <EditIcon className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                        <CopyIcon className="mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        setDeleteAlertOpen(true);
                    }}>
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
    const isMobile = useIsMobile();
    if (!project.description) return <></>;

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <InfoIcon />
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom">
                    <SheetHeader className="m-0 p-2 gap-0 w-[95%]">
                        <SheetTitle className="line-clamp-1">{project.title} Description</SheetTitle>
                        <SheetDescription>Additional Information About the Project</SheetDescription>
                    </SheetHeader>
                    <Separator />
                    <div className="p-2">
                        {project.description}
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <InfoIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h3 className="font-semibold text-lg">{project.title} Description</h3>
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
    const { selecting, selectedProjects, setSelectedProjects } = useSelectContext();
    const [container, setContainer] = useState<HTMLDivElement | undefined>();
    const containerRef = (node: HTMLDivElement) => {
        setContainer(node);
    };
    const isMobile = useIsMobile();
    const swipeToDelete = useIsMobile(640);

    const date = new Date(project.editDate);

    const handleCheck = () => {
        const index = selectedProjects.indexOf(project.uuid);
        if (index >= 0) {
            selectedProjects.splice(index, 1);
            setSelectedProjects([...selectedProjects]);
        } else {
            setSelectedProjects([...selectedProjects, project.uuid]);
        }
    };

    const LinkComponent = selecting ? "div" : ((props: ComponentProps<typeof Link>) => (
        <Link {...props} prefetch={false}/>
    ));

    const projectComponent = (
        <AspectRatio  className="relative w-full h-auto" data-selectable="true" ratio={16 / 9}>
            <AscendingCard className="absolute top-0 left-0 w-full h-full overflow-hidden p-0">
                <LinkComponent href={`/editor/${project.uuid}`} className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="relative w-full h-full rounded-lg overflow-hidden" data-selectable="true" onClick={handleCheck}>
                        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white dark:from-black to-transparent opacity-50" data-selectable="true" />
                        <div className="absolute bottom-0 left-0 p-2 w-[85%] flex flex-col" data-selectable="true" >
                            <h3 className="text-sm sm:text-sm md:text-md lg:text-lg font-semibold line-clamp-1" data-selectable="true">{project.title}</h3>
                            {project.description && <p className="text-sm text-secondary-foreground line-clamp-1" data-selectable="true">{project.description}</p>}
                            {project.editDate && <time dateTime={date.toISOString()} className="text-sm text-secondary-foreground" data-selectable="true">Last Edit Date: {date.toLocaleDateString()}, {date.toLocaleTimeString([], { timeStyle: "short" })}</time>}
                        </div>
                    </div>
                </LinkComponent>
                <div className="absolute bottom-0 right-0 pr-3 pb-3 flex flex-col lg:xl:flex-row items-center gap-1" data-selectable="true">
                    {!selecting && <ProjectDescription project={project} />}
                    <ProjectDropdown selected={selectedProjects.includes(project.uuid)} project={project} />
                </div>
                {selecting && (
                    <div className="absolute top-0 right-0 pt-5 pr-5" data-selectable="true">
                        <Checkbox checked={selectedProjects.includes(project.uuid)} data-selectable="true" />
                    </div>
                )}
            </AscendingCard>
        </AspectRatio>
    );


    return isMobile && !selecting && swipeToDelete ? (
        <div className="w-[100% + 5 * var(--spacing)] -mx-5 -my-[2px] overflow-hidden">
            <SwipeToDelete height={container ? container.getBoundingClientRect().height : 210} onDelete={() => deleteProject(project.uuid)}>
                <div ref={containerRef} className="w-full bg-background px-5 py-2">
                    {projectComponent}
                </div>
            </SwipeToDelete>
        </div>
    ) : (
        swipeToDelete ? (
        <div className="w-[100% + 5 * var(--spacing)] -mx-5 -my-[2px] overflow-hidden">
            <div ref={containerRef} className="w-full bg-background px-5 py-2">
                {projectComponent}
            </div>
        </div>
        ) : projectComponent
    );
};

export default function Home(): ReactNode {
    const isMobile = useIsMobile();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 300);
    const [selecting, setSelecting] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [sortingType, setSortingType] = useState<SortingType>(defaultSortingType);
    const [descendingSort, setDescendingSort] = useState(false);
    const [showDeleteSelectedAlert, setShowDeleteSelectedAlert] = useState(false);

    const projects = useLiveQuery(async () => (
        await db.projects.toArray()
    ));

    const filteredProjects = projects && (
        projects
            .filter((project) => project.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
            .sort((a, b) => sortProjects(a, b, sortingType) * (descendingSort ? -1 : 1))
    );

    const newProjectForm = useForm<ProjectInfoForm>({
        resolver: zodResolver(ProjectInfoFormSchema),
        defaultValues: {
            title: "New ClipFusion Project",
            description: ""
        }
    });

    const newProjectSubmit = async (data: ProjectInfoForm) => {
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

    const handleDeleteSelected = () => {
        selectedProjects.map((uuid) => deleteProject(uuid));
        setSelectedProjects([]);
        setSelecting(false);
    };

    const context: SelectContextData = {
        selecting,
        setSelecting,
        selectedProjects,
        setSelectedProjects
    };

    return (
        <SelectContext.Provider value={context}>
            <div className="flex flex-col justify-between h-screen">
                <div className="p-5">
                    <div className="flex flex-row items-center gap-2">
                        <StaticSidebarTrigger />
                        <ScrollFadingTitle className="flex flex-row items-center gap-2">
                            <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Project Library</h2>
                            {projects && <Label className="text-muted-foreground text-sm">(Found {projects.length} projects)</Label>}
                        </ScrollFadingTitle>
                    </div>
                    <StickyTopContainer>
                        <SidebarTriggerAdjustable>
                            <div className={cn("flex flex-row gap-2 items-center w-full", !isMobile && "justify-between")}>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <PlusIcon /> {!isMobile && "New Project"}<span className="sr-only">New Project</span>
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
                                                <ProjectInfoFormFields form={newProjectForm} />
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <DialogClose onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        if (newProjectForm.formState.errors.title) e.preventDefault();
                                                    }} asChild>
                                                        <Button type="submit">Create</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                                <Search placeholder="Search Projects" value={search} onChange={(e) => setSearch(e.target.value)} className={isMobile ? "w-full" : "w-60"} />
                            </div>
                        </SidebarTriggerAdjustable>
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-row items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="ghost" asChild>
                                            <div className="flex flex-row">
                                                <SortingTypeIcon sortingType={sortingType} /> {isMobile ? "Sort" : sortingTypeToString(sortingType)}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
                                        <DropdownMenuGroup>
                                            <SortingTypeMenuItem sortingType="byCreationDate" currentSortingType={sortingType} setSortingType={setSortingType} />
                                            <SortingTypeMenuItem sortingType="byEditDate" currentSortingType={sortingType} setSortingType={setSortingType} />
                                            <SortingTypeMenuItem sortingType="byTitle" currentSortingType={sortingType} setSortingType={setSortingType} />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Toggle pressed={descendingSort} onPressedChange={(pressed) => setDescendingSort(pressed)}>
                                            {descendingSort ? <ArrowDownIcon /> : <ArrowUpIcon />}<span className="sr-only">{descendingSort ? "Switch to Ascending Sorting" : "Switch to Descending Sorting"}</span>
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {descendingSort ? "Descending" : "Ascending"}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Toggle variant="default" pressed={selecting} onPressedChange={(pressed: boolean) => {
                                setSelecting(pressed);
                                setSelectedProjects([]);
                            }}>
                                <Grid2X2CheckIcon /> {isMobile ? "Select" : "Select Projects"}
                            </Toggle>
                        </div>
                    </StickyTopContainer>
                    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 sm:gap-4 mt-2")}>
                        {filteredProjects && filteredProjects.map((project) => <ProjectContainer key={project.uuid} project={project} />)}
                    </div>
                    {(filteredProjects != undefined && filteredProjects.length == 0) && (
                        <div className="w-full h-full flex justify-center items-center">
                            <Label className="text-muted-foreground">Nothing to Show</Label>
                        </div>
                    )}
                </div>
                {selecting && (
                    <>
                        <div className="sticky bottom-0 left-0 w-full">
                            <div className="m-auto bg-background flex flex-row justify-between p-safe-or-2 z-20">
                                <div className="flex justify-begin text-red-400 grow basis-0">
                                    <Button disabled={selectedProjects.length == 0} variant="ghost" onClick={() => setShowDeleteSelectedAlert(true)}>
                                        <TrashIcon /> {!isMobile && "Delete All"}
                                    </Button>
                                </div>
                                <Label className="flex items-center">{selectedProjects.length} Projects Selected</Label>
                                <div className="flex justify-end grow basis-0 mr-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost">
                                                <EllipsisIcon /> {!isMobile && "More Options"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => filteredProjects && (selectedProjects.length == 0 ? setSelectedProjects(filteredProjects.map((project) => project.uuid)) : setSelectedProjects([]))}>
                                                    {selectedProjects.length == 0 ? <Grid2X2CheckIcon /> : <Grid2X2XIcon />} {selectedProjects.length == 0 ? "Select All" : "Deselect All"}
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <AlertDialog open={showDeleteSelectedAlert} onOpenChange={setShowDeleteSelectedAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {selectedProjects.length} Projects</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button variant="destructive" onClick={handleDeleteSelected}>
                                Delete
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SelectContext.Provider>
    );
};
