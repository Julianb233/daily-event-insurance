/**
 * Stagehand Browser Automation Client
 * Integrates with 1Password for secure credential management
 */

import { Stagehand } from "@browserbasehq/stagehand"
import { createClient } from "@1password/sdk"
import type { Page } from "@playwright/test"

export interface StagehandClientOptions {
  headless?: boolean
  verbose?: 0 | 1 | 2
}

export interface Credentials {
  username: string
  password: string
}

/**
 * Creates an authenticated Stagehand browser instance with 1Password integration
 */
export async function createStagehandClient(options: StagehandClientOptions = {}) {
  // Initialize 1Password client
  const opClient = await createClient({
    auth: process.env.OP_SERVICE_ACCOUNT_TOKEN!,
    integrationName: "Daily Event Insurance Automation",
    integrationVersion: "v1.0.0",
  })

  // Initialize Stagehand with Browserbase
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    verbose: options.verbose ?? 0,
  })

  await stagehand.init()

  // Access page via context after init - Stagehand V3 uses context.pages() method
  // Get the first page from the pages array - cast to Playwright Page type for proper typing
  const page = stagehand.context.pages()[0] as unknown as Page

  return {
    stagehand,
    page,
    opClient,

    /**
     * Retrieve credentials from 1Password vault
     * @param vaultPath - Format: "op://VaultName/ItemName"
     */
    async getCredentials(vaultPath: string): Promise<Credentials> {
      const username = await opClient.secrets.resolve(`${vaultPath}/username`)
      const password = await opClient.secrets.resolve(`${vaultPath}/password`)
      return { username, password }
    },

    /**
     * Retrieve a single secret from 1Password
     * @param secretRef - Full secret reference like "op://VaultName/ItemName/FieldName"
     */
    async getSecret(secretRef: string): Promise<string> {
      return opClient.secrets.resolve(secretRef)
    },

    /**
     * Clean up resources
     */
    async close() {
      await stagehand.close()
    },
  }
}

export type StagehandClient = Awaited<ReturnType<typeof createStagehandClient>>
