// import { declare } from "@babel/helper-plugin-utils";

function setArgument(position, idx, newArguments, paramName) {
  if (newArguments[idx] !== undefined) {
    throw new Error(`${paramName} is already defined with value ${newArguments[idx]}`);
  }
};

module.exports = function({ types: t }) {
  return {
    name: 'Named Parameters to Positional Parameters',
    visitor: {
     CallExpression(path, state) {
      const currentArguments = path.node.arguments;
      const declaration = path.scope.bindings[path.node.callee.name];
      if (declaration) {
        const params = declaration.path.node.params;
        const paramsPostion = [];
        params.forEach(p => {
          paramsPostion.push(p.name);
        });

        const newArguments = [].fill(params.length);

        currentArguments.forEach((arg, idx) => {
          if (t.isAssignmentExpression(arg) && t.isIdentifier(arg.left.node)) {
            setArgument(arg.right.node.value, paramsPostion.indexOf(arg.left.node.name), newArguments, arg.left.node.name);
          } else {
            setArgument(arg, idx, newArguments, paramsPostion[idx].name);
          }
        });
       }
     }
    }
  };
};
