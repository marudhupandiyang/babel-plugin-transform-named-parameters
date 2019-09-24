// import { declare } from "@babel/helper-plugin-utils";

function setArgument(value, idx, newArguments, paramName) {
  if (newArguments[idx] !== undefined) {
    throw new Error(`${paramName} is already defined with value ${newArguments[idx]}`);
  }

  if (idx > newArguments.length) {
    throw new Error(`No such argument named ${paramName} is present.`);
  }

  newArguments[idx] = new value.constructor();
  newArguments[idx].type = value.type;
  newArguments[idx].value = value.value;
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

        const newArguments = [];
        newArguments.length = paramsPostion.length;

        currentArguments.forEach((arg, idx) => {
          if (t.isAssignmentExpression(arg) && t.isIdentifier(arg.left)) {
            setArgument(arg.right, paramsPostion.indexOf(arg.left.name), newArguments, arg.left.name);
          } else {
            setArgument(arg, idx, newArguments, paramsPostion[idx].name);
          }
        });

        path.node.arguments = newArguments;
       }
     }
    }
  };
};
