# PRD: Mock Endpoints Hit Tracking Feature

## Executive Summary

This PRD outlines the implementation of a hit tracking system for mock endpoints in the Mocky application. The feature will add a "hits" column to the `mock_endpoints` table to track the number of requests made to each endpoint, providing users with valuable analytics about their mock API usage.

## Problem Statement

Currently, users have no visibility into how frequently their mock endpoints are being accessed. This lack of usage analytics makes it difficult for developers to:

- Understand which endpoints are most popular
- Debug issues with API consumption
- Make informed decisions about endpoint management
- Monitor API usage patterns

## Goals & Objectives

### Primary Goals
- Track the number of requests made to each mock endpoint
- Display hit counts in the dashboard interface
- Provide real-time usage analytics to users

### Secondary Goals
- Maintain high performance despite frequent database updates
- Ensure data accuracy and consistency
- Lay groundwork for future analytics features

## Requirements

### Functional Requirements

1. **FR-1**: Add a `hits` column to the `mock_endpoints` table
   - Default value: 0
   - Data type: Integer (BIGINT for scale)
   - Not null constraint

2. **FR-2**: Increment hit count on each GET request to a mock endpoint
   - Atomic increment operation
   - Handle concurrent requests safely
   - No impact on response time

3. **FR-3**: Display hit counts in the dashboard
   - Show hits in endpoint cards
   - Real-time or near-real-time updates
   - Formatted numbers for readability

4. **FR-4**: Maintain backward compatibility
   - Existing endpoints continue to work
   - No breaking changes to API

### Non-Functional Requirements

1. **NFR-1**: Performance
   - Hit tracking should not increase response time by more than 5ms
   - Database updates should be asynchronous where possible

2. **NFR-2**: Scalability
   - Handle high-frequency endpoints (1000+ requests/minute)
   - Efficient database indexing

3. **NFR-3**: Data Integrity
   - Accurate hit counts despite concurrent access
   - No data loss during updates

4. **NFR-4**: Security
   - Users can only view hits for their own endpoints
   - Hit counts cannot be manipulated by users

## Technical Specifications

### Database Schema Changes

```sql
-- Add hits column to mock_endpoints table
ALTER TABLE public.mock_endpoints 
ADD COLUMN hits BIGINT NOT NULL DEFAULT 0;

-- Create index for performance
CREATE INDEX idx_mock_endpoints_hits ON public.mock_endpoints(hits);
```

### API Changes

The mock endpoint handler will be updated to:
1. Serve the mock response as usual
2. Asynchronously increment the hits counter
3. Handle database errors gracefully

### Data Model Updates

```typescript
interface MockEndpoint {
  id: string;
  config: MockConfig;
  endpoint: string;
  created_at: string;
  expires_at: string;
  user_id?: string;
  hits: number; // New field
}
```

## Implementation Plan

### Phase 1: Database Schema Migration

**Objective**: Add the hits column to the database schema

**Steps**:
1. Create migration SQL file
2. Apply migration using Supabase MCP server
3. Verify schema changes
4. Update RLS policies if needed

**Files to Create/Modify**:
- `sql/add_hits_column.sql` (new)

**Supabase MCP Server Usage**:
```typescript
// Apply migration
await f1e_apply_migration({
  project_id: "your-project-id",
  name: "add_hits_column",
  query: migrationSQL
});

// Verify table structure
await f1e_execute_sql({
  project_id: "your-project-id", 
  query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'mock_endpoints';"
});
```

### Phase 2: API Implementation

**Objective**: Update the mock endpoint handler to track hits

**Steps**:
1. Modify the mock endpoint GET handler
2. Add atomic increment functionality
3. Implement error handling
4. Add logging for debugging

**Files to Modify**:
- `src/app/api/mock/[id]/route.ts`
- `src/lib/supabase.ts` (if needed)

**Implementation Details**:
```typescript
// In the GET handler
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Fetch mock endpoint data
    const endpoint = await fetchMockEndpoint(params.id);
    
    // 2. Increment hits (asynchronous)
    incrementHits(params.id).catch(console.error);
    
    // 3. Return mock response
    return generateMockResponse(endpoint.config);
  } catch (error) {
    return handleError(error);
  }
}

// Atomic increment function
async function incrementHits(endpointId: string) {
  await f1e_execute_sql({
    project_id: process.env.SUPABASE_PROJECT_ID!,
    query: `UPDATE mock_endpoints SET hits = hits + 1 WHERE id = $1`,
    // Note: Actual implementation may vary based on Supabase client
  });
}
```

### Phase 3: Frontend Updates

**Objective**: Display hit counts in the user interface

**Steps**:
1. Update TypeScript interfaces
2. Modify dashboard components
3. Add hit count display to endpoint cards
4. Update data fetching queries

**Files to Modify**:
- `src/types/index.ts`
- `src/components/dashboard/EndpointCard.tsx`
- `src/components/dashboard/DashboardOverview.tsx`
- Dashboard query hooks

**UI Implementation**:
```tsx
// In EndpointCard component
<div className="flex items-center justify-between">
  <span className="text-sm text-muted-foreground">
    {formatNumber(endpoint.hits)} hits
  </span>
  <Badge variant="secondary">
    {endpoint.hits > 1000 ? 'Popular' : 'New'}
  </Badge>
</div>
```

