import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace opentelemetry. */
export namespace opentelemetry {

    /** Namespace proto. */
    namespace proto {

        /** Namespace collector. */
        namespace collector {

            /** Namespace trace. */
            namespace trace {

                /** Namespace v1. */
                namespace v1 {

                    /** Properties of an ExportTraceServiceRequest. */
                    interface IExportTraceServiceRequest {

                        /** ExportTraceServiceRequest resourceSpans */
                        resourceSpans?: (opentelemetry.proto.trace.v1.IResourceSpans[]|null);
                    }

                    /** Represents an ExportTraceServiceRequest. */
                    class ExportTraceServiceRequest implements IExportTraceServiceRequest {

                        /**
                         * Constructs a new ExportTraceServiceRequest.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.trace.v1.IExportTraceServiceRequest);

                        /** ExportTraceServiceRequest resourceSpans. */
                        public resourceSpans: opentelemetry.proto.trace.v1.IResourceSpans[];

                        /**
                         * Decodes an ExportTraceServiceRequest message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportTraceServiceRequest
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;

                        /**
                         * Creates an ExportTraceServiceRequest message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportTraceServiceRequest
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;

                        /**
                         * Creates a plain object from an ExportTraceServiceRequest message. Also converts values to other types if specified.
                         * @param message ExportTraceServiceRequest
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportTraceServiceRequest to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportTraceServiceRequest
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of an ExportTraceServiceResponse. */
                    interface IExportTraceServiceResponse {

                        /** ExportTraceServiceResponse partialSuccess */
                        partialSuccess?: (opentelemetry.proto.collector.trace.v1.IExportTracePartialSuccess|null);
                    }

                    /** Represents an ExportTraceServiceResponse. */
                    class ExportTraceServiceResponse implements IExportTraceServiceResponse {

                        /**
                         * Constructs a new ExportTraceServiceResponse.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.trace.v1.IExportTraceServiceResponse);

                        /** ExportTraceServiceResponse partialSuccess. */
                        public partialSuccess?: (opentelemetry.proto.collector.trace.v1.IExportTracePartialSuccess|null);

                        /**
                         * Decodes an ExportTraceServiceResponse message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportTraceServiceResponse
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;

                        /**
                         * Creates an ExportTraceServiceResponse message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportTraceServiceResponse
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;

                        /**
                         * Creates a plain object from an ExportTraceServiceResponse message. Also converts values to other types if specified.
                         * @param message ExportTraceServiceResponse
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportTraceServiceResponse to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportTraceServiceResponse
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of an ExportTracePartialSuccess. */
                    interface IExportTracePartialSuccess {

                        /** ExportTracePartialSuccess rejectedSpans */
                        rejectedSpans?: (number|Long|null);

                        /** ExportTracePartialSuccess errorMessage */
                        errorMessage?: (string|null);
                    }

                    /** Represents an ExportTracePartialSuccess. */
                    class ExportTracePartialSuccess implements IExportTracePartialSuccess {

                        /**
                         * Constructs a new ExportTracePartialSuccess.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.trace.v1.IExportTracePartialSuccess);

                        /** ExportTracePartialSuccess rejectedSpans. */
                        public rejectedSpans: (number|Long);

                        /** ExportTracePartialSuccess errorMessage. */
                        public errorMessage: string;

                        /**
                         * Decodes an ExportTracePartialSuccess message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportTracePartialSuccess
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;

                        /**
                         * Creates an ExportTracePartialSuccess message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportTracePartialSuccess
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess;

                        /**
                         * Creates a plain object from an ExportTracePartialSuccess message. Also converts values to other types if specified.
                         * @param message ExportTracePartialSuccess
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportTracePartialSuccess to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportTracePartialSuccess
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }

            /** Namespace logs. */
            namespace logs {

                /** Namespace v1. */
                namespace v1 {

                    /** Properties of an ExportLogsServiceRequest. */
                    interface IExportLogsServiceRequest {

                        /** ExportLogsServiceRequest resourceLogs */
                        resourceLogs?: (opentelemetry.proto.logs.v1.IResourceLogs[]|null);
                    }

                    /** Represents an ExportLogsServiceRequest. */
                    class ExportLogsServiceRequest implements IExportLogsServiceRequest {

                        /**
                         * Constructs a new ExportLogsServiceRequest.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.logs.v1.IExportLogsServiceRequest);

                        /** ExportLogsServiceRequest resourceLogs. */
                        public resourceLogs: opentelemetry.proto.logs.v1.IResourceLogs[];

                        /**
                         * Decodes an ExportLogsServiceRequest message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportLogsServiceRequest
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;

                        /**
                         * Creates an ExportLogsServiceRequest message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportLogsServiceRequest
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;

                        /**
                         * Creates a plain object from an ExportLogsServiceRequest message. Also converts values to other types if specified.
                         * @param message ExportLogsServiceRequest
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportLogsServiceRequest to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportLogsServiceRequest
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of an ExportLogsServiceResponse. */
                    interface IExportLogsServiceResponse {

                        /** ExportLogsServiceResponse partialSuccess */
                        partialSuccess?: (opentelemetry.proto.collector.logs.v1.IExportLogsPartialSuccess|null);
                    }

                    /** Represents an ExportLogsServiceResponse. */
                    class ExportLogsServiceResponse implements IExportLogsServiceResponse {

                        /**
                         * Constructs a new ExportLogsServiceResponse.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.logs.v1.IExportLogsServiceResponse);

                        /** ExportLogsServiceResponse partialSuccess. */
                        public partialSuccess?: (opentelemetry.proto.collector.logs.v1.IExportLogsPartialSuccess|null);

                        /**
                         * Decodes an ExportLogsServiceResponse message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportLogsServiceResponse
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;

                        /**
                         * Creates an ExportLogsServiceResponse message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportLogsServiceResponse
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;

                        /**
                         * Creates a plain object from an ExportLogsServiceResponse message. Also converts values to other types if specified.
                         * @param message ExportLogsServiceResponse
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportLogsServiceResponse to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportLogsServiceResponse
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of an ExportLogsPartialSuccess. */
                    interface IExportLogsPartialSuccess {

                        /** ExportLogsPartialSuccess rejectedLogRecords */
                        rejectedLogRecords?: (number|Long|null);

                        /** ExportLogsPartialSuccess errorMessage */
                        errorMessage?: (string|null);
                    }

                    /** Represents an ExportLogsPartialSuccess. */
                    class ExportLogsPartialSuccess implements IExportLogsPartialSuccess {

                        /**
                         * Constructs a new ExportLogsPartialSuccess.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.logs.v1.IExportLogsPartialSuccess);

                        /** ExportLogsPartialSuccess rejectedLogRecords. */
                        public rejectedLogRecords: (number|Long);

                        /** ExportLogsPartialSuccess errorMessage. */
                        public errorMessage: string;

                        /**
                         * Decodes an ExportLogsPartialSuccess message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportLogsPartialSuccess
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;

                        /**
                         * Creates an ExportLogsPartialSuccess message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportLogsPartialSuccess
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess;

                        /**
                         * Creates a plain object from an ExportLogsPartialSuccess message. Also converts values to other types if specified.
                         * @param message ExportLogsPartialSuccess
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportLogsPartialSuccess to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportLogsPartialSuccess
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }

            /** Namespace metrics. */
            namespace metrics {

                /** Namespace v1. */
                namespace v1 {

                    /** Properties of an ExportMetricsServiceRequest. */
                    interface IExportMetricsServiceRequest {

                        /** ExportMetricsServiceRequest resourceMetrics */
                        resourceMetrics?: (opentelemetry.proto.metrics.v1.IResourceMetrics[]|null);
                    }

                    /** Represents an ExportMetricsServiceRequest. */
                    class ExportMetricsServiceRequest implements IExportMetricsServiceRequest {

                        /**
                         * Constructs a new ExportMetricsServiceRequest.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.metrics.v1.IExportMetricsServiceRequest);

                        /** ExportMetricsServiceRequest resourceMetrics. */
                        public resourceMetrics: opentelemetry.proto.metrics.v1.IResourceMetrics[];

