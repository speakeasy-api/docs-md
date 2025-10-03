import * as z from 'zod';
import { z as z_2 } from 'zod';

declare const __brand: unique symbol;

declare class Accesses extends ClientSDK {
    /**
     * List all of the access to this library.
     *
     * @remarks
     * Given a library, list all of the Entity that have access and to what level.
     */
    list(request: operations.LibrariesShareListV1Request, options?: RequestOptions): Promise<components.ListSharingOut>;
    /**
     * Create or update an access level.
     *
     * @remarks
     * Given a library id, you can create or update the access level of an entity. You have to be owner of the library to share a library. An owner cannot change their own role. A library cannot be shared outside of the organization.
     */
    updateOrCreate(request: operations.LibrariesShareCreateV1Request, options?: RequestOptions): Promise<components.SharingOut>;
    /**
     * Delete an access level.
     *
     * @remarks
     * Given a library id, you can delete the access level of an entity. An owner cannot delete it's own access. You have to be the owner of the library to delete an acces other than yours.
     */
    delete(request: operations.LibrariesShareDeleteV1Request, options?: RequestOptions): Promise<components.SharingOut>;
}

declare type AfterErrorContext = HookContext & {};

declare interface AfterErrorHook {
    /**
     * A hook that is called after the SDK encounters an error, or a
     * non-successful response. The hook can introduce instrumentation code such
     * as logging, tracing and metrics or modify the response or error values.
     */
    afterError: (hookCtx: AfterErrorContext, response: Response | null, error: unknown) => Awaitable_2<{
        response: Response | null;
        error: unknown;
    }>;
}

declare type AfterSuccessContext = HookContext & {};

declare interface AfterSuccessHook {
    /**
     * A hook that is called after the SDK receives a response. The hook can
     * introduce instrumentation code such as logging, tracing and metrics or
     * modify the response before it is handled or throw an error to stop the
     * response from being handled.
     */
    afterSuccess: (hookCtx: AfterSuccessContext, response: Response) => Awaitable_2<Response>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Agent$ {
    /** @deprecated use `Agent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Agent, z.ZodTypeDef, unknown>;
    /** @deprecated use `Agent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Agent$Outbound, z.ZodTypeDef, Agent>;
    /** @deprecated use `Agent$Outbound` instead. */
    type Outbound = Agent$Outbound;
}

/** @internal */
declare const Agent$inboundSchema: z.ZodType<Agent, z.ZodTypeDef, unknown>;

/** @internal */
declare type Agent$Outbound = {
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool$Outbound & {
        type: "document_library";
    }) | (FunctionTool$Outbound & {
        type: "function";
    }) | (CodeInterpreterTool$Outbound & {
        type: "code_interpreter";
    }) | (ImageGenerationTool$Outbound & {
        type: "image_generation";
    }) | (WebSearchTool$Outbound & {
        type: "web_search";
    }) | (WebSearchPremiumTool$Outbound & {
        type: "web_search_premium";
    })> | undefined;
    completion_args?: CompletionArgs$Outbound | undefined;
    model: string;
    name: string;
    description?: string | null | undefined;
    handoffs?: Array<string> | null | undefined;
    object: string;
    id: string;
    version: number;
    created_at: string;
    updated_at: string;
};

/** @internal */
declare const Agent$outboundSchema: z.ZodType<Agent$Outbound, z.ZodTypeDef, Agent>;

declare type Agent = {
    /**
     * Instruction prompt the model will follow during the conversation.
     */
    instructions?: string | null | undefined;
    /**
     * List of tools which are available to the model during the conversation.
     */
    tools?: Array<(DocumentLibraryTool & {
        type: "document_library";
    }) | (FunctionTool & {
        type: "function";
    }) | (CodeInterpreterTool & {
        type: "code_interpreter";
    }) | (ImageGenerationTool & {
        type: "image_generation";
    }) | (WebSearchTool & {
        type: "web_search";
    }) | (WebSearchPremiumTool & {
        type: "web_search_premium";
    })> | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
    model: string;
    name: string;
    description?: string | null | undefined;
    handoffs?: Array<string> | null | undefined;
    object?: AgentObject | undefined;
    id: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentConversation$ {
    /** @deprecated use `AgentConversation$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentConversation, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentConversation$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentConversation$Outbound, z.ZodTypeDef, AgentConversation>;
    /** @deprecated use `AgentConversation$Outbound` instead. */
    type Outbound = AgentConversation$Outbound;
}

/** @internal */
declare const AgentConversation$inboundSchema: z.ZodType<AgentConversation, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentConversation$Outbound = {
    name?: string | null | undefined;
    description?: string | null | undefined;
    object: string;
    id: string;
    created_at: string;
    updated_at: string;
    agent_id: string;
};

/** @internal */
declare const AgentConversation$outboundSchema: z.ZodType<AgentConversation$Outbound, z.ZodTypeDef, AgentConversation>;

declare type AgentConversation = {
    /**
     * Name given to the conversation.
     */
    name?: string | null | undefined;
    /**
     * Description of the what the conversation is about.
     */
    description?: string | null | undefined;
    object?: AgentConversationObject | undefined;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    agentId: string;
};

declare function agentConversationFromJSON(jsonString: string): Result<AgentConversation, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentConversationObject$ {
    /** @deprecated use `AgentConversationObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Conversation: "conversation";
    }>;
    /** @deprecated use `AgentConversationObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Conversation: "conversation";
    }>;
}

/** @internal */
declare const AgentConversationObject$inboundSchema: z.ZodNativeEnum<typeof AgentConversationObject>;

/** @internal */
declare const AgentConversationObject$outboundSchema: z.ZodNativeEnum<typeof AgentConversationObject>;

declare const AgentConversationObject: {
    readonly Conversation: "conversation";
};

declare type AgentConversationObject = ClosedEnum<typeof AgentConversationObject>;

declare function agentConversationToJSON(agentConversation: AgentConversation): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentCreationRequest$ {
    /** @deprecated use `AgentCreationRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentCreationRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentCreationRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentCreationRequest$Outbound, z.ZodTypeDef, AgentCreationRequest>;
    /** @deprecated use `AgentCreationRequest$Outbound` instead. */
    type Outbound = AgentCreationRequest$Outbound;
}

/** @internal */
declare const AgentCreationRequest$inboundSchema: z.ZodType<AgentCreationRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentCreationRequest$Outbound = {
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool$Outbound & {
        type: "document_library";
    }) | (FunctionTool$Outbound & {
        type: "function";
    }) | (CodeInterpreterTool$Outbound & {
        type: "code_interpreter";
    }) | (ImageGenerationTool$Outbound & {
        type: "image_generation";
    }) | (WebSearchTool$Outbound & {
        type: "web_search";
    }) | (WebSearchPremiumTool$Outbound & {
        type: "web_search_premium";
    })> | undefined;
    completion_args?: CompletionArgs$Outbound | undefined;
    model: string;
    name: string;
    description?: string | null | undefined;
    handoffs?: Array<string> | null | undefined;
};

/** @internal */
declare const AgentCreationRequest$outboundSchema: z.ZodType<AgentCreationRequest$Outbound, z.ZodTypeDef, AgentCreationRequest>;

declare type AgentCreationRequest = {
    /**
     * Instruction prompt the model will follow during the conversation.
     */
    instructions?: string | null | undefined;
    /**
     * List of tools which are available to the model during the conversation.
     */
    tools?: Array<(DocumentLibraryTool & {
        type: "document_library";
    }) | (FunctionTool & {
        type: "function";
    }) | (CodeInterpreterTool & {
        type: "code_interpreter";
    }) | (ImageGenerationTool & {
        type: "image_generation";
    }) | (WebSearchTool & {
        type: "web_search";
    }) | (WebSearchPremiumTool & {
        type: "web_search_premium";
    })> | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
    model: string;
    name: string;
    description?: string | null | undefined;
    handoffs?: Array<string> | null | undefined;
};

declare function agentCreationRequestFromJSON(jsonString: string): Result<AgentCreationRequest, SDKValidationError>;

declare function agentCreationRequestToJSON(agentCreationRequest: AgentCreationRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentCreationRequestTools$ {
    /** @deprecated use `AgentCreationRequestTools$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentCreationRequestTools, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentCreationRequestTools$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentCreationRequestTools$Outbound, z.ZodTypeDef, AgentCreationRequestTools>;
    /** @deprecated use `AgentCreationRequestTools$Outbound` instead. */
    type Outbound = AgentCreationRequestTools$Outbound;
}

/** @internal */
declare const AgentCreationRequestTools$inboundSchema: z.ZodType<AgentCreationRequestTools, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentCreationRequestTools$Outbound = (DocumentLibraryTool$Outbound & {
    type: "document_library";
}) | (FunctionTool$Outbound & {
    type: "function";
}) | (CodeInterpreterTool$Outbound & {
    type: "code_interpreter";
}) | (ImageGenerationTool$Outbound & {
    type: "image_generation";
}) | (WebSearchTool$Outbound & {
    type: "web_search";
}) | (WebSearchPremiumTool$Outbound & {
    type: "web_search_premium";
});

/** @internal */
declare const AgentCreationRequestTools$outboundSchema: z.ZodType<AgentCreationRequestTools$Outbound, z.ZodTypeDef, AgentCreationRequestTools>;

declare type AgentCreationRequestTools = (DocumentLibraryTool & {
    type: "document_library";
}) | (FunctionTool & {
    type: "function";
}) | (CodeInterpreterTool & {
    type: "code_interpreter";
}) | (ImageGenerationTool & {
    type: "image_generation";
}) | (WebSearchTool & {
    type: "web_search";
}) | (WebSearchPremiumTool & {
    type: "web_search_premium";
});

declare function agentCreationRequestToolsFromJSON(jsonString: string): Result<AgentCreationRequestTools, SDKValidationError>;

declare function agentCreationRequestToolsToJSON(agentCreationRequestTools: AgentCreationRequestTools): string;

declare function agentFromJSON(jsonString: string): Result<Agent, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffDoneEvent$ {
    /** @deprecated use `AgentHandoffDoneEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentHandoffDoneEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentHandoffDoneEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentHandoffDoneEvent$Outbound, z.ZodTypeDef, AgentHandoffDoneEvent>;
    /** @deprecated use `AgentHandoffDoneEvent$Outbound` instead. */
    type Outbound = AgentHandoffDoneEvent$Outbound;
}

/** @internal */
declare const AgentHandoffDoneEvent$inboundSchema: z.ZodType<AgentHandoffDoneEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentHandoffDoneEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    next_agent_id: string;
    next_agent_name: string;
};

/** @internal */
declare const AgentHandoffDoneEvent$outboundSchema: z.ZodType<AgentHandoffDoneEvent$Outbound, z.ZodTypeDef, AgentHandoffDoneEvent>;

declare type AgentHandoffDoneEvent = {
    type?: AgentHandoffDoneEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    nextAgentId: string;
    nextAgentName: string;
};

declare function agentHandoffDoneEventFromJSON(jsonString: string): Result<AgentHandoffDoneEvent, SDKValidationError>;

declare function agentHandoffDoneEventToJSON(agentHandoffDoneEvent: AgentHandoffDoneEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffDoneEventType$ {
    /** @deprecated use `AgentHandoffDoneEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly AgentHandoffDone: "agent.handoff.done";
    }>;
    /** @deprecated use `AgentHandoffDoneEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly AgentHandoffDone: "agent.handoff.done";
    }>;
}

/** @internal */
declare const AgentHandoffDoneEventType$inboundSchema: z.ZodNativeEnum<typeof AgentHandoffDoneEventType>;

/** @internal */
declare const AgentHandoffDoneEventType$outboundSchema: z.ZodNativeEnum<typeof AgentHandoffDoneEventType>;

declare const AgentHandoffDoneEventType: {
    readonly AgentHandoffDone: "agent.handoff.done";
};

declare type AgentHandoffDoneEventType = ClosedEnum<typeof AgentHandoffDoneEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffEntry$ {
    /** @deprecated use `AgentHandoffEntry$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentHandoffEntry, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentHandoffEntry$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentHandoffEntry$Outbound, z.ZodTypeDef, AgentHandoffEntry>;
    /** @deprecated use `AgentHandoffEntry$Outbound` instead. */
    type Outbound = AgentHandoffEntry$Outbound;
}

/** @internal */
declare const AgentHandoffEntry$inboundSchema: z.ZodType<AgentHandoffEntry, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentHandoffEntry$Outbound = {
    object: string;
    type: string;
    created_at?: string | undefined;
    completed_at?: string | null | undefined;
    id?: string | undefined;
    previous_agent_id: string;
    previous_agent_name: string;
    next_agent_id: string;
    next_agent_name: string;
};

/** @internal */
declare const AgentHandoffEntry$outboundSchema: z.ZodType<AgentHandoffEntry$Outbound, z.ZodTypeDef, AgentHandoffEntry>;

declare type AgentHandoffEntry = {
    object?: AgentHandoffEntryObject | undefined;
    type?: AgentHandoffEntryType | undefined;
    createdAt?: Date | undefined;
    completedAt?: Date | null | undefined;
    id?: string | undefined;
    previousAgentId: string;
    previousAgentName: string;
    nextAgentId: string;
    nextAgentName: string;
};

declare function agentHandoffEntryFromJSON(jsonString: string): Result<AgentHandoffEntry, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffEntryObject$ {
    /** @deprecated use `AgentHandoffEntryObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
    /** @deprecated use `AgentHandoffEntryObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
}

/** @internal */
declare const AgentHandoffEntryObject$inboundSchema: z.ZodNativeEnum<typeof AgentHandoffEntryObject>;

/** @internal */
declare const AgentHandoffEntryObject$outboundSchema: z.ZodNativeEnum<typeof AgentHandoffEntryObject>;

declare const AgentHandoffEntryObject: {
    readonly Entry: "entry";
};

declare type AgentHandoffEntryObject = ClosedEnum<typeof AgentHandoffEntryObject>;

declare function agentHandoffEntryToJSON(agentHandoffEntry: AgentHandoffEntry): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffEntryType$ {
    /** @deprecated use `AgentHandoffEntryType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly AgentHandoff: "agent.handoff";
    }>;
    /** @deprecated use `AgentHandoffEntryType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly AgentHandoff: "agent.handoff";
    }>;
}

/** @internal */
declare const AgentHandoffEntryType$inboundSchema: z.ZodNativeEnum<typeof AgentHandoffEntryType>;

/** @internal */
declare const AgentHandoffEntryType$outboundSchema: z.ZodNativeEnum<typeof AgentHandoffEntryType>;

declare const AgentHandoffEntryType: {
    readonly AgentHandoff: "agent.handoff";
};

declare type AgentHandoffEntryType = ClosedEnum<typeof AgentHandoffEntryType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffStartedEvent$ {
    /** @deprecated use `AgentHandoffStartedEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentHandoffStartedEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentHandoffStartedEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentHandoffStartedEvent$Outbound, z.ZodTypeDef, AgentHandoffStartedEvent>;
    /** @deprecated use `AgentHandoffStartedEvent$Outbound` instead. */
    type Outbound = AgentHandoffStartedEvent$Outbound;
}

/** @internal */
declare const AgentHandoffStartedEvent$inboundSchema: z.ZodType<AgentHandoffStartedEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentHandoffStartedEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    previous_agent_id: string;
    previous_agent_name: string;
};

/** @internal */
declare const AgentHandoffStartedEvent$outboundSchema: z.ZodType<AgentHandoffStartedEvent$Outbound, z.ZodTypeDef, AgentHandoffStartedEvent>;

declare type AgentHandoffStartedEvent = {
    type?: AgentHandoffStartedEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    previousAgentId: string;
    previousAgentName: string;
};

declare function agentHandoffStartedEventFromJSON(jsonString: string): Result<AgentHandoffStartedEvent, SDKValidationError>;

declare function agentHandoffStartedEventToJSON(agentHandoffStartedEvent: AgentHandoffStartedEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentHandoffStartedEventType$ {
    /** @deprecated use `AgentHandoffStartedEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly AgentHandoffStarted: "agent.handoff.started";
    }>;
    /** @deprecated use `AgentHandoffStartedEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly AgentHandoffStarted: "agent.handoff.started";
    }>;
}

/** @internal */
declare const AgentHandoffStartedEventType$inboundSchema: z.ZodNativeEnum<typeof AgentHandoffStartedEventType>;

/** @internal */
declare const AgentHandoffStartedEventType$outboundSchema: z.ZodNativeEnum<typeof AgentHandoffStartedEventType>;

declare const AgentHandoffStartedEventType: {
    readonly AgentHandoffStarted: "agent.handoff.started";
};

declare type AgentHandoffStartedEventType = ClosedEnum<typeof AgentHandoffStartedEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentObject$ {
    /** @deprecated use `AgentObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Agent: "agent";
    }>;
    /** @deprecated use `AgentObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Agent: "agent";
    }>;
}

/** @internal */
declare const AgentObject$inboundSchema: z.ZodNativeEnum<typeof AgentObject>;

/** @internal */
declare const AgentObject$outboundSchema: z.ZodNativeEnum<typeof AgentObject>;

declare const AgentObject: {
    readonly Agent: "agent";
};

declare type AgentObject = ClosedEnum<typeof AgentObject>;

declare class Agents extends ClientSDK {
    /**
     * Agents Completion
     */
    complete(request: components.AgentsCompletionRequest, options?: RequestOptions): Promise<components.ChatCompletionResponse>;
    /**
     * Stream Agents completion
     *
     * @remarks
     * Mistral AI provides the ability to stream responses back to a client in order to allow partial results for certain requests. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
     */
    stream(request: components.AgentsCompletionStreamRequest, options?: RequestOptions): Promise<EventStream<components.CompletionEvent>>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1AgentsGetRequest$ {
    /** @deprecated use `AgentsApiV1AgentsGetRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1AgentsGetRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1AgentsGetRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1AgentsGetRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsGetRequest>;
    /** @deprecated use `AgentsApiV1AgentsGetRequest$Outbound` instead. */
    type Outbound = AgentsApiV1AgentsGetRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1AgentsGetRequest$inboundSchema: z.ZodType<AgentsApiV1AgentsGetRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1AgentsGetRequest$Outbound = {
    agent_id: string;
};

/** @internal */
declare const AgentsApiV1AgentsGetRequest$outboundSchema: z.ZodType<AgentsApiV1AgentsGetRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsGetRequest>;

declare type AgentsApiV1AgentsGetRequest = {
    agentId: string;
};

declare function agentsApiV1AgentsGetRequestFromJSON(jsonString: string): Result<AgentsApiV1AgentsGetRequest, SDKValidationError>;

declare function agentsApiV1AgentsGetRequestToJSON(agentsApiV1AgentsGetRequest: AgentsApiV1AgentsGetRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1AgentsListRequest$ {
    /** @deprecated use `AgentsApiV1AgentsListRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1AgentsListRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1AgentsListRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1AgentsListRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsListRequest>;
    /** @deprecated use `AgentsApiV1AgentsListRequest$Outbound` instead. */
    type Outbound = AgentsApiV1AgentsListRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1AgentsListRequest$inboundSchema: z.ZodType<AgentsApiV1AgentsListRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1AgentsListRequest$Outbound = {
    page: number;
    page_size: number;
};

/** @internal */
declare const AgentsApiV1AgentsListRequest$outboundSchema: z.ZodType<AgentsApiV1AgentsListRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsListRequest>;

declare type AgentsApiV1AgentsListRequest = {
    page?: number | undefined;
    pageSize?: number | undefined;
};

declare function agentsApiV1AgentsListRequestFromJSON(jsonString: string): Result<AgentsApiV1AgentsListRequest, SDKValidationError>;

declare function agentsApiV1AgentsListRequestToJSON(agentsApiV1AgentsListRequest: AgentsApiV1AgentsListRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1AgentsUpdateRequest$ {
    /** @deprecated use `AgentsApiV1AgentsUpdateRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1AgentsUpdateRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1AgentsUpdateRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1AgentsUpdateRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsUpdateRequest>;
    /** @deprecated use `AgentsApiV1AgentsUpdateRequest$Outbound` instead. */
    type Outbound = AgentsApiV1AgentsUpdateRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1AgentsUpdateRequest$inboundSchema: z.ZodType<AgentsApiV1AgentsUpdateRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1AgentsUpdateRequest$Outbound = {
    agent_id: string;
    AgentUpdateRequest: components.AgentUpdateRequest$Outbound;
};

/** @internal */
declare const AgentsApiV1AgentsUpdateRequest$outboundSchema: z.ZodType<AgentsApiV1AgentsUpdateRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsUpdateRequest>;

declare type AgentsApiV1AgentsUpdateRequest = {
    agentId: string;
    agentUpdateRequest: components.AgentUpdateRequest;
};

declare function agentsApiV1AgentsUpdateRequestFromJSON(jsonString: string): Result<AgentsApiV1AgentsUpdateRequest, SDKValidationError>;

declare function agentsApiV1AgentsUpdateRequestToJSON(agentsApiV1AgentsUpdateRequest: AgentsApiV1AgentsUpdateRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1AgentsUpdateVersionRequest$ {
    /** @deprecated use `AgentsApiV1AgentsUpdateVersionRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1AgentsUpdateVersionRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1AgentsUpdateVersionRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1AgentsUpdateVersionRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsUpdateVersionRequest>;
    /** @deprecated use `AgentsApiV1AgentsUpdateVersionRequest$Outbound` instead. */
    type Outbound = AgentsApiV1AgentsUpdateVersionRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1AgentsUpdateVersionRequest$inboundSchema: z.ZodType<AgentsApiV1AgentsUpdateVersionRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1AgentsUpdateVersionRequest$Outbound = {
    agent_id: string;
    version: number;
};

/** @internal */
declare const AgentsApiV1AgentsUpdateVersionRequest$outboundSchema: z.ZodType<AgentsApiV1AgentsUpdateVersionRequest$Outbound, z.ZodTypeDef, AgentsApiV1AgentsUpdateVersionRequest>;

declare type AgentsApiV1AgentsUpdateVersionRequest = {
    agentId: string;
    version: number;
};

declare function agentsApiV1AgentsUpdateVersionRequestFromJSON(jsonString: string): Result<AgentsApiV1AgentsUpdateVersionRequest, SDKValidationError>;

declare function agentsApiV1AgentsUpdateVersionRequestToJSON(agentsApiV1AgentsUpdateVersionRequest: AgentsApiV1AgentsUpdateVersionRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsAppendRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsAppendRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsAppendRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsAppendRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsAppendRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsAppendRequest>;
    /** @deprecated use `AgentsApiV1ConversationsAppendRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsAppendRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsAppendRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsAppendRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsAppendRequest$Outbound = {
    conversation_id: string;
    ConversationAppendRequest: components.ConversationAppendRequest$Outbound;
};

/** @internal */
declare const AgentsApiV1ConversationsAppendRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsAppendRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsAppendRequest>;

declare type AgentsApiV1ConversationsAppendRequest = {
    /**
     * ID of the conversation to which we append entries.
     */
    conversationId: string;
    conversationAppendRequest: components.ConversationAppendRequest;
};

declare function agentsApiV1ConversationsAppendRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsAppendRequest, SDKValidationError>;

declare function agentsApiV1ConversationsAppendRequestToJSON(agentsApiV1ConversationsAppendRequest: AgentsApiV1ConversationsAppendRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsAppendStreamRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsAppendStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsAppendStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsAppendStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsAppendStreamRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsAppendStreamRequest>;
    /** @deprecated use `AgentsApiV1ConversationsAppendStreamRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsAppendStreamRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsAppendStreamRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsAppendStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsAppendStreamRequest$Outbound = {
    conversation_id: string;
    ConversationAppendStreamRequest: components.ConversationAppendStreamRequest$Outbound;
};

/** @internal */
declare const AgentsApiV1ConversationsAppendStreamRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsAppendStreamRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsAppendStreamRequest>;

declare type AgentsApiV1ConversationsAppendStreamRequest = {
    /**
     * ID of the conversation to which we append entries.
     */
    conversationId: string;
    conversationAppendStreamRequest: components.ConversationAppendStreamRequest;
};

declare function agentsApiV1ConversationsAppendStreamRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsAppendStreamRequest, SDKValidationError>;

declare function agentsApiV1ConversationsAppendStreamRequestToJSON(agentsApiV1ConversationsAppendStreamRequest: AgentsApiV1ConversationsAppendStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsGetRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsGetRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsGetRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsGetRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsGetRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsGetRequest>;
    /** @deprecated use `AgentsApiV1ConversationsGetRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsGetRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsGetRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsGetRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsGetRequest$Outbound = {
    conversation_id: string;
};

/** @internal */
declare const AgentsApiV1ConversationsGetRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsGetRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsGetRequest>;

declare type AgentsApiV1ConversationsGetRequest = {
    /**
     * ID of the conversation from which we are fetching metadata.
     */
    conversationId: string;
};

declare function agentsApiV1ConversationsGetRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsGetRequest, SDKValidationError>;

declare function agentsApiV1ConversationsGetRequestToJSON(agentsApiV1ConversationsGetRequest: AgentsApiV1ConversationsGetRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsGetResponseV1ConversationsGet$ {
    /** @deprecated use `AgentsApiV1ConversationsGetResponseV1ConversationsGet$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsGetResponseV1ConversationsGet, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsGetResponseV1ConversationsGet$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsGetResponseV1ConversationsGet$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsGetResponseV1ConversationsGet>;
    /** @deprecated use `AgentsApiV1ConversationsGetResponseV1ConversationsGet$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsGetResponseV1ConversationsGet$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsGetResponseV1ConversationsGet$inboundSchema: z.ZodType<AgentsApiV1ConversationsGetResponseV1ConversationsGet, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsGetResponseV1ConversationsGet$Outbound = components.ModelConversation$Outbound | components.AgentConversation$Outbound;

/** @internal */
declare const AgentsApiV1ConversationsGetResponseV1ConversationsGet$outboundSchema: z.ZodType<AgentsApiV1ConversationsGetResponseV1ConversationsGet$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsGetResponseV1ConversationsGet>;

/**
 * Successful Response
 */
declare type AgentsApiV1ConversationsGetResponseV1ConversationsGet = components.ModelConversation | components.AgentConversation;

declare function agentsApiV1ConversationsGetResponseV1ConversationsGetFromJSON(jsonString: string): Result<AgentsApiV1ConversationsGetResponseV1ConversationsGet, SDKValidationError>;

declare function agentsApiV1ConversationsGetResponseV1ConversationsGetToJSON(agentsApiV1ConversationsGetResponseV1ConversationsGet: AgentsApiV1ConversationsGetResponseV1ConversationsGet): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsHistoryRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsHistoryRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsHistoryRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsHistoryRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsHistoryRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsHistoryRequest>;
    /** @deprecated use `AgentsApiV1ConversationsHistoryRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsHistoryRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsHistoryRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsHistoryRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsHistoryRequest$Outbound = {
    conversation_id: string;
};

/** @internal */
declare const AgentsApiV1ConversationsHistoryRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsHistoryRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsHistoryRequest>;

declare type AgentsApiV1ConversationsHistoryRequest = {
    /**
     * ID of the conversation from which we are fetching entries.
     */
    conversationId: string;
};

declare function agentsApiV1ConversationsHistoryRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsHistoryRequest, SDKValidationError>;

declare function agentsApiV1ConversationsHistoryRequestToJSON(agentsApiV1ConversationsHistoryRequest: AgentsApiV1ConversationsHistoryRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsListRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsListRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsListRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsListRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsListRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsListRequest>;
    /** @deprecated use `AgentsApiV1ConversationsListRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsListRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsListRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsListRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsListRequest$Outbound = {
    page: number;
    page_size: number;
};

/** @internal */
declare const AgentsApiV1ConversationsListRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsListRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsListRequest>;

declare type AgentsApiV1ConversationsListRequest = {
    page?: number | undefined;
    pageSize?: number | undefined;
};

declare function agentsApiV1ConversationsListRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsListRequest, SDKValidationError>;

declare function agentsApiV1ConversationsListRequestToJSON(agentsApiV1ConversationsListRequest: AgentsApiV1ConversationsListRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsMessagesRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsMessagesRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsMessagesRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsMessagesRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsMessagesRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsMessagesRequest>;
    /** @deprecated use `AgentsApiV1ConversationsMessagesRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsMessagesRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsMessagesRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsMessagesRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsMessagesRequest$Outbound = {
    conversation_id: string;
};

/** @internal */
declare const AgentsApiV1ConversationsMessagesRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsMessagesRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsMessagesRequest>;

declare type AgentsApiV1ConversationsMessagesRequest = {
    /**
     * ID of the conversation from which we are fetching messages.
     */
    conversationId: string;
};

declare function agentsApiV1ConversationsMessagesRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsMessagesRequest, SDKValidationError>;

declare function agentsApiV1ConversationsMessagesRequestToJSON(agentsApiV1ConversationsMessagesRequest: AgentsApiV1ConversationsMessagesRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsRestartRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsRestartRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsRestartRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsRestartRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsRestartRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsRestartRequest>;
    /** @deprecated use `AgentsApiV1ConversationsRestartRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsRestartRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsRestartRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsRestartRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsRestartRequest$Outbound = {
    conversation_id: string;
    ConversationRestartRequest: components.ConversationRestartRequest$Outbound;
};

/** @internal */
declare const AgentsApiV1ConversationsRestartRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsRestartRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsRestartRequest>;

declare type AgentsApiV1ConversationsRestartRequest = {
    /**
     * ID of the original conversation which is being restarted.
     */
    conversationId: string;
    conversationRestartRequest: components.ConversationRestartRequest;
};

declare function agentsApiV1ConversationsRestartRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsRestartRequest, SDKValidationError>;

declare function agentsApiV1ConversationsRestartRequestToJSON(agentsApiV1ConversationsRestartRequest: AgentsApiV1ConversationsRestartRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsApiV1ConversationsRestartStreamRequest$ {
    /** @deprecated use `AgentsApiV1ConversationsRestartStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsApiV1ConversationsRestartStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsApiV1ConversationsRestartStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsApiV1ConversationsRestartStreamRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsRestartStreamRequest>;
    /** @deprecated use `AgentsApiV1ConversationsRestartStreamRequest$Outbound` instead. */
    type Outbound = AgentsApiV1ConversationsRestartStreamRequest$Outbound;
}

/** @internal */
declare const AgentsApiV1ConversationsRestartStreamRequest$inboundSchema: z.ZodType<AgentsApiV1ConversationsRestartStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsApiV1ConversationsRestartStreamRequest$Outbound = {
    conversation_id: string;
    ConversationRestartStreamRequest: components.ConversationRestartStreamRequest$Outbound;
};

/** @internal */
declare const AgentsApiV1ConversationsRestartStreamRequest$outboundSchema: z.ZodType<AgentsApiV1ConversationsRestartStreamRequest$Outbound, z.ZodTypeDef, AgentsApiV1ConversationsRestartStreamRequest>;

declare type AgentsApiV1ConversationsRestartStreamRequest = {
    /**
     * ID of the original conversation which is being restarted.
     */
    conversationId: string;
    conversationRestartStreamRequest: components.ConversationRestartStreamRequest;
};

declare function agentsApiV1ConversationsRestartStreamRequestFromJSON(jsonString: string): Result<AgentsApiV1ConversationsRestartStreamRequest, SDKValidationError>;

declare function agentsApiV1ConversationsRestartStreamRequestToJSON(agentsApiV1ConversationsRestartStreamRequest: AgentsApiV1ConversationsRestartStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionRequest$ {
    /** @deprecated use `AgentsCompletionRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionRequest$Outbound, z.ZodTypeDef, AgentsCompletionRequest>;
    /** @deprecated use `AgentsCompletionRequest$Outbound` instead. */
    type Outbound = AgentsCompletionRequest$Outbound;
}

/** @internal */
declare const AgentsCompletionRequest$inboundSchema: z.ZodType<AgentsCompletionRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionRequest$Outbound = {
    max_tokens?: number | null | undefined;
    stream: boolean;
    stop?: string | Array<string> | undefined;
    random_seed?: number | null | undefined;
    messages: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>;
    response_format?: ResponseFormat$Outbound | undefined;
    tools?: Array<Tool$Outbound> | null | undefined;
    tool_choice?: ToolChoice$Outbound | string | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    n?: number | null | undefined;
    prediction?: Prediction$Outbound | undefined;
    parallel_tool_calls?: boolean | undefined;
    prompt_mode?: string | null | undefined;
    agent_id: string;
};

/** @internal */
declare const AgentsCompletionRequest$outboundSchema: z.ZodType<AgentsCompletionRequest$Outbound, z.ZodTypeDef, AgentsCompletionRequest>;

declare type AgentsCompletionRequest = {
    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length.
     */
    maxTokens?: number | null | undefined;
    /**
     * Whether to stream back partial progress. If set, tokens will be sent as data-only server-side events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
     */
    stream?: boolean | undefined;
    /**
     * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
     */
    stop?: string | Array<string> | undefined;
    /**
     * The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | null | undefined;
    /**
     * The prompt(s) to generate completions for, encoded as a list of dict with role and content.
     */
    messages: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>;
    responseFormat?: ResponseFormat | undefined;
    tools?: Array<Tool> | null | undefined;
    toolChoice?: ToolChoice | ToolChoiceEnum | undefined;
    /**
     * presence_penalty determines how much the model penalizes the repetition of words or phrases. A higher presence penalty encourages the model to use a wider variety of words and phrases, making the output more diverse and creative.
     */
    presencePenalty?: number | undefined;
    /**
     * frequency_penalty penalizes the repetition of words based on their frequency in the generated text. A higher frequency penalty discourages the model from repeating words that have already appeared frequently in the output, promoting diversity and reducing repetition.
     */
    frequencyPenalty?: number | undefined;
    /**
     * Number of completions to return for each request, input tokens are only billed once.
     */
    n?: number | null | undefined;
    prediction?: Prediction | undefined;
    parallelToolCalls?: boolean | undefined;
    /**
     * Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.
     */
    promptMode?: MistralPromptMode | null | undefined;
    /**
     * The ID of the agent to use for this completion.
     */
    agentId: string;
};

declare function agentsCompletionRequestFromJSON(jsonString: string): Result<AgentsCompletionRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionRequestMessages$ {
    /** @deprecated use `AgentsCompletionRequestMessages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionRequestMessages, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionRequestMessages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionRequestMessages$Outbound, z.ZodTypeDef, AgentsCompletionRequestMessages>;
    /** @deprecated use `AgentsCompletionRequestMessages$Outbound` instead. */
    type Outbound = AgentsCompletionRequestMessages$Outbound;
}

/** @internal */
declare const AgentsCompletionRequestMessages$inboundSchema: z.ZodType<AgentsCompletionRequestMessages, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionRequestMessages$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const AgentsCompletionRequestMessages$outboundSchema: z.ZodType<AgentsCompletionRequestMessages$Outbound, z.ZodTypeDef, AgentsCompletionRequestMessages>;

declare type AgentsCompletionRequestMessages = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function agentsCompletionRequestMessagesFromJSON(jsonString: string): Result<AgentsCompletionRequestMessages, SDKValidationError>;

declare function agentsCompletionRequestMessagesToJSON(agentsCompletionRequestMessages: AgentsCompletionRequestMessages): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionRequestStop$ {
    /** @deprecated use `AgentsCompletionRequestStop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionRequestStop, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionRequestStop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionRequestStop$Outbound, z.ZodTypeDef, AgentsCompletionRequestStop>;
    /** @deprecated use `AgentsCompletionRequestStop$Outbound` instead. */
    type Outbound = AgentsCompletionRequestStop$Outbound;
}

/** @internal */
declare const AgentsCompletionRequestStop$inboundSchema: z.ZodType<AgentsCompletionRequestStop, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionRequestStop$Outbound = string | Array<string>;

/** @internal */
declare const AgentsCompletionRequestStop$outboundSchema: z.ZodType<AgentsCompletionRequestStop$Outbound, z.ZodTypeDef, AgentsCompletionRequestStop>;

/**
 * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
 */
declare type AgentsCompletionRequestStop = string | Array<string>;

declare function agentsCompletionRequestStopFromJSON(jsonString: string): Result<AgentsCompletionRequestStop, SDKValidationError>;

declare function agentsCompletionRequestStopToJSON(agentsCompletionRequestStop: AgentsCompletionRequestStop): string;

declare function agentsCompletionRequestToJSON(agentsCompletionRequest: AgentsCompletionRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionRequestToolChoice$ {
    /** @deprecated use `AgentsCompletionRequestToolChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionRequestToolChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionRequestToolChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionRequestToolChoice$Outbound, z.ZodTypeDef, AgentsCompletionRequestToolChoice>;
    /** @deprecated use `AgentsCompletionRequestToolChoice$Outbound` instead. */
    type Outbound = AgentsCompletionRequestToolChoice$Outbound;
}

/** @internal */
declare const AgentsCompletionRequestToolChoice$inboundSchema: z.ZodType<AgentsCompletionRequestToolChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionRequestToolChoice$Outbound = ToolChoice$Outbound | string;

/** @internal */
declare const AgentsCompletionRequestToolChoice$outboundSchema: z.ZodType<AgentsCompletionRequestToolChoice$Outbound, z.ZodTypeDef, AgentsCompletionRequestToolChoice>;

declare type AgentsCompletionRequestToolChoice = ToolChoice | ToolChoiceEnum;

declare function agentsCompletionRequestToolChoiceFromJSON(jsonString: string): Result<AgentsCompletionRequestToolChoice, SDKValidationError>;

declare function agentsCompletionRequestToolChoiceToJSON(agentsCompletionRequestToolChoice: AgentsCompletionRequestToolChoice): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionStreamRequest$ {
    /** @deprecated use `AgentsCompletionStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionStreamRequest$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequest>;
    /** @deprecated use `AgentsCompletionStreamRequest$Outbound` instead. */
    type Outbound = AgentsCompletionStreamRequest$Outbound;
}

/** @internal */
declare const AgentsCompletionStreamRequest$inboundSchema: z.ZodType<AgentsCompletionStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionStreamRequest$Outbound = {
    max_tokens?: number | null | undefined;
    stream: boolean;
    stop?: string | Array<string> | undefined;
    random_seed?: number | null | undefined;
    messages: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>;
    response_format?: ResponseFormat$Outbound | undefined;
    tools?: Array<Tool$Outbound> | null | undefined;
    tool_choice?: ToolChoice$Outbound | string | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    n?: number | null | undefined;
    prediction?: Prediction$Outbound | undefined;
    parallel_tool_calls?: boolean | undefined;
    prompt_mode?: string | null | undefined;
    agent_id: string;
};

/** @internal */
declare const AgentsCompletionStreamRequest$outboundSchema: z.ZodType<AgentsCompletionStreamRequest$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequest>;

declare type AgentsCompletionStreamRequest = {
    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length.
     */
    maxTokens?: number | null | undefined;
    stream?: boolean | undefined;
    /**
     * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
     */
    stop?: string | Array<string> | undefined;
    /**
     * The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | null | undefined;
    /**
     * The prompt(s) to generate completions for, encoded as a list of dict with role and content.
     */
    messages: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>;
    responseFormat?: ResponseFormat | undefined;
    tools?: Array<Tool> | null | undefined;
    toolChoice?: ToolChoice | ToolChoiceEnum | undefined;
    /**
     * presence_penalty determines how much the model penalizes the repetition of words or phrases. A higher presence penalty encourages the model to use a wider variety of words and phrases, making the output more diverse and creative.
     */
    presencePenalty?: number | undefined;
    /**
     * frequency_penalty penalizes the repetition of words based on their frequency in the generated text. A higher frequency penalty discourages the model from repeating words that have already appeared frequently in the output, promoting diversity and reducing repetition.
     */
    frequencyPenalty?: number | undefined;
    /**
     * Number of completions to return for each request, input tokens are only billed once.
     */
    n?: number | null | undefined;
    prediction?: Prediction | undefined;
    parallelToolCalls?: boolean | undefined;
    /**
     * Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.
     */
    promptMode?: MistralPromptMode | null | undefined;
    /**
     * The ID of the agent to use for this completion.
     */
    agentId: string;
};

declare function agentsCompletionStreamRequestFromJSON(jsonString: string): Result<AgentsCompletionStreamRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionStreamRequestMessages$ {
    /** @deprecated use `AgentsCompletionStreamRequestMessages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionStreamRequestMessages, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionStreamRequestMessages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionStreamRequestMessages$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequestMessages>;
    /** @deprecated use `AgentsCompletionStreamRequestMessages$Outbound` instead. */
    type Outbound = AgentsCompletionStreamRequestMessages$Outbound;
}

/** @internal */
declare const AgentsCompletionStreamRequestMessages$inboundSchema: z.ZodType<AgentsCompletionStreamRequestMessages, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionStreamRequestMessages$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const AgentsCompletionStreamRequestMessages$outboundSchema: z.ZodType<AgentsCompletionStreamRequestMessages$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequestMessages>;

declare type AgentsCompletionStreamRequestMessages = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function agentsCompletionStreamRequestMessagesFromJSON(jsonString: string): Result<AgentsCompletionStreamRequestMessages, SDKValidationError>;

declare function agentsCompletionStreamRequestMessagesToJSON(agentsCompletionStreamRequestMessages: AgentsCompletionStreamRequestMessages): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionStreamRequestStop$ {
    /** @deprecated use `AgentsCompletionStreamRequestStop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionStreamRequestStop, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionStreamRequestStop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionStreamRequestStop$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequestStop>;
    /** @deprecated use `AgentsCompletionStreamRequestStop$Outbound` instead. */
    type Outbound = AgentsCompletionStreamRequestStop$Outbound;
}

/** @internal */
declare const AgentsCompletionStreamRequestStop$inboundSchema: z.ZodType<AgentsCompletionStreamRequestStop, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionStreamRequestStop$Outbound = string | Array<string>;

/** @internal */
declare const AgentsCompletionStreamRequestStop$outboundSchema: z.ZodType<AgentsCompletionStreamRequestStop$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequestStop>;

/**
 * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
 */
declare type AgentsCompletionStreamRequestStop = string | Array<string>;

declare function agentsCompletionStreamRequestStopFromJSON(jsonString: string): Result<AgentsCompletionStreamRequestStop, SDKValidationError>;

declare function agentsCompletionStreamRequestStopToJSON(agentsCompletionStreamRequestStop: AgentsCompletionStreamRequestStop): string;

declare function agentsCompletionStreamRequestToJSON(agentsCompletionStreamRequest: AgentsCompletionStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentsCompletionStreamRequestToolChoice$ {
    /** @deprecated use `AgentsCompletionStreamRequestToolChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentsCompletionStreamRequestToolChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentsCompletionStreamRequestToolChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentsCompletionStreamRequestToolChoice$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequestToolChoice>;
    /** @deprecated use `AgentsCompletionStreamRequestToolChoice$Outbound` instead. */
    type Outbound = AgentsCompletionStreamRequestToolChoice$Outbound;
}

/** @internal */
declare const AgentsCompletionStreamRequestToolChoice$inboundSchema: z.ZodType<AgentsCompletionStreamRequestToolChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentsCompletionStreamRequestToolChoice$Outbound = ToolChoice$Outbound | string;

/** @internal */
declare const AgentsCompletionStreamRequestToolChoice$outboundSchema: z.ZodType<AgentsCompletionStreamRequestToolChoice$Outbound, z.ZodTypeDef, AgentsCompletionStreamRequestToolChoice>;

declare type AgentsCompletionStreamRequestToolChoice = ToolChoice | ToolChoiceEnum;

declare function agentsCompletionStreamRequestToolChoiceFromJSON(jsonString: string): Result<AgentsCompletionStreamRequestToolChoice, SDKValidationError>;

declare function agentsCompletionStreamRequestToolChoiceToJSON(agentsCompletionStreamRequestToolChoice: AgentsCompletionStreamRequestToolChoice): string;

declare function agentToJSON(agent: Agent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentTools$ {
    /** @deprecated use `AgentTools$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentTools, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentTools$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentTools$Outbound, z.ZodTypeDef, AgentTools>;
    /** @deprecated use `AgentTools$Outbound` instead. */
    type Outbound = AgentTools$Outbound;
}

/** @internal */
declare const AgentTools$inboundSchema: z.ZodType<AgentTools, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentTools$Outbound = (DocumentLibraryTool$Outbound & {
    type: "document_library";
}) | (FunctionTool$Outbound & {
    type: "function";
}) | (CodeInterpreterTool$Outbound & {
    type: "code_interpreter";
}) | (ImageGenerationTool$Outbound & {
    type: "image_generation";
}) | (WebSearchTool$Outbound & {
    type: "web_search";
}) | (WebSearchPremiumTool$Outbound & {
    type: "web_search_premium";
});

/** @internal */
declare const AgentTools$outboundSchema: z.ZodType<AgentTools$Outbound, z.ZodTypeDef, AgentTools>;

declare type AgentTools = (DocumentLibraryTool & {
    type: "document_library";
}) | (FunctionTool & {
    type: "function";
}) | (CodeInterpreterTool & {
    type: "code_interpreter";
}) | (ImageGenerationTool & {
    type: "image_generation";
}) | (WebSearchTool & {
    type: "web_search";
}) | (WebSearchPremiumTool & {
    type: "web_search_premium";
});

declare function agentToolsFromJSON(jsonString: string): Result<AgentTools, SDKValidationError>;

declare function agentToolsToJSON(agentTools: AgentTools): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentUpdateRequest$ {
    /** @deprecated use `AgentUpdateRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentUpdateRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentUpdateRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentUpdateRequest$Outbound, z.ZodTypeDef, AgentUpdateRequest>;
    /** @deprecated use `AgentUpdateRequest$Outbound` instead. */
    type Outbound = AgentUpdateRequest$Outbound;
}

/** @internal */
declare const AgentUpdateRequest$inboundSchema: z.ZodType<AgentUpdateRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentUpdateRequest$Outbound = {
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool$Outbound & {
        type: "document_library";
    }) | (FunctionTool$Outbound & {
        type: "function";
    }) | (CodeInterpreterTool$Outbound & {
        type: "code_interpreter";
    }) | (ImageGenerationTool$Outbound & {
        type: "image_generation";
    }) | (WebSearchTool$Outbound & {
        type: "web_search";
    }) | (WebSearchPremiumTool$Outbound & {
        type: "web_search_premium";
    })> | undefined;
    completion_args?: CompletionArgs$Outbound | undefined;
    model?: string | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    handoffs?: Array<string> | null | undefined;
};

/** @internal */
declare const AgentUpdateRequest$outboundSchema: z.ZodType<AgentUpdateRequest$Outbound, z.ZodTypeDef, AgentUpdateRequest>;

declare type AgentUpdateRequest = {
    /**
     * Instruction prompt the model will follow during the conversation.
     */
    instructions?: string | null | undefined;
    /**
     * List of tools which are available to the model during the conversation.
     */
    tools?: Array<(DocumentLibraryTool & {
        type: "document_library";
    }) | (FunctionTool & {
        type: "function";
    }) | (CodeInterpreterTool & {
        type: "code_interpreter";
    }) | (ImageGenerationTool & {
        type: "image_generation";
    }) | (WebSearchTool & {
        type: "web_search";
    }) | (WebSearchPremiumTool & {
        type: "web_search_premium";
    })> | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
    model?: string | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    handoffs?: Array<string> | null | undefined;
};

declare function agentUpdateRequestFromJSON(jsonString: string): Result<AgentUpdateRequest, SDKValidationError>;

declare function agentUpdateRequestToJSON(agentUpdateRequest: AgentUpdateRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AgentUpdateRequestTools$ {
    /** @deprecated use `AgentUpdateRequestTools$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AgentUpdateRequestTools, z.ZodTypeDef, unknown>;
    /** @deprecated use `AgentUpdateRequestTools$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AgentUpdateRequestTools$Outbound, z.ZodTypeDef, AgentUpdateRequestTools>;
    /** @deprecated use `AgentUpdateRequestTools$Outbound` instead. */
    type Outbound = AgentUpdateRequestTools$Outbound;
}

/** @internal */
declare const AgentUpdateRequestTools$inboundSchema: z.ZodType<AgentUpdateRequestTools, z.ZodTypeDef, unknown>;

/** @internal */
declare type AgentUpdateRequestTools$Outbound = (DocumentLibraryTool$Outbound & {
    type: "document_library";
}) | (FunctionTool$Outbound & {
    type: "function";
}) | (CodeInterpreterTool$Outbound & {
    type: "code_interpreter";
}) | (ImageGenerationTool$Outbound & {
    type: "image_generation";
}) | (WebSearchTool$Outbound & {
    type: "web_search";
}) | (WebSearchPremiumTool$Outbound & {
    type: "web_search_premium";
});

/** @internal */
declare const AgentUpdateRequestTools$outboundSchema: z.ZodType<AgentUpdateRequestTools$Outbound, z.ZodTypeDef, AgentUpdateRequestTools>;

declare type AgentUpdateRequestTools = (DocumentLibraryTool & {
    type: "document_library";
}) | (FunctionTool & {
    type: "function";
}) | (CodeInterpreterTool & {
    type: "code_interpreter";
}) | (ImageGenerationTool & {
    type: "image_generation";
}) | (WebSearchTool & {
    type: "web_search";
}) | (WebSearchPremiumTool & {
    type: "web_search_premium";
});

declare function agentUpdateRequestToolsFromJSON(jsonString: string): Result<AgentUpdateRequestTools, SDKValidationError>;

declare function agentUpdateRequestToolsToJSON(agentUpdateRequestTools: AgentUpdateRequestTools): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ApiEndpoint$ {
    /** @deprecated use `ApiEndpoint$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ApiEndpoint, z.ZodTypeDef, unknown>;
    /** @deprecated use `ApiEndpoint$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ApiEndpoint, z.ZodTypeDef, ApiEndpoint>;
}

/** @internal */
declare const ApiEndpoint$inboundSchema: z.ZodType<ApiEndpoint, z.ZodTypeDef, unknown>;

/** @internal */
declare const ApiEndpoint$outboundSchema: z.ZodType<ApiEndpoint, z.ZodTypeDef, ApiEndpoint>;

declare const ApiEndpoint: {
    readonly RootV1ChatCompletions: "/v1/chat/completions";
    readonly RootV1Embeddings: "/v1/embeddings";
    readonly RootV1FimCompletions: "/v1/fim/completions";
    readonly RootV1Moderations: "/v1/moderations";
    readonly RootV1ChatModerations: "/v1/chat/moderations";
    readonly RootV1Ocr: "/v1/ocr";
    readonly RootV1Classifications: "/v1/classifications";
    readonly RootV1ChatClassifications: "/v1/chat/classifications";
    readonly RootV1Conversations: "/v1/conversations";
    readonly RootV1AudioTranscriptions: "/v1/audio/transcriptions";
};

declare type ApiEndpoint = OpenEnum<typeof ApiEndpoint>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ArchiveFTModelOut$ {
    /** @deprecated use `ArchiveFTModelOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ArchiveFTModelOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ArchiveFTModelOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ArchiveFTModelOut$Outbound, z.ZodTypeDef, ArchiveFTModelOut>;
    /** @deprecated use `ArchiveFTModelOut$Outbound` instead. */
    type Outbound = ArchiveFTModelOut$Outbound;
}

/** @internal */
declare const ArchiveFTModelOut$inboundSchema: z.ZodType<ArchiveFTModelOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ArchiveFTModelOut$Outbound = {
    id: string;
    object: string;
    archived: boolean;
};

/** @internal */
declare const ArchiveFTModelOut$outboundSchema: z.ZodType<ArchiveFTModelOut$Outbound, z.ZodTypeDef, ArchiveFTModelOut>;

declare type ArchiveFTModelOut = {
    id: string;
    object?: ArchiveFTModelOutObject | undefined;
    archived?: boolean | undefined;
};

declare function archiveFTModelOutFromJSON(jsonString: string): Result<ArchiveFTModelOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ArchiveFTModelOutObject$ {
    /** @deprecated use `ArchiveFTModelOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
    /** @deprecated use `ArchiveFTModelOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
}

/** @internal */
declare const ArchiveFTModelOutObject$inboundSchema: z.ZodNativeEnum<typeof ArchiveFTModelOutObject>;

/** @internal */
declare const ArchiveFTModelOutObject$outboundSchema: z.ZodNativeEnum<typeof ArchiveFTModelOutObject>;

declare const ArchiveFTModelOutObject: {
    readonly Model: "model";
};

declare type ArchiveFTModelOutObject = ClosedEnum<typeof ArchiveFTModelOutObject>;

declare function archiveFTModelOutToJSON(archiveFTModelOut: ArchiveFTModelOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Arguments$ {
    /** @deprecated use `Arguments$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Arguments, z.ZodTypeDef, unknown>;
    /** @deprecated use `Arguments$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Arguments$Outbound, z.ZodTypeDef, Arguments>;
    /** @deprecated use `Arguments$Outbound` instead. */
    type Outbound = Arguments$Outbound;
}

/** @internal */
declare const Arguments$inboundSchema: z.ZodType<Arguments, z.ZodTypeDef, unknown>;

/** @internal */
declare type Arguments$Outbound = {
    [k: string]: any;
} | string;

/** @internal */
declare const Arguments$outboundSchema: z.ZodType<Arguments$Outbound, z.ZodTypeDef, Arguments>;

declare type Arguments = {
    [k: string]: any;
} | string;

declare function argumentsFromJSON(jsonString: string): Result<Arguments, SDKValidationError>;

declare function argumentsToJSON(value: Arguments): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AssistantMessage$ {
    /** @deprecated use `AssistantMessage$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AssistantMessage, z.ZodTypeDef, unknown>;
    /** @deprecated use `AssistantMessage$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AssistantMessage$Outbound, z.ZodTypeDef, AssistantMessage>;
    /** @deprecated use `AssistantMessage$Outbound` instead. */
    type Outbound = AssistantMessage$Outbound;
}

/** @internal */
declare const AssistantMessage$inboundSchema: z.ZodType<AssistantMessage, z.ZodTypeDef, unknown>;

/** @internal */
declare type AssistantMessage$Outbound = {
    content?: string | Array<ContentChunk$Outbound> | null | undefined;
    tool_calls?: Array<ToolCall$Outbound> | null | undefined;
    prefix: boolean;
    role: string;
};

/** @internal */
declare const AssistantMessage$outboundSchema: z.ZodType<AssistantMessage$Outbound, z.ZodTypeDef, AssistantMessage>;

declare type AssistantMessage = {
    content?: string | Array<ContentChunk> | null | undefined;
    toolCalls?: Array<ToolCall> | null | undefined;
    /**
     * Set this to `true` when adding an assistant message as prefix to condition the model response. The role of the prefix message is to force the model to start its answer by the content of the message.
     */
    prefix?: boolean | undefined;
    role?: AssistantMessageRole | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AssistantMessageContent$ {
    /** @deprecated use `AssistantMessageContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AssistantMessageContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `AssistantMessageContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AssistantMessageContent$Outbound, z.ZodTypeDef, AssistantMessageContent>;
    /** @deprecated use `AssistantMessageContent$Outbound` instead. */
    type Outbound = AssistantMessageContent$Outbound;
}

/** @internal */
declare const AssistantMessageContent$inboundSchema: z.ZodType<AssistantMessageContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type AssistantMessageContent$Outbound = string | Array<ContentChunk$Outbound>;

/** @internal */
declare const AssistantMessageContent$outboundSchema: z.ZodType<AssistantMessageContent$Outbound, z.ZodTypeDef, AssistantMessageContent>;

declare type AssistantMessageContent = string | Array<ContentChunk>;

declare function assistantMessageContentFromJSON(jsonString: string): Result<AssistantMessageContent, SDKValidationError>;

declare function assistantMessageContentToJSON(assistantMessageContent: AssistantMessageContent): string;

declare function assistantMessageFromJSON(jsonString: string): Result<AssistantMessage, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AssistantMessageRole$ {
    /** @deprecated use `AssistantMessageRole$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
    }>;
    /** @deprecated use `AssistantMessageRole$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
    }>;
}

/** @internal */
declare const AssistantMessageRole$inboundSchema: z.ZodNativeEnum<typeof AssistantMessageRole>;

/** @internal */
declare const AssistantMessageRole$outboundSchema: z.ZodNativeEnum<typeof AssistantMessageRole>;

declare const AssistantMessageRole: {
    readonly Assistant: "assistant";
};

declare type AssistantMessageRole = ClosedEnum<typeof AssistantMessageRole>;

declare function assistantMessageToJSON(assistantMessage: AssistantMessage): string;

declare class Audio_2 extends ClientSDK {
    private _transcriptions?;
    get transcriptions(): Transcriptions;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AudioChunk$ {
    /** @deprecated use `AudioChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AudioChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `AudioChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AudioChunk$Outbound, z.ZodTypeDef, AudioChunk>;
    /** @deprecated use `AudioChunk$Outbound` instead. */
    type Outbound = AudioChunk$Outbound;
}

/** @internal */
declare const AudioChunk$inboundSchema: z.ZodType<AudioChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type AudioChunk$Outbound = {
    input_audio: string;
    type: string;
};

/** @internal */
declare const AudioChunk$outboundSchema: z.ZodType<AudioChunk$Outbound, z.ZodTypeDef, AudioChunk>;

declare type AudioChunk = {
    inputAudio: string;
    type?: AudioChunkType | undefined;
};

declare function audioChunkFromJSON(jsonString: string): Result<AudioChunk, SDKValidationError>;

declare function audioChunkToJSON(audioChunk: AudioChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AudioChunkType$ {
    /** @deprecated use `AudioChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly InputAudio: "input_audio";
    }>;
    /** @deprecated use `AudioChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly InputAudio: "input_audio";
    }>;
}

/** @internal */
declare const AudioChunkType$inboundSchema: z.ZodNativeEnum<typeof AudioChunkType>;

/** @internal */
declare const AudioChunkType$outboundSchema: z.ZodNativeEnum<typeof AudioChunkType>;

declare const AudioChunkType: {
    readonly InputAudio: "input_audio";
};

declare type AudioChunkType = ClosedEnum<typeof AudioChunkType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AudioTranscriptionRequest$ {
    /** @deprecated use `AudioTranscriptionRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AudioTranscriptionRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `AudioTranscriptionRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AudioTranscriptionRequest$Outbound, z.ZodTypeDef, AudioTranscriptionRequest>;
    /** @deprecated use `AudioTranscriptionRequest$Outbound` instead. */
    type Outbound = AudioTranscriptionRequest$Outbound;
}

/** @internal */
declare const AudioTranscriptionRequest$inboundSchema: z.ZodType<AudioTranscriptionRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type AudioTranscriptionRequest$Outbound = {
    model: string;
    file?: FileT$Outbound | Blob | undefined;
    file_url?: string | null | undefined;
    file_id?: string | null | undefined;
    language?: string | null | undefined;
    temperature?: number | null | undefined;
    stream: false;
    timestamp_granularities?: Array<string> | undefined;
};

/** @internal */
declare const AudioTranscriptionRequest$outboundSchema: z.ZodType<AudioTranscriptionRequest$Outbound, z.ZodTypeDef, AudioTranscriptionRequest>;

declare type AudioTranscriptionRequest = {
    model: string;
    file?: FileT | Blob | undefined;
    /**
     * Url of a file to be transcribed
     */
    fileUrl?: string | null | undefined;
    /**
     * ID of a file uploaded to /v1/files
     */
    fileId?: string | null | undefined;
    /**
     * Language of the audio, e.g. 'en'. Providing the language can boost accuracy.
     */
    language?: string | null | undefined;
    temperature?: number | null | undefined;
    stream?: false | undefined;
    /**
     * Granularities of timestamps to include in the response.
     */
    timestampGranularities?: Array<TimestampGranularity> | undefined;
};

declare function audioTranscriptionRequestFromJSON(jsonString: string): Result<AudioTranscriptionRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace AudioTranscriptionRequestStream$ {
    /** @deprecated use `AudioTranscriptionRequestStream$inboundSchema` instead. */
    const inboundSchema: z.ZodType<AudioTranscriptionRequestStream, z.ZodTypeDef, unknown>;
    /** @deprecated use `AudioTranscriptionRequestStream$outboundSchema` instead. */
    const outboundSchema: z.ZodType<AudioTranscriptionRequestStream$Outbound, z.ZodTypeDef, AudioTranscriptionRequestStream>;
    /** @deprecated use `AudioTranscriptionRequestStream$Outbound` instead. */
    type Outbound = AudioTranscriptionRequestStream$Outbound;
}

/** @internal */
declare const AudioTranscriptionRequestStream$inboundSchema: z.ZodType<AudioTranscriptionRequestStream, z.ZodTypeDef, unknown>;

/** @internal */
declare type AudioTranscriptionRequestStream$Outbound = {
    model: string;
    file?: FileT$Outbound | Blob | undefined;
    file_url?: string | null | undefined;
    file_id?: string | null | undefined;
    language?: string | null | undefined;
    temperature?: number | null | undefined;
    stream: true;
    timestamp_granularities?: Array<string> | undefined;
};

/** @internal */
declare const AudioTranscriptionRequestStream$outboundSchema: z.ZodType<AudioTranscriptionRequestStream$Outbound, z.ZodTypeDef, AudioTranscriptionRequestStream>;

declare type AudioTranscriptionRequestStream = {
    model: string;
    file?: FileT | Blob | undefined;
    /**
     * Url of a file to be transcribed
     */
    fileUrl?: string | null | undefined;
    /**
     * ID of a file uploaded to /v1/files
     */
    fileId?: string | null | undefined;
    /**
     * Language of the audio, e.g. 'en'. Providing the language can boost accuracy.
     */
    language?: string | null | undefined;
    temperature?: number | null | undefined;
    stream?: true | undefined;
    /**
     * Granularities of timestamps to include in the response.
     */
    timestampGranularities?: Array<TimestampGranularity> | undefined;
};

declare function audioTranscriptionRequestStreamFromJSON(jsonString: string): Result<AudioTranscriptionRequestStream, SDKValidationError>;

declare function audioTranscriptionRequestStreamToJSON(audioTranscriptionRequestStream: AudioTranscriptionRequestStream): string;

declare function audioTranscriptionRequestToJSON(audioTranscriptionRequest: AudioTranscriptionRequest): string;

declare type Awaitable<T> = T | Promise<T>;

declare type Awaitable_2<T> = T | Promise<T>;

declare type BackoffStrategy = {
    initialInterval: number;
    maxInterval: number;
    exponent: number;
    maxElapsedTime: number;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BaseModelCard$ {
    /** @deprecated use `BaseModelCard$inboundSchema` instead. */
    const inboundSchema: z.ZodType<BaseModelCard, z.ZodTypeDef, unknown>;
    /** @deprecated use `BaseModelCard$outboundSchema` instead. */
    const outboundSchema: z.ZodType<BaseModelCard$Outbound, z.ZodTypeDef, BaseModelCard>;
    /** @deprecated use `BaseModelCard$Outbound` instead. */
    type Outbound = BaseModelCard$Outbound;
}

/** @internal */
declare const BaseModelCard$inboundSchema: z.ZodType<BaseModelCard, z.ZodTypeDef, unknown>;

/** @internal */
declare type BaseModelCard$Outbound = {
    id: string;
    object: string;
    created?: number | undefined;
    owned_by: string;
    capabilities: ModelCapabilities$Outbound;
    name?: string | null | undefined;
    description?: string | null | undefined;
    max_context_length: number;
    aliases?: Array<string> | undefined;
    deprecation?: string | null | undefined;
    deprecation_replacement_model?: string | null | undefined;
    default_model_temperature?: number | null | undefined;
    type: "base";
};

/** @internal */
declare const BaseModelCard$outboundSchema: z.ZodType<BaseModelCard$Outbound, z.ZodTypeDef, BaseModelCard>;

declare type BaseModelCard = {
    id: string;
    object?: string | undefined;
    created?: number | undefined;
    ownedBy?: string | undefined;
    capabilities: ModelCapabilities;
    name?: string | null | undefined;
    description?: string | null | undefined;
    maxContextLength?: number | undefined;
    aliases?: Array<string> | undefined;
    deprecation?: Date | null | undefined;
    deprecationReplacementModel?: string | null | undefined;
    defaultModelTemperature?: number | null | undefined;
    type?: "base" | undefined;
};

declare function baseModelCardFromJSON(jsonString: string): Result<BaseModelCard, SDKValidationError>;

declare function baseModelCardToJSON(baseModelCard: BaseModelCard): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BaseModelCardType$ {
    /** @deprecated use `BaseModelCardType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Base: "base";
    }>;
    /** @deprecated use `BaseModelCardType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Base: "base";
    }>;
}

/** @internal */
declare const BaseModelCardType$inboundSchema: z.ZodNativeEnum<typeof BaseModelCardType>;

/** @internal */
declare const BaseModelCardType$outboundSchema: z.ZodNativeEnum<typeof BaseModelCardType>;

declare const BaseModelCardType: {
    readonly Base: "base";
};

declare type BaseModelCardType = ClosedEnum<typeof BaseModelCardType>;

declare class Batch extends ClientSDK {
    private _jobs?;
    get jobs(): MistralJobs;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchError$ {
    /** @deprecated use `BatchError$inboundSchema` instead. */
    const inboundSchema: z.ZodType<BatchError, z.ZodTypeDef, unknown>;
    /** @deprecated use `BatchError$outboundSchema` instead. */
    const outboundSchema: z.ZodType<BatchError$Outbound, z.ZodTypeDef, BatchError>;
    /** @deprecated use `BatchError$Outbound` instead. */
    type Outbound = BatchError$Outbound;
}

/** @internal */
declare const BatchError$inboundSchema: z.ZodType<BatchError, z.ZodTypeDef, unknown>;

/** @internal */
declare type BatchError$Outbound = {
    message: string;
    count: number;
};

/** @internal */
declare const BatchError$outboundSchema: z.ZodType<BatchError$Outbound, z.ZodTypeDef, BatchError>;

declare type BatchError = {
    message: string;
    count?: number | undefined;
};

declare function batchErrorFromJSON(jsonString: string): Result<BatchError, SDKValidationError>;

declare function batchErrorToJSON(batchError: BatchError): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchJobIn$ {
    /** @deprecated use `BatchJobIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<BatchJobIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `BatchJobIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<BatchJobIn$Outbound, z.ZodTypeDef, BatchJobIn>;
    /** @deprecated use `BatchJobIn$Outbound` instead. */
    type Outbound = BatchJobIn$Outbound;
}

/** @internal */
declare const BatchJobIn$inboundSchema: z.ZodType<BatchJobIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type BatchJobIn$Outbound = {
    input_files: Array<string>;
    endpoint: string;
    model?: string | null | undefined;
    agent_id?: string | null | undefined;
    metadata?: {
        [k: string]: string;
    } | null | undefined;
    timeout_hours: number;
};

/** @internal */
declare const BatchJobIn$outboundSchema: z.ZodType<BatchJobIn$Outbound, z.ZodTypeDef, BatchJobIn>;

declare type BatchJobIn = {
    inputFiles: Array<string>;
    endpoint: ApiEndpoint;
    model?: string | null | undefined;
    agentId?: string | null | undefined;
    metadata?: {
        [k: string]: string;
    } | null | undefined;
    timeoutHours?: number | undefined;
};

declare function batchJobInFromJSON(jsonString: string): Result<BatchJobIn, SDKValidationError>;

declare function batchJobInToJSON(batchJobIn: BatchJobIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchJobOut$ {
    /** @deprecated use `BatchJobOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<BatchJobOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `BatchJobOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<BatchJobOut$Outbound, z.ZodTypeDef, BatchJobOut>;
    /** @deprecated use `BatchJobOut$Outbound` instead. */
    type Outbound = BatchJobOut$Outbound;
}

/** @internal */
declare const BatchJobOut$inboundSchema: z.ZodType<BatchJobOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type BatchJobOut$Outbound = {
    id: string;
    object: string;
    input_files: Array<string>;
    metadata?: {
        [k: string]: any;
    } | null | undefined;
    endpoint: string;
    model?: string | null | undefined;
    agent_id?: string | null | undefined;
    output_file?: string | null | undefined;
    error_file?: string | null | undefined;
    errors: Array<BatchError$Outbound>;
    status: string;
    created_at: number;
    total_requests: number;
    completed_requests: number;
    succeeded_requests: number;
    failed_requests: number;
    started_at?: number | null | undefined;
    completed_at?: number | null | undefined;
};

/** @internal */
declare const BatchJobOut$outboundSchema: z.ZodType<BatchJobOut$Outbound, z.ZodTypeDef, BatchJobOut>;

declare type BatchJobOut = {
    id: string;
    object?: BatchJobOutObject | undefined;
    inputFiles: Array<string>;
    metadata?: {
        [k: string]: any;
    } | null | undefined;
    endpoint: string;
    model?: string | null | undefined;
    agentId?: string | null | undefined;
    outputFile?: string | null | undefined;
    errorFile?: string | null | undefined;
    errors: Array<BatchError>;
    status: BatchJobStatus;
    createdAt: number;
    totalRequests: number;
    completedRequests: number;
    succeededRequests: number;
    failedRequests: number;
    startedAt?: number | null | undefined;
    completedAt?: number | null | undefined;
};

declare function batchJobOutFromJSON(jsonString: string): Result<BatchJobOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchJobOutObject$ {
    /** @deprecated use `BatchJobOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Batch: "batch";
    }>;
    /** @deprecated use `BatchJobOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Batch: "batch";
    }>;
}

/** @internal */
declare const BatchJobOutObject$inboundSchema: z.ZodNativeEnum<typeof BatchJobOutObject>;

/** @internal */
declare const BatchJobOutObject$outboundSchema: z.ZodNativeEnum<typeof BatchJobOutObject>;

declare const BatchJobOutObject: {
    readonly Batch: "batch";
};

declare type BatchJobOutObject = ClosedEnum<typeof BatchJobOutObject>;

declare function batchJobOutToJSON(batchJobOut: BatchJobOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchJobsOut$ {
    /** @deprecated use `BatchJobsOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<BatchJobsOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `BatchJobsOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<BatchJobsOut$Outbound, z.ZodTypeDef, BatchJobsOut>;
    /** @deprecated use `BatchJobsOut$Outbound` instead. */
    type Outbound = BatchJobsOut$Outbound;
}

/** @internal */
declare const BatchJobsOut$inboundSchema: z.ZodType<BatchJobsOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type BatchJobsOut$Outbound = {
    data?: Array<BatchJobOut$Outbound> | undefined;
    object: string;
    total: number;
};

/** @internal */
declare const BatchJobsOut$outboundSchema: z.ZodType<BatchJobsOut$Outbound, z.ZodTypeDef, BatchJobsOut>;

declare type BatchJobsOut = {
    data?: Array<BatchJobOut> | undefined;
    object?: BatchJobsOutObject | undefined;
    total: number;
};

declare function batchJobsOutFromJSON(jsonString: string): Result<BatchJobsOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchJobsOutObject$ {
    /** @deprecated use `BatchJobsOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly List: "list";
    }>;
    /** @deprecated use `BatchJobsOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly List: "list";
    }>;
}

/** @internal */
declare const BatchJobsOutObject$inboundSchema: z.ZodNativeEnum<typeof BatchJobsOutObject>;

/** @internal */
declare const BatchJobsOutObject$outboundSchema: z.ZodNativeEnum<typeof BatchJobsOutObject>;

declare const BatchJobsOutObject: {
    readonly List: "list";
};

declare type BatchJobsOutObject = ClosedEnum<typeof BatchJobsOutObject>;

declare function batchJobsOutToJSON(batchJobsOut: BatchJobsOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BatchJobStatus$ {
    /** @deprecated use `BatchJobStatus$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Running: "RUNNING";
        readonly Success: "SUCCESS";
        readonly Failed: "FAILED";
        readonly TimeoutExceeded: "TIMEOUT_EXCEEDED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
        readonly Cancelled: "CANCELLED";
    }>;
    /** @deprecated use `BatchJobStatus$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Running: "RUNNING";
        readonly Success: "SUCCESS";
        readonly Failed: "FAILED";
        readonly TimeoutExceeded: "TIMEOUT_EXCEEDED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
        readonly Cancelled: "CANCELLED";
    }>;
}

/** @internal */
declare const BatchJobStatus$inboundSchema: z.ZodNativeEnum<typeof BatchJobStatus>;

/** @internal */
declare const BatchJobStatus$outboundSchema: z.ZodNativeEnum<typeof BatchJobStatus>;

declare const BatchJobStatus: {
    readonly Queued: "QUEUED";
    readonly Running: "RUNNING";
    readonly Success: "SUCCESS";
    readonly Failed: "FAILED";
    readonly TimeoutExceeded: "TIMEOUT_EXCEEDED";
    readonly CancellationRequested: "CANCELLATION_REQUESTED";
    readonly Cancelled: "CANCELLED";
};

declare type BatchJobStatus = ClosedEnum<typeof BatchJobStatus>;

declare type BeforeCreateRequestContext = HookContext & {};

declare interface BeforeCreateRequestHook {
    /**
     * A hook that is called before the SDK creates a `Request` object. The hook
     * can modify how a request is constructed since certain modifications, like
     * changing the request URL, cannot be done on a request object directly.
     */
    beforeCreateRequest: (hookCtx: BeforeCreateRequestContext, input: RequestInput) => RequestInput;
}

declare type BeforeRequestContext = HookContext & {};

declare type BeforeRequestHook = (req: Request) => Awaitable<Request | void>;

declare interface BeforeRequestHook_2 {
    /**
     * A hook that is called before the SDK sends a request. The hook can
     * introduce instrumentation code such as logging, tracing and metrics or
     * replace the request before it is sent or throw an error to stop the
     * request from being sent.
     */
    beforeRequest: (hookCtx: BeforeRequestContext, request: Request) => Awaitable_2<Request>;
}

declare class Beta extends ClientSDK {
    private _conversations?;
    get conversations(): Conversations;
    private _agents?;
    get agents(): MistralAgents;
    private _libraries?;
    get libraries(): Libraries;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace BuiltInConnectors$ {
    /** @deprecated use `BuiltInConnectors$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly WebSearch: "web_search";
        readonly WebSearchPremium: "web_search_premium";
        readonly CodeInterpreter: "code_interpreter";
        readonly ImageGeneration: "image_generation";
        readonly DocumentLibrary: "document_library";
    }>;
    /** @deprecated use `BuiltInConnectors$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly WebSearch: "web_search";
        readonly WebSearchPremium: "web_search_premium";
        readonly CodeInterpreter: "code_interpreter";
        readonly ImageGeneration: "image_generation";
        readonly DocumentLibrary: "document_library";
    }>;
}

/** @internal */
declare const BuiltInConnectors$inboundSchema: z.ZodNativeEnum<typeof BuiltInConnectors>;

/** @internal */
declare const BuiltInConnectors$outboundSchema: z.ZodNativeEnum<typeof BuiltInConnectors>;

declare const BuiltInConnectors: {
    readonly WebSearch: "web_search";
    readonly WebSearchPremium: "web_search_premium";
    readonly CodeInterpreter: "code_interpreter";
    readonly ImageGeneration: "image_generation";
    readonly DocumentLibrary: "document_library";
};

declare type BuiltInConnectors = ClosedEnum<typeof BuiltInConnectors>;

declare class Chat extends ClientSDK {
    /**
     * Chat Completion with the response parsed in the same format as the input requestFormat.
     *
     * @remarks
     * The response will be parsed back to the initial Zod object passed in the requestFormat field.
     */
    parse(request: ParsedChatCompletionRequest<z_2.ZodTypeAny>, options?: RequestOptions): Promise<ParsedChatCompletionResponse<z_2.ZodTypeAny>>;
    /**
     * Stream chat completion with a parsed request input.
     *
     * @remarks
     * Unlike the .parse method, this method will return a stream of events containing the JSON response. It will not be parsed back to the initial Zod object.
     * If you need to parse the stream, see the examples/src/async_structured_outputs.ts file.
     */
    parseStream(request: ParsedChatCompletionRequest<z_2.ZodTypeAny>, options?: RequestOptions): Promise<EventStream<components.CompletionEvent>>;
    /**
     * Chat Completion
     */
    complete(request: components.ChatCompletionRequest, options?: RequestOptions): Promise<components.ChatCompletionResponse>;
    /**
     * Stream chat completion
     *
     * @remarks
     * Mistral AI provides the ability to stream responses back to a client in order to allow partial results for certain requests. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
     */
    stream(request: components.ChatCompletionStreamRequest, options?: RequestOptions): Promise<EventStream<components.CompletionEvent>>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatClassificationRequest$ {
    /** @deprecated use `ChatClassificationRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatClassificationRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatClassificationRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatClassificationRequest$Outbound, z.ZodTypeDef, ChatClassificationRequest>;
    /** @deprecated use `ChatClassificationRequest$Outbound` instead. */
    type Outbound = ChatClassificationRequest$Outbound;
}

/** @internal */
declare const ChatClassificationRequest$inboundSchema: z.ZodType<ChatClassificationRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatClassificationRequest$Outbound = {
    model: string;
    input: Inputs$Outbound;
};

/** @internal */
declare const ChatClassificationRequest$outboundSchema: z.ZodType<ChatClassificationRequest$Outbound, z.ZodTypeDef, ChatClassificationRequest>;

declare type ChatClassificationRequest = {
    model: string;
    /**
     * Chat to classify
     */
    inputs: Inputs;
};

declare function chatClassificationRequestFromJSON(jsonString: string): Result<ChatClassificationRequest, SDKValidationError>;

declare function chatClassificationRequestToJSON(chatClassificationRequest: ChatClassificationRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionChoice$ {
    /** @deprecated use `ChatCompletionChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionChoice$Outbound, z.ZodTypeDef, ChatCompletionChoice>;
    /** @deprecated use `ChatCompletionChoice$Outbound` instead. */
    type Outbound = ChatCompletionChoice$Outbound;
}

/** @internal */
declare const ChatCompletionChoice$inboundSchema: z.ZodType<ChatCompletionChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionChoice$Outbound = {
    index: number;
    message: AssistantMessage$Outbound;
    finish_reason: string;
};

/** @internal */
declare const ChatCompletionChoice$outboundSchema: z.ZodType<ChatCompletionChoice$Outbound, z.ZodTypeDef, ChatCompletionChoice>;

declare type ChatCompletionChoice = {
    index: number;
    message: AssistantMessage;
    finishReason: FinishReason;
};

declare function chatCompletionChoiceFromJSON(jsonString: string): Result<ChatCompletionChoice, SDKValidationError>;

declare function chatCompletionChoiceToJSON(chatCompletionChoice: ChatCompletionChoice): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionRequest$ {
    /** @deprecated use `ChatCompletionRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionRequest$Outbound, z.ZodTypeDef, ChatCompletionRequest>;
    /** @deprecated use `ChatCompletionRequest$Outbound` instead. */
    type Outbound = ChatCompletionRequest$Outbound;
}

/** @internal */
declare const ChatCompletionRequest$inboundSchema: z.ZodType<ChatCompletionRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionRequest$Outbound = {
    model: string;
    temperature?: number | null | undefined;
    top_p?: number | undefined;
    max_tokens?: number | null | undefined;
    stream: boolean;
    stop?: string | Array<string> | undefined;
    random_seed?: number | null | undefined;
    messages: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>;
    response_format?: ResponseFormat$Outbound | undefined;
    tools?: Array<Tool$Outbound> | null | undefined;
    tool_choice?: ToolChoice$Outbound | string | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    n?: number | null | undefined;
    prediction?: Prediction$Outbound | undefined;
    parallel_tool_calls?: boolean | undefined;
    prompt_mode?: string | null | undefined;
    safe_prompt?: boolean | undefined;
};

/** @internal */
declare const ChatCompletionRequest$outboundSchema: z.ZodType<ChatCompletionRequest$Outbound, z.ZodTypeDef, ChatCompletionRequest>;

declare type ChatCompletionRequest = {
    /**
     * ID of the model to use. You can use the [List Available Models](/api/#tag/models/operation/list_models_v1_models_get) API to see all of your available models, or see our [Model overview](/models) for model descriptions.
     */
    model: string;
    /**
     * What sampling temperature to use, we recommend between 0.0 and 0.7. Higher values like 0.7 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both. The default value varies depending on the model you are targeting. Call the `/models` endpoint to retrieve the appropriate value.
     */
    temperature?: number | null | undefined;
    /**
     * Nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.
     */
    topP?: number | undefined;
    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length.
     */
    maxTokens?: number | null | undefined;
    /**
     * Whether to stream back partial progress. If set, tokens will be sent as data-only server-side events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
     */
    stream?: boolean | undefined;
    /**
     * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
     */
    stop?: string | Array<string> | undefined;
    /**
     * The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | null | undefined;
    /**
     * The prompt(s) to generate completions for, encoded as a list of dict with role and content.
     */
    messages: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>;
    responseFormat?: ResponseFormat | undefined;
    tools?: Array<Tool> | null | undefined;
    toolChoice?: ToolChoice | ToolChoiceEnum | undefined;
    /**
     * presence_penalty determines how much the model penalizes the repetition of words or phrases. A higher presence penalty encourages the model to use a wider variety of words and phrases, making the output more diverse and creative.
     */
    presencePenalty?: number | undefined;
    /**
     * frequency_penalty penalizes the repetition of words based on their frequency in the generated text. A higher frequency penalty discourages the model from repeating words that have already appeared frequently in the output, promoting diversity and reducing repetition.
     */
    frequencyPenalty?: number | undefined;
    /**
     * Number of completions to return for each request, input tokens are only billed once.
     */
    n?: number | null | undefined;
    prediction?: Prediction | undefined;
    parallelToolCalls?: boolean | undefined;
    /**
     * Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.
     */
    promptMode?: MistralPromptMode | null | undefined;
    /**
     * Whether to inject a safety prompt before all conversations.
     */
    safePrompt?: boolean | undefined;
};

declare function chatCompletionRequestFromJSON(jsonString: string): Result<ChatCompletionRequest, SDKValidationError>;

declare function chatCompletionRequestToJSON(chatCompletionRequest: ChatCompletionRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionRequestToolChoice$ {
    /** @deprecated use `ChatCompletionRequestToolChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionRequestToolChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionRequestToolChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionRequestToolChoice$Outbound, z.ZodTypeDef, ChatCompletionRequestToolChoice>;
    /** @deprecated use `ChatCompletionRequestToolChoice$Outbound` instead. */
    type Outbound = ChatCompletionRequestToolChoice$Outbound;
}

/** @internal */
declare const ChatCompletionRequestToolChoice$inboundSchema: z.ZodType<ChatCompletionRequestToolChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionRequestToolChoice$Outbound = ToolChoice$Outbound | string;

/** @internal */
declare const ChatCompletionRequestToolChoice$outboundSchema: z.ZodType<ChatCompletionRequestToolChoice$Outbound, z.ZodTypeDef, ChatCompletionRequestToolChoice>;

declare type ChatCompletionRequestToolChoice = ToolChoice | ToolChoiceEnum;

declare function chatCompletionRequestToolChoiceFromJSON(jsonString: string): Result<ChatCompletionRequestToolChoice, SDKValidationError>;

declare function chatCompletionRequestToolChoiceToJSON(chatCompletionRequestToolChoice: ChatCompletionRequestToolChoice): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionResponse$ {
    /** @deprecated use `ChatCompletionResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionResponse$Outbound, z.ZodTypeDef, ChatCompletionResponse>;
    /** @deprecated use `ChatCompletionResponse$Outbound` instead. */
    type Outbound = ChatCompletionResponse$Outbound;
}

/** @internal */
declare const ChatCompletionResponse$inboundSchema: z.ZodType<ChatCompletionResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionResponse$Outbound = {
    id: string;
    object: string;
    model: string;
    usage: UsageInfo$Outbound;
    created: number;
    choices: Array<ChatCompletionChoice$Outbound>;
};

/** @internal */
declare const ChatCompletionResponse$outboundSchema: z.ZodType<ChatCompletionResponse$Outbound, z.ZodTypeDef, ChatCompletionResponse>;

declare type ChatCompletionResponse = {
    id: string;
    object: string;
    model: string;
    usage: UsageInfo;
    created: number;
    choices: Array<ChatCompletionChoice>;
};

declare function chatCompletionResponseFromJSON(jsonString: string): Result<ChatCompletionResponse, SDKValidationError>;

declare function chatCompletionResponseToJSON(chatCompletionResponse: ChatCompletionResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionStreamRequest$ {
    /** @deprecated use `ChatCompletionStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionStreamRequest$Outbound, z.ZodTypeDef, ChatCompletionStreamRequest>;
    /** @deprecated use `ChatCompletionStreamRequest$Outbound` instead. */
    type Outbound = ChatCompletionStreamRequest$Outbound;
}

/** @internal */
declare const ChatCompletionStreamRequest$inboundSchema: z.ZodType<ChatCompletionStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionStreamRequest$Outbound = {
    model: string;
    temperature?: number | null | undefined;
    top_p?: number | undefined;
    max_tokens?: number | null | undefined;
    stream: boolean;
    stop?: string | Array<string> | undefined;
    random_seed?: number | null | undefined;
    messages: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>;
    response_format?: ResponseFormat$Outbound | undefined;
    tools?: Array<Tool$Outbound> | null | undefined;
    tool_choice?: ToolChoice$Outbound | string | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    n?: number | null | undefined;
    prediction?: Prediction$Outbound | undefined;
    parallel_tool_calls?: boolean | undefined;
    prompt_mode?: string | null | undefined;
    safe_prompt?: boolean | undefined;
};

/** @internal */
declare const ChatCompletionStreamRequest$outboundSchema: z.ZodType<ChatCompletionStreamRequest$Outbound, z.ZodTypeDef, ChatCompletionStreamRequest>;

declare type ChatCompletionStreamRequest = {
    /**
     * ID of the model to use. You can use the [List Available Models](/api/#tag/models/operation/list_models_v1_models_get) API to see all of your available models, or see our [Model overview](/models) for model descriptions.
     */
    model: string;
    /**
     * What sampling temperature to use, we recommend between 0.0 and 0.7. Higher values like 0.7 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both. The default value varies depending on the model you are targeting. Call the `/models` endpoint to retrieve the appropriate value.
     */
    temperature?: number | null | undefined;
    /**
     * Nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.
     */
    topP?: number | undefined;
    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length.
     */
    maxTokens?: number | null | undefined;
    stream?: boolean | undefined;
    /**
     * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
     */
    stop?: string | Array<string> | undefined;
    /**
     * The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | null | undefined;
    /**
     * The prompt(s) to generate completions for, encoded as a list of dict with role and content.
     */
    messages: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>;
    responseFormat?: ResponseFormat | undefined;
    tools?: Array<Tool> | null | undefined;
    toolChoice?: ToolChoice | ToolChoiceEnum | undefined;
    /**
     * presence_penalty determines how much the model penalizes the repetition of words or phrases. A higher presence penalty encourages the model to use a wider variety of words and phrases, making the output more diverse and creative.
     */
    presencePenalty?: number | undefined;
    /**
     * frequency_penalty penalizes the repetition of words based on their frequency in the generated text. A higher frequency penalty discourages the model from repeating words that have already appeared frequently in the output, promoting diversity and reducing repetition.
     */
    frequencyPenalty?: number | undefined;
    /**
     * Number of completions to return for each request, input tokens are only billed once.
     */
    n?: number | null | undefined;
    prediction?: Prediction | undefined;
    parallelToolCalls?: boolean | undefined;
    /**
     * Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.
     */
    promptMode?: MistralPromptMode | null | undefined;
    /**
     * Whether to inject a safety prompt before all conversations.
     */
    safePrompt?: boolean | undefined;
};

declare function chatCompletionStreamRequestFromJSON(jsonString: string): Result<ChatCompletionStreamRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionStreamRequestMessages$ {
    /** @deprecated use `ChatCompletionStreamRequestMessages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionStreamRequestMessages, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionStreamRequestMessages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionStreamRequestMessages$Outbound, z.ZodTypeDef, ChatCompletionStreamRequestMessages>;
    /** @deprecated use `ChatCompletionStreamRequestMessages$Outbound` instead. */
    type Outbound = ChatCompletionStreamRequestMessages$Outbound;
}

/** @internal */
declare const ChatCompletionStreamRequestMessages$inboundSchema: z.ZodType<ChatCompletionStreamRequestMessages, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionStreamRequestMessages$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const ChatCompletionStreamRequestMessages$outboundSchema: z.ZodType<ChatCompletionStreamRequestMessages$Outbound, z.ZodTypeDef, ChatCompletionStreamRequestMessages>;

declare type ChatCompletionStreamRequestMessages = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function chatCompletionStreamRequestMessagesFromJSON(jsonString: string): Result<ChatCompletionStreamRequestMessages, SDKValidationError>;

declare function chatCompletionStreamRequestMessagesToJSON(chatCompletionStreamRequestMessages: ChatCompletionStreamRequestMessages): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionStreamRequestStop$ {
    /** @deprecated use `ChatCompletionStreamRequestStop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionStreamRequestStop, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionStreamRequestStop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionStreamRequestStop$Outbound, z.ZodTypeDef, ChatCompletionStreamRequestStop>;
    /** @deprecated use `ChatCompletionStreamRequestStop$Outbound` instead. */
    type Outbound = ChatCompletionStreamRequestStop$Outbound;
}

/** @internal */
declare const ChatCompletionStreamRequestStop$inboundSchema: z.ZodType<ChatCompletionStreamRequestStop, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionStreamRequestStop$Outbound = string | Array<string>;

/** @internal */
declare const ChatCompletionStreamRequestStop$outboundSchema: z.ZodType<ChatCompletionStreamRequestStop$Outbound, z.ZodTypeDef, ChatCompletionStreamRequestStop>;

/**
 * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
 */
declare type ChatCompletionStreamRequestStop = string | Array<string>;

declare function chatCompletionStreamRequestStopFromJSON(jsonString: string): Result<ChatCompletionStreamRequestStop, SDKValidationError>;

declare function chatCompletionStreamRequestStopToJSON(chatCompletionStreamRequestStop: ChatCompletionStreamRequestStop): string;

declare function chatCompletionStreamRequestToJSON(chatCompletionStreamRequest: ChatCompletionStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatCompletionStreamRequestToolChoice$ {
    /** @deprecated use `ChatCompletionStreamRequestToolChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatCompletionStreamRequestToolChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatCompletionStreamRequestToolChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatCompletionStreamRequestToolChoice$Outbound, z.ZodTypeDef, ChatCompletionStreamRequestToolChoice>;
    /** @deprecated use `ChatCompletionStreamRequestToolChoice$Outbound` instead. */
    type Outbound = ChatCompletionStreamRequestToolChoice$Outbound;
}

/** @internal */
declare const ChatCompletionStreamRequestToolChoice$inboundSchema: z.ZodType<ChatCompletionStreamRequestToolChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatCompletionStreamRequestToolChoice$Outbound = ToolChoice$Outbound | string;

/** @internal */
declare const ChatCompletionStreamRequestToolChoice$outboundSchema: z.ZodType<ChatCompletionStreamRequestToolChoice$Outbound, z.ZodTypeDef, ChatCompletionStreamRequestToolChoice>;

declare type ChatCompletionStreamRequestToolChoice = ToolChoice | ToolChoiceEnum;

declare function chatCompletionStreamRequestToolChoiceFromJSON(jsonString: string): Result<ChatCompletionStreamRequestToolChoice, SDKValidationError>;

declare function chatCompletionStreamRequestToolChoiceToJSON(chatCompletionStreamRequestToolChoice: ChatCompletionStreamRequestToolChoice): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatModerationRequest$ {
    /** @deprecated use `ChatModerationRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatModerationRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatModerationRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatModerationRequest$Outbound, z.ZodTypeDef, ChatModerationRequest>;
    /** @deprecated use `ChatModerationRequest$Outbound` instead. */
    type Outbound = ChatModerationRequest$Outbound;
}

/** @internal */
declare const ChatModerationRequest$inboundSchema: z.ZodType<ChatModerationRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatModerationRequest$Outbound = {
    input: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })> | Array<Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>>;
    model: string;
};

/** @internal */
declare const ChatModerationRequest$outboundSchema: z.ZodType<ChatModerationRequest$Outbound, z.ZodTypeDef, ChatModerationRequest>;

declare type ChatModerationRequest = {
    /**
     * Chat to classify
     */
    inputs: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })> | Array<Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>>;
    model: string;
};

declare function chatModerationRequestFromJSON(jsonString: string): Result<ChatModerationRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ChatModerationRequestInputs$ {
    /** @deprecated use `ChatModerationRequestInputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ChatModerationRequestInputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `ChatModerationRequestInputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ChatModerationRequestInputs$Outbound, z.ZodTypeDef, ChatModerationRequestInputs>;
    /** @deprecated use `ChatModerationRequestInputs$Outbound` instead. */
    type Outbound = ChatModerationRequestInputs$Outbound;
}

/** @internal */
declare const ChatModerationRequestInputs$inboundSchema: z.ZodType<ChatModerationRequestInputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type ChatModerationRequestInputs$Outbound = Array<(SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
})> | Array<Array<(SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
})>>;

/** @internal */
declare const ChatModerationRequestInputs$outboundSchema: z.ZodType<ChatModerationRequestInputs$Outbound, z.ZodTypeDef, ChatModerationRequestInputs>;

/**
 * Chat to classify
 */
declare type ChatModerationRequestInputs = Array<(SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
})> | Array<Array<(SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
})>>;

declare function chatModerationRequestInputsFromJSON(jsonString: string): Result<ChatModerationRequestInputs, SDKValidationError>;

declare function chatModerationRequestInputsToJSON(chatModerationRequestInputs: ChatModerationRequestInputs): string;

declare function chatModerationRequestToJSON(chatModerationRequest: ChatModerationRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CheckpointOut$ {
    /** @deprecated use `CheckpointOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CheckpointOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `CheckpointOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CheckpointOut$Outbound, z.ZodTypeDef, CheckpointOut>;
    /** @deprecated use `CheckpointOut$Outbound` instead. */
    type Outbound = CheckpointOut$Outbound;
}

/** @internal */
declare const CheckpointOut$inboundSchema: z.ZodType<CheckpointOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type CheckpointOut$Outbound = {
    metrics: MetricOut$Outbound;
    step_number: number;
    created_at: number;
};

/** @internal */
declare const CheckpointOut$outboundSchema: z.ZodType<CheckpointOut$Outbound, z.ZodTypeDef, CheckpointOut>;

declare type CheckpointOut = {
    /**
     * Metrics at the step number during the fine-tuning job. Use these metrics to assess if the training is going smoothly (loss should decrease, token accuracy should increase).
     */
    metrics: MetricOut;
    /**
     * The step number that the checkpoint was created at.
     */
    stepNumber: number;
    /**
     * The UNIX timestamp (in seconds) for when the checkpoint was created.
     */
    createdAt: number;
};

declare function checkpointOutFromJSON(jsonString: string): Result<CheckpointOut, SDKValidationError>;

declare function checkpointOutToJSON(checkpointOut: CheckpointOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassificationRequest$ {
    /** @deprecated use `ClassificationRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassificationRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassificationRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassificationRequest$Outbound, z.ZodTypeDef, ClassificationRequest>;
    /** @deprecated use `ClassificationRequest$Outbound` instead. */
    type Outbound = ClassificationRequest$Outbound;
}

/** @internal */
declare const ClassificationRequest$inboundSchema: z.ZodType<ClassificationRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassificationRequest$Outbound = {
    model: string;
    input: string | Array<string>;
};

/** @internal */
declare const ClassificationRequest$outboundSchema: z.ZodType<ClassificationRequest$Outbound, z.ZodTypeDef, ClassificationRequest>;

declare type ClassificationRequest = {
    /**
     * ID of the model to use.
     */
    model: string;
    /**
     * Text to classify.
     */
    inputs: string | Array<string>;
};

declare function classificationRequestFromJSON(jsonString: string): Result<ClassificationRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassificationRequestInputs$ {
    /** @deprecated use `ClassificationRequestInputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassificationRequestInputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassificationRequestInputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassificationRequestInputs$Outbound, z.ZodTypeDef, ClassificationRequestInputs>;
    /** @deprecated use `ClassificationRequestInputs$Outbound` instead. */
    type Outbound = ClassificationRequestInputs$Outbound;
}

/** @internal */
declare const ClassificationRequestInputs$inboundSchema: z.ZodType<ClassificationRequestInputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassificationRequestInputs$Outbound = string | Array<string>;

/** @internal */
declare const ClassificationRequestInputs$outboundSchema: z.ZodType<ClassificationRequestInputs$Outbound, z.ZodTypeDef, ClassificationRequestInputs>;

/**
 * Text to classify.
 */
declare type ClassificationRequestInputs = string | Array<string>;

declare function classificationRequestInputsFromJSON(jsonString: string): Result<ClassificationRequestInputs, SDKValidationError>;

declare function classificationRequestInputsToJSON(classificationRequestInputs: ClassificationRequestInputs): string;

declare function classificationRequestToJSON(classificationRequest: ClassificationRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassificationResponse$ {
    /** @deprecated use `ClassificationResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassificationResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassificationResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassificationResponse$Outbound, z.ZodTypeDef, ClassificationResponse>;
    /** @deprecated use `ClassificationResponse$Outbound` instead. */
    type Outbound = ClassificationResponse$Outbound;
}

/** @internal */
declare const ClassificationResponse$inboundSchema: z.ZodType<ClassificationResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassificationResponse$Outbound = {
    id: string;
    model: string;
    results: Array<{
        [k: string]: ClassificationTargetResult$Outbound;
    }>;
};

/** @internal */
declare const ClassificationResponse$outboundSchema: z.ZodType<ClassificationResponse$Outbound, z.ZodTypeDef, ClassificationResponse>;

declare type ClassificationResponse = {
    id: string;
    model: string;
    results: Array<{
        [k: string]: ClassificationTargetResult;
    }>;
};

declare function classificationResponseFromJSON(jsonString: string): Result<ClassificationResponse, SDKValidationError>;

declare function classificationResponseToJSON(classificationResponse: ClassificationResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassificationTargetResult$ {
    /** @deprecated use `ClassificationTargetResult$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassificationTargetResult, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassificationTargetResult$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassificationTargetResult$Outbound, z.ZodTypeDef, ClassificationTargetResult>;
    /** @deprecated use `ClassificationTargetResult$Outbound` instead. */
    type Outbound = ClassificationTargetResult$Outbound;
}

/** @internal */
declare const ClassificationTargetResult$inboundSchema: z.ZodType<ClassificationTargetResult, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassificationTargetResult$Outbound = {
    scores: {
        [k: string]: number;
    };
};

/** @internal */
declare const ClassificationTargetResult$outboundSchema: z.ZodType<ClassificationTargetResult$Outbound, z.ZodTypeDef, ClassificationTargetResult>;

declare type ClassificationTargetResult = {
    scores: {
        [k: string]: number;
    };
};

declare function classificationTargetResultFromJSON(jsonString: string): Result<ClassificationTargetResult, SDKValidationError>;

declare function classificationTargetResultToJSON(classificationTargetResult: ClassificationTargetResult): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierDetailedJobOut$ {
    /** @deprecated use `ClassifierDetailedJobOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierDetailedJobOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierDetailedJobOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierDetailedJobOut$Outbound, z.ZodTypeDef, ClassifierDetailedJobOut>;
    /** @deprecated use `ClassifierDetailedJobOut$Outbound` instead. */
    type Outbound = ClassifierDetailedJobOut$Outbound;
}

/** @internal */
declare const ClassifierDetailedJobOut$inboundSchema: z.ZodType<ClassifierDetailedJobOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierDetailedJobOut$Outbound = {
    id: string;
    auto_start: boolean;
    model: string;
    status: string;
    created_at: number;
    modified_at: number;
    training_files: Array<string>;
    validation_files?: Array<string> | null | undefined;
    object: string;
    fine_tuned_model?: string | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegrationOut$Outbound> | null | undefined;
    trained_tokens?: number | null | undefined;
    metadata?: JobMetadataOut$Outbound | null | undefined;
    job_type: string;
    hyperparameters: ClassifierTrainingParameters$Outbound;
    events?: Array<EventOut$Outbound> | undefined;
    checkpoints?: Array<CheckpointOut$Outbound> | undefined;
    classifier_targets: Array<ClassifierTargetOut$Outbound>;
};

/** @internal */
declare const ClassifierDetailedJobOut$outboundSchema: z.ZodType<ClassifierDetailedJobOut$Outbound, z.ZodTypeDef, ClassifierDetailedJobOut>;

declare type ClassifierDetailedJobOut = {
    id: string;
    autoStart: boolean;
    /**
     * The name of the model to fine-tune.
     */
    model: string;
    status: ClassifierDetailedJobOutStatus;
    createdAt: number;
    modifiedAt: number;
    trainingFiles: Array<string>;
    validationFiles?: Array<string> | null | undefined;
    object?: ClassifierDetailedJobOutObject | undefined;
    fineTunedModel?: string | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegrationOut> | null | undefined;
    trainedTokens?: number | null | undefined;
    metadata?: JobMetadataOut | null | undefined;
    jobType?: ClassifierDetailedJobOutJobType | undefined;
    hyperparameters: ClassifierTrainingParameters;
    /**
     * Event items are created every time the status of a fine-tuning job changes. The timestamped list of all events is accessible here.
     */
    events?: Array<EventOut> | undefined;
    checkpoints?: Array<CheckpointOut> | undefined;
    classifierTargets: Array<ClassifierTargetOut>;
};

declare function classifierDetailedJobOutFromJSON(jsonString: string): Result<ClassifierDetailedJobOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierDetailedJobOutIntegrations$ {
    /** @deprecated use `ClassifierDetailedJobOutIntegrations$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegrationOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierDetailedJobOutIntegrations$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegrationOut$Outbound, z.ZodTypeDef, WandbIntegrationOut>;
    /** @deprecated use `ClassifierDetailedJobOutIntegrations$Outbound` instead. */
    type Outbound = ClassifierDetailedJobOutIntegrations$Outbound;
}

/** @internal */
declare const ClassifierDetailedJobOutIntegrations$inboundSchema: z.ZodType<ClassifierDetailedJobOutIntegrations, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierDetailedJobOutIntegrations$Outbound = WandbIntegrationOut$Outbound;

/** @internal */
declare const ClassifierDetailedJobOutIntegrations$outboundSchema: z.ZodType<ClassifierDetailedJobOutIntegrations$Outbound, z.ZodTypeDef, ClassifierDetailedJobOutIntegrations>;

declare type ClassifierDetailedJobOutIntegrations = WandbIntegrationOut;

declare function classifierDetailedJobOutIntegrationsFromJSON(jsonString: string): Result<ClassifierDetailedJobOutIntegrations, SDKValidationError>;

declare function classifierDetailedJobOutIntegrationsToJSON(classifierDetailedJobOutIntegrations: ClassifierDetailedJobOutIntegrations): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierDetailedJobOutJobType$ {
    /** @deprecated use `ClassifierDetailedJobOutJobType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Classifier: "classifier";
    }>;
    /** @deprecated use `ClassifierDetailedJobOutJobType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Classifier: "classifier";
    }>;
}

/** @internal */
declare const ClassifierDetailedJobOutJobType$inboundSchema: z.ZodNativeEnum<typeof ClassifierDetailedJobOutJobType>;

/** @internal */
declare const ClassifierDetailedJobOutJobType$outboundSchema: z.ZodNativeEnum<typeof ClassifierDetailedJobOutJobType>;

declare const ClassifierDetailedJobOutJobType: {
    readonly Classifier: "classifier";
};

declare type ClassifierDetailedJobOutJobType = ClosedEnum<typeof ClassifierDetailedJobOutJobType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierDetailedJobOutObject$ {
    /** @deprecated use `ClassifierDetailedJobOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
    /** @deprecated use `ClassifierDetailedJobOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
}

/** @internal */
declare const ClassifierDetailedJobOutObject$inboundSchema: z.ZodNativeEnum<typeof ClassifierDetailedJobOutObject>;

/** @internal */
declare const ClassifierDetailedJobOutObject$outboundSchema: z.ZodNativeEnum<typeof ClassifierDetailedJobOutObject>;

declare const ClassifierDetailedJobOutObject: {
    readonly Job: "job";
};

declare type ClassifierDetailedJobOutObject = ClosedEnum<typeof ClassifierDetailedJobOutObject>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierDetailedJobOutStatus$ {
    /** @deprecated use `ClassifierDetailedJobOutStatus$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
    /** @deprecated use `ClassifierDetailedJobOutStatus$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
}

/** @internal */
declare const ClassifierDetailedJobOutStatus$inboundSchema: z.ZodNativeEnum<typeof ClassifierDetailedJobOutStatus>;

/** @internal */
declare const ClassifierDetailedJobOutStatus$outboundSchema: z.ZodNativeEnum<typeof ClassifierDetailedJobOutStatus>;

declare const ClassifierDetailedJobOutStatus: {
    readonly Queued: "QUEUED";
    readonly Started: "STARTED";
    readonly Validating: "VALIDATING";
    readonly Validated: "VALIDATED";
    readonly Running: "RUNNING";
    readonly FailedValidation: "FAILED_VALIDATION";
    readonly Failed: "FAILED";
    readonly Success: "SUCCESS";
    readonly Cancelled: "CANCELLED";
    readonly CancellationRequested: "CANCELLATION_REQUESTED";
};

declare type ClassifierDetailedJobOutStatus = ClosedEnum<typeof ClassifierDetailedJobOutStatus>;

declare function classifierDetailedJobOutToJSON(classifierDetailedJobOut: ClassifierDetailedJobOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierFTModelOut$ {
    /** @deprecated use `ClassifierFTModelOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierFTModelOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierFTModelOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierFTModelOut$Outbound, z.ZodTypeDef, ClassifierFTModelOut>;
    /** @deprecated use `ClassifierFTModelOut$Outbound` instead. */
    type Outbound = ClassifierFTModelOut$Outbound;
}

/** @internal */
declare const ClassifierFTModelOut$inboundSchema: z.ZodType<ClassifierFTModelOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierFTModelOut$Outbound = {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    workspace_id: string;
    root: string;
    root_version: string;
    archived: boolean;
    name?: string | null | undefined;
    description?: string | null | undefined;
    capabilities: FTModelCapabilitiesOut$Outbound;
    max_context_length: number;
    aliases?: Array<string> | undefined;
    job: string;
    classifier_targets: Array<ClassifierTargetOut$Outbound>;
    model_type: string;
};

/** @internal */
declare const ClassifierFTModelOut$outboundSchema: z.ZodType<ClassifierFTModelOut$Outbound, z.ZodTypeDef, ClassifierFTModelOut>;

declare type ClassifierFTModelOut = {
    id: string;
    object?: ClassifierFTModelOutObject | undefined;
    created: number;
    ownedBy: string;
    workspaceId: string;
    root: string;
    rootVersion: string;
    archived: boolean;
    name?: string | null | undefined;
    description?: string | null | undefined;
    capabilities: FTModelCapabilitiesOut;
    maxContextLength?: number | undefined;
    aliases?: Array<string> | undefined;
    job: string;
    classifierTargets: Array<ClassifierTargetOut>;
    modelType?: ClassifierFTModelOutModelType | undefined;
};

declare function classifierFTModelOutFromJSON(jsonString: string): Result<ClassifierFTModelOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierFTModelOutModelType$ {
    /** @deprecated use `ClassifierFTModelOutModelType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Classifier: "classifier";
    }>;
    /** @deprecated use `ClassifierFTModelOutModelType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Classifier: "classifier";
    }>;
}

/** @internal */
declare const ClassifierFTModelOutModelType$inboundSchema: z.ZodNativeEnum<typeof ClassifierFTModelOutModelType>;

/** @internal */
declare const ClassifierFTModelOutModelType$outboundSchema: z.ZodNativeEnum<typeof ClassifierFTModelOutModelType>;

declare const ClassifierFTModelOutModelType: {
    readonly Classifier: "classifier";
};

declare type ClassifierFTModelOutModelType = ClosedEnum<typeof ClassifierFTModelOutModelType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierFTModelOutObject$ {
    /** @deprecated use `ClassifierFTModelOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
    /** @deprecated use `ClassifierFTModelOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
}

/** @internal */
declare const ClassifierFTModelOutObject$inboundSchema: z.ZodNativeEnum<typeof ClassifierFTModelOutObject>;

/** @internal */
declare const ClassifierFTModelOutObject$outboundSchema: z.ZodNativeEnum<typeof ClassifierFTModelOutObject>;

declare const ClassifierFTModelOutObject: {
    readonly Model: "model";
};

declare type ClassifierFTModelOutObject = ClosedEnum<typeof ClassifierFTModelOutObject>;

declare function classifierFTModelOutToJSON(classifierFTModelOut: ClassifierFTModelOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierJobOut$ {
    /** @deprecated use `ClassifierJobOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierJobOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierJobOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierJobOut$Outbound, z.ZodTypeDef, ClassifierJobOut>;
    /** @deprecated use `ClassifierJobOut$Outbound` instead. */
    type Outbound = ClassifierJobOut$Outbound;
}

/** @internal */
declare const ClassifierJobOut$inboundSchema: z.ZodType<ClassifierJobOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierJobOut$Outbound = {
    id: string;
    auto_start: boolean;
    model: string;
    status: string;
    created_at: number;
    modified_at: number;
    training_files: Array<string>;
    validation_files?: Array<string> | null | undefined;
    object: string;
    fine_tuned_model?: string | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegrationOut$Outbound> | null | undefined;
    trained_tokens?: number | null | undefined;
    metadata?: JobMetadataOut$Outbound | null | undefined;
    job_type: string;
    hyperparameters: ClassifierTrainingParameters$Outbound;
};

/** @internal */
declare const ClassifierJobOut$outboundSchema: z.ZodType<ClassifierJobOut$Outbound, z.ZodTypeDef, ClassifierJobOut>;

declare type ClassifierJobOut = {
    /**
     * The ID of the job.
     */
    id: string;
    autoStart: boolean;
    /**
     * The name of the model to fine-tune.
     */
    model: string;
    /**
     * The current status of the fine-tuning job.
     */
    status: ClassifierJobOutStatus;
    /**
     * The UNIX timestamp (in seconds) for when the fine-tuning job was created.
     */
    createdAt: number;
    /**
     * The UNIX timestamp (in seconds) for when the fine-tuning job was last modified.
     */
    modifiedAt: number;
    /**
     * A list containing the IDs of uploaded files that contain training data.
     */
    trainingFiles: Array<string>;
    /**
     * A list containing the IDs of uploaded files that contain validation data.
     */
    validationFiles?: Array<string> | null | undefined;
    /**
     * The object type of the fine-tuning job.
     */
    object?: ClassifierJobOutObject | undefined;
    /**
     * The name of the fine-tuned model that is being created. The value will be `null` if the fine-tuning job is still running.
     */
    fineTunedModel?: string | null | undefined;
    /**
     * Optional text/code that adds more context for the model. When given a `prompt` and a `suffix` the model will fill what is between them. When `suffix` is not provided, the model will simply execute completion starting with `prompt`.
     */
    suffix?: string | null | undefined;
    /**
     * A list of integrations enabled for your fine-tuning job.
     */
    integrations?: Array<WandbIntegrationOut> | null | undefined;
    /**
     * Total number of tokens trained.
     */
    trainedTokens?: number | null | undefined;
    metadata?: JobMetadataOut | null | undefined;
    /**
     * The type of job (`FT` for fine-tuning).
     */
    jobType?: ClassifierJobOutJobType | undefined;
    hyperparameters: ClassifierTrainingParameters;
};

declare function classifierJobOutFromJSON(jsonString: string): Result<ClassifierJobOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierJobOutIntegrations$ {
    /** @deprecated use `ClassifierJobOutIntegrations$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegrationOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierJobOutIntegrations$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegrationOut$Outbound, z.ZodTypeDef, WandbIntegrationOut>;
    /** @deprecated use `ClassifierJobOutIntegrations$Outbound` instead. */
    type Outbound = ClassifierJobOutIntegrations$Outbound;
}

/** @internal */
declare const ClassifierJobOutIntegrations$inboundSchema: z.ZodType<ClassifierJobOutIntegrations, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierJobOutIntegrations$Outbound = WandbIntegrationOut$Outbound;

/** @internal */
declare const ClassifierJobOutIntegrations$outboundSchema: z.ZodType<ClassifierJobOutIntegrations$Outbound, z.ZodTypeDef, ClassifierJobOutIntegrations>;

declare type ClassifierJobOutIntegrations = WandbIntegrationOut;

declare function classifierJobOutIntegrationsFromJSON(jsonString: string): Result<ClassifierJobOutIntegrations, SDKValidationError>;

declare function classifierJobOutIntegrationsToJSON(classifierJobOutIntegrations: ClassifierJobOutIntegrations): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierJobOutJobType$ {
    /** @deprecated use `ClassifierJobOutJobType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Classifier: "classifier";
    }>;
    /** @deprecated use `ClassifierJobOutJobType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Classifier: "classifier";
    }>;
}

/** @internal */
declare const ClassifierJobOutJobType$inboundSchema: z.ZodNativeEnum<typeof ClassifierJobOutJobType>;

/** @internal */
declare const ClassifierJobOutJobType$outboundSchema: z.ZodNativeEnum<typeof ClassifierJobOutJobType>;

/**
 * The type of job (`FT` for fine-tuning).
 */
declare const ClassifierJobOutJobType: {
    readonly Classifier: "classifier";
};

/**
 * The type of job (`FT` for fine-tuning).
 */
declare type ClassifierJobOutJobType = ClosedEnum<typeof ClassifierJobOutJobType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierJobOutObject$ {
    /** @deprecated use `ClassifierJobOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
    /** @deprecated use `ClassifierJobOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
}

/** @internal */
declare const ClassifierJobOutObject$inboundSchema: z.ZodNativeEnum<typeof ClassifierJobOutObject>;

/** @internal */
declare const ClassifierJobOutObject$outboundSchema: z.ZodNativeEnum<typeof ClassifierJobOutObject>;

/**
 * The object type of the fine-tuning job.
 */
declare const ClassifierJobOutObject: {
    readonly Job: "job";
};

/**
 * The object type of the fine-tuning job.
 */
declare type ClassifierJobOutObject = ClosedEnum<typeof ClassifierJobOutObject>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierJobOutStatus$ {
    /** @deprecated use `ClassifierJobOutStatus$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
    /** @deprecated use `ClassifierJobOutStatus$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
}

/** @internal */
declare const ClassifierJobOutStatus$inboundSchema: z.ZodNativeEnum<typeof ClassifierJobOutStatus>;

/** @internal */
declare const ClassifierJobOutStatus$outboundSchema: z.ZodNativeEnum<typeof ClassifierJobOutStatus>;

/**
 * The current status of the fine-tuning job.
 */
declare const ClassifierJobOutStatus: {
    readonly Queued: "QUEUED";
    readonly Started: "STARTED";
    readonly Validating: "VALIDATING";
    readonly Validated: "VALIDATED";
    readonly Running: "RUNNING";
    readonly FailedValidation: "FAILED_VALIDATION";
    readonly Failed: "FAILED";
    readonly Success: "SUCCESS";
    readonly Cancelled: "CANCELLED";
    readonly CancellationRequested: "CANCELLATION_REQUESTED";
};

/**
 * The current status of the fine-tuning job.
 */
declare type ClassifierJobOutStatus = ClosedEnum<typeof ClassifierJobOutStatus>;

declare function classifierJobOutToJSON(classifierJobOut: ClassifierJobOut): string;

declare class Classifiers extends ClientSDK {
    /**
     * Moderations
     */
    moderate(request: components.ClassificationRequest, options?: RequestOptions): Promise<components.ModerationResponse>;
    /**
     * Chat Moderations
     */
    moderateChat(request: components.ChatModerationRequest, options?: RequestOptions): Promise<components.ModerationResponse>;
    /**
     * Classifications
     */
    classify(request: components.ClassificationRequest, options?: RequestOptions): Promise<components.ClassificationResponse>;
    /**
     * Chat Classifications
     */
    classifyChat(request: components.ChatClassificationRequest, options?: RequestOptions): Promise<components.ClassificationResponse>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierTargetIn$ {
    /** @deprecated use `ClassifierTargetIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierTargetIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierTargetIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierTargetIn$Outbound, z.ZodTypeDef, ClassifierTargetIn>;
    /** @deprecated use `ClassifierTargetIn$Outbound` instead. */
    type Outbound = ClassifierTargetIn$Outbound;
}

/** @internal */
declare const ClassifierTargetIn$inboundSchema: z.ZodType<ClassifierTargetIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierTargetIn$Outbound = {
    name: string;
    labels: Array<string>;
    weight: number;
    loss_function?: string | null | undefined;
};

/** @internal */
declare const ClassifierTargetIn$outboundSchema: z.ZodType<ClassifierTargetIn$Outbound, z.ZodTypeDef, ClassifierTargetIn>;

declare type ClassifierTargetIn = {
    name: string;
    labels: Array<string>;
    weight?: number | undefined;
    lossFunction?: FTClassifierLossFunction | null | undefined;
};

declare function classifierTargetInFromJSON(jsonString: string): Result<ClassifierTargetIn, SDKValidationError>;

declare function classifierTargetInToJSON(classifierTargetIn: ClassifierTargetIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierTargetOut$ {
    /** @deprecated use `ClassifierTargetOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierTargetOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierTargetOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierTargetOut$Outbound, z.ZodTypeDef, ClassifierTargetOut>;
    /** @deprecated use `ClassifierTargetOut$Outbound` instead. */
    type Outbound = ClassifierTargetOut$Outbound;
}

/** @internal */
declare const ClassifierTargetOut$inboundSchema: z.ZodType<ClassifierTargetOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierTargetOut$Outbound = {
    name: string;
    labels: Array<string>;
    weight: number;
    loss_function: string;
};

/** @internal */
declare const ClassifierTargetOut$outboundSchema: z.ZodType<ClassifierTargetOut$Outbound, z.ZodTypeDef, ClassifierTargetOut>;

declare type ClassifierTargetOut = {
    name: string;
    labels: Array<string>;
    weight: number;
    lossFunction: FTClassifierLossFunction;
};

declare function classifierTargetOutFromJSON(jsonString: string): Result<ClassifierTargetOut, SDKValidationError>;

declare function classifierTargetOutToJSON(classifierTargetOut: ClassifierTargetOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierTrainingParameters$ {
    /** @deprecated use `ClassifierTrainingParameters$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierTrainingParameters, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierTrainingParameters$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierTrainingParameters$Outbound, z.ZodTypeDef, ClassifierTrainingParameters>;
    /** @deprecated use `ClassifierTrainingParameters$Outbound` instead. */
    type Outbound = ClassifierTrainingParameters$Outbound;
}

/** @internal */
declare const ClassifierTrainingParameters$inboundSchema: z.ZodType<ClassifierTrainingParameters, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierTrainingParameters$Outbound = {
    training_steps?: number | null | undefined;
    learning_rate: number;
    weight_decay?: number | null | undefined;
    warmup_fraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seq_len?: number | null | undefined;
};

/** @internal */
declare const ClassifierTrainingParameters$outboundSchema: z.ZodType<ClassifierTrainingParameters$Outbound, z.ZodTypeDef, ClassifierTrainingParameters>;

declare type ClassifierTrainingParameters = {
    trainingSteps?: number | null | undefined;
    learningRate?: number | undefined;
    weightDecay?: number | null | undefined;
    warmupFraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seqLen?: number | null | undefined;
};

declare function classifierTrainingParametersFromJSON(jsonString: string): Result<ClassifierTrainingParameters, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ClassifierTrainingParametersIn$ {
    /** @deprecated use `ClassifierTrainingParametersIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ClassifierTrainingParametersIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `ClassifierTrainingParametersIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ClassifierTrainingParametersIn$Outbound, z.ZodTypeDef, ClassifierTrainingParametersIn>;
    /** @deprecated use `ClassifierTrainingParametersIn$Outbound` instead. */
    type Outbound = ClassifierTrainingParametersIn$Outbound;
}

/** @internal */
declare const ClassifierTrainingParametersIn$inboundSchema: z.ZodType<ClassifierTrainingParametersIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type ClassifierTrainingParametersIn$Outbound = {
    training_steps?: number | null | undefined;
    learning_rate: number;
    weight_decay?: number | null | undefined;
    warmup_fraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seq_len?: number | null | undefined;
};

/** @internal */
declare const ClassifierTrainingParametersIn$outboundSchema: z.ZodType<ClassifierTrainingParametersIn$Outbound, z.ZodTypeDef, ClassifierTrainingParametersIn>;

/**
 * The fine-tuning hyperparameter settings used in a classifier fine-tune job.
 */
declare type ClassifierTrainingParametersIn = {
    /**
     * The number of training steps to perform. A training step refers to a single update of the model weights during the fine-tuning process. This update is typically calculated using a batch of samples from the training dataset.
     */
    trainingSteps?: number | null | undefined;
    /**
     * A parameter describing how much to adjust the pre-trained model's weights in response to the estimated error each time the weights are updated during the fine-tuning process.
     */
    learningRate?: number | undefined;
    /**
     * (Advanced Usage) Weight decay adds a term to the loss function that is proportional to the sum of the squared weights. This term reduces the magnitude of the weights and prevents them from growing too large.
     */
    weightDecay?: number | null | undefined;
    /**
     * (Advanced Usage) A parameter that specifies the percentage of the total training steps at which the learning rate warm-up phase ends. During this phase, the learning rate gradually increases from a small value to the initial learning rate, helping to stabilize the training process and improve convergence. Similar to `pct_start` in [mistral-finetune](https://github.com/mistralai/mistral-finetune)
     */
    warmupFraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seqLen?: number | null | undefined;
};

declare function classifierTrainingParametersInFromJSON(jsonString: string): Result<ClassifierTrainingParametersIn, SDKValidationError>;

declare function classifierTrainingParametersInToJSON(classifierTrainingParametersIn: ClassifierTrainingParametersIn): string;

declare function classifierTrainingParametersToJSON(classifierTrainingParameters: ClassifierTrainingParameters): string;

declare class ClientSDK {
    #private;
    readonly _baseURL: URL | null;
    readonly _options: SDKOptions & {
        hooks?: SDKHooks;
    };
    constructor(options?: SDKOptions);
    _createRequest(context: HookContext, conf: RequestConfig, options?: RequestOptions): Result<Request, InvalidRequestError | UnexpectedClientError>;
    _do(request: Request, options: {
        context: HookContext;
        errorCodes: number | string | (number | string)[];
        retryConfig: RetryConfig;
        retryCodes: string[];
    }): Promise<Result<Response, RequestAbortedError | RequestTimeoutError | ConnectionError | UnexpectedClientError>>;
}

declare type ClosedEnum<T> = T[keyof T];

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CodeInterpreterTool$ {
    /** @deprecated use `CodeInterpreterTool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CodeInterpreterTool, z.ZodTypeDef, unknown>;
    /** @deprecated use `CodeInterpreterTool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CodeInterpreterTool$Outbound, z.ZodTypeDef, CodeInterpreterTool>;
    /** @deprecated use `CodeInterpreterTool$Outbound` instead. */
    type Outbound = CodeInterpreterTool$Outbound;
}

/** @internal */
declare const CodeInterpreterTool$inboundSchema: z.ZodType<CodeInterpreterTool, z.ZodTypeDef, unknown>;

/** @internal */
declare type CodeInterpreterTool$Outbound = {
    type: string;
};

/** @internal */
declare const CodeInterpreterTool$outboundSchema: z.ZodType<CodeInterpreterTool$Outbound, z.ZodTypeDef, CodeInterpreterTool>;

declare type CodeInterpreterTool = {
    type?: CodeInterpreterToolType | undefined;
};

declare function codeInterpreterToolFromJSON(jsonString: string): Result<CodeInterpreterTool, SDKValidationError>;

declare function codeInterpreterToolToJSON(codeInterpreterTool: CodeInterpreterTool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CodeInterpreterToolType$ {
    /** @deprecated use `CodeInterpreterToolType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly CodeInterpreter: "code_interpreter";
    }>;
    /** @deprecated use `CodeInterpreterToolType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly CodeInterpreter: "code_interpreter";
    }>;
}

/** @internal */
declare const CodeInterpreterToolType$inboundSchema: z.ZodNativeEnum<typeof CodeInterpreterToolType>;

/** @internal */
declare const CodeInterpreterToolType$outboundSchema: z.ZodNativeEnum<typeof CodeInterpreterToolType>;

declare const CodeInterpreterToolType: {
    readonly CodeInterpreter: "code_interpreter";
};

declare type CodeInterpreterToolType = ClosedEnum<typeof CodeInterpreterToolType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionArgs$ {
    /** @deprecated use `CompletionArgs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionArgs, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionArgs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionArgs$Outbound, z.ZodTypeDef, CompletionArgs>;
    /** @deprecated use `CompletionArgs$Outbound` instead. */
    type Outbound = CompletionArgs$Outbound;
}

/** @internal */
declare const CompletionArgs$inboundSchema: z.ZodType<CompletionArgs, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionArgs$Outbound = {
    stop?: CompletionArgsStop$Outbound | null | undefined;
    presence_penalty?: number | null | undefined;
    frequency_penalty?: number | null | undefined;
    temperature?: number | null | undefined;
    top_p?: number | null | undefined;
    max_tokens?: number | null | undefined;
    random_seed?: number | null | undefined;
    prediction?: Prediction$Outbound | null | undefined;
    response_format?: ResponseFormat$Outbound | null | undefined;
    tool_choice?: string | undefined;
};

/** @internal */
declare const CompletionArgs$outboundSchema: z.ZodType<CompletionArgs$Outbound, z.ZodTypeDef, CompletionArgs>;

/**
 * White-listed arguments from the completion API
 */
declare type CompletionArgs = {
    stop?: CompletionArgsStop | null | undefined;
    presencePenalty?: number | null | undefined;
    frequencyPenalty?: number | null | undefined;
    temperature?: number | null | undefined;
    topP?: number | null | undefined;
    maxTokens?: number | null | undefined;
    randomSeed?: number | null | undefined;
    prediction?: Prediction | null | undefined;
    responseFormat?: ResponseFormat | null | undefined;
    toolChoice?: ToolChoiceEnum | undefined;
};

declare function completionArgsFromJSON(jsonString: string): Result<CompletionArgs, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionArgsStop$ {
    /** @deprecated use `CompletionArgsStop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionArgsStop, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionArgsStop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionArgsStop$Outbound, z.ZodTypeDef, CompletionArgsStop>;
    /** @deprecated use `CompletionArgsStop$Outbound` instead. */
    type Outbound = CompletionArgsStop$Outbound;
}

/** @internal */
declare const CompletionArgsStop$inboundSchema: z.ZodType<CompletionArgsStop, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionArgsStop$Outbound = string | Array<string>;

/** @internal */
declare const CompletionArgsStop$outboundSchema: z.ZodType<CompletionArgsStop$Outbound, z.ZodTypeDef, CompletionArgsStop>;

declare type CompletionArgsStop = string | Array<string>;

declare function completionArgsStopFromJSON(jsonString: string): Result<CompletionArgsStop, SDKValidationError>;

declare function completionArgsStopToJSON(completionArgsStop: CompletionArgsStop): string;

declare function completionArgsToJSON(completionArgs: CompletionArgs): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionChunk$ {
    /** @deprecated use `CompletionChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionChunk$Outbound, z.ZodTypeDef, CompletionChunk>;
    /** @deprecated use `CompletionChunk$Outbound` instead. */
    type Outbound = CompletionChunk$Outbound;
}

/** @internal */
declare const CompletionChunk$inboundSchema: z.ZodType<CompletionChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionChunk$Outbound = {
    id: string;
    object?: string | undefined;
    created?: number | undefined;
    model: string;
    usage?: UsageInfo$Outbound | undefined;
    choices: Array<CompletionResponseStreamChoice$Outbound>;
};

/** @internal */
declare const CompletionChunk$outboundSchema: z.ZodType<CompletionChunk$Outbound, z.ZodTypeDef, CompletionChunk>;

declare type CompletionChunk = {
    id: string;
    object?: string | undefined;
    created?: number | undefined;
    model: string;
    usage?: UsageInfo | undefined;
    choices: Array<CompletionResponseStreamChoice>;
};

declare function completionChunkFromJSON(jsonString: string): Result<CompletionChunk, SDKValidationError>;

declare function completionChunkToJSON(completionChunk: CompletionChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionDetailedJobOut$ {
    /** @deprecated use `CompletionDetailedJobOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionDetailedJobOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionDetailedJobOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionDetailedJobOut$Outbound, z.ZodTypeDef, CompletionDetailedJobOut>;
    /** @deprecated use `CompletionDetailedJobOut$Outbound` instead. */
    type Outbound = CompletionDetailedJobOut$Outbound;
}

/** @internal */
declare const CompletionDetailedJobOut$inboundSchema: z.ZodType<CompletionDetailedJobOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionDetailedJobOut$Outbound = {
    id: string;
    auto_start: boolean;
    model: string;
    status: string;
    created_at: number;
    modified_at: number;
    training_files: Array<string>;
    validation_files?: Array<string> | null | undefined;
    object: string;
    fine_tuned_model?: string | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegrationOut$Outbound> | null | undefined;
    trained_tokens?: number | null | undefined;
    metadata?: JobMetadataOut$Outbound | null | undefined;
    job_type: string;
    hyperparameters: CompletionTrainingParameters$Outbound;
    repositories?: Array<GithubRepositoryOut$Outbound> | undefined;
    events?: Array<EventOut$Outbound> | undefined;
    checkpoints?: Array<CheckpointOut$Outbound> | undefined;
};

/** @internal */
declare const CompletionDetailedJobOut$outboundSchema: z.ZodType<CompletionDetailedJobOut$Outbound, z.ZodTypeDef, CompletionDetailedJobOut>;

declare type CompletionDetailedJobOut = {
    id: string;
    autoStart: boolean;
    /**
     * The name of the model to fine-tune.
     */
    model: string;
    status: CompletionDetailedJobOutStatus;
    createdAt: number;
    modifiedAt: number;
    trainingFiles: Array<string>;
    validationFiles?: Array<string> | null | undefined;
    object?: CompletionDetailedJobOutObject | undefined;
    fineTunedModel?: string | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegrationOut> | null | undefined;
    trainedTokens?: number | null | undefined;
    metadata?: JobMetadataOut | null | undefined;
    jobType?: CompletionDetailedJobOutJobType | undefined;
    hyperparameters: CompletionTrainingParameters;
    repositories?: Array<GithubRepositoryOut> | undefined;
    /**
     * Event items are created every time the status of a fine-tuning job changes. The timestamped list of all events is accessible here.
     */
    events?: Array<EventOut> | undefined;
    checkpoints?: Array<CheckpointOut> | undefined;
};

declare function completionDetailedJobOutFromJSON(jsonString: string): Result<CompletionDetailedJobOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionDetailedJobOutIntegrations$ {
    /** @deprecated use `CompletionDetailedJobOutIntegrations$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegrationOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionDetailedJobOutIntegrations$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegrationOut$Outbound, z.ZodTypeDef, WandbIntegrationOut>;
    /** @deprecated use `CompletionDetailedJobOutIntegrations$Outbound` instead. */
    type Outbound = CompletionDetailedJobOutIntegrations$Outbound;
}

/** @internal */
declare const CompletionDetailedJobOutIntegrations$inboundSchema: z.ZodType<CompletionDetailedJobOutIntegrations, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionDetailedJobOutIntegrations$Outbound = WandbIntegrationOut$Outbound;

/** @internal */
declare const CompletionDetailedJobOutIntegrations$outboundSchema: z.ZodType<CompletionDetailedJobOutIntegrations$Outbound, z.ZodTypeDef, CompletionDetailedJobOutIntegrations>;

declare type CompletionDetailedJobOutIntegrations = WandbIntegrationOut;

declare function completionDetailedJobOutIntegrationsFromJSON(jsonString: string): Result<CompletionDetailedJobOutIntegrations, SDKValidationError>;

declare function completionDetailedJobOutIntegrationsToJSON(completionDetailedJobOutIntegrations: CompletionDetailedJobOutIntegrations): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionDetailedJobOutJobType$ {
    /** @deprecated use `CompletionDetailedJobOutJobType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
    }>;
    /** @deprecated use `CompletionDetailedJobOutJobType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
    }>;
}

/** @internal */
declare const CompletionDetailedJobOutJobType$inboundSchema: z.ZodNativeEnum<typeof CompletionDetailedJobOutJobType>;

/** @internal */
declare const CompletionDetailedJobOutJobType$outboundSchema: z.ZodNativeEnum<typeof CompletionDetailedJobOutJobType>;

declare const CompletionDetailedJobOutJobType: {
    readonly Completion: "completion";
};

declare type CompletionDetailedJobOutJobType = ClosedEnum<typeof CompletionDetailedJobOutJobType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionDetailedJobOutObject$ {
    /** @deprecated use `CompletionDetailedJobOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
    /** @deprecated use `CompletionDetailedJobOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
}

/** @internal */
declare const CompletionDetailedJobOutObject$inboundSchema: z.ZodNativeEnum<typeof CompletionDetailedJobOutObject>;

/** @internal */
declare const CompletionDetailedJobOutObject$outboundSchema: z.ZodNativeEnum<typeof CompletionDetailedJobOutObject>;

declare const CompletionDetailedJobOutObject: {
    readonly Job: "job";
};

declare type CompletionDetailedJobOutObject = ClosedEnum<typeof CompletionDetailedJobOutObject>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionDetailedJobOutRepositories$ {
    /** @deprecated use `CompletionDetailedJobOutRepositories$inboundSchema` instead. */
    const inboundSchema: z.ZodType<GithubRepositoryOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionDetailedJobOutRepositories$outboundSchema` instead. */
    const outboundSchema: z.ZodType<GithubRepositoryOut$Outbound, z.ZodTypeDef, GithubRepositoryOut>;
    /** @deprecated use `CompletionDetailedJobOutRepositories$Outbound` instead. */
    type Outbound = CompletionDetailedJobOutRepositories$Outbound;
}

/** @internal */
declare const CompletionDetailedJobOutRepositories$inboundSchema: z.ZodType<CompletionDetailedJobOutRepositories, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionDetailedJobOutRepositories$Outbound = GithubRepositoryOut$Outbound;

/** @internal */
declare const CompletionDetailedJobOutRepositories$outboundSchema: z.ZodType<CompletionDetailedJobOutRepositories$Outbound, z.ZodTypeDef, CompletionDetailedJobOutRepositories>;

declare type CompletionDetailedJobOutRepositories = GithubRepositoryOut;

declare function completionDetailedJobOutRepositoriesFromJSON(jsonString: string): Result<CompletionDetailedJobOutRepositories, SDKValidationError>;

declare function completionDetailedJobOutRepositoriesToJSON(completionDetailedJobOutRepositories: CompletionDetailedJobOutRepositories): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionDetailedJobOutStatus$ {
    /** @deprecated use `CompletionDetailedJobOutStatus$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
    /** @deprecated use `CompletionDetailedJobOutStatus$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
}

/** @internal */
declare const CompletionDetailedJobOutStatus$inboundSchema: z.ZodNativeEnum<typeof CompletionDetailedJobOutStatus>;

/** @internal */
declare const CompletionDetailedJobOutStatus$outboundSchema: z.ZodNativeEnum<typeof CompletionDetailedJobOutStatus>;

declare const CompletionDetailedJobOutStatus: {
    readonly Queued: "QUEUED";
    readonly Started: "STARTED";
    readonly Validating: "VALIDATING";
    readonly Validated: "VALIDATED";
    readonly Running: "RUNNING";
    readonly FailedValidation: "FAILED_VALIDATION";
    readonly Failed: "FAILED";
    readonly Success: "SUCCESS";
    readonly Cancelled: "CANCELLED";
    readonly CancellationRequested: "CANCELLATION_REQUESTED";
};

declare type CompletionDetailedJobOutStatus = ClosedEnum<typeof CompletionDetailedJobOutStatus>;

declare function completionDetailedJobOutToJSON(completionDetailedJobOut: CompletionDetailedJobOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionEvent$ {
    /** @deprecated use `CompletionEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionEvent$Outbound, z.ZodTypeDef, CompletionEvent>;
    /** @deprecated use `CompletionEvent$Outbound` instead. */
    type Outbound = CompletionEvent$Outbound;
}

/** @internal */
declare const CompletionEvent$inboundSchema: z.ZodType<CompletionEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionEvent$Outbound = {
    data: CompletionChunk$Outbound;
};

/** @internal */
declare const CompletionEvent$outboundSchema: z.ZodType<CompletionEvent$Outbound, z.ZodTypeDef, CompletionEvent>;

declare type CompletionEvent = {
    data: CompletionChunk;
};

declare function completionEventFromJSON(jsonString: string): Result<CompletionEvent, SDKValidationError>;

declare function completionEventToJSON(completionEvent: CompletionEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionFTModelOut$ {
    /** @deprecated use `CompletionFTModelOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionFTModelOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionFTModelOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionFTModelOut$Outbound, z.ZodTypeDef, CompletionFTModelOut>;
    /** @deprecated use `CompletionFTModelOut$Outbound` instead. */
    type Outbound = CompletionFTModelOut$Outbound;
}

/** @internal */
declare const CompletionFTModelOut$inboundSchema: z.ZodType<CompletionFTModelOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionFTModelOut$Outbound = {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    workspace_id: string;
    root: string;
    root_version: string;
    archived: boolean;
    name?: string | null | undefined;
    description?: string | null | undefined;
    capabilities: FTModelCapabilitiesOut$Outbound;
    max_context_length: number;
    aliases?: Array<string> | undefined;
    job: string;
    model_type: string;
};

/** @internal */
declare const CompletionFTModelOut$outboundSchema: z.ZodType<CompletionFTModelOut$Outbound, z.ZodTypeDef, CompletionFTModelOut>;

declare type CompletionFTModelOut = {
    id: string;
    object?: CompletionFTModelOutObject | undefined;
    created: number;
    ownedBy: string;
    workspaceId: string;
    root: string;
    rootVersion: string;
    archived: boolean;
    name?: string | null | undefined;
    description?: string | null | undefined;
    capabilities: FTModelCapabilitiesOut;
    maxContextLength?: number | undefined;
    aliases?: Array<string> | undefined;
    job: string;
    modelType?: ModelType | undefined;
};

declare function completionFTModelOutFromJSON(jsonString: string): Result<CompletionFTModelOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionFTModelOutObject$ {
    /** @deprecated use `CompletionFTModelOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
    /** @deprecated use `CompletionFTModelOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
}

/** @internal */
declare const CompletionFTModelOutObject$inboundSchema: z.ZodNativeEnum<typeof CompletionFTModelOutObject>;

/** @internal */
declare const CompletionFTModelOutObject$outboundSchema: z.ZodNativeEnum<typeof CompletionFTModelOutObject>;

declare const CompletionFTModelOutObject: {
    readonly Model: "model";
};

declare type CompletionFTModelOutObject = ClosedEnum<typeof CompletionFTModelOutObject>;

declare function completionFTModelOutToJSON(completionFTModelOut: CompletionFTModelOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionJobOut$ {
    /** @deprecated use `CompletionJobOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionJobOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionJobOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionJobOut$Outbound, z.ZodTypeDef, CompletionJobOut>;
    /** @deprecated use `CompletionJobOut$Outbound` instead. */
    type Outbound = CompletionJobOut$Outbound;
}

/** @internal */
declare const CompletionJobOut$inboundSchema: z.ZodType<CompletionJobOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionJobOut$Outbound = {
    id: string;
    auto_start: boolean;
    model: string;
    status: string;
    created_at: number;
    modified_at: number;
    training_files: Array<string>;
    validation_files?: Array<string> | null | undefined;
    object: string;
    fine_tuned_model?: string | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegrationOut$Outbound> | null | undefined;
    trained_tokens?: number | null | undefined;
    metadata?: JobMetadataOut$Outbound | null | undefined;
    job_type: string;
    hyperparameters: CompletionTrainingParameters$Outbound;
    repositories?: Array<GithubRepositoryOut$Outbound> | undefined;
};

/** @internal */
declare const CompletionJobOut$outboundSchema: z.ZodType<CompletionJobOut$Outbound, z.ZodTypeDef, CompletionJobOut>;

declare type CompletionJobOut = {
    /**
     * The ID of the job.
     */
    id: string;
    autoStart: boolean;
    /**
     * The name of the model to fine-tune.
     */
    model: string;
    /**
     * The current status of the fine-tuning job.
     */
    status: Status;
    /**
     * The UNIX timestamp (in seconds) for when the fine-tuning job was created.
     */
    createdAt: number;
    /**
     * The UNIX timestamp (in seconds) for when the fine-tuning job was last modified.
     */
    modifiedAt: number;
    /**
     * A list containing the IDs of uploaded files that contain training data.
     */
    trainingFiles: Array<string>;
    /**
     * A list containing the IDs of uploaded files that contain validation data.
     */
    validationFiles?: Array<string> | null | undefined;
    /**
     * The object type of the fine-tuning job.
     */
    object?: CompletionJobOutObject | undefined;
    /**
     * The name of the fine-tuned model that is being created. The value will be `null` if the fine-tuning job is still running.
     */
    fineTunedModel?: string | null | undefined;
    /**
     * Optional text/code that adds more context for the model. When given a `prompt` and a `suffix` the model will fill what is between them. When `suffix` is not provided, the model will simply execute completion starting with `prompt`.
     */
    suffix?: string | null | undefined;
    /**
     * A list of integrations enabled for your fine-tuning job.
     */
    integrations?: Array<WandbIntegrationOut> | null | undefined;
    /**
     * Total number of tokens trained.
     */
    trainedTokens?: number | null | undefined;
    metadata?: JobMetadataOut | null | undefined;
    /**
     * The type of job (`FT` for fine-tuning).
     */
    jobType?: JobType | undefined;
    hyperparameters: CompletionTrainingParameters;
    repositories?: Array<GithubRepositoryOut> | undefined;
};

declare function completionJobOutFromJSON(jsonString: string): Result<CompletionJobOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionJobOutObject$ {
    /** @deprecated use `CompletionJobOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
    /** @deprecated use `CompletionJobOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Job: "job";
    }>;
}

/** @internal */
declare const CompletionJobOutObject$inboundSchema: z.ZodNativeEnum<typeof CompletionJobOutObject>;

/** @internal */
declare const CompletionJobOutObject$outboundSchema: z.ZodNativeEnum<typeof CompletionJobOutObject>;

/**
 * The object type of the fine-tuning job.
 */
declare const CompletionJobOutObject: {
    readonly Job: "job";
};

/**
 * The object type of the fine-tuning job.
 */
declare type CompletionJobOutObject = ClosedEnum<typeof CompletionJobOutObject>;

declare function completionJobOutToJSON(completionJobOut: CompletionJobOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionResponseStreamChoice$ {
    /** @deprecated use `CompletionResponseStreamChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionResponseStreamChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionResponseStreamChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionResponseStreamChoice$Outbound, z.ZodTypeDef, CompletionResponseStreamChoice>;
    /** @deprecated use `CompletionResponseStreamChoice$Outbound` instead. */
    type Outbound = CompletionResponseStreamChoice$Outbound;
}

/** @internal */
declare const CompletionResponseStreamChoice$inboundSchema: z.ZodType<CompletionResponseStreamChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionResponseStreamChoice$Outbound = {
    index: number;
    delta: DeltaMessage$Outbound;
    finish_reason: string | null;
};

/** @internal */
declare const CompletionResponseStreamChoice$outboundSchema: z.ZodType<CompletionResponseStreamChoice$Outbound, z.ZodTypeDef, CompletionResponseStreamChoice>;

declare type CompletionResponseStreamChoice = {
    index: number;
    delta: DeltaMessage;
    finishReason: CompletionResponseStreamChoiceFinishReason | null;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionResponseStreamChoiceFinishReason$ {
    /** @deprecated use `CompletionResponseStreamChoiceFinishReason$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionResponseStreamChoiceFinishReason, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionResponseStreamChoiceFinishReason$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionResponseStreamChoiceFinishReason, z.ZodTypeDef, CompletionResponseStreamChoiceFinishReason>;
}

/** @internal */
declare const CompletionResponseStreamChoiceFinishReason$inboundSchema: z.ZodType<CompletionResponseStreamChoiceFinishReason, z.ZodTypeDef, unknown>;

/** @internal */
declare const CompletionResponseStreamChoiceFinishReason$outboundSchema: z.ZodType<CompletionResponseStreamChoiceFinishReason, z.ZodTypeDef, CompletionResponseStreamChoiceFinishReason>;

declare const CompletionResponseStreamChoiceFinishReason: {
    readonly Stop: "stop";
    readonly Length: "length";
    readonly Error: "error";
    readonly ToolCalls: "tool_calls";
};

declare type CompletionResponseStreamChoiceFinishReason = OpenEnum<typeof CompletionResponseStreamChoiceFinishReason>;

declare function completionResponseStreamChoiceFromJSON(jsonString: string): Result<CompletionResponseStreamChoice, SDKValidationError>;

declare function completionResponseStreamChoiceToJSON(completionResponseStreamChoice: CompletionResponseStreamChoice): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionTrainingParameters$ {
    /** @deprecated use `CompletionTrainingParameters$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionTrainingParameters, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionTrainingParameters$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionTrainingParameters$Outbound, z.ZodTypeDef, CompletionTrainingParameters>;
    /** @deprecated use `CompletionTrainingParameters$Outbound` instead. */
    type Outbound = CompletionTrainingParameters$Outbound;
}

/** @internal */
declare const CompletionTrainingParameters$inboundSchema: z.ZodType<CompletionTrainingParameters, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionTrainingParameters$Outbound = {
    training_steps?: number | null | undefined;
    learning_rate: number;
    weight_decay?: number | null | undefined;
    warmup_fraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seq_len?: number | null | undefined;
    fim_ratio?: number | null | undefined;
};

/** @internal */
declare const CompletionTrainingParameters$outboundSchema: z.ZodType<CompletionTrainingParameters$Outbound, z.ZodTypeDef, CompletionTrainingParameters>;

declare type CompletionTrainingParameters = {
    trainingSteps?: number | null | undefined;
    learningRate?: number | undefined;
    weightDecay?: number | null | undefined;
    warmupFraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seqLen?: number | null | undefined;
    fimRatio?: number | null | undefined;
};

declare function completionTrainingParametersFromJSON(jsonString: string): Result<CompletionTrainingParameters, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace CompletionTrainingParametersIn$ {
    /** @deprecated use `CompletionTrainingParametersIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<CompletionTrainingParametersIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `CompletionTrainingParametersIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<CompletionTrainingParametersIn$Outbound, z.ZodTypeDef, CompletionTrainingParametersIn>;
    /** @deprecated use `CompletionTrainingParametersIn$Outbound` instead. */
    type Outbound = CompletionTrainingParametersIn$Outbound;
}

/** @internal */
declare const CompletionTrainingParametersIn$inboundSchema: z.ZodType<CompletionTrainingParametersIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type CompletionTrainingParametersIn$Outbound = {
    training_steps?: number | null | undefined;
    learning_rate: number;
    weight_decay?: number | null | undefined;
    warmup_fraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seq_len?: number | null | undefined;
    fim_ratio?: number | null | undefined;
};

/** @internal */
declare const CompletionTrainingParametersIn$outboundSchema: z.ZodType<CompletionTrainingParametersIn$Outbound, z.ZodTypeDef, CompletionTrainingParametersIn>;

/**
 * The fine-tuning hyperparameter settings used in a fine-tune job.
 */
declare type CompletionTrainingParametersIn = {
    /**
     * The number of training steps to perform. A training step refers to a single update of the model weights during the fine-tuning process. This update is typically calculated using a batch of samples from the training dataset.
     */
    trainingSteps?: number | null | undefined;
    /**
     * A parameter describing how much to adjust the pre-trained model's weights in response to the estimated error each time the weights are updated during the fine-tuning process.
     */
    learningRate?: number | undefined;
    /**
     * (Advanced Usage) Weight decay adds a term to the loss function that is proportional to the sum of the squared weights. This term reduces the magnitude of the weights and prevents them from growing too large.
     */
    weightDecay?: number | null | undefined;
    /**
     * (Advanced Usage) A parameter that specifies the percentage of the total training steps at which the learning rate warm-up phase ends. During this phase, the learning rate gradually increases from a small value to the initial learning rate, helping to stabilize the training process and improve convergence. Similar to `pct_start` in [mistral-finetune](https://github.com/mistralai/mistral-finetune)
     */
    warmupFraction?: number | null | undefined;
    epochs?: number | null | undefined;
    seqLen?: number | null | undefined;
    fimRatio?: number | null | undefined;
};

declare function completionTrainingParametersInFromJSON(jsonString: string): Result<CompletionTrainingParametersIn, SDKValidationError>;

declare function completionTrainingParametersInToJSON(completionTrainingParametersIn: CompletionTrainingParametersIn): string;

declare function completionTrainingParametersToJSON(completionTrainingParameters: CompletionTrainingParameters): string;

declare namespace components {
    export {
        agentToolsToJSON,
        agentToolsFromJSON,
        agentToJSON,
        agentFromJSON,
        AgentTools,
        AgentObject,
        Agent,
        AgentTools$inboundSchema,
        AgentTools$Outbound,
        AgentTools$outboundSchema,
        AgentTools$,
        AgentObject$inboundSchema,
        AgentObject$outboundSchema,
        AgentObject$,
        Agent$inboundSchema,
        Agent$Outbound,
        Agent$outboundSchema,
        Agent$,
        agentConversationToJSON,
        agentConversationFromJSON,
        AgentConversationObject,
        AgentConversation,
        AgentConversationObject$inboundSchema,
        AgentConversationObject$outboundSchema,
        AgentConversationObject$,
        AgentConversation$inboundSchema,
        AgentConversation$Outbound,
        AgentConversation$outboundSchema,
        AgentConversation$,
        agentCreationRequestToolsToJSON,
        agentCreationRequestToolsFromJSON,
        agentCreationRequestToJSON,
        agentCreationRequestFromJSON,
        AgentCreationRequestTools,
        AgentCreationRequest,
        AgentCreationRequestTools$inboundSchema,
        AgentCreationRequestTools$Outbound,
        AgentCreationRequestTools$outboundSchema,
        AgentCreationRequestTools$,
        AgentCreationRequest$inboundSchema,
        AgentCreationRequest$Outbound,
        AgentCreationRequest$outboundSchema,
        AgentCreationRequest$,
        agentHandoffDoneEventToJSON,
        agentHandoffDoneEventFromJSON,
        AgentHandoffDoneEventType,
        AgentHandoffDoneEvent,
        AgentHandoffDoneEventType$inboundSchema,
        AgentHandoffDoneEventType$outboundSchema,
        AgentHandoffDoneEventType$,
        AgentHandoffDoneEvent$inboundSchema,
        AgentHandoffDoneEvent$Outbound,
        AgentHandoffDoneEvent$outboundSchema,
        AgentHandoffDoneEvent$,
        agentHandoffEntryToJSON,
        agentHandoffEntryFromJSON,
        AgentHandoffEntryObject,
        AgentHandoffEntryType,
        AgentHandoffEntry,
        AgentHandoffEntryObject$inboundSchema,
        AgentHandoffEntryObject$outboundSchema,
        AgentHandoffEntryObject$,
        AgentHandoffEntryType$inboundSchema,
        AgentHandoffEntryType$outboundSchema,
        AgentHandoffEntryType$,
        AgentHandoffEntry$inboundSchema,
        AgentHandoffEntry$Outbound,
        AgentHandoffEntry$outboundSchema,
        AgentHandoffEntry$,
        agentHandoffStartedEventToJSON,
        agentHandoffStartedEventFromJSON,
        AgentHandoffStartedEventType,
        AgentHandoffStartedEvent,
        AgentHandoffStartedEventType$inboundSchema,
        AgentHandoffStartedEventType$outboundSchema,
        AgentHandoffStartedEventType$,
        AgentHandoffStartedEvent$inboundSchema,
        AgentHandoffStartedEvent$Outbound,
        AgentHandoffStartedEvent$outboundSchema,
        AgentHandoffStartedEvent$,
        agentsCompletionRequestStopToJSON,
        agentsCompletionRequestStopFromJSON,
        agentsCompletionRequestMessagesToJSON,
        agentsCompletionRequestMessagesFromJSON,
        agentsCompletionRequestToolChoiceToJSON,
        agentsCompletionRequestToolChoiceFromJSON,
        agentsCompletionRequestToJSON,
        agentsCompletionRequestFromJSON,
        AgentsCompletionRequestStop,
        AgentsCompletionRequestMessages,
        AgentsCompletionRequestToolChoice,
        AgentsCompletionRequest,
        AgentsCompletionRequestStop$inboundSchema,
        AgentsCompletionRequestStop$Outbound,
        AgentsCompletionRequestStop$outboundSchema,
        AgentsCompletionRequestStop$,
        AgentsCompletionRequestMessages$inboundSchema,
        AgentsCompletionRequestMessages$Outbound,
        AgentsCompletionRequestMessages$outboundSchema,
        AgentsCompletionRequestMessages$,
        AgentsCompletionRequestToolChoice$inboundSchema,
        AgentsCompletionRequestToolChoice$Outbound,
        AgentsCompletionRequestToolChoice$outboundSchema,
        AgentsCompletionRequestToolChoice$,
        AgentsCompletionRequest$inboundSchema,
        AgentsCompletionRequest$Outbound,
        AgentsCompletionRequest$outboundSchema,
        AgentsCompletionRequest$,
        agentsCompletionStreamRequestStopToJSON,
        agentsCompletionStreamRequestStopFromJSON,
        agentsCompletionStreamRequestMessagesToJSON,
        agentsCompletionStreamRequestMessagesFromJSON,
        agentsCompletionStreamRequestToolChoiceToJSON,
        agentsCompletionStreamRequestToolChoiceFromJSON,
        agentsCompletionStreamRequestToJSON,
        agentsCompletionStreamRequestFromJSON,
        AgentsCompletionStreamRequestStop,
        AgentsCompletionStreamRequestMessages,
        AgentsCompletionStreamRequestToolChoice,
        AgentsCompletionStreamRequest,
        AgentsCompletionStreamRequestStop$inboundSchema,
        AgentsCompletionStreamRequestStop$Outbound,
        AgentsCompletionStreamRequestStop$outboundSchema,
        AgentsCompletionStreamRequestStop$,
        AgentsCompletionStreamRequestMessages$inboundSchema,
        AgentsCompletionStreamRequestMessages$Outbound,
        AgentsCompletionStreamRequestMessages$outboundSchema,
        AgentsCompletionStreamRequestMessages$,
        AgentsCompletionStreamRequestToolChoice$inboundSchema,
        AgentsCompletionStreamRequestToolChoice$Outbound,
        AgentsCompletionStreamRequestToolChoice$outboundSchema,
        AgentsCompletionStreamRequestToolChoice$,
        AgentsCompletionStreamRequest$inboundSchema,
        AgentsCompletionStreamRequest$Outbound,
        AgentsCompletionStreamRequest$outboundSchema,
        AgentsCompletionStreamRequest$,
        agentUpdateRequestToolsToJSON,
        agentUpdateRequestToolsFromJSON,
        agentUpdateRequestToJSON,
        agentUpdateRequestFromJSON,
        AgentUpdateRequestTools,
        AgentUpdateRequest,
        AgentUpdateRequestTools$inboundSchema,
        AgentUpdateRequestTools$Outbound,
        AgentUpdateRequestTools$outboundSchema,
        AgentUpdateRequestTools$,
        AgentUpdateRequest$inboundSchema,
        AgentUpdateRequest$Outbound,
        AgentUpdateRequest$outboundSchema,
        AgentUpdateRequest$,
        ApiEndpoint,
        ApiEndpoint$inboundSchema,
        ApiEndpoint$outboundSchema,
        ApiEndpoint$,
        archiveFTModelOutToJSON,
        archiveFTModelOutFromJSON,
        ArchiveFTModelOutObject,
        ArchiveFTModelOut,
        ArchiveFTModelOutObject$inboundSchema,
        ArchiveFTModelOutObject$outboundSchema,
        ArchiveFTModelOutObject$,
        ArchiveFTModelOut$inboundSchema,
        ArchiveFTModelOut$Outbound,
        ArchiveFTModelOut$outboundSchema,
        ArchiveFTModelOut$,
        assistantMessageContentToJSON,
        assistantMessageContentFromJSON,
        assistantMessageToJSON,
        assistantMessageFromJSON,
        AssistantMessageContent,
        AssistantMessageRole,
        AssistantMessage,
        AssistantMessageContent$inboundSchema,
        AssistantMessageContent$Outbound,
        AssistantMessageContent$outboundSchema,
        AssistantMessageContent$,
        AssistantMessageRole$inboundSchema,
        AssistantMessageRole$outboundSchema,
        AssistantMessageRole$,
        AssistantMessage$inboundSchema,
        AssistantMessage$Outbound,
        AssistantMessage$outboundSchema,
        AssistantMessage$,
        audioChunkToJSON,
        audioChunkFromJSON,
        AudioChunkType,
        AudioChunk,
        AudioChunkType$inboundSchema,
        AudioChunkType$outboundSchema,
        AudioChunkType$,
        AudioChunk$inboundSchema,
        AudioChunk$Outbound,
        AudioChunk$outboundSchema,
        AudioChunk$,
        audioTranscriptionRequestToJSON,
        audioTranscriptionRequestFromJSON,
        AudioTranscriptionRequest,
        AudioTranscriptionRequest$inboundSchema,
        AudioTranscriptionRequest$Outbound,
        AudioTranscriptionRequest$outboundSchema,
        AudioTranscriptionRequest$,
        audioTranscriptionRequestStreamToJSON,
        audioTranscriptionRequestStreamFromJSON,
        AudioTranscriptionRequestStream,
        AudioTranscriptionRequestStream$inboundSchema,
        AudioTranscriptionRequestStream$Outbound,
        AudioTranscriptionRequestStream$outboundSchema,
        AudioTranscriptionRequestStream$,
        baseModelCardToJSON,
        baseModelCardFromJSON,
        BaseModelCardType,
        BaseModelCard,
        BaseModelCardType$inboundSchema,
        BaseModelCardType$outboundSchema,
        BaseModelCardType$,
        BaseModelCard$inboundSchema,
        BaseModelCard$Outbound,
        BaseModelCard$outboundSchema,
        BaseModelCard$,
        batchErrorToJSON,
        batchErrorFromJSON,
        BatchError,
        BatchError$inboundSchema,
        BatchError$Outbound,
        BatchError$outboundSchema,
        BatchError$,
        batchJobInToJSON,
        batchJobInFromJSON,
        BatchJobIn,
        BatchJobIn$inboundSchema,
        BatchJobIn$Outbound,
        BatchJobIn$outboundSchema,
        BatchJobIn$,
        batchJobOutToJSON,
        batchJobOutFromJSON,
        BatchJobOutObject,
        BatchJobOut,
        BatchJobOutObject$inboundSchema,
        BatchJobOutObject$outboundSchema,
        BatchJobOutObject$,
        BatchJobOut$inboundSchema,
        BatchJobOut$Outbound,
        BatchJobOut$outboundSchema,
        BatchJobOut$,
        batchJobsOutToJSON,
        batchJobsOutFromJSON,
        BatchJobsOutObject,
        BatchJobsOut,
        BatchJobsOutObject$inboundSchema,
        BatchJobsOutObject$outboundSchema,
        BatchJobsOutObject$,
        BatchJobsOut$inboundSchema,
        BatchJobsOut$Outbound,
        BatchJobsOut$outboundSchema,
        BatchJobsOut$,
        BatchJobStatus,
        BatchJobStatus$inboundSchema,
        BatchJobStatus$outboundSchema,
        BatchJobStatus$,
        BuiltInConnectors,
        BuiltInConnectors$inboundSchema,
        BuiltInConnectors$outboundSchema,
        BuiltInConnectors$,
        chatClassificationRequestToJSON,
        chatClassificationRequestFromJSON,
        ChatClassificationRequest,
        ChatClassificationRequest$inboundSchema,
        ChatClassificationRequest$Outbound,
        ChatClassificationRequest$outboundSchema,
        ChatClassificationRequest$,
        chatCompletionChoiceToJSON,
        chatCompletionChoiceFromJSON,
        FinishReason,
        ChatCompletionChoice,
        FinishReason$inboundSchema,
        FinishReason$outboundSchema,
        FinishReason$,
        ChatCompletionChoice$inboundSchema,
        ChatCompletionChoice$Outbound,
        ChatCompletionChoice$outboundSchema,
        ChatCompletionChoice$,
        stopToJSON,
        stopFromJSON,
        messagesToJSON,
        messagesFromJSON,
        chatCompletionRequestToolChoiceToJSON,
        chatCompletionRequestToolChoiceFromJSON,
        chatCompletionRequestToJSON,
        chatCompletionRequestFromJSON,
        Stop,
        Messages,
        ChatCompletionRequestToolChoice,
        ChatCompletionRequest,
        Stop$inboundSchema,
        Stop$Outbound,
        Stop$outboundSchema,
        Stop$,
        Messages$inboundSchema,
        Messages$Outbound,
        Messages$outboundSchema,
        Messages$,
        ChatCompletionRequestToolChoice$inboundSchema,
        ChatCompletionRequestToolChoice$Outbound,
        ChatCompletionRequestToolChoice$outboundSchema,
        ChatCompletionRequestToolChoice$,
        ChatCompletionRequest$inboundSchema,
        ChatCompletionRequest$Outbound,
        ChatCompletionRequest$outboundSchema,
        ChatCompletionRequest$,
        chatCompletionResponseToJSON,
        chatCompletionResponseFromJSON,
        ChatCompletionResponse,
        ChatCompletionResponse$inboundSchema,
        ChatCompletionResponse$Outbound,
        ChatCompletionResponse$outboundSchema,
        ChatCompletionResponse$,
        chatCompletionStreamRequestStopToJSON,
        chatCompletionStreamRequestStopFromJSON,
        chatCompletionStreamRequestMessagesToJSON,
        chatCompletionStreamRequestMessagesFromJSON,
        chatCompletionStreamRequestToolChoiceToJSON,
        chatCompletionStreamRequestToolChoiceFromJSON,
        chatCompletionStreamRequestToJSON,
        chatCompletionStreamRequestFromJSON,
        ChatCompletionStreamRequestStop,
        ChatCompletionStreamRequestMessages,
        ChatCompletionStreamRequestToolChoice,
        ChatCompletionStreamRequest,
        ChatCompletionStreamRequestStop$inboundSchema,
        ChatCompletionStreamRequestStop$Outbound,
        ChatCompletionStreamRequestStop$outboundSchema,
        ChatCompletionStreamRequestStop$,
        ChatCompletionStreamRequestMessages$inboundSchema,
        ChatCompletionStreamRequestMessages$Outbound,
        ChatCompletionStreamRequestMessages$outboundSchema,
        ChatCompletionStreamRequestMessages$,
        ChatCompletionStreamRequestToolChoice$inboundSchema,
        ChatCompletionStreamRequestToolChoice$Outbound,
        ChatCompletionStreamRequestToolChoice$outboundSchema,
        ChatCompletionStreamRequestToolChoice$,
        ChatCompletionStreamRequest$inboundSchema,
        ChatCompletionStreamRequest$Outbound,
        ChatCompletionStreamRequest$outboundSchema,
        ChatCompletionStreamRequest$,
        twoToJSON,
        twoFromJSON,
        oneToJSON,
        oneFromJSON,
        chatModerationRequestInputsToJSON,
        chatModerationRequestInputsFromJSON,
        chatModerationRequestToJSON,
        chatModerationRequestFromJSON,
        Two,
        One,
        ChatModerationRequestInputs,
        ChatModerationRequest,
        Two$inboundSchema,
        Two$Outbound,
        Two$outboundSchema,
        Two$,
        One$inboundSchema,
        One$Outbound,
        One$outboundSchema,
        One$,
        ChatModerationRequestInputs$inboundSchema,
        ChatModerationRequestInputs$Outbound,
        ChatModerationRequestInputs$outboundSchema,
        ChatModerationRequestInputs$,
        ChatModerationRequest$inboundSchema,
        ChatModerationRequest$Outbound,
        ChatModerationRequest$outboundSchema,
        ChatModerationRequest$,
        checkpointOutToJSON,
        checkpointOutFromJSON,
        CheckpointOut,
        CheckpointOut$inboundSchema,
        CheckpointOut$Outbound,
        CheckpointOut$outboundSchema,
        CheckpointOut$,
        classificationRequestInputsToJSON,
        classificationRequestInputsFromJSON,
        classificationRequestToJSON,
        classificationRequestFromJSON,
        ClassificationRequestInputs,
        ClassificationRequest,
        ClassificationRequestInputs$inboundSchema,
        ClassificationRequestInputs$Outbound,
        ClassificationRequestInputs$outboundSchema,
        ClassificationRequestInputs$,
        ClassificationRequest$inboundSchema,
        ClassificationRequest$Outbound,
        ClassificationRequest$outboundSchema,
        ClassificationRequest$,
        classificationResponseToJSON,
        classificationResponseFromJSON,
        ClassificationResponse,
        ClassificationResponse$inboundSchema,
        ClassificationResponse$Outbound,
        ClassificationResponse$outboundSchema,
        ClassificationResponse$,
        classificationTargetResultToJSON,
        classificationTargetResultFromJSON,
        ClassificationTargetResult,
        ClassificationTargetResult$inboundSchema,
        ClassificationTargetResult$Outbound,
        ClassificationTargetResult$outboundSchema,
        ClassificationTargetResult$,
        classifierDetailedJobOutIntegrationsToJSON,
        classifierDetailedJobOutIntegrationsFromJSON,
        classifierDetailedJobOutToJSON,
        classifierDetailedJobOutFromJSON,
        ClassifierDetailedJobOutStatus,
        ClassifierDetailedJobOutObject,
        ClassifierDetailedJobOutIntegrations,
        ClassifierDetailedJobOutJobType,
        ClassifierDetailedJobOut,
        ClassifierDetailedJobOutStatus$inboundSchema,
        ClassifierDetailedJobOutStatus$outboundSchema,
        ClassifierDetailedJobOutStatus$,
        ClassifierDetailedJobOutObject$inboundSchema,
        ClassifierDetailedJobOutObject$outboundSchema,
        ClassifierDetailedJobOutObject$,
        ClassifierDetailedJobOutIntegrations$inboundSchema,
        ClassifierDetailedJobOutIntegrations$Outbound,
        ClassifierDetailedJobOutIntegrations$outboundSchema,
        ClassifierDetailedJobOutIntegrations$,
        ClassifierDetailedJobOutJobType$inboundSchema,
        ClassifierDetailedJobOutJobType$outboundSchema,
        ClassifierDetailedJobOutJobType$,
        ClassifierDetailedJobOut$inboundSchema,
        ClassifierDetailedJobOut$Outbound,
        ClassifierDetailedJobOut$outboundSchema,
        ClassifierDetailedJobOut$,
        classifierFTModelOutToJSON,
        classifierFTModelOutFromJSON,
        ClassifierFTModelOutObject,
        ClassifierFTModelOutModelType,
        ClassifierFTModelOut,
        ClassifierFTModelOutObject$inboundSchema,
        ClassifierFTModelOutObject$outboundSchema,
        ClassifierFTModelOutObject$,
        ClassifierFTModelOutModelType$inboundSchema,
        ClassifierFTModelOutModelType$outboundSchema,
        ClassifierFTModelOutModelType$,
        ClassifierFTModelOut$inboundSchema,
        ClassifierFTModelOut$Outbound,
        ClassifierFTModelOut$outboundSchema,
        ClassifierFTModelOut$,
        classifierJobOutIntegrationsToJSON,
        classifierJobOutIntegrationsFromJSON,
        classifierJobOutToJSON,
        classifierJobOutFromJSON,
        ClassifierJobOutStatus,
        ClassifierJobOutObject,
        ClassifierJobOutIntegrations,
        ClassifierJobOutJobType,
        ClassifierJobOut,
        ClassifierJobOutStatus$inboundSchema,
        ClassifierJobOutStatus$outboundSchema,
        ClassifierJobOutStatus$,
        ClassifierJobOutObject$inboundSchema,
        ClassifierJobOutObject$outboundSchema,
        ClassifierJobOutObject$,
        ClassifierJobOutIntegrations$inboundSchema,
        ClassifierJobOutIntegrations$Outbound,
        ClassifierJobOutIntegrations$outboundSchema,
        ClassifierJobOutIntegrations$,
        ClassifierJobOutJobType$inboundSchema,
        ClassifierJobOutJobType$outboundSchema,
        ClassifierJobOutJobType$,
        ClassifierJobOut$inboundSchema,
        ClassifierJobOut$Outbound,
        ClassifierJobOut$outboundSchema,
        ClassifierJobOut$,
        classifierTargetInToJSON,
        classifierTargetInFromJSON,
        ClassifierTargetIn,
        ClassifierTargetIn$inboundSchema,
        ClassifierTargetIn$Outbound,
        ClassifierTargetIn$outboundSchema,
        ClassifierTargetIn$,
        classifierTargetOutToJSON,
        classifierTargetOutFromJSON,
        ClassifierTargetOut,
        ClassifierTargetOut$inboundSchema,
        ClassifierTargetOut$Outbound,
        ClassifierTargetOut$outboundSchema,
        ClassifierTargetOut$,
        classifierTrainingParametersToJSON,
        classifierTrainingParametersFromJSON,
        ClassifierTrainingParameters,
        ClassifierTrainingParameters$inboundSchema,
        ClassifierTrainingParameters$Outbound,
        ClassifierTrainingParameters$outboundSchema,
        ClassifierTrainingParameters$,
        classifierTrainingParametersInToJSON,
        classifierTrainingParametersInFromJSON,
        ClassifierTrainingParametersIn,
        ClassifierTrainingParametersIn$inboundSchema,
        ClassifierTrainingParametersIn$Outbound,
        ClassifierTrainingParametersIn$outboundSchema,
        ClassifierTrainingParametersIn$,
        codeInterpreterToolToJSON,
        codeInterpreterToolFromJSON,
        CodeInterpreterToolType,
        CodeInterpreterTool,
        CodeInterpreterToolType$inboundSchema,
        CodeInterpreterToolType$outboundSchema,
        CodeInterpreterToolType$,
        CodeInterpreterTool$inboundSchema,
        CodeInterpreterTool$Outbound,
        CodeInterpreterTool$outboundSchema,
        CodeInterpreterTool$,
        completionArgsToJSON,
        completionArgsFromJSON,
        CompletionArgs,
        CompletionArgs$inboundSchema,
        CompletionArgs$Outbound,
        CompletionArgs$outboundSchema,
        CompletionArgs$,
        completionArgsStopToJSON,
        completionArgsStopFromJSON,
        CompletionArgsStop,
        CompletionArgsStop$inboundSchema,
        CompletionArgsStop$Outbound,
        CompletionArgsStop$outboundSchema,
        CompletionArgsStop$,
        completionChunkToJSON,
        completionChunkFromJSON,
        CompletionChunk,
        CompletionChunk$inboundSchema,
        CompletionChunk$Outbound,
        CompletionChunk$outboundSchema,
        CompletionChunk$,
        completionDetailedJobOutIntegrationsToJSON,
        completionDetailedJobOutIntegrationsFromJSON,
        completionDetailedJobOutRepositoriesToJSON,
        completionDetailedJobOutRepositoriesFromJSON,
        completionDetailedJobOutToJSON,
        completionDetailedJobOutFromJSON,
        CompletionDetailedJobOutStatus,
        CompletionDetailedJobOutObject,
        CompletionDetailedJobOutIntegrations,
        CompletionDetailedJobOutJobType,
        CompletionDetailedJobOutRepositories,
        CompletionDetailedJobOut,
        CompletionDetailedJobOutStatus$inboundSchema,
        CompletionDetailedJobOutStatus$outboundSchema,
        CompletionDetailedJobOutStatus$,
        CompletionDetailedJobOutObject$inboundSchema,
        CompletionDetailedJobOutObject$outboundSchema,
        CompletionDetailedJobOutObject$,
        CompletionDetailedJobOutIntegrations$inboundSchema,
        CompletionDetailedJobOutIntegrations$Outbound,
        CompletionDetailedJobOutIntegrations$outboundSchema,
        CompletionDetailedJobOutIntegrations$,
        CompletionDetailedJobOutJobType$inboundSchema,
        CompletionDetailedJobOutJobType$outboundSchema,
        CompletionDetailedJobOutJobType$,
        CompletionDetailedJobOutRepositories$inboundSchema,
        CompletionDetailedJobOutRepositories$Outbound,
        CompletionDetailedJobOutRepositories$outboundSchema,
        CompletionDetailedJobOutRepositories$,
        CompletionDetailedJobOut$inboundSchema,
        CompletionDetailedJobOut$Outbound,
        CompletionDetailedJobOut$outboundSchema,
        CompletionDetailedJobOut$,
        completionEventToJSON,
        completionEventFromJSON,
        CompletionEvent,
        CompletionEvent$inboundSchema,
        CompletionEvent$Outbound,
        CompletionEvent$outboundSchema,
        CompletionEvent$,
        completionFTModelOutToJSON,
        completionFTModelOutFromJSON,
        CompletionFTModelOutObject,
        ModelType,
        CompletionFTModelOut,
        CompletionFTModelOutObject$inboundSchema,
        CompletionFTModelOutObject$outboundSchema,
        CompletionFTModelOutObject$,
        ModelType$inboundSchema,
        ModelType$outboundSchema,
        ModelType$,
        CompletionFTModelOut$inboundSchema,
        CompletionFTModelOut$Outbound,
        CompletionFTModelOut$outboundSchema,
        CompletionFTModelOut$,
        integrationsToJSON,
        integrationsFromJSON,
        repositoriesToJSON,
        repositoriesFromJSON,
        completionJobOutToJSON,
        completionJobOutFromJSON,
        Status,
        CompletionJobOutObject,
        Integrations,
        JobType,
        Repositories,
        CompletionJobOut,
        Status$inboundSchema,
        Status$outboundSchema,
        Status$,
        CompletionJobOutObject$inboundSchema,
        CompletionJobOutObject$outboundSchema,
        CompletionJobOutObject$,
        Integrations$inboundSchema,
        Integrations$Outbound,
        Integrations$outboundSchema,
        Integrations$,
        JobType$inboundSchema,
        JobType$outboundSchema,
        JobType$,
        Repositories$inboundSchema,
        Repositories$Outbound,
        Repositories$outboundSchema,
        Repositories$,
        CompletionJobOut$inboundSchema,
        CompletionJobOut$Outbound,
        CompletionJobOut$outboundSchema,
        CompletionJobOut$,
        completionResponseStreamChoiceToJSON,
        completionResponseStreamChoiceFromJSON,
        CompletionResponseStreamChoiceFinishReason,
        CompletionResponseStreamChoice,
        CompletionResponseStreamChoiceFinishReason$inboundSchema,
        CompletionResponseStreamChoiceFinishReason$outboundSchema,
        CompletionResponseStreamChoiceFinishReason$,
        CompletionResponseStreamChoice$inboundSchema,
        CompletionResponseStreamChoice$Outbound,
        CompletionResponseStreamChoice$outboundSchema,
        CompletionResponseStreamChoice$,
        completionTrainingParametersToJSON,
        completionTrainingParametersFromJSON,
        CompletionTrainingParameters,
        CompletionTrainingParameters$inboundSchema,
        CompletionTrainingParameters$Outbound,
        CompletionTrainingParameters$outboundSchema,
        CompletionTrainingParameters$,
        completionTrainingParametersInToJSON,
        completionTrainingParametersInFromJSON,
        CompletionTrainingParametersIn,
        CompletionTrainingParametersIn$inboundSchema,
        CompletionTrainingParametersIn$Outbound,
        CompletionTrainingParametersIn$outboundSchema,
        CompletionTrainingParametersIn$,
        contentChunkToJSON,
        contentChunkFromJSON,
        ContentChunk,
        ContentChunk$inboundSchema,
        ContentChunk$Outbound,
        ContentChunk$outboundSchema,
        ContentChunk$,
        conversationAppendRequestToJSON,
        conversationAppendRequestFromJSON,
        ConversationAppendRequestHandoffExecution,
        ConversationAppendRequest,
        ConversationAppendRequestHandoffExecution$inboundSchema,
        ConversationAppendRequestHandoffExecution$outboundSchema,
        ConversationAppendRequestHandoffExecution$,
        ConversationAppendRequest$inboundSchema,
        ConversationAppendRequest$Outbound,
        ConversationAppendRequest$outboundSchema,
        ConversationAppendRequest$,
        conversationAppendStreamRequestToJSON,
        conversationAppendStreamRequestFromJSON,
        ConversationAppendStreamRequestHandoffExecution,
        ConversationAppendStreamRequest,
        ConversationAppendStreamRequestHandoffExecution$inboundSchema,
        ConversationAppendStreamRequestHandoffExecution$outboundSchema,
        ConversationAppendStreamRequestHandoffExecution$,
        ConversationAppendStreamRequest$inboundSchema,
        ConversationAppendStreamRequest$Outbound,
        ConversationAppendStreamRequest$outboundSchema,
        ConversationAppendStreamRequest$,
        conversationEventsDataToJSON,
        conversationEventsDataFromJSON,
        conversationEventsToJSON,
        conversationEventsFromJSON,
        ConversationEventsData,
        ConversationEvents,
        ConversationEventsData$inboundSchema,
        ConversationEventsData$Outbound,
        ConversationEventsData$outboundSchema,
        ConversationEventsData$,
        ConversationEvents$inboundSchema,
        ConversationEvents$Outbound,
        ConversationEvents$outboundSchema,
        ConversationEvents$,
        entriesToJSON,
        entriesFromJSON,
        conversationHistoryToJSON,
        conversationHistoryFromJSON,
        ConversationHistoryObject,
        Entries,
        ConversationHistory,
        ConversationHistoryObject$inboundSchema,
        ConversationHistoryObject$outboundSchema,
        ConversationHistoryObject$,
        Entries$inboundSchema,
        Entries$Outbound,
        Entries$outboundSchema,
        Entries$,
        ConversationHistory$inboundSchema,
        ConversationHistory$Outbound,
        ConversationHistory$outboundSchema,
        ConversationHistory$,
        conversationInputsToJSON,
        conversationInputsFromJSON,
        ConversationInputs,
        ConversationInputs$inboundSchema,
        ConversationInputs$Outbound,
        ConversationInputs$outboundSchema,
        ConversationInputs$,
        conversationMessagesToJSON,
        conversationMessagesFromJSON,
        ConversationMessagesObject,
        ConversationMessages,
        ConversationMessagesObject$inboundSchema,
        ConversationMessagesObject$outboundSchema,
        ConversationMessagesObject$,
        ConversationMessages$inboundSchema,
        ConversationMessages$Outbound,
        ConversationMessages$outboundSchema,
        ConversationMessages$,
        toolsToJSON,
        toolsFromJSON,
        conversationRequestToJSON,
        conversationRequestFromJSON,
        HandoffExecution,
        Tools,
        ConversationRequest,
        HandoffExecution$inboundSchema,
        HandoffExecution$outboundSchema,
        HandoffExecution$,
        Tools$inboundSchema,
        Tools$Outbound,
        Tools$outboundSchema,
        Tools$,
        ConversationRequest$inboundSchema,
        ConversationRequest$Outbound,
        ConversationRequest$outboundSchema,
        ConversationRequest$,
        outputsToJSON,
        outputsFromJSON,
        conversationResponseToJSON,
        conversationResponseFromJSON,
        ConversationResponseObject,
        Outputs,
        ConversationResponse,
        ConversationResponseObject$inboundSchema,
        ConversationResponseObject$outboundSchema,
        ConversationResponseObject$,
        Outputs$inboundSchema,
        Outputs$Outbound,
        Outputs$outboundSchema,
        Outputs$,
        ConversationResponse$inboundSchema,
        ConversationResponse$Outbound,
        ConversationResponse$outboundSchema,
        ConversationResponse$,
        conversationRestartRequestToJSON,
        conversationRestartRequestFromJSON,
        ConversationRestartRequestHandoffExecution,
        ConversationRestartRequest,
        ConversationRestartRequestHandoffExecution$inboundSchema,
        ConversationRestartRequestHandoffExecution$outboundSchema,
        ConversationRestartRequestHandoffExecution$,
        ConversationRestartRequest$inboundSchema,
        ConversationRestartRequest$Outbound,
        ConversationRestartRequest$outboundSchema,
        ConversationRestartRequest$,
        conversationRestartStreamRequestToJSON,
        conversationRestartStreamRequestFromJSON,
        ConversationRestartStreamRequestHandoffExecution,
        ConversationRestartStreamRequest,
        ConversationRestartStreamRequestHandoffExecution$inboundSchema,
        ConversationRestartStreamRequestHandoffExecution$outboundSchema,
        ConversationRestartStreamRequestHandoffExecution$,
        ConversationRestartStreamRequest$inboundSchema,
        ConversationRestartStreamRequest$Outbound,
        ConversationRestartStreamRequest$outboundSchema,
        ConversationRestartStreamRequest$,
        conversationStreamRequestToolsToJSON,
        conversationStreamRequestToolsFromJSON,
        conversationStreamRequestToJSON,
        conversationStreamRequestFromJSON,
        ConversationStreamRequestHandoffExecution,
        ConversationStreamRequestTools,
        ConversationStreamRequest,
        ConversationStreamRequestHandoffExecution$inboundSchema,
        ConversationStreamRequestHandoffExecution$outboundSchema,
        ConversationStreamRequestHandoffExecution$,
        ConversationStreamRequestTools$inboundSchema,
        ConversationStreamRequestTools$Outbound,
        ConversationStreamRequestTools$outboundSchema,
        ConversationStreamRequestTools$,
        ConversationStreamRequest$inboundSchema,
        ConversationStreamRequest$Outbound,
        ConversationStreamRequest$outboundSchema,
        ConversationStreamRequest$,
        conversationUsageInfoToJSON,
        conversationUsageInfoFromJSON,
        ConversationUsageInfo,
        ConversationUsageInfo$inboundSchema,
        ConversationUsageInfo$Outbound,
        ConversationUsageInfo$outboundSchema,
        ConversationUsageInfo$,
        deleteFileOutToJSON,
        deleteFileOutFromJSON,
        DeleteFileOut,
        DeleteFileOut$inboundSchema,
        DeleteFileOut$Outbound,
        DeleteFileOut$outboundSchema,
        DeleteFileOut$,
        deleteModelOutToJSON,
        deleteModelOutFromJSON,
        DeleteModelOut,
        DeleteModelOut$inboundSchema,
        DeleteModelOut$Outbound,
        DeleteModelOut$outboundSchema,
        DeleteModelOut$,
        contentToJSON,
        contentFromJSON,
        deltaMessageToJSON,
        deltaMessageFromJSON,
        Content,
        DeltaMessage,
        Content$inboundSchema,
        Content$Outbound,
        Content$outboundSchema,
        Content$,
        DeltaMessage$inboundSchema,
        DeltaMessage$Outbound,
        DeltaMessage$outboundSchema,
        DeltaMessage$,
        documentLibraryToolToJSON,
        documentLibraryToolFromJSON,
        DocumentLibraryToolType,
        DocumentLibraryTool,
        DocumentLibraryToolType$inboundSchema,
        DocumentLibraryToolType$outboundSchema,
        DocumentLibraryToolType$,
        DocumentLibraryTool$inboundSchema,
        DocumentLibraryTool$Outbound,
        DocumentLibraryTool$outboundSchema,
        DocumentLibraryTool$,
        documentOutToJSON,
        documentOutFromJSON,
        DocumentOut,
        DocumentOut$inboundSchema,
        DocumentOut$Outbound,
        DocumentOut$outboundSchema,
        DocumentOut$,
        documentTextContentToJSON,
        documentTextContentFromJSON,
        DocumentTextContent,
        DocumentTextContent$inboundSchema,
        DocumentTextContent$Outbound,
        DocumentTextContent$outboundSchema,
        DocumentTextContent$,
        documentUpdateInToJSON,
        documentUpdateInFromJSON,
        DocumentUpdateIn,
        DocumentUpdateIn$inboundSchema,
        DocumentUpdateIn$Outbound,
        DocumentUpdateIn$outboundSchema,
        DocumentUpdateIn$,
        documentURLChunkToJSON,
        documentURLChunkFromJSON,
        DocumentURLChunkType,
        DocumentURLChunk,
        DocumentURLChunkType$inboundSchema,
        DocumentURLChunkType$outboundSchema,
        DocumentURLChunkType$,
        DocumentURLChunk$inboundSchema,
        DocumentURLChunk$Outbound,
        DocumentURLChunk$outboundSchema,
        DocumentURLChunk$,
        EmbeddingDtype,
        EmbeddingDtype$inboundSchema,
        EmbeddingDtype$outboundSchema,
        EmbeddingDtype$,
        embeddingRequestInputsToJSON,
        embeddingRequestInputsFromJSON,
        embeddingRequestToJSON,
        embeddingRequestFromJSON,
        EmbeddingRequestInputs,
        EmbeddingRequest,
        EmbeddingRequestInputs$inboundSchema,
        EmbeddingRequestInputs$Outbound,
        EmbeddingRequestInputs$outboundSchema,
        EmbeddingRequestInputs$,
        EmbeddingRequest$inboundSchema,
        EmbeddingRequest$Outbound,
        EmbeddingRequest$outboundSchema,
        EmbeddingRequest$,
        embeddingResponseToJSON,
        embeddingResponseFromJSON,
        EmbeddingResponse,
        EmbeddingResponse$inboundSchema,
        EmbeddingResponse$Outbound,
        EmbeddingResponse$outboundSchema,
        EmbeddingResponse$,
        embeddingResponseDataToJSON,
        embeddingResponseDataFromJSON,
        EmbeddingResponseData,
        EmbeddingResponseData$inboundSchema,
        EmbeddingResponseData$Outbound,
        EmbeddingResponseData$outboundSchema,
        EmbeddingResponseData$,
        EncodingFormat,
        EncodingFormat$inboundSchema,
        EncodingFormat$outboundSchema,
        EncodingFormat$,
        EntityType,
        EntityType$inboundSchema,
        EntityType$outboundSchema,
        EntityType$,
        eventOutToJSON,
        eventOutFromJSON,
        EventOut,
        EventOut$inboundSchema,
        EventOut$Outbound,
        EventOut$outboundSchema,
        EventOut$,
        fileToJSON,
        fileFromJSON,
        FileT,
        FileT$inboundSchema,
        FileT$Outbound,
        FileT$outboundSchema,
        FileT$,
        fileChunkToJSON,
        fileChunkFromJSON,
        FileChunk,
        FileChunk$inboundSchema,
        FileChunk$Outbound,
        FileChunk$outboundSchema,
        FileChunk$,
        FilePurpose,
        FilePurpose$inboundSchema,
        FilePurpose$outboundSchema,
        FilePurpose$,
        fileSchemaToJSON,
        fileSchemaFromJSON,
        FileSchema,
        FileSchema$inboundSchema,
        FileSchema$Outbound,
        FileSchema$outboundSchema,
        FileSchema$,
        fileSignedURLToJSON,
        fileSignedURLFromJSON,
        FileSignedURL,
        FileSignedURL$inboundSchema,
        FileSignedURL$Outbound,
        FileSignedURL$outboundSchema,
        FileSignedURL$,
        fimCompletionRequestStopToJSON,
        fimCompletionRequestStopFromJSON,
        fimCompletionRequestToJSON,
        fimCompletionRequestFromJSON,
        FIMCompletionRequestStop,
        FIMCompletionRequest,
        FIMCompletionRequestStop$inboundSchema,
        FIMCompletionRequestStop$Outbound,
        FIMCompletionRequestStop$outboundSchema,
        FIMCompletionRequestStop$,
        FIMCompletionRequest$inboundSchema,
        FIMCompletionRequest$Outbound,
        FIMCompletionRequest$outboundSchema,
        FIMCompletionRequest$,
        fimCompletionResponseToJSON,
        fimCompletionResponseFromJSON,
        FIMCompletionResponse,
        FIMCompletionResponse$inboundSchema,
        FIMCompletionResponse$Outbound,
        FIMCompletionResponse$outboundSchema,
        FIMCompletionResponse$,
        fimCompletionStreamRequestStopToJSON,
        fimCompletionStreamRequestStopFromJSON,
        fimCompletionStreamRequestToJSON,
        fimCompletionStreamRequestFromJSON,
        FIMCompletionStreamRequestStop,
        FIMCompletionStreamRequest,
        FIMCompletionStreamRequestStop$inboundSchema,
        FIMCompletionStreamRequestStop$Outbound,
        FIMCompletionStreamRequestStop$outboundSchema,
        FIMCompletionStreamRequestStop$,
        FIMCompletionStreamRequest$inboundSchema,
        FIMCompletionStreamRequest$Outbound,
        FIMCompletionStreamRequest$outboundSchema,
        FIMCompletionStreamRequest$,
        FineTuneableModelType,
        FineTuneableModelType$inboundSchema,
        FineTuneableModelType$outboundSchema,
        FineTuneableModelType$,
        FTClassifierLossFunction,
        FTClassifierLossFunction$inboundSchema,
        FTClassifierLossFunction$outboundSchema,
        FTClassifierLossFunction$,
        ftModelCapabilitiesOutToJSON,
        ftModelCapabilitiesOutFromJSON,
        FTModelCapabilitiesOut,
        FTModelCapabilitiesOut$inboundSchema,
        FTModelCapabilitiesOut$Outbound,
        FTModelCapabilitiesOut$outboundSchema,
        FTModelCapabilitiesOut$,
        ftModelCardToJSON,
        ftModelCardFromJSON,
        FTModelCardType,
        FTModelCard,
        FTModelCardType$inboundSchema,
        FTModelCardType$outboundSchema,
        FTModelCardType$,
        FTModelCard$inboundSchema,
        FTModelCard$Outbound,
        FTModelCard$outboundSchema,
        FTModelCard$,
        functionToJSON,
        functionFromJSON,
        FunctionT,
        FunctionT$inboundSchema,
        FunctionT$Outbound,
        FunctionT$outboundSchema,
        FunctionT$,
        argumentsToJSON,
        argumentsFromJSON,
        functionCallToJSON,
        functionCallFromJSON,
        Arguments,
        FunctionCall,
        Arguments$inboundSchema,
        Arguments$Outbound,
        Arguments$outboundSchema,
        Arguments$,
        FunctionCall$inboundSchema,
        FunctionCall$Outbound,
        FunctionCall$outboundSchema,
        FunctionCall$,
        functionCallEntryToJSON,
        functionCallEntryFromJSON,
        FunctionCallEntryObject,
        FunctionCallEntryType,
        FunctionCallEntry,
        FunctionCallEntryObject$inboundSchema,
        FunctionCallEntryObject$outboundSchema,
        FunctionCallEntryObject$,
        FunctionCallEntryType$inboundSchema,
        FunctionCallEntryType$outboundSchema,
        FunctionCallEntryType$,
        FunctionCallEntry$inboundSchema,
        FunctionCallEntry$Outbound,
        FunctionCallEntry$outboundSchema,
        FunctionCallEntry$,
        functionCallEntryArgumentsToJSON,
        functionCallEntryArgumentsFromJSON,
        FunctionCallEntryArguments,
        FunctionCallEntryArguments$inboundSchema,
        FunctionCallEntryArguments$Outbound,
        FunctionCallEntryArguments$outboundSchema,
        FunctionCallEntryArguments$,
        functionCallEventToJSON,
        functionCallEventFromJSON,
        FunctionCallEventType,
        FunctionCallEvent,
        FunctionCallEventType$inboundSchema,
        FunctionCallEventType$outboundSchema,
        FunctionCallEventType$,
        FunctionCallEvent$inboundSchema,
        FunctionCallEvent$Outbound,
        FunctionCallEvent$outboundSchema,
        FunctionCallEvent$,
        functionNameToJSON,
        functionNameFromJSON,
        FunctionName,
        FunctionName$inboundSchema,
        FunctionName$Outbound,
        FunctionName$outboundSchema,
        FunctionName$,
        functionResultEntryToJSON,
        functionResultEntryFromJSON,
        FunctionResultEntryObject,
        FunctionResultEntryType,
        FunctionResultEntry,
        FunctionResultEntryObject$inboundSchema,
        FunctionResultEntryObject$outboundSchema,
        FunctionResultEntryObject$,
        FunctionResultEntryType$inboundSchema,
        FunctionResultEntryType$outboundSchema,
        FunctionResultEntryType$,
        FunctionResultEntry$inboundSchema,
        FunctionResultEntry$Outbound,
        FunctionResultEntry$outboundSchema,
        FunctionResultEntry$,
        functionToolToJSON,
        functionToolFromJSON,
        FunctionToolType,
        FunctionTool,
        FunctionToolType$inboundSchema,
        FunctionToolType$outboundSchema,
        FunctionToolType$,
        FunctionTool$inboundSchema,
        FunctionTool$Outbound,
        FunctionTool$outboundSchema,
        FunctionTool$,
        githubRepositoryInToJSON,
        githubRepositoryInFromJSON,
        GithubRepositoryInType,
        GithubRepositoryIn,
        GithubRepositoryInType$inboundSchema,
        GithubRepositoryInType$outboundSchema,
        GithubRepositoryInType$,
        GithubRepositoryIn$inboundSchema,
        GithubRepositoryIn$Outbound,
        GithubRepositoryIn$outboundSchema,
        GithubRepositoryIn$,
        githubRepositoryOutToJSON,
        githubRepositoryOutFromJSON,
        GithubRepositoryOutType,
        GithubRepositoryOut,
        GithubRepositoryOutType$inboundSchema,
        GithubRepositoryOutType$outboundSchema,
        GithubRepositoryOutType$,
        GithubRepositoryOut$inboundSchema,
        GithubRepositoryOut$Outbound,
        GithubRepositoryOut$outboundSchema,
        GithubRepositoryOut$,
        imageGenerationToolToJSON,
        imageGenerationToolFromJSON,
        ImageGenerationToolType,
        ImageGenerationTool,
        ImageGenerationToolType$inboundSchema,
        ImageGenerationToolType$outboundSchema,
        ImageGenerationToolType$,
        ImageGenerationTool$inboundSchema,
        ImageGenerationTool$Outbound,
        ImageGenerationTool$outboundSchema,
        ImageGenerationTool$,
        imageURLToJSON,
        imageURLFromJSON,
        ImageURL,
        ImageURL$inboundSchema,
        ImageURL$Outbound,
        ImageURL$outboundSchema,
        ImageURL$,
        imageURLChunkImageURLToJSON,
        imageURLChunkImageURLFromJSON,
        imageURLChunkToJSON,
        imageURLChunkFromJSON,
        ImageURLChunkImageURL,
        ImageURLChunkType,
        ImageURLChunk,
        ImageURLChunkImageURL$inboundSchema,
        ImageURLChunkImageURL$Outbound,
        ImageURLChunkImageURL$outboundSchema,
        ImageURLChunkImageURL$,
        ImageURLChunkType$inboundSchema,
        ImageURLChunkType$outboundSchema,
        ImageURLChunkType$,
        ImageURLChunk$inboundSchema,
        ImageURLChunk$Outbound,
        ImageURLChunk$outboundSchema,
        ImageURLChunk$,
        inputEntriesToJSON,
        inputEntriesFromJSON,
        InputEntries,
        InputEntries$inboundSchema,
        InputEntries$Outbound,
        InputEntries$outboundSchema,
        InputEntries$,
        instructRequestInputsMessagesToJSON,
        instructRequestInputsMessagesFromJSON,
        instructRequestInputsToJSON,
        instructRequestInputsFromJSON,
        inputsToJSON,
        inputsFromJSON,
        InstructRequestInputsMessages,
        InstructRequestInputs,
        Inputs,
        InstructRequestInputsMessages$inboundSchema,
        InstructRequestInputsMessages$Outbound,
        InstructRequestInputsMessages$outboundSchema,
        InstructRequestInputsMessages$,
        InstructRequestInputs$inboundSchema,
        InstructRequestInputs$Outbound,
        InstructRequestInputs$outboundSchema,
        InstructRequestInputs$,
        Inputs$inboundSchema,
        Inputs$Outbound,
        Inputs$outboundSchema,
        Inputs$,
        instructRequestMessagesToJSON,
        instructRequestMessagesFromJSON,
        instructRequestToJSON,
        instructRequestFromJSON,
        InstructRequestMessages,
        InstructRequest,
        InstructRequestMessages$inboundSchema,
        InstructRequestMessages$Outbound,
        InstructRequestMessages$outboundSchema,
        InstructRequestMessages$,
        InstructRequest$inboundSchema,
        InstructRequest$Outbound,
        InstructRequest$outboundSchema,
        InstructRequest$,
        jobInIntegrationsToJSON,
        jobInIntegrationsFromJSON,
        hyperparametersToJSON,
        hyperparametersFromJSON,
        jobInRepositoriesToJSON,
        jobInRepositoriesFromJSON,
        jobInToJSON,
        jobInFromJSON,
        JobInIntegrations,
        Hyperparameters,
        JobInRepositories,
        JobIn,
        JobInIntegrations$inboundSchema,
        JobInIntegrations$Outbound,
        JobInIntegrations$outboundSchema,
        JobInIntegrations$,
        Hyperparameters$inboundSchema,
        Hyperparameters$Outbound,
        Hyperparameters$outboundSchema,
        Hyperparameters$,
        JobInRepositories$inboundSchema,
        JobInRepositories$Outbound,
        JobInRepositories$outboundSchema,
        JobInRepositories$,
        JobIn$inboundSchema,
        JobIn$Outbound,
        JobIn$outboundSchema,
        JobIn$,
        jobMetadataOutToJSON,
        jobMetadataOutFromJSON,
        JobMetadataOut,
        JobMetadataOut$inboundSchema,
        JobMetadataOut$Outbound,
        JobMetadataOut$outboundSchema,
        JobMetadataOut$,
        jobsOutDataToJSON,
        jobsOutDataFromJSON,
        jobsOutToJSON,
        jobsOutFromJSON,
        JobsOutData,
        JobsOutObject,
        JobsOut,
        JobsOutData$inboundSchema,
        JobsOutData$Outbound,
        JobsOutData$outboundSchema,
        JobsOutData$,
        JobsOutObject$inboundSchema,
        JobsOutObject$outboundSchema,
        JobsOutObject$,
        JobsOut$inboundSchema,
        JobsOut$Outbound,
        JobsOut$outboundSchema,
        JobsOut$,
        jsonSchemaToJSON,
        jsonSchemaFromJSON,
        JsonSchema,
        JsonSchema$inboundSchema,
        JsonSchema$Outbound,
        JsonSchema$outboundSchema,
        JsonSchema$,
        legacyJobMetadataOutToJSON,
        legacyJobMetadataOutFromJSON,
        LegacyJobMetadataOutObject,
        LegacyJobMetadataOut,
        LegacyJobMetadataOutObject$inboundSchema,
        LegacyJobMetadataOutObject$outboundSchema,
        LegacyJobMetadataOutObject$,
        LegacyJobMetadataOut$inboundSchema,
        LegacyJobMetadataOut$Outbound,
        LegacyJobMetadataOut$outboundSchema,
        LegacyJobMetadataOut$,
        libraryInToJSON,
        libraryInFromJSON,
        LibraryIn,
        LibraryIn$inboundSchema,
        LibraryIn$Outbound,
        LibraryIn$outboundSchema,
        LibraryIn$,
        libraryInUpdateToJSON,
        libraryInUpdateFromJSON,
        LibraryInUpdate,
        LibraryInUpdate$inboundSchema,
        LibraryInUpdate$Outbound,
        LibraryInUpdate$outboundSchema,
        LibraryInUpdate$,
        libraryOutToJSON,
        libraryOutFromJSON,
        LibraryOut,
        LibraryOut$inboundSchema,
        LibraryOut$Outbound,
        LibraryOut$outboundSchema,
        LibraryOut$,
        listDocumentOutToJSON,
        listDocumentOutFromJSON,
        ListDocumentOut,
        ListDocumentOut$inboundSchema,
        ListDocumentOut$Outbound,
        ListDocumentOut$outboundSchema,
        ListDocumentOut$,
        listFilesOutToJSON,
        listFilesOutFromJSON,
        ListFilesOut,
        ListFilesOut$inboundSchema,
        ListFilesOut$Outbound,
        ListFilesOut$outboundSchema,
        ListFilesOut$,
        listLibraryOutToJSON,
        listLibraryOutFromJSON,
        ListLibraryOut,
        ListLibraryOut$inboundSchema,
        ListLibraryOut$Outbound,
        ListLibraryOut$outboundSchema,
        ListLibraryOut$,
        listSharingOutToJSON,
        listSharingOutFromJSON,
        ListSharingOut,
        ListSharingOut$inboundSchema,
        ListSharingOut$Outbound,
        ListSharingOut$outboundSchema,
        ListSharingOut$,
        messageEntriesToJSON,
        messageEntriesFromJSON,
        MessageEntries,
        MessageEntries$inboundSchema,
        MessageEntries$Outbound,
        MessageEntries$outboundSchema,
        MessageEntries$,
        messageInputContentChunksToJSON,
        messageInputContentChunksFromJSON,
        MessageInputContentChunks,
        MessageInputContentChunks$inboundSchema,
        MessageInputContentChunks$Outbound,
        MessageInputContentChunks$outboundSchema,
        MessageInputContentChunks$,
        messageInputEntryContentToJSON,
        messageInputEntryContentFromJSON,
        messageInputEntryToJSON,
        messageInputEntryFromJSON,
        ObjectT,
        MessageInputEntryType,
        MessageInputEntryRole,
        MessageInputEntryContent,
        MessageInputEntry,
        ObjectT$inboundSchema,
        ObjectT$outboundSchema,
        ObjectT$,
        MessageInputEntryType$inboundSchema,
        MessageInputEntryType$outboundSchema,
        MessageInputEntryType$,
        MessageInputEntryRole$inboundSchema,
        MessageInputEntryRole$outboundSchema,
        MessageInputEntryRole$,
        MessageInputEntryContent$inboundSchema,
        MessageInputEntryContent$Outbound,
        MessageInputEntryContent$outboundSchema,
        MessageInputEntryContent$,
        MessageInputEntry$inboundSchema,
        MessageInputEntry$Outbound,
        MessageInputEntry$outboundSchema,
        MessageInputEntry$,
        messageOutputContentChunksToJSON,
        messageOutputContentChunksFromJSON,
        MessageOutputContentChunks,
        MessageOutputContentChunks$inboundSchema,
        MessageOutputContentChunks$Outbound,
        MessageOutputContentChunks$outboundSchema,
        MessageOutputContentChunks$,
        messageOutputEntryContentToJSON,
        messageOutputEntryContentFromJSON,
        messageOutputEntryToJSON,
        messageOutputEntryFromJSON,
        MessageOutputEntryObject,
        MessageOutputEntryType,
        MessageOutputEntryRole,
        MessageOutputEntryContent,
        MessageOutputEntry,
        MessageOutputEntryObject$inboundSchema,
        MessageOutputEntryObject$outboundSchema,
        MessageOutputEntryObject$,
        MessageOutputEntryType$inboundSchema,
        MessageOutputEntryType$outboundSchema,
        MessageOutputEntryType$,
        MessageOutputEntryRole$inboundSchema,
        MessageOutputEntryRole$outboundSchema,
        MessageOutputEntryRole$,
        MessageOutputEntryContent$inboundSchema,
        MessageOutputEntryContent$Outbound,
        MessageOutputEntryContent$outboundSchema,
        MessageOutputEntryContent$,
        MessageOutputEntry$inboundSchema,
        MessageOutputEntry$Outbound,
        MessageOutputEntry$outboundSchema,
        MessageOutputEntry$,
        messageOutputEventContentToJSON,
        messageOutputEventContentFromJSON,
        messageOutputEventToJSON,
        messageOutputEventFromJSON,
        MessageOutputEventType,
        MessageOutputEventRole,
        MessageOutputEventContent,
        MessageOutputEvent,
        MessageOutputEventType$inboundSchema,
        MessageOutputEventType$outboundSchema,
        MessageOutputEventType$,
        MessageOutputEventRole$inboundSchema,
        MessageOutputEventRole$outboundSchema,
        MessageOutputEventRole$,
        MessageOutputEventContent$inboundSchema,
        MessageOutputEventContent$Outbound,
        MessageOutputEventContent$outboundSchema,
        MessageOutputEventContent$,
        MessageOutputEvent$inboundSchema,
        MessageOutputEvent$Outbound,
        MessageOutputEvent$outboundSchema,
        MessageOutputEvent$,
        metricOutToJSON,
        metricOutFromJSON,
        MetricOut,
        MetricOut$inboundSchema,
        MetricOut$Outbound,
        MetricOut$outboundSchema,
        MetricOut$,
        MistralPromptMode,
        MistralPromptMode$inboundSchema,
        MistralPromptMode$outboundSchema,
        MistralPromptMode$,
        modelCapabilitiesToJSON,
        modelCapabilitiesFromJSON,
        ModelCapabilities,
        ModelCapabilities$inboundSchema,
        ModelCapabilities$Outbound,
        ModelCapabilities$outboundSchema,
        ModelCapabilities$,
        modelConversationToolsToJSON,
        modelConversationToolsFromJSON,
        modelConversationToJSON,
        modelConversationFromJSON,
        ModelConversationTools,
        ModelConversationObject,
        ModelConversation,
        ModelConversationTools$inboundSchema,
        ModelConversationTools$Outbound,
        ModelConversationTools$outboundSchema,
        ModelConversationTools$,
        ModelConversationObject$inboundSchema,
        ModelConversationObject$outboundSchema,
        ModelConversationObject$,
        ModelConversation$inboundSchema,
        ModelConversation$Outbound,
        ModelConversation$outboundSchema,
        ModelConversation$,
        dataToJSON,
        dataFromJSON,
        modelListToJSON,
        modelListFromJSON,
        Data,
        ModelList,
        Data$inboundSchema,
        Data$Outbound,
        Data$outboundSchema,
        Data$,
        ModelList$inboundSchema,
        ModelList$Outbound,
        ModelList$outboundSchema,
        ModelList$,
        moderationObjectToJSON,
        moderationObjectFromJSON,
        ModerationObject,
        ModerationObject$inboundSchema,
        ModerationObject$Outbound,
        ModerationObject$outboundSchema,
        ModerationObject$,
        moderationResponseToJSON,
        moderationResponseFromJSON,
        ModerationResponse,
        ModerationResponse$inboundSchema,
        ModerationResponse$Outbound,
        ModerationResponse$outboundSchema,
        ModerationResponse$,
        ocrImageObjectToJSON,
        ocrImageObjectFromJSON,
        OCRImageObject,
        OCRImageObject$inboundSchema,
        OCRImageObject$Outbound,
        OCRImageObject$outboundSchema,
        OCRImageObject$,
        ocrPageDimensionsToJSON,
        ocrPageDimensionsFromJSON,
        OCRPageDimensions,
        OCRPageDimensions$inboundSchema,
        OCRPageDimensions$Outbound,
        OCRPageDimensions$outboundSchema,
        OCRPageDimensions$,
        ocrPageObjectToJSON,
        ocrPageObjectFromJSON,
        OCRPageObject,
        OCRPageObject$inboundSchema,
        OCRPageObject$Outbound,
        OCRPageObject$outboundSchema,
        OCRPageObject$,
        documentToJSON,
        documentFromJSON,
        ocrRequestToJSON,
        ocrRequestFromJSON,
        Document_2 as Document,
        OCRRequest,
        Document$inboundSchema,
        Document$Outbound,
        Document$outboundSchema,
        Document$,
        OCRRequest$inboundSchema,
        OCRRequest$Outbound,
        OCRRequest$outboundSchema,
        OCRRequest$,
        ocrResponseToJSON,
        ocrResponseFromJSON,
        OCRResponse,
        OCRResponse$inboundSchema,
        OCRResponse$Outbound,
        OCRResponse$outboundSchema,
        OCRResponse$,
        ocrUsageInfoToJSON,
        ocrUsageInfoFromJSON,
        OCRUsageInfo,
        OCRUsageInfo$inboundSchema,
        OCRUsageInfo$Outbound,
        OCRUsageInfo$outboundSchema,
        OCRUsageInfo$,
        outputContentChunksToJSON,
        outputContentChunksFromJSON,
        OutputContentChunks,
        OutputContentChunks$inboundSchema,
        OutputContentChunks$Outbound,
        OutputContentChunks$outboundSchema,
        OutputContentChunks$,
        paginationInfoToJSON,
        paginationInfoFromJSON,
        PaginationInfo,
        PaginationInfo$inboundSchema,
        PaginationInfo$Outbound,
        PaginationInfo$outboundSchema,
        PaginationInfo$,
        predictionToJSON,
        predictionFromJSON,
        Prediction,
        Prediction$inboundSchema,
        Prediction$Outbound,
        Prediction$outboundSchema,
        Prediction$,
        processingStatusOutToJSON,
        processingStatusOutFromJSON,
        ProcessingStatusOut,
        ProcessingStatusOut$inboundSchema,
        ProcessingStatusOut$Outbound,
        ProcessingStatusOut$outboundSchema,
        ProcessingStatusOut$,
        referenceChunkToJSON,
        referenceChunkFromJSON,
        ReferenceChunkType,
        ReferenceChunk,
        ReferenceChunkType$inboundSchema,
        ReferenceChunkType$outboundSchema,
        ReferenceChunkType$,
        ReferenceChunk$inboundSchema,
        ReferenceChunk$Outbound,
        ReferenceChunk$outboundSchema,
        ReferenceChunk$,
        responseDoneEventToJSON,
        responseDoneEventFromJSON,
        ResponseDoneEventType,
        ResponseDoneEvent,
        ResponseDoneEventType$inboundSchema,
        ResponseDoneEventType$outboundSchema,
        ResponseDoneEventType$,
        ResponseDoneEvent$inboundSchema,
        ResponseDoneEvent$Outbound,
        ResponseDoneEvent$outboundSchema,
        ResponseDoneEvent$,
        responseErrorEventToJSON,
        responseErrorEventFromJSON,
        ResponseErrorEventType,
        ResponseErrorEvent,
        ResponseErrorEventType$inboundSchema,
        ResponseErrorEventType$outboundSchema,
        ResponseErrorEventType$,
        ResponseErrorEvent$inboundSchema,
        ResponseErrorEvent$Outbound,
        ResponseErrorEvent$outboundSchema,
        ResponseErrorEvent$,
        responseFormatToJSON,
        responseFormatFromJSON,
        ResponseFormat,
        ResponseFormat$inboundSchema,
        ResponseFormat$Outbound,
        ResponseFormat$outboundSchema,
        ResponseFormat$,
        ResponseFormats,
        ResponseFormats$inboundSchema,
        ResponseFormats$outboundSchema,
        ResponseFormats$,
        responseStartedEventToJSON,
        responseStartedEventFromJSON,
        ResponseStartedEventType,
        ResponseStartedEvent,
        ResponseStartedEventType$inboundSchema,
        ResponseStartedEventType$outboundSchema,
        ResponseStartedEventType$,
        ResponseStartedEvent$inboundSchema,
        ResponseStartedEvent$Outbound,
        ResponseStartedEvent$outboundSchema,
        ResponseStartedEvent$,
        retrieveFileOutToJSON,
        retrieveFileOutFromJSON,
        RetrieveFileOut,
        RetrieveFileOut$inboundSchema,
        RetrieveFileOut$Outbound,
        RetrieveFileOut$outboundSchema,
        RetrieveFileOut$,
        SampleType,
        SampleType$inboundSchema,
        SampleType$outboundSchema,
        SampleType$,
        securityToJSON,
        securityFromJSON,
        Security,
        Security$inboundSchema,
        Security$Outbound,
        Security$outboundSchema,
        Security$,
        ShareEnum,
        ShareEnum$inboundSchema,
        ShareEnum$outboundSchema,
        ShareEnum$,
        sharingDeleteToJSON,
        sharingDeleteFromJSON,
        SharingDelete,
        SharingDelete$inboundSchema,
        SharingDelete$Outbound,
        SharingDelete$outboundSchema,
        SharingDelete$,
        sharingInToJSON,
        sharingInFromJSON,
        SharingIn,
        SharingIn$inboundSchema,
        SharingIn$Outbound,
        SharingIn$outboundSchema,
        SharingIn$,
        sharingOutToJSON,
        sharingOutFromJSON,
        SharingOut,
        SharingOut$inboundSchema,
        SharingOut$Outbound,
        SharingOut$outboundSchema,
        SharingOut$,
        Source,
        Source$inboundSchema,
        Source$outboundSchema,
        Source$,
        SSETypes,
        SSETypes$inboundSchema,
        SSETypes$outboundSchema,
        SSETypes$,
        systemMessageContentToJSON,
        systemMessageContentFromJSON,
        systemMessageToJSON,
        systemMessageFromJSON,
        SystemMessageContent,
        Role,
        SystemMessage,
        SystemMessageContent$inboundSchema,
        SystemMessageContent$Outbound,
        SystemMessageContent$outboundSchema,
        SystemMessageContent$,
        Role$inboundSchema,
        Role$outboundSchema,
        Role$,
        SystemMessage$inboundSchema,
        SystemMessage$Outbound,
        SystemMessage$outboundSchema,
        SystemMessage$,
        systemMessageContentChunksToJSON,
        systemMessageContentChunksFromJSON,
        SystemMessageContentChunks,
        SystemMessageContentChunks$inboundSchema,
        SystemMessageContentChunks$Outbound,
        SystemMessageContentChunks$outboundSchema,
        SystemMessageContentChunks$,
        textChunkToJSON,
        textChunkFromJSON,
        TextChunkType,
        TextChunk,
        TextChunkType$inboundSchema,
        TextChunkType$outboundSchema,
        TextChunkType$,
        TextChunk$inboundSchema,
        TextChunk$Outbound,
        TextChunk$outboundSchema,
        TextChunk$,
        thinkingToJSON,
        thinkingFromJSON,
        thinkChunkToJSON,
        thinkChunkFromJSON,
        Thinking,
        ThinkChunkType,
        ThinkChunk,
        Thinking$inboundSchema,
        Thinking$Outbound,
        Thinking$outboundSchema,
        Thinking$,
        ThinkChunkType$inboundSchema,
        ThinkChunkType$outboundSchema,
        ThinkChunkType$,
        ThinkChunk$inboundSchema,
        ThinkChunk$Outbound,
        ThinkChunk$outboundSchema,
        ThinkChunk$,
        TimestampGranularity,
        TimestampGranularity$inboundSchema,
        TimestampGranularity$outboundSchema,
        TimestampGranularity$,
        toolToJSON,
        toolFromJSON,
        Tool,
        Tool$inboundSchema,
        Tool$Outbound,
        Tool$outboundSchema,
        Tool$,
        toolCallToJSON,
        toolCallFromJSON,
        ToolCall,
        ToolCall$inboundSchema,
        ToolCall$Outbound,
        ToolCall$outboundSchema,
        ToolCall$,
        toolChoiceToJSON,
        toolChoiceFromJSON,
        ToolChoice,
        ToolChoice$inboundSchema,
        ToolChoice$Outbound,
        ToolChoice$outboundSchema,
        ToolChoice$,
        ToolChoiceEnum,
        ToolChoiceEnum$inboundSchema,
        ToolChoiceEnum$outboundSchema,
        ToolChoiceEnum$,
        toolExecutionDeltaEventToJSON,
        toolExecutionDeltaEventFromJSON,
        ToolExecutionDeltaEventType,
        ToolExecutionDeltaEvent,
        ToolExecutionDeltaEventType$inboundSchema,
        ToolExecutionDeltaEventType$outboundSchema,
        ToolExecutionDeltaEventType$,
        ToolExecutionDeltaEvent$inboundSchema,
        ToolExecutionDeltaEvent$Outbound,
        ToolExecutionDeltaEvent$outboundSchema,
        ToolExecutionDeltaEvent$,
        toolExecutionDoneEventToJSON,
        toolExecutionDoneEventFromJSON,
        ToolExecutionDoneEventType,
        ToolExecutionDoneEvent,
        ToolExecutionDoneEventType$inboundSchema,
        ToolExecutionDoneEventType$outboundSchema,
        ToolExecutionDoneEventType$,
        ToolExecutionDoneEvent$inboundSchema,
        ToolExecutionDoneEvent$Outbound,
        ToolExecutionDoneEvent$outboundSchema,
        ToolExecutionDoneEvent$,
        toolExecutionEntryToJSON,
        toolExecutionEntryFromJSON,
        ToolExecutionEntryObject,
        ToolExecutionEntryType,
        ToolExecutionEntry,
        ToolExecutionEntryObject$inboundSchema,
        ToolExecutionEntryObject$outboundSchema,
        ToolExecutionEntryObject$,
        ToolExecutionEntryType$inboundSchema,
        ToolExecutionEntryType$outboundSchema,
        ToolExecutionEntryType$,
        ToolExecutionEntry$inboundSchema,
        ToolExecutionEntry$Outbound,
        ToolExecutionEntry$outboundSchema,
        ToolExecutionEntry$,
        toolExecutionStartedEventToJSON,
        toolExecutionStartedEventFromJSON,
        ToolExecutionStartedEventType,
        ToolExecutionStartedEvent,
        ToolExecutionStartedEventType$inboundSchema,
        ToolExecutionStartedEventType$outboundSchema,
        ToolExecutionStartedEventType$,
        ToolExecutionStartedEvent$inboundSchema,
        ToolExecutionStartedEvent$Outbound,
        ToolExecutionStartedEvent$outboundSchema,
        ToolExecutionStartedEvent$,
        toolFileChunkToJSON,
        toolFileChunkFromJSON,
        ToolFileChunkType,
        ToolFileChunk,
        ToolFileChunkType$inboundSchema,
        ToolFileChunkType$outboundSchema,
        ToolFileChunkType$,
        ToolFileChunk$inboundSchema,
        ToolFileChunk$Outbound,
        ToolFileChunk$outboundSchema,
        ToolFileChunk$,
        toolMessageContentToJSON,
        toolMessageContentFromJSON,
        toolMessageToJSON,
        toolMessageFromJSON,
        ToolMessageContent,
        ToolMessageRole,
        ToolMessage,
        ToolMessageContent$inboundSchema,
        ToolMessageContent$Outbound,
        ToolMessageContent$outboundSchema,
        ToolMessageContent$,
        ToolMessageRole$inboundSchema,
        ToolMessageRole$outboundSchema,
        ToolMessageRole$,
        ToolMessage$inboundSchema,
        ToolMessage$Outbound,
        ToolMessage$outboundSchema,
        ToolMessage$,
        toolReferenceChunkToJSON,
        toolReferenceChunkFromJSON,
        ToolReferenceChunkType,
        ToolReferenceChunk,
        ToolReferenceChunkType$inboundSchema,
        ToolReferenceChunkType$outboundSchema,
        ToolReferenceChunkType$,
        ToolReferenceChunk$inboundSchema,
        ToolReferenceChunk$Outbound,
        ToolReferenceChunk$outboundSchema,
        ToolReferenceChunk$,
        ToolTypes,
        ToolTypes$inboundSchema,
        ToolTypes$outboundSchema,
        ToolTypes$,
        trainingFileToJSON,
        trainingFileFromJSON,
        TrainingFile,
        TrainingFile$inboundSchema,
        TrainingFile$Outbound,
        TrainingFile$outboundSchema,
        TrainingFile$,
        transcriptionResponseToJSON,
        transcriptionResponseFromJSON,
        TranscriptionResponse,
        TranscriptionResponse$inboundSchema,
        TranscriptionResponse$Outbound,
        TranscriptionResponse$outboundSchema,
        TranscriptionResponse$,
        transcriptionSegmentChunkToJSON,
        transcriptionSegmentChunkFromJSON,
        Type,
        TranscriptionSegmentChunk,
        Type$inboundSchema,
        Type$outboundSchema,
        Type$,
        TranscriptionSegmentChunk$inboundSchema,
        TranscriptionSegmentChunk$Outbound,
        TranscriptionSegmentChunk$outboundSchema,
        TranscriptionSegmentChunk$,
        transcriptionStreamDoneToJSON,
        transcriptionStreamDoneFromJSON,
        TranscriptionStreamDoneType,
        TranscriptionStreamDone,
        TranscriptionStreamDoneType$inboundSchema,
        TranscriptionStreamDoneType$outboundSchema,
        TranscriptionStreamDoneType$,
        TranscriptionStreamDone$inboundSchema,
        TranscriptionStreamDone$Outbound,
        TranscriptionStreamDone$outboundSchema,
        TranscriptionStreamDone$,
        transcriptionStreamEventsDataToJSON,
        transcriptionStreamEventsDataFromJSON,
        transcriptionStreamEventsToJSON,
        transcriptionStreamEventsFromJSON,
        TranscriptionStreamEventsData,
        TranscriptionStreamEvents,
        TranscriptionStreamEventsData$inboundSchema,
        TranscriptionStreamEventsData$Outbound,
        TranscriptionStreamEventsData$outboundSchema,
        TranscriptionStreamEventsData$,
        TranscriptionStreamEvents$inboundSchema,
        TranscriptionStreamEvents$Outbound,
        TranscriptionStreamEvents$outboundSchema,
        TranscriptionStreamEvents$,
        TranscriptionStreamEventTypes,
        TranscriptionStreamEventTypes$inboundSchema,
        TranscriptionStreamEventTypes$outboundSchema,
        TranscriptionStreamEventTypes$,
        transcriptionStreamLanguageToJSON,
        transcriptionStreamLanguageFromJSON,
        TranscriptionStreamLanguageType,
        TranscriptionStreamLanguage,
        TranscriptionStreamLanguageType$inboundSchema,
        TranscriptionStreamLanguageType$outboundSchema,
        TranscriptionStreamLanguageType$,
        TranscriptionStreamLanguage$inboundSchema,
        TranscriptionStreamLanguage$Outbound,
        TranscriptionStreamLanguage$outboundSchema,
        TranscriptionStreamLanguage$,
        transcriptionStreamSegmentDeltaToJSON,
        transcriptionStreamSegmentDeltaFromJSON,
        TranscriptionStreamSegmentDeltaType,
        TranscriptionStreamSegmentDelta,
        TranscriptionStreamSegmentDeltaType$inboundSchema,
        TranscriptionStreamSegmentDeltaType$outboundSchema,
        TranscriptionStreamSegmentDeltaType$,
        TranscriptionStreamSegmentDelta$inboundSchema,
        TranscriptionStreamSegmentDelta$Outbound,
        TranscriptionStreamSegmentDelta$outboundSchema,
        TranscriptionStreamSegmentDelta$,
        transcriptionStreamTextDeltaToJSON,
        transcriptionStreamTextDeltaFromJSON,
        TranscriptionStreamTextDeltaType,
        TranscriptionStreamTextDelta,
        TranscriptionStreamTextDeltaType$inboundSchema,
        TranscriptionStreamTextDeltaType$outboundSchema,
        TranscriptionStreamTextDeltaType$,
        TranscriptionStreamTextDelta$inboundSchema,
        TranscriptionStreamTextDelta$Outbound,
        TranscriptionStreamTextDelta$outboundSchema,
        TranscriptionStreamTextDelta$,
        unarchiveFTModelOutToJSON,
        unarchiveFTModelOutFromJSON,
        UnarchiveFTModelOutObject,
        UnarchiveFTModelOut,
        UnarchiveFTModelOutObject$inboundSchema,
        UnarchiveFTModelOutObject$outboundSchema,
        UnarchiveFTModelOutObject$,
        UnarchiveFTModelOut$inboundSchema,
        UnarchiveFTModelOut$Outbound,
        UnarchiveFTModelOut$outboundSchema,
        UnarchiveFTModelOut$,
        updateFTModelInToJSON,
        updateFTModelInFromJSON,
        UpdateFTModelIn,
        UpdateFTModelIn$inboundSchema,
        UpdateFTModelIn$Outbound,
        UpdateFTModelIn$outboundSchema,
        UpdateFTModelIn$,
        uploadFileOutToJSON,
        uploadFileOutFromJSON,
        UploadFileOut,
        UploadFileOut$inboundSchema,
        UploadFileOut$Outbound,
        UploadFileOut$outboundSchema,
        UploadFileOut$,
        usageInfoToJSON,
        usageInfoFromJSON,
        UsageInfo,
        UsageInfo$inboundSchema,
        UsageInfo$Outbound,
        UsageInfo$outboundSchema,
        UsageInfo$,
        userMessageContentToJSON,
        userMessageContentFromJSON,
        userMessageToJSON,
        userMessageFromJSON,
        UserMessageContent,
        UserMessageRole,
        UserMessage,
        UserMessageContent$inboundSchema,
        UserMessageContent$Outbound,
        UserMessageContent$outboundSchema,
        UserMessageContent$,
        UserMessageRole$inboundSchema,
        UserMessageRole$outboundSchema,
        UserMessageRole$,
        UserMessage$inboundSchema,
        UserMessage$Outbound,
        UserMessage$outboundSchema,
        UserMessage$,
        locToJSON,
        locFromJSON,
        validationErrorToJSON,
        validationErrorFromJSON,
        Loc,
        ValidationError,
        Loc$inboundSchema,
        Loc$Outbound,
        Loc$outboundSchema,
        Loc$,
        ValidationError$inboundSchema,
        ValidationError$Outbound,
        ValidationError$outboundSchema,
        ValidationError$,
        wandbIntegrationToJSON,
        wandbIntegrationFromJSON,
        WandbIntegrationType,
        WandbIntegration,
        WandbIntegrationType$inboundSchema,
        WandbIntegrationType$outboundSchema,
        WandbIntegrationType$,
        WandbIntegration$inboundSchema,
        WandbIntegration$Outbound,
        WandbIntegration$outboundSchema,
        WandbIntegration$,
        wandbIntegrationOutToJSON,
        wandbIntegrationOutFromJSON,
        WandbIntegrationOutType,
        WandbIntegrationOut,
        WandbIntegrationOutType$inboundSchema,
        WandbIntegrationOutType$outboundSchema,
        WandbIntegrationOutType$,
        WandbIntegrationOut$inboundSchema,
        WandbIntegrationOut$Outbound,
        WandbIntegrationOut$outboundSchema,
        WandbIntegrationOut$,
        webSearchPremiumToolToJSON,
        webSearchPremiumToolFromJSON,
        WebSearchPremiumToolType,
        WebSearchPremiumTool,
        WebSearchPremiumToolType$inboundSchema,
        WebSearchPremiumToolType$outboundSchema,
        WebSearchPremiumToolType$,
        WebSearchPremiumTool$inboundSchema,
        WebSearchPremiumTool$Outbound,
        WebSearchPremiumTool$outboundSchema,
        WebSearchPremiumTool$,
        webSearchToolToJSON,
        webSearchToolFromJSON,
        WebSearchToolType,
        WebSearchTool,
        WebSearchToolType$inboundSchema,
        WebSearchToolType$outboundSchema,
        WebSearchToolType$,
        WebSearchTool$inboundSchema,
        WebSearchTool$Outbound,
        WebSearchTool$outboundSchema,
        WebSearchTool$
    }
}

/**
 * An error that is raised when a HTTP client is unable to make a request to
 * a server.
 */
declare class ConnectionError extends HTTPClientError {
    readonly name = "ConnectionError";
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Content$ {
    /** @deprecated use `Content$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Content, z.ZodTypeDef, unknown>;
    /** @deprecated use `Content$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Content$Outbound, z.ZodTypeDef, Content>;
    /** @deprecated use `Content$Outbound` instead. */
    type Outbound = Content$Outbound;
}

/** @internal */
declare const Content$inboundSchema: z.ZodType<Content, z.ZodTypeDef, unknown>;

/** @internal */
declare type Content$Outbound = string | Array<ContentChunk$Outbound>;

/** @internal */
declare const Content$outboundSchema: z.ZodType<Content$Outbound, z.ZodTypeDef, Content>;

declare type Content = string | Array<ContentChunk>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ContentChunk$ {
    /** @deprecated use `ContentChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ContentChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `ContentChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ContentChunk$Outbound, z.ZodTypeDef, ContentChunk>;
    /** @deprecated use `ContentChunk$Outbound` instead. */
    type Outbound = ContentChunk$Outbound;
}

/** @internal */
declare const ContentChunk$inboundSchema: z.ZodType<ContentChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type ContentChunk$Outbound = (ImageURLChunk$Outbound & {
    type: "image_url";
}) | (DocumentURLChunk$Outbound & {
    type: "document_url";
}) | (TextChunk$Outbound & {
    type: "text";
}) | (ReferenceChunk$Outbound & {
    type: "reference";
}) | (FileChunk$Outbound & {
    type: "file";
}) | (ThinkChunk$Outbound & {
    type: "thinking";
}) | (AudioChunk$Outbound & {
    type: "input_audio";
});

/** @internal */
declare const ContentChunk$outboundSchema: z.ZodType<ContentChunk$Outbound, z.ZodTypeDef, ContentChunk>;

declare type ContentChunk = (ImageURLChunk & {
    type: "image_url";
}) | (DocumentURLChunk & {
    type: "document_url";
}) | (TextChunk & {
    type: "text";
}) | (ReferenceChunk & {
    type: "reference";
}) | (FileChunk & {
    type: "file";
}) | (ThinkChunk & {
    type: "thinking";
}) | (AudioChunk & {
    type: "input_audio";
});

declare function contentChunkFromJSON(jsonString: string): Result<ContentChunk, SDKValidationError>;

declare function contentChunkToJSON(contentChunk: ContentChunk): string;

declare function contentFromJSON(jsonString: string): Result<Content, SDKValidationError>;

declare function contentToJSON(content: Content): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationAppendRequest$ {
    /** @deprecated use `ConversationAppendRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationAppendRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationAppendRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationAppendRequest$Outbound, z.ZodTypeDef, ConversationAppendRequest>;
    /** @deprecated use `ConversationAppendRequest$Outbound` instead. */
    type Outbound = ConversationAppendRequest$Outbound;
}

/** @internal */
declare const ConversationAppendRequest$inboundSchema: z.ZodType<ConversationAppendRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationAppendRequest$Outbound = {
    inputs: ConversationInputs$Outbound;
    stream: boolean;
    store: boolean;
    handoff_execution: string;
    completion_args?: CompletionArgs$Outbound | undefined;
};

/** @internal */
declare const ConversationAppendRequest$outboundSchema: z.ZodType<ConversationAppendRequest$Outbound, z.ZodTypeDef, ConversationAppendRequest>;

declare type ConversationAppendRequest = {
    inputs: ConversationInputs;
    stream?: boolean | undefined;
    /**
     * Whether to store the results into our servers or not.
     */
    store?: boolean | undefined;
    handoffExecution?: ConversationAppendRequestHandoffExecution | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
};

declare function conversationAppendRequestFromJSON(jsonString: string): Result<ConversationAppendRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationAppendRequestHandoffExecution$ {
    /** @deprecated use `ConversationAppendRequestHandoffExecution$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
    /** @deprecated use `ConversationAppendRequestHandoffExecution$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
}

/** @internal */
declare const ConversationAppendRequestHandoffExecution$inboundSchema: z.ZodNativeEnum<typeof ConversationAppendRequestHandoffExecution>;

/** @internal */
declare const ConversationAppendRequestHandoffExecution$outboundSchema: z.ZodNativeEnum<typeof ConversationAppendRequestHandoffExecution>;

declare const ConversationAppendRequestHandoffExecution: {
    readonly Client: "client";
    readonly Server: "server";
};

declare type ConversationAppendRequestHandoffExecution = ClosedEnum<typeof ConversationAppendRequestHandoffExecution>;

declare function conversationAppendRequestToJSON(conversationAppendRequest: ConversationAppendRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationAppendStreamRequest$ {
    /** @deprecated use `ConversationAppendStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationAppendStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationAppendStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationAppendStreamRequest$Outbound, z.ZodTypeDef, ConversationAppendStreamRequest>;
    /** @deprecated use `ConversationAppendStreamRequest$Outbound` instead. */
    type Outbound = ConversationAppendStreamRequest$Outbound;
}

/** @internal */
declare const ConversationAppendStreamRequest$inboundSchema: z.ZodType<ConversationAppendStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationAppendStreamRequest$Outbound = {
    inputs: ConversationInputs$Outbound;
    stream: boolean;
    store: boolean;
    handoff_execution: string;
    completion_args?: CompletionArgs$Outbound | undefined;
};

/** @internal */
declare const ConversationAppendStreamRequest$outboundSchema: z.ZodType<ConversationAppendStreamRequest$Outbound, z.ZodTypeDef, ConversationAppendStreamRequest>;

declare type ConversationAppendStreamRequest = {
    inputs: ConversationInputs;
    stream?: boolean | undefined;
    /**
     * Whether to store the results into our servers or not.
     */
    store?: boolean | undefined;
    handoffExecution?: ConversationAppendStreamRequestHandoffExecution | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
};

declare function conversationAppendStreamRequestFromJSON(jsonString: string): Result<ConversationAppendStreamRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationAppendStreamRequestHandoffExecution$ {
    /** @deprecated use `ConversationAppendStreamRequestHandoffExecution$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
    /** @deprecated use `ConversationAppendStreamRequestHandoffExecution$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
}

/** @internal */
declare const ConversationAppendStreamRequestHandoffExecution$inboundSchema: z.ZodNativeEnum<typeof ConversationAppendStreamRequestHandoffExecution>;

/** @internal */
declare const ConversationAppendStreamRequestHandoffExecution$outboundSchema: z.ZodNativeEnum<typeof ConversationAppendStreamRequestHandoffExecution>;

declare const ConversationAppendStreamRequestHandoffExecution: {
    readonly Client: "client";
    readonly Server: "server";
};

declare type ConversationAppendStreamRequestHandoffExecution = ClosedEnum<typeof ConversationAppendStreamRequestHandoffExecution>;

declare function conversationAppendStreamRequestToJSON(conversationAppendStreamRequest: ConversationAppendStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationEvents$ {
    /** @deprecated use `ConversationEvents$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationEvents, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationEvents$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationEvents$Outbound, z.ZodTypeDef, ConversationEvents>;
    /** @deprecated use `ConversationEvents$Outbound` instead. */
    type Outbound = ConversationEvents$Outbound;
}

/** @internal */
declare const ConversationEvents$inboundSchema: z.ZodType<ConversationEvents, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationEvents$Outbound = {
    event: string;
    data: (FunctionCallEvent$Outbound & {
        type: "function.call.delta";
    }) | (AgentHandoffDoneEvent$Outbound & {
        type: "agent.handoff.done";
    }) | (AgentHandoffStartedEvent$Outbound & {
        type: "agent.handoff.started";
    }) | (ToolExecutionDeltaEvent$Outbound & {
        type: "tool.execution.delta";
    }) | (ToolExecutionStartedEvent$Outbound & {
        type: "tool.execution.started";
    }) | (ResponseErrorEvent$Outbound & {
        type: "conversation.response.error";
    }) | (MessageOutputEvent$Outbound & {
        type: "message.output.delta";
    }) | (ToolExecutionDoneEvent$Outbound & {
        type: "tool.execution.done";
    }) | (ResponseDoneEvent$Outbound & {
        type: "conversation.response.done";
    }) | (ResponseStartedEvent$Outbound & {
        type: "conversation.response.started";
    });
};

/** @internal */
declare const ConversationEvents$outboundSchema: z.ZodType<ConversationEvents$Outbound, z.ZodTypeDef, ConversationEvents>;

declare type ConversationEvents = {
    /**
     * Server side events sent when streaming a conversation response.
     */
    event: SSETypes;
    data: (FunctionCallEvent & {
        type: "function.call.delta";
    }) | (AgentHandoffDoneEvent & {
        type: "agent.handoff.done";
    }) | (AgentHandoffStartedEvent & {
        type: "agent.handoff.started";
    }) | (ToolExecutionDeltaEvent & {
        type: "tool.execution.delta";
    }) | (ToolExecutionStartedEvent & {
        type: "tool.execution.started";
    }) | (ResponseErrorEvent & {
        type: "conversation.response.error";
    }) | (MessageOutputEvent & {
        type: "message.output.delta";
    }) | (ToolExecutionDoneEvent & {
        type: "tool.execution.done";
    }) | (ResponseDoneEvent & {
        type: "conversation.response.done";
    }) | (ResponseStartedEvent & {
        type: "conversation.response.started";
    });
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationEventsData$ {
    /** @deprecated use `ConversationEventsData$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationEventsData, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationEventsData$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationEventsData$Outbound, z.ZodTypeDef, ConversationEventsData>;
    /** @deprecated use `ConversationEventsData$Outbound` instead. */
    type Outbound = ConversationEventsData$Outbound;
}

/** @internal */
declare const ConversationEventsData$inboundSchema: z.ZodType<ConversationEventsData, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationEventsData$Outbound = (FunctionCallEvent$Outbound & {
    type: "function.call.delta";
}) | (AgentHandoffDoneEvent$Outbound & {
    type: "agent.handoff.done";
}) | (AgentHandoffStartedEvent$Outbound & {
    type: "agent.handoff.started";
}) | (ToolExecutionDeltaEvent$Outbound & {
    type: "tool.execution.delta";
}) | (ToolExecutionStartedEvent$Outbound & {
    type: "tool.execution.started";
}) | (ResponseErrorEvent$Outbound & {
    type: "conversation.response.error";
}) | (MessageOutputEvent$Outbound & {
    type: "message.output.delta";
}) | (ToolExecutionDoneEvent$Outbound & {
    type: "tool.execution.done";
}) | (ResponseDoneEvent$Outbound & {
    type: "conversation.response.done";
}) | (ResponseStartedEvent$Outbound & {
    type: "conversation.response.started";
});

/** @internal */
declare const ConversationEventsData$outboundSchema: z.ZodType<ConversationEventsData$Outbound, z.ZodTypeDef, ConversationEventsData>;

declare type ConversationEventsData = (FunctionCallEvent & {
    type: "function.call.delta";
}) | (AgentHandoffDoneEvent & {
    type: "agent.handoff.done";
}) | (AgentHandoffStartedEvent & {
    type: "agent.handoff.started";
}) | (ToolExecutionDeltaEvent & {
    type: "tool.execution.delta";
}) | (ToolExecutionStartedEvent & {
    type: "tool.execution.started";
}) | (ResponseErrorEvent & {
    type: "conversation.response.error";
}) | (MessageOutputEvent & {
    type: "message.output.delta";
}) | (ToolExecutionDoneEvent & {
    type: "tool.execution.done";
}) | (ResponseDoneEvent & {
    type: "conversation.response.done";
}) | (ResponseStartedEvent & {
    type: "conversation.response.started";
});

declare function conversationEventsDataFromJSON(jsonString: string): Result<ConversationEventsData, SDKValidationError>;

declare function conversationEventsDataToJSON(conversationEventsData: ConversationEventsData): string;

declare function conversationEventsFromJSON(jsonString: string): Result<ConversationEvents, SDKValidationError>;

declare function conversationEventsToJSON(conversationEvents: ConversationEvents): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationHistory$ {
    /** @deprecated use `ConversationHistory$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationHistory, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationHistory$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationHistory$Outbound, z.ZodTypeDef, ConversationHistory>;
    /** @deprecated use `ConversationHistory$Outbound` instead. */
    type Outbound = ConversationHistory$Outbound;
}

/** @internal */
declare const ConversationHistory$inboundSchema: z.ZodType<ConversationHistory, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationHistory$Outbound = {
    object: string;
    conversation_id: string;
    entries: Array<AgentHandoffEntry$Outbound | FunctionCallEntry$Outbound | MessageInputEntry$Outbound | FunctionResultEntry$Outbound | ToolExecutionEntry$Outbound | MessageOutputEntry$Outbound>;
};

/** @internal */
declare const ConversationHistory$outboundSchema: z.ZodType<ConversationHistory$Outbound, z.ZodTypeDef, ConversationHistory>;

/**
 * Retrieve all entries in a conversation.
 */
declare type ConversationHistory = {
    object?: ConversationHistoryObject | undefined;
    conversationId: string;
    entries: Array<AgentHandoffEntry | FunctionCallEntry | MessageInputEntry | FunctionResultEntry | ToolExecutionEntry | MessageOutputEntry>;
};

declare function conversationHistoryFromJSON(jsonString: string): Result<ConversationHistory, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationHistoryObject$ {
    /** @deprecated use `ConversationHistoryObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationHistory: "conversation.history";
    }>;
    /** @deprecated use `ConversationHistoryObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationHistory: "conversation.history";
    }>;
}

/** @internal */
declare const ConversationHistoryObject$inboundSchema: z.ZodNativeEnum<typeof ConversationHistoryObject>;

/** @internal */
declare const ConversationHistoryObject$outboundSchema: z.ZodNativeEnum<typeof ConversationHistoryObject>;

declare const ConversationHistoryObject: {
    readonly ConversationHistory: "conversation.history";
};

declare type ConversationHistoryObject = ClosedEnum<typeof ConversationHistoryObject>;

declare function conversationHistoryToJSON(conversationHistory: ConversationHistory): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationInputs$ {
    /** @deprecated use `ConversationInputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationInputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationInputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationInputs$Outbound, z.ZodTypeDef, ConversationInputs>;
    /** @deprecated use `ConversationInputs$Outbound` instead. */
    type Outbound = ConversationInputs$Outbound;
}

/** @internal */
declare const ConversationInputs$inboundSchema: z.ZodType<ConversationInputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationInputs$Outbound = string | Array<InputEntries$Outbound>;

/** @internal */
declare const ConversationInputs$outboundSchema: z.ZodType<ConversationInputs$Outbound, z.ZodTypeDef, ConversationInputs>;

declare type ConversationInputs = string | Array<InputEntries>;

declare function conversationInputsFromJSON(jsonString: string): Result<ConversationInputs, SDKValidationError>;

declare function conversationInputsToJSON(conversationInputs: ConversationInputs): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationMessages$ {
    /** @deprecated use `ConversationMessages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationMessages, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationMessages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationMessages$Outbound, z.ZodTypeDef, ConversationMessages>;
    /** @deprecated use `ConversationMessages$Outbound` instead. */
    type Outbound = ConversationMessages$Outbound;
}

/** @internal */
declare const ConversationMessages$inboundSchema: z.ZodType<ConversationMessages, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationMessages$Outbound = {
    object: string;
    conversation_id: string;
    messages: Array<MessageEntries$Outbound>;
};

/** @internal */
declare const ConversationMessages$outboundSchema: z.ZodType<ConversationMessages$Outbound, z.ZodTypeDef, ConversationMessages>;

/**
 * Similar to the conversation history but only keep the messages
 */
declare type ConversationMessages = {
    object?: ConversationMessagesObject | undefined;
    conversationId: string;
    messages: Array<MessageEntries>;
};

declare function conversationMessagesFromJSON(jsonString: string): Result<ConversationMessages, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationMessagesObject$ {
    /** @deprecated use `ConversationMessagesObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationMessages: "conversation.messages";
    }>;
    /** @deprecated use `ConversationMessagesObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationMessages: "conversation.messages";
    }>;
}

/** @internal */
declare const ConversationMessagesObject$inboundSchema: z.ZodNativeEnum<typeof ConversationMessagesObject>;

/** @internal */
declare const ConversationMessagesObject$outboundSchema: z.ZodNativeEnum<typeof ConversationMessagesObject>;

declare const ConversationMessagesObject: {
    readonly ConversationMessages: "conversation.messages";
};

declare type ConversationMessagesObject = ClosedEnum<typeof ConversationMessagesObject>;

declare function conversationMessagesToJSON(conversationMessages: ConversationMessages): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationRequest$ {
    /** @deprecated use `ConversationRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationRequest$Outbound, z.ZodTypeDef, ConversationRequest>;
    /** @deprecated use `ConversationRequest$Outbound` instead. */
    type Outbound = ConversationRequest$Outbound;
}

/** @internal */
declare const ConversationRequest$inboundSchema: z.ZodType<ConversationRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationRequest$Outbound = {
    inputs: ConversationInputs$Outbound;
    stream: boolean;
    store?: boolean | null | undefined;
    handoff_execution?: string | null | undefined;
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool$Outbound & {
        type: "document_library";
    }) | (FunctionTool$Outbound & {
        type: "function";
    }) | (CodeInterpreterTool$Outbound & {
        type: "code_interpreter";
    }) | (ImageGenerationTool$Outbound & {
        type: "image_generation";
    }) | (WebSearchTool$Outbound & {
        type: "web_search";
    }) | (WebSearchPremiumTool$Outbound & {
        type: "web_search_premium";
    })> | null | undefined;
    completion_args?: CompletionArgs$Outbound | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    agent_id?: string | null | undefined;
    model?: string | null | undefined;
};

/** @internal */
declare const ConversationRequest$outboundSchema: z.ZodType<ConversationRequest$Outbound, z.ZodTypeDef, ConversationRequest>;

declare type ConversationRequest = {
    inputs: ConversationInputs;
    stream?: boolean | undefined;
    store?: boolean | null | undefined;
    handoffExecution?: HandoffExecution | null | undefined;
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool & {
        type: "document_library";
    }) | (FunctionTool & {
        type: "function";
    }) | (CodeInterpreterTool & {
        type: "code_interpreter";
    }) | (ImageGenerationTool & {
        type: "image_generation";
    }) | (WebSearchTool & {
        type: "web_search";
    }) | (WebSearchPremiumTool & {
        type: "web_search_premium";
    })> | null | undefined;
    completionArgs?: CompletionArgs | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    agentId?: string | null | undefined;
    model?: string | null | undefined;
};

declare function conversationRequestFromJSON(jsonString: string): Result<ConversationRequest, SDKValidationError>;

declare function conversationRequestToJSON(conversationRequest: ConversationRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationResponse$ {
    /** @deprecated use `ConversationResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationResponse$Outbound, z.ZodTypeDef, ConversationResponse>;
    /** @deprecated use `ConversationResponse$Outbound` instead. */
    type Outbound = ConversationResponse$Outbound;
}

/** @internal */
declare const ConversationResponse$inboundSchema: z.ZodType<ConversationResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationResponse$Outbound = {
    object: string;
    conversation_id: string;
    outputs: Array<AgentHandoffEntry$Outbound | FunctionCallEntry$Outbound | ToolExecutionEntry$Outbound | MessageOutputEntry$Outbound>;
    usage: ConversationUsageInfo$Outbound;
};

/** @internal */
declare const ConversationResponse$outboundSchema: z.ZodType<ConversationResponse$Outbound, z.ZodTypeDef, ConversationResponse>;

/**
 * The response after appending new entries to the conversation.
 */
declare type ConversationResponse = {
    object?: ConversationResponseObject | undefined;
    conversationId: string;
    outputs: Array<AgentHandoffEntry | FunctionCallEntry | ToolExecutionEntry | MessageOutputEntry>;
    usage: ConversationUsageInfo;
};

declare function conversationResponseFromJSON(jsonString: string): Result<ConversationResponse, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationResponseObject$ {
    /** @deprecated use `ConversationResponseObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponse: "conversation.response";
    }>;
    /** @deprecated use `ConversationResponseObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponse: "conversation.response";
    }>;
}

/** @internal */
declare const ConversationResponseObject$inboundSchema: z.ZodNativeEnum<typeof ConversationResponseObject>;

/** @internal */
declare const ConversationResponseObject$outboundSchema: z.ZodNativeEnum<typeof ConversationResponseObject>;

declare const ConversationResponseObject: {
    readonly ConversationResponse: "conversation.response";
};

declare type ConversationResponseObject = ClosedEnum<typeof ConversationResponseObject>;

declare function conversationResponseToJSON(conversationResponse: ConversationResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationRestartRequest$ {
    /** @deprecated use `ConversationRestartRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationRestartRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationRestartRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationRestartRequest$Outbound, z.ZodTypeDef, ConversationRestartRequest>;
    /** @deprecated use `ConversationRestartRequest$Outbound` instead. */
    type Outbound = ConversationRestartRequest$Outbound;
}

/** @internal */
declare const ConversationRestartRequest$inboundSchema: z.ZodType<ConversationRestartRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationRestartRequest$Outbound = {
    inputs: ConversationInputs$Outbound;
    stream: boolean;
    store: boolean;
    handoff_execution: string;
    completion_args?: CompletionArgs$Outbound | undefined;
    from_entry_id: string;
};

/** @internal */
declare const ConversationRestartRequest$outboundSchema: z.ZodType<ConversationRestartRequest$Outbound, z.ZodTypeDef, ConversationRestartRequest>;

/**
 * Request to restart a new conversation from a given entry in the conversation.
 */
declare type ConversationRestartRequest = {
    inputs: ConversationInputs;
    stream?: boolean | undefined;
    /**
     * Whether to store the results into our servers or not.
     */
    store?: boolean | undefined;
    handoffExecution?: ConversationRestartRequestHandoffExecution | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
    fromEntryId: string;
};

declare function conversationRestartRequestFromJSON(jsonString: string): Result<ConversationRestartRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationRestartRequestHandoffExecution$ {
    /** @deprecated use `ConversationRestartRequestHandoffExecution$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
    /** @deprecated use `ConversationRestartRequestHandoffExecution$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
}

/** @internal */
declare const ConversationRestartRequestHandoffExecution$inboundSchema: z.ZodNativeEnum<typeof ConversationRestartRequestHandoffExecution>;

/** @internal */
declare const ConversationRestartRequestHandoffExecution$outboundSchema: z.ZodNativeEnum<typeof ConversationRestartRequestHandoffExecution>;

declare const ConversationRestartRequestHandoffExecution: {
    readonly Client: "client";
    readonly Server: "server";
};

declare type ConversationRestartRequestHandoffExecution = ClosedEnum<typeof ConversationRestartRequestHandoffExecution>;

declare function conversationRestartRequestToJSON(conversationRestartRequest: ConversationRestartRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationRestartStreamRequest$ {
    /** @deprecated use `ConversationRestartStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationRestartStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationRestartStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationRestartStreamRequest$Outbound, z.ZodTypeDef, ConversationRestartStreamRequest>;
    /** @deprecated use `ConversationRestartStreamRequest$Outbound` instead. */
    type Outbound = ConversationRestartStreamRequest$Outbound;
}

/** @internal */
declare const ConversationRestartStreamRequest$inboundSchema: z.ZodType<ConversationRestartStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationRestartStreamRequest$Outbound = {
    inputs: ConversationInputs$Outbound;
    stream: boolean;
    store: boolean;
    handoff_execution: string;
    completion_args?: CompletionArgs$Outbound | undefined;
    from_entry_id: string;
};

/** @internal */
declare const ConversationRestartStreamRequest$outboundSchema: z.ZodType<ConversationRestartStreamRequest$Outbound, z.ZodTypeDef, ConversationRestartStreamRequest>;

/**
 * Request to restart a new conversation from a given entry in the conversation.
 */
declare type ConversationRestartStreamRequest = {
    inputs: ConversationInputs;
    stream?: boolean | undefined;
    /**
     * Whether to store the results into our servers or not.
     */
    store?: boolean | undefined;
    handoffExecution?: ConversationRestartStreamRequestHandoffExecution | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
    fromEntryId: string;
};

declare function conversationRestartStreamRequestFromJSON(jsonString: string): Result<ConversationRestartStreamRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationRestartStreamRequestHandoffExecution$ {
    /** @deprecated use `ConversationRestartStreamRequestHandoffExecution$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
    /** @deprecated use `ConversationRestartStreamRequestHandoffExecution$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
}

/** @internal */
declare const ConversationRestartStreamRequestHandoffExecution$inboundSchema: z.ZodNativeEnum<typeof ConversationRestartStreamRequestHandoffExecution>;

/** @internal */
declare const ConversationRestartStreamRequestHandoffExecution$outboundSchema: z.ZodNativeEnum<typeof ConversationRestartStreamRequestHandoffExecution>;

declare const ConversationRestartStreamRequestHandoffExecution: {
    readonly Client: "client";
    readonly Server: "server";
};

declare type ConversationRestartStreamRequestHandoffExecution = ClosedEnum<typeof ConversationRestartStreamRequestHandoffExecution>;

declare function conversationRestartStreamRequestToJSON(conversationRestartStreamRequest: ConversationRestartStreamRequest): string;

declare class Conversations extends ClientSDK {
    /**
     * Create a conversation and append entries to it.
     *
     * @remarks
     * Create a new conversation, using a base model or an agent and append entries. Completion and tool executions are run and the response is appended to the conversation.Use the returned conversation_id to continue the conversation.
     */
    start(request: components.ConversationRequest, options?: RequestOptions): Promise<components.ConversationResponse>;
    /**
     * List all created conversations.
     *
     * @remarks
     * Retrieve a list of conversation entities sorted by creation time.
     */
    list(request?: operations.AgentsApiV1ConversationsListRequest | undefined, options?: RequestOptions): Promise<Array<operations.ResponseBody>>;
    /**
     * Retrieve a conversation information.
     *
     * @remarks
     * Given a conversation_id retrieve a conversation entity with its attributes.
     */
    get(request: operations.AgentsApiV1ConversationsGetRequest, options?: RequestOptions): Promise<operations.AgentsApiV1ConversationsGetResponseV1ConversationsGet>;
    /**
     * Append new entries to an existing conversation.
     *
     * @remarks
     * Run completion on the history of the conversation and the user entries. Return the new created entries.
     */
    append(request: operations.AgentsApiV1ConversationsAppendRequest, options?: RequestOptions): Promise<components.ConversationResponse>;
    /**
     * Retrieve all entries in a conversation.
     *
     * @remarks
     * Given a conversation_id retrieve all the entries belonging to that conversation. The entries are sorted in the order they were appended, those can be messages, connectors or function_call.
     */
    getHistory(request: operations.AgentsApiV1ConversationsHistoryRequest, options?: RequestOptions): Promise<components.ConversationHistory>;
    /**
     * Retrieve all messages in a conversation.
     *
     * @remarks
     * Given a conversation_id retrieve all the messages belonging to that conversation. This is similar to retrieving all entries except we filter the messages only.
     */
    getMessages(request: operations.AgentsApiV1ConversationsMessagesRequest, options?: RequestOptions): Promise<components.ConversationMessages>;
    /**
     * Restart a conversation starting from a given entry.
     *
     * @remarks
     * Given a conversation_id and an id, recreate a conversation from this point and run completion. A new conversation is returned with the new entries returned.
     */
    restart(request: operations.AgentsApiV1ConversationsRestartRequest, options?: RequestOptions): Promise<components.ConversationResponse>;
    /**
     * Create a conversation and append entries to it.
     *
     * @remarks
     * Create a new conversation, using a base model or an agent and append entries. Completion and tool executions are run and the response is appended to the conversation.Use the returned conversation_id to continue the conversation.
     */
    startStream(request: components.ConversationStreamRequest, options?: RequestOptions): Promise<EventStream<components.ConversationEvents>>;
    /**
     * Append new entries to an existing conversation.
     *
     * @remarks
     * Run completion on the history of the conversation and the user entries. Return the new created entries.
     */
    appendStream(request: operations.AgentsApiV1ConversationsAppendStreamRequest, options?: RequestOptions): Promise<EventStream<components.ConversationEvents>>;
    /**
     * Restart a conversation starting from a given entry.
     *
     * @remarks
     * Given a conversation_id and an id, recreate a conversation from this point and run completion. A new conversation is returned with the new entries returned.
     */
    restartStream(request: operations.AgentsApiV1ConversationsRestartStreamRequest, options?: RequestOptions): Promise<EventStream<components.ConversationEvents>>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationStreamRequest$ {
    /** @deprecated use `ConversationStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationStreamRequest$Outbound, z.ZodTypeDef, ConversationStreamRequest>;
    /** @deprecated use `ConversationStreamRequest$Outbound` instead. */
    type Outbound = ConversationStreamRequest$Outbound;
}

/** @internal */
declare const ConversationStreamRequest$inboundSchema: z.ZodType<ConversationStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationStreamRequest$Outbound = {
    inputs: ConversationInputs$Outbound;
    stream: boolean;
    store?: boolean | null | undefined;
    handoff_execution?: string | null | undefined;
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool$Outbound & {
        type: "document_library";
    }) | (FunctionTool$Outbound & {
        type: "function";
    }) | (CodeInterpreterTool$Outbound & {
        type: "code_interpreter";
    }) | (ImageGenerationTool$Outbound & {
        type: "image_generation";
    }) | (WebSearchTool$Outbound & {
        type: "web_search";
    }) | (WebSearchPremiumTool$Outbound & {
        type: "web_search_premium";
    })> | null | undefined;
    completion_args?: CompletionArgs$Outbound | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    agent_id?: string | null | undefined;
    model?: string | null | undefined;
};

/** @internal */
declare const ConversationStreamRequest$outboundSchema: z.ZodType<ConversationStreamRequest$Outbound, z.ZodTypeDef, ConversationStreamRequest>;

declare type ConversationStreamRequest = {
    inputs: ConversationInputs;
    stream?: boolean | undefined;
    store?: boolean | null | undefined;
    handoffExecution?: ConversationStreamRequestHandoffExecution | null | undefined;
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool & {
        type: "document_library";
    }) | (FunctionTool & {
        type: "function";
    }) | (CodeInterpreterTool & {
        type: "code_interpreter";
    }) | (ImageGenerationTool & {
        type: "image_generation";
    }) | (WebSearchTool & {
        type: "web_search";
    }) | (WebSearchPremiumTool & {
        type: "web_search_premium";
    })> | null | undefined;
    completionArgs?: CompletionArgs | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    agentId?: string | null | undefined;
    model?: string | null | undefined;
};

declare function conversationStreamRequestFromJSON(jsonString: string): Result<ConversationStreamRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationStreamRequestHandoffExecution$ {
    /** @deprecated use `ConversationStreamRequestHandoffExecution$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
    /** @deprecated use `ConversationStreamRequestHandoffExecution$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
}

/** @internal */
declare const ConversationStreamRequestHandoffExecution$inboundSchema: z.ZodNativeEnum<typeof ConversationStreamRequestHandoffExecution>;

/** @internal */
declare const ConversationStreamRequestHandoffExecution$outboundSchema: z.ZodNativeEnum<typeof ConversationStreamRequestHandoffExecution>;

declare const ConversationStreamRequestHandoffExecution: {
    readonly Client: "client";
    readonly Server: "server";
};

declare type ConversationStreamRequestHandoffExecution = ClosedEnum<typeof ConversationStreamRequestHandoffExecution>;

declare function conversationStreamRequestToJSON(conversationStreamRequest: ConversationStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationStreamRequestTools$ {
    /** @deprecated use `ConversationStreamRequestTools$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationStreamRequestTools, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationStreamRequestTools$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationStreamRequestTools$Outbound, z.ZodTypeDef, ConversationStreamRequestTools>;
    /** @deprecated use `ConversationStreamRequestTools$Outbound` instead. */
    type Outbound = ConversationStreamRequestTools$Outbound;
}

/** @internal */
declare const ConversationStreamRequestTools$inboundSchema: z.ZodType<ConversationStreamRequestTools, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationStreamRequestTools$Outbound = (DocumentLibraryTool$Outbound & {
    type: "document_library";
}) | (FunctionTool$Outbound & {
    type: "function";
}) | (CodeInterpreterTool$Outbound & {
    type: "code_interpreter";
}) | (ImageGenerationTool$Outbound & {
    type: "image_generation";
}) | (WebSearchTool$Outbound & {
    type: "web_search";
}) | (WebSearchPremiumTool$Outbound & {
    type: "web_search_premium";
});

/** @internal */
declare const ConversationStreamRequestTools$outboundSchema: z.ZodType<ConversationStreamRequestTools$Outbound, z.ZodTypeDef, ConversationStreamRequestTools>;

declare type ConversationStreamRequestTools = (DocumentLibraryTool & {
    type: "document_library";
}) | (FunctionTool & {
    type: "function";
}) | (CodeInterpreterTool & {
    type: "code_interpreter";
}) | (ImageGenerationTool & {
    type: "image_generation";
}) | (WebSearchTool & {
    type: "web_search";
}) | (WebSearchPremiumTool & {
    type: "web_search_premium";
});

declare function conversationStreamRequestToolsFromJSON(jsonString: string): Result<ConversationStreamRequestTools, SDKValidationError>;

declare function conversationStreamRequestToolsToJSON(conversationStreamRequestTools: ConversationStreamRequestTools): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ConversationUsageInfo$ {
    /** @deprecated use `ConversationUsageInfo$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ConversationUsageInfo, z.ZodTypeDef, unknown>;
    /** @deprecated use `ConversationUsageInfo$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ConversationUsageInfo$Outbound, z.ZodTypeDef, ConversationUsageInfo>;
    /** @deprecated use `ConversationUsageInfo$Outbound` instead. */
    type Outbound = ConversationUsageInfo$Outbound;
}

/** @internal */
declare const ConversationUsageInfo$inboundSchema: z.ZodType<ConversationUsageInfo, z.ZodTypeDef, unknown>;

/** @internal */
declare type ConversationUsageInfo$Outbound = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    connector_tokens?: number | null | undefined;
    connectors?: {
        [k: string]: number;
    } | null | undefined;
};

/** @internal */
declare const ConversationUsageInfo$outboundSchema: z.ZodType<ConversationUsageInfo$Outbound, z.ZodTypeDef, ConversationUsageInfo>;

declare type ConversationUsageInfo = {
    promptTokens?: number | undefined;
    completionTokens?: number | undefined;
    totalTokens?: number | undefined;
    connectorTokens?: number | null | undefined;
    connectors?: {
        [k: string]: number;
    } | null | undefined;
};

declare function conversationUsageInfoFromJSON(jsonString: string): Result<ConversationUsageInfo, SDKValidationError>;

declare function conversationUsageInfoToJSON(conversationUsageInfo: ConversationUsageInfo): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Data$ {
    /** @deprecated use `Data$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Data, z.ZodTypeDef, unknown>;
    /** @deprecated use `Data$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Data$Outbound, z.ZodTypeDef, Data>;
    /** @deprecated use `Data$Outbound` instead. */
    type Outbound = Data$Outbound;
}

/** @internal */
declare const Data$inboundSchema: z.ZodType<Data, z.ZodTypeDef, unknown>;

/** @internal */
declare type Data$Outbound = (FTModelCard$Outbound & {
    type: "fine-tuned";
}) | (BaseModelCard$Outbound & {
    type: "base";
});

/** @internal */
declare const Data$outboundSchema: z.ZodType<Data$Outbound, z.ZodTypeDef, Data>;

declare type Data = (FTModelCard & {
    type: "fine-tuned";
}) | (BaseModelCard & {
    type: "base";
});

declare function dataFromJSON(jsonString: string): Result<Data, SDKValidationError>;

declare function dataToJSON(data: Data): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DeleteFileOut$ {
    /** @deprecated use `DeleteFileOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DeleteFileOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `DeleteFileOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DeleteFileOut$Outbound, z.ZodTypeDef, DeleteFileOut>;
    /** @deprecated use `DeleteFileOut$Outbound` instead. */
    type Outbound = DeleteFileOut$Outbound;
}

/** @internal */
declare const DeleteFileOut$inboundSchema: z.ZodType<DeleteFileOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type DeleteFileOut$Outbound = {
    id: string;
    object: string;
    deleted: boolean;
};

/** @internal */
declare const DeleteFileOut$outboundSchema: z.ZodType<DeleteFileOut$Outbound, z.ZodTypeDef, DeleteFileOut>;

declare type DeleteFileOut = {
    /**
     * The ID of the deleted file.
     */
    id: string;
    /**
     * The object type that was deleted
     */
    object: string;
    /**
     * The deletion status.
     */
    deleted: boolean;
};

declare function deleteFileOutFromJSON(jsonString: string): Result<DeleteFileOut, SDKValidationError>;

declare function deleteFileOutToJSON(deleteFileOut: DeleteFileOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DeleteModelOut$ {
    /** @deprecated use `DeleteModelOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DeleteModelOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `DeleteModelOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DeleteModelOut$Outbound, z.ZodTypeDef, DeleteModelOut>;
    /** @deprecated use `DeleteModelOut$Outbound` instead. */
    type Outbound = DeleteModelOut$Outbound;
}

/** @internal */
declare const DeleteModelOut$inboundSchema: z.ZodType<DeleteModelOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type DeleteModelOut$Outbound = {
    id: string;
    object: string;
    deleted: boolean;
};

/** @internal */
declare const DeleteModelOut$outboundSchema: z.ZodType<DeleteModelOut$Outbound, z.ZodTypeDef, DeleteModelOut>;

declare type DeleteModelOut = {
    /**
     * The ID of the deleted model.
     */
    id: string;
    /**
     * The object type that was deleted
     */
    object?: string | undefined;
    /**
     * The deletion status
     */
    deleted?: boolean | undefined;
};

declare function deleteModelOutFromJSON(jsonString: string): Result<DeleteModelOut, SDKValidationError>;

declare function deleteModelOutToJSON(deleteModelOut: DeleteModelOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DeleteModelV1ModelsModelIdDeleteRequest$ {
    /** @deprecated use `DeleteModelV1ModelsModelIdDeleteRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DeleteModelV1ModelsModelIdDeleteRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `DeleteModelV1ModelsModelIdDeleteRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DeleteModelV1ModelsModelIdDeleteRequest$Outbound, z.ZodTypeDef, DeleteModelV1ModelsModelIdDeleteRequest>;
    /** @deprecated use `DeleteModelV1ModelsModelIdDeleteRequest$Outbound` instead. */
    type Outbound = DeleteModelV1ModelsModelIdDeleteRequest$Outbound;
}

/** @internal */
declare const DeleteModelV1ModelsModelIdDeleteRequest$inboundSchema: z.ZodType<DeleteModelV1ModelsModelIdDeleteRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type DeleteModelV1ModelsModelIdDeleteRequest$Outbound = {
    model_id: string;
};

/** @internal */
declare const DeleteModelV1ModelsModelIdDeleteRequest$outboundSchema: z.ZodType<DeleteModelV1ModelsModelIdDeleteRequest$Outbound, z.ZodTypeDef, DeleteModelV1ModelsModelIdDeleteRequest>;

declare type DeleteModelV1ModelsModelIdDeleteRequest = {
    /**
     * The ID of the model to delete.
     */
    modelId: string;
};

declare function deleteModelV1ModelsModelIdDeleteRequestFromJSON(jsonString: string): Result<DeleteModelV1ModelsModelIdDeleteRequest, SDKValidationError>;

declare function deleteModelV1ModelsModelIdDeleteRequestToJSON(deleteModelV1ModelsModelIdDeleteRequest: DeleteModelV1ModelsModelIdDeleteRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DeltaMessage$ {
    /** @deprecated use `DeltaMessage$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DeltaMessage, z.ZodTypeDef, unknown>;
    /** @deprecated use `DeltaMessage$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DeltaMessage$Outbound, z.ZodTypeDef, DeltaMessage>;
    /** @deprecated use `DeltaMessage$Outbound` instead. */
    type Outbound = DeltaMessage$Outbound;
}

/** @internal */
declare const DeltaMessage$inboundSchema: z.ZodType<DeltaMessage, z.ZodTypeDef, unknown>;

/** @internal */
declare type DeltaMessage$Outbound = {
    role?: string | null | undefined;
    content?: string | Array<ContentChunk$Outbound> | null | undefined;
    tool_calls?: Array<ToolCall$Outbound> | null | undefined;
};

/** @internal */
declare const DeltaMessage$outboundSchema: z.ZodType<DeltaMessage$Outbound, z.ZodTypeDef, DeltaMessage>;

declare type DeltaMessage = {
    role?: string | null | undefined;
    content?: string | Array<ContentChunk> | null | undefined;
    toolCalls?: Array<ToolCall> | null | undefined;
};

declare function deltaMessageFromJSON(jsonString: string): Result<DeltaMessage, SDKValidationError>;

declare function deltaMessageToJSON(deltaMessage: DeltaMessage): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Document$ {
    /** @deprecated use `Document$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Document_2, z.ZodTypeDef, unknown>;
    /** @deprecated use `Document$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Document$Outbound, z.ZodTypeDef, Document_2>;
    /** @deprecated use `Document$Outbound` instead. */
    type Outbound = Document$Outbound;
}

/** @internal */
declare const Document$inboundSchema: z.ZodType<Document_2, z.ZodTypeDef, unknown>;

/** @internal */
declare type Document$Outbound = FileChunk$Outbound | DocumentURLChunk$Outbound | ImageURLChunk$Outbound;

/** @internal */
declare const Document$outboundSchema: z.ZodType<Document$Outbound, z.ZodTypeDef, Document_2>;

/**
 * Document to run OCR on
 */
declare type Document_2 = FileChunk | DocumentURLChunk | ImageURLChunk;

declare function documentFromJSON(jsonString: string): Result<Document_2, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentLibraryTool$ {
    /** @deprecated use `DocumentLibraryTool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DocumentLibraryTool, z.ZodTypeDef, unknown>;
    /** @deprecated use `DocumentLibraryTool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DocumentLibraryTool$Outbound, z.ZodTypeDef, DocumentLibraryTool>;
    /** @deprecated use `DocumentLibraryTool$Outbound` instead. */
    type Outbound = DocumentLibraryTool$Outbound;
}

/** @internal */
declare const DocumentLibraryTool$inboundSchema: z.ZodType<DocumentLibraryTool, z.ZodTypeDef, unknown>;

/** @internal */
declare type DocumentLibraryTool$Outbound = {
    type: string;
    library_ids: Array<string>;
};

/** @internal */
declare const DocumentLibraryTool$outboundSchema: z.ZodType<DocumentLibraryTool$Outbound, z.ZodTypeDef, DocumentLibraryTool>;

declare type DocumentLibraryTool = {
    type?: DocumentLibraryToolType | undefined;
    /**
     * Ids of the library in which to search.
     */
    libraryIds: Array<string>;
};

declare function documentLibraryToolFromJSON(jsonString: string): Result<DocumentLibraryTool, SDKValidationError>;

declare function documentLibraryToolToJSON(documentLibraryTool: DocumentLibraryTool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentLibraryToolType$ {
    /** @deprecated use `DocumentLibraryToolType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly DocumentLibrary: "document_library";
    }>;
    /** @deprecated use `DocumentLibraryToolType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly DocumentLibrary: "document_library";
    }>;
}

/** @internal */
declare const DocumentLibraryToolType$inboundSchema: z.ZodNativeEnum<typeof DocumentLibraryToolType>;

/** @internal */
declare const DocumentLibraryToolType$outboundSchema: z.ZodNativeEnum<typeof DocumentLibraryToolType>;

declare const DocumentLibraryToolType: {
    readonly DocumentLibrary: "document_library";
};

declare type DocumentLibraryToolType = ClosedEnum<typeof DocumentLibraryToolType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentOut$ {
    /** @deprecated use `DocumentOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DocumentOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `DocumentOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DocumentOut$Outbound, z.ZodTypeDef, DocumentOut>;
    /** @deprecated use `DocumentOut$Outbound` instead. */
    type Outbound = DocumentOut$Outbound;
}

/** @internal */
declare const DocumentOut$inboundSchema: z.ZodType<DocumentOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type DocumentOut$Outbound = {
    id: string;
    library_id: string;
    hash: string;
    mime_type: string;
    extension: string;
    size: number;
    name: string;
    summary?: string | null | undefined;
    created_at: string;
    last_processed_at?: string | null | undefined;
    number_of_pages?: number | null | undefined;
    processing_status: string;
    uploaded_by_id: string;
    uploaded_by_type: string;
    tokens_processing_main_content?: number | null | undefined;
    tokens_processing_summary?: number | null | undefined;
    tokens_processing_total: number;
};

/** @internal */
declare const DocumentOut$outboundSchema: z.ZodType<DocumentOut$Outbound, z.ZodTypeDef, DocumentOut>;

declare type DocumentOut = {
    id: string;
    libraryId: string;
    hash: string;
    mimeType: string;
    extension: string;
    size: number;
    name: string;
    summary?: string | null | undefined;
    createdAt: Date;
    lastProcessedAt?: Date | null | undefined;
    numberOfPages?: number | null | undefined;
    processingStatus: string;
    uploadedById: string;
    uploadedByType: string;
    tokensProcessingMainContent?: number | null | undefined;
    tokensProcessingSummary?: number | null | undefined;
    tokensProcessingTotal: number;
};

declare function documentOutFromJSON(jsonString: string): Result<DocumentOut, SDKValidationError>;

declare function documentOutToJSON(documentOut: DocumentOut): string;

declare class Documents extends ClientSDK {
    /**
     * List document in a given library.
     *
     * @remarks
     * Given a library, lists the document that have been uploaded to that library.
     */
    list(request: operations.LibrariesDocumentsListV1Request, options?: RequestOptions): Promise<components.ListDocumentOut>;
    /**
     * Upload a new document.
     *
     * @remarks
     * Given a library, upload a new document to that library. It is queued for processing, it status will change it has been processed. The processing has to be completed in order be discoverable for the library search
     */
    upload(request: operations.LibrariesDocumentsUploadV1Request, options?: RequestOptions): Promise<components.DocumentOut>;
    /**
     * Retrieve the metadata of a specific document.
     *
     * @remarks
     * Given a library and a document in this library, you can retrieve the metadata of that document.
     */
    get(request: operations.LibrariesDocumentsGetV1Request, options?: RequestOptions): Promise<components.DocumentOut>;
    /**
     * Update the metadata of a specific document.
     *
     * @remarks
     * Given a library and a document in that library, update the name of that document.
     */
    update(request: operations.LibrariesDocumentsUpdateV1Request, options?: RequestOptions): Promise<components.DocumentOut>;
    /**
     * Delete a document.
     *
     * @remarks
     * Given a library and a document in that library, delete that document. The document will be deleted from the library and the search index.
     */
    delete(request: operations.LibrariesDocumentsDeleteV1Request, options?: RequestOptions): Promise<void>;
    /**
     * Retrieve the text content of a specific document.
     *
     * @remarks
     * Given a library and a document in that library, you can retrieve the text content of that document if it exists. For documents like pdf, docx and pptx the text content results from our processing using Mistral OCR.
     */
    textContent(request: operations.LibrariesDocumentsGetTextContentV1Request, options?: RequestOptions): Promise<components.DocumentTextContent>;
    /**
     * Retrieve the processing status of a specific document.
     *
     * @remarks
     * Given a library and a document in that library, retrieve the processing status of that document.
     */
    status(request: operations.LibrariesDocumentsGetStatusV1Request, options?: RequestOptions): Promise<components.ProcessingStatusOut>;
    /**
     * Retrieve the signed URL of a specific document.
     *
     * @remarks
     * Given a library and a document in that library, retrieve the signed URL of a specific document.The url will expire after 30 minutes and can be accessed by anyone with the link.
     */
    getSignedUrl(request: operations.LibrariesDocumentsGetSignedUrlV1Request, options?: RequestOptions): Promise<string>;
    /**
     * Retrieve the signed URL of text extracted from a given document.
     *
     * @remarks
     * Given a library and a document in that library, retrieve the signed URL of text extracted. For documents that are sent to the OCR this returns the result of the OCR queries.
     */
    extractedTextSignedUrl(request: operations.LibrariesDocumentsGetExtractedTextSignedUrlV1Request, options?: RequestOptions): Promise<string>;
    /**
     * Reprocess a document.
     *
     * @remarks
     * Given a library and a document in that library, reprocess that document, it will be billed again.
     */
    reprocess(request: operations.LibrariesDocumentsReprocessV1Request, options?: RequestOptions): Promise<void>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentTextContent$ {
    /** @deprecated use `DocumentTextContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DocumentTextContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `DocumentTextContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DocumentTextContent$Outbound, z.ZodTypeDef, DocumentTextContent>;
    /** @deprecated use `DocumentTextContent$Outbound` instead. */
    type Outbound = DocumentTextContent$Outbound;
}

/** @internal */
declare const DocumentTextContent$inboundSchema: z.ZodType<DocumentTextContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type DocumentTextContent$Outbound = {
    text: string;
};

/** @internal */
declare const DocumentTextContent$outboundSchema: z.ZodType<DocumentTextContent$Outbound, z.ZodTypeDef, DocumentTextContent>;

declare type DocumentTextContent = {
    text: string;
};

declare function documentTextContentFromJSON(jsonString: string): Result<DocumentTextContent, SDKValidationError>;

declare function documentTextContentToJSON(documentTextContent: DocumentTextContent): string;

declare function documentToJSON(document: Document_2): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentUpdateIn$ {
    /** @deprecated use `DocumentUpdateIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DocumentUpdateIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `DocumentUpdateIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DocumentUpdateIn$Outbound, z.ZodTypeDef, DocumentUpdateIn>;
    /** @deprecated use `DocumentUpdateIn$Outbound` instead. */
    type Outbound = DocumentUpdateIn$Outbound;
}

/** @internal */
declare const DocumentUpdateIn$inboundSchema: z.ZodType<DocumentUpdateIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type DocumentUpdateIn$Outbound = {
    name?: string | null | undefined;
};

/** @internal */
declare const DocumentUpdateIn$outboundSchema: z.ZodType<DocumentUpdateIn$Outbound, z.ZodTypeDef, DocumentUpdateIn>;

declare type DocumentUpdateIn = {
    name?: string | null | undefined;
};

declare function documentUpdateInFromJSON(jsonString: string): Result<DocumentUpdateIn, SDKValidationError>;

declare function documentUpdateInToJSON(documentUpdateIn: DocumentUpdateIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentURLChunk$ {
    /** @deprecated use `DocumentURLChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<DocumentURLChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `DocumentURLChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<DocumentURLChunk$Outbound, z.ZodTypeDef, DocumentURLChunk>;
    /** @deprecated use `DocumentURLChunk$Outbound` instead. */
    type Outbound = DocumentURLChunk$Outbound;
}

/** @internal */
declare const DocumentURLChunk$inboundSchema: z.ZodType<DocumentURLChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type DocumentURLChunk$Outbound = {
    document_url: string;
    document_name?: string | null | undefined;
    type: string;
};

/** @internal */
declare const DocumentURLChunk$outboundSchema: z.ZodType<DocumentURLChunk$Outbound, z.ZodTypeDef, DocumentURLChunk>;

declare type DocumentURLChunk = {
    documentUrl: string;
    /**
     * The filename of the document
     */
    documentName?: string | null | undefined;
    type?: DocumentURLChunkType | undefined;
};

declare function documentURLChunkFromJSON(jsonString: string): Result<DocumentURLChunk, SDKValidationError>;

declare function documentURLChunkToJSON(documentURLChunk: DocumentURLChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace DocumentURLChunkType$ {
    /** @deprecated use `DocumentURLChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly DocumentUrl: "document_url";
    }>;
    /** @deprecated use `DocumentURLChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly DocumentUrl: "document_url";
    }>;
}

/** @internal */
declare const DocumentURLChunkType$inboundSchema: z.ZodNativeEnum<typeof DocumentURLChunkType>;

/** @internal */
declare const DocumentURLChunkType$outboundSchema: z.ZodNativeEnum<typeof DocumentURLChunkType>;

declare const DocumentURLChunkType: {
    readonly DocumentUrl: "document_url";
};

declare type DocumentURLChunkType = ClosedEnum<typeof DocumentURLChunkType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EmbeddingDtype$ {
    /** @deprecated use `EmbeddingDtype$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Float: "float";
        readonly Int8: "int8";
        readonly Uint8: "uint8";
        readonly Binary: "binary";
        readonly Ubinary: "ubinary";
    }>;
    /** @deprecated use `EmbeddingDtype$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Float: "float";
        readonly Int8: "int8";
        readonly Uint8: "uint8";
        readonly Binary: "binary";
        readonly Ubinary: "ubinary";
    }>;
}

/** @internal */
declare const EmbeddingDtype$inboundSchema: z.ZodNativeEnum<typeof EmbeddingDtype>;

/** @internal */
declare const EmbeddingDtype$outboundSchema: z.ZodNativeEnum<typeof EmbeddingDtype>;

declare const EmbeddingDtype: {
    readonly Float: "float";
    readonly Int8: "int8";
    readonly Uint8: "uint8";
    readonly Binary: "binary";
    readonly Ubinary: "ubinary";
};

declare type EmbeddingDtype = ClosedEnum<typeof EmbeddingDtype>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EmbeddingRequest$ {
    /** @deprecated use `EmbeddingRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<EmbeddingRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `EmbeddingRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<EmbeddingRequest$Outbound, z.ZodTypeDef, EmbeddingRequest>;
    /** @deprecated use `EmbeddingRequest$Outbound` instead. */
    type Outbound = EmbeddingRequest$Outbound;
}

/** @internal */
declare const EmbeddingRequest$inboundSchema: z.ZodType<EmbeddingRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type EmbeddingRequest$Outbound = {
    model: string;
    input: string | Array<string>;
    output_dimension?: number | null | undefined;
    output_dtype?: string | undefined;
    encoding_format?: string | undefined;
};

/** @internal */
declare const EmbeddingRequest$outboundSchema: z.ZodType<EmbeddingRequest$Outbound, z.ZodTypeDef, EmbeddingRequest>;

declare type EmbeddingRequest = {
    /**
     * ID of the model to use.
     */
    model: string;
    /**
     * Text to embed.
     */
    inputs: string | Array<string>;
    /**
     * The dimension of the output embeddings.
     */
    outputDimension?: number | null | undefined;
    outputDtype?: EmbeddingDtype | undefined;
    encodingFormat?: EncodingFormat | undefined;
};

declare function embeddingRequestFromJSON(jsonString: string): Result<EmbeddingRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EmbeddingRequestInputs$ {
    /** @deprecated use `EmbeddingRequestInputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<EmbeddingRequestInputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `EmbeddingRequestInputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<EmbeddingRequestInputs$Outbound, z.ZodTypeDef, EmbeddingRequestInputs>;
    /** @deprecated use `EmbeddingRequestInputs$Outbound` instead. */
    type Outbound = EmbeddingRequestInputs$Outbound;
}

/** @internal */
declare const EmbeddingRequestInputs$inboundSchema: z.ZodType<EmbeddingRequestInputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type EmbeddingRequestInputs$Outbound = string | Array<string>;

/** @internal */
declare const EmbeddingRequestInputs$outboundSchema: z.ZodType<EmbeddingRequestInputs$Outbound, z.ZodTypeDef, EmbeddingRequestInputs>;

/**
 * Text to embed.
 */
declare type EmbeddingRequestInputs = string | Array<string>;

declare function embeddingRequestInputsFromJSON(jsonString: string): Result<EmbeddingRequestInputs, SDKValidationError>;

declare function embeddingRequestInputsToJSON(embeddingRequestInputs: EmbeddingRequestInputs): string;

declare function embeddingRequestToJSON(embeddingRequest: EmbeddingRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EmbeddingResponse$ {
    /** @deprecated use `EmbeddingResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<EmbeddingResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `EmbeddingResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<EmbeddingResponse$Outbound, z.ZodTypeDef, EmbeddingResponse>;
    /** @deprecated use `EmbeddingResponse$Outbound` instead. */
    type Outbound = EmbeddingResponse$Outbound;
}

/** @internal */
declare const EmbeddingResponse$inboundSchema: z.ZodType<EmbeddingResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type EmbeddingResponse$Outbound = {
    id: string;
    object: string;
    model: string;
    usage: UsageInfo$Outbound;
    data: Array<EmbeddingResponseData$Outbound>;
};

/** @internal */
declare const EmbeddingResponse$outboundSchema: z.ZodType<EmbeddingResponse$Outbound, z.ZodTypeDef, EmbeddingResponse>;

declare type EmbeddingResponse = {
    id: string;
    object: string;
    model: string;
    usage: UsageInfo;
    data: Array<EmbeddingResponseData>;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EmbeddingResponseData$ {
    /** @deprecated use `EmbeddingResponseData$inboundSchema` instead. */
    const inboundSchema: z.ZodType<EmbeddingResponseData, z.ZodTypeDef, unknown>;
    /** @deprecated use `EmbeddingResponseData$outboundSchema` instead. */
    const outboundSchema: z.ZodType<EmbeddingResponseData$Outbound, z.ZodTypeDef, EmbeddingResponseData>;
    /** @deprecated use `EmbeddingResponseData$Outbound` instead. */
    type Outbound = EmbeddingResponseData$Outbound;
}

/** @internal */
declare const EmbeddingResponseData$inboundSchema: z.ZodType<EmbeddingResponseData, z.ZodTypeDef, unknown>;

/** @internal */
declare type EmbeddingResponseData$Outbound = {
    object?: string | undefined;
    embedding?: Array<number> | undefined;
    index?: number | undefined;
};

/** @internal */
declare const EmbeddingResponseData$outboundSchema: z.ZodType<EmbeddingResponseData$Outbound, z.ZodTypeDef, EmbeddingResponseData>;

declare type EmbeddingResponseData = {
    object?: string | undefined;
    embedding?: Array<number> | undefined;
    index?: number | undefined;
};

declare function embeddingResponseDataFromJSON(jsonString: string): Result<EmbeddingResponseData, SDKValidationError>;

declare function embeddingResponseDataToJSON(embeddingResponseData: EmbeddingResponseData): string;

declare function embeddingResponseFromJSON(jsonString: string): Result<EmbeddingResponse, SDKValidationError>;

declare function embeddingResponseToJSON(embeddingResponse: EmbeddingResponse): string;

declare class Embeddings extends ClientSDK {
    /**
     * Embeddings
     *
     * @remarks
     * Embeddings
     */
    create(request: components.EmbeddingRequest, options?: RequestOptions): Promise<components.EmbeddingResponse>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EncodingFormat$ {
    /** @deprecated use `EncodingFormat$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Float: "float";
        readonly Base64: "base64";
    }>;
    /** @deprecated use `EncodingFormat$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Float: "float";
        readonly Base64: "base64";
    }>;
}

/** @internal */
declare const EncodingFormat$inboundSchema: z.ZodNativeEnum<typeof EncodingFormat>;

/** @internal */
declare const EncodingFormat$outboundSchema: z.ZodNativeEnum<typeof EncodingFormat>;

declare const EncodingFormat: {
    readonly Float: "float";
    readonly Base64: "base64";
};

declare type EncodingFormat = ClosedEnum<typeof EncodingFormat>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EntityType$ {
    /** @deprecated use `EntityType$inboundSchema` instead. */
    const inboundSchema: z.ZodType<EntityType, z.ZodTypeDef, unknown>;
    /** @deprecated use `EntityType$outboundSchema` instead. */
    const outboundSchema: z.ZodType<EntityType, z.ZodTypeDef, EntityType>;
}

/** @internal */
declare const EntityType$inboundSchema: z.ZodType<EntityType, z.ZodTypeDef, unknown>;

/** @internal */
declare const EntityType$outboundSchema: z.ZodType<EntityType, z.ZodTypeDef, EntityType>;

/**
 * The type of entity, used to share a library.
 */
declare const EntityType: {
    readonly User: "User";
    readonly Workspace: "Workspace";
    readonly Org: "Org";
};

/**
 * The type of entity, used to share a library.
 */
declare type EntityType = OpenEnum<typeof EntityType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Entries$ {
    /** @deprecated use `Entries$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Entries, z.ZodTypeDef, unknown>;
    /** @deprecated use `Entries$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Entries$Outbound, z.ZodTypeDef, Entries>;
    /** @deprecated use `Entries$Outbound` instead. */
    type Outbound = Entries$Outbound;
}

/** @internal */
declare const Entries$inboundSchema: z.ZodType<Entries, z.ZodTypeDef, unknown>;

/** @internal */
declare type Entries$Outbound = AgentHandoffEntry$Outbound | FunctionCallEntry$Outbound | MessageInputEntry$Outbound | FunctionResultEntry$Outbound | ToolExecutionEntry$Outbound | MessageOutputEntry$Outbound;

/** @internal */
declare const Entries$outboundSchema: z.ZodType<Entries$Outbound, z.ZodTypeDef, Entries>;

declare type Entries = AgentHandoffEntry | FunctionCallEntry | MessageInputEntry | FunctionResultEntry | ToolExecutionEntry | MessageOutputEntry;

declare function entriesFromJSON(jsonString: string): Result<Entries, SDKValidationError>;

declare function entriesToJSON(entries: Entries): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace EventOut$ {
    /** @deprecated use `EventOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<EventOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `EventOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<EventOut$Outbound, z.ZodTypeDef, EventOut>;
    /** @deprecated use `EventOut$Outbound` instead. */
    type Outbound = EventOut$Outbound;
}

/** @internal */
declare const EventOut$inboundSchema: z.ZodType<EventOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type EventOut$Outbound = {
    name: string;
    data?: {
        [k: string]: any;
    } | null | undefined;
    created_at: number;
};

/** @internal */
declare const EventOut$outboundSchema: z.ZodType<EventOut$Outbound, z.ZodTypeDef, EventOut>;

declare type EventOut = {
    /**
     * The name of the event.
     */
    name: string;
    data?: {
        [k: string]: any;
    } | null | undefined;
    /**
     * The UNIX timestamp (in seconds) of the event.
     */
    createdAt: number;
};

declare function eventOutFromJSON(jsonString: string): Result<EventOut, SDKValidationError>;

declare function eventOutToJSON(eventOut: EventOut): string;

declare class EventStream<T extends ServerEvent<unknown>> extends ReadableStream<T> {
    constructor(responseBody: ReadableStream<Uint8Array>, parse: (x: ServerEvent<string>) => IteratorResult<T, undefined>);
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

export declare type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FileChunk$ {
    /** @deprecated use `FileChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FileChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `FileChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FileChunk$Outbound, z.ZodTypeDef, FileChunk>;
    /** @deprecated use `FileChunk$Outbound` instead. */
    type Outbound = FileChunk$Outbound;
}

/** @internal */
declare const FileChunk$inboundSchema: z.ZodType<FileChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type FileChunk$Outbound = {
    type: "file";
    file_id: string;
};

/** @internal */
declare const FileChunk$outboundSchema: z.ZodType<FileChunk$Outbound, z.ZodTypeDef, FileChunk>;

declare type FileChunk = {
    type?: "file" | undefined;
    fileId: string;
};

declare function fileChunkFromJSON(jsonString: string): Result<FileChunk, SDKValidationError>;

declare function fileChunkToJSON(fileChunk: FileChunk): string;

declare function fileFromJSON(jsonString: string): Result<FileT, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilePurpose$ {
    /** @deprecated use `FilePurpose$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilePurpose, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilePurpose$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilePurpose, z.ZodTypeDef, FilePurpose>;
}

/** @internal */
declare const FilePurpose$inboundSchema: z.ZodType<FilePurpose, z.ZodTypeDef, unknown>;

/** @internal */
declare const FilePurpose$outboundSchema: z.ZodType<FilePurpose, z.ZodTypeDef, FilePurpose>;

declare const FilePurpose: {
    readonly FineTune: "fine-tune";
    readonly Batch: "batch";
    readonly Ocr: "ocr";
};

declare type FilePurpose = OpenEnum<typeof FilePurpose>;

declare class Files extends ClientSDK {
    /**
     * Upload File
     *
     * @remarks
     * Upload a file that can be used across various endpoints.
     *
     * The size of individual files can be a maximum of 512 MB. The Fine-tuning API only supports .jsonl files.
     *
     * Please contact us if you need to increase these storage limits.
     */
    upload(request: operations.FilesApiRoutesUploadFileMultiPartBodyParams, options?: RequestOptions): Promise<components.UploadFileOut>;
    /**
     * List Files
     *
     * @remarks
     * Returns a list of files that belong to the user's organization.
     */
    list(request?: operations.FilesApiRoutesListFilesRequest | undefined, options?: RequestOptions): Promise<components.ListFilesOut>;
    /**
     * Retrieve File
     *
     * @remarks
     * Returns information about a specific file.
     */
    retrieve(request: operations.FilesApiRoutesRetrieveFileRequest, options?: RequestOptions): Promise<components.RetrieveFileOut>;
    /**
     * Delete File
     *
     * @remarks
     * Delete a file.
     */
    delete(request: operations.FilesApiRoutesDeleteFileRequest, options?: RequestOptions): Promise<components.DeleteFileOut>;
    /**
     * Download File
     *
     * @remarks
     * Download a file
     */
    download(request: operations.FilesApiRoutesDownloadFileRequest, options?: RequestOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Get Signed Url
     */
    getSignedUrl(request: operations.FilesApiRoutesGetSignedUrlRequest, options?: RequestOptions): Promise<components.FileSignedURL>;
}

export declare namespace files {
    export {
        readableStreamToArrayBuffer,
        getContentTypeFromFileName
    }
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilesApiRoutesDeleteFileRequest$ {
    /** @deprecated use `FilesApiRoutesDeleteFileRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilesApiRoutesDeleteFileRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilesApiRoutesDeleteFileRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilesApiRoutesDeleteFileRequest$Outbound, z.ZodTypeDef, FilesApiRoutesDeleteFileRequest>;
    /** @deprecated use `FilesApiRoutesDeleteFileRequest$Outbound` instead. */
    type Outbound = FilesApiRoutesDeleteFileRequest$Outbound;
}

/** @internal */
declare const FilesApiRoutesDeleteFileRequest$inboundSchema: z.ZodType<FilesApiRoutesDeleteFileRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FilesApiRoutesDeleteFileRequest$Outbound = {
    file_id: string;
};

/** @internal */
declare const FilesApiRoutesDeleteFileRequest$outboundSchema: z.ZodType<FilesApiRoutesDeleteFileRequest$Outbound, z.ZodTypeDef, FilesApiRoutesDeleteFileRequest>;

declare type FilesApiRoutesDeleteFileRequest = {
    fileId: string;
};

declare function filesApiRoutesDeleteFileRequestFromJSON(jsonString: string): Result<FilesApiRoutesDeleteFileRequest, SDKValidationError>;

declare function filesApiRoutesDeleteFileRequestToJSON(filesApiRoutesDeleteFileRequest: FilesApiRoutesDeleteFileRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilesApiRoutesDownloadFileRequest$ {
    /** @deprecated use `FilesApiRoutesDownloadFileRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilesApiRoutesDownloadFileRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilesApiRoutesDownloadFileRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilesApiRoutesDownloadFileRequest$Outbound, z.ZodTypeDef, FilesApiRoutesDownloadFileRequest>;
    /** @deprecated use `FilesApiRoutesDownloadFileRequest$Outbound` instead. */
    type Outbound = FilesApiRoutesDownloadFileRequest$Outbound;
}

/** @internal */
declare const FilesApiRoutesDownloadFileRequest$inboundSchema: z.ZodType<FilesApiRoutesDownloadFileRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FilesApiRoutesDownloadFileRequest$Outbound = {
    file_id: string;
};

/** @internal */
declare const FilesApiRoutesDownloadFileRequest$outboundSchema: z.ZodType<FilesApiRoutesDownloadFileRequest$Outbound, z.ZodTypeDef, FilesApiRoutesDownloadFileRequest>;

declare type FilesApiRoutesDownloadFileRequest = {
    fileId: string;
};

declare function filesApiRoutesDownloadFileRequestFromJSON(jsonString: string): Result<FilesApiRoutesDownloadFileRequest, SDKValidationError>;

declare function filesApiRoutesDownloadFileRequestToJSON(filesApiRoutesDownloadFileRequest: FilesApiRoutesDownloadFileRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilesApiRoutesGetSignedUrlRequest$ {
    /** @deprecated use `FilesApiRoutesGetSignedUrlRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilesApiRoutesGetSignedUrlRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilesApiRoutesGetSignedUrlRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilesApiRoutesGetSignedUrlRequest$Outbound, z.ZodTypeDef, FilesApiRoutesGetSignedUrlRequest>;
    /** @deprecated use `FilesApiRoutesGetSignedUrlRequest$Outbound` instead. */
    type Outbound = FilesApiRoutesGetSignedUrlRequest$Outbound;
}

/** @internal */
declare const FilesApiRoutesGetSignedUrlRequest$inboundSchema: z.ZodType<FilesApiRoutesGetSignedUrlRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FilesApiRoutesGetSignedUrlRequest$Outbound = {
    file_id: string;
    expiry: number;
};

/** @internal */
declare const FilesApiRoutesGetSignedUrlRequest$outboundSchema: z.ZodType<FilesApiRoutesGetSignedUrlRequest$Outbound, z.ZodTypeDef, FilesApiRoutesGetSignedUrlRequest>;

declare type FilesApiRoutesGetSignedUrlRequest = {
    fileId: string;
    /**
     * Number of hours before the url becomes invalid. Defaults to 24h
     */
    expiry?: number | undefined;
};

declare function filesApiRoutesGetSignedUrlRequestFromJSON(jsonString: string): Result<FilesApiRoutesGetSignedUrlRequest, SDKValidationError>;

declare function filesApiRoutesGetSignedUrlRequestToJSON(filesApiRoutesGetSignedUrlRequest: FilesApiRoutesGetSignedUrlRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilesApiRoutesListFilesRequest$ {
    /** @deprecated use `FilesApiRoutesListFilesRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilesApiRoutesListFilesRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilesApiRoutesListFilesRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilesApiRoutesListFilesRequest$Outbound, z.ZodTypeDef, FilesApiRoutesListFilesRequest>;
    /** @deprecated use `FilesApiRoutesListFilesRequest$Outbound` instead. */
    type Outbound = FilesApiRoutesListFilesRequest$Outbound;
}

/** @internal */
declare const FilesApiRoutesListFilesRequest$inboundSchema: z.ZodType<FilesApiRoutesListFilesRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FilesApiRoutesListFilesRequest$Outbound = {
    page: number;
    page_size: number;
    sample_type?: Array<string> | null | undefined;
    source?: Array<string> | null | undefined;
    search?: string | null | undefined;
    purpose?: string | null | undefined;
};

/** @internal */
declare const FilesApiRoutesListFilesRequest$outboundSchema: z.ZodType<FilesApiRoutesListFilesRequest$Outbound, z.ZodTypeDef, FilesApiRoutesListFilesRequest>;

declare type FilesApiRoutesListFilesRequest = {
    page?: number | undefined;
    pageSize?: number | undefined;
    sampleType?: Array<components.SampleType> | null | undefined;
    source?: Array<components.Source> | null | undefined;
    search?: string | null | undefined;
    purpose?: components.FilePurpose | null | undefined;
};

declare function filesApiRoutesListFilesRequestFromJSON(jsonString: string): Result<FilesApiRoutesListFilesRequest, SDKValidationError>;

declare function filesApiRoutesListFilesRequestToJSON(filesApiRoutesListFilesRequest: FilesApiRoutesListFilesRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilesApiRoutesRetrieveFileRequest$ {
    /** @deprecated use `FilesApiRoutesRetrieveFileRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilesApiRoutesRetrieveFileRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilesApiRoutesRetrieveFileRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilesApiRoutesRetrieveFileRequest$Outbound, z.ZodTypeDef, FilesApiRoutesRetrieveFileRequest>;
    /** @deprecated use `FilesApiRoutesRetrieveFileRequest$Outbound` instead. */
    type Outbound = FilesApiRoutesRetrieveFileRequest$Outbound;
}

/** @internal */
declare const FilesApiRoutesRetrieveFileRequest$inboundSchema: z.ZodType<FilesApiRoutesRetrieveFileRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FilesApiRoutesRetrieveFileRequest$Outbound = {
    file_id: string;
};

/** @internal */
declare const FilesApiRoutesRetrieveFileRequest$outboundSchema: z.ZodType<FilesApiRoutesRetrieveFileRequest$Outbound, z.ZodTypeDef, FilesApiRoutesRetrieveFileRequest>;

declare type FilesApiRoutesRetrieveFileRequest = {
    fileId: string;
};

declare function filesApiRoutesRetrieveFileRequestFromJSON(jsonString: string): Result<FilesApiRoutesRetrieveFileRequest, SDKValidationError>;

declare function filesApiRoutesRetrieveFileRequestToJSON(filesApiRoutesRetrieveFileRequest: FilesApiRoutesRetrieveFileRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FilesApiRoutesUploadFileMultiPartBodyParams$ {
    /** @deprecated use `FilesApiRoutesUploadFileMultiPartBodyParams$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FilesApiRoutesUploadFileMultiPartBodyParams, z.ZodTypeDef, unknown>;
    /** @deprecated use `FilesApiRoutesUploadFileMultiPartBodyParams$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FilesApiRoutesUploadFileMultiPartBodyParams$Outbound, z.ZodTypeDef, FilesApiRoutesUploadFileMultiPartBodyParams>;
    /** @deprecated use `FilesApiRoutesUploadFileMultiPartBodyParams$Outbound` instead. */
    type Outbound = FilesApiRoutesUploadFileMultiPartBodyParams$Outbound;
}

/** @internal */
declare const FilesApiRoutesUploadFileMultiPartBodyParams$inboundSchema: z.ZodType<FilesApiRoutesUploadFileMultiPartBodyParams, z.ZodTypeDef, unknown>;

/** @internal */
declare type FilesApiRoutesUploadFileMultiPartBodyParams$Outbound = {
    purpose?: string | undefined;
    file: components.FileT$Outbound | Blob;
};

/** @internal */
declare const FilesApiRoutesUploadFileMultiPartBodyParams$outboundSchema: z.ZodType<FilesApiRoutesUploadFileMultiPartBodyParams$Outbound, z.ZodTypeDef, FilesApiRoutesUploadFileMultiPartBodyParams>;

declare type FilesApiRoutesUploadFileMultiPartBodyParams = {
    purpose?: components.FilePurpose | undefined;
    /**
     * The File object (not file name) to be uploaded.
     *
     * @remarks
     *  To upload a file and specify a custom file name you should format your request as such:
     *  ```bash
     *  file=@path/to/your/file.jsonl;filename=custom_name.jsonl
     *  ```
     *  Otherwise, you can just keep the original file name:
     *  ```bash
     *  file=@path/to/your/file.jsonl
     *  ```
     */
    file: components.FileT | Blob;
};

declare function filesApiRoutesUploadFileMultiPartBodyParamsFromJSON(jsonString: string): Result<FilesApiRoutesUploadFileMultiPartBodyParams, SDKValidationError>;

declare function filesApiRoutesUploadFileMultiPartBodyParamsToJSON(filesApiRoutesUploadFileMultiPartBodyParams: FilesApiRoutesUploadFileMultiPartBodyParams): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FileSchema$ {
    /** @deprecated use `FileSchema$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FileSchema, z.ZodTypeDef, unknown>;
    /** @deprecated use `FileSchema$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FileSchema$Outbound, z.ZodTypeDef, FileSchema>;
    /** @deprecated use `FileSchema$Outbound` instead. */
    type Outbound = FileSchema$Outbound;
}

/** @internal */
declare const FileSchema$inboundSchema: z.ZodType<FileSchema, z.ZodTypeDef, unknown>;

/** @internal */
declare type FileSchema$Outbound = {
    id: string;
    object: string;
    bytes: number;
    created_at: number;
    filename: string;
    purpose: string;
    sample_type: string;
    num_lines?: number | null | undefined;
    mimetype?: string | null | undefined;
    source: string;
    signature?: string | null | undefined;
};

/** @internal */
declare const FileSchema$outboundSchema: z.ZodType<FileSchema$Outbound, z.ZodTypeDef, FileSchema>;

declare type FileSchema = {
    /**
     * The unique identifier of the file.
     */
    id: string;
    /**
     * The object type, which is always "file".
     */
    object: string;
    /**
     * The size of the file, in bytes.
     */
    sizeBytes: number;
    /**
     * The UNIX timestamp (in seconds) of the event.
     */
    createdAt: number;
    /**
     * The name of the uploaded file.
     */
    filename: string;
    purpose: FilePurpose;
    sampleType: SampleType;
    numLines?: number | null | undefined;
    mimetype?: string | null | undefined;
    source: Source;
    signature?: string | null | undefined;
};

declare function fileSchemaFromJSON(jsonString: string): Result<FileSchema, SDKValidationError>;

declare function fileSchemaToJSON(fileSchema: FileSchema): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FileSignedURL$ {
    /** @deprecated use `FileSignedURL$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FileSignedURL, z.ZodTypeDef, unknown>;
    /** @deprecated use `FileSignedURL$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FileSignedURL$Outbound, z.ZodTypeDef, FileSignedURL>;
    /** @deprecated use `FileSignedURL$Outbound` instead. */
    type Outbound = FileSignedURL$Outbound;
}

/** @internal */
declare const FileSignedURL$inboundSchema: z.ZodType<FileSignedURL, z.ZodTypeDef, unknown>;

/** @internal */
declare type FileSignedURL$Outbound = {
    url: string;
};

/** @internal */
declare const FileSignedURL$outboundSchema: z.ZodType<FileSignedURL$Outbound, z.ZodTypeDef, FileSignedURL>;

declare type FileSignedURL = {
    url: string;
};

declare function fileSignedURLFromJSON(jsonString: string): Result<FileSignedURL, SDKValidationError>;

declare function fileSignedURLToJSON(fileSignedURL: FileSignedURL): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FileT$ {
    /** @deprecated use `FileT$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FileT, z.ZodTypeDef, unknown>;
    /** @deprecated use `FileT$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FileT$Outbound, z.ZodTypeDef, FileT>;
    /** @deprecated use `FileT$Outbound` instead. */
    type Outbound = FileT$Outbound;
}

/** @internal */
declare const FileT$inboundSchema: z.ZodType<FileT, z.ZodTypeDef, unknown>;

/** @internal */
declare type FileT$Outbound = {
    fileName: string;
    content: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Uint8Array;
};

/** @internal */
declare const FileT$outboundSchema: z.ZodType<FileT$Outbound, z.ZodTypeDef, FileT>;

declare type FileT = {
    fileName: string;
    content: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Uint8Array;
};

declare function fileToJSON(fileT: FileT): string;

declare class Fim extends ClientSDK {
    /**
     * Fim Completion
     *
     * @remarks
     * FIM completion.
     */
    complete(request: components.FIMCompletionRequest, options?: RequestOptions): Promise<components.FIMCompletionResponse>;
    /**
     * Stream fim completion
     *
     * @remarks
     * Mistral AI provides the ability to stream responses back to a client in order to allow partial results for certain requests. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
     */
    stream(request: components.FIMCompletionStreamRequest, options?: RequestOptions): Promise<EventStream<components.CompletionEvent>>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FIMCompletionRequest$ {
    /** @deprecated use `FIMCompletionRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FIMCompletionRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FIMCompletionRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FIMCompletionRequest$Outbound, z.ZodTypeDef, FIMCompletionRequest>;
    /** @deprecated use `FIMCompletionRequest$Outbound` instead. */
    type Outbound = FIMCompletionRequest$Outbound;
}

/** @internal */
declare const FIMCompletionRequest$inboundSchema: z.ZodType<FIMCompletionRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FIMCompletionRequest$Outbound = {
    model: string;
    temperature?: number | null | undefined;
    top_p: number;
    max_tokens?: number | null | undefined;
    stream: boolean;
    stop?: string | Array<string> | undefined;
    random_seed?: number | null | undefined;
    prompt: string;
    suffix?: string | null | undefined;
    min_tokens?: number | null | undefined;
};

/** @internal */
declare const FIMCompletionRequest$outboundSchema: z.ZodType<FIMCompletionRequest$Outbound, z.ZodTypeDef, FIMCompletionRequest>;

declare type FIMCompletionRequest = {
    /**
     * ID of the model to use. Only compatible for now with:
     *
     * @remarks
     *   - `codestral-2405`
     *   - `codestral-latest`
     */
    model: string;
    /**
     * What sampling temperature to use, we recommend between 0.0 and 0.7. Higher values like 0.7 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both. The default value varies depending on the model you are targeting. Call the `/models` endpoint to retrieve the appropriate value.
     */
    temperature?: number | null | undefined;
    /**
     * Nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.
     */
    topP?: number | undefined;
    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length.
     */
    maxTokens?: number | null | undefined;
    /**
     * Whether to stream back partial progress. If set, tokens will be sent as data-only server-side events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
     */
    stream?: boolean | undefined;
    /**
     * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
     */
    stop?: string | Array<string> | undefined;
    /**
     * The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | null | undefined;
    /**
     * The text/code to complete.
     */
    prompt: string;
    /**
     * Optional text/code that adds more context for the model. When given a `prompt` and a `suffix` the model will fill what is between them. When `suffix` is not provided, the model will simply execute completion starting with `prompt`.
     */
    suffix?: string | null | undefined;
    /**
     * The minimum number of tokens to generate in the completion.
     */
    minTokens?: number | null | undefined;
};

declare function fimCompletionRequestFromJSON(jsonString: string): Result<FIMCompletionRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FIMCompletionRequestStop$ {
    /** @deprecated use `FIMCompletionRequestStop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FIMCompletionRequestStop, z.ZodTypeDef, unknown>;
    /** @deprecated use `FIMCompletionRequestStop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FIMCompletionRequestStop$Outbound, z.ZodTypeDef, FIMCompletionRequestStop>;
    /** @deprecated use `FIMCompletionRequestStop$Outbound` instead. */
    type Outbound = FIMCompletionRequestStop$Outbound;
}

/** @internal */
declare const FIMCompletionRequestStop$inboundSchema: z.ZodType<FIMCompletionRequestStop, z.ZodTypeDef, unknown>;

/** @internal */
declare type FIMCompletionRequestStop$Outbound = string | Array<string>;

/** @internal */
declare const FIMCompletionRequestStop$outboundSchema: z.ZodType<FIMCompletionRequestStop$Outbound, z.ZodTypeDef, FIMCompletionRequestStop>;

/**
 * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
 */
declare type FIMCompletionRequestStop = string | Array<string>;

declare function fimCompletionRequestStopFromJSON(jsonString: string): Result<FIMCompletionRequestStop, SDKValidationError>;

declare function fimCompletionRequestStopToJSON(fimCompletionRequestStop: FIMCompletionRequestStop): string;

declare function fimCompletionRequestToJSON(fimCompletionRequest: FIMCompletionRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FIMCompletionResponse$ {
    /** @deprecated use `FIMCompletionResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FIMCompletionResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `FIMCompletionResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FIMCompletionResponse$Outbound, z.ZodTypeDef, FIMCompletionResponse>;
    /** @deprecated use `FIMCompletionResponse$Outbound` instead. */
    type Outbound = FIMCompletionResponse$Outbound;
}

/** @internal */
declare const FIMCompletionResponse$inboundSchema: z.ZodType<FIMCompletionResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type FIMCompletionResponse$Outbound = {
    id: string;
    object: string;
    model: string;
    usage: UsageInfo$Outbound;
    created: number;
    choices: Array<ChatCompletionChoice$Outbound>;
};

/** @internal */
declare const FIMCompletionResponse$outboundSchema: z.ZodType<FIMCompletionResponse$Outbound, z.ZodTypeDef, FIMCompletionResponse>;

declare type FIMCompletionResponse = {
    id: string;
    object: string;
    model: string;
    usage: UsageInfo;
    created: number;
    choices: Array<ChatCompletionChoice>;
};

declare function fimCompletionResponseFromJSON(jsonString: string): Result<FIMCompletionResponse, SDKValidationError>;

declare function fimCompletionResponseToJSON(fimCompletionResponse: FIMCompletionResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FIMCompletionStreamRequest$ {
    /** @deprecated use `FIMCompletionStreamRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FIMCompletionStreamRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `FIMCompletionStreamRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FIMCompletionStreamRequest$Outbound, z.ZodTypeDef, FIMCompletionStreamRequest>;
    /** @deprecated use `FIMCompletionStreamRequest$Outbound` instead. */
    type Outbound = FIMCompletionStreamRequest$Outbound;
}

/** @internal */
declare const FIMCompletionStreamRequest$inboundSchema: z.ZodType<FIMCompletionStreamRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type FIMCompletionStreamRequest$Outbound = {
    model: string;
    temperature?: number | null | undefined;
    top_p: number;
    max_tokens?: number | null | undefined;
    stream: boolean;
    stop?: string | Array<string> | undefined;
    random_seed?: number | null | undefined;
    prompt: string;
    suffix?: string | null | undefined;
    min_tokens?: number | null | undefined;
};

/** @internal */
declare const FIMCompletionStreamRequest$outboundSchema: z.ZodType<FIMCompletionStreamRequest$Outbound, z.ZodTypeDef, FIMCompletionStreamRequest>;

declare type FIMCompletionStreamRequest = {
    /**
     * ID of the model to use. Only compatible for now with:
     *
     * @remarks
     *   - `codestral-2405`
     *   - `codestral-latest`
     */
    model: string;
    /**
     * What sampling temperature to use, we recommend between 0.0 and 0.7. Higher values like 0.7 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both. The default value varies depending on the model you are targeting. Call the `/models` endpoint to retrieve the appropriate value.
     */
    temperature?: number | null | undefined;
    /**
     * Nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.
     */
    topP?: number | undefined;
    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length.
     */
    maxTokens?: number | null | undefined;
    stream?: boolean | undefined;
    /**
     * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
     */
    stop?: string | Array<string> | undefined;
    /**
     * The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | null | undefined;
    /**
     * The text/code to complete.
     */
    prompt: string;
    /**
     * Optional text/code that adds more context for the model. When given a `prompt` and a `suffix` the model will fill what is between them. When `suffix` is not provided, the model will simply execute completion starting with `prompt`.
     */
    suffix?: string | null | undefined;
    /**
     * The minimum number of tokens to generate in the completion.
     */
    minTokens?: number | null | undefined;
};

declare function fimCompletionStreamRequestFromJSON(jsonString: string): Result<FIMCompletionStreamRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FIMCompletionStreamRequestStop$ {
    /** @deprecated use `FIMCompletionStreamRequestStop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FIMCompletionStreamRequestStop, z.ZodTypeDef, unknown>;
    /** @deprecated use `FIMCompletionStreamRequestStop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FIMCompletionStreamRequestStop$Outbound, z.ZodTypeDef, FIMCompletionStreamRequestStop>;
    /** @deprecated use `FIMCompletionStreamRequestStop$Outbound` instead. */
    type Outbound = FIMCompletionStreamRequestStop$Outbound;
}

/** @internal */
declare const FIMCompletionStreamRequestStop$inboundSchema: z.ZodType<FIMCompletionStreamRequestStop, z.ZodTypeDef, unknown>;

/** @internal */
declare type FIMCompletionStreamRequestStop$Outbound = string | Array<string>;

/** @internal */
declare const FIMCompletionStreamRequestStop$outboundSchema: z.ZodType<FIMCompletionStreamRequestStop$Outbound, z.ZodTypeDef, FIMCompletionStreamRequestStop>;

/**
 * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
 */
declare type FIMCompletionStreamRequestStop = string | Array<string>;

declare function fimCompletionStreamRequestStopFromJSON(jsonString: string): Result<FIMCompletionStreamRequestStop, SDKValidationError>;

declare function fimCompletionStreamRequestStopToJSON(fimCompletionStreamRequestStop: FIMCompletionStreamRequestStop): string;

declare function fimCompletionStreamRequestToJSON(fimCompletionStreamRequest: FIMCompletionStreamRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FineTuneableModelType$ {
    /** @deprecated use `FineTuneableModelType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
        readonly Classifier: "classifier";
    }>;
    /** @deprecated use `FineTuneableModelType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
        readonly Classifier: "classifier";
    }>;
}

/** @internal */
declare const FineTuneableModelType$inboundSchema: z.ZodNativeEnum<typeof FineTuneableModelType>;

/** @internal */
declare const FineTuneableModelType$outboundSchema: z.ZodNativeEnum<typeof FineTuneableModelType>;

declare const FineTuneableModelType: {
    readonly Completion: "completion";
    readonly Classifier: "classifier";
};

declare type FineTuneableModelType = ClosedEnum<typeof FineTuneableModelType>;

declare class FineTuning extends ClientSDK {
    private _jobs?;
    get jobs(): Jobs;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FinishReason$ {
    /** @deprecated use `FinishReason$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FinishReason, z.ZodTypeDef, unknown>;
    /** @deprecated use `FinishReason$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FinishReason, z.ZodTypeDef, FinishReason>;
}

/** @internal */
declare const FinishReason$inboundSchema: z.ZodType<FinishReason, z.ZodTypeDef, unknown>;

/** @internal */
declare const FinishReason$outboundSchema: z.ZodType<FinishReason, z.ZodTypeDef, FinishReason>;

declare const FinishReason: {
    readonly Stop: "stop";
    readonly Length: "length";
    readonly ModelLength: "model_length";
    readonly Error: "error";
    readonly ToolCalls: "tool_calls";
};

declare type FinishReason = OpenEnum<typeof FinishReason>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FTClassifierLossFunction$ {
    /** @deprecated use `FTClassifierLossFunction$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly SingleClass: "single_class";
        readonly MultiClass: "multi_class";
    }>;
    /** @deprecated use `FTClassifierLossFunction$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly SingleClass: "single_class";
        readonly MultiClass: "multi_class";
    }>;
}

/** @internal */
declare const FTClassifierLossFunction$inboundSchema: z.ZodNativeEnum<typeof FTClassifierLossFunction>;

/** @internal */
declare const FTClassifierLossFunction$outboundSchema: z.ZodNativeEnum<typeof FTClassifierLossFunction>;

declare const FTClassifierLossFunction: {
    readonly SingleClass: "single_class";
    readonly MultiClass: "multi_class";
};

declare type FTClassifierLossFunction = ClosedEnum<typeof FTClassifierLossFunction>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FTModelCapabilitiesOut$ {
    /** @deprecated use `FTModelCapabilitiesOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FTModelCapabilitiesOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `FTModelCapabilitiesOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FTModelCapabilitiesOut$Outbound, z.ZodTypeDef, FTModelCapabilitiesOut>;
    /** @deprecated use `FTModelCapabilitiesOut$Outbound` instead. */
    type Outbound = FTModelCapabilitiesOut$Outbound;
}

/** @internal */
declare const FTModelCapabilitiesOut$inboundSchema: z.ZodType<FTModelCapabilitiesOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type FTModelCapabilitiesOut$Outbound = {
    completion_chat: boolean;
    completion_fim: boolean;
    function_calling: boolean;
    fine_tuning: boolean;
    classification: boolean;
};

/** @internal */
declare const FTModelCapabilitiesOut$outboundSchema: z.ZodType<FTModelCapabilitiesOut$Outbound, z.ZodTypeDef, FTModelCapabilitiesOut>;

declare type FTModelCapabilitiesOut = {
    completionChat?: boolean | undefined;
    completionFim?: boolean | undefined;
    functionCalling?: boolean | undefined;
    fineTuning?: boolean | undefined;
    classification?: boolean | undefined;
};

declare function ftModelCapabilitiesOutFromJSON(jsonString: string): Result<FTModelCapabilitiesOut, SDKValidationError>;

declare function ftModelCapabilitiesOutToJSON(ftModelCapabilitiesOut: FTModelCapabilitiesOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FTModelCard$ {
    /** @deprecated use `FTModelCard$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FTModelCard, z.ZodTypeDef, unknown>;
    /** @deprecated use `FTModelCard$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FTModelCard$Outbound, z.ZodTypeDef, FTModelCard>;
    /** @deprecated use `FTModelCard$Outbound` instead. */
    type Outbound = FTModelCard$Outbound;
}

/** @internal */
declare const FTModelCard$inboundSchema: z.ZodType<FTModelCard, z.ZodTypeDef, unknown>;

/** @internal */
declare type FTModelCard$Outbound = {
    id: string;
    object: string;
    created?: number | undefined;
    owned_by: string;
    capabilities: ModelCapabilities$Outbound;
    name?: string | null | undefined;
    description?: string | null | undefined;
    max_context_length: number;
    aliases?: Array<string> | undefined;
    deprecation?: string | null | undefined;
    deprecation_replacement_model?: string | null | undefined;
    default_model_temperature?: number | null | undefined;
    type: "fine-tuned";
    job: string;
    root: string;
    archived: boolean;
};

/** @internal */
declare const FTModelCard$outboundSchema: z.ZodType<FTModelCard$Outbound, z.ZodTypeDef, FTModelCard>;

/**
 * Extra fields for fine-tuned models.
 */
declare type FTModelCard = {
    id: string;
    object?: string | undefined;
    created?: number | undefined;
    ownedBy?: string | undefined;
    capabilities: ModelCapabilities;
    name?: string | null | undefined;
    description?: string | null | undefined;
    maxContextLength?: number | undefined;
    aliases?: Array<string> | undefined;
    deprecation?: Date | null | undefined;
    deprecationReplacementModel?: string | null | undefined;
    defaultModelTemperature?: number | null | undefined;
    type?: "fine-tuned" | undefined;
    job: string;
    root: string;
    archived?: boolean | undefined;
};

declare function ftModelCardFromJSON(jsonString: string): Result<FTModelCard, SDKValidationError>;

declare function ftModelCardToJSON(ftModelCard: FTModelCard): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FTModelCardType$ {
    /** @deprecated use `FTModelCardType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly FineTuned: "fine-tuned";
    }>;
    /** @deprecated use `FTModelCardType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly FineTuned: "fine-tuned";
    }>;
}

/** @internal */
declare const FTModelCardType$inboundSchema: z.ZodNativeEnum<typeof FTModelCardType>;

/** @internal */
declare const FTModelCardType$outboundSchema: z.ZodNativeEnum<typeof FTModelCardType>;

declare const FTModelCardType: {
    readonly FineTuned: "fine-tuned";
};

declare type FTModelCardType = ClosedEnum<typeof FTModelCardType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCall$ {
    /** @deprecated use `FunctionCall$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionCall, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionCall$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionCall$Outbound, z.ZodTypeDef, FunctionCall>;
    /** @deprecated use `FunctionCall$Outbound` instead. */
    type Outbound = FunctionCall$Outbound;
}

/** @internal */
declare const FunctionCall$inboundSchema: z.ZodType<FunctionCall, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionCall$Outbound = {
    name: string;
    arguments: {
        [k: string]: any;
    } | string;
};

/** @internal */
declare const FunctionCall$outboundSchema: z.ZodType<FunctionCall$Outbound, z.ZodTypeDef, FunctionCall>;

declare type FunctionCall = {
    name: string;
    arguments: {
        [k: string]: any;
    } | string;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCallEntry$ {
    /** @deprecated use `FunctionCallEntry$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionCallEntry, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionCallEntry$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionCallEntry$Outbound, z.ZodTypeDef, FunctionCallEntry>;
    /** @deprecated use `FunctionCallEntry$Outbound` instead. */
    type Outbound = FunctionCallEntry$Outbound;
}

/** @internal */
declare const FunctionCallEntry$inboundSchema: z.ZodType<FunctionCallEntry, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionCallEntry$Outbound = {
    object: string;
    type: string;
    created_at?: string | undefined;
    completed_at?: string | null | undefined;
    id?: string | undefined;
    tool_call_id: string;
    name: string;
    arguments: FunctionCallEntryArguments$Outbound;
};

/** @internal */
declare const FunctionCallEntry$outboundSchema: z.ZodType<FunctionCallEntry$Outbound, z.ZodTypeDef, FunctionCallEntry>;

declare type FunctionCallEntry = {
    object?: FunctionCallEntryObject | undefined;
    type?: FunctionCallEntryType | undefined;
    createdAt?: Date | undefined;
    completedAt?: Date | null | undefined;
    id?: string | undefined;
    toolCallId: string;
    name: string;
    arguments: FunctionCallEntryArguments;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCallEntryArguments$ {
    /** @deprecated use `FunctionCallEntryArguments$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionCallEntryArguments, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionCallEntryArguments$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionCallEntryArguments$Outbound, z.ZodTypeDef, FunctionCallEntryArguments>;
    /** @deprecated use `FunctionCallEntryArguments$Outbound` instead. */
    type Outbound = FunctionCallEntryArguments$Outbound;
}

/** @internal */
declare const FunctionCallEntryArguments$inboundSchema: z.ZodType<FunctionCallEntryArguments, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionCallEntryArguments$Outbound = {
    [k: string]: any;
} | string;

/** @internal */
declare const FunctionCallEntryArguments$outboundSchema: z.ZodType<FunctionCallEntryArguments$Outbound, z.ZodTypeDef, FunctionCallEntryArguments>;

declare type FunctionCallEntryArguments = {
    [k: string]: any;
} | string;

declare function functionCallEntryArgumentsFromJSON(jsonString: string): Result<FunctionCallEntryArguments, SDKValidationError>;

declare function functionCallEntryArgumentsToJSON(functionCallEntryArguments: FunctionCallEntryArguments): string;

declare function functionCallEntryFromJSON(jsonString: string): Result<FunctionCallEntry, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCallEntryObject$ {
    /** @deprecated use `FunctionCallEntryObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
    /** @deprecated use `FunctionCallEntryObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
}

/** @internal */
declare const FunctionCallEntryObject$inboundSchema: z.ZodNativeEnum<typeof FunctionCallEntryObject>;

/** @internal */
declare const FunctionCallEntryObject$outboundSchema: z.ZodNativeEnum<typeof FunctionCallEntryObject>;

declare const FunctionCallEntryObject: {
    readonly Entry: "entry";
};

declare type FunctionCallEntryObject = ClosedEnum<typeof FunctionCallEntryObject>;

declare function functionCallEntryToJSON(functionCallEntry: FunctionCallEntry): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCallEntryType$ {
    /** @deprecated use `FunctionCallEntryType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly FunctionCall: "function.call";
    }>;
    /** @deprecated use `FunctionCallEntryType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly FunctionCall: "function.call";
    }>;
}

/** @internal */
declare const FunctionCallEntryType$inboundSchema: z.ZodNativeEnum<typeof FunctionCallEntryType>;

/** @internal */
declare const FunctionCallEntryType$outboundSchema: z.ZodNativeEnum<typeof FunctionCallEntryType>;

declare const FunctionCallEntryType: {
    readonly FunctionCall: "function.call";
};

declare type FunctionCallEntryType = ClosedEnum<typeof FunctionCallEntryType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCallEvent$ {
    /** @deprecated use `FunctionCallEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionCallEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionCallEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionCallEvent$Outbound, z.ZodTypeDef, FunctionCallEvent>;
    /** @deprecated use `FunctionCallEvent$Outbound` instead. */
    type Outbound = FunctionCallEvent$Outbound;
}

/** @internal */
declare const FunctionCallEvent$inboundSchema: z.ZodType<FunctionCallEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionCallEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    name: string;
    tool_call_id: string;
    arguments: string;
};

/** @internal */
declare const FunctionCallEvent$outboundSchema: z.ZodType<FunctionCallEvent$Outbound, z.ZodTypeDef, FunctionCallEvent>;

declare type FunctionCallEvent = {
    type?: FunctionCallEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    name: string;
    toolCallId: string;
    arguments: string;
};

declare function functionCallEventFromJSON(jsonString: string): Result<FunctionCallEvent, SDKValidationError>;

declare function functionCallEventToJSON(functionCallEvent: FunctionCallEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionCallEventType$ {
    /** @deprecated use `FunctionCallEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly FunctionCallDelta: "function.call.delta";
    }>;
    /** @deprecated use `FunctionCallEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly FunctionCallDelta: "function.call.delta";
    }>;
}

/** @internal */
declare const FunctionCallEventType$inboundSchema: z.ZodNativeEnum<typeof FunctionCallEventType>;

/** @internal */
declare const FunctionCallEventType$outboundSchema: z.ZodNativeEnum<typeof FunctionCallEventType>;

declare const FunctionCallEventType: {
    readonly FunctionCallDelta: "function.call.delta";
};

declare type FunctionCallEventType = ClosedEnum<typeof FunctionCallEventType>;

declare function functionCallFromJSON(jsonString: string): Result<FunctionCall, SDKValidationError>;

declare function functionCallToJSON(functionCall: FunctionCall): string;

declare function functionFromJSON(jsonString: string): Result<FunctionT, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionName$ {
    /** @deprecated use `FunctionName$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionName, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionName$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionName$Outbound, z.ZodTypeDef, FunctionName>;
    /** @deprecated use `FunctionName$Outbound` instead. */
    type Outbound = FunctionName$Outbound;
}

/** @internal */
declare const FunctionName$inboundSchema: z.ZodType<FunctionName, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionName$Outbound = {
    name: string;
};

/** @internal */
declare const FunctionName$outboundSchema: z.ZodType<FunctionName$Outbound, z.ZodTypeDef, FunctionName>;

/**
 * this restriction of `Function` is used to select a specific function to call
 */
declare type FunctionName = {
    name: string;
};

declare function functionNameFromJSON(jsonString: string): Result<FunctionName, SDKValidationError>;

declare function functionNameToJSON(functionName: FunctionName): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionResultEntry$ {
    /** @deprecated use `FunctionResultEntry$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionResultEntry, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionResultEntry$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionResultEntry$Outbound, z.ZodTypeDef, FunctionResultEntry>;
    /** @deprecated use `FunctionResultEntry$Outbound` instead. */
    type Outbound = FunctionResultEntry$Outbound;
}

/** @internal */
declare const FunctionResultEntry$inboundSchema: z.ZodType<FunctionResultEntry, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionResultEntry$Outbound = {
    object: string;
    type: string;
    created_at?: string | undefined;
    completed_at?: string | null | undefined;
    id?: string | undefined;
    tool_call_id: string;
    result: string;
};

/** @internal */
declare const FunctionResultEntry$outboundSchema: z.ZodType<FunctionResultEntry$Outbound, z.ZodTypeDef, FunctionResultEntry>;

declare type FunctionResultEntry = {
    object?: FunctionResultEntryObject | undefined;
    type?: FunctionResultEntryType | undefined;
    createdAt?: Date | undefined;
    completedAt?: Date | null | undefined;
    id?: string | undefined;
    toolCallId: string;
    result: string;
};

declare function functionResultEntryFromJSON(jsonString: string): Result<FunctionResultEntry, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionResultEntryObject$ {
    /** @deprecated use `FunctionResultEntryObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
    /** @deprecated use `FunctionResultEntryObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
}

/** @internal */
declare const FunctionResultEntryObject$inboundSchema: z.ZodNativeEnum<typeof FunctionResultEntryObject>;

/** @internal */
declare const FunctionResultEntryObject$outboundSchema: z.ZodNativeEnum<typeof FunctionResultEntryObject>;

declare const FunctionResultEntryObject: {
    readonly Entry: "entry";
};

declare type FunctionResultEntryObject = ClosedEnum<typeof FunctionResultEntryObject>;

declare function functionResultEntryToJSON(functionResultEntry: FunctionResultEntry): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionResultEntryType$ {
    /** @deprecated use `FunctionResultEntryType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly FunctionResult: "function.result";
    }>;
    /** @deprecated use `FunctionResultEntryType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly FunctionResult: "function.result";
    }>;
}

/** @internal */
declare const FunctionResultEntryType$inboundSchema: z.ZodNativeEnum<typeof FunctionResultEntryType>;

/** @internal */
declare const FunctionResultEntryType$outboundSchema: z.ZodNativeEnum<typeof FunctionResultEntryType>;

declare const FunctionResultEntryType: {
    readonly FunctionResult: "function.result";
};

declare type FunctionResultEntryType = ClosedEnum<typeof FunctionResultEntryType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionT$ {
    /** @deprecated use `FunctionT$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionT, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionT$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionT$Outbound, z.ZodTypeDef, FunctionT>;
    /** @deprecated use `FunctionT$Outbound` instead. */
    type Outbound = FunctionT$Outbound;
}

/** @internal */
declare const FunctionT$inboundSchema: z.ZodType<FunctionT, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionT$Outbound = {
    name: string;
    description?: string | undefined;
    strict?: boolean | undefined;
    parameters: {
        [k: string]: any;
    };
};

/** @internal */
declare const FunctionT$outboundSchema: z.ZodType<FunctionT$Outbound, z.ZodTypeDef, FunctionT>;

declare type FunctionT = {
    name: string;
    description?: string | undefined;
    strict?: boolean | undefined;
    parameters: {
        [k: string]: any;
    };
};

declare function functionToJSON(functionT: FunctionT): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionTool$ {
    /** @deprecated use `FunctionTool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<FunctionTool, z.ZodTypeDef, unknown>;
    /** @deprecated use `FunctionTool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<FunctionTool$Outbound, z.ZodTypeDef, FunctionTool>;
    /** @deprecated use `FunctionTool$Outbound` instead. */
    type Outbound = FunctionTool$Outbound;
}

/** @internal */
declare const FunctionTool$inboundSchema: z.ZodType<FunctionTool, z.ZodTypeDef, unknown>;

/** @internal */
declare type FunctionTool$Outbound = {
    type: string;
    function: FunctionT$Outbound;
};

/** @internal */
declare const FunctionTool$outboundSchema: z.ZodType<FunctionTool$Outbound, z.ZodTypeDef, FunctionTool>;

declare type FunctionTool = {
    type?: FunctionToolType | undefined;
    function: FunctionT;
};

declare function functionToolFromJSON(jsonString: string): Result<FunctionTool, SDKValidationError>;

declare function functionToolToJSON(functionTool: FunctionTool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace FunctionToolType$ {
    /** @deprecated use `FunctionToolType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Function: "function";
    }>;
    /** @deprecated use `FunctionToolType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Function: "function";
    }>;
}

/** @internal */
declare const FunctionToolType$inboundSchema: z.ZodNativeEnum<typeof FunctionToolType>;

/** @internal */
declare const FunctionToolType$outboundSchema: z.ZodNativeEnum<typeof FunctionToolType>;

declare const FunctionToolType: {
    readonly Function: "function";
};

declare type FunctionToolType = ClosedEnum<typeof FunctionToolType>;

/**
 * Determines the MIME content type based on a file's extension.
 * Returns null if the extension is not recognized.
 */
declare function getContentTypeFromFileName(fileName: string): string | null;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace GithubRepositoryIn$ {
    /** @deprecated use `GithubRepositoryIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<GithubRepositoryIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `GithubRepositoryIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<GithubRepositoryIn$Outbound, z.ZodTypeDef, GithubRepositoryIn>;
    /** @deprecated use `GithubRepositoryIn$Outbound` instead. */
    type Outbound = GithubRepositoryIn$Outbound;
}

/** @internal */
declare const GithubRepositoryIn$inboundSchema: z.ZodType<GithubRepositoryIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type GithubRepositoryIn$Outbound = {
    type: string;
    name: string;
    owner: string;
    ref?: string | null | undefined;
    weight: number;
    token: string;
};

/** @internal */
declare const GithubRepositoryIn$outboundSchema: z.ZodType<GithubRepositoryIn$Outbound, z.ZodTypeDef, GithubRepositoryIn>;

declare type GithubRepositoryIn = {
    type?: GithubRepositoryInType | undefined;
    name: string;
    owner: string;
    ref?: string | null | undefined;
    weight?: number | undefined;
    token: string;
};

declare function githubRepositoryInFromJSON(jsonString: string): Result<GithubRepositoryIn, SDKValidationError>;

declare function githubRepositoryInToJSON(githubRepositoryIn: GithubRepositoryIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace GithubRepositoryInType$ {
    /** @deprecated use `GithubRepositoryInType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Github: "github";
    }>;
    /** @deprecated use `GithubRepositoryInType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Github: "github";
    }>;
}

/** @internal */
declare const GithubRepositoryInType$inboundSchema: z.ZodNativeEnum<typeof GithubRepositoryInType>;

/** @internal */
declare const GithubRepositoryInType$outboundSchema: z.ZodNativeEnum<typeof GithubRepositoryInType>;

declare const GithubRepositoryInType: {
    readonly Github: "github";
};

declare type GithubRepositoryInType = ClosedEnum<typeof GithubRepositoryInType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace GithubRepositoryOut$ {
    /** @deprecated use `GithubRepositoryOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<GithubRepositoryOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `GithubRepositoryOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<GithubRepositoryOut$Outbound, z.ZodTypeDef, GithubRepositoryOut>;
    /** @deprecated use `GithubRepositoryOut$Outbound` instead. */
    type Outbound = GithubRepositoryOut$Outbound;
}

/** @internal */
declare const GithubRepositoryOut$inboundSchema: z.ZodType<GithubRepositoryOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type GithubRepositoryOut$Outbound = {
    type: string;
    name: string;
    owner: string;
    ref?: string | null | undefined;
    weight: number;
    commit_id: string;
};

/** @internal */
declare const GithubRepositoryOut$outboundSchema: z.ZodType<GithubRepositoryOut$Outbound, z.ZodTypeDef, GithubRepositoryOut>;

declare type GithubRepositoryOut = {
    type?: GithubRepositoryOutType | undefined;
    name: string;
    owner: string;
    ref?: string | null | undefined;
    weight?: number | undefined;
    commitId: string;
};

declare function githubRepositoryOutFromJSON(jsonString: string): Result<GithubRepositoryOut, SDKValidationError>;

declare function githubRepositoryOutToJSON(githubRepositoryOut: GithubRepositoryOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace GithubRepositoryOutType$ {
    /** @deprecated use `GithubRepositoryOutType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Github: "github";
    }>;
    /** @deprecated use `GithubRepositoryOutType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Github: "github";
    }>;
}

/** @internal */
declare const GithubRepositoryOutType$inboundSchema: z.ZodNativeEnum<typeof GithubRepositoryOutType>;

/** @internal */
declare const GithubRepositoryOutType$outboundSchema: z.ZodNativeEnum<typeof GithubRepositoryOutType>;

declare const GithubRepositoryOutType: {
    readonly Github: "github";
};

declare type GithubRepositoryOutType = ClosedEnum<typeof GithubRepositoryOutType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace HandoffExecution$ {
    /** @deprecated use `HandoffExecution$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
    /** @deprecated use `HandoffExecution$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Client: "client";
        readonly Server: "server";
    }>;
}

/** @internal */
declare const HandoffExecution$inboundSchema: z.ZodNativeEnum<typeof HandoffExecution>;

/** @internal */
declare const HandoffExecution$outboundSchema: z.ZodNativeEnum<typeof HandoffExecution>;

declare const HandoffExecution: {
    readonly Client: "client";
    readonly Server: "server";
};

declare type HandoffExecution = ClosedEnum<typeof HandoffExecution>;

declare type HookContext = {
    baseURL: string | URL;
    operationID: string;
    oAuth2Scopes: string[] | null;
    securitySource?: any | (() => Promise<any>);
    retryConfig: RetryConfig;
    resolvedSecurity: SecurityState | null;
    options: SDKOptions;
};

declare interface Hooks {
    /** Registers a hook to be used by the SDK for initialization event. */
    registerSDKInitHook(hook: SDKInitHook): void;
    /** Registers a hook to be used by the SDK for to modify `Request` construction. */
    registerBeforeCreateRequestHook(hook: BeforeCreateRequestHook): void;
    /** Registers a hook to be used by the SDK for the before request event. */
    registerBeforeRequestHook(hook: BeforeRequestHook_2): void;
    /** Registers a hook to be used by the SDK for the after success event. */
    registerAfterSuccessHook(hook: AfterSuccessHook): void;
    /** Registers a hook to be used by the SDK for the after error event. */
    registerAfterErrorHook(hook: AfterErrorHook): void;
}

export declare class HTTPClient {
    private options;
    private fetcher;
    private requestHooks;
    private requestErrorHooks;
    private responseHooks;
    constructor(options?: HTTPClientOptions);
    request(request: Request): Promise<Response>;
    /**
     * Registers a hook that is called before a request is made. The hook function
     * can mutate the request or return a new request. This may be useful to add
     * additional information to request such as request IDs and tracing headers.
     */
    addHook(hook: "beforeRequest", fn: BeforeRequestHook): this;
    /**
     * Registers a hook that is called when a request cannot be made due to a
     * network error.
     */
    addHook(hook: "requestError", fn: RequestErrorHook): this;
    /**
     * Registers a hook that is called when a response has been received from the
     * server.
     */
    addHook(hook: "response", fn: ResponseHook): this;
    /** Removes a hook that was previously registered with `addHook`. */
    removeHook(hook: "beforeRequest", fn: BeforeRequestHook): this;
    /** Removes a hook that was previously registered with `addHook`. */
    removeHook(hook: "requestError", fn: RequestErrorHook): this;
    /** Removes a hook that was previously registered with `addHook`. */
    removeHook(hook: "response", fn: ResponseHook): this;
    clone(): HTTPClient;
}

/**
 * Base class for all HTTP errors.
 */
declare class HTTPClientError extends Error {
    /** The underlying cause of the error. */
    readonly cause: unknown;
    name: string;
    constructor(message: string, opts?: {
        cause?: unknown;
    });
}

export declare interface HTTPClientOptions {
    fetcher?: Fetcher;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Hyperparameters$ {
    /** @deprecated use `Hyperparameters$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Hyperparameters, z.ZodTypeDef, unknown>;
    /** @deprecated use `Hyperparameters$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Hyperparameters$Outbound, z.ZodTypeDef, Hyperparameters>;
    /** @deprecated use `Hyperparameters$Outbound` instead. */
    type Outbound = Hyperparameters$Outbound;
}

/** @internal */
declare const Hyperparameters$inboundSchema: z.ZodType<Hyperparameters, z.ZodTypeDef, unknown>;

/** @internal */
declare type Hyperparameters$Outbound = CompletionTrainingParametersIn$Outbound | ClassifierTrainingParametersIn$Outbound;

/** @internal */
declare const Hyperparameters$outboundSchema: z.ZodType<Hyperparameters$Outbound, z.ZodTypeDef, Hyperparameters>;

declare type Hyperparameters = CompletionTrainingParametersIn | ClassifierTrainingParametersIn;

declare function hyperparametersFromJSON(jsonString: string): Result<Hyperparameters, SDKValidationError>;

declare function hyperparametersToJSON(hyperparameters: Hyperparameters): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ImageGenerationTool$ {
    /** @deprecated use `ImageGenerationTool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ImageGenerationTool, z.ZodTypeDef, unknown>;
    /** @deprecated use `ImageGenerationTool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ImageGenerationTool$Outbound, z.ZodTypeDef, ImageGenerationTool>;
    /** @deprecated use `ImageGenerationTool$Outbound` instead. */
    type Outbound = ImageGenerationTool$Outbound;
}

/** @internal */
declare const ImageGenerationTool$inboundSchema: z.ZodType<ImageGenerationTool, z.ZodTypeDef, unknown>;

/** @internal */
declare type ImageGenerationTool$Outbound = {
    type: string;
};

/** @internal */
declare const ImageGenerationTool$outboundSchema: z.ZodType<ImageGenerationTool$Outbound, z.ZodTypeDef, ImageGenerationTool>;

declare type ImageGenerationTool = {
    type?: ImageGenerationToolType | undefined;
};

declare function imageGenerationToolFromJSON(jsonString: string): Result<ImageGenerationTool, SDKValidationError>;

declare function imageGenerationToolToJSON(imageGenerationTool: ImageGenerationTool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ImageGenerationToolType$ {
    /** @deprecated use `ImageGenerationToolType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ImageGeneration: "image_generation";
    }>;
    /** @deprecated use `ImageGenerationToolType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ImageGeneration: "image_generation";
    }>;
}

/** @internal */
declare const ImageGenerationToolType$inboundSchema: z.ZodNativeEnum<typeof ImageGenerationToolType>;

/** @internal */
declare const ImageGenerationToolType$outboundSchema: z.ZodNativeEnum<typeof ImageGenerationToolType>;

declare const ImageGenerationToolType: {
    readonly ImageGeneration: "image_generation";
};

declare type ImageGenerationToolType = ClosedEnum<typeof ImageGenerationToolType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ImageURL$ {
    /** @deprecated use `ImageURL$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ImageURL, z.ZodTypeDef, unknown>;
    /** @deprecated use `ImageURL$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ImageURL$Outbound, z.ZodTypeDef, ImageURL>;
    /** @deprecated use `ImageURL$Outbound` instead. */
    type Outbound = ImageURL$Outbound;
}

/** @internal */
declare const ImageURL$inboundSchema: z.ZodType<ImageURL, z.ZodTypeDef, unknown>;

/** @internal */
declare type ImageURL$Outbound = {
    url: string;
    detail?: string | null | undefined;
};

/** @internal */
declare const ImageURL$outboundSchema: z.ZodType<ImageURL$Outbound, z.ZodTypeDef, ImageURL>;

declare type ImageURL = {
    url: string;
    detail?: string | null | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ImageURLChunk$ {
    /** @deprecated use `ImageURLChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ImageURLChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `ImageURLChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ImageURLChunk$Outbound, z.ZodTypeDef, ImageURLChunk>;
    /** @deprecated use `ImageURLChunk$Outbound` instead. */
    type Outbound = ImageURLChunk$Outbound;
}

/** @internal */
declare const ImageURLChunk$inboundSchema: z.ZodType<ImageURLChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type ImageURLChunk$Outbound = {
    image_url: ImageURL$Outbound | string;
    type: string;
};

/** @internal */
declare const ImageURLChunk$outboundSchema: z.ZodType<ImageURLChunk$Outbound, z.ZodTypeDef, ImageURLChunk>;

/**
 * {"type":"image_url","image_url":{"url":"data:image/png;base64,iVBORw0
 */
declare type ImageURLChunk = {
    imageUrl: ImageURL | string;
    type?: ImageURLChunkType | undefined;
};

declare function imageURLChunkFromJSON(jsonString: string): Result<ImageURLChunk, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ImageURLChunkImageURL$ {
    /** @deprecated use `ImageURLChunkImageURL$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ImageURLChunkImageURL, z.ZodTypeDef, unknown>;
    /** @deprecated use `ImageURLChunkImageURL$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ImageURLChunkImageURL$Outbound, z.ZodTypeDef, ImageURLChunkImageURL>;
    /** @deprecated use `ImageURLChunkImageURL$Outbound` instead. */
    type Outbound = ImageURLChunkImageURL$Outbound;
}

/** @internal */
declare const ImageURLChunkImageURL$inboundSchema: z.ZodType<ImageURLChunkImageURL, z.ZodTypeDef, unknown>;

/** @internal */
declare type ImageURLChunkImageURL$Outbound = ImageURL$Outbound | string;

/** @internal */
declare const ImageURLChunkImageURL$outboundSchema: z.ZodType<ImageURLChunkImageURL$Outbound, z.ZodTypeDef, ImageURLChunkImageURL>;

declare type ImageURLChunkImageURL = ImageURL | string;

declare function imageURLChunkImageURLFromJSON(jsonString: string): Result<ImageURLChunkImageURL, SDKValidationError>;

declare function imageURLChunkImageURLToJSON(imageURLChunkImageURL: ImageURLChunkImageURL): string;

declare function imageURLChunkToJSON(imageURLChunk: ImageURLChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ImageURLChunkType$ {
    /** @deprecated use `ImageURLChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ImageUrl: "image_url";
    }>;
    /** @deprecated use `ImageURLChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ImageUrl: "image_url";
    }>;
}

/** @internal */
declare const ImageURLChunkType$inboundSchema: z.ZodNativeEnum<typeof ImageURLChunkType>;

/** @internal */
declare const ImageURLChunkType$outboundSchema: z.ZodNativeEnum<typeof ImageURLChunkType>;

declare const ImageURLChunkType: {
    readonly ImageUrl: "image_url";
};

declare type ImageURLChunkType = ClosedEnum<typeof ImageURLChunkType>;

declare function imageURLFromJSON(jsonString: string): Result<ImageURL, SDKValidationError>;

declare function imageURLToJSON(imageURL: ImageURL): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace InputEntries$ {
    /** @deprecated use `InputEntries$inboundSchema` instead. */
    const inboundSchema: z.ZodType<InputEntries, z.ZodTypeDef, unknown>;
    /** @deprecated use `InputEntries$outboundSchema` instead. */
    const outboundSchema: z.ZodType<InputEntries$Outbound, z.ZodTypeDef, InputEntries>;
    /** @deprecated use `InputEntries$Outbound` instead. */
    type Outbound = InputEntries$Outbound;
}

/** @internal */
declare const InputEntries$inboundSchema: z.ZodType<InputEntries, z.ZodTypeDef, unknown>;

/** @internal */
declare type InputEntries$Outbound = AgentHandoffEntry$Outbound | FunctionCallEntry$Outbound | MessageInputEntry$Outbound | FunctionResultEntry$Outbound | ToolExecutionEntry$Outbound | MessageOutputEntry$Outbound;

/** @internal */
declare const InputEntries$outboundSchema: z.ZodType<InputEntries$Outbound, z.ZodTypeDef, InputEntries>;

declare type InputEntries = AgentHandoffEntry | FunctionCallEntry | MessageInputEntry | FunctionResultEntry | ToolExecutionEntry | MessageOutputEntry;

declare function inputEntriesFromJSON(jsonString: string): Result<InputEntries, SDKValidationError>;

declare function inputEntriesToJSON(inputEntries: InputEntries): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Inputs$ {
    /** @deprecated use `Inputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Inputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `Inputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Inputs$Outbound, z.ZodTypeDef, Inputs>;
    /** @deprecated use `Inputs$Outbound` instead. */
    type Outbound = Inputs$Outbound;
}

/** @internal */
declare const Inputs$inboundSchema: z.ZodType<Inputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type Inputs$Outbound = InstructRequestInputs$Outbound | Array<InstructRequest$Outbound>;

/** @internal */
declare const Inputs$outboundSchema: z.ZodType<Inputs$Outbound, z.ZodTypeDef, Inputs>;

/**
 * Chat to classify
 */
declare type Inputs = InstructRequestInputs | Array<InstructRequest>;

declare function inputsFromJSON(jsonString: string): Result<Inputs, SDKValidationError>;

declare function inputsToJSON(inputs: Inputs): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace InstructRequest$ {
    /** @deprecated use `InstructRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<InstructRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `InstructRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<InstructRequest$Outbound, z.ZodTypeDef, InstructRequest>;
    /** @deprecated use `InstructRequest$Outbound` instead. */
    type Outbound = InstructRequest$Outbound;
}

/** @internal */
declare const InstructRequest$inboundSchema: z.ZodType<InstructRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type InstructRequest$Outbound = {
    messages: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>;
};

/** @internal */
declare const InstructRequest$outboundSchema: z.ZodType<InstructRequest$Outbound, z.ZodTypeDef, InstructRequest>;

declare type InstructRequest = {
    messages: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>;
};

declare function instructRequestFromJSON(jsonString: string): Result<InstructRequest, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace InstructRequestInputs$ {
    /** @deprecated use `InstructRequestInputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<InstructRequestInputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `InstructRequestInputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<InstructRequestInputs$Outbound, z.ZodTypeDef, InstructRequestInputs>;
    /** @deprecated use `InstructRequestInputs$Outbound` instead. */
    type Outbound = InstructRequestInputs$Outbound;
}

/** @internal */
declare const InstructRequestInputs$inboundSchema: z.ZodType<InstructRequestInputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type InstructRequestInputs$Outbound = {
    messages: Array<(SystemMessage$Outbound & {
        role: "system";
    }) | (ToolMessage$Outbound & {
        role: "tool";
    }) | (UserMessage$Outbound & {
        role: "user";
    }) | (AssistantMessage$Outbound & {
        role: "assistant";
    })>;
};

/** @internal */
declare const InstructRequestInputs$outboundSchema: z.ZodType<InstructRequestInputs$Outbound, z.ZodTypeDef, InstructRequestInputs>;

declare type InstructRequestInputs = {
    messages: Array<(SystemMessage & {
        role: "system";
    }) | (ToolMessage & {
        role: "tool";
    }) | (UserMessage & {
        role: "user";
    }) | (AssistantMessage & {
        role: "assistant";
    })>;
};

declare function instructRequestInputsFromJSON(jsonString: string): Result<InstructRequestInputs, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace InstructRequestInputsMessages$ {
    /** @deprecated use `InstructRequestInputsMessages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<InstructRequestInputsMessages, z.ZodTypeDef, unknown>;
    /** @deprecated use `InstructRequestInputsMessages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<InstructRequestInputsMessages$Outbound, z.ZodTypeDef, InstructRequestInputsMessages>;
    /** @deprecated use `InstructRequestInputsMessages$Outbound` instead. */
    type Outbound = InstructRequestInputsMessages$Outbound;
}

/** @internal */
declare const InstructRequestInputsMessages$inboundSchema: z.ZodType<InstructRequestInputsMessages, z.ZodTypeDef, unknown>;

/** @internal */
declare type InstructRequestInputsMessages$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const InstructRequestInputsMessages$outboundSchema: z.ZodType<InstructRequestInputsMessages$Outbound, z.ZodTypeDef, InstructRequestInputsMessages>;

declare type InstructRequestInputsMessages = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function instructRequestInputsMessagesFromJSON(jsonString: string): Result<InstructRequestInputsMessages, SDKValidationError>;

declare function instructRequestInputsMessagesToJSON(instructRequestInputsMessages: InstructRequestInputsMessages): string;

declare function instructRequestInputsToJSON(instructRequestInputs: InstructRequestInputs): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace InstructRequestMessages$ {
    /** @deprecated use `InstructRequestMessages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<InstructRequestMessages, z.ZodTypeDef, unknown>;
    /** @deprecated use `InstructRequestMessages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<InstructRequestMessages$Outbound, z.ZodTypeDef, InstructRequestMessages>;
    /** @deprecated use `InstructRequestMessages$Outbound` instead. */
    type Outbound = InstructRequestMessages$Outbound;
}

/** @internal */
declare const InstructRequestMessages$inboundSchema: z.ZodType<InstructRequestMessages, z.ZodTypeDef, unknown>;

/** @internal */
declare type InstructRequestMessages$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const InstructRequestMessages$outboundSchema: z.ZodType<InstructRequestMessages$Outbound, z.ZodTypeDef, InstructRequestMessages>;

declare type InstructRequestMessages = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function instructRequestMessagesFromJSON(jsonString: string): Result<InstructRequestMessages, SDKValidationError>;

declare function instructRequestMessagesToJSON(instructRequestMessages: InstructRequestMessages): string;

declare function instructRequestToJSON(instructRequest: InstructRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Integrations$ {
    /** @deprecated use `Integrations$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegrationOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `Integrations$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegrationOut$Outbound, z.ZodTypeDef, WandbIntegrationOut>;
    /** @deprecated use `Integrations$Outbound` instead. */
    type Outbound = Integrations$Outbound;
}

/** @internal */
declare const Integrations$inboundSchema: z.ZodType<Integrations, z.ZodTypeDef, unknown>;

/** @internal */
declare type Integrations$Outbound = WandbIntegrationOut$Outbound;

/** @internal */
declare const Integrations$outboundSchema: z.ZodType<Integrations$Outbound, z.ZodTypeDef, Integrations>;

declare type Integrations = WandbIntegrationOut;

declare function integrationsFromJSON(jsonString: string): Result<Integrations, SDKValidationError>;

declare function integrationsToJSON(integrations: Integrations): string;

/**
 * An error that is raised when any inputs used to create a request are invalid.
 */
declare class InvalidRequestError extends HTTPClientError {
    name: string;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobIn$ {
    /** @deprecated use `JobIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobIn$Outbound, z.ZodTypeDef, JobIn>;
    /** @deprecated use `JobIn$Outbound` instead. */
    type Outbound = JobIn$Outbound;
}

/** @internal */
declare const JobIn$inboundSchema: z.ZodType<JobIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobIn$Outbound = {
    model: string;
    training_files?: Array<TrainingFile$Outbound> | undefined;
    validation_files?: Array<string> | null | undefined;
    suffix?: string | null | undefined;
    integrations?: Array<WandbIntegration$Outbound> | null | undefined;
    auto_start?: boolean | undefined;
    invalid_sample_skip_percentage: number;
    job_type?: string | null | undefined;
    hyperparameters: CompletionTrainingParametersIn$Outbound | ClassifierTrainingParametersIn$Outbound;
    repositories?: Array<GithubRepositoryIn$Outbound> | null | undefined;
    classifier_targets?: Array<ClassifierTargetIn$Outbound> | null | undefined;
};

/** @internal */
declare const JobIn$outboundSchema: z.ZodType<JobIn$Outbound, z.ZodTypeDef, JobIn>;

declare type JobIn = {
    /**
     * The name of the model to fine-tune.
     */
    model: string;
    trainingFiles?: Array<TrainingFile> | undefined;
    /**
     * A list containing the IDs of uploaded files that contain validation data. If you provide these files, the data is used to generate validation metrics periodically during fine-tuning. These metrics can be viewed in `checkpoints` when getting the status of a running fine-tuning job. The same data should not be present in both train and validation files.
     */
    validationFiles?: Array<string> | null | undefined;
    /**
     * A string that will be added to your fine-tuning model name. For example, a suffix of "my-great-model" would produce a model name like `ft:open-mistral-7b:my-great-model:xxx...`
     */
    suffix?: string | null | undefined;
    /**
     * A list of integrations to enable for your fine-tuning job.
     */
    integrations?: Array<WandbIntegration> | null | undefined;
    /**
     * This field will be required in a future release.
     */
    autoStart?: boolean | undefined;
    invalidSampleSkipPercentage?: number | undefined;
    jobType?: FineTuneableModelType | null | undefined;
    hyperparameters: CompletionTrainingParametersIn | ClassifierTrainingParametersIn;
    repositories?: Array<GithubRepositoryIn> | null | undefined;
    classifierTargets?: Array<ClassifierTargetIn> | null | undefined;
};

declare function jobInFromJSON(jsonString: string): Result<JobIn, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobInIntegrations$ {
    /** @deprecated use `JobInIntegrations$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegration, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobInIntegrations$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegration$Outbound, z.ZodTypeDef, WandbIntegration>;
    /** @deprecated use `JobInIntegrations$Outbound` instead. */
    type Outbound = JobInIntegrations$Outbound;
}

/** @internal */
declare const JobInIntegrations$inboundSchema: z.ZodType<JobInIntegrations, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobInIntegrations$Outbound = WandbIntegration$Outbound;

/** @internal */
declare const JobInIntegrations$outboundSchema: z.ZodType<JobInIntegrations$Outbound, z.ZodTypeDef, JobInIntegrations>;

declare type JobInIntegrations = WandbIntegration;

declare function jobInIntegrationsFromJSON(jsonString: string): Result<JobInIntegrations, SDKValidationError>;

declare function jobInIntegrationsToJSON(jobInIntegrations: JobInIntegrations): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobInRepositories$ {
    /** @deprecated use `JobInRepositories$inboundSchema` instead. */
    const inboundSchema: z.ZodType<GithubRepositoryIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobInRepositories$outboundSchema` instead. */
    const outboundSchema: z.ZodType<GithubRepositoryIn$Outbound, z.ZodTypeDef, GithubRepositoryIn>;
    /** @deprecated use `JobInRepositories$Outbound` instead. */
    type Outbound = JobInRepositories$Outbound;
}

/** @internal */
declare const JobInRepositories$inboundSchema: z.ZodType<JobInRepositories, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobInRepositories$Outbound = GithubRepositoryIn$Outbound;

/** @internal */
declare const JobInRepositories$outboundSchema: z.ZodType<JobInRepositories$Outbound, z.ZodTypeDef, JobInRepositories>;

declare type JobInRepositories = GithubRepositoryIn;

declare function jobInRepositoriesFromJSON(jsonString: string): Result<JobInRepositories, SDKValidationError>;

declare function jobInRepositoriesToJSON(jobInRepositories: JobInRepositories): string;

declare function jobInToJSON(jobIn: JobIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobMetadataOut$ {
    /** @deprecated use `JobMetadataOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobMetadataOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobMetadataOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobMetadataOut$Outbound, z.ZodTypeDef, JobMetadataOut>;
    /** @deprecated use `JobMetadataOut$Outbound` instead. */
    type Outbound = JobMetadataOut$Outbound;
}

/** @internal */
declare const JobMetadataOut$inboundSchema: z.ZodType<JobMetadataOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobMetadataOut$Outbound = {
    expected_duration_seconds?: number | null | undefined;
    cost?: number | null | undefined;
    cost_currency?: string | null | undefined;
    train_tokens_per_step?: number | null | undefined;
    train_tokens?: number | null | undefined;
    data_tokens?: number | null | undefined;
    estimated_start_time?: number | null | undefined;
};

/** @internal */
declare const JobMetadataOut$outboundSchema: z.ZodType<JobMetadataOut$Outbound, z.ZodTypeDef, JobMetadataOut>;

declare type JobMetadataOut = {
    expectedDurationSeconds?: number | null | undefined;
    cost?: number | null | undefined;
    costCurrency?: string | null | undefined;
    trainTokensPerStep?: number | null | undefined;
    trainTokens?: number | null | undefined;
    dataTokens?: number | null | undefined;
    estimatedStartTime?: number | null | undefined;
};

declare function jobMetadataOutFromJSON(jsonString: string): Result<JobMetadataOut, SDKValidationError>;

declare function jobMetadataOutToJSON(jobMetadataOut: JobMetadataOut): string;

declare class Jobs extends ClientSDK {
    /**
     * Get Fine Tuning Jobs
     *
     * @remarks
     * Get a list of fine-tuning jobs for your organization and user.
     */
    list(request?: operations.JobsApiRoutesFineTuningGetFineTuningJobsRequest | undefined, options?: RequestOptions): Promise<components.JobsOut>;
    /**
     * Create Fine Tuning Job
     *
     * @remarks
     * Create a new fine-tuning job, it will be queued for processing.
     */
    create(request: components.JobIn, options?: RequestOptions): Promise<operations.JobsApiRoutesFineTuningCreateFineTuningJobResponse>;
    /**
     * Get Fine Tuning Job
     *
     * @remarks
     * Get a fine-tuned job details by its UUID.
     */
    get(request: operations.JobsApiRoutesFineTuningGetFineTuningJobRequest, options?: RequestOptions): Promise<operations.JobsApiRoutesFineTuningGetFineTuningJobResponse>;
    /**
     * Cancel Fine Tuning Job
     *
     * @remarks
     * Request the cancellation of a fine tuning job.
     */
    cancel(request: operations.JobsApiRoutesFineTuningCancelFineTuningJobRequest, options?: RequestOptions): Promise<operations.JobsApiRoutesFineTuningCancelFineTuningJobResponse>;
    /**
     * Start Fine Tuning Job
     *
     * @remarks
     * Request the start of a validated fine tuning job.
     */
    start(request: operations.JobsApiRoutesFineTuningStartFineTuningJobRequest, options?: RequestOptions): Promise<operations.JobsApiRoutesFineTuningStartFineTuningJobResponse>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesBatchCancelBatchJobRequest$ {
    /** @deprecated use `JobsApiRoutesBatchCancelBatchJobRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesBatchCancelBatchJobRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesBatchCancelBatchJobRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesBatchCancelBatchJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesBatchCancelBatchJobRequest>;
    /** @deprecated use `JobsApiRoutesBatchCancelBatchJobRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesBatchCancelBatchJobRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesBatchCancelBatchJobRequest$inboundSchema: z.ZodType<JobsApiRoutesBatchCancelBatchJobRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesBatchCancelBatchJobRequest$Outbound = {
    job_id: string;
};

/** @internal */
declare const JobsApiRoutesBatchCancelBatchJobRequest$outboundSchema: z.ZodType<JobsApiRoutesBatchCancelBatchJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesBatchCancelBatchJobRequest>;

declare type JobsApiRoutesBatchCancelBatchJobRequest = {
    jobId: string;
};

declare function jobsApiRoutesBatchCancelBatchJobRequestFromJSON(jsonString: string): Result<JobsApiRoutesBatchCancelBatchJobRequest, SDKValidationError>;

declare function jobsApiRoutesBatchCancelBatchJobRequestToJSON(jobsApiRoutesBatchCancelBatchJobRequest: JobsApiRoutesBatchCancelBatchJobRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesBatchGetBatchJobRequest$ {
    /** @deprecated use `JobsApiRoutesBatchGetBatchJobRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesBatchGetBatchJobRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesBatchGetBatchJobRequest>;
    /** @deprecated use `JobsApiRoutesBatchGetBatchJobRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesBatchGetBatchJobRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesBatchGetBatchJobRequest$inboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesBatchGetBatchJobRequest$Outbound = {
    job_id: string;
};

/** @internal */
declare const JobsApiRoutesBatchGetBatchJobRequest$outboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesBatchGetBatchJobRequest>;

declare type JobsApiRoutesBatchGetBatchJobRequest = {
    jobId: string;
};

declare function jobsApiRoutesBatchGetBatchJobRequestFromJSON(jsonString: string): Result<JobsApiRoutesBatchGetBatchJobRequest, SDKValidationError>;

declare function jobsApiRoutesBatchGetBatchJobRequestToJSON(jobsApiRoutesBatchGetBatchJobRequest: JobsApiRoutesBatchGetBatchJobRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesBatchGetBatchJobsRequest$ {
    /** @deprecated use `JobsApiRoutesBatchGetBatchJobsRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobsRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesBatchGetBatchJobsRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobsRequest$Outbound, z.ZodTypeDef, JobsApiRoutesBatchGetBatchJobsRequest>;
    /** @deprecated use `JobsApiRoutesBatchGetBatchJobsRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesBatchGetBatchJobsRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesBatchGetBatchJobsRequest$inboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobsRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesBatchGetBatchJobsRequest$Outbound = {
    page: number;
    page_size: number;
    model?: string | null | undefined;
    agent_id?: string | null | undefined;
    metadata?: {
        [k: string]: any;
    } | null | undefined;
    created_after?: string | null | undefined;
    created_by_me: boolean;
    status?: Array<string> | null | undefined;
};

/** @internal */
declare const JobsApiRoutesBatchGetBatchJobsRequest$outboundSchema: z.ZodType<JobsApiRoutesBatchGetBatchJobsRequest$Outbound, z.ZodTypeDef, JobsApiRoutesBatchGetBatchJobsRequest>;

declare type JobsApiRoutesBatchGetBatchJobsRequest = {
    page?: number | undefined;
    pageSize?: number | undefined;
    model?: string | null | undefined;
    agentId?: string | null | undefined;
    metadata?: {
        [k: string]: any;
    } | null | undefined;
    createdAfter?: Date | null | undefined;
    createdByMe?: boolean | undefined;
    status?: Array<components.BatchJobStatus> | null | undefined;
};

declare function jobsApiRoutesBatchGetBatchJobsRequestFromJSON(jsonString: string): Result<JobsApiRoutesBatchGetBatchJobsRequest, SDKValidationError>;

declare function jobsApiRoutesBatchGetBatchJobsRequestToJSON(jobsApiRoutesBatchGetBatchJobsRequest: JobsApiRoutesBatchGetBatchJobsRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningArchiveFineTunedModelRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningArchiveFineTunedModelRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningArchiveFineTunedModelRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningArchiveFineTunedModelRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningArchiveFineTunedModelRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningArchiveFineTunedModelRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningArchiveFineTunedModelRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningArchiveFineTunedModelRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningArchiveFineTunedModelRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningArchiveFineTunedModelRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningArchiveFineTunedModelRequest$Outbound = {
    model_id: string;
};

/** @internal */
declare const JobsApiRoutesFineTuningArchiveFineTunedModelRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningArchiveFineTunedModelRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningArchiveFineTunedModelRequest>;

declare type JobsApiRoutesFineTuningArchiveFineTunedModelRequest = {
    /**
     * The ID of the model to archive.
     */
    modelId: string;
};

declare function jobsApiRoutesFineTuningArchiveFineTunedModelRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningArchiveFineTunedModelRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningArchiveFineTunedModelRequestToJSON(jobsApiRoutesFineTuningArchiveFineTunedModelRequest: JobsApiRoutesFineTuningArchiveFineTunedModelRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningCancelFineTuningJobRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningCancelFineTuningJobRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningCancelFineTuningJobRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningCancelFineTuningJobRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningCancelFineTuningJobRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningCancelFineTuningJobRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningCancelFineTuningJobRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningCancelFineTuningJobRequest$Outbound = {
    job_id: string;
};

/** @internal */
declare const JobsApiRoutesFineTuningCancelFineTuningJobRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningCancelFineTuningJobRequest>;

declare type JobsApiRoutesFineTuningCancelFineTuningJobRequest = {
    /**
     * The ID of the job to cancel.
     */
    jobId: string;
};

declare function jobsApiRoutesFineTuningCancelFineTuningJobRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningCancelFineTuningJobRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningCancelFineTuningJobRequestToJSON(jobsApiRoutesFineTuningCancelFineTuningJobRequest: JobsApiRoutesFineTuningCancelFineTuningJobRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningCancelFineTuningJobResponse$ {
    /** @deprecated use `JobsApiRoutesFineTuningCancelFineTuningJobResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningCancelFineTuningJobResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningCancelFineTuningJobResponse>;
    /** @deprecated use `JobsApiRoutesFineTuningCancelFineTuningJobResponse$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningCancelFineTuningJobResponse$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningCancelFineTuningJobResponse$inboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningCancelFineTuningJobResponse$Outbound = (components.ClassifierDetailedJobOut$Outbound & {
    job_type: "classifier";
}) | (components.CompletionDetailedJobOut$Outbound & {
    job_type: "completion";
});

/** @internal */
declare const JobsApiRoutesFineTuningCancelFineTuningJobResponse$outboundSchema: z.ZodType<JobsApiRoutesFineTuningCancelFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningCancelFineTuningJobResponse>;

/**
 * OK
 */
declare type JobsApiRoutesFineTuningCancelFineTuningJobResponse = (components.ClassifierDetailedJobOut & {
    jobType: "classifier";
}) | (components.CompletionDetailedJobOut & {
    jobType: "completion";
});

declare function jobsApiRoutesFineTuningCancelFineTuningJobResponseFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningCancelFineTuningJobResponse, SDKValidationError>;

declare function jobsApiRoutesFineTuningCancelFineTuningJobResponseToJSON(jobsApiRoutesFineTuningCancelFineTuningJobResponse: JobsApiRoutesFineTuningCancelFineTuningJobResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningCreateFineTuningJobResponse$ {
    /** @deprecated use `JobsApiRoutesFineTuningCreateFineTuningJobResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningCreateFineTuningJobResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningCreateFineTuningJobResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningCreateFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningCreateFineTuningJobResponse>;
    /** @deprecated use `JobsApiRoutesFineTuningCreateFineTuningJobResponse$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningCreateFineTuningJobResponse$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningCreateFineTuningJobResponse$inboundSchema: z.ZodType<JobsApiRoutesFineTuningCreateFineTuningJobResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningCreateFineTuningJobResponse$Outbound = components.LegacyJobMetadataOut$Outbound | (components.ClassifierJobOut$Outbound & {
    job_type: "classifier";
}) | (components.CompletionJobOut$Outbound & {
    job_type: "completion";
});

/** @internal */
declare const JobsApiRoutesFineTuningCreateFineTuningJobResponse$outboundSchema: z.ZodType<JobsApiRoutesFineTuningCreateFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningCreateFineTuningJobResponse>;

/**
 * OK
 */
declare type JobsApiRoutesFineTuningCreateFineTuningJobResponse = components.LegacyJobMetadataOut | (components.ClassifierJobOut & {
    jobType: "classifier";
}) | (components.CompletionJobOut & {
    jobType: "completion";
});

declare function jobsApiRoutesFineTuningCreateFineTuningJobResponseFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningCreateFineTuningJobResponse, SDKValidationError>;

declare function jobsApiRoutesFineTuningCreateFineTuningJobResponseToJSON(jobsApiRoutesFineTuningCreateFineTuningJobResponse: JobsApiRoutesFineTuningCreateFineTuningJobResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningGetFineTuningJobRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningGetFineTuningJobRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningGetFineTuningJobRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningGetFineTuningJobRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningGetFineTuningJobRequest$Outbound = {
    job_id: string;
};

/** @internal */
declare const JobsApiRoutesFineTuningGetFineTuningJobRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningGetFineTuningJobRequest>;

declare type JobsApiRoutesFineTuningGetFineTuningJobRequest = {
    /**
     * The ID of the job to analyse.
     */
    jobId: string;
};

declare function jobsApiRoutesFineTuningGetFineTuningJobRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningGetFineTuningJobRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningGetFineTuningJobRequestToJSON(jobsApiRoutesFineTuningGetFineTuningJobRequest: JobsApiRoutesFineTuningGetFineTuningJobRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningGetFineTuningJobResponse$ {
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningGetFineTuningJobResponse>;
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobResponse$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningGetFineTuningJobResponse$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningGetFineTuningJobResponse$inboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningGetFineTuningJobResponse$Outbound = (components.ClassifierDetailedJobOut$Outbound & {
    job_type: "classifier";
}) | (components.CompletionDetailedJobOut$Outbound & {
    job_type: "completion";
});

/** @internal */
declare const JobsApiRoutesFineTuningGetFineTuningJobResponse$outboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningGetFineTuningJobResponse>;

/**
 * OK
 */
declare type JobsApiRoutesFineTuningGetFineTuningJobResponse = (components.ClassifierDetailedJobOut & {
    jobType: "classifier";
}) | (components.CompletionDetailedJobOut & {
    jobType: "completion";
});

declare function jobsApiRoutesFineTuningGetFineTuningJobResponseFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningGetFineTuningJobResponse, SDKValidationError>;

declare function jobsApiRoutesFineTuningGetFineTuningJobResponseToJSON(jobsApiRoutesFineTuningGetFineTuningJobResponse: JobsApiRoutesFineTuningGetFineTuningJobResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningGetFineTuningJobsRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobsRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobsRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobsRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobsRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningGetFineTuningJobsRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningGetFineTuningJobsRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningGetFineTuningJobsRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningGetFineTuningJobsRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobsRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningGetFineTuningJobsRequest$Outbound = {
    page: number;
    page_size: number;
    model?: string | null | undefined;
    created_after?: string | null | undefined;
    created_before?: string | null | undefined;
    created_by_me: boolean;
    status?: string | null | undefined;
    wandb_project?: string | null | undefined;
    wandb_name?: string | null | undefined;
    suffix?: string | null | undefined;
};

/** @internal */
declare const JobsApiRoutesFineTuningGetFineTuningJobsRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningGetFineTuningJobsRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningGetFineTuningJobsRequest>;

declare type JobsApiRoutesFineTuningGetFineTuningJobsRequest = {
    /**
     * The page number of the results to be returned.
     */
    page?: number | undefined;
    /**
     * The number of items to return per page.
     */
    pageSize?: number | undefined;
    /**
     * The model name used for fine-tuning to filter on. When set, the other results are not displayed.
     */
    model?: string | null | undefined;
    /**
     * The date/time to filter on. When set, the results for previous creation times are not displayed.
     */
    createdAfter?: Date | null | undefined;
    createdBefore?: Date | null | undefined;
    /**
     * When set, only return results for jobs created by the API caller. Other results are not displayed.
     */
    createdByMe?: boolean | undefined;
    /**
     * The current job state to filter on. When set, the other results are not displayed.
     */
    status?: Status_2 | null | undefined;
    /**
     * The Weights and Biases project to filter on. When set, the other results are not displayed.
     */
    wandbProject?: string | null | undefined;
    /**
     * The Weight and Biases run name to filter on. When set, the other results are not displayed.
     */
    wandbName?: string | null | undefined;
    /**
     * The model suffix to filter on. When set, the other results are not displayed.
     */
    suffix?: string | null | undefined;
};

declare function jobsApiRoutesFineTuningGetFineTuningJobsRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningGetFineTuningJobsRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningGetFineTuningJobsRequestToJSON(jobsApiRoutesFineTuningGetFineTuningJobsRequest: JobsApiRoutesFineTuningGetFineTuningJobsRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningStartFineTuningJobRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningStartFineTuningJobRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningStartFineTuningJobRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningStartFineTuningJobRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningStartFineTuningJobRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningStartFineTuningJobRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningStartFineTuningJobRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningStartFineTuningJobRequest$Outbound = {
    job_id: string;
};

/** @internal */
declare const JobsApiRoutesFineTuningStartFineTuningJobRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningStartFineTuningJobRequest>;

declare type JobsApiRoutesFineTuningStartFineTuningJobRequest = {
    jobId: string;
};

declare function jobsApiRoutesFineTuningStartFineTuningJobRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningStartFineTuningJobRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningStartFineTuningJobRequestToJSON(jobsApiRoutesFineTuningStartFineTuningJobRequest: JobsApiRoutesFineTuningStartFineTuningJobRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningStartFineTuningJobResponse$ {
    /** @deprecated use `JobsApiRoutesFineTuningStartFineTuningJobResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningStartFineTuningJobResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningStartFineTuningJobResponse>;
    /** @deprecated use `JobsApiRoutesFineTuningStartFineTuningJobResponse$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningStartFineTuningJobResponse$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningStartFineTuningJobResponse$inboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningStartFineTuningJobResponse$Outbound = (components.ClassifierDetailedJobOut$Outbound & {
    job_type: "classifier";
}) | (components.CompletionDetailedJobOut$Outbound & {
    job_type: "completion";
});

/** @internal */
declare const JobsApiRoutesFineTuningStartFineTuningJobResponse$outboundSchema: z.ZodType<JobsApiRoutesFineTuningStartFineTuningJobResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningStartFineTuningJobResponse>;

/**
 * OK
 */
declare type JobsApiRoutesFineTuningStartFineTuningJobResponse = (components.ClassifierDetailedJobOut & {
    jobType: "classifier";
}) | (components.CompletionDetailedJobOut & {
    jobType: "completion";
});

declare function jobsApiRoutesFineTuningStartFineTuningJobResponseFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningStartFineTuningJobResponse, SDKValidationError>;

declare function jobsApiRoutesFineTuningStartFineTuningJobResponseToJSON(jobsApiRoutesFineTuningStartFineTuningJobResponse: JobsApiRoutesFineTuningStartFineTuningJobResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$Outbound = {
    model_id: string;
};

/** @internal */
declare const JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest>;

declare type JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest = {
    /**
     * The ID of the model to unarchive.
     */
    modelId: string;
};

declare function jobsApiRoutesFineTuningUnarchiveFineTunedModelRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningUnarchiveFineTunedModelRequestToJSON(jobsApiRoutesFineTuningUnarchiveFineTunedModelRequest: JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningUpdateFineTunedModelRequest$ {
    /** @deprecated use `JobsApiRoutesFineTuningUpdateFineTunedModelRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningUpdateFineTunedModelRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningUpdateFineTunedModelRequest>;
    /** @deprecated use `JobsApiRoutesFineTuningUpdateFineTunedModelRequest$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningUpdateFineTunedModelRequest$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningUpdateFineTunedModelRequest$inboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningUpdateFineTunedModelRequest$Outbound = {
    model_id: string;
    UpdateFTModelIn: components.UpdateFTModelIn$Outbound;
};

/** @internal */
declare const JobsApiRoutesFineTuningUpdateFineTunedModelRequest$outboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelRequest$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningUpdateFineTunedModelRequest>;

declare type JobsApiRoutesFineTuningUpdateFineTunedModelRequest = {
    /**
     * The ID of the model to update.
     */
    modelId: string;
    updateFTModelIn: components.UpdateFTModelIn;
};

declare function jobsApiRoutesFineTuningUpdateFineTunedModelRequestFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningUpdateFineTunedModelRequest, SDKValidationError>;

declare function jobsApiRoutesFineTuningUpdateFineTunedModelRequestToJSON(jobsApiRoutesFineTuningUpdateFineTunedModelRequest: JobsApiRoutesFineTuningUpdateFineTunedModelRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsApiRoutesFineTuningUpdateFineTunedModelResponse$ {
    /** @deprecated use `JobsApiRoutesFineTuningUpdateFineTunedModelResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsApiRoutesFineTuningUpdateFineTunedModelResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningUpdateFineTunedModelResponse>;
    /** @deprecated use `JobsApiRoutesFineTuningUpdateFineTunedModelResponse$Outbound` instead. */
    type Outbound = JobsApiRoutesFineTuningUpdateFineTunedModelResponse$Outbound;
}

/** @internal */
declare const JobsApiRoutesFineTuningUpdateFineTunedModelResponse$inboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsApiRoutesFineTuningUpdateFineTunedModelResponse$Outbound = (components.ClassifierFTModelOut$Outbound & {
    model_type: "classifier";
}) | (components.CompletionFTModelOut$Outbound & {
    model_type: "completion";
});

/** @internal */
declare const JobsApiRoutesFineTuningUpdateFineTunedModelResponse$outboundSchema: z.ZodType<JobsApiRoutesFineTuningUpdateFineTunedModelResponse$Outbound, z.ZodTypeDef, JobsApiRoutesFineTuningUpdateFineTunedModelResponse>;

/**
 * OK
 */
declare type JobsApiRoutesFineTuningUpdateFineTunedModelResponse = (components.ClassifierFTModelOut & {
    modelType: "classifier";
}) | (components.CompletionFTModelOut & {
    modelType: "completion";
});

declare function jobsApiRoutesFineTuningUpdateFineTunedModelResponseFromJSON(jsonString: string): Result<JobsApiRoutesFineTuningUpdateFineTunedModelResponse, SDKValidationError>;

declare function jobsApiRoutesFineTuningUpdateFineTunedModelResponseToJSON(jobsApiRoutesFineTuningUpdateFineTunedModelResponse: JobsApiRoutesFineTuningUpdateFineTunedModelResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsOut$ {
    /** @deprecated use `JobsOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsOut$Outbound, z.ZodTypeDef, JobsOut>;
    /** @deprecated use `JobsOut$Outbound` instead. */
    type Outbound = JobsOut$Outbound;
}

/** @internal */
declare const JobsOut$inboundSchema: z.ZodType<JobsOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsOut$Outbound = {
    data?: Array<(ClassifierJobOut$Outbound & {
        job_type: "classifier";
    }) | (CompletionJobOut$Outbound & {
        job_type: "completion";
    })> | undefined;
    object: string;
    total: number;
};

/** @internal */
declare const JobsOut$outboundSchema: z.ZodType<JobsOut$Outbound, z.ZodTypeDef, JobsOut>;

declare type JobsOut = {
    data?: Array<(ClassifierJobOut & {
        jobType: "classifier";
    }) | (CompletionJobOut & {
        jobType: "completion";
    })> | undefined;
    object?: JobsOutObject | undefined;
    total: number;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsOutData$ {
    /** @deprecated use `JobsOutData$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JobsOutData, z.ZodTypeDef, unknown>;
    /** @deprecated use `JobsOutData$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JobsOutData$Outbound, z.ZodTypeDef, JobsOutData>;
    /** @deprecated use `JobsOutData$Outbound` instead. */
    type Outbound = JobsOutData$Outbound;
}

/** @internal */
declare const JobsOutData$inboundSchema: z.ZodType<JobsOutData, z.ZodTypeDef, unknown>;

/** @internal */
declare type JobsOutData$Outbound = (ClassifierJobOut$Outbound & {
    job_type: "classifier";
}) | (CompletionJobOut$Outbound & {
    job_type: "completion";
});

/** @internal */
declare const JobsOutData$outboundSchema: z.ZodType<JobsOutData$Outbound, z.ZodTypeDef, JobsOutData>;

declare type JobsOutData = (ClassifierJobOut & {
    jobType: "classifier";
}) | (CompletionJobOut & {
    jobType: "completion";
});

declare function jobsOutDataFromJSON(jsonString: string): Result<JobsOutData, SDKValidationError>;

declare function jobsOutDataToJSON(jobsOutData: JobsOutData): string;

declare function jobsOutFromJSON(jsonString: string): Result<JobsOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobsOutObject$ {
    /** @deprecated use `JobsOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly List: "list";
    }>;
    /** @deprecated use `JobsOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly List: "list";
    }>;
}

/** @internal */
declare const JobsOutObject$inboundSchema: z.ZodNativeEnum<typeof JobsOutObject>;

/** @internal */
declare const JobsOutObject$outboundSchema: z.ZodNativeEnum<typeof JobsOutObject>;

declare const JobsOutObject: {
    readonly List: "list";
};

declare type JobsOutObject = ClosedEnum<typeof JobsOutObject>;

declare function jobsOutToJSON(jobsOut: JobsOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JobType$ {
    /** @deprecated use `JobType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
    }>;
    /** @deprecated use `JobType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
    }>;
}

/** @internal */
declare const JobType$inboundSchema: z.ZodNativeEnum<typeof JobType>;

/** @internal */
declare const JobType$outboundSchema: z.ZodNativeEnum<typeof JobType>;

/**
 * The type of job (`FT` for fine-tuning).
 */
declare const JobType: {
    readonly Completion: "completion";
};

/**
 * The type of job (`FT` for fine-tuning).
 */
declare type JobType = ClosedEnum<typeof JobType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace JsonSchema$ {
    /** @deprecated use `JsonSchema$inboundSchema` instead. */
    const inboundSchema: z.ZodType<JsonSchema, z.ZodTypeDef, unknown>;
    /** @deprecated use `JsonSchema$outboundSchema` instead. */
    const outboundSchema: z.ZodType<JsonSchema$Outbound, z.ZodTypeDef, JsonSchema>;
    /** @deprecated use `JsonSchema$Outbound` instead. */
    type Outbound = JsonSchema$Outbound;
}

/** @internal */
declare const JsonSchema$inboundSchema: z.ZodType<JsonSchema, z.ZodTypeDef, unknown>;

/** @internal */
declare type JsonSchema$Outbound = {
    name: string;
    description?: string | null | undefined;
    schema: {
        [k: string]: any;
    };
    strict?: boolean | undefined;
};

/** @internal */
declare const JsonSchema$outboundSchema: z.ZodType<JsonSchema$Outbound, z.ZodTypeDef, JsonSchema>;

declare type JsonSchema = {
    name: string;
    description?: string | null | undefined;
    schemaDefinition: {
        [k: string]: any;
    };
    strict?: boolean | undefined;
};

declare function jsonSchemaFromJSON(jsonString: string): Result<JsonSchema, SDKValidationError>;

declare function jsonSchemaToJSON(jsonSchema: JsonSchema): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LegacyJobMetadataOut$ {
    /** @deprecated use `LegacyJobMetadataOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LegacyJobMetadataOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `LegacyJobMetadataOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LegacyJobMetadataOut$Outbound, z.ZodTypeDef, LegacyJobMetadataOut>;
    /** @deprecated use `LegacyJobMetadataOut$Outbound` instead. */
    type Outbound = LegacyJobMetadataOut$Outbound;
}

/** @internal */
declare const LegacyJobMetadataOut$inboundSchema: z.ZodType<LegacyJobMetadataOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type LegacyJobMetadataOut$Outbound = {
    expected_duration_seconds?: number | null | undefined;
    cost?: number | null | undefined;
    cost_currency?: string | null | undefined;
    train_tokens_per_step?: number | null | undefined;
    train_tokens?: number | null | undefined;
    data_tokens?: number | null | undefined;
    estimated_start_time?: number | null | undefined;
    deprecated: boolean;
    details: string;
    epochs?: number | null | undefined;
    training_steps?: number | null | undefined;
    object: string;
};

/** @internal */
declare const LegacyJobMetadataOut$outboundSchema: z.ZodType<LegacyJobMetadataOut$Outbound, z.ZodTypeDef, LegacyJobMetadataOut>;

declare type LegacyJobMetadataOut = {
    /**
     * The approximated time (in seconds) for the fine-tuning process to complete.
     */
    expectedDurationSeconds?: number | null | undefined;
    /**
     * The cost of the fine-tuning job.
     */
    cost?: number | null | undefined;
    /**
     * The currency used for the fine-tuning job cost.
     */
    costCurrency?: string | null | undefined;
    /**
     * The number of tokens consumed by one training step.
     */
    trainTokensPerStep?: number | null | undefined;
    /**
     * The total number of tokens used during the fine-tuning process.
     */
    trainTokens?: number | null | undefined;
    /**
     * The total number of tokens in the training dataset.
     */
    dataTokens?: number | null | undefined;
    estimatedStartTime?: number | null | undefined;
    deprecated?: boolean | undefined;
    details: string;
    /**
     * The number of complete passes through the entire training dataset.
     */
    epochs?: number | null | undefined;
    /**
     * The number of training steps to perform. A training step refers to a single update of the model weights during the fine-tuning process. This update is typically calculated using a batch of samples from the training dataset.
     */
    trainingSteps?: number | null | undefined;
    object?: LegacyJobMetadataOutObject | undefined;
};

declare function legacyJobMetadataOutFromJSON(jsonString: string): Result<LegacyJobMetadataOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LegacyJobMetadataOutObject$ {
    /** @deprecated use `LegacyJobMetadataOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly JobMetadata: "job.metadata";
    }>;
    /** @deprecated use `LegacyJobMetadataOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly JobMetadata: "job.metadata";
    }>;
}

/** @internal */
declare const LegacyJobMetadataOutObject$inboundSchema: z.ZodNativeEnum<typeof LegacyJobMetadataOutObject>;

/** @internal */
declare const LegacyJobMetadataOutObject$outboundSchema: z.ZodNativeEnum<typeof LegacyJobMetadataOutObject>;

declare const LegacyJobMetadataOutObject: {
    readonly JobMetadata: "job.metadata";
};

declare type LegacyJobMetadataOutObject = ClosedEnum<typeof LegacyJobMetadataOutObject>;

declare function legacyJobMetadataOutToJSON(legacyJobMetadataOut: LegacyJobMetadataOut): string;

declare class Libraries extends ClientSDK {
    private _documents?;
    get documents(): Documents;
    private _accesses?;
    get accesses(): Accesses;
    /**
     * List all libraries you have access to.
     *
     * @remarks
     * List all libraries that you have created or have been shared with you.
     */
    list(options?: RequestOptions): Promise<components.ListLibraryOut>;
    /**
     * Create a new Library.
     *
     * @remarks
     * Create a new Library, you will be marked as the owner and only you will have the possibility to share it with others. When first created this will only be accessible by you.
     */
    create(request: components.LibraryIn, options?: RequestOptions): Promise<components.LibraryOut>;
    /**
     * Detailed information about a specific Library.
     *
     * @remarks
     * Given a library id, details information about that Library.
     */
    get(request: operations.LibrariesGetV1Request, options?: RequestOptions): Promise<components.LibraryOut>;
    /**
     * Delete a library and all of it's document.
     *
     * @remarks
     * Given a library id, deletes it together with all documents that have been uploaded to that library.
     */
    delete(request: operations.LibrariesDeleteV1Request, options?: RequestOptions): Promise<components.LibraryOut>;
    /**
     * Update a library.
     *
     * @remarks
     * Given a library id, you can update the name and description.
     */
    update(request: operations.LibrariesUpdateV1Request, options?: RequestOptions): Promise<components.LibraryOut>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDeleteV1Request$ {
    /** @deprecated use `LibrariesDeleteV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDeleteV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDeleteV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDeleteV1Request$Outbound, z.ZodTypeDef, LibrariesDeleteV1Request>;
    /** @deprecated use `LibrariesDeleteV1Request$Outbound` instead. */
    type Outbound = LibrariesDeleteV1Request$Outbound;
}

/** @internal */
declare const LibrariesDeleteV1Request$inboundSchema: z.ZodType<LibrariesDeleteV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDeleteV1Request$Outbound = {
    library_id: string;
};

/** @internal */
declare const LibrariesDeleteV1Request$outboundSchema: z.ZodType<LibrariesDeleteV1Request$Outbound, z.ZodTypeDef, LibrariesDeleteV1Request>;

declare type LibrariesDeleteV1Request = {
    libraryId: string;
};

declare function librariesDeleteV1RequestFromJSON(jsonString: string): Result<LibrariesDeleteV1Request, SDKValidationError>;

declare function librariesDeleteV1RequestToJSON(librariesDeleteV1Request: LibrariesDeleteV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsDeleteV1Request$ {
    /** @deprecated use `LibrariesDocumentsDeleteV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsDeleteV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsDeleteV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsDeleteV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsDeleteV1Request>;
    /** @deprecated use `LibrariesDocumentsDeleteV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsDeleteV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsDeleteV1Request$inboundSchema: z.ZodType<LibrariesDocumentsDeleteV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsDeleteV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsDeleteV1Request$outboundSchema: z.ZodType<LibrariesDocumentsDeleteV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsDeleteV1Request>;

declare type LibrariesDocumentsDeleteV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsDeleteV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsDeleteV1Request, SDKValidationError>;

declare function librariesDocumentsDeleteV1RequestToJSON(librariesDocumentsDeleteV1Request: LibrariesDocumentsDeleteV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsGetExtractedTextSignedUrlV1Request$ {
    /** @deprecated use `LibrariesDocumentsGetExtractedTextSignedUrlV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsGetExtractedTextSignedUrlV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsGetExtractedTextSignedUrlV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsGetExtractedTextSignedUrlV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetExtractedTextSignedUrlV1Request>;
    /** @deprecated use `LibrariesDocumentsGetExtractedTextSignedUrlV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsGetExtractedTextSignedUrlV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsGetExtractedTextSignedUrlV1Request$inboundSchema: z.ZodType<LibrariesDocumentsGetExtractedTextSignedUrlV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsGetExtractedTextSignedUrlV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsGetExtractedTextSignedUrlV1Request$outboundSchema: z.ZodType<LibrariesDocumentsGetExtractedTextSignedUrlV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetExtractedTextSignedUrlV1Request>;

declare type LibrariesDocumentsGetExtractedTextSignedUrlV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsGetExtractedTextSignedUrlV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsGetExtractedTextSignedUrlV1Request, SDKValidationError>;

declare function librariesDocumentsGetExtractedTextSignedUrlV1RequestToJSON(librariesDocumentsGetExtractedTextSignedUrlV1Request: LibrariesDocumentsGetExtractedTextSignedUrlV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsGetSignedUrlV1Request$ {
    /** @deprecated use `LibrariesDocumentsGetSignedUrlV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsGetSignedUrlV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsGetSignedUrlV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsGetSignedUrlV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetSignedUrlV1Request>;
    /** @deprecated use `LibrariesDocumentsGetSignedUrlV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsGetSignedUrlV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsGetSignedUrlV1Request$inboundSchema: z.ZodType<LibrariesDocumentsGetSignedUrlV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsGetSignedUrlV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsGetSignedUrlV1Request$outboundSchema: z.ZodType<LibrariesDocumentsGetSignedUrlV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetSignedUrlV1Request>;

declare type LibrariesDocumentsGetSignedUrlV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsGetSignedUrlV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsGetSignedUrlV1Request, SDKValidationError>;

declare function librariesDocumentsGetSignedUrlV1RequestToJSON(librariesDocumentsGetSignedUrlV1Request: LibrariesDocumentsGetSignedUrlV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsGetStatusV1Request$ {
    /** @deprecated use `LibrariesDocumentsGetStatusV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsGetStatusV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsGetStatusV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsGetStatusV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetStatusV1Request>;
    /** @deprecated use `LibrariesDocumentsGetStatusV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsGetStatusV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsGetStatusV1Request$inboundSchema: z.ZodType<LibrariesDocumentsGetStatusV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsGetStatusV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsGetStatusV1Request$outboundSchema: z.ZodType<LibrariesDocumentsGetStatusV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetStatusV1Request>;

declare type LibrariesDocumentsGetStatusV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsGetStatusV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsGetStatusV1Request, SDKValidationError>;

declare function librariesDocumentsGetStatusV1RequestToJSON(librariesDocumentsGetStatusV1Request: LibrariesDocumentsGetStatusV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsGetTextContentV1Request$ {
    /** @deprecated use `LibrariesDocumentsGetTextContentV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsGetTextContentV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsGetTextContentV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsGetTextContentV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetTextContentV1Request>;
    /** @deprecated use `LibrariesDocumentsGetTextContentV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsGetTextContentV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsGetTextContentV1Request$inboundSchema: z.ZodType<LibrariesDocumentsGetTextContentV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsGetTextContentV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsGetTextContentV1Request$outboundSchema: z.ZodType<LibrariesDocumentsGetTextContentV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetTextContentV1Request>;

declare type LibrariesDocumentsGetTextContentV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsGetTextContentV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsGetTextContentV1Request, SDKValidationError>;

declare function librariesDocumentsGetTextContentV1RequestToJSON(librariesDocumentsGetTextContentV1Request: LibrariesDocumentsGetTextContentV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsGetV1Request$ {
    /** @deprecated use `LibrariesDocumentsGetV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsGetV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsGetV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsGetV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetV1Request>;
    /** @deprecated use `LibrariesDocumentsGetV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsGetV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsGetV1Request$inboundSchema: z.ZodType<LibrariesDocumentsGetV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsGetV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsGetV1Request$outboundSchema: z.ZodType<LibrariesDocumentsGetV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsGetV1Request>;

declare type LibrariesDocumentsGetV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsGetV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsGetV1Request, SDKValidationError>;

declare function librariesDocumentsGetV1RequestToJSON(librariesDocumentsGetV1Request: LibrariesDocumentsGetV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsListV1Request$ {
    /** @deprecated use `LibrariesDocumentsListV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsListV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsListV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsListV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsListV1Request>;
    /** @deprecated use `LibrariesDocumentsListV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsListV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsListV1Request$inboundSchema: z.ZodType<LibrariesDocumentsListV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsListV1Request$Outbound = {
    library_id: string;
    search?: string | null | undefined;
    page_size: number;
    page: number;
    sort_by: string;
    sort_order: string;
};

/** @internal */
declare const LibrariesDocumentsListV1Request$outboundSchema: z.ZodType<LibrariesDocumentsListV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsListV1Request>;

declare type LibrariesDocumentsListV1Request = {
    libraryId: string;
    search?: string | null | undefined;
    pageSize?: number | undefined;
    page?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
};

declare function librariesDocumentsListV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsListV1Request, SDKValidationError>;

declare function librariesDocumentsListV1RequestToJSON(librariesDocumentsListV1Request: LibrariesDocumentsListV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsReprocessV1Request$ {
    /** @deprecated use `LibrariesDocumentsReprocessV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsReprocessV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsReprocessV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsReprocessV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsReprocessV1Request>;
    /** @deprecated use `LibrariesDocumentsReprocessV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsReprocessV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsReprocessV1Request$inboundSchema: z.ZodType<LibrariesDocumentsReprocessV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsReprocessV1Request$Outbound = {
    library_id: string;
    document_id: string;
};

/** @internal */
declare const LibrariesDocumentsReprocessV1Request$outboundSchema: z.ZodType<LibrariesDocumentsReprocessV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsReprocessV1Request>;

declare type LibrariesDocumentsReprocessV1Request = {
    libraryId: string;
    documentId: string;
};

declare function librariesDocumentsReprocessV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsReprocessV1Request, SDKValidationError>;

declare function librariesDocumentsReprocessV1RequestToJSON(librariesDocumentsReprocessV1Request: LibrariesDocumentsReprocessV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsUpdateV1Request$ {
    /** @deprecated use `LibrariesDocumentsUpdateV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsUpdateV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsUpdateV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsUpdateV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsUpdateV1Request>;
    /** @deprecated use `LibrariesDocumentsUpdateV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsUpdateV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsUpdateV1Request$inboundSchema: z.ZodType<LibrariesDocumentsUpdateV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsUpdateV1Request$Outbound = {
    library_id: string;
    document_id: string;
    DocumentUpdateIn: components.DocumentUpdateIn$Outbound;
};

/** @internal */
declare const LibrariesDocumentsUpdateV1Request$outboundSchema: z.ZodType<LibrariesDocumentsUpdateV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsUpdateV1Request>;

declare type LibrariesDocumentsUpdateV1Request = {
    libraryId: string;
    documentId: string;
    documentUpdateIn: components.DocumentUpdateIn;
};

declare function librariesDocumentsUpdateV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsUpdateV1Request, SDKValidationError>;

declare function librariesDocumentsUpdateV1RequestToJSON(librariesDocumentsUpdateV1Request: LibrariesDocumentsUpdateV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsUploadV1DocumentUpload$ {
    /** @deprecated use `LibrariesDocumentsUploadV1DocumentUpload$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsUploadV1DocumentUpload, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsUploadV1DocumentUpload$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsUploadV1DocumentUpload$Outbound, z.ZodTypeDef, LibrariesDocumentsUploadV1DocumentUpload>;
    /** @deprecated use `LibrariesDocumentsUploadV1DocumentUpload$Outbound` instead. */
    type Outbound = LibrariesDocumentsUploadV1DocumentUpload$Outbound;
}

/** @internal */
declare const LibrariesDocumentsUploadV1DocumentUpload$inboundSchema: z.ZodType<LibrariesDocumentsUploadV1DocumentUpload, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsUploadV1DocumentUpload$Outbound = {
    file: components.FileT$Outbound | Blob;
};

/** @internal */
declare const LibrariesDocumentsUploadV1DocumentUpload$outboundSchema: z.ZodType<LibrariesDocumentsUploadV1DocumentUpload$Outbound, z.ZodTypeDef, LibrariesDocumentsUploadV1DocumentUpload>;

declare type LibrariesDocumentsUploadV1DocumentUpload = {
    /**
     * The File object (not file name) to be uploaded.
     *
     * @remarks
     *  To upload a file and specify a custom file name you should format your request as such:
     *  ```bash
     *  file=@path/to/your/file.jsonl;filename=custom_name.jsonl
     *  ```
     *  Otherwise, you can just keep the original file name:
     *  ```bash
     *  file=@path/to/your/file.jsonl
     *  ```
     */
    file: components.FileT | Blob;
};

declare function librariesDocumentsUploadV1DocumentUploadFromJSON(jsonString: string): Result<LibrariesDocumentsUploadV1DocumentUpload, SDKValidationError>;

declare function librariesDocumentsUploadV1DocumentUploadToJSON(librariesDocumentsUploadV1DocumentUpload: LibrariesDocumentsUploadV1DocumentUpload): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesDocumentsUploadV1Request$ {
    /** @deprecated use `LibrariesDocumentsUploadV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesDocumentsUploadV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesDocumentsUploadV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesDocumentsUploadV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsUploadV1Request>;
    /** @deprecated use `LibrariesDocumentsUploadV1Request$Outbound` instead. */
    type Outbound = LibrariesDocumentsUploadV1Request$Outbound;
}

/** @internal */
declare const LibrariesDocumentsUploadV1Request$inboundSchema: z.ZodType<LibrariesDocumentsUploadV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesDocumentsUploadV1Request$Outbound = {
    library_id: string;
    RequestBody: LibrariesDocumentsUploadV1DocumentUpload$Outbound;
};

/** @internal */
declare const LibrariesDocumentsUploadV1Request$outboundSchema: z.ZodType<LibrariesDocumentsUploadV1Request$Outbound, z.ZodTypeDef, LibrariesDocumentsUploadV1Request>;

declare type LibrariesDocumentsUploadV1Request = {
    libraryId: string;
    requestBody: LibrariesDocumentsUploadV1DocumentUpload;
};

declare function librariesDocumentsUploadV1RequestFromJSON(jsonString: string): Result<LibrariesDocumentsUploadV1Request, SDKValidationError>;

declare function librariesDocumentsUploadV1RequestToJSON(librariesDocumentsUploadV1Request: LibrariesDocumentsUploadV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesGetV1Request$ {
    /** @deprecated use `LibrariesGetV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesGetV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesGetV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesGetV1Request$Outbound, z.ZodTypeDef, LibrariesGetV1Request>;
    /** @deprecated use `LibrariesGetV1Request$Outbound` instead. */
    type Outbound = LibrariesGetV1Request$Outbound;
}

/** @internal */
declare const LibrariesGetV1Request$inboundSchema: z.ZodType<LibrariesGetV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesGetV1Request$Outbound = {
    library_id: string;
};

/** @internal */
declare const LibrariesGetV1Request$outboundSchema: z.ZodType<LibrariesGetV1Request$Outbound, z.ZodTypeDef, LibrariesGetV1Request>;

declare type LibrariesGetV1Request = {
    libraryId: string;
};

declare function librariesGetV1RequestFromJSON(jsonString: string): Result<LibrariesGetV1Request, SDKValidationError>;

declare function librariesGetV1RequestToJSON(librariesGetV1Request: LibrariesGetV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesShareCreateV1Request$ {
    /** @deprecated use `LibrariesShareCreateV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesShareCreateV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesShareCreateV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesShareCreateV1Request$Outbound, z.ZodTypeDef, LibrariesShareCreateV1Request>;
    /** @deprecated use `LibrariesShareCreateV1Request$Outbound` instead. */
    type Outbound = LibrariesShareCreateV1Request$Outbound;
}

/** @internal */
declare const LibrariesShareCreateV1Request$inboundSchema: z.ZodType<LibrariesShareCreateV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesShareCreateV1Request$Outbound = {
    library_id: string;
    SharingIn: components.SharingIn$Outbound;
};

/** @internal */
declare const LibrariesShareCreateV1Request$outboundSchema: z.ZodType<LibrariesShareCreateV1Request$Outbound, z.ZodTypeDef, LibrariesShareCreateV1Request>;

declare type LibrariesShareCreateV1Request = {
    libraryId: string;
    sharingIn: components.SharingIn;
};

declare function librariesShareCreateV1RequestFromJSON(jsonString: string): Result<LibrariesShareCreateV1Request, SDKValidationError>;

declare function librariesShareCreateV1RequestToJSON(librariesShareCreateV1Request: LibrariesShareCreateV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesShareDeleteV1Request$ {
    /** @deprecated use `LibrariesShareDeleteV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesShareDeleteV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesShareDeleteV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesShareDeleteV1Request$Outbound, z.ZodTypeDef, LibrariesShareDeleteV1Request>;
    /** @deprecated use `LibrariesShareDeleteV1Request$Outbound` instead. */
    type Outbound = LibrariesShareDeleteV1Request$Outbound;
}

/** @internal */
declare const LibrariesShareDeleteV1Request$inboundSchema: z.ZodType<LibrariesShareDeleteV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesShareDeleteV1Request$Outbound = {
    library_id: string;
    SharingDelete: components.SharingDelete$Outbound;
};

/** @internal */
declare const LibrariesShareDeleteV1Request$outboundSchema: z.ZodType<LibrariesShareDeleteV1Request$Outbound, z.ZodTypeDef, LibrariesShareDeleteV1Request>;

declare type LibrariesShareDeleteV1Request = {
    libraryId: string;
    sharingDelete: components.SharingDelete;
};

declare function librariesShareDeleteV1RequestFromJSON(jsonString: string): Result<LibrariesShareDeleteV1Request, SDKValidationError>;

declare function librariesShareDeleteV1RequestToJSON(librariesShareDeleteV1Request: LibrariesShareDeleteV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesShareListV1Request$ {
    /** @deprecated use `LibrariesShareListV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesShareListV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesShareListV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesShareListV1Request$Outbound, z.ZodTypeDef, LibrariesShareListV1Request>;
    /** @deprecated use `LibrariesShareListV1Request$Outbound` instead. */
    type Outbound = LibrariesShareListV1Request$Outbound;
}

/** @internal */
declare const LibrariesShareListV1Request$inboundSchema: z.ZodType<LibrariesShareListV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesShareListV1Request$Outbound = {
    library_id: string;
};

/** @internal */
declare const LibrariesShareListV1Request$outboundSchema: z.ZodType<LibrariesShareListV1Request$Outbound, z.ZodTypeDef, LibrariesShareListV1Request>;

declare type LibrariesShareListV1Request = {
    libraryId: string;
};

declare function librariesShareListV1RequestFromJSON(jsonString: string): Result<LibrariesShareListV1Request, SDKValidationError>;

declare function librariesShareListV1RequestToJSON(librariesShareListV1Request: LibrariesShareListV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibrariesUpdateV1Request$ {
    /** @deprecated use `LibrariesUpdateV1Request$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibrariesUpdateV1Request, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibrariesUpdateV1Request$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibrariesUpdateV1Request$Outbound, z.ZodTypeDef, LibrariesUpdateV1Request>;
    /** @deprecated use `LibrariesUpdateV1Request$Outbound` instead. */
    type Outbound = LibrariesUpdateV1Request$Outbound;
}

/** @internal */
declare const LibrariesUpdateV1Request$inboundSchema: z.ZodType<LibrariesUpdateV1Request, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibrariesUpdateV1Request$Outbound = {
    library_id: string;
    LibraryInUpdate: components.LibraryInUpdate$Outbound;
};

/** @internal */
declare const LibrariesUpdateV1Request$outboundSchema: z.ZodType<LibrariesUpdateV1Request$Outbound, z.ZodTypeDef, LibrariesUpdateV1Request>;

declare type LibrariesUpdateV1Request = {
    libraryId: string;
    libraryInUpdate: components.LibraryInUpdate;
};

declare function librariesUpdateV1RequestFromJSON(jsonString: string): Result<LibrariesUpdateV1Request, SDKValidationError>;

declare function librariesUpdateV1RequestToJSON(librariesUpdateV1Request: LibrariesUpdateV1Request): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibraryIn$ {
    /** @deprecated use `LibraryIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibraryIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibraryIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibraryIn$Outbound, z.ZodTypeDef, LibraryIn>;
    /** @deprecated use `LibraryIn$Outbound` instead. */
    type Outbound = LibraryIn$Outbound;
}

/** @internal */
declare const LibraryIn$inboundSchema: z.ZodType<LibraryIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibraryIn$Outbound = {
    name: string;
    description?: string | null | undefined;
    chunk_size?: number | null | undefined;
};

/** @internal */
declare const LibraryIn$outboundSchema: z.ZodType<LibraryIn$Outbound, z.ZodTypeDef, LibraryIn>;

declare type LibraryIn = {
    name: string;
    description?: string | null | undefined;
    chunkSize?: number | null | undefined;
};

declare function libraryInFromJSON(jsonString: string): Result<LibraryIn, SDKValidationError>;

declare function libraryInToJSON(libraryIn: LibraryIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibraryInUpdate$ {
    /** @deprecated use `LibraryInUpdate$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibraryInUpdate, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibraryInUpdate$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibraryInUpdate$Outbound, z.ZodTypeDef, LibraryInUpdate>;
    /** @deprecated use `LibraryInUpdate$Outbound` instead. */
    type Outbound = LibraryInUpdate$Outbound;
}

/** @internal */
declare const LibraryInUpdate$inboundSchema: z.ZodType<LibraryInUpdate, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibraryInUpdate$Outbound = {
    name?: string | null | undefined;
    description?: string | null | undefined;
};

/** @internal */
declare const LibraryInUpdate$outboundSchema: z.ZodType<LibraryInUpdate$Outbound, z.ZodTypeDef, LibraryInUpdate>;

declare type LibraryInUpdate = {
    name?: string | null | undefined;
    description?: string | null | undefined;
};

declare function libraryInUpdateFromJSON(jsonString: string): Result<LibraryInUpdate, SDKValidationError>;

declare function libraryInUpdateToJSON(libraryInUpdate: LibraryInUpdate): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace LibraryOut$ {
    /** @deprecated use `LibraryOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<LibraryOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `LibraryOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<LibraryOut$Outbound, z.ZodTypeDef, LibraryOut>;
    /** @deprecated use `LibraryOut$Outbound` instead. */
    type Outbound = LibraryOut$Outbound;
}

/** @internal */
declare const LibraryOut$inboundSchema: z.ZodType<LibraryOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type LibraryOut$Outbound = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
    owner_type: string;
    total_size: number;
    nb_documents: number;
    chunk_size: number | null;
    emoji?: string | null | undefined;
    description?: string | null | undefined;
    generated_name?: string | null | undefined;
    generated_description?: string | null | undefined;
    explicit_user_members_count?: number | null | undefined;
    explicit_workspace_members_count?: number | null | undefined;
    org_sharing_role?: string | null | undefined;
};

/** @internal */
declare const LibraryOut$outboundSchema: z.ZodType<LibraryOut$Outbound, z.ZodTypeDef, LibraryOut>;

declare type LibraryOut = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    ownerType: string;
    totalSize: number;
    nbDocuments: number;
    chunkSize: number | null;
    emoji?: string | null | undefined;
    description?: string | null | undefined;
    generatedName?: string | null | undefined;
    generatedDescription?: string | null | undefined;
    explicitUserMembersCount?: number | null | undefined;
    explicitWorkspaceMembersCount?: number | null | undefined;
    orgSharingRole?: string | null | undefined;
};

declare function libraryOutFromJSON(jsonString: string): Result<LibraryOut, SDKValidationError>;

declare function libraryOutToJSON(libraryOut: LibraryOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ListDocumentOut$ {
    /** @deprecated use `ListDocumentOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ListDocumentOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ListDocumentOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ListDocumentOut$Outbound, z.ZodTypeDef, ListDocumentOut>;
    /** @deprecated use `ListDocumentOut$Outbound` instead. */
    type Outbound = ListDocumentOut$Outbound;
}

/** @internal */
declare const ListDocumentOut$inboundSchema: z.ZodType<ListDocumentOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ListDocumentOut$Outbound = {
    pagination: PaginationInfo$Outbound;
    data: Array<DocumentOut$Outbound>;
};

/** @internal */
declare const ListDocumentOut$outboundSchema: z.ZodType<ListDocumentOut$Outbound, z.ZodTypeDef, ListDocumentOut>;

declare type ListDocumentOut = {
    pagination: PaginationInfo;
    data: Array<DocumentOut>;
};

declare function listDocumentOutFromJSON(jsonString: string): Result<ListDocumentOut, SDKValidationError>;

declare function listDocumentOutToJSON(listDocumentOut: ListDocumentOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ListFilesOut$ {
    /** @deprecated use `ListFilesOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ListFilesOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ListFilesOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ListFilesOut$Outbound, z.ZodTypeDef, ListFilesOut>;
    /** @deprecated use `ListFilesOut$Outbound` instead. */
    type Outbound = ListFilesOut$Outbound;
}

/** @internal */
declare const ListFilesOut$inboundSchema: z.ZodType<ListFilesOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ListFilesOut$Outbound = {
    data: Array<FileSchema$Outbound>;
    object: string;
    total: number;
};

/** @internal */
declare const ListFilesOut$outboundSchema: z.ZodType<ListFilesOut$Outbound, z.ZodTypeDef, ListFilesOut>;

declare type ListFilesOut = {
    data: Array<FileSchema>;
    object: string;
    total: number;
};

declare function listFilesOutFromJSON(jsonString: string): Result<ListFilesOut, SDKValidationError>;

declare function listFilesOutToJSON(listFilesOut: ListFilesOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ListLibraryOut$ {
    /** @deprecated use `ListLibraryOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ListLibraryOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ListLibraryOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ListLibraryOut$Outbound, z.ZodTypeDef, ListLibraryOut>;
    /** @deprecated use `ListLibraryOut$Outbound` instead. */
    type Outbound = ListLibraryOut$Outbound;
}

/** @internal */
declare const ListLibraryOut$inboundSchema: z.ZodType<ListLibraryOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ListLibraryOut$Outbound = {
    data: Array<LibraryOut$Outbound>;
};

/** @internal */
declare const ListLibraryOut$outboundSchema: z.ZodType<ListLibraryOut$Outbound, z.ZodTypeDef, ListLibraryOut>;

declare type ListLibraryOut = {
    data: Array<LibraryOut>;
};

declare function listLibraryOutFromJSON(jsonString: string): Result<ListLibraryOut, SDKValidationError>;

declare function listLibraryOutToJSON(listLibraryOut: ListLibraryOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ListSharingOut$ {
    /** @deprecated use `ListSharingOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ListSharingOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ListSharingOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ListSharingOut$Outbound, z.ZodTypeDef, ListSharingOut>;
    /** @deprecated use `ListSharingOut$Outbound` instead. */
    type Outbound = ListSharingOut$Outbound;
}

/** @internal */
declare const ListSharingOut$inboundSchema: z.ZodType<ListSharingOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ListSharingOut$Outbound = {
    data: Array<SharingOut$Outbound>;
};

/** @internal */
declare const ListSharingOut$outboundSchema: z.ZodType<ListSharingOut$Outbound, z.ZodTypeDef, ListSharingOut>;

declare type ListSharingOut = {
    data: Array<SharingOut>;
};

declare function listSharingOutFromJSON(jsonString: string): Result<ListSharingOut, SDKValidationError>;

declare function listSharingOutToJSON(listSharingOut: ListSharingOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Loc$ {
    /** @deprecated use `Loc$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Loc, z.ZodTypeDef, unknown>;
    /** @deprecated use `Loc$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Loc$Outbound, z.ZodTypeDef, Loc>;
    /** @deprecated use `Loc$Outbound` instead. */
    type Outbound = Loc$Outbound;
}

/** @internal */
declare const Loc$inboundSchema: z.ZodType<Loc, z.ZodTypeDef, unknown>;

/** @internal */
declare type Loc$Outbound = string | number;

/** @internal */
declare const Loc$outboundSchema: z.ZodType<Loc$Outbound, z.ZodTypeDef, Loc>;

declare type Loc = string | number;

declare function locFromJSON(jsonString: string): Result<Loc, SDKValidationError>;

declare function locToJSON(loc: Loc): string;

declare interface Logger {
    group(label?: string): void;
    groupEnd(): void;
    log(message: any, ...args: any[]): void;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageEntries$ {
    /** @deprecated use `MessageEntries$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageEntries, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageEntries$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageEntries$Outbound, z.ZodTypeDef, MessageEntries>;
    /** @deprecated use `MessageEntries$Outbound` instead. */
    type Outbound = MessageEntries$Outbound;
}

/** @internal */
declare const MessageEntries$inboundSchema: z.ZodType<MessageEntries, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageEntries$Outbound = MessageInputEntry$Outbound | MessageOutputEntry$Outbound;

/** @internal */
declare const MessageEntries$outboundSchema: z.ZodType<MessageEntries$Outbound, z.ZodTypeDef, MessageEntries>;

declare type MessageEntries = MessageInputEntry | MessageOutputEntry;

declare function messageEntriesFromJSON(jsonString: string): Result<MessageEntries, SDKValidationError>;

declare function messageEntriesToJSON(messageEntries: MessageEntries): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageInputContentChunks$ {
    /** @deprecated use `MessageInputContentChunks$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageInputContentChunks, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageInputContentChunks$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageInputContentChunks$Outbound, z.ZodTypeDef, MessageInputContentChunks>;
    /** @deprecated use `MessageInputContentChunks$Outbound` instead. */
    type Outbound = MessageInputContentChunks$Outbound;
}

/** @internal */
declare const MessageInputContentChunks$inboundSchema: z.ZodType<MessageInputContentChunks, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageInputContentChunks$Outbound = ToolFileChunk$Outbound | TextChunk$Outbound | ImageURLChunk$Outbound | DocumentURLChunk$Outbound | ThinkChunk$Outbound;

/** @internal */
declare const MessageInputContentChunks$outboundSchema: z.ZodType<MessageInputContentChunks$Outbound, z.ZodTypeDef, MessageInputContentChunks>;

declare type MessageInputContentChunks = ToolFileChunk | TextChunk | ImageURLChunk | DocumentURLChunk | ThinkChunk;

declare function messageInputContentChunksFromJSON(jsonString: string): Result<MessageInputContentChunks, SDKValidationError>;

declare function messageInputContentChunksToJSON(messageInputContentChunks: MessageInputContentChunks): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageInputEntry$ {
    /** @deprecated use `MessageInputEntry$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageInputEntry, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageInputEntry$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageInputEntry$Outbound, z.ZodTypeDef, MessageInputEntry>;
    /** @deprecated use `MessageInputEntry$Outbound` instead. */
    type Outbound = MessageInputEntry$Outbound;
}

/** @internal */
declare const MessageInputEntry$inboundSchema: z.ZodType<MessageInputEntry, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageInputEntry$Outbound = {
    object: string;
    type: string;
    created_at?: string | undefined;
    completed_at?: string | null | undefined;
    id?: string | undefined;
    role: string;
    content: string | Array<MessageInputContentChunks$Outbound>;
    prefix: boolean;
};

/** @internal */
declare const MessageInputEntry$outboundSchema: z.ZodType<MessageInputEntry$Outbound, z.ZodTypeDef, MessageInputEntry>;

/**
 * Representation of an input message inside the conversation.
 */
declare type MessageInputEntry = {
    object?: ObjectT | undefined;
    type?: MessageInputEntryType | undefined;
    createdAt?: Date | undefined;
    completedAt?: Date | null | undefined;
    id?: string | undefined;
    role: MessageInputEntryRole;
    content: string | Array<MessageInputContentChunks>;
    prefix?: boolean | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageInputEntryContent$ {
    /** @deprecated use `MessageInputEntryContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageInputEntryContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageInputEntryContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageInputEntryContent$Outbound, z.ZodTypeDef, MessageInputEntryContent>;
    /** @deprecated use `MessageInputEntryContent$Outbound` instead. */
    type Outbound = MessageInputEntryContent$Outbound;
}

/** @internal */
declare const MessageInputEntryContent$inboundSchema: z.ZodType<MessageInputEntryContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageInputEntryContent$Outbound = string | Array<MessageInputContentChunks$Outbound>;

/** @internal */
declare const MessageInputEntryContent$outboundSchema: z.ZodType<MessageInputEntryContent$Outbound, z.ZodTypeDef, MessageInputEntryContent>;

declare type MessageInputEntryContent = string | Array<MessageInputContentChunks>;

declare function messageInputEntryContentFromJSON(jsonString: string): Result<MessageInputEntryContent, SDKValidationError>;

declare function messageInputEntryContentToJSON(messageInputEntryContent: MessageInputEntryContent): string;

declare function messageInputEntryFromJSON(jsonString: string): Result<MessageInputEntry, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageInputEntryRole$ {
    /** @deprecated use `MessageInputEntryRole$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
        readonly User: "user";
    }>;
    /** @deprecated use `MessageInputEntryRole$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
        readonly User: "user";
    }>;
}

/** @internal */
declare const MessageInputEntryRole$inboundSchema: z.ZodNativeEnum<typeof MessageInputEntryRole>;

/** @internal */
declare const MessageInputEntryRole$outboundSchema: z.ZodNativeEnum<typeof MessageInputEntryRole>;

declare const MessageInputEntryRole: {
    readonly Assistant: "assistant";
    readonly User: "user";
};

declare type MessageInputEntryRole = ClosedEnum<typeof MessageInputEntryRole>;

declare function messageInputEntryToJSON(messageInputEntry: MessageInputEntry): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageInputEntryType$ {
    /** @deprecated use `MessageInputEntryType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly MessageInput: "message.input";
    }>;
    /** @deprecated use `MessageInputEntryType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly MessageInput: "message.input";
    }>;
}

/** @internal */
declare const MessageInputEntryType$inboundSchema: z.ZodNativeEnum<typeof MessageInputEntryType>;

/** @internal */
declare const MessageInputEntryType$outboundSchema: z.ZodNativeEnum<typeof MessageInputEntryType>;

declare const MessageInputEntryType: {
    readonly MessageInput: "message.input";
};

declare type MessageInputEntryType = ClosedEnum<typeof MessageInputEntryType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputContentChunks$ {
    /** @deprecated use `MessageOutputContentChunks$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageOutputContentChunks, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageOutputContentChunks$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageOutputContentChunks$Outbound, z.ZodTypeDef, MessageOutputContentChunks>;
    /** @deprecated use `MessageOutputContentChunks$Outbound` instead. */
    type Outbound = MessageOutputContentChunks$Outbound;
}

/** @internal */
declare const MessageOutputContentChunks$inboundSchema: z.ZodType<MessageOutputContentChunks, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageOutputContentChunks$Outbound = ToolFileChunk$Outbound | ToolReferenceChunk$Outbound | TextChunk$Outbound | ImageURLChunk$Outbound | DocumentURLChunk$Outbound | ThinkChunk$Outbound;

/** @internal */
declare const MessageOutputContentChunks$outboundSchema: z.ZodType<MessageOutputContentChunks$Outbound, z.ZodTypeDef, MessageOutputContentChunks>;

declare type MessageOutputContentChunks = ToolFileChunk | ToolReferenceChunk | TextChunk | ImageURLChunk | DocumentURLChunk | ThinkChunk;

declare function messageOutputContentChunksFromJSON(jsonString: string): Result<MessageOutputContentChunks, SDKValidationError>;

declare function messageOutputContentChunksToJSON(messageOutputContentChunks: MessageOutputContentChunks): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEntry$ {
    /** @deprecated use `MessageOutputEntry$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageOutputEntry, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageOutputEntry$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageOutputEntry$Outbound, z.ZodTypeDef, MessageOutputEntry>;
    /** @deprecated use `MessageOutputEntry$Outbound` instead. */
    type Outbound = MessageOutputEntry$Outbound;
}

/** @internal */
declare const MessageOutputEntry$inboundSchema: z.ZodType<MessageOutputEntry, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageOutputEntry$Outbound = {
    object: string;
    type: string;
    created_at?: string | undefined;
    completed_at?: string | null | undefined;
    id?: string | undefined;
    agent_id?: string | null | undefined;
    model?: string | null | undefined;
    role: string;
    content: string | Array<MessageOutputContentChunks$Outbound>;
};

/** @internal */
declare const MessageOutputEntry$outboundSchema: z.ZodType<MessageOutputEntry$Outbound, z.ZodTypeDef, MessageOutputEntry>;

declare type MessageOutputEntry = {
    object?: MessageOutputEntryObject | undefined;
    type?: MessageOutputEntryType | undefined;
    createdAt?: Date | undefined;
    completedAt?: Date | null | undefined;
    id?: string | undefined;
    agentId?: string | null | undefined;
    model?: string | null | undefined;
    role?: MessageOutputEntryRole | undefined;
    content: string | Array<MessageOutputContentChunks>;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEntryContent$ {
    /** @deprecated use `MessageOutputEntryContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageOutputEntryContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageOutputEntryContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageOutputEntryContent$Outbound, z.ZodTypeDef, MessageOutputEntryContent>;
    /** @deprecated use `MessageOutputEntryContent$Outbound` instead. */
    type Outbound = MessageOutputEntryContent$Outbound;
}

/** @internal */
declare const MessageOutputEntryContent$inboundSchema: z.ZodType<MessageOutputEntryContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageOutputEntryContent$Outbound = string | Array<MessageOutputContentChunks$Outbound>;

/** @internal */
declare const MessageOutputEntryContent$outboundSchema: z.ZodType<MessageOutputEntryContent$Outbound, z.ZodTypeDef, MessageOutputEntryContent>;

declare type MessageOutputEntryContent = string | Array<MessageOutputContentChunks>;

declare function messageOutputEntryContentFromJSON(jsonString: string): Result<MessageOutputEntryContent, SDKValidationError>;

declare function messageOutputEntryContentToJSON(messageOutputEntryContent: MessageOutputEntryContent): string;

declare function messageOutputEntryFromJSON(jsonString: string): Result<MessageOutputEntry, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEntryObject$ {
    /** @deprecated use `MessageOutputEntryObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
    /** @deprecated use `MessageOutputEntryObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
}

/** @internal */
declare const MessageOutputEntryObject$inboundSchema: z.ZodNativeEnum<typeof MessageOutputEntryObject>;

/** @internal */
declare const MessageOutputEntryObject$outboundSchema: z.ZodNativeEnum<typeof MessageOutputEntryObject>;

declare const MessageOutputEntryObject: {
    readonly Entry: "entry";
};

declare type MessageOutputEntryObject = ClosedEnum<typeof MessageOutputEntryObject>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEntryRole$ {
    /** @deprecated use `MessageOutputEntryRole$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
    }>;
    /** @deprecated use `MessageOutputEntryRole$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
    }>;
}

/** @internal */
declare const MessageOutputEntryRole$inboundSchema: z.ZodNativeEnum<typeof MessageOutputEntryRole>;

/** @internal */
declare const MessageOutputEntryRole$outboundSchema: z.ZodNativeEnum<typeof MessageOutputEntryRole>;

declare const MessageOutputEntryRole: {
    readonly Assistant: "assistant";
};

declare type MessageOutputEntryRole = ClosedEnum<typeof MessageOutputEntryRole>;

declare function messageOutputEntryToJSON(messageOutputEntry: MessageOutputEntry): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEntryType$ {
    /** @deprecated use `MessageOutputEntryType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly MessageOutput: "message.output";
    }>;
    /** @deprecated use `MessageOutputEntryType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly MessageOutput: "message.output";
    }>;
}

/** @internal */
declare const MessageOutputEntryType$inboundSchema: z.ZodNativeEnum<typeof MessageOutputEntryType>;

/** @internal */
declare const MessageOutputEntryType$outboundSchema: z.ZodNativeEnum<typeof MessageOutputEntryType>;

declare const MessageOutputEntryType: {
    readonly MessageOutput: "message.output";
};

declare type MessageOutputEntryType = ClosedEnum<typeof MessageOutputEntryType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEvent$ {
    /** @deprecated use `MessageOutputEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageOutputEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageOutputEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageOutputEvent$Outbound, z.ZodTypeDef, MessageOutputEvent>;
    /** @deprecated use `MessageOutputEvent$Outbound` instead. */
    type Outbound = MessageOutputEvent$Outbound;
}

/** @internal */
declare const MessageOutputEvent$inboundSchema: z.ZodType<MessageOutputEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageOutputEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    content_index: number;
    model?: string | null | undefined;
    agent_id?: string | null | undefined;
    role: string;
    content: string | OutputContentChunks$Outbound;
};

/** @internal */
declare const MessageOutputEvent$outboundSchema: z.ZodType<MessageOutputEvent$Outbound, z.ZodTypeDef, MessageOutputEvent>;

declare type MessageOutputEvent = {
    type?: MessageOutputEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    contentIndex?: number | undefined;
    model?: string | null | undefined;
    agentId?: string | null | undefined;
    role?: MessageOutputEventRole | undefined;
    content: string | OutputContentChunks;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEventContent$ {
    /** @deprecated use `MessageOutputEventContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MessageOutputEventContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `MessageOutputEventContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MessageOutputEventContent$Outbound, z.ZodTypeDef, MessageOutputEventContent>;
    /** @deprecated use `MessageOutputEventContent$Outbound` instead. */
    type Outbound = MessageOutputEventContent$Outbound;
}

/** @internal */
declare const MessageOutputEventContent$inboundSchema: z.ZodType<MessageOutputEventContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type MessageOutputEventContent$Outbound = string | OutputContentChunks$Outbound;

/** @internal */
declare const MessageOutputEventContent$outboundSchema: z.ZodType<MessageOutputEventContent$Outbound, z.ZodTypeDef, MessageOutputEventContent>;

declare type MessageOutputEventContent = string | OutputContentChunks;

declare function messageOutputEventContentFromJSON(jsonString: string): Result<MessageOutputEventContent, SDKValidationError>;

declare function messageOutputEventContentToJSON(messageOutputEventContent: MessageOutputEventContent): string;

declare function messageOutputEventFromJSON(jsonString: string): Result<MessageOutputEvent, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEventRole$ {
    /** @deprecated use `MessageOutputEventRole$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
    }>;
    /** @deprecated use `MessageOutputEventRole$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Assistant: "assistant";
    }>;
}

/** @internal */
declare const MessageOutputEventRole$inboundSchema: z.ZodNativeEnum<typeof MessageOutputEventRole>;

/** @internal */
declare const MessageOutputEventRole$outboundSchema: z.ZodNativeEnum<typeof MessageOutputEventRole>;

declare const MessageOutputEventRole: {
    readonly Assistant: "assistant";
};

declare type MessageOutputEventRole = ClosedEnum<typeof MessageOutputEventRole>;

declare function messageOutputEventToJSON(messageOutputEvent: MessageOutputEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MessageOutputEventType$ {
    /** @deprecated use `MessageOutputEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly MessageOutputDelta: "message.output.delta";
    }>;
    /** @deprecated use `MessageOutputEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly MessageOutputDelta: "message.output.delta";
    }>;
}

/** @internal */
declare const MessageOutputEventType$inboundSchema: z.ZodNativeEnum<typeof MessageOutputEventType>;

/** @internal */
declare const MessageOutputEventType$outboundSchema: z.ZodNativeEnum<typeof MessageOutputEventType>;

declare const MessageOutputEventType: {
    readonly MessageOutputDelta: "message.output.delta";
};

declare type MessageOutputEventType = ClosedEnum<typeof MessageOutputEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Messages$ {
    /** @deprecated use `Messages$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Messages, z.ZodTypeDef, unknown>;
    /** @deprecated use `Messages$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Messages$Outbound, z.ZodTypeDef, Messages>;
    /** @deprecated use `Messages$Outbound` instead. */
    type Outbound = Messages$Outbound;
}

/** @internal */
declare const Messages$inboundSchema: z.ZodType<Messages, z.ZodTypeDef, unknown>;

/** @internal */
declare type Messages$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const Messages$outboundSchema: z.ZodType<Messages$Outbound, z.ZodTypeDef, Messages>;

declare type Messages = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function messagesFromJSON(jsonString: string): Result<Messages, SDKValidationError>;

declare function messagesToJSON(messages: Messages): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MetricOut$ {
    /** @deprecated use `MetricOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MetricOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `MetricOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MetricOut$Outbound, z.ZodTypeDef, MetricOut>;
    /** @deprecated use `MetricOut$Outbound` instead. */
    type Outbound = MetricOut$Outbound;
}

/** @internal */
declare const MetricOut$inboundSchema: z.ZodType<MetricOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type MetricOut$Outbound = {
    train_loss?: number | null | undefined;
    valid_loss?: number | null | undefined;
    valid_mean_token_accuracy?: number | null | undefined;
};

/** @internal */
declare const MetricOut$outboundSchema: z.ZodType<MetricOut$Outbound, z.ZodTypeDef, MetricOut>;

/**
 * Metrics at the step number during the fine-tuning job. Use these metrics to assess if the training is going smoothly (loss should decrease, token accuracy should increase).
 */
declare type MetricOut = {
    trainLoss?: number | null | undefined;
    validLoss?: number | null | undefined;
    validMeanTokenAccuracy?: number | null | undefined;
};

declare function metricOutFromJSON(jsonString: string): Result<MetricOut, SDKValidationError>;

declare function metricOutToJSON(metricOut: MetricOut): string;

export declare class Mistral extends ClientSDK {
    private _models?;
    get models(): Models;
    private _beta?;
    get beta(): Beta;
    private _files?;
    get files(): Files;
    private _fineTuning?;
    get fineTuning(): FineTuning;
    private _batch?;
    get batch(): Batch;
    private _chat?;
    get chat(): Chat;
    private _fim?;
    get fim(): Fim;
    private _agents?;
    get agents(): Agents;
    private _embeddings?;
    get embeddings(): Embeddings;
    private _classifiers?;
    get classifiers(): Classifiers;
    private _ocr?;
    get ocr(): Ocr;
    private _audio?;
    get audio(): Audio_2;
}

declare class MistralAgents extends ClientSDK {
    /**
     * Create a agent that can be used within a conversation.
     *
     * @remarks
     * Create a new agent giving it instructions, tools, description. The agent is then available to be used as a regular assistant in a conversation or as part of an agent pool from which it can be used.
     */
    create(request: components.AgentCreationRequest, options?: RequestOptions): Promise<components.Agent>;
    /**
     * List agent entities.
     *
     * @remarks
     * Retrieve a list of agent entities sorted by creation time.
     */
    list(request?: operations.AgentsApiV1AgentsListRequest | undefined, options?: RequestOptions): Promise<Array<components.Agent>>;
    /**
     * Retrieve an agent entity.
     *
     * @remarks
     * Given an agent retrieve an agent entity with its attributes.
     */
    get(request: operations.AgentsApiV1AgentsGetRequest, options?: RequestOptions): Promise<components.Agent>;
    /**
     * Update an agent entity.
     *
     * @remarks
     * Update an agent attributes and create a new version.
     */
    update(request: operations.AgentsApiV1AgentsUpdateRequest, options?: RequestOptions): Promise<components.Agent>;
    /**
     * Update an agent version.
     *
     * @remarks
     * Switch the version of an agent.
     */
    updateVersion(request: operations.AgentsApiV1AgentsUpdateVersionRequest, options?: RequestOptions): Promise<components.Agent>;
}

declare class MistralJobs extends ClientSDK {
    /**
     * Get Batch Jobs
     *
     * @remarks
     * Get a list of batch jobs for your organization and user.
     */
    list(request?: operations.JobsApiRoutesBatchGetBatchJobsRequest | undefined, options?: RequestOptions): Promise<components.BatchJobsOut>;
    /**
     * Create Batch Job
     *
     * @remarks
     * Create a new batch job, it will be queued for processing.
     */
    create(request: components.BatchJobIn, options?: RequestOptions): Promise<components.BatchJobOut>;
    /**
     * Get Batch Job
     *
     * @remarks
     * Get a batch job details by its UUID.
     */
    get(request: operations.JobsApiRoutesBatchGetBatchJobRequest, options?: RequestOptions): Promise<components.BatchJobOut>;
    /**
     * Cancel Batch Job
     *
     * @remarks
     * Request the cancellation of a batch job.
     */
    cancel(request: operations.JobsApiRoutesBatchCancelBatchJobRequest, options?: RequestOptions): Promise<components.BatchJobOut>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace MistralPromptMode$ {
    /** @deprecated use `MistralPromptMode$inboundSchema` instead. */
    const inboundSchema: z.ZodType<MistralPromptMode, z.ZodTypeDef, unknown>;
    /** @deprecated use `MistralPromptMode$outboundSchema` instead. */
    const outboundSchema: z.ZodType<MistralPromptMode, z.ZodTypeDef, MistralPromptMode>;
}

/** @internal */
declare const MistralPromptMode$inboundSchema: z.ZodType<MistralPromptMode, z.ZodTypeDef, unknown>;

/** @internal */
declare const MistralPromptMode$outboundSchema: z.ZodType<MistralPromptMode, z.ZodTypeDef, MistralPromptMode>;

declare const MistralPromptMode: {
    readonly Reasoning: "reasoning";
};

declare type MistralPromptMode = OpenEnum<typeof MistralPromptMode>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModelCapabilities$ {
    /** @deprecated use `ModelCapabilities$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ModelCapabilities, z.ZodTypeDef, unknown>;
    /** @deprecated use `ModelCapabilities$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ModelCapabilities$Outbound, z.ZodTypeDef, ModelCapabilities>;
    /** @deprecated use `ModelCapabilities$Outbound` instead. */
    type Outbound = ModelCapabilities$Outbound;
}

/** @internal */
declare const ModelCapabilities$inboundSchema: z.ZodType<ModelCapabilities, z.ZodTypeDef, unknown>;

/** @internal */
declare type ModelCapabilities$Outbound = {
    completion_chat: boolean;
    completion_fim: boolean;
    function_calling: boolean;
    fine_tuning: boolean;
    vision: boolean;
    classification: boolean;
};

/** @internal */
declare const ModelCapabilities$outboundSchema: z.ZodType<ModelCapabilities$Outbound, z.ZodTypeDef, ModelCapabilities>;

declare type ModelCapabilities = {
    completionChat?: boolean | undefined;
    completionFim?: boolean | undefined;
    functionCalling?: boolean | undefined;
    fineTuning?: boolean | undefined;
    vision?: boolean | undefined;
    classification?: boolean | undefined;
};

declare function modelCapabilitiesFromJSON(jsonString: string): Result<ModelCapabilities, SDKValidationError>;

declare function modelCapabilitiesToJSON(modelCapabilities: ModelCapabilities): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModelConversation$ {
    /** @deprecated use `ModelConversation$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ModelConversation, z.ZodTypeDef, unknown>;
    /** @deprecated use `ModelConversation$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ModelConversation$Outbound, z.ZodTypeDef, ModelConversation>;
    /** @deprecated use `ModelConversation$Outbound` instead. */
    type Outbound = ModelConversation$Outbound;
}

/** @internal */
declare const ModelConversation$inboundSchema: z.ZodType<ModelConversation, z.ZodTypeDef, unknown>;

/** @internal */
declare type ModelConversation$Outbound = {
    instructions?: string | null | undefined;
    tools?: Array<(DocumentLibraryTool$Outbound & {
        type: "document_library";
    }) | (FunctionTool$Outbound & {
        type: "function";
    }) | (CodeInterpreterTool$Outbound & {
        type: "code_interpreter";
    }) | (ImageGenerationTool$Outbound & {
        type: "image_generation";
    }) | (WebSearchTool$Outbound & {
        type: "web_search";
    }) | (WebSearchPremiumTool$Outbound & {
        type: "web_search_premium";
    })> | undefined;
    completion_args?: CompletionArgs$Outbound | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    object: string;
    id: string;
    created_at: string;
    updated_at: string;
    model: string;
};

/** @internal */
declare const ModelConversation$outboundSchema: z.ZodType<ModelConversation$Outbound, z.ZodTypeDef, ModelConversation>;

declare type ModelConversation = {
    /**
     * Instruction prompt the model will follow during the conversation.
     */
    instructions?: string | null | undefined;
    /**
     * List of tools which are available to the model during the conversation.
     */
    tools?: Array<(DocumentLibraryTool & {
        type: "document_library";
    }) | (FunctionTool & {
        type: "function";
    }) | (CodeInterpreterTool & {
        type: "code_interpreter";
    }) | (ImageGenerationTool & {
        type: "image_generation";
    }) | (WebSearchTool & {
        type: "web_search";
    }) | (WebSearchPremiumTool & {
        type: "web_search_premium";
    })> | undefined;
    /**
     * White-listed arguments from the completion API
     */
    completionArgs?: CompletionArgs | undefined;
    /**
     * Name given to the conversation.
     */
    name?: string | null | undefined;
    /**
     * Description of the what the conversation is about.
     */
    description?: string | null | undefined;
    object?: ModelConversationObject | undefined;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    model: string;
};

declare function modelConversationFromJSON(jsonString: string): Result<ModelConversation, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModelConversationObject$ {
    /** @deprecated use `ModelConversationObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Conversation: "conversation";
    }>;
    /** @deprecated use `ModelConversationObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Conversation: "conversation";
    }>;
}

/** @internal */
declare const ModelConversationObject$inboundSchema: z.ZodNativeEnum<typeof ModelConversationObject>;

/** @internal */
declare const ModelConversationObject$outboundSchema: z.ZodNativeEnum<typeof ModelConversationObject>;

declare const ModelConversationObject: {
    readonly Conversation: "conversation";
};

declare type ModelConversationObject = ClosedEnum<typeof ModelConversationObject>;

declare function modelConversationToJSON(modelConversation: ModelConversation): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModelConversationTools$ {
    /** @deprecated use `ModelConversationTools$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ModelConversationTools, z.ZodTypeDef, unknown>;
    /** @deprecated use `ModelConversationTools$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ModelConversationTools$Outbound, z.ZodTypeDef, ModelConversationTools>;
    /** @deprecated use `ModelConversationTools$Outbound` instead. */
    type Outbound = ModelConversationTools$Outbound;
}

/** @internal */
declare const ModelConversationTools$inboundSchema: z.ZodType<ModelConversationTools, z.ZodTypeDef, unknown>;

/** @internal */
declare type ModelConversationTools$Outbound = (DocumentLibraryTool$Outbound & {
    type: "document_library";
}) | (FunctionTool$Outbound & {
    type: "function";
}) | (CodeInterpreterTool$Outbound & {
    type: "code_interpreter";
}) | (ImageGenerationTool$Outbound & {
    type: "image_generation";
}) | (WebSearchTool$Outbound & {
    type: "web_search";
}) | (WebSearchPremiumTool$Outbound & {
    type: "web_search_premium";
});

/** @internal */
declare const ModelConversationTools$outboundSchema: z.ZodType<ModelConversationTools$Outbound, z.ZodTypeDef, ModelConversationTools>;

declare type ModelConversationTools = (DocumentLibraryTool & {
    type: "document_library";
}) | (FunctionTool & {
    type: "function";
}) | (CodeInterpreterTool & {
    type: "code_interpreter";
}) | (ImageGenerationTool & {
    type: "image_generation";
}) | (WebSearchTool & {
    type: "web_search";
}) | (WebSearchPremiumTool & {
    type: "web_search_premium";
});

declare function modelConversationToolsFromJSON(jsonString: string): Result<ModelConversationTools, SDKValidationError>;

declare function modelConversationToolsToJSON(modelConversationTools: ModelConversationTools): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModelList$ {
    /** @deprecated use `ModelList$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ModelList, z.ZodTypeDef, unknown>;
    /** @deprecated use `ModelList$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ModelList$Outbound, z.ZodTypeDef, ModelList>;
    /** @deprecated use `ModelList$Outbound` instead. */
    type Outbound = ModelList$Outbound;
}

/** @internal */
declare const ModelList$inboundSchema: z.ZodType<ModelList, z.ZodTypeDef, unknown>;

/** @internal */
declare type ModelList$Outbound = {
    object: string;
    data?: Array<(FTModelCard$Outbound & {
        type: "fine-tuned";
    }) | (BaseModelCard$Outbound & {
        type: "base";
    })> | undefined;
};

/** @internal */
declare const ModelList$outboundSchema: z.ZodType<ModelList$Outbound, z.ZodTypeDef, ModelList>;

declare type ModelList = {
    object?: string | undefined;
    data?: Array<(FTModelCard & {
        type: "fine-tuned";
    }) | (BaseModelCard & {
        type: "base";
    })> | undefined;
};

declare function modelListFromJSON(jsonString: string): Result<ModelList, SDKValidationError>;

declare function modelListToJSON(modelList: ModelList): string;

declare class Models extends ClientSDK {
    /**
     * List Models
     *
     * @remarks
     * List all models available to the user.
     */
    list(options?: RequestOptions): Promise<components.ModelList>;
    /**
     * Retrieve Model
     *
     * @remarks
     * Retrieve information about a model.
     */
    retrieve(request: operations.RetrieveModelV1ModelsModelIdGetRequest, options?: RequestOptions): Promise<operations.RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet>;
    /**
     * Delete Model
     *
     * @remarks
     * Delete a fine-tuned model.
     */
    delete(request: operations.DeleteModelV1ModelsModelIdDeleteRequest, options?: RequestOptions): Promise<components.DeleteModelOut>;
    /**
     * Update Fine Tuned Model
     *
     * @remarks
     * Update a model name or description.
     */
    update(request: operations.JobsApiRoutesFineTuningUpdateFineTunedModelRequest, options?: RequestOptions): Promise<operations.JobsApiRoutesFineTuningUpdateFineTunedModelResponse>;
    /**
     * Archive Fine Tuned Model
     *
     * @remarks
     * Archive a fine-tuned model.
     */
    archive(request: operations.JobsApiRoutesFineTuningArchiveFineTunedModelRequest, options?: RequestOptions): Promise<components.ArchiveFTModelOut>;
    /**
     * Unarchive Fine Tuned Model
     *
     * @remarks
     * Un-archive a fine-tuned model.
     */
    unarchive(request: operations.JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest, options?: RequestOptions): Promise<components.UnarchiveFTModelOut>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModelType$ {
    /** @deprecated use `ModelType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
    }>;
    /** @deprecated use `ModelType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Completion: "completion";
    }>;
}

/** @internal */
declare const ModelType$inboundSchema: z.ZodNativeEnum<typeof ModelType>;

/** @internal */
declare const ModelType$outboundSchema: z.ZodNativeEnum<typeof ModelType>;

declare const ModelType: {
    readonly Completion: "completion";
};

declare type ModelType = ClosedEnum<typeof ModelType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModerationObject$ {
    /** @deprecated use `ModerationObject$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ModerationObject, z.ZodTypeDef, unknown>;
    /** @deprecated use `ModerationObject$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ModerationObject$Outbound, z.ZodTypeDef, ModerationObject>;
    /** @deprecated use `ModerationObject$Outbound` instead. */
    type Outbound = ModerationObject$Outbound;
}

/** @internal */
declare const ModerationObject$inboundSchema: z.ZodType<ModerationObject, z.ZodTypeDef, unknown>;

/** @internal */
declare type ModerationObject$Outbound = {
    categories?: {
        [k: string]: boolean;
    } | undefined;
    category_scores?: {
        [k: string]: number;
    } | undefined;
};

/** @internal */
declare const ModerationObject$outboundSchema: z.ZodType<ModerationObject$Outbound, z.ZodTypeDef, ModerationObject>;

declare type ModerationObject = {
    /**
     * Moderation result thresholds
     */
    categories?: {
        [k: string]: boolean;
    } | undefined;
    /**
     * Moderation result
     */
    categoryScores?: {
        [k: string]: number;
    } | undefined;
};

declare function moderationObjectFromJSON(jsonString: string): Result<ModerationObject, SDKValidationError>;

declare function moderationObjectToJSON(moderationObject: ModerationObject): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ModerationResponse$ {
    /** @deprecated use `ModerationResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ModerationResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `ModerationResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ModerationResponse$Outbound, z.ZodTypeDef, ModerationResponse>;
    /** @deprecated use `ModerationResponse$Outbound` instead. */
    type Outbound = ModerationResponse$Outbound;
}

/** @internal */
declare const ModerationResponse$inboundSchema: z.ZodType<ModerationResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type ModerationResponse$Outbound = {
    id: string;
    model: string;
    results: Array<ModerationObject$Outbound>;
};

/** @internal */
declare const ModerationResponse$outboundSchema: z.ZodType<ModerationResponse$Outbound, z.ZodTypeDef, ModerationResponse>;

declare type ModerationResponse = {
    id: string;
    model: string;
    results: Array<ModerationObject>;
};

declare function moderationResponseFromJSON(jsonString: string): Result<ModerationResponse, SDKValidationError>;

declare function moderationResponseToJSON(moderationResponse: ModerationResponse): string;

declare type OAuth2PasswordFlow = {
    username: string;
    password: string;
    clientID?: string | undefined;
    clientSecret?: string | undefined;
    tokenURL: string;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ObjectT$ {
    /** @deprecated use `ObjectT$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
    /** @deprecated use `ObjectT$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
}

/** @internal */
declare const ObjectT$inboundSchema: z.ZodNativeEnum<typeof ObjectT>;

/** @internal */
declare const ObjectT$outboundSchema: z.ZodNativeEnum<typeof ObjectT>;

declare const ObjectT: {
    readonly Entry: "entry";
};

declare type ObjectT = ClosedEnum<typeof ObjectT>;

declare class Ocr extends ClientSDK {
    /**
     * OCR
     */
    process(request: components.OCRRequest, options?: RequestOptions): Promise<components.OCRResponse>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OCRImageObject$ {
    /** @deprecated use `OCRImageObject$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OCRImageObject, z.ZodTypeDef, unknown>;
    /** @deprecated use `OCRImageObject$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OCRImageObject$Outbound, z.ZodTypeDef, OCRImageObject>;
    /** @deprecated use `OCRImageObject$Outbound` instead. */
    type Outbound = OCRImageObject$Outbound;
}

/** @internal */
declare const OCRImageObject$inboundSchema: z.ZodType<OCRImageObject, z.ZodTypeDef, unknown>;

/** @internal */
declare type OCRImageObject$Outbound = {
    id: string;
    top_left_x: number | null;
    top_left_y: number | null;
    bottom_right_x: number | null;
    bottom_right_y: number | null;
    image_base64?: string | null | undefined;
    image_annotation?: string | null | undefined;
};

/** @internal */
declare const OCRImageObject$outboundSchema: z.ZodType<OCRImageObject$Outbound, z.ZodTypeDef, OCRImageObject>;

declare type OCRImageObject = {
    /**
     * Image ID for extracted image in a page
     */
    id: string;
    /**
     * X coordinate of top-left corner of the extracted image
     */
    topLeftX: number | null;
    /**
     * Y coordinate of top-left corner of the extracted image
     */
    topLeftY: number | null;
    /**
     * X coordinate of bottom-right corner of the extracted image
     */
    bottomRightX: number | null;
    /**
     * Y coordinate of bottom-right corner of the extracted image
     */
    bottomRightY: number | null;
    /**
     * Base64 string of the extracted image
     */
    imageBase64?: string | null | undefined;
    /**
     * Annotation of the extracted image in json str
     */
    imageAnnotation?: string | null | undefined;
};

declare function ocrImageObjectFromJSON(jsonString: string): Result<OCRImageObject, SDKValidationError>;

declare function ocrImageObjectToJSON(ocrImageObject: OCRImageObject): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OCRPageDimensions$ {
    /** @deprecated use `OCRPageDimensions$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OCRPageDimensions, z.ZodTypeDef, unknown>;
    /** @deprecated use `OCRPageDimensions$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OCRPageDimensions$Outbound, z.ZodTypeDef, OCRPageDimensions>;
    /** @deprecated use `OCRPageDimensions$Outbound` instead. */
    type Outbound = OCRPageDimensions$Outbound;
}

/** @internal */
declare const OCRPageDimensions$inboundSchema: z.ZodType<OCRPageDimensions, z.ZodTypeDef, unknown>;

/** @internal */
declare type OCRPageDimensions$Outbound = {
    dpi: number;
    height: number;
    width: number;
};

/** @internal */
declare const OCRPageDimensions$outboundSchema: z.ZodType<OCRPageDimensions$Outbound, z.ZodTypeDef, OCRPageDimensions>;

declare type OCRPageDimensions = {
    /**
     * Dots per inch of the page-image
     */
    dpi: number;
    /**
     * Height of the image in pixels
     */
    height: number;
    /**
     * Width of the image in pixels
     */
    width: number;
};

declare function ocrPageDimensionsFromJSON(jsonString: string): Result<OCRPageDimensions, SDKValidationError>;

declare function ocrPageDimensionsToJSON(ocrPageDimensions: OCRPageDimensions): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OCRPageObject$ {
    /** @deprecated use `OCRPageObject$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OCRPageObject, z.ZodTypeDef, unknown>;
    /** @deprecated use `OCRPageObject$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OCRPageObject$Outbound, z.ZodTypeDef, OCRPageObject>;
    /** @deprecated use `OCRPageObject$Outbound` instead. */
    type Outbound = OCRPageObject$Outbound;
}

/** @internal */
declare const OCRPageObject$inboundSchema: z.ZodType<OCRPageObject, z.ZodTypeDef, unknown>;

/** @internal */
declare type OCRPageObject$Outbound = {
    index: number;
    markdown: string;
    images: Array<OCRImageObject$Outbound>;
    dimensions: OCRPageDimensions$Outbound | null;
};

/** @internal */
declare const OCRPageObject$outboundSchema: z.ZodType<OCRPageObject$Outbound, z.ZodTypeDef, OCRPageObject>;

declare type OCRPageObject = {
    /**
     * The page index in a pdf document starting from 0
     */
    index: number;
    /**
     * The markdown string response of the page
     */
    markdown: string;
    /**
     * List of all extracted images in the page
     */
    images: Array<OCRImageObject>;
    /**
     * The dimensions of the PDF Page's screenshot image
     */
    dimensions: OCRPageDimensions | null;
};

declare function ocrPageObjectFromJSON(jsonString: string): Result<OCRPageObject, SDKValidationError>;

declare function ocrPageObjectToJSON(ocrPageObject: OCRPageObject): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OCRRequest$ {
    /** @deprecated use `OCRRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OCRRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `OCRRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OCRRequest$Outbound, z.ZodTypeDef, OCRRequest>;
    /** @deprecated use `OCRRequest$Outbound` instead. */
    type Outbound = OCRRequest$Outbound;
}

/** @internal */
declare const OCRRequest$inboundSchema: z.ZodType<OCRRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type OCRRequest$Outbound = {
    model: string | null;
    id?: string | undefined;
    document: FileChunk$Outbound | DocumentURLChunk$Outbound | ImageURLChunk$Outbound;
    pages?: Array<number> | null | undefined;
    include_image_base64?: boolean | null | undefined;
    image_limit?: number | null | undefined;
    image_min_size?: number | null | undefined;
    bbox_annotation_format?: ResponseFormat$Outbound | null | undefined;
    document_annotation_format?: ResponseFormat$Outbound | null | undefined;
};

/** @internal */
declare const OCRRequest$outboundSchema: z.ZodType<OCRRequest$Outbound, z.ZodTypeDef, OCRRequest>;

declare type OCRRequest = {
    model: string | null;
    id?: string | undefined;
    /**
     * Document to run OCR on
     */
    document: FileChunk | DocumentURLChunk | ImageURLChunk;
    /**
     * Specific pages user wants to process in various formats: single number, range, or list of both. Starts from 0
     */
    pages?: Array<number> | null | undefined;
    /**
     * Include image URLs in response
     */
    includeImageBase64?: boolean | null | undefined;
    /**
     * Max images to extract
     */
    imageLimit?: number | null | undefined;
    /**
     * Minimum height and width of image to extract
     */
    imageMinSize?: number | null | undefined;
    /**
     * Structured output class for extracting useful information from each extracted bounding box / image from document. Only json_schema is valid for this field
     */
    bboxAnnotationFormat?: ResponseFormat | null | undefined;
    /**
     * Structured output class for extracting useful information from the entire document. Only json_schema is valid for this field
     */
    documentAnnotationFormat?: ResponseFormat | null | undefined;
};

declare function ocrRequestFromJSON(jsonString: string): Result<OCRRequest, SDKValidationError>;

declare function ocrRequestToJSON(ocrRequest: OCRRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OCRResponse$ {
    /** @deprecated use `OCRResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OCRResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `OCRResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OCRResponse$Outbound, z.ZodTypeDef, OCRResponse>;
    /** @deprecated use `OCRResponse$Outbound` instead. */
    type Outbound = OCRResponse$Outbound;
}

/** @internal */
declare const OCRResponse$inboundSchema: z.ZodType<OCRResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type OCRResponse$Outbound = {
    pages: Array<OCRPageObject$Outbound>;
    model: string;
    document_annotation?: string | null | undefined;
    usage_info: OCRUsageInfo$Outbound;
};

/** @internal */
declare const OCRResponse$outboundSchema: z.ZodType<OCRResponse$Outbound, z.ZodTypeDef, OCRResponse>;

declare type OCRResponse = {
    /**
     * List of OCR info for pages.
     */
    pages: Array<OCRPageObject>;
    /**
     * The model used to generate the OCR.
     */
    model: string;
    /**
     * Formatted response in the request_format if provided in json str
     */
    documentAnnotation?: string | null | undefined;
    usageInfo: OCRUsageInfo;
};

declare function ocrResponseFromJSON(jsonString: string): Result<OCRResponse, SDKValidationError>;

declare function ocrResponseToJSON(ocrResponse: OCRResponse): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OCRUsageInfo$ {
    /** @deprecated use `OCRUsageInfo$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OCRUsageInfo, z.ZodTypeDef, unknown>;
    /** @deprecated use `OCRUsageInfo$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OCRUsageInfo$Outbound, z.ZodTypeDef, OCRUsageInfo>;
    /** @deprecated use `OCRUsageInfo$Outbound` instead. */
    type Outbound = OCRUsageInfo$Outbound;
}

/** @internal */
declare const OCRUsageInfo$inboundSchema: z.ZodType<OCRUsageInfo, z.ZodTypeDef, unknown>;

/** @internal */
declare type OCRUsageInfo$Outbound = {
    pages_processed: number;
    doc_size_bytes?: number | null | undefined;
};

/** @internal */
declare const OCRUsageInfo$outboundSchema: z.ZodType<OCRUsageInfo$Outbound, z.ZodTypeDef, OCRUsageInfo>;

declare type OCRUsageInfo = {
    /**
     * Number of pages processed
     */
    pagesProcessed: number;
    /**
     * Document size in bytes
     */
    docSizeBytes?: number | null | undefined;
};

declare function ocrUsageInfoFromJSON(jsonString: string): Result<OCRUsageInfo, SDKValidationError>;

declare function ocrUsageInfoToJSON(ocrUsageInfo: OCRUsageInfo): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace One$ {
    /** @deprecated use `One$inboundSchema` instead. */
    const inboundSchema: z.ZodType<One, z.ZodTypeDef, unknown>;
    /** @deprecated use `One$outboundSchema` instead. */
    const outboundSchema: z.ZodType<One$Outbound, z.ZodTypeDef, One>;
    /** @deprecated use `One$Outbound` instead. */
    type Outbound = One$Outbound;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace One$_2 {
    /** @deprecated use `One$inboundSchema` instead. */
    const inboundSchema: z.ZodType<One_2, z.ZodTypeDef, unknown>;
    /** @deprecated use `One$outboundSchema` instead. */
    const outboundSchema: z.ZodType<One$Outbound_2, z.ZodTypeDef, One_2>;
    /** @deprecated use `One$Outbound` instead. */
    type Outbound = One$Outbound_2;
}

/** @internal */
declare const One$inboundSchema: z.ZodType<One, z.ZodTypeDef, unknown>;

/** @internal */
declare const One$inboundSchema_2: z.ZodType<One_2, z.ZodTypeDef, unknown>;

/** @internal */
declare type One$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare type One$Outbound_2 = (components.ClassifierJobOut$Outbound & {
    job_type: "classifier";
}) | (components.CompletionJobOut$Outbound & {
    job_type: "completion";
});

/** @internal */
declare const One$outboundSchema: z.ZodType<One$Outbound, z.ZodTypeDef, One>;

/** @internal */
declare const One$outboundSchema_2: z.ZodType<One$Outbound_2, z.ZodTypeDef, One_2>;

declare type One = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare type One_2 = (components.ClassifierJobOut & {
    jobType: "classifier";
}) | (components.CompletionJobOut & {
    jobType: "completion";
});

declare function oneFromJSON(jsonString: string): Result<One, SDKValidationError>;

declare function oneFromJSON_2(jsonString: string): Result<One_2, SDKValidationError>;

declare function oneToJSON(one: One): string;

declare function oneToJSON_2(one: One_2): string;

declare type OpenEnum<T> = Prettify<T[keyof T]> | Unrecognized<T[keyof T] extends number ? number : string>;

declare namespace operations {
    export {
        agentsApiV1AgentsGetRequestToJSON,
        agentsApiV1AgentsGetRequestFromJSON,
        AgentsApiV1AgentsGetRequest,
        AgentsApiV1AgentsGetRequest$inboundSchema,
        AgentsApiV1AgentsGetRequest$Outbound,
        AgentsApiV1AgentsGetRequest$outboundSchema,
        AgentsApiV1AgentsGetRequest$,
        agentsApiV1AgentsListRequestToJSON,
        agentsApiV1AgentsListRequestFromJSON,
        AgentsApiV1AgentsListRequest,
        AgentsApiV1AgentsListRequest$inboundSchema,
        AgentsApiV1AgentsListRequest$Outbound,
        AgentsApiV1AgentsListRequest$outboundSchema,
        AgentsApiV1AgentsListRequest$,
        agentsApiV1AgentsUpdateRequestToJSON,
        agentsApiV1AgentsUpdateRequestFromJSON,
        AgentsApiV1AgentsUpdateRequest,
        AgentsApiV1AgentsUpdateRequest$inboundSchema,
        AgentsApiV1AgentsUpdateRequest$Outbound,
        AgentsApiV1AgentsUpdateRequest$outboundSchema,
        AgentsApiV1AgentsUpdateRequest$,
        agentsApiV1AgentsUpdateVersionRequestToJSON,
        agentsApiV1AgentsUpdateVersionRequestFromJSON,
        AgentsApiV1AgentsUpdateVersionRequest,
        AgentsApiV1AgentsUpdateVersionRequest$inboundSchema,
        AgentsApiV1AgentsUpdateVersionRequest$Outbound,
        AgentsApiV1AgentsUpdateVersionRequest$outboundSchema,
        AgentsApiV1AgentsUpdateVersionRequest$,
        agentsApiV1ConversationsAppendRequestToJSON,
        agentsApiV1ConversationsAppendRequestFromJSON,
        AgentsApiV1ConversationsAppendRequest,
        AgentsApiV1ConversationsAppendRequest$inboundSchema,
        AgentsApiV1ConversationsAppendRequest$Outbound,
        AgentsApiV1ConversationsAppendRequest$outboundSchema,
        AgentsApiV1ConversationsAppendRequest$,
        agentsApiV1ConversationsAppendStreamRequestToJSON,
        agentsApiV1ConversationsAppendStreamRequestFromJSON,
        AgentsApiV1ConversationsAppendStreamRequest,
        AgentsApiV1ConversationsAppendStreamRequest$inboundSchema,
        AgentsApiV1ConversationsAppendStreamRequest$Outbound,
        AgentsApiV1ConversationsAppendStreamRequest$outboundSchema,
        AgentsApiV1ConversationsAppendStreamRequest$,
        agentsApiV1ConversationsGetRequestToJSON,
        agentsApiV1ConversationsGetRequestFromJSON,
        agentsApiV1ConversationsGetResponseV1ConversationsGetToJSON,
        agentsApiV1ConversationsGetResponseV1ConversationsGetFromJSON,
        AgentsApiV1ConversationsGetRequest,
        AgentsApiV1ConversationsGetResponseV1ConversationsGet,
        AgentsApiV1ConversationsGetRequest$inboundSchema,
        AgentsApiV1ConversationsGetRequest$Outbound,
        AgentsApiV1ConversationsGetRequest$outboundSchema,
        AgentsApiV1ConversationsGetRequest$,
        AgentsApiV1ConversationsGetResponseV1ConversationsGet$inboundSchema,
        AgentsApiV1ConversationsGetResponseV1ConversationsGet$Outbound,
        AgentsApiV1ConversationsGetResponseV1ConversationsGet$outboundSchema,
        AgentsApiV1ConversationsGetResponseV1ConversationsGet$,
        agentsApiV1ConversationsHistoryRequestToJSON,
        agentsApiV1ConversationsHistoryRequestFromJSON,
        AgentsApiV1ConversationsHistoryRequest,
        AgentsApiV1ConversationsHistoryRequest$inboundSchema,
        AgentsApiV1ConversationsHistoryRequest$Outbound,
        AgentsApiV1ConversationsHistoryRequest$outboundSchema,
        AgentsApiV1ConversationsHistoryRequest$,
        agentsApiV1ConversationsListRequestToJSON,
        agentsApiV1ConversationsListRequestFromJSON,
        responseBodyToJSON,
        responseBodyFromJSON,
        AgentsApiV1ConversationsListRequest,
        ResponseBody,
        AgentsApiV1ConversationsListRequest$inboundSchema,
        AgentsApiV1ConversationsListRequest$Outbound,
        AgentsApiV1ConversationsListRequest$outboundSchema,
        AgentsApiV1ConversationsListRequest$,
        ResponseBody$inboundSchema,
        ResponseBody$Outbound,
        ResponseBody$outboundSchema,
        ResponseBody$,
        agentsApiV1ConversationsMessagesRequestToJSON,
        agentsApiV1ConversationsMessagesRequestFromJSON,
        AgentsApiV1ConversationsMessagesRequest,
        AgentsApiV1ConversationsMessagesRequest$inboundSchema,
        AgentsApiV1ConversationsMessagesRequest$Outbound,
        AgentsApiV1ConversationsMessagesRequest$outboundSchema,
        AgentsApiV1ConversationsMessagesRequest$,
        agentsApiV1ConversationsRestartRequestToJSON,
        agentsApiV1ConversationsRestartRequestFromJSON,
        AgentsApiV1ConversationsRestartRequest,
        AgentsApiV1ConversationsRestartRequest$inboundSchema,
        AgentsApiV1ConversationsRestartRequest$Outbound,
        AgentsApiV1ConversationsRestartRequest$outboundSchema,
        AgentsApiV1ConversationsRestartRequest$,
        agentsApiV1ConversationsRestartStreamRequestToJSON,
        agentsApiV1ConversationsRestartStreamRequestFromJSON,
        AgentsApiV1ConversationsRestartStreamRequest,
        AgentsApiV1ConversationsRestartStreamRequest$inboundSchema,
        AgentsApiV1ConversationsRestartStreamRequest$Outbound,
        AgentsApiV1ConversationsRestartStreamRequest$outboundSchema,
        AgentsApiV1ConversationsRestartStreamRequest$,
        deleteModelV1ModelsModelIdDeleteRequestToJSON,
        deleteModelV1ModelsModelIdDeleteRequestFromJSON,
        DeleteModelV1ModelsModelIdDeleteRequest,
        DeleteModelV1ModelsModelIdDeleteRequest$inboundSchema,
        DeleteModelV1ModelsModelIdDeleteRequest$Outbound,
        DeleteModelV1ModelsModelIdDeleteRequest$outboundSchema,
        DeleteModelV1ModelsModelIdDeleteRequest$,
        filesApiRoutesDeleteFileRequestToJSON,
        filesApiRoutesDeleteFileRequestFromJSON,
        FilesApiRoutesDeleteFileRequest,
        FilesApiRoutesDeleteFileRequest$inboundSchema,
        FilesApiRoutesDeleteFileRequest$Outbound,
        FilesApiRoutesDeleteFileRequest$outboundSchema,
        FilesApiRoutesDeleteFileRequest$,
        filesApiRoutesDownloadFileRequestToJSON,
        filesApiRoutesDownloadFileRequestFromJSON,
        FilesApiRoutesDownloadFileRequest,
        FilesApiRoutesDownloadFileRequest$inboundSchema,
        FilesApiRoutesDownloadFileRequest$Outbound,
        FilesApiRoutesDownloadFileRequest$outboundSchema,
        FilesApiRoutesDownloadFileRequest$,
        filesApiRoutesGetSignedUrlRequestToJSON,
        filesApiRoutesGetSignedUrlRequestFromJSON,
        FilesApiRoutesGetSignedUrlRequest,
        FilesApiRoutesGetSignedUrlRequest$inboundSchema,
        FilesApiRoutesGetSignedUrlRequest$Outbound,
        FilesApiRoutesGetSignedUrlRequest$outboundSchema,
        FilesApiRoutesGetSignedUrlRequest$,
        filesApiRoutesListFilesRequestToJSON,
        filesApiRoutesListFilesRequestFromJSON,
        FilesApiRoutesListFilesRequest,
        FilesApiRoutesListFilesRequest$inboundSchema,
        FilesApiRoutesListFilesRequest$Outbound,
        FilesApiRoutesListFilesRequest$outboundSchema,
        FilesApiRoutesListFilesRequest$,
        filesApiRoutesRetrieveFileRequestToJSON,
        filesApiRoutesRetrieveFileRequestFromJSON,
        FilesApiRoutesRetrieveFileRequest,
        FilesApiRoutesRetrieveFileRequest$inboundSchema,
        FilesApiRoutesRetrieveFileRequest$Outbound,
        FilesApiRoutesRetrieveFileRequest$outboundSchema,
        FilesApiRoutesRetrieveFileRequest$,
        filesApiRoutesUploadFileMultiPartBodyParamsToJSON,
        filesApiRoutesUploadFileMultiPartBodyParamsFromJSON,
        FilesApiRoutesUploadFileMultiPartBodyParams,
        FilesApiRoutesUploadFileMultiPartBodyParams$inboundSchema,
        FilesApiRoutesUploadFileMultiPartBodyParams$Outbound,
        FilesApiRoutesUploadFileMultiPartBodyParams$outboundSchema,
        FilesApiRoutesUploadFileMultiPartBodyParams$,
        jobsApiRoutesBatchCancelBatchJobRequestToJSON,
        jobsApiRoutesBatchCancelBatchJobRequestFromJSON,
        JobsApiRoutesBatchCancelBatchJobRequest,
        JobsApiRoutesBatchCancelBatchJobRequest$inboundSchema,
        JobsApiRoutesBatchCancelBatchJobRequest$Outbound,
        JobsApiRoutesBatchCancelBatchJobRequest$outboundSchema,
        JobsApiRoutesBatchCancelBatchJobRequest$,
        jobsApiRoutesBatchGetBatchJobRequestToJSON,
        jobsApiRoutesBatchGetBatchJobRequestFromJSON,
        JobsApiRoutesBatchGetBatchJobRequest,
        JobsApiRoutesBatchGetBatchJobRequest$inboundSchema,
        JobsApiRoutesBatchGetBatchJobRequest$Outbound,
        JobsApiRoutesBatchGetBatchJobRequest$outboundSchema,
        JobsApiRoutesBatchGetBatchJobRequest$,
        jobsApiRoutesBatchGetBatchJobsRequestToJSON,
        jobsApiRoutesBatchGetBatchJobsRequestFromJSON,
        JobsApiRoutesBatchGetBatchJobsRequest,
        JobsApiRoutesBatchGetBatchJobsRequest$inboundSchema,
        JobsApiRoutesBatchGetBatchJobsRequest$Outbound,
        JobsApiRoutesBatchGetBatchJobsRequest$outboundSchema,
        JobsApiRoutesBatchGetBatchJobsRequest$,
        jobsApiRoutesFineTuningArchiveFineTunedModelRequestToJSON,
        jobsApiRoutesFineTuningArchiveFineTunedModelRequestFromJSON,
        JobsApiRoutesFineTuningArchiveFineTunedModelRequest,
        JobsApiRoutesFineTuningArchiveFineTunedModelRequest$inboundSchema,
        JobsApiRoutesFineTuningArchiveFineTunedModelRequest$Outbound,
        JobsApiRoutesFineTuningArchiveFineTunedModelRequest$outboundSchema,
        JobsApiRoutesFineTuningArchiveFineTunedModelRequest$,
        jobsApiRoutesFineTuningCancelFineTuningJobRequestToJSON,
        jobsApiRoutesFineTuningCancelFineTuningJobRequestFromJSON,
        jobsApiRoutesFineTuningCancelFineTuningJobResponseToJSON,
        jobsApiRoutesFineTuningCancelFineTuningJobResponseFromJSON,
        JobsApiRoutesFineTuningCancelFineTuningJobRequest,
        JobsApiRoutesFineTuningCancelFineTuningJobResponse,
        JobsApiRoutesFineTuningCancelFineTuningJobRequest$inboundSchema,
        JobsApiRoutesFineTuningCancelFineTuningJobRequest$Outbound,
        JobsApiRoutesFineTuningCancelFineTuningJobRequest$outboundSchema,
        JobsApiRoutesFineTuningCancelFineTuningJobRequest$,
        JobsApiRoutesFineTuningCancelFineTuningJobResponse$inboundSchema,
        JobsApiRoutesFineTuningCancelFineTuningJobResponse$Outbound,
        JobsApiRoutesFineTuningCancelFineTuningJobResponse$outboundSchema,
        JobsApiRoutesFineTuningCancelFineTuningJobResponse$,
        oneToJSON_2 as oneToJSON,
        oneFromJSON_2 as oneFromJSON,
        jobsApiRoutesFineTuningCreateFineTuningJobResponseToJSON,
        jobsApiRoutesFineTuningCreateFineTuningJobResponseFromJSON,
        One_2 as One,
        JobsApiRoutesFineTuningCreateFineTuningJobResponse,
        One$inboundSchema_2 as One$inboundSchema,
        One$Outbound_2 as One$Outbound,
        One$outboundSchema_2 as One$outboundSchema,
        One$_2 as One$,
        JobsApiRoutesFineTuningCreateFineTuningJobResponse$inboundSchema,
        JobsApiRoutesFineTuningCreateFineTuningJobResponse$Outbound,
        JobsApiRoutesFineTuningCreateFineTuningJobResponse$outboundSchema,
        JobsApiRoutesFineTuningCreateFineTuningJobResponse$,
        jobsApiRoutesFineTuningGetFineTuningJobRequestToJSON,
        jobsApiRoutesFineTuningGetFineTuningJobRequestFromJSON,
        jobsApiRoutesFineTuningGetFineTuningJobResponseToJSON,
        jobsApiRoutesFineTuningGetFineTuningJobResponseFromJSON,
        JobsApiRoutesFineTuningGetFineTuningJobRequest,
        JobsApiRoutesFineTuningGetFineTuningJobResponse,
        JobsApiRoutesFineTuningGetFineTuningJobRequest$inboundSchema,
        JobsApiRoutesFineTuningGetFineTuningJobRequest$Outbound,
        JobsApiRoutesFineTuningGetFineTuningJobRequest$outboundSchema,
        JobsApiRoutesFineTuningGetFineTuningJobRequest$,
        JobsApiRoutesFineTuningGetFineTuningJobResponse$inboundSchema,
        JobsApiRoutesFineTuningGetFineTuningJobResponse$Outbound,
        JobsApiRoutesFineTuningGetFineTuningJobResponse$outboundSchema,
        JobsApiRoutesFineTuningGetFineTuningJobResponse$,
        jobsApiRoutesFineTuningGetFineTuningJobsRequestToJSON,
        jobsApiRoutesFineTuningGetFineTuningJobsRequestFromJSON,
        Status_2 as Status,
        JobsApiRoutesFineTuningGetFineTuningJobsRequest,
        Status$inboundSchema_2 as Status$inboundSchema,
        Status$outboundSchema_2 as Status$outboundSchema,
        Status$_2 as Status$,
        JobsApiRoutesFineTuningGetFineTuningJobsRequest$inboundSchema,
        JobsApiRoutesFineTuningGetFineTuningJobsRequest$Outbound,
        JobsApiRoutesFineTuningGetFineTuningJobsRequest$outboundSchema,
        JobsApiRoutesFineTuningGetFineTuningJobsRequest$,
        jobsApiRoutesFineTuningStartFineTuningJobRequestToJSON,
        jobsApiRoutesFineTuningStartFineTuningJobRequestFromJSON,
        jobsApiRoutesFineTuningStartFineTuningJobResponseToJSON,
        jobsApiRoutesFineTuningStartFineTuningJobResponseFromJSON,
        JobsApiRoutesFineTuningStartFineTuningJobRequest,
        JobsApiRoutesFineTuningStartFineTuningJobResponse,
        JobsApiRoutesFineTuningStartFineTuningJobRequest$inboundSchema,
        JobsApiRoutesFineTuningStartFineTuningJobRequest$Outbound,
        JobsApiRoutesFineTuningStartFineTuningJobRequest$outboundSchema,
        JobsApiRoutesFineTuningStartFineTuningJobRequest$,
        JobsApiRoutesFineTuningStartFineTuningJobResponse$inboundSchema,
        JobsApiRoutesFineTuningStartFineTuningJobResponse$Outbound,
        JobsApiRoutesFineTuningStartFineTuningJobResponse$outboundSchema,
        JobsApiRoutesFineTuningStartFineTuningJobResponse$,
        jobsApiRoutesFineTuningUnarchiveFineTunedModelRequestToJSON,
        jobsApiRoutesFineTuningUnarchiveFineTunedModelRequestFromJSON,
        JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest,
        JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$inboundSchema,
        JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$Outbound,
        JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$outboundSchema,
        JobsApiRoutesFineTuningUnarchiveFineTunedModelRequest$,
        jobsApiRoutesFineTuningUpdateFineTunedModelRequestToJSON,
        jobsApiRoutesFineTuningUpdateFineTunedModelRequestFromJSON,
        jobsApiRoutesFineTuningUpdateFineTunedModelResponseToJSON,
        jobsApiRoutesFineTuningUpdateFineTunedModelResponseFromJSON,
        JobsApiRoutesFineTuningUpdateFineTunedModelRequest,
        JobsApiRoutesFineTuningUpdateFineTunedModelResponse,
        JobsApiRoutesFineTuningUpdateFineTunedModelRequest$inboundSchema,
        JobsApiRoutesFineTuningUpdateFineTunedModelRequest$Outbound,
        JobsApiRoutesFineTuningUpdateFineTunedModelRequest$outboundSchema,
        JobsApiRoutesFineTuningUpdateFineTunedModelRequest$,
        JobsApiRoutesFineTuningUpdateFineTunedModelResponse$inboundSchema,
        JobsApiRoutesFineTuningUpdateFineTunedModelResponse$Outbound,
        JobsApiRoutesFineTuningUpdateFineTunedModelResponse$outboundSchema,
        JobsApiRoutesFineTuningUpdateFineTunedModelResponse$,
        librariesDeleteV1RequestToJSON,
        librariesDeleteV1RequestFromJSON,
        LibrariesDeleteV1Request,
        LibrariesDeleteV1Request$inboundSchema,
        LibrariesDeleteV1Request$Outbound,
        LibrariesDeleteV1Request$outboundSchema,
        LibrariesDeleteV1Request$,
        librariesDocumentsDeleteV1RequestToJSON,
        librariesDocumentsDeleteV1RequestFromJSON,
        LibrariesDocumentsDeleteV1Request,
        LibrariesDocumentsDeleteV1Request$inboundSchema,
        LibrariesDocumentsDeleteV1Request$Outbound,
        LibrariesDocumentsDeleteV1Request$outboundSchema,
        LibrariesDocumentsDeleteV1Request$,
        librariesDocumentsGetExtractedTextSignedUrlV1RequestToJSON,
        librariesDocumentsGetExtractedTextSignedUrlV1RequestFromJSON,
        LibrariesDocumentsGetExtractedTextSignedUrlV1Request,
        LibrariesDocumentsGetExtractedTextSignedUrlV1Request$inboundSchema,
        LibrariesDocumentsGetExtractedTextSignedUrlV1Request$Outbound,
        LibrariesDocumentsGetExtractedTextSignedUrlV1Request$outboundSchema,
        LibrariesDocumentsGetExtractedTextSignedUrlV1Request$,
        librariesDocumentsGetSignedUrlV1RequestToJSON,
        librariesDocumentsGetSignedUrlV1RequestFromJSON,
        LibrariesDocumentsGetSignedUrlV1Request,
        LibrariesDocumentsGetSignedUrlV1Request$inboundSchema,
        LibrariesDocumentsGetSignedUrlV1Request$Outbound,
        LibrariesDocumentsGetSignedUrlV1Request$outboundSchema,
        LibrariesDocumentsGetSignedUrlV1Request$,
        librariesDocumentsGetStatusV1RequestToJSON,
        librariesDocumentsGetStatusV1RequestFromJSON,
        LibrariesDocumentsGetStatusV1Request,
        LibrariesDocumentsGetStatusV1Request$inboundSchema,
        LibrariesDocumentsGetStatusV1Request$Outbound,
        LibrariesDocumentsGetStatusV1Request$outboundSchema,
        LibrariesDocumentsGetStatusV1Request$,
        librariesDocumentsGetTextContentV1RequestToJSON,
        librariesDocumentsGetTextContentV1RequestFromJSON,
        LibrariesDocumentsGetTextContentV1Request,
        LibrariesDocumentsGetTextContentV1Request$inboundSchema,
        LibrariesDocumentsGetTextContentV1Request$Outbound,
        LibrariesDocumentsGetTextContentV1Request$outboundSchema,
        LibrariesDocumentsGetTextContentV1Request$,
        librariesDocumentsGetV1RequestToJSON,
        librariesDocumentsGetV1RequestFromJSON,
        LibrariesDocumentsGetV1Request,
        LibrariesDocumentsGetV1Request$inboundSchema,
        LibrariesDocumentsGetV1Request$Outbound,
        LibrariesDocumentsGetV1Request$outboundSchema,
        LibrariesDocumentsGetV1Request$,
        librariesDocumentsListV1RequestToJSON,
        librariesDocumentsListV1RequestFromJSON,
        LibrariesDocumentsListV1Request,
        LibrariesDocumentsListV1Request$inboundSchema,
        LibrariesDocumentsListV1Request$Outbound,
        LibrariesDocumentsListV1Request$outboundSchema,
        LibrariesDocumentsListV1Request$,
        librariesDocumentsReprocessV1RequestToJSON,
        librariesDocumentsReprocessV1RequestFromJSON,
        LibrariesDocumentsReprocessV1Request,
        LibrariesDocumentsReprocessV1Request$inboundSchema,
        LibrariesDocumentsReprocessV1Request$Outbound,
        LibrariesDocumentsReprocessV1Request$outboundSchema,
        LibrariesDocumentsReprocessV1Request$,
        librariesDocumentsUpdateV1RequestToJSON,
        librariesDocumentsUpdateV1RequestFromJSON,
        LibrariesDocumentsUpdateV1Request,
        LibrariesDocumentsUpdateV1Request$inboundSchema,
        LibrariesDocumentsUpdateV1Request$Outbound,
        LibrariesDocumentsUpdateV1Request$outboundSchema,
        LibrariesDocumentsUpdateV1Request$,
        librariesDocumentsUploadV1DocumentUploadToJSON,
        librariesDocumentsUploadV1DocumentUploadFromJSON,
        librariesDocumentsUploadV1RequestToJSON,
        librariesDocumentsUploadV1RequestFromJSON,
        LibrariesDocumentsUploadV1DocumentUpload,
        LibrariesDocumentsUploadV1Request,
        LibrariesDocumentsUploadV1DocumentUpload$inboundSchema,
        LibrariesDocumentsUploadV1DocumentUpload$Outbound,
        LibrariesDocumentsUploadV1DocumentUpload$outboundSchema,
        LibrariesDocumentsUploadV1DocumentUpload$,
        LibrariesDocumentsUploadV1Request$inboundSchema,
        LibrariesDocumentsUploadV1Request$Outbound,
        LibrariesDocumentsUploadV1Request$outboundSchema,
        LibrariesDocumentsUploadV1Request$,
        librariesGetV1RequestToJSON,
        librariesGetV1RequestFromJSON,
        LibrariesGetV1Request,
        LibrariesGetV1Request$inboundSchema,
        LibrariesGetV1Request$Outbound,
        LibrariesGetV1Request$outboundSchema,
        LibrariesGetV1Request$,
        librariesShareCreateV1RequestToJSON,
        librariesShareCreateV1RequestFromJSON,
        LibrariesShareCreateV1Request,
        LibrariesShareCreateV1Request$inboundSchema,
        LibrariesShareCreateV1Request$Outbound,
        LibrariesShareCreateV1Request$outboundSchema,
        LibrariesShareCreateV1Request$,
        librariesShareDeleteV1RequestToJSON,
        librariesShareDeleteV1RequestFromJSON,
        LibrariesShareDeleteV1Request,
        LibrariesShareDeleteV1Request$inboundSchema,
        LibrariesShareDeleteV1Request$Outbound,
        LibrariesShareDeleteV1Request$outboundSchema,
        LibrariesShareDeleteV1Request$,
        librariesShareListV1RequestToJSON,
        librariesShareListV1RequestFromJSON,
        LibrariesShareListV1Request,
        LibrariesShareListV1Request$inboundSchema,
        LibrariesShareListV1Request$Outbound,
        LibrariesShareListV1Request$outboundSchema,
        LibrariesShareListV1Request$,
        librariesUpdateV1RequestToJSON,
        librariesUpdateV1RequestFromJSON,
        LibrariesUpdateV1Request,
        LibrariesUpdateV1Request$inboundSchema,
        LibrariesUpdateV1Request$Outbound,
        LibrariesUpdateV1Request$outboundSchema,
        LibrariesUpdateV1Request$,
        retrieveModelV1ModelsModelIdGetRequestToJSON,
        retrieveModelV1ModelsModelIdGetRequestFromJSON,
        retrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGetToJSON,
        retrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGetFromJSON,
        RetrieveModelV1ModelsModelIdGetRequest,
        RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet,
        RetrieveModelV1ModelsModelIdGetRequest$inboundSchema,
        RetrieveModelV1ModelsModelIdGetRequest$Outbound,
        RetrieveModelV1ModelsModelIdGetRequest$outboundSchema,
        RetrieveModelV1ModelsModelIdGetRequest$,
        RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$inboundSchema,
        RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$Outbound,
        RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$outboundSchema,
        RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$
    }
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace OutputContentChunks$ {
    /** @deprecated use `OutputContentChunks$inboundSchema` instead. */
    const inboundSchema: z.ZodType<OutputContentChunks, z.ZodTypeDef, unknown>;
    /** @deprecated use `OutputContentChunks$outboundSchema` instead. */
    const outboundSchema: z.ZodType<OutputContentChunks$Outbound, z.ZodTypeDef, OutputContentChunks>;
    /** @deprecated use `OutputContentChunks$Outbound` instead. */
    type Outbound = OutputContentChunks$Outbound;
}

/** @internal */
declare const OutputContentChunks$inboundSchema: z.ZodType<OutputContentChunks, z.ZodTypeDef, unknown>;

/** @internal */
declare type OutputContentChunks$Outbound = ToolFileChunk$Outbound | ToolReferenceChunk$Outbound | TextChunk$Outbound | ImageURLChunk$Outbound | DocumentURLChunk$Outbound | ThinkChunk$Outbound;

/** @internal */
declare const OutputContentChunks$outboundSchema: z.ZodType<OutputContentChunks$Outbound, z.ZodTypeDef, OutputContentChunks>;

declare type OutputContentChunks = ToolFileChunk | ToolReferenceChunk | TextChunk | ImageURLChunk | DocumentURLChunk | ThinkChunk;

declare function outputContentChunksFromJSON(jsonString: string): Result<OutputContentChunks, SDKValidationError>;

declare function outputContentChunksToJSON(outputContentChunks: OutputContentChunks): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Outputs$ {
    /** @deprecated use `Outputs$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Outputs, z.ZodTypeDef, unknown>;
    /** @deprecated use `Outputs$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Outputs$Outbound, z.ZodTypeDef, Outputs>;
    /** @deprecated use `Outputs$Outbound` instead. */
    type Outbound = Outputs$Outbound;
}

/** @internal */
declare const Outputs$inboundSchema: z.ZodType<Outputs, z.ZodTypeDef, unknown>;

/** @internal */
declare type Outputs$Outbound = AgentHandoffEntry$Outbound | FunctionCallEntry$Outbound | ToolExecutionEntry$Outbound | MessageOutputEntry$Outbound;

/** @internal */
declare const Outputs$outboundSchema: z.ZodType<Outputs$Outbound, z.ZodTypeDef, Outputs>;

declare type Outputs = AgentHandoffEntry | FunctionCallEntry | ToolExecutionEntry | MessageOutputEntry;

declare function outputsFromJSON(jsonString: string): Result<Outputs, SDKValidationError>;

declare function outputsToJSON(outputs: Outputs): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace PaginationInfo$ {
    /** @deprecated use `PaginationInfo$inboundSchema` instead. */
    const inboundSchema: z.ZodType<PaginationInfo, z.ZodTypeDef, unknown>;
    /** @deprecated use `PaginationInfo$outboundSchema` instead. */
    const outboundSchema: z.ZodType<PaginationInfo$Outbound, z.ZodTypeDef, PaginationInfo>;
    /** @deprecated use `PaginationInfo$Outbound` instead. */
    type Outbound = PaginationInfo$Outbound;
}

/** @internal */
declare const PaginationInfo$inboundSchema: z.ZodType<PaginationInfo, z.ZodTypeDef, unknown>;

/** @internal */
declare type PaginationInfo$Outbound = {
    total_items: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    has_more: boolean;
};

/** @internal */
declare const PaginationInfo$outboundSchema: z.ZodType<PaginationInfo$Outbound, z.ZodTypeDef, PaginationInfo>;

declare type PaginationInfo = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
};

declare function paginationInfoFromJSON(jsonString: string): Result<PaginationInfo, SDKValidationError>;

declare function paginationInfoToJSON(paginationInfo: PaginationInfo): string;

declare type ParsedAssistantMessage<T extends z_2.ZodTypeAny> = components.AssistantMessage & {
    parsed?: z_2.infer<T> | undefined;
};

declare type ParsedChatCompletionChoice<T extends z_2.ZodTypeAny> = Omit<components.ChatCompletionChoice, 'message'> & {
    message?: ParsedAssistantMessage<T> | undefined;
};

declare type ParsedChatCompletionRequest<T extends z_2.ZodTypeAny> = Omit<components.ChatCompletionRequest, 'responseFormat'> & {
    responseFormat: T;
};

declare type ParsedChatCompletionResponse<T extends z_2.ZodTypeAny> = Omit<components.ChatCompletionResponse, 'choices'> & {
    choices?: Array<ParsedChatCompletionChoice<T>> | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Prediction$ {
    /** @deprecated use `Prediction$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Prediction, z.ZodTypeDef, unknown>;
    /** @deprecated use `Prediction$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Prediction$Outbound, z.ZodTypeDef, Prediction>;
    /** @deprecated use `Prediction$Outbound` instead. */
    type Outbound = Prediction$Outbound;
}

/** @internal */
declare const Prediction$inboundSchema: z.ZodType<Prediction, z.ZodTypeDef, unknown>;

/** @internal */
declare type Prediction$Outbound = {
    type: "content";
    content: string;
};

/** @internal */
declare const Prediction$outboundSchema: z.ZodType<Prediction$Outbound, z.ZodTypeDef, Prediction>;

declare type Prediction = {
    type?: "content" | undefined;
    content?: string | undefined;
};

declare function predictionFromJSON(jsonString: string): Result<Prediction, SDKValidationError>;

declare function predictionToJSON(prediction: Prediction): string;

declare type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ProcessingStatusOut$ {
    /** @deprecated use `ProcessingStatusOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ProcessingStatusOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `ProcessingStatusOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ProcessingStatusOut$Outbound, z.ZodTypeDef, ProcessingStatusOut>;
    /** @deprecated use `ProcessingStatusOut$Outbound` instead. */
    type Outbound = ProcessingStatusOut$Outbound;
}

/** @internal */
declare const ProcessingStatusOut$inboundSchema: z.ZodType<ProcessingStatusOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type ProcessingStatusOut$Outbound = {
    document_id: string;
    processing_status: string;
};

/** @internal */
declare const ProcessingStatusOut$outboundSchema: z.ZodType<ProcessingStatusOut$Outbound, z.ZodTypeDef, ProcessingStatusOut>;

declare type ProcessingStatusOut = {
    documentId: string;
    processingStatus: string;
};

declare function processingStatusOutFromJSON(jsonString: string): Result<ProcessingStatusOut, SDKValidationError>;

declare function processingStatusOutToJSON(processingStatusOut: ProcessingStatusOut): string;

/**
 * Consumes a stream and returns a concatenated array buffer. Useful in
 * situations where we need to read the whole file because it forms part of a
 * larger payload containing other fields, and we can't modify the underlying
 * request structure.
 */
declare function readableStreamToArrayBuffer(readable: ReadableStream<Uint8Array>): Promise<ArrayBuffer>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ReferenceChunk$ {
    /** @deprecated use `ReferenceChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ReferenceChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `ReferenceChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ReferenceChunk$Outbound, z.ZodTypeDef, ReferenceChunk>;
    /** @deprecated use `ReferenceChunk$Outbound` instead. */
    type Outbound = ReferenceChunk$Outbound;
}

/** @internal */
declare const ReferenceChunk$inboundSchema: z.ZodType<ReferenceChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type ReferenceChunk$Outbound = {
    reference_ids: Array<number>;
    type: string;
};

/** @internal */
declare const ReferenceChunk$outboundSchema: z.ZodType<ReferenceChunk$Outbound, z.ZodTypeDef, ReferenceChunk>;

declare type ReferenceChunk = {
    referenceIds: Array<number>;
    type?: ReferenceChunkType | undefined;
};

declare function referenceChunkFromJSON(jsonString: string): Result<ReferenceChunk, SDKValidationError>;

declare function referenceChunkToJSON(referenceChunk: ReferenceChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ReferenceChunkType$ {
    /** @deprecated use `ReferenceChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Reference: "reference";
    }>;
    /** @deprecated use `ReferenceChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Reference: "reference";
    }>;
}

/** @internal */
declare const ReferenceChunkType$inboundSchema: z.ZodNativeEnum<typeof ReferenceChunkType>;

/** @internal */
declare const ReferenceChunkType$outboundSchema: z.ZodNativeEnum<typeof ReferenceChunkType>;

declare const ReferenceChunkType: {
    readonly Reference: "reference";
};

declare type ReferenceChunkType = ClosedEnum<typeof ReferenceChunkType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Repositories$ {
    /** @deprecated use `Repositories$inboundSchema` instead. */
    const inboundSchema: z.ZodType<GithubRepositoryOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `Repositories$outboundSchema` instead. */
    const outboundSchema: z.ZodType<GithubRepositoryOut$Outbound, z.ZodTypeDef, GithubRepositoryOut>;
    /** @deprecated use `Repositories$Outbound` instead. */
    type Outbound = Repositories$Outbound;
}

/** @internal */
declare const Repositories$inboundSchema: z.ZodType<Repositories, z.ZodTypeDef, unknown>;

/** @internal */
declare type Repositories$Outbound = GithubRepositoryOut$Outbound;

/** @internal */
declare const Repositories$outboundSchema: z.ZodType<Repositories$Outbound, z.ZodTypeDef, Repositories>;

declare type Repositories = GithubRepositoryOut;

declare function repositoriesFromJSON(jsonString: string): Result<Repositories, SDKValidationError>;

declare function repositoriesToJSON(repositories: Repositories): string;

/**
 * An error that is raised when a HTTP request was aborted by the client error.
 */
declare class RequestAbortedError extends HTTPClientError {
    readonly name = "RequestAbortedError";
}

declare type RequestConfig = {
    method: string;
    path: string;
    baseURL?: string | URL | undefined;
    query?: string;
    body?: RequestInit["body"];
    headers?: HeadersInit;
    security?: SecurityState | null;
    uaHeader?: string;
    userAgent?: string | undefined;
    timeoutMs?: number;
};

declare type RequestErrorHook = (err: unknown, req: Request) => Awaitable<void>;

declare type RequestInput = {
    /**
     * The URL the request will use.
     */
    url: URL;
    /**
     * Options used to create a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request).
     */
    options?: RequestInit | undefined;
};

declare type RequestOptions = {
    /**
     * Sets a timeout, in milliseconds, on HTTP requests made by an SDK method. If
     * `fetchOptions.signal` is set then it will take precedence over this option.
     */
    timeoutMs?: number;
    /**
     * Set or override a retry policy on HTTP calls.
     */
    retries?: RetryConfig;
    /**
     * Specifies the status codes which should be retried using the given retry policy.
     */
    retryCodes?: string[];
    /**
     * Overrides the base server URL that will be used by an operation.
     */
    serverURL?: string | URL;
    /**
     * @deprecated `fetchOptions` has been flattened into `RequestOptions`.
     *
     * Sets various request options on the `fetch` call made by an SDK method.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options|Request}
     */
    fetchOptions?: Omit<RequestInit, "method" | "body">;
} & Omit<RequestInit, "method" | "body">;

/**
 * An error that is raised when a HTTP request timed out due to an AbortSignal
 * signal timeout.
 */
declare class RequestTimeoutError extends HTTPClientError {
    readonly name = "RequestTimeoutError";
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseBody$ {
    /** @deprecated use `ResponseBody$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ResponseBody, z.ZodTypeDef, unknown>;
    /** @deprecated use `ResponseBody$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ResponseBody$Outbound, z.ZodTypeDef, ResponseBody>;
    /** @deprecated use `ResponseBody$Outbound` instead. */
    type Outbound = ResponseBody$Outbound;
}

/** @internal */
declare const ResponseBody$inboundSchema: z.ZodType<ResponseBody, z.ZodTypeDef, unknown>;

/** @internal */
declare type ResponseBody$Outbound = components.ModelConversation$Outbound | components.AgentConversation$Outbound;

/** @internal */
declare const ResponseBody$outboundSchema: z.ZodType<ResponseBody$Outbound, z.ZodTypeDef, ResponseBody>;

declare type ResponseBody = components.ModelConversation | components.AgentConversation;

declare function responseBodyFromJSON(jsonString: string): Result<ResponseBody, SDKValidationError>;

declare function responseBodyToJSON(responseBody: ResponseBody): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseDoneEvent$ {
    /** @deprecated use `ResponseDoneEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ResponseDoneEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ResponseDoneEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ResponseDoneEvent$Outbound, z.ZodTypeDef, ResponseDoneEvent>;
    /** @deprecated use `ResponseDoneEvent$Outbound` instead. */
    type Outbound = ResponseDoneEvent$Outbound;
}

/** @internal */
declare const ResponseDoneEvent$inboundSchema: z.ZodType<ResponseDoneEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ResponseDoneEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    usage: ConversationUsageInfo$Outbound;
};

/** @internal */
declare const ResponseDoneEvent$outboundSchema: z.ZodType<ResponseDoneEvent$Outbound, z.ZodTypeDef, ResponseDoneEvent>;

declare type ResponseDoneEvent = {
    type?: ResponseDoneEventType | undefined;
    createdAt?: Date | undefined;
    usage: ConversationUsageInfo;
};

declare function responseDoneEventFromJSON(jsonString: string): Result<ResponseDoneEvent, SDKValidationError>;

declare function responseDoneEventToJSON(responseDoneEvent: ResponseDoneEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseDoneEventType$ {
    /** @deprecated use `ResponseDoneEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseDone: "conversation.response.done";
    }>;
    /** @deprecated use `ResponseDoneEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseDone: "conversation.response.done";
    }>;
}

/** @internal */
declare const ResponseDoneEventType$inboundSchema: z.ZodNativeEnum<typeof ResponseDoneEventType>;

/** @internal */
declare const ResponseDoneEventType$outboundSchema: z.ZodNativeEnum<typeof ResponseDoneEventType>;

declare const ResponseDoneEventType: {
    readonly ConversationResponseDone: "conversation.response.done";
};

declare type ResponseDoneEventType = ClosedEnum<typeof ResponseDoneEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseErrorEvent$ {
    /** @deprecated use `ResponseErrorEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ResponseErrorEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ResponseErrorEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ResponseErrorEvent$Outbound, z.ZodTypeDef, ResponseErrorEvent>;
    /** @deprecated use `ResponseErrorEvent$Outbound` instead. */
    type Outbound = ResponseErrorEvent$Outbound;
}

/** @internal */
declare const ResponseErrorEvent$inboundSchema: z.ZodType<ResponseErrorEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ResponseErrorEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    message: string;
    code: number;
};

/** @internal */
declare const ResponseErrorEvent$outboundSchema: z.ZodType<ResponseErrorEvent$Outbound, z.ZodTypeDef, ResponseErrorEvent>;

declare type ResponseErrorEvent = {
    type?: ResponseErrorEventType | undefined;
    createdAt?: Date | undefined;
    message: string;
    code: number;
};

declare function responseErrorEventFromJSON(jsonString: string): Result<ResponseErrorEvent, SDKValidationError>;

declare function responseErrorEventToJSON(responseErrorEvent: ResponseErrorEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseErrorEventType$ {
    /** @deprecated use `ResponseErrorEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseError: "conversation.response.error";
    }>;
    /** @deprecated use `ResponseErrorEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseError: "conversation.response.error";
    }>;
}

/** @internal */
declare const ResponseErrorEventType$inboundSchema: z.ZodNativeEnum<typeof ResponseErrorEventType>;

/** @internal */
declare const ResponseErrorEventType$outboundSchema: z.ZodNativeEnum<typeof ResponseErrorEventType>;

declare const ResponseErrorEventType: {
    readonly ConversationResponseError: "conversation.response.error";
};

declare type ResponseErrorEventType = ClosedEnum<typeof ResponseErrorEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseFormat$ {
    /** @deprecated use `ResponseFormat$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ResponseFormat, z.ZodTypeDef, unknown>;
    /** @deprecated use `ResponseFormat$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ResponseFormat$Outbound, z.ZodTypeDef, ResponseFormat>;
    /** @deprecated use `ResponseFormat$Outbound` instead. */
    type Outbound = ResponseFormat$Outbound;
}

/** @internal */
declare const ResponseFormat$inboundSchema: z.ZodType<ResponseFormat, z.ZodTypeDef, unknown>;

/** @internal */
declare type ResponseFormat$Outbound = {
    type?: string | undefined;
    json_schema?: JsonSchema$Outbound | null | undefined;
};

/** @internal */
declare const ResponseFormat$outboundSchema: z.ZodType<ResponseFormat$Outbound, z.ZodTypeDef, ResponseFormat>;

declare type ResponseFormat = {
    /**
     * An object specifying the format that the model must output. Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the message the model generates is in JSON. When using JSON mode you MUST also instruct the model to produce JSON yourself with a system or a user message.
     */
    type?: ResponseFormats | undefined;
    jsonSchema?: JsonSchema | null | undefined;
};

declare function responseFormatFromJSON(jsonString: string): Result<ResponseFormat, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseFormats$ {
    /** @deprecated use `ResponseFormats$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Text: "text";
        readonly JsonObject: "json_object";
        readonly JsonSchema: "json_schema";
    }>;
    /** @deprecated use `ResponseFormats$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Text: "text";
        readonly JsonObject: "json_object";
        readonly JsonSchema: "json_schema";
    }>;
}

/** @internal */
declare const ResponseFormats$inboundSchema: z.ZodNativeEnum<typeof ResponseFormats>;

/** @internal */
declare const ResponseFormats$outboundSchema: z.ZodNativeEnum<typeof ResponseFormats>;

/**
 * An object specifying the format that the model must output. Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the message the model generates is in JSON. When using JSON mode you MUST also instruct the model to produce JSON yourself with a system or a user message.
 */
declare const ResponseFormats: {
    readonly Text: "text";
    readonly JsonObject: "json_object";
    readonly JsonSchema: "json_schema";
};

/**
 * An object specifying the format that the model must output. Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the message the model generates is in JSON. When using JSON mode you MUST also instruct the model to produce JSON yourself with a system or a user message.
 */
declare type ResponseFormats = ClosedEnum<typeof ResponseFormats>;

declare function responseFormatToJSON(responseFormat: ResponseFormat): string;

declare type ResponseHook = (res: Response, req: Request) => Awaitable<void>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseStartedEvent$ {
    /** @deprecated use `ResponseStartedEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ResponseStartedEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ResponseStartedEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ResponseStartedEvent$Outbound, z.ZodTypeDef, ResponseStartedEvent>;
    /** @deprecated use `ResponseStartedEvent$Outbound` instead. */
    type Outbound = ResponseStartedEvent$Outbound;
}

/** @internal */
declare const ResponseStartedEvent$inboundSchema: z.ZodType<ResponseStartedEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ResponseStartedEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    conversation_id: string;
};

/** @internal */
declare const ResponseStartedEvent$outboundSchema: z.ZodType<ResponseStartedEvent$Outbound, z.ZodTypeDef, ResponseStartedEvent>;

declare type ResponseStartedEvent = {
    type?: ResponseStartedEventType | undefined;
    createdAt?: Date | undefined;
    conversationId: string;
};

declare function responseStartedEventFromJSON(jsonString: string): Result<ResponseStartedEvent, SDKValidationError>;

declare function responseStartedEventToJSON(responseStartedEvent: ResponseStartedEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ResponseStartedEventType$ {
    /** @deprecated use `ResponseStartedEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseStarted: "conversation.response.started";
    }>;
    /** @deprecated use `ResponseStartedEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseStarted: "conversation.response.started";
    }>;
}

/** @internal */
declare const ResponseStartedEventType$inboundSchema: z.ZodNativeEnum<typeof ResponseStartedEventType>;

/** @internal */
declare const ResponseStartedEventType$outboundSchema: z.ZodNativeEnum<typeof ResponseStartedEventType>;

declare const ResponseStartedEventType: {
    readonly ConversationResponseStarted: "conversation.response.started";
};

declare type ResponseStartedEventType = ClosedEnum<typeof ResponseStartedEventType>;

/**
 * A monad that captures the result of a function call or an error if it was not
 * successful. Railway programming, enabled by this type, can be a nicer
 * alternative to traditional exception throwing because it allows functions to
 * declare all _known_ errors with static types and then check for them
 * exhaustively in application code. Thrown exception have a type of `unknown`
 * and break out of regular control flow of programs making them harder to
 * inspect and more verbose work with due to try-catch blocks.
 */
declare type Result<T, E = unknown> = {
    ok: true;
    value: T;
    error?: never;
} | {
    ok: false;
    value?: never;
    error: E;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace RetrieveFileOut$ {
    /** @deprecated use `RetrieveFileOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<RetrieveFileOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `RetrieveFileOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<RetrieveFileOut$Outbound, z.ZodTypeDef, RetrieveFileOut>;
    /** @deprecated use `RetrieveFileOut$Outbound` instead. */
    type Outbound = RetrieveFileOut$Outbound;
}

/** @internal */
declare const RetrieveFileOut$inboundSchema: z.ZodType<RetrieveFileOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type RetrieveFileOut$Outbound = {
    id: string;
    object: string;
    bytes: number;
    created_at: number;
    filename: string;
    purpose: string;
    sample_type: string;
    num_lines?: number | null | undefined;
    mimetype?: string | null | undefined;
    source: string;
    signature?: string | null | undefined;
    deleted: boolean;
};

/** @internal */
declare const RetrieveFileOut$outboundSchema: z.ZodType<RetrieveFileOut$Outbound, z.ZodTypeDef, RetrieveFileOut>;

declare type RetrieveFileOut = {
    /**
     * The unique identifier of the file.
     */
    id: string;
    /**
     * The object type, which is always "file".
     */
    object: string;
    /**
     * The size of the file, in bytes.
     */
    sizeBytes: number;
    /**
     * The UNIX timestamp (in seconds) of the event.
     */
    createdAt: number;
    /**
     * The name of the uploaded file.
     */
    filename: string;
    purpose: FilePurpose;
    sampleType: SampleType;
    numLines?: number | null | undefined;
    mimetype?: string | null | undefined;
    source: Source;
    signature?: string | null | undefined;
    deleted: boolean;
};

declare function retrieveFileOutFromJSON(jsonString: string): Result<RetrieveFileOut, SDKValidationError>;

declare function retrieveFileOutToJSON(retrieveFileOut: RetrieveFileOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace RetrieveModelV1ModelsModelIdGetRequest$ {
    /** @deprecated use `RetrieveModelV1ModelsModelIdGetRequest$inboundSchema` instead. */
    const inboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetRequest, z.ZodTypeDef, unknown>;
    /** @deprecated use `RetrieveModelV1ModelsModelIdGetRequest$outboundSchema` instead. */
    const outboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetRequest$Outbound, z.ZodTypeDef, RetrieveModelV1ModelsModelIdGetRequest>;
    /** @deprecated use `RetrieveModelV1ModelsModelIdGetRequest$Outbound` instead. */
    type Outbound = RetrieveModelV1ModelsModelIdGetRequest$Outbound;
}

/** @internal */
declare const RetrieveModelV1ModelsModelIdGetRequest$inboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetRequest, z.ZodTypeDef, unknown>;

/** @internal */
declare type RetrieveModelV1ModelsModelIdGetRequest$Outbound = {
    model_id: string;
};

/** @internal */
declare const RetrieveModelV1ModelsModelIdGetRequest$outboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetRequest$Outbound, z.ZodTypeDef, RetrieveModelV1ModelsModelIdGetRequest>;

declare type RetrieveModelV1ModelsModelIdGetRequest = {
    /**
     * The ID of the model to retrieve.
     */
    modelId: string;
};

declare function retrieveModelV1ModelsModelIdGetRequestFromJSON(jsonString: string): Result<RetrieveModelV1ModelsModelIdGetRequest, SDKValidationError>;

declare function retrieveModelV1ModelsModelIdGetRequestToJSON(retrieveModelV1ModelsModelIdGetRequest: RetrieveModelV1ModelsModelIdGetRequest): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$ {
    /** @deprecated use `RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$inboundSchema` instead. */
    const inboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet, z.ZodTypeDef, unknown>;
    /** @deprecated use `RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$outboundSchema` instead. */
    const outboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$Outbound, z.ZodTypeDef, RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet>;
    /** @deprecated use `RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$Outbound` instead. */
    type Outbound = RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$Outbound;
}

/** @internal */
declare const RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$inboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet, z.ZodTypeDef, unknown>;

/** @internal */
declare type RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$Outbound = (components.FTModelCard$Outbound & {
    type: "fine-tuned";
}) | (components.BaseModelCard$Outbound & {
    type: "base";
});

/** @internal */
declare const RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$outboundSchema: z.ZodType<RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet$Outbound, z.ZodTypeDef, RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet>;

/**
 * Successful Response
 */
declare type RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet = (components.FTModelCard & {
    type: "fine-tuned";
}) | (components.BaseModelCard & {
    type: "base";
});

declare function retrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGetFromJSON(jsonString: string): Result<RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet, SDKValidationError>;

declare function retrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGetToJSON(retrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet: RetrieveModelV1ModelsModelIdGetResponseRetrieveModelV1ModelsModelIdGet): string;

declare type RetryConfig = {
    strategy: "none";
} | {
    strategy: "backoff";
    backoff?: BackoffStrategy;
    retryConnectionErrors?: boolean;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Role$ {
    /** @deprecated use `Role$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly System: "system";
    }>;
    /** @deprecated use `Role$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly System: "system";
    }>;
}

/** @internal */
declare const Role$inboundSchema: z.ZodNativeEnum<typeof Role>;

/** @internal */
declare const Role$outboundSchema: z.ZodNativeEnum<typeof Role>;

declare const Role: {
    readonly System: "system";
};

declare type Role = ClosedEnum<typeof Role>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SampleType$ {
    /** @deprecated use `SampleType$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SampleType, z.ZodTypeDef, unknown>;
    /** @deprecated use `SampleType$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SampleType, z.ZodTypeDef, SampleType>;
}

/** @internal */
declare const SampleType$inboundSchema: z.ZodType<SampleType, z.ZodTypeDef, unknown>;

/** @internal */
declare const SampleType$outboundSchema: z.ZodType<SampleType, z.ZodTypeDef, SampleType>;

declare const SampleType: {
    readonly Pretrain: "pretrain";
    readonly Instruct: "instruct";
    readonly BatchRequest: "batch_request";
    readonly BatchResult: "batch_result";
    readonly BatchError: "batch_error";
};

declare type SampleType = OpenEnum<typeof SampleType>;

export declare const SDK_METADATA: {
    readonly language: "typescript";
    readonly openapiDocVersion: "1.0.0";
    readonly sdkVersion: "1.10.0";
    readonly genVersion: "2.687.13";
    readonly userAgent: "speakeasy-sdk/typescript 1.10.0 2.687.13 1.0.0 @mistralai/mistralai";
};

declare class SDKHooks implements Hooks {
    sdkInitHooks: SDKInitHook[];
    beforeCreateRequestHooks: BeforeCreateRequestHook[];
    beforeRequestHooks: BeforeRequestHook_2[];
    afterSuccessHooks: AfterSuccessHook[];
    afterErrorHooks: AfterErrorHook[];
    constructor();
    registerSDKInitHook(hook: SDKInitHook): void;
    registerBeforeCreateRequestHook(hook: BeforeCreateRequestHook): void;
    registerBeforeRequestHook(hook: BeforeRequestHook_2): void;
    registerAfterSuccessHook(hook: AfterSuccessHook): void;
    registerAfterErrorHook(hook: AfterErrorHook): void;
    sdkInit(opts: SDKInitOptions): SDKInitOptions;
    beforeCreateRequest(hookCtx: BeforeCreateRequestContext, input: RequestInput): RequestInput;
    beforeRequest(hookCtx: BeforeRequestContext, request: Request): Promise<Request>;
    afterSuccess(hookCtx: AfterSuccessContext, response: Response): Promise<Response>;
    afterError(hookCtx: AfterErrorContext, response: Response | null, error: unknown): Promise<{
        response: Response | null;
        error: unknown;
    }>;
}

/**
 * SDKInitHook is called when the SDK is initializing. The
 * hook can return a new baseURL and HTTP client to be used by the SDK.
 */
declare interface SDKInitHook {
    sdkInit: (opts: SDKInitOptions) => SDKInitOptions;
}

declare type SDKInitOptions = {
    baseURL: URL | null;
    client: HTTPClient;
};

export declare type SDKOptions = {
    apiKey?: string | (() => Promise<string>) | undefined;
    httpClient?: HTTPClient;
    /**
     * Allows overriding the default server used by the SDK
     */
    server?: keyof typeof ServerList | undefined;
    /**
     * Allows overriding the default server URL used by the SDK
     */
    serverURL?: string | undefined;
    /**
     * Allows overriding the default user agent used by the SDK
     */
    userAgent?: string | undefined;
    /**
     * Allows overriding the default retry config used by the SDK
     */
    retryConfig?: RetryConfig;
    timeoutMs?: number;
    debugLogger?: Logger;
};

declare class SDKValidationError extends Error {
    /**
     * The raw value that failed validation.
     */
    readonly rawValue: unknown;
    /**
     * The raw message that failed validation.
     */
    readonly rawMessage: unknown;
    static [Symbol.hasInstance](instance: unknown): instance is SDKValidationError;
    constructor(message: string, cause: unknown, rawValue: unknown);
    /**
     * Return a pretty-formatted error message if the underlying validation error
     * is a ZodError or some other recognized error type, otherwise return the
     * default error message.
     */
    pretty(): string;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Security$ {
    /** @deprecated use `Security$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Security, z.ZodTypeDef, unknown>;
    /** @deprecated use `Security$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Security$Outbound, z.ZodTypeDef, Security>;
    /** @deprecated use `Security$Outbound` instead. */
    type Outbound = Security$Outbound;
}

/** @internal */
declare const Security$inboundSchema: z.ZodType<Security, z.ZodTypeDef, unknown>;

/** @internal */
declare type Security$Outbound = {
    ApiKey?: string | undefined;
};

/** @internal */
declare const Security$outboundSchema: z.ZodType<Security$Outbound, z.ZodTypeDef, Security>;

declare type Security = {
    apiKey?: string | undefined;
};

declare function securityFromJSON(jsonString: string): Result<Security, SDKValidationError>;

declare type SecurityState = {
    basic: {
        username?: string | undefined;
        password?: string | undefined;
    };
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    cookies: Record<string, string>;
    oauth2: ({
        type: "password";
    } & OAuth2PasswordFlow) | {
        type: "none";
    };
};

declare function securityToJSON(security: Security): string;

/**
 * EU Production server
 */
export declare const ServerEu = "eu";

declare type ServerEvent<T> = {
    data?: T | undefined;
    event?: string | undefined;
    id?: string | undefined;
    retry?: number | undefined;
};

/**
 * Contains the list of servers available to the SDK
 */
export declare const ServerList: {
    readonly eu: "https://api.mistral.ai";
};

export declare function serverURLFromOptions(options: SDKOptions): URL | null;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ShareEnum$ {
    /** @deprecated use `ShareEnum$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ShareEnum, z.ZodTypeDef, unknown>;
    /** @deprecated use `ShareEnum$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ShareEnum, z.ZodTypeDef, ShareEnum>;
}

/** @internal */
declare const ShareEnum$inboundSchema: z.ZodType<ShareEnum, z.ZodTypeDef, unknown>;

/** @internal */
declare const ShareEnum$outboundSchema: z.ZodType<ShareEnum, z.ZodTypeDef, ShareEnum>;

declare const ShareEnum: {
    readonly Viewer: "Viewer";
    readonly Editor: "Editor";
};

declare type ShareEnum = OpenEnum<typeof ShareEnum>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SharingDelete$ {
    /** @deprecated use `SharingDelete$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SharingDelete, z.ZodTypeDef, unknown>;
    /** @deprecated use `SharingDelete$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SharingDelete$Outbound, z.ZodTypeDef, SharingDelete>;
    /** @deprecated use `SharingDelete$Outbound` instead. */
    type Outbound = SharingDelete$Outbound;
}

/** @internal */
declare const SharingDelete$inboundSchema: z.ZodType<SharingDelete, z.ZodTypeDef, unknown>;

/** @internal */
declare type SharingDelete$Outbound = {
    org_id: string;
    share_with_uuid: string;
    share_with_type: string;
};

/** @internal */
declare const SharingDelete$outboundSchema: z.ZodType<SharingDelete$Outbound, z.ZodTypeDef, SharingDelete>;

declare type SharingDelete = {
    orgId: string;
    /**
     * The id of the entity (user, workspace or organization) to share with
     */
    shareWithUuid: string;
    /**
     * The type of entity, used to share a library.
     */
    shareWithType: EntityType;
};

declare function sharingDeleteFromJSON(jsonString: string): Result<SharingDelete, SDKValidationError>;

declare function sharingDeleteToJSON(sharingDelete: SharingDelete): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SharingIn$ {
    /** @deprecated use `SharingIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SharingIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `SharingIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SharingIn$Outbound, z.ZodTypeDef, SharingIn>;
    /** @deprecated use `SharingIn$Outbound` instead. */
    type Outbound = SharingIn$Outbound;
}

/** @internal */
declare const SharingIn$inboundSchema: z.ZodType<SharingIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type SharingIn$Outbound = {
    org_id: string;
    level: string;
    share_with_uuid: string;
    share_with_type: string;
};

/** @internal */
declare const SharingIn$outboundSchema: z.ZodType<SharingIn$Outbound, z.ZodTypeDef, SharingIn>;

declare type SharingIn = {
    orgId: string;
    level: ShareEnum;
    /**
     * The id of the entity (user, workspace or organization) to share with
     */
    shareWithUuid: string;
    /**
     * The type of entity, used to share a library.
     */
    shareWithType: EntityType;
};

declare function sharingInFromJSON(jsonString: string): Result<SharingIn, SDKValidationError>;

declare function sharingInToJSON(sharingIn: SharingIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SharingOut$ {
    /** @deprecated use `SharingOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SharingOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `SharingOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SharingOut$Outbound, z.ZodTypeDef, SharingOut>;
    /** @deprecated use `SharingOut$Outbound` instead. */
    type Outbound = SharingOut$Outbound;
}

/** @internal */
declare const SharingOut$inboundSchema: z.ZodType<SharingOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type SharingOut$Outbound = {
    library_id: string;
    user_id?: string | null | undefined;
    org_id: string;
    role: string;
    share_with_type: string;
    share_with_uuid: string;
};

/** @internal */
declare const SharingOut$outboundSchema: z.ZodType<SharingOut$Outbound, z.ZodTypeDef, SharingOut>;

declare type SharingOut = {
    libraryId: string;
    userId?: string | null | undefined;
    orgId: string;
    role: string;
    shareWithType: string;
    shareWithUuid: string;
};

declare function sharingOutFromJSON(jsonString: string): Result<SharingOut, SDKValidationError>;

declare function sharingOutToJSON(sharingOut: SharingOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Source$ {
    /** @deprecated use `Source$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Source, z.ZodTypeDef, unknown>;
    /** @deprecated use `Source$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Source, z.ZodTypeDef, Source>;
}

/** @internal */
declare const Source$inboundSchema: z.ZodType<Source, z.ZodTypeDef, unknown>;

/** @internal */
declare const Source$outboundSchema: z.ZodType<Source, z.ZodTypeDef, Source>;

declare const Source: {
    readonly Upload: "upload";
    readonly Repository: "repository";
    readonly Mistral: "mistral";
};

declare type Source = OpenEnum<typeof Source>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SSETypes$ {
    /** @deprecated use `SSETypes$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseStarted: "conversation.response.started";
        readonly ConversationResponseDone: "conversation.response.done";
        readonly ConversationResponseError: "conversation.response.error";
        readonly MessageOutputDelta: "message.output.delta";
        readonly ToolExecutionStarted: "tool.execution.started";
        readonly ToolExecutionDelta: "tool.execution.delta";
        readonly ToolExecutionDone: "tool.execution.done";
        readonly AgentHandoffStarted: "agent.handoff.started";
        readonly AgentHandoffDone: "agent.handoff.done";
        readonly FunctionCallDelta: "function.call.delta";
    }>;
    /** @deprecated use `SSETypes$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ConversationResponseStarted: "conversation.response.started";
        readonly ConversationResponseDone: "conversation.response.done";
        readonly ConversationResponseError: "conversation.response.error";
        readonly MessageOutputDelta: "message.output.delta";
        readonly ToolExecutionStarted: "tool.execution.started";
        readonly ToolExecutionDelta: "tool.execution.delta";
        readonly ToolExecutionDone: "tool.execution.done";
        readonly AgentHandoffStarted: "agent.handoff.started";
        readonly AgentHandoffDone: "agent.handoff.done";
        readonly FunctionCallDelta: "function.call.delta";
    }>;
}

/** @internal */
declare const SSETypes$inboundSchema: z.ZodNativeEnum<typeof SSETypes>;

/** @internal */
declare const SSETypes$outboundSchema: z.ZodNativeEnum<typeof SSETypes>;

/**
 * Server side events sent when streaming a conversation response.
 */
declare const SSETypes: {
    readonly ConversationResponseStarted: "conversation.response.started";
    readonly ConversationResponseDone: "conversation.response.done";
    readonly ConversationResponseError: "conversation.response.error";
    readonly MessageOutputDelta: "message.output.delta";
    readonly ToolExecutionStarted: "tool.execution.started";
    readonly ToolExecutionDelta: "tool.execution.delta";
    readonly ToolExecutionDone: "tool.execution.done";
    readonly AgentHandoffStarted: "agent.handoff.started";
    readonly AgentHandoffDone: "agent.handoff.done";
    readonly FunctionCallDelta: "function.call.delta";
};

/**
 * Server side events sent when streaming a conversation response.
 */
declare type SSETypes = ClosedEnum<typeof SSETypes>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Status$ {
    /** @deprecated use `Status$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
    /** @deprecated use `Status$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Status$_2 {
    /** @deprecated use `Status$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
    /** @deprecated use `Status$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Queued: "QUEUED";
        readonly Started: "STARTED";
        readonly Validating: "VALIDATING";
        readonly Validated: "VALIDATED";
        readonly Running: "RUNNING";
        readonly FailedValidation: "FAILED_VALIDATION";
        readonly Failed: "FAILED";
        readonly Success: "SUCCESS";
        readonly Cancelled: "CANCELLED";
        readonly CancellationRequested: "CANCELLATION_REQUESTED";
    }>;
}

/** @internal */
declare const Status$inboundSchema: z.ZodNativeEnum<typeof Status>;

/** @internal */
declare const Status$inboundSchema_2: z.ZodNativeEnum<typeof Status_2>;

/** @internal */
declare const Status$outboundSchema: z.ZodNativeEnum<typeof Status>;

/** @internal */
declare const Status$outboundSchema_2: z.ZodNativeEnum<typeof Status_2>;

/**
 * The current status of the fine-tuning job.
 */
declare const Status: {
    readonly Queued: "QUEUED";
    readonly Started: "STARTED";
    readonly Validating: "VALIDATING";
    readonly Validated: "VALIDATED";
    readonly Running: "RUNNING";
    readonly FailedValidation: "FAILED_VALIDATION";
    readonly Failed: "FAILED";
    readonly Success: "SUCCESS";
    readonly Cancelled: "CANCELLED";
    readonly CancellationRequested: "CANCELLATION_REQUESTED";
};

/**
 * The current status of the fine-tuning job.
 */
declare type Status = ClosedEnum<typeof Status>;

/**
 * The current job state to filter on. When set, the other results are not displayed.
 */
declare const Status_2: {
    readonly Queued: "QUEUED";
    readonly Started: "STARTED";
    readonly Validating: "VALIDATING";
    readonly Validated: "VALIDATED";
    readonly Running: "RUNNING";
    readonly FailedValidation: "FAILED_VALIDATION";
    readonly Failed: "FAILED";
    readonly Success: "SUCCESS";
    readonly Cancelled: "CANCELLED";
    readonly CancellationRequested: "CANCELLATION_REQUESTED";
};

/**
 * The current job state to filter on. When set, the other results are not displayed.
 */
declare type Status_2 = ClosedEnum<typeof Status_2>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Stop$ {
    /** @deprecated use `Stop$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Stop, z.ZodTypeDef, unknown>;
    /** @deprecated use `Stop$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Stop$Outbound, z.ZodTypeDef, Stop>;
    /** @deprecated use `Stop$Outbound` instead. */
    type Outbound = Stop$Outbound;
}

/** @internal */
declare const Stop$inboundSchema: z.ZodType<Stop, z.ZodTypeDef, unknown>;

/** @internal */
declare type Stop$Outbound = string | Array<string>;

/** @internal */
declare const Stop$outboundSchema: z.ZodType<Stop$Outbound, z.ZodTypeDef, Stop>;

/**
 * Stop generation if this token is detected. Or if one of these tokens is detected when providing an array
 */
declare type Stop = string | Array<string>;

declare function stopFromJSON(jsonString: string): Result<Stop, SDKValidationError>;

declare function stopToJSON(stop: Stop): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SystemMessage$ {
    /** @deprecated use `SystemMessage$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SystemMessage, z.ZodTypeDef, unknown>;
    /** @deprecated use `SystemMessage$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SystemMessage$Outbound, z.ZodTypeDef, SystemMessage>;
    /** @deprecated use `SystemMessage$Outbound` instead. */
    type Outbound = SystemMessage$Outbound;
}

/** @internal */
declare const SystemMessage$inboundSchema: z.ZodType<SystemMessage, z.ZodTypeDef, unknown>;

/** @internal */
declare type SystemMessage$Outbound = {
    content: string | Array<SystemMessageContentChunks$Outbound>;
    role: string;
};

/** @internal */
declare const SystemMessage$outboundSchema: z.ZodType<SystemMessage$Outbound, z.ZodTypeDef, SystemMessage>;

declare type SystemMessage = {
    content: string | Array<SystemMessageContentChunks>;
    role?: Role | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SystemMessageContent$ {
    /** @deprecated use `SystemMessageContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SystemMessageContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `SystemMessageContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SystemMessageContent$Outbound, z.ZodTypeDef, SystemMessageContent>;
    /** @deprecated use `SystemMessageContent$Outbound` instead. */
    type Outbound = SystemMessageContent$Outbound;
}

/** @internal */
declare const SystemMessageContent$inboundSchema: z.ZodType<SystemMessageContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type SystemMessageContent$Outbound = string | Array<SystemMessageContentChunks$Outbound>;

/** @internal */
declare const SystemMessageContent$outboundSchema: z.ZodType<SystemMessageContent$Outbound, z.ZodTypeDef, SystemMessageContent>;

declare type SystemMessageContent = string | Array<SystemMessageContentChunks>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace SystemMessageContentChunks$ {
    /** @deprecated use `SystemMessageContentChunks$inboundSchema` instead. */
    const inboundSchema: z.ZodType<SystemMessageContentChunks, z.ZodTypeDef, unknown>;
    /** @deprecated use `SystemMessageContentChunks$outboundSchema` instead. */
    const outboundSchema: z.ZodType<SystemMessageContentChunks$Outbound, z.ZodTypeDef, SystemMessageContentChunks>;
    /** @deprecated use `SystemMessageContentChunks$Outbound` instead. */
    type Outbound = SystemMessageContentChunks$Outbound;
}

/** @internal */
declare const SystemMessageContentChunks$inboundSchema: z.ZodType<SystemMessageContentChunks, z.ZodTypeDef, unknown>;

/** @internal */
declare type SystemMessageContentChunks$Outbound = (TextChunk$Outbound & {
    type: "text";
}) | (ThinkChunk$Outbound & {
    type: "thinking";
});

/** @internal */
declare const SystemMessageContentChunks$outboundSchema: z.ZodType<SystemMessageContentChunks$Outbound, z.ZodTypeDef, SystemMessageContentChunks>;

declare type SystemMessageContentChunks = (TextChunk & {
    type: "text";
}) | (ThinkChunk & {
    type: "thinking";
});

declare function systemMessageContentChunksFromJSON(jsonString: string): Result<SystemMessageContentChunks, SDKValidationError>;

declare function systemMessageContentChunksToJSON(systemMessageContentChunks: SystemMessageContentChunks): string;

declare function systemMessageContentFromJSON(jsonString: string): Result<SystemMessageContent, SDKValidationError>;

declare function systemMessageContentToJSON(systemMessageContent: SystemMessageContent): string;

declare function systemMessageFromJSON(jsonString: string): Result<SystemMessage, SDKValidationError>;

declare function systemMessageToJSON(systemMessage: SystemMessage): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TextChunk$ {
    /** @deprecated use `TextChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TextChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `TextChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TextChunk$Outbound, z.ZodTypeDef, TextChunk>;
    /** @deprecated use `TextChunk$Outbound` instead. */
    type Outbound = TextChunk$Outbound;
}

/** @internal */
declare const TextChunk$inboundSchema: z.ZodType<TextChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type TextChunk$Outbound = {
    text: string;
    type: string;
};

/** @internal */
declare const TextChunk$outboundSchema: z.ZodType<TextChunk$Outbound, z.ZodTypeDef, TextChunk>;

declare type TextChunk = {
    text: string;
    type?: TextChunkType | undefined;
};

declare function textChunkFromJSON(jsonString: string): Result<TextChunk, SDKValidationError>;

declare function textChunkToJSON(textChunk: TextChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TextChunkType$ {
    /** @deprecated use `TextChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Text: "text";
    }>;
    /** @deprecated use `TextChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Text: "text";
    }>;
}

/** @internal */
declare const TextChunkType$inboundSchema: z.ZodNativeEnum<typeof TextChunkType>;

/** @internal */
declare const TextChunkType$outboundSchema: z.ZodNativeEnum<typeof TextChunkType>;

declare const TextChunkType: {
    readonly Text: "text";
};

declare type TextChunkType = ClosedEnum<typeof TextChunkType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ThinkChunk$ {
    /** @deprecated use `ThinkChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ThinkChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `ThinkChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ThinkChunk$Outbound, z.ZodTypeDef, ThinkChunk>;
    /** @deprecated use `ThinkChunk$Outbound` instead. */
    type Outbound = ThinkChunk$Outbound;
}

/** @internal */
declare const ThinkChunk$inboundSchema: z.ZodType<ThinkChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type ThinkChunk$Outbound = {
    thinking: Array<ReferenceChunk$Outbound | TextChunk$Outbound>;
    closed?: boolean | undefined;
    type: string;
};

/** @internal */
declare const ThinkChunk$outboundSchema: z.ZodType<ThinkChunk$Outbound, z.ZodTypeDef, ThinkChunk>;

declare type ThinkChunk = {
    thinking: Array<ReferenceChunk | TextChunk>;
    /**
     * Whether the thinking chunk is closed or not. Currently only used for prefixing.
     */
    closed?: boolean | undefined;
    type?: ThinkChunkType | undefined;
};

declare function thinkChunkFromJSON(jsonString: string): Result<ThinkChunk, SDKValidationError>;

declare function thinkChunkToJSON(thinkChunk: ThinkChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ThinkChunkType$ {
    /** @deprecated use `ThinkChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Thinking: "thinking";
    }>;
    /** @deprecated use `ThinkChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Thinking: "thinking";
    }>;
}

/** @internal */
declare const ThinkChunkType$inboundSchema: z.ZodNativeEnum<typeof ThinkChunkType>;

/** @internal */
declare const ThinkChunkType$outboundSchema: z.ZodNativeEnum<typeof ThinkChunkType>;

declare const ThinkChunkType: {
    readonly Thinking: "thinking";
};

declare type ThinkChunkType = ClosedEnum<typeof ThinkChunkType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Thinking$ {
    /** @deprecated use `Thinking$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Thinking, z.ZodTypeDef, unknown>;
    /** @deprecated use `Thinking$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Thinking$Outbound, z.ZodTypeDef, Thinking>;
    /** @deprecated use `Thinking$Outbound` instead. */
    type Outbound = Thinking$Outbound;
}

/** @internal */
declare const Thinking$inboundSchema: z.ZodType<Thinking, z.ZodTypeDef, unknown>;

/** @internal */
declare type Thinking$Outbound = ReferenceChunk$Outbound | TextChunk$Outbound;

/** @internal */
declare const Thinking$outboundSchema: z.ZodType<Thinking$Outbound, z.ZodTypeDef, Thinking>;

declare type Thinking = ReferenceChunk | TextChunk;

declare function thinkingFromJSON(jsonString: string): Result<Thinking, SDKValidationError>;

declare function thinkingToJSON(thinking: Thinking): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TimestampGranularity$ {
    /** @deprecated use `TimestampGranularity$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Segment: "segment";
    }>;
    /** @deprecated use `TimestampGranularity$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Segment: "segment";
    }>;
}

/** @internal */
declare const TimestampGranularity$inboundSchema: z.ZodNativeEnum<typeof TimestampGranularity>;

/** @internal */
declare const TimestampGranularity$outboundSchema: z.ZodNativeEnum<typeof TimestampGranularity>;

declare const TimestampGranularity: {
    readonly Segment: "segment";
};

declare type TimestampGranularity = ClosedEnum<typeof TimestampGranularity>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Tool$ {
    /** @deprecated use `Tool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Tool, z.ZodTypeDef, unknown>;
    /** @deprecated use `Tool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Tool$Outbound, z.ZodTypeDef, Tool>;
    /** @deprecated use `Tool$Outbound` instead. */
    type Outbound = Tool$Outbound;
}

/** @internal */
declare const Tool$inboundSchema: z.ZodType<Tool, z.ZodTypeDef, unknown>;

/** @internal */
declare type Tool$Outbound = {
    type?: string | undefined;
    function: FunctionT$Outbound;
};

/** @internal */
declare const Tool$outboundSchema: z.ZodType<Tool$Outbound, z.ZodTypeDef, Tool>;

declare type Tool = {
    type?: ToolTypes | undefined;
    function: FunctionT;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolCall$ {
    /** @deprecated use `ToolCall$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolCall, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolCall$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolCall$Outbound, z.ZodTypeDef, ToolCall>;
    /** @deprecated use `ToolCall$Outbound` instead. */
    type Outbound = ToolCall$Outbound;
}

/** @internal */
declare const ToolCall$inboundSchema: z.ZodType<ToolCall, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolCall$Outbound = {
    id: string;
    type?: string | undefined;
    function: FunctionCall$Outbound;
    index: number;
};

/** @internal */
declare const ToolCall$outboundSchema: z.ZodType<ToolCall$Outbound, z.ZodTypeDef, ToolCall>;

declare type ToolCall = {
    id?: string | undefined;
    type?: ToolTypes | undefined;
    function: FunctionCall;
    index?: number | undefined;
};

declare function toolCallFromJSON(jsonString: string): Result<ToolCall, SDKValidationError>;

declare function toolCallToJSON(toolCall: ToolCall): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolChoice$ {
    /** @deprecated use `ToolChoice$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolChoice, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolChoice$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolChoice$Outbound, z.ZodTypeDef, ToolChoice>;
    /** @deprecated use `ToolChoice$Outbound` instead. */
    type Outbound = ToolChoice$Outbound;
}

/** @internal */
declare const ToolChoice$inboundSchema: z.ZodType<ToolChoice, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolChoice$Outbound = {
    type?: string | undefined;
    function: FunctionName$Outbound;
};

/** @internal */
declare const ToolChoice$outboundSchema: z.ZodType<ToolChoice$Outbound, z.ZodTypeDef, ToolChoice>;

/**
 * ToolChoice is either a ToolChoiceEnum or a ToolChoice
 */
declare type ToolChoice = {
    type?: ToolTypes | undefined;
    /**
     * this restriction of `Function` is used to select a specific function to call
     */
    function: FunctionName;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolChoiceEnum$ {
    /** @deprecated use `ToolChoiceEnum$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Auto: "auto";
        readonly None: "none";
        readonly Any: "any";
        readonly Required: "required";
    }>;
    /** @deprecated use `ToolChoiceEnum$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Auto: "auto";
        readonly None: "none";
        readonly Any: "any";
        readonly Required: "required";
    }>;
}

/** @internal */
declare const ToolChoiceEnum$inboundSchema: z.ZodNativeEnum<typeof ToolChoiceEnum>;

/** @internal */
declare const ToolChoiceEnum$outboundSchema: z.ZodNativeEnum<typeof ToolChoiceEnum>;

declare const ToolChoiceEnum: {
    readonly Auto: "auto";
    readonly None: "none";
    readonly Any: "any";
    readonly Required: "required";
};

declare type ToolChoiceEnum = ClosedEnum<typeof ToolChoiceEnum>;

declare function toolChoiceFromJSON(jsonString: string): Result<ToolChoice, SDKValidationError>;

declare function toolChoiceToJSON(toolChoice: ToolChoice): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionDeltaEvent$ {
    /** @deprecated use `ToolExecutionDeltaEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolExecutionDeltaEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolExecutionDeltaEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolExecutionDeltaEvent$Outbound, z.ZodTypeDef, ToolExecutionDeltaEvent>;
    /** @deprecated use `ToolExecutionDeltaEvent$Outbound` instead. */
    type Outbound = ToolExecutionDeltaEvent$Outbound;
}

/** @internal */
declare const ToolExecutionDeltaEvent$inboundSchema: z.ZodType<ToolExecutionDeltaEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolExecutionDeltaEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    name: string;
    arguments: string;
};

/** @internal */
declare const ToolExecutionDeltaEvent$outboundSchema: z.ZodType<ToolExecutionDeltaEvent$Outbound, z.ZodTypeDef, ToolExecutionDeltaEvent>;

declare type ToolExecutionDeltaEvent = {
    type?: ToolExecutionDeltaEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    name: BuiltInConnectors;
    arguments: string;
};

declare function toolExecutionDeltaEventFromJSON(jsonString: string): Result<ToolExecutionDeltaEvent, SDKValidationError>;

declare function toolExecutionDeltaEventToJSON(toolExecutionDeltaEvent: ToolExecutionDeltaEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionDeltaEventType$ {
    /** @deprecated use `ToolExecutionDeltaEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ToolExecutionDelta: "tool.execution.delta";
    }>;
    /** @deprecated use `ToolExecutionDeltaEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ToolExecutionDelta: "tool.execution.delta";
    }>;
}

/** @internal */
declare const ToolExecutionDeltaEventType$inboundSchema: z.ZodNativeEnum<typeof ToolExecutionDeltaEventType>;

/** @internal */
declare const ToolExecutionDeltaEventType$outboundSchema: z.ZodNativeEnum<typeof ToolExecutionDeltaEventType>;

declare const ToolExecutionDeltaEventType: {
    readonly ToolExecutionDelta: "tool.execution.delta";
};

declare type ToolExecutionDeltaEventType = ClosedEnum<typeof ToolExecutionDeltaEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionDoneEvent$ {
    /** @deprecated use `ToolExecutionDoneEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolExecutionDoneEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolExecutionDoneEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolExecutionDoneEvent$Outbound, z.ZodTypeDef, ToolExecutionDoneEvent>;
    /** @deprecated use `ToolExecutionDoneEvent$Outbound` instead. */
    type Outbound = ToolExecutionDoneEvent$Outbound;
}

/** @internal */
declare const ToolExecutionDoneEvent$inboundSchema: z.ZodType<ToolExecutionDoneEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolExecutionDoneEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    name: string;
    info?: {
        [k: string]: any;
    } | undefined;
};

/** @internal */
declare const ToolExecutionDoneEvent$outboundSchema: z.ZodType<ToolExecutionDoneEvent$Outbound, z.ZodTypeDef, ToolExecutionDoneEvent>;

declare type ToolExecutionDoneEvent = {
    type?: ToolExecutionDoneEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    name: BuiltInConnectors;
    info?: {
        [k: string]: any;
    } | undefined;
};

declare function toolExecutionDoneEventFromJSON(jsonString: string): Result<ToolExecutionDoneEvent, SDKValidationError>;

declare function toolExecutionDoneEventToJSON(toolExecutionDoneEvent: ToolExecutionDoneEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionDoneEventType$ {
    /** @deprecated use `ToolExecutionDoneEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ToolExecutionDone: "tool.execution.done";
    }>;
    /** @deprecated use `ToolExecutionDoneEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ToolExecutionDone: "tool.execution.done";
    }>;
}

/** @internal */
declare const ToolExecutionDoneEventType$inboundSchema: z.ZodNativeEnum<typeof ToolExecutionDoneEventType>;

/** @internal */
declare const ToolExecutionDoneEventType$outboundSchema: z.ZodNativeEnum<typeof ToolExecutionDoneEventType>;

declare const ToolExecutionDoneEventType: {
    readonly ToolExecutionDone: "tool.execution.done";
};

declare type ToolExecutionDoneEventType = ClosedEnum<typeof ToolExecutionDoneEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionEntry$ {
    /** @deprecated use `ToolExecutionEntry$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolExecutionEntry, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolExecutionEntry$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolExecutionEntry$Outbound, z.ZodTypeDef, ToolExecutionEntry>;
    /** @deprecated use `ToolExecutionEntry$Outbound` instead. */
    type Outbound = ToolExecutionEntry$Outbound;
}

/** @internal */
declare const ToolExecutionEntry$inboundSchema: z.ZodType<ToolExecutionEntry, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolExecutionEntry$Outbound = {
    object: string;
    type: string;
    created_at?: string | undefined;
    completed_at?: string | null | undefined;
    id?: string | undefined;
    name: string;
    arguments: string;
    info?: {
        [k: string]: any;
    } | undefined;
};

/** @internal */
declare const ToolExecutionEntry$outboundSchema: z.ZodType<ToolExecutionEntry$Outbound, z.ZodTypeDef, ToolExecutionEntry>;

declare type ToolExecutionEntry = {
    object?: ToolExecutionEntryObject | undefined;
    type?: ToolExecutionEntryType | undefined;
    createdAt?: Date | undefined;
    completedAt?: Date | null | undefined;
    id?: string | undefined;
    name: BuiltInConnectors;
    arguments: string;
    info?: {
        [k: string]: any;
    } | undefined;
};

declare function toolExecutionEntryFromJSON(jsonString: string): Result<ToolExecutionEntry, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionEntryObject$ {
    /** @deprecated use `ToolExecutionEntryObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
    /** @deprecated use `ToolExecutionEntryObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Entry: "entry";
    }>;
}

/** @internal */
declare const ToolExecutionEntryObject$inboundSchema: z.ZodNativeEnum<typeof ToolExecutionEntryObject>;

/** @internal */
declare const ToolExecutionEntryObject$outboundSchema: z.ZodNativeEnum<typeof ToolExecutionEntryObject>;

declare const ToolExecutionEntryObject: {
    readonly Entry: "entry";
};

declare type ToolExecutionEntryObject = ClosedEnum<typeof ToolExecutionEntryObject>;

declare function toolExecutionEntryToJSON(toolExecutionEntry: ToolExecutionEntry): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionEntryType$ {
    /** @deprecated use `ToolExecutionEntryType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ToolExecution: "tool.execution";
    }>;
    /** @deprecated use `ToolExecutionEntryType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ToolExecution: "tool.execution";
    }>;
}

/** @internal */
declare const ToolExecutionEntryType$inboundSchema: z.ZodNativeEnum<typeof ToolExecutionEntryType>;

/** @internal */
declare const ToolExecutionEntryType$outboundSchema: z.ZodNativeEnum<typeof ToolExecutionEntryType>;

declare const ToolExecutionEntryType: {
    readonly ToolExecution: "tool.execution";
};

declare type ToolExecutionEntryType = ClosedEnum<typeof ToolExecutionEntryType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionStartedEvent$ {
    /** @deprecated use `ToolExecutionStartedEvent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolExecutionStartedEvent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolExecutionStartedEvent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolExecutionStartedEvent$Outbound, z.ZodTypeDef, ToolExecutionStartedEvent>;
    /** @deprecated use `ToolExecutionStartedEvent$Outbound` instead. */
    type Outbound = ToolExecutionStartedEvent$Outbound;
}

/** @internal */
declare const ToolExecutionStartedEvent$inboundSchema: z.ZodType<ToolExecutionStartedEvent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolExecutionStartedEvent$Outbound = {
    type: string;
    created_at?: string | undefined;
    output_index: number;
    id: string;
    name: string;
    arguments: string;
};

/** @internal */
declare const ToolExecutionStartedEvent$outboundSchema: z.ZodType<ToolExecutionStartedEvent$Outbound, z.ZodTypeDef, ToolExecutionStartedEvent>;

declare type ToolExecutionStartedEvent = {
    type?: ToolExecutionStartedEventType | undefined;
    createdAt?: Date | undefined;
    outputIndex?: number | undefined;
    id: string;
    name: BuiltInConnectors;
    arguments: string;
};

declare function toolExecutionStartedEventFromJSON(jsonString: string): Result<ToolExecutionStartedEvent, SDKValidationError>;

declare function toolExecutionStartedEventToJSON(toolExecutionStartedEvent: ToolExecutionStartedEvent): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolExecutionStartedEventType$ {
    /** @deprecated use `ToolExecutionStartedEventType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ToolExecutionStarted: "tool.execution.started";
    }>;
    /** @deprecated use `ToolExecutionStartedEventType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ToolExecutionStarted: "tool.execution.started";
    }>;
}

/** @internal */
declare const ToolExecutionStartedEventType$inboundSchema: z.ZodNativeEnum<typeof ToolExecutionStartedEventType>;

/** @internal */
declare const ToolExecutionStartedEventType$outboundSchema: z.ZodNativeEnum<typeof ToolExecutionStartedEventType>;

declare const ToolExecutionStartedEventType: {
    readonly ToolExecutionStarted: "tool.execution.started";
};

declare type ToolExecutionStartedEventType = ClosedEnum<typeof ToolExecutionStartedEventType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolFileChunk$ {
    /** @deprecated use `ToolFileChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolFileChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolFileChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolFileChunk$Outbound, z.ZodTypeDef, ToolFileChunk>;
    /** @deprecated use `ToolFileChunk$Outbound` instead. */
    type Outbound = ToolFileChunk$Outbound;
}

/** @internal */
declare const ToolFileChunk$inboundSchema: z.ZodType<ToolFileChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolFileChunk$Outbound = {
    type: string;
    tool: string;
    file_id: string;
    file_name?: string | null | undefined;
    file_type?: string | null | undefined;
};

/** @internal */
declare const ToolFileChunk$outboundSchema: z.ZodType<ToolFileChunk$Outbound, z.ZodTypeDef, ToolFileChunk>;

declare type ToolFileChunk = {
    type?: ToolFileChunkType | undefined;
    tool: BuiltInConnectors;
    fileId: string;
    fileName?: string | null | undefined;
    fileType?: string | null | undefined;
};

declare function toolFileChunkFromJSON(jsonString: string): Result<ToolFileChunk, SDKValidationError>;

declare function toolFileChunkToJSON(toolFileChunk: ToolFileChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolFileChunkType$ {
    /** @deprecated use `ToolFileChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ToolFile: "tool_file";
    }>;
    /** @deprecated use `ToolFileChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ToolFile: "tool_file";
    }>;
}

/** @internal */
declare const ToolFileChunkType$inboundSchema: z.ZodNativeEnum<typeof ToolFileChunkType>;

/** @internal */
declare const ToolFileChunkType$outboundSchema: z.ZodNativeEnum<typeof ToolFileChunkType>;

declare const ToolFileChunkType: {
    readonly ToolFile: "tool_file";
};

declare type ToolFileChunkType = ClosedEnum<typeof ToolFileChunkType>;

declare function toolFromJSON(jsonString: string): Result<Tool, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolMessage$ {
    /** @deprecated use `ToolMessage$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolMessage, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolMessage$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolMessage$Outbound, z.ZodTypeDef, ToolMessage>;
    /** @deprecated use `ToolMessage$Outbound` instead. */
    type Outbound = ToolMessage$Outbound;
}

/** @internal */
declare const ToolMessage$inboundSchema: z.ZodType<ToolMessage, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolMessage$Outbound = {
    content: string | Array<ContentChunk$Outbound> | null;
    tool_call_id?: string | null | undefined;
    name?: string | null | undefined;
    role: string;
};

/** @internal */
declare const ToolMessage$outboundSchema: z.ZodType<ToolMessage$Outbound, z.ZodTypeDef, ToolMessage>;

declare type ToolMessage = {
    content: string | Array<ContentChunk> | null;
    toolCallId?: string | null | undefined;
    name?: string | null | undefined;
    role?: ToolMessageRole | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolMessageContent$ {
    /** @deprecated use `ToolMessageContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolMessageContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolMessageContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolMessageContent$Outbound, z.ZodTypeDef, ToolMessageContent>;
    /** @deprecated use `ToolMessageContent$Outbound` instead. */
    type Outbound = ToolMessageContent$Outbound;
}

/** @internal */
declare const ToolMessageContent$inboundSchema: z.ZodType<ToolMessageContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolMessageContent$Outbound = string | Array<ContentChunk$Outbound>;

/** @internal */
declare const ToolMessageContent$outboundSchema: z.ZodType<ToolMessageContent$Outbound, z.ZodTypeDef, ToolMessageContent>;

declare type ToolMessageContent = string | Array<ContentChunk>;

declare function toolMessageContentFromJSON(jsonString: string): Result<ToolMessageContent, SDKValidationError>;

declare function toolMessageContentToJSON(toolMessageContent: ToolMessageContent): string;

declare function toolMessageFromJSON(jsonString: string): Result<ToolMessage, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolMessageRole$ {
    /** @deprecated use `ToolMessageRole$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Tool: "tool";
    }>;
    /** @deprecated use `ToolMessageRole$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Tool: "tool";
    }>;
}

/** @internal */
declare const ToolMessageRole$inboundSchema: z.ZodNativeEnum<typeof ToolMessageRole>;

/** @internal */
declare const ToolMessageRole$outboundSchema: z.ZodNativeEnum<typeof ToolMessageRole>;

declare const ToolMessageRole: {
    readonly Tool: "tool";
};

declare type ToolMessageRole = ClosedEnum<typeof ToolMessageRole>;

declare function toolMessageToJSON(toolMessage: ToolMessage): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolReferenceChunk$ {
    /** @deprecated use `ToolReferenceChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolReferenceChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolReferenceChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolReferenceChunk$Outbound, z.ZodTypeDef, ToolReferenceChunk>;
    /** @deprecated use `ToolReferenceChunk$Outbound` instead. */
    type Outbound = ToolReferenceChunk$Outbound;
}

/** @internal */
declare const ToolReferenceChunk$inboundSchema: z.ZodType<ToolReferenceChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type ToolReferenceChunk$Outbound = {
    type: string;
    tool: string;
    title: string;
    url?: string | null | undefined;
    favicon?: string | null | undefined;
    description?: string | null | undefined;
};

/** @internal */
declare const ToolReferenceChunk$outboundSchema: z.ZodType<ToolReferenceChunk$Outbound, z.ZodTypeDef, ToolReferenceChunk>;

declare type ToolReferenceChunk = {
    type?: ToolReferenceChunkType | undefined;
    tool: BuiltInConnectors;
    title: string;
    url?: string | null | undefined;
    favicon?: string | null | undefined;
    description?: string | null | undefined;
};

declare function toolReferenceChunkFromJSON(jsonString: string): Result<ToolReferenceChunk, SDKValidationError>;

declare function toolReferenceChunkToJSON(toolReferenceChunk: ToolReferenceChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolReferenceChunkType$ {
    /** @deprecated use `ToolReferenceChunkType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly ToolReference: "tool_reference";
    }>;
    /** @deprecated use `ToolReferenceChunkType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly ToolReference: "tool_reference";
    }>;
}

/** @internal */
declare const ToolReferenceChunkType$inboundSchema: z.ZodNativeEnum<typeof ToolReferenceChunkType>;

/** @internal */
declare const ToolReferenceChunkType$outboundSchema: z.ZodNativeEnum<typeof ToolReferenceChunkType>;

declare const ToolReferenceChunkType: {
    readonly ToolReference: "tool_reference";
};

declare type ToolReferenceChunkType = ClosedEnum<typeof ToolReferenceChunkType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Tools$ {
    /** @deprecated use `Tools$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Tools, z.ZodTypeDef, unknown>;
    /** @deprecated use `Tools$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Tools$Outbound, z.ZodTypeDef, Tools>;
    /** @deprecated use `Tools$Outbound` instead. */
    type Outbound = Tools$Outbound;
}

/** @internal */
declare const Tools$inboundSchema: z.ZodType<Tools, z.ZodTypeDef, unknown>;

/** @internal */
declare type Tools$Outbound = (DocumentLibraryTool$Outbound & {
    type: "document_library";
}) | (FunctionTool$Outbound & {
    type: "function";
}) | (CodeInterpreterTool$Outbound & {
    type: "code_interpreter";
}) | (ImageGenerationTool$Outbound & {
    type: "image_generation";
}) | (WebSearchTool$Outbound & {
    type: "web_search";
}) | (WebSearchPremiumTool$Outbound & {
    type: "web_search_premium";
});

/** @internal */
declare const Tools$outboundSchema: z.ZodType<Tools$Outbound, z.ZodTypeDef, Tools>;

declare type Tools = (DocumentLibraryTool & {
    type: "document_library";
}) | (FunctionTool & {
    type: "function";
}) | (CodeInterpreterTool & {
    type: "code_interpreter";
}) | (ImageGenerationTool & {
    type: "image_generation";
}) | (WebSearchTool & {
    type: "web_search";
}) | (WebSearchPremiumTool & {
    type: "web_search_premium";
});

declare function toolsFromJSON(jsonString: string): Result<Tools, SDKValidationError>;

declare function toolsToJSON(tools: Tools): string;

declare function toolToJSON(tool: Tool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ToolTypes$ {
    /** @deprecated use `ToolTypes$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ToolTypes, z.ZodTypeDef, unknown>;
    /** @deprecated use `ToolTypes$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ToolTypes, z.ZodTypeDef, ToolTypes>;
}

/** @internal */
declare const ToolTypes$inboundSchema: z.ZodType<ToolTypes, z.ZodTypeDef, unknown>;

/** @internal */
declare const ToolTypes$outboundSchema: z.ZodType<ToolTypes, z.ZodTypeDef, ToolTypes>;

declare const ToolTypes: {
    readonly Function: "function";
};

declare type ToolTypes = OpenEnum<typeof ToolTypes>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TrainingFile$ {
    /** @deprecated use `TrainingFile$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TrainingFile, z.ZodTypeDef, unknown>;
    /** @deprecated use `TrainingFile$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TrainingFile$Outbound, z.ZodTypeDef, TrainingFile>;
    /** @deprecated use `TrainingFile$Outbound` instead. */
    type Outbound = TrainingFile$Outbound;
}

/** @internal */
declare const TrainingFile$inboundSchema: z.ZodType<TrainingFile, z.ZodTypeDef, unknown>;

/** @internal */
declare type TrainingFile$Outbound = {
    file_id: string;
    weight: number;
};

/** @internal */
declare const TrainingFile$outboundSchema: z.ZodType<TrainingFile$Outbound, z.ZodTypeDef, TrainingFile>;

declare type TrainingFile = {
    fileId: string;
    weight?: number | undefined;
};

declare function trainingFileFromJSON(jsonString: string): Result<TrainingFile, SDKValidationError>;

declare function trainingFileToJSON(trainingFile: TrainingFile): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionResponse$ {
    /** @deprecated use `TranscriptionResponse$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionResponse, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionResponse$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionResponse$Outbound, z.ZodTypeDef, TranscriptionResponse>;
    /** @deprecated use `TranscriptionResponse$Outbound` instead. */
    type Outbound = TranscriptionResponse$Outbound;
}

/** @internal */
declare const TranscriptionResponse$inboundSchema: z.ZodType<TranscriptionResponse, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionResponse$Outbound = {
    model: string;
    text: string;
    segments?: Array<TranscriptionSegmentChunk$Outbound> | undefined;
    usage: UsageInfo$Outbound;
    language: string | null;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const TranscriptionResponse$outboundSchema: z.ZodType<TranscriptionResponse$Outbound, z.ZodTypeDef, TranscriptionResponse>;

declare type TranscriptionResponse = {
    model: string;
    text: string;
    segments?: Array<TranscriptionSegmentChunk> | undefined;
    usage: UsageInfo;
    language: string | null;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function transcriptionResponseFromJSON(jsonString: string): Result<TranscriptionResponse, SDKValidationError>;

declare function transcriptionResponseToJSON(transcriptionResponse: TranscriptionResponse): string;

declare class Transcriptions extends ClientSDK {
    /**
     * Create Transcription
     */
    complete(request: components.AudioTranscriptionRequest, options?: RequestOptions): Promise<components.TranscriptionResponse>;
    /**
     * Create streaming transcription (SSE)
     */
    stream(request: components.AudioTranscriptionRequestStream, options?: RequestOptions): Promise<EventStream<components.TranscriptionStreamEvents>>;
}

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionSegmentChunk$ {
    /** @deprecated use `TranscriptionSegmentChunk$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionSegmentChunk, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionSegmentChunk$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionSegmentChunk$Outbound, z.ZodTypeDef, TranscriptionSegmentChunk>;
    /** @deprecated use `TranscriptionSegmentChunk$Outbound` instead. */
    type Outbound = TranscriptionSegmentChunk$Outbound;
}

/** @internal */
declare const TranscriptionSegmentChunk$inboundSchema: z.ZodType<TranscriptionSegmentChunk, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionSegmentChunk$Outbound = {
    text: string;
    start: number;
    end: number;
    type: string;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const TranscriptionSegmentChunk$outboundSchema: z.ZodType<TranscriptionSegmentChunk$Outbound, z.ZodTypeDef, TranscriptionSegmentChunk>;

declare type TranscriptionSegmentChunk = {
    text: string;
    start: number;
    end: number;
    type?: Type | undefined;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function transcriptionSegmentChunkFromJSON(jsonString: string): Result<TranscriptionSegmentChunk, SDKValidationError>;

declare function transcriptionSegmentChunkToJSON(transcriptionSegmentChunk: TranscriptionSegmentChunk): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamDone$ {
    /** @deprecated use `TranscriptionStreamDone$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionStreamDone, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionStreamDone$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionStreamDone$Outbound, z.ZodTypeDef, TranscriptionStreamDone>;
    /** @deprecated use `TranscriptionStreamDone$Outbound` instead. */
    type Outbound = TranscriptionStreamDone$Outbound;
}

/** @internal */
declare const TranscriptionStreamDone$inboundSchema: z.ZodType<TranscriptionStreamDone, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionStreamDone$Outbound = {
    model: string;
    text: string;
    segments?: Array<TranscriptionSegmentChunk$Outbound> | undefined;
    usage: UsageInfo$Outbound;
    type: string;
    language: string | null;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const TranscriptionStreamDone$outboundSchema: z.ZodType<TranscriptionStreamDone$Outbound, z.ZodTypeDef, TranscriptionStreamDone>;

declare type TranscriptionStreamDone = {
    model: string;
    text: string;
    segments?: Array<TranscriptionSegmentChunk> | undefined;
    usage: UsageInfo;
    type?: TranscriptionStreamDoneType | undefined;
    language: string | null;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function transcriptionStreamDoneFromJSON(jsonString: string): Result<TranscriptionStreamDone, SDKValidationError>;

declare function transcriptionStreamDoneToJSON(transcriptionStreamDone: TranscriptionStreamDone): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamDoneType$ {
    /** @deprecated use `TranscriptionStreamDoneType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionDone: "transcription.done";
    }>;
    /** @deprecated use `TranscriptionStreamDoneType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionDone: "transcription.done";
    }>;
}

/** @internal */
declare const TranscriptionStreamDoneType$inboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamDoneType>;

/** @internal */
declare const TranscriptionStreamDoneType$outboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamDoneType>;

declare const TranscriptionStreamDoneType: {
    readonly TranscriptionDone: "transcription.done";
};

declare type TranscriptionStreamDoneType = ClosedEnum<typeof TranscriptionStreamDoneType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamEvents$ {
    /** @deprecated use `TranscriptionStreamEvents$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionStreamEvents, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionStreamEvents$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionStreamEvents$Outbound, z.ZodTypeDef, TranscriptionStreamEvents>;
    /** @deprecated use `TranscriptionStreamEvents$Outbound` instead. */
    type Outbound = TranscriptionStreamEvents$Outbound;
}

/** @internal */
declare const TranscriptionStreamEvents$inboundSchema: z.ZodType<TranscriptionStreamEvents, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionStreamEvents$Outbound = {
    event: string;
    data: (TranscriptionStreamDone$Outbound & {
        type: "transcription.done";
    }) | (TranscriptionStreamSegmentDelta$Outbound & {
        type: "transcription.segment";
    }) | (TranscriptionStreamLanguage$Outbound & {
        type: "transcription.language";
    }) | (TranscriptionStreamTextDelta$Outbound & {
        type: "transcription.text.delta";
    });
};

/** @internal */
declare const TranscriptionStreamEvents$outboundSchema: z.ZodType<TranscriptionStreamEvents$Outbound, z.ZodTypeDef, TranscriptionStreamEvents>;

declare type TranscriptionStreamEvents = {
    event: TranscriptionStreamEventTypes;
    data: (TranscriptionStreamDone & {
        type: "transcription.done";
    }) | (TranscriptionStreamSegmentDelta & {
        type: "transcription.segment";
    }) | (TranscriptionStreamLanguage & {
        type: "transcription.language";
    }) | (TranscriptionStreamTextDelta & {
        type: "transcription.text.delta";
    });
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamEventsData$ {
    /** @deprecated use `TranscriptionStreamEventsData$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionStreamEventsData, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionStreamEventsData$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionStreamEventsData$Outbound, z.ZodTypeDef, TranscriptionStreamEventsData>;
    /** @deprecated use `TranscriptionStreamEventsData$Outbound` instead. */
    type Outbound = TranscriptionStreamEventsData$Outbound;
}

/** @internal */
declare const TranscriptionStreamEventsData$inboundSchema: z.ZodType<TranscriptionStreamEventsData, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionStreamEventsData$Outbound = (TranscriptionStreamDone$Outbound & {
    type: "transcription.done";
}) | (TranscriptionStreamSegmentDelta$Outbound & {
    type: "transcription.segment";
}) | (TranscriptionStreamLanguage$Outbound & {
    type: "transcription.language";
}) | (TranscriptionStreamTextDelta$Outbound & {
    type: "transcription.text.delta";
});

/** @internal */
declare const TranscriptionStreamEventsData$outboundSchema: z.ZodType<TranscriptionStreamEventsData$Outbound, z.ZodTypeDef, TranscriptionStreamEventsData>;

declare type TranscriptionStreamEventsData = (TranscriptionStreamDone & {
    type: "transcription.done";
}) | (TranscriptionStreamSegmentDelta & {
    type: "transcription.segment";
}) | (TranscriptionStreamLanguage & {
    type: "transcription.language";
}) | (TranscriptionStreamTextDelta & {
    type: "transcription.text.delta";
});

declare function transcriptionStreamEventsDataFromJSON(jsonString: string): Result<TranscriptionStreamEventsData, SDKValidationError>;

declare function transcriptionStreamEventsDataToJSON(transcriptionStreamEventsData: TranscriptionStreamEventsData): string;

declare function transcriptionStreamEventsFromJSON(jsonString: string): Result<TranscriptionStreamEvents, SDKValidationError>;

declare function transcriptionStreamEventsToJSON(transcriptionStreamEvents: TranscriptionStreamEvents): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamEventTypes$ {
    /** @deprecated use `TranscriptionStreamEventTypes$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionLanguage: "transcription.language";
        readonly TranscriptionSegment: "transcription.segment";
        readonly TranscriptionTextDelta: "transcription.text.delta";
        readonly TranscriptionDone: "transcription.done";
    }>;
    /** @deprecated use `TranscriptionStreamEventTypes$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionLanguage: "transcription.language";
        readonly TranscriptionSegment: "transcription.segment";
        readonly TranscriptionTextDelta: "transcription.text.delta";
        readonly TranscriptionDone: "transcription.done";
    }>;
}

/** @internal */
declare const TranscriptionStreamEventTypes$inboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamEventTypes>;

/** @internal */
declare const TranscriptionStreamEventTypes$outboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamEventTypes>;

declare const TranscriptionStreamEventTypes: {
    readonly TranscriptionLanguage: "transcription.language";
    readonly TranscriptionSegment: "transcription.segment";
    readonly TranscriptionTextDelta: "transcription.text.delta";
    readonly TranscriptionDone: "transcription.done";
};

declare type TranscriptionStreamEventTypes = ClosedEnum<typeof TranscriptionStreamEventTypes>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamLanguage$ {
    /** @deprecated use `TranscriptionStreamLanguage$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionStreamLanguage, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionStreamLanguage$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionStreamLanguage$Outbound, z.ZodTypeDef, TranscriptionStreamLanguage>;
    /** @deprecated use `TranscriptionStreamLanguage$Outbound` instead. */
    type Outbound = TranscriptionStreamLanguage$Outbound;
}

/** @internal */
declare const TranscriptionStreamLanguage$inboundSchema: z.ZodType<TranscriptionStreamLanguage, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionStreamLanguage$Outbound = {
    type: string;
    audio_language: string;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const TranscriptionStreamLanguage$outboundSchema: z.ZodType<TranscriptionStreamLanguage$Outbound, z.ZodTypeDef, TranscriptionStreamLanguage>;

declare type TranscriptionStreamLanguage = {
    type?: TranscriptionStreamLanguageType | undefined;
    audioLanguage: string;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function transcriptionStreamLanguageFromJSON(jsonString: string): Result<TranscriptionStreamLanguage, SDKValidationError>;

declare function transcriptionStreamLanguageToJSON(transcriptionStreamLanguage: TranscriptionStreamLanguage): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamLanguageType$ {
    /** @deprecated use `TranscriptionStreamLanguageType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionLanguage: "transcription.language";
    }>;
    /** @deprecated use `TranscriptionStreamLanguageType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionLanguage: "transcription.language";
    }>;
}

/** @internal */
declare const TranscriptionStreamLanguageType$inboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamLanguageType>;

/** @internal */
declare const TranscriptionStreamLanguageType$outboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamLanguageType>;

declare const TranscriptionStreamLanguageType: {
    readonly TranscriptionLanguage: "transcription.language";
};

declare type TranscriptionStreamLanguageType = ClosedEnum<typeof TranscriptionStreamLanguageType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamSegmentDelta$ {
    /** @deprecated use `TranscriptionStreamSegmentDelta$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionStreamSegmentDelta, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionStreamSegmentDelta$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionStreamSegmentDelta$Outbound, z.ZodTypeDef, TranscriptionStreamSegmentDelta>;
    /** @deprecated use `TranscriptionStreamSegmentDelta$Outbound` instead. */
    type Outbound = TranscriptionStreamSegmentDelta$Outbound;
}

/** @internal */
declare const TranscriptionStreamSegmentDelta$inboundSchema: z.ZodType<TranscriptionStreamSegmentDelta, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionStreamSegmentDelta$Outbound = {
    text: string;
    start: number;
    end: number;
    type: string;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const TranscriptionStreamSegmentDelta$outboundSchema: z.ZodType<TranscriptionStreamSegmentDelta$Outbound, z.ZodTypeDef, TranscriptionStreamSegmentDelta>;

declare type TranscriptionStreamSegmentDelta = {
    text: string;
    start: number;
    end: number;
    type?: TranscriptionStreamSegmentDeltaType | undefined;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function transcriptionStreamSegmentDeltaFromJSON(jsonString: string): Result<TranscriptionStreamSegmentDelta, SDKValidationError>;

declare function transcriptionStreamSegmentDeltaToJSON(transcriptionStreamSegmentDelta: TranscriptionStreamSegmentDelta): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamSegmentDeltaType$ {
    /** @deprecated use `TranscriptionStreamSegmentDeltaType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionSegment: "transcription.segment";
    }>;
    /** @deprecated use `TranscriptionStreamSegmentDeltaType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionSegment: "transcription.segment";
    }>;
}

/** @internal */
declare const TranscriptionStreamSegmentDeltaType$inboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamSegmentDeltaType>;

/** @internal */
declare const TranscriptionStreamSegmentDeltaType$outboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamSegmentDeltaType>;

declare const TranscriptionStreamSegmentDeltaType: {
    readonly TranscriptionSegment: "transcription.segment";
};

declare type TranscriptionStreamSegmentDeltaType = ClosedEnum<typeof TranscriptionStreamSegmentDeltaType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamTextDelta$ {
    /** @deprecated use `TranscriptionStreamTextDelta$inboundSchema` instead. */
    const inboundSchema: z.ZodType<TranscriptionStreamTextDelta, z.ZodTypeDef, unknown>;
    /** @deprecated use `TranscriptionStreamTextDelta$outboundSchema` instead. */
    const outboundSchema: z.ZodType<TranscriptionStreamTextDelta$Outbound, z.ZodTypeDef, TranscriptionStreamTextDelta>;
    /** @deprecated use `TranscriptionStreamTextDelta$Outbound` instead. */
    type Outbound = TranscriptionStreamTextDelta$Outbound;
}

/** @internal */
declare const TranscriptionStreamTextDelta$inboundSchema: z.ZodType<TranscriptionStreamTextDelta, z.ZodTypeDef, unknown>;

/** @internal */
declare type TranscriptionStreamTextDelta$Outbound = {
    text: string;
    type: string;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const TranscriptionStreamTextDelta$outboundSchema: z.ZodType<TranscriptionStreamTextDelta$Outbound, z.ZodTypeDef, TranscriptionStreamTextDelta>;

declare type TranscriptionStreamTextDelta = {
    text: string;
    type?: TranscriptionStreamTextDeltaType | undefined;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function transcriptionStreamTextDeltaFromJSON(jsonString: string): Result<TranscriptionStreamTextDelta, SDKValidationError>;

declare function transcriptionStreamTextDeltaToJSON(transcriptionStreamTextDelta: TranscriptionStreamTextDelta): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace TranscriptionStreamTextDeltaType$ {
    /** @deprecated use `TranscriptionStreamTextDeltaType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionTextDelta: "transcription.text.delta";
    }>;
    /** @deprecated use `TranscriptionStreamTextDeltaType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionTextDelta: "transcription.text.delta";
    }>;
}

/** @internal */
declare const TranscriptionStreamTextDeltaType$inboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamTextDeltaType>;

/** @internal */
declare const TranscriptionStreamTextDeltaType$outboundSchema: z.ZodNativeEnum<typeof TranscriptionStreamTextDeltaType>;

declare const TranscriptionStreamTextDeltaType: {
    readonly TranscriptionTextDelta: "transcription.text.delta";
};

declare type TranscriptionStreamTextDeltaType = ClosedEnum<typeof TranscriptionStreamTextDeltaType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Two$ {
    /** @deprecated use `Two$inboundSchema` instead. */
    const inboundSchema: z.ZodType<Two, z.ZodTypeDef, unknown>;
    /** @deprecated use `Two$outboundSchema` instead. */
    const outboundSchema: z.ZodType<Two$Outbound, z.ZodTypeDef, Two>;
    /** @deprecated use `Two$Outbound` instead. */
    type Outbound = Two$Outbound;
}

/** @internal */
declare const Two$inboundSchema: z.ZodType<Two, z.ZodTypeDef, unknown>;

/** @internal */
declare type Two$Outbound = (SystemMessage$Outbound & {
    role: "system";
}) | (ToolMessage$Outbound & {
    role: "tool";
}) | (UserMessage$Outbound & {
    role: "user";
}) | (AssistantMessage$Outbound & {
    role: "assistant";
});

/** @internal */
declare const Two$outboundSchema: z.ZodType<Two$Outbound, z.ZodTypeDef, Two>;

declare type Two = (SystemMessage & {
    role: "system";
}) | (ToolMessage & {
    role: "tool";
}) | (UserMessage & {
    role: "user";
}) | (AssistantMessage & {
    role: "assistant";
});

declare function twoFromJSON(jsonString: string): Result<Two, SDKValidationError>;

declare function twoToJSON(two: Two): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace Type$ {
    /** @deprecated use `Type$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionSegment: "transcription_segment";
    }>;
    /** @deprecated use `Type$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly TranscriptionSegment: "transcription_segment";
    }>;
}

/** @internal */
declare const Type$inboundSchema: z.ZodNativeEnum<typeof Type>;

/** @internal */
declare const Type$outboundSchema: z.ZodNativeEnum<typeof Type>;

declare const Type: {
    readonly TranscriptionSegment: "transcription_segment";
};

declare type Type = ClosedEnum<typeof Type>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UnarchiveFTModelOut$ {
    /** @deprecated use `UnarchiveFTModelOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<UnarchiveFTModelOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `UnarchiveFTModelOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<UnarchiveFTModelOut$Outbound, z.ZodTypeDef, UnarchiveFTModelOut>;
    /** @deprecated use `UnarchiveFTModelOut$Outbound` instead. */
    type Outbound = UnarchiveFTModelOut$Outbound;
}

/** @internal */
declare const UnarchiveFTModelOut$inboundSchema: z.ZodType<UnarchiveFTModelOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type UnarchiveFTModelOut$Outbound = {
    id: string;
    object: string;
    archived: boolean;
};

/** @internal */
declare const UnarchiveFTModelOut$outboundSchema: z.ZodType<UnarchiveFTModelOut$Outbound, z.ZodTypeDef, UnarchiveFTModelOut>;

declare type UnarchiveFTModelOut = {
    id: string;
    object?: UnarchiveFTModelOutObject | undefined;
    archived?: boolean | undefined;
};

declare function unarchiveFTModelOutFromJSON(jsonString: string): Result<UnarchiveFTModelOut, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UnarchiveFTModelOutObject$ {
    /** @deprecated use `UnarchiveFTModelOutObject$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
    /** @deprecated use `UnarchiveFTModelOutObject$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Model: "model";
    }>;
}

/** @internal */
declare const UnarchiveFTModelOutObject$inboundSchema: z.ZodNativeEnum<typeof UnarchiveFTModelOutObject>;

/** @internal */
declare const UnarchiveFTModelOutObject$outboundSchema: z.ZodNativeEnum<typeof UnarchiveFTModelOutObject>;

declare const UnarchiveFTModelOutObject: {
    readonly Model: "model";
};

declare type UnarchiveFTModelOutObject = ClosedEnum<typeof UnarchiveFTModelOutObject>;

declare function unarchiveFTModelOutToJSON(unarchiveFTModelOut: UnarchiveFTModelOut): string;

/**
 * An error to capture unrecognised or unexpected errors when making HTTP calls.
 */
declare class UnexpectedClientError extends HTTPClientError {
    name: string;
}

declare type Unrecognized<T> = T & {
    [__brand]: "unrecognized";
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UpdateFTModelIn$ {
    /** @deprecated use `UpdateFTModelIn$inboundSchema` instead. */
    const inboundSchema: z.ZodType<UpdateFTModelIn, z.ZodTypeDef, unknown>;
    /** @deprecated use `UpdateFTModelIn$outboundSchema` instead. */
    const outboundSchema: z.ZodType<UpdateFTModelIn$Outbound, z.ZodTypeDef, UpdateFTModelIn>;
    /** @deprecated use `UpdateFTModelIn$Outbound` instead. */
    type Outbound = UpdateFTModelIn$Outbound;
}

/** @internal */
declare const UpdateFTModelIn$inboundSchema: z.ZodType<UpdateFTModelIn, z.ZodTypeDef, unknown>;

/** @internal */
declare type UpdateFTModelIn$Outbound = {
    name?: string | null | undefined;
    description?: string | null | undefined;
};

/** @internal */
declare const UpdateFTModelIn$outboundSchema: z.ZodType<UpdateFTModelIn$Outbound, z.ZodTypeDef, UpdateFTModelIn>;

declare type UpdateFTModelIn = {
    name?: string | null | undefined;
    description?: string | null | undefined;
};

declare function updateFTModelInFromJSON(jsonString: string): Result<UpdateFTModelIn, SDKValidationError>;

declare function updateFTModelInToJSON(updateFTModelIn: UpdateFTModelIn): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UploadFileOut$ {
    /** @deprecated use `UploadFileOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<UploadFileOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `UploadFileOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<UploadFileOut$Outbound, z.ZodTypeDef, UploadFileOut>;
    /** @deprecated use `UploadFileOut$Outbound` instead. */
    type Outbound = UploadFileOut$Outbound;
}

/** @internal */
declare const UploadFileOut$inboundSchema: z.ZodType<UploadFileOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type UploadFileOut$Outbound = {
    id: string;
    object: string;
    bytes: number;
    created_at: number;
    filename: string;
    purpose: string;
    sample_type: string;
    num_lines?: number | null | undefined;
    mimetype?: string | null | undefined;
    source: string;
    signature?: string | null | undefined;
};

/** @internal */
declare const UploadFileOut$outboundSchema: z.ZodType<UploadFileOut$Outbound, z.ZodTypeDef, UploadFileOut>;

declare type UploadFileOut = {
    /**
     * The unique identifier of the file.
     */
    id: string;
    /**
     * The object type, which is always "file".
     */
    object: string;
    /**
     * The size of the file, in bytes.
     */
    sizeBytes: number;
    /**
     * The UNIX timestamp (in seconds) of the event.
     */
    createdAt: number;
    /**
     * The name of the uploaded file.
     */
    filename: string;
    purpose: FilePurpose;
    sampleType: SampleType;
    numLines?: number | null | undefined;
    mimetype?: string | null | undefined;
    source: Source;
    signature?: string | null | undefined;
};

declare function uploadFileOutFromJSON(jsonString: string): Result<UploadFileOut, SDKValidationError>;

declare function uploadFileOutToJSON(uploadFileOut: UploadFileOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UsageInfo$ {
    /** @deprecated use `UsageInfo$inboundSchema` instead. */
    const inboundSchema: z.ZodType<UsageInfo, z.ZodTypeDef, unknown>;
    /** @deprecated use `UsageInfo$outboundSchema` instead. */
    const outboundSchema: z.ZodType<UsageInfo$Outbound, z.ZodTypeDef, UsageInfo>;
    /** @deprecated use `UsageInfo$Outbound` instead. */
    type Outbound = UsageInfo$Outbound;
}

/** @internal */
declare const UsageInfo$inboundSchema: z.ZodType<UsageInfo, z.ZodTypeDef, unknown>;

/** @internal */
declare type UsageInfo$Outbound = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_audio_seconds?: number | null | undefined;
    [additionalProperties: string]: unknown;
};

/** @internal */
declare const UsageInfo$outboundSchema: z.ZodType<UsageInfo$Outbound, z.ZodTypeDef, UsageInfo>;

declare type UsageInfo = {
    promptTokens?: number | undefined;
    completionTokens?: number | undefined;
    totalTokens?: number | undefined;
    promptAudioSeconds?: number | null | undefined;
    additionalProperties?: {
        [k: string]: any;
    };
};

declare function usageInfoFromJSON(jsonString: string): Result<UsageInfo, SDKValidationError>;

declare function usageInfoToJSON(usageInfo: UsageInfo): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UserMessage$ {
    /** @deprecated use `UserMessage$inboundSchema` instead. */
    const inboundSchema: z.ZodType<UserMessage, z.ZodTypeDef, unknown>;
    /** @deprecated use `UserMessage$outboundSchema` instead. */
    const outboundSchema: z.ZodType<UserMessage$Outbound, z.ZodTypeDef, UserMessage>;
    /** @deprecated use `UserMessage$Outbound` instead. */
    type Outbound = UserMessage$Outbound;
}

/** @internal */
declare const UserMessage$inboundSchema: z.ZodType<UserMessage, z.ZodTypeDef, unknown>;

/** @internal */
declare type UserMessage$Outbound = {
    content: string | Array<ContentChunk$Outbound> | null;
    role: string;
};

/** @internal */
declare const UserMessage$outboundSchema: z.ZodType<UserMessage$Outbound, z.ZodTypeDef, UserMessage>;

declare type UserMessage = {
    content: string | Array<ContentChunk> | null;
    role?: UserMessageRole | undefined;
};

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UserMessageContent$ {
    /** @deprecated use `UserMessageContent$inboundSchema` instead. */
    const inboundSchema: z.ZodType<UserMessageContent, z.ZodTypeDef, unknown>;
    /** @deprecated use `UserMessageContent$outboundSchema` instead. */
    const outboundSchema: z.ZodType<UserMessageContent$Outbound, z.ZodTypeDef, UserMessageContent>;
    /** @deprecated use `UserMessageContent$Outbound` instead. */
    type Outbound = UserMessageContent$Outbound;
}

/** @internal */
declare const UserMessageContent$inboundSchema: z.ZodType<UserMessageContent, z.ZodTypeDef, unknown>;

/** @internal */
declare type UserMessageContent$Outbound = string | Array<ContentChunk$Outbound>;

/** @internal */
declare const UserMessageContent$outboundSchema: z.ZodType<UserMessageContent$Outbound, z.ZodTypeDef, UserMessageContent>;

declare type UserMessageContent = string | Array<ContentChunk>;

declare function userMessageContentFromJSON(jsonString: string): Result<UserMessageContent, SDKValidationError>;

declare function userMessageContentToJSON(userMessageContent: UserMessageContent): string;

declare function userMessageFromJSON(jsonString: string): Result<UserMessage, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace UserMessageRole$ {
    /** @deprecated use `UserMessageRole$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly User: "user";
    }>;
    /** @deprecated use `UserMessageRole$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly User: "user";
    }>;
}

/** @internal */
declare const UserMessageRole$inboundSchema: z.ZodNativeEnum<typeof UserMessageRole>;

/** @internal */
declare const UserMessageRole$outboundSchema: z.ZodNativeEnum<typeof UserMessageRole>;

declare const UserMessageRole: {
    readonly User: "user";
};

declare type UserMessageRole = ClosedEnum<typeof UserMessageRole>;

declare function userMessageToJSON(userMessage: UserMessage): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace ValidationError$ {
    /** @deprecated use `ValidationError$inboundSchema` instead. */
    const inboundSchema: z.ZodType<ValidationError, z.ZodTypeDef, unknown>;
    /** @deprecated use `ValidationError$outboundSchema` instead. */
    const outboundSchema: z.ZodType<ValidationError$Outbound, z.ZodTypeDef, ValidationError>;
    /** @deprecated use `ValidationError$Outbound` instead. */
    type Outbound = ValidationError$Outbound;
}

/** @internal */
declare const ValidationError$inboundSchema: z.ZodType<ValidationError, z.ZodTypeDef, unknown>;

/** @internal */
declare type ValidationError$Outbound = {
    loc: Array<string | number>;
    msg: string;
    type: string;
};

/** @internal */
declare const ValidationError$outboundSchema: z.ZodType<ValidationError$Outbound, z.ZodTypeDef, ValidationError>;

declare type ValidationError = {
    loc: Array<string | number>;
    msg: string;
    type: string;
};

declare function validationErrorFromJSON(jsonString: string): Result<ValidationError, SDKValidationError>;

declare function validationErrorToJSON(validationError: ValidationError): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WandbIntegration$ {
    /** @deprecated use `WandbIntegration$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegration, z.ZodTypeDef, unknown>;
    /** @deprecated use `WandbIntegration$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegration$Outbound, z.ZodTypeDef, WandbIntegration>;
    /** @deprecated use `WandbIntegration$Outbound` instead. */
    type Outbound = WandbIntegration$Outbound;
}

/** @internal */
declare const WandbIntegration$inboundSchema: z.ZodType<WandbIntegration, z.ZodTypeDef, unknown>;

/** @internal */
declare type WandbIntegration$Outbound = {
    type: string;
    project: string;
    name?: string | null | undefined;
    api_key: string;
    run_name?: string | null | undefined;
};

/** @internal */
declare const WandbIntegration$outboundSchema: z.ZodType<WandbIntegration$Outbound, z.ZodTypeDef, WandbIntegration>;

declare type WandbIntegration = {
    type?: WandbIntegrationType | undefined;
    /**
     * The name of the project that the new run will be created under.
     */
    project: string;
    /**
     * A display name to set for the run. If not set, will use the job ID as the name.
     */
    name?: string | null | undefined;
    /**
     * The WandB API key to use for authentication.
     */
    apiKey: string;
    runName?: string | null | undefined;
};

declare function wandbIntegrationFromJSON(jsonString: string): Result<WandbIntegration, SDKValidationError>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WandbIntegrationOut$ {
    /** @deprecated use `WandbIntegrationOut$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WandbIntegrationOut, z.ZodTypeDef, unknown>;
    /** @deprecated use `WandbIntegrationOut$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WandbIntegrationOut$Outbound, z.ZodTypeDef, WandbIntegrationOut>;
    /** @deprecated use `WandbIntegrationOut$Outbound` instead. */
    type Outbound = WandbIntegrationOut$Outbound;
}

/** @internal */
declare const WandbIntegrationOut$inboundSchema: z.ZodType<WandbIntegrationOut, z.ZodTypeDef, unknown>;

/** @internal */
declare type WandbIntegrationOut$Outbound = {
    type: string;
    project: string;
    name?: string | null | undefined;
    run_name?: string | null | undefined;
    url?: string | null | undefined;
};

/** @internal */
declare const WandbIntegrationOut$outboundSchema: z.ZodType<WandbIntegrationOut$Outbound, z.ZodTypeDef, WandbIntegrationOut>;

declare type WandbIntegrationOut = {
    type?: WandbIntegrationOutType | undefined;
    /**
     * The name of the project that the new run will be created under.
     */
    project: string;
    /**
     * A display name to set for the run. If not set, will use the job ID as the name.
     */
    name?: string | null | undefined;
    runName?: string | null | undefined;
    url?: string | null | undefined;
};

declare function wandbIntegrationOutFromJSON(jsonString: string): Result<WandbIntegrationOut, SDKValidationError>;

declare function wandbIntegrationOutToJSON(wandbIntegrationOut: WandbIntegrationOut): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WandbIntegrationOutType$ {
    /** @deprecated use `WandbIntegrationOutType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Wandb: "wandb";
    }>;
    /** @deprecated use `WandbIntegrationOutType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Wandb: "wandb";
    }>;
}

/** @internal */
declare const WandbIntegrationOutType$inboundSchema: z.ZodNativeEnum<typeof WandbIntegrationOutType>;

/** @internal */
declare const WandbIntegrationOutType$outboundSchema: z.ZodNativeEnum<typeof WandbIntegrationOutType>;

declare const WandbIntegrationOutType: {
    readonly Wandb: "wandb";
};

declare type WandbIntegrationOutType = ClosedEnum<typeof WandbIntegrationOutType>;

declare function wandbIntegrationToJSON(wandbIntegration: WandbIntegration): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WandbIntegrationType$ {
    /** @deprecated use `WandbIntegrationType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly Wandb: "wandb";
    }>;
    /** @deprecated use `WandbIntegrationType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly Wandb: "wandb";
    }>;
}

/** @internal */
declare const WandbIntegrationType$inboundSchema: z.ZodNativeEnum<typeof WandbIntegrationType>;

/** @internal */
declare const WandbIntegrationType$outboundSchema: z.ZodNativeEnum<typeof WandbIntegrationType>;

declare const WandbIntegrationType: {
    readonly Wandb: "wandb";
};

declare type WandbIntegrationType = ClosedEnum<typeof WandbIntegrationType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WebSearchPremiumTool$ {
    /** @deprecated use `WebSearchPremiumTool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WebSearchPremiumTool, z.ZodTypeDef, unknown>;
    /** @deprecated use `WebSearchPremiumTool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WebSearchPremiumTool$Outbound, z.ZodTypeDef, WebSearchPremiumTool>;
    /** @deprecated use `WebSearchPremiumTool$Outbound` instead. */
    type Outbound = WebSearchPremiumTool$Outbound;
}

/** @internal */
declare const WebSearchPremiumTool$inboundSchema: z.ZodType<WebSearchPremiumTool, z.ZodTypeDef, unknown>;

/** @internal */
declare type WebSearchPremiumTool$Outbound = {
    type: string;
};

/** @internal */
declare const WebSearchPremiumTool$outboundSchema: z.ZodType<WebSearchPremiumTool$Outbound, z.ZodTypeDef, WebSearchPremiumTool>;

declare type WebSearchPremiumTool = {
    type?: WebSearchPremiumToolType | undefined;
};

declare function webSearchPremiumToolFromJSON(jsonString: string): Result<WebSearchPremiumTool, SDKValidationError>;

declare function webSearchPremiumToolToJSON(webSearchPremiumTool: WebSearchPremiumTool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WebSearchPremiumToolType$ {
    /** @deprecated use `WebSearchPremiumToolType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly WebSearchPremium: "web_search_premium";
    }>;
    /** @deprecated use `WebSearchPremiumToolType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly WebSearchPremium: "web_search_premium";
    }>;
}

/** @internal */
declare const WebSearchPremiumToolType$inboundSchema: z.ZodNativeEnum<typeof WebSearchPremiumToolType>;

/** @internal */
declare const WebSearchPremiumToolType$outboundSchema: z.ZodNativeEnum<typeof WebSearchPremiumToolType>;

declare const WebSearchPremiumToolType: {
    readonly WebSearchPremium: "web_search_premium";
};

declare type WebSearchPremiumToolType = ClosedEnum<typeof WebSearchPremiumToolType>;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WebSearchTool$ {
    /** @deprecated use `WebSearchTool$inboundSchema` instead. */
    const inboundSchema: z.ZodType<WebSearchTool, z.ZodTypeDef, unknown>;
    /** @deprecated use `WebSearchTool$outboundSchema` instead. */
    const outboundSchema: z.ZodType<WebSearchTool$Outbound, z.ZodTypeDef, WebSearchTool>;
    /** @deprecated use `WebSearchTool$Outbound` instead. */
    type Outbound = WebSearchTool$Outbound;
}

/** @internal */
declare const WebSearchTool$inboundSchema: z.ZodType<WebSearchTool, z.ZodTypeDef, unknown>;

/** @internal */
declare type WebSearchTool$Outbound = {
    type: string;
};

/** @internal */
declare const WebSearchTool$outboundSchema: z.ZodType<WebSearchTool$Outbound, z.ZodTypeDef, WebSearchTool>;

declare type WebSearchTool = {
    type?: WebSearchToolType | undefined;
};

declare function webSearchToolFromJSON(jsonString: string): Result<WebSearchTool, SDKValidationError>;

declare function webSearchToolToJSON(webSearchTool: WebSearchTool): string;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
declare namespace WebSearchToolType$ {
    /** @deprecated use `WebSearchToolType$inboundSchema` instead. */
    const inboundSchema: z.ZodNativeEnum<{
        readonly WebSearch: "web_search";
    }>;
    /** @deprecated use `WebSearchToolType$outboundSchema` instead. */
    const outboundSchema: z.ZodNativeEnum<{
        readonly WebSearch: "web_search";
    }>;
}

/** @internal */
declare const WebSearchToolType$inboundSchema: z.ZodNativeEnum<typeof WebSearchToolType>;

/** @internal */
declare const WebSearchToolType$outboundSchema: z.ZodNativeEnum<typeof WebSearchToolType>;

declare const WebSearchToolType: {
    readonly WebSearch: "web_search";
};

declare type WebSearchToolType = ClosedEnum<typeof WebSearchToolType>;

export { }
