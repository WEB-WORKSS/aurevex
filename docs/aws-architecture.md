# Aurevex AWS architecture

**Status: proposed.** No AWS service is deployed yet. The current web app runs on Vite/React with Supabase for auth and data.

Data collection → Secure storage → Processing → AI intelligence → Application

- Amazon EventBridge: Schedules source checks and deadline reminder events.
- Amazon S3: Stores uploaded regulatory documents, version history and compliance evidence.
- Amazon Textract: Extracts text, tables and forms from scanned regulations and permits.
- AWS Lambda: Runs document analysis, version comparison and notification workflows.
- AWS Step Functions: Coordinates the multi-step ingest → extract → review pipeline.
- Amazon Bedrock: Interprets clauses into draft obligations and explains changes between versions, for human review.
- Amazon DynamoDB: Stores obligations, deadlines, owners and workspace records.
- Amazon API Gateway: Provides the managed API between the web app and the pipeline.
- Amazon Cognito: Manages user identities in production (would replace Supabase Auth).
- Amazon Simple Email Service: Sends deadline reminders and change alerts.
- Amazon CloudWatch: Logs, metrics and alarms.

Source of truth: `src/data/business.js` (`aws`, `stages`).