                        /**
                         * Decodes an ExportMetricsServiceRequest message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportMetricsServiceRequest
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;

                        /**
                         * Creates an ExportMetricsServiceRequest message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportMetricsServiceRequest
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;

                        /**
                         * Creates a plain object from an ExportMetricsServiceRequest message. Also converts values to other types if specified.
                         * @param message ExportMetricsServiceRequest
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportMetricsServiceRequest to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportMetricsServiceRequest
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of an ExportMetricsServiceResponse. */
                    interface IExportMetricsServiceResponse {

                        /** ExportMetricsServiceResponse partialSuccess */
                        partialSuccess?: (opentelemetry.proto.collector.metrics.v1.IExportMetricsPartialSuccess|null);
                    }

                    /** Represents an ExportMetricsServiceResponse. */
                    class ExportMetricsServiceResponse implements IExportMetricsServiceResponse {

                        /**
                         * Constructs a new ExportMetricsServiceResponse.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.metrics.v1.IExportMetricsServiceResponse);

                        /** ExportMetricsServiceResponse partialSuccess. */
                        public partialSuccess?: (opentelemetry.proto.collector.metrics.v1.IExportMetricsPartialSuccess|null);

                        /**
                         * Decodes an ExportMetricsServiceResponse message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportMetricsServiceResponse
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;

                        /**
                         * Creates an ExportMetricsServiceResponse message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportMetricsServiceResponse
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;

                        /**
                         * Creates a plain object from an ExportMetricsServiceResponse message. Also converts values to other types if specified.
                         * @param message ExportMetricsServiceResponse
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportMetricsServiceResponse to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportMetricsServiceResponse
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of an ExportMetricsPartialSuccess. */
                    interface IExportMetricsPartialSuccess {

                        /** ExportMetricsPartialSuccess rejectedDataPoints */
                        rejectedDataPoints?: (number|Long|null);

                        /** ExportMetricsPartialSuccess errorMessage */
                        errorMessage?: (string|null);
                    }

                    /** Represents an ExportMetricsPartialSuccess. */
                    class ExportMetricsPartialSuccess implements IExportMetricsPartialSuccess {

                        /**
                         * Constructs a new ExportMetricsPartialSuccess.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.collector.metrics.v1.IExportMetricsPartialSuccess);

                        /** ExportMetricsPartialSuccess rejectedDataPoints. */
                        public rejectedDataPoints: (number|Long);

                        /** ExportMetricsPartialSuccess errorMessage. */
                        public errorMessage: string;

                        /**
                         * Decodes an ExportMetricsPartialSuccess message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportMetricsPartialSuccess
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;

                        /**
                         * Creates an ExportMetricsPartialSuccess message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportMetricsPartialSuccess
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess;

                        /**
                         * Creates a plain object from an ExportMetricsPartialSuccess message. Also converts values to other types if specified.
                         * @param message ExportMetricsPartialSuccess
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportMetricsPartialSuccess to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportMetricsPartialSuccess
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }
        }

        /** Namespace trace. */
        namespace trace {

            /** Namespace v1. */
            namespace v1 {

                /** Properties of a TracesData. */
                interface ITracesData {

                    /** TracesData resourceSpans */
                    resourceSpans?: (opentelemetry.proto.trace.v1.IResourceSpans[]|null);
                }

                /** Represents a TracesData. */
                class TracesData implements ITracesData {

                    /**
                     * Constructs a new TracesData.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.trace.v1.ITracesData);

                    /** TracesData resourceSpans. */
                    public resourceSpans: opentelemetry.proto.trace.v1.IResourceSpans[];

                    /**
                     * Decodes a TracesData message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TracesData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.TracesData;

                    /**
                     * Creates a TracesData message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TracesData
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.TracesData;

                    /**
                     * Creates a plain object from a TracesData message. Also converts values to other types if specified.
                     * @param message TracesData
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.trace.v1.TracesData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TracesData to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TracesData
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ResourceSpans. */
                interface IResourceSpans {

                    /** ResourceSpans resource */
                    resource?: (opentelemetry.proto.resource.v1.IResource|null);

                    /** ResourceSpans scopeSpans */
                    scopeSpans?: (opentelemetry.proto.trace.v1.IScopeSpans[]|null);

                    /** ResourceSpans schemaUrl */
                    schemaUrl?: (string|null);
                }

                /** Represents a ResourceSpans. */
                class ResourceSpans implements IResourceSpans {

                    /**
                     * Constructs a new ResourceSpans.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.trace.v1.IResourceSpans);

                    /** ResourceSpans resource. */
                    public resource?: (opentelemetry.proto.resource.v1.IResource|null);

                    /** ResourceSpans scopeSpans. */
                    public scopeSpans: opentelemetry.proto.trace.v1.IScopeSpans[];

                    /** ResourceSpans schemaUrl. */
                    public schemaUrl: string;

                    /**
                     * Decodes a ResourceSpans message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ResourceSpans
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.ResourceSpans;

                    /**
                     * Creates a ResourceSpans message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ResourceSpans
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.ResourceSpans;

                    /**
                     * Creates a plain object from a ResourceSpans message. Also converts values to other types if specified.
                     * @param message ResourceSpans
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.trace.v1.ResourceSpans, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ResourceSpans to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ResourceSpans
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ScopeSpans. */
                interface IScopeSpans {

                    /** ScopeSpans scope */
                    scope?: (opentelemetry.proto.common.v1.IInstrumentationScope|null);

                    /** ScopeSpans spans */
                    spans?: (opentelemetry.proto.trace.v1.ISpan[]|null);

                    /** ScopeSpans schemaUrl */
                    schemaUrl?: (string|null);
                }

                /** Represents a ScopeSpans. */
                class ScopeSpans implements IScopeSpans {

                    /**
                     * Constructs a new ScopeSpans.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.trace.v1.IScopeSpans);

                    /** ScopeSpans scope. */
                    public scope?: (opentelemetry.proto.common.v1.IInstrumentationScope|null);

                    /** ScopeSpans spans. */
                    public spans: opentelemetry.proto.trace.v1.ISpan[];

                    /** ScopeSpans schemaUrl. */
                    public schemaUrl: string;

                    /**
                     * Decodes a ScopeSpans message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ScopeSpans
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.ScopeSpans;

                    /**
                     * Creates a ScopeSpans message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ScopeSpans
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.ScopeSpans;

                    /**
                     * Creates a plain object from a ScopeSpans message. Also converts values to other types if specified.
                     * @param message ScopeSpans
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.trace.v1.ScopeSpans, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ScopeSpans to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ScopeSpans
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Span. */
                interface ISpan {

                    /** Span traceId */
                    traceId?: (Uint8Array|null);

                    /** Span spanId */
                    spanId?: (Uint8Array|null);

                    /** Span traceState */
                    traceState?: (string|null);

                    /** Span parentSpanId */
                    parentSpanId?: (Uint8Array|null);

                    /** Span flags */
                    flags?: (number|null);

                    /** Span name */
                    name?: (string|null);

                    /** Span kind */
                    kind?: (opentelemetry.proto.trace.v1.Span.SpanKind|null);

                    /** Span startTimeUnixNano */
                    startTimeUnixNano?: (number|Long|null);

                    /** Span endTimeUnixNano */
                    endTimeUnixNano?: (number|Long|null);

                    /** Span attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** Span droppedAttributesCount */
                    droppedAttributesCount?: (number|null);

                    /** Span events */
                    events?: (opentelemetry.proto.trace.v1.Span.IEvent[]|null);

                    /** Span droppedEventsCount */
                    droppedEventsCount?: (number|null);

                    /** Span links */
                    links?: (opentelemetry.proto.trace.v1.Span.ILink[]|null);

                    /** Span droppedLinksCount */
                    droppedLinksCount?: (number|null);

                    /** Span status */
                    status?: (opentelemetry.proto.trace.v1.IStatus|null);
                }

                /** Represents a Span. */
                class Span implements ISpan {

                    /**
                     * Constructs a new Span.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.trace.v1.ISpan);

                    /** Span traceId. */
                    public traceId: Uint8Array;

                    /** Span spanId. */
                    public spanId: Uint8Array;