### Phase 4: Testing & Validation

**Objective**: Ensure feature works correctly and performs well

**Steps**:
1. Unit tests for hit increment functionality
2. Integration tests for API endpoints
3. Performance testing under load
4. Manual testing of dashboard updates

## Detailed File Modifications

### 1. Database Migration

**File**: `sql/add_hits_column.sql`
```sql
-- Add hits tracking to mock_endpoints table
ALTER TABLE public.mock_endpoints 
ADD COLUMN IF NOT EXISTS hits BIGINT NOT NULL DEFAULT 0;

-- Create index for performance queries
CREATE INDEX IF NOT EXISTS idx_mock_endpoints_hits 
ON public.mock_endpoints(hits);

-- Update existing records to have 0 hits
UPDATE public.mock_endpoints 
SET hits = 0 
WHERE hits IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.mock_endpoints.hits IS 'Number of times this endpoint has been accessed';
```

### 2. API Route Handler

**File**: `src/app/api/mock/[id]/route.ts`
- Add hit tracking logic to GET method
- Implement atomic increment using Supabase MCP server
- Add error handling and logging

### 3. Type Definitions

**File**: `src/types/index.ts`
- Update `MockEndpoint` interface to include `hits: number`
- Update related types and schemas

### 4. Dashboard Components

**Files to Update**:
- `src/components/dashboard/EndpointCard.tsx`
- `src/components/dashboard/DashboardOverview.tsx`  
- `src/components/dashboard/analytics/` (future analytics components)

### 5. Database Client

**File**: `src/lib/supabase.ts`
- Add helper functions for hit tracking
- Ensure proper error handling

## Performance Considerations

### Database Performance
- Use BIGINT for hits column to handle high traffic
- Index the hits column for efficient sorting/filtering
- Consider connection pooling for high-frequency updates

### Application Performance
- Implement asynchronous hit tracking to avoid blocking responses
- Use database-level atomic operations to prevent race conditions
- Consider batching updates for very high-traffic scenarios

### Monitoring
- Add logging for hit tracking operations
- Monitor database performance impact
- Track API response times

## Security Considerations

### Data Access
- Maintain existing RLS policies
- Users can only view hits for their own endpoints
- No sensitive data exposure through hit counts

### Data Integrity
- Prevent hit count manipulation
- Use server-side increment only
- Validate endpoint ownership before incrementing

## Testing Strategy

### Unit Tests
- Test hit increment functionality
- Test dashboard component rendering
- Test type safety with new schema

### Integration Tests
- End-to-end API request with hit tracking
- Database migration testing
- Dashboard data fetching

### Performance Tests
- Load testing with concurrent requests
- Database performance under high hit frequency
- Memory usage monitoring

### Manual Testing
- Verify hit counts update in real-time
- Test across different user accounts
- Validate hit tracking for expired endpoints

## Success Metrics

### Technical Metrics
- ✅ Zero increase in average API response time
- ✅ 99.9% accuracy in hit counting
- ✅ Successful handling of 1000+ concurrent requests
- ✅ Zero data loss during database updates

### User Experience Metrics
- ✅ Hit counts visible in dashboard within 1 second
- ✅ No breaking changes to existing functionality
- ✅ Intuitive display of usage analytics

## Risk Assessment

### High Risk
- **Database Performance**: Frequent updates could impact performance
  - *Mitigation*: Asynchronous updates, proper indexing
  
- **Race Conditions**: Concurrent requests could cause inaccurate counts
  - *Mitigation*: Atomic database operations

### Medium Risk
- **Migration Issues**: Schema changes could affect existing data
  - *Mitigation*: Thorough testing, backup procedures

### Low Risk
- **UI Display Issues**: Frontend rendering problems
  - *Mitigation*: Comprehensive component testing

## Dependencies

### External Dependencies
- Supabase MCP Server for database operations
- Existing authentication system
- Current dashboard infrastructure

### Internal Dependencies
- Mock endpoint serving functionality
- User authentication and authorization
- Database connection management

## Timeline

### Phase 1: Database Migration (1-2 days)
- Create and test migration script
- Apply using Supabase MCP server
- Verify schema changes

### Phase 2: API Implementation (2-3 days)
- Update mock endpoint handler
- Implement hit tracking logic
- Add comprehensive testing

### Phase 3: Frontend Updates (2-3 days)
- Update TypeScript types
- Modify dashboard components
- Add UI for hit display

### Phase 4: Testing & Polish (2-3 days)
- Performance testing
- Bug fixes and optimization
- Documentation updates

**Total Estimated Timeline**: 7-11 days

## Future Enhancements

### Analytics Dashboard
- Detailed usage analytics
- Hit trends over time
- Peak usage identification

### Advanced Tracking
- Track different HTTP methods separately
- Geographic usage data
- Response time analytics

### Rate Limiting
- Use hit data for intelligent rate limiting
- Tiered access based on usage patterns

## Conclusion

This PRD provides a comprehensive plan for implementing hit tracking in the Mocky application. The feature will provide valuable usage analytics while maintaining high performance and security standards. The phased implementation approach ensures minimal risk and allows for iterative improvements.

The use of Supabase MCP server for all database operations ensures consistency with the existing architecture and provides reliable, scalable data management for the hits tracking feature.
