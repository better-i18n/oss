import type { APIClient } from "@better-i18n/mcp-types";
import type {
  ListContentModelsInput,
  GetContentModelInput,
  CreateContentModelInput,
  UpdateContentModelInput,
  DeleteContentModelInput,
  AddFieldInput,
  UpdateFieldInput,
  RemoveFieldInput,
  ReorderFieldsInput,
  ListContentEntriesInput,
  GetContentEntryInput,
  CreateContentEntryInput,
  UpdateContentEntryInput,
  PublishContentEntryInput,
  DeleteContentEntryInput,
  DuplicateContentEntryInput,
  BulkCreateEntriesInput,
  BulkUpdateEntriesInput,
  BulkPublishEntriesInput,
} from "@better-i18n/mcp-types";
import type { ProjectScope } from "../client.js";

type WithoutScope<T> = Omit<T, "orgSlug" | "projectSlug">;

export function createContentNamespace(client: APIClient, scope: ProjectScope) {
  return {
    models: {
      async list(input?: WithoutScope<ListContentModelsInput>) {
        return client.mcpContent.listContentModels.query({ ...scope, ...input });
      },
      async get(input: WithoutScope<GetContentModelInput>) {
        return client.mcpContent.getContentModel.query({ ...scope, ...input });
      },
      async create(input: WithoutScope<CreateContentModelInput>) {
        return client.mcpContent.createContentModel.mutate({ ...scope, ...input });
      },
      async update(input: WithoutScope<UpdateContentModelInput>) {
        return client.mcpContent.updateContentModel.mutate({ ...scope, ...input });
      },
      async delete(input: WithoutScope<DeleteContentModelInput>) {
        return client.mcpContent.deleteContentModel.mutate({ ...scope, ...input });
      },
    },

    fields: {
      async add(input: WithoutScope<AddFieldInput>) {
        return client.mcpContent.addField.mutate({ ...scope, ...input });
      },
      async update(input: WithoutScope<UpdateFieldInput>) {
        return client.mcpContent.updateField.mutate({ ...scope, ...input });
      },
      async remove(input: WithoutScope<RemoveFieldInput>) {
        return client.mcpContent.removeField.mutate({ ...scope, ...input });
      },
      async reorder(input: WithoutScope<ReorderFieldsInput>) {
        return client.mcpContent.reorderFields.mutate({ ...scope, ...input });
      },
    },

    entries: {
      async list(input?: WithoutScope<ListContentEntriesInput>) {
        return client.mcpContent.listContentEntries.query({ ...scope, ...input });
      },
      async get(input: WithoutScope<GetContentEntryInput>) {
        return client.mcpContent.getContentEntry.query({ ...scope, ...input });
      },
      async create(input: WithoutScope<CreateContentEntryInput>) {
        return client.mcpContent.createContentEntry.mutate({ ...scope, ...input });
      },
      async update(input: WithoutScope<UpdateContentEntryInput>) {
        return client.mcpContent.updateContentEntry.mutate({ ...scope, ...input });
      },
      async publish(input: WithoutScope<PublishContentEntryInput>) {
        return client.mcpContent.publishContentEntry.mutate({ ...scope, ...input });
      },
      async delete(input: WithoutScope<DeleteContentEntryInput>) {
        return client.mcpContent.deleteContentEntry.mutate({ ...scope, ...input });
      },
      async duplicate(input: WithoutScope<DuplicateContentEntryInput>) {
        return client.mcpContent.duplicateContentEntry.mutate({ ...scope, ...input });
      },
      async bulkCreate(input: WithoutScope<BulkCreateEntriesInput>) {
        return client.mcpContent.bulkCreateEntries.mutate({ ...scope, ...input });
      },
      async bulkUpdate(input: WithoutScope<BulkUpdateEntriesInput>) {
        return client.mcpContent.bulkUpdateEntries.mutate({ ...scope, ...input });
      },
      async bulkPublish(input: WithoutScope<BulkPublishEntriesInput>) {
        return client.mcpContent.bulkPublishEntries.mutate({ ...scope, ...input });
      },
    },
  };
}

export type ContentNamespace = ReturnType<typeof createContentNamespace>;
