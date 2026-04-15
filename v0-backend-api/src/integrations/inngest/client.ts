import { Inngest } from "inngest";


type CodeAgentEvent = {
  data:{
    projectId:string;
    value:string
  }
}

type Events = {
  "code-agent/run" : CodeAgentEvent
}

// Create a client to send and receive events
export const inngest = new Inngest({ id: "v0-clone" });


const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const functions = [helloWorld];