                    /** Span traceState. */
                    public traceState: string;

                    /** Span parentSpanId. */
                    public parentSpanId: Uint8Array;

                    /** Span flags. */
                    public flags: number;

                    /** Span name. */
                    public name: string;

                    /** Span kind. */
                    public kind: opentelemetry.proto.trace.v1.Span.SpanKind;

                    /** Span startTimeUnixNano. */
                    public startTimeUnixNano: (number|Long);

                    /** Span endTimeUnixNano. */
                    public endTimeUnixNano: (number|Long);

                    /** Span attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** Span droppedAttributesCount. */
                    public droppedAttributesCount: number;

                    /** Span events. */
                    public events: opentelemetry.proto.trace.v1.Span.IEvent[];

                    /** Span droppedEventsCount. */
                    public droppedEventsCount: number;

                    /** Span links. */
                    public links: opentelemetry.proto.trace.v1.Span.ILink[];

                    /** Span droppedLinksCount. */
                    public droppedLinksCount: number;

                    /** Span status. */
                    public status?: (opentelemetry.proto.trace.v1.IStatus|null);

                    /**
                     * Decodes a Span message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Span
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.Span;

                    /**
                     * Creates a Span message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Span
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.Span;

                    /**
                     * Creates a plain object from a Span message. Also converts values to other types if specified.
                     * @param message Span
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.trace.v1.Span, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Span to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Span
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace Span {

                    /** SpanKind enum. */
                    enum SpanKind {
                        SPAN_KIND_UNSPECIFIED = 0,
                        SPAN_KIND_INTERNAL = 1,
                        SPAN_KIND_SERVER = 2,
                        SPAN_KIND_CLIENT = 3,
                        SPAN_KIND_PRODUCER = 4,
                        SPAN_KIND_CONSUMER = 5
                    }

                    /** Properties of an Event. */
                    interface IEvent {

                        /** Event timeUnixNano */
                        timeUnixNano?: (number|Long|null);

                        /** Event name */
                        name?: (string|null);

                        /** Event attributes */
                        attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                        /** Event droppedAttributesCount */
                        droppedAttributesCount?: (number|null);
                    }

                    /** Represents an Event. */
                    class Event implements IEvent {

                        /**
                         * Constructs a new Event.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.trace.v1.Span.IEvent);

                        /** Event timeUnixNano. */
                        public timeUnixNano: (number|Long);

                        /** Event name. */
                        public name: string;

                        /** Event attributes. */
                        public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                        /** Event droppedAttributesCount. */
                        public droppedAttributesCount: number;

                        /**
                         * Decodes an Event message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns Event
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.Span.Event;

                        /**
                         * Creates an Event message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns Event
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.Span.Event;

                        /**
                         * Creates a plain object from an Event message. Also converts values to other types if specified.
                         * @param message Event
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.trace.v1.Span.Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this Event to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for Event
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of a Link. */
                    interface ILink {

                        /** Link traceId */
                        traceId?: (Uint8Array|null);

                        /** Link spanId */
                        spanId?: (Uint8Array|null);

                        /** Link traceState */
                        traceState?: (string|null);

                        /** Link attributes */
                        attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                        /** Link droppedAttributesCount */
                        droppedAttributesCount?: (number|null);

                        /** Link flags */
                        flags?: (number|null);
                    }

                    /** Represents a Link. */
                    class Link implements ILink {

                        /**
                         * Constructs a new Link.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.trace.v1.Span.ILink);

                        /** Link traceId. */
                        public traceId: Uint8Array;

                        /** Link spanId. */
                        public spanId: Uint8Array;

                        /** Link traceState. */
                        public traceState: string;

                        /** Link attributes. */
                        public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                        /** Link droppedAttributesCount. */
                        public droppedAttributesCount: number;

                        /** Link flags. */
                        public flags: number;

                        /**
                         * Decodes a Link message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns Link
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.Span.Link;

                        /**
                         * Creates a Link message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns Link
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.Span.Link;

                        /**
                         * Creates a plain object from a Link message. Also converts values to other types if specified.
                         * @param message Link
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.trace.v1.Span.Link, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this Link to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for Link
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }

                /** Properties of a Status. */
                interface IStatus {

                    /** Status message */
                    message?: (string|null);

                    /** Status code */
                    code?: (opentelemetry.proto.trace.v1.Status.StatusCode|null);
                }

                /** Represents a Status. */
                class Status implements IStatus {

                    /**
                     * Constructs a new Status.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.trace.v1.IStatus);

                    /** Status message. */
                    public message: string;

                    /** Status code. */
                    public code: opentelemetry.proto.trace.v1.Status.StatusCode;

                    /**
                     * Decodes a Status message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Status
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.trace.v1.Status;

                    /**
                     * Creates a Status message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Status
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.trace.v1.Status;

                    /**
                     * Creates a plain object from a Status message. Also converts values to other types if specified.
                     * @param message Status
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.trace.v1.Status, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Status to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Status
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace Status {

                    /** StatusCode enum. */
                    enum StatusCode {
                        STATUS_CODE_UNSET = 0,
                        STATUS_CODE_OK = 1,
                        STATUS_CODE_ERROR = 2
                    }
                }

                /** SpanFlags enum. */
                enum SpanFlags {
                    SPAN_FLAGS_DO_NOT_USE = 0,
                    SPAN_FLAGS_TRACE_FLAGS_MASK = 255,
                    SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK = 256,
                    SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK = 512
                }
            }
        }

        /** Namespace common. */
        namespace common {

            /** Namespace v1. */
            namespace v1 {

                /** Properties of an AnyValue. */
                interface IAnyValue {

                    /** AnyValue stringValue */
                    stringValue?: (string|null);

                    /** AnyValue boolValue */
                    boolValue?: (boolean|null);

                    /** AnyValue intValue */
                    intValue?: (number|Long|null);

                    /** AnyValue doubleValue */
                    doubleValue?: (number|null);

                    /** AnyValue arrayValue */
                    arrayValue?: (opentelemetry.proto.common.v1.IArrayValue|null);

                    /** AnyValue kvlistValue */
                    kvlistValue?: (opentelemetry.proto.common.v1.IKeyValueList|null);

                    /** AnyValue bytesValue */
                    bytesValue?: (Uint8Array|null);

                    /** AnyValue stringValueStrindex */
                    stringValueStrindex?: (number|null);
                }

                /** Represents an AnyValue. */
                class AnyValue implements IAnyValue {

                    /**
                     * Constructs a new AnyValue.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.common.v1.IAnyValue);

                    /** AnyValue stringValue. */
                    public stringValue?: (string|null);

                    /** AnyValue boolValue. */
                    public boolValue?: (boolean|null);

                    /** AnyValue intValue. */
                    public intValue?: (number|Long|null);

                    /** AnyValue doubleValue. */
                    public doubleValue?: (number|null);

                    /** AnyValue arrayValue. */
                    public arrayValue?: (opentelemetry.proto.common.v1.IArrayValue|null);

                    /** AnyValue kvlistValue. */
                    public kvlistValue?: (opentelemetry.proto.common.v1.IKeyValueList|null);

                    /** AnyValue bytesValue. */
                    public bytesValue?: (Uint8Array|null);

                    /** AnyValue stringValueStrindex. */
                    public stringValueStrindex?: (number|null);

                    /** AnyValue value. */
                    public value?: ("stringValue"|"boolValue"|"intValue"|"doubleValue"|"arrayValue"|"kvlistValue"|"bytesValue"|"stringValueStrindex");

                    /**
                     * Decodes an AnyValue message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AnyValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.common.v1.AnyValue;

                    /**
                     * Creates an AnyValue message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AnyValue
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.common.v1.AnyValue;

                    /**
                     * Creates a plain object from an AnyValue message. Also converts values to other types if specified.
                     * @param message AnyValue
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.common.v1.AnyValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AnyValue to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for AnyValue
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an ArrayValue. */
                interface IArrayValue {

                    /** ArrayValue values */
                    values?: (opentelemetry.proto.common.v1.IAnyValue[]|null);
                }

                /** Represents an ArrayValue. */
                class ArrayValue implements IArrayValue {

