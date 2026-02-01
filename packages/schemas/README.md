# @better-i18n/schemas

Shared validation schemas for API and frontend applications.

## Structure

- `src/projects/` - Project-related validation schemas
- `src/organizations/` - Organization validation schemas  
- `src/languages/` - Language validation schemas

## Usage

```typescript
import { createProjectSchema } from "@better-i18n/schemas/projects";
import { createOrganizationSchema } from "@better-i18n/schemas/organizations";

// Use in tRPC routers
create: protectedProcedure
  .input(createProjectSchema)
  .mutation(async ({ ctx, input }) => {
    // ...
  })

// Use in TanStack Form
const form = useForm({
  validatorAdapter: zodValidator(),
  validators: {
    onChange: createProjectSchema,
  },
});
```

## Benefits

- Single source of truth for validation
- Type safety across API and frontend
- DRY principle
- Consistent error messages


