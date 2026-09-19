"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProjectMembers,
  useAddProjectMember,
  useUpdateProjectMemberRole,
  useRemoveProjectMember,
  useLeaveProject,
  useTransferProjectOwnership,
  useSearchUsers,
} from "../hooks";
import type { Project, ProjectRole } from "../types";

type ProjectMembersDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ROLE_COLORS: Record<ProjectRole, string> = {
  owner: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  admin: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  member: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  viewer: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
};

export function ProjectMembersDialog({
  project,
  open,
  onOpenChange,
}: ProjectMembersDialogProps) {
  const { data: members, isLoading } = useProjectMembers(project.id);
  const addMemberMutation = useAddProjectMember(project.id);
  const updateRoleMutation = useUpdateProjectMemberRole(project.id);
  const removeMemberMutation = useRemoveProjectMember(project.id);
  const leaveProjectMutation = useLeaveProject(project.id);
  const transferOwnershipMutation = useTransferProjectOwnership(project.id);

  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<ProjectRole>("member");
  const [transferUserId, setTransferUserId] = useState<number | null>(null);
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);

  const { data: searchedUsers } = useSearchUsers(userSearch);

  const canManageMembers =
    project.user_permissions?.can_manage_members ??
    (project.current_user_role === "owner" || project.current_user_role === "admin");

  const canChangeRoles =
    project.user_permissions?.can_change_roles ??
    (project.current_user_role === "owner" || project.current_user_role === "admin");

  const isOwner = project.current_user_role === "owner";

  // Filter out users who are already members
  const existingUserIds = new Set(members?.map((m) => m.user) ?? []);
  const availableUsers = searchedUsers?.filter((u) => !existingUserIds.has(u.id)) ?? [];

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    await addMemberMutation.mutateAsync({
      user: selectedUserId,
      role: selectedRole,
    });
    setSelectedUserId(null);
    setUserSearch("");
  };

  const handleLeaveProject = async () => {
    if (confirm("Are you sure you want to leave this project?")) {
      await leaveProjectMutation.mutateAsync();
      onOpenChange(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferUserId) return;
    if (
      confirm(
        "Are you sure you want to transfer ownership? You will be demoted to Admin."
      )
    ) {
      await transferOwnershipMutation.mutateAsync(transferUserId);
      setShowTransferConfirm(false);
      setTransferUserId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            <span>Project Members</span>
            {project.current_user_role && (
              <Badge
                variant="outline"
                className={`uppercase text-xs font-semibold ${
                  ROLE_COLORS[project.current_user_role]
                }`}
              >
                Your role: {project.current_user_role}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Manage team members, roles, and project access permissions.
          </DialogDescription>
        </DialogHeader>

        {/* Add Member Section */}
        {canManageMembers && (
          <div className="rounded-lg border p-4 bg-muted/40 space-y-3">
            <h4 className="text-sm font-semibold">Add New Member</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search user by username or email..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setSelectedUserId(null);
                  }}
                  className="w-full"
                />

                {userSearch.length >= 2 && availableUsers.length > 0 && !selectedUserId && (
                  <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setUserSearch(`${user.name} (@${user.username})`);
                        }}
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Select
                value={selectedRole}
                onValueChange={(val) => setSelectedRole(val as ProjectRole)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddMember}
                disabled={!selectedUserId || addMemberMutation.isPending}
              >
                {addMemberMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-3 mt-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Members ({members?.length ?? 0})
          </h4>

          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading members...
            </div>
          ) : members?.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No members found.
            </div>
          ) : (
            <div className="divide-y rounded-lg border">
              {members?.map((member) => {
                const isMemberOwner = member.role === "owner";
                return (
                  <div
                    key={member.id}
                    className="p-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">
                          {member.username}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${
                            ROLE_COLORS[member.role]
                          }`}
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {canChangeRoles && !isMemberOwner ? (
                        <Select
                          value={member.role}
                          onValueChange={(newRole) => {
                            updateRoleMutation.mutate({
                              membershipId: member.id,
                              role: newRole as ProjectRole,
                            });
                          }}
                          disabled={updateRoleMutation.isPending}
                        >
                          <SelectTrigger className="h-8 w-[105px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : null}

                      {canManageMembers && !isMemberOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Remove ${member.username} from this project?`
                              )
                            ) {
                              removeMemberMutation.mutate(member.id);
                            }
                          }}
                          disabled={removeMemberMutation.isPending}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ownership Transfer & Leave Project Actions */}
        <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3">
          {isOwner && (
            <div className="flex items-center gap-2">
              <Select
                value={transferUserId ? String(transferUserId) : ""}
                onValueChange={(val) => setTransferUserId(Number(val))}
              >
                <SelectTrigger className="h-8 w-[170px] text-xs">
                  <SelectValue placeholder="Transfer ownership to..." />
                </SelectTrigger>
                <SelectContent>
                  {members
                    ?.filter((m) => m.role !== "owner")
                    .map((m) => (
                      <SelectItem key={m.user} value={String(m.user)}>
                        {m.username} ({m.role})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
                disabled={!transferUserId || transferOwnershipMutation.isPending}
                onClick={handleTransferOwnership}
              >
                Transfer
              </Button>
            </div>
          )}

          {!isOwner && (
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-8 ml-auto"
              onClick={handleLeaveProject}
              disabled={leaveProjectMutation.isPending}
            >
              Leave Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