                    /**
                     * Constructs a new ArrayValue.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.common.v1.IArrayValue);

                    /** ArrayValue values. */
                    public values: opentelemetry.proto.common.v1.IAnyValue[];

                    /**
                     * Decodes an ArrayValue message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ArrayValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.common.v1.ArrayValue;

                    /**
                     * Creates an ArrayValue message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ArrayValue
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.common.v1.ArrayValue;

                    /**
                     * Creates a plain object from an ArrayValue message. Also converts values to other types if specified.
                     * @param message ArrayValue
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.common.v1.ArrayValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ArrayValue to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ArrayValue
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a KeyValueList. */
                interface IKeyValueList {

                    /** KeyValueList values */
                    values?: (opentelemetry.proto.common.v1.IKeyValue[]|null);
                }

                /** Represents a KeyValueList. */
                class KeyValueList implements IKeyValueList {

                    /**
                     * Constructs a new KeyValueList.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.common.v1.IKeyValueList);

                    /** KeyValueList values. */
                    public values: opentelemetry.proto.common.v1.IKeyValue[];

                    /**
                     * Decodes a KeyValueList message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns KeyValueList
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.common.v1.KeyValueList;

                    /**
                     * Creates a KeyValueList message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns KeyValueList
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.common.v1.KeyValueList;

                    /**
                     * Creates a plain object from a KeyValueList message. Also converts values to other types if specified.
                     * @param message KeyValueList
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.common.v1.KeyValueList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this KeyValueList to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for KeyValueList
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a KeyValue. */
                interface IKeyValue {

                    /** KeyValue key */
                    key?: (string|null);

                    /** KeyValue value */
                    value?: (opentelemetry.proto.common.v1.IAnyValue|null);

                    /** KeyValue keyStrindex */
                    keyStrindex?: (number|null);
                }

                /** Represents a KeyValue. */
                class KeyValue implements IKeyValue {

                    /**
                     * Constructs a new KeyValue.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.common.v1.IKeyValue);

                    /** KeyValue key. */
                    public key: string;

                    /** KeyValue value. */
                    public value?: (opentelemetry.proto.common.v1.IAnyValue|null);

                    /** KeyValue keyStrindex. */
                    public keyStrindex: number;

                    /**
                     * Decodes a KeyValue message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns KeyValue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.common.v1.KeyValue;

                    /**
                     * Creates a KeyValue message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns KeyValue
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.common.v1.KeyValue;

                    /**
                     * Creates a plain object from a KeyValue message. Also converts values to other types if specified.
                     * @param message KeyValue
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.common.v1.KeyValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this KeyValue to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for KeyValue
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an InstrumentationScope. */
                interface IInstrumentationScope {

                    /** InstrumentationScope name */
                    name?: (string|null);

                    /** InstrumentationScope version */
                    version?: (string|null);

                    /** InstrumentationScope attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** InstrumentationScope droppedAttributesCount */
                    droppedAttributesCount?: (number|null);
                }

                /** Represents an InstrumentationScope. */
                class InstrumentationScope implements IInstrumentationScope {

                    /**
                     * Constructs a new InstrumentationScope.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.common.v1.IInstrumentationScope);

                    /** InstrumentationScope name. */
                    public name: string;

                    /** InstrumentationScope version. */
                    public version: string;

                    /** InstrumentationScope attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** InstrumentationScope droppedAttributesCount. */
                    public droppedAttributesCount: number;

                    /**
                     * Decodes an InstrumentationScope message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InstrumentationScope
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.common.v1.InstrumentationScope;

                    /**
                     * Creates an InstrumentationScope message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InstrumentationScope
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.common.v1.InstrumentationScope;

                    /**
                     * Creates a plain object from an InstrumentationScope message. Also converts values to other types if specified.
                     * @param message InstrumentationScope
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.common.v1.InstrumentationScope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InstrumentationScope to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for InstrumentationScope
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an EntityRef. */
                interface IEntityRef {

                    /** EntityRef schemaUrl */
                    schemaUrl?: (string|null);

                    /** EntityRef type */
                    type?: (string|null);

                    /** EntityRef idKeys */
                    idKeys?: (string[]|null);

                    /** EntityRef descriptionKeys */
                    descriptionKeys?: (string[]|null);
                }

                /** Represents an EntityRef. */
                class EntityRef implements IEntityRef {

                    /**
                     * Constructs a new EntityRef.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.common.v1.IEntityRef);

                    /** EntityRef schemaUrl. */
                    public schemaUrl: string;

                    /** EntityRef type. */
                    public type: string;

                    /** EntityRef idKeys. */
                    public idKeys: string[];

                    /** EntityRef descriptionKeys. */
                    public descriptionKeys: string[];

                    /**
                     * Decodes an EntityRef message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EntityRef
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.common.v1.EntityRef;

                    /**
                     * Creates an EntityRef message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EntityRef
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.common.v1.EntityRef;

                    /**
                     * Creates a plain object from an EntityRef message. Also converts values to other types if specified.
                     * @param message EntityRef
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.common.v1.EntityRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EntityRef to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for EntityRef
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }

        /** Namespace resource. */
        namespace resource {

            /** Namespace v1. */
            namespace v1 {

                /** Properties of a Resource. */
                interface IResource {

                    /** Resource attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** Resource droppedAttributesCount */
                    droppedAttributesCount?: (number|null);

                    /** Resource entityRefs */
                    entityRefs?: (opentelemetry.proto.common.v1.IEntityRef[]|null);
                }

                /** Represents a Resource. */
                class Resource implements IResource {

                    /**
                     * Constructs a new Resource.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.resource.v1.IResource);

                    /** Resource attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** Resource droppedAttributesCount. */
                    public droppedAttributesCount: number;

                    /** Resource entityRefs. */
                    public entityRefs: opentelemetry.proto.common.v1.IEntityRef[];

                    /**
                     * Decodes a Resource message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Resource
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.resource.v1.Resource;

                    /**
                     * Creates a Resource message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Resource
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.resource.v1.Resource;

                    /**
                     * Creates a plain object from a Resource message. Also converts values to other types if specified.
                     * @param message Resource
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.resource.v1.Resource, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Resource to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Resource
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }

        /** Namespace logs. */
        namespace logs {

            /** Namespace v1. */
            namespace v1 {

                /** Properties of a LogsData. */
                interface ILogsData {

                    /** LogsData resourceLogs */
                    resourceLogs?: (opentelemetry.proto.logs.v1.IResourceLogs[]|null);
                }

                /** Represents a LogsData. */
                class LogsData implements ILogsData {

                    /**
                     * Constructs a new LogsData.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.logs.v1.ILogsData);

                    /** LogsData resourceLogs. */
                    public resourceLogs: opentelemetry.proto.logs.v1.IResourceLogs[];

                    /**
                     * Decodes a LogsData message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LogsData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.logs.v1.LogsData;

                    /**
                     * Creates a LogsData message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LogsData
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.logs.v1.LogsData;

                    /**
                     * Creates a plain object from a LogsData message. Also converts values to other types if specified.
                     * @param message LogsData
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.logs.v1.LogsData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LogsData to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LogsData
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ResourceLogs. */
                interface IResourceLogs {

                    /** ResourceLogs resource */
                    resource?: (opentelemetry.proto.resource.v1.IResource|null);

                    /** ResourceLogs scopeLogs */
                    scopeLogs?: (opentelemetry.proto.logs.v1.IScopeLogs[]|null);

                    /** ResourceLogs schemaUrl */
                    schemaUrl?: (string|null);
                }

                /** Represents a ResourceLogs. */
                class ResourceLogs implements IResourceLogs {

                    /**
                     * Constructs a new ResourceLogs.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.logs.v1.IResourceLogs);

                    /** ResourceLogs resource. */
                    public resource?: (opentelemetry.proto.resource.v1.IResource|null);

                    /** ResourceLogs scopeLogs. */
                    public scopeLogs: opentelemetry.proto.logs.v1.IScopeLogs[];

                    /** ResourceLogs schemaUrl. */
                    public schemaUrl: string;

