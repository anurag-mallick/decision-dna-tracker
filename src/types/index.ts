export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type DecisionStatus =
  | 'active'
  | 'reviewing'
  | 'validated'
  | 'invalidated'
  | 'inconclusive';
export type OutcomeStatus =
  | 'validated'
  | 'invalidated'
  | 'inconclusive'
  | 'too_early';
export type Role = 'admin' | 'contributor' | 'viewer';

export interface OptionConsidered {
  option: string;
  pros: string[];
  cons: string[];
}

export interface Evidence {
  label: string;
  url?: string;
  text?: string;
}

export interface DecisionWithOwner {
  id: string;
  title: string;
  problemStatement: string | null;
  hypothesis: string | null;
  confidenceLevel: ConfidenceLevel | null;
  status: DecisionStatus;
  tags: string[] | null;
  reviewDate: string | null;
  isGraveyard: boolean;
  createdAt: Date;
  owner: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  outcome?: {
    status: OutcomeStatus;
    actualResult: string;
  } | null;
}