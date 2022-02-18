/**
 * Generate module
 *
 * @packageDocumentation
 */
export declare const process_params: {
    urn_command: string;
    urn_base_schema: string;
    urn_output_dir: string;
};
export declare function schema(): string;
export declare function schema_and_save(): void;
export declare function save_schema(text: string): void;
export declare function init(): void;