                    /**
                     * Decodes a ResourceLogs message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ResourceLogs
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.logs.v1.ResourceLogs;

                    /**
                     * Creates a ResourceLogs message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ResourceLogs
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.logs.v1.ResourceLogs;

                    /**
                     * Creates a plain object from a ResourceLogs message. Also converts values to other types if specified.
                     * @param message ResourceLogs
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.logs.v1.ResourceLogs, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ResourceLogs to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ResourceLogs
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ScopeLogs. */
                interface IScopeLogs {

                    /** ScopeLogs scope */
                    scope?: (opentelemetry.proto.common.v1.IInstrumentationScope|null);

                    /** ScopeLogs logRecords */
                    logRecords?: (opentelemetry.proto.logs.v1.ILogRecord[]|null);

                    /** ScopeLogs schemaUrl */
                    schemaUrl?: (string|null);
                }

                /** Represents a ScopeLogs. */
                class ScopeLogs implements IScopeLogs {

                    /**
                     * Constructs a new ScopeLogs.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.logs.v1.IScopeLogs);

                    /** ScopeLogs scope. */
                    public scope?: (opentelemetry.proto.common.v1.IInstrumentationScope|null);

                    /** ScopeLogs logRecords. */
                    public logRecords: opentelemetry.proto.logs.v1.ILogRecord[];

                    /** ScopeLogs schemaUrl. */
                    public schemaUrl: string;

                    /**
                     * Decodes a ScopeLogs message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ScopeLogs
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.logs.v1.ScopeLogs;

                    /**
                     * Creates a ScopeLogs message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ScopeLogs
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.logs.v1.ScopeLogs;

                    /**
                     * Creates a plain object from a ScopeLogs message. Also converts values to other types if specified.
                     * @param message ScopeLogs
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.logs.v1.ScopeLogs, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ScopeLogs to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ScopeLogs
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** SeverityNumber enum. */
                enum SeverityNumber {
                    SEVERITY_NUMBER_UNSPECIFIED = 0,
                    SEVERITY_NUMBER_TRACE = 1,
                    SEVERITY_NUMBER_TRACE2 = 2,
                    SEVERITY_NUMBER_TRACE3 = 3,
                    SEVERITY_NUMBER_TRACE4 = 4,
                    SEVERITY_NUMBER_DEBUG = 5,
                    SEVERITY_NUMBER_DEBUG2 = 6,
                    SEVERITY_NUMBER_DEBUG3 = 7,
                    SEVERITY_NUMBER_DEBUG4 = 8,
                    SEVERITY_NUMBER_INFO = 9,
                    SEVERITY_NUMBER_INFO2 = 10,
                    SEVERITY_NUMBER_INFO3 = 11,
                    SEVERITY_NUMBER_INFO4 = 12,
                    SEVERITY_NUMBER_WARN = 13,
                    SEVERITY_NUMBER_WARN2 = 14,
                    SEVERITY_NUMBER_WARN3 = 15,
                    SEVERITY_NUMBER_WARN4 = 16,
                    SEVERITY_NUMBER_ERROR = 17,
                    SEVERITY_NUMBER_ERROR2 = 18,
                    SEVERITY_NUMBER_ERROR3 = 19,
                    SEVERITY_NUMBER_ERROR4 = 20,
                    SEVERITY_NUMBER_FATAL = 21,
                    SEVERITY_NUMBER_FATAL2 = 22,
                    SEVERITY_NUMBER_FATAL3 = 23,
                    SEVERITY_NUMBER_FATAL4 = 24
                }

                /** LogRecordFlags enum. */
                enum LogRecordFlags {
                    LOG_RECORD_FLAGS_DO_NOT_USE = 0,
                    LOG_RECORD_FLAGS_TRACE_FLAGS_MASK = 255
                }

                /** Properties of a LogRecord. */
                interface ILogRecord {

                    /** LogRecord timeUnixNano */
                    timeUnixNano?: (number|Long|null);

                    /** LogRecord observedTimeUnixNano */
                    observedTimeUnixNano?: (number|Long|null);

                    /** LogRecord severityNumber */
                    severityNumber?: (opentelemetry.proto.logs.v1.SeverityNumber|null);

                    /** LogRecord severityText */
                    severityText?: (string|null);

                    /** LogRecord body */
                    body?: (opentelemetry.proto.common.v1.IAnyValue|null);

                    /** LogRecord attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** LogRecord droppedAttributesCount */
                    droppedAttributesCount?: (number|null);

                    /** LogRecord flags */
                    flags?: (number|null);

                    /** LogRecord traceId */
                    traceId?: (Uint8Array|null);

                    /** LogRecord spanId */
                    spanId?: (Uint8Array|null);

                    /** LogRecord eventName */
                    eventName?: (string|null);
                }

                /** Represents a LogRecord. */
                class LogRecord implements ILogRecord {

                    /**
                     * Constructs a new LogRecord.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.logs.v1.ILogRecord);

                    /** LogRecord timeUnixNano. */
                    public timeUnixNano: (number|Long);

                    /** LogRecord observedTimeUnixNano. */
                    public observedTimeUnixNano: (number|Long);

                    /** LogRecord severityNumber. */
                    public severityNumber: opentelemetry.proto.logs.v1.SeverityNumber;

                    /** LogRecord severityText. */
                    public severityText: string;

                    /** LogRecord body. */
                    public body?: (opentelemetry.proto.common.v1.IAnyValue|null);

                    /** LogRecord attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** LogRecord droppedAttributesCount. */
                    public droppedAttributesCount: number;

                    /** LogRecord flags. */
                    public flags: number;

                    /** LogRecord traceId. */
                    public traceId: Uint8Array;

                    /** LogRecord spanId. */
                    public spanId: Uint8Array;

                    /** LogRecord eventName. */
                    public eventName: string;

                    /**
                     * Decodes a LogRecord message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LogRecord
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.logs.v1.LogRecord;

                    /**
                     * Creates a LogRecord message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LogRecord
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.logs.v1.LogRecord;

                    /**
                     * Creates a plain object from a LogRecord message. Also converts values to other types if specified.
                     * @param message LogRecord
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.logs.v1.LogRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LogRecord to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LogRecord
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }

        /** Namespace metrics. */
        namespace metrics {

            /** Namespace v1. */
            namespace v1 {

                /** Properties of a MetricsData. */
                interface IMetricsData {

                    /** MetricsData resourceMetrics */
                    resourceMetrics?: (opentelemetry.proto.metrics.v1.IResourceMetrics[]|null);
                }

                /** Represents a MetricsData. */
                class MetricsData implements IMetricsData {

                    /**
                     * Constructs a new MetricsData.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IMetricsData);

                    /** MetricsData resourceMetrics. */
                    public resourceMetrics: opentelemetry.proto.metrics.v1.IResourceMetrics[];

                    /**
                     * Decodes a MetricsData message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MetricsData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.MetricsData;

                    /**
                     * Creates a MetricsData message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MetricsData
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.MetricsData;

                    /**
                     * Creates a plain object from a MetricsData message. Also converts values to other types if specified.
                     * @param message MetricsData
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.MetricsData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MetricsData to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MetricsData
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ResourceMetrics. */
                interface IResourceMetrics {

                    /** ResourceMetrics resource */
                    resource?: (opentelemetry.proto.resource.v1.IResource|null);

                    /** ResourceMetrics scopeMetrics */
                    scopeMetrics?: (opentelemetry.proto.metrics.v1.IScopeMetrics[]|null);

                    /** ResourceMetrics schemaUrl */
                    schemaUrl?: (string|null);
                }

                /** Represents a ResourceMetrics. */
                class ResourceMetrics implements IResourceMetrics {

                    /**
                     * Constructs a new ResourceMetrics.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IResourceMetrics);

                    /** ResourceMetrics resource. */
                    public resource?: (opentelemetry.proto.resource.v1.IResource|null);

                    /** ResourceMetrics scopeMetrics. */
                    public scopeMetrics: opentelemetry.proto.metrics.v1.IScopeMetrics[];

                    /** ResourceMetrics schemaUrl. */
                    public schemaUrl: string;

