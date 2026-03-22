"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(`/api/invites/${params.token}`);
        if (!res.ok) {
          throw new Error("Invalid or expired invite");
        }
        const data = await res.json();
        setInvite(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [params.token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/invites/${params.token}`, {
        method: "POST",
      });
      if (res.ok) {
        router.push("/"); // Will redirect to workspace dashboard
      } else {
        const data = await res.json();
        setError(data.error || "Failed to accept invite");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setAccepting(false);
    }
  };

  if (loading || sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Invite Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/">Go Home</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>You've been invited!</CardTitle>
            <CardDescription>
              {invite.inviterName} invited you to join <strong>{invite.workspaceName}</strong> as a {invite.role}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Please sign in or create an account to accept this invitation.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => signIn(undefined, { callbackUrl: `/invite/${params.token}` })}
              >
                Sign In / Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            Join <strong>{invite.workspaceName}</strong> as <strong>{session.user?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">
            You are logged in as {session.user?.name}. Accepting this invite will grant you {invite.role} access.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleAccept} disabled={accepting}>
            {accepting ? "Joining..." : "Accept Invite"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => signIn()}>
            Not you? Switch account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
