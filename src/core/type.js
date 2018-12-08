export const SourceLocation  = function(){
  
}
export const Position  = function(){
  
}
export const Token = function(){
  
}
export const Identifier = function(){
  
}
export const Literal = function(){
  
}

export const RegExpLiteral = function(){
  
}
export const Programs = function(){
  
}
export const Functions = function(type, params, context, treeno, symbol){
  this.type = type;
  this.params = params;
  this.context = context;
  this.treeno = treeno;
  this.lineno = symbol.l;
  this.index = symbol.i;
  return this;
}
export const Statement = function(type, body, block, treeno, symbol){
  this.type = type;
  this.body = body;
  this.block = block;
  this.treeno = treeno;
  this.lineno = symbol.l;
  this.index = symbol.i;
}
export const ExpressionStatement = function(){

  
}

export const EmptyStatement = function(){

  
}

export const DebuggerStatement = function(){

  
}
export const WithStatement = function(){

  
}
export const ReturnStatement = function(){

  
}
export const LabeledStatement = function(){

  
}
export const BreakStatement = function(){

  
}
export const ContinueStatement = function(){

  
}
export const IfStatement = function(){

  
}
export const SwitchStatement = function(){

  
}
export const SwitchCase = function(){

  
}
export const ThrowStatement = function(){

  
}
export const TryStatement = function(){

  
}
export const CatchClause = function(){

  
}
export const WhileStatement = function(){

  
}
export const DoWhileStatement = function(){

  
}

export const ForInStatement = function(){

  
}
export const Declarations = function(){

  
}
export const FunctionDeclaration = function(){

  
}


export const VariableDeclaration = function(){

  
}


export const VariableDeclarator = function(){

  

}

export const Expressions = function(){

}

export const ThisExpression = function(){

  
}
export const ArrayExpression = function(){

  
}
export const ObjectExpression = function(){

  
}

export const Property = function(){

  
}

export const FunctionExpression = function(){

  
}

export const UnaryExpression = function(){

  
}
export const UpdateOperator = function(){

  
}
export const BinaryExpression = function(){

  
}
export const AssignmentExpression = function(){

  
}
export const AssignmentOperator = function(){

  
}

export const MemberExpression = function(){

  
}
export const ConditionalExpression = function(){

  
}
export const NewExpression = function(){

  
}
export const SequenceExpression = function(){

}
export const BlockStatement = function(){

}
export const Block = function(){

}

export default {
  SourceLocation,
  Position,
  Block,
  BlockStatement,
  Token,
  Identifier,
  Literal,
  RegExpLiteral,
  Programs,
  Functions,
  Statement,
  ExpressionStatement,
  EmptyStatement,
  DebuggerStatement,
  WithStatement,
  ReturnStatement,
  LabeledStatement,
  BreakStatement,
  ContinueStatement,
  IfStatement,
  SwitchStatement,
  SwitchCase,
  ThrowStatement,
  TryStatement,
  CatchClause,
  WhileStatement,
  DoWhileStatement,
  ForInStatement,
  Declarations,
  FunctionDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  Expressions,
  ThisExpression,
  ArrayExpression,
  ObjectExpression,
  Property,
  FunctionExpression,
  UnaryExpression,
  UpdateOperator,
  BinaryExpression,
  AssignmentExpression,
  AssignmentOperator,
  MemberExpression,
  ConditionalExpression,
  NewExpression,
  SequenceExpression
}