                    /**
                     * Decodes a ResourceMetrics message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ResourceMetrics
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.ResourceMetrics;

                    /**
                     * Creates a ResourceMetrics message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ResourceMetrics
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.ResourceMetrics;

                    /**
                     * Creates a plain object from a ResourceMetrics message. Also converts values to other types if specified.
                     * @param message ResourceMetrics
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.ResourceMetrics, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ResourceMetrics to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ResourceMetrics
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ScopeMetrics. */
                interface IScopeMetrics {

                    /** ScopeMetrics scope */
                    scope?: (opentelemetry.proto.common.v1.IInstrumentationScope|null);

                    /** ScopeMetrics metrics */
                    metrics?: (opentelemetry.proto.metrics.v1.IMetric[]|null);

                    /** ScopeMetrics schemaUrl */
                    schemaUrl?: (string|null);
                }

                /** Represents a ScopeMetrics. */
                class ScopeMetrics implements IScopeMetrics {

                    /**
                     * Constructs a new ScopeMetrics.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IScopeMetrics);

                    /** ScopeMetrics scope. */
                    public scope?: (opentelemetry.proto.common.v1.IInstrumentationScope|null);

                    /** ScopeMetrics metrics. */
                    public metrics: opentelemetry.proto.metrics.v1.IMetric[];

                    /** ScopeMetrics schemaUrl. */
                    public schemaUrl: string;

                    /**
                     * Decodes a ScopeMetrics message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ScopeMetrics
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.ScopeMetrics;

                    /**
                     * Creates a ScopeMetrics message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ScopeMetrics
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.ScopeMetrics;

                    /**
                     * Creates a plain object from a ScopeMetrics message. Also converts values to other types if specified.
                     * @param message ScopeMetrics
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.ScopeMetrics, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ScopeMetrics to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ScopeMetrics
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Metric. */
                interface IMetric {

                    /** Metric name */
                    name?: (string|null);

                    /** Metric description */
                    description?: (string|null);

                    /** Metric unit */
                    unit?: (string|null);

                    /** Metric gauge */
                    gauge?: (opentelemetry.proto.metrics.v1.IGauge|null);

                    /** Metric sum */
                    sum?: (opentelemetry.proto.metrics.v1.ISum|null);

                    /** Metric histogram */
                    histogram?: (opentelemetry.proto.metrics.v1.IHistogram|null);

                    /** Metric exponentialHistogram */
                    exponentialHistogram?: (opentelemetry.proto.metrics.v1.IExponentialHistogram|null);

                    /** Metric summary */
                    summary?: (opentelemetry.proto.metrics.v1.ISummary|null);

                    /** Metric metadata */
                    metadata?: (opentelemetry.proto.common.v1.IKeyValue[]|null);
                }

                /** Represents a Metric. */
                class Metric implements IMetric {

                    /**
                     * Constructs a new Metric.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IMetric);

                    /** Metric name. */
                    public name: string;

                    /** Metric description. */
                    public description: string;

                    /** Metric unit. */
                    public unit: string;

                    /** Metric gauge. */
                    public gauge?: (opentelemetry.proto.metrics.v1.IGauge|null);

                    /** Metric sum. */
                    public sum?: (opentelemetry.proto.metrics.v1.ISum|null);

                    /** Metric histogram. */
                    public histogram?: (opentelemetry.proto.metrics.v1.IHistogram|null);

                    /** Metric exponentialHistogram. */
                    public exponentialHistogram?: (opentelemetry.proto.metrics.v1.IExponentialHistogram|null);

                    /** Metric summary. */
                    public summary?: (opentelemetry.proto.metrics.v1.ISummary|null);

                    /** Metric metadata. */
                    public metadata: opentelemetry.proto.common.v1.IKeyValue[];

                    /** Metric data. */
                    public data?: ("gauge"|"sum"|"histogram"|"exponentialHistogram"|"summary");

                    /**
                     * Decodes a Metric message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Metric
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.Metric;

                    /**
                     * Creates a Metric message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Metric
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.Metric;

                    /**
                     * Creates a plain object from a Metric message. Also converts values to other types if specified.
                     * @param message Metric
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.Metric, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Metric to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Metric
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Gauge. */
                interface IGauge {

                    /** Gauge dataPoints */
                    dataPoints?: (opentelemetry.proto.metrics.v1.INumberDataPoint[]|null);
                }

                /** Represents a Gauge. */
                class Gauge implements IGauge {

                    /**
                     * Constructs a new Gauge.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IGauge);

                    /** Gauge dataPoints. */
                    public dataPoints: opentelemetry.proto.metrics.v1.INumberDataPoint[];

                    /**
                     * Decodes a Gauge message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Gauge
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.Gauge;

                    /**
                     * Creates a Gauge message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Gauge
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.Gauge;

                    /**
                     * Creates a plain object from a Gauge message. Also converts values to other types if specified.
                     * @param message Gauge
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.Gauge, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Gauge to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Gauge
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Sum. */
                interface ISum {

                    /** Sum dataPoints */
                    dataPoints?: (opentelemetry.proto.metrics.v1.INumberDataPoint[]|null);

                    /** Sum aggregationTemporality */
                    aggregationTemporality?: (opentelemetry.proto.metrics.v1.AggregationTemporality|null);

                    /** Sum isMonotonic */
                    isMonotonic?: (boolean|null);
                }

                /** Represents a Sum. */
                class Sum implements ISum {

                    /**
                     * Constructs a new Sum.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.ISum);

                    /** Sum dataPoints. */
                    public dataPoints: opentelemetry.proto.metrics.v1.INumberDataPoint[];

                    /** Sum aggregationTemporality. */
                    public aggregationTemporality: opentelemetry.proto.metrics.v1.AggregationTemporality;

                    /** Sum isMonotonic. */
                    public isMonotonic: boolean;

                    /**
                     * Decodes a Sum message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Sum
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.Sum;

                    /**
                     * Creates a Sum message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Sum
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.Sum;

                    /**
                     * Creates a plain object from a Sum message. Also converts values to other types if specified.
                     * @param message Sum
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.Sum, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Sum to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Sum
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Histogram. */
                interface IHistogram {

                    /** Histogram dataPoints */
                    dataPoints?: (opentelemetry.proto.metrics.v1.IHistogramDataPoint[]|null);

                    /** Histogram aggregationTemporality */
                    aggregationTemporality?: (opentelemetry.proto.metrics.v1.AggregationTemporality|null);
                }

                /** Represents a Histogram. */
                class Histogram implements IHistogram {

                    /**
                     * Constructs a new Histogram.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IHistogram);

                    /** Histogram dataPoints. */
                    public dataPoints: opentelemetry.proto.metrics.v1.IHistogramDataPoint[];

                    /** Histogram aggregationTemporality. */
                    public aggregationTemporality: opentelemetry.proto.metrics.v1.AggregationTemporality;

                    /**
                     * Decodes a Histogram message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Histogram
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.Histogram;

                    /**
                     * Creates a Histogram message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Histogram
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.Histogram;

                    /**
                     * Creates a plain object from a Histogram message. Also converts values to other types if specified.
                     * @param message Histogram
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.Histogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Histogram to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Histogram
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an ExponentialHistogram. */
                interface IExponentialHistogram {

                    /** ExponentialHistogram dataPoints */
                    dataPoints?: (opentelemetry.proto.metrics.v1.IExponentialHistogramDataPoint[]|null);

                    /** ExponentialHistogram aggregationTemporality */
                    aggregationTemporality?: (opentelemetry.proto.metrics.v1.AggregationTemporality|null);
                }

                /** Represents an ExponentialHistogram. */
                class ExponentialHistogram implements IExponentialHistogram {

                    /**
                     * Constructs a new ExponentialHistogram.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IExponentialHistogram);

                    /** ExponentialHistogram dataPoints. */
                    public dataPoints: opentelemetry.proto.metrics.v1.IExponentialHistogramDataPoint[];

                    /** ExponentialHistogram aggregationTemporality. */
                    public aggregationTemporality: opentelemetry.proto.metrics.v1.AggregationTemporality;

