import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
  date,
  index,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role',
  ['admin', 'contributor', 'viewer']
);

export const confidenceEnum = pgEnum('confidence_level',
  ['high', 'medium', 'low']
);

export const decisionStatusEnum = pgEnum('decision_status', [
  'active',
  'reviewing',
  'validated',
  'invalidated',
  'inconclusive',
]);

export const outcomeStatusEnum = pgEnum('outcome_status', [
  'validated',
  'invalidated',
  'inconclusive',
  'too_early',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: roleEnum('role').notNull().default('contributor'),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceUserIdx: index('workspace_user_idx')
      .on(table.workspaceId, table.userId),
  })
);

export const decisions = pgTable(
  'decisions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    problemStatement: text('problem_statement'),
    context: text('context'),
    optionsConsidered: jsonb('options_considered')
      .$type<Array<{
        option: string;
        pros: string[];
        cons: string[];
      }>>(),
    chosenOption: text('chosen_option'),
    rejectionReasons: text('rejection_reasons'),
    evidence: jsonb('evidence')
      .$type<Array<{
        label: string;
        url?: string;
        text?: string;
      }>>(),
    hypothesis: text('hypothesis'),
    confidenceLevel: confidenceEnum('confidence_level'),
    status: decisionStatusEnum('status')
      .notNull()
      .default('active'),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id),
    parentDecisionId: uuid('parent_decision_id'),
    tags: text('tags').array(),
    reviewDate: date('review_date'),
    isGraveyard: boolean('is_graveyard').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index('decisions_workspace_idx')
      .on(table.workspaceId),
    ownerIdx: index('decisions_owner_idx')
      .on(table.ownerId),
    reviewDateIdx: index('decisions_review_date_idx')
      .on(table.reviewDate),
  })
);

export const outcomes = pgTable('outcomes', {
  id: uuid('id').primaryKey().defaultRandom(),
  decisionId: uuid('decision_id')
    .notNull()
    .references(() => decisions.id, { onDelete: 'cascade' }),
  actualResult: text('actual_result').notNull(),
  status: outcomeStatusEnum('status').notNull(),
  reviewedBy: uuid('reviewed_by')
    .notNull()
    .references(() => users.id),
  reviewedAt: timestamp('reviewed_at').defaultNow().notNull(),
  notes: text('notes'),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  decisionId: uuid('decision_id')
    .notNull()
    .references(() => decisions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: roleEnum('role').notNull().default('contributor'),
  token: text('token').notNull().unique(),
  invitedBy: uuid('invited_by')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
});

export const actionTypeEnum = pgEnum("action_type", [
  "created",
  "updated",
  "status_changed",
  "commented",
  "outcome_logged",
  "archived",
  "restored",
]);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    decisionId: uuid("decision_id")
      .notNull()
      .references(() => decisions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    actionType: actionTypeEnum("action_type").notNull(),
    details: jsonb("details").$type<Record<string, any>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("activity_logs_workspace_idx").on(
      table.workspaceId
    ),
    decisionIdx: index("activity_logs_decision_idx").on(
      table.decisionId
    ),
    createdAtIdx: index("activity_logs_created_at_idx").on(
      table.createdAt
    ),
  })
);

export type User = typeof users.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type WorkspaceMember =
  typeof workspaceMembers.$inferSelect;
export type Decision = typeof decisions.$inferSelect;
export type Outcome = typeof outcomes.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Invite = typeof invites.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
