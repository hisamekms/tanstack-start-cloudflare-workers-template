export interface Command<TCommandType extends string = string> {
  readonly commandType: TCommandType;
}
