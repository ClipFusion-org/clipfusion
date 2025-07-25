"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { isStoragePersisted, persist, tryPersistWithoutPromtingUser } from "@/lib/db";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface PersistenceContextData {
    persist: () => void;
}

const PersistenceContext = createContext<PersistenceContextData | null>(null);

export const usePersistenceContext = (): PersistenceContextData => {
    const context = useContext(PersistenceContext);
    if (context == null) throw new Error("PersistenceContext is not provided!");
    return context;
}

const PersistenceProvider = ({
    children
}: {
    children: ReactNode
}): ReactNode => {
    const [persistenceAlertOpen, setPersistenceAlertOpen] = useState(false);
    const [requestPersistenceAlertOpen, setRequestPersistenceOpen] = useState(false);

    useEffect(() => {
        const tryToPersist = async () => {
            const isPersistent = await isStoragePersisted();
            if (!isPersistent) {
                if ((localStorage.getItem('persistence-status') !== "persisted" && localStorage.getItem('persistence-status') === undefined) || localStorage.getItem('persistence-status') === "") {
                    const persistenceStatus = await tryPersistWithoutPromtingUser();
                    localStorage.setItem("persistence-status", persistenceStatus);
                    if (persistenceStatus == "never") {
                        setPersistenceAlertOpen(true);
                    }
                    if (persistenceStatus == "prompt") {
                        setRequestPersistenceOpen(true);
                    }
                }
            }
        };

        tryToPersist();
    }, []);

    const allowPersistenceStorage = async () => {
        const persistResult = await persist();
        if (persistResult === false) {
            toast("Failed to Enable Persistent Storage", {
                description: "Browser denied request for persistent storage"
            })
            return;
        }
        if (persistResult === undefined) {
            toast("Failed to Enable Persistent Storage", {
                description: "Persistent storage is not supported by your browser"
            });
            return;
        }
        localStorage.setItem('persistence-status', "persisted");
    };

    return (
        <>
            <PersistenceContext.Provider value={{persist: () => setRequestPersistenceOpen(true)}}>
                {children}
            </PersistenceContext.Provider>
            <AlertDialog open={persistenceAlertOpen} onOpenChange={setPersistenceAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Persistent Storage is Unavailable
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Browser may delete your local data to free up space for other websites
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={requestPersistenceAlertOpen} onOpenChange={setRequestPersistenceOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Enable Persistent Storage
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Persistent storage prevents browser from deleting your local data to free up space for other websites. You can enable persistent storage later in settings
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={allowPersistenceStorage}>
                            Enable
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default PersistenceProvider;