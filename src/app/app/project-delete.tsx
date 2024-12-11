'use client';
import { deleteProjectAction } from '@/actions/project/delete.action';
import { AsyncButton } from '@/components/async-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

export const DeleteProject = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this project? This action is
            irreversible
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-4 justify-center sm:justify-end">
          <AsyncButton
            type="button"
            loadingContent={'Deleting...'}
            action={async () => {
              await deleteProjectAction(projectId);
            }}
          >
            Delete
          </AsyncButton>
          <Button
            variant="secondary"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
