export class SystemPromptBuilder {
  private role = '';
  private context: string[] = [];
  private constraints: string[] = [];
  private examples: Array<{ input: string; output: string }> = [];
  private outputFormat = '';

  setRole(role: string): this {
    this.role = role;
    return this;
  }

  addContext(ctx: string): this {
    this.context.push(ctx);
    return this;
  }

  addConstraint(constraint: string): this {
    this.constraints.push(constraint);
    return this;
  }

  addExample(input: string, output: string): this {
    this.examples.push({ input, output });
    return this;
  }

  setOutputFormat(format: string): this {
    this.outputFormat = format;
    return this;
  }

  build(): string {
    const sections: string[] = [];

    if (this.role) {
      sections.push(`# ROLE\n${this.role}`);
    }

    if (this.context.length > 0) {
      sections.push(`# CONTEXT\n${this.context.join('\n')}`);
    }

    if (this.constraints.length > 0) {
      sections.push(`# CONSTRAINTS\n${this.constraints.map((c) => `- ${c}`).join('\n')}`);
    }

    if (this.outputFormat) {
      sections.push(`# OUTPUT FORMAT\n${this.outputFormat}`);
    }

    if (this.examples.length > 0) {
      const exStr = this.examples
        .map((ex, i) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}`)
        .join('\n\n');
      sections.push(`# EXAMPLES\n${exStr}`);
    }

    return sections.join('\n\n');
  }
}
