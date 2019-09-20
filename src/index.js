import { declare } from "@babel/helper-plugin-utils";
// import convertFunctionParams from "./params";
// import convertFunctionRest from "./rest";

export default declare((api, options) => {
  api.assertVersion(7);

  const { loose } = options;
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.arguments.length === 1 &&
          path.node.arguments[0].type === 'ObjectExpression') {
          const scopeBindings = path.scope.bindings;
          const functionName = path.node.callee.name;
          const bindingRef = scopeBindings[functionName]


          console.log(functionName, bindingRef);

          if (bindingRef && bindingRef.path.node.type === 'FunctionDeclaration') {
            const params = bindingRef.params;

            const sentArgs = {};
            path.node.arguments[0].properties.forEach((a) => {
              sentArgs[a.key.name] = {
                value: a.value.value,
                type: a.value.type,
              };
            });

            let newArguments = [];
            params.forEach((p) => {
              const curArg = sentArgs[p.name];
              if (curArg) {
                const obj = new this[curArg.type](curArg.value);
                newArguments.push(obj);
              }
            });

            console.log(newArguments);
          }
        }
      },
    },
  };
});
