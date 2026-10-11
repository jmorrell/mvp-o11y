// Generated from proto/ using protobufjs-cli 1.1.3; see docs/schema.md.
// Copyright The OpenTelemetry Authors. SPDX-License-Identifier: Apache-2.0
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

const $Reader = $protobuf.Reader, $util = $protobuf.util;

const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const opentelemetry = $root.opentelemetry = (() => {

    const opentelemetry = {};

    opentelemetry.proto = (function() {

        const proto = {};

        proto.collector = (function() {

            const collector = {};

            collector.trace = (function() {

                const trace = {};

                trace.v1 = (function() {

                    const v1 = {};

                    v1.ExportTraceServiceRequest = (function() {

                        function ExportTraceServiceRequest(properties) {
                            this.resourceSpans = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportTraceServiceRequest.prototype.resourceSpans = $util.emptyArray;

                        ExportTraceServiceRequest.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.resourceSpans && message.resourceSpans.length))
                                            message.resourceSpans = [];
                                        message.resourceSpans.push($root.opentelemetry.proto.trace.v1.ResourceSpans.decode(reader, reader.uint32()));
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportTraceServiceRequest.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest();
                            if (object.resourceSpans) {
                                if (!Array.isArray(object.resourceSpans))
                                    throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
                                message.resourceSpans = [];
                                for (let i = 0; i < object.resourceSpans.length; ++i) {
                                    if (typeof object.resourceSpans[i] !== "object")
                                        throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
                                    message.resourceSpans[i] = $root.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(object.resourceSpans[i]);
                                }
                            }
                            return message;
                        };

                        ExportTraceServiceRequest.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.resourceSpans = [];
                            if (message.resourceSpans && message.resourceSpans.length) {
                                object.resourceSpans = [];
                                for (let j = 0; j < message.resourceSpans.length; ++j)
                                    object.resourceSpans[j] = $root.opentelemetry.proto.trace.v1.ResourceSpans.toObject(message.resourceSpans[j], options);
                            }
                            return object;
                        };

                        ExportTraceServiceRequest.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportTraceServiceRequest;
                    })();

                    v1.ExportTraceServiceResponse = (function() {

                        function ExportTraceServiceResponse(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportTraceServiceResponse.prototype.partialSuccess = null;

                        ExportTraceServiceResponse.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.partialSuccess = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportTraceServiceResponse.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse();
                            if (object.partialSuccess != null) {
                                if (typeof object.partialSuccess !== "object")
                                    throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
                                message.partialSuccess = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject(object.partialSuccess);
                            }
                            return message;
                        };

                        ExportTraceServiceResponse.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults)
                                object.partialSuccess = null;
                            if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess"))
                                object.partialSuccess = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject(message.partialSuccess, options);
                            return object;
                        };

                        ExportTraceServiceResponse.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportTraceServiceResponse;
                    })();

                    v1.ExportTracePartialSuccess = (function() {

                        function ExportTracePartialSuccess(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportTracePartialSuccess.prototype.rejectedSpans = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        ExportTracePartialSuccess.prototype.errorMessage = "";

                        ExportTracePartialSuccess.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.rejectedSpans = reader.int64();
                                        break;
                                    }
                                case 2: {
                                        message.errorMessage = reader.string();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportTracePartialSuccess.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess();
                            if (object.rejectedSpans != null)
                                if ($util.Long)
                                    (message.rejectedSpans = $util.Long.fromValue(object.rejectedSpans)).unsigned = false;
                                else if (typeof object.rejectedSpans === "string")
                                    message.rejectedSpans = parseInt(object.rejectedSpans, 10);
                                else if (typeof object.rejectedSpans === "number")
                                    message.rejectedSpans = object.rejectedSpans;
                                else if (typeof object.rejectedSpans === "object")
                                    message.rejectedSpans = new $util.LongBits(object.rejectedSpans.low >>> 0, object.rejectedSpans.high >>> 0).toNumber();
                            if (object.errorMessage != null)
                                message.errorMessage = String(object.errorMessage);
                            return message;
                        };

                        ExportTracePartialSuccess.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.rejectedSpans = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.rejectedSpans = options.longs === String ? "0" : 0;
                                object.errorMessage = "";
                            }
                            if (message.rejectedSpans != null && message.hasOwnProperty("rejectedSpans"))
                                if (typeof message.rejectedSpans === "number")
                                    object.rejectedSpans = options.longs === String ? String(message.rejectedSpans) : message.rejectedSpans;
                                else
                                    object.rejectedSpans = options.longs === String ? $util.Long.prototype.toString.call(message.rejectedSpans) : options.longs === Number ? new $util.LongBits(message.rejectedSpans.low >>> 0, message.rejectedSpans.high >>> 0).toNumber() : message.rejectedSpans;
                            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                                object.errorMessage = message.errorMessage;
                            return object;
                        };

                        ExportTracePartialSuccess.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportTracePartialSuccess;
                    })();

                    return v1;
                })();

                return trace;
            })();

            collector.logs = (function() {

                const logs = {};

                logs.v1 = (function() {

                    const v1 = {};

                    v1.ExportLogsServiceRequest = (function() {

                        function ExportLogsServiceRequest(properties) {
                            this.resourceLogs = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportLogsServiceRequest.prototype.resourceLogs = $util.emptyArray;

                        ExportLogsServiceRequest.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.resourceLogs && message.resourceLogs.length))
                                            message.resourceLogs = [];
                                        message.resourceLogs.push($root.opentelemetry.proto.logs.v1.ResourceLogs.decode(reader, reader.uint32()));
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportLogsServiceRequest.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest();
                            if (object.resourceLogs) {
                                if (!Array.isArray(object.resourceLogs))
                                    throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
                                message.resourceLogs = [];
                                for (let i = 0; i < object.resourceLogs.length; ++i) {
                                    if (typeof object.resourceLogs[i] !== "object")
                                        throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
                                    message.resourceLogs[i] = $root.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(object.resourceLogs[i]);
                                }
                            }
                            return message;
                        };

                        ExportLogsServiceRequest.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.resourceLogs = [];
                            if (message.resourceLogs && message.resourceLogs.length) {
                                object.resourceLogs = [];
                                for (let j = 0; j < message.resourceLogs.length; ++j)
                                    object.resourceLogs[j] = $root.opentelemetry.proto.logs.v1.ResourceLogs.toObject(message.resourceLogs[j], options);
                            }
                            return object;
                        };

                        ExportLogsServiceRequest.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportLogsServiceRequest;
                    })();

                    v1.ExportLogsServiceResponse = (function() {

                        function ExportLogsServiceResponse(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportLogsServiceResponse.prototype.partialSuccess = null;

                        ExportLogsServiceResponse.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.partialSuccess = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportLogsServiceResponse.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse();
                            if (object.partialSuccess != null) {
                                if (typeof object.partialSuccess !== "object")
                                    throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
                                message.partialSuccess = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject(object.partialSuccess);
                            }
                            return message;
                        };

                        ExportLogsServiceResponse.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults)
                                object.partialSuccess = null;
                            if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess"))
                                object.partialSuccess = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject(message.partialSuccess, options);
                            return object;
                        };

                        ExportLogsServiceResponse.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportLogsServiceResponse;
                    })();

                    v1.ExportLogsPartialSuccess = (function() {

                        function ExportLogsPartialSuccess(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportLogsPartialSuccess.prototype.rejectedLogRecords = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        ExportLogsPartialSuccess.prototype.errorMessage = "";

                        ExportLogsPartialSuccess.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.rejectedLogRecords = reader.int64();
                                        break;
                                    }
                                case 2: {
                                        message.errorMessage = reader.string();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportLogsPartialSuccess.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess();
                            if (object.rejectedLogRecords != null)
                                if ($util.Long)
                                    (message.rejectedLogRecords = $util.Long.fromValue(object.rejectedLogRecords)).unsigned = false;
                                else if (typeof object.rejectedLogRecords === "string")
                                    message.rejectedLogRecords = parseInt(object.rejectedLogRecords, 10);
                                else if (typeof object.rejectedLogRecords === "number")
                                    message.rejectedLogRecords = object.rejectedLogRecords;
                                else if (typeof object.rejectedLogRecords === "object")
                                    message.rejectedLogRecords = new $util.LongBits(object.rejectedLogRecords.low >>> 0, object.rejectedLogRecords.high >>> 0).toNumber();
                            if (object.errorMessage != null)
                                message.errorMessage = String(object.errorMessage);
                            return message;
                        };

                        ExportLogsPartialSuccess.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.rejectedLogRecords = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.rejectedLogRecords = options.longs === String ? "0" : 0;
                                object.errorMessage = "";
                            }
                            if (message.rejectedLogRecords != null && message.hasOwnProperty("rejectedLogRecords"))
                                if (typeof message.rejectedLogRecords === "number")
                                    object.rejectedLogRecords = options.longs === String ? String(message.rejectedLogRecords) : message.rejectedLogRecords;
                                else
                                    object.rejectedLogRecords = options.longs === String ? $util.Long.prototype.toString.call(message.rejectedLogRecords) : options.longs === Number ? new $util.LongBits(message.rejectedLogRecords.low >>> 0, message.rejectedLogRecords.high >>> 0).toNumber() : message.rejectedLogRecords;
                            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                                object.errorMessage = message.errorMessage;
                            return object;
                        };

                        ExportLogsPartialSuccess.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportLogsPartialSuccess;
                    })();

                    return v1;
                })();

                return logs;
            })();

            collector.metrics = (function() {

                const metrics = {};

                metrics.v1 = (function() {

                    const v1 = {};

                    v1.ExportMetricsServiceRequest = (function() {

                        function ExportMetricsServiceRequest(properties) {
                            this.resourceMetrics = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportMetricsServiceRequest.prototype.resourceMetrics = $util.emptyArray;

                        ExportMetricsServiceRequest.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.resourceMetrics && message.resourceMetrics.length))
                                            message.resourceMetrics = [];
                                        message.resourceMetrics.push($root.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(reader, reader.uint32()));
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportMetricsServiceRequest.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest();
                            if (object.resourceMetrics) {
                                if (!Array.isArray(object.resourceMetrics))
                                    throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
                                message.resourceMetrics = [];
                                for (let i = 0; i < object.resourceMetrics.length; ++i) {
                                    if (typeof object.resourceMetrics[i] !== "object")
                                        throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
                                    message.resourceMetrics[i] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(object.resourceMetrics[i]);
                                }
                            }
                            return message;
                        };

                        ExportMetricsServiceRequest.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.resourceMetrics = [];
                            if (message.resourceMetrics && message.resourceMetrics.length) {
                                object.resourceMetrics = [];
                                for (let j = 0; j < message.resourceMetrics.length; ++j)
                                    object.resourceMetrics[j] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(message.resourceMetrics[j], options);
                            }
                            return object;
                        };

                        ExportMetricsServiceRequest.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportMetricsServiceRequest;
                    })();

                    v1.ExportMetricsServiceResponse = (function() {

                        function ExportMetricsServiceResponse(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportMetricsServiceResponse.prototype.partialSuccess = null;

                        ExportMetricsServiceResponse.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.partialSuccess = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportMetricsServiceResponse.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse();
                            if (object.partialSuccess != null) {
                                if (typeof object.partialSuccess !== "object")
                                    throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
                                message.partialSuccess = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject(object.partialSuccess);
                            }
                            return message;
                        };

                        ExportMetricsServiceResponse.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults)
                                object.partialSuccess = null;
                            if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess"))
                                object.partialSuccess = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject(message.partialSuccess, options);
                            return object;
                        };

                        ExportMetricsServiceResponse.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportMetricsServiceResponse;
                    })();

                    v1.ExportMetricsPartialSuccess = (function() {

                        function ExportMetricsPartialSuccess(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ExportMetricsPartialSuccess.prototype.rejectedDataPoints = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        ExportMetricsPartialSuccess.prototype.errorMessage = "";

                        ExportMetricsPartialSuccess.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.rejectedDataPoints = reader.int64();
                                        break;
                                    }
                                case 2: {
                                        message.errorMessage = reader.string();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ExportMetricsPartialSuccess.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess)
                                return object;
                            let message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess();
                            if (object.rejectedDataPoints != null)
                                if ($util.Long)
                                    (message.rejectedDataPoints = $util.Long.fromValue(object.rejectedDataPoints)).unsigned = false;
                                else if (typeof object.rejectedDataPoints === "string")
                                    message.rejectedDataPoints = parseInt(object.rejectedDataPoints, 10);
                                else if (typeof object.rejectedDataPoints === "number")
                                    message.rejectedDataPoints = object.rejectedDataPoints;
                                else if (typeof object.rejectedDataPoints === "object")
                                    message.rejectedDataPoints = new $util.LongBits(object.rejectedDataPoints.low >>> 0, object.rejectedDataPoints.high >>> 0).toNumber();
                            if (object.errorMessage != null)
                                message.errorMessage = String(object.errorMessage);
                            return message;
                        };

                        ExportMetricsPartialSuccess.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.rejectedDataPoints = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.rejectedDataPoints = options.longs === String ? "0" : 0;
                                object.errorMessage = "";
                            }
                            if (message.rejectedDataPoints != null && message.hasOwnProperty("rejectedDataPoints"))
                                if (typeof message.rejectedDataPoints === "number")
                                    object.rejectedDataPoints = options.longs === String ? String(message.rejectedDataPoints) : message.rejectedDataPoints;
                                else
                                    object.rejectedDataPoints = options.longs === String ? $util.Long.prototype.toString.call(message.rejectedDataPoints) : options.longs === Number ? new $util.LongBits(message.rejectedDataPoints.low >>> 0, message.rejectedDataPoints.high >>> 0).toNumber() : message.rejectedDataPoints;
                            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                                object.errorMessage = message.errorMessage;
                            return object;
                        };

                        ExportMetricsPartialSuccess.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ExportMetricsPartialSuccess;
                    })();

                    return v1;
                })();

                return metrics;
            })();

            return collector;
        })();

        proto.trace = (function() {

            const trace = {};

            trace.v1 = (function() {

                const v1 = {};

                v1.TracesData = (function() {

                    function TracesData(properties) {
                        this.resourceSpans = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    TracesData.prototype.resourceSpans = $util.emptyArray;

                    TracesData.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.TracesData();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.resourceSpans && message.resourceSpans.length))
                                        message.resourceSpans = [];
                                    message.resourceSpans.push($root.opentelemetry.proto.trace.v1.ResourceSpans.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    TracesData.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.trace.v1.TracesData)
                            return object;
                        let message = new $root.opentelemetry.proto.trace.v1.TracesData();
                        if (object.resourceSpans) {
                            if (!Array.isArray(object.resourceSpans))
                                throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
                            message.resourceSpans = [];
                            for (let i = 0; i < object.resourceSpans.length; ++i) {
                                if (typeof object.resourceSpans[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
                                message.resourceSpans[i] = $root.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(object.resourceSpans[i]);
                            }
                        }
                        return message;
                    };

                    TracesData.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.resourceSpans = [];
                        if (message.resourceSpans && message.resourceSpans.length) {
                            object.resourceSpans = [];
                            for (let j = 0; j < message.resourceSpans.length; ++j)
                                object.resourceSpans[j] = $root.opentelemetry.proto.trace.v1.ResourceSpans.toObject(message.resourceSpans[j], options);
                        }
                        return object;
                    };

                    TracesData.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return TracesData;
                })();

                v1.ResourceSpans = (function() {

                    function ResourceSpans(properties) {
                        this.scopeSpans = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ResourceSpans.prototype.resource = null;
                    ResourceSpans.prototype.scopeSpans = $util.emptyArray;
                    ResourceSpans.prototype.schemaUrl = "";

                    ResourceSpans.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.ResourceSpans();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.resource = $root.opentelemetry.proto.resource.v1.Resource.decode(reader, reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.scopeSpans && message.scopeSpans.length))
                                        message.scopeSpans = [];
                                    message.scopeSpans.push($root.opentelemetry.proto.trace.v1.ScopeSpans.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ResourceSpans.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.trace.v1.ResourceSpans)
                            return object;
                        let message = new $root.opentelemetry.proto.trace.v1.ResourceSpans();
                        if (object.resource != null) {
                            if (typeof object.resource !== "object")
                                throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
                            message.resource = $root.opentelemetry.proto.resource.v1.Resource.fromObject(object.resource);
                        }
                        if (object.scopeSpans) {
                            if (!Array.isArray(object.scopeSpans))
                                throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
                            message.scopeSpans = [];
                            for (let i = 0; i < object.scopeSpans.length; ++i) {
                                if (typeof object.scopeSpans[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
                                message.scopeSpans[i] = $root.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(object.scopeSpans[i]);
                            }
                        }
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        return message;
                    };

                    ResourceSpans.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.scopeSpans = [];
                        if (options.defaults) {
                            object.resource = null;
                            object.schemaUrl = "";
                        }
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            object.resource = $root.opentelemetry.proto.resource.v1.Resource.toObject(message.resource, options);
                        if (message.scopeSpans && message.scopeSpans.length) {
                            object.scopeSpans = [];
                            for (let j = 0; j < message.scopeSpans.length; ++j)
                                object.scopeSpans[j] = $root.opentelemetry.proto.trace.v1.ScopeSpans.toObject(message.scopeSpans[j], options);
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        return object;
                    };

                    ResourceSpans.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ResourceSpans;
                })();

                v1.ScopeSpans = (function() {

                    function ScopeSpans(properties) {
                        this.spans = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ScopeSpans.prototype.scope = null;
                    ScopeSpans.prototype.spans = $util.emptyArray;
                    ScopeSpans.prototype.schemaUrl = "";

                    ScopeSpans.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.ScopeSpans();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.decode(reader, reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.spans && message.spans.length))
                                        message.spans = [];
                                    message.spans.push($root.opentelemetry.proto.trace.v1.Span.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ScopeSpans.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.trace.v1.ScopeSpans)
                            return object;
                        let message = new $root.opentelemetry.proto.trace.v1.ScopeSpans();
                        if (object.scope != null) {
                            if (typeof object.scope !== "object")
                                throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
                            message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(object.scope);
                        }
                        if (object.spans) {
                            if (!Array.isArray(object.spans))
                                throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
                            message.spans = [];
                            for (let i = 0; i < object.spans.length; ++i) {
                                if (typeof object.spans[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
                                message.spans[i] = $root.opentelemetry.proto.trace.v1.Span.fromObject(object.spans[i]);
                            }
                        }
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        return message;
                    };

                    ScopeSpans.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.spans = [];
                        if (options.defaults) {
                            object.scope = null;
                            object.schemaUrl = "";
                        }
                        if (message.scope != null && message.hasOwnProperty("scope"))
                            object.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.toObject(message.scope, options);
                        if (message.spans && message.spans.length) {
                            object.spans = [];
                            for (let j = 0; j < message.spans.length; ++j)
                                object.spans[j] = $root.opentelemetry.proto.trace.v1.Span.toObject(message.spans[j], options);
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        return object;
                    };

                    ScopeSpans.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ScopeSpans;
                })();

                v1.Span = (function() {

                    function Span(properties) {
                        this.attributes = [];
                        this.events = [];
                        this.links = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Span.prototype.traceId = $util.newBuffer([]);
                    Span.prototype.spanId = $util.newBuffer([]);
                    Span.prototype.traceState = "";
                    Span.prototype.parentSpanId = $util.newBuffer([]);
                    Span.prototype.flags = 0;
                    Span.prototype.name = "";
                    Span.prototype.kind = 0;
                    Span.prototype.startTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    Span.prototype.endTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    Span.prototype.attributes = $util.emptyArray;
                    Span.prototype.droppedAttributesCount = 0;
                    Span.prototype.events = $util.emptyArray;
                    Span.prototype.droppedEventsCount = 0;
                    Span.prototype.links = $util.emptyArray;
                    Span.prototype.droppedLinksCount = 0;
                    Span.prototype.status = null;

                    Span.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Span();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.traceId = reader.bytes();
                                    break;
                                }
                            case 2: {
                                    message.spanId = reader.bytes();
                                    break;
                                }
                            case 3: {
                                    message.traceState = reader.string();
                                    break;
                                }
                            case 4: {
                                    message.parentSpanId = reader.bytes();
                                    break;
                                }
                            case 16: {
                                    message.flags = reader.fixed32();
                                    break;
                                }
                            case 5: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 6: {
                                    message.kind = reader.int32();
                                    break;
                                }
                            case 7: {
                                    message.startTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 8: {
                                    message.endTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 9: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 10: {
                                    message.droppedAttributesCount = reader.uint32();
                                    break;
                                }
                            case 11: {
                                    if (!(message.events && message.events.length))
                                        message.events = [];
                                    message.events.push($root.opentelemetry.proto.trace.v1.Span.Event.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 12: {
                                    message.droppedEventsCount = reader.uint32();
                                    break;
                                }
                            case 13: {
                                    if (!(message.links && message.links.length))
                                        message.links = [];
                                    message.links.push($root.opentelemetry.proto.trace.v1.Span.Link.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 14: {
                                    message.droppedLinksCount = reader.uint32();
                                    break;
                                }
                            case 15: {
                                    message.status = $root.opentelemetry.proto.trace.v1.Status.decode(reader, reader.uint32());
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Span.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.trace.v1.Span)
                            return object;
                        let message = new $root.opentelemetry.proto.trace.v1.Span();
                        if (object.traceId != null)
                            if (typeof object.traceId === "string")
                                $util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
                            else if (object.traceId.length >= 0)
                                message.traceId = object.traceId;
                        if (object.spanId != null)
                            if (typeof object.spanId === "string")
                                $util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
                            else if (object.spanId.length >= 0)
                                message.spanId = object.spanId;
                        if (object.traceState != null)
                            message.traceState = String(object.traceState);
                        if (object.parentSpanId != null)
                            if (typeof object.parentSpanId === "string")
                                $util.base64.decode(object.parentSpanId, message.parentSpanId = $util.newBuffer($util.base64.length(object.parentSpanId)), 0);
                            else if (object.parentSpanId.length >= 0)
                                message.parentSpanId = object.parentSpanId;
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.name != null)
                            message.name = String(object.name);
                        switch (object.kind) {
                        default:
                            if (typeof object.kind === "number") {
                                message.kind = object.kind;
                                break;
                            }
                            break;
                        case "SPAN_KIND_UNSPECIFIED":
                        case 0:
                            message.kind = 0;
                            break;
                        case "SPAN_KIND_INTERNAL":
                        case 1:
                            message.kind = 1;
                            break;
                        case "SPAN_KIND_SERVER":
                        case 2:
                            message.kind = 2;
                            break;
                        case "SPAN_KIND_CLIENT":
                        case 3:
                            message.kind = 3;
                            break;
                        case "SPAN_KIND_PRODUCER":
                        case 4:
                            message.kind = 4;
                            break;
                        case "SPAN_KIND_CONSUMER":
                        case 5:
                            message.kind = 5;
                            break;
                        }
                        if (object.startTimeUnixNano != null)
                            if ($util.Long)
                                (message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
                            else if (typeof object.startTimeUnixNano === "string")
                                message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
                            else if (typeof object.startTimeUnixNano === "number")
                                message.startTimeUnixNano = object.startTimeUnixNano;
                            else if (typeof object.startTimeUnixNano === "object")
                                message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
                        if (object.endTimeUnixNano != null)
                            if ($util.Long)
                                (message.endTimeUnixNano = $util.Long.fromValue(object.endTimeUnixNano)).unsigned = false;
                            else if (typeof object.endTimeUnixNano === "string")
                                message.endTimeUnixNano = parseInt(object.endTimeUnixNano, 10);
                            else if (typeof object.endTimeUnixNano === "number")
                                message.endTimeUnixNano = object.endTimeUnixNano;
                            else if (typeof object.endTimeUnixNano === "object")
                                message.endTimeUnixNano = new $util.LongBits(object.endTimeUnixNano.low >>> 0, object.endTimeUnixNano.high >>> 0).toNumber();
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.droppedAttributesCount != null)
                            message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
                        if (object.events) {
                            if (!Array.isArray(object.events))
                                throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
                            message.events = [];
                            for (let i = 0; i < object.events.length; ++i) {
                                if (typeof object.events[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
                                message.events[i] = $root.opentelemetry.proto.trace.v1.Span.Event.fromObject(object.events[i]);
                            }
                        }
                        if (object.droppedEventsCount != null)
                            message.droppedEventsCount = object.droppedEventsCount >>> 0;
                        if (object.links) {
                            if (!Array.isArray(object.links))
                                throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
                            message.links = [];
                            for (let i = 0; i < object.links.length; ++i) {
                                if (typeof object.links[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
                                message.links[i] = $root.opentelemetry.proto.trace.v1.Span.Link.fromObject(object.links[i]);
                            }
                        }
                        if (object.droppedLinksCount != null)
                            message.droppedLinksCount = object.droppedLinksCount >>> 0;
                        if (object.status != null) {
                            if (typeof object.status !== "object")
                                throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
                            message.status = $root.opentelemetry.proto.trace.v1.Status.fromObject(object.status);
                        }
                        return message;
                    };

                    Span.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.attributes = [];
                            object.events = [];
                            object.links = [];
                        }
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.traceId = "";
                            else {
                                object.traceId = [];
                                if (options.bytes !== Array)
                                    object.traceId = $util.newBuffer(object.traceId);
                            }
                            if (options.bytes === String)
                                object.spanId = "";
                            else {
                                object.spanId = [];
                                if (options.bytes !== Array)
                                    object.spanId = $util.newBuffer(object.spanId);
                            }
                            object.traceState = "";
                            if (options.bytes === String)
                                object.parentSpanId = "";
                            else {
                                object.parentSpanId = [];
                                if (options.bytes !== Array)
                                    object.parentSpanId = $util.newBuffer(object.parentSpanId);
                            }
                            object.name = "";
                            object.kind = options.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.endTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.endTimeUnixNano = options.longs === String ? "0" : 0;
                            object.droppedAttributesCount = 0;
                            object.droppedEventsCount = 0;
                            object.droppedLinksCount = 0;
                            object.status = null;
                            object.flags = 0;
                        }
                        if (message.traceId != null && message.hasOwnProperty("traceId"))
                            object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
                        if (message.spanId != null && message.hasOwnProperty("spanId"))
                            object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
                        if (message.traceState != null && message.hasOwnProperty("traceState"))
                            object.traceState = message.traceState;
                        if (message.parentSpanId != null && message.hasOwnProperty("parentSpanId"))
                            object.parentSpanId = options.bytes === String ? $util.base64.encode(message.parentSpanId, 0, message.parentSpanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.parentSpanId) : message.parentSpanId;
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.kind != null && message.hasOwnProperty("kind"))
                            object.kind = options.enums === String ? $root.opentelemetry.proto.trace.v1.Span.SpanKind[message.kind] === undefined ? message.kind : $root.opentelemetry.proto.trace.v1.Span.SpanKind[message.kind] : message.kind;
                        if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
                            if (typeof message.startTimeUnixNano === "number")
                                object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
                            else
                                object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
                        if (message.endTimeUnixNano != null && message.hasOwnProperty("endTimeUnixNano"))
                            if (typeof message.endTimeUnixNano === "number")
                                object.endTimeUnixNano = options.longs === String ? String(message.endTimeUnixNano) : message.endTimeUnixNano;
                            else
                                object.endTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.endTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.endTimeUnixNano.low >>> 0, message.endTimeUnixNano.high >>> 0).toNumber() : message.endTimeUnixNano;
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
                            object.droppedAttributesCount = message.droppedAttributesCount;
                        if (message.events && message.events.length) {
                            object.events = [];
                            for (let j = 0; j < message.events.length; ++j)
                                object.events[j] = $root.opentelemetry.proto.trace.v1.Span.Event.toObject(message.events[j], options);
                        }
                        if (message.droppedEventsCount != null && message.hasOwnProperty("droppedEventsCount"))
                            object.droppedEventsCount = message.droppedEventsCount;
                        if (message.links && message.links.length) {
                            object.links = [];
                            for (let j = 0; j < message.links.length; ++j)
                                object.links[j] = $root.opentelemetry.proto.trace.v1.Span.Link.toObject(message.links[j], options);
                        }
                        if (message.droppedLinksCount != null && message.hasOwnProperty("droppedLinksCount"))
                            object.droppedLinksCount = message.droppedLinksCount;
                        if (message.status != null && message.hasOwnProperty("status"))
                            object.status = $root.opentelemetry.proto.trace.v1.Status.toObject(message.status, options);
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        return object;
                    };

                    Span.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    Span.SpanKind = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "SPAN_KIND_UNSPECIFIED"] = 0;
                        values[valuesById[1] = "SPAN_KIND_INTERNAL"] = 1;
                        values[valuesById[2] = "SPAN_KIND_SERVER"] = 2;
                        values[valuesById[3] = "SPAN_KIND_CLIENT"] = 3;
                        values[valuesById[4] = "SPAN_KIND_PRODUCER"] = 4;
                        values[valuesById[5] = "SPAN_KIND_CONSUMER"] = 5;
                        return values;
                    })();

                    Span.Event = (function() {

                        function Event(properties) {
                            this.attributes = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        Event.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        Event.prototype.name = "";
                        Event.prototype.attributes = $util.emptyArray;
                        Event.prototype.droppedAttributesCount = 0;

                        Event.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Span.Event();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.timeUnixNano = reader.fixed64();
                                        break;
                                    }
                                case 2: {
                                        message.name = reader.string();
                                        break;
                                    }
                                case 3: {
                                        if (!(message.attributes && message.attributes.length))
                                            message.attributes = [];
                                        message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                        break;
                                    }
                                case 4: {
                                        message.droppedAttributesCount = reader.uint32();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        Event.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.trace.v1.Span.Event)
                                return object;
                            let message = new $root.opentelemetry.proto.trace.v1.Span.Event();
                            if (object.timeUnixNano != null)
                                if ($util.Long)
                                    (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                                else if (typeof object.timeUnixNano === "string")
                                    message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                                else if (typeof object.timeUnixNano === "number")
                                    message.timeUnixNano = object.timeUnixNano;
                                else if (typeof object.timeUnixNano === "object")
                                    message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                            if (object.name != null)
                                message.name = String(object.name);
                            if (object.attributes) {
                                if (!Array.isArray(object.attributes))
                                    throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
                                message.attributes = [];
                                for (let i = 0; i < object.attributes.length; ++i) {
                                    if (typeof object.attributes[i] !== "object")
                                        throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
                                    message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                                }
                            }
                            if (object.droppedAttributesCount != null)
                                message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
                            return message;
                        };

                        Event.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.attributes = [];
                            if (options.defaults) {
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.timeUnixNano = options.longs === String ? "0" : 0;
                                object.name = "";
                                object.droppedAttributesCount = 0;
                            }
                            if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                                if (typeof message.timeUnixNano === "number")
                                    object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                                else
                                    object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                            if (message.name != null && message.hasOwnProperty("name"))
                                object.name = message.name;
                            if (message.attributes && message.attributes.length) {
                                object.attributes = [];
                                for (let j = 0; j < message.attributes.length; ++j)
                                    object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                            }
                            if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
                                object.droppedAttributesCount = message.droppedAttributesCount;
                            return object;
                        };

                        Event.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return Event;
                    })();

                    Span.Link = (function() {

                        function Link(properties) {
                            this.attributes = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        Link.prototype.traceId = $util.newBuffer([]);
                        Link.prototype.spanId = $util.newBuffer([]);
                        Link.prototype.traceState = "";
                        Link.prototype.attributes = $util.emptyArray;
                        Link.prototype.droppedAttributesCount = 0;
                        Link.prototype.flags = 0;

                        Link.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Span.Link();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.traceId = reader.bytes();
                                        break;
                                    }
                                case 2: {
                                        message.spanId = reader.bytes();
                                        break;
                                    }
                                case 3: {
                                        message.traceState = reader.string();
                                        break;
                                    }
                                case 4: {
                                        if (!(message.attributes && message.attributes.length))
                                            message.attributes = [];
                                        message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                        break;
                                    }
                                case 5: {
                                        message.droppedAttributesCount = reader.uint32();
                                        break;
                                    }
                                case 6: {
                                        message.flags = reader.fixed32();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        Link.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.trace.v1.Span.Link)
                                return object;
                            let message = new $root.opentelemetry.proto.trace.v1.Span.Link();
                            if (object.traceId != null)
                                if (typeof object.traceId === "string")
                                    $util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
                                else if (object.traceId.length >= 0)
                                    message.traceId = object.traceId;
                            if (object.spanId != null)
                                if (typeof object.spanId === "string")
                                    $util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
                                else if (object.spanId.length >= 0)
                                    message.spanId = object.spanId;
                            if (object.traceState != null)
                                message.traceState = String(object.traceState);
                            if (object.attributes) {
                                if (!Array.isArray(object.attributes))
                                    throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
                                message.attributes = [];
                                for (let i = 0; i < object.attributes.length; ++i) {
                                    if (typeof object.attributes[i] !== "object")
                                        throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
                                    message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                                }
                            }
                            if (object.droppedAttributesCount != null)
                                message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
                            if (object.flags != null)
                                message.flags = object.flags >>> 0;
                            return message;
                        };

                        Link.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.attributes = [];
                            if (options.defaults) {
                                if (options.bytes === String)
                                    object.traceId = "";
                                else {
                                    object.traceId = [];
                                    if (options.bytes !== Array)
                                        object.traceId = $util.newBuffer(object.traceId);
                                }
                                if (options.bytes === String)
                                    object.spanId = "";
                                else {
                                    object.spanId = [];
                                    if (options.bytes !== Array)
                                        object.spanId = $util.newBuffer(object.spanId);
                                }
                                object.traceState = "";
                                object.droppedAttributesCount = 0;
                                object.flags = 0;
                            }
                            if (message.traceId != null && message.hasOwnProperty("traceId"))
                                object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
                            if (message.spanId != null && message.hasOwnProperty("spanId"))
                                object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
                            if (message.traceState != null && message.hasOwnProperty("traceState"))
                                object.traceState = message.traceState;
                            if (message.attributes && message.attributes.length) {
                                object.attributes = [];
                                for (let j = 0; j < message.attributes.length; ++j)
                                    object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                            }
                            if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
                                object.droppedAttributesCount = message.droppedAttributesCount;
                            if (message.flags != null && message.hasOwnProperty("flags"))
                                object.flags = message.flags;
                            return object;
                        };

                        Link.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return Link;
                    })();

                    return Span;
                })();

                v1.Status = (function() {

                    function Status(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Status.prototype.message = "";
                    Status.prototype.code = 0;

                    Status.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Status();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 2: {
                                    message.message = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.code = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Status.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.trace.v1.Status)
                            return object;
                        let message = new $root.opentelemetry.proto.trace.v1.Status();
                        if (object.message != null)
                            message.message = String(object.message);
                        switch (object.code) {
                        default:
                            if (typeof object.code === "number") {
                                message.code = object.code;
                                break;
                            }
                            break;
                        case "STATUS_CODE_UNSET":
                        case 0:
                            message.code = 0;
                            break;
                        case "STATUS_CODE_OK":
                        case 1:
                            message.code = 1;
                            break;
                        case "STATUS_CODE_ERROR":
                        case 2:
                            message.code = 2;
                            break;
                        }
                        return message;
                    };

                    Status.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.message = "";
                            object.code = options.enums === String ? "STATUS_CODE_UNSET" : 0;
                        }
                        if (message.message != null && message.hasOwnProperty("message"))
                            object.message = message.message;
                        if (message.code != null && message.hasOwnProperty("code"))
                            object.code = options.enums === String ? $root.opentelemetry.proto.trace.v1.Status.StatusCode[message.code] === undefined ? message.code : $root.opentelemetry.proto.trace.v1.Status.StatusCode[message.code] : message.code;
                        return object;
                    };

                    Status.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    Status.StatusCode = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "STATUS_CODE_UNSET"] = 0;
                        values[valuesById[1] = "STATUS_CODE_OK"] = 1;
                        values[valuesById[2] = "STATUS_CODE_ERROR"] = 2;
                        return values;
                    })();

                    return Status;
                })();

                v1.SpanFlags = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "SPAN_FLAGS_DO_NOT_USE"] = 0;
                    values[valuesById[255] = "SPAN_FLAGS_TRACE_FLAGS_MASK"] = 255;
                    values[valuesById[256] = "SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK"] = 256;
                    values[valuesById[512] = "SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK"] = 512;
                    return values;
                })();

                return v1;
            })();

            return trace;
        })();

        proto.common = (function() {

            const common = {};

            common.v1 = (function() {

                const v1 = {};

                v1.AnyValue = (function() {

                    function AnyValue(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    AnyValue.prototype.stringValue = null;
                    AnyValue.prototype.boolValue = null;
                    AnyValue.prototype.intValue = null;
                    AnyValue.prototype.doubleValue = null;
                    AnyValue.prototype.arrayValue = null;
                    AnyValue.prototype.kvlistValue = null;
                    AnyValue.prototype.bytesValue = null;
                    AnyValue.prototype.stringValueStrindex = null;

                    let $oneOfFields;

                    Object.defineProperty(AnyValue.prototype, "value", {
                        get: $util.oneOfGetter($oneOfFields = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue", "stringValueStrindex"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    AnyValue.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.AnyValue();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.stringValue = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.boolValue = reader.bool();
                                    break;
                                }
                            case 3: {
                                    message.intValue = reader.int64();
                                    break;
                                }
                            case 4: {
                                    message.doubleValue = reader.double();
                                    break;
                                }
                            case 5: {
                                    message.arrayValue = $root.opentelemetry.proto.common.v1.ArrayValue.decode(reader, reader.uint32());
                                    break;
                                }
                            case 6: {
                                    message.kvlistValue = $root.opentelemetry.proto.common.v1.KeyValueList.decode(reader, reader.uint32());
                                    break;
                                }
                            case 7: {
                                    message.bytesValue = reader.bytes();
                                    break;
                                }
                            case 8: {
                                    message.stringValueStrindex = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    AnyValue.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.common.v1.AnyValue)
                            return object;
                        let message = new $root.opentelemetry.proto.common.v1.AnyValue();
                        if (object.stringValue != null)
                            message.stringValue = String(object.stringValue);
                        if (object.boolValue != null)
                            message.boolValue = Boolean(object.boolValue);
                        if (object.intValue != null)
                            if ($util.Long)
                                (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
                            else if (typeof object.intValue === "string")
                                message.intValue = parseInt(object.intValue, 10);
                            else if (typeof object.intValue === "number")
                                message.intValue = object.intValue;
                            else if (typeof object.intValue === "object")
                                message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
                        if (object.doubleValue != null)
                            message.doubleValue = Number(object.doubleValue);
                        if (object.arrayValue != null) {
                            if (typeof object.arrayValue !== "object")
                                throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
                            message.arrayValue = $root.opentelemetry.proto.common.v1.ArrayValue.fromObject(object.arrayValue);
                        }
                        if (object.kvlistValue != null) {
                            if (typeof object.kvlistValue !== "object")
                                throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
                            message.kvlistValue = $root.opentelemetry.proto.common.v1.KeyValueList.fromObject(object.kvlistValue);
                        }
                        if (object.bytesValue != null)
                            if (typeof object.bytesValue === "string")
                                $util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
                            else if (object.bytesValue.length >= 0)
                                message.bytesValue = object.bytesValue;
                        if (object.stringValueStrindex != null)
                            message.stringValueStrindex = object.stringValueStrindex | 0;
                        return message;
                    };

                    AnyValue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                            object.stringValue = message.stringValue;
                            if (options.oneofs)
                                object.value = "stringValue";
                        }
                        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                            object.boolValue = message.boolValue;
                            if (options.oneofs)
                                object.value = "boolValue";
                        }
                        if (message.intValue != null && message.hasOwnProperty("intValue")) {
                            if (typeof message.intValue === "number")
                                object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
                            else
                                object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
                            if (options.oneofs)
                                object.value = "intValue";
                        }
                        if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                            object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                            if (options.oneofs)
                                object.value = "doubleValue";
                        }
                        if (message.arrayValue != null && message.hasOwnProperty("arrayValue")) {
                            object.arrayValue = $root.opentelemetry.proto.common.v1.ArrayValue.toObject(message.arrayValue, options);
                            if (options.oneofs)
                                object.value = "arrayValue";
                        }
                        if (message.kvlistValue != null && message.hasOwnProperty("kvlistValue")) {
                            object.kvlistValue = $root.opentelemetry.proto.common.v1.KeyValueList.toObject(message.kvlistValue, options);
                            if (options.oneofs)
                                object.value = "kvlistValue";
                        }
                        if (message.bytesValue != null && message.hasOwnProperty("bytesValue")) {
                            object.bytesValue = options.bytes === String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
                            if (options.oneofs)
                                object.value = "bytesValue";
                        }
                        if (message.stringValueStrindex != null && message.hasOwnProperty("stringValueStrindex")) {
                            object.stringValueStrindex = message.stringValueStrindex;
                            if (options.oneofs)
                                object.value = "stringValueStrindex";
                        }
                        return object;
                    };

                    AnyValue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return AnyValue;
                })();

                v1.ArrayValue = (function() {

                    function ArrayValue(properties) {
                        this.values = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ArrayValue.prototype.values = $util.emptyArray;

                    ArrayValue.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.ArrayValue();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.values && message.values.length))
                                        message.values = [];
                                    message.values.push($root.opentelemetry.proto.common.v1.AnyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ArrayValue.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.common.v1.ArrayValue)
                            return object;
                        let message = new $root.opentelemetry.proto.common.v1.ArrayValue();
                        if (object.values) {
                            if (!Array.isArray(object.values))
                                throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
                            message.values = [];
                            for (let i = 0; i < object.values.length; ++i) {
                                if (typeof object.values[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
                                message.values[i] = $root.opentelemetry.proto.common.v1.AnyValue.fromObject(object.values[i]);
                            }
                        }
                        return message;
                    };

                    ArrayValue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.values = [];
                        if (message.values && message.values.length) {
                            object.values = [];
                            for (let j = 0; j < message.values.length; ++j)
                                object.values[j] = $root.opentelemetry.proto.common.v1.AnyValue.toObject(message.values[j], options);
                        }
                        return object;
                    };

                    ArrayValue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ArrayValue;
                })();

                v1.KeyValueList = (function() {

                    function KeyValueList(properties) {
                        this.values = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    KeyValueList.prototype.values = $util.emptyArray;

                    KeyValueList.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.KeyValueList();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.values && message.values.length))
                                        message.values = [];
                                    message.values.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    KeyValueList.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.common.v1.KeyValueList)
                            return object;
                        let message = new $root.opentelemetry.proto.common.v1.KeyValueList();
                        if (object.values) {
                            if (!Array.isArray(object.values))
                                throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
                            message.values = [];
                            for (let i = 0; i < object.values.length; ++i) {
                                if (typeof object.values[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
                                message.values[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.values[i]);
                            }
                        }
                        return message;
                    };

                    KeyValueList.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.values = [];
                        if (message.values && message.values.length) {
                            object.values = [];
                            for (let j = 0; j < message.values.length; ++j)
                                object.values[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.values[j], options);
                        }
                        return object;
                    };

                    KeyValueList.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return KeyValueList;
                })();

                v1.KeyValue = (function() {

                    function KeyValue(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    KeyValue.prototype.key = "";
                    KeyValue.prototype.value = null;
                    KeyValue.prototype.keyStrindex = 0;

                    KeyValue.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.KeyValue();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.key = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.value = $root.opentelemetry.proto.common.v1.AnyValue.decode(reader, reader.uint32());
                                    break;
                                }
                            case 3: {
                                    message.keyStrindex = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    KeyValue.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.common.v1.KeyValue)
                            return object;
                        let message = new $root.opentelemetry.proto.common.v1.KeyValue();
                        if (object.key != null)
                            message.key = String(object.key);
                        if (object.value != null) {
                            if (typeof object.value !== "object")
                                throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
                            message.value = $root.opentelemetry.proto.common.v1.AnyValue.fromObject(object.value);
                        }
                        if (object.keyStrindex != null)
                            message.keyStrindex = object.keyStrindex | 0;
                        return message;
                    };

                    KeyValue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.key = "";
                            object.value = null;
                            object.keyStrindex = 0;
                        }
                        if (message.key != null && message.hasOwnProperty("key"))
                            object.key = message.key;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = $root.opentelemetry.proto.common.v1.AnyValue.toObject(message.value, options);
                        if (message.keyStrindex != null && message.hasOwnProperty("keyStrindex"))
                            object.keyStrindex = message.keyStrindex;
                        return object;
                    };

                    KeyValue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return KeyValue;
                })();

                v1.InstrumentationScope = (function() {

                    function InstrumentationScope(properties) {
                        this.attributes = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    InstrumentationScope.prototype.name = "";
                    InstrumentationScope.prototype.version = "";
                    InstrumentationScope.prototype.attributes = $util.emptyArray;
                    InstrumentationScope.prototype.droppedAttributesCount = 0;

                    InstrumentationScope.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.InstrumentationScope();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.version = reader.string();
                                    break;
                                }
                            case 3: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 4: {
                                    message.droppedAttributesCount = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    InstrumentationScope.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.common.v1.InstrumentationScope)
                            return object;
                        let message = new $root.opentelemetry.proto.common.v1.InstrumentationScope();
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.version != null)
                            message.version = String(object.version);
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.droppedAttributesCount != null)
                            message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
                        return message;
                    };

                    InstrumentationScope.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.attributes = [];
                        if (options.defaults) {
                            object.name = "";
                            object.version = "";
                            object.droppedAttributesCount = 0;
                        }
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.version != null && message.hasOwnProperty("version"))
                            object.version = message.version;
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
                            object.droppedAttributesCount = message.droppedAttributesCount;
                        return object;
                    };

                    InstrumentationScope.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return InstrumentationScope;
                })();

                v1.EntityRef = (function() {

                    function EntityRef(properties) {
                        this.idKeys = [];
                        this.descriptionKeys = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    EntityRef.prototype.schemaUrl = "";
                    EntityRef.prototype.type = "";
                    EntityRef.prototype.idKeys = $util.emptyArray;
                    EntityRef.prototype.descriptionKeys = $util.emptyArray;

                    EntityRef.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.EntityRef();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.type = reader.string();
                                    break;
                                }
                            case 3: {
                                    if (!(message.idKeys && message.idKeys.length))
                                        message.idKeys = [];
                                    message.idKeys.push(reader.string());
                                    break;
                                }
                            case 4: {
                                    if (!(message.descriptionKeys && message.descriptionKeys.length))
                                        message.descriptionKeys = [];
                                    message.descriptionKeys.push(reader.string());
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    EntityRef.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.common.v1.EntityRef)
                            return object;
                        let message = new $root.opentelemetry.proto.common.v1.EntityRef();
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        if (object.type != null)
                            message.type = String(object.type);
                        if (object.idKeys) {
                            if (!Array.isArray(object.idKeys))
                                throw TypeError(".opentelemetry.proto.common.v1.EntityRef.idKeys: array expected");
                            message.idKeys = [];
                            for (let i = 0; i < object.idKeys.length; ++i)
                                message.idKeys[i] = String(object.idKeys[i]);
                        }
                        if (object.descriptionKeys) {
                            if (!Array.isArray(object.descriptionKeys))
                                throw TypeError(".opentelemetry.proto.common.v1.EntityRef.descriptionKeys: array expected");
                            message.descriptionKeys = [];
                            for (let i = 0; i < object.descriptionKeys.length; ++i)
                                message.descriptionKeys[i] = String(object.descriptionKeys[i]);
                        }
                        return message;
                    };

                    EntityRef.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.idKeys = [];
                            object.descriptionKeys = [];
                        }
                        if (options.defaults) {
                            object.schemaUrl = "";
                            object.type = "";
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        if (message.type != null && message.hasOwnProperty("type"))
                            object.type = message.type;
                        if (message.idKeys && message.idKeys.length) {
                            object.idKeys = [];
                            for (let j = 0; j < message.idKeys.length; ++j)
                                object.idKeys[j] = message.idKeys[j];
                        }
                        if (message.descriptionKeys && message.descriptionKeys.length) {
                            object.descriptionKeys = [];
                            for (let j = 0; j < message.descriptionKeys.length; ++j)
                                object.descriptionKeys[j] = message.descriptionKeys[j];
                        }
                        return object;
                    };

                    EntityRef.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return EntityRef;
                })();

                return v1;
            })();

            return common;
        })();

        proto.resource = (function() {

            const resource = {};

            resource.v1 = (function() {

                const v1 = {};

                v1.Resource = (function() {

                    function Resource(properties) {
                        this.attributes = [];
                        this.entityRefs = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Resource.prototype.attributes = $util.emptyArray;
                    Resource.prototype.droppedAttributesCount = 0;
                    Resource.prototype.entityRefs = $util.emptyArray;

                    Resource.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.resource.v1.Resource();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.droppedAttributesCount = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    if (!(message.entityRefs && message.entityRefs.length))
                                        message.entityRefs = [];
                                    message.entityRefs.push($root.opentelemetry.proto.common.v1.EntityRef.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Resource.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.resource.v1.Resource)
                            return object;
                        let message = new $root.opentelemetry.proto.resource.v1.Resource();
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.droppedAttributesCount != null)
                            message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
                        if (object.entityRefs) {
                            if (!Array.isArray(object.entityRefs))
                                throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: array expected");
                            message.entityRefs = [];
                            for (let i = 0; i < object.entityRefs.length; ++i) {
                                if (typeof object.entityRefs[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.resource.v1.Resource.entityRefs: object expected");
                                message.entityRefs[i] = $root.opentelemetry.proto.common.v1.EntityRef.fromObject(object.entityRefs[i]);
                            }
                        }
                        return message;
                    };

                    Resource.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.attributes = [];
                            object.entityRefs = [];
                        }
                        if (options.defaults)
                            object.droppedAttributesCount = 0;
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
                            object.droppedAttributesCount = message.droppedAttributesCount;
                        if (message.entityRefs && message.entityRefs.length) {
                            object.entityRefs = [];
                            for (let j = 0; j < message.entityRefs.length; ++j)
                                object.entityRefs[j] = $root.opentelemetry.proto.common.v1.EntityRef.toObject(message.entityRefs[j], options);
                        }
                        return object;
                    };

                    Resource.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Resource;
                })();

                return v1;
            })();

            return resource;
        })();

        proto.logs = (function() {

            const logs = {};

            logs.v1 = (function() {

                const v1 = {};

                v1.LogsData = (function() {

                    function LogsData(properties) {
                        this.resourceLogs = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    LogsData.prototype.resourceLogs = $util.emptyArray;

                    LogsData.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.LogsData();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.resourceLogs && message.resourceLogs.length))
                                        message.resourceLogs = [];
                                    message.resourceLogs.push($root.opentelemetry.proto.logs.v1.ResourceLogs.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    LogsData.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.logs.v1.LogsData)
                            return object;
                        let message = new $root.opentelemetry.proto.logs.v1.LogsData();
                        if (object.resourceLogs) {
                            if (!Array.isArray(object.resourceLogs))
                                throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
                            message.resourceLogs = [];
                            for (let i = 0; i < object.resourceLogs.length; ++i) {
                                if (typeof object.resourceLogs[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
                                message.resourceLogs[i] = $root.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(object.resourceLogs[i]);
                            }
                        }
                        return message;
                    };

                    LogsData.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.resourceLogs = [];
                        if (message.resourceLogs && message.resourceLogs.length) {
                            object.resourceLogs = [];
                            for (let j = 0; j < message.resourceLogs.length; ++j)
                                object.resourceLogs[j] = $root.opentelemetry.proto.logs.v1.ResourceLogs.toObject(message.resourceLogs[j], options);
                        }
                        return object;
                    };

                    LogsData.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return LogsData;
                })();

                v1.ResourceLogs = (function() {

                    function ResourceLogs(properties) {
                        this.scopeLogs = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ResourceLogs.prototype.resource = null;
                    ResourceLogs.prototype.scopeLogs = $util.emptyArray;
                    ResourceLogs.prototype.schemaUrl = "";

                    ResourceLogs.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.ResourceLogs();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.resource = $root.opentelemetry.proto.resource.v1.Resource.decode(reader, reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.scopeLogs && message.scopeLogs.length))
                                        message.scopeLogs = [];
                                    message.scopeLogs.push($root.opentelemetry.proto.logs.v1.ScopeLogs.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ResourceLogs.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.logs.v1.ResourceLogs)
                            return object;
                        let message = new $root.opentelemetry.proto.logs.v1.ResourceLogs();
                        if (object.resource != null) {
                            if (typeof object.resource !== "object")
                                throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
                            message.resource = $root.opentelemetry.proto.resource.v1.Resource.fromObject(object.resource);
                        }
                        if (object.scopeLogs) {
                            if (!Array.isArray(object.scopeLogs))
                                throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
                            message.scopeLogs = [];
                            for (let i = 0; i < object.scopeLogs.length; ++i) {
                                if (typeof object.scopeLogs[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
                                message.scopeLogs[i] = $root.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(object.scopeLogs[i]);
                            }
                        }
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        return message;
                    };

                    ResourceLogs.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.scopeLogs = [];
                        if (options.defaults) {
                            object.resource = null;
                            object.schemaUrl = "";
                        }
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            object.resource = $root.opentelemetry.proto.resource.v1.Resource.toObject(message.resource, options);
                        if (message.scopeLogs && message.scopeLogs.length) {
                            object.scopeLogs = [];
                            for (let j = 0; j < message.scopeLogs.length; ++j)
                                object.scopeLogs[j] = $root.opentelemetry.proto.logs.v1.ScopeLogs.toObject(message.scopeLogs[j], options);
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        return object;
                    };

                    ResourceLogs.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ResourceLogs;
                })();

                v1.ScopeLogs = (function() {

                    function ScopeLogs(properties) {
                        this.logRecords = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ScopeLogs.prototype.scope = null;
                    ScopeLogs.prototype.logRecords = $util.emptyArray;
                    ScopeLogs.prototype.schemaUrl = "";

                    ScopeLogs.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.ScopeLogs();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.decode(reader, reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.logRecords && message.logRecords.length))
                                        message.logRecords = [];
                                    message.logRecords.push($root.opentelemetry.proto.logs.v1.LogRecord.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ScopeLogs.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.logs.v1.ScopeLogs)
                            return object;
                        let message = new $root.opentelemetry.proto.logs.v1.ScopeLogs();
                        if (object.scope != null) {
                            if (typeof object.scope !== "object")
                                throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
                            message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(object.scope);
                        }
                        if (object.logRecords) {
                            if (!Array.isArray(object.logRecords))
                                throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
                            message.logRecords = [];
                            for (let i = 0; i < object.logRecords.length; ++i) {
                                if (typeof object.logRecords[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
                                message.logRecords[i] = $root.opentelemetry.proto.logs.v1.LogRecord.fromObject(object.logRecords[i]);
                            }
                        }
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        return message;
                    };

                    ScopeLogs.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.logRecords = [];
                        if (options.defaults) {
                            object.scope = null;
                            object.schemaUrl = "";
                        }
                        if (message.scope != null && message.hasOwnProperty("scope"))
                            object.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.toObject(message.scope, options);
                        if (message.logRecords && message.logRecords.length) {
                            object.logRecords = [];
                            for (let j = 0; j < message.logRecords.length; ++j)
                                object.logRecords[j] = $root.opentelemetry.proto.logs.v1.LogRecord.toObject(message.logRecords[j], options);
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        return object;
                    };

                    ScopeLogs.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ScopeLogs;
                })();

                v1.SeverityNumber = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0;
                    values[valuesById[1] = "SEVERITY_NUMBER_TRACE"] = 1;
                    values[valuesById[2] = "SEVERITY_NUMBER_TRACE2"] = 2;
                    values[valuesById[3] = "SEVERITY_NUMBER_TRACE3"] = 3;
                    values[valuesById[4] = "SEVERITY_NUMBER_TRACE4"] = 4;
                    values[valuesById[5] = "SEVERITY_NUMBER_DEBUG"] = 5;
                    values[valuesById[6] = "SEVERITY_NUMBER_DEBUG2"] = 6;
                    values[valuesById[7] = "SEVERITY_NUMBER_DEBUG3"] = 7;
                    values[valuesById[8] = "SEVERITY_NUMBER_DEBUG4"] = 8;
                    values[valuesById[9] = "SEVERITY_NUMBER_INFO"] = 9;
                    values[valuesById[10] = "SEVERITY_NUMBER_INFO2"] = 10;
                    values[valuesById[11] = "SEVERITY_NUMBER_INFO3"] = 11;
                    values[valuesById[12] = "SEVERITY_NUMBER_INFO4"] = 12;
                    values[valuesById[13] = "SEVERITY_NUMBER_WARN"] = 13;
                    values[valuesById[14] = "SEVERITY_NUMBER_WARN2"] = 14;
                    values[valuesById[15] = "SEVERITY_NUMBER_WARN3"] = 15;
                    values[valuesById[16] = "SEVERITY_NUMBER_WARN4"] = 16;
                    values[valuesById[17] = "SEVERITY_NUMBER_ERROR"] = 17;
                    values[valuesById[18] = "SEVERITY_NUMBER_ERROR2"] = 18;
                    values[valuesById[19] = "SEVERITY_NUMBER_ERROR3"] = 19;
                    values[valuesById[20] = "SEVERITY_NUMBER_ERROR4"] = 20;
                    values[valuesById[21] = "SEVERITY_NUMBER_FATAL"] = 21;
                    values[valuesById[22] = "SEVERITY_NUMBER_FATAL2"] = 22;
                    values[valuesById[23] = "SEVERITY_NUMBER_FATAL3"] = 23;
                    values[valuesById[24] = "SEVERITY_NUMBER_FATAL4"] = 24;
                    return values;
                })();

                v1.LogRecordFlags = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0;
                    values[valuesById[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255;
                    return values;
                })();

                v1.LogRecord = (function() {

                    function LogRecord(properties) {
                        this.attributes = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    LogRecord.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    LogRecord.prototype.observedTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    LogRecord.prototype.severityNumber = 0;
                    LogRecord.prototype.severityText = "";
                    LogRecord.prototype.body = null;
                    LogRecord.prototype.attributes = $util.emptyArray;
                    LogRecord.prototype.droppedAttributesCount = 0;
                    LogRecord.prototype.flags = 0;
                    LogRecord.prototype.traceId = $util.newBuffer([]);
                    LogRecord.prototype.spanId = $util.newBuffer([]);
                    LogRecord.prototype.eventName = "";

                    LogRecord.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.LogRecord();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.timeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 11: {
                                    message.observedTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 2: {
                                    message.severityNumber = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.severityText = reader.string();
                                    break;
                                }
                            case 5: {
                                    message.body = $root.opentelemetry.proto.common.v1.AnyValue.decode(reader, reader.uint32());
                                    break;
                                }
                            case 6: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 7: {
                                    message.droppedAttributesCount = reader.uint32();
                                    break;
                                }
                            case 8: {
                                    message.flags = reader.fixed32();
                                    break;
                                }
                            case 9: {
                                    message.traceId = reader.bytes();
                                    break;
                                }
                            case 10: {
                                    message.spanId = reader.bytes();
                                    break;
                                }
                            case 12: {
                                    message.eventName = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    LogRecord.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.logs.v1.LogRecord)
                            return object;
                        let message = new $root.opentelemetry.proto.logs.v1.LogRecord();
                        if (object.timeUnixNano != null)
                            if ($util.Long)
                                (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                            else if (typeof object.timeUnixNano === "string")
                                message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                            else if (typeof object.timeUnixNano === "number")
                                message.timeUnixNano = object.timeUnixNano;
                            else if (typeof object.timeUnixNano === "object")
                                message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                        if (object.observedTimeUnixNano != null)
                            if ($util.Long)
                                (message.observedTimeUnixNano = $util.Long.fromValue(object.observedTimeUnixNano)).unsigned = false;
                            else if (typeof object.observedTimeUnixNano === "string")
                                message.observedTimeUnixNano = parseInt(object.observedTimeUnixNano, 10);
                            else if (typeof object.observedTimeUnixNano === "number")
                                message.observedTimeUnixNano = object.observedTimeUnixNano;
                            else if (typeof object.observedTimeUnixNano === "object")
                                message.observedTimeUnixNano = new $util.LongBits(object.observedTimeUnixNano.low >>> 0, object.observedTimeUnixNano.high >>> 0).toNumber();
                        switch (object.severityNumber) {
                        default:
                            if (typeof object.severityNumber === "number") {
                                message.severityNumber = object.severityNumber;
                                break;
                            }
                            break;
                        case "SEVERITY_NUMBER_UNSPECIFIED":
                        case 0:
                            message.severityNumber = 0;
                            break;
                        case "SEVERITY_NUMBER_TRACE":
                        case 1:
                            message.severityNumber = 1;
                            break;
                        case "SEVERITY_NUMBER_TRACE2":
                        case 2:
                            message.severityNumber = 2;
                            break;
                        case "SEVERITY_NUMBER_TRACE3":
                        case 3:
                            message.severityNumber = 3;
                            break;
                        case "SEVERITY_NUMBER_TRACE4":
                        case 4:
                            message.severityNumber = 4;
                            break;
                        case "SEVERITY_NUMBER_DEBUG":
                        case 5:
                            message.severityNumber = 5;
                            break;
                        case "SEVERITY_NUMBER_DEBUG2":
                        case 6:
                            message.severityNumber = 6;
                            break;
                        case "SEVERITY_NUMBER_DEBUG3":
                        case 7:
                            message.severityNumber = 7;
                            break;
                        case "SEVERITY_NUMBER_DEBUG4":
                        case 8:
                            message.severityNumber = 8;
                            break;
                        case "SEVERITY_NUMBER_INFO":
                        case 9:
                            message.severityNumber = 9;
                            break;
                        case "SEVERITY_NUMBER_INFO2":
                        case 10:
                            message.severityNumber = 10;
                            break;
                        case "SEVERITY_NUMBER_INFO3":
                        case 11:
                            message.severityNumber = 11;
                            break;
                        case "SEVERITY_NUMBER_INFO4":
                        case 12:
                            message.severityNumber = 12;
                            break;
                        case "SEVERITY_NUMBER_WARN":
                        case 13:
                            message.severityNumber = 13;
                            break;
                        case "SEVERITY_NUMBER_WARN2":
                        case 14:
                            message.severityNumber = 14;
                            break;
                        case "SEVERITY_NUMBER_WARN3":
                        case 15:
                            message.severityNumber = 15;
                            break;
                        case "SEVERITY_NUMBER_WARN4":
                        case 16:
                            message.severityNumber = 16;
                            break;
                        case "SEVERITY_NUMBER_ERROR":
                        case 17:
                            message.severityNumber = 17;
                            break;
                        case "SEVERITY_NUMBER_ERROR2":
                        case 18:
                            message.severityNumber = 18;
                            break;
                        case "SEVERITY_NUMBER_ERROR3":
                        case 19:
                            message.severityNumber = 19;
                            break;
                        case "SEVERITY_NUMBER_ERROR4":
                        case 20:
                            message.severityNumber = 20;
                            break;
                        case "SEVERITY_NUMBER_FATAL":
                        case 21:
                            message.severityNumber = 21;
                            break;
                        case "SEVERITY_NUMBER_FATAL2":
                        case 22:
                            message.severityNumber = 22;
                            break;
                        case "SEVERITY_NUMBER_FATAL3":
                        case 23:
                            message.severityNumber = 23;
                            break;
                        case "SEVERITY_NUMBER_FATAL4":
                        case 24:
                            message.severityNumber = 24;
                            break;
                        }
                        if (object.severityText != null)
                            message.severityText = String(object.severityText);
                        if (object.body != null) {
                            if (typeof object.body !== "object")
                                throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
                            message.body = $root.opentelemetry.proto.common.v1.AnyValue.fromObject(object.body);
                        }
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.droppedAttributesCount != null)
                            message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.traceId != null)
                            if (typeof object.traceId === "string")
                                $util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
                            else if (object.traceId.length >= 0)
                                message.traceId = object.traceId;
                        if (object.spanId != null)
                            if (typeof object.spanId === "string")
                                $util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
                            else if (object.spanId.length >= 0)
                                message.spanId = object.spanId;
                        if (object.eventName != null)
                            message.eventName = String(object.eventName);
                        return message;
                    };

                    LogRecord.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.attributes = [];
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeUnixNano = options.longs === String ? "0" : 0;
                            object.severityNumber = options.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0;
                            object.severityText = "";
                            object.body = null;
                            object.droppedAttributesCount = 0;
                            object.flags = 0;
                            if (options.bytes === String)
                                object.traceId = "";
                            else {
                                object.traceId = [];
                                if (options.bytes !== Array)
                                    object.traceId = $util.newBuffer(object.traceId);
                            }
                            if (options.bytes === String)
                                object.spanId = "";
                            else {
                                object.spanId = [];
                                if (options.bytes !== Array)
                                    object.spanId = $util.newBuffer(object.spanId);
                            }
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.observedTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.observedTimeUnixNano = options.longs === String ? "0" : 0;
                            object.eventName = "";
                        }
                        if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                            if (typeof message.timeUnixNano === "number")
                                object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                            else
                                object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                        if (message.severityNumber != null && message.hasOwnProperty("severityNumber"))
                            object.severityNumber = options.enums === String ? $root.opentelemetry.proto.logs.v1.SeverityNumber[message.severityNumber] === undefined ? message.severityNumber : $root.opentelemetry.proto.logs.v1.SeverityNumber[message.severityNumber] : message.severityNumber;
                        if (message.severityText != null && message.hasOwnProperty("severityText"))
                            object.severityText = message.severityText;
                        if (message.body != null && message.hasOwnProperty("body"))
                            object.body = $root.opentelemetry.proto.common.v1.AnyValue.toObject(message.body, options);
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
                            object.droppedAttributesCount = message.droppedAttributesCount;
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        if (message.traceId != null && message.hasOwnProperty("traceId"))
                            object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
                        if (message.spanId != null && message.hasOwnProperty("spanId"))
                            object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
                        if (message.observedTimeUnixNano != null && message.hasOwnProperty("observedTimeUnixNano"))
                            if (typeof message.observedTimeUnixNano === "number")
                                object.observedTimeUnixNano = options.longs === String ? String(message.observedTimeUnixNano) : message.observedTimeUnixNano;
                            else
                                object.observedTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.observedTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.observedTimeUnixNano.low >>> 0, message.observedTimeUnixNano.high >>> 0).toNumber() : message.observedTimeUnixNano;
                        if (message.eventName != null && message.hasOwnProperty("eventName"))
                            object.eventName = message.eventName;
                        return object;
                    };

                    LogRecord.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return LogRecord;
                })();

                return v1;
            })();

            return logs;
        })();

        proto.metrics = (function() {

            const metrics = {};

            metrics.v1 = (function() {

                const v1 = {};

                v1.MetricsData = (function() {

                    function MetricsData(properties) {
                        this.resourceMetrics = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    MetricsData.prototype.resourceMetrics = $util.emptyArray;

                    MetricsData.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.MetricsData();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.resourceMetrics && message.resourceMetrics.length))
                                        message.resourceMetrics = [];
                                    message.resourceMetrics.push($root.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    MetricsData.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.MetricsData)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.MetricsData();
                        if (object.resourceMetrics) {
                            if (!Array.isArray(object.resourceMetrics))
                                throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
                            message.resourceMetrics = [];
                            for (let i = 0; i < object.resourceMetrics.length; ++i) {
                                if (typeof object.resourceMetrics[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
                                message.resourceMetrics[i] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(object.resourceMetrics[i]);
                            }
                        }
                        return message;
                    };

                    MetricsData.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.resourceMetrics = [];
                        if (message.resourceMetrics && message.resourceMetrics.length) {
                            object.resourceMetrics = [];
                            for (let j = 0; j < message.resourceMetrics.length; ++j)
                                object.resourceMetrics[j] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(message.resourceMetrics[j], options);
                        }
                        return object;
                    };

                    MetricsData.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MetricsData;
                })();

                v1.ResourceMetrics = (function() {

                    function ResourceMetrics(properties) {
                        this.scopeMetrics = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ResourceMetrics.prototype.resource = null;
                    ResourceMetrics.prototype.scopeMetrics = $util.emptyArray;
                    ResourceMetrics.prototype.schemaUrl = "";

                    ResourceMetrics.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ResourceMetrics();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.resource = $root.opentelemetry.proto.resource.v1.Resource.decode(reader, reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.scopeMetrics && message.scopeMetrics.length))
                                        message.scopeMetrics = [];
                                    message.scopeMetrics.push($root.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ResourceMetrics.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.ResourceMetrics)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.ResourceMetrics();
                        if (object.resource != null) {
                            if (typeof object.resource !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
                            message.resource = $root.opentelemetry.proto.resource.v1.Resource.fromObject(object.resource);
                        }
                        if (object.scopeMetrics) {
                            if (!Array.isArray(object.scopeMetrics))
                                throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
                            message.scopeMetrics = [];
                            for (let i = 0; i < object.scopeMetrics.length; ++i) {
                                if (typeof object.scopeMetrics[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
                                message.scopeMetrics[i] = $root.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(object.scopeMetrics[i]);
                            }
                        }
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        return message;
                    };

                    ResourceMetrics.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.scopeMetrics = [];
                        if (options.defaults) {
                            object.resource = null;
                            object.schemaUrl = "";
                        }
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            object.resource = $root.opentelemetry.proto.resource.v1.Resource.toObject(message.resource, options);
                        if (message.scopeMetrics && message.scopeMetrics.length) {
                            object.scopeMetrics = [];
                            for (let j = 0; j < message.scopeMetrics.length; ++j)
                                object.scopeMetrics[j] = $root.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(message.scopeMetrics[j], options);
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        return object;
                    };

                    ResourceMetrics.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ResourceMetrics;
                })();

                v1.ScopeMetrics = (function() {

                    function ScopeMetrics(properties) {
                        this.metrics = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ScopeMetrics.prototype.scope = null;
                    ScopeMetrics.prototype.metrics = $util.emptyArray;
                    ScopeMetrics.prototype.schemaUrl = "";

                    ScopeMetrics.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ScopeMetrics();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.decode(reader, reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.metrics && message.metrics.length))
                                        message.metrics = [];
                                    message.metrics.push($root.opentelemetry.proto.metrics.v1.Metric.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.schemaUrl = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ScopeMetrics.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.ScopeMetrics)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.ScopeMetrics();
                        if (object.scope != null) {
                            if (typeof object.scope !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
                            message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(object.scope);
                        }
                        if (object.metrics) {
                            if (!Array.isArray(object.metrics))
                                throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
                            message.metrics = [];
                            for (let i = 0; i < object.metrics.length; ++i) {
                                if (typeof object.metrics[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
                                message.metrics[i] = $root.opentelemetry.proto.metrics.v1.Metric.fromObject(object.metrics[i]);
                            }
                        }
                        if (object.schemaUrl != null)
                            message.schemaUrl = String(object.schemaUrl);
                        return message;
                    };

                    ScopeMetrics.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.metrics = [];
                        if (options.defaults) {
                            object.scope = null;
                            object.schemaUrl = "";
                        }
                        if (message.scope != null && message.hasOwnProperty("scope"))
                            object.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.toObject(message.scope, options);
                        if (message.metrics && message.metrics.length) {
                            object.metrics = [];
                            for (let j = 0; j < message.metrics.length; ++j)
                                object.metrics[j] = $root.opentelemetry.proto.metrics.v1.Metric.toObject(message.metrics[j], options);
                        }
                        if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
                            object.schemaUrl = message.schemaUrl;
                        return object;
                    };

                    ScopeMetrics.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ScopeMetrics;
                })();

                v1.Metric = (function() {

                    function Metric(properties) {
                        this.metadata = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Metric.prototype.name = "";
                    Metric.prototype.description = "";
                    Metric.prototype.unit = "";
                    Metric.prototype.gauge = null;
                    Metric.prototype.sum = null;
                    Metric.prototype.histogram = null;
                    Metric.prototype.exponentialHistogram = null;
                    Metric.prototype.summary = null;
                    Metric.prototype.metadata = $util.emptyArray;

                    let $oneOfFields;

                    Object.defineProperty(Metric.prototype, "data", {
                        get: $util.oneOfGetter($oneOfFields = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    Metric.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Metric();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.description = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.unit = reader.string();
                                    break;
                                }
                            case 5: {
                                    message.gauge = $root.opentelemetry.proto.metrics.v1.Gauge.decode(reader, reader.uint32());
                                    break;
                                }
                            case 7: {
                                    message.sum = $root.opentelemetry.proto.metrics.v1.Sum.decode(reader, reader.uint32());
                                    break;
                                }
                            case 9: {
                                    message.histogram = $root.opentelemetry.proto.metrics.v1.Histogram.decode(reader, reader.uint32());
                                    break;
                                }
                            case 10: {
                                    message.exponentialHistogram = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode(reader, reader.uint32());
                                    break;
                                }
                            case 11: {
                                    message.summary = $root.opentelemetry.proto.metrics.v1.Summary.decode(reader, reader.uint32());
                                    break;
                                }
                            case 12: {
                                    if (!(message.metadata && message.metadata.length))
                                        message.metadata = [];
                                    message.metadata.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Metric.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.Metric)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.Metric();
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.description != null)
                            message.description = String(object.description);
                        if (object.unit != null)
                            message.unit = String(object.unit);
                        if (object.gauge != null) {
                            if (typeof object.gauge !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
                            message.gauge = $root.opentelemetry.proto.metrics.v1.Gauge.fromObject(object.gauge);
                        }
                        if (object.sum != null) {
                            if (typeof object.sum !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
                            message.sum = $root.opentelemetry.proto.metrics.v1.Sum.fromObject(object.sum);
                        }
                        if (object.histogram != null) {
                            if (typeof object.histogram !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
                            message.histogram = $root.opentelemetry.proto.metrics.v1.Histogram.fromObject(object.histogram);
                        }
                        if (object.exponentialHistogram != null) {
                            if (typeof object.exponentialHistogram !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
                            message.exponentialHistogram = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject(object.exponentialHistogram);
                        }
                        if (object.summary != null) {
                            if (typeof object.summary !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
                            message.summary = $root.opentelemetry.proto.metrics.v1.Summary.fromObject(object.summary);
                        }
                        if (object.metadata) {
                            if (!Array.isArray(object.metadata))
                                throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: array expected");
                            message.metadata = [];
                            for (let i = 0; i < object.metadata.length; ++i) {
                                if (typeof object.metadata[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.Metric.metadata: object expected");
                                message.metadata[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.metadata[i]);
                            }
                        }
                        return message;
                    };

                    Metric.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.metadata = [];
                        if (options.defaults) {
                            object.name = "";
                            object.description = "";
                            object.unit = "";
                        }
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.description != null && message.hasOwnProperty("description"))
                            object.description = message.description;
                        if (message.unit != null && message.hasOwnProperty("unit"))
                            object.unit = message.unit;
                        if (message.gauge != null && message.hasOwnProperty("gauge")) {
                            object.gauge = $root.opentelemetry.proto.metrics.v1.Gauge.toObject(message.gauge, options);
                            if (options.oneofs)
                                object.data = "gauge";
                        }
                        if (message.sum != null && message.hasOwnProperty("sum")) {
                            object.sum = $root.opentelemetry.proto.metrics.v1.Sum.toObject(message.sum, options);
                            if (options.oneofs)
                                object.data = "sum";
                        }
                        if (message.histogram != null && message.hasOwnProperty("histogram")) {
                            object.histogram = $root.opentelemetry.proto.metrics.v1.Histogram.toObject(message.histogram, options);
                            if (options.oneofs)
                                object.data = "histogram";
                        }
                        if (message.exponentialHistogram != null && message.hasOwnProperty("exponentialHistogram")) {
                            object.exponentialHistogram = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject(message.exponentialHistogram, options);
                            if (options.oneofs)
                                object.data = "exponentialHistogram";
                        }
                        if (message.summary != null && message.hasOwnProperty("summary")) {
                            object.summary = $root.opentelemetry.proto.metrics.v1.Summary.toObject(message.summary, options);
                            if (options.oneofs)
                                object.data = "summary";
                        }
                        if (message.metadata && message.metadata.length) {
                            object.metadata = [];
                            for (let j = 0; j < message.metadata.length; ++j)
                                object.metadata[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.metadata[j], options);
                        }
                        return object;
                    };

                    Metric.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Metric;
                })();

                v1.Gauge = (function() {

                    function Gauge(properties) {
                        this.dataPoints = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Gauge.prototype.dataPoints = $util.emptyArray;

                    Gauge.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Gauge();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.dataPoints && message.dataPoints.length))
                                        message.dataPoints = [];
                                    message.dataPoints.push($root.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Gauge.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.Gauge)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.Gauge();
                        if (object.dataPoints) {
                            if (!Array.isArray(object.dataPoints))
                                throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
                            message.dataPoints = [];
                            for (let i = 0; i < object.dataPoints.length; ++i) {
                                if (typeof object.dataPoints[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
                                message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(object.dataPoints[i]);
                            }
                        }
                        return message;
                    };

                    Gauge.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.dataPoints = [];
                        if (message.dataPoints && message.dataPoints.length) {
                            object.dataPoints = [];
                            for (let j = 0; j < message.dataPoints.length; ++j)
                                object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(message.dataPoints[j], options);
                        }
                        return object;
                    };

                    Gauge.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Gauge;
                })();

                v1.Sum = (function() {

                    function Sum(properties) {
                        this.dataPoints = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Sum.prototype.dataPoints = $util.emptyArray;
                    Sum.prototype.aggregationTemporality = 0;
                    Sum.prototype.isMonotonic = false;

                    Sum.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Sum();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.dataPoints && message.dataPoints.length))
                                        message.dataPoints = [];
                                    message.dataPoints.push($root.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.aggregationTemporality = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.isMonotonic = reader.bool();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Sum.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.Sum)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.Sum();
                        if (object.dataPoints) {
                            if (!Array.isArray(object.dataPoints))
                                throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
                            message.dataPoints = [];
                            for (let i = 0; i < object.dataPoints.length; ++i) {
                                if (typeof object.dataPoints[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
                                message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(object.dataPoints[i]);
                            }
                        }
                        switch (object.aggregationTemporality) {
                        default:
                            if (typeof object.aggregationTemporality === "number") {
                                message.aggregationTemporality = object.aggregationTemporality;
                                break;
                            }
                            break;
                        case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                        case 0:
                            message.aggregationTemporality = 0;
                            break;
                        case "AGGREGATION_TEMPORALITY_DELTA":
                        case 1:
                            message.aggregationTemporality = 1;
                            break;
                        case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                        case 2:
                            message.aggregationTemporality = 2;
                            break;
                        }
                        if (object.isMonotonic != null)
                            message.isMonotonic = Boolean(object.isMonotonic);
                        return message;
                    };

                    Sum.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.dataPoints = [];
                        if (options.defaults) {
                            object.aggregationTemporality = options.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                            object.isMonotonic = false;
                        }
                        if (message.dataPoints && message.dataPoints.length) {
                            object.dataPoints = [];
                            for (let j = 0; j < message.dataPoints.length; ++j)
                                object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(message.dataPoints[j], options);
                        }
                        if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
                            object.aggregationTemporality = options.enums === String ? $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] === undefined ? message.aggregationTemporality : $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] : message.aggregationTemporality;
                        if (message.isMonotonic != null && message.hasOwnProperty("isMonotonic"))
                            object.isMonotonic = message.isMonotonic;
                        return object;
                    };

                    Sum.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Sum;
                })();

                v1.Histogram = (function() {

                    function Histogram(properties) {
                        this.dataPoints = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Histogram.prototype.dataPoints = $util.emptyArray;
                    Histogram.prototype.aggregationTemporality = 0;

                    Histogram.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Histogram();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.dataPoints && message.dataPoints.length))
                                        message.dataPoints = [];
                                    message.dataPoints.push($root.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.aggregationTemporality = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Histogram.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.Histogram)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.Histogram();
                        if (object.dataPoints) {
                            if (!Array.isArray(object.dataPoints))
                                throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
                            message.dataPoints = [];
                            for (let i = 0; i < object.dataPoints.length; ++i) {
                                if (typeof object.dataPoints[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
                                message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(object.dataPoints[i]);
                            }
                        }
                        switch (object.aggregationTemporality) {
                        default:
                            if (typeof object.aggregationTemporality === "number") {
                                message.aggregationTemporality = object.aggregationTemporality;
                                break;
                            }
                            break;
                        case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                        case 0:
                            message.aggregationTemporality = 0;
                            break;
                        case "AGGREGATION_TEMPORALITY_DELTA":
                        case 1:
                            message.aggregationTemporality = 1;
                            break;
                        case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                        case 2:
                            message.aggregationTemporality = 2;
                            break;
                        }
                        return message;
                    };

                    Histogram.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.dataPoints = [];
                        if (options.defaults)
                            object.aggregationTemporality = options.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                        if (message.dataPoints && message.dataPoints.length) {
                            object.dataPoints = [];
                            for (let j = 0; j < message.dataPoints.length; ++j)
                                object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(message.dataPoints[j], options);
                        }
                        if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
                            object.aggregationTemporality = options.enums === String ? $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] === undefined ? message.aggregationTemporality : $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] : message.aggregationTemporality;
                        return object;
                    };

                    Histogram.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Histogram;
                })();

                v1.ExponentialHistogram = (function() {

                    function ExponentialHistogram(properties) {
                        this.dataPoints = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ExponentialHistogram.prototype.dataPoints = $util.emptyArray;
                    ExponentialHistogram.prototype.aggregationTemporality = 0;

                    ExponentialHistogram.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogram();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.dataPoints && message.dataPoints.length))
                                        message.dataPoints = [];
                                    message.dataPoints.push($root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.aggregationTemporality = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ExponentialHistogram.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.ExponentialHistogram)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogram();
                        if (object.dataPoints) {
                            if (!Array.isArray(object.dataPoints))
                                throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
                            message.dataPoints = [];
                            for (let i = 0; i < object.dataPoints.length; ++i) {
                                if (typeof object.dataPoints[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
                                message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(object.dataPoints[i]);
                            }
                        }
                        switch (object.aggregationTemporality) {
                        default:
                            if (typeof object.aggregationTemporality === "number") {
                                message.aggregationTemporality = object.aggregationTemporality;
                                break;
                            }
                            break;
                        case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
                        case 0:
                            message.aggregationTemporality = 0;
                            break;
                        case "AGGREGATION_TEMPORALITY_DELTA":
                        case 1:
                            message.aggregationTemporality = 1;
                            break;
                        case "AGGREGATION_TEMPORALITY_CUMULATIVE":
                        case 2:
                            message.aggregationTemporality = 2;
                            break;
                        }
                        return message;
                    };

                    ExponentialHistogram.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.dataPoints = [];
                        if (options.defaults)
                            object.aggregationTemporality = options.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
                        if (message.dataPoints && message.dataPoints.length) {
                            object.dataPoints = [];
                            for (let j = 0; j < message.dataPoints.length; ++j)
                                object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(message.dataPoints[j], options);
                        }
                        if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
                            object.aggregationTemporality = options.enums === String ? $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] === undefined ? message.aggregationTemporality : $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] : message.aggregationTemporality;
                        return object;
                    };

                    ExponentialHistogram.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ExponentialHistogram;
                })();

                v1.Summary = (function() {

                    function Summary(properties) {
                        this.dataPoints = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Summary.prototype.dataPoints = $util.emptyArray;

                    Summary.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Summary();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.dataPoints && message.dataPoints.length))
                                        message.dataPoints = [];
                                    message.dataPoints.push($root.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Summary.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.Summary)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.Summary();
                        if (object.dataPoints) {
                            if (!Array.isArray(object.dataPoints))
                                throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
                            message.dataPoints = [];
                            for (let i = 0; i < object.dataPoints.length; ++i) {
                                if (typeof object.dataPoints[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
                                message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(object.dataPoints[i]);
                            }
                        }
                        return message;
                    };

                    Summary.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.dataPoints = [];
                        if (message.dataPoints && message.dataPoints.length) {
                            object.dataPoints = [];
                            for (let j = 0; j < message.dataPoints.length; ++j)
                                object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(message.dataPoints[j], options);
                        }
                        return object;
                    };

                    Summary.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Summary;
                })();

                v1.AggregationTemporality = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0;
                    values[valuesById[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1;
                    values[valuesById[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2;
                    return values;
                })();

                v1.DataPointFlags = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0;
                    values[valuesById[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1;
                    return values;
                })();

                v1.NumberDataPoint = (function() {

                    function NumberDataPoint(properties) {
                        this.attributes = [];
                        this.exemplars = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    NumberDataPoint.prototype.attributes = $util.emptyArray;
                    NumberDataPoint.prototype.startTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    NumberDataPoint.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    NumberDataPoint.prototype.asDouble = null;
                    NumberDataPoint.prototype.asInt = null;
                    NumberDataPoint.prototype.exemplars = $util.emptyArray;
                    NumberDataPoint.prototype.flags = 0;

                    let $oneOfFields;

                    Object.defineProperty(NumberDataPoint.prototype, "value", {
                        get: $util.oneOfGetter($oneOfFields = ["asDouble", "asInt"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    NumberDataPoint.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.NumberDataPoint();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 7: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.startTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 3: {
                                    message.timeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 4: {
                                    message.asDouble = reader.double();
                                    break;
                                }
                            case 6: {
                                    message.asInt = reader.sfixed64();
                                    break;
                                }
                            case 5: {
                                    if (!(message.exemplars && message.exemplars.length))
                                        message.exemplars = [];
                                    message.exemplars.push($root.opentelemetry.proto.metrics.v1.Exemplar.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 8: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    NumberDataPoint.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.NumberDataPoint)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.NumberDataPoint();
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.startTimeUnixNano != null)
                            if ($util.Long)
                                (message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
                            else if (typeof object.startTimeUnixNano === "string")
                                message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
                            else if (typeof object.startTimeUnixNano === "number")
                                message.startTimeUnixNano = object.startTimeUnixNano;
                            else if (typeof object.startTimeUnixNano === "object")
                                message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
                        if (object.timeUnixNano != null)
                            if ($util.Long)
                                (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                            else if (typeof object.timeUnixNano === "string")
                                message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                            else if (typeof object.timeUnixNano === "number")
                                message.timeUnixNano = object.timeUnixNano;
                            else if (typeof object.timeUnixNano === "object")
                                message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                        if (object.asDouble != null)
                            message.asDouble = Number(object.asDouble);
                        if (object.asInt != null)
                            if ($util.Long)
                                (message.asInt = $util.Long.fromValue(object.asInt)).unsigned = false;
                            else if (typeof object.asInt === "string")
                                message.asInt = parseInt(object.asInt, 10);
                            else if (typeof object.asInt === "number")
                                message.asInt = object.asInt;
                            else if (typeof object.asInt === "object")
                                message.asInt = new $util.LongBits(object.asInt.low >>> 0, object.asInt.high >>> 0).toNumber();
                        if (object.exemplars) {
                            if (!Array.isArray(object.exemplars))
                                throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
                            message.exemplars = [];
                            for (let i = 0; i < object.exemplars.length; ++i) {
                                if (typeof object.exemplars[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
                                message.exemplars[i] = $root.opentelemetry.proto.metrics.v1.Exemplar.fromObject(object.exemplars[i]);
                            }
                        }
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        return message;
                    };

                    NumberDataPoint.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.exemplars = [];
                            object.attributes = [];
                        }
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeUnixNano = options.longs === String ? "0" : 0;
                            object.flags = 0;
                        }
                        if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
                            if (typeof message.startTimeUnixNano === "number")
                                object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
                            else
                                object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
                        if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                            if (typeof message.timeUnixNano === "number")
                                object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                            else
                                object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                        if (message.asDouble != null && message.hasOwnProperty("asDouble")) {
                            object.asDouble = options.json && !isFinite(message.asDouble) ? String(message.asDouble) : message.asDouble;
                            if (options.oneofs)
                                object.value = "asDouble";
                        }
                        if (message.exemplars && message.exemplars.length) {
                            object.exemplars = [];
                            for (let j = 0; j < message.exemplars.length; ++j)
                                object.exemplars[j] = $root.opentelemetry.proto.metrics.v1.Exemplar.toObject(message.exemplars[j], options);
                        }
                        if (message.asInt != null && message.hasOwnProperty("asInt")) {
                            if (typeof message.asInt === "number")
                                object.asInt = options.longs === String ? String(message.asInt) : message.asInt;
                            else
                                object.asInt = options.longs === String ? $util.Long.prototype.toString.call(message.asInt) : options.longs === Number ? new $util.LongBits(message.asInt.low >>> 0, message.asInt.high >>> 0).toNumber() : message.asInt;
                            if (options.oneofs)
                                object.value = "asInt";
                        }
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        return object;
                    };

                    NumberDataPoint.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return NumberDataPoint;
                })();

                v1.HistogramDataPoint = (function() {

                    function HistogramDataPoint(properties) {
                        this.attributes = [];
                        this.bucketCounts = [];
                        this.explicitBounds = [];
                        this.exemplars = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    HistogramDataPoint.prototype.attributes = $util.emptyArray;
                    HistogramDataPoint.prototype.startTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    HistogramDataPoint.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    HistogramDataPoint.prototype.count = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    HistogramDataPoint.prototype.sum = null;
                    HistogramDataPoint.prototype.bucketCounts = $util.emptyArray;
                    HistogramDataPoint.prototype.explicitBounds = $util.emptyArray;
                    HistogramDataPoint.prototype.exemplars = $util.emptyArray;
                    HistogramDataPoint.prototype.flags = 0;
                    HistogramDataPoint.prototype.min = null;
                    HistogramDataPoint.prototype.max = null;

                    let $oneOfFields;

                    Object.defineProperty(HistogramDataPoint.prototype, "_sum", {
                        get: $util.oneOfGetter($oneOfFields = ["sum"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    Object.defineProperty(HistogramDataPoint.prototype, "_min", {
                        get: $util.oneOfGetter($oneOfFields = ["min"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    Object.defineProperty(HistogramDataPoint.prototype, "_max", {
                        get: $util.oneOfGetter($oneOfFields = ["max"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    HistogramDataPoint.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.HistogramDataPoint();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 9: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.startTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 3: {
                                    message.timeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 4: {
                                    message.count = reader.fixed64();
                                    break;
                                }
                            case 5: {
                                    message.sum = reader.double();
                                    break;
                                }
                            case 6: {
                                    if (!(message.bucketCounts && message.bucketCounts.length))
                                        message.bucketCounts = [];
                                    if ((tag & 7) === 2) {
                                        let end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.bucketCounts.push(reader.fixed64());
                                    } else
                                        message.bucketCounts.push(reader.fixed64());
                                    break;
                                }
                            case 7: {
                                    if (!(message.explicitBounds && message.explicitBounds.length))
                                        message.explicitBounds = [];
                                    if ((tag & 7) === 2) {
                                        let end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.explicitBounds.push(reader.double());
                                    } else
                                        message.explicitBounds.push(reader.double());
                                    break;
                                }
                            case 8: {
                                    if (!(message.exemplars && message.exemplars.length))
                                        message.exemplars = [];
                                    message.exemplars.push($root.opentelemetry.proto.metrics.v1.Exemplar.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 10: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            case 11: {
                                    message.min = reader.double();
                                    break;
                                }
                            case 12: {
                                    message.max = reader.double();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    HistogramDataPoint.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.HistogramDataPoint)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.HistogramDataPoint();
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.startTimeUnixNano != null)
                            if ($util.Long)
                                (message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
                            else if (typeof object.startTimeUnixNano === "string")
                                message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
                            else if (typeof object.startTimeUnixNano === "number")
                                message.startTimeUnixNano = object.startTimeUnixNano;
                            else if (typeof object.startTimeUnixNano === "object")
                                message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
                        if (object.timeUnixNano != null)
                            if ($util.Long)
                                (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                            else if (typeof object.timeUnixNano === "string")
                                message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                            else if (typeof object.timeUnixNano === "number")
                                message.timeUnixNano = object.timeUnixNano;
                            else if (typeof object.timeUnixNano === "object")
                                message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                        if (object.count != null)
                            if ($util.Long)
                                (message.count = $util.Long.fromValue(object.count)).unsigned = false;
                            else if (typeof object.count === "string")
                                message.count = parseInt(object.count, 10);
                            else if (typeof object.count === "number")
                                message.count = object.count;
                            else if (typeof object.count === "object")
                                message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber();
                        if (object.sum != null)
                            message.sum = Number(object.sum);
                        if (object.bucketCounts) {
                            if (!Array.isArray(object.bucketCounts))
                                throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
                            message.bucketCounts = [];
                            for (let i = 0; i < object.bucketCounts.length; ++i)
                                if ($util.Long)
                                    (message.bucketCounts[i] = $util.Long.fromValue(object.bucketCounts[i])).unsigned = false;
                                else if (typeof object.bucketCounts[i] === "string")
                                    message.bucketCounts[i] = parseInt(object.bucketCounts[i], 10);
                                else if (typeof object.bucketCounts[i] === "number")
                                    message.bucketCounts[i] = object.bucketCounts[i];
                                else if (typeof object.bucketCounts[i] === "object")
                                    message.bucketCounts[i] = new $util.LongBits(object.bucketCounts[i].low >>> 0, object.bucketCounts[i].high >>> 0).toNumber();
                        }
                        if (object.explicitBounds) {
                            if (!Array.isArray(object.explicitBounds))
                                throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
                            message.explicitBounds = [];
                            for (let i = 0; i < object.explicitBounds.length; ++i)
                                message.explicitBounds[i] = Number(object.explicitBounds[i]);
                        }
                        if (object.exemplars) {
                            if (!Array.isArray(object.exemplars))
                                throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
                            message.exemplars = [];
                            for (let i = 0; i < object.exemplars.length; ++i) {
                                if (typeof object.exemplars[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
                                message.exemplars[i] = $root.opentelemetry.proto.metrics.v1.Exemplar.fromObject(object.exemplars[i]);
                            }
                        }
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.min != null)
                            message.min = Number(object.min);
                        if (object.max != null)
                            message.max = Number(object.max);
                        return message;
                    };

                    HistogramDataPoint.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.bucketCounts = [];
                            object.explicitBounds = [];
                            object.exemplars = [];
                            object.attributes = [];
                        }
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.count = options.longs === String ? "0" : 0;
                            object.flags = 0;
                        }
                        if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
                            if (typeof message.startTimeUnixNano === "number")
                                object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
                            else
                                object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
                        if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                            if (typeof message.timeUnixNano === "number")
                                object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                            else
                                object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                        if (message.count != null && message.hasOwnProperty("count"))
                            if (typeof message.count === "number")
                                object.count = options.longs === String ? String(message.count) : message.count;
                            else
                                object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber() : message.count;
                        if (message.sum != null && message.hasOwnProperty("sum")) {
                            object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
                            if (options.oneofs)
                                object._sum = "sum";
                        }
                        if (message.bucketCounts && message.bucketCounts.length) {
                            object.bucketCounts = [];
                            for (let j = 0; j < message.bucketCounts.length; ++j)
                                if (typeof message.bucketCounts[j] === "number")
                                    object.bucketCounts[j] = options.longs === String ? String(message.bucketCounts[j]) : message.bucketCounts[j];
                                else
                                    object.bucketCounts[j] = options.longs === String ? $util.Long.prototype.toString.call(message.bucketCounts[j]) : options.longs === Number ? new $util.LongBits(message.bucketCounts[j].low >>> 0, message.bucketCounts[j].high >>> 0).toNumber() : message.bucketCounts[j];
                        }
                        if (message.explicitBounds && message.explicitBounds.length) {
                            object.explicitBounds = [];
                            for (let j = 0; j < message.explicitBounds.length; ++j)
                                object.explicitBounds[j] = options.json && !isFinite(message.explicitBounds[j]) ? String(message.explicitBounds[j]) : message.explicitBounds[j];
                        }
                        if (message.exemplars && message.exemplars.length) {
                            object.exemplars = [];
                            for (let j = 0; j < message.exemplars.length; ++j)
                                object.exemplars[j] = $root.opentelemetry.proto.metrics.v1.Exemplar.toObject(message.exemplars[j], options);
                        }
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        if (message.min != null && message.hasOwnProperty("min")) {
                            object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
                            if (options.oneofs)
                                object._min = "min";
                        }
                        if (message.max != null && message.hasOwnProperty("max")) {
                            object.max = options.json && !isFinite(message.max) ? String(message.max) : message.max;
                            if (options.oneofs)
                                object._max = "max";
                        }
                        return object;
                    };

                    HistogramDataPoint.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return HistogramDataPoint;
                })();

                v1.ExponentialHistogramDataPoint = (function() {

                    function ExponentialHistogramDataPoint(properties) {
                        this.attributes = [];
                        this.exemplars = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    ExponentialHistogramDataPoint.prototype.attributes = $util.emptyArray;
                    ExponentialHistogramDataPoint.prototype.startTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    ExponentialHistogramDataPoint.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    ExponentialHistogramDataPoint.prototype.count = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    ExponentialHistogramDataPoint.prototype.sum = null;
                    ExponentialHistogramDataPoint.prototype.scale = 0;
                    ExponentialHistogramDataPoint.prototype.zeroCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    ExponentialHistogramDataPoint.prototype.positive = null;
                    ExponentialHistogramDataPoint.prototype.negative = null;
                    ExponentialHistogramDataPoint.prototype.flags = 0;
                    ExponentialHistogramDataPoint.prototype.exemplars = $util.emptyArray;
                    ExponentialHistogramDataPoint.prototype.min = null;
                    ExponentialHistogramDataPoint.prototype.max = null;
                    ExponentialHistogramDataPoint.prototype.zeroThreshold = 0;

                    let $oneOfFields;

                    Object.defineProperty(ExponentialHistogramDataPoint.prototype, "_sum", {
                        get: $util.oneOfGetter($oneOfFields = ["sum"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    Object.defineProperty(ExponentialHistogramDataPoint.prototype, "_min", {
                        get: $util.oneOfGetter($oneOfFields = ["min"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    Object.defineProperty(ExponentialHistogramDataPoint.prototype, "_max", {
                        get: $util.oneOfGetter($oneOfFields = ["max"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    ExponentialHistogramDataPoint.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.startTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 3: {
                                    message.timeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 4: {
                                    message.count = reader.fixed64();
                                    break;
                                }
                            case 5: {
                                    message.sum = reader.double();
                                    break;
                                }
                            case 6: {
                                    message.scale = reader.sint32();
                                    break;
                                }
                            case 7: {
                                    message.zeroCount = reader.fixed64();
                                    break;
                                }
                            case 8: {
                                    message.positive = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(reader, reader.uint32());
                                    break;
                                }
                            case 9: {
                                    message.negative = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(reader, reader.uint32());
                                    break;
                                }
                            case 10: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            case 11: {
                                    if (!(message.exemplars && message.exemplars.length))
                                        message.exemplars = [];
                                    message.exemplars.push($root.opentelemetry.proto.metrics.v1.Exemplar.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 12: {
                                    message.min = reader.double();
                                    break;
                                }
                            case 13: {
                                    message.max = reader.double();
                                    break;
                                }
                            case 14: {
                                    message.zeroThreshold = reader.double();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    ExponentialHistogramDataPoint.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint();
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.startTimeUnixNano != null)
                            if ($util.Long)
                                (message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
                            else if (typeof object.startTimeUnixNano === "string")
                                message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
                            else if (typeof object.startTimeUnixNano === "number")
                                message.startTimeUnixNano = object.startTimeUnixNano;
                            else if (typeof object.startTimeUnixNano === "object")
                                message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
                        if (object.timeUnixNano != null)
                            if ($util.Long)
                                (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                            else if (typeof object.timeUnixNano === "string")
                                message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                            else if (typeof object.timeUnixNano === "number")
                                message.timeUnixNano = object.timeUnixNano;
                            else if (typeof object.timeUnixNano === "object")
                                message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                        if (object.count != null)
                            if ($util.Long)
                                (message.count = $util.Long.fromValue(object.count)).unsigned = false;
                            else if (typeof object.count === "string")
                                message.count = parseInt(object.count, 10);
                            else if (typeof object.count === "number")
                                message.count = object.count;
                            else if (typeof object.count === "object")
                                message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber();
                        if (object.sum != null)
                            message.sum = Number(object.sum);
                        if (object.scale != null)
                            message.scale = object.scale | 0;
                        if (object.zeroCount != null)
                            if ($util.Long)
                                (message.zeroCount = $util.Long.fromValue(object.zeroCount)).unsigned = false;
                            else if (typeof object.zeroCount === "string")
                                message.zeroCount = parseInt(object.zeroCount, 10);
                            else if (typeof object.zeroCount === "number")
                                message.zeroCount = object.zeroCount;
                            else if (typeof object.zeroCount === "object")
                                message.zeroCount = new $util.LongBits(object.zeroCount.low >>> 0, object.zeroCount.high >>> 0).toNumber();
                        if (object.positive != null) {
                            if (typeof object.positive !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
                            message.positive = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(object.positive);
                        }
                        if (object.negative != null) {
                            if (typeof object.negative !== "object")
                                throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
                            message.negative = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(object.negative);
                        }
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.exemplars) {
                            if (!Array.isArray(object.exemplars))
                                throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
                            message.exemplars = [];
                            for (let i = 0; i < object.exemplars.length; ++i) {
                                if (typeof object.exemplars[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
                                message.exemplars[i] = $root.opentelemetry.proto.metrics.v1.Exemplar.fromObject(object.exemplars[i]);
                            }
                        }
                        if (object.min != null)
                            message.min = Number(object.min);
                        if (object.max != null)
                            message.max = Number(object.max);
                        if (object.zeroThreshold != null)
                            message.zeroThreshold = Number(object.zeroThreshold);
                        return message;
                    };

                    ExponentialHistogramDataPoint.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.attributes = [];
                            object.exemplars = [];
                        }
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.count = options.longs === String ? "0" : 0;
                            object.scale = 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.zeroCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.zeroCount = options.longs === String ? "0" : 0;
                            object.positive = null;
                            object.negative = null;
                            object.flags = 0;
                            object.zeroThreshold = 0;
                        }
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
                            if (typeof message.startTimeUnixNano === "number")
                                object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
                            else
                                object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
                        if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                            if (typeof message.timeUnixNano === "number")
                                object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                            else
                                object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                        if (message.count != null && message.hasOwnProperty("count"))
                            if (typeof message.count === "number")
                                object.count = options.longs === String ? String(message.count) : message.count;
                            else
                                object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber() : message.count;
                        if (message.sum != null && message.hasOwnProperty("sum")) {
                            object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
                            if (options.oneofs)
                                object._sum = "sum";
                        }
                        if (message.scale != null && message.hasOwnProperty("scale"))
                            object.scale = message.scale;
                        if (message.zeroCount != null && message.hasOwnProperty("zeroCount"))
                            if (typeof message.zeroCount === "number")
                                object.zeroCount = options.longs === String ? String(message.zeroCount) : message.zeroCount;
                            else
                                object.zeroCount = options.longs === String ? $util.Long.prototype.toString.call(message.zeroCount) : options.longs === Number ? new $util.LongBits(message.zeroCount.low >>> 0, message.zeroCount.high >>> 0).toNumber() : message.zeroCount;
                        if (message.positive != null && message.hasOwnProperty("positive"))
                            object.positive = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(message.positive, options);
                        if (message.negative != null && message.hasOwnProperty("negative"))
                            object.negative = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(message.negative, options);
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        if (message.exemplars && message.exemplars.length) {
                            object.exemplars = [];
                            for (let j = 0; j < message.exemplars.length; ++j)
                                object.exemplars[j] = $root.opentelemetry.proto.metrics.v1.Exemplar.toObject(message.exemplars[j], options);
                        }
                        if (message.min != null && message.hasOwnProperty("min")) {
                            object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
                            if (options.oneofs)
                                object._min = "min";
                        }
                        if (message.max != null && message.hasOwnProperty("max")) {
                            object.max = options.json && !isFinite(message.max) ? String(message.max) : message.max;
                            if (options.oneofs)
                                object._max = "max";
                        }
                        if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
                            object.zeroThreshold = options.json && !isFinite(message.zeroThreshold) ? String(message.zeroThreshold) : message.zeroThreshold;
                        return object;
                    };

                    ExponentialHistogramDataPoint.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    ExponentialHistogramDataPoint.Buckets = (function() {

                        function Buckets(properties) {
                            this.bucketCounts = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        Buckets.prototype.offset = 0;
                        Buckets.prototype.bucketCounts = $util.emptyArray;

                        Buckets.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.offset = reader.sint32();
                                        break;
                                    }
                                case 2: {
                                        if (!(message.bucketCounts && message.bucketCounts.length))
                                            message.bucketCounts = [];
                                        if ((tag & 7) === 2) {
                                            let end2 = reader.uint32() + reader.pos;
                                            while (reader.pos < end2)
                                                message.bucketCounts.push(reader.uint64());
                                        } else
                                            message.bucketCounts.push(reader.uint64());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        Buckets.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets)
                                return object;
                            let message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets();
                            if (object.offset != null)
                                message.offset = object.offset | 0;
                            if (object.bucketCounts) {
                                if (!Array.isArray(object.bucketCounts))
                                    throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
                                message.bucketCounts = [];
                                for (let i = 0; i < object.bucketCounts.length; ++i)
                                    if ($util.Long)
                                        (message.bucketCounts[i] = $util.Long.fromValue(object.bucketCounts[i])).unsigned = true;
                                    else if (typeof object.bucketCounts[i] === "string")
                                        message.bucketCounts[i] = parseInt(object.bucketCounts[i], 10);
                                    else if (typeof object.bucketCounts[i] === "number")
                                        message.bucketCounts[i] = object.bucketCounts[i];
                                    else if (typeof object.bucketCounts[i] === "object")
                                        message.bucketCounts[i] = new $util.LongBits(object.bucketCounts[i].low >>> 0, object.bucketCounts[i].high >>> 0).toNumber(true);
                            }
                            return message;
                        };

                        Buckets.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.bucketCounts = [];
                            if (options.defaults)
                                object.offset = 0;
                            if (message.offset != null && message.hasOwnProperty("offset"))
                                object.offset = message.offset;
                            if (message.bucketCounts && message.bucketCounts.length) {
                                object.bucketCounts = [];
                                for (let j = 0; j < message.bucketCounts.length; ++j)
                                    if (typeof message.bucketCounts[j] === "number")
                                        object.bucketCounts[j] = options.longs === String ? String(message.bucketCounts[j]) : message.bucketCounts[j];
                                    else
                                        object.bucketCounts[j] = options.longs === String ? $util.Long.prototype.toString.call(message.bucketCounts[j]) : options.longs === Number ? new $util.LongBits(message.bucketCounts[j].low >>> 0, message.bucketCounts[j].high >>> 0).toNumber(true) : message.bucketCounts[j];
                            }
                            return object;
                        };

                        Buckets.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return Buckets;
                    })();

                    return ExponentialHistogramDataPoint;
                })();

                v1.SummaryDataPoint = (function() {

                    function SummaryDataPoint(properties) {
                        this.attributes = [];
                        this.quantileValues = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    SummaryDataPoint.prototype.attributes = $util.emptyArray;
                    SummaryDataPoint.prototype.startTimeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    SummaryDataPoint.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    SummaryDataPoint.prototype.count = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    SummaryDataPoint.prototype.sum = 0;
                    SummaryDataPoint.prototype.quantileValues = $util.emptyArray;
                    SummaryDataPoint.prototype.flags = 0;

                    SummaryDataPoint.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 7: {
                                    if (!(message.attributes && message.attributes.length))
                                        message.attributes = [];
                                    message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.startTimeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 3: {
                                    message.timeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 4: {
                                    message.count = reader.fixed64();
                                    break;
                                }
                            case 5: {
                                    message.sum = reader.double();
                                    break;
                                }
                            case 6: {
                                    if (!(message.quantileValues && message.quantileValues.length))
                                        message.quantileValues = [];
                                    message.quantileValues.push($root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 8: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    SummaryDataPoint.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.SummaryDataPoint)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint();
                        if (object.attributes) {
                            if (!Array.isArray(object.attributes))
                                throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
                            message.attributes = [];
                            for (let i = 0; i < object.attributes.length; ++i) {
                                if (typeof object.attributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
                                message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
                            }
                        }
                        if (object.startTimeUnixNano != null)
                            if ($util.Long)
                                (message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
                            else if (typeof object.startTimeUnixNano === "string")
                                message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
                            else if (typeof object.startTimeUnixNano === "number")
                                message.startTimeUnixNano = object.startTimeUnixNano;
                            else if (typeof object.startTimeUnixNano === "object")
                                message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
                        if (object.timeUnixNano != null)
                            if ($util.Long)
                                (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                            else if (typeof object.timeUnixNano === "string")
                                message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                            else if (typeof object.timeUnixNano === "number")
                                message.timeUnixNano = object.timeUnixNano;
                            else if (typeof object.timeUnixNano === "object")
                                message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                        if (object.count != null)
                            if ($util.Long)
                                (message.count = $util.Long.fromValue(object.count)).unsigned = false;
                            else if (typeof object.count === "string")
                                message.count = parseInt(object.count, 10);
                            else if (typeof object.count === "number")
                                message.count = object.count;
                            else if (typeof object.count === "object")
                                message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber();
                        if (object.sum != null)
                            message.sum = Number(object.sum);
                        if (object.quantileValues) {
                            if (!Array.isArray(object.quantileValues))
                                throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
                            message.quantileValues = [];
                            for (let i = 0; i < object.quantileValues.length; ++i) {
                                if (typeof object.quantileValues[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
                                message.quantileValues[i] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(object.quantileValues[i]);
                            }
                        }
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        return message;
                    };

                    SummaryDataPoint.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.quantileValues = [];
                            object.attributes = [];
                        }
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeUnixNano = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.count = options.longs === String ? "0" : 0;
                            object.sum = 0;
                            object.flags = 0;
                        }
                        if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
                            if (typeof message.startTimeUnixNano === "number")
                                object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
                            else
                                object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
                        if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                            if (typeof message.timeUnixNano === "number")
                                object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                            else
                                object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                        if (message.count != null && message.hasOwnProperty("count"))
                            if (typeof message.count === "number")
                                object.count = options.longs === String ? String(message.count) : message.count;
                            else
                                object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber() : message.count;
                        if (message.sum != null && message.hasOwnProperty("sum"))
                            object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
                        if (message.quantileValues && message.quantileValues.length) {
                            object.quantileValues = [];
                            for (let j = 0; j < message.quantileValues.length; ++j)
                                object.quantileValues[j] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(message.quantileValues[j], options);
                        }
                        if (message.attributes && message.attributes.length) {
                            object.attributes = [];
                            for (let j = 0; j < message.attributes.length; ++j)
                                object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
                        }
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        return object;
                    };

                    SummaryDataPoint.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    SummaryDataPoint.ValueAtQuantile = (function() {

                        function ValueAtQuantile(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        ValueAtQuantile.prototype.quantile = 0;
                        ValueAtQuantile.prototype.value = 0;

                        ValueAtQuantile.decode = function decode(reader, length, error) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                if (tag === error)
                                    break;
                                switch (tag >>> 3) {
                                case 1: {
                                        message.quantile = reader.double();
                                        break;
                                    }
                                case 2: {
                                        message.value = reader.double();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        ValueAtQuantile.fromObject = function fromObject(object) {
                            if (object instanceof $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile)
                                return object;
                            let message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile();
                            if (object.quantile != null)
                                message.quantile = Number(object.quantile);
                            if (object.value != null)
                                message.value = Number(object.value);
                            return message;
                        };

                        ValueAtQuantile.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.quantile = 0;
                                object.value = 0;
                            }
                            if (message.quantile != null && message.hasOwnProperty("quantile"))
                                object.quantile = options.json && !isFinite(message.quantile) ? String(message.quantile) : message.quantile;
                            if (message.value != null && message.hasOwnProperty("value"))
                                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                            return object;
                        };

                        ValueAtQuantile.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return ValueAtQuantile;
                    })();

                    return SummaryDataPoint;
                })();

                v1.Exemplar = (function() {

                    function Exemplar(properties) {
                        this.filteredAttributes = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    Exemplar.prototype.filteredAttributes = $util.emptyArray;
                    Exemplar.prototype.timeUnixNano = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                    Exemplar.prototype.asDouble = null;
                    Exemplar.prototype.asInt = null;
                    Exemplar.prototype.spanId = $util.newBuffer([]);
                    Exemplar.prototype.traceId = $util.newBuffer([]);

                    let $oneOfFields;

                    Object.defineProperty(Exemplar.prototype, "value", {
                        get: $util.oneOfGetter($oneOfFields = ["asDouble", "asInt"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    Exemplar.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Exemplar();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 7: {
                                    if (!(message.filteredAttributes && message.filteredAttributes.length))
                                        message.filteredAttributes = [];
                                    message.filteredAttributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 2: {
                                    message.timeUnixNano = reader.fixed64();
                                    break;
                                }
                            case 3: {
                                    message.asDouble = reader.double();
                                    break;
                                }
                            case 6: {
                                    message.asInt = reader.sfixed64();
                                    break;
                                }
                            case 4: {
                                    message.spanId = reader.bytes();
                                    break;
                                }
                            case 5: {
                                    message.traceId = reader.bytes();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    Exemplar.fromObject = function fromObject(object) {
                        if (object instanceof $root.opentelemetry.proto.metrics.v1.Exemplar)
                            return object;
                        let message = new $root.opentelemetry.proto.metrics.v1.Exemplar();
                        if (object.filteredAttributes) {
                            if (!Array.isArray(object.filteredAttributes))
                                throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
                            message.filteredAttributes = [];
                            for (let i = 0; i < object.filteredAttributes.length; ++i) {
                                if (typeof object.filteredAttributes[i] !== "object")
                                    throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
                                message.filteredAttributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.filteredAttributes[i]);
                            }
                        }
                        if (object.timeUnixNano != null)
                            if ($util.Long)
                                (message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
                            else if (typeof object.timeUnixNano === "string")
                                message.timeUnixNano = parseInt(object.timeUnixNano, 10);
                            else if (typeof object.timeUnixNano === "number")
                                message.timeUnixNano = object.timeUnixNano;
                            else if (typeof object.timeUnixNano === "object")
                                message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
                        if (object.asDouble != null)
                            message.asDouble = Number(object.asDouble);
                        if (object.asInt != null)
                            if ($util.Long)
                                (message.asInt = $util.Long.fromValue(object.asInt)).unsigned = false;
                            else if (typeof object.asInt === "string")
                                message.asInt = parseInt(object.asInt, 10);
                            else if (typeof object.asInt === "number")
                                message.asInt = object.asInt;
                            else if (typeof object.asInt === "object")
                                message.asInt = new $util.LongBits(object.asInt.low >>> 0, object.asInt.high >>> 0).toNumber();
                        if (object.spanId != null)
                            if (typeof object.spanId === "string")
                                $util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
                            else if (object.spanId.length >= 0)
                                message.spanId = object.spanId;
                        if (object.traceId != null)
                            if (typeof object.traceId === "string")
                                $util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
                            else if (object.traceId.length >= 0)
                                message.traceId = object.traceId;
                        return message;
                    };

                    Exemplar.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.filteredAttributes = [];
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeUnixNano = options.longs === String ? "0" : 0;
                            if (options.bytes === String)
                                object.spanId = "";
                            else {
                                object.spanId = [];
                                if (options.bytes !== Array)
                                    object.spanId = $util.newBuffer(object.spanId);
                            }
                            if (options.bytes === String)
                                object.traceId = "";
                            else {
                                object.traceId = [];
                                if (options.bytes !== Array)
                                    object.traceId = $util.newBuffer(object.traceId);
                            }
                        }
                        if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
                            if (typeof message.timeUnixNano === "number")
                                object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
                            else
                                object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
                        if (message.asDouble != null && message.hasOwnProperty("asDouble")) {
                            object.asDouble = options.json && !isFinite(message.asDouble) ? String(message.asDouble) : message.asDouble;
                            if (options.oneofs)
                                object.value = "asDouble";
                        }
                        if (message.spanId != null && message.hasOwnProperty("spanId"))
                            object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
                        if (message.traceId != null && message.hasOwnProperty("traceId"))
                            object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
                        if (message.asInt != null && message.hasOwnProperty("asInt")) {
                            if (typeof message.asInt === "number")
                                object.asInt = options.longs === String ? String(message.asInt) : message.asInt;
                            else
                                object.asInt = options.longs === String ? $util.Long.prototype.toString.call(message.asInt) : options.longs === Number ? new $util.LongBits(message.asInt.low >>> 0, message.asInt.high >>> 0).toNumber() : message.asInt;
                            if (options.oneofs)
                                object.value = "asInt";
                        }
                        if (message.filteredAttributes && message.filteredAttributes.length) {
                            object.filteredAttributes = [];
                            for (let j = 0; j < message.filteredAttributes.length; ++j)
                                object.filteredAttributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.filteredAttributes[j], options);
                        }
                        return object;
                    };

                    Exemplar.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Exemplar;
                })();

                return v1;
            })();

            return metrics;
        })();

        return proto;
    })();

    return opentelemetry;
})();

export { $root as default };
