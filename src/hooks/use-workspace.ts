import { useParams } from "next/navigation";

export function useWorkspace() {
  const params = useParams();
  return params.workspace as string;
}
