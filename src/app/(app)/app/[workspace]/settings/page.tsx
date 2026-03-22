import { db } from "@/lib/db";
import { workspaces, workspaceMembers, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { User, Settings, Users, Shield, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: workspaceSlug } = await params;

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, workspaceSlug))
    .limit(1);

  if (!workspace) return null;

  const members = await db
    .select({
      id: workspaceMembers.id,
      role: workspaceMembers.role,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, workspace.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your workspace preferences and team members.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-zinc-400" />
              Workspace Information
            </CardTitle>
            <CardDescription>
              Basic details about your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium text-zinc-500">Name</span>
              <p className="text-lg font-semibold">{workspace.name}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium text-zinc-500">Slug</span>
              <p className="font-mono text-sm bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded w-fit">
                {workspace.slug}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-400" />
                Team Members
              </CardTitle>
              <CardDescription>
                People who have access to this workspace.
              </CardDescription>
            </div>
            <Button size="sm">Invite Member</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.user.avatarUrl || ""} />
                      <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{member.user.name}</p>
                      <p className="text-sm text-zinc-500">{member.user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize gap-1">
                    {member.role === 'admin' && <Shield className="h-3 w-3" />}
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Leave Workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
