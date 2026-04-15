import { Sandbox } from 'e2b'
import { inngest } from "./client.js";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: [{ event: "code-agent/run" }] },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id" , async()=>{
      const sandbox = await Sandbox.create("v0-application-clone-1");

      return sandbox.sandboxId;
    })
  },
);