                    /**
                     * Decodes an ExponentialHistogram message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ExponentialHistogram
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.ExponentialHistogram;

                    /**
                     * Creates an ExponentialHistogram message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ExponentialHistogram
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.ExponentialHistogram;

                    /**
                     * Creates a plain object from an ExponentialHistogram message. Also converts values to other types if specified.
                     * @param message ExponentialHistogram
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.ExponentialHistogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ExponentialHistogram to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ExponentialHistogram
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Summary. */
                interface ISummary {

                    /** Summary dataPoints */
                    dataPoints?: (opentelemetry.proto.metrics.v1.ISummaryDataPoint[]|null);
                }

                /** Represents a Summary. */
                class Summary implements ISummary {

                    /**
                     * Constructs a new Summary.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.ISummary);

                    /** Summary dataPoints. */
                    public dataPoints: opentelemetry.proto.metrics.v1.ISummaryDataPoint[];

                    /**
                     * Decodes a Summary message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Summary
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.Summary;

                    /**
                     * Creates a Summary message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Summary
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.Summary;

                    /**
                     * Creates a plain object from a Summary message. Also converts values to other types if specified.
                     * @param message Summary
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.Summary, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Summary to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Summary
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** AggregationTemporality enum. */
                enum AggregationTemporality {
                    AGGREGATION_TEMPORALITY_UNSPECIFIED = 0,
                    AGGREGATION_TEMPORALITY_DELTA = 1,
                    AGGREGATION_TEMPORALITY_CUMULATIVE = 2
                }

                /** DataPointFlags enum. */
                enum DataPointFlags {
                    DATA_POINT_FLAGS_DO_NOT_USE = 0,
                    DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK = 1
                }

                /** Properties of a NumberDataPoint. */
                interface INumberDataPoint {

                    /** NumberDataPoint attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** NumberDataPoint startTimeUnixNano */
                    startTimeUnixNano?: (number|Long|null);

                    /** NumberDataPoint timeUnixNano */
                    timeUnixNano?: (number|Long|null);

                    /** NumberDataPoint asDouble */
                    asDouble?: (number|null);

                    /** NumberDataPoint asInt */
                    asInt?: (number|Long|null);

                    /** NumberDataPoint exemplars */
                    exemplars?: (opentelemetry.proto.metrics.v1.IExemplar[]|null);

                    /** NumberDataPoint flags */
                    flags?: (number|null);
                }

                /** Represents a NumberDataPoint. */
                class NumberDataPoint implements INumberDataPoint {

                    /**
                     * Constructs a new NumberDataPoint.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.INumberDataPoint);

                    /** NumberDataPoint attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** NumberDataPoint startTimeUnixNano. */
                    public startTimeUnixNano: (number|Long);

                    /** NumberDataPoint timeUnixNano. */
                    public timeUnixNano: (number|Long);

                    /** NumberDataPoint asDouble. */
                    public asDouble?: (number|null);

                    /** NumberDataPoint asInt. */
                    public asInt?: (number|Long|null);

                    /** NumberDataPoint exemplars. */
                    public exemplars: opentelemetry.proto.metrics.v1.IExemplar[];

                    /** NumberDataPoint flags. */
                    public flags: number;

                    /** NumberDataPoint value. */
                    public value?: ("asDouble"|"asInt");

                    /**
                     * Decodes a NumberDataPoint message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns NumberDataPoint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.NumberDataPoint;

                    /**
                     * Creates a NumberDataPoint message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns NumberDataPoint
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.NumberDataPoint;

                    /**
                     * Creates a plain object from a NumberDataPoint message. Also converts values to other types if specified.
                     * @param message NumberDataPoint
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.NumberDataPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this NumberDataPoint to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for NumberDataPoint
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a HistogramDataPoint. */
                interface IHistogramDataPoint {

                    /** HistogramDataPoint attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** HistogramDataPoint startTimeUnixNano */
                    startTimeUnixNano?: (number|Long|null);

                    /** HistogramDataPoint timeUnixNano */
                    timeUnixNano?: (number|Long|null);

                    /** HistogramDataPoint count */
                    count?: (number|Long|null);

                    /** HistogramDataPoint sum */
                    sum?: (number|null);

                    /** HistogramDataPoint bucketCounts */
                    bucketCounts?: ((number|Long)[]|null);

                    /** HistogramDataPoint explicitBounds */
                    explicitBounds?: (number[]|null);

                    /** HistogramDataPoint exemplars */
                    exemplars?: (opentelemetry.proto.metrics.v1.IExemplar[]|null);

                    /** HistogramDataPoint flags */
                    flags?: (number|null);

                    /** HistogramDataPoint min */
                    min?: (number|null);

                    /** HistogramDataPoint max */
                    max?: (number|null);
                }

                /** Represents a HistogramDataPoint. */
                class HistogramDataPoint implements IHistogramDataPoint {

                    /**
                     * Constructs a new HistogramDataPoint.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IHistogramDataPoint);

                    /** HistogramDataPoint attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** HistogramDataPoint startTimeUnixNano. */
                    public startTimeUnixNano: (number|Long);

                    /** HistogramDataPoint timeUnixNano. */
                    public timeUnixNano: (number|Long);

                    /** HistogramDataPoint count. */
                    public count: (number|Long);

                    /** HistogramDataPoint sum. */
                    public sum?: (number|null);

                    /** HistogramDataPoint bucketCounts. */
                    public bucketCounts: (number|Long)[];

                    /** HistogramDataPoint explicitBounds. */
                    public explicitBounds: number[];

                    /** HistogramDataPoint exemplars. */
                    public exemplars: opentelemetry.proto.metrics.v1.IExemplar[];

                    /** HistogramDataPoint flags. */
                    public flags: number;

                    /** HistogramDataPoint min. */
                    public min?: (number|null);

                    /** HistogramDataPoint max. */
                    public max?: (number|null);

                    /** HistogramDataPoint _sum. */
                    public _sum?: "sum";

                    /** HistogramDataPoint _min. */
                    public _min?: "min";

                    /** HistogramDataPoint _max. */
                    public _max?: "max";

                    /**
                     * Decodes a HistogramDataPoint message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns HistogramDataPoint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.HistogramDataPoint;

                    /**
                     * Creates a HistogramDataPoint message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns HistogramDataPoint
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.HistogramDataPoint;

                    /**
                     * Creates a plain object from a HistogramDataPoint message. Also converts values to other types if specified.
                     * @param message HistogramDataPoint
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.HistogramDataPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this HistogramDataPoint to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for HistogramDataPoint
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an ExponentialHistogramDataPoint. */
                interface IExponentialHistogramDataPoint {

                    /** ExponentialHistogramDataPoint attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** ExponentialHistogramDataPoint startTimeUnixNano */
                    startTimeUnixNano?: (number|Long|null);

                    /** ExponentialHistogramDataPoint timeUnixNano */
                    timeUnixNano?: (number|Long|null);

                    /** ExponentialHistogramDataPoint count */
                    count?: (number|Long|null);

                    /** ExponentialHistogramDataPoint sum */
                    sum?: (number|null);

                    /** ExponentialHistogramDataPoint scale */
                    scale?: (number|null);

                    /** ExponentialHistogramDataPoint zeroCount */
                    zeroCount?: (number|Long|null);

                    /** ExponentialHistogramDataPoint positive */
                    positive?: (opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.IBuckets|null);

                    /** ExponentialHistogramDataPoint negative */
                    negative?: (opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.IBuckets|null);

                    /** ExponentialHistogramDataPoint flags */
                    flags?: (number|null);

                    /** ExponentialHistogramDataPoint exemplars */
                    exemplars?: (opentelemetry.proto.metrics.v1.IExemplar[]|null);

                    /** ExponentialHistogramDataPoint min */
                    min?: (number|null);

                    /** ExponentialHistogramDataPoint max */
                    max?: (number|null);

                    /** ExponentialHistogramDataPoint zeroThreshold */
                    zeroThreshold?: (number|null);
                }

                /** Represents an ExponentialHistogramDataPoint. */
                class ExponentialHistogramDataPoint implements IExponentialHistogramDataPoint {

                    /**
                     * Constructs a new ExponentialHistogramDataPoint.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IExponentialHistogramDataPoint);

                    /** ExponentialHistogramDataPoint attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** ExponentialHistogramDataPoint startTimeUnixNano. */
                    public startTimeUnixNano: (number|Long);

                    /** ExponentialHistogramDataPoint timeUnixNano. */
                    public timeUnixNano: (number|Long);

                    /** ExponentialHistogramDataPoint count. */
                    public count: (number|Long);

                    /** ExponentialHistogramDataPoint sum. */
                    public sum?: (number|null);

                    /** ExponentialHistogramDataPoint scale. */
                    public scale: number;

                    /** ExponentialHistogramDataPoint zeroCount. */
                    public zeroCount: (number|Long);

                    /** ExponentialHistogramDataPoint positive. */
                    public positive?: (opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.IBuckets|null);

                    /** ExponentialHistogramDataPoint negative. */
                    public negative?: (opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.IBuckets|null);

                    /** ExponentialHistogramDataPoint flags. */
                    public flags: number;

                    /** ExponentialHistogramDataPoint exemplars. */
                    public exemplars: opentelemetry.proto.metrics.v1.IExemplar[];

                    /** ExponentialHistogramDataPoint min. */
                    public min?: (number|null);

                    /** ExponentialHistogramDataPoint max. */
                    public max?: (number|null);

                    /** ExponentialHistogramDataPoint zeroThreshold. */
                    public zeroThreshold: number;

                    /** ExponentialHistogramDataPoint _sum. */
                    public _sum?: "sum";

                    /** ExponentialHistogramDataPoint _min. */
                    public _min?: "min";

                    /** ExponentialHistogramDataPoint _max. */
                    public _max?: "max";

                    /**
                     * Decodes an ExponentialHistogramDataPoint message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ExponentialHistogramDataPoint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;

                    /**
                     * Creates an ExponentialHistogramDataPoint message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ExponentialHistogramDataPoint
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint;

                    /**
                     * Creates a plain object from an ExponentialHistogramDataPoint message. Also converts values to other types if specified.
                     * @param message ExponentialHistogramDataPoint
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ExponentialHistogramDataPoint to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ExponentialHistogramDataPoint
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace ExponentialHistogramDataPoint {

                    /** Properties of a Buckets. */
                    interface IBuckets {

                        /** Buckets offset */
                        offset?: (number|null);

                        /** Buckets bucketCounts */
                        bucketCounts?: ((number|Long)[]|null);
                    }

                    /** Represents a Buckets. */
                    class Buckets implements IBuckets {

                        /**
                         * Constructs a new Buckets.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.IBuckets);

                        /** Buckets offset. */
                        public offset: number;

                        /** Buckets bucketCounts. */
                        public bucketCounts: (number|Long)[];

                        /**
                         * Decodes a Buckets message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns Buckets
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;

                        /**
                         * Creates a Buckets message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns Buckets
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets;

                        /**
                         * Creates a plain object from a Buckets message. Also converts values to other types if specified.
                         * @param message Buckets
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this Buckets to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for Buckets
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }

                /** Properties of a SummaryDataPoint. */
                interface ISummaryDataPoint {

                    /** SummaryDataPoint attributes */
                    attributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** SummaryDataPoint startTimeUnixNano */
                    startTimeUnixNano?: (number|Long|null);

                    /** SummaryDataPoint timeUnixNano */
                    timeUnixNano?: (number|Long|null);

                    /** SummaryDataPoint count */
                    count?: (number|Long|null);

                    /** SummaryDataPoint sum */
                    sum?: (number|null);

                    /** SummaryDataPoint quantileValues */
                    quantileValues?: (opentelemetry.proto.metrics.v1.SummaryDataPoint.IValueAtQuantile[]|null);

                    /** SummaryDataPoint flags */
                    flags?: (number|null);
                }

                /** Represents a SummaryDataPoint. */
                class SummaryDataPoint implements ISummaryDataPoint {

                    /**
                     * Constructs a new SummaryDataPoint.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.ISummaryDataPoint);

                    /** SummaryDataPoint attributes. */
                    public attributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** SummaryDataPoint startTimeUnixNano. */
                    public startTimeUnixNano: (number|Long);

                    /** SummaryDataPoint timeUnixNano. */
                    public timeUnixNano: (number|Long);

                    /** SummaryDataPoint count. */
                    public count: (number|Long);

                    /** SummaryDataPoint sum. */
                    public sum: number;

                    /** SummaryDataPoint quantileValues. */
                    public quantileValues: opentelemetry.proto.metrics.v1.SummaryDataPoint.IValueAtQuantile[];

                    /** SummaryDataPoint flags. */
                    public flags: number;

                    /**
                     * Decodes a SummaryDataPoint message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SummaryDataPoint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.SummaryDataPoint;

                    /**
                     * Creates a SummaryDataPoint message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SummaryDataPoint
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.SummaryDataPoint;

                    /**
                     * Creates a plain object from a SummaryDataPoint message. Also converts values to other types if specified.
                     * @param message SummaryDataPoint
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.SummaryDataPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SummaryDataPoint to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SummaryDataPoint
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace SummaryDataPoint {

                    /** Properties of a ValueAtQuantile. */
                    interface IValueAtQuantile {

                        /** ValueAtQuantile quantile */
                        quantile?: (number|null);

                        /** ValueAtQuantile value */
                        value?: (number|null);
                    }

                    /** Represents a ValueAtQuantile. */
                    class ValueAtQuantile implements IValueAtQuantile {

                        /**
                         * Constructs a new ValueAtQuantile.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: opentelemetry.proto.metrics.v1.SummaryDataPoint.IValueAtQuantile);

                        /** ValueAtQuantile quantile. */
                        public quantile: number;

                        /** ValueAtQuantile value. */
                        public value: number;

                        /**
                         * Decodes a ValueAtQuantile message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ValueAtQuantile
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;

                        /**
                         * Creates a ValueAtQuantile message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ValueAtQuantile
                         */
                        public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile;

                        /**
                         * Creates a plain object from a ValueAtQuantile message. Also converts values to other types if specified.
                         * @param message ValueAtQuantile
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ValueAtQuantile to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ValueAtQuantile
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }

                /** Properties of an Exemplar. */
                interface IExemplar {

                    /** Exemplar filteredAttributes */
                    filteredAttributes?: (opentelemetry.proto.common.v1.IKeyValue[]|null);

                    /** Exemplar timeUnixNano */
                    timeUnixNano?: (number|Long|null);

                    /** Exemplar asDouble */
                    asDouble?: (number|null);

                    /** Exemplar asInt */
                    asInt?: (number|Long|null);

                    /** Exemplar spanId */
                    spanId?: (Uint8Array|null);

                    /** Exemplar traceId */
                    traceId?: (Uint8Array|null);
                }

                /** Represents an Exemplar. */
                class Exemplar implements IExemplar {

                    /**
                     * Constructs a new Exemplar.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: opentelemetry.proto.metrics.v1.IExemplar);

                    /** Exemplar filteredAttributes. */
                    public filteredAttributes: opentelemetry.proto.common.v1.IKeyValue[];

                    /** Exemplar timeUnixNano. */
                    public timeUnixNano: (number|Long);

                    /** Exemplar asDouble. */
                    public asDouble?: (number|null);

                    /** Exemplar asInt. */
                    public asInt?: (number|Long|null);

                    /** Exemplar spanId. */
                    public spanId: Uint8Array;

                    /** Exemplar traceId. */
                    public traceId: Uint8Array;

                    /** Exemplar value. */
                    public value?: ("asDouble"|"asInt");

                    /**
                     * Decodes an Exemplar message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Exemplar
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): opentelemetry.proto.metrics.v1.Exemplar;

                    /**
                     * Creates an Exemplar message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Exemplar
                     */
                    public static fromObject(object: { [k: string]: any }): opentelemetry.proto.metrics.v1.Exemplar;

                    /**
                     * Creates a plain object from an Exemplar message. Also converts values to other types if specified.
                     * @param message Exemplar
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: opentelemetry.proto.metrics.v1.Exemplar, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Exemplar to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Exemplar
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }
    }
}
